import React, { useLayoutEffect, useRef, useState, useEffect } from "react";

// --- PREMIUM AGENCY DATA ---
const SERVICES_DATA = [
  {
    label: "Web Development",
    src: "/wheelimage/1.jpeg",
    // "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Graphic Design",
    src: "/wheelimage/2.jpeg",
    // "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Trading Expertise",
    src: "/wheelimage/3.jpeg",
    // "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Video Editing",
    src: "/wheelimage/4.webp",
    // "https://i.pcmag.com/imagery/reviews/06A9MdJJnRy67fTdILpVS5M-145..v1646934350.png",
  },
  {
    label: "AI & Bot Development",
    src: "/wheelimage/5.jpeg",
    // "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Database Handling",
    src:"/wheelimage/6.jpeg",
    //  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Digital Marketing",
    src: "/wheelimage/7.jpeg",
    // "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Course Providing",
    src:"/wheelimage/8.jpeg",
    //  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "WordPress Design",
    src: "/wheelimage/9.jpeg",
    // "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Photo Editing",
    src: "/wheelimage/10.jpeg",
    // "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Advanced Tech Solutions",
    src: "/wheelimage/11.jpeg",
    // "https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Pro Trading Setup",
    src: "/wheelimage/12.jpeg",
    // "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Premium Workspace",
    src:"/wheelimage/13.jpeg",
    //  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=400&auto=format&fit=crop",
  },
  {
    label: "Digital Strategy",
    src: "/wheelimage/14.jpeg",
    // "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop",
  },
];

