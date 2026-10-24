import React, { useRef, useState, useEffect } from "react";

// Silakan sesuaikan isi array ini dengan data proyek asli Anda
const PROJECTS_DATA = [
  {
    id: "01",
    title: "Enterprise Web & Management System",
    category: "Fullstack Web Application",
    year: "2026",
    description:
      "Sistem manajemen berbasis web end-to-end dengan arsitektur komponen modular, pencarian real-time, serta optimasi performa tinggi.",
    image: "/project1.png",
    stack: ["Next.js", "React", "Tailwind CSS", "Supabase"],
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: "02",
    title: "Interactive 3D Creative Portfolio",
    category: "Creative Frontend · WebGL",
    year: "2026",
    description:
      "Eksplorasi antarmuka web interaktif menggunakan Three.js custom GLSL shader, transisi riak gelombang air, dan Lenis smooth scroll.",
    image: "/project2.png",
    stack: ["React", "Three.js", "GLSL", "Motion"],
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: "03",
    title: "Corporate Portal & SEO Architecture",
    category: "Web Performance & UI/UX",
    year: "2025",
    description:
      "Perancangan antarmuka korporat di Figma dan implementasi kode berstandar Core Web Vitals untuk kecepatan muat instan.",
    image: "/project3.png",
    stack: ["Next.js", "Figma", "Tailwind CSS", "SEO"],
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: "04",
    title: "Cross-Platform Workflow Utility",
    category: "System & Tooling",
    year: "2025",
    description:
      "Aplikasi utilitas dengan integrasi database terstruktur, antarmuka bersih bebas distraksi, dan manajemen state yang presisi.",
    image: "/project4.png",
    stack: ["React", "Laravel", "MySQL", "JavaScript"],
    liveUrl: "#",
    repoUrl: "#",
  },
];

