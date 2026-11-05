import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface HeroFluidSceneProps {
  /** Base portrait without helmet (defaults to "/atusbefore.png") */
  portraitBaseUrl?: string;
  /** Helmet texture / portrait (defaults to "/atus.png") */
  portraitHelmetUrl?: string;
  /** Optional custom grayscale depth map URL (synthesizes aligned 2.5D depth map if omitted) */
  depthMapUrl?: string;
  /** Optional custom roughness/specular map URL (synthesizes aligned visor roughness map if omitted) */
  roughnessMapUrl?: string;
  /** Optional CSS class for the WebGL canvas */
  className?: string;
}

/**
 * Generates an aligned 512x512 grayscale 2.5D Depth Map Texture
 * (white = 1.0 nose/visor foreground, mid-gray = cheeks/shoulders, black = 0.0 contour background)
 */
function createAlignedDepthMapTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "rgb(20, 20, 20)";
    ctx.fillRect(0, 0, size, size);

    const torsoGrad = ctx.createRadialGradient(
      size * 0.52,
      size * 0.88,
      size * 0.04,
      size * 0.52,
      size * 0.88,
      size * 0.36
    );
    torsoGrad.addColorStop(0, "rgba(145, 145, 145, 0.95)");
    torsoGrad.addColorStop(0.65, "rgba(110, 110, 110, 0.75)");
    torsoGrad.addColorStop(1, "rgba(20, 20, 20, 0)");
    ctx.fillStyle = torsoGrad;
    ctx.fillRect(0, 0, size, size);

    const headGrad = ctx.createRadialGradient(
      size * 0.522,
      size * 0.41,
      size * 0.02,
      size * 0.522,
      size * 0.41,
      size * 0.25
    );
    headGrad.addColorStop(0, "rgba(235, 235, 235, 1)");
    headGrad.addColorStop(0.55, "rgba(195, 195, 195, 0.92)");
    headGrad.addColorStop(0.85, "rgba(130, 130, 130, 0.55)");
    headGrad.addColorStop(1, "rgba(20, 20, 20, 0)");
    ctx.fillStyle = headGrad;
    ctx.fillRect(0, 0, size, size);

    const noseGrad = ctx.createRadialGradient(
      size * 0.522,
      size * 0.44,
      size * 0.005,
      size * 0.522,
      size * 0.44,
      size * 0.095
    );
    noseGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
    noseGrad.addColorStop(0.6, "rgba(242, 242, 242, 0.85)");
    noseGrad.addColorStop(1, "rgba(210, 210, 210, 0)");
    ctx.fillStyle = noseGrad;
    ctx.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates an aligned 512x512 Roughness & Metallic Specular Map Texture
 */
function createAlignedRoughnessMapTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "rgb(235, 0, 0)";
    ctx.fillRect(0, 0, size, size);

    const domeGrad = ctx.createRadialGradient(
      size * 0.522,
      size * 0.39,
      size * 0.02,
      size * 0.522,
      size * 0.39,
      size * 0.24
    );
    domeGrad.addColorStop(0, "rgba(52, 165, 45, 1)");
    domeGrad.addColorStop(0.78, "rgba(64, 145, 35, 0.95)");
    domeGrad.addColorStop(1, "rgba(235, 0, 0, 0)");
    ctx.fillStyle = domeGrad;
    ctx.fillRect(0, 0, size, size);

    const visorGrad = ctx.createLinearGradient(0, size * 0.34, 0, size * 0.47);
    visorGrad.addColorStop(0, "rgba(45, 180, 90, 0)");
    visorGrad.addColorStop(0.2, "rgba(16, 250, 255, 0.98)");
    visorGrad.addColorStop(0.5, "rgba(12, 255, 255, 1)");
    visorGrad.addColorStop(0.8, "rgba(18, 248, 255, 0.98)");
    visorGrad.addColorStop(1, "rgba(45, 180, 90, 0)");
    ctx.fillStyle = visorGrad;
    ctx.beginPath();
    ctx.ellipse(
      size * 0.522,
      size * 0.405,
      size * 0.19,
      size * 0.068,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates a high-resolution 2048x768 CanvasTexture for the Hero Name Banner:
 * - Top "NS" Motorsport Monogram Emblem
 * - "NIKMATUS" (Editorial Serif) + "SOLIHAH" (ExtraBold Sans-Serif)
 *   matching the Lando Norris editorial typography 1:1, positioned behind the portrait head
 * - Subtle tracked subtitle "SCUDERIA FERRARI · WEBGL & MOTION ENGINEER"
 */
function createNameBannerTexture(): {
  texture: THREE.CanvasTexture;
  refresh: () => void;
} {
  const width = 2048;
  const height = 768;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  const drawTrackedWord = (
    context: CanvasRenderingContext2D,
    word: string,
    startX: number,
    baselineY: number,
    trackingPx: number,
    scaleX = 1.0,
    isStroke = false
  ) => {
    let curX = startX;
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      context.save();
      context.translate(curX, baselineY);
      context.scale(scaleX, 1.0);
      if (isStroke) {
        context.strokeText(ch, 0, 0);
      } else {
        context.fillText(ch, 0, 0);
      }
      context.restore();
      const chW = context.measureText(ch).width * scaleX;
      curX += chW + (i < word.length - 1 ? trackingPx : 0);
    }
  };

  const measureTrackedWord = (
    context: CanvasRenderingContext2D,
    word: string,
    trackingPx: number,
    scaleX = 1.0
  ) => {
    let total = 0;
    for (let i = 0; i < word.length; i++) {
      total += context.measureText(word[i]).width * scaleX;
      if (i < word.length - 1) total += trackingPx;
    }
    return total;
  };

  const renderBanner = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    // Hero Name Typography (Luxury Editorial Styling):
    // Word 1 "NIKMATUS" = Solid Luxury Obsidian-Burgundy with Top-Down Shading
    // Word 2 "SOLIHAH"  = Architectural Hollow Outline with Soft Rose Glass Fill (matching FEATURED PROJECTS)
    const firstWord = "NIKMATUS";
    const secondWord = "SOLIHAH";

    const fontSize = 182;
    const oswaldFont = `800 ${fontSize}px "Oswald", Impact, sans-serif`;
    ctx.font = oswaldFont;

    const tracking = 2.5;
    const scaleX = 1.0;
    const wordGap = 42;

    const firstWidth = measureTrackedWord(
      ctx,
      firstWord,
      tracking,
      scaleX
    );

    const secondWidth = measureTrackedWord(
      ctx,
      secondWord,
      tracking,
      scaleX
    );

    const totalNameWidth = firstWidth + wordGap + secondWidth;
    const startX = (width - totalNameWidth) * 0.5;
    const baselineY = 415;

    ctx.textBaseline = "alphabetic";

    // 1. Rich Deep Obsidian-Burgundy Gradient for Word 1 ("NIKMATUS")
    const fillGrad = ctx.createLinearGradient(0, baselineY - fontSize, 0, baselineY + 12);
    fillGrad.addColorStop(0, "#2c0613");
    fillGrad.addColorStop(0.45, "#160309");
    fillGrad.addColorStop(1, "#360817");

    ctx.fillStyle = fillGrad;
    ctx.font = oswaldFont;
    drawTrackedWord(
      ctx,
      firstWord,
      startX,
      baselineY,
      tracking,
      scaleX,
      false
    );

    // 2. Hollow Outlined Luxury Stroke for Word 2 ("SOLIHAH")
    // Subtle translucent rose-champagne fill inside letterforms
    ctx.fillStyle = "rgba(247, 168, 184, 0.16)";
    drawTrackedWord(
      ctx,
      secondWord,
      startX + firstWidth + wordGap,
      baselineY,
      tracking,
      scaleX,
      false
    );

    // Precision crisp stroke outline
    ctx.strokeStyle = "#380818";
    ctx.lineWidth = 3.6;
    ctx.lineJoin = "miter";
    ctx.miterLimit = 2;
    drawTrackedWord(
      ctx,
      secondWord,
      startX + firstWidth + wordGap,
      baselineY,
      tracking,
      scaleX,
      true
    );

    // 3. Editorial Telemetry Subtitle Underneath (Balanced & Elegant)
    const subText = "CREATIVE FRONTEND & UI/UX ARCHITECT";
    ctx.font = `700 22px "Space Grotesk", "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = "rgba(40, 8, 18, 0.76)";
    const subTracking = 7.0;
    const subWidth = measureTrackedWord(ctx, subText, subTracking, 1.0);
    const subStartX = (width - subWidth) * 0.5;
    const subBaselineY = 485;
    drawTrackedWord(
      ctx,
      subText,
      subStartX,
      subBaselineY,
      subTracking,
      1.0,
      false
    );

    // Flanking decorative hairline accents
    ctx.strokeStyle = "rgba(217, 107, 126, 0.45)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(subStartX - 60, subBaselineY - 6);
    ctx.lineTo(subStartX - 16, subBaselineY - 6);
    ctx.moveTo(subStartX + subWidth + 16, subBaselineY - 6);
    ctx.lineTo(subStartX + subWidth + 60, subBaselineY - 6);
    ctx.stroke();

    texture.needsUpdate = true;
  };

  renderBanner();
  return { texture, refresh: renderBanner };
}

// ============================================================================
// SHADER 1: PING-PONG FLUID TRAIL FRAGMENT SHADER (512x512 RenderTargets A & B)
// - Perpendicular projection distance onto segment uPrevMouse -> uMouse
// - Velocity-reactive radius: clamp(length(uMouse - uPrevMouse) * 14.0, 0.04, 0.18)
// - Decay factor: uDecay = 0.96
// - Lively 4-stream autonomous unstructured horizontal/wavy liquid ribbons
//   that continuously weave across both background and 3D helmet
// ============================================================================
export const fluidTrailVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const fluidTrailFragmentShader = /* glsl */ `
  uniform sampler2D uPrevTrail;
  uniform float uAspect;
  uniform vec2 uMouse;
  uniform vec2 uPrevMouse;
  uniform vec2 uMouseLerp;
  uniform float uDecay;
  uniform float uIsMoving;

  uniform vec2 uMouseB;
  uniform vec2 uPrevMouseB;
  uniform vec2 uAuto1;
  uniform vec2 uPrevAuto1;
  uniform vec2 uAuto2;
  uniform vec2 uPrevAuto2;
  uniform vec2 uAuto3;
  uniform vec2 uPrevAuto3;
  uniform vec2 uAuto4;
  uniform vec2 uPrevAuto4;
  uniform float uHelmetPhaseWeight;
  uniform float uTime;

  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(
      0.211324865405187,
      0.366025403784439,
     -0.577350269189626,
      0.024390243902439
    );
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float sdSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.000001), 0.0, 1.0);
    return length(pa - ba * h);
  }

  float smax(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (a - b) / k, 0.0, 1.0);
    return mix(b, a, h) + k * h * (1.0 - h);
  }

  void main() {
    vec2 aspect = vec2(uAspect, 1.0);
    vec2 p = vUv * aspect;

    // True 2D Curl-Noise Advection so liquid trails swirl and flow organically
    float eps = 0.02;
    vec2 pCurl = p * 3.4 + vec2(uTime * 0.38, -uTime * 0.32);
    float nUp = snoise(pCurl + vec2(0.0, eps));
    float nDn = snoise(pCurl - vec2(0.0, eps));
    float nRt = snoise(pCurl + vec2(eps, 0.0));
    float nLt = snoise(pCurl - vec2(eps, 0.0));
    vec2 curlVel = vec2(nUp - nDn, -(nRt - nLt)) / (2.0 * eps);
    vec2 drift = curlVel * 0.0022;

    vec2 texel = vec2(1.0 / 512.0);
    vec2 sampleUv = clamp(vUv - drift, 0.002, 0.998);
    float c = texture2D(uPrevTrail, sampleUv).r;
    float n = texture2D(uPrevTrail, clamp(sampleUv + vec2(0.0, texel.y), 0.002, 0.998)).r;
    float s = texture2D(uPrevTrail, clamp(sampleUv - vec2(0.0, texel.y), 0.002, 0.998)).r;
    float e = texture2D(uPrevTrail, clamp(sampleUv + vec2(texel.x, 0.0), 0.002, 0.998)).r;
    float w = texture2D(uPrevTrail, clamp(sampleUv - vec2(texel.x, 0.0), 0.002, 0.998)).r;
    float prevTrail = c * 0.68 + (n + s + e + w) * 0.08;

    float decayed = prevTrail * uDecay;
    if (decayed < 0.0025) decayed = 0.0;

    // Multi-octave organic domain warp for flowing silk-liquid ribbons
    float n1 = snoise(p * 4.6 + vec2(uTime * 0.88, -uTime * 0.72));
    float n2 = snoise(p * 9.8 - vec2(uTime * 1.42, uTime * 1.12));
    float n3 = snoise(p * 16.0 + curlVel * 0.35 + uTime * 1.65);
    float organicWarp = n1 * 0.032 + n2 * 0.014 + n3 * 0.006;

    // 1. Velocity-reactive cursor brush along segment uPrevMouse -> uMouse
    float cursorVelocity = length(uMouse - uPrevMouse);
    float dynamicRadius = clamp(cursorVelocity * 14.0, 0.04, 0.18);
    float effectiveRadius = max(dynamicRadius, 0.095);

    vec2 pWarped = p + vec2(n1 * 0.026, n2 * 0.022) + curlVel * 0.008;
    float distPrimary = sdSegment(pWarped, uPrevMouse * aspect, uMouse * aspect);
    float distTrailing = sdSegment(pWarped, uPrevMouseB * aspect, uMouseB * aspect);

    // Dynamic rotating liquid tendril offshoots around cursor
    float rotA = uTime * 1.6 + n1 * 1.2;
    mat2 rotMat = mat2(cos(rotA), -sin(rotA), sin(rotA), cos(rotA));
    vec2 cursorAniso = (rotMat * (pWarped - uMouse * aspect)) * vec2(0.52, 1.55);
    float distAniso = min(distPrimary, length(cursorAniso));

    float blobPrimary =
      smoothstep(effectiveRadius + organicWarp, max(0.0, effectiveRadius * 0.08), distAniso) *
      uIsMoving;
    float blobTrailing =
      smoothstep(effectiveRadius * 0.86 - organicWarp * 0.75, 0.0, distTrailing) *
      uIsMoving * 0.94;
    float cursorBrush = smax(blobPrimary, blobTrailing, 0.085);

    // 2. Choreographed 4-Stream Autonomous Silk-Liquid Ribbons
    vec2 pStream = p + vec2(
      n1 * 0.030 + n3 * 0.008,
      snoise(vec2(p.x * 4.5 + uTime * 0.72, p.y * 4.8 - uTime * 0.48)) * 0.036
    );

    float dAuto1 = sdSegment(pStream, uPrevAuto1 * aspect, uAuto1 * aspect);
    float dAuto2 = sdSegment(pStream, uPrevAuto2 * aspect, uAuto2 * aspect);
    float dAuto3 = sdSegment(pStream, uPrevAuto3 * aspect, uAuto3 * aspect);
    float dAuto4 = sdSegment(pStream, uPrevAuto4 * aspect, uAuto4 * aspect);

    // Dynamic pulsing ribbon widths so streams breathe and morph instead of looking static
    float pulse1 = 0.098 + 0.024 * sin(uTime * 2.1 + p.x * 4.0);
    float pulse2 = 0.106 + 0.026 * cos(uTime * 1.8 - p.y * 4.5);
    float pulse3 = 0.092 + 0.022 * sin(uTime * 2.5 + p.x * 3.5);
    float pulse4 = 0.096 + 0.025 * cos(uTime * 1.9 + p.y * 3.8);

    vec2 stretch1 = (pStream - uAuto1 * aspect) * vec2(0.40, 1.85);
    vec2 stretch2 = (pStream - uAuto2 * aspect) * vec2(0.36, 1.75);
    vec2 stretch3 = (pStream - uAuto3 * aspect) * vec2(0.44, 1.68);
    vec2 stretch4 = (pStream - uAuto4 * aspect) * vec2(0.42, 1.58);

    float ribbon1 = smoothstep(pulse1 + organicWarp, 0.0, min(dAuto1, length(stretch1)));
    float ribbon2 = smoothstep(pulse2 - organicWarp * 0.8, 0.0, min(dAuto2, length(stretch2)));
    float ribbon3 = smoothstep(pulse3 + organicWarp * 0.65, 0.0, min(dAuto3, length(stretch3)));
    float ribbon4 = smoothstep(pulse4 - organicWarp * 0.55, 0.0, min(dAuto4, length(stretch4)));

    float autoRibbons = smax(
      smax(ribbon1, ribbon2, 0.08),
      smax(ribbon3, ribbon4, 0.08),
      0.08
    );

    // Hollow island cutouts inside wide background puddles
    float islandNoise = snoise(p * 4.4 + vec2(-uTime * 0.58, uTime * 0.46));
    float outsideHead = smoothstep(0.12, 0.26, abs(vUv.x - 0.52));
    float hollowIsland = 1.0 - smoothstep(0.34, 0.55, islandNoise) * outsideHead * 0.88;

    autoRibbons *= hollowIsland * uHelmetPhaseWeight;

    float combinedBrush = smax(cursorBrush, autoRibbons, 0.085);
    float nextTrail = smax(decayed, combinedBrush, 0.06);

    gl_FragColor = vec4(clamp(nextTrail, 0.0, 1.0), cursorVelocity, 0.0, 1.0);
  }
