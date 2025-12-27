import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// --- 1. CONFIGURATION & STYLES ---

const PALETTE = {
  lightBg: '#D0BCFC',
  lightText: '#491AB1',
  darkPrimary: '#24204A',
  darkSecondary: '#1A1230',
  darkText: '#D0BCFC'
};

const services = {
  design: { label: 'DESIGN', bg: PALETTE.lightBg, text: PALETTE.lightText },
  video: { label: 'VIDEO', bg: PALETTE.darkPrimary, text: PALETTE.darkText },
  web: { label: 'WEB DEV', bg: PALETTE.lightText, text: PALETTE.lightBg }
};

const defaultTheme = { bg: PALETTE.darkSecondary, text: PALETTE.darkText };
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?";

const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Manrope:wght@300;500;700&display=swap');
    
    .font-display { font-family: 'Syne', sans-serif; }
    .font-body { font-family: 'Manrope', sans-serif; }
    
    .stroke-text { 
      -webkit-text-stroke: 1px currentColor; 
      color: transparent; 
      opacity: 0.8;
    }
    
    .no-select { user-select: none; -webkit-user-select: none; }

    /* Hide scrollbar for cleaner reveal */
    ::-webkit-scrollbar { width: 0px; background: transparent; }

    /* Keyhole Layout Styles */
    .rcw-container {
      position: relative;
      width: 100%;
      height: 100vh;
      background-color: #000; /* Outer background before expansion */
      overflow: hidden;
    }
    
    .pin-wrapper {
      position: relative;
      width: 100%;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    /* The Mask (Expanding Circle) */
    .center-mask {
      position: absolute;
      width: 300px;  /* Initial Size */
      height: 300px; /* Initial Size */
      border-radius: 50%;
      overflow: hidden;
      z-index: 20;
      /* Center the mask */
      top: 50%; 
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 50px rgba(0,0,0,0.5);
    }

    /* The Inner Content (Moving Text) - Stays fixed relative to viewport */
    .inner-content-fixed {
      position: absolute;
      width: 100vw;
      height: 100vh;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%); /* Keeps content centered as mask grows */
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .rotating-rings-container {
      position: absolute;
      z-index: 10;
      pointer-events: none; /* Let clicks pass through to scroll */
    }

    .ring-text {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 2px;
      fill: #fff;
      text-transform: uppercase;
    }
    
    .scroll-indicator {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      font-family: 'Manrope', sans-serif;
      font-size: 0.9rem;
      opacity: 0.7;
      z-index: 5;
      letter-spacing: 1px;
    }
  `}</style>
);

// --- 2. SUB-COMPONENTS (Moving Text Logic) ---

const TriggerWord = ({ id, text, activeId, onEnter, onLeave }) => {
    const textRef = useRef(null);
    const animationRef = useRef(null);
  
    const scrambleText = () => {
      if (!window.gsap || !textRef.current) return;
      if (animationRef.current) animationRef.current.kill();
  
      const duration = 0.6;
      animationRef.current = window.gsap.to({ p: 0 }, {
        p: 1,
        duration: duration,
        ease: "power4.out",
        onUpdate: function() {
          const progress = this.targets()[0].p;
          const len = text.length;
          const resolvedCount = Math.floor(len * progress);
          let result = "";
          for (let i = 0; i < len; i++) {
            if (i < resolvedCount) result += text[i];
            else result += Math.random() > 0.9 ? " " : CHARS[Math.floor(Math.random() * CHARS.length)];
          }
          if (textRef.current) textRef.current.innerText = result;
        },
        onComplete: () => {
          if (textRef.current) textRef.current.innerText = text;
        }
      });
    };
  
    const resetText = () => {
       if (animationRef.current) animationRef.current.kill();
       if (textRef.current) textRef.current.innerText = text;
    };
  
    return (
      <span 
        className="relative inline-block cursor-pointer px-2 z-30 transition-transform duration-300 ease-out hover:scale-105 pointer-events-auto"
        onMouseEnter={() => { onEnter(id); scrambleText(); }}
        onMouseLeave={() => { onLeave(); resetText(); }}
      >
        <span className={`relative z-10 transition-all duration-300 ${activeId === id ? 'opacity-100 font-extrabold' : 'opacity-100 font-bold'}`}>
          <span ref={textRef}>{text}</span>
          <span className={`absolute left-0 bottom-0 h-[3px] w-full bg-current transform origin-left transition-transform duration-300 ${activeId === id ? 'scale-x-100' : 'scale-x-0'}`} />
        </span>
      </span>
    );
};

const TextRow = ({ children, move = false, addRowRef, className = "" }) => (
    <div className="w-full flex justify-center py-1 md:py-2">
       <div 
         ref={addRowRef} 
         data-move={move}
         className={`text-row flex items-center justify-center gap-3 md:gap-6 whitespace-nowrap 
                    text-[clamp(2.5rem,6vw,6rem)] leading-none font-display font-bold uppercase tracking-tight 
                    will-change-transform ${className}`}
       >
         {children}
       </div>
    </div>
);

// --- 3. MAIN COMPONENT ---

const UnifiedHero = () => {
  // Refs for Scroll Interaction (Circle Expansion)
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const maskRef = useRef(null); // The expanding circle
  const ringsRef = useRef(null);
  const indicatorRef = useRef(null);

  // Refs for Moving Text Interaction
  const innerContentRef = useRef(null); // The background color changer
  const rowsRef = useRef([]);
  const [activeId, setActiveId] = useState(null);

  const ringText = "ESPECIALLY ENJOYING DESIGN & ILLUSTRATION • ".repeat(4); 

  // --- A. ScrollTrigger Logic (Expansion) ---
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",      
          end: "+=200%",        // Scroll distance
          pin: wrapperRef.current,
          scrub: 1,  
        }
      });

      // 1. Expand Mask (Circle -> Full Screen)
      tl.to(maskRef.current, {
        width: "100vw",
        height: "100vh",
        borderRadius: "0%",
        ease: "power2.inOut"
      }, 0);

      // 2. Zoom out rings & fade
      tl.to(ringsRef.current, {
        scale: 5,           
        opacity: 0,
        filter: "blur(15px)",
        rotate: 90,         
        ease: "power2.in"
      }, 0);

      // 3. Fade out scroll indicator
      tl.to(indicatorRef.current, { opacity: 0, duration: 0.1 }, 0);

    }, containerRef);

    return () => ctx.revert(); 
  }, []);

  // --- B. Moving Text Logic (Marquee) ---
  useEffect(() => {
    let ctx = gsap.context(() => {
      rowsRef.current.forEach((row, i) => {
        if (!row || row.dataset.move !== "true") return;
        
        const distance = 5; 
        const duration = 20 + Math.random() * 5; 
        const dir = i % 2 === 0 ? 1 : -1;

        gsap.fromTo(row, 
          { xPercent: -distance * dir },
          { xPercent: distance * dir, duration: duration, ease: "sine.inOut", repeat: -1, yoyo: true }
        );
      });
    }, innerContentRef); // Scope to inner content

    return () => ctx.revert();
  }, []);

  // --- C. Hover Interactions ---
  const handleEnter = (id) => {
    setActiveId(id);
    const theme = services[id];
    gsap.to(innerContentRef.current, { 
      backgroundColor: theme.bg, 
      color: theme.text, 
      duration: 0.5, 
      ease: "power2.out"
    });
  };

  const handleLeave = () => {
    setActiveId(null);
    gsap.to(innerContentRef.current, { 
      backgroundColor: defaultTheme.bg, 
      color: defaultTheme.text, 
      duration: 0.5, 
      ease: "power2.out"
    });
  };

  // Helper to collect refs
  const addRowRef = (el) => {
    if (el && !rowsRef.current.includes(el)) {
        rowsRef.current.push(el);
    }
  };

  return (
    <div className="rcw-container" ref={containerRef}>
      <FontLoader />
      
      <div className="pin-wrapper" ref={wrapperRef}>
        
        {/* 1. Background Rings (Visible initially) */}
        <div className="rotating-rings-container" ref={ringsRef}>
          <svg viewBox="0 0 800 800" width="800" height="800">
             <defs>
                <path id="innerCirclePath" d="M 400, 400 m -230, 0 a 230,230 0 1,1 460,0 a 230,230 0 1,1 -460,0" fill="none"/>
                <path id="outerCirclePath" d="M 400, 400 m -310, 0 a 310,310 0 1,1 620,0 a 310,310 0 1,1 -620,0" fill="none"/>
             </defs>
             <g className="inner-ring-group">
                 <text className="ring-text inner-ring-text">
                    <textPath xlinkHref="#innerCirclePath" startOffset="50%" textAnchor="middle">{ringText}</textPath>
                 </text>
             </g>
             <g className="outer-ring-group">
                <text className="ring-text outer-ring-text">
                   <textPath xlinkHref="#outerCirclePath" startOffset="0%" textAnchor="middle">{ringText}</textPath>
                </text>
             </g>
          </svg>
        </div>

        {/* 2. Scroll Hint */}
        <div className="scroll-indicator" ref={indicatorRef}>Scroll to Expand</div>

        {/* 3. The Expandable Mask (Center Circle) */}
        <div className="center-mask" ref={maskRef}>
            
            {/* 4. The "Moving Text" Content (Clipped inside mask) */}
            <div 
                ref={innerContentRef}
                className="inner-content-fixed transition-colors no-select"
                style={{ backgroundColor: defaultTheme.bg, color: defaultTheme.text }}
            >
                {/* Background Decoration */}
                <div className="absolute top-10 left-10 opacity-20 w-16 h-16 pointer-events-none">
                    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
                        <circle cx="50" cy="50" r="40" />
                        <path d="M50 10V90 M10 50H90" />
                    </svg>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-[1400px] mx-auto px-4">
                    {/* Row 1 */}
                    <TextRow move={true} className="opacity-90" addRowRef={addRowRef}>
                        <span>WE CREATE</span>
                        <span className="stroke-text">DIGITAL</span>
                        <span>FUTURE</span>
                    </TextRow>

                    {/* Row 2: Interaction - Design */}
                    <TextRow move={false} addRowRef={addRowRef}>
                        <span className="opacity-50 text-[clamp(1rem,2vw,1.5rem)] font-body font-normal lowercase italic tracking-normal transform translate-y-1">experts in</span>
                        <TriggerWord id="design" text="DESIGN" activeId={activeId} onEnter={handleEnter} onLeave={handleLeave} />
                        <span className="opacity-50 font-body font-light">&</span>
                    </TextRow>

                    {/* Row 3 */}
                    <TextRow move={true} className="opacity-90" addRowRef={addRowRef}>
                        <span className="stroke-text">VISUAL</span>
                        <span>STRATEGY</span>
                        <span className="stroke-text">SYSTEMS</span>
                    </TextRow>

                    {/* Row 4: Interaction - Video */}
                    <TextRow move={false} addRowRef={addRowRef}>
                        <span className="opacity-50 text-[clamp(1rem,2vw,1.5rem)] font-body font-normal lowercase italic tracking-normal transform translate-y-1">crafting</span>
                        <TriggerWord id="video" text="VIDEO" activeId={activeId} onEnter={handleEnter} onLeave={handleLeave} />
                        <span className="opacity-50 text-[clamp(1rem,2vw,1.5rem)] font-body font-normal lowercase italic tracking-normal transform translate-y-1">content</span>
                    </TextRow>

                    {/* Row 5 */}
                    <TextRow move={true} className="opacity-90" addRowRef={addRowRef}>
                        <span>GLOBAL</span>
                        <span className="stroke-text">BRANDS</span>
                        <span>RISE</span>
                    </TextRow>

                    {/* Row 6: Interaction - Web */}
                    <TextRow move={false} addRowRef={addRowRef}>
                        <span className="opacity-50 text-[clamp(1rem,2vw,1.5rem)] font-body font-normal lowercase italic tracking-normal transform translate-y-1">modern</span>
                        <TriggerWord id="web" text="WEB DEV" activeId={activeId} onEnter={handleEnter} onLeave={handleLeave} />
                        <span className="opacity-50 text-[clamp(1rem,2vw,1.5rem)] font-body font-normal lowercase italic tracking-normal transform translate-y-1">solutions</span>
                    </TextRow>
                </div>
            </div>
        </div>
        
      </div>
      
      {/* Spacer for scrolling - allows scrolltrigger to scrub for 200vh */}
      <div style={{ height: "200vh" }}></div> 
    </div>
  );
};

export default UnifiedHero;