export default function Project() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const trackRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [pinState, setPinState] = useState("before"); // "before" | "fixed" | "after"
  const [sectionHeight, setSectionHeight] = useState(3200);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    let rafId;
    let currentX = 0;
    let targetX = 0;
    let maxScrollPx = 0;

    // Buffer awal & akhir (dalam px) agar kartu pertama & terakhir sempat berhenti sejenak sebelum layar lanjut turun
    const startHoldBuffer = 140;
    const endHoldBuffer = 220;

    const measureLayout = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);

      if (mobile || !trackRef.current || !stageRef.current) {
        maxScrollPx = 0;
        return;
      }

      const trackWidth = trackRef.current.scrollWidth;
      const stageWidth = stageRef.current.clientWidth;
      maxScrollPx = Math.max(0, trackWidth - stageWidth + 48);

      // Tinggi total section = tinggi layar + jarak geser horizontal + buffer awal & akhir
      const calculatedHeight =
        window.innerHeight + maxScrollPx + startHoldBuffer + endHoldBuffer;
      setSectionHeight(calculatedHeight);
    };

    measureLayout();
    window.addEventListener("resize", measureLayout);
    // Ukur ulang setelah font/gambar dimuat
    const timer = setTimeout(measureLayout, 300);

    const updateScroll = () => {
      if (window.innerWidth <= 900 || !sectionRef.current || !trackRef.current) {
        rafId = requestAnimationFrame(updateScroll);
        return;
      }

      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalScrollable = Math.max(1, rect.height - vh);

      if (rect.top > 0) {
        // Sebelum menyentuh bagian atas layar: tahan di posisi awal
        setPinState("before");
        targetX = 0;
        setProgress(0);
        setActiveIndex(1);
      } else if (rect.bottom >= vh) {
        // Sedang di dalam area Projects: KUNCI LAYAR (fixed) & geser kartu ke samping
        setPinState("fixed");
        const scrolledInto = -rect.top;
        const effectiveScroll = Math.max(0, scrolledInto - startHoldBuffer);
        const effectiveMax = Math.max(
          1,
          totalScrollable - startHoldBuffer - endHoldBuffer
        );
        const clampedRatio = Math.min(1, Math.max(0, effectiveScroll / effectiveMax));

        targetX = -clampedRatio * maxScrollPx;
        setProgress(clampedRatio);

        const idx = Math.min(
          PROJECTS_DATA.length,
          Math.max(1, Math.round(clampedRatio * (PROJECTS_DATA.length - 1)) + 1)
        );
        setActiveIndex(idx);
      } else {
        // Setelah seluruh kartu selesai digeser 100%: lepaskan kunci agar halaman lanjut turun
        setPinState("after");
        targetX = -maxScrollPx;
        setProgress(1);
        setActiveIndex(PROJECTS_DATA.length);
      }

      // Interpolasi halus (smooth lerp) agar pergeseran kartu terasa sangat mulus
      currentX += (targetX - currentX) * 0.14;
      if (Math.abs(targetX - currentX) < 0.1) currentX = targetX;

      trackRef.current.style.transform = `translate3d(${currentX}px, 0, 0)`;

      rafId = requestAnimationFrame(updateScroll);
    };

    rafId = requestAnimationFrame(updateScroll);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", measureLayout);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className={`projects-pin-section ${isMobile ? "is-mobile" : ""}`}
      style={{ height: isMobile ? "auto" : `${sectionHeight}px` }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Oswald:wght@500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .projects-pin-section {
          --pr-bg-deep: #140409;
          --pr-bg-mid: #240811;
          --pr-surface: rgba(46, 12, 24, 0.58);
          --pr-surface-hover: rgba(66, 17, 34, 0.8);
          --pr-border: rgba(255, 228, 234, 0.18);
          --pr-border-gold: rgba(255, 224, 181, 0.5);
          --pr-text: #fff9fa;
          --pr-text-muted: rgba(255, 232, 238, 0.72);
          --pr-gold: #ffe0b5;
          --pr-rose: #f7a8b8;
          --pr-dark: #2a0712;
          --font-display: 'Oswald', Impact, sans-serif;
          --font-sans: 'Space Grotesk', system-ui, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;

          position: relative;
          z-index: 20;
          width: 100%;
          background: radial-gradient(
            circle at 65% 25%,
            #421120 0%,
            var(--pr-bg-mid) 50%,
            var(--pr-bg-deep) 100%
          );
          color: var(--pr-text);
          font-family: var(--font-sans);
          border-top: 1px solid var(--pr-border-gold);
          box-sizing: border-box;
          overflow: hidden;
        }

        /* Viewport yang dikunci secara presisi (before -> fixed -> after) */
        .projects-pin-viewport {
          width: 100%;
          height: 100dvh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 5.25rem 2.5rem 2.25rem;
          box-sizing: border-box;
          background: radial-gradient(
            circle at 65% 25%,
            #421120 0%,
            var(--pr-bg-mid) 50%,
            var(--pr-bg-deep) 100%
          );
        }

        .projects-pin-viewport.pin-before {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 5;
        }

        .projects-pin-viewport.pin-fixed {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 30;
        }

        .projects-pin-viewport.pin-after {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 5;
        }

        .projects-ambient-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
          background-size: 4.5rem 4.5rem;
          pointer-events: none;
          z-index: 1;
        }

        /* Header Atas */
        .projects-top-bar {
          position: relative;
          z-index: 5;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--pr-border);
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
        }

        .projects-kicker {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: var(--pr-gold);
          text-transform: uppercase;
          margin-bottom: 0.35rem;
        }

        .projects-heading {
          font-family: var(--font-display);
          font-size: clamp(2rem, 3.6vw, 3.25rem);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          margin: 0;
        }

        .projects-heading-outline {
          color: transparent;
          -webkit-text-stroke: 1.4px var(--pr-gold);
          margin-left: 0.35rem;
        }

        .scroll-telemetry-right {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          font-family: var(--font-mono);
          font-size: 0.74rem;
          letter-spacing: 0.12em;
          color: var(--pr-text-muted);
          text-transform: uppercase;
        }

        .active-counter-pill {
          padding: 0.3rem 0.75rem;
          background: rgba(20, 4, 10, 0.75);
          border: 1px solid var(--pr-border-gold);
          color: var(--pr-gold);
          font-weight: 700;
        }

        /* Stage & Track Horizontal */
        .projects-horizontal-stage {
          position: relative;
          z-index: 5;
          flex: 1;
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .projects-track {
          display: flex;
          align-items: stretch;
          gap: 2.25rem;
          will-change: transform;
        }

        /* Kartu Proyek Architectural HUD */
        .project-slide-card {
          position: relative;
          width: clamp(520px, 54vw, 740px);
          flex-shrink: 0;
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          background: var(--pr-surface);
          border: 1px solid var(--pr-border);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 1.5rem;
          gap: 1.5rem;
          box-sizing: border-box;
          box-shadow: 0 22px 48px rgba(12, 2, 6, 0.42);
          transition: border-color 0.3s ease, background 0.3s ease;
        }

        .project-slide-card:hover {
          background: var(--pr-surface-hover);
          border-color: var(--pr-border-gold);
        }

        /* Siku L-Bracket khas Home, Navbar, & About */
        .b-corner {
          position: absolute;
          width: 9px;
          height: 9px;
          border: 1.5px solid var(--pr-gold);
          pointer-events: none;
          transition: width 0.25s ease, height 0.25s ease;
        }

        .project-slide-card:hover .b-corner {
          width: 14px;
          height: 14px;
        }

        .tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
        .tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
        .bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
        .br { bottom: -1px; right: -1px; border-left: none; border-top: none; }

        /* Bingkai Gambar Proyek */
        .slide-media-box {
          position: relative;
          width: 100%;
          min-height: 280px;
          background: linear-gradient(135deg, #2d0916 0%, #130308 100%);
          border: 1px solid var(--pr-border);
          overflow: hidden;
          clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 14px),
            calc(100% - 14px) 100%,
            0 100%
          );
        }

        .slide-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .project-slide-card:hover .slide-img {
          transform: scale(1.05);
        }

        .slide-index-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          padding: 0.25rem 0.65rem;
          background: rgba(20, 4, 10, 0.85);
          border: 1px solid var(--pr-border-gold);
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--pr-gold);
        }

        /* Kolom Informasi Proyek */
        .slide-info-col {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1rem;
        }

        .slide-meta-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          color: var(--pr-rose);
          text-transform: uppercase;
        }

        .slide-title {
          font-family: var(--font-display);
          font-size: clamp(1.45rem, 2vw, 1.95rem);
          font-weight: 700;
          line-height: 1.08;
          text-transform: uppercase;
          margin: 0.35rem 0 0.5rem;
          color: var(--pr-text);
        }

        .slide-desc {
          font-size: 0.86rem;
          line-height: 1.62;
          color: var(--pr-text-muted);
          margin: 0;
        }

        .slide-stack-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--pr-border);
        }

        .slide-stack-pill {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          padding: 0.22rem 0.55rem;
          background: rgba(20, 4, 10, 0.65);
          border: 1px solid var(--pr-border);
          color: var(--pr-gold);
        }

        .slide-actions {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-top: 0.9rem;
        }

        .slide-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          height: 2.5rem;
          padding: 0 1.15rem;
          background: linear-gradient(135deg, #fff9fa 0%, var(--pr-gold) 100%);
          color: var(--pr-dark);
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%);
          transition: transform 0.22s ease;
        }

        .slide-btn-primary:hover {
          transform: translateY(-2px);
        }

        .slide-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 2.5rem;
          padding: 0 0.95rem;
          border: 1px solid var(--pr-border);
          color: var(--pr-text);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.22s ease;
        }

        .slide-btn-secondary:hover {
          border-color: var(--pr-gold);
          color: var(--pr-gold);
        }

        /* Progress Bar Horizontal di Bawah */
        .projects-bottom-bar {
          position: relative;
          z-index: 5;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .progress-track {
          flex: 1;
          height: 3px;
          background: rgba(255, 255, 255, 0.14);
          position: relative;
          overflow: hidden;
        }

        .progress-fill {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, var(--pr-gold), var(--pr-rose));
          transform-origin: left;
          transition: transform 0.08s linear;
        }

        /* Tampilan Mobile & Tablet Responsif Penuh */
        @media (max-width: 900px) {
          .projects-pin-section.is-mobile {
            height: auto !important;
            min-height: 100vh;
          }

          .projects-pin-viewport,
          .projects-pin-viewport.pin-before,
          .projects-pin-viewport.pin-fixed,
          .projects-pin-viewport.pin-after {
            position: relative !important;
            height: auto !important;
            padding: 4.5rem 1.25rem 4rem;
            gap: 2rem;
          }

          .scroll-telemetry-right,
          .projects-bottom-bar {
            display: none;
          }

          .projects-track {
            flex-direction: column;
            width: 100%;
            gap: 1.35rem;
            transform: none !important;
          }

          .project-slide-card {
            width: 100%;
            grid-template-columns: 1fr;
            padding: 1.2rem;
            gap: 1.1rem;
          }

          .slide-media-box {
            min-height: 210px;
            aspect-ratio: 16 / 10;
          }
        }
      `}</style>

      <div className={`projects-pin-viewport pin-${pinState}`}>
        <div className="projects-ambient-grid" aria-hidden="true" />

        {/* 1. Header Atas */}
        <header className="projects-top-bar">
          <div>
            <div className="projects-kicker">
              <span>ARCHIVE // 03 — SELECTED WORKS</span>
            </div>
            <h2 className="projects-heading">
              FEATURED
              <span className="projects-heading-outline">PROJECTS</span>
            </h2>
          </div>

          <div className="scroll-telemetry-right">
            <span>SCROLL TO SLIDE →</span>
            <span className="active-counter-pill">
              0{activeIndex} / 0{PROJECTS_DATA.length}
            </span>
          </div>
        </header>

        {/* 2. Stage & Track Horizontal */}
        <div ref={stageRef} className="projects-horizontal-stage">
          <div ref={trackRef} className="projects-track">
            {PROJECTS_DATA.map((project) => (
              <article key={project.id} className="project-slide-card">
                <span className="b-corner tl" />
                <span className="b-corner tr" />
                <span className="b-corner bl" />
                <span className="b-corner br" />

                <div className="slide-media-box">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="slide-img"
                    loading="lazy"
                  />
                  <span className="slide-index-badge">/{project.id}</span>
                </div>

                <div className="slide-info-col">
                  <div>
                    <div className="slide-meta-top">
                      <span>{project.category}</span>
                      <span>{project.year}</span>
                    </div>
                    <h3 className="slide-title">{project.title}</h3>
                    <p className="slide-desc">{project.description}</p>
                  </div>

                  <div>
                    <div className="slide-stack-wrap">
                      {project.stack.map((tech) => (
                        <span key={tech} className="slide-stack-pill">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="slide-actions">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="slide-btn-primary"
                        >
                          <span>View Project</span>
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="slide-btn-secondary"
                        >
                          <span>Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 3. Bar Indikator Progres Scroll Horizontal */}
        <div className="projects-bottom-bar">
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--pr-gold)",
            }}
          >
            01
          </span>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--pr-gold)",
            }}
          >
            0{PROJECTS_DATA.length}
          </span>
        </div>
      </div>
    </section>
  );
}