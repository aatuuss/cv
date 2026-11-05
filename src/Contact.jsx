import React, { useState } from "react";

export default function Contact() {
  const [selectedTopic, setSelectedTopic] = useState("Web Development");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [copied, setCopied] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const topics = [
    "Web Development",
    "UI/UX Design",
    "Full-Stack System",
    "Creative Motion & 3D",
    "Konsultasi / Lainnya",
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("nikmatus.solihah@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 4500);
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Halo Nikmatus, saya ${formData.name || "[Nama]"}. Saya tertarik berdiskusi mengenai topik ${selectedTopic}: ${formData.message || "proyek baru"}`
    );
    window.open(`https://wa.me/6281200000000?text=${text}`, "_blank");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="contact-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Oswald:wght@500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .contact-section {
          --ct-bg-deep: #120308;
          --ct-bg-mid: #1c050e;
          --ct-surface: rgba(35, 8, 18, 0.65);
          --ct-surface-card: rgba(45, 11, 23, 0.82);
          --ct-border: rgba(255, 232, 236, 0.16);
          --ct-border-gold: rgba(255, 224, 181, 0.38);
          --ct-border-rose: rgba(247, 168, 184, 0.45);
          --ct-text: #fff9fa;
          --ct-text-muted: rgba(255, 235, 240, 0.7);
          --ct-gold: #ffe0b5;
          --ct-rose: #f7a8b8;
          --ct-dark: #2a0712;
          --font-display: 'Oswald', Impact, sans-serif;
          --font-sans: 'Space Grotesk', system-ui, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;

          position: relative;
          z-index: 20;
          width: 100%;
          min-height: 100vh;
          background: radial-gradient(
            circle at 65% 20%,
            #320918 0%,
            var(--ct-bg-mid) 45%,
            var(--ct-bg-deep) 100%
          );
          color: var(--ct-text);
          font-family: var(--font-sans);
          padding: 6.5rem 2.5rem 3.5rem;
          box-sizing: border-box;
          border-top: 1px solid var(--ct-border-gold);
          overflow: hidden;
        }

        /* Subtle Ambient Grid */
        .contact-ambient-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 4.5rem 4.5rem;
          pointer-events: none;
          z-index: 1;
        }

        .contact-glow-orb {
          position: absolute;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(247, 168, 184, 0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
          bottom: 5%;
          right: -100px;
          filter: blur(50px);
        }

        .contact-container {
          position: relative;
          z-index: 2;
          max-width: 1360px;
          margin: 0 auto;
        }

        /* 1. Header Bar Berkonsep HUD Telemetry */
        .contact-header-bar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--ct-border);
          margin-bottom: 3.5rem;
          gap: 1.5rem;
        }

        .contact-kicker {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          color: var(--ct-gold);
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }

        .contact-main-heading {
          font-family: var(--font-display);
          font-size: clamp(2.4rem, 4.6vw, 4.2rem);
          font-weight: 800;
          text-transform: uppercase;
          line-height: 0.95;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .contact-heading-outline {
          color: transparent;
          -webkit-text-stroke: 1.4px var(--ct-gold);
          margin-left: 0.45rem;
        }

        .contact-status-beacon {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.45rem 1rem;
          border-radius: 999px;
          background: rgba(30, 6, 14, 0.85);
          border: 1px solid rgba(74, 222, 128, 0.45);
          font-family: var(--font-mono);
          font-size: 0.74rem;
          color: #86efac;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }

        .beacon-pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 10px #4ade80;
          animation: pulseBeacon 2s infinite ease-in-out;
        }

        @keyframes pulseBeacon {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.85); }
        }

        /* 2. Grid Dua Kolom Utama */
        .contact-main-grid {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: 3.5rem;
          align-items: stretch;
          margin-bottom: 5rem;
        }

        /* KOLOM KIRI: Direct Transmission Channels */
        .contact-info-col {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .contact-intro-card {
          position: relative;
          background: var(--ct-surface);
          border: 1px solid var(--ct-border);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 2.25rem;
          clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 14px),
            calc(100% - 14px) 100%,
            0 100%
          );
        }

        .contact-intro-text {
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--ct-text-muted);
          margin: 0 0 1.75rem;
        }

        /* Email Hero Box */
        .email-direct-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 1.4rem;
          background: rgba(18, 3, 8, 0.85);
          border: 1px solid var(--ct-border-gold);
          border-radius: 12px;
          gap: 1rem;
        }

        .email-address-text {
          font-family: var(--font-mono);
          font-size: 0.95rem;
          font-weight: 600;
          color: #fff9fa;
          letter-spacing: 0.04em;
          word-break: break-all;
        }

        .email-copy-action {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          background: linear-gradient(135deg, #fff9fa 0%, var(--ct-gold) 100%);
          color: var(--ct-dark);
          font-family: var(--font-mono);
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .email-copy-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(255, 224, 181, 0.4);
        }

        /* Saluran Sosial & Direct Links */
        .contact-channels-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .channel-card-link {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.15rem 1.35rem;
          background: var(--ct-surface);
          border: 1px solid var(--ct-border);
          text-decoration: none;
          color: var(--ct-text);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 10px),
            calc(100% - 10px) 100%,
            0 100%
          );
        }

        .channel-card-link:hover {
          background: var(--ct-surface-card);
          border-color: var(--ct-border-rose);
          transform: translateY(-3px);
          box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.6);
        }

        .channel-meta-left {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .channel-name-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .channel-handle-sub {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--ct-rose);
        }

        .channel-arrow-icon {
          color: var(--ct-gold);
          transition: transform 0.25s ease;
        }

        .channel-card-link:hover .channel-arrow-icon {
          transform: translate(3px, -3px);
        }

        /* Telemetry Status Specs */
        .telemetry-specs-box {
          position: relative;
          background: var(--ct-surface);
          border: 1px solid var(--ct-border);
          padding: 1.5rem 1.85rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 10px),
            calc(100% - 10px) 100%,
            0 100%
          );
        }

        .spec-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .spec-label {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ct-gold);
        }

        .spec-value {
          font-size: 0.88rem;
          font-weight: 600;
          color: #fff9fa;
        }

        /* KOLOM KANAN: Transmission Terminal Console */
        .contact-form-console {
          position: relative;
          background: var(--ct-surface-card);
          border: 1px solid var(--ct-border);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 16px),
            calc(100% - 16px) 100%,
            0 100%
          );
        }

        /* Chamfer Corner Accents */
        .b-corner {
          position: absolute;
          width: 9px;
          height: 9px;
          border-color: var(--ct-border-gold);
          border-style: solid;
          pointer-events: none;
        }
        .b-corner.tl { top: 0; left: 0; border-width: 2px 0 0 2px; }
        .b-corner.tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
        .b-corner.bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; }
        .b-corner.br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

        .console-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.75rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--ct-border);
        }

        .console-title {
          font-family: var(--font-mono);
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--ct-gold);
          text-transform: uppercase;
        }

        .console-tag {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--ct-rose);
        }

        /* Scope Pills Selection */
        .topic-selector-label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ct-text-muted);
          margin-bottom: 0.65rem;
          display: block;
        }

        .topic-pills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.75rem;
        }

        .topic-pill-btn {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          padding: 0.4rem 0.85rem;
          background: rgba(20, 4, 10, 0.65);
          border: 1px solid var(--ct-border);
          color: var(--ct-text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
          clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 6px),
            calc(100% - 6px) 100%,
            0 100%
          );
        }

        .topic-pill-btn.active {
          background: var(--ct-gold);
          color: var(--ct-dark);
          border-color: var(--ct-gold);
          font-weight: 700;
          box-shadow: 0 0 14px rgba(255, 224, 181, 0.4);
        }

        /* Form Fields */
        .console-form-body {
          display: flex;
          flex-direction: column;
          gap: 1.35rem;
        }

        .form-row-double {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-field-group {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .field-label {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ct-gold);
        }

        .field-input,
        .field-textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 0.85rem 1rem;
          background: rgba(18, 3, 8, 0.75);
          border: 1px solid var(--ct-border);
          border-radius: 6px;
          color: #fff9fa;
          font-family: var(--font-sans);
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .field-input:focus,
        .field-textarea:focus {
          border-color: var(--ct-gold);
          box-shadow: 0 0 16px rgba(255, 224, 181, 0.2);
        }

        .field-textarea {
          min-height: 110px;
          resize: vertical;
        }

        /* Action Buttons */
        .form-actions-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 1.75rem;
        }

        .submit-transmit-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          padding: 0.95rem 1.6rem;
          background: linear-gradient(135deg, #fff9fa 0%, var(--ct-gold) 100%);
          color: var(--ct-dark);
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 10px),
            calc(100% - 10px) 100%,
            0 100%
          );
        }

        .submit-transmit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 224, 181, 0.45);
        }

        .wa-quick-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.95rem 1.35rem;
          background: rgba(20, 4, 10, 0.85);
          border: 1px solid rgba(74, 222, 128, 0.5);
          color: #86efac;
          font-family: var(--font-mono);
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .wa-quick-btn:hover {
          background: rgba(74, 222, 128, 0.15);
          transform: translateY(-2px);
        }

        /* Success Alert */
        .transmission-success-toast {
          margin-top: 1.25rem;
          padding: 0.9rem 1.2rem;
          background: rgba(74, 222, 128, 0.14);
          border: 1px solid #4ade80;
          color: #86efac;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        /* 3. Footer Bar Bawah */
        .contact-footer-bar {
          padding-top: 2.25rem;
          border-top: 1px solid var(--ct-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.74rem;
          color: var(--ct-text-muted);
          gap: 1.5rem;
        }

        .footer-left-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .back-to-top-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.45rem 0.95rem;
          background: transparent;
          border: 1px solid var(--ct-border);
          color: var(--ct-gold);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .back-to-top-btn:hover {
          background: var(--ct-surface);
          border-color: var(--ct-gold);
          color: #fff9fa;
        }

        @media (max-width: 960px) {
          .contact-section {
            padding: 5rem 1.25rem 2.5rem;
          }
          .contact-header-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .contact-main-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .contact-channels-grid {
            grid-template-columns: 1fr;
          }
          .form-row-double {
            grid-template-columns: 1fr;
          }
          .form-actions-row {
            flex-direction: column;
            align-items: stretch;
          }
          .telemetry-specs-box {
            grid-template-columns: 1fr;
          }
          .contact-footer-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>

      <div className="contact-ambient-grid" aria-hidden="true" />
      <div className="contact-glow-orb" aria-hidden="true" />

      <div className="contact-container">
        {/* 1. Top Header HUD */}
        <header className="contact-header-bar">
          <div>
            <h2 className="contact-main-heading">
              READY TO BUILD
              <span className="contact-heading-outline">SOMETHING ICONIC?</span>
            </h2>
          </div>

          <div className="contact-status-beacon">
            <span className="beacon-pulse-dot" />
            <span>STATUS: OPEN FOR NEW PROJECTS</span>
          </div>
        </header>

        {/* 2. Main 2-Column Grid */}
        <div className="contact-main-grid">
          {/* KOLOM KIRI: Direct Transmission Channels & Specs */}
          <div className="contact-info-col">
            <div className="contact-intro-card">
              <span className="b-corner tl" />
              <span className="b-corner tr" />
              <span className="b-corner bl" />
              <span className="b-corner br" />

              <p className="contact-intro-text">
                Saya selalu antusias berkolaborasi dalam perancangan antarmuka digital modern,
                pengembangan web interaktif performa tinggi, maupun inisiatif sistem baru.
                Hubungi saya langsung melalui email atau saluran di bawah:
              </p>

              <div className="email-direct-box">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--ct-gold)", letterSpacing: "0.1em" }}>
                    OFFICIAL INBOX TRANSMISSION
                  </span>
                  <span className="email-address-text">nikmatus.solihah@gmail.com</span>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="email-copy-action"
                    title="Salin alamat email"
                  >
                    {copied ? "✓ Tersalin!" : "Salin Email"}
                  </button>
                  <a
                    href="mailto:nikmatus.solihah@gmail.com"
                    className="email-copy-action"
                    style={{ background: "rgba(255, 255, 255, 0.1)", color: "#fff9fa", textDecoration: "none" }}
                    title="Kirim email via aplikasi"
                  >
                    Mailto ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Saluran Komunikasi Cepat */}
            <div className="contact-channels-grid">
              <a
                href="https://wa.me/6281200000000"
                target="_blank"
                rel="noreferrer"
                className="channel-card-link"
              >
                <span className="b-corner tl" />
                <div className="channel-meta-left">
                  <span className="channel-name-title">WhatsApp</span>
                  <span className="channel-handle-sub">Direct Fast Chat</span>
                </div>
                <span className="channel-arrow-icon">↗</span>
              </a>

              <a
                href="https://linkedin.com/in/nikmatussolihah"
                target="_blank"
                rel="noreferrer"
                className="channel-card-link"
              >
                <span className="b-corner tl" />
                <div className="channel-meta-left">
                  <span className="channel-name-title">LinkedIn</span>
                  <span className="channel-handle-sub">in/nikmatussolihah</span>
                </div>
                <span className="channel-arrow-icon">↗</span>
              </a>

              <a
                href="https://github.com/nikmatussolihah"
                target="_blank"
                rel="noreferrer"
                className="channel-card-link"
              >
                <span className="b-corner tl" />
                <div className="channel-meta-left">
                  <span className="channel-name-title">GitHub</span>
                  <span className="channel-handle-sub">@nikmatussolihah</span>
                </div>
                <span className="channel-arrow-icon">↗</span>
              </a>

              <a
                href="https://instagram.com/nikmatus.dev"
                target="_blank"
                rel="noreferrer"
                className="channel-card-link"
              >
                <span className="b-corner tl" />
                <div className="channel-meta-left">
                  <span className="channel-name-title">Instagram</span>
                  <span className="channel-handle-sub">@nikmatus.dev</span>
                </div>
                <span className="channel-arrow-icon">↗</span>
              </a>
            </div>

            {/* Telemetry Status Specs */}
            <div className="telemetry-specs-box">
              <span className="b-corner tl" />
              <span className="b-corner tr" />
              <div className="spec-item">
                <span className="spec-label">BASE LOCATION</span>
                <span className="spec-value">🇮🇩 Indonesia · GMT+7 (WIB)</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">COLLABORATION SCOPE</span>
                <span className="spec-value">Freelance / Full-Time / Contract</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">ESTIMATED RESPONSE</span>
                <span className="spec-value">&le; 24 Jam Kerja</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">CORE FOCUS</span>
                <span className="spec-value">React, Next.js, UI/UX, Three.js</span>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: Transmission Console Form */}
          <div className="contact-form-console">
            <span className="b-corner tl" />
            <span className="b-corner tr" />
            <span className="b-corner bl" />
            <span className="b-corner br" />

            <div>
              <header className="console-header">
                <span className="console-title">COMMUNICATION DISPATCH TERMINAL</span>
                <span className="console-tag">TRANSMISSION // ENCRYPTED</span>
              </header>

              {/* Topic Selector */}
              <span className="topic-selector-label">PILIH TOPIK INQUIRY / KEBUTUHAN:</span>
              <div className="topic-pills-row">
                {topics.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTopic(t)}
                    className={`topic-pill-btn ${selectedTopic === t ? "active" : ""}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handleSubmit} className="console-form-body">
                <div className="form-row-double">
                  <div className="form-field-group">
                    <label className="field-label">NAMA LENGKAP *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe / Perusahaan"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="field-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">ALAMAT EMAIL *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. email@perusahaan.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="field-input"
                    />
                  </div>
                </div>

                <div className="form-field-group">
                  <label className="field-label">WHATSAPP / NO. KONTAK (OPSIONAL)</label>
                  <input
                    type="text"
                    placeholder="e.g. +62 812-xxxx-xxxx"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="field-input"
                  />
                </div>

                <div className="form-field-group">
                  <label className="field-label">PESAN / RINCIAN PROYEK *</label>
                  <textarea
                    required
                    placeholder="Ceritakan gambaran proyek, target waktu, dan kebutuhan spesifik Anda..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="field-textarea"
                  />
                </div>

                <div className="form-actions-row">
                  <button type="submit" className="submit-transmit-btn">
                    <span>TRANSMIT MESSAGE</span>
                    <span>→</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="wa-quick-btn"
                    title="Kirim draf pesan ini langsung via WhatsApp"
                  >
                    <span>Kirim via WA</span>
                    <span>↗</span>
                  </button>
                </div>

                {isSent && (
                  <div className="transmission-success-toast">
                    <span>✓</span>
                    <span>
                      Pesan berhasil dikirimkan! Terima kasih, saya akan segera menghubungi Anda kembali.
                    </span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* 3. Footer Bar Bawah */}
        <div className="contact-footer-bar">
          <div className="footer-left-info">
            <span style={{ fontFamily: "'Oswald', Impact, sans-serif", fontWeight: 800, letterSpacing: "0.01em", textTransform: "uppercase" }}>NIKMATUS SOLIHAH</span>
            <span>·</span>
            <span>CREATIVE DEVELOPER &amp; UI/UX DESIGNER</span>
            <span>·</span>
            <span>SEASON 2026</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span>INDONESIA // ALL RIGHTS RESERVED</span>
            <button type="button" onClick={scrollToTop} className="back-to-top-btn">
              <span>BACK TO TOP</span>
              <span>↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
