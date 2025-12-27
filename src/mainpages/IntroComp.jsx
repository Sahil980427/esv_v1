import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export default function IntroComp({ onComplete }) {
  const containerRef = useRef(null);
  const textContainerRef = useRef(null);
  const bgBlobsRef = useRef(null);
  
  // Guard to ensure onComplete is only called once
  const callOnce = useRef(false);

  useLayoutEffect(() => {
    // 1. Lock Body Scroll on Mount
    document.body.style.overflow = "hidden";

    // Load Font
    const linkFont = document.createElement('link');
    linkFont.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@700;900&display=swap";
    linkFont.rel = "stylesheet";
    document.head.appendChild(linkFont);

    const ctx = gsap.context(() => {
      const words = textContainerRef.current.querySelectorAll('.intro-word');
      const blobs = bgBlobsRef.current.querySelectorAll('.blob');

      // Initial States
      gsap.set(containerRef.current, { display: "flex" });
      gsap.set(words, { yPercent: 100, rotateX: -20, opacity: 0, transformOrigin: "50% 50% -50px" });
      gsap.set(blobs, { scale: 0, opacity: 0 });

      // Timeline
      const tl = gsap.timeline({
        onComplete: () => {
          // 2. Unlock Body Scroll on Completion
          document.body.style.overflow = "auto";
          
          if (!callOnce.current && onComplete) {
            callOnce.current = true;
            onComplete();
          }
        }
      });

      // Animation Steps
      tl.to(blobs, { scale: 1, opacity: 0.6, duration: 2, stagger: 0.2, ease: "power2.out" }, 0);
      tl.to(words[0], { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.5, ease: "expo.out" }, 0.2);
      tl.to(words[1], { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.5, ease: "expo.out" }, 0.35);
      tl.to(words[2], { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.8, scale: 1.05, ease: "expo.out" }, 0.5);

      // Float
      tl.to(words, { y: "-=2vh", duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: 1 }, ">-0.5");

      // Exit
      tl.to(words, { yPercent: -150, skewY: 5, opacity: 0, duration: 0.8, stagger: 0.05, ease: "power3.in" });
      
      // Curtain Up
      tl.to(containerRef.current, {
        height: 0,
        borderBottomLeftRadius: "30%", 
        borderBottomRightRadius: "30%",
        duration: 1.2,
        ease: "expo.inOut"
      }, "-=0.5");

    }, containerRef);

    return () => {
      // Cleanup: Ensure scroll is restored if component unmounts unexpectedly
      document.body.style.overflow = "auto";
      ctx.revert();
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="intro-overlay">
      <style>{`
        /* Scoped Variables to .intro-overlay instead of :root */
        .intro-overlay { 
            --bg-primary: #D0BCFC; 
            --bg-blob: #baa1f5; 
            --text-highlight: #491AB1; 
            position: fixed; 
            inset: 0; 
            z-index: 9999; 
            width: 100vw; 
            height: 100vh; 
            height: 100dvh; 
            background-color: var(--bg-primary); 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            overflow: hidden; 
            perspective: 1000px; 
        }
        @media (prefers-color-scheme: dark) { 
            .intro-overlay { 
                --bg-primary: #24204A; 
                --bg-blob: #1A1230; 
                --text-highlight: #D0BCFC; 
            } 
        }
        .blob { position: absolute; border-radius: 50%; background-color: var(--bg-blob); filter: blur(clamp(20px, 5vw, 60px)); z-index: 0; }
        .blob-1 { width: min(60vw, 500px); height: min(60vw, 500px); top: -10%; left: -10%; }
        .blob-2 { width: min(50vw, 400px); height: min(50vw, 400px); bottom: -5%; right: -5%; }
        .intro-text-container { position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: clamp(0.5rem, 2vw, 2rem); }
        .intro-word { font-family: 'Nunito', sans-serif; font-weight: 900; line-height: 1; color: var(--text-highlight); will-change: transform, opacity; display: inline-block; font-size: clamp(40px, 13vw, 140px); }
        @media (min-width: 600px) and (orientation: landscape) { .intro-text-container { flex-direction: row; gap: 1.5rem; } .intro-word { font-size: clamp(30px, 8vw, 100px); } }
        @media (min-width: 768px) { .intro-text-container { flex-direction: row; gap: 1.5rem; } .intro-word { font-size: clamp(60px, 7vw, 160px); } }
      `}</style>
      <div ref={bgBlobsRef} className="absolute inset-0 w-full h-full">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
      </div>
      <div ref={textContainerRef} className="intro-text-container">
        <div className="intro-word">Edit</div>
        <div className="intro-word">Space</div>
        <div className="intro-word">Visuals</div>
      </div>
    </div>
  );
}