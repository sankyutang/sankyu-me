# 首页视觉提案（参考稿）

用户已选定 **B（文章 + 合作侧栏）**。正式实现见 `apps/admin` 公开渲染路径（`PaperLayout` / `Home.astro` 等），本目录保留为审阅对照，**不部署**。

方向：**阅读体验优先 + 克制清晰的业务入口**。

## 预览

用浏览器直接打开（可双击，无需构建）：

| 版本 | 文件 | 布局要点 |
|------|------|----------|
| **A** | [`version-a-quiet-reading.html`](./version-a-quiet-reading.html) | 安静单栏阅读，文章居中为核心 |
| **B** | [`version-b-editorial.html`](./version-b-editorial.html) | 编辑式首页，桌面双栏 + 侧边轻量合作入口 |
| 索引 | [`index.html`](./index.html) | A/B 入口页 |

## 内容说明

- 文章标题、日期、摘要、链接均来自公开站点真实数据
- 业务入口指向现有 [关于页](https://sankyu.me/about)
- **未**提及未公开产品；**无**虚构客户/收入/案例/订阅数
- **无**表单提交或数据收集

## 审阅方式

本地打开 HTML 比较 A/B；截图见 PR 描述与 `/opt/cursor/artifacts`（云端运行产出）。  
**本 PR 仅为视觉提案，请勿合并部署。**
