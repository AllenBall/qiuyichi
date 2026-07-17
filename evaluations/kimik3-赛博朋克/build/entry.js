// 打包入口：把 three.js 核心 + 所需后期处理插件导出到浏览器全局变量
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

window.THREE = THREE;
window.PostFX = { EffectComposer, RenderPass, ShaderPass, UnrealBloomPass, OutputPass };
