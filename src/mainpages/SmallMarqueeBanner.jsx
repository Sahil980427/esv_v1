import React, { useLayoutEffect, useRef, useState, useEffect } from "react";

// --- CONFIGURATION ---
const MARQUEE_TEXT = [
  "DEVELOPMENT",
  "MARKETING",
  "PRODUCTION",
  "STRATEGY",
  "DESIGN"
];

export default function SmallMarqueeBanner() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  // 1. Load GSAP
  useEffect(() => {
    if (window.gsap) {
      setScriptsLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.async = true;
    script.onload = () => setScriptsLoaded(true);
    document.body.appendChild(script);
  }, []);

  // 2. Animation Logic
  useLayoutEffect(() => {
    if (!scriptsLoaded || !textRef.current) return;
    const gsap = window.gsap;

    const ctx = gsap.context(() => {
      gsap.to(textRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1
      });
    }, containerRef);

    return () => ctx.revert();
  }, [scriptsLoaded]);

  // Create enough duplicates
  const REPEATED_CONTENT = [...MARQUEE_TEXT, ...MARQUEE_TEXT, ...MARQUEE_TEXT, ...MARQUEE_TEXT];

  if (!scriptsLoaded) return null;

  return (
    <div className="marquee-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900&display=swap');

        /* --- STRICT COLOR SWAP --- */
        .marquee-wrapper {
          /* LIGHT MODE SWAPPED */
          /* Background takes the 'Strip' color */
          --bg-wrapper: #491AB1;  
          
          /* Strip takes the 'Background' color */
          --bg-strip:   #D0BCFC;  
          
          /* Text needs to be dark to show up on the light strip */
          --text-color: #491AB1;  
          
          position: relative;
          width: 100%;
          padding: 3rem 0; 
          background-color: var(--bg-wrapper); 
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: background-color 0.3s ease;
        }

        /* DARK MODE SWAPPED */
        @media (prefers-color-scheme: dark) {
          .marquee-wrapper {
            /* Wrapper becomes Primary Dark */
            --bg-wrapper: #24204A; 
            
            /* Strip becomes Secondary Dark */
            --bg-strip:   #1A1230; 
            
            /* Text stays soft light */
            --text-color: #D0BCFC; 
          }
        }

        .marquee-strip {
          width: 110%; 
          background: var(--bg-strip);
          padding: 1.5rem 0;
          white-space: nowrap;
          position: relative;
          display: flex;
          align-items: center;
          
          /* THE TILT EFFECT */
          transform: rotate(-2deg);
          box-shadow: 0 5px 20px rgba(0,0,0,0.3);
          transition: background-color 0.3s ease;
        }

        .marquee-content {
          display: flex;
          will-change: transform; 
        }

        .marquee-item {
          color: var(--text-color);
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 2.5rem; 
          text-transform: uppercase;
          /* Increased margin since dot is removed */
          margin-right: 3rem; 
          display: flex;
          align-items: center;
          letter-spacing: 1px;
          transition: color 0.3s ease;
        }
      `}</style>

      {/* The Tilted Strip */}
      <div ref={containerRef} className="marquee-strip">
        <div ref={textRef} className="marquee-content">
          {REPEATED_CONTENT.map((item, index) => (
            <div key={index} className="marquee-item">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}