`;

// ============================================================================
// SHADER 2: 2.5D DEPTH MAP + ULTRA-DETAILED 3D CAD WIREFRAME HELMET +
//           3D FERRARI HELMET + ANIMATED TOPOGRAPHIC BACKGROUND
// ============================================================================
export const displayVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const displayFragmentShader = /* glsl */ `
  uniform sampler2D uPortraitBase;
  uniform sampler2D uPortraitHelmet;
  uniform sampler2D uDepthMap;
  uniform sampler2D uRoughnessMap;
  uniform sampler2D uTrailMap;
  uniform sampler2D uNameBanner;

  uniform vec2 uResolution;
  uniform float uScreenAspect;
  uniform float uBaseAspect;
  uniform float uHelmetAspect;
  uniform vec2 uMouseLerp;
  uniform float uWireRevealProgress;
  uniform float uTime;

  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(
      0.211324865405187,
      0.366025403784439,
     -0.577350269189626,
      0.024390243902439
    );
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float getLuma(vec3 c) {
    return dot(c, vec3(0.299, 0.587, 0.114));
  }

  // =========================================================================
  // 1. CONTINUOUSLY ANIMATED ARCHITECTURAL TOPOGRAPHIC BACKGROUND
  // =========================================================================
  float getTopoField(vec2 uv) {
    vec2 aspect = vec2(uScreenAspect, 1.0);
    vec2 p = (uv - 0.5) * aspect * 1.12 - uMouseLerp * 0.022;
    // Continuous slow organic morphing so the background is always alive!
    vec2 flow = vec2(uTime * 0.045, -uTime * 0.032);
    float nMain = snoise(p + vec2(1.35, -0.75) + flow);
    float nSub = snoise(p * 2.1 - flow * 1.4) * 0.22;
    return (nMain + nSub) * 0.5 + 0.5;
  }

  float getTopoLevel(vec2 uv) {
    return floor(getTopoField(uv) * 5.2);
  }

  void computeTopoMap(
    vec2 uv,
    out float isContourEdge,
    out float isContinentFill,
    out float contourPulse
  ) {
    vec2 texel = 1.35 / uResolution;
    float f = getTopoField(uv);
    float c = floor(f * 5.2);
    float l = getTopoLevel(uv - vec2(texel.x, 0.0));
    float r = getTopoLevel(uv + vec2(texel.x, 0.0));
    float u = getTopoLevel(uv + vec2(0.0, texel.y));
    float d = getTopoLevel(uv - vec2(0.0, texel.y));

    isContourEdge = step(0.1, abs(c - l) + abs(c - r) + abs(c - u) + abs(c - d));
    float edgeBias = smoothstep(0.16, 0.62, abs(uv.x - 0.5) * 1.35);
    isContinentFill = smoothstep(0.54, 0.56, f * 0.82 + edgeBias * 0.28);

    // Subtle travelling shimmer along contour lines
    float wave = sin(uv.x * 14.0 + uv.y * 9.0 - uTime * 1.8) * 0.5 + 0.5;
    contourPulse = isContourEdge * pow(wave, 3.0);
  }

  vec2 screenToPortraitUv(vec2 screenUv, vec2 depthParallaxShift) {
    float mobileWeight = 1.0 - smoothstep(0.68, 0.95, uScreenAspect);
    float scaleY = mix(0.96, 0.78, mobileWeight);
    float scaleX = scaleY * (uBaseAspect / max(uScreenAspect, 0.001));
    vec2 center = vec2(0.50, mix(0.475, 0.395, mobileWeight)) + depthParallaxShift;
    return (screenUv - center) / vec2(scaleX, scaleY) + 0.5;
  }

  // Sample Name Banner ("NIKMATUS SOLIHAH" + Monogram) placed BEHIND head & helmet
  vec4 sampleNameBanner(vec2 screenUv, vec2 depthDisplacement) {
    float mobileWeight = 1.0 - smoothstep(0.68, 0.95, uScreenAspect);
    // Center the banner so upper half emerges above head and lower half is occluded by head & helmet
    vec2 center = vec2(0.50, mix(0.745, 0.638, mobileWeight)) + depthDisplacement * 0.35;
    float bannerWidth = mix(0.82, 0.96, mobileWeight);
    float bannerAspect = 2048.0 / 768.0;
    float bannerHeight = bannerWidth / bannerAspect * uScreenAspect;
    vec2 uv = (screenUv - center) / vec2(bannerWidth, bannerHeight) + 0.5;
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      return vec4(0.0);
    }
    return texture2D(uNameBanner, uv);
  }

  vec4 samplePortraitBaseClean(vec2 pUv) {
    if (pUv.x < 0.0 || pUv.x > 1.0 || pUv.y < 0.0 || pUv.y > 1.0) {
      return vec4(0.0);
    }
    vec2 texel = vec2(1.0 / 1080.0, 1.0 / 768.0);
    vec4 raw = texture2D(uPortraitBase, pUv);
    float aN = texture2D(uPortraitBase, pUv + vec2(0.0, texel.y)).a;
    float aS = texture2D(uPortraitBase, pUv - vec2(0.0, texel.y)).a;
    float aE = texture2D(uPortraitBase, pUv + vec2(texel.x, 0.0)).a;
    float aW = texture2D(uPortraitBase, pUv - vec2(texel.x, 0.0)).a;
    float minNeighborA = min(min(aN, aS), min(aE, aW));
    float cleanA = smoothstep(0.15, 0.85, min(raw.a, minNeighborA * 1.08));
    return vec4(raw.rgb, cleanA);
  }

  // =========================================================================
  // 2. ENLARGED 3D FERRARI F1 HELMET + ROUGHNESS SPECULAR POINT-LIGHT
  // =========================================================================
  vec4 samplePortraitHelmet3D(
    vec2 portraitUv,
    vec3 underlyingFaceRgb,
    vec3 roughnessSample,
    out vec2 outDomeCoord,
    out vec2 outUv3D,
    out float outSphereZ,
    out float outUnderChinShadow
  ) {
    // Calibrated to exact pixel bounds of /atusbefore.png head (X: 0.385..0.670, Y: 0.499..0.839, eyes Y: 0.694)
    // and /atus.png helmet (X: 0.120..0.880, Y: 0.058..0.938, visor Y: 0.367..0.567)
    vec2 helmetCenter = vec2(0.526, 0.665);
    float helmetSize = 0.635;

    vec2 rel = portraitUv - helmetCenter;
    float aspectCorr = uBaseAspect / max(uHelmetAspect, 0.001);
    vec2 hp = vec2(
      rel.x * aspectCorr / (helmetSize * 0.5),
      rel.y / (helmetSize * 0.5)
    );

    vec2 chinShadowP = vec2(hp.x * 1.15, (hp.y + 0.80) * 3.2);
    outUnderChinShadow =
      smoothstep(1.15, 0.15, length(chinShadowP)) *
      smoothstep(-0.42, -0.76, hp.y) *
      smoothstep(-1.25, -0.74, hp.y);

    float ang = -0.025 + sin(uTime * 0.85) * 0.006;
    float ca = cos(ang);
    float sa = sin(ang);
    hp = mat2(ca, -sa, sa, ca) * hp;

    outDomeCoord = hp;
    float r2 = dot(hp, hp);
    outSphereZ = sqrt(max(0.04, 1.0 - clamp(r2 * 0.82, 0.0, 0.96)));

    float rad = length(hp);
    float domeCurve = mix(
      1.0,
      asin(clamp(rad * 0.80, 0.0, 0.98)) / max(rad * 0.80, 0.001),
      0.14
    );
    vec2 liveTilt =
      uMouseLerp * (0.016 + 0.012 * outSphereZ) +
      vec2(cos(uTime * 0.9) * 0.004, sin(uTime * 0.72) * 0.003) * outSphereZ;

    // Trim transparent padding of /atus.png (X: 0.12..0.88, Y: 0.06..0.94)
    vec2 uv3D = (hp * domeCurve) * vec2(0.395, 0.445) + vec2(0.50, 0.50) - liveTilt;
    outUv3D = uv3D;

    if (uv3D.x < 0.0 || uv3D.x > 1.0 || uv3D.y < 0.0 || uv3D.y > 1.0) {
      return vec4(0.0);
    }

    vec2 texel = vec2(1.0 / 900.0);
    vec4 raw = texture2D(uPortraitHelmet, uv3D);
    vec4 cN = texture2D(uPortraitHelmet, uv3D + vec2(0.0, texel.y * 1.5));
    vec4 cS = texture2D(uPortraitHelmet, uv3D - vec2(0.0, texel.y * 1.5));
    vec4 cE = texture2D(uPortraitHelmet, uv3D + vec2(texel.x * 1.5, 0.0));
    vec4 cW = texture2D(uPortraitHelmet, uv3D - vec2(texel.x * 1.5, 0.0));

    float minA = min(min(cN.a, cS.a), min(cE.a, cW.a));
    float cleanAlpha = smoothstep(0.24, 0.88, min(raw.a, minA * 1.04));
    if (cleanAlpha <= 0.001) return vec4(0.0);

    float luma = getLuma(raw.rgb);
    float borderZone = 1.0 - smoothstep(0.68, 0.98, cleanAlpha);
    vec3 baseCol = mix(
      raw.rgb,
      vec3(0.84, 0.12, 0.08),
      borderZone * smoothstep(0.75, 0.96, luma)
    );

    vec3 domeN = normalize(vec3(hp.x * 1.12, hp.y * 1.04, outSphereZ));
    float dX = getLuma(cE.rgb) - getLuma(cW.rgb);
    float dY = getLuma(cN.rgb) - getLuma(cS.rgb);
    vec3 N = normalize(domeN + vec3(-dX * 1.25, -dY * 1.25, 0.0));

    float isVisorBand =
      max(
        roughnessSample.b,
        smoothstep(0.35, 0.40, uv3D.y) *
          (1.0 - smoothstep(0.56, 0.61, uv3D.y)) *
          (1.0 - smoothstep(0.20, 0.46, luma))
      );
    float surfaceRoughness = mix(roughnessSample.r, 0.06, isVisorBand);
    float metallicWeight = max(roughnessSample.g, isVisorBand * 0.95);

    vec3 smokedFace = underlyingFaceRgb * vec3(0.85, 0.72, 0.68);
    baseCol = mix(baseCol, smokedFace, isVisorBand * 0.16);

    float lightSpin = sin(uTime * 1.05) * 0.14;
    vec3 pointLightPos = vec3(
      -0.28 + uMouseLerp.x * 0.75 + lightSpin,
      0.48 + uMouseLerp.y * 0.55,
      0.88
    );
    vec3 surfacePos = vec3(hp * 0.45, outSphereZ * 0.35);
    vec3 lightDir = normalize(pointLightPos - surfacePos);
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfVec = normalize(lightDir + viewDir);

    float diff = max(0.0, dot(N, lightDir));
    float shininess = mix(14.0, 96.0, 1.0 - surfaceRoughness);
    float spec =
      pow(max(0.0, dot(N, halfVec)), shininess) *
      (1.0 - surfaceRoughness * 0.65) *
      (0.48 + 0.78 * metallicWeight);
    float clearcoat = pow(max(0.0, dot(domeN, halfVec)), 22.0);

    float refX = hp.x - uMouseLerp.x * 0.38 - sin(uTime * 0.8) * 0.07;
    float visorWindowMain = exp(-pow((refX + 0.06) * 6.5, 2.0)) * isVisorBand * 0.68;
    float visorWindowSide = exp(-pow((refX - 0.28) * 11.0, 2.0)) * isVisorBand * 0.36;

    float sideRimHighlight =
      smoothstep(0.55, 0.85, abs(hp.x)) *
      smoothstep(0.96, 0.72, abs(hp.x)) *
      smoothstep(-0.55, 0.65, hp.y) *
      0.28;

    float outerRollOff = smoothstep(0.98, 0.74, rad);
    float domeShade = (0.85 + 0.22 * domeN.z + 0.20 * diff) * (0.82 + 0.18 * outerRollOff);

    vec3 lit3D =
      baseCol * domeShade +
      vec3(1.0, 0.98, 0.95) *
        (spec * 0.38 + clearcoat * 0.15 + visorWindowMain + visorWindowSide + sideRimHighlight);

    return vec4(clamp(lit3D, 0.0, 1.0), cleanAlpha);
  }

  // =========================================================================
  // 3. ULTRA-MODERN 3D F1 AERO-CAD & HOLOGRAPHIC TELEMETRY WIREFRAME
  //    (Keeps the exact 1:1 cleanHelmetAlpha & uv3D size/position, while
  //     replacing noisy photo edges with pure 3D parametric aero-splines,
  //     crosshair nodes, radial pivot dials, carbon micro-lattice, and
  //     traveling optical data pulses!)
  // =========================================================================
  vec4 evaluateArchitecturalWireframe(
    vec2 uv3D,
    float cleanHelmetAlpha,
    float revealProgress
  ) {
    // Keep the EXACT same alpha mask & bounds as the 3D helmet photo!
    if (cleanHelmetAlpha <= 0.001 || uv3D.x < 0.01 || uv3D.x > 0.99 || uv3D.y < 0.01 || uv3D.y > 0.99) {
      return vec4(0.0);
    }

    // Normalized vertical coordinate in [-1, 1] matching /atus.png Y bounds (0.060..0.940)
    float pY = (uv3D.y - 0.50) / 0.440;
    // Exact profile half-width of /atus.png at height pY so 3D lines hug the real contour
    float profileHalfWidth = 0.380 * sqrt(max(0.06, 1.0 - pow(clamp((pY - 0.02) * 0.92, -0.97, 0.97), 2.0)));
    float pX = (uv3D.x - 0.50) / max(profileHalfWidth, 0.04);

    vec2 pShell = vec2((uv3D.x - 0.50) / 0.380, pY);
    float domeZ = sqrt(max(0.03, 1.0 - clamp(pX * pX * 0.74 + pY * pY * 0.26, 0.0, 0.97)));

    // Top-to-Bottom Phased Scan Reveal across the entire helmet (+1.05 down to -1.05)
    float fullHelmetBottom = -1.05;
    float scanLineY = mix(1.05, fullHelmetBottom, revealProgress);
    float waveUndulation = sin(pShell.x * 5.5 + uTime * 2.4) * 0.022 * (1.0 - revealProgress);
    float currentCutoff = max(fullHelmetBottom, scanLineY + waveUndulation);

    float bottomClip = smoothstep(currentCutoff - 0.025, currentCutoff + 0.032, pY);
    if (bottomClip <= 0.001) {
      return vec4(0.0);
    }

    float innerShellMask = smoothstep(0.55, 0.94, cleanHelmetAlpha);

    // 3D Spherical Coordinates locked to the exact helmet profile
    float lon = asin(clamp(pX, -0.985, 0.985));
    float lat = asin(clamp(pY, -0.985, 0.985));

    // =======================================================================
    // TIER 1: MODERN 3D AERO-SPLINES & PRECISION GEODESIC TRIANGULATION
    // =======================================================================
    float lonScaled = lon * 9.5;
    float latScaled = lat * 9.0;

    // Ultra-crisp sub-pixel continuous meridian & parallel splines
    float meridianLine = 1.0 - smoothstep(0.0, 0.022, abs(fract(lonScaled) - 0.5));
    float parallelLine = 1.0 - smoothstep(0.0, 0.022, abs(fract(latScaled) - 0.5));

    // Modern dashed secondary diagonal aero-struts (broken at intervals like F1 CAD HUD)
    float diagDashMask = smoothstep(-0.15, 0.25, sin((lon + lat) * 28.0));
    float diagStrutA =
      (1.0 - smoothstep(0.0, 0.018, abs(fract(lonScaled + latScaled) - 0.5))) *
      diagDashMask;
    float diagStrutB =
      (1.0 - smoothstep(0.0, 0.018, abs(fract(lonScaled - latScaled) - 0.5))) *
      diagDashMask;

    // Sharp Modern Crosshair Nodes (+) & Precision Ring Nodes at grid intersections
    vec2 gridLocal = fract(vec2(lonScaled, latScaled)) - 0.5;
    float crossArmX = (1.0 - smoothstep(0.0, 0.016, abs(gridLocal.y))) * (1.0 - smoothstep(0.075, 0.095, abs(gridLocal.x)));
    float crossArmY = (1.0 - smoothstep(0.0, 0.016, abs(gridLocal.x))) * (1.0 - smoothstep(0.075, 0.095, abs(gridLocal.y)));
    float nodeRing  = 1.0 - smoothstep(0.0, 0.018, abs(length(gridLocal) - 0.055));
    float modernCrosshairNode = clamp(crossArmX + crossArmY + nodeRing * 0.7, 0.0, 1.0);

    // 3D Iso-Depth Topographic Contours wrapping the 3D curvature (LiDAR aero flow!)
    float isoDepthWave = abs(fract(domeZ * 7.5 - uTime * 0.22) - 0.5);
    float isoDepthContour = (1.0 - smoothstep(0.0, 0.026, isoDepthWave)) * (1.0 - domeZ * 0.55);

    // Central Aero Spine (double-track racing stripe vector along the crown)
    float centerSpineZone = smoothstep(0.18, 0.88, pY) * (1.0 - smoothstep(0.095, 0.115, abs(pShell.x)));
    float centerSpineRails =
      ((1.0 - smoothstep(0.0, 0.006, abs(abs(pShell.x) - 0.088))) +
       (1.0 - smoothstep(0.0, 0.005, abs(pShell.x)))) *
      smoothstep(0.20, 0.88, pY);
    float centerSpineTicks =
      (1.0 - smoothstep(0.0, 0.04, abs(fract(pY * 26.0) - 0.5))) * centerSpineZone * 0.45;

    // =======================================================================
    // TIER 2: CONCENTRIC 3D LIDAR CROWN EMITTER (Top Apex below "NS" Logo)
    // =======================================================================
    vec2 crownDiskP = vec2(pShell.x * 2.35, (pY - 0.85) * 7.4);
    float crownDiskDist = length(crownDiskP);
    float crownAngle = atan(crownDiskP.y, crownDiskP.x);
    float crownDiskMask = 1.0 - smoothstep(0.78, 1.0, crownDiskDist);
    float crownRings =
      (1.0 - smoothstep(0.0, 0.13, abs(fract(crownDiskDist * 8.5 - uTime * 0.42) - 0.5))) *
      crownDiskMask;
    float crownRadarSweep =
      (0.5 + 0.5 * sin(crownAngle * 2.0 - uTime * 2.8)) * crownDiskMask;
    float crownSpokes =
      (1.0 - smoothstep(0.0, 0.09, abs(fract(crownAngle * 5.0929) - 0.5))) *
      crownDiskMask * (0.45 + 0.45 * crownRadarSweep);

    // =======================================================================
    // TIER 3: CLEAN PARAMETRIC VISOR, BROW TRUSS, TEMPLE DIALS & CHEEK PADS
    // =======================================================================
    float dx = uv3D.x - 0.50;
    float browTopUvY = 0.602 - 0.22 * (dx * dx);
    float browMidUvY = 0.583 - 0.21 * (dx * dx);
    float browBotUvY = 0.564 - 0.20 * (dx * dx);
    float visorBotUvY = 0.368 + 0.32 * (dx * dx);

    float browZone =
      smoothstep(browBotUvY - 0.006, browBotUvY + 0.003, uv3D.y) *
      (1.0 - smoothstep(browTopUvY - 0.003, browTopUvY + 0.006, uv3D.y));

    // Modern diagonal aero-truss inside the forehead brow band
    float browDiagTruss =
      max(
        1.0 - smoothstep(0.0, 0.035, abs(fract(lon * 20.0 + (uv3D.y - browBotUvY) * 18.0) - 0.5)),
        1.0 - smoothstep(0.0, 0.035, abs(fract(lon * 20.0 - (uv3D.y - browBotUvY) * 18.0) - 0.5))
      ) * browZone;

    // Double-Bevel Visor Frame Lines
    float visorFrameLines =
      (1.0 - smoothstep(0.0, 0.0035, abs(uv3D.y - browTopUvY))) +
      (1.0 - smoothstep(0.0, 0.0025, abs(uv3D.y - browMidUvY))) * 0.65 +
      (1.0 - smoothstep(0.0, 0.0035, abs(uv3D.y - browBotUvY))) +
      (1.0 - smoothstep(0.0, 0.0035, abs(uv3D.y - visorBotUvY))) +
      (1.0 - smoothstep(0.0, 0.0025, abs(uv3D.y - (visorBotUvY + 0.014)))) * 0.65;

    // Temple Mechanical Pivot Dials (Left & Right Visor Hinges with Radial Degree Ticks)
    vec2 pivotP = vec2(abs(pShell.x) - 0.84, pY - 0.01);
    float pivotDist = length(pivotP * vec2(1.15, 0.85));
    float pivotAngle = atan(pivotP.y, pivotP.x);
    float pivotOuterRing = 1.0 - smoothstep(0.0, 0.007, abs(pivotDist - 0.115));
    float pivotInnerRing = 1.0 - smoothstep(0.0, 0.006, abs(pivotDist - 0.068));
    float pivotCoreRing  = 1.0 - smoothstep(0.0, 0.006, abs(pivotDist - 0.028));
    float pivotRadialTicks =
      (1.0 - smoothstep(0.0, 0.08, abs(fract(pivotAngle * 3.8197 + uTime * 0.25) - 0.5))) *
      smoothstep(0.068, 0.075, pivotDist) *
      (1.0 - smoothstep(0.108, 0.115, pivotDist));
    float templePivotCAD =
      clamp(pivotOuterRing + pivotInnerRing + pivotCoreRing + pivotRadialTicks * 0.85, 0.0, 1.0) *
      smoothstep(0.64, 0.72, abs(pShell.x));

    // Sculpted Double-Track Cheek Aero Pads (beside the nose, below the eyes)
    float cheekCurveY = pY + 0.22 - 0.15 * (pShell.x * pShell.x);
    vec2 cheekPadP = vec2(abs(pShell.x) - 0.35, cheekCurveY);
    vec2 qCheek = abs(cheekPadP) - vec2(0.165, 0.045) + 0.022;
    float dCheek = length(max(qCheek, 0.0)) + min(max(qCheek.x, qCheek.y), 0.0) - 0.022;
    float cheekOuterTrack = 1.0 - smoothstep(0.0, 0.006, abs(dCheek));
    float cheekInnerTrack = 1.0 - smoothstep(0.0, 0.005, abs(dCheek + 0.016));
    float cheekCarbonHatch =
      (1.0 - smoothstep(0.0, 0.06, abs(fract((pShell.x + pY) * 36.0) - 0.5))) *
      (1.0 - smoothstep(-0.004, 0.008, dCheek + 0.016)) * 0.42;
    float cheekPadCAD =
      (cheekOuterTrack + cheekInnerTrack * 0.85 + cheekCarbonHatch) *
      smoothstep(0.10, 0.15, abs(pShell.x)) *
      smoothstep(0.65, 0.55, abs(pShell.x));

    // Twin Chin Bar Aero-Intake Vents (pY ~ -0.42)
    float chinVentCurveY = pY + 0.42 - 0.10 * (pShell.x * pShell.x);
    vec2 chinVentP = vec2(abs(pShell.x) - 0.24, chinVentCurveY);
    vec2 qVent = abs(chinVentP) - vec2(0.115, 0.032) + 0.014;
    float dVent = length(max(qVent, 0.0)) + min(max(qVent.x, qVent.y), 0.0) - 0.014;
    float chinVentFrame =
      (1.0 - smoothstep(0.0, 0.006, abs(dVent))) +
      (1.0 - smoothstep(0.0, 0.005, abs(dVent + 0.012))) * 0.75;
    float chinVentHoneycomb =
      max(
        1.0 - smoothstep(0.0, 0.07, abs(fract((pShell.x + pY * 1.4) * 44.0) - 0.5)),
        1.0 - smoothstep(0.0, 0.07, abs(fract((pShell.x - pY * 1.4) * 44.0) - 0.5))
      ) * (1.0 - smoothstep(-0.002, 0.006, dVent + 0.012)) * 0.55;
    float chinVentCAD =
      (chinVentFrame + chinVentHoneycomb) *
      smoothstep(0.07, 0.11, abs(pShell.x)) *
      smoothstep(0.46, 0.38, abs(pShell.x));

    // Lower Chin Spoiler Aero Splitter Line (pY ~ -0.62)
    float chinSpoilerY = -0.60 + 0.18 * (pShell.x * pShell.x);
    float chinSpoilerLine =
      ((1.0 - smoothstep(0.0, 0.006, abs(pY - chinSpoilerY))) +
       (1.0 - smoothstep(0.0, 0.005, abs(pY - (chinSpoilerY - 0.035)))) * 0.65) *
      smoothstep(0.72, 0.52, abs(pShell.x));

    // =======================================================================
    // TIER 4: OUTER DOUBLE-BEVEL SHELL RIM & LIVE OPTICAL DATA PULSES
    // =======================================================================
    vec2 inwardDir = normalize(vec2(0.50 - uv3D.x, 0.50 - uv3D.y) + 0.0001);
    float aInner1 = texture2D(uPortraitHelmet, uv3D + inwardDir * 0.009).a;
    float aInner2 = texture2D(uPortraitHelmet, uv3D + inwardDir * 0.020).a;
    float outerRimStroke = (1.0 - smoothstep(0.72, 0.99, cleanHelmetAlpha)) * smoothstep(0.05, 0.45, cleanHelmetAlpha);
    float innerRimStroke = (1.0 - smoothstep(0.75, 0.98, aInner1)) * smoothstep(0.50, 0.95, aInner2);
    float fresnel = pow(1.0 - domeZ, 2.1);

    // Crystal Eye-Port Window so the eyes remain sharp and expressive
    vec2 eyePortP = vec2(dx * 3.0, (uv3D.y - 0.475) * 8.2);
    float eyePortClear = smoothstep(0.26, 0.70, length(eyePortP));

    // Traveling Optical Data Pulses along meridians & parallels
    float dataPulseMeridian =
      exp(-pow(fract(pY * 0.90 - uTime * 0.48 + sin(lon * 3.0) * 0.15) - 0.5, 2.0) * 95.0);
    float dataPulseParallel =
      exp(-pow(fract(lon * 0.55 + uTime * 0.36) - 0.5, 2.0) * 80.0);
    float opticalPulse = max(dataPulseMeridian, dataPulseParallel * 0.8);

    float activeScanEdge =
      (1.0 - smoothstep(0.0, 0.018, abs(pY - currentCutoff))) *
      (1.0 - step(0.99, revealProgress));

    // Combine Primary Structural CAD Lines + Geodesic Aero-Splines
    float geodesicCombined =
      max(meridianLine, parallelLine) * 0.68 +
      max(diagStrutA, diagStrutB) * 0.42 +
      isoDepthContour * 0.48 +
      modernCrosshairNode * 0.85;

    float structuralCAD =
      visorFrameLines * 0.78 +
      browDiagTruss * 0.52 +
      centerSpineRails * 0.68 +
      centerSpineTicks +
      (crownRings + crownSpokes) * 0.78 +
      templePivotCAD * 0.92 +
      cheekPadCAD * 0.88 +
      chinVentCAD * 0.85 +
      chinSpoilerLine * 0.65;

    float cadStroke =
      structuralCAD * innerShellMask +
      geodesicCombined * mix(0.24, 0.65, max(browZone, fresnel)) * eyePortClear * innerShellMask +
      (outerRimStroke * 1.25 + innerRimStroke * 0.68) +
      activeScanEdge * 0.95;

    cadStroke = clamp(cadStroke * (1.0 + 0.52 * opticalPulse), 0.0, 1.0);

    // =======================================================================
    // MODERN HOLOGRAPHIC GLASS & LUMINOUS ROSE-TITANIUM CAD PALETTE
    // =======================================================================
    float glassHaloFill =
      (0.06 + fresnel * 0.34 + crownDiskMask * 0.14 + browZone * 0.08) *
      mix(0.20, 1.0, eyePortClear);

    vec3 glassFrost = vec3(0.988, 0.980, 0.984);
    vec3 cadTitaniumBurgundy = vec3(0.22, 0.06, 0.11);
    vec3 cadLuminousRose = vec3(0.94, 0.48, 0.60);
    vec3 cadWhiteHot = vec3(1.0, 0.95, 0.97);

    // Lines shift from crisp Titanium-Burgundy to Luminous Rose-Pink & White-Hot at nodes & optical pulses!
    float highlightWeight = clamp(
      opticalPulse * 0.78 +
      modernCrosshairNode * 0.65 +
      crownRadarSweep * crownDiskMask * 0.55 +
      activeScanEdge,
      0.0,
      1.0
    );
    vec3 dynamicStrokeCol = mix(cadTitaniumBurgundy, cadLuminousRose, highlightWeight);
    dynamicStrokeCol = mix(
      dynamicStrokeCol,
      cadWhiteHot,
      clamp(modernCrosshairNode * opticalPulse * 0.85 + activeScanEdge * 0.6, 0.0, 1.0)
    );

    vec3 wireColor = mix(
      glassFrost,
      dynamicStrokeCol,
      clamp(cadStroke * 1.15, 0.0, 1.0)
    );

    // Multiply directly by cleanHelmetAlpha so outer boundary stays 100.00% identical to colHelmet3D.a!
    float finalWireAlpha =
      cleanHelmetAlpha *
      bottomClip *
      clamp(glassHaloFill + cadStroke * 0.84, 0.0, 0.88);

    return vec4(wireColor, finalWireAlpha);
  }

  void main() {
    // 1. Sample Ping-Pong Fluid Trail & 4-neighbor gradient for 3D Liquid Glass Refraction!
    vec2 trailTexel = vec2(1.0 / 512.0);
    vec4 trail = texture2D(uTrailMap, vUv);
    float tN = texture2D(uTrailMap, vUv + vec2(0.0, trailTexel.y * 2.0)).r;
    float tS = texture2D(uTrailMap, vUv - vec2(0.0, trailTexel.y * 2.0)).r;
    float tE = texture2D(uTrailMap, vUv + vec2(trailTexel.x * 2.0, 0.0)).r;
    float tW = texture2D(uTrailMap, vUv - vec2(trailTexel.x * 2.0, 0.0)).r;
    vec2 trailGrad = vec2(tE - tW, tN - tS);

    float trailAlphaMask = smoothstep(0.06, 0.60, trail.r);
    float ribbonCoreMask = smoothstep(0.24, 0.31, trail.r);
    float effectiveRevealMask = mix(trailAlphaMask, ribbonCoreMask, 0.72);

    float ribbonShadow = smoothstep(0.05, 0.26, trail.r) * (1.0 - ribbonCoreMask);
    float ribbonCutEdge =
      smoothstep(0.21, 0.275, trail.r) *
      (1.0 - smoothstep(0.275, 0.36, trail.r));
    // Secondary outer ripple ring around the fluid trail
    float liquidRippleRing =
      smoothstep(0.06, 0.11, trail.r) *
      (1.0 - smoothstep(0.11, 0.17, trail.r));

    // Liquid glass lens refraction along the ribbon boundary
    vec2 liquidRefraction = trailGrad * 0.012 * (1.0 - ribbonCoreMask * 0.5);

    // 2. Sample 2.5D Depth Map & Displace UVs by (texture2D(uDepthMap, uv).r - 0.5) * uMouseLerp * 0.028
    float depthValue = texture2D(uDepthMap, vUv).r;
    vec2 depthDisplacement = (depthValue - 0.5) * uMouseLerp * 0.028;
    vec2 displacedScreenUv = clamp(
      vUv + depthDisplacement * 0.35 + liquidRefraction,
      0.001,
      0.999
    );

    // 3. Sample Roughness Map at displaced UV
    vec3 roughnessSample = texture2D(uRoughnessMap, displacedScreenUv).rgb;

    // 4. Continuously Animated Architectural Topographic Background
    float isContourEdge, isContinentFill, contourPulse;
    computeTopoMap(displacedScreenUv, isContourEdge, isContinentFill, contourPulse);

    vec3 bgDefault = vec3(0.962, 0.960, 0.944);
    bgDefault = mix(bgDefault, vec3(0.924, 0.918, 0.896), isContinentFill * 0.85);
    bgDefault = mix(bgDefault, vec3(0.822, 0.812, 0.782), isContourEdge * 0.78);
    // Subtle rose-gold shimmer travelling along the moving background contours
    bgDefault = mix(bgDefault, vec3(0.91, 0.58, 0.66), contourPulse * 0.42);

    // Revealed second background layer inside fluid ribbons:
    // Luminous Rose-Champagne & Deep Editorial Rose-Burgundy Contours!
    vec3 bgCursorNewColor = mix(
      vec3(0.948, 0.888, 0.904),
      vec3(0.912, 0.828, 0.852),
      vUv.y * 0.65
    );
    bgCursorNewColor = mix(bgCursorNewColor, vec3(0.875, 0.768, 0.798), isContinentFill * 0.90);
    bgCursorNewColor = mix(bgCursorNewColor, vec3(0.62, 0.24, 0.34), isContourEdge * 0.85);
    // Bright rose-gold contour pulse inside the fluid trail
    bgCursorNewColor = mix(bgCursorNewColor, vec3(0.98, 0.66, 0.74), contourPulse * 0.65);

    vec3 shadowedBg = bgDefault * (1.0 - ribbonShadow * 0.06);
    vec3 activeBg = mix(shadowedBg, bgCursorNewColor, effectiveRevealMask);
    // Add iridescent rose-pearl meniscus highlight & outer ripple on background
    activeBg = mix(activeBg, vec3(0.98, 0.74, 0.80), liquidRippleRing * 0.38);
    activeBg = mix(activeBg, vec3(1.0, 0.95, 0.97), ribbonCutEdge * 0.55);

    // 5. Base Portrait (uPortraitBase) with 2.5D Depth Displacement
    vec2 basePortraitUv = screenToPortraitUv(vUv, depthDisplacement);
    vec4 colBefore = samplePortraitBaseClean(basePortraitUv);

    // 6. 3D Helmet Layer (uPortraitHelmet) with Roughness Specular Reflection & Liquid Refraction
    vec2 helmetPortraitUv = screenToPortraitUv(
      vUv,
      depthDisplacement + uMouseLerp * 0.004 + liquidRefraction * 0.35
    );
    vec2 domeCoord;
    vec2 helmetUv3D;
    float sphereZ;
    float underChinShadow;
    vec4 colHelmet3D = samplePortraitHelmet3D(
      helmetPortraitUv,
      colBefore.rgb,
      roughnessSample,
      domeCoord,
      helmetUv3D,
      sphereZ,
      underChinShadow
    );

    float chinShadowStrength =
      underChinShadow * colBefore.a * (0.14 + 0.52 * effectiveRevealMask);
    vec3 shadowedPortraitRgb = colBefore.rgb * (1.0 - chinShadowStrength);

    // 4B. Composite Name Banner BEHIND portrait head, wireframe, and helmet!
    vec4 nameBannerCol = sampleNameBanner(displacedScreenUv, depthDisplacement);
    vec3 bgWithName = mix(activeBg, nameBannerCol.rgb, nameBannerCol.a);

    vec3 baseComposite = mix(bgWithName, shadowedPortraitRgb, colBefore.a);

    // 7. Ultra-Refined 3D Architectural CAD Wireframe Helmet (1:1 locked to helmetUv3D & colHelmet3D.a)
    vec4 archWire = evaluateArchitecturalWireframe(
      helmetUv3D,
      colHelmet3D.a,
      uWireRevealProgress
    );
    vec3 wireframeScene = mix(baseComposite, archWire.rgb, archWire.a);

    // 8. Reveal uPortraitHelmet underneath uPortraitBase using Ping-Pong Fluid Trail
    //    with Iridescent Rose-Gold & Pearl Liquid Meniscus Bevel!
    vec3 shadowedScene =
      wireframeScene * (1.0 - ribbonShadow * colHelmet3D.a * 0.36);

    vec3 liquidMeniscusColor = mix(
      vec3(0.98, 0.68, 0.76),
      vec3(1.0, 0.98, 0.99),
      0.5 + 0.5 * sin(vUv.x * 18.0 + uTime * 3.0)
    );
    vec3 helmetWithCutBevel = mix(
      colHelmet3D.rgb,
      liquidMeniscusColor,
      ribbonCutEdge * colHelmet3D.a * 0.68
    );

    float helmetReveal = effectiveRevealMask * colHelmet3D.a;
    vec3 finalRgb = mix(shadowedScene, helmetWithCutBevel, helmetReveal);

    gl_FragColor = vec4(clamp(finalRgb, 0.0, 1.0), 1.0);
  }
