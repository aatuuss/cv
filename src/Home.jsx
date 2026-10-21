import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Lenis from "lenis";
import CommentsSection from "./CommentsSection";
import RunningText from "./components/RunningText";
import About from "./About";

const IMG_BEFORE = "/atusbefore.png";
const IMG_AFTER = "/atusafter.png";

export default function Home() {
  const [veilProgress, setVeilProgress] = useState(0);
  const [veilVisible, setVeilVisible] = useState(true);
  const [heroReady, setHeroReady] = useState(false);

  const heroCanvasRef = useRef(null);
  const lenisRef = useRef(null);

  // 1. Veil Progress Loader (Halus + memicu animasi masuk Hero saat selesai)
  useEffect(() => {
    const interval = setInterval(() => {
      setVeilProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          setTimeout(() => {
            setVeilVisible(false);
            setHeroReady(true);
          }, 400);
          return 1;
        }
        return Math.min(1, +(prev + 0.04).toFixed(2));
      });
    }, 32);
    return () => clearInterval(interval);
  }, []);

  // 2. Lenis Smooth Scroll Setup
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const scrollToComments = (e) => {
    if (e) e.preventDefault();
    const target = document.getElementById("comments");
    if (target && lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: 0, duration: 1.5 });
    } else if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 3. Hero Three.js Shader Reveal (Liquid FBM + Vertex Wave + Rose-Champagne Edge Glow)
  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      50
    );
    camera.position.z = 7.5;

    const trailCanvas = document.createElement("canvas");
    trailCanvas.width = trailCanvas.height = 512;
    const trailCtx = trailCanvas.getContext("2d");
    trailCtx.fillStyle = "black";
    trailCtx.fillRect(0, 0, 512, 512);

    const maskTexture = new THREE.CanvasTexture(trailCanvas);
    maskTexture.minFilter = maskTexture.magFilter = THREE.LinearFilter;

    const uniforms = {
      uTexBefore: { value: null },
      uTexAfter: { value: null },
      uMask: { value: maskTexture },
      uTime: { value: 0 },
    };

    const meshGroup = new THREE.Group();
    scene.add(meshGroup);

    const loader = new THREE.TextureLoader();
    Promise.all([loader.loadAsync(IMG_BEFORE), loader.loadAsync(IMG_AFTER)])
      .then(([texBefore, texAfter]) => {
        texBefore.colorSpace = texAfter.colorSpace = THREE.SRGBColorSpace;
        const height = 4.7;
        const width =
          height *
          ((texBefore.image.width || 1) / (texBefore.image.height || 1));

        uniforms.uTexBefore.value = texBefore;
        uniforms.uTexAfter.value = texAfter;

        const mat = new THREE.ShaderMaterial({
          vertexShader: `
            uniform float uTime;
            uniform sampler2D uMask;
            varying vec2 vUv;

            void main() {
              vUv = uv;
              vec3 pos = position;

              // Efek alunan gelombang 3D lembut saat kursor menyentuh area foto
              float maskVal = texture2D(uMask, uv).r;
              pos.z += sin(pos.x * 2.5 + uTime * 2.2) * 0.035;
              pos.z += maskVal * 0.14;

              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D uTexBefore, uTexAfter, uMask;
            uniform float uTime;
            varying vec2 vUv;

            vec2 hash2(vec2 p) {
              p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
              return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
            }

            float gnoise(vec2 p) {
              vec2 i = floor(p);
              vec2 f = fract(p);
              vec2 u = f * f * (3.0 - 2.0 * f);
              return mix(
                mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                    dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
                mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                    dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
                u.y
              );
            }

            float fbm(vec2 p) {
              float v = 0.0;
              float a = 0.55;
              vec2 shift = vec2(100.0);
              mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
              for (int i = 0; i < 4; ++i) {
                v += a * gnoise(p);
                p = rot * p * 2.1 + shift;
                a *= 0.5;
              }
              return v;
            }

            void main() {
              vec2 flow = vec2(
                fbm(vUv * 5.0 + vec2(uTime * 0.38, -uTime * 0.28)),
                fbm(vUv * 5.0 + vec2(-uTime * 0.28, uTime * 0.22))
              );

              vec2 maskUv = vUv + flow * 0.11;
              float maskVal = texture2D(uMask, maskUv).r;

              float ripple = sin(maskVal * 24.0 - uTime * 4.0) * 0.022 * maskVal;
              float dynamicMask = clamp(maskVal + ripple, 0.0, 1.0);

              float reveal = smoothstep(0.14, 0.72, dynamicMask);
              float borderZone = smoothstep(0.16, 0.34, dynamicMask) * (1.0 - smoothstep(0.34, 0.52, dynamicMask));

              vec2 distortion = flow * (0.038 * (1.0 - reveal) * dynamicMask);

              vec4 beforeR = texture2D(uTexBefore, vUv + distortion * 1.4);
              vec4 beforeG = texture2D(uTexBefore, vUv);
              vec4 beforeB = texture2D(uTexBefore, vUv - distortion * 1.4);
              vec4 colBefore = vec4(beforeR.r, beforeG.g, beforeB.b, beforeG.a);

              vec4 afterR = texture2D(uTexAfter, vUv - distortion);
              vec4 afterG = texture2D(uTexAfter, vUv);
              vec4 afterB = texture2D(uTexAfter, vUv + distortion);
              vec4 colAfter = vec4(afterR.r, afterG.g, afterB.b, afterG.a);

              vec4 finalColor = mix(colBefore, colAfter, reveal);

              // Warna tepi liquid selaras dengan konsep Rose-Gold & Electric Coral
              vec3 champagneGold = vec3(1.0, 0.88, 0.75);
              vec3 electricRose = vec3(1.0, 0.28, 0.52);
              vec3 edgeColor = mix(champagneGold, electricRose, sin(uTime * 2.8 + vUv.x * 5.0) * 0.5 + 0.5);

              finalColor.rgb += edgeColor * borderZone * 0.72;

              gl_FragColor = finalColor;
            }
          `,
          uniforms,
          transparent: true,
        });

        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(width, height, 48, 48),
          mat
        );
        mesh.position.set(0.0, -0.08, 1);
        meshGroup.add(mesh);
      })
      .catch(console.warn);

    let targetX = 0;
    let targetY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let mouseHistory = [];

    const onPointerMove = (e) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = -(e.clientY / window.innerHeight) * 2 + 1;

      const normX = (e.clientX / window.innerWidth) * 512;
      const normY = (e.clientY / window.innerHeight) * 512;
      const speed = Math.hypot(normX - prevMouseX, normY - prevMouseY);
      prevMouseX = normX;
      prevMouseY = normY;

      mouseHistory.push({
        x: normX,
        y: normY,
        radius: Math.min(68, 42 + speed * 0.45),
      });
    };
    window.addEventListener("pointermove", onPointerMove);

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime();

      // Fade jejak kursor secara perlahan
      trailCtx.fillStyle = "rgba(0, 0, 0, 0.026)";
      trailCtx.fillRect(0, 0, 512, 512);

      for (const pt of mouseHistory) {
        const radGrad = trailCtx.createRadialGradient(
          pt.x,
          pt.y,
          0,
          pt.x,
          pt.y,
          pt.radius
        );
        radGrad.addColorStop(0, "rgba(255, 255, 255, 0.55)");
        radGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.22)");
        radGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        trailCtx.fillStyle = radGrad;
        trailCtx.beginPath();
        trailCtx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        trailCtx.fill();
      }
      mouseHistory = [];
      maskTexture.needsUpdate = true;

      // Paralaks kamera & rotasi 3D halus
      camera.position.x += (targetX * 0.32 - camera.position.x) * 0.05;
      camera.position.y += (targetY * 0.28 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      meshGroup.rotation.y += (targetX * 0.07 - meshGroup.rotation.y) * 0.08;
      meshGroup.rotation.x += (-targetY * 0.05 - meshGroup.rotation.x) * 0.08;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`grido-wrapper ${heroReady ? "is-ready" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .grido-wrapper {
          /* Palet Konsep: Velvet Rose & Warm Champagne (Kontras Tinggi & Elegan) */
          --bg-gradient: radial-gradient(
            circle at 55% 36%,
            #f7a8b8 0%,
            #d96b7e 42%,
            #7c283a 82%,
            #3d101c 100%
          );
          --surface-card: rgba(42, 11, 21, 0.42);
          --surface-card-hover: rgba(58, 15, 29, 0.58);
          --border-glass: rgba(255, 232, 236, 0.28);
          --border-accent: #ffe3e8;
          --foreground: #fff9fa;
          --foreground-muted: rgba(255, 238, 242, 0.78);
          --accent-gold: #ffe0b5;
          --accent-rose: #ff4778;
          --font-sans: "Space Grotesk", system-ui, sans-serif;
          --font-display: "Oswald", Impact, sans-serif;

          background: var(--bg-gradient);
          color: var(--foreground);
          font-family: var(--font-sans);
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* 1. Loader Veil */
        .loader-veil {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, #8f2d42 0%, #380d18 100%);
          transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .veil-helmet {
          width: 5.25rem;
          height: 6.25rem;
          position: relative;
          border: 2px solid rgba(255, 255, 255, 0.85);
          border-radius: 42% 42% 50% 50%;
          overflow: hidden;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.28);
        }

        .veil-helmet-fill {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, #ffe0b5 0%, #ff7597 100%);
          transform-origin: bottom;
          transition: transform 0.08s linear;
        }

        .veil-name {
          margin-top: 1.35rem;
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.24em;
          font-weight: 600;
        }

        .veil-counter {
          margin-top: 0.35rem;
          font-family: var(--font-display);
          font-size: 0.85rem;
          letter-spacing: 0.18em;
          color: var(--accent-gold);
        }

        .veil-meter {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
        }

        .veil-meter-fill {
          height: 100%;
          width: 100%;
          background: linear-gradient(90deg, var(--accent-gold), #ffffff);
          transform-origin: left;
        }

        /* 2. Sticky Hero Section */
        .hero-section {
          position: sticky;
          top: 0;
          z-index: 1;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
          box-sizing: border-box;
        }

        /* Ambient Grid Halus di Latar Belakang */
        .hero-ambient-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 5rem 5rem;
          mask-image: radial-gradient(circle at 50% 45%, rgba(0, 0, 0, 0.75) 10%, transparent 85%);
          pointer-events: none;
          z-index: 1;
        }

        /* Watermark DEV Raksasa di Belakang Canvas */
        .hero-bg-watermark {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 85vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          font-family: var(--font-display);
          font-size: clamp(16rem, 48vw, 44rem);
          font-weight: 800;
          line-height: 0.78;
          letter-spacing: -0.04em;
          color: rgba(255, 245, 247, 0.22);
          user-select: none;
          pointer-events: none;
          z-index: 1;
          -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 0) 88%);
          mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 0) 88%);
          transform: translateY(24px) scale(0.97);
          opacity: 0;
          transition: transform 1.1s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 1.1s ease;
        }

        .is-ready .hero-bg-watermark {
          transform: translateY(0) scale(1);
          opacity: 1;
        }

        /* Canvas Three.js */
        .hero-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        /* Konten UI Foreground */
        .hero-content {
          position: relative;
          z-index: 10;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.75rem 2.25rem;
          box-sizing: border-box;
        }

        /* Top Bar Minimalis supaya flexbox space-between seimbang */
        .hero-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          opacity: 0;
          transform: translateY(-14px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
        }

        .is-ready .hero-top-bar {
          opacity: 1;
          transform: translateY(0);
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.45rem 0.9rem;
          background: var(--surface-card);
          border: 1px solid var(--border-glass);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 10px #4ade80;
          animation: pulseGlow 2s infinite ease-in-out;
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.85); }
        }

        .season-badge {
          font-family: var(--font-display);
          font-size: 0.85rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--foreground-muted);
        }

        /* Area Tengah: Panel Telemetri di Kanan */
        .hero-middle {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
        }

        .hero-panels-col {
          width: 16.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          opacity: 0;
          transform: translateX(24px);
          transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.22s;
        }

        .is-ready .hero-panels-col {
          opacity: 1;
          transform: translateX(0);
        }

        .bracket-panel {
          position: relative;
          padding: 1.15rem 1.35rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          background: var(--surface-card);
          border: 1px solid var(--border-glass);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-radius: 6px;
          box-shadow: 0 14px 34px rgba(28, 5, 12, 0.22);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      background 0.3s ease,
                      border-color 0.3s ease;
        }

        .bracket-panel:hover {
          transform: translateY(-4px);
          background: var(--surface-card-hover);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .b-corner {
          position: absolute;
          width: 8px;
          height: 8px;
          border: 1.5px solid var(--accent-gold);
          pointer-events: none;
          transition: width 0.25s ease, height 0.25s ease;
        }

        .bracket-panel:hover .b-corner {
          width: 12px;
          height: 12px;
        }

        .tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
        .tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
        .bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
        .br { bottom: -1px; right: -1px; border-left: none; border-top: none; }

        .panel-eyebrow {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--accent-gold);
          letter-spacing: 0.12em;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin: 0.25rem 0 0;
        }

        .stats-grid dt {
          font-size: 0.68rem;
          text-transform: uppercase;
          color: var(--foreground-muted);
          letter-spacing: 0.06em;
        }

        .stats-grid dd {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.85rem;
          line-height: 0.85;
          margin: 0.35rem 0 0;
          color: var(--foreground);
        }

        /* Area Bawah: Identitas & Navigasi Sosial */
        .hero-foot {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          width: 100%;
          box-sizing: border-box;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.32s;
        }

        .is-ready .hero-foot {
          opacity: 1;
          transform: translateY(0);
        }

        .driver-bottom-left {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          flex-shrink: 0;
        }

        .driver-meta-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.88rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--accent-gold);
        }

        .driver-name {
          margin: 0;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(2.75rem, 4.8vw, 5rem);
          line-height: 0.92;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          text-shadow: 0 10px 30px rgba(38, 6, 15, 0.35);
        }

        .hero-foot-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .social-group {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .social-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.55rem 0.95rem;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--foreground);
          background: var(--surface-card);
          border: 1px solid var(--border-glass);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 4px;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .social-pill:hover {
          background: var(--foreground);
          color: #591827;
          border-color: var(--foreground);
          transform: translateY(-3px);
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          height: 2.85rem;
          padding: 0 1.35rem;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-decoration: none;
          color: #3d101c;
          background: linear-gradient(135deg, #fff9fa 0%, #ffe0b5 100%);
          border: none;
          font-weight: 700;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
          box-shadow: 0 10px 24px rgba(28, 5, 12, 0.25);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.25s ease;
          cursor: pointer;
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 28px rgba(28, 5, 12, 0.38);
        }

        /* Wrapper Konten Bawah agar menutup Sticky Hero dengan mulus */
        .below-fold-content {
          position: relative;
          z-index: 20;
        }

        @media (max-width: 1024px) {
          .hero-middle {
            justify-content: flex-start;
            align-items: flex-end;
            padding-bottom: 1.25rem;
          }
          .hero-panels-col {
            width: 100%;
            flex-direction: row;
          }
          .bracket-panel {
            flex: 1;
          }
        }

        @media (max-width: 640px) {
          .hero-content {
            padding: 1.25rem;
          }
          .hero-panels-col {
            flex-direction: column;
            gap: 0.75rem;
          }
          .hero-foot {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>

      {/* Loader Veil */}
      {veilVisible && (
        <div
          className="loader-veil"
          style={{
            opacity: veilProgress === 1 ? 0 : 1,
            transform: veilProgress === 1 ? "scale(1.03)" : "scale(1)",
          }}
        >
          <div className="veil-helmet">
            <div
              className="veil-helmet-fill"
              style={{ transform: `scaleY(${veilProgress})` }}
            />
          </div>
          <div className="veil-name">Nikmatus Solihah</div>
          <div className="veil-counter">{Math.round(veilProgress * 100)}%</div>
          <div className="veil-meter">
            <div
              className="veil-meter-fill"
              style={{ transform: `scaleX(${veilProgress})` }}
            />
          </div>
        </div>
      )}

      {/* Hero Section (Sticky) */}
      <section data-hero id="home" className="hero-section">
        <div className="hero-ambient-grid" aria-hidden="true" />

        {/* 1. Teks Watermark Raksasa di Latar Belakang */}
        <div className="hero-bg-watermark" aria-hidden="true">
          DEV
        </div>

        {/* 2. Interactive Three.js Shader Canvas */}
        <canvas ref={heroCanvasRef} className="hero-canvas" />

        {/* 3. Foreground UI & Content */}
        <div className="hero-content">

          {/* Middle: Panel Telemetri di Kanan */}
          <div className="hero-middle">
            <div className="hero-panels-col">
              <div className="bracket-panel">
                <span className="b-corner tl" />
                <span className="b-corner tr" />
                <span className="b-corner bl" />
                <span className="b-corner br" />
                <span className="panel-eyebrow">Current Focus</span>
                <p
                  style={{
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    lineHeight: "1.35",
                    margin: 0,
                  }}
                >
                  <strong>Creative Frontend</strong>
                  <br />
                  React · Three.js · UI/UX
                  <br />
                  <span style={{ color: "var(--foreground-muted)" }}>
                    Season 2026
                  </span>
                </p>
              </div>

              <div className="bracket-panel">
                <span className="b-corner tl" />
                <span className="b-corner tr" />
                <span className="b-corner bl" />
                <span className="b-corner br" />
                <span className="panel-eyebrow">Highlights</span>
                <dl className="stats-grid">
                  <div>
                    <dt>Projects</dt>
                    <dd>14</dd>
                  </div>
                  <div>
                    <dt>Clients</dt>
                    <dd>08</dd>
                  </div>
                  <div>
                    <dt>Years</dt>
                    <dd>03</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Bottom: Nama & Navigasi Sosial */}
          <div className="hero-foot">
            <div className="driver-bottom-left">
              <ul className="driver-meta-list">
                <li>🇮🇩 Indonesia</li>
                <li>·</li>
                <li>Creative Developer</li>
              </ul>
              <h1 className="driver-name">
                Nikmatus
                <br />
                Solihah
              </h1>
            </div>

            <div className="hero-foot-actions">
              <div className="social-group">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-pill"
                >
                  Inst
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-pill"
                >
                  In
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-pill"
                >
                  Git
                </a>
              </div>

              <button
                type="button"
                onClick={scrollToComments}
                className="cta-button"
              >
                Comments
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Komponen Eksternal (Muncul di atas sticky Hero saat di-scroll) */}
      <div className="below-fold-content">
        {/* <RunningText /> */}
        <About />
        {/* <CommentsSection /> */}
      </div>
    </div>
  );
}