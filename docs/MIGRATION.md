# MIGRATION.md
> 把当前设计稿（`Portfolio.html` + `src/*.jsx`）的页面 / 组件 / 信息架构
> 迁移到 **sankyume-web** Astro 项目里的完整作战计划。
>
> 阅读对象：Claude Code / 接手开发同学。
> 阅读时长：~15 分钟。
> 执行总工时估算：**2.5 ~ 3.5 个工作日**（含验证）。

---

## 0 · 背景与目标

### 0.1 两个项目的差距

| 维度 | 设计稿 (本仓库) | sankyume-web (目标仓库) |
|---|---|---|
| 框架 | Browser 内 Babel + React + JSX | **Astro 5** + React Islands |
| 路由 | hash 路由 `#media/...` | **文件路由** `/blog/[slug]` |
| 数据 | 硬编码 `src/data.js` (mock) | **Keystatic CMS** → **Cloudflare D1** |
| 样式 | 暖纸感 / 衬线 / 米黄 / 手绘 | clean SaaS / Geist 无衬线 / oklch 中性 |
| 字体 | Newsreader / 文楷 / Caveat | Geist / Geist Mono |
| 部署 | 静态文件 | **Cloudflare Workers** + R2 |
| CMS | 无 | Keystatic（写到 git 的 mdoc）+ D1（Admin app 同步） |
| 导航 | **6 项**：Home / Posts / Products / Media / Pages / About | 10 项：Home / Blog / Products / **Works** / **Videos** / **Podcast** / About / Now / Uses / Links |

### 0.2 这次迁移要达成的目标

1. **视觉**：把暖纸感整套视觉迁过去，替换现有的 clean SaaS 主题
2. **信息架构**：
   - 删 `Works`（产品概念已被 `Products` 覆盖）
   - 合并 `Podcast + Videos → Media`，路由 `/media`
   - 保留 `Now / Uses / Links` 作为 Pages 项下的 static 子页（或独立短页）
3. **页面**：移植 Home / Posts(Blog) / Products / Media / Pages / About 六个核心页 + 相关详情页
4. **数据**：实现 mock ↔ 真实 CMS 的开关，先用 mock 验证视觉，再切回 Keystatic / D1
5. **数据库**：D1 schema 升级（删 works 表、podcasts/videos 加字段）

### 0.3 策略选择
本次执行**方案 A：全盘换皮**。
（方案 B「只迁 IA、保留 clean 风格」已被否决；方案 C「混合」可作为未来 backlog。）

---

## 1 · 阶段拆解总览

| 阶段 | 内容 | 工时 | 风险 |
|---|---|---|---|
| **1. 设计令牌迁移** | 替换 `global.css`，加字体、暖纸 token、utility class | 0.5 d | 低 |
| **2. 信息架构 + 数据模型调整** | 砍 Works、合并 Media、改 nav、改 Keystatic、改 D1 | 0.5 d | **中**（D1 写过的数据要小心） |
| **3. 页面逐个移植** | Home → Posts → Products → Media → Pages → About + 详情页 | 1.5 ~ 2 d | 中 |
| **4. 数据层切换（mock ↔ real）** | 抽象 `data-source.ts`，加开关，先 mock 跑通 UI，再回切 Keystatic | 0.5 d | 低 |

---

## 2 · 阶段 1：设计令牌迁移

