import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

// MASUKKAN 2 DATA SERTIFIKAT ASLI ANDA DI SINI
// (Atau tempelkan kode Certificates.jsx lama Anda di chat agar saya pasangkan)
const CERTIFICATES_DATA = [
  {
    id: "01",
    title: "Judul Sertifikat 1 Anda",
    issuer: "Penyelenggara / Instansi",
    date: "2025",
    credentialId: "ID-SERTIFIKAT-01",
    image: "/sertifikat1.png", // sesuaikan dengan nama file gambar Anda
    description:
      "Deskripsi kompetensi atau pencapaian dari sertifikat pertama Anda.",
  },
  {
    id: "02",
    title: "Judul Sertifikat 2 Anda",
    issuer: "Penyelenggara / Instansi",
    date: "2025",
    credentialId: "ID-SERTIFIKAT-02",
    image: "/sertifikat2.png", // sesuaikan dengan nama file gambar Anda
    description:
      "Deskripsi kompetensi atau pencapaian dari sertifikat kedua Anda.",
  },
];

export default function Certificates() {
  const [selectedCert, setSelectedCert] = useState(null);

  // Menutup modal dengan tombol ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedCert(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section id="certificates" className="certificates-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Oswald:wght@500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .certificates-section {
          --cr-bg-deep: #140409;
          --cr-bg-mid: #230711;
          --cr-surface: rgba(46, 12, 24, 0.54);
          --cr-surface-hover: rgba(66, 17, 34, 0.78);
          --cr-border: rgba(255, 228, 234, 0.16);
          --cr-border-gold: rgba(255, 224, 181, 0.48);
          --cr-text: #fff9fa;
          --cr-text-muted: rgba(255, 232, 238, 0.7);
          --cr-gold: #ffe0b5;
          --cr-rose: #f7a8b8;
          --cr-dark: #2a0712;
          --font-display: 'Oswald', Impact, sans-serif;
          --font-sans: 'Space Grotesk', system-ui, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;

          position: relative;
          z-index: 20;
          width: 100%;
          min-height: 100vh;
          background: radial-gradient(
            circle at 75% 20%,
            #3f101f 0%,
            var(--cr-bg-mid) 48%,
            var(--cr-bg-deep) 100%
          );
          color: var(--cr-text);
          font-family: var(--font-sans);
          padding: 6.5rem 2.25rem 7.5rem;
          box-sizing: border-box;
          border-top: 1px solid var(--cr-border-gold);
          overflow: hidden;
        }

        .certs-ambient-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 4.5rem 4.5rem;
          pointer-events: none;
          z-index: 1;
        }

        .certs-container {
          position: relative;
          z-index: 2;
          max-width: 1320px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 3.25rem;
        }

        /* 1. Header Section */
        .certs-header {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding-bottom: 1.75rem;
          border-bottom: 1px solid var(--cr-border);
        }

        .certs-top-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .certs-kicker {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.32rem 0.8rem;
          background: var(--cr-surface);
          border: 1px solid var(--cr-border);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: var(--cr-gold);
          text-transform: uppercase;
        }

        .kicker-square {
          width: 6px;
          height: 6px;
          background: var(--cr-gold);
        }

        .certs-count-meta {
          font-family: var(--font-mono);
          font-size: 0.74rem;
          letter-spacing: 0.14em;
          color: var(--cr-text-muted);
          text-transform: uppercase;
        }

        .certs-heading {
          font-family: var(--font-display);
          font-size: clamp(2.4rem, 4.8vw, 4.25rem);
          font-weight: 800;
          line-height: 0.94;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          margin: 0;
        }

        .certs-heading-stroke {
          color: transparent;
          -webkit-text-stroke: 1.4px var(--cr-gold);
          margin-left: 0.35rem;
        }

        /* 2. Layout Dual-Card Seimbang Khusus 2 Sertifikat */
        .certs-dual-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 2rem;
        }

        .cert-card {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: var(--cr-surface);
          border: 1px solid var(--cr-border);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          padding: 1.65rem;
          gap: 1.35rem;
          cursor: pointer;
          box-shadow: 0 18px 44px rgba(12, 2, 6, 0.38);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      background 0.3s ease,
                      border-color 0.3s ease;
        }

        .cert-card:hover {
          transform: translateY(-5px);
          background: var(--cr-surface-hover);
          border-color: var(--cr-border-gold);
        }

        /* Siku L-Bracket khas Home, Navbar, About, & Project */
        .b-corner {
          position: absolute;
          width: 9px;
          height: 9px;
          border: 1.5px solid var(--cr-gold);
          pointer-events: none;
          transition: width 0.25s ease, height 0.25s ease;
        }

        .cert-card:hover .b-corner {
          width: 14px;
          height: 14px;
        }

        .tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
        .tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
        .bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
        .br { bottom: -1px; right: -1px; border-left: none; border-top: none; }

        /* Bingkai Gambar Sertifikat */
        .cert-preview-box {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10.5;
          background: linear-gradient(135deg, #2d0916 0%, #130308 100%);
          border: 1px solid var(--cr-border);
          overflow: hidden;
          clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 14px),
            calc(100% - 14px) 100%,
            0 100%
          );
        }

        .cert-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cert-card:hover .cert-img {
          transform: scale(1.045);
        }

        .cert-preview-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          background:
            radial-gradient(circle at 50% 40%, rgba(255, 224, 181, 0.12), transparent 70%),
            repeating-linear-gradient(
              -45deg,
              rgba(255, 255, 255, 0.02) 0px,
              rgba(255, 255, 255, 0.02) 1px,
              transparent 1px,
              transparent 9px
            );
          pointer-events: none;
        }

        .fallback-label {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: rgba(255, 224, 181, 0.25);
        }

        .cert-index-tag {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          padding: 0.22rem 0.65rem;
          background: rgba(20, 4, 10, 0.85);
          border: 1px solid var(--cr-border-gold);
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--cr-gold);
        }

        .cert-year-tag {
          position: absolute;
          bottom: 0.75rem;
          right: 0.75rem;
          padding: 0.2rem 0.65rem;
          background: rgba(20, 4, 10, 0.85);
          border: 1px solid var(--cr-border);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--cr-text);
        }

        /* Detail Teks Sertifikat */
        .cert-body {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .cert-issuer {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--cr-rose);
          text-transform: uppercase;
        }

        .cert-title {
          font-family: var(--font-display);
          font-size: 1.45rem;
          font-weight: 700;
          line-height: 1.12;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          margin: 0;
          color: var(--cr-text);
        }

        .cert-desc {
          font-size: 0.88rem;
          line-height: 1.62;
          color: var(--cr-text-muted);
          margin: 0.2rem 0 0;
        }

        /* Footer Kartu */
        .cert-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.9rem;
          border-top: 1px solid var(--cr-border);
          font-family: var(--font-mono);
          font-size: 0.72rem;
        }

        .cert-id-code {
          color: var(--cr-text-muted);
          letter-spacing: 0.06em;
        }

        .cert-inspect-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--cr-gold);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: transform 0.2s ease;
        }

        .cert-card:hover .cert-inspect-link {
          transform: translateX(3px);
        }

        /* 3. Modal Lightbox Preview */
        .cert-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 95;
          background: rgba(12, 2, 6, 0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          box-sizing: border-box;
        }

        .cert-modal-box {
          position: relative;
          width: 100%;
          max-width: 880px;
          background: #1d060e;
          border: 1px solid var(--cr-border-gold);
          padding: 1.75rem;
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          gap: 1.5rem;
          box-shadow: 0 28px 64px rgba(0, 0, 0, 0.65);
        }

        .cert-modal-media {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 11;
          background: #120308;
          border: 1px solid var(--cr-border);
          overflow: hidden;
        }

        .cert-modal-media img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .cert-modal-info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.25rem;
        }

        .cert-modal-close {
          align-self: flex-end;
          background: transparent;
          border: 1px solid var(--cr-border-gold);
          color: var(--cr-gold);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.45rem 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cert-modal-close:hover {
          background: var(--cr-gold);
          color: var(--cr-dark);
        }

        @media (max-width: 900px) {
          .certificates-section {
            padding: 4.5rem 1.25rem 5rem;
          }

          .certs-dual-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .cert-modal-box {
            grid-template-columns: 1fr;
            padding: 1.25rem;
            max-height: 90vh;
            overflow-y: auto;
          }
        }
      `}</style>

      <div className="certs-ambient-grid" aria-hidden="true" />

      <div className="certs-container">
        {/* 1. Header */}
        <header className="certs-header">
          <div className="certs-top-meta">
            <span className="certs-kicker">
              <span className="kicker-square" />
              CREDENTIALS // 04 — VERIFIED ACHIEVEMENTS
            </span>
            <span className="certs-count-meta">
              RECORDS [ 0{CERTIFICATES_DATA.length} ]
            </span>
          </div>

          <h2 className="certs-heading">
            HONORS &amp;
            <span className="certs-heading-stroke">CERTIFICATES</span>
          </h2>
        </header>

        {/* 2. Dual-Card Showcase Khusus 2 Sertifikat */}
        <div className="certs-dual-grid">
          {CERTIFICATES_DATA.map((cert) => (
            <motion.article
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="cert-card"
              onClick={() => setSelectedCert(cert)}
            >
              <span className="b-corner tl" />
              <span className="b-corner tr" />
              <span className="b-corner bl" />
              <span className="b-corner br" />

              <div>
                <div className="cert-preview-box">
                  <div className="cert-preview-fallback" aria-hidden="true">
                    <span className="fallback-label">CERT // {cert.id}</span>
                  </div>
                  {cert.image && (
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="cert-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.opacity = "0";
                      }}
                    />
                  )}
                  <span className="cert-index-tag">/{cert.id}</span>
                  <span className="cert-year-tag">{cert.date}</span>
                </div>

                <div className="cert-body" style={{ marginTop: "1.15rem" }}>
                  <span className="cert-issuer">{cert.issuer}</span>
                  <h3 className="cert-title">{cert.title}</h3>
                  <p className="cert-desc">{cert.description}</p>
                </div>
              </div>

              <div className="cert-footer">
                <span className="cert-id-code">ID: {cert.credentialId}</span>
                <span className="cert-inspect-link">
                  <span>Inspect</span>
                  <span>↗</span>
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* 3. Modal Lightbox Preview Sertifikat */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            className="cert-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              className="cert-modal-box"
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="b-corner tl" />
              <span className="b-corner tr" />
              <span className="b-corner bl" />
              <span className="b-corner br" />

              <div className="cert-modal-media">
                <div className="cert-preview-fallback" aria-hidden="true">
                  <span className="fallback-label">
                    CERTIFICATE // {selectedCert.id}
                  </span>
                </div>
                {selectedCert.image && (
                  <img
                    src={selectedCert.image}
                    alt={selectedCert.title}
                    onError={(e) => {
                      e.currentTarget.style.opacity = "0";
                    }}
                  />
                )}
              </div>

              <div className="cert-modal-info">
                <div>
                  <span className="cert-issuer">{selectedCert.issuer}</span>
                  <h3
                    className="cert-title"
                    style={{ fontSize: "1.65rem", marginTop: "0.35rem" }}
                  >
                    {selectedCert.title}
                  </h3>
                  <p className="cert-desc" style={{ marginTop: "0.75rem" }}>
                    {selectedCert.description}
                  </p>
                  <div
                    style={{
                      marginTop: "1.25rem",
                      paddingTop: "0.85rem",
                      borderTop: "1px solid var(--cr-border)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.74rem",
                      color: "var(--cr-gold)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.35rem",
                    }}
                  >
                    <span>ISSUED: {selectedCert.date}</span>
                    <span>CREDENTIAL ID: {selectedCert.credentialId}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="cert-modal-close"
                  onClick={() => setSelectedCert(null)}
                >
                  Close Preview [ESC]
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}