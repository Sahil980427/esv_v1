import React, { useLayoutEffect, useRef } from 'react';

const SLIDES = [
  { id: 1, src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=80", title: "Horizon", subtitle: "Beyond the Edge" },
  { id: 2, src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1600&q=80", title: "Serenity", subtitle: "Touch the Sky" },
  { id: 3, src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&q=80", title: "Mist", subtitle: "Into the Unknown" },
  { id: 4, src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80", title: "Summit", subtitle: "Rise Above" },
  { id: 5, src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80", title: "Wilderness", subtitle: "Return to Roots" }
];

export default function Home2() {
  const rootRef = useRef(null);
  const viewportRef = useRef(null);
  const introRef = useRef(null);
  const introTextContainerRef = useRef(null);

  useLayoutEffect(() => {
    // Add Fonts
    const linkFont = document.createElement('link');
    linkFont.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@100;200;300;400;500;700&display=swap";
    linkFont.rel = "stylesheet";
    document.head.appendChild(linkFont);

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    // --- INTRO ANIMATION ---
    const words = introTextContainerRef.current.querySelectorAll('.intro-word');
    gsap.set(introRef.current, { yPercent: 0, display: "block" });
    gsap.set(words, { opacity: 0, y: 30, filter: "blur(8px)" });

    const tlIntro = gsap.timeline({ defaults: { ease: "power2.out" } });

    words.forEach((word) => {
      tlIntro.to(word, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power3.out" })
             .to(word, { opacity: 0, y: -30, filter: "blur(8px)", duration: 0.4, ease: "power2.in" }, ">-=0.1");
    });

    tlIntro.to(introRef.current, {
      yPercent: -125,
      duration: 1.4,
      ease: "power4.inOut",
      onComplete: () => {
        gsap.set(introRef.current, { display: "none" });
        ScrollTrigger.refresh();
      }
    }, "-=0.2");

    // --- CAROUSEL ANIMATION ---
    let ctx = gsap.context(() => {
      const slides = gsap.utils.toArray('.carousel-slide');
      const texts = gsap.utils.toArray('.carousel-text');
      
      gsap.set(texts.slice(1), { opacity: 0, scale: 0.86 });
      gsap.set(texts[0], { opacity: 1, scale: 1 }); 

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: viewportRef.current,
          invalidateOnRefresh: true,
        }
      });

      slides.forEach((slide, i) => {
        if (i < slides.length - 1) {
          tl.to(slide, {
            scale: 2.3, opacity: 0, rotationZ: i % 2 === 0 ? 3.5 : -3.5, filter: 'blur(12px)', ease: "power2.inOut", duration: 1,
          }, i);

          const currentText = texts[i];
          if (currentText) {
            tl.to(currentText, { scale: 3.6, opacity: 0, filter: 'blur(16px)', ease: "power3.in", duration: 0.85 }, i);
          }

          const nextText = texts[i + 1];
          if (nextText) {
            tl.to(nextText, { opacity: 1, scale: 1, ease: "power2.out", duration: 1 }, i + 0.18); 
          }
        }
      });
    }, rootRef);

    return () => {
      ctx.revert();
      tlIntro.kill();
      try { document.head.removeChild(linkFont); } catch(e) {}
    };
  }, []);

  return (
    <div ref={rootRef} className="relative w-full h-[600vh] bg-neutral-950 font-sans text-white">
      <style>{`
        .carousel-viewport {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100vh;
          overflow: hidden; display: flex; justify-content: center; align-items: center; perspective: 1400px; z-index: 1;
        }
        .carousel-slide {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          display: flex; justify-content: center; align-items: center; will-change: transform, opacity, filter; overflow: hidden;
        }
        .carousel-image { width: 100%; height: 100%; object-fit: cover; display: block; }
        .carousel-text {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          text-align: center; z-index: 10; color: white; width: 80%; pointer-events: none; mix-blend-mode: overlay;
        }
        .carousel-title { font-family: 'Poppins', sans-serif; font-size: 6vw; font-weight: 700; text-transform: uppercase; letter-spacing: -1px; line-height: 0.95; margin: 0; text-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        .carousel-subtitle { font-family: 'Poppins', sans-serif; font-size: 1.5vw; font-weight: 300; letter-spacing: 8px; text-transform: uppercase; margin-top: 1.5rem; display: block; }
        .intro-overlay-bg { background: black; background: radial-gradient(circle at 50% 100%, #000000ff 0%, #000000ff 100%); }
        .intro-word {
          position: absolute; bottom: 0; left: 0; line-height: 1; white-space: nowrap; will-change: transform, opacity, filter;
          font-family: 'Poppins', sans-serif; font-size: 300vw; font-weight: 300; letter-spacing: 0.00em;
          color: #f0f0f0; background: linear-gradient(to bottom right, #410075ff 30%, #0078d3ff 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        @media (min-width: 768px) { .intro-word { font-size: 10vw; } }
      `}</style>

      {/* INTRO */}
      <div ref={introRef} className="fixed inset-0 z-50 w-full h-full intro-overlay-bg overflow-hidden">
        <div ref={introTextContainerRef} className="absolute bottom-12 left-6 md:bottom-16 md:left-16 w-auto h-[14vw] md:h-[11vw] overflow-visible">
            <span className="intro-word">Edit</span>
            <span className="intro-word">Space</span>
            <span className="intro-word">Visuals</span>
        </div>
      </div>

      {/* CAROUSEL */}
      <div ref={viewportRef} className="carousel-viewport">
        {SLIDES.map((slide, index) => (
          <div key={slide.id} className="carousel-slide" style={{ zIndex: SLIDES.length - index }}>
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