### 2.1 字体加载（在 `src/layouts/Base.astro` 的 `<head>` 顶部加）

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,500&family=Noto+Serif+SC:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Caveat:wght@500;600&family=Manrope:wght@400;500;600;700&display=swap"
/>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css"
/>
```

> **性能说明**：6 套字体确实重；如果首屏 LCP > 2.5s，
> 后续把 Newsreader + Noto Serif SC 用 `<link rel="preload" as="font">` 单独 hint 一下即可。Caveat 这种装饰字体可以 lazy-load。

### 2.2 替换 `src/styles/global.css`

把整个文件**完全替换**为下面这套（设计稿 `src/styles.css` 的 Tailwind 4 版本）。
关键变化：所有 oklch 中性色 → 暖纸色板；引入 paper-* / ink-* 自定义色；保留 shadcn 的 `--background / --foreground / --accent / --border` 别名，让 shadcn 组件不破。

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:is([data-theme="dark"] *));

/* ─── PAPER PALETTE & INK SCALE ───────────────────────── */
:root {
  --paper-50:  #faf6ec;
  --paper-100: #f5f1e8;
  --paper-200: #efeae0;
  --paper-300: #e6dfd0;
  --paper-400: #c8bfa8;
  --ink-900:   #2a1f15;
  --ink-800:   #3a2a1d;
  --ink-700:   #5a4632;
  --ink-500:   #7d6a52;
  --ink-300:   #a89881;

  /* accent — terracotta default */
  --accent:        #c8553d;
  --accent-soft:   #d4715a;
  --accent-2:      #8b5e34;

  /* shadcn alias layer — DO NOT remove, existing components rely on these */
  --background:        var(--paper-100);
  --foreground:        var(--ink-800);
  --card:              var(--paper-50);
  --card-foreground:   var(--ink-800);
  --popover:           var(--paper-50);
  --popover-foreground:var(--ink-900);
  --primary:           var(--ink-900);
  --primary-foreground:var(--paper-50);
  --secondary:         var(--paper-200);
  --secondary-foreground: var(--ink-800);
  --muted:             var(--paper-200);
  --muted-foreground:  var(--ink-500);
  --accent-foreground: var(--paper-50);
  --destructive:       oklch(0.577 0.245 27.325);
  --border:            var(--ink-300);
  --input:             var(--ink-300);
  --ring:              var(--accent);
  --radius:            0.25rem;

  /* fonts */
  --font-serif-en: 'Newsreader', ui-serif, Georgia, serif;
  --font-serif-cn: 'Noto Serif SC', 'Songti SC', serif;
  --font-wenkai:   'LXGW WenKai', 'Noto Serif SC', serif;
  --font-sans:     'Manrope', system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-mono:     'JetBrains Mono', ui-monospace, monospace;
  --font-hand:     'Caveat', 'LXGW WenKai', cursive;
  --font-body:     var(--font-serif-en), var(--font-serif-cn);
  --font-display:  var(--font-serif-en), var(--font-serif-cn);
}

[data-theme="dark"] {
  --paper-50:  #1c1814;
  --paper-100: #221d18;
  --paper-200: #2a241e;
  --paper-300: #34291f;
  --paper-400: #5a4a36;
  --ink-900:   #f1ead9;
  --ink-800:   #e8dfc8;
  --ink-700:   #c9bda1;
  --ink-500:   #9a8d72;
  --ink-300:   #6e6450;
}

@theme inline {
  --color-background:  var(--background);
  --color-foreground:  var(--foreground);
  --color-paper-50:    var(--paper-50);
  --color-paper-100:   var(--paper-100);
  --color-paper-200:   var(--paper-200);
  --color-paper-300:   var(--paper-300);
  --color-paper-400:   var(--paper-400);
  --color-ink-900:     var(--ink-900);
  --color-ink-800:     var(--ink-800);
  --color-ink-700:     var(--ink-700);
  --color-ink-500:     var(--ink-500);
  --color-ink-300:     var(--ink-300);
  --color-accent:      var(--accent);
  --color-accent-2:    var(--accent-2);
  --color-accent-foreground: var(--accent-foreground);
  --color-border:      var(--border);
  --color-ring:        var(--ring);
  --font-sans:         var(--font-sans);
  --font-mono:         var(--font-mono);
  --font-serif:        var(--font-serif-en), var(--font-serif-cn);
  --radius-sm:         0.125rem;
  --radius-md:         0.25rem;
  --radius-lg:         0.5rem;
}

@layer base {
  html { font-family: var(--font-body); }
  body {
    @apply bg-background text-foreground antialiased;
    font-size: 17px;
    line-height: 1.7;
    font-feature-settings: 'kern', 'liga', 'pnum';
  }
}

/* ─── PAPER TEXTURE ───────────────────────────────────── */
body.paper-bg {
  background-color: var(--paper-100);
  background-image:
    radial-gradient(rgba(58,42,29,0.045) 1px, transparent 1px),
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.23  0 0 0 0 0.16  0 0 0 0 0.11  0 0 0 0.045 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  background-size: 22px 22px, 240px 240px;
}

/* ─── UTILITY CLASSES (port from src/styles.css) ──────── */
/* TODO: copy the remaining utility classes from this design's src/styles.css:
   .kicker, .hand-underline, .swoosh-underline, .hand-divider, .num-stamp,
   .paper-card, .lift, .tape, .reveal, .font-display, .font-hand, .font-wenkai
   It's ~150 lines of self-contained rules — paste them under this section.
*/
```

