import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import MovingText from "./MovingText"; // Ensure this path is correct

const ExpandableTab = () => {
  const containerRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const triggerTextRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const tl = useRef();

  useGSAP(
    () => {
      gsap.set(contentWrapperRef.current, { autoAlpha: 0, display: "none" });

      tl.current = gsap
        .timeline({ paused: true })
        // 1. Hide Trigger Text
        .to(triggerTextRef.current, {
          opacity: 0,
          scale: 0.9,
          duration: 0.3,
          ease: "power2.in",
        })
        // 2. Expand Container
        .to(containerRef.current, {
          width: "100vw",
          height: "100vh",
          bottom: 0,
          borderRadius: "0px",
          duration: 1.2,
          ease: "expo.inOut",
        })
        // 3. Show Content
        .set(
          contentWrapperRef.current,
          { display: "block", autoAlpha: 1 },
          "-=0.5"
        )
        .fromTo(
          contentWrapperRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1 },
          "-=0.2"
        );
    },
    { scope: containerRef }
  );

  const toggleOpen = () => {
    if (isOpen) {
      tl.current.reverse();
    } else {
      tl.current.play();
    }
    setIsOpen(!isOpen);
  };

  // Scroll to Close logic
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => toggleOpen();
    window.addEventListener("wheel", handleScroll);
    window.addEventListener("touchmove", handleScroll);
    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [isOpen]);

  return (
    <>
      <div
        ref={containerRef}
        onClick={!isOpen ? toggleOpen : undefined}
        style={{
          cursor: isOpen ? "default" : "pointer",
          fontFamily: '"Nunito", sans-serif',
        }}
        // === RESPONSIVE SIZES ===
        // 1. Base (Phone Portrait): Small & Compact
        // 2. Landscape: Adjusted bottom spacing
        // 3. md (Tablet): Medium size
        // 4. lg (Desktop): Full size
        className="fixed left-1/2 -translate-x-1/2 shadow-2xl z-50 overflow-hidden group
                   transition-colors duration-500
                   bg-[#D0BCFC] dark:bg-[#24204A] 
                   text-[#491AB1] dark:text-[#D0BCFC]
                   
                   /* Phone Portrait (Default) - REDUCED SIZE */
                   w-[150px] h-[42px] bottom-6 rounded-[30px]

                   /* Phone Landscape */
                   landscape:bottom-3 landscape:h-[40px]
                   
                   /* Tablet (md: 768px+) */
                   md:w-[220px] md:h-[50px] md:bottom-8 md:rounded-[40px]
                   
                   /* Desktop (lg: 1024px+) */
                   lg:w-[320px] lg:h-[60px] lg:bottom-10 lg:rounded-[50px]"
      >
        {/* === CLOSED STATE: Trigger === */}
        <div
          ref={triggerTextRef}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          {/* Font Sizes: text-base (Mobile), text-xl (Tablet), text-2xl (Desktop) */}
          <span className="text-base md:text-xl lg:text-2xl font-extrabold tracking-wide z-10 relative">
            Our Purpose
          </span>

          {/* THE FLASH LIGHT EFFECT */}
          {!isOpen && (
            <div
              className="absolute inset-0 -translate-x-[150%] skew-x-12 
                             group-hover:translate-x-[150%] 
                             transition-transform duration-1000 ease-in-out
                             bg-gradient-to-r from-transparent via-white/40 to-transparent 
                             z-0 pointer-events-none"
            />
          )}

          {/* Underline Bar - Adjusted widths for each screen size */}
          <div
            className="w-6 h-[3px] bg-current mt-[2px] rounded-full opacity-60 
                           transition-all duration-500 ease-out 
                           group-hover:w-12 md:group-hover:w-16 lg:group-hover:w-24 
                           group-hover:opacity-100 z-10"
          />
        </div>

        {/* === OPEN STATE: Content === */}
        <div ref={contentWrapperRef} className="w-full h-full relative">
          <MovingText />

          {/* Close Button */}
          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleOpen();
              }}
              className="group/btn flex flex-col items-center gap-1 cursor-pointer"
            >
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold hover:opacity-70 transition-opacity">
                Close
              </span>
              <span className="w-0 h-[2px] rounded-full bg-current transition-all duration-300 group-hover/btn:w-full"></span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpandableTab;
