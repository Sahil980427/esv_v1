import React, { useLayoutEffect, useRef } from 'react';

export default function IntroComp2() {
  const introRef = useRef(null);
  const introTextContainerRef = useRef(null);

  useLayoutEffect(() => {
    // Add Fonts (specific to this component if needed standalone)
    const linkFont = document.createElement('link');
    linkFont.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;700&display=swap";
    linkFont.rel = "stylesheet";
    document.head.appendChild(linkFont);

    const gsap = window.gsap;
    
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
      }
    }, "-=0.2");

    return () => {
      tlIntro.kill();
      // Optional: remove font if unmounting, though usually safe to leave
      // try { document.head.removeChild(linkFont); } catch(e) {}
    };
  }, []);

  return (
    <>
      <style>{`
        .intro-overlay-bg { background: black; background: radial-gradient(circle at 50% 100%, #000000ff 0%, #000000ff 100%); }
        .intro-word {
          position: absolute; bottom: 0; left: 0; line-height: 1; white-space: nowrap; will-change: transform, opacity, filter;
          font-family: 'Poppins', sans-serif; font-size: 300vw; font-weight: 300; letter-spacing: 0.00em;
          color: #f0f0f0; background: linear-gradient(to bottom right, #410075ff 30%, #0078d3ff 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        @media (min-width: 768px) { .intro-word { font-size: 10vw; } }
      `}</style>

      <div ref={introRef} className="fixed inset-0 z-50 w-full h-full intro-overlay-bg overflow-hidden">
        <div ref={introTextContainerRef} className="absolute bottom-12 left-6 md:bottom-16 md:left-16 w-auto h-[14vw] md:h-[11vw] overflow-visible">
            <span className="intro-word">Edit</span>
            <span className="intro-word">Space</span>
            <span className="intro-word">Visuals</span>
        </div>
      </div>
    </>
  );
}