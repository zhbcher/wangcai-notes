# 审核工作流

## 流程概述

1. 旺财创建笔记（`status: draft`, `review: pending`），提交 PR
2. 老板在 PR 中评论审核意见
3. 旺财根据意见修改或等待发布
4. 老板审核通过后，修改 Frontmatter 状态并合并到 main
5. Cloudflare Pages 自动部署

## 四种审核结果

| 状态 | 说明 | Frontmatter |
|------|------|-------------|
| 对外发布 | 公开可见 | `status: public`, `review: approved` |
| 不对外发布 | 仅内部可见 | `status: private`, `review: approved` |
| 退回重编 | 需修改 | `status: draft`, `review: rejected` + 评论 |
| 删除不重编 | 归档 | 删除文件或 `status: rejected` |

## 预览方式

- 本地：`npm run dev` 查看 `http://localhost:5173`
- PR 预览：GitHub PR 自动生成 Pages 预览 URL（后续配置）
