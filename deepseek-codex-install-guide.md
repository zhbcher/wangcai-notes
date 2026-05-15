# DeepSeek 模型接入 Codex 完整教程

> 通过本地中间件转发实现 DeepSeek 接入 Codex，Windows + Mac 双平台支持

**作者**: 鲲鹏Talk  
**发布时间**: 2026-05-10  
**难度**: 进阶  
**标签**: DeepSeek, Codex, AI 编程助手, 中间件

---

## 📋 方案概述

通过 **本地中间件转发** 实现 DeepSeek 模型接入 Codex，无需修改 Codex 核心文件，安全稳定、成本低。DeepSeek API Key 只在本地使用，不会泄露到第三方。

### 核心组件
- **mimo2codex**: 本地中间件，负责请求转发和模型适配
- **CC Switch**: 跨平台配置管理工具，管理 Codex 供应商配置
- **DeepSeek API**: 提供模型能力

---

## ⚙️ 前置准备（Mac & Windows 通用）

### 1. 安装 Node.js
- 推荐 LTS 版本（v18 或更高）
- **Mac**（推荐 Homebrew）: `brew install node`
- **Windows**: 从 [Node.js 官网](https://nodejs.org) 下载安装包，运行安装程序
- 验证安装:
  ```bash
  node -v
  npm -v
  ```

### 2. 获取 DeepSeek API Key
1. 访问 [DeepSeek 平台](https://platform.deepseek.com)
2. 注册/登录账号
3. 进入 **API Keys** 页面
4. 创建新 Key 并复制保存

⚠️ **安全提示**：API Key 只在本地使用，不要分享给他人或上传到公开仓库。

### 3. 安装 CC Switch
- **Mac**（推荐 Homebrew）:
  ```bash
  brew tap farion1231/ccswitch
  brew install --cask cc-switch
  ```
  或从 [GitHub Releases](https://github.com/farion1231/cc-switch/releases) 下载 `.dmg` 文件，双击安装并拖入 Applications 文件夹。

- **Windows**: 下载 `.msi` 安装包或便携版，按提示安装到默认路径。

- **首次启动**:
  - Mac 用户若遇到 Gatekeeper 提示，前往“系统设置 → 隐私与安全性”允许应用运行
  - CC Switch 会自动管理 Codex 等工具的配置文件（默认路径：`~/.codex/` 或 `%APPDATA%/codex/`）

### 4. 安装 Codex
- 访问 [Codex 官网](https://codex.com) 下载 CLI 或桌面版
- **Mac**: 下载 `.dmg` 文件，双击打开后拖拽 Codex 到 Applications 文件夹
- **Windows**: 运行 `.exe` 安装程序，按向导完成安装
- 安装完成后确保 **Codex 能正常启动**（首次可能需登录或授权）
- 验证安装（CLI 版本）:
  ```bash
  codex --version
  ```
  桌面版直接确认窗口能正常打开即可。

---

## 🛠️ 步骤 1：全局安装 mimo2codex 中间件

```bash
# Mac (Terminal)
npm install -g mimo2codex

# 如遇权限问题，使用 sudo（不推荐，建议装 nvm）
sudo npm install -g mimo2codex

# Windows（管理员 PowerShell）
npm install -g mimo2codex

# 验证安装
mimo2codex --version
mimo2codex --help
```

---

## 🚀 步骤 2：启动本地转发服务（核心步骤）

新开一个 Terminal（Mac）或 PowerShell 窗口，执行：

```bash
# Mac (Terminal / zsh / bash)
export DEEPSEEK_API_KEY="sk-你的真实DeepSeek_API_Key在这里"
mimo2codex --model ds --port 8789
```

```powershell
# Windows (PowerShell)
$env:DEEPSEEK_API_KEY = "sk-你的真实DeepSeek_API_Key在这里"
mimo2codex --model ds --port 8789
```

### 参数说明
| 参数 | 说明 |
|------|------|
| `--model ds` | 使用 DeepSeek 模型（`ds` 是简写，也可用 `deepseek-chat` 等） |
| `--port 8789` | 本地服务端口（可改为其他空闲端口，如 8890） |
| `DEEPSEEK_API_KEY` | 你的 DeepSeek API Key（从平台复制的完整 key，以 `sk-` 开头） |

⚠️ **重要提示**：
- 替换 `sk-你的真实DeepSeek_API_Key在这里` 为你的实际 Key
- 保持此终端窗口 **一直打开**，服务会持续运行
- 服务启动后监听 `http://127.0.0.1:8789`
- 看到日志输出 `Listening on http://127.0.0.1:8789` 表示启动成功

---

## 🔧 步骤 3：获取 CC Switch 配置信息

新开另一个 Terminal / PowerShell 窗口（**不要关闭服务窗口**），运行：

```bash
mimo2codex --model ds --port 8789 print-cc-switch
```

输出示例：

```json
{
  "auth.json": "{\"providers\":[{\"name\":\"DEEPSEEK\",\"apiKey\":\"mimo2codex-local\",\"baseURL\":\"http://127.0.0.1:8789/v1\"}]}",
  "config.toml": "[codex]\n  default_provider = \"DEEPSEEK\"\n  [[codex.providers]]\n    name = \"DEEPSEEK\"\n    api_key = \"mimo2codex-local\"\n    base_url = \"http://127.0.0.1:8789/v1\""
}
```

**完整复制这两段配置**备用。注意：
- `auth.json` 是 JSON 字符串，`config.toml` 是 TOML 格式
- `api_key` 固定为 `mimo2codex-local`，这是中间件的固定标识，不是你的 DeepSeek Key
- 如果端口不是 8789，请相应修改

---

## ⚙️ 步骤 4：在 CC Switch 中添加 DeepSeek 供应商

### Mac & Windows 操作相同：

1. 打开 **CC Switch** 应用（若未运行，在 Applications 文件夹或开始菜单中启动）
2. 切换到 **Codex** 标签页
3. 点击 **添加新供应商** → 选择 **自定义 / OpenAI 兼容**
4. 填写配置信息：

| 配置项 | 值 |
|--------|-----|
| 供应商名称 | `DEEPSEEK`（或 `DeepSeek`，**必须与 config.toml 中的 name 一致**） |
| API Key | `mimo2codex-local`（步骤3输出中的 `api_key` 值） |
| Base URL | `http://127.0.0.1:8789/v1`（**确保中间件正在运行**） |
| 模型名称 | `deepseek-v4-pro`、`deepseek-v4-flash`、`deepseek-chat` 等（按你的 DeepSeek 订阅选择） |

5. **高级配置**：在 **config.toml 编辑区**粘贴步骤3输出的内容，如果 `name` 不是 `DEEPSEEK`，请修改一致；保存并启用
6. CC Switch 会自动将配置写入 Codex 的配置文件（通常位于 `~/.codex/` 或 `%APPDATA%/codex/`）

📌 **注意**：
- 如果添加后不生效，检查 CC Switch 的 **已启用供应商列表** 中 DeepSeek 是否被正确勾选
- 可以点击 CC Switch 的 **调试** 或 **日志** 查看是否有写入错误
- Codex 的配置文件可能包含多个供应商，确保 `default_provider` 指向 `DEEPSEEK`（可选）

---

## ✅ 步骤 5：验证与使用

1. **重启 Codex** 应用（关闭所有 Codex 窗口后重新打开）
2. 在模型选择栏点击下拉菜单，查找并选择 **DEEPSEEK**（或你配置的供应商名称）
3. 在对话输入框输入测试消息，例如：`你好，请介绍一下你自己`
4. 正常响应应该来自 DeepSeek 模型（通常响应速度很快）
5. 如果成功，恭喜你已实现 DeepSeek 接入 Codex！✅

### 验证中间件运行状态

在新终端中检查中间件是否正在监听：

```bash
# Mac/Linux
curl http://127.0.0.1:8789/v1/models

# Windows (PowerShell)
Invoke-RestMethod http://127.0.0.1:8789/v1/models
```

正常应返回 JSON 包含 DeepSeek 模型列表。如果连接失败，说明中间件未启动或端口错误。

---

## 🐛 常见问题排查

### Mac 专属问题

#### 问题：`npm install -g` 权限被拒绝

**方案1：使用 nvm（推荐）**
```bash
brew install nvm
mkdir ~/.nvm
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && . "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc
source ~/.zshrc
nvm install --lts
```

**方案2：使用 sudo（不推荐长期使用）**
```bash
sudo npm install -g mimo2codex
```

#### 问题：端口 `8789` 已被占用

```bash
# 查找占用端口的进程
lsof -i :8789

# kill 掉占用进程（PID 替换为实际值）
kill -9 <PID>

# 或改用其他端口，例如 8890，只需修改启动命令
mimo2codex --model ds --port 8890
# 同时修改 CC Switch 中的 Base URL 为 http://127.0.0.1:8890/v1
```

#### 问题：Gatekeeper 阻止应用运行

首次打开 CC Switch `.dmg` 或从非 App Store 下载的应用时：
1. 前往 **系统设置 → 隐私与安全性**
2. 向下滚动到 **安全性** 部分
3. 找到类似 "CC Switch 已损坏，无法打开" 或 "来自身份不明的开发者" 提示
4. 点击 **仍要打开**
5. 再次尝试打开应用

#### 环境变量持久化（每次开机都要 export？）

`export DEEPSEEK_API_KEY=xxx` 只在当前终端有效。如需永久生效，将 export 写入 shell 配置文件：

```bash
# Mac (zsh，macOS Catalina 及以后默认)
echo 'export DEEPSEEK_API_KEY="sk-你的真实Key"' >> ~/.zshrc
source ~/.zshrc

# Mac (bash，旧版本)
echo 'export DEEPSEEK_API_KEY="sk-你的真实Key"' >> ~/.bash_profile
source ~/.bash_profile
```

⚠️ **注意**：将 Key 写入配置文件可能被其他用户或进程看到，请确保文件权限为 `600`（仅自己可读）并定期轮换 Key。

#### 后台运行与开机自启（推荐）

使用 PM2 进程管理器让中间件在后台持续运行：

```bash
# 安装 PM2
brew install pm2

# 启动中间件并命名为 deepseek-mimo
pm2 start "mimo2codex --model ds --port 8789" --name deepseek-mimo --env DEEPSEEK_API_KEY=sk-你的真实Key

# 查看运行状态
pm2 list

# 查看日志（如遇到问题）
pm2 logs deepseek-mimo

# 设为开机自启
pm2 startup
pm2 save
```

**验证开机自启**：重启 Mac 后运行 `pm2 list` 查看 deepseek-mimo 是否为 `online` 状态。

#### 使用 launchd（系统原生后台服务）

Mac 也可以使用系统原生 `launchd` 管理服务：

1. 创建 plist 文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.zhbcher.deepseek-mimo</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/mimo2codex</string>
    <string>--model</string>
    <string>ds</string>
    <string>--port</string>
    <string>8789</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>DEEPSEEK_API_KEY</key>
    <string>sk-你的真实Key</string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/tmp/deepseek-mimo.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/deepseek-mimo.err</string>
</dict>
</plist>
```

2. 保存为 `~/Library/LaunchAgents/com.zhbcher.deepseek-mimo.plist`
3. 加载服务：
```bash
launchctl load ~/Library/LaunchAgents/com.zhbcher.deepseek-mimo.plist
launchctl start com.zhbcher.deepseek-mimo
```

4. 查看日志：
```bash
tail -f /tmp/deepseek-mimo.log
```

5. 卸载服务：
```bash
launchctl unload ~/Library/LaunchAgents/com.zhbcher.deepseek-mimo.plist
rm ~/Library/LaunchAgents/com.zhbcher.deepseek-mimo.plist
```

---

### Windows 专属问题

#### 安装 Node.js 和 npm

- 从 [Node.js 官网](https://nodejs.org) 下载 Windows 安装包（.msi）
- 运行安装程序，**务必勾选 "Add to PATH"** 选项
- 完成后打开新的 PowerShell 或 CMD，输入 `node -v` 和 `npm -v` 验证

#### 全局 npm 安装权限

Windows 下如果提示权限错误，请 **以管理员身份运行 PowerShell**：
1. 在开始菜单找到 PowerShell
2. 右键 → **以管理员身份运行**
3. 执行 `npm install -g mimo2codex`

#### 环境变量设置（PowerShell）

`$env:DEEPSEEK_API_KEY = "xxx"` 只在当前 PowerShell 会话有效。如需持久化：

**方法1：系统环境变量（推荐）**
1. 右键 "此电脑" → 属性 → 高级系统设置 → 环境变量
2. 在 **用户变量** 或 **系统变量** 中点击 **新建**
3. 变量名：`DEEPSEEK_API_KEY`
4. 变量值：你的 DeepSeek API Key
5. 确定后**重启所有终端窗口**生效

**方法2：PowerShell Profile（仅当前用户）**
```powershell
# 打开或创建 PowerShell 配置文件
notepad $PROFILE

# 添加一行：
$env:DEEPSEEK_API_KEY = "sk-你的真实Key"

# 保存后重启 PowerShell
```

⚠️ **安全提醒**：环境变量可能被其他进程读取，建议使用系统级密钥管理工具（如 Windows Credential Manager）或在 PowerShell Profile 中加密存储。

#### 后台运行与开机自启

**方案1：任务计划程序（Windows 原生）**

1. 打开 **任务计划程序**（Task Scheduler，任务计划程序）
2. 点击 **创建任务**（Create Task）
3. **常规** 选项卡：
   - 名称：`DeepSeek Mimo2Codex`
   - 勾选 **使用最高权限运行**
   - 勾选 **只在用户登录时运行**（如需后台服务）
4. **触发器** 选项卡：
   - 新建 → 选择 **登录时** 或 **系统启动时**
5. **操作** 选项卡：
   - 新建 → 操作：启动程序
   - 程序/脚本：`C:\Windows\System32\cmd.exe`
   - 参数：`/c "set DEEPSEEK_API_KEY=sk-你的真实Key && mimo2codex --model ds --port 8789"`
   - 起始于：`C:\Users\你的用户名`
6. **条件** 选项卡（可选）：
   - 取消勾选 "只有在计算机使用交流电源时才启动此任务"（便携设备）
7. 点击 **确定**，输入管理员密码保存

**验证**：重启 Windows，打开任务管理器查看是否有 `mimo2codex` 进程（Node.js 进程）。

**方案2：NSSM（非萨基斯 Windows 服务管理器）**

下载 [NSSM](https://nssm.cc)，将中间件安装为 Windows 服务：

```powershell
nssm install DeepSeekMimo "C:\Windows\System32\cmd.exe" "/c set DEEPSEEK_API_KEY=sk-xxx && mimo2codex --model ds --port 8789"
nssm start DeepSeekMimo
```

---

### Windows & Mac 通用排查

| 问题 | 解决方案 |
|------|----------|
| 中间件启动失败 | 检查 `npm install -g mimo2codex` 是否成功，运行 `mimo2codex --version` 验证 |
| 服务没启动 / 端口冲突 | 换端口并同步修改配置（启动命令和 CC Switch Base URL 都要改） |
| 配置不生效 | 1. 确认中间件 **正在运行** 2. 重启 CC Switch 3. 重启 Codex 4. 检查配置文件路径（`~/.codex/` 或 `%APPDATA%/codex/`） |
| 响应慢或超时 | 检查网络是否正常，访问 DeepSeek API 是否受限（浏览器访问 https://platform.deepseek.com 验证登录状态） |
| 更新 mimo2codex | macOS/Linux: `npm update -g mimo2codex`<br>Windows（管理员 PowerShell）: `npm update -g mimo2codex` |
| CC Switch 无法写入配置 | 检查 Codex 是否已安装，确保 CC Switch 有权限写入用户目录 |
| 模型不显示在列表中 | 确认 `--model` 参数使用了有效的 DeepSeek 模型标识（如 `ds`、`deepseek-chat`），参考 mimo2codex 官方文档 |
| 验证中间件连接 | 运行 `curl http://127.0.0.1:8789/v1/models`，应返回模型列表 JSON |

---

## 🔥 进阶建议

### 开机自启完整方案

#### Mac
- **PM2**：`pm2 startup && pm2 save`
- **launchd**：见上文 "Mac 专属问题" 部分的 plist 配置

#### Windows
- **任务计划程序**：见上文 "Windows 专属问题"
- **NSSM**：`nssm install DeepSeekMimo ... && nssm start DeepSeekMimo`

---

### 多模型支持

重复步骤 1-4，为其他模型添加供应商：

- **Claude**: Base URL 改为 Claude API 地址，模型名如 `claude-3-5-sonnet-20241022`
- **GPT-4**: Base URL 改为 OpenAI 地址（或兼容端点），模型名 `gpt-4-turbo`、`gpt-4o` 等
- **本地模型（Ollama 等）**: Base URL 改为本地服务地址（如 `http://localhost:11434/v1`），模型名对应本地已拉取的模型
- **其他兼容 OpenAI 格式的接口**：均可通过此方式接入

CC Switch 支持切换默认供应商，可根据任务需要随时选择模型。

---

### 安全性加固

1. **API Key 保护**：本方案中 DeepSeek API Key 只存在于你的本地环境变量和中间件日志中，不会发送给 Codex 客户端，相对安全
2. **环境变量管理**：避免在脚本或配置文件中硬编码 Key；建议使用系统密钥管理工具
   - Mac：Keychain Access
   - Windows：Windows Credential Manager / PowerShell SecretManagement
3. **权限限制**：确保 `~/.codex/`（或 `%APPDATA%/codex/`）和中间件日志文件仅自己可读写（`chmod 600`）
4. **Key 轮换**：定期在 DeepSeek 平台生成新 Key 并更新环境变量，旧 Key 及时作废
5. **网络隔离**：如公司环境有安全要求，可在本地防火墙限制 8789 端口仅本机访问（127.0.0.1）

---

### 脚本自动化（一键启动）

#### Mac/Linux 完整脚本

```bash
#!/bin/bash
# file: ~/bin/start-deepseek-codex.sh
# 一键启动 DeepSeek 中间件 + Codex

# 配置（请根据实际情况修改）
DEEPSEEK_KEY="sk-你的真实DeepSeek_API_Key"
PORT=8789
MODEL="ds"

# 1. 检查 API Key 是否设置
if [ -z "$DEEPSEEK_KEY" ]; then
  echo "❌ 请先在脚本中设置 DEEPSEEK_KEY 变量"
  exit 1
fi

# 2. 检查端口占用
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
  echo "⚠️  端口 $PORT 已被占用，请先 kill 占用进程或改用其他端口"
  lsof -i :$PORT
  exit 1
fi

# 3. 启动中间件（优先使用 PM2，否则后台运行）
export DEEPSEEK_API_KEY="$DEEPSEEK_KEY"

if command -v pm2 &> /dev/null; then
  pm2 start "mimo2codex --model $MODEL --port $PORT" --name deepseek-mimo
  echo "✅ 已通过 PM2 启动中间件"
else
  nohup mimo2codex --model $MODEL --port $PORT > /tmp/deepseek-mimo.log 2>&1 &
  echo "✅ 已启动中间件（后台运行，日志：/tmp/deepseek-mimo.log）"
fi

# 4. 等待服务就绪
sleep 2

# 5. 检查服务是否正常
if curl -s http://127.0.0.1:$PORT/v1/models > /dev/null; then
  echo "✅ 中间件运行正常（端口 $PORT）"
else
  echo "❌ 中间件未正常启动，请查看日志："
  if command -v pm2 &> /dev/null; then
    echo "   pm2 logs deepseek-mimo"
  else
    echo "   tail -f /tmp/deepseek-mimo.log"
  fi
  exit 1
fi

# 6. 启动 Codex（如果已安装）
if [ -d "/Applications/Codex.app" ]; then
  open -a Codex
  echo "🚀 Codex 已启动"
elif command -v codex &> /dev/null; then
  echo "💡 检测到 Codex CLI，请在终端直接使用 'codex' 命令"
else
  echo "⚠️  未找到 Codex.app 或 codex 命令，请确认已安装"
fi

# 7. 输出提示
echo ""
echo "📌 下一步："
echo "   1. 在 Codex 中模型选择下拉菜单选择 DEEPSEEK"
echo "   2. 开始使用 DeepSeek 模型进行对话"
echo ""
echo "🔧 停止服务："
echo "   pm2 stop deepseek-mimo    # 如果用了 PM2"
echo "   pkill -f mimo2codex       # 如果用了 nohup"
```

使用：
```bash
chmod +x ~/bin/start-deepseek-codex.sh
~/bin/start-deepseek-codex.sh
```

---

#### Windows PowerShell 脚本

```powershell
# file: C:\Users\你的用户名\start-deepseek-codex.ps1
$DeepSeekKey = "sk-你的真实DeepSeek_API_Key"
$Port = 8789
$Model = "ds"

# 1. 检查 API Key
if ([string]::IsNullOrWhiteSpace($DeepSeekKey)) {
  Write-Host "❌ 请先在脚本中设置 `$DeepSeekKey 变量" -ForegroundColor Red
  exit 1
}

# 2. 检查端口占用
$portInUse = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if ($portInUse) {
  Write-Host "⚠️  端口 $Port 已被占用，请先释放或改用其他端口" -ForegroundColor Yellow
  $portInUse | Format-Table -AutoSize
  exit 1
}

# 3. 启动中间件（后台）
$env:DEEPSEEK_API_KEY = $DeepSeekKey
Start-Process -FilePath "mimo2codex" -ArgumentList "--model $Model --port $Port" -WindowStyle Hidden

Write-Host "✅ 已启动中间件（后台运行）" -ForegroundColor Green

# 4. 等待服务就绪
Start-Sleep -Seconds 2

# 5. 检查服务
try {
  $response = Invoke-RestMethod "http://127.0.0.1:$Port/v1/models"
  Write-Host "✅ 中间件运行正常（端口 $Port）" -ForegroundColor Green
} catch {
  Write-Host "❌ 中间件未正常启动，请检查是否安装正确或端口是否冲突" -ForegroundColor Red
  exit 1
}

# 6. 启动 Codex（如果已安装）
$codexPath = "C:\Users\${env:USERNAME}\AppData\Local\Programs\Codex\Codex.exe"
if (Test-Path $codexPath) {
  Start-Process $codexPath
  Write-Host "🚀 Codex 已启动" -ForegroundColor Green
} else {
  Write-Host "⚠️  未找到 Codex.exe，请确认已安装到默认路径或添加到 PATH" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📌 下一步：" -ForegroundColor Cyan
Write-Host "   1. 在 Codex 中模型选择下拉菜单选择 DEEPSEEK"
Write-Host "   2. 开始使用 DeepSeek 模型进行对话"
Write-Host ""
Write-Host "🔧 停止服务：" -ForegroundColor Gray
Write-Host "   Get-Process mimo2codex | Stop-Process   # 停止中间件进程"
```

使用：右键 → **用 PowerShell 运行**（首次可能需要 `Set-ExecutionPolicy RemoteSigned` 允许本地脚本运行）。

---

#### 容器化部署（高级用户）

如果你熟悉 Docker，可以将中间件打包为容器，在任何支持 Docker 的机器上快速部署：

```dockerfile
# Dockerfile
FROM node:18-alpine
RUN npm install -g mimo2codex
ENV DEEPSEEK_API_KEY=sk-你的真实Key
EXPOSE 8789
ENTRYPOINT ["mimo2codex", "--model", "ds", "--port", "8789"]
```

构建并运行：
```bash
docker build -t deepseek-mimo .
docker run -d -p 8789:8789 --env DEEPSEEK_API_KEY=sk-你的真实Key deepseek-mimo
```

---

## 📝 总结

本教程提供了 Windows 和 Mac 双平台的完整部署方案：

1. **安装依赖**：Node.js、CC Switch、Codex
2. **部署中间件**：全局安装并启动 mimo2codex
3. **配置连接**：通过 CC Switch 添加 DeepSeek 供应商
4. **验证使用**：重启 Codex 并测试模型响应

### 方案优势
- ✅ 无需修改 Codex 核心文件
- ✅ 本地转发，安全稳定
- ✅ 成本低，按需使用
- ✅ 支持多模型切换
- ✅ 跨平台（Windows + macOS）

### 完整流程速查

```bash
# 1. 安装中间件
npm install -g mimo2codex

# 2. 启动中间件
export DEEPSEEK_API_KEY="sk-xxx"
mimo2codex --model ds --port 8789

# 3. 获取配置（另开终端）
mimo2codex --model ds --port 8789 print-cc-switch

# 4. CC Switch 中添加供应商（GUI 操作）

# 5. 重启 Codex，选择 DEEPSEEK 模型
```

实际操作中遇到任何报错，把具体错误信息或截图发给我，我继续帮你调试！

祝你部署顺利，编程效率大幅提升！🚀
