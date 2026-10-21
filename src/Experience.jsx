import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

// Fallback SVG bersih jika file gambar lokal di folder public/ belum dipasang
const createPlaceholderSvg = (label) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#090d16" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#bg)" />
      <circle cx="400" cy="250" r="180" fill="rgba(56, 189, 248, 0.06)" />
      <rect x="280" y="215" width="240" height="70" rx="10" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(56, 189, 248, 0.35)" stroke-width="1.5" />
      <text x="400" y="256" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="16" font-weight="bold" letter-spacing="3">${label}</text>
    </svg>
  `)}`;

const projectsData = [
  {
    id: "01",
    category: "NEXT.JS",
    specRight: "NEXT.JS",
    title: "Company Profile",
    description:
      "An interactive showcase website for a manufacturing company specializing in CNC machining, laser cutting, and 3D printing. Built with 3D visuals, scroll-driven animation, and storytelling to showcase capabilities.",
    tech: ["NEXT.JS", "JavaScript", "REACT THREE FIBER"],
    liveUrl: "https://infimech.tech/home",
    repoUrl: "https://infimech.tech/home",
    image: "/images/infimech.png", // Ganti dengan path gambar Anda di folder public/
    fallbackImage: createPlaceholderSvg("INFIMECH PREVIEW"),
    accent: "#38bdf8",
  },
  {
    id: "02",
    category: "LARAVEL",
    specRight: "LARAVEL / PHP",
    title: "Nexus Enterprise Resource & Inventory System",
    description:
      "End-to-end web application for real-time inventory tracking, multi-warehouse stock synchronization, and automated financial reporting built with a secure and scalable relational database architecture.",
    tech: ["LARAVEL", "PHP", "MYSQL", "TAILWIND CSS"],
    liveUrl: "https://github.com",
    repoUrl: "https://github.com",
    image: "/images/nexus-erp.png",
    fallbackImage: createPlaceholderSvg("NEXUS ERP PREVIEW"),
    accent: "#38bdf8",
  },
  {
    id: "03",
    category: "RUST & TAURI",
    specRight: "RUST / TAURI",
    title: "RustGuard Cross-Platform System & DB Inspector",
    description:
      "High-performance desktop application engineered with Rust and Tauri for monitoring local database queries, inspecting memory telemetry, and streamlining daily development workflows.",
    tech: ["RUST", "TAURI", "TYPESCRIPT", "SUPABASE"],
    liveUrl: "https://github.com",
    repoUrl: "https://github.com",
    image: "/images/rustguard.png",
    fallbackImage: createPlaceholderSvg("RUSTGUARD PREVIEW"),
    accent: "#38bdf8",
  },
  {
    id: "04",
    category: "FRONTEND & SEO",
    specRight: "UI/UX & SEO",
    title: "VitalsPulse Automated SEO & Web Performance Suite",
    description:
      "Comprehensive web performance analyzer that audits DOM structure, asset compression, and Core Web Vitals metrics to maximize search engine visibility and page speed.",
    tech: ["JAVASCRIPT", "TAILWIND CSS", "WEB VITALS", "SEO"],
    liveUrl: "https://github.com",
    repoUrl: "https://github.com",
    image: "/images/vitalspulse.png",
    fallbackImage: createPlaceholderSvg("VITALS PULSE PREVIEW"),
    accent: "#38bdf8",
  },
];

