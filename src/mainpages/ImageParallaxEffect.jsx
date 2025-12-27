import React, {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from "react";

// --- AGENCY DATA CONFIGURATION ---
const AGENCY_DATA = [
  // COLUMN 1 (Left)
  {
    id: 1,
    title: "Web & WordPress",
    category: "Development & CMS",
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Graphic & Photo",
    category: "Design & Editing",
    src: "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },

  // COLUMN 2 (Center - Featured)
  {
    id: 3,
    title: "Video Production",
    category: "Editing & Motion Graphics",
    src: "https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },

  // COLUMN 3 (Right)
  {
    id: 4,
    title: "AI & Bot Dev",
    category: "Automation & Database",
    src: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Trading Hub",
    category: "Education & Analysis",
    src: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "Digital Growth",
    category: "Marketing & Strategy",
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

export default function ImageParallaxEffect() {
  const containerRef = useRef(null);
  const col1Ref = useRef(null);
  const col2Ref = useRef(null);
  const col3Ref = useRef(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  const col1Data = AGENCY_DATA.slice(0, 2);
  const col2Data = AGENCY_DATA.slice(2, 3);
  const col3Data = AGENCY_DATA.slice(3, 6);

  // 1. Script Loading
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

  // 2. Animation Logic
  useLayoutEffect(() => {
    if (!scriptsLoaded) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    let mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      
      // --- DESKTOP ANIMATIONS (> 1024px) ---
      mm.add("(min-width: 1025px)", () => {
        
        // Initial Reveal
        gsap.from([col1Ref.current, col2Ref.current, col3Ref.current], {
          y: 150,
          opacity: 0,
          duration: 1.5,
          stagger: 0.15,
          ease: "power3.out",
        });

        // Parallax Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });

        tl.to(col1Ref.current, { y: -300, ease: "none" }, 0); 
        tl.to(col2Ref.current, { y: -100, ease: "none" }, 0); 
        tl.to(col3Ref.current, { y: -650, ease: "none" }, 0); 

        // Physics / Velocity Skew (Desktop Only)
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            gsap.to([col1Ref.current, col2Ref.current, col3Ref.current], {
              skewY: velocity / -1500, 
              overwrite: "auto",
              duration: 0.5,
              ease: "power3.out",
            });
          },
        });
      });

      // --- TABLET & MOBILE ANIMATIONS (<= 1024px) ---
      mm.add("(max-width: 1024px)", () => {
        // Simple elegant stagger fade-in
        gsap.from(".img-card", {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%", // Triggers slightly earlier on mobile
          }
        });
      });

    }, containerRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [scriptsLoaded]);

  if (!scriptsLoaded) return null;

  return (
    <div ref={containerRef} className="gallery-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap');

        :root {
          --bg-color: #D0BCFC;
          --text-color: #491AB1;
          --secondary-bg: #491AB1;
          --font-main: 'Nunito', sans-serif;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --bg-color: #24204A;
            --text-color: #D0BCFC; 
            --secondary-bg: #1A1230;
          }
        }

        .gallery-root {
          width: 100%;
          /* Min-height adjusts per device to avoid empty space */
          min-height: 100vh; 
          padding: 8vh 0;
          overflow: hidden;
          background-color: var(--bg-color);
          color: var(--text-color);
          font-family: var(--font-main);
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: background-color 0.3s ease;
        }

        .grid-container {
          width: 90vw;
          max-width: 1400px;
          display: flex;
          gap: 3vw;
          will-change: transform;
          margin-top: 5vh;
        }

        .col-base {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          position: relative;
        }

        /* --- DESKTOP STYLES (> 1024px) --- */
        @media (min-width: 1025px) {
          .col-1 { flex: 1; margin-top: 5vh; }
          .col-1 .img-card { aspect-ratio: 3/4; }

          .col-2 { flex: 1.4; margin-top: 0; justify-content: center; }
          .col-2 .img-card { aspect-ratio: 4/5; width: 100%; z-index: 10; }

          .col-3 { flex: 1; margin-top: 15vh; }
          .col-3 .img-card { aspect-ratio: 1; }
          .col-3 .img-card:nth-child(even) { aspect-ratio: 3/4; }
          
          /* Only use hover effects on devices with a mouse */
          .img-card:hover img { transform: scale(1.05); }
          .img-card:hover .info-overlay { opacity: 1; transform: translateY(0); }
        }

        /* Card Styles */
        .img-card {
          width: 100%;
          background-color: var(--secondary-bg);
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);
        }

        .img-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        /* Overlays */
        .info-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 2rem 1.5rem 1.5rem;
          background: linear-gradient(to top, var(--bg-color) 0%, rgba(0,0,0,0) 100%);
          /* Default state for Desktop (hidden) */
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.4s ease;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .info-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-color);
          margin: 0;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }

        .info-placeholder {
          font-size: 0.9rem;
          font-weight: 400;
          color: var(--text-color);
          opacity: 0.85;
          margin: 0;
        }

        /* --- TABLET STYLES (768px - 1024px) --- */
        @media (min-width: 769px) and (max-width: 1024px) {
          .gallery-root { padding: 5vh 0; min-height: auto; }
          .grid-container { gap: 2vw; width: 94vw; }
          
          /* Reduce staggered margins so it fits tablet screens better */
          .col-1 { flex: 1; margin-top: 2vh; }
          .col-2 { flex: 1.2; margin-top: 0; }
          .col-3 { flex: 1; margin-top: 5vh; }
          
          .col-base { gap: 2rem; }
          
          /* Make cards slightly more uniform on tablet */
          .col-1 .img-card, .col-3 .img-card { aspect-ratio: 4/5; }
          .col-2 .img-card { aspect-ratio: 3/4; }

          /* Force Overlay Visible */
          .info-overlay { opacity: 1; transform: translateY(0); padding: 3rem 1rem 1rem; }
          .info-title { font-size: 1.1rem; }
        }

        /* --- MOBILE STYLES (< 768px) --- */
        @media (max-width: 768px) {
          .gallery-root {
             min-height: auto;
             padding: 2rem 0;
          }

          .grid-container { 
            flex-direction: column; 
            gap: 2.5rem; 
            width: 90vw; 
            margin-top: 2vh;
          }
          
          /* Reset desktop column margins */
          .col-1, .col-2, .col-3 { 
            margin-top: 0 !important; 
            gap: 2.5rem;
          }

          /* Uniform generous cards for touch targets */
          .col-base .img-card { 
            aspect-ratio: 4/5; /* Taller look for mobile apps */
            width: 100%;
          }

          /* Always show overlay on mobile */
          .info-overlay { 
            opacity: 1; 
            transform: translateY(0); 
            padding: 4rem 1.5rem 1.5rem; 
            background: linear-gradient(to top, var(--bg-color) 20%, transparent 100%);
          }
          
          .info-title { font-size: 1.5rem; }
          .info-placeholder { font-size: 1rem; }
        }
      `}</style>

      <div className="grid-container">
        {/* COLUMN 1 */}
        <div ref={col1Ref} className="col-base col-1">
          {col1Data.map((item) => (
            <div key={item.id} className="img-card">
              <img src={item.src} alt={item.title} loading="lazy" />
              <div className="info-overlay">
                <h3 className="info-title">{item.title}</h3>
                <p className="info-placeholder">{item.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* COLUMN 2 */}
        <div ref={col2Ref} className="col-base col-2">
          {col2Data.map((item) => (
            <div key={item.id} className="img-card">
              <img src={item.src} alt={item.title} loading="lazy" />
              <div className="info-overlay">
                <h3 className="info-title">{item.title}</h3>
                <p className="info-placeholder">{item.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* COLUMN 3 */}
        <div ref={col3Ref} className="col-base col-3">
          {col3Data.map((item) => (
            <div key={item.id} className="img-card">
              <img src={item.src} alt={item.title} loading="lazy" />
              <div className="info-overlay">
                <h3 className="info-title">{item.title}</h3>
                <p className="info-placeholder">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}