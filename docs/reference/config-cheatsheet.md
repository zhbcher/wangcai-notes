# 配置速查表

常用 OpenClaw 配置项快速参考。

## 模型配置

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "nvidia-nvcf/stepfun-ai/step-3.5-flash"
      }
    }
  }
}
```

## 插件配置

```json
{
  "plugins": {
    "entries": {
      "active-memory": {
        "enabled": true
      }
    }
  }
}
```

## 记忆配置

```json
{
  "memory": {
    "backend": "builtin"
  }
}
```

## 完整示例

见 `openclaw.json` 示例文件。
