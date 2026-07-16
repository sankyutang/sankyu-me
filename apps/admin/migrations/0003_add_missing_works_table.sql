-- Some legacy remote databases recorded 0001_init.sql before the works table
-- was created. Keep this repair idempotent so every Admin deployment can query
-- the complete dashboard safely.

CREATE TABLE IF NOT EXISTS works (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  summary         TEXT,
  cover_image     TEXT,
  status          TEXT NOT NULL DEFAULT 'draft',
  published_at    TEXT,
  featured        INTEGER NOT NULL DEFAULT 0,
  external_url    TEXT,
  seo_title       TEXT,
  seo_description TEXT,
  og_image        TEXT,
  content_markdoc TEXT NOT NULL DEFAULT '',
  created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_works_status_published ON works(status, published_at DESC);
