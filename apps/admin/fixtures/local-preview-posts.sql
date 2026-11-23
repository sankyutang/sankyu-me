-- LOCAL PREVIEW ONLY — do not apply remotely
DELETE FROM posts;
DELETE FROM products;
INSERT OR REPLACE INTO site_settings (key, value) VALUES ('site', '{"siteName":"sankyu.me","siteUrl":"https://sankyu.me","mainNav":[],"socialLinks":[{"platform":"X","url":"https://x.com/imsankyu"},{"platform":"GitHub","url":"https://github.com/sankyutang"}],"introBody":"广州。2024 年起做一人公司：独立开发与 FDE，也写 AI 实践与生活。前大厂前端。","siteDescription":"广州。2024 年起做一人公司：独立开发与 FDE，也写 AI 实践与生活。前大厂前端。"}');

INSERT INTO posts (slug, title, excerpt, cover_image, status, published_at, featured, category, tags, reading_time, seo_title, seo_description, og_image, canonical_url, related_posts, content_markdoc) VALUES (
  'ai-coding-week-48-prompts',
  '一个人加一个 AI 编程助手，一周做了什么：48 条指令的复盘',
  '我用 AI 编程助手推进一款棋类学习 App 的一周复盘，讲六个可复用的做法：让 AI 先问清楚、把规则写进文档、用脚本防止漏改、看真实运行结果、给 AI 的错误设防线、管理上下文。',
  'editor/2026/11/cover-blog-8f16bf9a-2373-4b9f-a32e-f1fb5f763a6b.png',
  'published',
  '2026-11-09T14:40:00.000Z',
  0,
  'AI',
  '[]',
  NULL,
  NULL, NULL, 'editor/2026/11/cover-blog-8f16bf9a-2373-4b9f-a32e-f1fb5f763a6b.png', NULL,
  '[]',
  '> TL;DR：一周里我在 7 个会话里给 AI 发了 48 条消息，合并 4 个 PR。下面是六个我会继续用的做法。

## 做法一：让 AI 先拷问我

周一产品方向变了。我把新需求交给 AI，它的第一句话是：

> 现在不要开始写代码。先把这次需求变更正式"止血"和定边界。

可以照着做的：要求 AI 每轮只问 3 到 5 个问题，每题带编号、选项和推荐答案。

## 做法三：反复出错的事交给脚本

```ts
// 比对脚本：后端路由类型 vs App 清单
type Diff = ''extra'' | ''missing'' | ''input'' | ''output''
function report(diffs: Diff[]) {
  console.log(diffs.join('', ''))
}
```

## 清单

1. 需求有变化，先让 AI 出带推荐答案的选择题。
2. 会影响以后的决定，写进规则文档。
3. 反复出错的事交给脚本。
'
);

INSERT INTO posts (slug, title, excerpt, cover_image, status, published_at, featured, category, tags, reading_time, seo_title, seo_description, og_image, canonical_url, related_posts, content_markdoc) VALUES (
  'travel-in-qiaodao-ai-aa-4205',
  '在珠海淇澳岛，11个人把一笔4205元的账交给了AI',
  '一次珠海淇澳岛的大学同学小聚，11个人把4205元的复杂AA账交给AI计算。账目算清了，关系更轻松，也让我意识到：AI不只服务于工作，也能帮我们处理生活里的琐碎，让人把时间留给真正重要的相聚。',
  'editor/2026/08/11-4205-ai-b4276c9c-ec29-409d-afc0-12182c3c1046.png',
  'published',
  '2026-08-20T11:00:00.000Z',
  0,
  '文章',
  '[]',
  NULL,
  NULL, NULL, 'editor/2026/08/11-4205-ai-b4276c9c-ec29-409d-afc0-12182c3c1046.png', NULL,
  '[]',
  '上周末，几个生活在不同地方的大学同学，在珠海淇澳岛见了一面。

这是一次2日1夜的小聚。聚会接近尾声时，大家开始讨论：这次费用，最后怎么算？

## AA 不是把关系算薄，而是让关系更轻松

请客是一种心意，AA 也是一种体面。舒服的关系，不是完全不谈钱，而是钱可以坦然地谈。

## 4205 元的账，难的不是除法

基础均摊、午饭及单车、午茶——规则由人确认，AI 负责整理计算。最终表格合计 4205 元。

## 写在最后

规则由人来商量，费用由人来确认，AI 负责整理和计算，最后再由人复核结果。
'
);

INSERT INTO posts (slug, title, excerpt, cover_image, status, published_at, featured, category, tags, reading_time, seo_title, seo_description, og_image, canonical_url, related_posts, content_markdoc) VALUES (
  'travel-in-Hokkaido-japan',
  '[多图游记]冬天北海道这么大，我们偏要走这里',
  '我们从广州飞去东京的途中，在空中遇到日本富士山。包括空姐都一起观望远处的富士山山顶。',
  NULL,
  'published',
  '2013-02-02T00:00:00.000Z',
  0,
  '文章',
  '[]',
  NULL,
  NULL, NULL, NULL, NULL,
  '[]',
  '## 第1天（2013-01-16）

### **富士山 Mount Fuji**

我们从广州飞去东京的途中，在空中遇到日本富士山。包括空姐都一起观望远处的富士山山顶。

![](image.jpeg)
'
);

