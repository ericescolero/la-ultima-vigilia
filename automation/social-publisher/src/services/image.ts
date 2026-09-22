import type { Env } from '../types';

export async function generateAndStoreImage(
  env: Env,
  prompt: string,
  subjectReferenceKey?: string,
  styleReferenceKey?: string,
): Promise<{ key: string; url: string; referencesUsed: string[] }> {
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

  const bytes = base64ToBytes(base64);
  const now = new Date();
  const key = `posts/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${crypto.randomUUID()}.jpg`;

  await env.MEDIA.put(key, bytes, {
    httpMetadata: {
      contentType: 'image/jpeg',
      cacheControl: 'public, max-age=31536000, immutable',
    },
    customMetadata: {
      generatedBy: env.IMAGE_MODEL,
      referencesUsed: referencesUsed.join(','),
    },
  });

  const base = env.PUBLIC_MEDIA_BASE_URL.replace(/\/$/, '');
  return {
    key,
    url: `${base}/${key}`,
    referencesUsed,
  };
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
