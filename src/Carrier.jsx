import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "motion/react";

const carrierData = [
  {
    id: "01",
    year: "2026",
    period: "JUL 2025 — APR 2026",
    role: "Website Developer, Front-End, UI/UX, Web Analyst & SEO",
    company: "PT. Infimech Harmoni Teknologi • Malang",
    bullets: [
      "Developed and maintained responsive web applications from requirement analysis and UI/UX design to deployment and performance optimization.",
      "Collaborated in user research and business requirement analysis to deliver scalable and user-oriented web solutions.",
      "Designed modern and intuitive UI/UX interfaces in Figma with a strong focus on usability and user experience.",
      "Built responsive and high-performance applications using Next.js, React, Laravel, and MySQL across multiple devices and browsers.",
      "Optimized website SEO and analyzed web performance to improve Google search rankings, increase visibility, and drive higher website traffic.",
    ],
  },
  {
    id: "02",
    year: "2026",
    period: "OCT 2025 — APR 2026",
    role: "Website Developer, Front-End, UI/UX & Web Analyst",
    company: "PT. Karya Mulya Korpora • Malang",
    bullets: [
      "Developed and maintained responsive web applications and ERP systems using Next.js, React, Laravel, and MySQL.",
      "Collaborated in requirement analysis and system planning to deliver user-focused and business-oriented solutions.",
      "Designed intuitive and modern UI/UX interfaces in Figma with emphasis on consistency and user experience.",
      "Improved website performance and frontend architecture to enhance accessibility, responsiveness, and system efficiency.",
      "Implemented scalable and maintainable frontend solutions following modern web development best practices.",
    ],
  },
  {
    id: "03",
    year: "2026",
    period: "FEB 2026 — APR 2026",
    role: "Website Developer & UI/UX Designer",
    company: "PT. Prima Rekayasa Mandiri • Malang",
    bullets: [
      "Developed responsive and interactive web applications using React with a focus on performance, scalability, and user experience.",
      "Collaborated in business and user requirement analysis to deliver effective and user-oriented digital solutions.",
      "Designed modern UI/UX interfaces in Figma with intuitive navigation and consistent design systems.",
      "Optimized website performance and SEO to improve Google search visibility, increase traffic, and enhance user engagement.",
      "Contributed to end-to-end web development processes from planning and design to implementation and performance optimization.",
    ],
  },
  {
    id: "04",
    year: "2025",
    period: "JAN 2025 — JUL 2025",
    role: "UI/UX Design & Front-End Developer",
    company: "SMP Negeri 10 Malang • Malang",
    bullets: [
      "Designed and developed the school website with an interactive user interface.",
      "Created UI/UX designs using Figma.",
    ],
  },
  {
    id: "05",
    year: "2023",
    period: "JUL 2023 — MAY 2026",
    role: "Software Engineering (Rekayasa Perangkat Lunak)",
    company: "SMK Negeri 6 Malang • Malang",
    bullets: [
      "Relevant Coursework: Web Development, UI/UX Design, and Frontend Development.",
      "Maintained a strong academic record with an average grade of 89.39.",
    ],
  },
];

