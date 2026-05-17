-- Seed data imported from src/content/
INSERT INTO posts (slug, title, excerpt, cover_image, status, published_at, featured, category, tags, reading_time, seo_title, seo_description, og_image, canonical_url, related_posts, content_markdoc) VALUES (
    'travel-in-Hokkaido-japan', '[多图游记]冬天北海道这么大，我们偏要走这里', NULL, NULL, 'published', '2013-02-02T00:00:00.000Z',
    0, NULL, '[]', NULL,
    NULL, NULL, NULL, NULL,
    '[]', '## 第1天（2013-01-16）

### **富士山 Mount Fuji**

我们从广州飞去东京的途中，在空中遇到日本富士山。包括空姐都一起观望远处的富士山山顶。

![](image.jpeg)
'
  );
INSERT INTO site_settings (key, value) VALUES ('site', '{"siteName":"sankyu.me","siteUrl":"https://sankyu.me","mainNav":[],"socialLinks":[{"platform":"X","url":"https://x.com/imsankyu"}]}');
