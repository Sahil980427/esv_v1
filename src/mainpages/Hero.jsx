import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const useScrambleText = (elementRef, text, delay = 0, shouldPlay = false) => {
  useEffect(() => {
    if (!shouldPlay) return;

    const el = elementRef.current;
    if (!el) return;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
    const scrambleState = { progress: 0 };

    const tl = gsap.timeline({ delay: delay });

    tl.to(scrambleState, {
      progress: 1,
      duration: 1.5,
      ease: "none",
      onUpdate: () => {
        const revealed = Math.floor(scrambleState.progress * text.length);
        el.innerText = text
          .split("")
          .map((letter, index) => {
            if (index < revealed) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
      },
      onComplete: () => {
        el.innerText = text;
      },
    });

    return () => tl.kill();
  }, [elementRef, text, delay, shouldPlay]);
};

export default function Hero({ startAnim }) {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);

  const brandRef1 = useRef(null);
  const brandRef2 = useRef(null);

  const heroContentRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState("");

  // --- Smooth Scroll Helper ---
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const updateTime = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    const interval = setInterval(updateTime, 1000);
    updateTime();
    return () => clearInterval(interval);
  }, []);

  // Canvas Background
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let nodes = [];
    let mouse = { x: -1000, y: -1000 };
    let theme = { bg: "", ink: "", inkRgb: "0,0,0" };

    const hexToRgb = (hex) => {
      const bigint = parseInt(hex.replace("#", ""), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `${r}, ${g}, ${b}`;
    };

    const updateThemeColors = () => {
      const isDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isDark) {
        theme.bg = "#24204A";
        theme.ink = "#D0BCFC";
        theme.inkRgb = hexToRgb("#D0BCFC");
      } else {
        theme.bg = "#D0BCFC";
        theme.ink = "#491AB1";
        theme.inkRgb = hexToRgb("#491AB1");
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateThemeColors();
      init();
    };

    class Node {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.size = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.fillStyle = theme.ink;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      nodes = [];
      for (let i = 0; i < 50; i++) nodes.push(new Node());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((node, i) => {
        node.update();
        node.draw();
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = node.x - nodes[j].x;
          const dy = node.y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${theme.inkRgb}, ${1 - dist / 180})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 250) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${theme.inkRgb}, ${1 - dist / 250})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });
      requestAnimationFrame(animate);
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      setCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    const themeWatcher = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = () => resize();
    themeWatcher.addEventListener("change", handleThemeChange);

    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      themeWatcher.removeEventListener("change", handleThemeChange);
    };
  }, []);

  // Entrance Animations
  useEffect(() => {
    if (!startAnim) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".corner-ui",
        { opacity: 0 },
        { opacity: 1, stagger: 0.2, duration: 0.5 },
        0
      );
      tl.fromTo(
        ".hero-anim",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" },
        0
      );
    }, overlayRef);
    return () => ctx.revert();
  }, [startAnim]);

  useScrambleText(brandRef1, "EDITSPACE", 0.5, startAnim);
  useScrambleText(brandRef2, "VISUALS", 0.7, startAnim);

  return (
    <div id="hero" className="cyber-container" ref={overlayRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syncopate:wght@400;700&display=swap');
        
        /* Scoped CSS Variables to .cyber-container */
        .cyber-container { 
          --bg: #D0BCFC; 
          --ink: #491AB1; 
          width: 100vw; 
          height: 100vh; 
          height: 100dvh; 
          background: var(--bg); 
          overflow: hidden; 
          position: relative; 
          font-family: 'Space Mono', monospace; 
          color: var(--ink); 
          transition: background-color 0.3s ease, color 0.3s ease; 
          cursor: none; 
        }
        
        @media (prefers-color-scheme: dark) { 
           .cyber-container { --bg: #24204A; --ink: #D0BCFC; } 
        }
        
        .cyber-container * { box-sizing: border-box; cursor: none; } 
        
        .cyber-container button, .cyber-container a { cursor: none; } 
        canvas { position: absolute; top: 0; left: 0; z-index: 1; }

        .ui-layer { position: relative; z-index: 10; width: 100%; height: 100%; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; pointer-events: none; }
        @media (max-width: 768px) { .ui-layer { padding: 1.5rem; } }
        .pointer-auto { pointer-events: auto; } .top-row, .bottom-row { display: flex; justify-content: space-between; align-items: flex-start; min-height: 40px; } .bottom-row { align-items: flex-end; } 
        
        .corner-ui { opacity: 0; } 
        .hero-anim { opacity: 0; }
        
        .data-block { text-align: right; font-size: 12px; line-height: 1.6; border-right: 2px solid var(--ink); padding-right: 15px; } .label { opacity: 0.6; margin-right: 8px; }
        .status-badge { border: 1px solid var(--ink); padding: 5px 10px; font-size: 10px; text-transform: uppercase; display: flex; align-items: center; gap: 8px; } .status-dot { width: 6px; height: 6px; background: #00ff88; box-shadow: 0 0 8px 1px rgba(0, 255, 136, 0.6); border-radius: 50%; animation: blink 2s infinite; } @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        
        .center-stage { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; width: 90%; max-width: 1200px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; z-index: 20; }
        @media (max-height: 500px) and (orientation: landscape) { .center-stage { gap: 0.5rem; } h1 { font-size: 40px !important; } }
        
        .brand-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: auto;
        }

        .cyber-container h1 { 
          font-family: 'Syncopate', sans-serif; 
          font-weight: 700; 
          font-size: clamp(32px, 8vw, 120px); 
          margin: 0; 
          line-height: 0.85; 
          color: transparent; 
          -webkit-text-stroke: 1.5px var(--ink); 
          letter-spacing: -2px; 
          text-transform: uppercase; 
          transition: 0.3s; 
        } 

        .brand-wrapper:hover h1 { 
          color: var(--ink); 
          letter-spacing: 0px; 
          -webkit-text-stroke: 0px; 
        }
        
        .hero-headline { font-family: 'Space Mono', monospace; font-size: clamp(14px, 2vw, 24px); font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--ink); margin: 0; margin-top: 10px; } 
        .hero-sub { font-size: clamp(12px, 1.5vw, 16px); max-width: 600px; line-height: 1.6; opacity: 0.8; margin: 0; } .cta-container { display: flex; gap: 20px; margin-top: 20px; pointer-events: auto; } @media (max-width: 480px) { .cta-container { flex-direction: column; gap: 10px; width: 100%; } .btn { width: 100%; } }
        .btn { background: transparent; color: var(--ink); border: 1px solid var(--ink); padding: 12px 32px; font-family: 'Space Mono', monospace; font-size: 14px; text-transform: uppercase; font-weight: 700; position: relative; overflow: hidden; transition: all 0.3s ease; } .btn:hover { background: var(--ink); color: var(--bg); box-shadow: 0 0 15px var(--ink); } .btn-primary { border-width: 2px; }
        .cursor-tracker { position: absolute; top: 0; left: 0; transform: translate(-50%, -50%); width: 40px; height: 40px; border: 1px dashed var(--ink); border-radius: 50%; pointer-events: none; z-index: 100; transition: width 0.2s, height 0.2s; }
        .desktop-mode { display: block; } .mobile-mode { display: none; } @media (max-width: 768px) { .desktop-mode { display: none; } .mobile-mode { display: block; } .cursor-tracker { display: none; } }
      `}</style>
      <div
        className="cursor-tracker"
        style={{ left: coords.x, top: coords.y }}
      />{" "}
      <canvas ref={canvasRef} />
      <div className="ui-layer">
        
        <div className="top-row">
          <div className="corner-ui">
             {/* Left side is now empty */}
          </div> 
          <div className="corner-ui">
            <span className="label desktop-mode">V.1.0</span>
          </div>
        </div>

        <div className="center-stage" ref={heroContentRef}>
          <div className="brand-wrapper">
            <h1 ref={brandRef1}>LOADING...</h1>
            <h1 ref={brandRef2}></h1>
          </div>

          <h2 className="hero-headline hero-anim">
            Design. Development. Intelligence.
          </h2>
          <p className="hero-sub hero-anim">
            From pixel-perfect design and high-performance coding to financial
            expertise and AI integration. We manage your digital evolution.
          </p>
          <div className="cta-container hero-anim">
            {/* UPDATED BUTTONS */}
            <button className="btn btn-primary" onClick={() => handleScroll('about')}>
              Explore Ecosystem
            </button>
            <button className="btn" onClick={() => handleScroll('contact')}>
              Start Your Project
            </button>
          </div>
        </div>

        <div className="bottom-row">
          <div className="corner-ui">
            <div className="status-badge">
              <div className="status-dot"></div>
              <span>System: Online</span>
            </div>
          </div>
          <div className="corner-ui data-block">
            <div>
              <span className="label">T:</span>
              {time}
            </div>
            <div className="desktop-mode">
              <div>
                <span className="label">X:</span>
                {coords.x.toString().padStart(4, "0")}
              </div>
              <div>
                <span className="label">Y:</span>
                {coords.y.toString().padStart(4, "0")}
              </div>
            </div>
            <div className="mobile-mode">
              <div style={{ marginTop: "5px" }}>
                <span className="label">VER:</span>1.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}