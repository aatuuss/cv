import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CommentsSection from "./CommentsSection";
import RunningText from "./components/RunningText";
import About from "./About";

const IMG_BEFORE = "/atusbefore.png";
const IMG_AFTER = "/atus.png";

export default function Home() {
  const [veilProgress, setVeilProgress] = useState(0);
  const [veilVisible, setVeilVisible] = useState(true);
  const [heroReady, setHeroReady] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const heroCanvasRef = useRef(null);
  const bgCanvasRef = useRef(null);
  const lenisRef = useRef(null);

  // 1. Veil Progress Loader
  useEffect(() => {
    const interval = setInterval(() => {
      setVeilProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          setTimeout(() => {
            setVeilVisible(false);
            setHeroReady(true);
          }, 400);
          return 1;
        }
        return Math.min(1, +(prev + 0.04).toFixed(2));
      });
    }, 32);
    return () => clearInterval(interval);
  }, []);

  // 2. Lenis Smooth Scroll Setup
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const updateScroll = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(updateScroll);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateScroll);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (isLocked) {
      document.body.style.overflow = "hidden";
      lenisRef.current?.stop();
    } else {
      document.body.style.overflow = previousOverflow;
      lenisRef.current?.start();
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLocked]);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.to(".hero-bg-watermark", {
        yPercent: -8,
        scale: 0.93,
        opacity: 0.28,
        ease: "none",
        scrollTrigger: {
          trigger: ".home-spacer",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-canvas", {
        yPercent: -4,
        scale: 0.94,
        opacity: 0.82,
        ease: "none",
        scrollTrigger: {
          trigger: ".home-spacer",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => context.revert();
  }, []);

  const scrollToComments = (e) => {
    if (e) e.preventDefault();
    const target = document.getElementById("comments");
    if (target && lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: 0, duration: 1.5 });
    } else if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 3. BACKGROUND CONTOUR LINES (Algoritma Stepped Noise Neighbor-Comparison asli LandoNorris.com)
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const bgMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(
            window.innerWidth * Math.min(window.devicePixelRatio || 1, 2),
            window.innerHeight * Math.min(window.devicePixelRatio || 1, 2)
          ),
        },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        varying vec2 vUv;

        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(
            0.211324865405187,
            0.366025403784439,
           -0.577350269189626,
            0.024390243902439
          );
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
          m = m * m;
          m = m * m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        // Membagi noise skala besar menjadi 4 level (stepped noise)
        float getLevel(vec2 uv) {
          vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
          vec2 p = (uv - 0.5) * aspect * 1.15;
          float t = uTime * 0.07;
          float n = snoise(p + vec2(t, -t * 0.7)) * 0.5 + 0.5;
          return floor(n * 4.2);
        }

        void main() {
          vec2 texel = 1.25 / uResolution;

          float c = getLevel(vUv);
          float l = getLevel(vUv - vec2(texel.x, 0.0));
          float r = getLevel(vUv + vec2(texel.x, 0.0));
          float u = getLevel(vUv + vec2(0.0, texel.y));
          float d = getLevel(vUv - vec2(0.0, texel.y));

          // Gambar garis 1px tipis hanya jika level piksel berbeda dengan tetangga atas/bawah/kiri/kanan
          float isEdge = step(0.1, abs(c - l) + abs(c - r) + abs(c - u) + abs(c - d));

          gl_FragColor = vec4(vec3(1.0, 0.90, 0.92), isEdge * 0.22);
        }
      `,
      transparent: true,
    });

    const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
    scene.add(bgMesh);

    let bgRafId;
    const bgClock = new THREE.Clock();

    const animateBg = () => {
      bgMat.uniforms.uTime.value = bgClock.getElapsedTime();
      renderer.render(scene, camera);
      bgRafId = requestAnimationFrame(animateBg);
    };
    animateBg();

    const onResizeBg = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setSize(window.innerWidth, window.innerHeight);
      bgMat.uniforms.uResolution.value.set(
        window.innerWidth * dpr,
        window.innerHeight * dpr
      );
    };
    window.addEventListener("resize", onResizeBg);

    return () => {
      cancelAnimationFrame(bgRafId);
      window.removeEventListener("resize", onResizeBg);
      renderer.dispose();
    };
  }, []);

  // 4. HERO SECTION: GPU Analytical Metaball Liquid Shader + Raycaster UV Presisi
  //    - Ukuran helm diperbesar sedikit (HELMET_SIZE = 0.58)
  //    - Animasi Liquid Blob dihitung langsung di GPU per-piksel (Smooth Minimum Metaball SDF)
  //      sehingga 100% tajam, kenyal, menyatu & memisah seperti tetesan cairan asli di LandoNorris.com
  //    - Posisi kursor diproyeksikan langsung ke UV foto menggunakan Raycaster agar akurat di setiap ukuran layar
  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      50
    );
    camera.position.z = 7.5;

    // =========================================================================
    // PENGATURAN UKURAN & POSISI HELM (/atus.png):
    // - HELMET_SIZE diperbesar dari 0.48 -> 0.58 (58% tinggi bidang foto)
    // - HELMET_CENTER_Y = 0.63 (posisi vertikal kepala)
    // =========================================================================
    const HELMET_SIZE = 0.58;
    const HELMET_CENTER_X = 0.5;
    const HELMET_CENTER_Y = 0.63;

    // 10 titik rantai Metaball (Physics Spring Chain) yang dikirim langsung ke GPU Shader
    const NUM_BLOBS = 10;
    const blobPositions = Array.from(
      { length: NUM_BLOBS },
      () => new THREE.Vector2(HELMET_CENTER_X, HELMET_CENTER_Y)
    );
    const blobRadii = new Float32Array(NUM_BLOBS);

    const uniforms = {
      uTexBefore: { value: null },
      uTexAfter: { value: null },
      uTime: { value: 0 },
      uBeforeAspect: { value: 1.0 },
      uAfterAspect: { value: 1.0 },
      uHelmetSize: { value: HELMET_SIZE },
      uHelmetCenter: {
        value: new THREE.Vector2(HELMET_CENTER_X, HELMET_CENTER_Y),
      },
      uBlobs: { value: blobPositions },
      uRadii: { value: blobRadii },
    };

    const meshGroup = new THREE.Group();
    scene.add(meshGroup);

    let heroMesh = null;

    const loader = new THREE.TextureLoader();
    Promise.all([loader.loadAsync(IMG_BEFORE), loader.loadAsync(IMG_AFTER)])
      .then(([texBefore, texAfter]) => {
        texBefore.colorSpace = texAfter.colorSpace = THREE.SRGBColorSpace;
        texBefore.wrapS = texBefore.wrapT = THREE.ClampToEdgeWrapping;
        texAfter.wrapS = texAfter.wrapT = THREE.ClampToEdgeWrapping;

        const beforeAspect =
          (texBefore.image.width || 1) / (texBefore.image.height || 1);
        const afterAspect =
          (texAfter.image.width || 1) / (texAfter.image.height || 1);

        const height = 4.7;
        const width = height * beforeAspect;

        uniforms.uTexBefore.value = texBefore;
        uniforms.uTexAfter.value = texAfter;
        uniforms.uBeforeAspect.value = beforeAspect;
        uniforms.uAfterAspect.value = afterAspect;

        const mat = new THREE.ShaderMaterial({
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              // Kedua foto (/atusbefore.png & /atus.png) 100% diam
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D uTexBefore, uTexAfter;
            uniform float uTime;
            uniform float uBeforeAspect;
            uniform float uAfterAspect;
            uniform float uHelmetSize;
            uniform vec2 uHelmetCenter;
            uniform vec2 uBlobs[10];
            uniform float uRadii[10];
            varying vec2 vUv;

            // Simplex 2D Noise untuk riak organik pada pinggiran cairan
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

            float snoise(vec2 v) {
              const vec4 C = vec4(
                0.211324865405187,
                0.366025403784439,
               -0.577350269189626,
                0.024390243902439
              );
              vec2 i  = floor(v + dot(v, C.yy));
              vec2 x0 = v - i + dot(i, C.xx);
              vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
              vec4 x12 = x0.xyxy + C.xxzz;
              x12.xy -= i1;
              i = mod289(i);
              vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
              vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
              m = m * m;
              m = m * m;
              vec3 x = 2.0 * fract(p * C.www) - 1.0;
              vec3 h = abs(x) - 0.5;
              vec3 ox = floor(x + 0.5);
              vec3 a0 = x - ox;
              m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
              vec3 g;
              g.x  = a0.x  * x0.x  + h.x  * x0.y;
              g.yz = a0.yz * x12.xz + h.yz * x12.yw;
              return 130.0 * dot(m, g);
            }

            // Polynomial Smooth Minimum (khas LandoNorris.com untuk menggabungkan tetesan cairan secara elastis)
            float smin(float a, float b, float k) {
              float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
              return mix(b, a, h) - k * h * (1.0 - h);
            }

            // Mengambil warna helm (/atus.png) dengan menjaga Aspect Ratio asli 1:1
            vec4 sampleAfter(vec2 uv) {
              vec2 rel = uv - uHelmetCenter;
              float aspectCorrection = uBeforeAspect / max(uAfterAspect, 0.001);
              vec2 afterUv = vec2(
                rel.x * aspectCorrection / uHelmetSize,
                rel.y / uHelmetSize
              ) + 0.5;

              if (afterUv.x < 0.0 || afterUv.x > 1.0 || afterUv.y < 0.0 || afterUv.y > 1.0) {
                return vec4(0.0);
              }
              return texture2D(uTexAfter, afterUv);
            }

            void main() {
              // 1. Foto dasar (/atusbefore.png) sepenuhnya diam
              vec4 colBefore = texture2D(uTexBefore, vUv);

              // 2. Foto helm (/atus.png) sepenuhnya diam & proporsional di kepala
              vec4 colAfter = sampleAfter(vUv);

              // 3. Hitung Signed Distance Field (SDF) dari 10 Metaball Cairan secara eksak di GPU
              vec2 aspectVec = vec2(uBeforeAspect, 1.0);
              vec2 p = vUv * aspectVec;

              // Distorsi domain organik halus agar pinggiran metaball meliuk seperti cairan hidup
              vec2 warp = vec2(
                snoise(p * 3.8 + vec2(uTime * 0.55, -uTime * 0.45)),
                snoise(p * 3.8 + vec2(-uTime * 0.45, uTime * 0.50))
              ) * 0.022;

              float d = 10.0;
              for (int i = 0; i < 10; i++) {
                vec2 bPos = uBlobs[i] * aspectVec;
                float distToBlob = length((p + warp) - bPos) - uRadii[i];
                // Gabungkan setiap tetesan dengan kelengkungan cairan (k = 0.065)
                d = smin(d, distToBlob, 0.065);
              }

              // Potongan tepi cairan anti-aliased super tajam (1px crisp edge tanpa blur/glow)
              float reveal = 1.0 - smoothstep(-0.003, 0.003, d);

              // Bayangan lembut pada wajah tepat di bawah ketebalan helm (seperti shadow map di LandoNorris.com)
              float shadowZone = (1.0 - smoothstep(0.0, 0.028, d)) * (1.0 - reveal) * colAfter.a;
              vec3 shadedBefore = colBefore.rgb * (1.0 - shadowZone * 0.20);

              // 4. Gabungkan helm di atas foto dasar sesuai alpha helm
              float afterFactor = reveal * colAfter.a;
              vec3 finalRgb = mix(shadedBefore, colAfter.rgb, afterFactor);
              float finalAlpha = max(colBefore.a, afterFactor);

              gl_FragColor = vec4(finalRgb, finalAlpha);
            }
          `,
          uniforms,
          transparent: true,
        });

        heroMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(width, height, 32, 32),
          mat
        );
        heroMesh.position.set(0.0, -0.08, 1);
        meshGroup.add(heroMesh);
      })
      .catch(console.warn);

    // Raycaster agar posisi kursor tepat 100% akurat pada koordinat UV foto
    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();
    let targetUvX = HELMET_CENTER_X;
    let targetUvY = HELMET_CENTER_Y;
    let lastUserMove = -10000;
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;
    let pointerOverPhoto = false;

    // Physics state untuk 10 titik rantai cairan (Spring Chain)
    const chainX = new Float32Array(NUM_BLOBS).fill(HELMET_CENTER_X);
    const chainY = new Float32Array(NUM_BLOBS).fill(HELMET_CENTER_Y);
    const velX = new Float32Array(NUM_BLOBS).fill(0);
    const velY = new Float32Array(NUM_BLOBS).fill(0);

    const onPointerMove = (e) => {
      pointerNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (heroMesh) {
        raycaster.setFromCamera(pointerNDC, camera);
        const hits = raycaster.intersectObject(heroMesh);
        if (hits.length > 0 && hits[0].uv) {
          targetUvX = hits[0].uv.x;
          targetUvY = hits[0].uv.y;
          targetParallaxX = pointerNDC.x;
          targetParallaxY = pointerNDC.y;
          pointerOverPhoto = true;
          lastUserMove = performance.now();
        } else {
          pointerOverPhoto = false;
        }
      }
    };
    window.addEventListener("pointermove", onPointerMove);

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      uniforms.uTime.value = elapsed;

      if (heroMesh) {
        currentParallaxX +=
          ((pointerOverPhoto ? targetParallaxX : 0) - currentParallaxX) * 0.045;
        currentParallaxY +=
          ((pointerOverPhoto ? targetParallaxY : 0) - currentParallaxY) * 0.045;
        const breathingScale = 1 + Math.sin(elapsed * 0.48) * 0.008;
        heroMesh.position.x =
          Math.sin(elapsed * 0.42) * 0.035 + currentParallaxX * 0.12;
        heroMesh.position.y =
          -0.08 + Math.sin(elapsed * 0.62) * 0.055 - currentParallaxY * 0.1;
        heroMesh.rotation.z = -currentParallaxX * 0.012;
        heroMesh.scale.set(breathingScale, breathingScale, 1);
      }

      const isIdle = performance.now() - lastUserMove > 1600;

      if (isIdle) {
        // S-Shaped Figure-8 Liquid Sweep otomatis tepat di atas area helm/kepala
        // sehingga helm selalu terlihat beranimasi hidup secara organik walau tanpa kursor
        const t = elapsed * 1.25;
        targetUvX =
          HELMET_CENTER_X +
          Math.sin(t) * 0.13 +
          Math.cos(t * 1.7) * 0.04;
        targetUvY =
          HELMET_CENTER_Y +
          Math.sin(t * 2.0) * 0.11 +
          Math.cos(t * 0.8) * 0.04;
      }

      // Update rantai pegas (Spring-Damper Physics) untuk ke-10 blob cairan
      // Blob 0 mengejar target utama, Blob 1..9 mengejar blob di depannya sehingga membentuk ekor cairan kenyal
      let headSpeed = 0;
      for (let i = 0; i < NUM_BLOBS; i++) {
        const goalX = i === 0 ? targetUvX : chainX[i - 1];
        const goalY = i === 0 ? targetUvY : chainY[i - 1];

        const stiffness = i === 0 ? 0.18 : 0.24 - i * 0.012;
        const damping = 0.72;

        velX[i] = (velX[i] + (goalX - chainX[i]) * stiffness) * damping;
        velY[i] = (velY[i] + (goalY - chainY[i]) * stiffness) * damping;

        chainX[i] += velX[i];
        chainY[i] += velY[i];

        if (i === 0) {
          headSpeed = Math.hypot(velX[0], velY[0]);
        }

        blobPositions[i].set(chainX[i], chainY[i]);

        // Ukuran tiap tetesan mengecil secara organik dari kepala ke ekor (tapered liquid drop)
        const taper = 1.0 - (i / NUM_BLOBS) * 0.62;
        const pulse = Math.sin(elapsed * 2.8 - i * 0.6) * 0.008;
        const speedStretch = Math.min(0.035, headSpeed * 1.4);
        blobRadii[i] = (0.095 + speedStretch) * taper + pulse;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`grido-wrapper ${heroReady ? "is-ready" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .grido-wrapper {
          --bg-gradient: radial-gradient(
            circle at 55% 36%,
            #f7a8b8 0%,
            #d96b7e 42%,
            #7c283a 82%,
            #3d101c 100%
          );
          --surface-card: rgba(42, 11, 21, 0.42);
          --surface-card-hover: rgba(58, 15, 29, 0.58);
          --border-glass: rgba(255, 232, 236, 0.28);
          --border-accent: #ffe3e8;
          --foreground: #fff9fa;
          --foreground-muted: rgba(255, 238, 242, 0.78);
          --accent-gold: #ffe0b5;
          --accent-rose: #ff4778;
          --font-sans: "Space Grotesk", system-ui, sans-serif;
          --font-display: "Oswald", Impact, sans-serif;

          background: var(--bg-gradient);
          color: var(--foreground);
          font-family: var(--font-sans);
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* 1. Loader Veil */
        .loader-veil {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, #8f2d42 0%, #380d18 100%);
          transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .veil-helmet {
          width: 5.25rem;
          height: 6.25rem;
          position: relative;
          border: 2px solid rgba(255, 255, 255, 0.85);
          border-radius: 42% 42% 50% 50%;
          overflow: hidden;
        }

        .veil-helmet-fill {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, #ffe0b5 0%, #ff7597 100%);
          transform-origin: bottom;
          transition: transform 0.08s linear;
        }

        .veil-name {
          margin-top: 1.35rem;
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.24em;
          font-weight: 600;
        }

        .veil-counter {
          margin-top: 0.35rem;
          font-family: var(--font-display);
          font-size: 0.85rem;
          letter-spacing: 0.18em;
          color: var(--accent-gold);
        }

        .veil-meter {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
        }

        .veil-meter-fill {
          height: 100%;
          width: 100%;
          background: linear-gradient(90deg, var(--accent-gold), #ffffff);
          transform-origin: left;
        }

        /* 2. Sticky Hero Section */
        .hero-section {
          position: sticky;
          top: 0;
          z-index: 1;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
          box-sizing: border-box;
        }

        /* Canvas Background: Stepped Noise 1px Contour Lines (LandoNorris.com) */
        .hero-bg-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        /* Watermark DEV Raksasa di Belakang Canvas */
        .hero-bg-watermark {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 85vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          font-family: var(--font-display);
          font-size: clamp(16rem, 48vw, 44rem);
          font-weight: 800;
          line-height: 0.78;
          letter-spacing: -0.04em;
          color: rgba(255, 245, 247, 0.18);
          user-select: none;
          pointer-events: none;
          z-index: 1;
          -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 0) 88%);
          mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 0) 88%);
          transform: translateY(24px) scale(0.97);
          opacity: 0;
          transition: transform 1.1s cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 1.1s ease;
        }

        .is-ready .hero-bg-watermark {
          transform: translateY(0) scale(1);
          opacity: 1;
        }

        /* Canvas Three.js Hero Foreground */
        .hero-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        /* Konten UI Foreground */
        .hero-content {
          position: relative;
          z-index: 10;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.75rem 2.25rem;
          box-sizing: border-box;
        }

        /* Top Bar Minimalis */
        .hero-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          opacity: 0;
          transform: translateY(-14px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
        }

        .is-ready .hero-top-bar {
          opacity: 1;
          transform: translateY(0);
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.45rem 0.9rem;
          background: var(--surface-card);
          border: 1px solid var(--border-glass);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
          animation: pulseGlow 2s infinite ease-in-out;
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.85); }
        }

        .season-badge {
          font-family: var(--font-display);
          font-size: 0.85rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--foreground-muted);
        }

        /* Area Tengah: Panel Telemetri di Kanan */
        .hero-middle {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
        }

        .hero-panels-col {
          width: 16.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          opacity: 0;
          transform: translateX(24px);
          transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.22s;
        }

        .is-ready .hero-panels-col {
          opacity: 1;
          transform: translateX(0);
        }

        .bracket-panel {
          position: relative;
          padding: 1.15rem 1.35rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          background: var(--surface-card);
          border: 1px solid var(--border-glass);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-radius: 6px;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      background 0.3s ease,
                      border-color 0.3s ease;
        }

        .bracket-panel:hover {
          transform: translateY(-4px);
          background: var(--surface-card-hover);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .b-corner {
          position: absolute;
          width: 8px;
          height: 8px;
          border: 1.5px solid var(--accent-gold);
          pointer-events: none;
          transition: width 0.25s ease, height 0.25s ease;
        }

        .bracket-panel:hover .b-corner {
          width: 12px;
          height: 12px;
        }

        .tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
        .tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
        .bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
        .br { bottom: -1px; right: -1px; border-left: none; border-top: none; }

        .panel-eyebrow {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--accent-gold);
          letter-spacing: 0.12em;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin: 0.25rem 0 0;
        }

        .stats-grid dt {
          font-size: 0.68rem;
          text-transform: uppercase;
          color: var(--foreground-muted);
          letter-spacing: 0.06em;
        }

        .stats-grid dd {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.85rem;
          line-height: 0.85;
          margin: 0.35rem 0 0;
          color: var(--foreground);
        }

        /* Area Bawah: Identitas & Navigasi Sosial */
        .hero-foot {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          width: 100%;
          box-sizing: border-box;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.32s;
        }

        .is-ready .hero-foot {
          opacity: 1;
          transform: translateY(0);
        }

        .driver-bottom-left {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          flex-shrink: 0;
        }

        .driver-meta-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.88rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--accent-gold);
        }

        .driver-name {
          margin: 0;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(2.75rem, 4.8vw, 5rem);
          line-height: 0.92;
          text-transform: uppercase;
          letter-spacing: -0.01em;
        }

        .hero-foot-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .social-group {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .social-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.55rem 0.95rem;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--foreground);
          background: var(--surface-card);
          border: 1px solid var(--border-glass);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 4px;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .social-pill:hover {
          background: var(--foreground);
          color: #591827;
          border-color: var(--foreground);
          transform: translateY(-3px);
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          height: 2.85rem;
          padding: 0 1.35rem;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-decoration: none;
          color: #3d101c;
          background: linear-gradient(135deg, #fff9fa 0%, #ffe0b5 100%);
          border: none;
          font-weight: 700;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }

        .cta-button:hover {
          transform: translateY(-3px);
        }

        .lock-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 2.85rem;
          padding: 0 1.1rem;
          border: 1px solid var(--border-glass);
          color: var(--foreground);
          background: var(--surface-card);
          font: inherit;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.25s ease, background 0.25s ease,
                      border-color 0.25s ease, transform 0.25s ease;
        }

        .lock-button:hover,
        .lock-button[aria-pressed="true"] {
          color: #3d101c;
          background: var(--accent-gold);
          border-color: var(--accent-gold);
          transform: translateY(-2px);
        }

        /* Wrapper Konten Bawah agar menutup Sticky Hero dengan mulus */
        .below-fold-content {
          position: relative;
          z-index: 20;
        }

        @media (max-width: 1024px) {
          .hero-middle {
            justify-content: flex-start;
            align-items: flex-end;
            padding-bottom: 1.25rem;
          }
          .hero-panels-col {
            width: 100%;
            flex-direction: row;
          }
          .bracket-panel {
            flex: 1;
          }
        }

        @media (max-width: 640px) {
          .hero-content {
            padding: 1.25rem;
          }
          .hero-panels-col {
            flex-direction: column;
            gap: 0.75rem;
          }
          .hero-foot {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>

      {/* Loader Veil */}
      {veilVisible && (
        <div
          className="loader-veil"
          style={{
            opacity: veilProgress === 1 ? 0 : 1,
            transform: veilProgress === 1 ? "scale(1.03)" : "scale(1)",
          }}
        >
          <div className="veil-helmet">
            <div
              className="veil-helmet-fill"
              style={{ transform: `scaleY(${veilProgress})` }}
            />
          </div>
          <div className="veil-name">Nikmatus Solihah</div>
          <div className="veil-counter">{Math.round(veilProgress * 100)}%</div>
          <div className="veil-meter">
            <div
              className="veil-meter-fill"
              style={{ transform: `scaleX(${veilProgress})` }}
            />
          </div>
        </div>
      )}

      {/* Hero Section (Sticky) */}
      <section data-hero id="home" className="hero-section">
        {/* 1. Animasi Garis Kontur 1px di Background (Stepped Noise Neighbor-Comparison asli LandoNorris.com) */}
        <canvas ref={bgCanvasRef} className="hero-bg-canvas" />

        {/* 2. Teks Watermark Raksasa di Latar Belakang */}
        <div className="hero-bg-watermark" aria-hidden="true">
          DEV
        </div>

        {/* 3. Interactive Three.js Shader Canvas (GPU Analytical Metaball Liquid) */}
        <canvas ref={heroCanvasRef} className="hero-canvas" />

        {/* 4. Foreground UI & Content */}
        <div className="hero-content">

          {/* Middle: Panel Telemetri di Kanan */}
          <div className="hero-middle">
            <div className="hero-panels-col">
              <div className="bracket-panel">
                <span className="b-corner tl" />
                <span className="b-corner tr" />
                <span className="b-corner bl" />
                <span className="b-corner br" />
                <span className="panel-eyebrow">Current Focus</span>
                <p
                  style={{
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    lineHeight: "1.35",
                    margin: 0,
                  }}
                >
                  <strong>Creative Frontend</strong>
                  <br />
                  React · Three.js · UI/UX
                  <br />
                  <span style={{ color: "var(--foreground-muted)" }}>
                    Season 2026
                  </span>
                </p>
              </div>

              <div className="bracket-panel">
                <span className="b-corner tl" />
                <span className="b-corner tr" />
                <span className="b-corner bl" />
                <span className="b-corner br" />
                <span className="panel-eyebrow">Highlights</span>
                <dl className="stats-grid">
                  <div>
                    <dt>Projects</dt>
                    <dd>14</dd>
                  </div>
                  <div>
                    <dt>Clients</dt>
                    <dd>08</dd>
                  </div>
                  <div>
                    <dt>Years</dt>
                    <dd>03</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Bottom: Nama & Navigasi Sosial */}
          <div className="hero-foot">
            <div className="driver-bottom-left">
              <ul className="driver-meta-list">
                <li>🇮🇩 Indonesia</li>
                <li>·</li>
                <li>Creative Developer</li>
              </ul>
              <h1 className="driver-name">
                Nikmatus
                <br />
                Solihah
              </h1>
            </div>

            <div className="hero-foot-actions">
              <div className="social-group">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-pill"
                >
                  Inst
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-pill"
                >
                  In
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="social-pill"
                >
                  Git
                </a>
              </div>

              <button
                type="button"
                className="lock-button"
                aria-pressed={isLocked}
                onClick={() => setIsLocked((locked) => !locked)}
              >
                {isLocked ? "Back to scroll" : "Tap to lock"}
              </button>

              <button
                type="button"
                onClick={scrollToComments}
                className="cta-button"
              >
                Comments
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Komponen Eksternal (Muncul di atas sticky Hero saat di-scroll) */}
      <div className="below-fold-content">
        {/* <RunningText /> */}
        <About />
        {/* <CommentsSection /> */}
      </div>
    </div>
  );
}