`;

export default function HeroFluidScene({
  portraitBaseUrl = "/atusbefore.png",
  portraitHelmetUrl = "/atus.png",
  depthMapUrl,
  roughnessMapUrl,
  className = "hero-webgl-canvas",
}: HeroFluidSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    const dpr = Math.min(window.devicePixelRatio || 1, 1.35);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(dpr);
    renderer.autoClear = false;

    const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quadGeo = new THREE.PlaneGeometry(2, 2);

    const rtType = renderer.capabilities.isWebGL2
      ? THREE.HalfFloatType
      : THREE.UnsignedByteType;
    const rtOptions: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: rtType,
      depthBuffer: false,
      stencilBuffer: false,
    };
    let rtA = new THREE.WebGLRenderTarget(512, 512, rtOptions);
    let rtB = new THREE.WebGLRenderTarget(512, 512, rtOptions);

    const fluidScene = new THREE.Scene();
    const fluidUniforms = {
      uPrevTrail: { value: null as THREE.Texture | null },
      uAspect: { value: window.innerWidth / Math.max(1, window.innerHeight) },
      uMouse: { value: new THREE.Vector2(0.52, 0.58) },
      uPrevMouse: { value: new THREE.Vector2(0.52, 0.58) },
      uMouseLerp: { value: new THREE.Vector2(0.0, 0.0) },
      uDecay: { value: 0.96 },
      uIsMoving: { value: 0.0 },
      uMouseB: { value: new THREE.Vector2(0.52, 0.58) },
      uPrevMouseB: { value: new THREE.Vector2(0.52, 0.58) },
      uAuto1: { value: new THREE.Vector2(0.28, 0.69) },
      uPrevAuto1: { value: new THREE.Vector2(0.28, 0.69) },
      uAuto2: { value: new THREE.Vector2(0.72, 0.56) },
      uPrevAuto2: { value: new THREE.Vector2(0.72, 0.56) },
      uAuto3: { value: new THREE.Vector2(0.48, 0.43) },
      uPrevAuto3: { value: new THREE.Vector2(0.48, 0.43) },
      uAuto4: { value: new THREE.Vector2(0.64, 0.64) },
      uPrevAuto4: { value: new THREE.Vector2(0.64, 0.64) },
      uHelmetPhaseWeight: { value: 0.0 },
      uTime: { value: 0 },
    };

    const fluidMat = new THREE.ShaderMaterial({
      uniforms: fluidUniforms,
      vertexShader: fluidTrailVertexShader,
      fragmentShader: fluidTrailFragmentShader,
      depthWrite: false,
      depthTest: false,
    });
    fluidScene.add(new THREE.Mesh(quadGeo, fluidMat));

    const generatedDepthMap = createAlignedDepthMapTexture();
    const generatedRoughnessMap = createAlignedRoughnessMapTexture();
    const nameBanner = createNameBannerTexture();

    if (typeof document !== "undefined" && (document as any).fonts) {
      (document as any).fonts.load?.('800 176px Oswald').then(() => {
        nameBanner.refresh();
      });
      (document as any).fonts.ready?.then(() => {
        nameBanner.refresh();
      });
      if ((document as any).fonts.addEventListener) {
        (document as any).fonts.addEventListener("loadingdone", () => {
          nameBanner.refresh();
        });
      }
    }

    const displayScene = new THREE.Scene();
    const displayUniforms = {
      uPortraitBase: { value: null as THREE.Texture | null },
      uPortraitHelmet: { value: null as THREE.Texture | null },
      uDepthMap: { value: generatedDepthMap as THREE.Texture },
      uRoughnessMap: { value: generatedRoughnessMap as THREE.Texture },
      uTrailMap: { value: rtA.texture },
      uNameBanner: { value: nameBanner.texture },
      uResolution: {
        value: new THREE.Vector2(
          window.innerWidth * dpr,
          window.innerHeight * dpr
        ),
      },
      uScreenAspect: {
        value: window.innerWidth / Math.max(1, window.innerHeight),
      },
      uBaseAspect: { value: 1.40625 },
      uHelmetAspect: { value: 1.0 },
      uMouseLerp: { value: new THREE.Vector2(0, 0) },
      uWireRevealProgress: { value: 0.0 },
      uTime: { value: 0 },
    };

    const displayMat = new THREE.ShaderMaterial({
      uniforms: displayUniforms,
      vertexShader: displayVertexShader,
      fragmentShader: displayFragmentShader,
      depthWrite: false,
      depthTest: false,
    });
    displayScene.add(new THREE.Mesh(quadGeo, displayMat));

    const loader = new THREE.TextureLoader();
    Promise.all([
      loader.loadAsync(portraitBaseUrl),
      loader.loadAsync(portraitHelmetUrl),
      depthMapUrl ? loader.loadAsync(depthMapUrl) : Promise.resolve(null),
      roughnessMapUrl
        ? loader.loadAsync(roughnessMapUrl)
        : Promise.resolve(null),
    ])
      .then(([texBase, texHelmet, texDepth, texRoughness]) => {
        texBase.colorSpace = THREE.SRGBColorSpace;
        texHelmet.colorSpace = THREE.SRGBColorSpace;
        texBase.minFilter = texBase.magFilter = THREE.LinearFilter;
        texHelmet.minFilter = texHelmet.magFilter = THREE.LinearFilter;
        texBase.wrapS = texBase.wrapT = THREE.ClampToEdgeWrapping;
        texHelmet.wrapS = texHelmet.wrapT = THREE.ClampToEdgeWrapping;

        displayUniforms.uPortraitBase.value = texBase;
        displayUniforms.uPortraitHelmet.value = texHelmet;

        const baseImg = texBase.image as HTMLImageElement | undefined;
        const helmetImg = texHelmet.image as HTMLImageElement | undefined;
        displayUniforms.uBaseAspect.value =
          (baseImg?.width || 1080) / (baseImg?.height || 768);
        displayUniforms.uHelmetAspect.value =
          (helmetImg?.width || 900) / (helmetImg?.height || 900);

        if (texDepth) {
          texDepth.minFilter = texDepth.magFilter = THREE.LinearFilter;
          texDepth.wrapS = texDepth.wrapT = THREE.ClampToEdgeWrapping;
          displayUniforms.uDepthMap.value = texDepth;
        }
        if (texRoughness) {
          texRoughness.minFilter = texRoughness.magFilter = THREE.LinearFilter;
          texRoughness.wrapS = texRoughness.wrapT = THREE.ClampToEdgeWrapping;
          displayUniforms.uRoughnessMap.value = texRoughness;
        }
      })
      .catch(console.warn);

    let rawMouseX = 0.52;
    let rawMouseY = 0.58;
    let smoothMouseX = 0.52;
    let smoothMouseY = 0.58;
    let prevMouseX = 0.52;
    let prevMouseY = 0.58;

    let smoothBX = 0.52;
    let smoothBY = 0.58;
    let prevSmoothBX = 0.52;
    let prevSmoothBY = 0.58;

    let mouseLerpX = 0.0;
    let mouseLerpY = 0.0;
    let targetNdcX = 0.0;
    let targetNdcY = 0.0;

    let auto1X = 0.28;
    let auto1Y = 0.69;
    let prevAuto1X = 0.28;
    let prevAuto1Y = 0.69;

    let auto2X = 0.72;
    let auto2Y = 0.56;
    let prevAuto2X = 0.72;
    let prevAuto2Y = 0.56;

    let auto3X = 0.48;
    let auto3Y = 0.43;
    let prevAuto3X = 0.48;
    let prevAuto3Y = 0.43;

    let auto4X = 0.64;
    let auto4Y = 0.64;
    let prevAuto4X = 0.64;
    let prevAuto4Y = 0.64;

    let lastPointerMoveTime = -10000;
    let isMovingStrength = 0.0;

    const onPointerMove = (e: PointerEvent) => {
      const nx = e.clientX / Math.max(1, window.innerWidth);
      const ny = 1.0 - e.clientY / Math.max(1, window.innerHeight);

      if (performance.now() - lastPointerMoveTime > 450) {
        smoothMouseX = prevMouseX = nx;
        smoothMouseY = prevMouseY = ny;
        smoothBX = prevSmoothBX = nx;
        smoothBY = prevSmoothBY = ny;
      }

      rawMouseX = nx;
      rawMouseY = ny;
      targetNdcX = nx * 2.0 - 1.0;
      targetNdcY = ny * 2.0 - 1.0;
      lastPointerMoveTime = performance.now();
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let frameId = 0;
    const clock = new THREE.Clock();
    const mountTime = performance.now();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const now = performance.now();
      // Slow down animation timeline by ~50% for calm, luxurious motion
      const slowTime = elapsed * 0.46;
      fluidUniforms.uTime.value = slowTime;
      displayUniforms.uTime.value = slowTime;

      // Phased 3D Wireframe Reveal (1100ms -> 2400ms) so the intricate 3D CAD
      // wireframe scans down gently from the crown, then unstructured liquid
      // ribbons sweep across background & 3D helmet smoothly!
      const sinceMount = now - mountTime;
      const wireProgress = Math.min(
        1.0,
        Math.max(0.0, (sinceMount - 1100) / 1300)
      );
      displayUniforms.uWireRevealProgress.value =
        1.0 - Math.pow(1.0 - wireProgress, 3.0);

      const sinceMove = now - lastPointerMoveTime;
      const isUserMoving = sinceMove < 240;

      // Gentle damped uMouseLerp (0.045 factor) for silky fluid reaction
      const idleBlend = Math.min(1.0, Math.max(0.0, (sinceMove - 600) / 1200));
      const idleX = Math.sin(slowTime * 0.70) * 0.18;
      const idleY = Math.cos(slowTime * 0.52) * 0.12;
      const goalX = targetNdcX * (1.0 - idleBlend) + idleX * idleBlend;
      const goalY = targetNdcY * (1.0 - idleBlend) + idleY * idleBlend;

      mouseLerpX += (goalX - mouseLerpX) * 0.045;
      mouseLerpY += (goalY - mouseLerpY) * 0.045;
      fluidUniforms.uMouseLerp.value.set(mouseLerpX, mouseLerpY);
      displayUniforms.uMouseLerp.value.set(mouseLerpX, mouseLerpY);

      // Update 4 Smooth & Calmed Autonomous Streams (Background <-> 3D Helmet)
      prevAuto1X = auto1X;
      prevAuto1Y = auto1Y;
      prevAuto2X = auto2X;
      prevAuto2Y = auto2Y;
      prevAuto3X = auto3X;
      prevAuto3Y = auto3Y;
      prevAuto4X = auto4X;
      prevAuto4Y = auto4Y;

      // Stream 1: Choreographed Lissajous Crown-to-Background S-Curve
      auto1X =
        0.52 +
        Math.sin(slowTime * 0.85) * 0.26 +
        Math.sin(slowTime * 1.65 + 0.8) * 0.09;
      auto1Y =
        0.67 +
        Math.cos(slowTime * 1.20) * 0.07 +
        Math.sin(slowTime * 0.55) * 0.04;

      // Stream 2: Figure-Eight Visor & Wide Right-Side Puddle Vortex
      auto2X =
        0.54 +
        Math.cos(slowTime * 0.75 + 1.4) * 0.30 +
        Math.sin(slowTime * 1.45) * 0.08;
      auto2Y =
        0.55 +
        Math.sin(slowTime * 1.35 + 0.6) * 0.10 +
        Math.cos(slowTime * 0.60) * 0.03;

      // Stream 3: Sweeping Diagonal Cheek-to-Left-Background Wave
      auto3X =
        0.49 +
        Math.sin(slowTime * 0.95 + 2.7) * 0.28 +
        Math.cos(slowTime * 1.60) * 0.07;
      auto3Y =
        0.46 +
        Math.cos(slowTime * 1.10 + 1.9) * 0.08 +
        Math.sin(slowTime * 0.68) * 0.04;

      // Stream 4: Wide Orbital Figure-Eight connecting Crown, Visor & Shoulders
      auto4X =
        0.52 +
        Math.cos(slowTime * 0.68 + 3.8) * 0.32 +
        Math.sin(slowTime * 1.35 + 1.1) * 0.07;
      auto4Y =
        0.58 +
        Math.sin(slowTime * 1.25 + 0.4) * 0.15 +
        Math.cos(slowTime * 0.50) * 0.04;

      fluidUniforms.uPrevAuto1.value.set(prevAuto1X, prevAuto1Y);
      fluidUniforms.uAuto1.value.set(auto1X, auto1Y);
      fluidUniforms.uPrevAuto2.value.set(prevAuto2X, prevAuto2Y);
      fluidUniforms.uAuto2.value.set(auto2X, auto2Y);
      fluidUniforms.uPrevAuto3.value.set(prevAuto3X, prevAuto3Y);
      fluidUniforms.uAuto3.value.set(auto3X, auto3Y);
      fluidUniforms.uPrevAuto4.value.set(prevAuto4X, prevAuto4Y);
      fluidUniforms.uAuto4.value.set(auto4X, auto4Y);

      let autoPhaseWeight = 0.0;
      if (sinceMount > 2000) {
        const postWireSec = (sinceMount - 2000) * 0.001;
        const rampIn = Math.min(1.0, postWireSec / 0.95);
        const pulse = 0.88 + 0.12 * Math.sin(postWireSec * 0.75);
        autoPhaseWeight = rampIn * pulse;
      }
      fluidUniforms.uHelmetPhaseWeight.value = autoPhaseWeight;

      // Update cursor positions uPrevMouse -> uMouse
      prevMouseX = smoothMouseX;
      prevMouseY = smoothMouseY;
      prevSmoothBX = smoothBX;
      prevSmoothBY = smoothBY;

      smoothMouseX += (rawMouseX - smoothMouseX) * 0.36;
      smoothMouseY += (rawMouseY - smoothMouseY) * 0.36;
      smoothBX += (smoothMouseX - smoothBX) * 0.18;
      smoothBY += (smoothMouseY - smoothBY) * 0.18;

      const speed = Math.hypot(
        smoothMouseX - prevMouseX,
        smoothMouseY - prevMouseY
      );
      const isCursorActive = isUserMoving || speed > 0.001;
      const targetMoving = isCursorActive ? 1.0 : 0.0;
      isMovingStrength +=
        (targetMoving - isMovingStrength) * (isCursorActive ? 0.38 : 0.16);

      fluidUniforms.uPrevMouse.value.set(prevMouseX, prevMouseY);
      fluidUniforms.uMouse.value.set(smoothMouseX, smoothMouseY);
      fluidUniforms.uPrevMouseB.value.set(prevSmoothBX, prevSmoothBY);
      fluidUniforms.uMouseB.value.set(smoothBX, smoothBY);
      fluidUniforms.uIsMoving.value = isMovingStrength;

      // Pass 1: Ping-Pong Fluid Trail RenderTarget A -> B
      fluidUniforms.uPrevTrail.value = rtA.texture;
      renderer.setRenderTarget(rtB);
      renderer.render(fluidScene, orthoCamera);

      // Pass 2: Main Display Render
      displayUniforms.uTrailMap.value = rtB.texture;
      renderer.setRenderTarget(null);
      renderer.render(displayScene, orthoCamera);

      const temp = rtA;
      rtA = rtB;
      rtB = temp;

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = Math.max(1, window.innerHeight);
      const curDpr = Math.min(window.devicePixelRatio || 1, 1.35);
      renderer.setSize(w, h);
      renderer.setPixelRatio(curDpr);
      fluidUniforms.uAspect.value = w / h;
      displayUniforms.uScreenAspect.value = w / h;
      displayUniforms.uResolution.value.set(w * curDpr, h * curDpr);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", handleResize);
      rtA.dispose();
      rtB.dispose();
      generatedDepthMap.dispose();
      generatedRoughnessMap.dispose();
      quadGeo.dispose();
      fluidMat.dispose();
      displayMat.dispose();
      renderer.dispose();
    };
  }, [portraitBaseUrl, portraitHelmetUrl, depthMapUrl, roughnessMapUrl]);

  return <canvas ref={canvasRef} className={className} />;
}
