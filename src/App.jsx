import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Home from "./Home";
import About from "./About";
import Lanyard from "./components/Lanyard/Lanyard";
import Project from "./Project";
import Certificates from "./Certificates";

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Sesuaikan durasi ini (dalam milidetik) jika kamu punya animasi loading/preloader di Home.
    // Contoh: 2500 berarti Navbar baru akan muncul 2.5 detik setelah halaman siap.
    const LOADING_DELAY = 2000; 
    let timer;

    const handlePageLoad = () => {
      timer = setTimeout(() => {
        setIsLoaded(true);
      }, LOADING_DELAY);
    };

    // Mengecek apakah seluruh aset halaman sudah selesai dimuat
    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad);
    }

    return () => {
      window.removeEventListener("load", handlePageLoad);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="app-root">
      <style>{`
        .app-root {
          position: relative;
          width: 100%;
        }

        /* 0. Pembungkus Navbar di Paling Atas Layar */
        .fixed-navbar-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 100; /* Paling tinggi di atas Home (1) dan About (20) */
          padding: 0.75rem 3rem;
          box-sizing: border-box;
          pointer-events: none; /* Mencegah area kosong menghalangi klik */
          
          /* Animasi tersembunyi saat masih loading */
          opacity: 0;
          visibility: hidden;
          transform: translateY(-24px);
          transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                      visibility 0.6s;
        }

        /* Muncul halus dari atas setelah loading selesai */
        .fixed-navbar-wrapper.visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .fixed-navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          /* Hanya aktifkan klik saat loading sudah selesai */
          pointer-events: ${isLoaded ? "auto" : "none"};
        }

        /* 1. Mengunci Home agar 100% diam di layar */
        .fixed-home-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 1;
          overflow: hidden;
        }

        /* 2. Ruang kosong transparan sebesar layar agar Home terlihat penuh di awal */
        .home-spacer {
          width: 100%;
          height: 100vh;
          pointer-events: none;
        }

        /* 3. Pembungkus About yang akan naik menumpuk Home saat di-scroll */
        .about-stack-wrapper {
          position: relative;
          z-index: 20;
          width: 100%;
        }

        @media (max-width: 768px) {
          .fixed-navbar-wrapper {
            padding: 0.5rem 1.25rem;
          }
        }
      `}</style>

      {/* Navbar Melayang di Paling Atas (Hanya muncul setelah isLoaded = true) */}
      <div className={`fixed-navbar-wrapper ${isLoaded ? "visible" : ""}`}>
        <div className="fixed-navbar-inner">
          <Navbar />
        </div>
      </div>

      {/* 1. Halaman Home (Terkunci diam di belakang) */}
      <div className="fixed-home-wrapper">
        {/* Opsional: Mengirim prop onLoadComplete jika Home punya state loading sendiri */}
        <Home onLoadComplete={() => setIsLoaded(true)} />
      </div>

      {/* 2. Alur Scroll Halaman */}
      <main>
        {/* Penahan setinggi 1 layar supaya About mulai dari bawah layar */}
        <div className="home-spacer" aria-hidden="true" />

        {/* Halaman About (Naik menutupi Home saat di-scroll) */}
        <div className="about-stack-wrapper">
          <About />
        </div>
      </main>

      <Project />
      <Certificates />
    </div>
  );
}