import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';

// --- DATA ---
const SERVICES = [
  { id: 1, text: ["DIGITAL", "INTERFACE"], sub: "UI/UX Design" },
  { id: 2, text: ["VISUAL", "NARRATIVE"], sub: "Video Editing" },
  { id: 3, text: ["SYSTEM", "ARCHITECTURE"], sub: "Web Development" },
  { id: 4, text: ["KINETIC", "IDENTITY"], sub: "Motion Graphics" },
  { id: 5, text: ["BRAND", "ECOSYSTEM"], sub: "Strategy" }
];

export default function ServicesTextShowcase() {
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const itemsRef = useRef([]);
  
  const [isDarkMode] = useState(true); 
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  // --- Script Loading ---
  useEffect(() => {
    if (window.gsap && window.ScrollTrigger) {
      setScriptsLoaded(true);
      return;
    }
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const script = document.createElement('script');
        script.src = src; script.async = true;
        script.onload = resolve; script.onerror = reject;
        document.body.appendChild(script);
      });
    };
    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js')
    ]).then(() => {
      setTimeout(() => {
        if (window.gsap && window.ScrollTrigger) {
          window.gsap.registerPlugin(window.ScrollTrigger);
          setScriptsLoaded(true);
        }
      }, 100);
    });
  }, []);

  // --- Animation Logic (Responsive with matchMedia) ---
  useLayoutEffect(() => {
    if (!scriptsLoaded) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    // We use matchMedia to define different behaviors for Desktop vs Mobile
    let mm = gsap.matchMedia();

    const list = listRef.current;
    const items = itemsRef.current;

    // Helper: Calculate total scroll width
    function getScrollAmount() {
      let listWidth = list.scrollWidth;
      return -(listWidth - window.innerWidth);
    }

    mm.add("(min-width: 1px)", (context) => {
      // Setup is common, but variables change based on screen size
      let isMobile = window.innerWidth < 768;
      
      // On mobile, we reduce the scroll distance so it feels snappier
      let scrollDuration = isMobile ? "+=2000" : "+=4000"; 

      const tween = gsap.to(list, {
        x: getScrollAmount,
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: scrollDuration, 
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true, // Recalculate on resize
      });

      items.forEach((item) => {
        const content = item.querySelector('.content-block');
        
        // Adjust trigger points for mobile vs desktop
        // On mobile, we want the animation to happen a bit faster/center focused
        const startTrigger = isMobile ? "left 110%" : "left 100%";
        const endTrigger = isMobile ? "right -10%" : "right 0%";

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            containerAnimation: tween,
            start: startTrigger,
            end: endTrigger,
            scrub: true,
          }
        });

        tl.fromTo(content, 
          { opacity: 0.2, scale: 0.8, filter: "blur(10px)" }, 
          { opacity: 1, scale: 1, filter: "blur(0px)", ease: "power2.out", duration: 1 }
        )
        .to(content, { 
          opacity: 0.2, scale: 0.8, filter: "blur(10px)", ease: "power2.in", duration: 1 
        });
      });
    }, containerRef);

    return () => mm.revert(); // Cleans up all media queries
  }, [scriptsLoaded]);

  // --- Hover Effects (Disabled on touch devices usually, but kept for hybrid) ---
  const onEnter = (e) => {
    if (!window.gsap) return;
    // Optional: Check if device is touch, maybe skip this
    const text = e.currentTarget.querySelector('.main-text');
    const line = e.currentTarget.querySelector('.separator');

    window.gsap.to(text, { 
      color: "var(--text-active)", 
      textShadow: "0 0 40px var(--glow-color)", 
      duration: 0.3 
    });
    window.gsap.to(line, { width: '100%', opacity: 1, duration: 0.4 });
  };

  const onLeave = (e) => {
    if (!window.gsap) return;
    const text = e.currentTarget.querySelector('.main-text');
    const line = e.currentTarget.querySelector('.separator');

    window.gsap.to(text, { 
      color: "var(--text-inactive)", 
      textShadow: "none", 
      duration: 0.3 
    });
    window.gsap.to(line, { width: '0%', opacity: 0, duration: 0.4 });
  };

  if (!scriptsLoaded) return <div style={{height:'100vh', background: isDarkMode ? '#24204A' : '#D0BCFC', color: isDarkMode ? '#D0BCFC' : '#491AB1', display:'flex', justifyContent:'center', alignItems:'center', fontFamily:'Nunito, sans-serif'}}>Loading...</div>;

  return (
    <div ref={containerRef} className={`showcase-wrapper ${isDarkMode ? 'theme-dark' : 'theme-light'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');

        /* --- STYLES & VARIABLES --- */
        .theme-light {
          --bg-color: #D0BCFC;
          --bg-gradient: #D0BCFC; 
          --text-active: #491AB1;
          --text-inactive: rgba(73, 26, 177, 0.4);
          --glow-color: rgba(73, 26, 177, 0.4);
          --separator-color: #491AB1;
          --noise-opacity: 0.08;
        }

        .theme-dark {
          --bg-color: #24204A;
          --bg-gradient: radial-gradient(circle at center, #24204A 0%, #1A1230 100%);
          --text-active: #D0BCFC;
          --text-inactive: rgba(208, 188, 252, 0.3);
          --glow-color: rgba(208, 188, 252, 0.5);
          --separator-color: #D0BCFC;
          --noise-opacity: 0.05;
        }

        .showcase-wrapper {
          width: 100%;
          /* Use dvh for mobile address bar compatibility */
          height: 100vh; 
          height: 100dvh; 
          background: var(--bg-gradient);
          overflow: hidden; 
          position: relative;
          display: flex;
          align-items: center;
          font-family: 'Nunito', sans-serif;
          transition: background 0.5s ease;
        }

        .bg-noise {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          opacity: var(--noise-opacity); pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E");
        }

        .services-list {
          display: flex;
          flex-direction: row;
          height: 100%;
          width: max-content; 
          align-items: center;
          /* Padding creates the empty space before/after list */
          padding: 0 50vw; 
          will-change: transform;
        }

        .service-item {
          /* Default Desktop Width */
          width: 70vw; 
          height: 100%;
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          cursor: pointer;
          z-index: 10;
        }

        .content-block {
          text-align: center;
          position: relative;
          padding: 3rem;
          opacity: 0.2;
          transform: scale(0.8);
          filter: blur(10px);
          /* Ensure text doesn't overflow container */
          width: 100%;
          max-width: 90%;
        }

        .main-text {
          /* Fluid typography: Minimum 32px, preferred 8vw, max 150px */
          font-size: clamp(32px, 8vw, 150px);
          font-weight: 900;
          line-height: 0.9;
          text-transform: uppercase;
          white-space: normal; /* Allow wrapping on very small screens if needed */
          color: var(--text-inactive);
          transition: color 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .word-line { display: block; }

        .sub-text {
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          /* Fluid typography for subtext */
          font-size: clamp(14px, 1.5vw, 24px);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-top: 2rem;
          display: block;
          color: var(--text-active);
          opacity: 0.7;
        }

        .separator {
          position: absolute;
          bottom: 0; left: 50%;
          transform: translateX(-50%);
          height: 4px;
          border-radius: 4px;
          width: 0%;
          background: var(--separator-color);
          box-shadow: 0 0 15px var(--glow-color);
        }

        /* --- RESPONSIVE MEDIA QUERIES --- */
        
        /* Tablet & Mobile */
        @media (max-width: 1024px) {
           .service-item {
             width: 80vw;
           }
        }

        /* Mobile Phones */
        @media (max-width: 768px) {
          .services-list {
             /* Reduce side padding so first item appears sooner */
             padding: 0 25vw;
          }
          
          .service-item { 
            width: 100vw; 
          }
          
          .main-text { 
            /* Larger relative font for phone impact */
            font-size: clamp(40px, 15vw, 80px); 
          }
          
          .sub-text { 
            font-size: 14px; 
            margin-top: 1rem;
          }

          .content-block {
             padding: 1rem;
          }
        }
      `}</style>

      <div className="bg-noise"></div>

      <div ref={listRef} className="services-list">
        {SERVICES.map((service, i) => (
          <div 
            key={service.id}
            ref={el => itemsRef.current[i] = el}
            className="service-item"
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          >
            <div className="content-block">
              <div className="main-text">
                {service.text.map((word, idx) => (
                  <span key={idx} className="word-line">{word}</span>
                ))}
              </div>
              <span className="sub-text">{service.sub}</span>
              <div className="separator"></div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}