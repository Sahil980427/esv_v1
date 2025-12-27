import React, { useLayoutEffect, useRef, useState, useEffect } from "react";

// --- CONFIGURATION ---
const SLIDES = [
  {
    id: 1,
    bg: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop",
    title: "Rehabilitación de la Muralla",
    count: "1/5",
    bigText: "MUR",
    location: "Logroño, España",
    link: "Ver Proyecto",
  },
  {
    id: 2,
    bg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
    title: "Museo de Pontevedra",
    count: "2/5",
    bigText: "COM",
    location: "Galicia, España",
    link: "Ver Proyecto",
  },
  {
    id: 3,
    bg: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop",
    title: "Casa de la Música",
    count: "3/5",
    bigText: "MUS",
    location: "Porto, Portugal",
    link: "Ver Proyecto",
  },
  {
    id: 4,
    bg: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop",
    title: "Centro de Arte Botín",
    count: "4/5",
    bigText: "ART",
    location: "Santander, España",
    link: "Ver Proyecto",
  },
  {
    id: 5,
    bg: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2000&auto=format&fit=crop",
    title: "Torre de Cristal",
    count: "5/5",
    bigText: "TWR",
    location: "Madrid, España",
    link: "Ver Proyecto",
  },
];

export default function ChangeImageBackgroundWithText2() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scriptsLoaded, setScriptsLoaded] = useState(false); // --- Script Loading ---

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
  }, []); // --- Animation Logic ---

  useLayoutEffect(() => {
    if (!scriptsLoaded) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    const ctx = gsap.context(() => {
      const bgImages = gsap.utils.toArray(".bg-image"); // 1. Setup Initial States
      bgImages.forEach((img, i) => {
        if (i > 0) {
          gsap.set(img, { yPercent: 100 });
        }
      }); // 2. Create Master Timeline

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=4000", // Length of the scroll experience
          pin: true, // Pin the container
          scrub: 1, // 1s lag for smooth "butter" feel
          snap: {
            snapTo: 1 / (SLIDES.length - 1), // Snap to nearest slide
            duration: 0.5,
            delay: 0.2,
            ease: "power1.inOut",
          },
          onUpdate: (self) => {
            // Update the text index based on scroll progress
            const progress = self.progress;
            const totalSlides = SLIDES.length;
            const idx = Math.min(
              Math.floor(progress * totalSlides),
              totalSlides - 1
            );
            setActiveIndex((prev) => (prev !== idx ? idx : prev));
          },
        },
      }); // 3. Build the Animation Sequence

      SLIDES.forEach((_, i) => {
        if (i > 0) {
          tl.to(bgImages[i], {
            yPercent: 0,
            ease: "none",
            duration: 1,
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [scriptsLoaded]); // --- Helper: Render Card Content ---

  const CardContent = ({ slide, half }) => (
    <div className={`card-inner ${half}`}>
           {" "}
      <div className="card-header">
                <span className="card-title">{slide.title}</span>       {" "}
        <span className="card-count">{slide.count}</span>     {" "}
      </div>
           {" "}
      <div className="card-center">
                <h1 className="big-text">{slide.bigText}</h1>     {" "}
      </div>
           {" "}
      <div className="card-footer">
                <span className="card-location">{slide.location}</span>       {" "}
        <span className="card-link">{slide.link}</span>     {" "}
      </div>
         {" "}
    </div>
  );

  if (!scriptsLoaded)
    return <div className="loader">Loading Experience...</div>;

  return (
    <div ref={containerRef} className="main-container">
           {" "}
      <style>{`
        .main-container {
          width: 100vw; height: 100vh;
          overflow: hidden; position: relative;
          background-color: #111;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #000;
        }
        .loader {
          height: 100vh; display: flex; justify-content: center; align-items: center;
          background: #000; color: white;
        }
        /* BACKGROUNDS */
        .bg-layer {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          z-index: 1;
        }
        .bg-image {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          object-fit: cover;
          will-change: transform; /* Optimization */
        }

        /* CENTER CARD - EVEN SMALLER SIZE HERE */
        .center-card {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 350px; /* Reduced from 400px */
          height: 450px; /* Reduced from 500px */
          z-index: 50;
          display: flex; flex-direction: column;
          cursor: pointer;
        }
        .card-half {
          width: 100%; height: 50%;
          background: #fff; overflow: hidden; position: relative;
          transition: transform 0.4s cubic-bezier(0.2, 1, 0.3, 1);
        }
        /* Hover Split Effect */
        .center-card:hover .card-half-top { transform: translateY(-15px); }
        .center-card:hover .card-half-bottom { transform: translateY(15px); }

        /* Content Layout */
        .card-inner {
          position: absolute; width: 100%; height: 200%; left: 0;
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 1.5rem; box-sizing: border-box;
        }
        .card-inner.top { top: 0; }
        .card-inner.bottom { top: -100%; }

        /* Typography */
        .card-header, .card-footer {
          display: flex; justify-content: space-between;
          font-size: 0.75rem; font-weight: 600;
        }
        .card-center {
          display: flex; justify-content: center; align-items: center; flex: 1;
        }
        /* Further reduced font size */
        .big-text {
          font-size: 4rem; /* Reduced from 5rem */
          font-weight: 800; margin: 0;
          text-transform: uppercase; user-select: none;
        }
        @media (max-width: 768px) {
          .center-card { width: 85vw; height: 55vh; }
          .big-text { font-size: 3.5rem; }
        }
      `}</style>
            {/* 1. Backgrounds: Controlled by GSAP Timeline */}     {" "}
      <div className="bg-layer">
               {" "}
        {SLIDES.map((slide, index) => (
          <img
            key={slide.id}
            src={slide.bg}
            alt={slide.title}
            className="bg-image"
            style={{ zIndex: index + 1 }} // Ensure correct stacking order
          />
        ))}
             {" "}
      </div>
           {" "}
      {/* 2. Center Card: Updates via React State based on Scroll Index */}     {" "}
      <div className="center-card">
               {" "}
        <div className="card-half card-half-top">
                    <CardContent slide={SLIDES[activeIndex]} half="top" />     
           {" "}
        </div>
               {" "}
        <div className="card-half card-half-bottom">
                    <CardContent slide={SLIDES[activeIndex]} half="bottom" />   
             {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
}
