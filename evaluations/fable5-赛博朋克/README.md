# NIGHT CITY // 霓虹雨 — 单文件赛博朋克 FPS(three.js)

《赛博朋克 2077》风格的雨夜街区第一人称射击 Demo。**单个 `index.html` + 本地 `three/` 库目录**,
全部几何体 / 贴图 / 特效 / 音频均为程序化生成,断网可玩。

## 运行

已包含 `three/` 目录的话:**直接双击 `index.html`** 即可(使用 UMD 版 three.js,无 ES 模块
CORS 限制,`file://` 协议可直接运行)。也可用本地服务器:

```bash
cd 本目录
python3 -m http.server 8788
# 打开 http://localhost:8788
```

## 从零下载 three.js(r147,最后一个自带 UMD 扩展的版本)

```bash
cd 项目目录
curl -L -o three.tgz https://registry.npmjs.org/three/-/three-0.147.0.tgz
tar -xzf three.tgz
mkdir -p three/postprocessing three/shaders three/objects three/controls
cp package/build/three.min.js                                three/
cp package/examples/js/postprocessing/Pass.js                three/postprocessing/
cp package/examples/js/postprocessing/EffectComposer.js      three/postprocessing/
cp package/examples/js/postprocessing/RenderPass.js          three/postprocessing/
cp package/examples/js/postprocessing/ShaderPass.js          three/postprocessing/
cp package/examples/js/postprocessing/MaskPass.js            three/postprocessing/
cp package/examples/js/postprocessing/UnrealBloomPass.js     three/postprocessing/
cp package/examples/js/shaders/CopyShader.js                 three/shaders/
cp package/examples/js/shaders/LuminosityHighPassShader.js   three/shaders/
cp package/examples/js/objects/Reflector.js                  three/objects/
cp package/examples/js/controls/PointerLockControls.js       three/controls/
rm -rf package three.tgz
```

目录结构:

```
index.html
three/
├── three.min.js
├── controls/PointerLockControls.js
├── objects/Reflector.js
├── postprocessing/{Pass,EffectComposer,RenderPass,ShaderPass,MaskPass,UnrealBloomPass}.js
└── shaders/{CopyShader,LuminosityHighPassShader}.js
```

## 操作

| 按键 | 功能 |
|---|---|
| WASD / Shift | 移动 / 疾跑 |
| 鼠标 / 左键 / 右键 | 视角 / 射击 / 瞄准 |
| 空格 | 跳跃 |
| R | 换弹 |
| Tab(按住) | 义眼扫描(隔墙高亮 + 信息标签) |
| E | 靠近发光终端:入侵协议小游戏 |
| M / F3 / Esc | 静音 / FPS 显示 / 暂停 |

## 玩法

清剿一波波「义体暴徒」;击杀掉落 €$ 自动拾取;黑入街边终端玩 5×5 缓冲区破解
(行/列交替选码,30 秒限时),成功可获 €$ 或瘫痪全场敌人 3 秒;死亡显示 RELIC 故障
结算画面,可重开。帧率不足时自动降档(降分辨率 / 关闭路面实时镜面反射)。