export default function Project() {
  const sectionRef = useRef(null);
  const bodyRef = useRef(null);
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [pinState, setPinState] = useState("top"); // "top" | "fixed" | "bottom"

  // MotionValue untuk posisi scroll proyek (tanpa re-render berlebih)
  const scrollProgress = useMotionValue(0);
  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.25,
  });

  const x = useTransform(smoothProgress, [0, 1], [0, -maxTranslate]);

  // MotionValue khusus indikator bulat SCROLL agar 100% GPU-accelerated & bebas lag
  const cursorX = useMotionValue(680);
  const cursorY = useMotionValue(70);
  const smoothCursorX = useSpring(cursorX, {
    stiffness: 650,
    damping: 38,
    mass: 0.12,
  });
  const smoothCursorY = useSpring(cursorY, {
    stiffness: 650,
    damping: 38,
    mass: 0.12,
  });

  // Mengukur ukuran kartu hanya saat mount & resize
  useEffect(() => {
    const measureTrack = () => {
      if (trackRef.current && wrapperRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const visibleWidth = wrapperRef.current.clientWidth;
        setMaxTranslate(Math.max(0, trackWidth - visibleWidth));
      }
      if (bodyRef.current) {
        const rect = bodyRef.current.getBoundingClientRect();
        cursorX.set(rect.width * 0.65 - 34);
        cursorY.set(rect.height * 0.14 - 34);
      }
    };

    measureTrack();
    window.addEventListener("resize", measureTrack);
    return () => window.removeEventListener("resize", measureTrack);
  }, [cursorX, cursorY]);

  // Listener scroll ringan
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollableDistance = Math.max(1, rect.height - vh);

      if (rect.top > 0) {
        setPinState((prev) => (prev === "top" ? prev : "top"));
        scrollProgress.set(0);
        setActiveIndex((prev) => (prev === 0 ? prev : 0));
      } else if (rect.bottom >= vh) {
        setPinState((prev) => (prev === "fixed" ? prev : "fixed"));
        const progress = Math.max(
          0,
          Math.min(1, -rect.top / scrollableDistance)
        );
        scrollProgress.set(progress);
        const idx = Math.max(
          0,
          Math.min(
            projectsData.length - 1,
            Math.round(progress * (projectsData.length - 1))
          )
        );
        setActiveIndex((prev) => (prev === idx ? prev : idx));
      } else {
        const lastIdx = projectsData.length - 1;
        setPinState((prev) => (prev === "bottom" ? prev : "bottom"));
        scrollProgress.set(1);
        setActiveIndex((prev) => (prev === lastIdx ? prev : lastIdx));
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollProgress]);

  const scrollToSlide = (index) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const scrollableDistance = Math.max(
      1,
      sectionRef.current.offsetHeight - window.innerHeight
    );
    const targetY =
      sectionTop +
      (index / Math.max(1, projectsData.length - 1)) * scrollableDistance;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  const onMouseMove = (e) => {
    if (!bodyRef.current) return;
    const rect = bodyRef.current.getBoundingClientRect();
    const nextX = Math.max(
      10,
      Math.min(rect.width - 78, e.clientX - rect.left - 34)
    );
    const nextY = Math.max(
      10,
      Math.min(rect.height - 78, e.clientY - rect.top - 34)
    );
    cursorX.set(nextX);
    cursorY.set(nextY);
  };

  const onMouseLeave = () => {
    if (!bodyRef.current) return;
    const rect = bodyRef.current.getBoundingClientRect();
    cursorX.set(rect.width * 0.65 - 34);
    cursorY.set(rect.height * 0.14 - 34);
  };

  const progressRatio = ((activeIndex + 1) / projectsData.length) * 100;

  return (
    <section
      ref={sectionRef}
      className="project-scroll-section"
      id="projects"
      style={{ height: `${projectsData.length * 100}vh` }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');

        .project-scroll-section {
          position: relative;
          z-index: 20;
          width: 100%;
          background: #07090e;
          margin: 0;
          padding: 0;
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          color: #f8fafc;
          box-sizing: border-box;
        }

        .project-terminal-window {
          width: 100%;
          height: 100vh;
          background: #07090e;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          overflow: hidden;
          z-index: 25;
        }

        .project-terminal-window.pin-top {
          position: absolute;
          top: 0;
          left: 0;
        }

        .project-terminal-window.pin-fixed {
          position: fixed;
          top: 0;
          left: 0;
        }

        .project-terminal-window.pin-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
        }

        .project-body {
          flex: 1;
          min-height: 0;
          height: 100vh;
          background-color: #07090e;
          background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          padding: 1.5rem 3.25rem 1.4rem 3.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1rem;
          box-sizing: border-box;
          overflow: hidden;
          position: relative;
        }

        .project-header-area {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          flex-shrink: 0;
          position: relative;
        }

        .project-top-index {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.76rem;
          letter-spacing: 0.2em;
        }

        .index-accent {
          color: #38bdf8;
          font-weight: 700;
        }

        .index-text {
          color: #94a3b8;
          font-weight: 500;
        }

        .index-line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
          margin-left: 0.5rem;
        }

        .project-heading-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .project-main-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 3.4vw, 3.15rem);
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.035em;
          line-height: 1.05;
          margin: 0;
        }

        .project-right-desc {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          line-height: 1.55;
          color: #94a3b8;
          max-width: 430px;
          margin: 0;
        }

        .drag-circle-indicator {
          position: absolute;
          top: 0;
          left: 0;
          width: 68px;
          height: 68px;
          border-radius: 50%;
          border: 1px solid rgba(56, 189, 248, 0.8);
          background: rgba(9, 13, 22, 0.9);
          color: #38bdf8;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 20;
          will-change: transform;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);
        }

        .project-track-wrapper {
          position: relative;
          flex: 1;
          min-height: 0;
          width: 100%;
          display: flex;
          align-items: stretch;
          overflow: hidden;
        }

        .project-cards-track {
          display: flex;
          gap: 2rem;
          width: 100%;
          height: 100%;
          align-items: stretch;
          will-change: transform;
        }

        /* 1 Kartu Penuh (100%) per tampilan agar tidak muncul 2 kartu double di layar lebar */
        .project-split-card {
          flex: 0 0 100%;
          width: 100%;
          height: 100%;
          background: rgba(13, 17, 26, 0.94);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          overflow: hidden;
          position: relative;
          transition: border-color 0.25s ease;
          box-sizing: border-box;
        }

        .project-split-card.active-card {
          border-color: rgba(56, 189, 248, 0.4);
        }

        /* Panel Kiri Kartu */
        .card-left-panel {
          position: relative;
          padding: 1.35rem 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1rem;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          background-color: rgba(9, 13, 22, 0.85);
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 28px 28px;
          overflow: hidden;
        }

        .card-left-panel::before {
          content: "";
          position: absolute;
          top: -40px;
          left: -40px;
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, transparent 70%);
          pointer-events: none;
        }

        .left-panel-header {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.74rem;
          letter-spacing: 0.12em;
          position: relative;
          z-index: 2;
          flex-shrink: 0;
        }

        .left-panel-id {
          color: #38bdf8;
          font-weight: 700;
        }

        .left-panel-cat {
          color: #64748b;
          font-weight: 600;
        }

        /* Kotak Preview di Tengah Panel Kiri: Murni Gambar Tanpa Teks/Bingkai Ganda */
        .preview-showcase-frame {
          position: relative;
          z-index: 2;
          flex: 1;
          min-height: 0;
          width: 100%;
          border-radius: 10px;
          overflow: hidden;
          background: #090d16;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.65);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-project-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.4s ease;
        }

        .project-split-card:hover .preview-project-image {
          transform: scale(1.03);
        }

        /* Panel Kanan Kartu (PROJECT SPEC) */
        .card-right-panel {
          position: relative;
          padding: 1.6rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }

        .card-watermark-num {
          position: absolute;
          top: -0.5rem;
          left: -1rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 11rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.025);
          line-height: 1;
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }

        .spec-header-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          position: relative;
          z-index: 2;
        }

        .spec-label-left {
          color: #64748b;
          font-weight: 600;
        }

        .spec-label-right {
          color: #38bdf8;
          font-weight: 700;
        }

        .spec-main-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin: auto 0;
          padding: 0.5rem 0;
        }

        .spec-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.3rem, 1.8vw, 1.7rem);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: -0.025em;
          margin: 0;
        }

        .spec-description {
          font-size: 0.85rem;
          line-height: 1.62;
          color: #94a3b8;
          margin: 0;
        }

        .spec-bottom-area {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .spec-tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .spec-tech-pill {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: #cbd5e1;
          background: #141923;
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 0.32rem 0.65rem;
          border-radius: 5px;
        }

        .spec-action-bar {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .spec-source-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .spec-source-link:hover {
          color: #ffffff;
        }

        .spec-visit-btn {
          background: #38bdf8;
          color: #090d16;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.42rem 0.95rem;
          border-radius: 999px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .spec-visit-btn:hover {
          background: #7dd3fc;
          transform: translateY(-1px);
        }

        .project-footer-progress {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-shrink: 0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
        }

        .progress-num-active {
          color: #38bdf8;
          font-weight: 700;
        }

        .progress-bar-line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.14);
          position: relative;
          overflow: hidden;
        }

        .progress-bar-fill {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background: #38bdf8;
          transition: width 0.25s ease;
        }

        .progress-num-total {
          color: #64748b;
          font-weight: 600;
        }

        .progress-dots-group {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .progress-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.22);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .progress-dot.active {
          width: 24px;
          background: #38bdf8;
        }

        @media (max-width: 1024px) {
          .project-body {
            padding: 1.25rem 1.5rem;
          }
          .project-split-card {
            grid-template-columns: 1fr;
            flex: 0 0 100%;
          }
          .card-left-panel {
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          .drag-circle-indicator {
            display: none;
          }
        }
      `}</style>

      <div className={`project-terminal-window pin-${pinState}`}>
        {/* Body Utama */}
        <div
          ref={bodyRef}
          className="project-body"
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          {/* Indikator Lingkaran SCROLL */}
          <motion.div
            className="drag-circle-indicator"
            style={{
              x: smoothCursorX,
              y: smoothCursorY,
            }}
          >
            SCROLL
          </motion.div>

          {/* Header */}
          <div className="project-header-area">
            <div className="project-top-index">
              <span className="index-accent">03</span>
              <span className="index-text">PROJECTS</span>
              <div className="index-line" />
            </div>

            <div className="project-heading-row">
              <h2 className="project-main-title">Things I&apos;ve built.</h2>
              <p className="project-right-desc">
                From web applications to high-performance desktop systems,
                minimalist UI/UX interfaces, and SEO optimization tools.
              </p>
            </div>
          </div>

          {/* Track Horizontal (1 Kartu Penuh per Layar) */}
          <div ref={wrapperRef} className="project-track-wrapper">
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="project-cards-track"
            >
              {projectsData.map((project, idx) => (
                <article
                  key={project.id}
                  className={`project-split-card ${
                    activeIndex === idx ? "active-card" : ""
                  }`}
                >
                  {/* Panel Kiri: Hanya Gambar Preview */}
                  <div className="card-left-panel">
                    <div className="left-panel-header">
                      <span className="left-panel-id">/{project.id}</span>
                      <span className="left-panel-cat">{project.category}</span>
                    </div>

                    <div className="preview-showcase-frame">
                      <img
                        src={project.image}
                        alt=""
                        className="preview-project-image"
                        loading="lazy"
                        onError={(e) => {
                          if (e.currentTarget.src !== project.fallbackImage) {
                            e.currentTarget.src = project.fallbackImage;
                          }
                        }}
                      />
                    </div>

                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.68rem",
                        color: "#64748b",
                      }}
                    >
                      // SCROLL DOWN TO EXPLORE ({idx + 1}/{projectsData.length})
                    </div>
                  </div>

                  {/* Panel Kanan: PROJECT SPEC + Judul + Deskripsi + Tech Badges */}
                  <div className="card-right-panel">
                    <span className="card-watermark-num">{project.id}</span>

                    <div className="spec-header-line">
                      <span className="spec-label-left">PROJECT SPEC</span>
                      <span className="spec-label-right">
                        {project.specRight}
                      </span>
                    </div>

                    <div className="spec-main-content">
                      <h3 className="spec-title">{project.title}</h3>
                      <p className="spec-description">{project.description}</p>
                    </div>

                    <div className="spec-bottom-area">
                      <div className="spec-tags-row">
                        {project.tech.map((techItem) => (
                          <span key={techItem} className="spec-tech-pill">
                            {techItem}
                          </span>
                        ))}
                      </div>

                      <div className="spec-action-bar">
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="spec-source-link"
                        >
                          SOURCE CODE ↗
                        </a>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="spec-visit-btn"
                        >
                          VIEW PROJECT ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>

          {/* Bottom Progress Bar & Pagination Dots */}
          <div className="project-footer-progress">
            <span className="progress-num-active">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>

            <div className="progress-bar-line">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressRatio}%` }}
              />
            </div>

            <span className="progress-num-total">
              {String(projectsData.length).padStart(2, "0")}
            </span>

            <div className="progress-dots-group">
              {projectsData.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Go to project ${idx + 1}`}
                  onClick={() => scrollToSlide(idx)}
                  className={`progress-dot ${
                    activeIndex === idx ? "active" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}