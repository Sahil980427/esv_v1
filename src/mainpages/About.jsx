import React, { useRef, useState, useLayoutEffect } from "react";
import {
  Layers,
  Cpu,
  TrendingUp,
  ArrowRight,
  Activity,
  Database,
  Palette,
  Zap,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * COMPONENT: GSAP High-Performance Tilt Card
 * Uses gsap.quickTo for buttery smooth 60fps animations without React re-renders
 */
const TiltCard = ({ children, className }) => {
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const glareRef = useRef(null);

  // GSAP QuickTo Setters (for high performance mouse tracking)
  const xTo = useRef(null);
  const yTo = useRef(null);
  const glareX = useRef(null);
  const glareY = useRef(null);

  useGSAP(
    () => {
      // Initialize quickTo functions for smooth interpolation
      xTo.current = gsap.quickTo(cardRef.current, "rotateY", {
        duration: 0.5,
        ease: "power3",
      });
      yTo.current = gsap.quickTo(cardRef.current, "rotateX", {
        duration: 0.5,
        ease: "power3",
      });

      // Glare movement
      glareX.current = gsap.quickTo(glareRef.current, "x", { duration: 0.1 });
      glareY.current = gsap.quickTo(glareRef.current, "y", { duration: 0.1 });

      // Floating animation for content (subtle breathing)
      gsap.to(contentRef.current, {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: cardRef }
  );

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (Multiplier determines tilt strength)
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    // Apply GSAP Transforms
    xTo.current(rotateY);
    yTo.current(rotateX);

    // Move Glare
    if (glareX.current && glareY.current) {
      glareX.current(x);
      glareY.current(y);
    }

    gsap.to(glareRef.current, { opacity: 1, duration: 0.2 });
  };

  const handleMouseLeave = () => {
    // Reset rotation
    xTo.current(0);
    yTo.current(0);
    // Hide glare
    gsap.to(glareRef.current, { opacity: 0, duration: 0.5 });
  };

  return (
    <div
      className={`tilt-card-wrapper bento-item ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1000px" }} // Perspective moved to wrapper
    >
      <div ref={cardRef} className="tilt-card-inner">
        {/* Dynamic Glare Layer */}
        <div ref={glareRef} className="glare-spot" />

        <div ref={contentRef} className="card-content">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * COMPONENT: Animated Header Title
 */
const HoverTitle = () => {
  const title = "EditSpaceVisuals";
  const containerRef = useRef(null);

  useGSAP(
    () => {
      // Staggered entrance
      gsap.from(".char", {
        y: 100,
        opacity: 0,
        rotateX: -90,
        stagger: 0.05,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        delay: 0.2,
      });
    },
    { scope: containerRef }
  );

  const handleHover = () => {
    // Wave effect on hover
    gsap.to(".char", {
      y: -10,
      stagger: 0.03,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });
  };

  return (
    <h1
      ref={containerRef}
      className="interactive-title"
      onMouseEnter={handleHover}
    >
      {title.split("").map((char, index) => (
        <span key={index} className="char" style={{ display: "inline-block" }}>
          {char}
        </span>
      ))}
    </h1>
  );
};

export default function About() {
  const containerRef = useRef(null);
  const bgBlobRef = useRef(null);

  // --- SMOOTH SCROLL HANDLER ---
  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useGSAP(
    () => {
      // 1. Background Blob Animation (Organic movement)
      gsap.to(bgBlobRef.current, {
        rotate: 360,
        x: 50,
        y: 50,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 2. Master Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".header-pill",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5 }
      )
        .fromTo(
          ".subtitle",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.2"
        )
        .fromTo(
          ".bento-item",
          { y: 100, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1 },
          "-=0.5"
        );
    },
    { scope: containerRef }
  );

  return (
    <div id="about" className="app-container" ref={containerRef}>
      <style>{`
        /* --- STRICT DESIGN SYSTEM --- */
        :root {
          --font-main: 'Nunito', sans-serif;
          --bg-main: #1A1230;      
          --card-bg: #24204A;      
          --text-main: #D0BCFC;    
          --text-muted: rgba(208, 188, 252, 0.7);
          --accent: #491AB1;       
          --border: rgba(208, 188, 252, 0.1);
          --pill-bg: rgba(208, 188, 252, 0.05);
        }

        body { 
          margin: 0; 
          background-color: var(--bg-main); 
          font-family: var(--font-main); 
          color: var(--text-main);
          overflow-x: hidden;
        }

        .app-container {
          min-height: 100vh;
          width: 100%;
          padding: 4rem 2rem;
          box-sizing: border-box;
          display: flex; flex-direction: column; align-items: center;
          position: relative;
          overflow: hidden;
        }

        /* Ambient Background Blob */
        .bg-blob {
            position: absolute;
            top: -20%; left: -10%;
            width: 800px; height: 800px;
            background: radial-gradient(circle, rgba(73, 26, 177, 0.15) 0%, rgba(0,0,0,0) 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            filter: blur(60px);
        }

        /* --- HEADER --- */
        .header-section { 
          text-align: center; 
          margin-bottom: 4rem; 
          position: relative; 
          max-width: 800px;
          padding: 0 1rem;
          z-index: 2;
        }
        
        .interactive-title {
          font-size: clamp(3rem, 6vw, 4.5rem);
          font-weight: 900;
          margin: 1rem 0;
          line-height: 1.1;
          cursor: default;
          color: var(--text-main); 
        }

        .subtitle {
          color: var(--text-muted); 
          font-size: 1.2rem; 
          font-weight: 600;
          line-height: 1.6;
        }

        /* --- UI ELEMENTS --- */
        .tag-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 16px;
          background: var(--pill-bg);
          border: 1px solid var(--border);
          color: var(--text-main);
          border-radius: 50px;
          font-size: 0.85rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 1px;
        }

        /* --- BENTO GRID --- */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-auto-rows: minmax(220px, auto);
          gap: 1.5rem;
          max-width: 1100px; width: 100%;
          z-index: 2;
        }

        .col-span-8 { grid-column: span 8; }
        .col-span-4 { grid-column: span 4; }
        .col-span-6 { grid-column: span 6; }

        /* --- TILT CARD --- */
        .tilt-card-wrapper { height: 100%; }

        .tilt-card-inner {
          position: relative; height: 100%; width: 100%;
          background: var(--card-bg);
          border-radius: 32px;
          border: 1px solid var(--border);
          transform-style: preserve-3d; /* Essential for 3D content */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        /* The Glare Spot (High Performance) */
        .glare-spot {
            position: absolute;
            width: 600px; height: 600px;
            background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%);
            transform: translate(-50%, -50%); /* Center the gradient on coordinates */
            pointer-events: none;
            opacity: 0;
            top: 0; left: 0;
            z-index: 10;
        }

        .card-content {
          padding: 2.5rem;
          height: 100%;
          display: flex; flex-direction: column; justify-content: space-between;
          transform: translateZ(30px); /* Push content forward in 3D space */
          box-sizing: border-box;
          position: relative;
          z-index: 20;
        }

        .icon-box {
          width: 48px; height: 48px;
          background: var(--pill-bg);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-main);
          margin-bottom: 1.5rem;
        }

        h3 {
          font-size: 1.6rem; margin: 0 0 10px 0; 
          color: var(--text-main);
          font-weight: 800;
        }

        p {
          font-size: 1rem; color: var(--text-muted); 
          line-height: 1.7; margin: 0; font-weight: 600;
        }

        /* --- RESPONSIVE --- */
        @media (min-width: 768px) and (max-width: 1024px) {
          .col-span-8, .col-span-4 { grid-column: span 12; }
          .col-span-6 { grid-column: span 6; }
          .interactive-title { font-size: 3.5rem; } 
          .app-container { padding: 3rem 2rem; }
        }

        @media (max-width: 767px) {
          .col-span-8, .col-span-4, .col-span-6 { grid-column: span 12; }
          .interactive-title { font-size: 2.2rem; }
          .app-container { padding: 3rem 1.5rem; }
          .card-content { padding: 2rem; }
          .bento-grid { gap: 1rem; }
        }
      `}</style>

      {/* Background Ambient Animation */}
      <div ref={bgBlobRef} className="bg-blob" />

      {/* Header */}
      <div className="header-section">
        <div className="header-pill">
          <div className="tag-pill">
            <Zap size={16} fill="currentColor" /> About Us
          </div>
        </div>

        <HoverTitle />

        <p className="subtitle">
          Bridging creative imagination with technical precision. A holistic
          digital ecosystem built on robust data and stunning visuals.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="bento-grid">
        {/* Card 1 */}
        <div className="col-span-8">
          <TiltCard>
            <div className="icon-box">
              <Activity size={28} strokeWidth={2.5} />
            </div>
            <h3>The 360° Ecosystem</h3>
            <p>
              We don't just execute tasks; we engineer robust{" "}
              <strong>Databases</strong>, craft stunning{" "}
              <strong>Designs</strong>, and build <strong>AI Solutions</strong>.
            </p>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <span className="tag-pill">Holistic</span>
              <span className="tag-pill">End-to-End</span>
            </div>
          </TiltCard>
        </div>

        {/* Card 2 */}
        <div className="col-span-4">
          <TiltCard>
            <div className="icon-box">
              <Palette size={28} strokeWidth={2.5} />
            </div>
            <h3>Creative Tech</h3>
            <p>From pixel-perfect Web Design to complex CMS Architecture.</p>
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                gap: "15px",
                opacity: 0.8,
                color: "var(--text-main)",
              }}
            >
              <Layers size={24} />{" "}
              <ArrowRight size={16} style={{ alignSelf: "center" }} />{" "}
              <Cpu size={24} />
            </div>
          </TiltCard>
        </div>

        {/* Card 3 */}
        <div className="col-span-6">
          <TiltCard>
            <div className="icon-box">
              <TrendingUp size={28} strokeWidth={2.5} />
            </div>
            <h3>Education & Trading</h3>
            <p>
              Our dedicated platforms for Trading Expertise and Course Delivery
              ensure you are equipped with knowledge, not just tools.
            </p>
          </TiltCard>
        </div>

        {/* Card 4 */}
        <div className="col-span-6">
          <TiltCard>
            <div className="icon-box">
              <Database size={28} strokeWidth={2.5} />
            </div>
            <h3>Strategic Partner</h3>
            <p>
              Whether elevating brand identity or automating workflows, we
              navigate the future with you.
            </p>
            {/* UPDATED: Added link to #contact */}
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, "contact")}
              style={{
                marginTop: "20px",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: "800",
                cursor: "pointer",
                color: "var(--text-main)",
                textDecoration: "none",
              }}
            >
              Start Project <ArrowRight size={20} />
            </a>
          </TiltCard>
        </div>
      </div>
    </div>
  );
}
