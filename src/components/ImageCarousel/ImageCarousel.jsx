import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';

// --- Configuration ---
const SLIDES = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    title: "Horizon",
    subtitle: "Beyond the Edge"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    title: "Serenity",
    subtitle: "Touch the Sky"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    title: "Mist",
    subtitle: "Into the Unknown"
  },
  {
    id: 4,
    // Updated Image for Summit to be more distinct
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    title: "Summit",
    subtitle: "Rise Above"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    title: "Wilderness",
    subtitle: "Return to Roots"
  }
];

export default function ImageCarousel() {
  const rootRef = useRef(null);
  const viewportRef = useRef(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  // --- 1. Robust Script Loading ---
  useEffect(() => {
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      setScriptsLoaded(true);
      return;
    }

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
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
    }).catch(err => console.error("GSAP load error:", err));
  }, []);

  // --- 2. Animation Logic ---
  useLayoutEffect(() => {
    if (!scriptsLoaded) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    ScrollTrigger.getAll().forEach(st => st.kill());

    let ctx = gsap.context(() => {
      const slides = gsap.utils.toArray('.carousel-slide');
      const texts = gsap.utils.toArray('.carousel-text');
      
      // 1. Setup initial states: Hide all texts except the first one
      // This prevents the overlapping issue where upcoming text is visible behind current text
      gsap.set(texts.slice(1), { opacity: 0, scale: 0.8 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: viewportRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      // Progress Bar
      // gsap.to('.carousel-progress', {
      //   scaleX: 1,
      //   ease: 'none',
      //   transformOrigin: 'left center',
      //   scrollTrigger: {
      //     trigger: rootRef.current,
      //     start: "top top",
      //     end: "bottom bottom",
      //     scrub: true
      //   }
      // });

      slides.forEach((slide, i) => {
        // We animate all slides except the last one (which stays as the backdrop)
        if (i < slides.length - 1) {
          
          // --- A. Animate Current Layer OUT ---
          
          // Image: Zoom In, Fade Out
          tl.to(slide, {
            scale: 2.5,
            opacity: 0,
            rotationZ: i % 2 === 0 ? 4 : -4,
            filter: 'blur(15px)',
            ease: "power2.inOut",
            duration: 1,
          }, i);

          // Text: Fly OUT faster (Parallax)
          const currentText = texts[i];
          if (currentText) {
            tl.to(currentText, {
              scale: 4,
              opacity: 0,
              filter: 'blur(20px)',
              ease: "power3.in",
              duration: 0.8,
            }, i);
          }

          // --- B. Animate NEXT Layer IN ---
          
          // Next Text: Fade IN and scale UP gently
          // This ensures the text appears cleanly only when it's turn comes
          const nextText = texts[i + 1];
          if (nextText) {
            tl.to(nextText, {
              opacity: 1,
              scale: 1,
              ease: "power2.out",
              duration: 1,
            }, i + 0.2); // Slight delay to let previous text clear a bit
          }
        }
      });

      // Intro Animation for first slide
      if (texts[0]) {
        gsap.from(texts[0], {
          y: 100,
          opacity: 0,
          duration: 1.5,
          ease: "power3.out",
          overwrite: 'auto'
        });
      }

    }, rootRef);

    return () => ctx.revert();
  }, [scriptsLoaded]);

  return (
    <div ref={rootRef} className="carousel-container">
      <style>{`
        .carousel-container {
          height: 600vh;
          background-color: #050505;
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        .carousel-viewport {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1000px;
          opacity: 0;
          transition: opacity 1s ease;
        }
        .carousel-viewport.loaded {
          opacity: 1;
        }
        .carousel-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          will-change: transform, opacity, filter;
          overflow: hidden;
        }
        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .carousel-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 10;
          color: white;
          width: 80%;
          pointer-events: none;
          mix-blend-mode: overlay;
        }
        .carousel-title {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 6vw;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -2px;
          line-height: 0.9;
          margin: 0;
          text-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        .carousel-subtitle {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 1.5vw;
          font-weight: 300;
          letter-spacing: 8px;
          text-transform: uppercase;
          margin-top: 1.5rem;
          display: block;
        }
        // .carousel-progress {
        //   position: fixed;
        //   bottom: 0;
        //   left: 0;
        //   height: 6px;
        //   background: #ffffff;
        //   width: 100%;
        //   transform: scaleX(0);
        //   transform-origin: left;
        //   z-index: 1000;
        // }
        .carousel-loading {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-family: sans-serif;
          font-size: 1.2rem;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
      `}</style>
      
      {!scriptsLoaded && <div className="carousel-loading">INITIALIZING EXPERIENCE...</div>}
      
      <div className="carousel-progress"></div>

      <div 
        ref={viewportRef} 
        className={`carousel-viewport ${scriptsLoaded ? 'loaded' : ''}`}
      >
        {SLIDES.map((slide, index) => (
          <div 
            key={slide.id}
            className="carousel-slide"
            style={{ zIndex: SLIDES.length - index }}
          >
            <img src={slide.src} alt={slide.title} className="carousel-image" />
            
            <div className="carousel-text">
              <h2 className="carousel-title">{slide.title}</h2>
              <span className="carousel-subtitle">{slide.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}