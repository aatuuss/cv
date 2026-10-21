import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

// Daftar 6 Desain Mockup Figma (Ganti image & figmaUrl sesuai file Anda di folder public)
const figmaDesignsData = [
  {
    id: "FIG-01",
    num: "01",
    title: "Enterprise Analytics Dashboard UI",
    type: "Web App / Dashboard",
    image: "./public/figma-1.png",
    figmaUrl: "https://www.figma.com",
    accent: "#38bdf8",
    summary:
      "Sistem desain dashboard modular dengan dark mode, visualisasi metrik real-time, dan komponen tabel data kepadatan tinggi.",
  },
  {
    id: "FIG-02",
    num: "02",
    title: "Fintech Mobile Banking Experience",
    type: "Mobile App (iOS / Android)",
    image: "./public/figma-2.png",
    figmaUrl: "https://www.figma.com",
    accent: "#a855f7",
    summary:
      "Antarmuka aplikasi finansial mobile dengan alur transaksi cepat, analitik pengeluaran bulanan, dan kartu virtual interaktif.",
  },
  {
    id: "FIG-03",
    num: "03",
    title: "Industrial IoT & Telemetry Monitor",
    type: "Desktop / HMI Interface",
    image: "./public/figma-3.png",
    figmaUrl: "https://www.figma.com",
    accent: "#10b981",
    summary:
      "Mockup antarmuka pemantauan mesin industri dan sensor manufaktur dengan indikator status presisi tinggi.",
  },
  {
    id: "FIG-04",
    num: "04",
    title: "Modern E-Commerce & Product Configurator",
    type: "E-Commerce Web UI",
    image: "./public/figma-4.png",
    figmaUrl: "https://www.figma.com",
    accent: "#f59e0b",
    summary:
      "Eksplorasi tata letak katalog produk interaktif, halaman detail konversi tinggi, dan alur checkout minimalis.",
  },
  {
    id: "FIG-05",
    num: "05",
    title: "SaaS AI Workflow & Prompt Studio",
    type: "SaaS / AI Platform",
    image: "./public/figma-5.png",
    figmaUrl: "https://www.figma.com",
    accent: "#ec4899",
    summary:
      "Desain workspace kolaboratif berbasis node dan command-palette cepat untuk manajemen otomasi tim teknis.",
  },
  {
    id: "FIG-06",
    num: "06",
    title: "Healthcare Booking & Patient Portal",
    type: "Web & Mobile System",
    image: "./public/figma-6.png",
    figmaUrl: "https://www.figma.com",
    accent: "#06b6d4",
    summary:
      "Sistem antarmuka klinik terpadu untuk penjadwalan dokter, rekam medis digital, dan konsultasi jarak jauh.",
  },
];

