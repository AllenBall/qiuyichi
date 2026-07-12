# NIGHT CITY // 2077 — 赛博朋克第一人称 3D 游戏

一个用 **three.js r160** 写的《赛博朋克 2077》风格第一人称射击小游戏，单 HTML 文件，**完全离线运行**，所有美术资源（建筑、霓虹、雨、角色、特效、音效）均由代码程序化生成，**不依赖任何 CDN、不加载任何外部模型 / 贴图 / 音频 / 字体文件**。

---

## 一、运行方式

### 方法 A：直接双击（最简单）
直接用浏览器打开 `index.html` 即可。现代 Chrome / Edge / Firefox 都支持 ES Modules + import maps。

> 注意：**不要用 Safari**，它对 import map 的支持在某些版本上有问题。推荐 **Chrome / Edge**。

### 方法 B：本地起一个静态服务器（推荐，最稳）
import map 与 ES Module 在 `file://` 协议下绝大多数浏览器没问题，但用 http 服务器最保险：

```bash
# 进入项目目录
cd /Users/qiujunya/Downloads/glm52-赛博朋克

# 任选其一启动本地服务器：
python3 -m http.server 8765
#   或
npx serve .
#   或
npx http-server -p 8765

# 然后浏览器打开
#   http://localhost:8765/index.html
```

打开后是黑底霓虹黄标题画面（带 glitch 效果），点击 **ENTER THE CITY** 进入游戏并锁定鼠标指针。

---

## 二、three.js 本地下载命令与目录结构

项目已把 three.js 下载到本地，下面是**重新从零搭建**的完整命令（断网也能跑）。

### 下载 three.js r160（完整步骤）

```bash
# 1. 进入项目目录
cd /Users/qiujunya/Downloads/glm52-赛博朋克

# 2. 下载 three.js r160 源码 zip（约 350MB，含全部源码与示例）
curl -L -o three-r160.zip https://github.com/mrdoob/three.js/archive/refs/tags/r160.zip

# 3. 解压我们需要的两部分：核心 build/ 和 扩展 addons（examples/jsm/）
unzip -o three-r160.zip "three.js-r160/build/*"            -d /tmp/three-extract
unzip -o three-r160.zip "three.js-r160/examples/jsm/*"     -d /tmp/three-extract

# 4. 拷贝到项目目录，整理成最终结构
cp    /tmp/three-extract/three.js-r160/build/three.module.js  ./three.module.js
mkdir -p ./three/addons
cp -R  /tmp/three-extract/three.js-r160/examples/jsm/.        ./three/addons/

# 5. 清理临时文件与压缩包
rm -rf /tmp/three-extract three-r160.zip
```

> 如果没有 `unzip`，可以用 `tar`：
> ```bash
> curl -L -o three-r160.tar.gz https://github.com/mrdoob/three.js/archive/refs/tags/r160.tar.gz
> tar -xzf three-r160.tar.gz three.js-r160/build three.js-r160/examples/jsm
> ```
> 或者直接 `git clone`：
> ```bash
> git clone --depth 1 --branch r160 https://github.com/mrdoob/three.js.git three-src
> cp three-src/build/three.module.js ./three.module.js
> mkdir -p ./three/addons && cp -R three-src/examples/jsm/. ./three/addons/
> ```

### 最终目录结构

```
glm52-赛博朋克/
├── index.html                  ← 游戏主文件（直接在浏览器打开它）
├── three.module.js             ← three.js r160 核心（ES Module 版本）
└── three/
    └── addons/                 ← three.js 官方扩展模块（examples/jsm）
        ├── controls/
        │   └── PointerLockControls.js     ← 第一人称指针锁定控件
        ├── postprocessing/
        │   ├── EffectComposer.js          ← 后期处理管线
        │   ├── RenderPass.js
        │   ├── ShaderPass.js              ← 自定义扫描模式着色器通道
        │   ├── UnrealBloomPass.js         ← 霓虹辉光(Bloom)
        │   ├── OutputPass.js
        │   ├── MaskPass.js
        │   └── Pass.js
        └── shaders/
            ├── CopyShader.js
            ├── LuminosityHighPassShader.js
            └── OutputShader.js
```

游戏在 `index.html` 里用 **import map** 把 `three` 和 `three/addons/` 这两个裸模块名映射到本地相对路径：

```html
<script type="importmap">
{ "imports": {
    "three": "./three.module.js",
    "three/addons/": "./three/addons/"
} }
</script>
<script type="module">
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// ...
</script>
```

**关键点**：版本是 **r160**（2023 年 12 月发布，稳定且对 EffectComposer / UnrealBloomPass / PointerLockControls 支持完善）。整个 `three/` 目录约 22MB，断网可正常运行。

---

## 三、操作说明

| 按键 | 功能 |
|------|------|
| **W A S D** | 移动 |
| **鼠标** | 转视角（点击画面锁定指针） |
| **空格 Space** | 跳跃 |
| **左键 LMB** | 射击 |
| **R** | 重新填弹 |
| **Tab（按住）** | 扫描模式（冷色调 + 隔墙高亮 + 浮空信息标签） |
| **E** | 靠近发光终端时启动「入侵协议」黑客小游戏 |
| **Shift** | 加速跑 |
| **ESC** | 释放鼠标指针 |

---

