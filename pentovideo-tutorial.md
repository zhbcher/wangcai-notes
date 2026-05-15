# PentoVideo 技能教程 — AI视频工厂使用手册

> 全栈AI视频生产系统。四条输入线，全部经过 TTS 配音 → HyperFrames HTML 渲染 → MP4 输出。

---

## 目录

1. [什么是 PentoVideo](#1-什么是-pentovideo)
2. [四条路线详解](#2-四条路线详解)
3. [前置门控系统（§0）](#3-前置门控系统0)
4. [A 线 8 阶段工作流](#4-a-线-8-阶段工作流)
5. [口播稿规范](#5-口播稿规范)
6. [时间轴引擎](#6-时间轴引擎)
7. [GSAP 动画约定](#7-gsap-动画约定)
8. [风格库](#8-风格库)
9. [工具脚本详解](#9-工具脚本详解)
10. [超帧 CLI 命令](#10-超帧-cli-命令)
11. [质量检查流程](#11-质量检查流程)
12. [项目结构示例](#12-项目结构示例)
13. [商汤生图使用](#13-商汤生图使用)
14. [PPT 转视频流程](#14-ppt-转视频流程)
15. [常见问题排查](#15-常见问题排查)

---

## 1. 什么是 PentoVideo

PentoVideo 是一个**HTML驱动**的全栈 AI 视频生产系统。它不是一个简单的脚本工具，而是一个完整的引擎——把"做视频"这件事拆解成标准化生产线。

### 核心理念

传统做视频的痛点：
- 前期信息不全就开干，九版返工
- 口播跟画面时长对不上，手工调半天
- AI 做视频像黑盒，你不知道它会产出什么

PentoVideo 的解法：
- **§0 门控**：信息不齐不让进下一步
- **字数比例时间轴引擎**：口播稿字数自动算出每页起止时间，无需 Whisper
- **四条清晰路线**：无论你手头有主题、PPT、图片还是只有想法，都有对应的生产线

### 一句话总结

> 把一句需求或一份材料丢进去，经过标准化流水线产出 MP4 成品视频。

---

## 2. 四条路线详解

PentoVideo 根据输入材料的不同，分为四条路线：

```
线A：需求 → HTML+CSS 动画 → 视频
线B：需求 → 商汤生图 → OCR 质检 → HTML → 视频
线C：PPT → 识图 → HTML → 视频
线D：图片 → 识图 → HTML → 视频
```

### 线A — 纯 CSS/HTML 动画（最常用）

**适用场景**：
- 产品介绍、功能讲解
- 概念科普、教程视频
- 封面、片头、品牌展示

**工作流程**：
1. 确定主题、受众
2. 编写口播稿
3. 设计每页视觉（HTML+CSS）
4. 生成配音 TTS
5. 时间轴自动对齐
6. 渲染输出

**优点**：控制力最强、品质最高、无需依赖生图质量

### 线B — 生图驱动

**适用场景**：
- 需要对白照片类画面
- 没有现成素材的场景
- 创意广告、概念演示

**工作流程**：
1. 确定主题、受众
2. 商汤生图（AI 生成画面）
3. OCR 质检（检查图片中文字是否正确）
4. 组装 HTML 页面
5. TTS 配音 → 渲染

**优点**：视觉质量超过纯 HTML，适合需要真实感画面的场景

### 线C — PPT 转视频

**适用场景**：
- 已有做好的 PPT 演示文稿
- 培训材料、汇报材料
- 不想重新设计，直接用 PPT 内容

**工作流程**：
1. 导入 PPT/PDF
2. LibreOffice 转换为 PNG 图片
3. OCR 识别图片中的文字
4. 与原稿对齐
5. 生成 HTML + 配音 → 渲染

**优点**：复用现成材料，效率最高

### 线D — 图片序列转视频

**适用场景**：
- 已有成套图片素材
- 产品图集、作品展示
- 照片轮播

**工作流程**：
1. 导入图片序列
2. OCR 识别（如需要）
3. 组装 HTML → TTS → 渲染

**优点**：输入最简单，有图就能做

---

## 3. 前置门控系统（§0）

这是 PentoVideo **最重要的设计**。在 AI 动手做任何事之前，必须先确认以下信息：

| 编号 | 字段 | 是否必填 | 说明 |
|------|------|---------|------|
| 1 | **主题** | ✅ | 视频讲什么？一句话说清 |
| 2 | **受众** | ✅ | 给谁看？写清楚目标人群 |
| 3 | **路线** | ✅ | A/B/C/D 四条选一条 |
| 4 | **平台** | ✅ | 默认抖音横版（1920×1080） |
| 5 | **风格** | ✅ | 按受众推断，也可指定 |
| 6 | **时长目标** | 推荐 | 预期视频长度 |
| 7 | **底线/禁止内容** | 推荐 | 什么不能写/不能出现 |

**门控原则**：
- 三个必填项（主题、受众、路线）不齐，**严禁进入下一步**
- 这是把九版返工扼杀在第一关

---

## 4. A 线 8 阶段工作流

这是最核心的工作流，共有 8 个阶段，**每个阶段必须完成才能进入下一个**。

### 阶段1：需求确认

1.1 确认主题  
1.2 确认受众  
1.3 确认路线  
1.4 确认平台（分辨率、比例）  
1.5 确认风格（参考风格库）  
1.6 确认时长目标  
1.7 确认底线/禁止内容  

### 阶段2：内容研究

2.1 阅读官网、文档、README  
2.2 记录关键信息（数据、特点、流程）  
2.3 参考同类视频的结构和表达方式

### 阶段3：口播稿 + 逐页设计稿

3.1 编写口播稿（具体规范见下一节）  
3.2 审核口播稿（字数、语调、逻辑）  
3.3 编写 design.md（每页的视觉设计描述）  
3.4 审核设计稿

**产出文件**：
- `.pentovideo/narration.txt` — 原始口播稿
- `design.md` — 每页设计描述

### 阶段4：生成语音

4.1 剥离页码标记 → 纯口播文本  
4.2 使用 edge-tts 生成语音  
4.3 试听确认语音效果  
4.4 使用 ffprobe 确认语音总时长  
4.5 将口播稿按字数比例分配到每页

**剥离命令**：
```bash
sed '/^第[0-9]*页$/d;/^---$/d;/^$/d' narration.txt > narration_tts.txt
```

### 阶段5：编写 HTML

5.1 创建项目目录：`PentoVideo/YYYY-MM-DD_项目名/`  
5.2 复制模板 + gsap.js + media 目录  
5.3 按照 design.md 编写 HTML

**容器目录**：使用 `PentoVideo/` 目录统一管理所有项目。

### 阶段6：时间轴引擎

6.1 音频 `loadedmetadata` 事件触发  
6.2 引擎自动计算每页的开始时间和持续时长  
6.3 模板已内置，无需手动执行

### 阶段7：预览 + 渲染

7.1 `lint` — 检查 HTML 结构  
7.2 `inspect` — 至少采样 15 帧确认画面在变化  
7.3 `preview` — 浏览器预览  
7.4 `render --quality draft` — 草稿渲染  
7.5 `render --quality standard` — 正式渲染

### 阶段8：交付

8.1 `ffprobe` 验证视频时长和码率  
8.2 邮件发送给客户/自己

---

## 5. 口播稿规范

### 格式

```
第1页
正文内容不写符号

第2页
正文内容不写符号
```

### 严格规则

| 规则 | 错误 | 正确 |
|------|------|------|
| 纯文字，不写标点符号 | `你好，世界！——欢迎` | `你好世界欢迎` |
| 数字写全 | `408`，`99%` | `四百零八`，`百分之九十九` |
| 英文逐个大写 | `API` | `A P I` |
| 禁止 Emoji | `欢迎🎉` | `欢迎` |
| 禁止特殊符号 | `——` `……` `&` | 直接省略 |

### 为什么这么严格？

因为 TTS（文字转语音）工具不认识标点和符号，误读会导致口播效果很差。而时间轴引擎依赖字数比例来计算每页时长，所以必须保证字数准确。

---

## 6. 时间轴引擎

这是 PentoVideo 最有特色的设计。

### 基本原理

1. 每页口播稿长度（字数）提前放入 `data-page-text` 属性
2. 音频加载完成后，`loadedmetadata` 事件触发
3. 引擎读取音频总时长
4. 按每页字数占总字数的比例，分配时间

### 核心代码

```javascript
audio.addEventListener('loadedmetadata', function() {
  var totalDur = audio.duration;
  var totalChars = slides.reduce(function(s, el) {
    return s + el.getAttribute('data-page-text').length;
  }, 0);
  var cursor = 0;
  slides.forEach(function(el) {
    var dur = totalDur * (el.getAttribute('data-page-text').length / totalChars);
    el.setAttribute('data-start', cursor.toFixed(2));
    el.setAttribute('data-duration', dur.toFixed(2));
    cursor += dur;
  });
});
```

### 幻灯片切换

HyperFrames 运行时自动处理可见性控制：

```javascript
document.querySelectorAll('[data-start]').forEach(function(el) {
  var start = parseFloat(el.getAttribute('data-start'));
  var end = start + parseFloat(el.getAttribute('data-duration'));
  el.style.visibility = (currentTime >= start && currentTime < end)
    ? 'visible' : 'hidden';
});
```

### 优势
- **无需 Whisper**：不需要语音识别来对齐时间
- **自动匹配**：口播稿字数优化后，时间自然对齐
- **模板内置**：不需要手动写时间轴代码

### data 属性表

| 属性 | 用途 | 赋值方式 |
|------|------|---------|
| `data-page-text` | 口播稿每页文字 | 手动填写（用于字数比例计算） |
| `data-start` | 开始时间（秒） | 引擎自动赋值 |
| `data-duration` | 持续时间（秒） | 引擎自动赋值 |
| `data-track-index` | 轨道编号 | 手动设置（同轨不重叠） |
| `data-composition-id` | 合成唯一ID | 手动设置 |

---

## 7. GSAP 动画约定

### 模板代码

```html
<script src="gsap.min.js"></script>
<script>
var tl = gsap.timeline({ paused: true });
tl.to({}, { duration: totalDur }); // 占位动画保证 onUpdate
window.__timelines["root"] = tl;
</script>
```

### 关键规则

1. **必须用本地文件**：CDN 可能不可达，使用随项目分发的 `gsap.min.js`
2. **必须 paused**：时间线创建时 `paused: true`
3. **必须注册到 `window.__timelines`**：HyperFrames 运行时通过这个对象控制时间线
4. **必须有一个占位动画**：`tl.to({}, { duration: totalDur })` 保证 onUpdate 回调正常工作

### 适配其他动画引擎

| 引擎 | 注册方式 |
|------|---------|
| GSAP | `window.__timelines[id] = tl` |
| CSS 动画 | 自动发现 @keyframes |
| Lottie | `window.__hfLottie[id] = anim` |
| Anime.js | `window.__hfAnime.push(tl)` |
| Three.js | hf-seek 事件 |
| WAAPI | 自动发现 element.animate() |

---

## 8. 风格库

PentoVideo 内置 18 套 CSS 主题，存放在 `styles/styles/` 目录下，按需选用。

### 全部主题列表

| 主题 | 风格描述 |
|------|---------|
| `bauhaus.css` | 包豪斯风格，几何构成，极简线条 |
| `block-frame.css` | 模块化分块布局，信息密集型 |
| `blue-professional.css` | 蓝色专业风，偏商务 |
| `business-green.css` | 绿色商务风，适合财务/环保主题 |
| `clean-white.css` | 纯白极简，适合干净展示 |
| `corporate-clean.css` | 企业整洁风，通用性最强 |
| `cyberpunk-neon.css` | 赛博朋克霓虹风，科技感强 |
| `dracula.css` | 深色吸血鬼色系，适合开发/技术主题 |
| `glassmorphism.css` | 毛玻璃效果，现代感强 |
| `minimal-white.css` | 极简白，比 clean-white 更简化 |
| `monochrome.css` | 单色系，黑白为主 |
| `neo-grid-bold.css` | 网格加粗风格，视觉冲击力强 |
| `neon-gradient.css` | 霓虹渐变，色彩丰富 |
| `soft-editorial.css` | 柔和编辑风格，适合叙事类 |
| `tech-dark.css` | 科技暗色风格 |
| `tokyo-night.css` | 东京夜景风格，蓝紫配色 |
| `warm-education.css` | 暖色教育风，适合授课类 |
| `xiaohongshu-white.css` | 小红书白底风格，适合社交传播 |

### 使用方式

在 HTML 中用 `<link>` 引入需要的主题：

```html
<link rel="stylesheet" href="styles/tech-dark.css">
```

### 基础文件

- `_base.css` — 所有主题共用的基础样式
- `_animations.css` — 通用的动画效果

---

## 9. 工具脚本详解

PentoVideo 提供了多个工具脚本，放置在 `scripts/` 目录下。

### 保留脚本

| 脚本 | 用途 | 命令示例 |
|------|------|---------|
| `generate_image.py` | 商汤生图 | `python3 scripts/generate_image.py --prompt "描述" --size 1920x1080` |
| `ppt_convert.py` | PPT/PDF 转 PNG | `python3 scripts/ppt_convert.py --input deck.pptx --output images/` |
| `ppt_align.py` | 图片对齐口播稿 | `python3 scripts/ppt_align.py --slides images/slides.json --script script.txt` |
| `ppt_ocr.py` | OCR 识别图片文字 | `python3 scripts/ppt_ocr.py --images images/` |
| `check_images.py` | 生图质量检查 | `python3 scripts/check_images.py --images output/` |

### 已移除的旧脚本（功能已并入模板或 CLI）

| 旧脚本 | 替代方案 |
|--------|---------|
| `build_timeline.py` | 模板内置时间轴引擎 |
| `tts_generate.py` | edge-tts 命令行工具 |
| `env_check.py` | `npx hyperframes doctor` |
| `workflow.py` | 自行按阶段执行 |
| `md2slides.py` | 使用模板 |
| `cover_add_text.py` | 手动处理 |

---

## 10. 超帧 CLI 命令

使用 `npx hyperframes` 系列命令管理开发流程。

### 开发循环

```bash
# 1. 检查环境是否正常
npx hyperframes doctor

# 2. 检查 HTML 结构是否正确
npx hyperframes lint

# 3. 确认画面变化（必须做！渲染前必做）
npx hyperframes inspect --samples 15

# 4. 预览（浏览器中查看效果）
npx hyperframes preview

# 5. 草稿渲染（快速出片检查效果）
npx hyperframes render --quality draft

# 6. 正式渲染（最终输出）
npx hyperframes render --quality standard --video-bitrate 5M
```

### 音频工具

```bash
# 文字转语音（Edge TTS，免费无限量）
edge-tts --text "你好世界" --voice zh-CN-XiaoxiaoNeural --write-media narration.mp3

# 语音转文字（用于制作字幕）
npx hyperframes transcribe narration.mp3
```

### 注意事项

- `inspect` 必须在渲染前执行，确认画面确实在变化——否则可能渲染出静止画面
- 国内环境 CDN 不可达，`npx hyperframes init` 时选择 `--no-cdn`
- 视频比特率默认较低，正式渲染建议使用 `--video-bitrate 5M`

---

## 11. 质量检查流程

### 渲染前必做

1. **lint** — 结构校验（data 属性、标签闭合、资源引用）
2. **inspect --samples 15** — 检查至少 15 帧是否画面有变化
3. **preview** — 浏览器中手动看一遍

### 渲染后验证

```bash
# 检查视频时长
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 output.mp4

# 检查视频参数
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,codec_name -of default=noprint_wrappers=1 output.mp4
```

### 常见质量问题

| 问题 | 原因 | 修复 |
|------|------|------|
| 画面不动 | 没写 GSAP 动画 / 没注册 `__timelines` | 检查 JS 代码 |
| 音频空白 | 用了 `data-src` 而非 `src` | 改为 `<audio src="...">` |
| 口播和画面错位 | 字数比例不准 | 检查口播稿标点符号和数字格式 |
| 渲染报错 | 文件路径问题 | 确认音频文件存在、路径正确 |

---

## 12. 项目结构示例

一个典型的 PentoVideo 项目目录结构：

```
PentoVideo/
├── 2026-05-11_PentoVideo介绍/
│   ├── index.html                 ← 主 HTML 文件
│   ├── audio/
│   │   └── narration.mp3          ← 配音文件
│   ├── media/                     ← 其他媒体资源
│   ├── renders/                   ← 渲染输出目录
│   │   └── output-video.mp4
│   ├── scripts/
│   │   ├── tts_text.txt           ← TTS 输入文本（已剥页码）
│   │   └── voiceover.md           ← 口播稿文档
│   └── .pentovideo/
│       └── narration.txt          ← 原始口播稿
├── 2026-05-12_项目名/
│   ├── index.html
│   ├── plan.md                    ← 项目计划
│   ├── design.md                  ← 页面设计稿
│   ├── build/
│   │   └── index.html             ← 构建后的文件
│   ├── compositions/              ← 子页面（用于多场景）
│   ├── assets/                    ← 静态资源
│   └── media/                     ← 音频文件和媒体
├── scripts/                       ← 项目公用的脚本
├── styles/                        ← CSS 风格库（18 套主题）
└── templates/                     ← HTML 模板
```

---

## 13. 商汤生图使用

适用于线B（需要 AI 生成图片的情况）。

### 基本命令

```bash
python3 scripts/generate_image.py --prompt "画面描述" --size 1920x1080
```

### 常用尺寸

| 用途 | 尺寸 | 比例 |
|------|------|------|
| 抖音横版 | 1920×1080 | 16:9 |
| 抖音竖版 | 1080×1920 | 9:16 |
| 封面图 | 1080×1080 | 1:1 |

### 质检

生图完成后使用 `check_images.py` 检查质量：

```bash
python3 scripts/check_images.py --images output/
```

---

## 14. PPT 转视频流程

当你已有 PPT 文稿时使用线C。

### 完整流程

```bash
# 第一步：PPT/PDF 转为 PNG 图片
python3 scripts/ppt_convert.py --input 演示文稿.pptx --output images/

# 第二步：OCR 识别图片中的文字
python3 scripts/ppt_ocr.py --images images/

# 第三步：图片与口播原稿对齐
python3 scripts/ppt_align.py --slides images/slides.json --script narration.txt
```

### 前提条件

- 安装 LibreOffice（用于 PPT 转 PNG）
- 安装 Tesseract OCR（用于文字识别）

---

## 15. 常见问题排查

### 音频问题

**Q：音频无法播放？**
A：确认使用了 `<audio src="...">` 而不是 `data-src`。`data-src` 不会触发音频加载。

**Q：MP3 文件为 0 字节？**
A：TTS 没有正确生成。检查 Edge TTS 声音名称是否正确。推荐中文声音：
- `zh-CN-XiaoxiaoNeural`（女声，推荐）
- `zh-CN-YunyangNeural`（男声）
- `zh-CN-YunxiaNeural`（男声）

### 时间轴问题

**Q：画面切换时间不对？**
A：检查 `data-page-text` 属性的文本是否与口播稿一致。字数比例引擎完全依赖这个属性。

**Q：总时长不对？**
A：用 `ffprobe` 确认音频文件的真实时长，问题在声源不在引擎。

### GSAP 问题

**Q：动画不动？**
A：检查四点：
1. GSAP 脚本是否正确加载
2. 时间线是否 `paused: true`
3. 是否注册到 `window.__timelines["root"]`
4. 是否有占位动画 `tl.to({}, { duration: totalDur })`

### 渲染问题

**Q：渲染出静止画面？**
A：渲染前必须执行 `npx hyperframes inspect --samples 15` 确认画面有变化。如果只有第一帧，说明动画没启动。

**Q：渲染失败 / 报错？**
A：先跑 `npx hyperframes doctor` 检查环境是否正常。

### 口播稿问题

**Q：TTS 读错数字？**
A：数字必须写全中文："408"→"四百零八"，"99%"→"百分之九十九"。

**Q：TTS 读错英文？**
A：英文单词要逐个大写："API"→"A P I"，"UI"→"U I"。

---

## 总结

PentoVideo 的核心设计哲学是**把做视频这件模糊的事变得明确可操作**：

1. **门控先行**：信息不全不动手
2. **标准化模板**：所有结构有章可循
3. **字数比例时间轴**：没有黑盒，计算精确
4. **质量门控**：渲染前必须确认画面正确
5. **四条路线**：无论你手头有什么材料，都能找到对应的生产流程

开始使用的最佳路径：
1. 确定你要做什么（主题/受众/路线）
2. 写口播稿（注意规范）
3. 选风格 → 找模板 → 写 HTML
4. TTS 生成语音
5. 预览确认 → 渲染出片

> 让AI做视频不再瞎猜，每一条流水线都清晰可见，每一个决策都有规则可循。
