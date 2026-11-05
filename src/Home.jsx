import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import HeroFluidScene from "./HeroFluidScene";

const IMG_BEFORE = "/atusbefore.png";
const IMG_AFTER = "/atus.png";

/**
 * Per-Character Hover Roll Component (0.45s cubic-bezier(0.22, 1, 0.36, 1))
 */
function RollText({ text }) {
  const chars = Array.from(text);
  return (
    <span className="roll-text-wrap" aria-label={text}>
      <span className="roll-text-row" aria-hidden="true">
        {chars.map((ch, idx) => (
          <span
            key={`top-${idx}`}
            className="char"
            style={{ "--char-index": idx }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </span>
      <span className="roll-text-row roll-text-clone" aria-hidden="true">
        {chars.map((ch, idx) => (
          <span
            key={`bot-${idx}`}
            className="char"
            style={{ "--char-index": idx }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * Masked Vertical Slot Digit for Live Telemetry Counter
 */
function SlotDigit({ value }) {
  const parsed = parseInt(value, 10);
  const num = Number.isNaN(parsed) ? 0 : parsed;
  return (
    <span className="slot-digit-mask">
      <span
        className="slot-digit-strip"
        style={{
          transform: `translate3d(0, -${num * 10}%, 0)`,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <span key={d} className="slot-digit-cell">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function Home({ onLoadComplete }) {
  const [veilProgress, setVeilProgress] = useState(0);
  const [apertureOpen, setApertureOpen] = useState(false);
  const [veilVisible, setVeilVisible] = useState(true);
  const [heroReady, setHeroReady] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [telemetryDigits, setTelemetryDigits] = useState([
    "0",
    "4",
    "2",
    "8",
    "5",
    "0",
  ]);

  const wrapperRef = useRef(null);
  const lenisRef = useRef(null);

  // 1. Fluid Preloader Progress & Liquid Dynamics -> Logo Aperture Reveal
  useEffect(() => {
    let startTimestamp = null;
    let rafId = null;
    const duration = 2400; // 2.4s smooth cinematic load

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const t = Math.min(1, elapsed / duration);
      // Fluid ease-out curve: lively beginning, gentle settling
      const ease = 1 - Math.pow(1 - t, 2.8);
      setVeilProgress(ease);

      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setVeilProgress(1);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (veilProgress < 1) return;

    const openTimer = setTimeout(() => {
      setApertureOpen(true);
      setHeroReady(true);
      if (onLoadComplete) onLoadComplete();
    }, 160);

    const hideTimer = setTimeout(() => {
      setVeilVisible(false);
    }, 1320);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(hideTimer);
    };
  }, [veilProgress, onLoadComplete]);

  // Live Telemetry Clock Slot Ticker
  useEffect(() => {
    const updateTicker = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setTelemetryDigits([hh[0], hh[1], mm[0], mm[1], ss[0], ss[1]]);
    };
    updateTicker();
    const timer = setInterval(updateTicker, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Lenis Smooth Scroll (lerp: 0.09) + 60fps Interactive Mouse & Autonomous Figure-8 Parallax
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    window.lenis = lenis;

    let targetMx = 0;
    let targetMy = 0;
    let curMx = 0;
    let curMy = 0;
    let targetCx = window.innerWidth * 0.5;
    let targetCy = window.innerHeight * 0.5;
    let curCx = targetCx;
    let curCy = targetCy;
    let lastMoveTime = 0;

    const onPointerMove = (e) => {
      targetMx = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      targetMy = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
      targetCx = e.clientX;
      targetCy = e.clientY;
      lastMoveTime = performance.now();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);

      const t = time * 0.001;
      const idleSec = (time - lastMoveTime) * 0.001;
      // Autonomous harmonic drift when cursor is idle (gentle & slow)
      const idleBlend = Math.min(1, Math.max(0, (idleSec - 1.2) * 0.5));
      const autoMx = Math.sin(t * 0.40) * 0.24 + Math.cos(t * 0.8) * 0.08;
      const autoMy = Math.sin(t * 0.85) * 0.18;

      const goalMx = targetMx * (1 - idleBlend) + autoMx * idleBlend;
      const goalMy = targetMy * (1 - idleBlend) + autoMy * idleBlend;

      curMx += (goalMx - curMx) * 0.075;
      curMy += (goalMy - curMy) * 0.065;
      curCx += (targetCx - curCx) * 0.10;
      curCy += (targetCy - curCy) * 0.10;

      if (wrapperRef.current) {
        wrapperRef.current.style.setProperty("--mx", curMx.toFixed(4));
        wrapperRef.current.style.setProperty("--my", curMy.toFixed(4));
        wrapperRef.current.style.setProperty("--cursor-x", `${curCx.toFixed(1)}px`);
        wrapperRef.current.style.setProperty("--cursor-y", `${curCy.toFixed(1)}px`);
      }

      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      window.lenis = null;
    };
  }, []);

  // Lock / Unlock scroll
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (isLocked) {
      document.body.style.overflow = "hidden";
      lenisRef.current?.stop();
    } else {
      document.body.style.overflow = previousOverflow;
      lenisRef.current?.start();
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLocked]);

  const scrollToNextSection = (e) => {
    if (e) e.preventDefault();
    const target =
      document.getElementById("about") ||
      document.querySelector(".about-stack-wrapper");
    if (target && lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: 0, duration: 1.4 });
    } else if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // WebGL Fluid Trail + 2.5D Depth Map + Roughness Specular Engine is modularized in HeroFluidScene.tsx

  // Console Easter Egg (Soft Rose Pink & Deep Burgundy — NO yellow!)
  useEffect(() => {
    console.log(
      "%c NIKMATUS SOLIHAH // CREATIVE FRONTEND & WEBGL ",
      "background:#f7a8b8;color:#1c050c;font-weight:900;font-size:16px;padding:6px 12px;"
    );
  }, []);

  const progressPercent = Math.round(veilProgress * 100);
  const progressFormatted = String(progressPercent).padStart(2, "0");

  const loaderStatus =
    veilProgress < 0.28
      ? "CALIBRATING SHADERS"
      : veilProgress < 0.60
      ? "INITIALIZING TELEMETRY"
      : veilProgress < 0.88
      ? "PREPARING 3D ASSETS"
      : "SYSTEM READY // NIKMATUS";

  return (
    <div
      ref={wrapperRef}
      className={`grido-wrapper ${heroReady ? "is-ready" : ""}`}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,700;0,6..96,800;0,6..96,900;1,6..96,700;1,6..96,800&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,600;1,600&family=JetBrains+Mono:wght@400;500;600;700&family=Oswald:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Montserrat:wght@700;800;900&display=swap');

        .grido-wrapper {
          --editorial-light: #F5F5F0;
          --carbon-dark: #0D0E0E;
          --surface-card: rgba(245, 245, 240, 0.84);
          --surface-card-hover: #FFFFFF;
          --border-hairline: rgba(28, 5, 12, 0.20);
          --border-strong: rgba(124, 40, 58, 0.55);
          --foreground: #1c050c;
          --foreground-muted: #5A484E;
          --accent-pink: #f7a8b8;
          --accent-rose-deep: #7c283a;
          --font-sans: "Plus Jakarta Sans", system-ui, sans-serif;
          --font-display: "Oswald", "Bebas Neue", Impact, sans-serif;
          --font-serif: "Cormorant Garamond", Georgia, serif;
          --font-mono: "JetBrains Mono", monospace;

          background: var(--editorial-light);
          color: var(--foreground);
          font-family: var(--font-sans);
          width: 100%;
          min-height: 100vh;
          overflow-x: clip;
          position: relative;
        }

        /* =====================================================================
           A. PRELOADER ("LEBIH HIDUP") & APERTURE REVEAL WITH LUXURY NS LOGO
           ===================================================================== */
        .aperture-preloader {
          position: fixed;
          inset: 0;
          z-index: 120;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          overflow: hidden;
          background: #14040a;
        }

        /* Luminous Ambient Living Aura Breathing in Background */
        .preloader-ambient-aura {
          position: absolute;
          width: 32vmax;
          height: 32vmax;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            rgba(247, 168, 184, 0.24) 0%,
            rgba(217, 107, 126, 0.16) 40%,
            rgba(124, 40, 58, 0.08) 65%,
            transparent 75%
          );
          filter: blur(48px);
          animation: preloaderAuraPulse 3.6s ease-in-out infinite alternate;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes preloaderAuraPulse {
          0% {
            transform: scale(0.92);
            opacity: 0.65;
          }
          100% {
            transform: scale(1.15);
            opacity: 1;
          }
        }

        /* Floating Atmospheric Micro-Embers */
        .preloader-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 1;
        }

        .preloader-dust-dot {
          position: absolute;
          border-radius: 50%;
          background: #f7a8b8;
          box-shadow: 0 0 8px rgba(247, 168, 184, 0.6);
          animation: floatDustUp linear infinite;
        }

        @keyframes floatDustUp {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0;
          }
          15% {
            opacity: 0.6;
          }
          85% {
            opacity: 0.4;
          }
          100% {
            transform: translate3d(0, -100vh, 0);
            opacity: 0;
          }
        }

        .aperture-svg-mask {
          position: absolute;
          width: 240vmax;
          height: 240vmax;
          will-change: transform;
          transform: translate3d(0, 0, 0) scale(1);
          transition: transform 1.15s cubic-bezier(0.76, 0, 0.24, 1);
          z-index: 2;
        }

        .aperture-preloader.is-opening .aperture-svg-mask {
          transform: translate3d(0, 0, 0) scale(85);
        }

        .aperture-core-shutter {
          position: absolute;
          width: 14.4vmax;
          height: 14.4vmax;
          border-radius: 50%;
          background: #140308;
          box-shadow: 0 0 60px rgba(247, 168, 184, 0.22);
          border: none;
          outline: none;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          transition: opacity 0.24s ease;
          z-index: 1;
        }

        .aperture-preloader.is-opening .aperture-core-shutter {
          opacity: 0;
        }

        .shutter-inner-ambient {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(247, 168, 184, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .shutter-wave-container {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          will-change: transform;
          transition: transform 0.08s linear;
        }

        .liquid-wave {
          position: absolute;
          top: -24px;
          left: 0;
          width: 200%;
          height: 36px;
        }

        .liquid-wave.wave-back {
          animation: waveBackSlide 3.4s linear infinite;
        }

        .liquid-wave.wave-front {
          animation: waveFrontSlide 2.4s linear infinite;
        }

        @keyframes waveBackSlide {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }

        @keyframes waveFrontSlide {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }

        .liquid-wave-body {
          position: absolute;
          top: 10px;
          left: 0;
          width: 100%;
          height: 110%;
          background: linear-gradient(180deg, #f7a8b8 0%, #c44768 55%, #7c283a 100%);
        }

        .preloader-hud {
          position: relative;
          z-index: 4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          padding: 2.25rem 2.75rem;
          box-sizing: border-box;
          color: #fff9fa;
          transition: opacity 0.35s ease, transform 0.4s cubic-bezier(0.76, 0, 0.24, 1);
        }

        .aperture-preloader.is-opening .preloader-hud {
          opacity: 0;
          transform: translate3d(0, -14px, 0) scale(1.03);
        }

        .preloader-top-row {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #e6c6ce;
        }

        .preloader-live-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          background: rgba(28, 5, 12, 0.45);
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          border: 1px solid rgba(247, 168, 184, 0.16);
          backdrop-filter: blur(6px);
        }

        .live-pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px #4ade80;
          animation: liveDotPulse 1.8s ease-in-out infinite;
        }

        @keyframes liveDotPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(0.75);
          }
        }

        .preloader-season {
          letter-spacing: 0.16em;
          color: rgba(255, 224, 181, 0.85);
          font-weight: 600;
        }

        .preloader-bottom-row {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.55rem;
        }

        .preloader-phase-tag {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--accent-pink);
          transition: color 0.3s ease;
        }

        .preloader-counter-box {
          display: inline-flex;
          align-items: baseline;
          gap: 0.2rem;
        }

        .preloader-counter {
          font-family: 'Oswald', Impact, sans-serif;
          font-size: clamp(3rem, 6vw, 4.5rem);
          font-weight: 800;
          line-height: 0.88;
          letter-spacing: -0.02em;
          color: #fff9fa;
          text-shadow: 0 0 30px rgba(247, 168, 184, 0.35);
        }

        .preloader-counter-pct {
          font-family: var(--font-mono);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--accent-pink);
        }

        .preloader-bar-track {
          position: relative;
          width: min(300px, 70vw);
          height: 3px;
          background: rgba(247, 168, 184, 0.16);
          border-radius: 999px;
          overflow: visible;
        }

        .preloader-bar-fill {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #c44768 0%, var(--accent-pink) 100%);
          border-radius: 999px;
          transform-origin: left;
          will-change: transform;
        }

        .bar-glow-spark {
          position: absolute;
          top: 50%;
          right: 0;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 10px #ffffff, 0 0 20px #f7a8b8, 0 0 30px #d96b7e;
          transform: translate(50%, -50%);
        }

        .preloader-brand-signature {
          margin-top: 0.25rem;
          font-family: 'Oswald', Impact, sans-serif;
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255, 249, 250, 0.65);
        }

        /* =====================================================================
           B. PER-CHARACTER HOVER ROLL & VERTICAL SLOT DIGITS
           ===================================================================== */
        .roll-text-wrap {
          position: relative;
          display: inline-flex;
          overflow: hidden;
          line-height: 1.15;
          vertical-align: middle;
        }

        .roll-text-row {
          display: inline-flex;
          white-space: pre;
        }

        .roll-text-clone {
          position: absolute;
          top: 0;
          left: 0;
          transform: translate3d(0, 100%, 0);
        }

        .roll-text-wrap .char {
          display: inline-block;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
          transition-delay: calc(var(--char-index) * 14ms);
        }

        a:hover .roll-text-row:not(.roll-text-clone) .char,
        button:hover .roll-text-row:not(.roll-text-clone) .char {
          transform: translate3d(0, -100%, 0);
        }

        a:hover .roll-text-clone .char,
        button:hover .roll-text-clone .char {
          transform: translate3d(0, -100%, 0);
        }

        .slot-digit-mask {
          display: inline-block;
          height: 1.05em;
          line-height: 1.05em;
          overflow: hidden;
          vertical-align: bottom;
        }

        .slot-digit-strip {
          display: flex;
          flex-direction: column;
          will-change: transform;
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .slot-digit-cell {
          height: 1.05em;
          line-height: 1.05em;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* =====================================================================
           C. HERO STAGE (100vh)
           ===================================================================== */
        .hero-runway-container {
          position: relative;
          width: 100%;
          height: 100dvh;
        }

        .hero-section {
          position: relative;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
          box-sizing: border-box;
          z-index: 4;
        }

        .hero-focal-stage {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .hero-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        /* =====================================================================
           C1. 3D ORBITAL TELEMETRY RINGS & COUNTER-SCROLLING KINETIC MARQUEES
           ===================================================================== */
        .hero-orbital-hud {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transform: translate3d(
            calc(var(--mx, 0) * -18px),
            calc(var(--my, 0) * -14px),
            0
          );
          will-change: transform;
        }

        .hero-orbital-svg {
          width: min(88vw, 88vh);
          height: min(88vw, 88vh);
          opacity: 0.42;
          overflow: visible;
        }

        .orbit-ring-cw {
          transform-origin: 500px 500px;
          animation: orbitSpinCW 64s linear infinite;
        }

        .orbit-ring-ccw {
          transform-origin: 500px 500px;
          animation: orbitSpinCCW 50s linear infinite;
        }

        .orbit-ring-pulse {
          transform-origin: 500px 500px;
          animation: orbitPulseBreath 9.5s ease-in-out infinite alternate;
        }

        @keyframes orbitSpinCW {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes orbitSpinCCW {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes orbitPulseBreath {
          0% { transform: scale(0.96) rotate(-4deg); opacity: 0.35; }
          100% { transform: scale(1.04) rotate(4deg); opacity: 0.85; }
        }

        /* Live Telemetry Equalizer Bars */
        .telemetry-eq-bars {
          display: inline-flex;
          align-items: flex-end;
          gap: 2.5px;
          height: 13px;
          margin-left: 0.25rem;
        }

        .telemetry-eq-bar {
          width: 2.5px;
          height: 100%;
          background: linear-gradient(180deg, #f7a8b8 0%, #7c283a 100%);
          transform-origin: bottom;
          will-change: transform;
          animation: eqBounce 1.8s ease-in-out infinite alternate;
        }

        .telemetry-eq-bar:nth-child(2) { animation-delay: 0.32s; animation-duration: 1.45s; }
        .telemetry-eq-bar:nth-child(3) { animation-delay: 0.65s; animation-duration: 2.10s; }
        .telemetry-eq-bar:nth-child(4) { animation-delay: 0.16s; animation-duration: 1.70s; }
        .telemetry-eq-bar:nth-child(5) { animation-delay: 0.50s; animation-duration: 1.90s; }

        @keyframes eqBounce {
          0% { transform: scaleY(0.22); }
          100% { transform: scaleY(1); }
        }

        /* Interactive Rose-Gold Telemetry Cursor Follower */
        .hero-cursor-follower {
          position: fixed;
          top: 0;
          left: 0;
          width: 38px;
          height: 38px;
          margin-left: -19px;
          margin-top: -19px;
          border-radius: 50%;
          border: 1px solid rgba(217, 107, 126, 0.55);
          background: radial-gradient(circle, rgba(247, 168, 184, 0.16) 0%, transparent 70%);
          pointer-events: none;
          z-index: 40;
          transform: translate3d(var(--cursor-x, -100px), var(--cursor-y, -100px), 0);
          will-change: transform;
          display: flex;
          align-items: center;
          justify-content: center;
          mix-blend-mode: multiply;
        }

        .hero-cursor-follower::before {
          content: "";
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #7c283a;
          box-shadow: 0 0 8px #f7a8b8;
        }

        @media (pointer: coarse), (max-width: 768px) {
          .hero-cursor-follower {
            display: none;
          }
        }

        /* =====================================================================
           D. FOREGROUND TELEMETRY HUD & CONTROLS (ROSE-BURGUNDY & EDITORIAL)
           ===================================================================== */
        .hero-content {
          position: relative;
          z-index: 10;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 5.25rem 2.5rem 2rem;
          box-sizing: border-box;
          pointer-events: none;
        }

        .hero-telemetry-strip {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          opacity: 0;
          transform: translate3d(0, -16px, 0);
          transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.15s,
                      opacity 0.85s ease 0.15s;
        }

        .is-ready .hero-telemetry-strip {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .telemetry-tag {
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.45rem 0.9rem;
          background: var(--surface-card);
          border: 1px solid var(--border-hairline);
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--foreground);
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #d96b7e;
          will-change: transform, opacity;
          animation: pulseGlow 2s infinite ease-in-out;
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.82); }
        }

        .countdown-module {
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.45rem 0.95rem;
          background: var(--surface-card);
          border: 1px solid var(--border-hairline);
          clip-path: polygon(7px 0, 100% 0, 100% 100%, 0 100%, 0 7px);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .countdown-label {
          color: var(--foreground-muted);
        }

        .countdown-digits {
          display: inline-flex;
          align-items: center;
          font-weight: 700;
          color: var(--accent-rose-deep);
          letter-spacing: 0.04em;
        }

        .countdown-sep {
          margin: 0 0.15rem;
          opacity: 0.65;
        }

        .hero-middle {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
        }

        .hero-panels-col {
          pointer-events: auto;
          width: 16.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          opacity: 0;
          transform: translate3d(24px, 0, 0);
          transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.24s,
                      opacity 0.9s ease 0.24s;
        }

        .is-ready .hero-panels-col {
          opacity: 1;
          transform: translate3d(
            calc(var(--mx, 0) * 14px),
            calc(var(--my, 0) * 10px),
            0
          );
        }

        .bracket-panel {
          position: relative;
          overflow: hidden;
          padding: 1.1rem 1.3rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: var(--surface-card);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-hairline);
          clip-path: polygon(
            0 0,
            calc(100% - 14px) 0,
            100% 14px,
            100% 100%,
            14px 100%,
            0 calc(100% - 14px)
          );
          will-change: transform;
          animation: panelFloatWave 8.6s ease-in-out infinite alternate;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      background-color 0.3s ease,
                      border-color 0.3s ease,
                      box-shadow 0.35s ease;
        }

        .bracket-panel:nth-child(2) {
          animation-delay: -4.3s;
        }

        @keyframes panelFloatWave {
          0% { transform: translate3d(0, -3px, 0); }
          100% { transform: translate3d(0, 4px, 0); }
        }

        /* Diagonal Rose-Gold Shimmer Sweep */
        .bracket-panel::after,
        .driver-telemetry-card::after {
          content: "";
          position: absolute;
          top: 0;
          left: -130%;
          width: 75%;
          height: 100%;
          background: linear-gradient(
            105deg,
            transparent 0%,
            rgba(247, 168, 184, 0.28) 50%,
            transparent 100%
          );
          transform: skewX(-22deg);
          pointer-events: none;
          animation: panelShimmer 11.5s cubic-bezier(0.22, 1, 0.36, 1) infinite;
        }

        .bracket-panel:nth-child(2)::after {
          animation-delay: 3.8s;
        }

        .driver-telemetry-card::after {
          animation-delay: 7.2s;
        }

        @keyframes panelShimmer {
          0%, 68% { left: -130%; }
          100% { left: 165%; }
        }

        .bracket-panel:hover {
          transform: translate3d(0, -5px, 0) scale(1.015);
          background: var(--surface-card-hover);
          border-color: var(--border-strong);
          box-shadow: 0 14px 32px rgba(124, 40, 58, 0.12);
        }

        .telemetry-mini-bars {
          display: flex;
          flex-direction: column;
          gap: 0.32rem;
          margin-top: 0.3rem;
        }

        .telemetry-mini-bar-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.08em;
          color: var(--foreground-muted);
          text-transform: uppercase;
        }

        .telemetry-mini-bar-track {
          flex: 1;
          height: 3px;
          background: rgba(28, 5, 12, 0.1);
          overflow: hidden;
        }

        .telemetry-mini-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #7c283a 0%, #f7a8b8 100%);
          transform-origin: left center;
          animation: telemetryMeterPulse 5.5s ease-in-out infinite alternate;
        }

        .telemetry-mini-bar-row:nth-child(2) .telemetry-mini-bar-fill {
          animation-delay: -2.7s;
          animation-duration: 4.8s;
        }

        @keyframes telemetryMeterPulse {
          0% { transform: scaleX(0.72); }
          100% { transform: scaleX(0.98); }
        }

        .b-corner {
          position: absolute;
          width: 8px;
          height: 8px;
          border: 1.5px solid var(--accent-rose-deep);
          pointer-events: none;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .bracket-panel:hover .b-corner {
          transform: scale(1.25);
        }

        .tl { top: 0; left: 0; border-right: none; border-bottom: none; }
        .tr { top: 0; right: 0; border-left: none; border-bottom: none; }
        .bl { bottom: 0; left: 0; border-right: none; border-top: none; }
        .br { bottom: 0; right: 0; border-left: none; border-top: none; }

        .panel-eyebrow {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--accent-rose-deep);
          letter-spacing: 0.1em;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin: 0.25rem 0 0;
        }

        .stats-grid dt {
          font-family: var(--font-mono);
          font-size: 0.64rem;
          text-transform: uppercase;
          color: var(--foreground-muted);
          letter-spacing: 0.08em;
        }

        .stats-grid dd {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.85rem;
          line-height: 0.88;
          letter-spacing: -0.03em;
          margin: 0.3rem 0 0;
          color: var(--foreground);
        }

        .hero-foot {
          pointer-events: auto;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          width: 100%;
          box-sizing: border-box;
          opacity: 0;
          transform: translate3d(0, 20px, 0);
          transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.34s,
                      opacity 0.9s ease 0.34s;
        }

        .is-ready .hero-foot {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .driver-telemetry-card {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          padding: 0.95rem 1.25rem;
          background: var(--surface-card);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-hairline);
          clip-path: polygon(
            0 0,
            calc(100% - 16px) 0,
            100% 16px,
            100% 100%,
            0 100%
          );
          transform: translate3d(
            calc(var(--mx, 0) * -10px),
            calc(var(--my, 0) * -6px),
            0
          );
          will-change: transform;
        }

        .driver-meta-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent-rose-deep);
        }

        .driver-name {
          display: none !important;
        }

        .hero-foot-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .social-group {
          display: flex;
          gap: 0.45rem;
          align-items: center;
        }

        .social-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 2.75rem;
          padding: 0 0.95rem;
          font-family: var(--font-mono);
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--foreground);
          background: var(--surface-card);
          border: 1px solid var(--border-hairline);
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%);
          text-decoration: none;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
                      background-color 0.25s ease,
                      color 0.25s ease,
                      border-color 0.25s ease;
        }

        .social-pill:hover {
          background: var(--carbon-dark);
          color: var(--accent-pink);
          border-color: var(--carbon-dark);
          transform: translate3d(0, -3px, 0);
        }

        .lock-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 2.75rem;
          padding: 0 1.15rem;
          border: 1px solid var(--border-hairline);
          color: var(--foreground);
          background: var(--surface-card);
          font-family: var(--font-mono);
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
          will-change: transform;
          transform: translate3d(0, 0, 0);
          transition: color 0.25s ease,
                      background-color 0.25s ease,
                      border-color 0.25s ease,
                      transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .lock-button:hover,
        .lock-button[aria-pressed="true"] {
          color: var(--accent-pink);
          background: var(--carbon-dark);
          border-color: var(--carbon-dark);
          transform: translate3d(0, -3px, 0);
        }

        /* Soft Rose-Pink & Burgundy CTA Button (NO Yellow!) */
        .cta-button {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          height: 2.75rem;
          padding: 0 1.35rem;
          font-family: var(--font-mono);
          font-size: 0.76rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          text-decoration: none;
          color: #fff9fa;
          background: linear-gradient(135deg, #7c283a 0%, #2c0813 100%);
          border: 1px solid rgba(247, 168, 184, 0.45);
          font-weight: 800;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
          will-change: transform;
          transform: translate3d(0, 0, 0);
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.28s ease;
          cursor: pointer;
        }

        .cta-button:hover {
          transform: translate3d(0, -3px, 0);
          box-shadow: 0 10px 24px rgba(124, 40, 58, 0.35);
        }

        @media (max-width: 1024px) {
          .hero-telemetry-strip {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .hero-content {
            display: none !important;
          }
        }
      `}</style>

      {/* Interactive Rose-Gold Telemetry Cursor Ring */}
      <div className="hero-cursor-follower" aria-hidden="true" />

      {/* ===================================================================
          A. PRELOADER ("LEBIH HIDUP") & CLEAN PURE "NS" IRIS APERTURE
          =================================================================== */}
      {veilVisible && (
        <div
          className={`aperture-preloader ${apertureOpen ? "is-opening" : ""}`}
        >
          {/* Luminous Ambient Living Aurora Breathing in Background */}
          <div className="preloader-ambient-aura" aria-hidden="true" />

          {/* Floating Atmospheric Micro-Embers */}
          <div className="preloader-particles" aria-hidden="true">
            {[...Array(14)].map((_, i) => (
              <span
                key={i}
                className="preloader-dust-dot"
                style={{
                  left: `${6 + (i * 73) % 88}%`,
                  bottom: "-10px",
                  animationDuration: `${3.2 + (i % 4) * 0.9}s`,
                  animationDelay: `${(i * 0.35) % 2.8}s`,
                  width: `${2 + (i % 3)}px`,
                  height: `${2 + (i % 3)}px`,
                  opacity: 0.25 + (i % 4) * 0.15,
                }}
              />
            ))}
          </div>

          {/* 1. Fluid Liquid Waves Rising Inside Circular Lens */}
          <div className="aperture-core-shutter">
            <div className="shutter-inner-ambient" />
            <div
              className="shutter-wave-container"
              style={{ transform: `translate3d(0, ${(1 - veilProgress) * 100}%, 0)` }}
            >
              {/* Back Wave (Deep Rose Burgundy) */}
              <svg
                className="liquid-wave wave-back"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0 35 Q 300 0 600 35 T 1200 35 V 120 H 0 Z"
                  fill="rgba(196, 71, 104, 0.75)"
                />
              </svg>
              {/* Front Wave (Luminous Pink Gold) */}
              <svg
                className="liquid-wave wave-front"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="waveLiquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffd6e0" />
                    <stop offset="45%" stopColor="#f7a8b8" />
                    <stop offset="100%" stopColor="#c44768" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 45 Q 300 85 600 45 T 1200 45 V 120 H 0 Z"
                  fill="url(#waveLiquidGrad)"
                />
              </svg>
              {/* Liquid Body Below Wave */}
              <div className="liquid-wave-body" />
            </div>
          </div>

          {/* 2. Optical Lens Iris Mask: PURE "NS" SAJA (NO BORDER LINES / NO TICKS) */}
          <svg
            className="aperture-svg-mask"
            viewBox="-500 -500 1000 1000"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="nsLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#fff0f3" />
                <stop offset="100%" stopColor="#f7a8b8" />
              </linearGradient>
            </defs>

            {/* Smooth Circular Iris Opening (Radius = 30, perfectly matches 14.4vmax shutter) */}
            <path
              fill="#1c050c"
              fillRule="evenodd"
              d="
                M -500 -500 H 500 V 500 H -500 Z
                M 0 -30 A 30 30 0 1 0 0.01 -30 Z
              "
            />

            {/* Tulisan "NS" Murni & Bersih di Tengah (Tanpa Garis Pinggir Apapun) */}
            <text
              x="0"
              y="11"
              textAnchor="middle"
              fontFamily="'Oswald', Impact, sans-serif"
              fontSize="30"
              fontWeight="800"
              fill="url(#nsLogoGrad)"
              letterSpacing="3"
              style={{
                filter: "drop-shadow(0 2px 14px rgba(247, 168, 184, 0.55))",
              }}
            >
              NS
            </text>
          </svg>

          {/* 3. Bottom & Top Telemetry HUD */}
          <div className="preloader-hud">
            <div className="preloader-top-row">
              <div className="preloader-live-tag">
                <span className="live-pulse-dot" />
                <span>SYS // ACTIVE ENGINE</span>
              </div>
              <span className="preloader-season">SEASON 2026</span>
            </div>

            <div className="preloader-bottom-row">
              <div className="preloader-phase-tag">{loaderStatus}</div>
              <div className="preloader-counter-box">
                <span className="preloader-counter">{progressFormatted}</span>
                <span className="preloader-counter-pct">%</span>
              </div>
              <div className="preloader-bar-track">
                <div
                  className="preloader-bar-fill"
                  style={{ transform: `scaleX(${veilProgress})` }}
                >
                  <span className="bar-glow-spark" />
                </div>
              </div>
              <div className="preloader-brand-signature">NIKMATUS SOLIHAH</div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          C. HERO SECTION (100vh)
          =================================================================== */}
      <div className="hero-runway-container">
        <section data-hero id="home" className="hero-section">
          <div className="hero-focal-stage">
            <HeroFluidScene
              className="hero-canvas"
              portraitBaseUrl={IMG_BEFORE}
              portraitHelmetUrl={IMG_AFTER}
            />
          </div>

          {/* 3D Counter-Rotating Telemetry Orbit Rings & Crosshairs Behind Portrait */}
          <div className="hero-orbital-hud" aria-hidden="true">
            <svg
              className="hero-orbital-svg"
              viewBox="0 0 1000 1000"
              fill="none"
            >
              <g className="orbit-ring-cw">
                <circle
                  cx="500"
                  cy="500"
                  r="410"
                  stroke="#7c283a"
                  strokeWidth="1"
                  strokeDasharray="6 14 28 14"
                  opacity="0.45"
                />
                <circle
                  cx="500"
                  cy="500"
                  r="436"
                  stroke="#d96b7e"
                  strokeWidth="0.8"
                  strokeDasharray="2 18"
                  opacity="0.4"
                />
                <path
                  d="M 500 58 V 82 M 500 918 V 942 M 58 500 H 82 M 918 500 H 942"
                  stroke="#7c283a"
                  strokeWidth="1.5"
                />
              </g>
              <g className="orbit-ring-ccw">
                <circle
                  cx="500"
                  cy="500"
                  r="348"
                  stroke="#d96b7e"
                  strokeWidth="1.2"
                  strokeDasharray="48 24 8 24"
                  opacity="0.38"
                />
                <circle
                  cx="500"
                  cy="152"
                  r="4"
                  fill="#f7a8b8"
                  stroke="#7c283a"
                  strokeWidth="1.5"
                />
                <circle
                  cx="500"
                  cy="848"
                  r="4"
                  fill="#f7a8b8"
                  stroke="#7c283a"
                  strokeWidth="1.5"
                />
              </g>
              <g className="orbit-ring-pulse">
                <circle
                  cx="500"
                  cy="500"
                  r="285"
                  stroke="#7c283a"
                  strokeWidth="0.75"
                  strokeDasharray="120 60"
                  opacity="0.3"
                />
              </g>
            </svg>
          </div>

          {/* Foreground Telemetry HUD & Controls */}
          <div className="hero-content">

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
                    <strong>Creative Developer</strong>
                    <br />
                    Frontend Developer, UI/UX Developer, WebSite Developer, SEO Analys
                    <br />
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
                      <dd>06</dd>
                    </div>
                    <div>
                      <dt>Experience</dt>
                      <dd>06</dd>
                    </div>
                    <div>
                      <dt>Years</dt>
                      <dd>03</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="hero-foot">
              <div className="driver-telemetry-card">
                <ul className="driver-meta-list">
                  <li>IDN // MALANG</li>
                  <li>·</li>
                </ul>
                <h1 className="driver-name">
                  Nikmatus <br />
                  Solihah
                </h1>
              </div>

              <div className="hero-foot-actions">
                <div className="social-group">
                  <a
                    href="https://www.instagram.com/just.atuc/?utm_source=ig_web_button_share_sheet"
                    target="_blank"
                    rel="noreferrer"
                    className="social-pill"
                  >
                    <RollText text="INST" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="social-pill"
                  >
                    <RollText text="IN" />
                  </a>
                  <a
                    href="https://github.com/aatuuss"
                    target="_blank"
                    rel="noreferrer"
                    className="social-pill"
                  >
                    <RollText text="GIT" />
                  </a>
                </div>

                <button
                  type="button"
                  className="lock-button"
                  aria-pressed={isLocked}
                  onClick={() => setIsLocked((locked) => !locked)}
                >
                  <RollText
                    text={isLocked ? "BACK TO SCROLL" : "TAP TO LOCK"}
                  />
                </button>

                <button
                  type="button"
                  onClick={scrollToNextSection}
                  className="cta-button"
                >
                  <RollText text="EXPLORE" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
