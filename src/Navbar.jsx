import React, { useState, useEffect } from "react";

export default function Navbar({ onNavigateComments }) {
  const [activeTab, setActiveTab] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  const handleScrollTop = (e) => {
    e.preventDefault();
    setActiveTab("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className={`navbar-wrapper ${isScrolled ? "scrolled" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Plus+Jakarta+Sans:wght@600;700&family=Space+Grotesk:wght@700&display=swap');

        /* 1. KONDISI SEBELUM DI-SCROLL (Before) */
        .navbar-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 3rem;
          box-sizing: border-box;
          background: transparent; /* Transparan total di atas */
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        /* 2. KONDISI SESUAI DI-SCROLL (After - Berubah jadi Floating Pill) */
        .navbar-wrapper.scrolled {
          padding: 0.75rem 1rem;
          top: 1rem; /* Ada jarak dari atas layar */
        }

        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 0 1rem;
        }

        /* Efek berubah saat scrolled (jadi kotak mengambang/pill) */
        .navbar-wrapper.scrolled .navbar-inner {
          background: rgba(17, 21, 30, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 0.6rem 1.5rem;
          border-radius: 9999px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        /* Brand Logo */
        .nav-logo {
          font-family: 'Oswald', 'Space Grotesk', Impact, sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          transition: transform 0.25s ease;
        }

        .nav-logo:hover {
          transform: translateY(-1px);
        }

        .nav-logo-dot {
          color: #ff476d;
          margin-left: 2px;
        }

        /* Kapsul Navigasi Tengah */
        .nav-pill-container {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 0.38rem;
          border-radius: 9999px;
          transition: all 0.4s ease;
        }

        .nav-list {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          display: inline-block;
          color: rgba(255, 255, 255, 0.88);
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0.55rem 1.2rem;
          border-radius: 9999px;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .nav-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.18);
        }

        .nav-link.active {
          background: #ffffff;
          color: #ff476d;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
        }

        /* Tombol Action (Let's Connect) */
        .nav-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(17, 21, 30, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          padding: 0.65rem 1.35rem;
          border-radius: 9999px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
          transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .nav-action-btn:hover {
          background: #ffffff;
          color: #ff476d;
          border-color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(255, 71, 109, 0.28);
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px #4ade80;
          animation: pulseDot 2s infinite;
        }

        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.25); opacity: 0.65; }
        }

        .btn-arrow {
          width: 14px;
          height: 14px;
          transition: transform 0.25s ease;
        }

        .nav-action-btn:hover .btn-arrow {
          transform: translate(2px, -2px);
        }

        /* Tombol Menu Mobile */
        .mobile-toggle {
          display: none;
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.35);
          color: #ffffff;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .mobile-dropdown {
          display: none;
        }

        @media (max-width: 860px) {
          .navbar-wrapper {
            padding: 1rem;
          }

          .navbar-wrapper.scrolled {
            top: 0.5rem;
            padding: 0.5rem;
          }

          .nav-pill-container,
          .nav-action-btn.desktop-only {
            display: none;
          }

          .mobile-toggle {
            display: inline-flex;
          }

          .mobile-dropdown {
            display: ${mobileMenuOpen ? "flex" : "none"};
            flex-direction: column;
            gap: 0.5rem;
            position: absolute;
            top: calc(100% + 0.5rem);
            left: 1rem;
            right: 1rem;
            background: rgba(17, 21, 30, 0.95);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border: 1px width 1px solid rgba(255, 255, 255, 0.2);
            padding: 1rem;
            border-radius: 20px;
            box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
          }

          .mobile-dropdown .nav-link {
            width: 100%;
            box-sizing: border-box;
            text-align: center;
            padding: 0.75rem;
          }

          .mobile-dropdown .nav-action-btn {
            width: 100%;
            justify-content: center;
            margin-top: 0.25rem;
            background: #ffffff;
            color: #ff476d;
          }
        }
      `}</style>

      <div className="navbar-inner">
        {/* Brand Logo */}
        <a href="#home" onClick={handleScrollTop} className="nav-logo">
          Nikmatus<span className="nav-logo-dot">.</span>
        </a>

        {/* Navigasi Utama */}
        <nav className="nav-pill-container">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`nav-link ${activeTab === item.label ? "active" : ""}`}
                  onClick={() => setActiveTab(item.label)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Tombol Action Desktop */}
        <button
          type="button"
          onClick={onNavigateComments}
          className="nav-action-btn desktop-only"
        >
          <span className="status-dot" />
          <span>Let's Connect</span>
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

        {/* Tombol Hamburger untuk Mobile */}
        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        {/* Menu Dropdown Mobile */}
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
              {item.label}
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
            <span>Let's Connect</span>
          </button>
        </div>
      </div>
    </header>
  );
}