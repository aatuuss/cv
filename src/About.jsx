import React, { Suspense, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Lanyard from "./components/Lanyard/Lanyard";

function TechIcon({ name }) {
  switch (name) {
    case "React":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#61DAFB" strokeWidth="1.8">
          <circle cx="12" cy="12" r="2.2" fill="#61DAFB" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
        </svg>
      );
    case "Canva":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
          <circle cx="12" cy="12" r="10" fill="#00C4CC" />
          <path
            d="M14.8 9.2c-1.1-1.1-3.2-.9-4.5.6-1.3 1.5-1.4 3.8-.2 5 1.1 1.1 3.1.9 4.4-.5"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "Laravel":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#FF2D20" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7l6-3.5L15 7v7l-6 3.5L3 14V7z" />
          <path d="M15 10.5l6-3.5v7l-6 3.5" />
          <path d="M9 17.5V21l6-3.5" />
        </svg>
      );
    case "PHP":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
          <ellipse cx="12" cy="12" rx="10" ry="6" fill="#777BB4" />
          <text x="12" y="14.5" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontWeight="700" fontFamily="monospace">
            php
          </text>
        </svg>
      );
    case "NextJs":
    case "Next.js":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
          <circle cx="12" cy="12" r="10" fill="#ffffff" stroke="#334155" strokeWidth="1.2" />
          <path d="M8.5 16V8l7.5 9.5" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
          <path d="M15.5 8v5" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "MySQL":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#00758F" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
          <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
        </svg>
      );
    case "Supabase":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="#3ECF8E">
          <path d="M13 2L4.5 13.5h6.5L10 22l9.5-11.5h-6.5L13 2z" />
        </svg>
      );
    case "Rust":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.9">
          <circle cx="12" cy="12" r="7.5" strokeDasharray="3 2" />
          <path d="M9.5 15V9h3.2a2.2 2.2 0 0 1 0 4.4H9.5m3 0L15 15" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Tauri":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" strokeWidth="2">
          <circle cx="9.5" cy="12" r="5" stroke="#24C8DB" />
          <circle cx="14.5" cy="12" r="5" stroke="#FFC131" />
        </svg>
      );
    case "Tailwind CSS":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="#38BDF8">
          <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.47 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.47 12 7 12z" />
        </svg>
      );
    case "JavaScript":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14">
          <rect x="2" y="2" width="20" height="20" rx="3" fill="#F7DF1E" />
          <text x="12" y="17" textAnchor="middle" fill="#000000" fontSize="10" fontWeight="800" fontFamily="monospace">
            JS
          </text>
        </svg>
      );
    case "HTML5/CSS3":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path d="M4 2h16l-1.5 17L12 22l-6.5-3L4 2z" fill="#E34F26" />
          <text x="12" y="15.5" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="800" fontFamily="monospace">
            5
          </text>
        </svg>
      );
    case "SEO":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l7 3v6c0 5-3.5 9.7-7 11-3.5-1.3-7-6-7-11V5l7-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "Web Vitals":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="#F59E0B">
          <path d="M13 2L4.5 13.5h6.5L10 22l9.5-11.5h-6.5L13 2z" />
        </svg>
      );
    case "Git":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
          <path d="M12 2L22 12L12 22L2 12L12 2Z" fill="#F05032" />
          <circle cx="12" cy="8" r="1.6" fill="#ffffff" />
          <circle cx="12" cy="16" r="1.6" fill="#ffffff" />
          <circle cx="15.5" cy="12" r="1.6" fill="#ffffff" />
          <path d="M12 8v8M12 10.5l3.5 1.5" stroke="#ffffff" strokeWidth="1.5" />
        </svg>
      );
    case "GitHub":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.85.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .27.18.59.69.49A10.27 10.27 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
        </svg>
      );
    case "VS Code":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="#007ACC">
          <path d="M17.5 2L7.5 11.2 3.8 8.3 2 9.4v5.2l1.8 1.1 3.7-2.9L17.5 22 22 19.8V4.2L17.5 2zm0 5.3v9.4L11.2 12l6.3-4.7z" />
        </svg>
      );
    case "Visual Studio":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="#A855F7">
          <path d="M17.2 3L8 11.3 4.2 8.2 2 9.5v5l2.2 1.3L8 12.7 17.2 21 22 18.7V5.3L17.2 3zm.3 5.2v7.6L11.8 12l5.7-3.8z" />
        </svg>
      );
    case "Figma":
      return (
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path d="M8.5 2h3.5v7H8.5a3.5 3.5 0 1 1 0-7z" fill="#F24E1E" />
          <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" fill="#FF7262" />
          <circle cx="15.5" cy="12.5" r="3.5" fill="#1ABCFE" />
          <path d="M8.5 9h3.5v7H8.5a3.5 3.5 0 1 1 0-7z" fill="#A259FF" />
          <path d="M8.5 16h3.5v3.5a3.5 3.5 0 1 1-3.5-3.5z" fill="#0ACF83" />
        </svg>
      );
    default:
      return null;
  }
}

