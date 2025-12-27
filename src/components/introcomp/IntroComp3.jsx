import React, { useLayoutEffect, useRef } from "react";

// Helper component to split text into characters for individual animation
const SplitWord = ({ word, className }) => (
  <span className={`inline-block whitespace-nowrap ${className}`}>
    {word.split("").map((char, i) => (
      <span key={i} className="intro-char inline-block" style={{ opacity: 0 }}>
        {char === " " ? "\u00A0" : char}
      </span>
    ))}
  </span>
);

export default function IntroComp3() {
  const containerRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const textWrapperRef = useRef(null);

  useLayoutEffect(() => {
    // 1. Load Nunito (Heavier weights for impact)
    const linkFont = document.createElement("link");
    linkFont.href =
      "https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap";
    linkFont.rel = "stylesheet";
    document.head.appendChild(linkFont);

    const gsap = window.gsap;
    const chars = textWrapperRef.current.querySelectorAll(".intro-char");
    const particles = containerRef.current.querySelectorAll(".particle");

    // --- INITIAL SETUP ---
    gsap.set(containerRef.current, { display: "flex" });

    // 3D Text Setup
    gsap.set(chars, {
      y: 100,
      rotateX: -90,
      opacity: 0,
      transformOrigin: "50% 50% -50px", // Deep 3D pivot
    });

    // Particle Setup (Random positions)
    particles.forEach((p) => {
      gsap.set(p, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 0.5 + 0.5,
        opacity: 0,
      });
    });

    const tl = gsap.timeline();

    // --- SEQUENCE ---

    // 1. Particles flicker in
    tl.to(
      particles,
      {
        opacity: 0.4,
        duration: 1,
        stagger: { amount: 0.5, from: "random" },
      },
      0
    );

    // 2. Slow Float for particles (continuous background noise)
    gsap.to(particles, {
      y: "+=100",
      x: "+=50",
      rotation: "random(0, 360)",
      duration: "random(10, 20)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // 3. TEXT EXPLOSION ENTRY
    // Staggered character entry with 3D rotation
    tl.to(
      chars,
      {
        y: 0,
        rotateX: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.05, // Rapid fire per letter
        ease: "elastic.out(1, 0.6)", // Heavy bounce
      },
      0.2
    );

    // 4. Highlight Sweep (simulated via text shadow/color shift)
    tl.to(
      chars,
      {
        color: "var(--bg-primary)", // Flash to bg color
        textShadow: "0 0 20px var(--text-highlight)", // Glow
        duration: 0.1,
        stagger: { amount: 0.3, from: "start" },
        yoyo: true,
        repeat: 1,
      },
      1.5
    );

    // 5. THE EXIT: "Barn Door" Split
    // First, text zooms into camera and vanishes
    tl.to(
      chars,
      {
        z: 500,
        opacity: 0,
        duration: 0.5,
        stagger: { amount: 0.2, from: "center" },
        ease: "power2.in",
      },
      2.2
    );

    // Then panels split L/R
    tl.to(
      [leftPanelRef.current, rightPanelRef.current],
      {
        width: "0%",
        duration: 0.8,
        ease: "power4.inOut",
        stagger: 0,
      },
      2.6
    );

    // Cleanup
    tl.add(() => {
      gsap.set(containerRef.current, { display: "none" });
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      <style>{`
        /* --- STRICT THEME --- */
        :root {
          --bg-primary: #D0BCFC;
          --text-highlight: #491AB1;
          --particle-color: #ffffff;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --bg-primary: #24204A;
            --text-highlight: #D0BCFC;
            --particle-color: #491AB1;
          }
        }

        /* Container holds the two panels */
        .intro-container {
          position: fixed;
          inset: 0;
          z-index: 9999;
          width: 100vw;
          height: 100vh;
          display: flex; /* Split layout */
          pointer-events: none; /* Let clicks pass through after animation */
        }

        /* The "Barn Doors" */
        .intro-panel {
          height: 100%;
          width: 50%;
          background-color: var(--bg-primary);
          position: relative;
          z-index: 10;
          overflow: hidden;
          will-change: width;
        }
        .panel-left { border-right: 1px solid rgba(0,0,0,0.05); }
        .panel-right { border-left: 1px solid rgba(0,0,0,0.05); }

        /* Centered Content Wrapper (Absolute on top of panels) */
        .content-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          mix-blend-mode: normal;
          perspective: 1000px; /* 3D effect context */
        }

        @media (min-width: 768px) {
          .content-wrapper { flex-direction: row; gap: 1rem; }
        }

        .intro-word {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 15vw;
          line-height: 1;
          color: var(--text-highlight);
          display: flex;
        }
        
        @media (min-width: 768px) { .intro-word { font-size: 8vw; } }

        /* Particles */
        .particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--particle-color);
          z-index: 11; /* Above panels, below text */
          pointer-events: none;
        }
      `}</style>

      <div ref={containerRef} className="intro-container">
        {/* Left Shutter */}
        <div ref={leftPanelRef} className="intro-panel panel-left"></div>

        {/* Right Shutter */}
        <div ref={rightPanelRef} className="intro-panel panel-right"></div>

        {/* Particles (Scattered across screen, but technically inside container) */}
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}

        {/* Text Layer */}
        <div ref={textWrapperRef} className="content-wrapper">
          <SplitWord word="Edit" className="intro-word" />
          <SplitWord word="Space" className="intro-word" />
          <SplitWord word="Visuals" className="intro-word" />
        </div>
      </div>
    </>
  );
}