### 2.3 切换默认主题模式

`src/layouts/Base.astro` 第 30 行：
```diff
- <html lang="zh-CN" class="dark">
+ <html lang="zh-CN" data-theme="light">
```
内联脚本里也要把 `classList.add('dark')` 换成 `setAttribute('data-theme', 'dark')`。

### 2.4 验收
- [ ] `npm run legacy:dev` 跑起来，所有页面字体变成 Newsreader + 衬线，背景变米黄
- [ ] 暗色切换正常（`data-theme="dark"` 时变深褐底）
- [ ] shadcn 现有组件（Header / Footer / ThemeToggle）没坏

---

## 3 · 阶段 2：信息架构 + 数据模型调整

### 3.1 改 `src/lib/nav.ts`

```ts
export const defaultMainNav: NavItem[] = [
  { label: "Home",     href: "/" },
  { label: "Posts",    href: "/posts" },         // 原 /blog 也保留 redirect
  { label: "Products", href: "/products" },
  { label: "Media",    href: "/media" },         // 新合并路由
  { label: "Pages",    href: "/pages" },         // 专题书架
  { label: "About",    href: "/about" },
];
```

### 3.2 删除 Works

1. **删文件**：
   - `src/pages/works/` 整个目录
   - `src/content/works/`（如果有内容先备份到 `_archive/`）
   - `apps/admin/src/templates/WorksList.astro`、`WorkDetail.astro`
   - `apps/admin/src/pages/admin/works/`（如果有）

2. **改 `keystatic.config.ts`**：移除 `works: collection({...})` 整块

3. **改 D1**：见 3.6 的迁移脚本

### 3.3 合并 Podcasts + Videos → Media

不新建 `media` collection。保留 podcasts / videos 两张表，**在前端层合并**——这样后台仍然可以分类录入，前台展示是一个 feed。

#### `keystatic.config.ts` 字段增补

`podcasts` collection 加：
```ts
ep:        fields.text({ label: 'EP 编号（如 EP·12）' }),
guest:     fields.text({ label: '嘉宾' }),
coverColor:fields.text({ label: '封面色（hex）', defaultValue: '#c8553d' }),
chapters:  fields.array(
  fields.object({
    time:  fields.text({ label: '时间戳' }),
    title: fields.text({ label: '章节标题' }),
  }),
  { label: '章节', itemLabel: (p) => `${p.fields.time.value} · ${p.fields.title.value}` }
),
```

`videos` collection 加：
```ts
duration:  fields.text({ label: '时长（如 12:35）' }),
views:     fields.text({ label: '播放数（如 4.2k）' }),
likes:     fields.text({ label: '点赞数' }),
tags:      fields.array(fields.text({ label: 'Tag' }), { label: '标签', itemLabel: (p) => p.value }),
coverColor:fields.text({ label: '主色（hex）', defaultValue: '#c8553d' }),
```

### 3.4 新建 `/media` 路由

`src/pages/media/index.astro` —— 合并 podcasts 和 videos 两个集合，按 publishedAt 倒序。
详情见阶段 3 的页面映射表。

`/podcast` 和 `/videos` **保留为重定向 / filter alias**：
- 可以做 301 → `/media?filter=podcasts` / `/media?filter=videos`
- 也可以保留为同一个 MediaList 组件、不同初始 filter 的两个页面

设计稿采用的是第二种（URL 不变也能用），推荐沿用。

### 3.5 Pages 集合 = 专题 + 静态小页

