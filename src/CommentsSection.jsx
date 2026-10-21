import React, { Suspense, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Lanyard from "./components/Lanyard/Lanyard";

export default function About() {
  const sectionRef = useRef(null);

  // Mendeteksi posisi scroll saat halaman About mulai masuk dari bawah layar
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  // Efek transisi saat menumpuk halaman sebelumnya
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["24px", "0px"]);

  const coreFocusItems = [
    "Full-Stack Development",
    "UI/UX Engineering",
    "System Optimization",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      style={{
        scale,
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
      }}
      className="about-section"
      id="about"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');

        .about-section {
          position: relative;
          z-index: 20;
          width: 100vw;
          min-height: 100vh;
          background: #090d16;
          display: flex;
          align-items: stretch;
          justify-content: stretch;
          padding: 0; /* Menghilangkan padding luar agar benar-benar full layar */
          margin: 0;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          color: #1e293b;
          box-sizing: border-box;
          box-shadow: 0 -25px 60px rgba(0, 0, 0, 0.4);
          transform-origin: top center;
          will-change: transform, border-radius;
        }

        /* Jendela Utama ala Code Editor FULL LAYAR 100% */
        .terminal-window {
          position: relative;
          z-index: 2;
          width: 100vw;
          height: 100vh;
          background: #f8fafc;
          border-radius: 0;
          border: none;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        /* Title Bar ala Window / CMD */
        .terminal-titlebar {
          background: #e2e8f0;
          padding: 0.6rem 1rem;
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
          letter-spacing: 0.05em;
        }

        /* Path Bar */
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

        /* Body Utama Full Layar: Dibagi Sidebar Direktori, Lanyard Kiri, & Konten Kanan */
        .terminal-body {
          display: grid;
          grid-template-columns: 240px 380px minmax(0, 1fr);
          background: #ffffff;
          flex: 1;
          height: calc(100vh - 75px);
          overflow: hidden;
        }

        /* 1. Sidebar Direktori (Mirip Referensi Gambar) */
        .terminal-sidebar-files {
          background: #f1f5f9;
          border-right: 1px solid #cbd5e1;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          box-sizing: border-box;
        }

        .sidebar-heading {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: #94a3b8;
          letter-spacing: 0.1em;
          font-weight: 700;
        }

        .file-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: #e2e8f0;
          color: #0f172a;
          border-radius: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          font-weight: 500;
        }

        /* 2. Kolom Lanyard di Sebelah Kiri Konten */
        .terminal-sidebar-left {
          background: #0f172a;
          border-right: 1px solid #cbd5e1;
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          cursor: grab;
        }

        .terminal-sidebar-left:active {
          cursor: grabbing;
        }

        /* 3. Kolom Konten Teks Sebelah Kanan */
        .terminal-content {
          padding: 2.5rem 4rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          justify-content: center;
          overflow-y: auto;
          height: 100%;
          box-sizing: border-box;
        }

        .code-comment {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          color: #64748b;
          margin: 0;
        }

        .main-headline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.7rem, 2.2vw, 2.3rem);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.03em;
          margin: 0;
          color: #0f172a;
        }

        .bio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem 1.75rem;
          width: 100%;
        }

        .bio-paragraph {
          font-size: 0.93rem;
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
          transform-origin: left;
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

        @media (max-width: 1024px) {
          .terminal-body {
            grid-template-columns: 1fr;
            height: auto;
          }
          .terminal-sidebar-files, .terminal-sidebar-left {
            display: none;
          }
          .terminal-content {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>

      {/* Jendela Utama Full Layar 100% */}
      <div className="terminal-window">
        {/* Title Bar */}
        <div className="terminal-titlebar">
          <div className="window-dots">
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
          </div>
          <span className="window-title">ABOUT_ME.EXE - BIO.MD</span>
          <div style={{ width: "40px" }}></div>
        </div>

        {/* Path Bar */}
        <div className="terminal-pathbar">
          <span>Path:</span>
          <span className="path-badge">C:/portfolio/about_me/bio.md</span>
        </div>

        {/* Layout Grid 3 Kolom Full Layar */}
        <div className="terminal-body">
          {/* Kolom 1: Direktori File ala VS Code / Editor */}
          <div className="terminal-sidebar-files">
            <span className="sidebar-heading">DIRECTORIES</span>
            <div className="file-item">
              <span>📁</span> bio.md
            </div>
            <div className="file-item" style={{ background: "transparent", color: "#64748b" }}>
              <span>📁</span> education.md
            </div>
            <div className="file-item" style={{ background: "transparent", color: "#64748b" }}>
              <span>📁</span> location.md
            </div>
          </div>

          {/* Kolom 2: Lanyard 3D di Sebelah Kiri */}
          <div className="terminal-sidebar-left">
            <Suspense
              fallback={
                <div style={{ color: "#94a3b8", fontSize: "0.85rem", fontFamily: "JetBrains Mono, monospace" }}>
                  Memuat Lanyard 3D...
                </div>
              }
            >
              <Lanyard position={[0, -1.8, 30]} fov={18} />
            </Suspense>
          </div>

          {/* Kolom 3: Konten Teks Utama di Sebelah Kanan */}
          <motion.div
            className="terminal-content"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            <motion.p className="code-comment" variants={itemVariants}>
              // ACTIVE FILE: BIO.MD
            </motion.p>

            <motion.h2 className="main-headline" variants={itemVariants}>
              Combining software engineering principles with a clean, minimalist design approach.
            </motion.h2>

            <motion.div className="bio-grid" variants={itemVariants}>
              <p className="bio-paragraph">
                As an Informatics Engineering student at{" "}
                <strong>Universitas Sebelas April</strong>, I am accustomed to
                building systems <strong>end-to-end</strong>. My philosophy is
                straightforward: a digital product should be intuitive, fast, and
                deliver practical solutions to users.
              </p>

              <p className="bio-paragraph">
                Beyond coding, I focus on exploring modern web technologies,
                optimizing development workflows, and building tools that support
                local businesses and <strong>open-source initiatives</strong>.
              </p>
            </motion.div>

            <motion.div
              className="about-divider"
              variants={{
                hidden: { scaleX: 0, opacity: 0 },
                visible: {
                  scaleX: 1,
                  opacity: 1,
                  transition: { duration: 0.8, ease: "easeInOut" },
                },
              }}
            />

            <motion.div className="core-focus-wrapper" variants={itemVariants}>
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
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}