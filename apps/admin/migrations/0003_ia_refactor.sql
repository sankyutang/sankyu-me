-- 0003_ia_refactor.sql
-- IA refactor: drop works, extend podcasts/videos, add `kind` (+meta) to pages,
-- and a unified media_feed view. Column names mirror 0001_init.sql.
--
-- ⚠️ D1 does not roll back DDL. Before running on --remote, export a backup:
--   wrangler d1 export sankyume_admin --remote --output=backup.sql
--   (then commit backup.sql to git or upload to R2)

-- ─── 1. Drop works ────────────────────────────────────────
-- WARNING: if `works` has rows you still need, export them first:
--   wrangler d1 execute sankyume_admin --remote --command="SELECT * FROM works" > works_backup.json
DROP INDEX IF EXISTS idx_works_status_published;
DROP TABLE IF EXISTS works;

-- ─── 2. Extend podcasts ───────────────────────────────────
ALTER TABLE podcasts ADD COLUMN ep TEXT;
ALTER TABLE podcasts ADD COLUMN guest TEXT;
ALTER TABLE podcasts ADD COLUMN cover_color TEXT DEFAULT '#c8553d';
ALTER TABLE podcasts ADD COLUMN chapters TEXT NOT NULL DEFAULT '[]';  -- JSON [{time,title}]

-- ─── 3. Extend videos ─────────────────────────────────────
ALTER TABLE videos ADD COLUMN duration TEXT;
ALTER TABLE videos ADD COLUMN views TEXT;
ALTER TABLE videos ADD COLUMN likes TEXT;
ALTER TABLE videos ADD COLUMN tags TEXT NOT NULL DEFAULT '[]';        -- JSON array
ALTER TABLE videos ADD COLUMN cover_color TEXT DEFAULT '#c8553d';

-- ─── 4. Extend pages ──────────────────────────────────────
ALTER TABLE pages ADD COLUMN title_en TEXT;
ALTER TABLE pages ADD COLUMN kind TEXT NOT NULL DEFAULT 'static';     -- topic|collection|static
ALTER TABLE pages ADD COLUMN category TEXT;
ALTER TABLE pages ADD COLUMN glyph TEXT;
ALTER TABLE pages ADD COLUMN excerpt TEXT;
ALTER TABLE pages ADD COLUMN cover_color TEXT DEFAULT '#c8553d';
ALTER TABLE pages ADD COLUMN published_at TEXT;
CREATE INDEX IF NOT EXISTS idx_pages_kind ON pages(kind, published_at DESC);

-- ─── 5. Unified media feed view (Podcasts + Videos) ───────
DROP VIEW IF EXISTS media_feed;
CREATE VIEW media_feed AS
  SELECT
    'podcast'              AS kind,
    slug, title, excerpt, cover_image, cover_color,
    published_at, status, duration,
    NULL                   AS platform,
    NULL                   AS video_url,
    audio_url
  FROM podcasts
  WHERE status = 'published'
  UNION ALL
  SELECT
    'video'                AS kind,
    slug, title, description AS excerpt, thumbnail AS cover_image, cover_color,
    published_at, status, duration,
    platform,
    video_url,
    NULL                   AS audio_url
  FROM videos
  WHERE status = 'published';
