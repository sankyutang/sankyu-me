# 北海道游记正式导入方案（未执行）

> 状态：**仅计划**。本次未写入生产 D1 / R2，未改 Notion，未 merge 发布。

## 目标

把 Notion 保真正文 + 119 张本地原图写入现网同 slug 文章，替换占位段，保留：

| 项 | 值 |
|----|----|
| URL / slug | `/posts/travel-in-Hokkaido-japan`（大小写不变） |
| 发布日期 | `2013-02-02` |
| 作者 | 三桥（现网硬编码；Notion 无作者字段，不删除） |
| 摘要 | 南方的孩子冬天去看雪 |
| 分类 | 心情随笔 |
| 标签 | 旅行、日本、北海道、冬天 |
| 封面 | 无独立封面（不用 Notion Unsplash） |
| 正文 | 全文词句与顺序；123 图片位置；5 次热气球 GIF；文末猫头鹰 `119.png` |

## 推荐步骤

1. **备份（可回滚）**
   - 导出生产 D1 该行：`SELECT * FROM posts WHERE slug = 'travel-in-Hokkaido-japan'` → 存为 `backup/posts-travel-in-Hokkaido-japan-before.json`
   - 若 R2 已有该页 HTML：复制 `posts/travel-in-Hokkaido-japan/index.html` → `__rollback/posts/travel-in-Hokkaido-japan/index.html.before-<commit>.html`
2. **上传图片到 R2**
   - 键建议：`editor/2013/02/hokkaido/001.gif` … `119.png`（或同等稳定前缀）
   - 原样上传，不裁剪水印、不强压画质；GIF/猫头鹰保持原始尺寸
3. **改写 Markdoc 内图片路径** 为 `https://sankyu.me/editor/2013/02/hokkaido/…`（或站点根相对路径）
4. **更新 D1 `posts` 行**（仅此 slug）
   - `content_markdoc` = 预览包 `source/content.markdoc`（路径已换成 R2）
   - `excerpt` / `seo_description` = 摘要
   - `category` / `tags` / `published_at` / `cover_image=NULL` 如上表
5. **admin→R2 republish**（或至少重渲染该文章路径 + purge）
6. **验收**：正式 URL 200；123 处 `<img>`；日期/slug/作者不变；无 Unsplash 封面

## 回滚

1. 用步骤 1 的 JSON 写回 D1 该行  
2. 恢复 R2 HTML 备份（或再 republish 旧 content）  
3. 可选：删除新上传的 `editor/2013/02/hokkaido/*`（不影响回滚阅读，仅清存储）

## 本地预览（已提供）

- 离线包：打开同目录 `index.html`（相对 `images/`）
- 或：`apps/admin/fixtures/hokkaido-preview-post.sql` + `public/hokkaido-preview/images` → 本地 wrangler pages 预览 `/render/posts/travel-in-Hokkaido-japan`

## 不在本次范围

- 不改订阅 / CF Access / 其他文章  
- 不把正文只写进 legacy `.mdoc` 当作上线  
- 不擅自去水印、不选照片做封面  
