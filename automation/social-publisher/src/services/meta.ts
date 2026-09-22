import type { Env } from '../types';

export interface PlatformResult {
  id?: string;
  raw: unknown;
}

function requireMeta(env: Env): asserts env is Env & {
  META_PAGE_ID: string;
  IG_USER_ID: string;
  META_PAGE_ACCESS_TOKEN: string;
} {
  if (!env.META_PAGE_ID || !env.IG_USER_ID || !env.META_PAGE_ACCESS_TOKEN) {
    throw new Error('Meta secrets/IDs are not configured');
  }
}

export async function publishFacebookPhoto(
  env: Env,
  imageUrl: string,
  caption: string,
): Promise<PlatformResult> {
  requireMeta(env);

  const endpoint = `https://graph.facebook.com/${env.META_GRAPH_VERSION}/${env.META_PAGE_ID}/photos`;
  const body = new URLSearchParams({
    url: imageUrl,
    message: caption,
    published: 'true',
    access_token: env.META_PAGE_ACCESS_TOKEN,
  });

  const res = await fetch(endpoint, { method: 'POST', body });
  const json = await res.json() as any;
  if (!res.ok || json.error) throw new Error(`Facebook publish failed: ${JSON.stringify(json)}`);

  return { id: json.id ?? json.post_id, raw: json };
}

export async function publishInstagramPhoto(
  env: Env,
  imageUrl: string,
  caption: string,
): Promise<PlatformResult> {
  requireMeta(env);

  const base = `https://graph.facebook.com/${env.META_GRAPH_VERSION}`;

  const createBody = new URLSearchParams({
    image_url: imageUrl,
    caption,
    access_token: env.META_PAGE_ACCESS_TOKEN,
  });

  const createRes = await fetch(`${base}/${env.IG_USER_ID}/media`, {
    method: 'POST',
    body: createBody,
  });

  const created = await createRes.json() as any;
  if (!createRes.ok || created.error || !created.id) {
    throw new Error(`Instagram container creation failed: ${JSON.stringify(created)}`);
  }

  const publishBody = new URLSearchParams({
    creation_id: created.id,
    access_token: env.META_PAGE_ACCESS_TOKEN,
  });

  const publishRes = await fetch(`${base}/${env.IG_USER_ID}/media_publish`, {
    method: 'POST',
    body: publishBody,
  });

  const published = await publishRes.json() as any;
  if (!publishRes.ok || published.error) {
    throw new Error(`Instagram publish failed: ${JSON.stringify(published)}`);
  }

  return { id: published.id, raw: { created, published } };
}