设计稿里 `Pages` 包含三种 kind：
- `topic` —— 长专题（如 "/365-days-after-bigco"）
- `collection` —— 收藏夹合集
- `static` —— Now / Uses / Links 这种小页

sankyume-web 现有：
- `keystatic` 的 `pages` collection（已存在，对应 topic + static）
- 散落的 `now.astro` / `uses.astro` / `links.astro`

**推荐做法**：
1. 给 `pages` collection 加 `kind` 字段：
   ```ts
   kind: fields.select({
     label: '类型',
     options: [
       { label: '专题 Topic', value: 'topic' },
       { label: '合集 Collection', value: 'collection' },
       { label: '静态小页 Static', value: 'static' },
     ],
     defaultValue: 'static',
   }),
   ```
2. 把 `now.astro` / `uses.astro` / `links.astro` 的内容**作为 mdoc** 写入 `src/content/pages/`，kind=static
3. 这三个 .astro 文件改成 redirect 到 `/pages/now` 等（或保留兼容）

### 3.6 Cloudflare D1 数据库迁移

新建 `apps/admin/migrations/0003_ia_refactor.sql`：

```sql
-- 0003_ia_refactor.sql
-- IA refactor: drop works, extend podcasts/videos, add `kind` to pages.

-- ─── 1. Drop works ────────────────────────────────────────
-- WARNING: if works has rows you need, export first:
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
ALTER TABLE videos ADD COLUMN tags TEXT NOT NULL DEFAULT '[]';
ALTER TABLE videos ADD COLUMN cover_color TEXT DEFAULT '#c8553d';

-- ─── 4. Extend pages ──────────────────────────────────────
ALTER TABLE pages ADD COLUMN kind TEXT NOT NULL DEFAULT 'static';  -- topic|collection|static
ALTER TABLE pages ADD COLUMN excerpt TEXT;
ALTER TABLE pages ADD COLUMN cover_image TEXT;
ALTER TABLE pages ADD COLUMN cover_color TEXT DEFAULT '#c8553d';
ALTER TABLE pages ADD COLUMN published_at TEXT;
CREATE INDEX IF NOT EXISTS idx_pages_kind ON pages(kind, published_at DESC);

-- ─── 5. Optional unified view for /media ─────────────────
-- 不强制 — 前端可以直接 UNION，但有视图查询更省事
CREATE VIEW IF NOT EXISTS media_feed AS
  SELECT
    'podcast'    AS kind,
    slug, title, excerpt, cover_image, cover_color,
    published_at, status,
    duration,
    NULL AS platform,
    NULL AS video_url,
    audio_url
  FROM podcasts
  WHERE status = 'published'
  UNION ALL
  SELECT
    'video'      AS kind,
    slug, title, description AS excerpt, thumbnail AS cover_image, cover_color,
    published_at, status,
    duration,
    platform,
    video_url,
    NULL AS audio_url
  FROM videos
  WHERE status = 'published';
```

执行：
```bash
cd apps/admin
npm run db:migrate:local         # 本地先跑一遍
# 验证后再 remote
npm run db:migrate:remote
```

> **回滚预案**：D1 不支持事务回滚 DDL。执行前务必：
> 1. `wrangler d1 export sankyume_admin --remote --output=backup.sql`
> 2. 把 backup.sql 提交到 git 或存到 R2
> 3. 出问题时新建 `0004_rollback.sql` 反向操作

### 3.7 同步更新 admin app 的 templates

`apps/admin/src/templates/` 里需要：
- 删 `WorksList.astro` / `WorkDetail.astro`
- 新建 `MediaList.astro` 替代 `PodcastsList.astro` + `VideosList.astro`（或都保留，让 admin 仍然能分别管理）
- 更新 `Home.astro` 反映新 IA
- 给 `BlogList.astro` / `BlogDetail.astro` 改名为 `PostsList.astro` / `PostsDetail.astro`（视情况）

