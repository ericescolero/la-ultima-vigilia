import type { Env, QueueRow } from '../types';
import { addPublishLog, markQueueStatus } from '../db/queries';
import { publishFacebookPhoto, publishInstagramPhoto } from './meta';
import { uploadTikTokPhotoDraft } from './tiktok';

type Platform = 'facebook' | 'instagram' | 'tiktok';

export async function publishQueueItem(env: Env, row: QueueRow): Promise<void> {
  if (!row.image_url) throw new Error('Queue item has no image URL');

  await markQueueStatus(env.DB, row.id, 'publishing');

  const hashtags = safeHashtags(row.hashtags_json);
  const suffix = hashtags.join(' ');

  const fbCaption = [row.facebook_caption, suffix].filter(Boolean).join('\n\n');
  const igCaption = [row.instagram_caption, suffix].filter(Boolean).join('\n\n');
  const ttDescription = [row.tiktok_description, suffix].filter(Boolean).join('\n\n');

  const enabled = {
    facebook: isTrue(env.ENABLE_FACEBOOK),
    instagram: isTrue(env.ENABLE_INSTAGRAM),
    tiktok: isTrue(env.ENABLE_TIKTOK),
  } satisfies Record<Platform, boolean>;

  const enabledCount = Object.values(enabled).filter(Boolean).length;
  if (enabledCount === 0) {
    await markQueueStatus(env.DB, row.id, 'failed', 'No publishing platforms are enabled');
    throw new Error('No publishing platforms are enabled');
  }

  let failures = 0;

  if (enabled.facebook) {
    failures += await attempt(env, row.id, 'facebook', async () =>
      publishFacebookPhoto(env, row.image_url!, fbCaption));
  } else {
    await addPublishLog(env.DB, row.id, 'facebook', 'skipped', undefined, { reason: 'disabled' });
  }

  if (enabled.instagram) {
    failures += await attempt(env, row.id, 'instagram', async () =>
      publishInstagramPhoto(env, row.image_url!, igCaption));
  } else {
    await addPublishLog(env.DB, row.id, 'instagram', 'skipped', undefined, { reason: 'disabled' });
  }

  if (enabled.tiktok) {
    failures += await attempt(env, row.id, 'tiktok', async () =>
      uploadTikTokPhotoDraft(env, row.image_url!, row.tiktok_title ?? '', ttDescription));
  } else {
    await addPublishLog(env.DB, row.id, 'tiktok', 'skipped', undefined, { reason: 'disabled' });
  }

  if (failures > 0) {
    await markQueueStatus(env.DB, row.id, 'failed', `${failures} enabled platform(s) failed`);
    throw new Error(`${failures} enabled platform(s) failed`);
  }

  await markQueueStatus(env.DB, row.id, 'published');
}

async function attempt(
  env: Env,
  queueId: number,
  platform: Platform,
  fn: () => Promise<{ id?: string; raw: unknown }>,
): Promise<number> {
  try {
    const result = await fn();
    await addPublishLog(env.DB, queueId, platform, 'success', result.id, result.raw);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await addPublishLog(env.DB, queueId, platform, 'failed', undefined, undefined, message);
    return 1;
  }
}

function safeHashtags(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value.slice(0, 5).map(String) : [];
  } catch {
    return [];
  }
}

function isTrue(value: string | undefined): boolean {
  return value?.toLowerCase() === 'true';
}
