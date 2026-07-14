PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(1,'0001_init.sql','2026-05-17 07:46:29');
INSERT INTO "d1_migrations" ("id","name","applied_at") VALUES(2,'0002_seed.sql','2026-05-17 07:49:14');
CREATE TABLE posts (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  excerpt         TEXT,
  cover_image     TEXT,
  status          TEXT NOT NULL DEFAULT 'draft',          
  published_at    TEXT,                                   
  featured        INTEGER NOT NULL DEFAULT 0,             
  category        TEXT,
  tags            TEXT NOT NULL DEFAULT '[]',             
  reading_time    INTEGER,
  seo_title       TEXT,
  seo_description TEXT,
  og_image        TEXT,
  canonical_url   TEXT,
  related_posts   TEXT NOT NULL DEFAULT '[]',             
  content_markdoc TEXT NOT NULL DEFAULT '',
  created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "posts" ("id","slug","title","excerpt","cover_image","status","published_at","featured","category","tags","reading_time","seo_title","seo_description","og_image","canonical_url","related_posts","content_markdoc","created_at","updated_at") VALUES(1,'travel-in-Hokkaido-japan','[多图游记]冬天北海道这么大，我们偏要走这里',NULL,NULL,'published','2013-02-02T00:00:00.000Z',0,NULL,'[]',NULL,NULL,NULL,NULL,NULL,'[]',replace('## 第1天（2013-01-16）\n\n### **富士山 Mount Fuji**\n\n我们从广州飞去东京的途中，在空中遇到日本富士山。包括空姐都一起观望远处的富士山山顶。\n\n![](image.jpeg)\n','\n',char(10)),'2026-05-17 07:49:14','2026-05-17 07:49:14');
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
CREATE TABLE products (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT NOT NULL UNIQUE,                   
  name            TEXT NOT NULL,
  summary         TEXT,
  cover_image     TEXT,
  status          TEXT NOT NULL DEFAULT 'active',         
  product_type    TEXT NOT NULL DEFAULT 'digital-product',
  price_text      TEXT,
  external_url    TEXT,
  cta_text        TEXT DEFAULT 'Get it',
  featured        INTEGER NOT NULL DEFAULT 0,
  tags            TEXT NOT NULL DEFAULT '[]',
  highlights      TEXT NOT NULL DEFAULT '[]',             
  audience        TEXT NOT NULL DEFAULT '[]',
  faq             TEXT NOT NULL DEFAULT '[]',             
  related_posts   TEXT NOT NULL DEFAULT '[]',
  seo_title       TEXT,
  seo_description TEXT,
  og_image        TEXT,
  content_markdoc TEXT NOT NULL DEFAULT '',
  created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
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
  external_links  TEXT NOT NULL DEFAULT '[]',             
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
  value TEXT NOT NULL                                     
);
INSERT INTO "site_settings" ("key","value") VALUES('site','{"siteName":"sankyu.me","siteUrl":"https://sankyu.me","mainNav":[],"socialLinks":[{"platform":"X","url":"https://x.com/imsankyu"}]}');
CREATE TABLE publish_log (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  path         TEXT NOT NULL,
  content_hash TEXT,
  status       TEXT NOT NULL,                             
  message      TEXT,
  published_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(1,'index.html',NULL,'error',replace('render /_render/home -> 404: <!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="UTF-8">\n		<title>404: Not Found</title>\n		<style>\n			:root {\n				--gray-10: hsl(258, 7%, 10%);\n				--gray-20: hsl(258, 7%, 20%);\n				--gray-30','\n',char(10)),'2026-05-17 08:26:15');
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(2,'sitemap.xml',NULL,'error',replace('render /_render/sitemap.xml -> 404: <!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="UTF-8">\n		<title>404: Not Found</title>\n		<style>\n			:root {\n				--gray-10: hsl(258, 7%, 10%);\n				--gray-20: hsl(258, 7%, 20%);\n				--gray-30','\n',char(10)),'2026-05-17 08:26:15');
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(3,'rss.xml',NULL,'error',replace('render /_render/rss.xml -> 404: <!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="UTF-8">\n		<title>404: Not Found</title>\n		<style>\n			:root {\n				--gray-10: hsl(258, 7%, 10%);\n				--gray-20: hsl(258, 7%, 20%);\n				--gray-30','\n',char(10)),'2026-05-17 08:26:15');
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(4,'404.html',NULL,'error',replace('render /_render/404 -> 404: <!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="UTF-8">\n		<title>404: Not Found</title>\n		<style>\n			:root {\n				--gray-10: hsl(258, 7%, 10%);\n				--gray-20: hsl(258, 7%, 20%);\n				--gray-30','\n',char(10)),'2026-05-17 08:26:15');
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(5,'blog/index.html',NULL,'error',replace('render /_render/blog -> 404: <!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="UTF-8">\n		<title>404: Not Found</title>\n		<style>\n			:root {\n				--gray-10: hsl(258, 7%, 10%);\n				--gray-20: hsl(258, 7%, 20%);\n				--gray-30','\n',char(10)),'2026-05-17 08:26:15');
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(6,'works/index.html',NULL,'error',replace('render /_render/works -> 404: <!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="UTF-8">\n		<title>404: Not Found</title>\n		<style>\n			:root {\n				--gray-10: hsl(258, 7%, 10%);\n				--gray-20: hsl(258, 7%, 20%);\n				--gray-30','\n',char(10)),'2026-05-17 08:26:15');
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(7,'products/index.html',NULL,'error',replace('render /_render/products -> 404: <!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="UTF-8">\n		<title>404: Not Found</title>\n		<style>\n			:root {\n				--gray-10: hsl(258, 7%, 10%);\n				--gray-20: hsl(258, 7%, 20%);\n				--gray-30','\n',char(10)),'2026-05-17 08:26:15');
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(8,'podcast/index.html',NULL,'error',replace('render /_render/podcast -> 404: <!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="UTF-8">\n		<title>404: Not Found</title>\n		<style>\n			:root {\n				--gray-10: hsl(258, 7%, 10%);\n				--gray-20: hsl(258, 7%, 20%);\n				--gray-30','\n',char(10)),'2026-05-17 08:26:15');
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(9,'videos/index.html',NULL,'error',replace('render /_render/videos -> 404: <!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="UTF-8">\n		<title>404: Not Found</title>\n		<style>\n			:root {\n				--gray-10: hsl(258, 7%, 10%);\n				--gray-20: hsl(258, 7%, 20%);\n				--gray-30','\n',char(10)),'2026-05-17 08:26:15');
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(10,'blog/travel-in-Hokkaido-japan/index.html',NULL,'error',replace('render /_render/blog/travel-in-Hokkaido-japan -> 404: <!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="UTF-8">\n		<title>404: Not Found</title>\n		<style>\n			:root {\n				--gray-10: hsl(258, 7%, 10%);\n				--gray-20: hsl(258, 7%, 20%);\n				--gray-30','\n',char(10)),'2026-05-17 08:26:15');
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(11,'index.html','9a10f592251a56276c14d95250b4541e70b794b9b2eeb038ed79c035c8e939f2','ok',NULL,'2026-05-17 08:33:24');
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(12,'sitemap.xml','8a2e6f938650c1375e8ec89ad25522091f7814a4b64222bd8b0586d3518a6174','ok',NULL,'2026-05-17 08:33:25');
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(13,'rss.xml','63e24294da60f0e22ca24aa39e86ad3419ad95d9b9f6311f07e779cfd73e9275','ok',NULL,'2026-05-17 08:33:25');
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(14,'404.html',NULL,'error','render /render/404 -> 404: <!DOCTYPE html><html lang="zh-CN" class="dark"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.s','2026-05-17 08:33:25');
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(15,'blog/index.html','87fc735d2397259f70e2bf7baa2f9e9562cc9bacf867f81f27fb36903ba9955d','ok',NULL,'2026-05-17 08:33:25');
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(16,'works/index.html','f984b11783e7e9e3d5f397cd2c5f98669aef4781fa5e55cecaba0fee353ed192','ok',NULL,'2026-05-17 08:33:25');
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(17,'products/index.html','f57261ba562460fe529f44a6a3e52a321cde338ad3f5489d25a900355f90abe2','ok',NULL,'2026-05-17 08:33:26');
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(18,'podcast/index.html','1c5e1a2810c4c0e00549496df911ca53fa5471f4093bd742a0333f778f907a3b','ok',NULL,'2026-05-17 08:33:26');
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(19,'videos/index.html','37f908937361c32e53a14ebb1cce383f996cc08e6a5c66b42c11bb81b2dbc6fb','ok',NULL,'2026-05-17 08:33:26');
INSERT INTO "publish_log" ("id","path","content_hash","status","message","published_at") VALUES(20,'blog/travel-in-Hokkaido-japan/index.html','eaba813877b987a2f0db026c62049af055ee6e42d5128d9790c6a5712843bfa2','ok',NULL,'2026-05-17 08:33:27');
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('d1_migrations',2);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('posts',1);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('publish_log',20);
CREATE INDEX idx_posts_status_published ON posts(status, published_at DESC);
CREATE INDEX idx_posts_featured ON posts(featured, published_at DESC);
CREATE INDEX idx_works_status_published ON works(status, published_at DESC);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_publish_log_path ON publish_log(path, published_at DESC);
