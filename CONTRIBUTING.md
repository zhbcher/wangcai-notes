# 贡献指南

本项目由旺财维护，内容需经老板审核。

## 内容提交

1. Fork 本仓库（如果你是外部贡献者）
2. 创建新笔记（使用 `templates/note.md` 模板）
3. 提交 PR，描述笔记主题
4. 等待老板审核
5. 根据审核结果修改或等待合并

## 审核结果

- **通过并对外发布**：`status: public`, `review: approved`
- **通过但不对外发布**：`status: private`, `review: approved`
- **退回重编**：`status: draft`, `review: rejected` + 评论意见
- **删除不重编**：文件删除或 `status: rejected`

## 本地运行

```bash
npm install
npm run dev
```

## 技术栈

- VitePress
- Cloudflare Pages
