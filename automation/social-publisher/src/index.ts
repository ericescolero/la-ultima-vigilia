import type { Env } from './types';
import { runContentCycle } from './services/cycle';
import { getQueueRow } from './db/queries';
import { publishQueueItem } from './services/publisher';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/health') {
      return json({
        ok: true,
        service: 'watchman-social-automation',
        now: new Date().toISOString(),
      });
    }

    if (request.method === 'GET' && url.pathname.startsWith('/media/')) {
      const key = decodeURIComponent(url.pathname.slice('/media/'.length));
      const object = await env.MEDIA.get(key);

      if (!object) return new Response('Not found', { status: 404 });

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      headers.set('cache-control', 'public, max-age=31536000, immutable');

      return new Response(object.body, { headers });
    }

    if (url.pathname.startsWith('/admin/')) {
      if (!isAuthorized(request, env)) return json({ error: 'unauthorized' }, 401);

      if (request.method === 'POST' && url.pathname === '/admin/run-now') {
        try {
          const result = await runContentCycle(env, 'manual');
          return json({ ok: true, ...result });
        } catch (error) {
          return json({ ok: false, error: errorMessage(error) }, 500);
        }
      }

      const publishMatch = url.pathname.match(/^\/admin\/publish\/(\d+)$/);
      if (request.method === 'POST' && publishMatch) {
        const queueId = Number(publishMatch[1]);
        const row = await getQueueRow(env.DB, queueId);

        if (!row) return json({ error: 'queue item not found' }, 404);

        try {
          await publishQueueItem(env, row);
          return json({ ok: true, queueId });
        } catch (error) {
          return json({ ok: false, queueId, error: errorMessage(error) }, 500);
        }
      }

      if (request.method === 'GET' && url.pathname === '/admin/queue') {
        const result = await env.DB.prepare(`
          SELECT
            q.id,
            q.content_item_id,
            c.archetype,
            c.enemy_force,
            c.battlefield,
            c.theme,
            q.trigger_name,
            q.scheduled_for,
            q.status,
            q.hook,
            q.quote_text,
            q.image_prompt,
            q.image_url,
            q.attempts,
            q.last_error,
            q.created_at,
            q.updated_at
          FROM publish_queue q
          JOIN content_items c ON c.id = q.content_item_id
          ORDER BY q.id DESC
          LIMIT 50
        `).all();

        return json({ ok: true, rows: result.results });
      }

      if (request.method === 'GET' && url.pathname === '/admin/logs') {
        const result = await env.DB.prepare(`
          SELECT * FROM publish_logs ORDER BY id DESC LIMIT 100
        `).all();

        return json({ ok: true, rows: result.results });
      }
    }

    return json({
      service: 'watchman-social-automation',
      endpoints: [
        '/health',
        '/media/*',
        '/admin/run-now',
        '/admin/publish/:id',
        '/admin/queue',
        '/admin/logs',
      ],
    });
  },

  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<void> {
    const trigger =
      controller.cron === '0 14 * * *'
        ? 'morning'
        : controller.cron === '0 1 * * *'
          ? 'evening'
          : controller.cron;

    ctx.waitUntil(
      runContentCycle(env, trigger, new Date(controller.scheduledTime).toISOString())
        .then((result) => console.log('Scheduled cycle complete', result))
        .catch((error) => console.error('Scheduled cycle failed', error)),
    );
  },
} satisfies ExportedHandler<Env>;

function isAuthorized(request: Request, env: Env): boolean {
  const auth = request.headers.get('authorization');
  return Boolean(env.ADMIN_TOKEN && auth === `Bearer ${env.ADMIN_TOKEN}`);
}

function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: { 'cache-control': 'no-store' },
  });
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
