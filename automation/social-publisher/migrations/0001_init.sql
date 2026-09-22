PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS content_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_type TEXT NOT NULL,
  archetype TEXT,
  enemy_force TEXT,
  battlefield TEXT,
  theme TEXT NOT NULL,
  source_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'archived')),
  weight INTEGER NOT NULL DEFAULT 100,
  times_used INTEGER NOT NULL DEFAULT 0,
  last_used_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_content_items_selection
  ON content_items(status, times_used, last_used_at);

CREATE TABLE IF NOT EXISTS publish_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_item_id INTEGER NOT NULL,
  trigger_name TEXT NOT NULL,
  scheduled_for TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','generating','ready','publishing','published','failed')),
  hook TEXT,
  quote_text TEXT,
  instagram_caption TEXT,
  facebook_caption TEXT,
  tiktok_title TEXT,
  tiktok_description TEXT,
  hashtags_json TEXT,
  image_prompt TEXT,
  image_key TEXT,
  image_url TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (content_item_id) REFERENCES content_items(id),
  UNIQUE(trigger_name, scheduled_for)
);

CREATE INDEX IF NOT EXISTS idx_publish_queue_status
  ON publish_queue(status, scheduled_for);

CREATE TABLE IF NOT EXISTS publish_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  queue_id INTEGER NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('facebook','instagram','tiktok')),
  status TEXT NOT NULL CHECK (status IN ('success','failed','skipped')),
  external_id TEXT,
  response_body TEXT,
  error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (queue_id) REFERENCES publish_queue(id)
);

CREATE INDEX IF NOT EXISTS idx_publish_logs_queue
  ON publish_logs(queue_id, platform, created_at);

CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO system_settings(key, value) VALUES
  ('content_language', 'es'),
  ('posts_per_day', '2'),
  ('default_hashtag_count', '5');