### 3.8 验收
- [ ] D1 迁移在本地跑通，podcasts / videos 表有新列
- [ ] `npm run import-content` 重新生成种子 SQL 不报错
- [ ] Keystatic 后台进得去，新字段可见可填
- [ ] `/works` 访问 404 或 redirect
- [ ] nav 显示 6 项

---

## 4 · 阶段 3：页面逐个移植

### 4.1 总映射表

| 设计稿组件 / 文件 | sankyume-web 目标路径 | 类型 | 备注 |
|---|---|---|---|
| `HomeMagazine`（`src/homes.jsx`） | `src/pages/index.astro` | Astro + React Island | 顶层布局拆成 Astro，子组件按需 island |
| `PostsList`（`src/pages/blog/index.astro` 重写） | `src/pages/posts/index.astro` | Astro 纯静态 | 旧 `/blog` 做 redirect |
| `PostsDetail` | `src/pages/posts/[slug].astro` | Astro 纯静态 | 复用 `markdoc.ts` 渲染 |
| `ProductsList` + `ProductFeature` | `src/pages/products/index.astro` | Astro 纯静态 | |
| `ProductsDetail` | `src/pages/products/[slug].astro` | Astro 纯静态 | |
| `MediaList`（**新建**） | `src/pages/media/index.astro` | **React Island**（因有 filter tab 交互） | 见 4.3 |
| `PodcastsDetail` | `src/pages/media/podcasts/[slug].astro` | Astro 纯静态 | back 按钮指向 `/media` |
| `VideosDetail` | `src/pages/media/videos/[slug].astro` | Astro 纯静态 | back 按钮指向 `/media` |
| `PagesList` | `src/pages/pages/index.astro` | Astro 纯静态 | 按 kind 分组展示 |
| `PagesDetail` | `src/pages/pages/[slug].astro` | Astro 纯静态 | topic/collection/static 共享但模板分支 |
| `About` | `src/pages/about.astro` | Astro 纯静态 | |
| `Navbar`（`src/components.jsx`） | `src/components/Header.astro` 重写 | Astro | 已存在，调改导航项即可 |
| `Footer` | `src/components/Footer.astro` | Astro | 已存在 |

### 4.2 组件分类原则

- **零交互的展示组件** → 改写成 `.astro`（无 React，无 JS hydration）
  - `<Avatar>`、`<Cover>`、`<SectionHeader>`、`<NowCard>`、`<PostCardLarge>`、`<ProductFeature>`、`<CassetteTape>`、`<VideoThumbnail>`、`<PageSpine>`、`<PageRow>`、`<PostRow>`、`<SocialRow>`、`<Footer>`、`<Navbar>`
- **有状态 / 交互的** → 保留 React，用 `client:visible` 挂载
  - `<MediaList>`（filter tabs）—— 必须 island
  - `<TweaksPanel>` —— **不带过去**，线上版本删掉
  - `useReveal()` 滚动入场效果 —— 可以保留为一个小 vanilla JS 脚本写在 Base.astro

### 4.3 重点：MediaList 的 Astro + React 混合实现

```astro
---
// src/pages/media/index.astro
import Base from '@/layouts/Base.astro'
import MediaList from '@/components/media/MediaList'
import { getMediaFeed } from '@/lib/data-source'

const url = Astro.url
const initialFilter = url.pathname.endsWith('/podcasts')
  ? 'podcasts'
  : url.pathname.endsWith('/videos')
  ? 'videos'
  : 'all'

const items = await getMediaFeed()
---

<Base title="Media · 自媒体">
  <MediaList client:load items={items} initialFilter={initialFilter} />
</Base>
```

`MediaList.tsx` 就是把当前设计稿 `src/pages.jsx` 里的 `function MediaList(...)` 翻成 TSX 即可——逻辑零修改，只把 hash 操作换成 history.replaceState。

### 4.4 每页移植 checklist（适用于所有 6 个核心页）

