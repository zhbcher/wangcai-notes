# 旺财笔记管理后台配置

## 1. 独立 Worker API

管理后台 API 已部署为独立 Cloudflare Worker：
- URL: https://wangcai-admin.zhbcher.workers.dev
- 认证: `Authorization: Bearer wangcai-admin-2026`
- 端点:
  - `GET /api/notes` - 获取所有笔记
  - `POST /api/notes` - 创建/更新笔记
  - `POST /api/notes/:id/status` - 更新状态

## 2. 密码

管理后台登录密码: `wangcai-admin-2026`

## 3. 使用

访问 `/admin` 页面即可使用。

## 4. 说明

- D1 数据库绑定在 Worker 部署时完成
- 如需修改 API 地址，编辑 `docs/admin/index.md` 中的 `API_BASE`
