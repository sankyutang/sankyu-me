# sankyu.me Cursor 分阶段 PRD

> 本文件用于 Cursor 分阶段生成项目，提升成功率与稳定性

------------------------------------------------------------------------

# 🧩 Stage 1：基础项目骨架

## 目标

生成一个可运行的 Next.js + Payload + PostgreSQL 项目骨架。

## 要求

-   Next.js 15 App Router
-   TypeScript
-   Tailwind + shadcn/ui
-   Payload 集成（最简 config）
-   PostgreSQL 连接
-   /admin 可访问
-   Dockerfile + docker-compose
-   .env.example

## 输出

-   项目结构
-   基础配置文件
-   Payload 启动成功
-   首页能访问

------------------------------------------------------------------------

# 🧠 Stage 2：Payload Schema（核心）

## 目标

实现完整 CMS 数据结构

## Collections

-   Posts
-   Products
-   Podcasts
-   Pages
-   Categories
-   Tags
-   Media（R2）

## Globals

-   SiteSettings

## 关键要求

-   slug 自动生成
-   draft / published
-   关系字段
-   SEO字段
-   featured字段
-   R2 上传支持

------------------------------------------------------------------------

# 🎨 Stage 3：页面与 UI

## 目标

完成核心页面

## 页面

-   首页
-   /blog
-   /blog/\[slug\]
-   /products
-   /products/\[slug\]
-   /about
-   /now
-   /uses
-   /links

## 组件

-   Hero
-   PostCard
-   ProductCard
-   NewsletterCTA
-   Header / Footer

## 要求

-   响应式
-   暗黑模式
-   干净高级 UI

------------------------------------------------------------------------

# 🔍 Stage 4：SEO + 增长能力

## 要求

-   metadata
-   sitemap
-   robots.txt
-   RSS
-   OpenGraph
-   JSON-LD

## 页面增强

-   博客 TOC
-   相关文章
-   Newsletter CTA

------------------------------------------------------------------------

# 🚀 Stage 5：完善系统

## 功能

-   搜索（本地）
-   Podcast 页面
-   Seed 数据
-   404 页面
-   Loading 状态

------------------------------------------------------------------------

# 🐳 Stage 6：部署

## 要求

-   Dockerfile
-   docker-compose（含 postgres）
-   Coolify 可部署
-   环境变量完整

------------------------------------------------------------------------

# 📌 使用方法（给 Cursor）

每次只执行一个 Stage：

例如：

👉 "请执行 Stage 1，生成完整代码"

完成后再继续：

👉 "继续 Stage 2"

------------------------------------------------------------------------

# ✅ 最终目标

生成一个：

-   可运行
-   有后台
-   有博客
-   有产品
-   有 SEO
-   可部署

的完整网站系统。
