import type { ContentItem, GeneratedPost, QueueRow } from '../types';

export async function selectNextContent(db: D1Database): Promise<ContentItem | null> {
  return (await db.prepare(`
    SELECT id, source_type, archetype, enemy_force, battlefield, theme, source_text,
           times_used, last_used_at
    FROM content_items
    WHERE status = 'active'
    ORDER BY times_used ASC,
             COALESCE(last_used_at, '1970-01-01T00:00:00Z') ASC,
             RANDOM()
    LIMIT 1
  `).first<ContentItem>()) ?? null;
}

export async function createQueueItem(
  db: D1Database,
  contentItemId: number,
  triggerName: string,
  scheduledFor: string,
): Promise<{ id: number; created: boolean }> {
  const existing = await db.prepare(`
    SELECT id FROM publish_queue
    WHERE trigger_name = ? AND scheduled_for = ?
    LIMIT 1
  `).bind(triggerName, scheduledFor).first<{ id: number }>();

  if (existing) return { id: existing.id, created: false };

  const result = await db.prepare(`
    INSERT INTO publish_queue(content_item_id, trigger_name, scheduled_for, status)
    VALUES (?, ?, ?, 'pending')
  `).bind(contentItemId, triggerName, scheduledFor).run();

  return { id: Number(result.meta.last_row_id), created: true };
}

export async function markGenerating(db: D1Database, queueId: number): Promise<void> {
  await db.prepare(`
    UPDATE publish_queue
    SET status = 'generating', attempts = attempts + 1, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(queueId).run();
}

export async function saveGeneratedPost(
  db: D1Database,
  queueId: number,
  post: GeneratedPost,
  imageKey: string,
  imageUrl: string,
): Promise<void> {
  await db.prepare(`
    UPDATE publish_queue SET
      status = 'ready',
      hook = ?,
      quote_text = ?,
      instagram_caption = ?,
      facebook_caption = ?,
      tiktok_title = ?,
      tiktok_description = ?,
      hashtags_json = ?,
      image_prompt = ?,
      image_key = ?,
      image_url = ?,
      last_error = NULL,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    post.hook,
    post.quote_text,
    post.instagram_caption,
    post.facebook_caption,
    post.tiktok_title,
    post.tiktok_description,
    JSON.stringify(post.hashtags),
    post.image_prompt,
    imageKey,
    imageUrl,
    queueId,
  ).run();
}

export async function markContentUsed(db: D1Database, contentItemId: number): Promise<void> {
  await db.prepare(`
    UPDATE content_items
    SET times_used = times_used + 1,
        last_used_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(contentItemId).run();
}

export async function markQueueStatus(
  db: D1Database,
  queueId: number,
  status: 'publishing' | 'published' | 'failed',
  error?: string,
): Promise<void> {
  await db.prepare(`
    UPDATE publish_queue
    SET status = ?, last_error = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(status, error ?? null, queueId).run();
}

export async function getQueueRow(db: D1Database, queueId: number): Promise<QueueRow | null> {
  return (await db.prepare(`SELECT * FROM publish_queue WHERE id = ?`)
    .bind(queueId)
    .first<QueueRow>()) ?? null;
}

export async function addPublishLog(
  db: D1Database,
  queueId: number,
  platform: 'facebook' | 'instagram' | 'tiktok',
  status: 'success' | 'failed' | 'skipped',
  externalId?: string,
  responseBody?: unknown,
  error?: string,
): Promise<void> {
  await db.prepare(`
    INSERT INTO publish_logs(queue_id, platform, status, external_id, response_body, error)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    queueId,
    platform,
    status,
    externalId ?? null,
    responseBody == null ? null : JSON.stringify(responseBody),
    error ?? null,
  ).run();
}
