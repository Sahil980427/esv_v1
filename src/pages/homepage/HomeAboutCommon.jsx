import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

export default function HomeAboutCommon() {
  const mainRef = useRef(null);
  const heroWrapperRef = useRef(null);
  const aboutWrapperRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. PINNING STRATEGY
      // This pins the Hero section in place while the user scrolls, 
      // creating the effect that the About section is sliding UP OVER the hero.
      ScrollTrigger.create({
        trigger: heroWrapperRef.current,
        start: "top top",
        end: "bottom top", // Keep pinned until the About section fully covers it
        pin: true, 
        pinSpacing: false, // Allows the About section to overlap naturally
        scrub: true,
      });

      // 2. SNAP STRATEGY (Optional - "Scroll Jacking")
      // If you want the page to force-snap to the sections so the user 
      // can't stop halfway between them:
      ScrollTrigger.create({
        trigger: mainRef.current,
        start: "top top",
        end: "bottom bottom",
        snap: {
          snapTo: 1, // Snaps to the start of the scrollable area (0 or 1)
          duration: { min: 0.5, max: 0.8 }, 
          delay: 0.1,
          ease: "power1.inOut"
        }
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} style={{ width: "100%", overflowX: "hidden" }}>
      
      {/* SECTION 1: HERO */}
      {/* zIndex: 1 ensures it sits behind the About section */}
      <div 
        ref={heroWrapperRef} 
        style={{ 
          height: "100vh", 
          width: "100%", 
          position: "relative", 
          zIndex: 1 
        }}
      >
        <EditSpaceHero />
      </div>

      {/* SECTION 2: ABOUT */}
      {/* zIndex: 2 ensures it slides OVER the hero */}
      <div 
        ref={aboutWrapperRef} 
        style={{ 
          position: "relative", 
          zIndex: 2,
          // We add a shadow to separate the layers visually during the slide
          boxShadow: "0px -20px 50px rgba(0,0,0,0.5)" 
        }}
      >
        <EditSpaceAbout />
      </div>

    </div>
  );
}