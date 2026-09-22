export interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  AI: Ai;

  ADMIN_TOKEN: string;

  BRAND_NAME: string;
  PUBLIC_MEDIA_BASE_URL: string;
  AUTO_PUBLISH: string;
  ENABLE_FACEBOOK: string;
  ENABLE_INSTAGRAM: string;
  ENABLE_TIKTOK: string;

  META_GRAPH_VERSION: string;
  META_PAGE_ID?: string;
  IG_USER_ID?: string;
  META_PAGE_ACCESS_TOKEN?: string;
  TIKTOK_ACCESS_TOKEN?: string;

  TEXT_MODEL: string;
  IMAGE_MODEL: string;
}

export interface ContentItem {
  id: number;
  source_type: string;
  archetype: string | null;
  enemy_force: string | null;
  battlefield: string | null;
  theme: string;
  source_text: string;
  times_used: number;
  last_used_at: string | null;
}

export interface ScenePackage {
  scene_concept: string;
  environment: string;
  composition: string;
  symbolic_detail: string;
}

export interface GeneratedPost extends ScenePackage {
  hook: string;
  quote_text: string;
  instagram_caption: string;
  facebook_caption: string;
  tiktok_title: string;
  tiktok_description: string;
  hashtags: string[];
}

export interface QueueRow {
  id: number;
  content_item_id: number;
  trigger_name: string;
  scheduled_for: string;
  status: string;
  hook: string | null;
  quote_text: string | null;
  instagram_caption: string | null;
  facebook_caption: string | null;
  tiktok_title: string | null;
  tiktok_description: string | null;
  hashtags_json: string | null;
  image_prompt: string | null;
  image_key: string | null;
  image_url: string | null;
}
