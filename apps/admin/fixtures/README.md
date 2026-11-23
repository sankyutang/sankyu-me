# Local preview fixtures（不进生产）

仅用于本机 D1 预览真实文章排版。**不要**对 `--remote` 执行。

```bash
cd apps/admin
npm run db:migrate:local
wrangler d1 execute sankyume_admin --local --file=fixtures/local-preview-posts.sql
```

内容来自公开站点已发布文章元数据与正文摘录；不含未公开产品。
