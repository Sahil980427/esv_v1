import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';

const HERO_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

export default function ImageBoxZoom() {
  const containerRef = useRef(null);
  const zoomWrapperRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
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

  // --- Animation Logic ---
  useLayoutEffect(() => {
    if (!scriptsLoaded) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    const ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",    // Start immediately
          end: "+=300%",       // Increased scroll distance for a longer, smoother animation
          scrub: 1,            // Smooth scrubbing
          pin: true,           // Pin the container while zooming
          anticipatePin: 1,
        }
      });

      // 1. Scale the Wrapper to Full Screen
      tl.to(zoomWrapperRef.current, {
        width: '100vw',
        height: '100vh',
        borderRadius: '0px', // Remove corners as it fills screen
        ease: "power2.inOut",
      }, 0);

      // 2. Scale Image slightly for parallax effect inside the box
      tl.to(imageRef.current, {
        scale: 1.1,
        ease: "power2.inOut"
      }, 0);

      // 3. Fade out text content
      tl.to(textRef.current, {
        opacity: 0,
        scale: 1.5,
        y: -50,
        ease: "power2.in"
      }, 0);

    }, containerRef);

    return () => ctx.revert();
  }, [scriptsLoaded]);

  if (!scriptsLoaded) return <div className="loader">Loading...</div>;

  return (
    <div className="page-wrapper">
      <style>{`
        .page-wrapper {
          width: 100%;
          background-color: #fff;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          overflow-x: hidden;
        }
        .loader {
          height: 100vh; display: flex; justify-content: center; align-items: center;
          background: #000; color: white;
        }
        
        /* ZOOM COMPONENT STYLES */
        .zoom-container {
          width: 100%;
          height: 100vh; /* Full viewport height for the pinned section */
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #fff; /* Background behind the zoom box */
          position: relative;
          overflow: hidden;
        }

        .zoom-wrapper {
          /* Initial "Box" State */
          width: 40vw;
          height: 60vh;
          position: relative;
          overflow: hidden;
          border-radius: 20px; /* Rounded corners initially */
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          will-change: width, height, border-radius;
          /* Centering */
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .zoom-image {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          will-change: transform;
        }

        .zoom-content {
          position: relative;
          z-index: 10;
          color: white;
          text-align: center;
          mix-blend-mode: difference; /* Makes text visible on light/dark images */
        }

        .zoom-title {
          font-size: 4vw;
          font-weight: 900;
          text-transform: uppercase;
          margin: 0;
          line-height: 1;
          letter-spacing: -2px;
        }
        .zoom-subtitle {
          font-size: 1.2rem;
          text-transform: uppercase;
          letter-spacing: 4px;
          margin-top: 1rem;
          display: block;
        }

        @media (max-width: 768px) {
          .zoom-wrapper { width: 80vw; height: 50vh; }
          .zoom-title { font-size: 3rem; }
        }
      `}</style>

      {/* THE ZOOM COMPONENT */}
      <div ref={containerRef} className="zoom-container">
        <div ref={zoomWrapperRef} className="zoom-wrapper">
          <img 
            ref={imageRef}
            src={HERO_IMAGE} 
            alt="Abstract Architecture" 
            className="zoom-image"
          />
          <div ref={textRef} className="zoom-content">
            <h1 className="zoom-title">Mubien</h1>
            <span className="zoom-subtitle">Digital Experience</span>
          </div>
        </div>
      </div>

    </div>
  );
}