export default function EditSpaceVisualsWheelHover() {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const wheelRef = useRef(null);
  const textRef = useRef(null);
  const cardsRef = useRef([]);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  // Drag Refs
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentRotation = useRef(0);
  const targetRotation = useRef(0);

  // --- Script Loading ---
  useEffect(() => {
    if (window.gsap && window.ScrollTrigger) {
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
    ]).then(() => {
      setTimeout(() => {
        if (window.gsap && window.ScrollTrigger) {
          window.gsap.registerPlugin(window.ScrollTrigger);
          setScriptsLoaded(true);
        }
      }, 100);
    });
  }, []);

  // --- Right Click Drag Logic ---
  useEffect(() => {
    if (!scriptsLoaded) return;

    const handleMouseDown = (e) => {
      if (e.button === 2) {
        // Right Click
        e.preventDefault();
        isDragging.current = true;
        startX.current = e.clientX;
        document.body.style.cursor = "grabbing";
      }
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - startX.current;
      targetRotation.current = currentRotation.current + deltaX * 0.5;

      window.gsap.to(wheelRef.current, {
        rotation: targetRotation.current,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        currentRotation.current = targetRotation.current;
        document.body.style.cursor = "default";
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousedown", handleMouseDown);
      container.addEventListener("contextmenu", (e) => e.preventDefault());
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousedown", handleMouseDown);
        container.removeEventListener("contextmenu", (e) => e.preventDefault());
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [scriptsLoaded]);

  // --- Animation Lifecycle (Responsive) ---
  useLayoutEffect(() => {
    if (!scriptsLoaded) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    const ctx = gsap.context(() => {
      const wheel = wheelRef.current;
      const text = textRef.current;
      const cards = cardsRef.current;

      // Create a MatchMedia instance for responsive GSAP
      const mm = gsap.matchMedia();

      // --- 1. SETUP PHASE (Same for all screens, but radius differs) ---
      
      // We define the animation logic inside matchMedia to handle different radii
      mm.add({
        // Desktop
        isDesktop: "(min-width: 769px)",
        // Mobile/Tablet
        isMobile: "(max-width: 768px)",
      }, (context) => {
        const { isDesktop } = context.conditions;

        // RESPONSIVE CONFIGURATION
        const radius = isDesktop ? 350 : 140; // Smaller radius for mobile
        const zoomScale = isDesktop ? 3.5 : 2.2; // Less zoom on mobile
        const zoomYOffset = isDesktop ? 1250 : 420; // Adjust Y to keep image in view on mobile
        const angleStep = 360 / SERVICES_DATA.length;

        // Initial Explosion In
        gsap.fromTo(
          cards,
          {
            scale: 0,
            rotation: (i) => i * 360,
            opacity: 0,
          },
          {
            duration: 1.5,
            scale: 1,
            rotation: (i) => i * angleStep + 90,
            opacity: 1,
            x: (i) => Math.cos((i * angleStep * Math.PI) / 180) * radius,
            y: (i) => Math.sin((i * angleStep * Math.PI) / 180) * radius,
            ease: "elastic.out(1, 0.75)",
            stagger: 0.05,
          }
        );

        // Intro Text
        gsap.fromTo(
          text.children,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.5,
          }
        );

        // --- 2. SCROLL ANIMATION ---
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=4000",
            pin: true,
            scrub: 1,
            onEnter: () => {
              const currentRot = gsap.getProperty(wheel, "rotation");
              currentRotation.current = currentRot;
            },
          },
        });

        tl.to(text, { opacity: 0, scale: 0.5, duration: 0.5 }, 0);

        tl.to(
          wheel,
          {
            scale: zoomScale,
            y: zoomYOffset, 
            rotation: 0,
            duration: 2,
            ease: "power2.inOut",
          },
          0
        );

        tl.to(
          wheel,
          {
            rotation: -360,
            duration: 8,
            ease: "none",
          },
          ">"
        );
      }); // End matchMedia

    }, wrapperRef);

    return () => ctx.revert();
  }, [scriptsLoaded]);

  if (!scriptsLoaded) return null;

  return (
    <div id="wheelimage" ref={wrapperRef} style={{ background: "#24204A" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;600;700;900&display=swap');

        :root {
          --bg-color: #24204A;
          --secondary-color: #1A1230;
          --text-color: #D0BCFC;
          --accent-color: #A970FF;
        }

        body { margin: 0; background: var(--bg-color); overflow-x: hidden; }

        .wheel-section {
          width: 100%;
          height: 100vh;
          background-color: var(--bg-color);
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          color: var(--text-color);
          font-family: 'Nunito', sans-serif;
          perspective: 1000px;
        }

        /* Ambient Blobs */
        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
          pointer-events: none;
          z-index: 1;
        }
        .blob-1 { width: 800px; height: 800px; background: #491AB1; top: -30%; left: -20%; }
        
        /* Mobile Blob Adjustments */
        @media (max-width: 768px) {
          .blob-1 { width: 400px; height: 400px; top: -10%; left: -10%; }
        }

        .center-content {
          position: absolute;
          z-index: 20;
          text-align: center;
          pointer-events: none;
          padding: 0 20px;
          width: 100%;
        }

        .main-headline {
          font-weight: 900;
          font-size: 4rem;
          line-height: 1.1;
          margin: 0;
          color: var(--text-color);
          text-transform: uppercase;
          letter-spacing: 2px;
        }
          
        /* Responsive Headlines */
        @media (max-width: 768px) {
          .main-headline { font-size: 2.5rem; letter-spacing: 1px; }
          .sub-headline { font-size: 1rem !important; margin-top: 0.5rem !important; }
        }

        .highlight-text {
            color: var(--accent-color);
        }

        .sub-headline {
            font-size: 1.5rem;
            font-weight: 300;
            margin-top: 1rem;
            opacity: 0.8;
        }

        .wheel-container {
          position: relative;
          width: 0;
          height: 0;
          z-index: 10;
          transform-style: preserve-3d;
          pointer-events: none;
        }

        /* --- CARD & HOVER STYLES --- */

        .wheel-card {
          position: absolute;
          top: 50%;
          left: 50%;
          /* Desktop Defaults */
          width: 140px;
          height: 200px;
          margin-left: -70px; /* Half of width */
          margin-top: -100px; /* Half of height */
          
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          will-change: transform;
          background: var(--secondary-color);
          border: 1px solid rgba(208, 188, 252, 0.1);
          pointer-events: auto;
          cursor: pointer;
          user-select: none;
          -webkit-user-drag: none;
        }

        /* Mobile Card Sizes */
        @media (max-width: 768px) {
          .wheel-card {
            width: 90px;
            height: 130px;
            margin-left: -45px;
            margin-top: -65px;
            border-radius: 8px;
          }
        }

        .wheel-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
          filter: brightness(0.9) contrast(1.1);
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .card-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(26, 18, 48, 0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            padding: 0.5rem;
            box-sizing: border-box;
            pointer-events: none;
        }
        
        .overlay-text {
            color: var(--accent-color);
            font-weight: 700;
            text-align: center;
            font-size: 1.1rem;
            line-height: 1.2;
            transform: translateY(15px);
            transition: transform 0.3s ease;
        }

        /* Mobile Overlay Text Size */
        @media (max-width: 768px) {
          .overlay-text { font-size: 0.8rem; }
        }

        /* --- HOVER STATES --- */
        .wheel-card:hover .card-overlay { opacity: 1; }
        .wheel-card:hover .overlay-text { transform: translateY(0); }
        .wheel-card:hover .wheel-img { transform: scale(1.1); filter: brightness(0.6) blur(2px); }


        /* --- OTHER --- */

        .hint-text {
            position: absolute;
            bottom: 2rem;
            opacity: 0.5;
            font-family: monospace;
            font-size: 0.8rem;
            width: 100%;
            text-align: center;
            padding: 0 20px;
        }
        
        /* CSS to toggle text based on screen size */
        .desktop-msg { display: block; }
        .mobile-msg { display: none; }

        @media (max-width: 768px) {
          .hint-text { font-size: 0.7rem; bottom: 5rem; }
          .desktop-msg { display: none; }
          .mobile-msg { display: block; }
        }

      `}</style>

      {/* --- PINNED ANIMATION SECTION --- */}
      <div ref={containerRef} className="wheel-section">
        <div className="bg-blob blob-1"></div>

        <div ref={textRef} className="center-content">
          <h1 className="main-headline">
            ES<span className="highlight-text">V</span>
          </h1>
          <div className="sub-headline">The Multi-Service Digital Foundry</div>
        </div>

        <div ref={wheelRef} className="wheel-container">
          {SERVICES_DATA.map((item, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="wheel-card"
            >
              <img src={item.src} alt={item.label} className="wheel-img" />
              <div className="card-overlay">
                <span className="overlay-text">{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="hint-text">
          {/* Responsive text switching */}
          <span className="desktop-msg">Scroll to Explore • Right Click & Drag to Spin</span>
          <span className="mobile-msg">Scroll to Explore</span>
        </div>
      </div>
    </div>
  );
}