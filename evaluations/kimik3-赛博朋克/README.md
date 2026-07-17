# 霓都 2077 // NEON DISTRICT — 赛博朋克雨夜 FPS（three.js）

Kimi K3 用与三大模型横评**同一段提示词**生成的《赛博朋克 2077》风格雨夜街区第一人称射击 Demo。
**单个 `index.html` + 本地 `lib/three-bundle.js`**，全部几何体 / 贴图 / 特效均为程序化生成，断网可玩。

## 运行

**直接双击 `index.html`** 即可（three 打包为经典 script 引入的单文件 bundle，无 ES 模块
CORS 限制，`file://` 协议可直接运行）。也可用自带的本地服务器：

```bash
cd 本目录
node server.js          # 默认 http://127.0.0.1:7100
```

## 操作

WASD 移动 · Shift 跑 · 鼠标射击 · R 换弹 · 按住 Tab 扫描 · 靠近终端按 E 入侵 · 空格跳跃

## 从零构建 three bundle（r185）

`lib/three-bundle.js` 由 `build/` 目录打包产出（three 核心 + EffectComposer / UnrealBloomPass 等后期处理插件，
挂到全局 `THREE` 与 `PostFX`）：

```bash
cd build
npm install
npx esbuild entry.js --bundle --minify --format=iife --outfile=../lib/three-bundle.js
```

---

公众号：邱一尺
