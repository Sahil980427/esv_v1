import React, { useState, useEffect, useRef } from "react";

// --- Font & Style Loader ---
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Manrope:wght@300;400;500&display=swap');
    
    .font-display { font-family: 'Syne', sans-serif; }
    .font-body { font-family: 'Manrope', sans-serif; }
    
    :root {
      --color-light-bg: #D0BCFC;
      --color-light-text: #491AB1;
      --color-dark-primary: #24204A;
      --color-dark-secondary: #1A1230;
      --color-dark-text: #D0BCFC;
    }

    /* Base Stroke style */
    .stroke-text { 
      color: currentColor;
      -webkit-text-fill-color: transparent; 
      -webkit-text-stroke: 0.5px currentColor; /* Thinner on mobile for elegance */
      paint-order: stroke fill;
    }
    
    /* Thicker stroke on Desktop */
    @media (min-width: 768px) {
      .stroke-text {
        -webkit-text-stroke: 1.5px currentColor;
      }
    }

    .no-select {
      user-select: none;
      -webkit-user-select: none;
    }

    /* Smoother rendering hint */
    .hardware-accel {
      will-change: transform;
      transform: translateZ(0);
    }
  `}</style>
);

const PALETTE = {
  lightBg: "#D0BCFC",
  lightText: "#491AB1",
  darkPrimary: "#24204A",
  darkSecondary: "#1A1230",
  darkText: "#D0BCFC",
};

const services = {
  design: { label: "DESIGN", bg: PALETTE.lightBg, text: PALETTE.lightText },
  video: { label: "VIDEO", bg: PALETTE.darkPrimary, text: PALETTE.darkText },
  web: { label: "WEB DEV", bg: PALETTE.lightText, text: PALETTE.lightBg },
};

const defaultTheme = { bg: PALETTE.darkSecondary, text: PALETTE.darkText };
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?";

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

        // Sway distance is smaller on mobile to prevent cutting off
        const isMobile = window.innerWidth < 768;
        const distance = isMobile ? 3 : 6;
        const duration = 15 + Math.random() * 5;
        const dir = i % 2 === 0 ? 1 : -1;

        gsap.fromTo(
          row,
          { xPercent: -distance * dir },
          {
            xPercent: distance * dir,
            duration: duration,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            force3D: true, // Hardware acceleration for smoothness
          }
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
      backgroundColor: theme.bg,
      color: theme.text,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleLeave = () => {
    if (!window.gsap) return;
    setActiveId(null);
    window.gsap.to(containerRef.current, {
      backgroundColor: defaultTheme.bg,
      color: defaultTheme.text,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const TriggerWord = ({ id, text }) => {
    const textRef = useRef(null);
    const animationRef = useRef(null);

    const scrambleText = () => {
      if (!window.gsap || !textRef.current) return;
      if (animationRef.current) animationRef.current.kill();

      animationRef.current = window.gsap.to(
        { p: 0 },
        {
          p: 1,
          duration: 0.5,
          ease: "power2.out", // Smoother easing
          onUpdate: function () {
            const progress = this.targets()[0].p;
            const len = text.length;
            const resolvedCount = Math.floor(len * progress);

            let result = "";
            for (let i = 0; i < len; i++) {
              if (i < resolvedCount) {
                result += text[i];
              } else {
                const randomChar =
                  CHARS[Math.floor(Math.random() * CHARS.length)];
                result += Math.random() > 0.9 ? " " : randomChar;
              }
            }
            if (textRef.current) textRef.current.innerText = result;
          },
          onComplete: () => {
            if (textRef.current) textRef.current.innerText = text;
          },
        }
      );
    };

    const resetText = () => {
      if (animationRef.current) animationRef.current.kill();
      if (textRef.current) textRef.current.innerText = text;
    };

    return (
      <span
        className="relative inline-block cursor-pointer px-1 md:px-2 z-30 transition-transform duration-300 ease-out active:scale-95 hover:scale-105"
        onMouseEnter={() => {
          handleEnter(id);
          scrambleText();
        }}
        onMouseLeave={() => {
          handleLeave();
          resetText();
        }}
        onClick={() => {
          if (activeId === id) {
            handleLeave();
            resetText();
          } else {
            handleEnter(id);
            scrambleText();
          }
        }}
      >
        <span
          className={`relative z-10 transition-all duration-300 ${
            activeId === id
              ? "opacity-100 font-extrabold"
              : "opacity-100 font-bold"
          }`}
        >
          <span ref={textRef} className="block">
            {text}
          </span>
          <span
            className={`absolute left-0 bottom-0 h-[2px] md:h-[3px] w-full bg-current transform origin-left transition-transform duration-300 ${
              activeId === id ? "scale-x-100" : "scale-x-0"
            }`}
          />
        </span>
      </span>
    );
  };

  const TextRow = ({
    children,
    move = false,
    stackOnMobile = false,
    className = "",
  }) => (
    <div
      className={`w-full flex justify-center py-1 md:py-2 landscape:py-0 ${
        move ? "overflow-hidden" : ""
      }`}
    >
      <div
        ref={(el) => rowsRef.current.push(el)}
        data-move={move}
        className={`
           hardware-accel flex items-center justify-center 
           ${
             stackOnMobile
               ? "flex-col gap-1 md:flex-row md:gap-6"
               : "flex-row gap-2 md:gap-6"
           }
           landscape:flex-row landscape:gap-4
           text-[clamp(2.5rem,7vw,6rem)] md:text-[clamp(1.75rem,5.5vw,6rem)] leading-none font-display font-bold uppercase tracking-tight 
           ${className}
         `}
      >
        {children}
      </div>
    </div>
  );

  return (
    <div
      id="movingtext"
      ref={containerRef}
      className="relative w-full min-h-[100dvh] flex flex-col justify-center items-center overflow-hidden transition-colors duration-500 ease-out no-select p-4"
      style={{ backgroundColor: defaultTheme.bg, color: defaultTheme.text }}
    >
      <FontLoader />

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-[1400px] mx-auto gap-2 md:gap-0">
        {/* Row 1: Moving */}
        <TextRow move={true}>
          {/* Desktop Text */}
          <span className="hidden md:inline">WE CREATE</span>
          <span className="stroke-text hidden md:inline">DIGITAL</span>
          <span className="hidden md:inline">FUTURE</span>

          {/* Mobile Premium Text: Short & Punchy */}
          <span className="md:hidden">NEXT</span>
          <span className="stroke-text md:hidden">GEN</span>
        </TextRow>

        {/* Row 2: Static */}
        <TextRow move={false} stackOnMobile={true}>
          {/* Helper text hidden on mobile to reduce clutter */}
          <span className="hidden md:inline opacity-50 text-[clamp(0.8rem,1.5vw,1.5rem)] font-body font-normal lowercase italic tracking-wide transform md:translate-y-1">
            experts in
          </span>
          <TriggerWord id="design" text="DESIGN" />
        </TextRow>

        {/* Row 3: Moving */}
        <TextRow move={true}>
          {/* Desktop Text */}
          <span className="stroke-text hidden md:inline">VISUAL</span>
          <span className="hidden md:inline">STRATEGY</span>
          <span className="stroke-text hidden md:inline">SYSTEMS</span>

          {/* Mobile Premium Text */}
          <span className="stroke-text md:hidden">VISUAL</span>
          <span className="md:hidden">ARTS</span>
        </TextRow>

        {/* Row 4: Static */}
        <TextRow move={false} stackOnMobile={true}>
          <span className="hidden md:inline opacity-50 text-[clamp(0.8rem,1.5vw,1.5rem)] font-body font-normal lowercase italic tracking-wide transform md:translate-y-1">
            crafting
          </span>
          <TriggerWord id="video" text="VIDEO" />
          <span className="hidden md:inline opacity-50 text-[clamp(0.8rem,1.5vw,1.5rem)] font-body font-normal lowercase italic tracking-wide transform md:translate-y-1">
            content
          </span>
        </TextRow>

        {/* Row 5: Moving */}
        <TextRow move={true}>
          {/* Desktop Text */}
          <span className="hidden md:inline">GLOBAL</span>
          <span className="stroke-text hidden md:inline">BRANDS</span>
          <span className="hidden md:inline">RISE</span>

          {/* Mobile Premium Text */}
          <span className="md:hidden">BEYOND</span>
          <span className="stroke-text md:hidden">LIMITS</span>
        </TextRow>

        {/* Row 6: Static */}
        <TextRow move={false} stackOnMobile={true}>
          <span className="hidden md:inline opacity-50 text-[clamp(0.8rem,1.5vw,1.5rem)] font-body font-normal lowercase italic tracking-wide transform md:translate-y-1">
            modern
          </span>
          <TriggerWord id="web" text="WEB DEV" />
          <span className="hidden md:inline opacity-50 text-[clamp(0.8rem,1.5vw,1.5rem)] font-body font-normal lowercase italic tracking-wide transform md:translate-y-1">
            solutions
          </span>
        </TextRow>
      </div>

      {/* Decorative Grid or Elements */}
      <div className="absolute top-5 left-5 md:top-10 md:left-10 opacity-20 w-10 h-10 md:w-16 md:h-16 pointer-events-none">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <circle cx="50" cy="50" r="40" />
          <path d="M50 10V90 M10 50H90" />
        </svg>
      </div>
    </div>
  );
};

export default MovingText;
