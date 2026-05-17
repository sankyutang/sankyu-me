-- D1 schema for sankyume admin
-- One table per Keystatic collection. Complex/list fields are stored as JSON TEXT.

CREATE TABLE posts (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  excerpt         TEXT,
  cover_image     TEXT,
  status          TEXT NOT NULL DEFAULT 'draft',          -- draft | published
  published_at    TEXT,                                   -- ISO8601
  featured        INTEGER NOT NULL DEFAULT 0,             -- 0|1
  category        TEXT,
  tags            TEXT NOT NULL DEFAULT '[]',             -- JSON array
  reading_time    INTEGER,
  seo_title       TEXT,
  seo_description TEXT,
  og_image        TEXT,
  canonical_url   TEXT,
  related_posts   TEXT NOT NULL DEFAULT '[]',             -- JSON array of slugs
  content_markdoc TEXT NOT NULL DEFAULT '',
  created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_posts_status_published ON posts(status, published_at DESC);
CREATE INDEX idx_posts_featured ON posts(featured, published_at DESC);

CREATE TABLE pages (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  seo_title       TEXT,
  seo_description TEXT,
  og_image        TEXT,
  content_markdoc TEXT NOT NULL DEFAULT '',
  created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE works (
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
CREATE INDEX idx_works_status_published ON works(status, published_at DESC);

CREATE TABLE products (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT NOT NULL UNIQUE,                   -- maps from Keystatic `name`
  name            TEXT NOT NULL,
  summary         TEXT,
  cover_image     TEXT,
  status          TEXT NOT NULL DEFAULT 'active',         -- active | coming-soon | archived
  product_type    TEXT NOT NULL DEFAULT 'digital-product',
  price_text      TEXT,
  external_url    TEXT,
  cta_text        TEXT DEFAULT 'Get it',
  featured        INTEGER NOT NULL DEFAULT 0,
  tags            TEXT NOT NULL DEFAULT '[]',
  highlights      TEXT NOT NULL DEFAULT '[]',             -- [{title, description}]
  audience        TEXT NOT NULL DEFAULT '[]',
  faq             TEXT NOT NULL DEFAULT '[]',             -- [{question, answer}]
  related_posts   TEXT NOT NULL DEFAULT '[]',
  seo_title       TEXT,
  seo_description TEXT,
  og_image        TEXT,
  content_markdoc TEXT NOT NULL DEFAULT '',
  created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_products_status ON products(status);

CREATE TABLE podcasts (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  excerpt         TEXT,
  cover_image     TEXT,
  audio_url       TEXT,
  duration        TEXT,
  published_at    TEXT,
  status          TEXT NOT NULL DEFAULT 'draft',
  external_links  TEXT NOT NULL DEFAULT '[]',             -- [{platform, url}]
  related_posts   TEXT NOT NULL DEFAULT '[]',
  seo_title       TEXT,
  seo_description TEXT,
  og_image        TEXT,
  content_markdoc TEXT NOT NULL DEFAULT '',
  created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE videos (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  platform        TEXT NOT NULL DEFAULT 'youtube',
  video_url       TEXT,
  thumbnail       TEXT,
  description     TEXT,
  published_at    TEXT,
  status          TEXT NOT NULL DEFAULT 'draft',
  created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL                                     -- JSON
);

CREATE TABLE publish_log (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  path         TEXT NOT NULL,
  content_hash TEXT,
  status       TEXT NOT NULL,                             -- ok | error
  message      TEXT,
  published_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_publish_log_path ON publish_log(path, published_at DESC);
