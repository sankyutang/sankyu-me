你现在是我的资深全栈工程师，请直接为我生成一个可运行、可部署、可扩展的个人品牌网站项目，项目名为 sankyu.me。
请严格按照下面的 PRD、技术栈、目录结构、数据模型、页面需求、代码规范来生成代码。

1. 项目目标

sankyu.me 是我的主站，不是 newsletter 站。

站点职责：

展示我的个人品牌
发布日常博客 / 长文内容
展示我的产品（如 Notion 模板、数字产品、工具）
展示播客内容
承接 SEO 流量
将用户引导到我的 Substack newsletter 子域名订阅
站点定位

这是一个偏“一人公司 / 独立开发者 / AI 创作者 / 系统搭建者”的个人官网。
整体气质要求：

简洁
高级
专业
克制
有产品感
不要太花哨
偏现代 SaaS / creator brand 风格
2. 技术栈

请使用以下技术栈生成项目：

前端
Next.js 15+（App Router）
TypeScript
Tailwind CSS
shadcn/ui
Lucide React
CMS / 内容管理
Payload CMS（与 Next.js 集成）
PostgreSQL
媒体存储
Cloudflare R2
部署
面向 Coolify 自托管部署
支持 Docker 部署
支持环境变量配置
其他要求
SEO 完整
支持 sitemap
支持 RSS（主站博客 RSS）
支持 Open Graph
支持 robots.txt
支持暗色模式
支持响应式
支持文章、产品、播客详情页的动态路由
支持草稿与发布状态
支持后台管理内容
3. 站点信息架构

站点主结构如下：

