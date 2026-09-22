import type { Env } from '../types';

export async function generateAndStoreImage(
  env: Env,
  prompt: string,
): Promise<{ key: string; url: string }> {
  const response = await env.AI.run(env.IMAGE_MODEL as any, {
    prompt: prompt.slice(0, 4000),
    width: 1080,
    height: 1350,
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
    },
  });

  const base = env.PUBLIC_MEDIA_BASE_URL.replace(/\/$/, '');
  return { key, url: `${base}/${key}` };
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}
