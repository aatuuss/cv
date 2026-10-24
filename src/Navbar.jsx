import React, { useState, useEffect } from "react";

export default function Navbar({ onNavigateComments }) {
  const [activeTab, setActiveTab] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [localTime, setLocalTime] = useState("");

  const navItems = [
    { index: "01", label: "About", href: "#about" },
    { index: "02", label: "Skills", href: "#skills" },
    { index: "03", label: "Projects", href: "#projects" },
    { index: "04", label: "Contact", href: "#contact" },
  ];

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
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 240 && rect.bottom >= 160) {
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

        .navbar-inner {
          pointer-events: auto;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 1360px;
          margin: 0 auto;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Saat di-scroll: Berubah menjadi Architectural Telemetry Console (Bukan kapsul bulat pasaran) */
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

        /* Garis aksen emas tipis di atas bar saat scrolled */
        .navbar-wrapper.scrolled .navbar-inner::before {
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
          opacity: 0.75;
          pointer-events: none;
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

        /* 4. Tombol Menu Mobile (Bespoke Telemetry Trigger) */
        .mobile-toggle {
          display: none;
          position: relative;
          background: var(--nav-bg-glass);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--nav-border);
          color: var(--nav-text);
          width: 42px;
          height: 40px;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .mobile-toggle:hover {
          border-color: var(--nav-gold);
          color: var(--nav-gold);
        }

        .burger-lines {
          width: 18px;
          height: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;
        }

        .burger-line {
          height: 2px;
          background: currentColor;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .burger-line.l1 { width: 18px; }
        .burger-line.l2 { width: 12px; color: var(--nav-gold); }
        .burger-line.l3 { width: 15px; }

        .mobile-toggle.open .l1 {
          transform: translateY(5px) rotate(45deg);
          width: 18px;
        }
        .mobile-toggle.open .l2 {
          opacity: 0;
        }
        .mobile-toggle.open .l3 {
          transform: translateY(-5px) rotate(-45deg);
          width: 18px;
        }

        /* Dropdown Mobile Berkonsep HUD Panel */
        .mobile-dropdown {
          display: none;
        }

        @media (max-width: 920px) {
          .navbar-wrapper {
            padding: 1rem 1.25rem;
          }

          .navbar-wrapper.scrolled {
            top: 0.4rem;
            padding: 0.5rem 0.85rem;
          }

          .nav-hud-deck,
          .nav-action-btn.desktop-only {
            display: none;
          }

          .mobile-toggle {
            display: inline-flex;
          }

          .mobile-dropdown {
            display: ${mobileMenuOpen ? "flex" : "none"};
            flex-direction: column;
            gap: 0.45rem;
            position: absolute;
            top: calc(100% + 0.65rem);
            left: 0;
            right: 0;
            background: rgba(28, 6, 14, 0.94);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--nav-border-strong);
            padding: 1.15rem;
            clip-path: polygon(
              0 0,
              100% 0,
              100% calc(100% - 14px),
              calc(100% - 14px) 100%,
              0 100%
            );
            box-shadow: 0 24px 48px rgba(12, 2, 6, 0.55);
          }

          .mobile-dropdown .nav-link {
            width: 100%;
            box-sizing: border-box;
            justify-content: space-between;
            padding: 0.8rem 1rem;
            border: 1px solid rgba(255, 232, 236, 0.08);
          }

          .mobile-dropdown .nav-action-btn {
            width: 100%;
            justify-content: center;
            margin-top: 0.4rem;
            background: linear-gradient(135deg, #fff9fa 0%, var(--nav-gold) 100%);
            color: var(--nav-dark);
          }
        }
      `}</style>

      <div className="navbar-inner">
        {/* 1. Kiri: Brand Monogram + Nama + Live Telemetry Clock */}
        <a href="#home" onClick={handleScrollTop} className="brand-cluster">
          <span className="brand-emblem">NS</span>
          <div className="brand-text-col">
            <span className="nav-logo-title">
              NIKMATUS<span className="nav-logo-slash">//</span>26
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
                  onClick={() => setActiveTab(item.label)}
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
          onClick={onNavigateComments}
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

        {/* 4. Tombol Menu Mobile */}
        <button
          type="button"
          className={`mobile-toggle ${mobileMenuOpen ? "open" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <div className="burger-lines">
            <span className="burger-line l1" />
            <span className="burger-line l2" />
            <span className="burger-line l3" />
          </div>
        </button>

        {/* 5. Menu Dropdown Mobile */}
        <div className="mobile-dropdown">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`nav-link ${activeTab === item.label ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.label);
                setMobileMenuOpen(false);
              }}
            >
              <span>{item.label}</span>
              <span className="nav-index">/{item.index}</span>
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              if (onNavigateComments) onNavigateComments();
            }}
            className="nav-action-btn"
          >
            <span className="status-dot" />
            <span>Let&apos;s Connect</span>
          </button>
        </div>
      </div>
    </header>
  );
}