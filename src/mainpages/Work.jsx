import React, { useLayoutEffect, useRef, useState, useEffect } from "react";

// --- Configuration ---
const PROJECTS = [
  {
    id: 1,
    title: "Lumina",
    category: "Branding",
    src: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Apex Arch",
    category: "Architecture",
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Vortex",
    category: "Web Design",
    src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Essence",
    category: "Packaging",
    src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Mono",
    category: "Photography",
    src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Nebula",
    category: "Development",
    src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
  },
];

export default function Work() {
  const rootRef = useRef(null);
  const gridContainerRef = useRef(null);
  const bgTextRef = useRef(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  // --- Robust Script Loading (GSAP) ---
  useEffect(() => {
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      setScriptsLoaded(true);
      return;
    }
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };
    Promise.all([
      loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
      ),
      loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
      ),
    ])
      .then(() => {
        setTimeout(() => {
          if (window.gsap && window.ScrollTrigger) {
            window.gsap.registerPlugin(window.ScrollTrigger);
            setScriptsLoaded(true);
          }
        }, 100);
      })
      .catch((err) => console.error("GSAP load error:", err));
  }, []);

  // --- Animation Logic ---
  useLayoutEffect(() => {
    if (!scriptsLoaded) return;
    const gsap = window.gsap;

    const ctx = gsap.context(() => {
      const gridItems = gsap.utils.toArray(".grid-item");

      // 1. Initial Chaotic State
      gridItems.forEach((item) => {
        gsap.set(item, {
          z: gsap.utils.random(-2000, 1000),
          xPercent: gsap.utils.random(-150, 150),
          yPercent: gsap.utils.random(-150, 150),
          rotationX: gsap.utils.random(-60, 60),
          rotationY: gsap.utils.random(-60, 60),
          opacity: 0,
        });
      });

      // 2. Main Scroll Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top", // Starts exactly when the top of the container hits the top of viewport
          end: "+=3500",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 3. Assembly Animation
      tl.to(gridItems, {
        xPercent: 0,
        yPercent: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        opacity: 1,
        scale: 1,
        duration: 2.5,
        stagger: { amount: 0.8, from: "random" },
        ease: "power3.out",
      })
        // Fade out the background text slightly so images pop
        .to(
          bgTextRef.current,
          {
            opacity: 0,
            scale: 0.9,
            duration: 2,
          },
          "<"
        );

      // 4. Subtle Drift (Parallax)
      tl.to(
        gridContainerRef.current,
        {
          z: 150,
          rotationX: 5,
          ease: "none",
          duration: 1,
        },
        "<"
      );
    }, rootRef);

    // Mouse Interaction
    const handleMouseMove = (e) => {
      if (!gridContainerRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 15;
      const y = (e.clientY / innerHeight - 0.5) * 15;

      gsap.to(gridContainerRef.current, {
        rotationY: x,
        rotationX: -y,
        duration: 1,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [scriptsLoaded]);

  return (
    <>
      {/* --- SCROLL ANCHOR --- 
        This div is the target for your Navbar Link.
        It sits exactly above the pinned section. 
        When you click "#work", the browser scrolls here, which is 
        start of the animation (Top Top).
      */}
      <div id="work" className="section-anchor" />

      {/* Main Pinned Container (ID Removed from here to prevent conflicts) */}
      <div ref={rootRef} className="agency-wrapper">
        {/* Import Nunito Font */}
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');

        /* --- STYLES --- */
        :root {
          --bg-primary: #D0BCFC;
          --text-primary: #491AB1;
          --card-overlay: rgba(73, 26, 177, 0.9);
          --card-text: #D0BCFC; 
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --bg-primary: #24204A;
            --text-primary: #D0BCFC;
            --card-overlay: rgba(26, 18, 48, 0.95);
            --card-text: #D0BCFC;
          }
        }
        
        /* The Anchor needs to be invisible but present */
        .section-anchor {
           position: absolute;
           margin-top: -1px; /* Slight offset ensures trigger hits perfectly */
           width: 1px;
           height: 1px;
           opacity: 0;
           pointer-events: none;
        }

        .agency-wrapper {
          height: 100vh;
          width: 100%;
          background-color: var(--bg-primary);
          color: var(--text-primary);
          font-family: 'Nunito', sans-serif;
          overflow: hidden;
          position: relative;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .viewport-center {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          perspective: 1500px;
        }

        /* --- Background Text Group --- */
        .bg-text-group {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 0;
        }

        .headline-bg {
          font-size: clamp(4rem, 15vw, 20rem);
          font-weight: 900;
          color: var(--text-primary);
          opacity: 0.08;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: -0.05em;
          margin: 0;
          line-height: 0.8;
        }

        .quote-sub {
          font-size: clamp(0.75rem, 1.5vw, 1rem);
          font-weight: 600;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.3em;
          opacity: 0.6;
          margin-top: 1rem;
          text-align: center;
        }

        .quote-sub .highlight {
          color: var(--text-primary);
          font-weight: 900;
          opacity: 1;
        }

        /* --- Grid --- */
        .grid-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          width: 80vw;
          max-width: 1100px;
          aspect-ratio: 16/9;
          transform-style: preserve-3d;
          z-index: 10;
        }

        @media (max-width: 768px) {
           .grid-container { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }

        .grid-item {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 16px;
          overflow: hidden;
          background: var(--text-primary);
          transform-style: preserve-3d;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          cursor: pointer;
        }

        .grid-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Project Info Overlay */
        .project-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 24px;
          background: var(--card-overlay);
          color: var(--card-text);
          transform: translateY(100%);
          transition: transform 0.4s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .grid-item:hover .grid-img {
          transform: scale(1.15);
        }
        .grid-item:hover .project-overlay {
          transform: translateY(0);
        }

        .project-info {
          display: flex;
          flex-direction: column;
        }

        .project-title {
          font-size: 1.25rem;
          font-weight: 900;
          margin: 0;
          letter-spacing: 0.02em;
        }

        .project-category {
          font-size: 0.85rem;
          font-weight: 700;
          opacity: 0.8;
          margin-top: 4px;
        }

        .loading-text {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-weight: 900;
          letter-spacing: 2px;
          color: var(--text-primary);
        }
      `}</style>

        <div className="viewport-center">
          <div ref={bgTextRef} className="bg-text-group">
            <h1 className="headline-bg">WORK</h1>
            <p className="quote-sub">
              Our <span className="highlight">work</span> is the silent ambassador
              of our quality
            </p>
          </div>

          <div ref={gridContainerRef} className="grid-container">
            {PROJECTS.map((project) => (
              <div key={project.id} className="grid-item">
                <img src={project.src} alt={project.title} className="grid-img" />

                <div className="project-overlay">
                  <div className="project-info">
                    <span className="project-title">{project.title}</span>
                    <span className="project-category">{project.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!scriptsLoaded && <div className="loading-text">LOADING ASSETS...</div>}
      </div>
    </>
  );
}