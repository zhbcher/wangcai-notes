# HyperFrames 基础教程

HyperFrames 是 OpenClaw 的视频合成技能，用于创建 HTML 动画视频。

## 简介

HyperFrames 基于 Web 技术，支持：
- 文本动画
- 图形过渡
- 音频同步
- GPU 加速渲染

## 快速例子

```html
<script setup>
import { useFrame } from '@hyperframes/core'
</script>

<template>
  <div class="scene">
    <h1>Hello HyperFrames!</h1>
  </div>
</template>
```

## 学习路径

1. 了解 [Composition 概念](composition.md)
2. 学习 [动画时间轴](timelines.md)
3. 掌握 [音频响应](audio-reactive.md)

## 参考

- [官方文档](https://hyperframes.dev)
- [示例仓库](https://github.com/hyperframes/examples)
