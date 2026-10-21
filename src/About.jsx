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

  const files = ["About.md", "Tech Stack.md"];

  const coreFocusItems = [
    "UI/UX Developer",
    "Website Developer",
    "FrontEnd Developer",
    "SEO Analyst",
  ];

  const techStackCategories = [
    {
      title: "UI/UX Design",
      description:
        "Designing intuitive user interfaces, wireframes, and interactive prototypes with modern design systems.",
      items: ["Canva", "Figma"],
      wide: false,
    },
    {
      title: "Website Developer",
      description:
        "Building robust web applications and database systems with secure and scalable architecture.",
      items: ["React", "Next.js", "JavaScript", "HTML5/CSS3", "Tailwind CSS", "Supabase"],
      wide: false,
    },
    {
      title: "Frontend Developer",
      description:
        "Crafting clean, fast, and fully responsive user interfaces using modern CSS frameworks and JS.",
      items: ["React", "Next.js", "JavaScript", "HTML5/CSS3", "Tailwind CSS", "Supabase"],
      wide: false,
    },
    {
      title: "Performance & Optimization",
      description:
        "Optimizing web assets, structure, and database queries for maximum speed and search visibility.",
      items: ["SEO", "Web Vitals"],
      wide: false,
    },
    {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
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
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');

        .about-section {
          position: relative;
          z-index: 20;
          width: 100%;
          min-height: 100vh;
          background: #090d16;
          display: flex;
          align-items: stretch;
          justify-content: stretch;
          padding: 0;
          margin: 0;
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          color: #1e293b;
          box-sizing: border-box;
          box-shadow: 0 -25px 60px rgba(0, 0, 0, 0.5);
        }

        /* Jendela Utama Code Editor Fleksibel (Min 100vh, Bisa Memanjang Jika Konten Banyak) */
        .terminal-window {
          position: relative;
          z-index: 2;
          width: 100%;
          min-height: 100vh;
          background: #f8fafc;
          border-radius: 0;
          border: none;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .terminal-titlebar {
          background: #e2e8f0;
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #cbd5e1;
          flex-shrink: 0;
        }

        .window-dots {
          display: flex;
          gap: 0.35rem;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .dot-red { background: #ef4444; }
        .dot-yellow { background: #f59e0b; }
        .dot-green { background: #10b981; }

        .window-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: #475569;
          font-weight: 600;
        }

        .terminal-pathbar {
          background: #ffffff;
          padding: 0.4rem 1rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: #64748b;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .path-badge {
          background: #0f172a;
          color: #38bdf8;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }

        /* Layout Grid 3 Kolom saat About.md, dan 2 Kolom saat Tech Stack.md */
        .terminal-body {
          display: grid;
          grid-template-columns: 220px 380px minmax(0, 1fr);
          background: #ffffff;
          flex: 1;
          min-height: calc(100vh - 68px);
        }

        .terminal-body.no-lanyard {
          grid-template-columns: 220px minmax(0, 1fr);
        }

        .terminal-sidebar-files {
          background: #f1f5f9;
          border-right: 1px solid #cbd5e1;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .sidebar-heading {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: #94a3b8;
          letter-spacing: 0.1em;
          font-weight: 700;
          margin-bottom: 0.35rem;
        }

        .file-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: transparent;
          color: #64748b;
          border: none;
          width: 100%;
          text-align: left;
          border-radius: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .file-item:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .file-item.active {
          background: #e2e8f0;
          color: #0f172a;
          font-weight: 600;
        }

        .terminal-sidebar-left {
          background: #ffffff;
          border-right: 1px solid #cbd5e1;
          position: relative;
          width: 100%;
          min-height: calc(100vh - 68px);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          cursor: grab;
        }

        .terminal-sidebar-left:active {
          cursor: grabbing;
        }

        /* Konten utama tidak lagi memotong kartu di bagian bawah */
        .terminal-content {
          padding: 2rem 3rem 3rem 3rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          justify-content: flex-start;
          align-items: flex-start;
          box-sizing: border-box;
        }

        .terminal-content.tech-stack-mode {
          background-color: #07090e;
          background-image: radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px);
          background-size: 20px 20px;
          color: #f8fafc;
          justify-content: flex-start;
          align-items: flex-start;
          padding: 1.5rem 2.5rem 2.5rem 2.5rem;
          gap: 1rem;
        }

        .code-comment {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          color: #64748b;
          margin: 0;
        }

        .main-headline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.5rem, 2vw, 2.1rem);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.03em;
          margin: 0;
          color: #0f172a;
        }

        .tech-stack-mode .main-headline {
          color: #ffffff;
          margin-bottom: 0.15rem;
        }

        .bio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.2rem 1.5rem;
          width: 100%;
        }

        .bio-paragraph {
          font-size: 0.92rem;
          line-height: 1.7;
          color: #334155;
          margin: 0;
        }

        .bio-paragraph strong {
          color: #0f172a;
          font-weight: 600;
        }

        .about-divider {
          width: 100%;
          height: 1px;
          background: #cbd5e1;
          margin: 0.2rem 0;
        }

        .core-focus-wrapper {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem 1rem;
          width: 100%;
        }

        .core-focus-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: #64748b;
          flex-shrink: 0;
        }

        .core-focus-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          flex: 1;
        }

        .focus-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          font-weight: 500;
          color: #0f172a;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .focus-badge:hover {
          transform: translateY(-2px);
          background: #e2e8f0;
          border-color: #94a3b8;
        }

        /* Grid & Kartu Tech Stack.md yang sudah dioptimasi ukurannya */
        .tech-stack-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
          width: 100%;
        }

        .tech-card {
          background: rgba(13, 17, 26, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.15rem 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 0.95rem;
          transition: transform 0.22s ease, border-color 0.22s ease;
        }

        .tech-card:hover {
          transform: translateY(-3px);
          border-color: rgba(255, 255, 255, 0.22);
        }

        .tech-card.span-two {
          grid-column: span 2;
        }

        .tech-card-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.35rem 0;
          letter-spacing: -0.02em;
        }

        .tech-card-desc {
          font-size: 0.82rem;
          line-height: 1.55;
          color: #94a3b8;
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
          gap: 0.4rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.73rem;
          font-weight: 500;
          color: #e2e8f0;
          background: #141923;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.3rem 0.65rem;
          border-radius: 6px;
          transition: all 0.18s ease;
        }

        .tech-pill:hover {
          background: #1e2636;
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
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
            border-bottom: 1px solid #cbd5e1;
            padding: 0.75rem 1rem;
            align-items: center;
          }
          .sidebar-heading {
            display: none;
          }
          .file-item {
            width: auto;
            white-space: nowrap;
          }
          .terminal-sidebar-left {
            min-height: 360px;
            border-right: none;
            border-bottom: 1px solid #cbd5e1;
          }
          .terminal-content,
          .terminal-content.tech-stack-mode {
            padding: 1.5rem 1.5rem 2.5rem 1.5rem;
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
        <div className="terminal-titlebar">
          <div className="window-dots">
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
          </div>
          <span className="window-title">
            ABOUT_ME - {activeFile.toUpperCase()}
          </span>
          <div style={{ width: "40px" }}></div>
        </div>

        <div className="terminal-pathbar">
          <span>Path:</span>
          <span className="path-badge">
            C:/portfolio/about_me/{activeFile}
          </span>
        </div>

        <div className={`terminal-body ${!showLanyard ? "no-lanyard" : ""}`}>
          <div className="terminal-sidebar-files">
            <span className="sidebar-heading">DIRECTORIES</span>
            {files.map((fileName) => (
              <button
                key={fileName}
                type="button"
                onClick={() => setActiveFile(fileName)}
                className={`file-item ${
                  activeFile === fileName ? "active" : ""
                }`}
              >
                <span>📁</span> {fileName}
              </button>
            ))}
          </div>

          {showLanyard && (
            <div className="terminal-sidebar-left">
              <Suspense
                fallback={
                  <div
                    style={{
                      color: "#94a3b8",
                      fontSize: "0.85rem",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    Memuat Lanyard 3D...
                  </div>
                }
              >
                <Lanyard position={[0, 10, 20]} fov={18} />
              </Suspense>
            </div>
          )}

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

                <motion.h2 className="main-headline" variants={itemVariants}>
                  Combining frontend engineering principles with a modern,
                  intuitive UI/UX design approach.
                </motion.h2>

                <motion.div className="bio-grid" variants={itemVariants}>
                  <p className="bio-paragraph">
                    With a Software Engineering background from{" "}
                    <strong>SMK Negeri 6 Malang</strong>, I am accustomed
                    to building web applications <strong>end-to-end</strong>. My
                    philosophy is straightforward: a digital product should be
                    intuitive, responsive, and deliver user-oriented solutions.
                  </p>

                  <p className="bio-paragraph">
                    Beyond coding with <strong>Next.js and React</strong>, I focus on
                    designing interfaces in Figma, optimizing{" "}
                    <strong>website SEO and performance</strong>, and building
                    scalable systems for corporate and enterprise needs.
                  </p>
                </motion.div>

                <motion.div className="about-divider" variants={itemVariants} />

                <motion.div
                  className="core-focus-wrapper"
                  variants={itemVariants}
                >
                  <span className="core-focus-label">CORE FOCUS:</span>
                  <div className="core-focus-list">
                    {coreFocusItems.map((item, index) => (
                      <motion.span
                        key={index}
                        className="focus-badge"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </>
            )}

            {activeFile === "Tech Stack.md" && (
              <>
                <motion.h2 className="main-headline" variants={itemVariants}>
                  Technical Stack &amp; Specializations
                </motion.h2>

                <motion.div className="tech-stack-grid" variants={itemVariants}>
                  {techStackCategories.map((category) => (
                    <motion.div
                      key={category.title}
                      className={`tech-card ${
                        category.wide ? "span-two" : ""
                      }`}
                      variants={itemVariants}
                    >
                      <div>
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