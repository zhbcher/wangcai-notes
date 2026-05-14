---
title: "SPM 技能使用指南"
date: 2026-05-14
status: "public"
review: "approved"
---

# SPM 技能使用指南

SPM（Super Project Manager）是 OpenClaw 的生产级项目管理技能，专为软件开发生命周期设计。

## 何时使用 SPM

- 🚀 启动新项目（从零到部署）
- 🔧 实现复杂多文件功能
- 📋 需要质量门控、代码审查、TDD 的工作
- 💡 多步骤或跨会话的任务

**不适用场景**：
- 单行 typo 修复
- 简单一文件修改
- 纯头脑风暴无执行意图

---

## SPM 五大阶段

| 阶段 | 名称 | 描述 | 产出 |
|------|------|------|------|
| 1 | Requirement | 需求澄清 + 灵魂拷问 | Design Doc |
| 2 | Planning | WBS 任务分解 | Ledger |
| 3 | Execution | 自动开发（Subagent） | Working code |
| 4 | Quality | 三级质量门控 | Verified build |
| 5 | Delivery | 交付部署 | Production |

---

## 核心工件：WBS Ledger

WBS Ledger 是项目的**单一事实来源**，位于 `docs/spm/ledger.md`。

```markdown
| ID | Work Package | Dependencies | Context Brief | Exit Criteria | Evidence | Status |
|----|-------------|-------------|---------------|---------------|----------|--------|
| 1  | DB Schema   | -           | ...           | 迁移脚本执行  | ✅ OK    | done   |
```

**状态**：`todo` | `doing` | `done` | `blocked` | `skipped`  
**铁律**：`done` 必须有 Evidence（命令输出、文件 diff、测试结果）。

---

## 快速开始

在 OpenClaw 聊天中说：

> 用 SPM 帮我做一个 JWT 用户认证系统（Node.js + Express）

SPM 会自动：

1. **灵魂拷问**：提出 3 个关键问题澄清范围
2. **设计文档**：生成架构方案，等待你确认
3. **WBS 计划**：分解任务，查看并确认
4. **自动执行**：创建 worktree、派 subagent、TDD 循环
5. **质量检查**：三级门控（功能、代码、测试覆盖率）
6. **交付**：完成分支合并，可选部署

---

## 审核结果

- ✅ 通过并对外发布
- ✅ 通过但不对外发布
- ↩️ 退回重编
- ❌ 删除不重编

---

## 更多资源


- [WBS 任务表示例](/spm/ledger.md)
- [设计文档模板](/spm/design.md)