- [ ] 读设计稿的对应组件源码（在本仓库 `src/pages.jsx` / `src/homes.jsx`）
- [ ] 把 React 的 className 全保留（Tailwind 4 兼容）
- [ ] 把 `useNavigate` 调用换成原生 `<a href>`
- [ ] 把 hash 链接（`#posts/123`）换成路径链接（`/posts/123`）
- [ ] 内联 `data-screen-label` 属性可以保留（无害）
- [ ] 移除所有 Tweaks 相关代码
- [ ] 数据来源从 `data.{posts,products,...}` 换成 `await getXxx()`（见阶段 4）
- [ ] 本地 `npm run legacy:dev` 看一眼，对比设计稿截图

### 4.5 详情页的 markdoc 渲染

设计稿里详情页正文是写死的字符串，sankyume-web 用的是 markdoc，已经有 `src/lib/markdoc.ts`。
迁移时**保留设计稿的所有视觉容器**（kicker / num-stamp / 章节卡），**正文部分用 markdoc 渲染替代**即可。

```astro
---
import { renderContent } from '@/lib/markdoc'
const { Content } = await renderContent(entry.content)
---
<article class="prose prose-stone max-w-none">
  <Content />
</article>
```

---

## 5 · 阶段 4：数据层切换（mock ↔ real）

### 5.1 设计原则

- 所有页面**不要直接调用** `reader.collections.posts.all()`
- 统一走 `src/lib/data-source.ts` 抽象
- 通过环境变量 `PUBLIC_USE_MOCK=1` 切换 mock / real
- **默认 OFF**（生产强制走真数据，缺数据宁可空也别露 mock）

### 5.2 文件结构

```
src/lib/
  data-source.ts         # 入口：根据 env 选 mock 或 real
  data-source/
    real.ts              # Keystatic reader + 字段映射
    mock.ts              # 加载 mock/data.ts，返回相同 shape
    types.ts             # 公共 TypeScript 类型（Post, Product, MediaItem, PageEntry...）
  mock/
    data.ts              # 直接从设计稿 src/data.js 拷过来，改成 TS 模块
```

### 5.3 `data-source.ts` 模板

```ts
// src/lib/data-source.ts
import type { Post, Product, MediaItem, PageEntry, Profile } from './data-source/types'

const USE_MOCK = import.meta.env.PUBLIC_USE_MOCK === '1'

const impl = USE_MOCK
  ? await import('./data-source/mock')
  : await import('./data-source/real')

export const getProfile:    () => Promise<Profile>      = impl.getProfile
export const getPosts:      () => Promise<Post[]>       = impl.getPosts
export const getPost:       (slug: string) => Promise<Post | null> = impl.getPost
export const getProducts:   () => Promise<Product[]>    = impl.getProducts
export const getProduct:    (slug: string) => Promise<Product | null> = impl.getProduct
export const getMediaFeed:  () => Promise<MediaItem[]>  = impl.getMediaFeed
export const getPodcast:    (slug: string) => Promise<MediaItem | null> = impl.getPodcast
export const getVideo:      (slug: string) => Promise<MediaItem | null> = impl.getVideo
export const getPages:      () => Promise<PageEntry[]>  = impl.getPages
export const getPage:       (slug: string) => Promise<PageEntry | null> = impl.getPage
export const getSocialLinks:() => Promise<{platform:string;url:string}[]> = impl.getSocialLinks
```

### 5.4 mock.ts 模板

```ts
// src/lib/data-source/mock.ts
import { mockData } from '../mock/data'

export async function getProfile()   { return mockData.profile }
export async function getPosts()     { return mockData.posts }
export async function getPost(slug)  { return mockData.posts.find(p => p.id === slug) ?? null }
export async function getProducts()  { return mockData.products }
export async function getProduct(slug) { return mockData.products.find(p => p.id === slug) ?? null }
export async function getMediaFeed() {
  const items = [
    ...mockData.podcasts.map(p => ({ ...p, kind: 'podcast' as const })),
    ...mockData.videos.map(v   => ({ ...v, kind: 'video'   as const })),
  ]
  return items.sort((a, b) => (a.date < b.date ? 1 : -1))
}
export async function getPodcast(slug) { return mockData.podcasts.find(p => p.id === slug) ?? null }
export async function getVideo(slug)   { return mockData.videos.find(v => v.id === slug) ?? null }
export async function getPages()       { return mockData.pages }
export async function getPage(slug)    { return mockData.pages.find(p => p.id === slug) ?? null }
export async function getSocialLinks() { return mockData.social }
```

