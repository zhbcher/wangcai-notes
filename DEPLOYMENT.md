# 旺财笔记 Cloudflare 部署完整记录

**日期**: 2026-05-14
**账户**: `58b29ff2e26c0780393813fc02e8e7ee`
**API Token**: 环境变量 `CF_API_TOKEN` (不提交到仓库)

---

## 📦 资源清单

| 资源 | 标识符 | 状态 |
|------|--------|------|
| D1 数据库 | `wangcai-notes` (ID: `0a579342-7e9d-4af7-a64f-790c1ce8c594`) | ✅ 已创建 |
| 独立 Worker | `wangcai-admin` (`https://wangcai-admin.zhbcher.workers.dev`) | ✅ 已部署 |
| Pages 项目 | `wangcai-notes-2026` | ✅ 已创建 (GitHub 绑定) |

---

## 🗄️ D1 数据库操作

### 创建数据库
```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/58b29ff2e26c0780393813fc02e8e7ee/d1/database" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "wangcai-notes"}'
```

**响应**: `{"result": {"uuid": "0a579342-7e9d-4af7-a64f-790c1ce8c594"}, "success": true}`

### 创建表 `notes`
```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/58b29ff2e26c0780393813fc02e8e7ee/d1/database/0a579342-7e9d-4af7-a64f-790c1ce8c594/query" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sql": "CREATE TABLE IF NOT EXISTS notes (id TEXT PRIMARY KEY, path TEXT UNIQUE, title TEXT, content TEXT, status TEXT, review TEXT, created_at INTEGER, updated_at INTEGER)"}'
```

### 创建表 `audit_log`
```bash
curl -X POST ".../query" \
  -d '{"sql": "CREATE TABLE IF NOT EXISTS audit_log (id INTEGER PRIMARY KEY AUTOINCREMENT, note_id TEXT, action TEXT, by TEXT, comment TEXT, created_at INTEGER)"}'
```

---

## 🌟 独立 Worker 部署

**配置** (`wrangler-admin.toml`):
```toml
name = "wangcai-admin"
main = "worker-handler.js"
compatibility_date = "2025-05-14"
account_id = "58b29ff2e26c0780393813fc02e8e7ee"

[[d1_databases]]
binding = "DB"
database_id = "0a579342-7e9d-4af7-a64f-790c1ce8c594"
database_name = "wangcai-notes"
```

**部署命令**:
```bash
CF_API_TOKEN=$CF_API_TOKEN wrangler deploy --config wrangler-admin.toml
```

**输出**:
```
Uploaded wangcai-admin
Deployed wangcai-admin triggers
  https://wangcai-admin.zhbcher.workers.dev
```

---

## 📝 管理后台页面

- 路径: `/admin`
- 密码: `wangcai-admin-2026` (前端硬编码，正式环境请改为 OAuth)
- API 端点: `https://wangcai-admin.zhbcher.workers.dev/api/notes`

---

## ⏳ 待办

- [ ] Pages 项目构建完成后，绑定自定义域名 `wangcai.19780918.XYZ`
- [ ] 验证管理后台完整流程
- [ ] 考虑将静态站点也迁移到 Worker（可选）

---

## 时间线

- 22:57 - 开始部署
- 22:58 - 创建 D1（当前账户）
- 23:05 - 独立 Worker 部署成功
- 23:06 - 代码推送到 GitHub
