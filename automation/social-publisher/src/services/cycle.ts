import type { Env } from '../types';
import {
  createQueueItem,
  getContentItemById,
  getQueueRow,
  markContentUsed,
  markGenerating,
  markQueueStatus,
  saveGenerationDraft,
  saveGeneratedPost,
  selectNextContent,
} from '../db/queries';
import { generatePostPackage } from './ai';
import { generateAndStoreImage } from './image';
import { buildCanonicalImagePlan } from './promptBuilder';
import { publishQueueItem } from './publisher';

export async function runContentCycle(
  env: Env,
  triggerName: string,
  scheduledFor = new Date().toISOString(),
  contentItemId?: number,
): Promise<{ queueId: number; contentItemId: number; autoPublished: boolean; duplicate: boolean }> {
  const item = contentItemId
    ? await getContentItemById(env.DB, contentItemId)
    : await selectNextContent(env.DB);

  if (!item) {
    throw new Error(
      contentItemId
        ? `Active content item not found: ${contentItemId}`
        : 'No active content items found',
    );
  }

  const queue = await createQueueItem(env.DB, item.id, triggerName, scheduledFor);
  if (!queue.created) {
    return { queueId: queue.id, contentItemId: item.id, autoPublished: false, duplicate: true };
  }

  const queueId = queue.id;
  await markGenerating(env.DB, queueId);

  try {
    const generated = await generatePostPackage(env, item);
    const imagePlan = buildCanonicalImagePlan(item, generated);

    await saveGenerationDraft(
      env.DB,
      queueId,
      generated,
      imagePlan.prompt,
    );

    const image = await generateAndStoreImage(
      env,
      imagePlan.prompt,
      imagePlan.subjectReferenceKey,
      imagePlan.styleReferenceKey,
    );

    await saveGeneratedPost(
      env.DB,
      queueId,
      generated,
      imagePlan.prompt,
      image.key,
      image.url,
    );
    await markContentUsed(env.DB, item.id);

    console.log('Image generated', {
      queueId,
      profile: imagePlan.profile.key,
      referencesUsed: image.referencesUsed,
      fallbackMode: image.fallbackMode,
    });

    const autoPublish = env.AUTO_PUBLISH.toLowerCase() === 'true';

    if (autoPublish) {
      const row = await getQueueRow(env.DB, queueId);
      if (!row) throw new Error('Generated queue row not found');
      await publishQueueItem(env, row);
    }

    return {
      queueId,
      contentItemId: item.id,
      autoPublished: autoPublish,
      duplicate: false,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await markQueueStatus(env.DB, queueId, 'failed', message);
    throw error;
  }
}
