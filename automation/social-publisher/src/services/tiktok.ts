import type { Env } from '../types';
import type { PlatformResult } from './meta';

export async function uploadTikTokPhotoDraft(
  env: Env,
  imageUrl: string,
  title: string,
  description: string,
): Promise<PlatformResult> {
  if (!env.TIKTOK_ACCESS_TOKEN) throw new Error('TIKTOK_ACCESS_TOKEN is not configured');

  const body = {
    post_info: {
      title: title.slice(0, 90),
      description,
    },
    source_info: {
      source: 'PULL_FROM_URL',
      photo_cover_index: 0,
      photo_images: [imageUrl],
    },
    post_mode: 'MEDIA_UPLOAD',
    media_type: 'PHOTO',
    is_aigc: true,
  };

  const res = await fetch('https://open.tiktokapis.com/v2/post/publish/content/init/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.TIKTOK_ACCESS_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(body),
  });

  const json = await res.json() as any;
  if (!res.ok || json?.error?.code !== 'ok') {
    throw new Error(`TikTok upload failed: ${JSON.stringify(json)}`);
  }

  return { id: json?.data?.publish_id, raw: json };
}
