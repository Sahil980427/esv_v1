import React, { useState, useEffect, useRef } from 'react';

// --- Styles & Fonts ---
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&family=Inter:wght@300;400;600&display=swap');
    .font-display { font-family: 'Oswald', sans-serif; }
    .font-body { font-family: 'Inter', sans-serif; }
    .stroke-text { -webkit-text-stroke: 1px currentColor; color: transparent; }
  `}</style>
);

const services = {
  design: { label: 'DESIGN', color: '#8B5CF6', textColor: '#FFFFFF' },
  video: { label: 'VIDEO', color: '#38BDF8', textColor: '#000000' },
  web: { label: 'WEB DEV', color: '#111111', textColor: '#FFFFFF' }
};

const defaultTheme = { bg: '#FFFFFF', text: '#000000' };

const MovingText = () => {
  const containerRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    if (!window.gsap) return;
    const gsap = window.gsap;

    const ctx = gsap.context(() => {
      rowsRef.current.forEach((row, i) => {
        if (!row || row.dataset.move !== "true") return;
        const distance = 8 + Math.random() * 5;
        const duration = 12 + Math.random() * 6;
        const dir = i % 2 === 0 ? 1 : -1;

        gsap.fromTo(row, 
          { xPercent: -distance * dir },
          { xPercent: distance * dir, duration: duration, ease: "sine.inOut", repeat: -1, yoyo: true }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleEnter = (id) => {
    if (!window.gsap) return;
    setActiveId(id);
    const theme = services[id];
    window.gsap.to(containerRef.current, { 
      backgroundColor: theme.color, color: theme.textColor, duration: 0.8, ease: "power3.out"
    });
  };

  const handleLeave = () => {
    if (!window.gsap) return;
    setActiveId(null);
    window.gsap.to(containerRef.current, { 
      backgroundColor: defaultTheme.bg, color: defaultTheme.text, duration: 0.8, ease: "power3.out"
    });
  };

  const TriggerWord = ({ id, text }) => (
    <span 
      className="relative inline-block cursor-pointer px-4 z-30 transition-transform duration-500 ease-out hover:scale-105"
      onMouseEnter={() => handleEnter(id)}
      onMouseLeave={handleLeave}
    >
      <span className={`relative z-10 transition-opacity duration-300 ${activeId === id ? 'font-black' : 'font-bold'}`}>
        {text}
      </span>
    </span>
  );

  const TextRow = ({ children, move = false, className = "" }) => (
    <div className="w-full overflow-hidden py-1 md:py-2 flex justify-center">
       <div 
         ref={el => rowsRef.current.push(el)} 
         data-move={move}
         className={`text-row whitespace-nowrap text-[10vw] md:text-[8.5vw] font-display font-bold leading-[0.85] uppercase tracking-tight flex items-center gap-6 transition-all duration-700 ${className}`}
       >
         {children}
       </div>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ backgroundColor: defaultTheme.bg, color: defaultTheme.text }}
    >
      <FontLoader />
      <div className="relative z-10 flex flex-col justify-center h-full py-20 select-none">
        <TextRow move={true} className="opacity-90">
          <span>WE CREATE</span><span className="stroke-text">DIGITAL</span><span>FUTURE</span>
        </TextRow>

        <TextRow move={false}>
           <span className="opacity-40 text-[6vw]">EXPERTS IN</span>
           <TriggerWord id="design" text="DESIGN" />
           <span className="opacity-40">&</span>
        </TextRow>

        <TextRow move={true} className="opacity-90">
           <span className="stroke-text">VISUAL</span><span>STRATEGY</span><span className="stroke-text">SYSTEMS</span>
        </TextRow>

        <TextRow move={false}>
           <span className="opacity-40 text-[6vw]">CRAFTING</span>
           <TriggerWord id="video" text="VIDEO" />
           <span className="opacity-40 text-[6vw]">CONTENT</span>
        </TextRow>

        <TextRow move={true} className="opacity-90">
           <span>GLOBAL</span><span className="stroke-text">BRANDS</span><span>RISE</span>
        </TextRow>

        <TextRow move={false}>
           <span className="opacity-40 text-[6vw]">MODERN</span>
           <TriggerWord id="web" text="WEB DEV" />
           <span className="opacity-40 text-[6vw]">SOLUTIONS</span>
        </TextRow>
      </div>
    </div>
  );
};

export default MovingText;