export default function About() {
  const sectionRef = useRef(null);
  const [activeFile, setActiveFile] = useState("About.md");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1]);

  const files = [
    { name: "About.md", index: "01", code: "BIO // PROFILE" },
    { name: "Tech Stack.md", index: "02", code: "SYS // ARSENAL" },
  ];

  const coreFocusItems = [
    "UI/UX Developer",
    "Website Developer",
    "FrontEnd Developer",
    "SEO Analyst",
  ];

  const techStackCategories = [
    {
      index: "01",
      title: "UI/UX Design",
      description:
        "Designing intuitive user interfaces, wireframes, and interactive prototypes with modern design systems.",
      items: ["Canva", "Figma"],
      wide: false,
    },
    {
      index: "02",
      title: "Website Developer",
      description:
        "Building robust web applications and database systems with secure and scalable architecture.",
      items: ["React", "Next.js", "JavaScript", "HTML5/CSS3", "Tailwind CSS", "Supabase"],
      wide: false,
    },
    {
      index: "03",
      title: "Frontend Developer",
      description:
        "Crafting clean, fast, and fully responsive user interfaces using modern CSS frameworks and JS.",
      items: ["React", "Next.js", "JavaScript", "HTML5/CSS3", "Tailwind CSS", "Supabase"],
      wide: false,
    },
    {
      index: "04",
      title: "Performance & Optimization",
      description:
        "Optimizing web assets, structure, and database queries for maximum speed and search visibility.",
      items: ["SEO", "Web Vitals"],
      wide: false,
    },
    {
      index: "05",
      title: "Tools & Development Workflow",
      description:
        "Environments, version control, and design tools used daily to streamline development.",
      items: ["Git", "GitHub", "VS Code", "Visual Studio", "Figma"],
      wide: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const showLanyard = activeFile === "About.md";

  return (
    <motion.section
      ref={sectionRef}
      style={{ scale }}
      className="about-section"
      id="about"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Oswald:wght@500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .about-section {
          --ab-bg-deep: #18050b;
          --ab-bg-console: #210710;
          --ab-bg-panel: rgba(46, 12, 24, 0.56);
          --ab-bg-panel-hover: rgba(64, 17, 33, 0.72);
          --ab-border: rgba(255, 228, 234, 0.18);
          --ab-border-strong: rgba(255, 224, 181, 0.45);
          --ab-text: #fff9fa;
          --ab-text-muted: rgba(255, 232, 238, 0.72);
          --ab-gold: #ffe0b5;
          --ab-rose: #f7a8b8;
          --ab-dark: #2c0813;
          --font-display: 'Oswald', Impact, sans-serif;
          --font-sans: 'Space Grotesk', system-ui, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;

          position: relative;
          z-index: 20;
          width: 100%;
          min-height: 100vh;
          background: radial-gradient(
            circle at 75% 20%,
            #461222 0%,
            #240811 48%,
            #140409 100%
          );
          display: flex;
          align-items: stretch;
          justify-content: stretch;
          padding: 0;
          margin: 0;
          font-family: var(--font-sans);
          color: var(--ab-text);
          box-sizing: border-box;
          box-shadow: 0 -28px 64px rgba(15, 2, 7, 0.65);
          border-top: 1px solid var(--ab-border-strong);
        }

        /* Jendela Utama Telemetry Command Console */
        .terminal-window {
          position: relative;
          z-index: 2;
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        /* Top Bar Berkonsep Telemetry Header (Bukan titik Mac pasaran) */
        .terminal-titlebar {
          background: rgba(20, 4, 10, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 0.75rem 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--ab-border);
          flex-shrink: 0;
        }

        .telemetry-nodes {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .t-node {
          width: 10px;
          height: 10px;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%);
        }

        .t-node-gold { background: var(--ab-gold); }
        .t-node-rose { background: var(--ab-rose); }
        .t-node-live {
          background: #4ade80;
          box-shadow: 0 0 8px rgba(74, 222, 128, 0.7);
        }

        .node-label {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          color: var(--ab-text-muted);
          margin-left: 0.35rem;
          text-transform: uppercase;
        }

        .window-title {
          font-family: var(--font-display);
          font-size: 0.9rem;
          color: var(--ab-gold);
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .window-coord {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--ab-text-muted);
          letter-spacing: 0.08em;
        }

        /* Sub-Bar Breadcrumb Path */
        .terminal-pathbar {
          background: rgba(34, 8, 17, 0.75);
          padding: 0.5rem 1.75rem;
          font-family: var(--font-mono);
          font-size: 0.73rem;
          color: var(--ab-text-muted);
          border-bottom: 1px solid var(--ab-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          flex-shrink: 0;
          flex-wrap: wrap;
        }

        .path-left {
          display: flex;
          align-items: center;
          gap: 0.55rem;
        }

        .path-badge {
          background: rgba(255, 224, 181, 0.12);
          color: var(--ab-gold);
          border: 1px solid rgba(255, 224, 181, 0.35);
          padding: 0.18rem 0.65rem;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%);
          font-weight: 600;
        }

        .path-status {
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          color: var(--ab-rose);
          text-transform: uppercase;
        }

        /* Layout Grid 3 Kolom saat About.md, dan 2 Kolom saat Tech Stack.md */
        .terminal-body {
          display: grid;
          grid-template-columns: 240px 390px minmax(0, 1fr);
          flex: 1;
          min-height: calc(100vh - 82px);
        }

        .terminal-body.no-lanyard {
          grid-template-columns: 240px minmax(0, 1fr);
        }

        /* 1. Kolom Kiri: Explorer Direktori Berkonsep HUD */
        .terminal-sidebar-files {
          background: rgba(24, 5, 12, 0.78);
          border-right: 1px solid var(--ab-border);
          padding: 1.75rem 1.15rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .sidebar-top-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .sidebar-heading {
          font-family: var(--font-display);
          font-size: 0.76rem;
          color: var(--ab-gold);
          letter-spacing: 0.16em;
          font-weight: 700;
          margin-bottom: 0.4rem;
          text-transform: uppercase;
        }

        .file-item {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.18rem;
          padding: 0.7rem 0.9rem;
          background: rgba(255, 255, 255, 0.03);
          color: var(--ab-text-muted);
          border: 1px solid rgba(255, 228, 234, 0.1);
          width: 100%;
          text-align: left;
          font-family: var(--font-mono);
          cursor: pointer;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .file-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .file-item-sub {
          font-size: 0.64rem;
          letter-spacing: 0.1em;
          opacity: 0.65;
        }

        .file-item:hover {
          background: rgba(255, 224, 181, 0.08);
          color: var(--ab-text);
          border-color: var(--ab-border-strong);
          transform: translateX(3px);
        }

        .file-item.active {
          background: linear-gradient(135deg, #fff9fa 0%, var(--ab-gold) 100%);
          color: var(--ab-dark);
          border-color: #ffffff;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
        }

        .file-item.active .file-item-sub {
          color: var(--ab-dark);
          opacity: 0.8;
        }

        /* Kartu Info Kecil di Bawah Sidebar */
        .sidebar-telemetry-box {
          position: relative;
          padding: 0.95rem 1rem;
          background: var(--ab-bg-panel);
          border: 1px solid var(--ab-border);
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--ab-text-muted);
        }

        .sidebar-telemetry-title {
          font-family: var(--font-display);
          font-size: 0.74rem;
          letter-spacing: 0.12em;
          color: var(--ab-gold);
          text-transform: uppercase;
        }

        /* 2. Kolom Tengah: Panggung 3D Lanyard */
        .terminal-sidebar-left {
          background: radial-gradient(
            circle at 50% 38%,
            rgba(247, 168, 184, 0.2) 0%,
            rgba(68, 17, 34, 0.45) 58%,
            rgba(22, 4, 10, 0.85) 100%
          );
          border-right: 1px solid var(--ab-border);
          position: relative;
          width: 100%;
          min-height: calc(100vh - 82px);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          cursor: grab;
        }

        .terminal-sidebar-left:active {
          cursor: grabbing;
        }

        /* Grid halus di belakang Lanyard 3D */
        .lanyard-stage-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 3.2rem 3.2rem;
          pointer-events: none;
        }

        .lanyard-badge-hint {
          position: absolute;
          bottom: 1.25rem;
          left: 50%;
          transform: translateX(-50%);
          padding: 0.35rem 0.85rem;
          background: rgba(24, 5, 12, 0.75);
          border: 1px solid var(--ab-border);
          backdrop-filter: blur(8px);
          font-family: var(--font-mono);
          font-size: 0.66rem;
          letter-spacing: 0.12em;
          color: var(--ab-gold);
          text-transform: uppercase;
          white-space: nowrap;
          pointer-events: none;
        }

        /* 3. Kolom Kanan: Konten Utama About & Tech Stack */
        .terminal-content {
          position: relative;
          padding: 2.5rem 3rem 3.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          justify-content: flex-start;
          align-items: flex-start;
          box-sizing: border-box;
          background-image: radial-gradient(
            rgba(255, 224, 181, 0.08) 1px,
            transparent 1px
          );
          background-size: 24px 24px;
        }

        .terminal-content.tech-stack-mode {
          padding: 2.25rem 2.75rem 3rem;
          gap: 1.35rem;
        }

        .section-kicker {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3rem 0.75rem;
          background: var(--ab-bg-panel);
          border: 1px solid var(--ab-border);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--ab-gold);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .main-headline {
          font-family: var(--font-display);
          font-size: clamp(1.85rem, 2.8vw, 2.75rem);
          font-weight: 700;
          line-height: 1.08;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          margin: 0;
          color: var(--ab-text);
          max-width: 26ch;
        }

        .headline-accent {
          color: var(--ab-gold);
        }

        /* Kartu Bio Berbingkai Siku L-Bracket */
        .bio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.25rem;
          width: 100%;
        }

        .bio-card {
          position: relative;
          padding: 1.35rem 1.5rem;
          background: var(--ab-bg-panel);
          border: 1px solid var(--ab-border);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 4px;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .bio-card:hover {
          transform: translateY(-3px);
          border-color: var(--ab-border-strong);
        }

        /* Ornamen Siku L-Bracket khas Home & Navbar */
        .b-corner {
          position: absolute;
          width: 8px;
          height: 8px;
          border: 1.5px solid var(--ab-gold);
          pointer-events: none;
          transition: width 0.25s ease, height 0.25s ease;
        }

        .bio-card:hover .b-corner,
        .tech-card:hover .b-corner {
          width: 12px;
          height: 12px;
        }

        .tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
        .tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
        .bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
        .br { bottom: -1px; right: -1px; border-left: none; border-top: none; }

        .bio-card-index {
          font-family: var(--font-display);
          font-size: 0.75rem;
          letter-spacing: 0.14em;
          color: var(--ab-gold);
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          display: block;
        }

        .bio-paragraph {
          font-size: 0.92rem;
          line-height: 1.72;
          color: var(--ab-text-muted);
          margin: 0;
        }

        .bio-paragraph strong {
          color: var(--ab-text);
          font-weight: 700;
        }

        .about-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(
            90deg,
            var(--ab-border-strong),
            var(--ab-border),
            transparent
          );
          margin: 0.25rem 0;
        }

        /* Core Focus Badges */
        .core-focus-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
        }

        .core-focus-label {
          font-family: var(--font-display);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--ab-gold);
          text-transform: uppercase;
        }

        .core-focus-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
          width: 100%;
        }

        .focus-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--ab-text);
          background: var(--ab-bg-panel);
          border: 1px solid var(--ab-border);
          padding: 0.55rem 1rem;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: default;
        }

        .focus-badge-num {
          font-family: var(--font-display);
          font-size: 0.75rem;
          color: var(--ab-gold);
        }

        .focus-badge:hover {
          background: linear-gradient(135deg, #fff9fa 0%, var(--ab-gold) 100%);
          color: var(--ab-dark);
          border-color: #ffffff;
        }

        .focus-badge:hover .focus-badge-num {
          color: var(--ab-dark);
        }

        /* Grid & Kartu Tech Stack.md */
        .tech-stack-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.15rem;
          width: 100%;
        }

        .tech-card {
          position: relative;
          background: var(--ab-bg-panel);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid var(--ab-border);
          border-radius: 4px;
          padding: 1.35rem 1.4rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.1rem;
          box-shadow: 0 14px 32px rgba(15, 2, 7, 0.28);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                      background 0.25s ease,
                      border-color 0.25s ease;
        }

        .tech-card:hover {
          transform: translateY(-4px);
          background: var(--ab-bg-panel-hover);
          border-color: var(--ab-border-strong);
        }

        .tech-card.span-two {
          grid-column: span 2;
        }

        .tech-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.45rem;
        }

        .tech-card-idx {
          font-family: var(--font-display);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--ab-gold);
        }

        .tech-card-count {
          font-family: var(--font-mono);
          font-size: 0.66rem;
          color: var(--ab-text-muted);
          padding: 0.12rem 0.45rem;
          border: 1px solid var(--ab-border);
        }

        .tech-card-title {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--ab-text);
          margin: 0 0 0.4rem 0;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .tech-card-desc {
          font-size: 0.84rem;
          line-height: 1.6;
          color: var(--ab-text-muted);
          margin: 0;
        }

        .tech-badges-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .tech-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: var(--font-mono);
          font-size: 0.73rem;
          font-weight: 500;
          color: var(--ab-text);
          background: rgba(20, 4, 10, 0.65);
          border: 1px solid var(--ab-border);
          padding: 0.35rem 0.7rem;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%);
          transition: all 0.2s ease;
        }

        .tech-pill:hover {
          background: rgba(255, 224, 181, 0.16);
          border-color: var(--ab-gold);
          color: var(--ab-gold);
          transform: translateY(-2px);
        }

        @media (max-width: 1100px) {
          .tech-stack-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .tech-card.span-two {
            grid-column: span 2;
          }
        }

        @media (max-width: 1024px) {
          .terminal-body,
          .terminal-body.no-lanyard {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .terminal-sidebar-files {
            flex-direction: row;
            overflow-x: auto;
            border-right: none;
            border-bottom: 1px solid var(--ab-border);
            padding: 1rem 1.25rem;
            align-items: center;
          }
          .sidebar-top-group {
            flex-direction: row;
            width: 100%;
          }
          .sidebar-heading,
          .sidebar-telemetry-box,
          .window-coord {
            display: none;
          }
          .file-item {
            width: auto;
            min-width: 160px;
          }
          .terminal-sidebar-left {
            min-height: 390px;
            border-right: none;
            border-bottom: 1px solid var(--ab-border);
          }
          .terminal-content,
          .terminal-content.tech-stack-mode {
            padding: 1.75rem 1.5rem 2.75rem;
          }
          .tech-stack-grid {
            grid-template-columns: 1fr;
          }
          .tech-card.span-two {
            grid-column: span 1;
          }
        }
      `}</style>

      <div className="terminal-window">
        {/* Top Telemetry Bar */}
        <div className="terminal-titlebar">
          <div className="telemetry-nodes">
            <span className="t-node t-node-gold" />
            <span className="t-node t-node-rose" />
            <span className="t-node t-node-live" />
            <span className="node-label">SYS.ONLINE</span>
          </div>
          <span className="window-title">
            TELEMETRY ARCHIVE // {activeFile.toUpperCase()}
          </span>
          <span className="window-coord">SEASON 2026 · IDN</span>
        </div>

        {/* Path Breadcrumb Bar */}
        <div className="terminal-pathbar">
          <div className="path-left">
            <span>DIRECTORY:</span>
            <span className="path-badge">
              root://nikmatus.dev/about_me/{activeFile}
            </span>
          </div>
          <span className="path-status">● INTERACTIVE MODULE READY</span>
        </div>

        {/* Body Layout */}
        <div className={`terminal-body ${!showLanyard ? "no-lanyard" : ""}`}>
          {/* 1. Sidebar File Selector */}
          <div className="terminal-sidebar-files">
            <div className="sidebar-top-group">
              <span className="sidebar-heading">MODULES // 02</span>
              {files.map((fileObj) => (
                <button
                  key={fileObj.name}
                  type="button"
                  onClick={() => setActiveFile(fileObj.name)}
                  className={`file-item ${
                    activeFile === fileObj.name ? "active" : ""
                  }`}
                >
                  <div className="file-item-row">
                    <span>{fileObj.name}</span>
                    <span>/{fileObj.index}</span>
                  </div>
                  <span className="file-item-sub">{fileObj.code}</span>
                </button>
              ))}
            </div>

            <div className="sidebar-telemetry-box">
              <span className="b-corner tl" />
              <span className="b-corner br" />
              <span className="sidebar-telemetry-title">DRIVER SPEC</span>
              <span>EDU: SMKN 6 MALANG</span>
              <span>ROLE: FRONTEND &amp; UI/UX</span>
              <span>STATUS: AVAILABLE</span>
            </div>
          </div>

          {/* 2. 3D Lanyard Interactive Stage */}
          {showLanyard && (
            <div className="terminal-sidebar-left">
              <div className="lanyard-stage-grid" aria-hidden="true" />
              <Suspense
                fallback={
                  <div
                    style={{
                      color: "var(--ab-gold)",
                      fontSize: "0.82rem",
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Memuat Lanyard 3D...
                  </div>
                }
              >
                <Lanyard position={[0, 10, 20]} fov={18} />
              </Suspense>
              <div className="lanyard-badge-hint">
                DRAG PASS // 3D INTERACTIVE LANYARD
              </div>
            </div>
          )}

          {/* 3. Main Content Panel */}
          <motion.div
            key={activeFile}
            className={`terminal-content ${
              activeFile === "Tech Stack.md" ? "tech-stack-mode" : ""
            }`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {activeFile === "About.md" && (
              <>
                <motion.div className="section-kicker" variants={itemVariants}>
                  <span>DRIVER DOSSIER // 01 — ENGINEERING &amp; DESIGN</span>
                </motion.div>

                <motion.h2 className="main-headline" variants={itemVariants}>
                  Combining frontend engineering principles with a{" "}
                  <span className="headline-accent">
                    modern, intuitive UI/UX
                  </span>{" "}
                  design approach.
                </motion.h2>

                <motion.div className="bio-grid" variants={itemVariants}>
                  <div className="bio-card">
                    <span className="b-corner tl" />
                    <span className="b-corner tr" />
                    <span className="b-corner bl" />
                    <span className="b-corner br" />
                    <span className="bio-card-index">
                      01 // FOUNDATION &amp; PHILOSOPHY
                    </span>
                    <p className="bio-paragraph">
                      With a Software Engineering background from{" "}
                      <strong>SMK Negeri 6 Malang</strong>, I am accustomed to
                      building web applications <strong>end-to-end</strong>. My
                      philosophy is straightforward: a digital product should be
                      intuitive, responsive, and deliver user-oriented
                      solutions.
                    </p>
                  </div>

                  <div className="bio-card">
                    <span className="b-corner tl" />
                    <span className="b-corner tr" />
                    <span className="b-corner bl" />
                    <span className="b-corner br" />
                    <span className="bio-card-index">
                      02 // EXECUTION &amp; SCALABILITY
                    </span>
                    <p className="bio-paragraph">
                      Beyond coding with <strong>Next.js and React</strong>, I
                      focus on designing interfaces in Figma, optimizing{" "}
                      <strong>website SEO and performance</strong>, and building
                      scalable systems for corporate and enterprise needs.
                    </p>
                  </div>
                </motion.div>

                <motion.div className="about-divider" variants={itemVariants} />

                <motion.div
                  className="core-focus-wrapper"
                  variants={itemVariants}
                >
                  <span className="core-focus-label">
                    CORE FOCUS &amp; SPECIALIZATIONS
                  </span>
                  <div className="core-focus-list">
                    {coreFocusItems.map((item, index) => (
                      <motion.span
                        key={index}
                        className="focus-badge"
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span className="focus-badge-num">0{index + 1}</span>
                        <span>{item}</span>
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </>
            )}

            {activeFile === "Tech Stack.md" && (
              <>
                <motion.div className="section-kicker" variants={itemVariants}>
                  <span>SYSTEM ARSENAL // 02 — TECH STACK MATRIX</span>
                </motion.div>

                <motion.h2 className="main-headline" variants={itemVariants}>
                  Technical Stack &amp;{" "}
                  <span className="headline-accent">Specializations</span>
                </motion.h2>

                <motion.div
                  className="tech-stack-grid"
                  variants={itemVariants}
                >
                  {techStackCategories.map((category) => (
                    <motion.div
                      key={category.title}
                      className={`tech-card ${
                        category.wide ? "span-two" : ""
                      }`}
                      variants={itemVariants}
                    >
                      <span className="b-corner tl" />
                      <span className="b-corner tr" />
                      <span className="b-corner bl" />
                      <span className="b-corner br" />

                      <div>
                        <div className="tech-card-head">
                          <span className="tech-card-idx">
                            MODULE // {category.index}
                          </span>
                          <span className="tech-card-count">
                            {category.items.length} TOOLS
                          </span>
                        </div>
                        <h3 className="tech-card-title">{category.title}</h3>
                        <p className="tech-card-desc">{category.description}</p>
                      </div>

                      <div className="tech-badges-wrap">
                        {category.items.map((tech) => (
                          <span key={tech} className="tech-pill">
                            <TechIcon name={tech} />
                            <span>{tech}</span>
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}