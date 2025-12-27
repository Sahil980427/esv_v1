import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function KnowledgeService() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const widgetsRef = useRef(null);

  // Live Data State
  const [btcPrice, setBtcPrice] = useState(42150);
  const [activeUsers, setActiveUsers] = useState(1284);

  // --- 1. CANVAS: Cinematic Multi-Wave Background ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width, height;
    let time = 0;

    // High DPI Scaling for crisp lines
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const waves = [
      {
        amplitude: 40,
        frequency: 0.01,
        speed: 0.03,
        color: "rgba(73, 26, 177, 0.1)",
        offset: 0,
      },
      {
        amplitude: 60,
        frequency: 0.02,
        speed: 0.02,
        color: "rgba(73, 26, 177, 0.2)",
        offset: 100,
      },
      {
        amplitude: 30,
        frequency: 0.015,
        speed: 0.04,
        color: "rgba(208, 188, 252, 0.05)",
        offset: 50,
      },
    ];

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const cy = height * 0.85;

      waves.forEach((wave) => {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 10) {
          const y =
            cy +
            Math.sin(x * wave.frequency + time * wave.speed + wave.offset) *
              wave.amplitude +
            Math.cos(x * wave.frequency * 0.5 + time * wave.speed) *
              (wave.amplitude * 0.5);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fillStyle = wave.color;
        ctx.fill();

        ctx.beginPath();
        for (let x = 0; x <= width; x += 10) {
          const y =
            cy +
            Math.sin(x * wave.frequency + time * wave.speed + wave.offset) *
              wave.amplitude +
            Math.cos(x * wave.frequency * 0.5 + time * wave.speed) *
              (wave.amplitude * 0.5);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = wave.color
          .replace("0.1", "0.4")
          .replace("0.2", "0.5");
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      ctx.strokeStyle = "rgba(255,255,255,0.02)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 120) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      time++;
      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // --- 2. SMOOTHER DATA SIMULATION ---
  useEffect(() => {
    const interval = setInterval(() => {
      setBtcPrice(
        (p) =>
          p + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 15)
      );
      setActiveUsers(
        (u) => u + (Math.random() > 0.6 ? 1 : Math.random() > 0.5 ? -1 : 0)
      );
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // --- 3. INTERACTIVE MOUSE PARALLAX & ENTRANCE ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.to(".divider", { height: "100%", duration: 2, ease: "power2.inOut" })
        .fromTo(
          ".char-anim",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, duration: 1.2 },
          "-=1.5"
        )
        .fromTo(
          ".widget-container",
          { x: 50, opacity: 0, scale: 0.9 },
          { x: 0, opacity: 1, scale: 1, stagger: 0.2, duration: 1.5 },
          "-=1"
        );

      const handleMouseMove = (e) => {
        // Disable parallax on mobile/touch devices to prevent layout thrashing
        if (window.matchMedia("(hover: none)").matches) return;

        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 20;
        const yPos = (clientY / window.innerHeight - 0.5) * 20;

        gsap.to(".widget-container", {
          rotationY: xPos,
          rotationX: -yPos,
          x: xPos * 0.5,
          y: yPos * 0.5,
          duration: 1,
          ease: "power2.out",
          transformPerspective: 1000,
          transformOrigin: "center center",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    // <--- ADDED ID HERE --->
    <div id="knowledge" className="section-wrapper" ref={containerRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700&display=swap');

        :root {
          --bg: #0F0C29;
          --accent: #6C63FF;
          --accent-glow: rgba(108, 99, 255, 0.4);
          --text: #E0E6ED;
          --white: #ffffff;
          --glass-border: rgba(255, 255, 255, 0.08);
        }

        * { box-sizing: border-box; }

        .section-wrapper {
          position: relative;
          width: 100vw;
          min-height: 100vh;
          background: linear-gradient(135deg, #0F0C29 0%, #24243e 100%);
          font-family: 'Space Grotesk', sans-serif;
          color: var(--text);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 40px 20px; /* Base padding to prevent edge sticking */
        }

        canvas {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
        }

        .glow-spot {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, var(--accent-glow) 0%, rgba(0,0,0,0) 70%);
          top: 50%; left: 20%;
          transform: translate(-50%, -50%);
          z-index: 0;
          opacity: 0.3;
          pointer-events: none;
        }

        .layout-grid {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1400px;
          display: grid;
          /* Desktop Default */
          grid-template-columns: 1.2fr auto 1fr;
          align-items: center;
          /* Fluid Gap */
          gap: clamp(40px, 5vw, 80px); 
        }

        /* --- LEFT SIDE --- */
        .left-content {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .meta-tag {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--accent);
          display: flex;
          align-items: center;
          gap: 12px;
          opacity: 0.9;
        }
        .meta-tag::before {
          content: ''; width: 30px; height: 1px; background: var(--accent);
        }

        h2 {
          /* Responsive Font Size using clamp */
          font-size: clamp(38px, 5.5vw, 85px);
          font-weight: 700;
          line-height: 1.05;
          margin: 0;
          color: var(--white);
          letter-spacing: -2px;
        }

        .outline {
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.3);
          position: relative;
        }
        
        p {
          font-size: clamp(16px, 1.5vw, 18px);
          line-height: 1.7;
          max-width: 520px;
          font-weight: 300;
          color: #B0B7C3;
        }

        /* --- DIVIDER --- */
        .divider-container {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .divider {
          width: 1px;
          height: 0;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);
        }

        /* --- RIGHT SIDE --- */
        .right-content {
          display: flex;
          flex-direction: column;
          gap: 30px;
          width: 100%;
        }

        .widget-container {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--glass-border);
          border-top: 1px solid rgba(255,255,255,0.15);
          /* Responsive padding */
          padding: clamp(25px, 3vw, 35px);
          border-radius: 20px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 50px -20px rgba(0,0,0,0.5);
          transition: border-color 0.3s ease, background 0.3s ease;
          position: relative;
          overflow: hidden;
          margin: 0 auto; /* Centering for mobile stacks */
        }

        .widget-container::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
          opacity: 0.5;
        }

        .widget-container:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255,255,255,0.2);
        }

        .widget-header {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #8A94A6;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .widget-value {
          /* Fluid font size for numbers */
          font-size: clamp(32px, 4vw, 42px);
          font-weight: 600;
          color: var(--white);
          font-variant-numeric: tabular-nums;
          letter-spacing: -1px;
        }

        .status-dot {
          width: 8px; height: 8px;
          background: #00FF94;
          border-radius: 50%;
          box-shadow: 0 0 10px #00FF94;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* --- RESPONSIVE BREAKPOINTS --- */

        /* Tablet / Small Laptop (Stack Layout) */
        @media (max-width: 1100px) {
          .layout-grid {
            grid-template-columns: 1fr; /* Switch to single column */
            gap: 50px;
            text-align: center;
          }

          .left-content {
            align-items: center;
          }

          .meta-tag {
            justify-content: center;
          }

          p {
            margin: 0 auto; /* Center paragraph text */
          }

          /* Hide divider on stack */
          .divider-container {
            display: none;
          }

          .glow-spot {
            left: 50%;
            top: 30%; /* Move glow up */
          }
          
          /* Widgets container adjustment for tablet */
          .right-content {
              align-items: center;
          }
        }

        /* Mobile Phones */
        @media (max-width: 600px) {
          .section-wrapper {
              padding: 80px 20px; /* More top padding for nav spacing */
              align-items: flex-start; /* Align top for scroll */
          }

          h2 {
              font-size: 40px; /* Specific fallback for very small screens */
          }

          .widget-container {
            max-width: 100%; /* Full width widgets */
          }
          
          .glow-spot {
            width: 300px;
            height: 300px;
          }
        }
      `}</style>

      {/* 1. Background Elements */}
      <canvas ref={canvasRef} />
      <div className="glow-spot"></div>

      {/* 2. Main Grid */}
      <div className="layout-grid">
        {/* Left: Content */}
        <div className="left-content">
          <div className="meta-tag char-anim">Education Platform</div>
          <h2 className="char-anim">
            Knowledge <br />
            <span className="outline">As a Service.</span>
          </h2>
          <p className="char-anim">
            We provide the blueprint for market success through expert-led
            trading modules. Data-driven learning for the modern era.
          </p>
        </div>

        {/* Center: Divider (Hidden on Mobile/Tablet) */}
        <div className="divider-container">
          <div className="divider"></div>
        </div>

        {/* Right: Floating Widgets */}
        <div className="right-content" ref={widgetsRef}>
          {/* Widget 1 */}
          <div className="widget-container">
            <div className="widget-header">
              <span>Global Index</span>
              <div className="status-dot"></div>
            </div>
            <div className="widget-value">${btcPrice.toLocaleString()}</div>
            <div
              style={{
                fontSize: "13px",
                marginTop: "8px",
                color: "#00FF94",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M18 15l-6-6-6 6" />
              </svg>
              <span>+2.4% volatility</span>
            </div>
          </div>

          {/* Widget 2 */}
          <div className="widget-container">
            <div className="widget-header">
              <span>Active Students</span>
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  background: "#fff",
                  borderRadius: "50%",
                  opacity: 0.5,
                }}
              ></div>
            </div>
            <div className="widget-value">{activeUsers.toLocaleString()}</div>
            <div
              style={{ fontSize: "13px", marginTop: "8px", color: "#8A94A6" }}
            >
              currently accessing modules
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