### 5.5 real.ts 模板

```ts
// src/lib/data-source/real.ts
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../../keystatic.config'

const reader = createReader(process.cwd(), keystaticConfig)

export async function getPosts() {
  const all = await reader.collections.posts.all()
  return all
    .filter(p => p.entry.status === 'published')
    .map(p => ({
      id: p.slug,
      title: p.entry.title,
      excerpt: p.entry.excerpt,
      cover_color: '#c8553d',  // 设计稿要的，Keystatic 没有就 fallback
      date: p.entry.publishedAt ?? '',
      reading: p.entry.readingTime ? `${p.entry.readingTime} min` : '',
      tag: p.entry.category,
      cover_emoji: '✒︎',
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getMediaFeed() {
  const [podcasts, videos] = await Promise.all([
    reader.collections.podcasts.all(),
    reader.collections.videos.all(),
  ])
  const pods = podcasts
    .filter(p => p.entry.status === 'published')
    .map(p => ({ ...p.entry, id: p.slug, kind: 'podcast' as const, date: p.entry.publishedAt }))
  const vids = videos
    .filter(v => v.entry.status === 'published')
    .map(v => ({ ...v.entry, id: v.slug, kind: 'video' as const, date: v.entry.publishedAt }))
  return [...pods, ...vids].sort((a, b) => (a.date < b.date ? 1 : -1))
}

// ... 其他方法同理
```

### 5.6 mock/data.ts 导入

直接把本仓库的 `src/data.js` 拷贝过去，改成：
```ts
// src/lib/mock/data.ts
export const mockData = {
  profile: { /* ... */ },
  posts: [ /* ... */ ],
  // ...
} as const
```

文件路径：`sankyume-web/src/lib/mock/data.ts`

### 5.7 环境变量

`.env.example` 加：
```
# 1 = use mock data (for design verification only)
# DO NOT enable in production
PUBLIC_USE_MOCK=0
```

开发期临时切：
```bash
PUBLIC_USE_MOCK=1 npm run legacy:dev
```

### 5.8 验收
- [ ] `PUBLIC_USE_MOCK=1` 时所有页面显示设计稿里的 mock 内容（30+ 篇 posts、4 集 podcast、5 个 video）
- [ ] 切回 `PUBLIC_USE_MOCK=0` 时显示 Keystatic 真实内容（即使只有 1 篇 Hokkaido 文章也不该崩）
- [ ] 生产构建（`npm run legacy:build`）默认 USE_MOCK=0

---

## 6 · 工作执行顺序（建议）

> 适合 Claude Code 串行执行：每个 task 提交一次 PR / 一个 commit。

1. **commit 1** — 阶段 1：global.css + 字体 + Base.astro 改 data-theme
2. **commit 2** — 阶段 2.1：nav.ts 改 6 项 + 删 works 相关文件
3. **commit 3** — 阶段 2.3：Keystatic config 字段增补（podcasts/videos/pages）
4. **commit 4** — 阶段 2.6：D1 migration `0003_ia_refactor.sql` + 本地 apply 验证
5. **commit 5** — 阶段 4 的骨架：`data-source.ts` + mock.ts + real.ts + 把设计稿 data.js 拷成 mock/data.ts
6. **commit 6** — 阶段 3：Home 页移植（先用 mock 跑通）
7. **commit 7** — 阶段 3：Posts list + detail
8. **commit 8** — 阶段 3：Products list + detail
9. **commit 9** — 阶段 3：MediaList（新建）+ Podcast detail + Video detail
10. **commit 10** — 阶段 3：Pages list + detail
11. **commit 11** — 阶段 3：About
12. **commit 12** — 关掉 USE_MOCK，跑 real 数据，补缺漏字段
13. **commit 13** — admin app templates 同步（如果还在用）
14. **commit 14** — 删除 dead code（Tweaks、HomeCollage / HomeScroll 这些已被本仓库砍掉的，不要带过去）

---

## 7 · 验收清单（全部完成后）