// Komponen Dial Jam Latar Belakang (Chrono Telemetry Dial) dengan Rotasi Dinamis & Orbit Satelit
function TimeDialBackground({ activeIndex }) {
  const ticks = Array.from({ length: 32 });
  const rotationAngle = activeIndex * -22;

  return (
    <div className="carrier-dial-wrapper" aria-hidden="true">
      {/* Ambient Pulsing Glow Orbs */}
      <div className="carrier-ambient-glow" />

      {/* Outer Counter-Rotating Azimuth Ring */}
      <svg viewBox="0 0 500 500" className="carrier-dial-svg dial-outer-spin">
        <circle
          cx="250"
          cy="250"
          r="230"
          fill="none"
          stroke="rgba(247, 168, 184, 0.08)"
          strokeWidth="1"
          strokeDasharray="6 8"
        />
        <circle
          cx="250"
          cy="250"
          r="215"
          fill="none"
          stroke="rgba(255, 224, 181, 0.12)"
          strokeWidth="0.8"
        />
        {/* Orbiting Satellite Beacon */}
        <circle cx="250" cy="20" r="3.5" fill="#f7a8b8" opacity="0.85" />
        <circle cx="250" cy="480" r="2.5" fill="#ffe0b5" opacity="0.6" />
      </svg>

      {/* Main Interactive Rotating Dial driven by activeIndex */}
      <motion.svg
        viewBox="0 0 500 500"
        className="carrier-dial-svg"
        animate={{ rotate: rotationAngle }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <circle
          cx="250"
          cy="250"
          r="190"
          fill="none"
          stroke="rgba(247, 168, 184, 0.16)"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />
        <circle
          cx="250"
          cy="250"
          r="145"
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="0.8"
        />
        <circle
          cx="250"
          cy="250"
          r="95"
          fill="none"
          stroke="rgba(247, 168, 184, 0.12)"
          strokeWidth="0.8"
          strokeDasharray="2 4"
        />

        {/* 4 Cardinal Crosshairs */}
        <line x1="250" y1="50" x2="250" y2="70" stroke="#f7a8b8" strokeWidth="1.5" />
        <line x1="250" y1="430" x2="250" y2="450" stroke="#f7a8b8" strokeWidth="1.5" />
        <line x1="50" y1="250" x2="70" y2="250" stroke="#f7a8b8" strokeWidth="1.5" />
        <line x1="430" y1="250" x2="450" y2="250" stroke="#f7a8b8" strokeWidth="1.5" />

        {ticks.map((_, i) => {
          const angle = (i * 360) / ticks.length;
          const isMajor = i % 4 === 0;
          return (
            <line
              key={i}
              x1="250"
              y1={isMajor ? "50" : "60"}
              x2="250"
              y2={isMajor ? "76" : "70"}
              stroke={
                isMajor
                  ? "rgba(255, 224, 181, 0.45)"
                  : "rgba(247, 168, 184, 0.18)"
              }
              strokeWidth={isMajor ? "1.8" : "1"}
              strokeLinecap="round"
              transform={`rotate(${angle} 250 250)`}
            />
          );
        })}
      </motion.svg>
    </div>
  );
}

export default function Carrier() {
  const sectionRef = useRef(null);
  const rightViewportRef = useRef(null);
  const rightListRef = useRef(null);

  const [pinState, setPinState] = useState("top"); // "top" | "fixed" | "bottom"
  const [activeIndex, setActiveIndex] = useState(0);
  const [maxScrollY, setMaxScrollY] = useState(0);

  // MotionValue GPU-accelerated untuk menggeser daftar karier di sisi kanan
  const scrollProgress = useMotionValue(0);
  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 95,
    damping: 22,
    mass: 0.3,
  });

  const y = useTransform(smoothProgress, [0, 1], [0, -maxScrollY]);

  // Mengukur tinggi daftar di kolom kanan saat mount & resize
  useEffect(() => {
    const measureRightList = () => {
      if (!rightListRef.current || !rightViewportRef.current) return;
      const listHeight = rightListRef.current.scrollHeight;
      const viewportHeight = rightViewportRef.current.clientHeight;
      setMaxScrollY(Math.max(0, listHeight - viewportHeight + 90));
    };

    measureRightList();
    window.addEventListener("resize", measureRightList);
    const timer = setTimeout(measureRightList, 300);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measureRightList);
    };
  }, []);

  // Mengunci layar sehingga bagian kiri tetap diam dan kanan bergeser saat di-scroll
  useEffect(() => {
    const startHoldBuffer = 120;
    const endHoldBuffer = 140;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollableDistance = Math.max(1, rect.height - vh);

      if (rect.top > 0) {
        setPinState("top");
        scrollProgress.set(0);
        setActiveIndex(0);
      } else if (rect.bottom >= vh) {
        setPinState("fixed");
        const scrolledInto = -rect.top;
        const effectiveScroll = Math.max(0, scrolledInto - startHoldBuffer);
        const effectiveMax = Math.max(
          1,
          scrollableDistance - startHoldBuffer - endHoldBuffer
        );
        const progress = Math.min(
          1,
          Math.max(0, effectiveScroll / effectiveMax)
        );
        scrollProgress.set(progress);
        const idx = Math.max(
          0,
          Math.min(
            carrierData.length - 1,
            Math.round(progress * (carrierData.length - 1))
          )
        );
        setActiveIndex(idx);
      } else {
        const lastIdx = carrierData.length - 1;
        setPinState("bottom");
        scrollProgress.set(1);
        setActiveIndex(lastIdx);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollProgress]);

  // Klik item timeline untuk langsung melompat ke stasiun karier tersebut
  const scrollToStep = (index) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const scrollableDistance = Math.max(
      1,
      sectionRef.current.offsetHeight - window.innerHeight
    );
    const startHoldBuffer = 120;
    const endHoldBuffer = 140;
    const effectiveMax = Math.max(
      1,
      scrollableDistance - startHoldBuffer - endHoldBuffer
    );
    const targetY =
      sectionTop +
      startHoldBuffer +
      (index / Math.max(1, carrierData.length - 1)) * effectiveMax;

    if (window.lenis && typeof window.lenis.scrollTo === "function") {
      window.lenis.scrollTo(targetY, { duration: 1.25 });
    } else {
      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    }
  };

  const activeItem = carrierData[activeIndex] || carrierData[0];
  const progressPercentage = ((activeIndex + 1) / carrierData.length) * 100;

  return (
    <section
      ref={sectionRef}
      className="carrier-scroll-section"
      id="carrier"
      style={{ height: `${carrierData.length * 85}vh` }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Oswald:wght@500;600;700;800&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');

        .carrier-scroll-section {
          --cr-bg: #14040a;
          --cr-bg-card: rgba(30, 6, 14, 0.72);
          --cr-bg-card-hover: rgba(45, 9, 21, 0.88);
          --cr-border: rgba(255, 232, 236, 0.16);
          --cr-border-strong: rgba(247, 168, 184, 0.45);
          --cr-border-gold: rgba(255, 224, 181, 0.35);
          --cr-text: #fff9fa;
          --cr-text-muted: #d4bcc3;
          --cr-rose: #f7a8b8;
          --cr-gold: #ffe0b5;
          --cr-dark: #1c050c;
          --font-display: 'Oswald', Impact, sans-serif;
          --font-sans: 'Space Grotesk', system-ui, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;

          position: relative;
          z-index: 20;
          width: 100%;
          background: #14040a;
          margin: 0;
          padding: 0;
          font-family: var(--font-sans);
          color: var(--cr-text);
          box-sizing: border-box;
          border-top: 1px solid var(--cr-border-gold);
        }

        /* 1. ANIMASI LATAR BELAKANG HIDUP (Living Ambient Aurora & Scan Radar) */
        .carrier-ambient-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(247, 168, 184, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(247, 168, 184, 0.035) 1px, transparent 1px);
          background-size: 4rem 4rem;
          pointer-events: none;
          z-index: 1;
        }

        .carrier-radar-scan-beam {
          position: absolute;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(247, 168, 184, 0.06) 65%,
            rgba(247, 168, 184, 0.22) 100%
          );
          border-bottom: 1.5px solid rgba(247, 168, 184, 0.55);
          box-shadow: 0 6px 24px rgba(247, 168, 184, 0.25);
          pointer-events: none;
          z-index: 2;
          animation: carrierRadarScan 7.5s linear infinite;
        }

        @keyframes carrierRadarScan {
          0% { transform: translateY(-120px); opacity: 0; }
          12% { opacity: 1; }
          88% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        /* Animated Floating Gradient Orbs */
        .carrier-aurora-orb-1 {
          position: absolute;
          top: 18%;
          left: 12%;
          width: 440px;
          height: 440px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(168, 38, 66, 0.26) 0%, transparent 70%);
          filter: blur(55px);
          pointer-events: none;
          z-index: 1;
          animation: carrierFloatOrb1 11s ease-in-out infinite alternate;
        }

        .carrier-aurora-orb-2 {
          position: absolute;
          bottom: 15%;
          right: 18%;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(247, 168, 184, 0.16) 0%, transparent 70%);
          filter: blur(65px);
          pointer-events: none;
          z-index: 1;
          animation: carrierFloatOrb2 14s ease-in-out infinite alternate;
        }

        @keyframes carrierFloatOrb1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(50px, 45px) scale(1.18); }
        }

        @keyframes carrierFloatOrb2 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-55px, -50px) scale(1.22); }
        }

        /* Floating Ambient Particles */
        .carrier-particle-dot {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--cr-gold);
          box-shadow: 0 0 10px var(--cr-gold);
          pointer-events: none;
          z-index: 2;
          animation: particleDrift 8s linear infinite;
        }

        .p-1 { left: 18%; top: 35%; animation-duration: 9s; animation-delay: 0s; }
        .p-2 { left: 45%; top: 65%; animation-duration: 11s; animation-delay: 2s; }
        .p-3 { left: 75%; top: 25%; animation-duration: 8.5s; animation-delay: 1.2s; }
        .p-4 { left: 88%; top: 78%; animation-duration: 10s; animation-delay: 3s; }

        @keyframes particleDrift {
          0% { transform: translateY(0) scale(0.8); opacity: 0.2; }
          50% { opacity: 0.85; transform: translateY(-40px) scale(1.2); }
          100% { transform: translateY(-80px) scale(0.6); opacity: 0; }
        }

        /* Jendela 100vh yang mengunci (pinned) selama scroll karier berlangsung */
        .carrier-terminal-window {
          width: 100%;
          height: 100vh;
          background: radial-gradient(
            circle at 20% 35%,
            #320a18 0%,
            var(--cr-bg) 55%,
            #0a0205 100%
          );
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          overflow: hidden;
          z-index: 25;
        }

        .carrier-terminal-window.pin-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 25;
        }

        .carrier-terminal-window.pin-fixed {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 25;
        }

        .carrier-terminal-window.pin-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 25;
        }

        /* 2. HEADER ATAS (Menyatu Konsep dengan About, Project, Certificates) */
        .carrier-top-bar {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.6rem 3.5rem 1.2rem;
          border-bottom: 1px solid var(--cr-border);
          background: rgba(20, 4, 10, 0.45);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          flex-shrink: 0;
        }

        .carrier-kicker {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.28rem 0.75rem;
          background: rgba(30, 6, 14, 0.65);
          border: 1px solid var(--cr-border-gold);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: var(--cr-gold);
          text-transform: uppercase;
        }

        .kicker-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--cr-rose);
          box-shadow: 0 0 8px var(--cr-rose);
        }

        .carrier-top-telemetry {
          display: flex;
          align-items: center;
          gap: 1.15rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--cr-rose);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .carrier-step-pill {
          padding: 0.25rem 0.65rem;
          background: rgba(30, 6, 14, 0.85);
          border: 1px solid var(--cr-border-gold);
          color: var(--cr-gold);
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        /* 3. LAYOUT UTAMA 2 KOLOM */
        .carrier-body {
          flex: 1;
          min-height: 0;
          height: calc(100vh - 75px);
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 3.5rem;
          padding: 0 3.5rem;
          box-sizing: border-box;
          overflow: hidden;
          position: relative;
          z-index: 5;
        }

        /* =========================================
           KOLOM KIRI: TETAP DIAM (STATIC PINNED)
           ========================================= */
        .carrier-left-pinned {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          z-index: 5;
          user-select: none;
        }

        /* Chrono Telemetry Dial */
        .carrier-dial-wrapper {
          position: absolute;
          left: -40px;
          top: 50%;
          transform: translateY(-50%);
          width: 480px;
          height: 480px;
          pointer-events: none;
          z-index: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .carrier-ambient-glow {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(247, 168, 184, 0.18) 0%,
            rgba(168, 38, 66, 0.12) 45%,
            transparent 70%
          );
          filter: blur(35px);
        }

        .carrier-dial-svg {
          width: 100%;
          height: 100%;
          position: absolute;
        }

        .dial-outer-spin {
          animation: spinOuterAzimuth 60s linear infinite;
          transform-origin: 250px 250px;
        }

        @keyframes spinOuterAzimuth {
          100% { transform: rotate(360deg); }
        }

        .carrier-left-content {
          position: relative;
          z-index: 4;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .carrier-main-heading {
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 3.8vw, 3.6rem);
          font-weight: 800;
          color: var(--cr-text);
          letter-spacing: 0.02em;
          text-transform: uppercase;
          line-height: 1.05;
          margin: 0.85rem 0 0.5rem 0;
        }

        .carrier-heading-outline {
          display: block;
          color: transparent;
          -webkit-text-stroke: 1.5px var(--cr-rose);
        }

        /* Angka Tahun Raksasa (2026, 2025, 2024) */
        .carrier-giant-year-wrap {
          min-height: clamp(5.5rem, 11vw, 9.5rem);
          display: flex;
          align-items: center;
          margin: 0.2rem 0 0.6rem 0;
        }

        .carrier-giant-year {
          font-family: var(--font-display);
          font-size: clamp(5.8rem, 11.5vw, 9.5rem);
          font-weight: 800;
          line-height: 0.92;
          letter-spacing: -0.02em;
          background: linear-gradient(180deg, #ffffff 0%, var(--cr-rose) 65%, #a82642 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          filter: drop-shadow(0 14px 35px rgba(0, 0, 0, 0.7));
        }

        .carrier-active-period-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.35rem 0.85rem;
          background: rgba(30, 6, 14, 0.8);
          border: 1px solid var(--cr-border-strong);
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: var(--cr-rose);
          text-transform: uppercase;
          margin-bottom: 1.4rem;
        }

        /* Baris Counter 02 / 05 + Progress Line */
        .carrier-progress-row {
          display: flex;
          align-items: center;
          gap: 0.95rem;
          font-family: var(--font-mono);
          font-size: 0.82rem;
        }

        .carrier-clock-icon {
          color: var(--cr-gold);
          display: flex;
          align-items: center;
        }

        .carrier-step-numbers {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          min-width: 58px;
        }

        .step-current {
          color: var(--cr-text);
          font-weight: 700;
        }

        .step-divider,
        .step-total {
          color: var(--cr-text-muted);
          font-weight: 600;
        }

        .carrier-progress-track {
          width: 180px;
          height: 3px;
          background: rgba(255, 255, 255, 0.14);
          overflow: hidden;
          position: relative;
        }

        .carrier-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--cr-gold), var(--cr-rose));
          transition: width 0.35s ease;
        }

        /* =========================================
           KOLOM KANAN: TIMELINE YANG BISA DI-SCROLL
           ========================================= */
        .carrier-right-viewport {
          position: relative;
          height: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* Masking gradasi lembut di atas & bawah agar scroll terlihat sinematik */
        .carrier-right-viewport::before,
        .carrier-right-viewport::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          height: 70px;
          z-index: 8;
          pointer-events: none;
        }

        .carrier-right-viewport::before {
          top: 0;
          background: linear-gradient(180deg, var(--cr-bg) 0%, transparent 100%);
        }

        .carrier-right-viewport::after {
          bottom: 0;
          background: linear-gradient(0deg, var(--cr-bg) 0%, transparent 100%);
        }

        .carrier-timeline-list {
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 18vh 1rem 26vh 2.8rem;
          will-change: transform;
        }

        /* Garis Vertikal Timeline di Sisi Kiri Kolom Kanan */
        .carrier-timeline-line {
          position: absolute;
          left: 11px;
          top: 18vh;
          bottom: 24vh;
          width: 1.5px;
          background: linear-gradient(
            180deg,
            var(--cr-gold) 0%,
            var(--cr-rose) 50%,
            rgba(247, 168, 184, 0.08) 100%
          );
        }

        /* Kartu Stasiun Karier Berarsitektur Motorsport */
        .carrier-timeline-item {
          position: relative;
          padding: 0 0 3.8rem 1.6rem;
          cursor: pointer;
          transition: all 0.35s ease;
        }

        .carrier-timeline-item:last-child {
          padding-bottom: 1.5rem;
        }

        .carrier-timeline-item.dimmed {
          opacity: 0.45;
        }

        .carrier-timeline-item.dimmed:hover {
          opacity: 0.85;
        }

        /* Titik Node pada Garis Timeline (Glowing Radar Beacon) */
        .timeline-node-dot {
          position: absolute;
          left: -33px;
          top: 6px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #14040a;
          border: 2px solid var(--cr-rose);
          transition: all 0.35s ease;
          z-index: 4;
        }

        .carrier-timeline-item.active .timeline-node-dot {
          width: 16px;
          height: 16px;
          left: -35px;
          top: 4px;
          background: #ffffff;
          border-color: var(--cr-gold);
          box-shadow:
            0 0 0 5px rgba(247, 168, 184, 0.22),
            0 0 20px var(--cr-rose);
        }

        /* Card Content Box with Architectural Corner Brackets */
        .carrier-card-box {
          position: relative;
          background: var(--cr-bg-card);
          border: 1px solid var(--cr-border);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          padding: 1.45rem 1.65rem;
          clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 12px),
            calc(100% - 12px) 100%,
            0 100%
          );
          transition: all 0.3s ease;
        }

        .carrier-timeline-item:hover .carrier-card-box,
        .carrier-timeline-item.active .carrier-card-box {
          background: var(--cr-bg-card-hover);
          border-color: var(--cr-border-strong);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
          transform: translateX(4px);
        }

        /* L-Bracket Siku di Sudut Kartu */
        .b-corner {
          position: absolute;
          width: 8px;
          height: 8px;
          border: 1.5px solid var(--cr-border-gold);
          pointer-events: none;
          transition: all 0.25s ease;
        }
        .carrier-card-box:hover .b-corner,
        .carrier-timeline-item.active .b-corner {
          width: 12px;
          height: 12px;
          border-color: var(--cr-gold);
        }
        .tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
        .tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
        .bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }

        .timeline-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .timeline-period-label {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: var(--cr-gold);
          text-transform: uppercase;
          margin: 0;
        }

        .timeline-index-tag {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--cr-rose);
          letter-spacing: 0.08em;
        }

        .timeline-role-title {
          font-family: var(--font-display);
          font-size: clamp(1.45rem, 2.2vw, 1.95rem);
          font-weight: 700;
          color: var(--cr-text);
          letter-spacing: 0.02em;
          text-transform: uppercase;
          line-height: 1.15;
          margin: 0 0 0.35rem 0;
        }

        .timeline-company-name {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--cr-rose);
          letter-spacing: 0.06em;
          margin: 0 0 1rem 0;
        }

        .timeline-bullets {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          border-top: 1px solid var(--cr-border);
          padding-top: 0.85rem;
        }

        .timeline-bullet-item {
          position: relative;
          padding-left: 1rem;
          font-size: 0.86rem;
          line-height: 1.62;
          color: var(--cr-text-muted);
        }

        .timeline-bullet-item::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.58rem;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--cr-rose);
          opacity: 0.85;
        }

        @media (max-width: 1024px) {
          .carrier-scroll-section {
            height: auto !important;
          }
          .carrier-terminal-window,
          .carrier-terminal-window.pin-top,
          .carrier-terminal-window.pin-fixed,
          .carrier-terminal-window.pin-bottom {
            position: relative;
            height: auto;
          }
          .carrier-top-bar {
            padding: 1.25rem 1.5rem;
          }
          .carrier-body {
            grid-template-columns: 1fr;
            height: auto;
            padding: 2.5rem 1.5rem 3.5rem;
            gap: 2.5rem;
          }
          .carrier-right-viewport {
            height: auto;
            overflow: visible;
          }
          .carrier-timeline-list {
            padding: 1rem 0 1rem 2rem;
            transform: none !important;
          }
          .carrier-timeline-line {
            top: 1rem;
            bottom: 1rem;
          }
          .carrier-dial-wrapper {
            display: none;
          }
        }
      `}</style>

      {/* Jendela Pinned 100vh */}
      <div className={`carrier-terminal-window pin-${pinState}`}>
        {/* Living Animated Background Elements */}
        <div className="carrier-ambient-grid" aria-hidden="true" />
        <div className="carrier-radar-scan-beam" aria-hidden="true" />
        <div className="carrier-aurora-orb-1" aria-hidden="true" />
        <div className="carrier-aurora-orb-2" aria-hidden="true" />

        {/* Floating Ambient Stardust */}
        <span className="carrier-particle-dot p-1" aria-hidden="true" />
        <span className="carrier-particle-dot p-2" aria-hidden="true" />
        <span className="carrier-particle-dot p-3" aria-hidden="true" />
        <span className="carrier-particle-dot p-4" aria-hidden="true" />



        {/* 2. Body 2 Kolom Pinned */}
        <div className="carrier-body">
          {/* KOLOM KIRI: Tetap Diam Saat Di-scroll */}
          <div className="carrier-left-pinned">
            <TimeDialBackground activeIndex={activeIndex} />

            <div className="carrier-left-content">
              <h2 className="carrier-main-heading">
                CAREER
                <span className="carrier-heading-outline">TRAJECTORY</span>
              </h2>

              <div className="carrier-giant-year-wrap">
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={activeItem.year}
                    className="carrier-giant-year"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {activeItem.year}
                  </motion.h3>
                </AnimatePresence>
              </div>

              <div className="carrier-active-period-badge">
                <span>STAGE {activeItem.id}</span>
                <span>//</span>
                <span>{activeItem.period}</span>
              </div>

              <div className="carrier-progress-row">
                <span className="carrier-clock-icon" title="Timeline Progress">
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="12 7 12 12 15 15" />
                  </svg>
                </span>

                <div className="carrier-step-numbers">
                  <span className="step-current">
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="step-divider">/</span>
                  <span className="step-total">
                    {String(carrierData.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="carrier-progress-track">
                  <div
                    className="carrier-progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: Daftar Karier Bergeser Halus Mengikuti Scroll */}
          <div ref={rightViewportRef} className="carrier-right-viewport">
            <motion.div
              ref={rightListRef}
              style={{ y }}
              className="carrier-timeline-list"
            >
              <div className="carrier-timeline-line" />

              {carrierData.map((item, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <article
                    key={item.id}
                    onClick={() => scrollToStep(idx)}
                    className={`carrier-timeline-item ${
                      isActive ? "active" : "dimmed"
                    }`}
                  >
                    <span className="timeline-node-dot" />

                    <div className="carrier-card-box">
                      <span className="b-corner tl" />
                      <span className="b-corner tr" />
                      <span className="b-corner bl" />

                      <div className="timeline-card-header">
                        <p className="timeline-period-label">{item.period}</p>
                        <span className="timeline-index-tag">0{idx + 1}</span>
                      </div>

                      <h4 className="timeline-role-title">{item.role}</h4>
                      <p className="timeline-company-name">{item.company}</p>

                      <ul className="timeline-bullets">
                        {item.bullets.map((point, bIdx) => (
                          <li key={bIdx} className="timeline-bullet-item">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