/ 首页
/blog 博客列表页
/blog/[slug] 博客详情页
/products 产品列表页
/products/[slug] 产品详情页
/podcast 播客列表页
/podcast/[slug] 播客详情页
/about 关于页
/now 当前状态页
/uses 工具栈页
/links 链接聚合页
/newsletter newsletter 引导页（跳转或引导到 Substack）
/search 搜索页（站内搜索，前期可先做本地搜索）
/admin Payload Admin
/api/* 必要 API
4. 产品分工逻辑
主站 sankyu.me

负责：

品牌展示
博客 / 日常 / 长文
产品展示
播客展示
SEO 内容
导流到 newsletter
Substack 子域名

例如：

newsletter.sankyu.me

负责：

专业 newsletter 内容
订阅
邮件触达
系列深度内容

所以主站中需要多处出现 newsletter CTA，但不要把 newsletter 内容系统直接做进主站。

5. 核心页面需求
5.1 首页 /

首页是最重要页面，要有明显的个人品牌感和产品转化感。

首页模块结构
Hero 区域
Featured Products 精选产品
Latest Writing 最新文章
Podcast / Audio 最新播客
Newsletter CTA
About Preview
Footer
Hero 区域要求

内容包括：

主标题
副标题
两个 CTA 按钮
查看产品
订阅 Newsletter
右侧可放个人品牌介绍卡片 / 状态面板 / 视觉占位
Hero 文案默认值建议
Title: Build a one-person company with systems, AI, and leverage.
Subtitle: I write about Notion systems, AI workflows, indie building, and creator business.
CTA 1: Explore Products
CTA 2: Join Newsletter
首页行为要求
展示最新 3 篇博客
展示精选 3 个产品
展示最新 2 个播客
展示 newsletter 区块
支持 CMS 配置首页 hero 内容和 featured 项
5.2 博客列表页 /blog

要求：

展示已发布文章
支持按分类筛选
支持按标签筛选
支持分页或加载更多
每篇文章卡片展示：
封面图
标题
摘要
日期
分类
标签
阅读时间
5.3 博客详情页 /blog/[slug]

要求：

支持富文本渲染
支持目录 TOC
支持上一篇 / 下一篇导航
支持相关文章推荐
文章底部加入 newsletter CTA
SEO 完整
显示发布时间、更新时间、阅读时间
支持封面图
支持富媒体块（图片、引用、代码块、按钮等）
支持草稿预览
5.4 产品列表页 /products

要求：

展示所有产品
可按状态筛选：
active
coming-soon
archived
可按产品类型筛选：
notion-template
digital-product
software
service
other
产品卡片显示：
封面
名称
简介
标签
状态
外链按钮
5.5 产品详情页 /products/[slug]

要求：

产品 Hero
产品介绍
功能亮点
适合谁
常见问题 FAQ
外部购买按钮
可关联相关文章
可关联 newsletter CTA

适合做我的 Notion 模板、数字产品展示页。

5.6 播客列表页 /podcast

要求：

展示所有播客
每个卡片显示：
标题
摘要
发布时间
时长
封面
支持跳详情页
5.7 播客详情页 /podcast/[slug]

要求：

展示音频播放器
Show Notes
外部收听链接
封面
发布时间
时长
可关联文章
5.8 About 页 /about

要求：

介绍我是谁
我在做什么
我的方向
我的主要产品 / 项目
CTA：订阅 newsletter / 查看产品
5.9 Now 页 /now

要求：

这是一个“当前在做什么”的独立页面
适合简洁更新当前关注点
内容从 CMS 管理
5.10 Uses 页 /uses

要求：

展示我的常用工具、软件、设备、工作流
分类别展示
可在 CMS 中管理
5.11 Links 页 /links

要求：

作为个人品牌链接聚合页
包含：
Newsletter
X / Twitter
小红书
产品链接
其他链接
页面风格可更简洁移动端友好
5.12 Newsletter 引导页 /newsletter

要求：

这是一个桥接页，不自己做 newsletter 系统
页面内容：
newsletter 介绍
为什么订阅
订阅后能获得什么
进入 Substack 的按钮
同时可支持直接重定向配置
6. CMS 数据模型

请在 Payload 中实现以下 collections / globals。

6.1 Collection: Posts

用于博客 / 长文 / 日常记录。

字段：

title : text, required
slug : text, required, unique
excerpt : textarea
coverImage : upload relation
content : richText, required
status : select
draft
published
publishedAt : date
updatedAtCustom : date
category : relationship -> Categories
tags : relationship -> Tags, hasMany
featured : checkbox
readingTime : number or auto-generated
seoTitle : text
seoDescription : textarea
ogImage : upload relation
canonicalUrl : text
newsletterCTAEnabled : checkbox
relatedPosts : relationship -> Posts, hasMany

要求：

只有 published 状态在前台可见
支持后台预览
自动根据标题生成 slug（可手动修改）
自动维护 createdAt / updatedAt
6.2 Collection: Products

用于产品展示。

字段：

name : text, required
slug : text, required, unique
summary : textarea
coverImage : upload relation
gallery : upload relation, hasMany
content : richText
status : select
active
coming-soon
archived
productType : select
notion-template
digital-product
software
service
other
priceText : text
externalUrl : text
ctaText : text
featured : checkbox
tags : relationship -> Tags, hasMany
highlights : array
title
description
audience : array
label
faq : array
question
answer
relatedPosts : relationship -> Posts, hasMany
seoTitle
seoDescription
ogImage
6.3 Collection: Podcasts

字段：

title
slug
excerpt
coverImage
audioFile : upload relation or external audio URL
audioUrl : text
duration : text
publishedAt : date
content : richText
showNotes : richText
status : select
draft
published
externalLinks : array
platform
url
relatedPosts : relationship -> Posts, hasMany
seoTitle
seoDescription
ogImage
6.4 Collection: Pages

用于 About / Now / Uses / Links / 其他静态页。

字段：

title
slug
content
pageType : select
about
now
uses
links
custom
seoTitle
seoDescription
ogImage
status
draft
published
6.5 Collection: Categories

字段：

name
slug
description
6.6 Collection: Tags

字段：

name
slug
6.7 Collection: Media

用于 Cloudflare R2 文件上传。

字段：

alt
caption
文件本体

要求：

使用 Cloudflare R2 作为上传存储
返回可公开访问的文件 URL
支持图片类型
为前台图片组件提供 URL
6.8 Global: Site Settings

字段：

siteName
siteUrl
siteDescription
defaultSeoTitle
defaultSeoDescription
defaultOgImage
logo
favicon
mainNav : array
label
href
footerNav : array
label
href
socialLinks : array
platform
url
newsletterTitle
newsletterDescription
newsletterUrl
heroTitle
heroSubtitle
heroPrimaryCtaLabel
heroPrimaryCtaHref
heroSecondaryCtaLabel
heroSecondaryCtaHref
7. Cloudflare R2 集成要求

请实现 Payload Media 上传到 Cloudflare R2。

要求支持以下环境变量：

R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_URL=
R2_REGION=auto

要求：

上传媒体时写入 R2
前台展示时使用 R2_PUBLIC_URL
图片 URL 可直接用于 Next/Image
在 next.config 中配置远程图片域名
代码结构清晰，便于后续替换存储方案
8. 页面 UI 风格要求

整体设计要求：

极简
高质感
大留白
清晰层级
适合个人品牌
不要做成企业官网模板味太重
不要土味博客
不要炫技式动效过多
视觉参考方向

偏以下混合风格：

现代独立开发者个人站
轻 SaaS 落地页
内容创作者品牌站
Apple / Vercel / Linear 风格里的克制感
组件要求

请优先抽出可复用组件：

SiteHeader
SiteFooter
HeroSection
SectionHeading
PostCard
ProductCard
PodcastCard
NewsletterCTA
RichTextRenderer
TagList
TOC
Pagination
ThemeToggle
9. SEO 要求

必须完整实现：

动态 metadata
sitemap
robots.txt
Open Graph
Twitter Card
canonical
JSON-LD（至少博客文章和产品页）
RSS feed for blog
博客文章页 SEO

每篇文章需要：

title
description
og image
published time
modified time
author
article schema
产品页 SEO

每个产品页需要：

title
description
og image
product schema（基础即可）
10. 搜索功能

请实现基础站内搜索。

优先方案：

本地搜索索引
支持搜索 Posts / Products / Podcasts / Pages
简单可用即可

可以先不接第三方搜索服务。

11. 权限与后台要求

后台仅管理员可访问。

基础要求：

Payload Admin 登录
使用本地管理员账号
支持创建默认管理员
支持内容草稿与发布

可以不做复杂 RBAC，但代码结构要可扩展。

12. 开发优先级

请按以下优先级生成完整项目：

Phase 1
Next.js + Payload 基础集成
PostgreSQL 连接
Payload Admin
Site Settings Global
Media 上传到 R2
Posts collection
Blog 列表页 + 详情页
首页基础版
SEO 基础
Docker 部署基础
Phase 2
Products collection
Products 列表页 + 详情页
首页精选产品
Newsletter CTA
About / Now / Uses / Links 页面
RSS / sitemap / robots
Phase 3
Podcasts collection
Podcast 列表页 + 详情页
搜索页
JSON-LD
UI 打磨
草稿预览优化
13. 代码目录结构要求

请尽量使用下面这种目录结构：

src/
  app/
    (site)/
      page.tsx
      blog/
        page.tsx
        [slug]/page.tsx
      products/
        page.tsx
        [slug]/page.tsx
      podcast/
        page.tsx
        [slug]/page.tsx
      about/page.tsx
      now/page.tsx
      uses/page.tsx
      links/page.tsx
      newsletter/page.tsx
      search/page.tsx
    (payload)/
      admin/[[...segments]]/page.tsx
      api/[...slug]/route.ts

  components/
    layout/
    sections/
    cards/
    ui/
    richtext/

  lib/
    payload/
    seo/
    search/
    utils/

  payload/
    collections/
    globals/
    blocks/
    hooks/
    access/

  styles/

public/
14. 工程要求

请保证项目具备以下特性：

TypeScript 类型尽量完整
组件化清晰
不要把所有逻辑写在 page 里
使用 Server Components 为主
只有必要时使用 Client Components
尽量减少不必要依赖
代码可维护
变量命名清晰
提供基础注释
环境变量统一管理
错误处理清晰
空状态页面要好看
加载态要简洁
404 页面要有品牌感
15. 需要生成的文件内容

请直接生成完整可运行项目代码，包括但不限于：

package.json
next.config.*
tsconfig.json
tailwind.config.*
postcss.config.*
payload.config.ts
所有 collections / globals
R2 上传适配代码
所有页面代码
基础组件代码
SEO 工具函数
RSS / sitemap / robots 相关代码
Dockerfile
.env.example
docker-compose.yml（至少包含 app + postgres）
README.md
16. 环境变量要求

请提供 .env.example，至少包括：

NODE_ENV=development

DATABASE_URI=postgresql://postgres:postgres@localhost:5432/sankyu
PAYLOAD_SECRET=change-me
NEXT_PUBLIC_SITE_URL=http://localhost:3000

R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_URL=
R2_REGION=auto

SITE_NAME=sankyu.me
NEWSLETTER_URL=https://newsletter.sankyu.me
17. Docker / Coolify 要求

请确保项目可以被 Coolify 正常部署。

要求：

提供 Dockerfile
提供 docker-compose.yml
App 使用 npm run build 后生产启动
PostgreSQL 独立服务
文件与环境变量适合 Coolify 映射
如有需要，说明持久化卷建议
18. 默认内容种子数据

请生成最小可用 seed 逻辑或示例数据，包含：

1 个 Site Settings 默认配置
3 篇示例博客
2 个示例产品
1 个示例 About 页
1 个示例 Now 页
1 个示例 Uses 页
1 个 Links 页
1 个示例 Podcast

要求前台启动后不至于空白。

19. 首页文案默认值

请在默认 seed 中填入以下站点语气的英文文案，后续我再改：

Hero
Title: Build a one-person company with systems, AI, and leverage.
Subtitle: I write about Notion systems, AI workflows, indie building, creator business, and digital products.
Primary CTA: Explore Products
Secondary CTA: Join Newsletter
Newsletter section
Title: Get sharper ideas in your inbox.
Description: Deep dives on systems, AI workflows, leverage, and building a modern one-person business.
20. 代码生成要求

请不要只输出 demo。
请直接按“可以本地运行 + 可以接着开发 + 可以部署到 Coolify”的标准生成项目。

输出要求：

先生成完整项目结构说明
再逐步生成核心代码文件
确保依赖关系正确
确保代码彼此可拼接运行
如果内容过长，请分批次持续输出，不要省略关键文件
所有代码以生产可用为目标，而不是仅示意
如果某些库版本可能冲突，请选稳定组合
优先保证“能跑起来”
21. 额外实现偏好

请额外遵循以下偏好：

默认暗色模式跟随系统，可手动切换
博客文章页有优雅的正文排版
首页不要做传统博客首页，要更像个人品牌落地页
产品页更偏转化页
Newsletter CTA 在首页、文章页、产品页都出现
Links 页在移动端非常好用
About 页不要太简陋，要体现品牌故事感
代码风格现代，不要老旧模板风格
22. 你应该如何执行

请按照以下执行方式输出：

第一步

输出完整项目结构树 + 依赖说明 + 架构说明

第二步

生成配置文件和基础框架代码

第三步

生成 Payload collections / globals / config

第四步

生成页面、组件、工具函数

第五步

生成 Docker、README、env、seed 数据

不要只给思路，请直接开始写代码。

23. 如果需要技术决策，请优先采用以下方案
Next.js App Router
Payload 官方推荐集成方式
PostgreSQL
Cloudflare R2 用于媒体
shadcn/ui + Tailwind 作为 UI 基础
文章内容使用 Payload rich text
搜索先做简版本地搜索
RSS 使用服务端生成
sitemap / robots 使用 Next.js 原生方式或兼容最佳实践
部署以 Docker / Coolify 为准
24. 最终结果要求

我希望最终生成的是一个：

有后台
有博客
有产品页
有播客页
有 About / Now / Uses / Links
有 SEO
有 R2 文件上传
有 Docker 部署
可以直接继续迭代

的完整项目。

请现在开始直接生成代码，不要只停留在方案层。