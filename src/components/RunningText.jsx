import React from "react";

export default function RunningText() {
  const items = [
    "UI/UX DESAIGN",
    "FRONTEND DEVELOPER",
    "WEB DEVELOPER",
    "SEO ANALYS",
  ];

  return (
    <div className="running-text-wrapper">
      <style>{`
        .running-text-wrapper {
          width: 100%;
          overflow: hidden;
          background-color: #1a0f0a; /* Warna latar belakang gelap hangat */
          padding: 0.1rem 0;
          display: flex;
          user-select: none;
          box-sizing: border-box;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .marquee-track {
          display: flex;
          align-items: center;
          white-space: nowrap;
          will-change: transform;
          animation: marquee 50s linear infinite;
        }

        /* Berhenti sejenak saat kursor diarahkan ke teks (opsional) */
        .running-text-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }

        .marquee-content {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .marquee-item {
          display: inline-flex;
          align-items: center;
          font-family: 'Arial Black', Impact, 'Trebuchet MS', sans-serif;
          font-size: clamp(0.4rem, 2.5vw, 2.2rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #ffffff;
        }

        .marquee-dot {
          display: inline-block;
          width: 0.5em;
          height: 0.5em;
          background-color: #ff9e9e;
          border-radius: 50%;
          margin: 0 clamp(1.2rem, 2vw, 2rem);
          flex-shrink: 0;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <div className="marquee-track">
        {/* Konten digandakan 2 kali agar animasi looping berjalan mulus tanpa jeda kosong */}
        <div className="marquee-content">
          {items.map((text, idx) => (
            <span key={`group1-${idx}`} className="marquee-item">
              <span>{text}</span>
              <span className="marquee-dot" aria-hidden="true" />
            </span>
          ))}
        </div>

        <div className="marquee-content" aria-hidden="true">
          {items.map((text, idx) => (
            <span key={`group2-${idx}`} className="marquee-item">
              <span>{text}</span>
              <span className="marquee-dot" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}