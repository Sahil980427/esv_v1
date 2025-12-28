import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// --- Fonts & Global Styles ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;1,400&display=swap');
    
    .font-nunito { font-family: 'Nunito', sans-serif; }
    .perspective-2000 { perspective: 2000px; }
    .transform-style-3d { transform-style: preserve-3d; }
    
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    .animate-float { animation: float 6s ease-in-out infinite; }
  `}</style>
);

// --- STRICT PALETTE CONSTANTS ---
const PALETTE = {
  bg: "#24204A",
  cardBg: "#1A1230",
  text: "#D0BCFC",
  highlight: "#491AB1",
};

const slides = [
  {
    id: 0,
    type: "intro",
    number: "00",
    category: "Introduction",
    title: "The EditSpaceVisuals Management Standard",
    content:
      "We replace chaos with coordination. Our managed service model ensures that technical complexity is handled behind the scenes. Scroll or Swipe to explore our pillars.",
    image: null,
  },
  {
    id: 1,
    type: "content",
    number: "01",
    category: "Core Value",
    title: "Total Synergy",
    content:
      "We don't work in silos. Your web developer talks to your SEO manager; your video editor aligns with your brand strategist. We create a unified vision.",
    image: "https://abovewhispers.com/wp-content/uploads/2016/02/synergyc.jpg",
  },
  {
    id: 2,
    type: "content",
    number: "02",
    category: "Lifecycle",
    title: "Process Driven",
    content:
      "Every project follows a strict lifecycle—Planning, Execution, Quality Assurance, and Delivery. We minimize risk through rigorous structure.",
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    type: "content",
    number: "03",
    category: "Future Proof",
    title: "Scalability",
    content:
      "We build solutions that grow as you grow. Our systems are designed to handle your expansion without needing to be rebuilt from scratch.",
    image:
      "https://inc42.com/cdn-cgi/image/quality=75/https://asset.inc42.com/2023/10/Glossary-Series-Startups-f7.png",
  },
  {
    id: 4,
    type: "content",
    number: "04",
    category: "The Standard",
    title: "Pure Coordination",
    content:
      "Design is not just how it looks, but how it works. We align aesthetics with functionality to create seamless user experiences.",
    image:
      "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=1000&q=80",
  },
];

const ManagementStandard = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [animState, setAnimState] = useState("idle");
  const [direction, setDirection] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Refs for tracking values inside Event Listeners/GSAP without dependencies
  const containerRef = useRef(null);
  const activeIdxRef = useRef(activeIdx);
  const animStateRef = useRef(animState);

  // Keep refs synced with state
  useEffect(() => {
    activeIdxRef.current = activeIdx;
    animStateRef.current = animState;
  }, [activeIdx, animState]);

  // --- MOUSE MOVE EFFECT (Desktop Tilt) ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || window.innerWidth < 768) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      setMousePos({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }
    return () => container?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // --- CHANGE HANDLER ---
  const performChange = (newIdx, dir) => {
    if (newIdx < 0 || newIdx >= slides.length) return;

    setDirection(dir);
    setAnimState("exiting");

    setTimeout(() => {
      setActiveIdx(newIdx);
      setAnimState("entering");
      setTimeout(() => {
        setAnimState("idle");
      }, 50);
    }, 500);
  };

  // --- GSAP PINNING & SCROLL LOGIC ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        pin: true,
        start: "top top",
        end: "+=4000",
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const total = slides.length;
          const targetIdx = Math.min(total - 1, Math.floor(progress * total));
          const currentIdx = activeIdxRef.current;
          const isAnimating = animStateRef.current !== "idle";

          if (targetIdx !== currentIdx && !isAnimating) {
            const dir = targetIdx > currentIdx ? 1 : -1;
            performChange(targetIdx, dir);
          }
        },
      });
    }, containerRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  const currentSlide = slides[activeIdx];
  const isIntro = currentSlide.type === "intro";

  // --- Animation Styles Helpers ---
  const getSlideTransition = (delay = 0) => {
    const isExiting = animState === "exiting";
    const isEntering = animState === "entering";
    let transform = "translateY(0)";
    let opacity = 1;
    let blur = "blur(0px)";

    if (isExiting) {
      transform = `translateY(${direction * -40}px)`;
      opacity = 0;
      blur = "blur(8px)";
    } else if (isEntering) {
      transform = `translateY(${direction * 40}px)`;
      opacity = 0;
    }

    return {
      transition: "all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
      transitionDelay: isEntering ? `${delay}ms` : "0ms",
      transform,
      opacity,
      filter: blur,
    };
  };

  const getCardStyle = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const tiltX = isMobile ? 0 : mousePos.y * -12;
    const tiltY = isMobile ? 0 : mousePos.x * 12;
    let transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    let opacity = 1;
    let scale = 1;

    if (animState === "exiting") {
      transform = `translateX(${direction * -100}px) rotateY(${
        direction === 1 ? -45 : 45
      }deg) scale(0.85)`;
      opacity = 0;
    } else if (animState === "entering") {
      transform = `translateX(${direction * 100}px) rotateY(${
        direction === 1 ? 45 : -45
      }deg) scale(0.85)`;
      opacity = 0;
    }

    return {
      transform,
      opacity,
      scale,
      transition:
        "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease",
    };
  };

  return (
    // FIX: MOVED 'id="management"' to this outer wrapper.
    // The ref stays on the inner div for GSAP pinning.
    <div id="management" style={{ position: "relative", width: "100%" }}>
      <div
        ref={containerRef}
        className="relative w-full h-[100dvh] overflow-hidden selection:bg-[#491AB1] selection:text-[#D0BCFC]"
        style={{ backgroundColor: PALETTE.bg, color: PALETTE.text }}
      >
        <GlobalStyles />

        {/* Background Gradient */}
        <div
          className="absolute w-[600px] md:w-[800px] h-[600px] md:h-[800px] rounded-full pointer-events-none opacity-20 blur-[80px] md:blur-[120px] transition-transform duration-100 ease-out z-0"
          style={{
            background: `radial-gradient(circle, ${PALETTE.highlight} 0%, transparent 70%)`,
            left: "50%",
            top: "50%",
            transform: `translate(calc(-50% + ${
              mousePos.x * 30
            }px), calc(-50% + ${mousePos.y * 30}px))`,
          }}
        />

        <div className="relative z-10 w-full h-full max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col md:grid md:grid-cols-12 gap-4 md:items-center justify-center md:justify-normal pt-16 md:pt-0 pb-20 md:pb-0">
          {/* TEXT CONTENT */}
          <div
            className={`flex flex-col justify-center transition-all duration-700 ease-out z-20
              ${
                isIntro
                  ? "col-span-12 items-center text-center max-w-4xl mx-auto mb-8 md:mb-0"
                  : "col-span-12 md:col-span-6 items-start text-left md:pr-12"
              }`}
          >
            {!isIntro && (
              <div
                className="flex items-center gap-3 mb-4 md:mb-6 overflow-hidden"
                style={getSlideTransition(50)}
              >
                <span
                  className="px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full border whitespace-nowrap"
                  style={{
                    borderColor: PALETTE.highlight,
                    color: PALETTE.text,
                    backgroundColor: `${PALETTE.highlight}20`,
                  }}
                >
                  The EditSpaceVisuals Standard
                </span>
              </div>
            )}

            <div className="overflow-visible mb-4 md:mb-6 -ml-1">
              <h1
                className={`font-nunito font-extrabold leading-[1.0] md:leading-[1.1] tracking-tight transition-all duration-500
                  ${
                    isIntro
                      ? "text-3xl sm:text-5xl md:text-7xl"
                      : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                  }`}
                style={{
                  ...getSlideTransition(150),
                  textShadow: `0 20px 40px ${PALETTE.bg}`,
                }}
              >
                {currentSlide.title}
              </h1>
            </div>

            <div
              className={`overflow-hidden ${
                isIntro ? "max-w-2xl" : "max-w-lg"
              }`}
            >
              <p
                className={`text-sm md:text-lg font-normal leading-relaxed opacity-80 transition-all duration-500
                  ${isIntro ? "text-base md:text-xl opacity-90" : ""}`}
                style={getSlideTransition(250)}
              >
                {currentSlide.content}
              </p>
            </div>

            {isIntro && (
              <div
                className="mt-8 md:mt-12 flex flex-col items-center gap-2 opacity-50 animate-bounce"
                style={getSlideTransition(400)}
              >
                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em]">
                  Scroll to Explore
                </span>
                <div className="w-px h-8 md:h-12 bg-current" />
              </div>
            )}
          </div>

          {/* IMAGE CARD */}
          {!isIntro && (
            <div className="flex md:flex col-span-12 md:col-span-6 justify-center items-center h-auto md:h-full md:perspective-2000 mt-6 md:mt-0 mb-12 md:mb-0">
              <div
                className="relative w-[280px] sm:w-[350px] md:w-[400px] aspect-[4/5] md:transform-style-3d cursor-pointer group"
                style={getCardStyle()}
              >
                <div
                  className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border transition-colors duration-500"
                  style={{
                    backgroundColor: PALETTE.cardBg,
                    borderColor: `${PALETTE.highlight}40`,
                    boxShadow: `0 20px 50px -10px rgba(0,0,0,0.5), 0 0 0 1px ${PALETTE.highlight}20`,
                  }}
                >
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={currentSlide.image}
                      alt={currentSlide.title}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                      style={{ opacity: 0.85, mixBlendMode: "luminosity" }}
                    />
                    <div
                      className="absolute inset-0 mix-blend-overlay opacity-60"
                      style={{ backgroundColor: PALETTE.highlight }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1230] via-transparent to-transparent opacity-90" />
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
                    <div className="flex justify-between items-end transform translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500">
                      <div>
                        <p className="text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-60">
                          {currentSlide.number}
                        </p>
                        <p className="text-lg md:text-xl font-bold">
                          {currentSlide.category}
                        </p>
                      </div>
                      <div
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: PALETTE.highlight }}
                      >
                        <ArrowRight size={18} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* NAVIGATION DOTS */}
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-30">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                const currentIdx = activeIdxRef.current;
                if (idx !== currentIdx) {
                  performChange(idx, idx > currentIdx ? 1 : -1);
                }
              }}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                idx === activeIdx
                  ? "w-10 md:w-12"
                  : "w-2 opacity-30 hover:opacity-60"
              }`}
              style={{
                backgroundColor:
                  idx === activeIdx ? PALETTE.highlight : PALETTE.text,
              }}
              aria-label={`Go to slide ${idx}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagementStandard;