### 功能
- [ ] 6 项导航：Home / Posts / Products / Media / Pages / About，无 Works / Videos / Podcast 单独入口
- [ ] `/media` 显示混合时间轴；`/media?filter=podcasts` 和 `/media?filter=videos` 工作
- [ ] 旧链接 `/blog/*` `/works/*` `/podcast/*` `/videos/*` 全部 301 到新位置
- [ ] Keystatic 后台 podcasts / videos / pages 新字段可用
- [ ] D1 远程数据库无 works 表
- [ ] `PUBLIC_USE_MOCK=1` 在 dev 模式工作，prod 强制 0

### 视觉
- [ ] 首页底色为米黄 paper-100，字体为衬线
- [ ] 暗色模式切换正常（深褐底 + 米黄字）
- [ ] 磁带 / 胶片格 / 邮票头像等装饰元素正确渲染
- [ ] 移动端响应式正常（< 640px、640-1024、> 1024）

### 性能
- [ ] LCP < 2.5s（含字体）
- [ ] CLS < 0.1
- [ ] 无 hydration warning
- [ ] Lighthouse SEO > 95

### 工程
- [ ] 无 console error / warning
- [ ] TypeScript 全绿
- [ ] `npm run legacy:build` 成功
- [ ] `wrangler deploy` 成功（preview）

---

## 8 · 已知风险与坑

1. **Tailwind 4 的 `@theme inline` 行为**——添加 `--color-paper-*` 后，shadcn 组件的 `bg-accent` 等类会自动跟随 token；不需要手改组件。
2. **Cloudflare Workers 不支持文件系统读取**——`createReader(process.cwd(), config)` 在生产环境**无法在 worker 里跑**。Keystatic Reader 只在 build 时执行（Astro 静态生成）。如果迁移后想 SSR，需要把数据从 D1 读，而非 mdoc。当前 Astro config 是 `adapter: cloudflare()`（SSR），但 blog/index.astro 这种页面是隐式预渲染的——**注意检查**所有用 reader 的页面是否都标 `export const prerender = true`。
3. **R2 图片字段**——设计稿用 `cover_color` + emoji 当占位；真实数据是 R2 URL。两套数据 shape 要在 `data-source/types.ts` 里统一抽象。
4. **字体加载阻塞**——首屏 6 套字体可能拖累 LCP。最坏情况下走 `font-display: swap` 即可，FOIT 比 FOUT 难看。
5. **CSP / 内联样式**——设计稿大量用 `style={{...}}` 内联样式。Cloudflare Pages 默认无 CSP 限制；如果未来开启 CSP，需要把内联样式抽到 CSS class 里。
6. **Keystatic 的 mdoc 字段不支持 array of object 的嵌套很深**——给 podcasts 加 chapters 时如果出问题，可以降级用 plain text JSON。

---

## 9 · 不在本次迁移范围

明确**不**做的事：
- ❌ Tweaks 面板（线上版不要）
- ❌ HomeCollage / HomeScroll 两个备选布局（已废）
- ❌ 设计稿 mock 数据中的虚假 MRR 数字、社交账号（生产环境留空或填真实数据）
- ❌ 新增 newsletter 订阅入口（PRD 里说引流到 Substack，那是另外的事）
- ❌ 后台权限 / 登录逻辑改造（apps/admin 现有的就够）

---

## 10 · 参考资料

- 本仓库设计稿入口：`Portfolio.html` → `src/app.jsx` → `src/homes.jsx` / `src/pages.jsx`
- 设计稿样式 token：`src/styles.css`
- 设计稿 mock 数据：`src/data.js`
- 目标项目 PRD：`docs/prd.md`
- 目标项目阶段任务清单：`docs/sankyu_cursor_stages.md`
- Keystatic schema：`keystatic.config.ts`
- D1 schema：`apps/admin/migrations/0001_init.sql`
- Astro 5 SSR + Cloudflare 文档：https://docs.astro.build/en/guides/integrations-guide/cloudflare/

---

_文档版本：v1 · 2026-05-23_
_作者：Claude（设计代理） · 审稿：Sankyu_