## 四、游戏内容对照（需求实现清单）

### 画面
1. **夜之城街区** — 220 米长雨夜街道，两侧 26 栋程序化高低错落摩天楼（带自发光窗格、中英文霓虹招牌、全息广告牌），远处 70 栋天际线轮廓 + 体积感夜雾。✅
2. **光影** — 霓虹招牌、建筑边条、路灯都是真实 `PointLight`，照亮街道；`UnrealBloomPass` 泛光让霓虹辉光；多块招牌**动态闪烁**；主要物体开启阴影。✅
3. **天气** — 9000 颗雨丝粒子 + 自定义湿滑路面着色器（霓虹在积水上的彩色流动倒影 + 水洼）。✅
4. **动态元素** — 5 辆飞行车沿航线穿梭（带闪烁的红绿航行灯、引擎底光、前灯）；街边 6 处蒸汽 / 烟雾粒子飘动。✅
5. **路人** — 18 个程序化 NPC，随机体型、服色、发光义体部件（护目镜 / 机械臂 / 胸口核心），沿人行道来回走动并互相避让；附近枪战时**惊慌四散 / 蹲下抱头**，一段时间后恢复。✅
6. **开场** — 黑底霓虹黄「NIGHT CITY」标题，RGB 分裂 glitch 故障艺术，点击 ENTER 进入并锁定指针。✅

### 玩法
7. **第一人称** — WASD + 鼠标 + 跳跃 + 射击，枪口火光、曳光弹、命中火花、准星、后坐力、屏幕震动、头部走动晃动。✅
8. **敌人** — 4 个义体暴徒，会索敌、朝玩家开火、有血量，被击倒掉落发光 `$E` 拾取物，走近自动拾取。✅
9. **扫描模式** — 按住 Tab 画面转冷青色调 + 扫描线 + 色差，敌人 / 路人 / 终端浮空显示标签（敌人显示名称+弱点，路人显示随机姓名+职业）。✅
10. **黑客玩法** — 街边发光接入点，靠近按 E 弹出「入侵协议」：5×5 十六进制矩阵（BD/1C/55/E9/7A/FF/BB/7C），行列交替选择，6 格缓冲区，匹配 3 位目标序列，限时 30 秒；成功瘫痪全场敌人 3 秒 + 奖励 `$E`，失败触发红色 glitch 闪屏。✅
11. **HUD** — 斜切角边框、黄/青 2077 配色：血条(绿)、RAM 条(青)、弹药数、`$E` 计数；死亡全屏红色「RELIC MALFUNCTION」glitch 警告 + 成绩 + 重新开始。✅

### 品质
12. **性能** — 目标 60fps，自适应像素比、对象池（曳光弹 / 火花粒）、合并几何体；命中敌人有屏幕震动、十字命中标记、爆头特效。✅
13. **音效** — Web Audio API 实时合成：雨声底噪（滤波白噪声循环）、合成器背景琶音、枪声、命中、换弹、拾取、黑客成功 / 失败音效，**不加载任何音频文件**。✅

---

## 五、技术要点

- **全部程序化生成**：建筑、窗户（CanvasTexture 自发光贴图）、霓虹文字招牌（Canvas 绘制 + 发光着色）、雨、飞行车、NPC、敌人、特效全部用 three.js 代码生成，无任何外部美术资源。
- **后期管线**：`EffectComposer = RenderPass + UnrealBloomPass + 自定义扫描ShaderPass + OutputPass`。
- **自定义着色器**：湿滑路面（沥青噪点 + 动态霓虹倒影 + 水洼 + 流动光斑）、扫描模式（冷色调偏移 + 扫描线 + 色差 + glitch 位移 + 暗角）。
- **真实光源**：26 栋楼每栋带 1-2 个霓虹 `PointLight`，加上路灯、招牌灯、飞行车灯、敌人弱点亮光，夜景氛围浓厚。
- **AI**：敌人有 idle / engage 状态机、距离判定（靠近推进 / 远距离开火）、群体警戒；NPC 有巡逻 + 避让 + 恐慌三态。

---

## 六、故障排查

| 现象 | 原因 / 解决 |
|------|------------|
| 白屏 + 控制台报 `Error creating WebGL context` | 浏览器未启用硬件加速。Chrome 地址栏 `chrome://settings/system` 打开「使用硬件加速模式」；或换一台有独显的机器。**无头 / 虚拟机环境通常无法创建 WebGL**，需在真实桌面运行。 |
| 屏幕显示红色 `WEBGL UNAVAILABLE` | 同上，WebGL 不可用。换 Chrome / Edge 并开启硬件加速。 |
| 鼠标无法锁定 | 点击游戏画面一次。某些浏览器需要 `https` 或 `localhost`，用「方法 B」起本地服务器。 |
| 文字 / 资源 404 | 确认 `three.module.js` 和 `three/addons/` 与 `index.html` 在同一目录（按上面的结构）。 |

---

## 七、文件清单

| 文件 | 说明 |
|------|------|
| `index.html` | 游戏全部代码（HTML + CSS + JS，约 2150 行） |
| `three.module.js` | three.js r160 核心 |
| `three/addons/` | three.js 官方扩展（控件 + 后期处理 + 着色器） |
| `README.md` | 本说明文档 |

打开 `index.html`，进入夜之城。欢迎来到 2077。
