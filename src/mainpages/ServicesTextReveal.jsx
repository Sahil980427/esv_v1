import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';

const SERVICES = [
  { id: 1, title: "Web Design & Dev", subtitle: "Full Stack & Experience", color: "#3b82f6" },
  { id: 2, title: "Graphic Design", subtitle: "Visual Identity & Branding", color: "#f43f5e" },
  { id: 3, title: "Video Editing", subtitle: "Motion & Post-Production", color: "#f59e0b" },
  { id: 4, title: "WordPress Design", subtitle: "CMS & Custom Themes", color: "#0ea5e9" },
  { id: 5, title: "Trading Expertise", subtitle: "Education & Strategy", color: "#10b981" },
  { id: 6, title: "Digital Marketing", subtitle: "SEO & Growth", color: "#8b5cf6" },
  { id: 7, title: "Database Handling", subtitle: "Architecture & Data", color: "#6366f1" },
  { id: 8, title: "AI & Bot Dev", subtitle: "Automation & LLMs", color: "#d946ef" },
  { id: 9, title: "Course Platform", subtitle: "LMS & Teaching Systems", color: "#14b8a6" }
];

export default function ServicesTextReveal() {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const scrambleTweens = useRef(new Map());

  // --- Load GSAP ---
  useEffect(() => {
    if (window.gsap && window.ScrollTrigger) { setScriptsLoaded(true); return; }
    const loadScript = (src) => new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src; script.onload = resolve; document.body.appendChild(script);
    });
    Promise.all([loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'), loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js')])
    .then(() => { 
      if(window.gsap) { window.gsap.registerPlugin(window.ScrollTrigger); setScriptsLoaded(true); }
    });
  }, []);

  useLayoutEffect(() => {
    if (!scriptsLoaded) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    
    // --- Scramble Function ---
    const doScramble = (element, finalText, duration = 0.5, color = null) => {
      const chars = '!<>-_\\/[]{}—=+*^?#________';
      const origText = element.innerText;
      const quantity = Math.max(origText.length, finalText.length);
      
      if (scrambleTweens.current.has(element)) {
        scrambleTweens.current.get(element).kill();
      }

      const tween = gsap.to({ p: 0 }, {
        p: 1,
        duration: duration,
        ease: "power2.out",
        onUpdate: function() {
          const progress = this.targets()[0].p;
          const revealedLength = Math.floor(progress * quantity);
          let result = '';
          for(let i = 0; i < quantity; i++) {
             if (i < revealedLength && i < finalText.length) {
               result += finalText[i];
             } else if (i < finalText.length && finalText[i] === ' ') {
               result += ' '; 
             } else {
               result += chars[Math.floor(Math.random() * chars.length)];
             }
          }
           element.innerText = result.substring(0, Math.max(origText.length, finalText.length) + 2);
           if(color) element.style.color = color;
        },
        onComplete: () => {
           element.innerText = finalText;
           if(color) element.style.color = color;
           scrambleTweens.current.delete(element);
        }
      });
      scrambleTweens.current.set(element, tween);
    };

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.service-item');
      const cursor = cursorRef.current;
      const cursorText = cursor.querySelector('.cursor-text');
      
      // Use MatchMedia for Responsive Logic
      const mm = gsap.matchMedia();

      // --- DESKTOP LOGIC (Mouse Interaction) ---
      mm.add("(min-width: 769px)", () => {
        // Entrance
        gsap.from(items, {
            y: 100, opacity: 0, duration: 0.8, stagger: 0.05, ease: "power3.out",
            scrollTrigger: { trigger: containerRef.current, start: "top 80%" }
        });

        // Cursor Movement
        const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
        const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });
        window.addEventListener("mousemove", (e) => { xTo(e.clientX); yTo(e.clientY); });

        items.forEach((item) => {
            const title = item.querySelector('.service-title');
            const subtitleCont = item.querySelector('.subtitle-container');
            const originalText = title.innerText;
            const color = item.getAttribute('data-color');

            item.addEventListener('mouseenter', () => {
                gsap.to('.service-item', { opacity: 0.2, duration: 0.3, overwrite: 'auto' });
                gsap.to(item, { opacity: 1, duration: 0.3, overwrite: 'auto' });
                doScramble(title, originalText, 0.6, color);
                gsap.to(subtitleCont, { height: 'auto', opacity: 1, marginTop: '10px', duration: 0.4, ease: "power3.out" });
                gsap.to(cursor, { scale: 1, backgroundColor: color, mixBlendMode: 'normal', duration: 0.3 });
                cursorText.innerText = "EXPLORE"; cursorText.style.color = "white";
            });

            item.addEventListener('mouseleave', () => {
                gsap.to('.service-item', { opacity: 1, duration: 0.3, overwrite: 'auto' });
                if (scrambleTweens.current.has(title)) scrambleTweens.current.get(title).kill();
                title.innerText = originalText;
                gsap.to(title, { color: "var(--text-main)", duration: 0.3 });
                gsap.to(subtitleCont, { height: 0, opacity: 0, marginTop: 0, duration: 0.3, ease: "power3.in" });
                gsap.to(cursor, { scale: 0, duration: 0.3 });
            });
        });
      });

      // --- MOBILE / TABLET LOGIC (Scroll Interaction) ---
      mm.add("(max-width: 768px)", () => {
         // Reset styles that might be stuck from desktop logic
         gsap.set(cursor, { display: 'none' });
         
         items.forEach((item) => {
            const title = item.querySelector('.service-title');
            const subtitleCont = item.querySelector('.subtitle-container');
            const color = item.getAttribute('data-color');
            const originalText = title.innerText;

            // Make subtitles visible immediately
            gsap.set(subtitleCont, { height: 'auto', opacity: 0.7, marginTop: '10px' });

            // Trigger Scramble when item enters viewport
            ScrollTrigger.create({
                trigger: item,
                start: "top 85%",
                onEnter: () => {
                    doScramble(title, originalText, 0.8, color);
                    gsap.fromTo(subtitleCont, {opacity: 0}, {opacity: 0.7, duration: 1});
                }
            });
         });
      });

    }, containerRef);
    return () => ctx.revert();
  }, [scriptsLoaded]);

  if (!scriptsLoaded) return null;

  return (
    <div ref={containerRef} className="services-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;900&display=swap');
        :root {
          --bg-main: #D0BCFC; --text-main: #491AB1;
        }
        @media (prefers-color-scheme: dark) {
          :root { --bg-main: #1A1230; --text-main: #D0BCFC; }
        }

        body { margin: 0; overflow-x: hidden; }
        
        .services-wrapper {
          width: 100%; min-height: 100vh;
          background-color: var(--bg-main); color: var(--text-main);
          padding: 15vh 5vw; box-sizing: border-box;
          font-family: 'Nunito', sans-serif;
          cursor: none; position: relative;
          display: flex; flex-direction: column; justify-content: center;
        }

        .service-list { display: flex; flex-direction: column; align-items: center; width: 100%; }

        .service-item {
          position: relative;
          padding: 1.5rem 0;
          cursor: none;
          text-align: center;
          min-height: 10vw; 
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          width: 100%;
          border-bottom: 1px solid transparent; /* Placeholder */
          transition: border-color 0.3s;
        }

        .service-title {
          font-size: 7vw;
          font-weight: 900;
          line-height: 0.9;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          white-space: nowrap;
          will-change: contents;
        }

        .subtitle-container {
          height: 0; opacity: 0; overflow: hidden;
          font-size: 1.2rem; font-weight: 300;
        }

        /* Cursor */
        .cursor-follower {
          position: fixed; top: 0; left: 0; width: 80px; height: 80px;
          border-radius: 50%; pointer-events: none; z-index: 9999;
          transform: translate(-50%, -50%) scale(0);
          display: flex; align-items: center; justify-content: center;
        }
        .cursor-text { font-weight: 900; font-size: 0.7rem; letter-spacing: 1px; }

        /* --- MOBILE STYLES --- */
        @media (max-width: 768px) {
          .services-wrapper { 
            cursor: default; 
            padding: 10vh 20px;
          }
          
          /* Re-enable default cursor for mobile */
          .services-wrapper, .service-item { cursor: default; }

          .cursor-follower { display: none !important; }
          
          .service-item {
            min-height: auto; 
            padding: 40px 0;
            /* Add subtle separation lines on mobile */
            border-bottom: 1px solid rgba(100, 100, 100, 0.2);
            align-items: flex-start; /* Align text left on mobile */
            text-align: left;
          }

          .service-title {
            font-size: clamp(32px, 11vw, 60px); /* Clamped size for readability */
            white-space: normal; /* Allow wrapping */
            word-break: break-word;
            line-height: 1.1;
          }

          .subtitle-container { 
            font-size: 1rem;
            margin-top: 10px;
          }
        }
      `}</style>

      <div ref={cursorRef} className="cursor-follower">
        <span className="cursor-text">VIEW</span>
      </div>

      <div className="service-list">
        {SERVICES.map((service) => (
          <div key={service.id} className="service-item" data-color={service.color}>
            <h2 className="service-title">{service.title}</h2>
            <div className="subtitle-container">
              <span>{service.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}