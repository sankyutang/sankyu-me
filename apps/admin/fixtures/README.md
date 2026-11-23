# Local preview fixtures（不进生产）

仅用于本机 D1 预览真实文章排版。**不要**对 `--remote` 执行。

```bash
cd apps/admin
npm run db:migrate:local
wrangler d1 execute sankyume_admin --local --file=fixtures/local-preview-posts.sql
```

内容来自公开站点已发布文章元数据与正文摘录；不含未公开产品。

## 北海道游记全文预览

```bash
# 1) 将图片放到本地静态目录（勿提交大图；见 .gitignore）
mkdir -p public/hokkaido-preview
cp -a /path/to/hokkaido-migration/images public/hokkaido-preview/

# 2) 写入本地 D1（路径指向 /hokkaido-preview/images/…）
wrangler d1 execute sankyume_admin --local --file=fixtures/hokkaido-preview-post.sql

# 3) build + pages preview 后打开
#    /render/posts/travel-in-Hokkaido-japan
```

离线 HTML 包（含相对路径图片）由仓库根目录
`node scripts/hokkaido-preview/build-preview.mjs` 生成，不依赖持续运行的 localhost。
