import type { Env } from '../types';

export interface GeneratedImageResult {
  key: string;
  url: string;
  referencesUsed: string[];
  fallbackMode: 'none' | 'safe-retry' | 'text-only-after-3030';
}

const SAFE_RETRY_SUFFIX = `
SAFETY-SAFE RENDERING OVERRIDE
Keep the scene nonviolent and suitable for a general audience.
All human subjects are adults and fully clothed.
No blood, wounds, injury, weapons, sexual content, nudity, threatening animal attack,
graphic distress, public-figure likeness, copyrighted-character imitation or shocking imagery.
Preserve the requested identity, atmosphere and symbolism through posture, weather,
environment, distance and cinematic light rather than explicit danger.
`.trim();

export async function generateAndStoreImage(
  env: Env,
  prompt: string,
  subjectReferenceKey?: string,
  styleReferenceKey?: string,
): Promise<GeneratedImageResult> {
  let result: Awaited<ReturnType<typeof runImageAttempt>>;
  let fallbackMode: GeneratedImageResult['fallbackMode'] = 'none';

  try {
    result = await runImageAttempt(
      env,
      prompt,
      subjectReferenceKey,
      styleReferenceKey,
    );
  } catch (error) {
    if (!isOutputFlag(error)) throw error;

    console.warn('Image output flagged; retrying with safety-grounded prompt', {
      subjectReferenceKey,
      styleReferenceKey,
      error: errorMessage(error),
    });

    const safePrompt = `${sanitizeForSafeRetry(prompt)}\n\n${SAFE_RETRY_SUFFIX}`;

    try {
      result = await runImageAttempt(
        env,
        safePrompt,
        subjectReferenceKey,
        styleReferenceKey,
      );
      fallbackMode = 'safe-retry';
    } catch (retryError) {
      if (!isOutputFlag(retryError)) throw retryError;

      console.warn('Referenced image retry also flagged; falling back to text-only generation', {
        subjectReferenceKey,
        styleReferenceKey,
        error: errorMessage(retryError),
      });

      result = await runImageAttempt(env, safePrompt);
      fallbackMode = 'text-only-after-3030';
    }
  }

  const bytes = base64ToBytes(result.base64);
  const now = new Date();
  const key = `posts/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${crypto.randomUUID()}.jpg`;

  await env.MEDIA.put(key, bytes, {
    httpMetadata: {
      contentType: 'image/jpeg',
      cacheControl: 'public, max-age=31536000, immutable',
    },
    customMetadata: {
      generatedBy: env.IMAGE_MODEL,
      referencesUsed: result.referencesUsed.join(','),
      fallbackMode,
    },
  });

  const base = env.PUBLIC_MEDIA_BASE_URL.replace(/\/$/, '');
  return {
    key,
    url: `${base}/${key}`,
    referencesUsed: result.referencesUsed,
    fallbackMode,
  };
}

async function runImageAttempt(
  env: Env,
  prompt: string,
  subjectReferenceKey?: string,
  styleReferenceKey?: string,
): Promise<{ base64: string; referencesUsed: string[] }> {
  const form = new FormData();
  form.append('prompt', prompt.slice(0, 12000));
  form.append('width', '1080');
  form.append('height', '1350');
  form.append('guidance', '4');

  const referencesUsed: string[] = [];

  if (subjectReferenceKey) {
    const used = await appendR2Reference(
      env.MEDIA,
      form,
      'input_image_0',
      subjectReferenceKey,
    );
    if (used) referencesUsed.push(subjectReferenceKey);
  }

  if (styleReferenceKey) {
    const used = await appendR2Reference(
      env.MEDIA,
      form,
      'input_image_1',
      styleReferenceKey,
    );
    if (used) referencesUsed.push(styleReferenceKey);
  }

  const formResponse = new Response(form);
  const formStream = formResponse.body;
  const formContentType = formResponse.headers.get('content-type');

  if (!formStream || !formContentType) {
    throw new Error('Could not serialize image-generation form data');
  }

  const response = await env.AI.run(env.IMAGE_MODEL as any, {
    multipart: {
      body: formStream,
      contentType: formContentType,
    },
  } as any) as any;

  const base64 = response?.image;
  if (!base64 || typeof base64 !== 'string') {
    throw new Error('Image model returned no base64 image');
  }

  return { base64, referencesUsed };
}

async function appendR2Reference(
  bucket: R2Bucket,
  form: FormData,
  fieldName: string,
  key: string,
): Promise<boolean> {
  const object = await bucket.get(key);
  if (!object) return false;

  const bytes = await object.arrayBuffer();
  const contentType = object.httpMetadata?.contentType || inferContentType(key);
  const filename = key.split('/').pop() || `${fieldName}.png`;

  form.append(
    fieldName,
    new Blob([bytes], { type: contentType }),
    filename,
  );

  return true;
}

function sanitizeForSafeRetry(prompt: string): string {
  return prompt
    .replace(/at the edge of (?:a |the )?(?:frozen )?cliff/gi, 'on a broad snowy overlook with secure ground')
    .replace(/standing at the edge of (?:a |the )?(?:frozen )?cliff/gi, 'standing on a broad snowy overlook with secure ground')
    .replace(/cliff edge/gi, 'broad mountain overlook')
    .replace(/edge of the cliff/gi, 'broad mountain overlook')
    .replace(/edge of a cliff/gi, 'broad mountain overlook')
    .replace(/borde de (?:un |una |el |la )?(?:acantilado|azotea|puente)/gi, 'zona amplia y segura')
    .replace(/battle-worn/gi, 'weathered')
    .replace(/massive black wolf/gi, 'large calm black wolf')
    .replace(/angelic companion sent by God/gi, 'calm vigilant companion');
}

function isOutputFlag(error: unknown): boolean {
  const message = errorMessage(error).toLowerCase();
  return (
    message.includes('3030') ||
    message.includes('output has been flagged') ||
    message.includes('prompt / input image combination')
  );
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function inferContentType(key: string): string {
  const lower = key.toLowerCase();
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/png';
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}
