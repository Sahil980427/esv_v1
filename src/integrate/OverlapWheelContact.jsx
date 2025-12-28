import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// --- IMPORT YOUR COMPONENTS HERE ---
// import Contact from "../mainpages/Contact";
import WheelImage from "../mainpages/WheelImage";
import Footer from "../mainpages/Footer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function OverlapWheelContact() {
  const containerRef = useRef(null);
  const contactSectionRef = useRef(null);
  const wheelSectionRef = useRef(null);

  useGSAP(
    () => {
      const contactSection = contactSectionRef.current;
      const wheelSection = wheelSectionRef.current;

      // 1. PIN THE CONTACT FORM
      // This holds the Contact section in place while the user keeps scrolling
      ScrollTrigger.create({
        trigger: contactSection,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false, // Allows the Wheel section to slide UP over the Contact section
        id: "contact-pin",
      });

      // 2. DEPTH SCALE (No Darkening)
      // This creates a subtle "push back" effect without turning the screen black.
      gsap.to(contactSection, {
        scale: 0.95, // Slight scale for 3D feel
        borderRadius: "0 0 60px 60px", // Round the bottom corners
        y: 20, // Move down slightly
        ease: "none",
        scrollTrigger: {
          trigger: wheelSection,
          start: "top bottom", // When Wheel enters viewport
          end: "top top", // When Wheel covers viewport
          scrub: true,
        },
      });

      // 3. WHEEL ENTRANCE (The "Card" Effect)
      // The Wheel section starts with rounded top corners and flattens out
      gsap.fromTo(
        wheelSection,
        {
          borderTopLeftRadius: "60px",
          borderTopRightRadius: "60px",
        },
        {
          borderTopLeftRadius: "0px",
          borderTopRightRadius: "0px",
          ease: "none",
          scrollTrigger: {
            trigger: wheelSection,
            start: "top bottom",
            end: "top center",
            scrub: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    // Replaced 'bg-black' with a neutral background matching your theme to avoid "void" effect
    <div ref={containerRef} className="relative w-full bg-[#1A1230]">
      
      {/* --- LAYER 1: CONTACT FORM (Stays Sticky) --- */}
      <div
        ref={contactSectionRef}
        className="relative z-0 w-full min-h-screen origin-top"
      >
      <WheelImage />
      </div>

      {/* --- LAYER 2: WHEEL IMAGE (Slides Over) --- */}
      {/* Shadow added for separation, but no darkening of the layer below */}
      <div
        ref={wheelSectionRef}
        className="relative z-10 w-full bg-[#24204A] shadow-[0_-30px_60px_rgba(0,0,0,0.5)]"
      >
        {/* <Contact /> */}
        <Footer/>
      </div>
    </div>
  );
}