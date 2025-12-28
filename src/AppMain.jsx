import React, { useState, useEffect } from "react";
import WheelImage from "./mainpages/WheelImage";
import ExpandableTab from "./mainpages/ExpandableTab";
import IntroComp from "./mainpages/IntroComp";
import HorizontalScrollLogo from "./mainpages/HorizontalScrollLogo";
import Footer from "./mainpages/Footer";
import Hero from "./mainpages/Hero";
import About from "./mainpages/About";
import VMV from "./mainpages/VMV";
import ManagementStandard from "./mainpages/ManagementStandard";
import WhyESV from "./mainpages/WhyESV";
import KnowledgeService from "./mainpages/KnowledgeService";
import SmallMarqueeBanner from "./mainpages/SmallMarqueeBanner";
import Testimonials from "./mainpages/Testimonials";
import AllServices from "./mainpages/AllServices";
import Work from "./mainpages/Work";
import Contact from "./mainpages/Contact";
import FeedbackWidget from "./mainpages/FeedbackWidget";
import Navbar from "./integrate/Navbar";

export default function AppMain() {
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  useEffect(() => {
    // 1. Load GSAP and ScrollTrigger once globally
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
    ])
      .then(() => {
        setTimeout(() => {
          if (window.gsap && window.ScrollTrigger) {
            window.gsap.registerPlugin(window.ScrollTrigger);
            setGsapLoaded(true);
          }
        }, 50);
      })
      .catch((err) => console.error("GSAP load error:", err));
  }, []);

  if (!gsapLoaded)
    return (
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center font-sans">
        Loading EditSpaceVisuals...
      </div>
    );

  return (
    // Use overflow-x-hidden instead of overflow-hidden to allow vertical scrolling for GSAP
    <main className="w-full relative overflow-x-hidden bg-[#050505]">
      {/* GLOBAL RESET & FONTS */}
      <style>{`
        *, *::before, *::after {
          box-sizing: border-box;
        }
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
          background-color: #050505;
          -webkit-font-smoothing: antialiased;
        }
        body {
          overflow-x: hidden; /* Prevent horizontal scrollbar */
        }
        /* Hide scrollbar for Chrome/Safari/Opera */
        body::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        body {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        `}</style>

      <Navbar isDarkMode={true} />
      {!introFinished && (
        <IntroComp onComplete={() => setIntroFinished(true)} />
      )}
      <Hero startAnim={introFinished} />
      <FeedbackWidget />
      <ExpandableTab />
      <About />
      <WhyESV />
      <VMV />
      <AllServices />
      <Work />
      <HorizontalScrollLogo />
      <ManagementStandard />
      <SmallMarqueeBanner />
      <Testimonials />
      <KnowledgeService />
      <SmallMarqueeBanner />
      <Contact />
      <WheelImage />
      <Footer />
    </main>
  );
}
