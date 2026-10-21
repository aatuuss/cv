import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// Helper membuat pratinjau gambar sertifikat default (SVG Data URI)
// Ganti properti `image` pada `certificatesData` di bawah dengan path foto sertifikat Anda,
// misalnya: image: "/certificates/sertifikat-1.jpg" dan image: "/certificates/sertifikat-2.jpg"
const createDefaultCertSvg = (id, title, issuer, date, credentialId) =>
  `data:image/svg+xml;utf8,` +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 540" width="100%" height="100%">
      <defs>
        <linearGradient id="bg-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#090d16" />
        </linearGradient>
      </defs>
      <rect width="800" height="540" fill="url(#bg-${id})" />
      <rect x="28" y="28" width="744" height="484" rx="12" fill="none" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.45" />
      <rect x="42" y="42" width="716" height="456" rx="8" fill="none" stroke="#94a3b8" stroke-width="1" stroke-dasharray="6 6" stroke-opacity="0.3" />
      <circle cx="400" cy="115" r="34" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5" />
      <path d="M388 115 l8 8 l18 -18" fill="none" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
      <text x="400" y="185" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="15" font-weight="700" letter-spacing="4">CERTIFICATE OF COMPLETION</text>
      <text x="400" y="245" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="28" font-weight="800">${title}</text>
      <text x="400" y="290" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="16">Issued by ${issuer}</text>
      <line x1="220" y1="335" x2="580" y2="335" stroke="#334155" stroke-width="1.5" />
      <text x="230" y="420" text-anchor="middle" fill="#e2e8f0" font-family="monospace" font-size="14" font-weight="600">${date}</text>
      <text x="230" y="442" text-anchor="middle" fill="#64748b" font-family="monospace" font-size="11">ISSUED DATE</text>
      <text x="570" y="420" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="14" font-weight="600">${credentialId}</text>
      <text x="570" y="442" text-anchor="middle" fill="#64748b" font-family="monospace" font-size="11">CREDENTIAL ID</text>
    </svg>
  `);

const certificatesData = [
  {
    id: "01",
    code: "CERT_01",
    title: "Front-End Developer Certificate of Competency",
    issuer: "PT. Sekawan Media Informatika",
    date: "2024",
    category: "Front-End Developer",
    description:
      "Sertifikasi kompetensi pembangunan aplikasi web end-to-end mencakup arsitektur RESTful API, manajemen database relasional, autentikasi keamanan, dan deployment modern.",
    skills: ["React.js","REST API", "JavaScript"],
    // Ganti dengan path foto sertifikat pertama Anda, contoh: "/images/sertifikat-1.jpg"
    image: "./public/sekawan.jpg",
    credentialUrl: "#certificates",
  },
  {
    id: "02",
    code: "CERT_02",
    title: "Certificate of Achievement Website Design, Front-End Development, and UI/UX Intern",
    issuer: "PT. Infimech Harmony Teknologi",
    date: "2026",
    category: "Website Design, Front-End Development, & UI/UX",
    description:
      "Sertifikasi perancangan antarmuka pengguna berfokus pada desain minimalis, sistem komponen responsif, aksesibilitas web, serta optimasi Core Web Vitals & SEO.",
    skills: ["TAILWIND CSS", "JAVASCRIPT", "FIGMA", "Rect.js", "Canva", "Github "],
    // Ganti dengan path foto sertifikat kedua Anda, contoh: "/images/sertifikat-2.jpg"
    image: "./public/Infimech Certificate Nikamtus Sholihah_page-0001.jpg",
    credentialUrl: "#certificates",
  },
];

export default function Certificates() {
  const [selectedCert, setSelectedCert] = useState(null);
  const [hoveredId, setHoveredId] = useState("01");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.06,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="certificates-section" id="certificates">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap');

        .certificates-section {
          position: relative;
          z-index: 20;
          width: 100%;
          min-height: 100vh;
          background: #07090e;
          margin: 0;
          padding: 0;
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          color: #f8fafc;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .certificates-terminal-window {
          width: 100%;
          min-height: 100vh;
          background: #07090e;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        /* Titlebar & Pathbar menyambung dengan About.jsx, Project.jsx, & Experience.jsx */
        .certificates-titlebar {
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

        .certificates-pathbar {
          background: #ffffff;
          padding: 0.4rem 1rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: #64748b;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .path-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .path-badge {
          background: #0f172a;
          color: #38bdf8;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }

        .path-active-cert {
          color: #0f172a;
          font-weight: 600;
        }

        /* Body Utama */
        .certificates-body {
          flex: 1;
          background-color: #07090e;
          background-image: radial-gradient(rgba(255, 255, 255, 0.09) 1px, transparent 1px);
          background-size: 20px 20px;
          padding: 2rem 3.5rem 3rem 3.5rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 1.75rem;
          box-sizing: border-box;
        }

        /* Header Section */
        .cert-header-area {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .cert-index-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.76rem;
          letter-spacing: 0.2em;
        }

        .cert-index-num {
          color: #38bdf8;
          font-weight: 700;
        }

        .cert-index-label {
          color: #94a3b8;
          font-weight: 500;
        }

        .cert-index-line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
          margin-left: 0.5rem;
        }

        .cert-heading-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .cert-main-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 3.3vw, 3rem);
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.035em;
          line-height: 1.08;
          margin: 0;
        }

        .cert-right-subtitle {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          line-height: 1.58;
          color: #94a3b8;
          max-width: 430px;
          margin: 0;
        }

        /* Grid 2 Kolom untuk 2 Foto Sertifikat */
        .certificates-two-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.75rem;
          width: 100%;
        }

        .cert-card {
          background: rgba(13, 17, 26, 0.94);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease;
          position: relative;
        }

        .cert-card:hover {
          transform: translateY(-4px);
          border-color: rgba(56, 189, 248, 0.45);
          box-shadow: 0 22px 45px -18px rgba(0, 0, 0, 0.75);
        }

        /* Frame Foto Sertifikat */
        .cert-photo-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10.5;
          background-color: #090d16;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 24px 24px;
          padding: 1.25rem;
          box-sizing: border-box;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          cursor: pointer;
          overflow: hidden;
        }

        .cert-photo-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          z-index: 2;
        }

        .cert-photo-id {
          color: #38bdf8;
          font-weight: 700;
        }

        .cert-photo-category {
          color: #64748b;
          font-weight: 600;
        }

        .cert-image-wrapper {
          position: relative;
          flex: 1;
          width: 100%;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: #0f172a;
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.55);
        }

        .cert-photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .cert-card:hover .cert-photo-img {
          transform: scale(1.035);
        }

        .cert-zoom-overlay {
          position: absolute;
          inset: 0;
          background: rgba(7, 9, 14, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .cert-photo-container:hover .cert-zoom-overlay {
          opacity: 1;
        }

        .cert-zoom-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: #090d16;
          background: #38bdf8;
          padding: 0.45rem 0.95rem;
          border-radius: 999px;
          letter-spacing: 0.06em;
        }

        /* Detail & Spesifikasi di Bawah Foto Sertifikat */
        .cert-details-pane {
          padding: 1.5rem 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          gap: 1.15rem;
          position: relative;
          overflow: hidden;
        }

        .cert-watermark {
          position: absolute;
          right: 0.75rem;
          bottom: -1.2rem;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 7.5rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.025);
          line-height: 1;
          pointer-events: none;
          user-select: none;
        }

        .cert-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
        }

        .cert-issuer-name {
          color: #38bdf8;
          font-weight: 600;
        }

        .cert-year-badge {
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.15rem 0.55rem;
          border-radius: 4px;
        }

        .cert-card-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.25rem, 1.65vw, 1.5rem);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.25;
          letter-spacing: -0.02em;
          margin: 0.35rem 0 0.5rem 0;
        }

        .cert-card-desc {
          font-size: 0.86rem;
          line-height: 1.62;
          color: #94a3b8;
          margin: 0;
        }

        .cert-skills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          position: relative;
          z-index: 2;
        }

        .cert-skill-pill {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          font-weight: 500;
          color: #cbd5e1;
          background: #141923;
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 0.3rem 0.65rem;
          border-radius: 5px;
          letter-spacing: 0.05em;
        }

        .cert-footer-bar {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 2;
        }

        .cert-cred-id {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: #64748b;
        }

        .cert-preview-btn {
          background: transparent;
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.45);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.4rem 0.9rem;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cert-preview-btn:hover {
          background: #38bdf8;
          color: #090d16;
        }

        /* Modal Lightbox untuk Melihat Foto Sertifikat Ukuran Penuh */
        .cert-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(7, 9, 14, 0.86);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .cert-modal-window {
          width: min(860px, 94vw);
          background: #0d111a;
          border: 1px solid rgba(56, 189, 248, 0.35);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85);
          display: flex;
          flex-direction: column;
        }

        .cert-modal-header {
          background: #141923;
          padding: 0.75rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .cert-modal-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          color: #e2e8f0;
          font-weight: 600;
        }

        .cert-modal-close {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.35);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.25rem 0.7rem;
          border-radius: 6px;
          cursor: pointer;
        }

        .cert-modal-close:hover {
          background: #ef4444;
          color: #ffffff;
        }

        .cert-modal-body {
          padding: 1.25rem;
          background: #07090e;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cert-modal-img {
          width: 100%;
          max-height: 68vh;
          object-fit: contain;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        @media (max-width: 1024px) {
          .certificates-body {
            padding: 1.5rem;
          }
          .certificates-two-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="certificates-terminal-window">

        {/* Konten Utama */}
        <div className="certificates-body">
          {/* Header Section */}
          <div className="cert-header-area">
            <div className="cert-index-row">
              <span className="cert-index-num">07</span>
              <span className="cert-index-label">CERTIFICATES</span>
              <div className="cert-index-line" />
            </div>

            <div className="cert-heading-row">
              <h2 className="cert-main-title">Licenses &amp; Certifications.</h2>
              <p className="cert-right-subtitle">
                Selected professional certifications validating expertise in
                full-stack engineering, modern UI/UX design, and web optimization.
              </p>
            </div>
          </div>

          {/* Grid 2 Foto Sertifikat */}
          <motion.div
            className="certificates-two-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
          >
            {certificatesData.map((cert) => (
              <motion.article
                key={cert.id}
                className="cert-card"
                variants={cardVariants}
                onMouseEnter={() => setHoveredId(cert.id)}
              >
                {/* Bagian Atas: Foto Sertifikat */}
                <div
                  className="cert-photo-container"
                  onClick={() => setSelectedCert(cert)}
                >
                  <div className="cert-photo-topbar">
                    <span className="cert-photo-id">/{cert.id}</span>
                    <span className="cert-photo-category">{cert.category}</span>
                  </div>

                  <div className="cert-image-wrapper">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="cert-photo-img"
                    />
                    <div className="cert-zoom-overlay">
                      <span className="cert-zoom-badge">
                        VIEW FULL CERTIFICATE ↗
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bagian Bawah: Detail Sertifikat */}
                <div className="cert-details-pane">
                  <span className="cert-watermark">{cert.id}</span>

                  <div>
                    <div className="cert-meta-row">
                      <span className="cert-issuer-name">{cert.issuer}</span>
                      <span className="cert-year-badge">{cert.date}</span>
                    </div>

                    <h3 className="cert-card-title">{cert.title}</h3>
                    <p className="cert-card-desc">{cert.description}</p>
                  </div>

                  <div className="cert-skills-row">
                    {cert.skills.map((skill) => (
                      <span key={skill} className="cert-skill-pill">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="cert-footer-bar">
                    <span className="cert-cred-id">ID: {cert.credentialId}</span>
                    <button
                      type="button"
                      className="cert-preview-btn"
                      onClick={() => setSelectedCert(cert)}
                    >
                      PREVIEW PHOTO ↗
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Modal Lightbox Saat Foto Sertifikat Diklik */}
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
              className="cert-modal-window"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cert-modal-header">
                <span className="cert-modal-title">
                  // {selectedCert.code}: {selectedCert.title}
                </span>
                <button
                  type="button"
                  className="cert-modal-close"
                  onClick={() => setSelectedCert(null)}
                >
                  CLOSE [ESC]
                </button>
              </div>

              <div className="cert-modal-body">
                <img
                  src={selectedCert.image}
                  alt={selectedCert.title}
                  className="cert-modal-img"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}