// Set each previewImage to a path under public, for example "/images/infimech.jpg".
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
    previewImage: "./public/Device Mashups.png",
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
    previewImage: "./public/Device Mashups (1).png",
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
    previewImage: "./public/Device Mashups (2).png",
    accent: "#38bdf8",
  },
  {
    id: "04",
    category: "FRONTEND & SEO",
    specRight: "UI/UX & SEO",
    title: "VitalsPulse Automated SEO & Web Performance Suite",
    description:
      "Comprehensive web performance & technical SEO optimization for Infimech that audits DOM structure, asset compression, and Core Web Vitals metrics—securing Top 3 Google organic ranking for competitive keyword \"jasa simulasi cfd\".",
    tech: ["JAVASCRIPT", "TAILWIND CSS", "WEB VITALS", "SEO"],
    liveUrl: "https://infimech.tech/home",
    repoUrl: "https://www.google.com/search?q=jasa+simulasi+cfd",
    sourceLabel: "CEK DI GOOGLE ↗",
    visitLabel: "VIEW WEBSITE ↗",
    previewImage: "",
    serpProof: {
      query: "jasa simulasi cfd",
      googleSearchUrl: "https://www.google.com/search?q=jasa+simulasi+cfd",
      rankBadge: "TOP 3 GOOGLE SERP",
      siteName: "Infimech Harmoni Teknologi",
      displayUrl: "https://infimech.tech › home",
      targetUrl: "https://infimech.tech/home",
      serpTitle: "Jasa Simulasi CFD & Engineering Services Indonesia — Infimech",
      serpSnippet:
        "PT Infimech Harmoni Teknologi is an Indonesian startup providing engineering consultancy, simulation, and training services. We help industries optimize design, improve performance, and solve complex engineering problems...",
      metrics: [
        { label: "KEYWORD", value: '"jasa simulasi cfd"' },
        { label: "SERP RANK", value: "Top 3 / Page 1" },
        { label: "TRAFFIC", value: "100% Organic" },
      ],
    },
    accent: "#38bdf8",
  },
  {
    id: "05",
    category: "FIGMA & UI/UX",
    specRight: "6 DESIGN MOCKUPS",
    title: "UI/UX Design System & Interactive Figma Mockups",
    description:
      "Koleksi 6 rancangan antarmuka produk digital (Web App, Mobile Banking, Industrial HMI, hingga SaaS Dashboard) yang dirancang di Figma dengan sistem komponen terukur, auto-layout, dan prototipe interaktif.",
    tech: ["FIGMA", "UI/UX DESIGN", "DESIGN SYSTEM", "PROTOTYPING"],
    liveUrl: "https://www.figma.com",
    repoUrl: "https://www.figma.com",
    sourceLabel: "ALL FIGMA FILES ↗",
    visitLabel: "OPEN PROTOTYPE ↗",
    previewImage: "",
    figmaGallery: figmaDesignsData,
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

  // State khusus galeri 6 desain Figma di Slide 05
  const [activeFigmaIdx, setActiveFigmaIdx] = useState(0);
  const [figmaViewMode, setFigmaViewMode] = useState("grid"); // "grid" | "focus"
  const [lightboxDesign, setLightboxDesign] = useState(null);

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

  // Tutup modal Lightbox dengan tombol Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setLightboxDesign(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
  const activeFigmaItem = figmaDesignsData[activeFigmaIdx] || figmaDesignsData[0];

  return (
    <section
      ref={sectionRef}
      className="project-scroll-section"
      id="projects"
      style={{ height: `${projectsData.length * 100}vh` }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');

        /* Section tinggi (${projectsData.length * 100}vh) untuk ruang scroll 1 per 1 project */
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

        /* Jendela 100vh yang otomatis terkunci (pinned) saat di-scroll sampai project habis */
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

        /* Area Konten Utama dengan latar Dark Matrix */
        .project-body {
          flex: 1;
          min-height: 0;
          height: calc(100vh - 70px);
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

        /* Header: 03 PROJECTS + Things I've built. + Subtitle kanan */
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

        /* Lingkaran SCROLL GPU-Accelerated */
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

        /* Wrapper & Track Horizontal */
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
          gap: 1.5rem;
          height: 100%;
          align-items: stretch;
          will-change: transform;
        }

        /* Kartu Proyek Split 2 Panel */
        .project-split-card {
          flex: 0 0 min(860px, 76vw);
          height: 100%;
          background: rgba(13, 17, 26, 0.94);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          display: grid;
          grid-template-columns: 0.98fr 1.02fr;
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
          padding: 1.25rem 1.4rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
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
          justify-content: space-between;
          gap: 0.65rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.74rem;
          letter-spacing: 0.12em;
          position: relative;
          z-index: 2;
        }

        .left-panel-header-left {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .left-panel-id {
          color: #38bdf8;
          font-weight: 700;
        }

        .left-panel-cat {
          color: #64748b;
          font-weight: 600;
        }

        /* Kotak Preview Gambar/Mockup di Tengah Panel Kiri */
        .preview-showcase-frame {
          position: relative;
          z-index: 2;
          margin: auto 0;
          background: linear-gradient(145deg, #0f172a 0%, #090d16 100%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 0.6rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.65);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: transform 0.3s ease;
        }

        .project-split-card:hover .preview-showcase-frame {
          transform: scale(1.01);
        }

        .preview-image {
          display: block;
          width: 100%;
          max-height: 280px;
          aspect-ratio: 16 / 10;
          object-fit: cover;
          border-radius: 6px;
        }

        .preview-image-placeholder {
          width: 100%;
          aspect-ratio: 16 / 10;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.03);
        }

        /* === WIDGET BUKTI GOOGLE SERP (SLIDE 04) === */
        .serp-proof-widget {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          padding: 0.35rem 0.25rem;
        }

        .serp-searchbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          background: #090d16;
          border: 1px solid rgba(56, 189, 248, 0.35);
          border-radius: 999px;
          padding: 0.42rem 0.75rem;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
        }

        .serp-search-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 0;
        }

        .google-g-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: conic-gradient(
            #4285f4 0deg 90deg,
            #34a853 90deg 180deg,
            #fbbc05 180deg 270deg,
            #ea4335 270deg 360deg
          );
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .google-g-dot::after {
          content: "G";
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.62rem;
          font-weight: 800;
          color: #ffffff;
          background: #090d16;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .serp-query-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.74rem;
          font-weight: 600;
          color: #f8fafc;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .serp-cursor {
          display: inline-block;
          width: 6px;
          height: 13px;
          background: #38bdf8;
          margin-left: 3px;
          vertical-align: middle;
          animation: serpBlink 1.1s steps(2, start) infinite;
        }

        @keyframes serpBlink {
          to { visibility: hidden; }
        }

        .serp-verify-pill {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          font-weight: 700;
          color: #10b981;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          padding: 0.18rem 0.5rem;
          border-radius: 999px;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .serp-verify-pill:hover {
          background: rgba(16, 185, 129, 0.24);
          color: #34d399;
        }

        .serp-result-card {
          background: rgba(15, 23, 42, 0.92);
          border: 1px solid rgba(56, 189, 248, 0.45);
          border-radius: 8px;
          padding: 0.75rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.38rem;
          box-shadow: 0 8px 24px rgba(56, 189, 248, 0.08);
        }

        .serp-result-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .serp-site-info {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          min-width: 0;
        }

        .serp-favicon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(56, 189, 248, 0.16);
          border: 1px solid rgba(56, 189, 248, 0.4);
          color: #38bdf8;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.66rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .serp-site-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
          min-width: 0;
        }

        .serp-site-name {
          font-size: 0.7rem;
          font-weight: 600;
          color: #e2e8f0;
        }

        .serp-site-url {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .serp-rank-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #090d16;
          background: #38bdf8;
          padding: 0.18rem 0.48rem;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .serp-result-title {
          font-size: 0.84rem;
          font-weight: 700;
          color: #60a5fa;
          text-decoration: none;
          line-height: 1.3;
          margin-top: 0.1rem;
          transition: color 0.15s ease;
        }

        .serp-result-title:hover {
          color: #93c5fd;
          text-decoration: underline;
        }

        .serp-result-snippet {
          font-size: 0.7rem;
          line-height: 1.48;
          color: #cbd5e1;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .serp-kw-highlight {
          color: #38bdf8;
          font-weight: 700;
        }

        .serp-metrics-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.4rem;
        }

        .serp-metric-item {
          background: rgba(9, 13, 22, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 0.38rem 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.12rem;
        }

        .serp-metric-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.54rem;
          letter-spacing: 0.08em;
          color: #64748b;
        }

        .serp-metric-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          font-weight: 700;
          color: #f8fafc;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* === WIDGET GALERI 6 DESAIN FIGMA (SLIDE 05) === */
        .figma-mode-toggle-group {
          display: inline-flex;
          background: #090d16;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 6px;
          padding: 2px;
          gap: 2px;
        }

        .figma-mode-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          font-weight: 600;
          color: #64748b;
          background: transparent;
          border: none;
          padding: 0.2rem 0.48rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .figma-mode-btn.active {
          background: rgba(56, 189, 248, 0.16);
          color: #38bdf8;
        }

        .figma-canvas-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.45rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          color: #94a3b8;
        }

        .figma-toolbar-left {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .figma-color-dots {
          display: inline-flex;
          gap: 3px;
        }

        .figma-color-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        /* Mode 1: Bento Grid 6 Mockup (3x2) */
        .figma-bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.48rem;
        }

        .figma-grid-tile {
          position: relative;
          background: linear-gradient(145deg, #111827 0%, #090d16 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 7px;
          overflow: hidden;
          cursor: pointer;
          aspect-ratio: 16 / 10;
          transition: all 0.2s ease;
          padding: 0;
          text-align: left;
        }

        .figma-grid-tile:hover,
        .figma-grid-tile.selected {
          border-color: #38bdf8;
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(56, 189, 248, 0.18);
        }

        .figma-tile-wireframe {
          position: absolute;
          inset: 0;
          padding: 0.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.22rem;
          opacity: 0.45;
          pointer-events: none;
        }

        .figma-tile-img {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .figma-tile-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(to top, rgba(7, 9, 14, 0.94) 0%, rgba(7, 9, 14, 0.12) 65%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0.4rem 0.45rem;
          box-sizing: border-box;
        }

        .figma-tile-num {
          position: absolute;
          top: 0.32rem;
          left: 0.38rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem;
          font-weight: 700;
          color: #38bdf8;
          background: rgba(9, 13, 22, 0.85);
          border: 1px solid rgba(56, 189, 248, 0.35);
          padding: 0.08rem 0.32rem;
          border-radius: 4px;
        }

        .figma-tile-title {
          font-size: 0.62rem;
          font-weight: 600;
          color: #f8fafc;
          line-height: 1.2;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Mode 2: Focus Single Preview + 6 Thumbnail Strip */
        .figma-focus-stage {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9.2;
          background: linear-gradient(135deg, #111827 0%, #090d16 100%);
          border-radius: 7px;
          overflow: hidden;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }

        .figma-focus-img {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .figma-focus-caption-bar {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          background: linear-gradient(to top, rgba(7, 9, 14, 0.95), rgba(7, 9, 14, 0.6));
          padding: 0.45rem 0.65rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .figma-zoom-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.58rem;
          font-weight: 700;
          color: #090d16;
          background: #38bdf8;
          border: none;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .figma-thumbs-strip {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.35rem;
        }

        .figma-thumb-pill {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          font-weight: 600;
          padding: 0.28rem 0;
          border-radius: 5px;
          background: #090d16;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .figma-thumb-pill.active {
          background: rgba(56, 189, 248, 0.18);
          border-color: #38bdf8;
          color: #38bdf8;
        }

        /* Daftar 6 Desain Interaktif di Panel Kanan Slide 05 */
        .figma-right-selector-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.42rem;
          margin-top: 0.25rem;
        }

        .figma-right-item-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.4rem;
          background: #111622;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 0.4rem 0.55rem;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }

        .figma-right-item-btn:hover,
        .figma-right-item-btn.active {
          border-color: rgba(56, 189, 248, 0.55);
          background: rgba(56, 189, 248, 0.1);
        }

        .figma-right-item-left {
          display: flex;
          align-items: center;
          gap: 0.42rem;
          min-width: 0;
        }

        .figma-right-item-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          font-weight: 700;
          color: #38bdf8;
          flex-shrink: 0;
        }

        .figma-right-item-title {
          font-size: 0.68rem;
          font-weight: 600;
          color: #e2e8f0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Modal Lightbox Fullscreen untuk Mockup Figma */
        .figma-lightbox-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(4, 7, 13, 0.88);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .figma-lightbox-modal {
          width: min(920px, 94vw);
          background: #0d111a;
          border: 1px solid rgba(56, 189, 248, 0.4);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85);
          display: flex;
          flex-direction: column;
        }

        .figma-lightbox-header {
          padding: 0.85rem 1.25rem;
          background: #090d16;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .figma-lightbox-close {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: #f8fafc;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.45);
          padding: 0.3rem 0.7rem;
          border-radius: 6px;
          cursor: pointer;
        }

        .figma-lightbox-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .figma-lightbox-img {
          width: 100%;
          max-height: 62vh;
          object-fit: contain;
          border-radius: 8px;
          background: #07090e;
        }

        /* Panel Kanan Kartu (PROJECT SPEC) */
        .card-right-panel {
          position: relative;
          padding: 1.5rem 1.85rem;
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
          gap: 0.65rem;
          margin: auto 0;
          padding: 0.4rem 0;
        }

        .spec-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.25rem, 1.75vw, 1.65rem);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: -0.025em;
          margin: 0;
        }

        .spec-description {
          font-size: 0.83rem;
          line-height: 1.58;
          color: #94a3b8;
          margin: 0;
        }

        .spec-bottom-area {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
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
          padding: 0.3rem 0.6rem;
          border-radius: 5px;
        }

        .spec-action-bar {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 0.7rem;
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

        /* Footer Progress Bar & Dots */
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
            flex: 0 0 86vw;
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
          {/* Indikator Lingkaran SCROLL dengan MotionValue GPU */}
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

          {/* Track Horizontal yang Bergeser 1 per 1 Saat Halaman Di-scroll ke Bawah */}
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
                  {/* Panel Kiri: /01 + Kategori + Mockup Visual / SERP / Galeri 6 Desain Figma */}
                  <div className="card-left-panel">
                    <div className="left-panel-header">
                      <div className="left-panel-header-left">
                        <span className="left-panel-id">/{project.id}</span>
                        <span className="left-panel-cat">{project.category}</span>
                      </div>

                      {/* Toggle Tampilan Grid 6 Desain vs Focus Preview khusus Slide Figma */}
                      {project.figmaGallery && (
                        <div className="figma-mode-toggle-group">
                          <button
                            type="button"
                            onClick={() => setFigmaViewMode("grid")}
                            className={`figma-mode-btn ${
                              figmaViewMode === "grid" ? "active" : ""
                            }`}
                          >
                            6-GRID
                          </button>
                          <button
                            type="button"
                            onClick={() => setFigmaViewMode("focus")}
                            className={`figma-mode-btn ${
                              figmaViewMode === "focus" ? "active" : ""
                            }`}
                          >
                            FOCUS
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="preview-showcase-frame">
                      {project.figmaGallery ? (
                        <>
                          {/* Toolbar Ala Canvas Figma */}
                          <div className="figma-canvas-toolbar">
                            <div className="figma-toolbar-left">
                              <span className="figma-color-dots">
                                <span style={{ background: "#f24e1e" }} />
                                <span style={{ background: "#a259ff" }} />
                                <span style={{ background: "#1abcfe" }} />
                                <span style={{ background: "#0acf83" }} />
                              </span>
                              <span>
                                FIGMA_CANVAS // {activeFigmaItem.id} ({activeFigmaItem.type})
                              </span>
                            </div>
                            <span style={{ color: "#38bdf8", fontWeight: 700 }}>
                              {activeFigmaIdx + 1}/6 MOCKUPS
                            </span>
                          </div>

                          {figmaViewMode === "grid" ? (
                            /* Tampilan 1: Bento Grid 6 Desain Sekaligus (3x2) */
                            <div className="figma-bento-grid">
                              {project.figmaGallery.map((item, fIdx) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    setActiveFigmaIdx(fIdx);
                                    setFigmaViewMode("focus");
                                  }}
                                  className={`figma-grid-tile ${
                                    activeFigmaIdx === fIdx ? "selected" : ""
                                  }`}
                                >
                                  {/* Wireframe Artboard Fallback (tampil jika gambar belum diisi) */}
                                  <div className="figma-tile-wireframe">
                                    <div
                                      style={{
                                        height: "6px",
                                        width: "45%",
                                        borderRadius: "3px",
                                        background: item.accent || "#38bdf8",
                                      }}
                                    />
                                    <div
                                      style={{
                                        flex: 1,
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1.6fr",
                                        gap: "4px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          background: "rgba(255,255,255,0.07)",
                                          borderRadius: "4px",
                                        }}
                                      />
                                      <div
                                        style={{
                                          background: "rgba(56,189,248,0.12)",
                                          borderRadius: "4px",
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="figma-tile-img"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                  <div className="figma-tile-overlay">
                                    <span className="figma-tile-num">
                                      #{item.num}
                                    </span>
                                    <span className="figma-tile-title">
                                      {item.title}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            /* Tampilan 2: Focus Single Mockup + 6 Tombol Switcher */
                            <>
                              <div className="figma-focus-stage">
                                <div className="figma-tile-wireframe">
                                  <div
                                    style={{
                                      height: "10px",
                                      width: "35%",
                                      borderRadius: "4px",
                                      background:
                                        activeFigmaItem.accent || "#38bdf8",
                                    }}
                                  />
                                  <div
                                    style={{
                                      flex: 1,
                                      display: "grid",
                                      gridTemplateColumns: "1fr 2fr",
                                      gap: "8px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        background: "rgba(255,255,255,0.06)",
                                        borderRadius: "6px",
                                      }}
                                    />
                                    <div
                                      style={{
                                        background: "rgba(56,189,248,0.1)",
                                        borderRadius: "6px",
                                      }}
                                    />
                                  </div>
                                </div>
                                <img
                                  src={activeFigmaItem.image}
                                  alt={activeFigmaItem.title}
                                  className="figma-focus-img"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                                <div className="figma-focus-caption-bar">
                                  <div>
                                    <div
                                      style={{
                                        fontSize: "0.74rem",
                                        fontWeight: 700,
                                        color: "#f8fafc",
                                      }}
                                    >
                                      {activeFigmaItem.title}
                                    </div>
                                    <div
                                      style={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: "0.6rem",
                                        color: "#38bdf8",
                                      }}
                                    >
                                      {activeFigmaItem.type}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setLightboxDesign(activeFigmaItem)
                                    }
                                    className="figma-zoom-btn"
                                  >
                                    ZOOM ⤢
                                  </button>
                                </div>
                              </div>

                              <div className="figma-thumbs-strip">
                                {project.figmaGallery.map((item, fIdx) => (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveFigmaIdx(fIdx)}
                                    className={`figma-thumb-pill ${
                                      activeFigmaIdx === fIdx ? "active" : ""
                                    }`}
                                  >
                                    #{item.num}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      ) : project.serpProof ? (
                        <div className="serp-proof-widget">
                          {/* Bar Pencarian Google */}
                          <div className="serp-searchbar">
                            <div className="serp-search-left">
                              <span className="google-g-dot" />
                              <span className="serp-query-text">
                                {project.serpProof.query}
                                <span className="serp-cursor" />
                              </span>
                            </div>
                            <a
                              href={project.serpProof.googleSearchUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="serp-verify-pill"
                            >
                              LIVE SERP ↗
                            </a>
                          </div>

                          {/* Kartu Hasil Teratas Google */}
                          <div className="serp-result-card">
                            <div className="serp-result-top">
                              <div className="serp-site-info">
                                <div className="serp-favicon">IM</div>
                                <div className="serp-site-text">
                                  <span className="serp-site-name">
                                    {project.serpProof.siteName}
                                  </span>
                                  <span className="serp-site-url">
                                    {project.serpProof.displayUrl}
                                  </span>
                                </div>
                              </div>
                              <span className="serp-rank-badge">
                                {project.serpProof.rankBadge}
                              </span>
                            </div>

                            <a
                              href={project.serpProof.targetUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="serp-result-title"
                            >
                              {project.serpProof.serpTitle}
                            </a>

                            <p className="serp-result-snippet">
                              <span className="serp-kw-highlight">
                                Jasa Simulasi CFD
                              </span>{" "}
                              — {project.serpProof.serpSnippet}
                            </p>
                          </div>

                          {/* Metrik Ringkas Bukti SEO */}
                          <div className="serp-metrics-row">
                            {project.serpProof.metrics.map((m) => (
                              <div key={m.label} className="serp-metric-item">
                                <span className="serp-metric-label">
                                  {m.label}
                                </span>
                                <span className="serp-metric-value">
                                  {m.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : project.previewImage ? (
                        <img
                          className="preview-image"
                          src={project.previewImage}
                          alt={`Preview ${project.title}`}
                        />
                      ) : (
                        <div className="preview-image-placeholder" />
                      )}
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
                        {project.figmaGallery
                          ? `MOCKUP ${activeFigmaItem.num} / 06`
                          : project.specRight}
                      </span>
                    </div>

                    <div className="spec-main-content">
                      <h3 className="spec-title">
                        {project.figmaGallery
                          ? activeFigmaItem.title
                          : project.title}
                      </h3>
                      <p className="spec-description">
                        {project.figmaGallery
                          ? activeFigmaItem.summary
                          : project.description}
                      </p>

                      {/* Daftar 6 Tombol Desain Cepat di Panel Kanan Khusus Slide Figma */}
                      {project.figmaGallery && (
                        <div className="figma-right-selector-list">
                          {project.figmaGallery.map((item, fIdx) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setActiveFigmaIdx(fIdx)}
                              className={`figma-right-item-btn ${
                                activeFigmaIdx === fIdx ? "active" : ""
                              }`}
                            >
                              <div className="figma-right-item-left">
                                <span className="figma-right-item-num">
                                  {item.num}
                                </span>
                                <span className="figma-right-item-title">
                                  {item.title}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
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
                        {project.figmaGallery ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setLightboxDesign(activeFigmaItem)}
                              className="spec-source-link"
                              style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                              }}
                            >
                              PREVIEW FULLSCREEN ⤢
                            </button>
                            <a
                              href={activeFigmaItem.figmaUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="spec-visit-btn"
                            >
                              OPEN IN FIGMA ↗
                            </a>
                          </>
                        ) : (
                          <>
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="spec-source-link"
                            >
                              {project.sourceLabel || "SOURCE CODE ↗"}
                            </a>
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="spec-visit-btn"
                            >
                              {project.visitLabel || "VIEW PROJECT ↗"}
                            </a>
                          </>
                        )}
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

      {/* Modal Lightbox untuk Melihat Mockup Figma Ukuran Penuh */}
      {lightboxDesign && (
        <div
          className="figma-lightbox-backdrop"
          onClick={() => setLightboxDesign(null)}
        >
          <div
            className="figma-lightbox-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="figma-lightbox-header">
              <div>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.72rem",
                    color: "#38bdf8",
                    fontWeight: 700,
                    marginRight: "0.6rem",
                  }}
                >
                  {lightboxDesign.id}
                </span>
                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                  {lightboxDesign.title}
                </span>
              </div>
              <button
                type="button"
                className="figma-lightbox-close"
                onClick={() => setLightboxDesign(null)}
              >
                ESC / CLOSE ✕
              </button>
            </div>
            <div className="figma-lightbox-body">
              <img
                src={lightboxDesign.image}
                alt={lightboxDesign.title}
                className="figma-lightbox-img"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.82rem",
                    color: "#94a3b8",
                    maxWidth: "620px",
                  }}
                >
                  {lightboxDesign.summary}
                </p>
                <a
                  href={lightboxDesign.figmaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="spec-visit-btn"
                >
                  BUKA PROTOTIPE FIGMA ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}