import type { Env } from '../types';
import {
  createQueueItem,
  getQueueRow,
  markContentUsed,
  markGenerating,
  markQueueStatus,
  saveGeneratedPost,
  selectNextContent,
} from '../db/queries';
import { generatePostPackage } from './ai';
import { generateAndStoreImage } from './image';
import { publishQueueItem } from './publisher';

export async function runContentCycle(
  env: Env,
  triggerName: string,
  scheduledFor = new Date().toISOString(),
): Promise<{ queueId: number; autoPublished: boolean; duplicate: boolean }> {
  const item = await selectNextContent(env.DB);
  if (!item) throw new Error('No active content items found');

  const queue = await createQueueItem(env.DB, item.id, triggerName, scheduledFor);
  if (!queue.created) {
    return { queueId: queue.id, autoPublished: false, duplicate: true };
  }

  const queueId = queue.id;
  await markGenerating(env.DB, queueId);

  try {
    const generated = await generatePostPackage(env, item);
    const image = await generateAndStoreImage(env, generated.image_prompt);

    await saveGeneratedPost(env.DB, queueId, generated, image.key, image.url);
    await markContentUsed(env.DB, item.id);

    const autoPublish = env.AUTO_PUBLISH.toLowerCase() === 'true';

    if (autoPublish) {
      const row = await getQueueRow(env.DB, queueId);
      if (!row) throw new Error('Generated queue row not found');
      await publishQueueItem(env, row);
    }

    return { queueId, autoPublished: autoPublish, duplicate: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await markQueueStatus(env.DB, queueId, 'failed', message);
    throw error;
  }
}
