# huashu-redesign · 三方向视觉提案

仅预览，**不部署、不改生产模板**。用 [huashu-design v3.5.0](https://github.com/alchaincyf/huashu-design) 窄桥流程产出。

## 打开

- 比较页：`index.html`
- DIR-1 指令报章：`dir-1.html`
- DIR-2 错位工场：`dir-2.html`
- DIR-3 珠江夜志：`dir-3.html`

## 方法摘要

1. `HUASHU_DESIGN_HOME=<repo>/.huashu-design`（工作区本地）
2. `learn.py` / `design_lint.py ledger` / `capabilities.py` → T0（SVG/CSS，无云生图）
3. 六候选 → 三骨架（见 `directions.md`）
4. `design_lint.py check` 红灯已清；`polish.py shot` + `polish-log.md`

skill 本体在本地 `.agents/skills/huashu-design`（不进 git）；`skills-lock.json` 锁 commit。
