import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Navbar({ onNavigateComments }) {
  const [activeTab, setActiveTab] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [localTime, setLocalTime] = useState("");

  const mobileNavItems = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#carrier" },
    { label: "Projects", href: "#projects" },
    { label: "Achievements", href: "#certificates" },
    { label: "Contact", href: "#contact" },
  ];

  // Lock body scroll saat mobile menu aktif
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Support ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems = [
    { index: "01", label: "About", href: "#about" },
    { index: "02", label: "Experience", href: "#carrier" },
    { index: "03", label: "Projects", href: "#projects" },
    { index: "04", label: "Achievements", href: "#certificates" },
  ];

  const handleNavClick = (e, href, label) => {
    e.preventDefault();
    setActiveTab(label);
    setMobileMenuOpen(false);
    if (href === "#contact" && onNavigateComments) {
      onNavigateComments();
      return;
    }
    const targetId = href.replace("#", "");
    let targetEl = document.getElementById(targetId);
    if (!targetEl && targetId === "certificates") targetEl = document.getElementById("achievements");
    if (!targetEl && targetId === "carrier") targetEl = document.getElementById("experience");

    if (targetEl) {
      if (window.lenis && typeof window.lenis.scrollTo === "function") {
        window.lenis.scrollTo(targetEl, { offset: 0, duration: 1.25 });
      } else {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleConnectClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigateComments) {
      onNavigateComments();
    } else {
      const targetEl = document.getElementById("contact");
      if (targetEl) {
        if (window.lenis && typeof window.lenis.scrollTo === "function") {
          window.lenis.scrollTo(targetEl, { offset: 0, duration: 1.25 });
        } else {
          targetEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  // 1. Deteksi Scroll & Scroll-Spy Otomatis
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 36);

      if (window.scrollY < 180) {
        setActiveTab("");
        return;
      }

      for (const item of navItems) {
        const id = item.href.replace("#", "");
        let el = document.getElementById(id);
        if (!el && id === "carrier") el = document.getElementById("experience");
        if (!el && id === "certificates") el = document.getElementById("achievements");
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 260 && rect.bottom >= 140) {
            setActiveTab(item.label);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Jam Telemetri Real-Time (WIB) agar selaras dengan konsep HUD
  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date();
        const formatted = now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        setLocalTime(formatted.replace(/\./g, ":"));
      } catch {
        setLocalTime("LIVE");
      }
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleScrollTop = (e) => {
    e.preventDefault();
    setActiveTab("");
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className={`navbar-wrapper ${isScrolled ? "scrolled" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .navbar-wrapper {
          --nav-bg-glass: rgba(42, 11, 21, 0.42);
          --nav-bg-scrolled: rgba(28, 6, 14, 0.84);
          --nav-border: rgba(255, 232, 236, 0.25);
          --nav-border-strong: rgba(255, 224, 181, 0.55);
          --nav-text: #fff9fa;
          --nav-text-muted: rgba(255, 238, 242, 0.68);
          --nav-gold: #ffe0b5;
          --nav-rose: #ff6b8b;
          --nav-dark: #3d101c;
          --font-display: 'Oswald', Impact, sans-serif;
          --font-sans: 'Space Grotesk', system-ui, sans-serif;

          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 50;
          padding: 1.4rem 2.25rem;
          box-sizing: border-box;
          font-family: var(--font-sans);
          transition: padding 0.45s cubic-bezier(0.16, 1, 0.3, 1),
                      top 0.45s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

                .navbar-wrapper.scrolled {
          padding: 0.65rem 1.25rem;
          top: 0.6rem;
        }

        /* 1. SEBELUM SCROLL: Tampilan Asli yang Luas (1360px), Tanpa Background Bar */
        .navbar-inner {
          pointer-events: auto;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 1360px;
          margin: 0 auto;
          background: transparent;
          border: none;
          box-shadow: none;
          clip-path: none;
          padding: 0;
          transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .navbar-inner::before {
          content: "";
          position: absolute;
          top: 0;
          left: 18%;
          right: 18%;
          height: 1.5px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--nav-gold),
            transparent
          );
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s ease;
        }

        /* Warna Kontras Jelas Sebelum Scroll (Di atas background hero terang #F5F5F0) */
        .navbar-wrapper:not(.scrolled) .nav-logo-title {
          color: #1c050c !important;
          font-family: 'Oswald', Impact, sans-serif !important;
          font-size: 1.35rem;
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: 0.01em;
          text-transform: uppercase;
        }
        .navbar-wrapper.scrolled .nav-logo-title {
          color: #fff9fa !important;
        }
        .navbar-wrapper:not(.scrolled) .nav-logo-slash {
          color: #d96b7e !important;
        }
        .navbar-wrapper:not(.scrolled) .brand-telemetry-sub {
          color: #5A484E !important;
        }
        .navbar-wrapper:not(.scrolled) .brand-emblem {
          background: rgba(28, 5, 12, 0.08) !important;
          border: 1px solid rgba(28, 5, 12, 0.22) !important;
          color: #1c050c !important;
        }
        .navbar-wrapper:not(.scrolled) .brand-cluster:hover .brand-emblem {
          background: #1c050c !important;
          color: #fff9fa !important;
          border-color: #1c050c !important;
        }
        .navbar-wrapper:not(.scrolled) .nav-hud-deck {
          background: rgba(28, 6, 14, 0.88) !important;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 232, 236, 0.22) !important;
          box-shadow: 0 10px 30px rgba(18, 3, 8, 0.35) !important;
        }
        .navbar-wrapper:not(.scrolled) .nav-link {
          color: #f7eef0 !important;
        }
        .navbar-wrapper:not(.scrolled) .nav-link:hover,
        .navbar-wrapper:not(.scrolled) .nav-link.active {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.08) !important;
        }
        .navbar-wrapper:not(.scrolled) .nav-link.active {
          border-color: rgba(255, 224, 181, 0.4) !important;
        }
        .navbar-wrapper:not(.scrolled) .nav-index {
          color: #ffe0b5 !important;
        }
        .navbar-wrapper:not(.scrolled) .deck-corner {
          border-color: #ffe0b5 !important;
        }
        .navbar-wrapper:not(.scrolled) .nav-action-btn {
          background: #1c050c !important;
          color: #fff9fa !important;
          border-color: #1c050c !important;
        }
        .navbar-wrapper:not(.scrolled) .nav-action-btn:hover {
          background: #d96b7e !important;
          border-color: #d96b7e !important;
        }
        .navbar-wrapper:not(.scrolled) .burger-line {
          background: #1c050c !important;
        }

        /* 2. SAAT DI-SCROLL: Meramping Menjadi Architectural Telemetry Console Gelap */
        .navbar-wrapper.scrolled .navbar-inner {
          max-width: 1080px;
          background: var(--nav-bg-scrolled);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid var(--nav-border);
          padding: 0.55rem 1.15rem;
          clip-path: polygon(
            12px 0,
            100% 0,
            100% calc(100% - 12px),
            calc(100% - 12px) 100%,
            0 100%,
            0 12px
          );
          box-shadow: 0 20px 44px rgba(18, 3, 8, 0.45);
        }

        .navbar-wrapper.scrolled .navbar-inner::before {
          opacity: 0.75;
        }

        /* 1. KIRI: Brand Identity + Live Telemetry Clock */
        .brand-cluster {
          display: inline-flex;
          align-items: center;
          gap: 0.85rem;
          text-decoration: none;
          color: var(--nav-text);
          group: brand;
        }

        .brand-emblem {
          position: relative;
          width: 2.25rem;
          height: 2.25rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--nav-bg-glass);
          border: 1px solid var(--nav-border);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--nav-gold);
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .brand-cluster:hover .brand-emblem {
          background: var(--nav-gold);
          color: var(--nav-dark);
          border-color: var(--nav-gold);
          transform: translateY(-2px);
        }

        .brand-text-col {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .nav-logo-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 800;
          line-height: 1;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--nav-text);
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .nav-logo-slash {
          color: var(--nav-gold);
          font-weight: 700;
        }

        .brand-telemetry-sub {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--nav-text-muted);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        /* 2. TENGAH: Architectural Bracket Navigation Deck */
        .nav-hud-deck {
          position: relative;
          background: var(--nav-bg-glass);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid var(--nav-border);
          padding: 0.32rem 0.45rem;
          border-radius: 4px;
          transition: all 0.35s ease;
        }

        .navbar-wrapper.scrolled .nav-hud-deck {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 232, 236, 0.14);
        }

        /* Siku L-Bracket khas panel Hero */
        .deck-corner {
          position: absolute;
          width: 6px;
          height: 6px;
          border: 1.5px solid var(--nav-gold);
          pointer-events: none;
          opacity: 0.85;
          transition: width 0.25s ease, height 0.25s ease;
        }
        .nav-hud-deck:hover .deck-corner {
          width: 9px;
          height: 9px;
        }
        .dc-tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
        .dc-tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
        .dc-bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
        .dc-br { bottom: -1px; right: -1px; border-left: none; border-top: none; }

        .nav-list {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
        }

        /* Garis pemisah teknis antar menu */
        .nav-item:not(:last-child)::after {
          content: "";
          width: 1px;
          height: 14px;
          background: rgba(255, 232, 236, 0.16);
          margin-left: 0.25rem;
        }

        .nav-link {
          position: relative;
          display: inline-flex;
          align-items: baseline;
          gap: 0.4rem;
          color: var(--nav-text-muted);
          text-decoration: none;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.5rem 0.95rem;
          border-radius: 2px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .nav-index {
          font-family: var(--font-display);
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--nav-gold);
          opacity: 0.7;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .nav-link:hover {
          color: var(--nav-text);
          background: rgba(255, 255, 255, 0.08);
        }

        .nav-link:hover .nav-index {
          opacity: 1;
          transform: translateY(-1px);
        }

        .nav-link.active {
          color: var(--nav-dark);
          background: linear-gradient(135deg, #fff9fa 0%, var(--nav-gold) 100%);
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.22);
        }

        .nav-link.active .nav-index {
          color: var(--nav-dark);
          opacity: 0.85;
        }

        /* 3. KANAN: Chamfered Telemetry Action CTA */
        .nav-action-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          background: var(--nav-bg-glass);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid var(--nav-border-strong);
          color: var(--nav-text);
          height: 2.65rem;
          padding: 0 1.2rem;
          font-family: var(--font-sans);
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 8px),
            calc(100% - 8px) 100%,
            0 100%
          );
          box-shadow: 0 10px 26px rgba(28, 5, 12, 0.25);
          transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-action-btn:hover {
          background: linear-gradient(135deg, #fff9fa 0%, var(--nav-gold) 100%);
          color: var(--nav-dark);
          border-color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(28, 5, 12, 0.38);
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 9px #4ade80;
          animation: pulseDot 2s infinite ease-in-out;
        }

        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.82); opacity: 0.5; }
        }

        .btn-arrow {
          width: 14px;
          height: 14px;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-action-btn:hover .btn-arrow {
          transform: translate(3px, -3px);
        }

        /* 4. Tombol Menu Mobile (Morphing Toggle & Close di Posisi yang Sama) */
        .mobile-toggle {
          display: none;
          width: 44px;
          height: 44px;
          background: rgba(28, 6, 14, 0.7);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: #fff9fa;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 0;
          box-sizing: border-box;
          position: relative;
          z-index: 100000005;
        }

        /* Sebelum scroll: tombol mobile transparan/halus di atas hero */
        .navbar-wrapper:not(.scrolled) .mobile-toggle {
          background: rgba(255, 255, 255, 0.75);
          border-color: rgba(28, 5, 12, 0.2);
          color: #1c050c;
        }

        /* Saat menu drawer terbuka: tombol selalu kontras terang dengan border bercahaya */
        .navbar-wrapper.mobile-open .mobile-toggle,
        .mobile-toggle.open {
          background: rgba(255, 255, 255, 0.12) !important;
          border-color: rgba(255, 224, 181, 0.5) !important;
          color: #ffe0b5 !important;
          box-shadow: 0 0 16px rgba(255, 224, 181, 0.3) !important;
        }

        .mobile-toggle:hover {
          border-color: rgba(255, 255, 255, 0.55);
          color: var(--nav-gold);
        }

        .burger-lines {
          width: 18px;
          height: 14px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .burger-line {
          position: absolute;
          width: 18px;
          height: 2px;
          background: currentColor;
          border-radius: 2px;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 0.25s ease;
        }

        .burger-line.l1 {
          transform: translateY(-4px);
        }

        .burger-line.l2 {
          transform: translateY(4px);
        }

        /* Morphing baris hamburger menjadi X di tempat yang sama */
        .mobile-toggle.open .burger-line.l1 {
          transform: translateY(0) rotate(45deg);
        }

        .mobile-toggle.open .burger-line.l2 {
          transform: translateY(0) rotate(-45deg);
        }

        /* 5. Luxury Frosted Velvet Mobile Drawer (Bukan Hitam, Penuh Warna & Animasi Hidup) */
        .mobile-overlay-drawer {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          z-index: 99999990;
          /* Warna latar mewah: gradient wine/berry kaya yang terlihat jelas, bukan hitam pekat */
          background: linear-gradient(150deg, rgba(46, 10, 24, 0.96) 0%, rgba(26, 5, 14, 0.98) 55%, rgba(62, 14, 34, 0.95) 100%);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 6.5rem 1.75rem 2.25rem 1.75rem;
          box-sizing: border-box;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: scale(0.97);
          transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      visibility 0.35s;
        }

        .mobile-overlay-drawer.active {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: scale(1);
        }

        /* Ambient Glowing Orbs yang Bergerak Hidup di Belakang Menu */
        .mobile-ambient-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(65px);
          z-index: 0;
        }

        .mobile-ambient-orb.orb-1 {
          width: 280px;
          height: 280px;
          top: 12%;
          right: -40px;
          background: radial-gradient(circle, rgba(235, 78, 120, 0.38) 0%, transparent 70%);
          animation: ambientDrift1 6s infinite ease-in-out alternate;
        }

        .mobile-ambient-orb.orb-2 {
          width: 320px;
          height: 320px;
          bottom: 10%;
          left: -60px;
          background: radial-gradient(circle, rgba(255, 224, 181, 0.28) 0%, transparent 70%);
          animation: ambientDrift2 7.5s infinite ease-in-out alternate;
        }

        @keyframes ambientDrift1 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          100% { transform: translate(-30px, 40px) scale(1.2); opacity: 0.85; }
        }

        @keyframes ambientDrift2 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          100% { transform: translate(35px, -35px) scale(1.25); opacity: 0.8; }
        }

        /* Body Drawer */
        .mobile-drawer-body {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 1.5rem 0.5rem;
          flex: 1;
          box-sizing: border-box;
        }

        .mobile-nav-eyebrow {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-sans);
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255, 235, 240, 0.6);
          margin-bottom: 2rem;
        }

        .mobile-nav-eyebrow-beacon {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--nav-gold);
          box-shadow: 0 0 10px var(--nav-gold);
          animation: radarPulse 2s infinite ease-in-out;
        }

        @keyframes radarPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.6; }
        }

        .mobile-nav-links {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: clamp(0.85rem, 2.8vh, 1.6rem);
        }

        /* Link Navigasi Font Sans Website yang Terlihat Sangat Jelas & Penuh Animasi */
        .mobile-nav-link {
          font-family: var(--font-sans);
          font-size: clamp(2.3rem, 8vw, 3.2rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #ffffff;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          width: fit-content;
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.45);
        }

        /* Animasi Spring Bertingkat yang Hidup */
        .mobile-overlay-drawer.active .mobile-nav-link {
          animation: mobileItemSpring 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .mobile-overlay-drawer.active .mobile-nav-link:nth-child(1) { animation-delay: 0.08s; }
        .mobile-overlay-drawer.active .mobile-nav-link:nth-child(2) { animation-delay: 0.15s; }
        .mobile-overlay-drawer.active .mobile-nav-link:nth-child(3) { animation-delay: 0.22s; }
        .mobile-overlay-drawer.active .mobile-nav-link:nth-child(4) { animation-delay: 0.29s; }
        .mobile-overlay-drawer.active .mobile-nav-link:nth-child(5) { animation-delay: 0.36s; }

        @keyframes mobileItemSpring {
          0% {
            opacity: 0;
            transform: translateX(-30px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .mobile-nav-arrow {
          font-size: 1.5rem;
          color: var(--nav-gold);
          opacity: 0;
          transform: translateX(-14px);
          transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .mobile-nav-link:hover .mobile-nav-arrow,
        .mobile-nav-link.active .mobile-nav-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          color: #ffe0b5;
          transform: translateX(8px);
          text-shadow: 0 0 24px rgba(255, 224, 181, 0.55);
        }

        .mobile-active-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 12px #34d399;
          margin-left: 0.4rem;
          animation: pulseDot 2s infinite ease-in-out;
        }

        /* Footer: Garis Divider Bersih dengan Efek Cahaya Bergerak */
        .mobile-drawer-footer {
          position: relative;
          z-index: 2;
          width: 100%;
          padding: 1.25rem 0.5rem 0;
          box-sizing: border-box;
        }

        .mobile-footer-divider {
          width: 100%;
          height: 1.5px;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 224, 181, 0.6) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: dividerSweep 4s infinite ease-in-out;
        }

        @keyframes dividerSweep {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }

        @media (max-width: 920px) {
          /* Sebelum di-scroll: Transparan tanpa warna latar */
          .navbar-wrapper:not(.scrolled) {
            padding: 0.75rem 1.25rem;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }

          /* Setelah di-scroll: baru muncul glass capsule bar */
          .navbar-wrapper.scrolled {
            top: 0.25rem;
            padding: 0.6rem 1rem;
            background: var(--nav-bg-glass);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--nav-border);
            border-radius: 12px;
            box-shadow: 0 12px 30px rgba(12, 2, 6, 0.35);
          }

          /* Saat menu drawer mobile terbuka: navbar menyatu halus dengan latar drawer */
          .navbar-wrapper.mobile-open {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }

          .navbar-wrapper.mobile-open .nav-logo-title {
            color: #fff9fa !important;
          }

          .navbar-wrapper.mobile-open .brand-telemetry-sub {
            color: rgba(255, 232, 236, 0.75) !important;
          }

          .nav-hud-deck,
          .nav-action-btn.desktop-only {
            display: none;
          }

          .mobile-toggle {
            display: inline-flex;
          }
        }
      `}</style>

      <div className="navbar-inner">
        {/* 1. Kiri: Brand Monogram + Nama + Live Telemetry Clock */}
        <a href="#home" onClick={handleScrollTop} className="brand-cluster">
          <span className="brand-emblem">NS</span>
          <div className="brand-text-col">
            <span className="nav-logo-title">
              NIKMATUS SOLIHAH
            </span>
            <span className="brand-telemetry-sub">
              <span>IDN</span>
              <span>·</span>
              <span>{localTime || "SEASON 2026"}</span>
            </span>
          </div>
        </a>

        {/* 2. Tengah: Architectural Bracket HUD Deck */}
        <nav className="nav-hud-deck" aria-label="Main Navigation">
          <span className="deck-corner dc-tl" />
          <span className="deck-corner dc-tr" />
          <span className="deck-corner dc-bl" />
          <span className="deck-corner dc-br" />

          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.label} className="nav-item">
                <a
                  href={item.href}
                  className={`nav-link ${activeTab === item.label ? "active" : ""}`}
                  onClick={(e) => handleNavClick(e, item.href, item.label)}
                >
                  <span className="nav-index">{item.index}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* 3. Kanan: Tombol Action Chamfered */}
        <button
          type="button"
          onClick={handleConnectClick}
          className="nav-action-btn desktop-only"
        >
          <span className="status-dot" />
          <span>Let&apos;s Connect</span>
          <svg
            className="btn-arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </button>

        {/* 4. Tombol Menu Mobile (Satu Tombol: Buka & Tutup di Tempat yang Sama Persis) */}
        <button
          type="button"
          className={`mobile-toggle ${mobileMenuOpen ? "open" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <div className="burger-lines">
            <span className="burger-line l1" />
            <span className="burger-line l2" />
          </div>
        </button>
      </div>

      {/* 5. Minimalist Fullscreen Overlay Mobile Drawer (Warna Hidup & Animasi Interaktif) */}
      {typeof document !== "undefined" &&
        createPortal(
          <div
            className={`mobile-overlay-drawer ${mobileMenuOpen ? "active" : ""}`}
            aria-hidden={!mobileMenuOpen}
          >
            {/* Ambient Moving Glow Orbs yang Memberi Efek Hidup & Terlihat Jelas */}
            <div className="mobile-ambient-orb orb-1" />
            <div className="mobile-ambient-orb orb-2" />

            {/* Content: Eyebrow NAVIGATION + Link Vertikal dengan Animasi Spring & Arrow */}
            <div className="mobile-drawer-body">
              <div className="mobile-nav-eyebrow">
                <span className="mobile-nav-eyebrow-beacon" />
                <span>NAVIGATION</span>
              </div>
              <nav className="mobile-nav-links">
                {mobileNavItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`mobile-nav-link ${activeTab === item.label ? "active" : ""}`}
                    onClick={(e) => handleNavClick(e, item.href, item.label)}
                  >
                    <span className="mobile-nav-arrow">→</span>
                    <span className="mobile-nav-text">{item.label}</span>
                    {activeTab === item.label && <span className="mobile-active-dot" />}
                  </a>
                ))}
              </nav>
            </div>

            {/* Footer: Garis Divider dengan Efek Cahaya Bergerak */}
            <div className="mobile-drawer-footer">
              <div className="mobile-footer-divider" />
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}