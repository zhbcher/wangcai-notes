# 旺财笔记 — 设计文档

## 1. 项目概述
旺财笔记是一个由旺财编写内容、老板审核发布的文档网站。使用 VitePress 构建，托管在 Cloudflare Pages，域名 `wangcai.19780918.XYZ`。

## 2. 技术选型
| 组件 | 方案 | 理由 |
|------|------|------|
| 静态生成器 | VitePress | Vue 生态成熟，Markdown 支持好，搜索内置 |
| 托管 | Cloudflare Pages | 免费、自动 CI/CD、支持自定义域名 |
| 域名 | Cloudflare DNS | 已托管，可免费 HTTPS |
| 数据存储 | Cloudflare D1 (SQLite) | 无国内访问问题，SQL 操作 |
| 搜索 | VitePress 本地搜索 | 无需后端，支持中文 |
| 评论 | 无 | 不需要 |
| 分析 | 无 | 不需要 |

## 3. 内容架构
```
docs/
├── guide/              # 指南类
│   ├── quick-start.md
│   └── ...
├── tutorials/          # 教程类
├── reference/          # 参考
├── about.md            # 关于
└── index.md            # 首页
```
每个笔记文件使用 Frontmatter：
```yaml
---
title: "笔记标题"
date: 2026-05-14
status: "draft" | "public" | "private" | "rejected"
review: "pending" | "approved" | "rejected"
---
```

## 4. 审核工作流（4种结果）
1. **审核通过 → 对外发布**：`status: public` → 生产环境可见
2. **审核通过 → 不对外发布**：`status: private` → 仅内部预览，不公开
3. **退回重新编辑**：`status: draft` + 评论指出修改意见
4. **删除不重编辑**：文件删除或 `status: rejected` 并归档

实现方式：使用管理后台（/admin），旺财编写笔记上传至 D1 → 老板在后台审核并更新 D1 状态 → Cloudflare Pages 构建时读取 D1 状态并合并到 Frontmatter → 自动部署。

## 5. 主题设计（旺财风格）
- 主色调：橙色/金色（旺财配色）
- Logo: 旺财图标 + 文字
- 字体：系统默认，优先中文
- 布局：左侧导航，右侧内容，顶部搜索
- 暗黑模式：自动跟随系统

## 6. 部署流水线
1. 本地：`npm run dev` 预览
2. 旺财上传笔记至 Cloudflare D1（通过管理后台）
3. 老板在管理后台审核，更新 D1 状态
4. Cloudflare Pages 自动构建（`npm run build`），构建脚本从 D1 读取状态并注入 Frontmatter
5. 构建产物 `.vitepress/dist` 部署到 CDN
6. 自定义域名 `wangcai.19780918.XYZ` 自动生效

## 7. 里程碑
- M1: 项目初始化 + 主题配置完成（可本地运行）
- M2: Cloudflare Pages 部署成功 + 域名绑定
- M3: 第一条笔记编写 + 审核流程跑通
- M4: 搜索优化 + 美化完成
- M5: 项目交付验收

## 8. 风险与缓解
- Cloudflare API token 权限不足 → 确保有 D1 Write、Pages Edit 权限
- 中文搜索效果差 → 使用 Pagefind 增强（可选）
- 多作者冲突 → D1 事务控制 + 乐观锁

## 9. 下一步
等待老板审批设计文档 → 进入 Phase 2 执行 WBS 任务 1
