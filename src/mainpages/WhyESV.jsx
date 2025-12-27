import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SLIDES = [
  // --- COVER SLIDE ---
  {
    id: 0,
    color: "#000000",
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80",
    title: "Why ESV?",
    ethos: "The Intersection of Vision & Reality",
    description:
      "We bridge the gap between abstract complexity and tangible impact.",
  },
  // --- CONTENT SLIDES ---
  {
    id: 1,
    color: "#24204A",
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
    title: "Harmonizing",
    ethos: "Fragmentation creates noise; unity creates clarity.",
    description:
      "We understand that navigating the digital world often feels like a balancing act. We exist to calm that chaos.",
  },
  {
    id: 2,
    color: "#3a1c4a",
    src: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=1600&q=80",
    title: "Soul of Brand",
    ethos: "Design is not just what it looks like; it is how it makes you feel.",
    description:
      "Your brand is a story waiting to be told. Our creative team listens to the heart of your message and translates it into a visual language.",
  },
  {
    id: 3,
    color: "#1c2b4a",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
    title: "Tech Support",
    ethos: "Technology should be the wind at your back, not a hurdle.",
    description:
      "Great ideas need a strong foundation. We build technology that supports your growth quietly and reliably.",
  },
  {
    id: 4,
    color: "#4a3b1c",
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80",
    title: "Empowerment",
    ethos: "True success is best when it is shared.",
    description:
      "We believe that a partnership should leave you stronger than we found you. We are not just service providers; we are mentors.",
  },
  {
    id: 5,
    color: "#4a1c1c",
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80",
    title: "Partnership",
    ethos: "Excellence is the peace of mind we deliver.",
    description:
      "At the end of the day, you need a partner you can rely on. We replace the uncertainty of the freelance market.",
  },
];

export default function WhyESV() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    // Inject Font
    const linkFont = document.createElement("link");
    linkFont.href =
      "https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,800;1,300&display=swap";
    linkFont.rel = "stylesheet";
    document.head.appendChild(linkFont);

    let ctx = gsap.context(() => {
      const totalScroll = window.innerHeight * 3;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Initial Setup:
      gsap.set(cardsRef.current, {
        y: () => window.innerHeight * 1.5,
        rotateX: 0,
      });
      gsap.set(cardsRef.current[0], { y: 0 });

      // 2. The Animation Loop
      cardsRef.current.forEach((card, i) => {
        if (i === 0) return; // Skip cover card

        // --- MATH TO FIX LAST CARD VISIBILITY ---
        const paddingTop = window.innerHeight * 0.04; // Matches the 4vh top padding
        const cardHeight = window.innerHeight * 0.7;  // Matches the 70vh card height
        
        // Calculate how much space is left at the bottom of the screen
        const availableSpaceAtBottom = window.innerHeight - (paddingTop + cardHeight) - 20;
        
        // Divide that space by the number of cards that need to stack (Total - 1)
        const maxAllowedOffset = availableSpaceAtBottom / (SLIDES.length - 1);

        // We want 60px normally, but if the screen is too small, we shrink the gap
        const headerOffset = Math.min(60, maxAllowedOffset);

        const targetY = i * headerOffset;

        tl.to(card, {
          y: targetY,
          ease: "power2.out",
          duration: 1,
          startAt: { scale: 0.9, brightness: 1.2 },
          scale: 1,
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
      try {
        if (document.head.contains(linkFont))
          document.head.removeChild(linkFont);
      } catch (e) {}
    };
  }, []);

  return (
    // FIX: MOVED 'id="whyesv"' to this outer wrapper.
    // The ref stays on the inner div for GSAP pinning.
    <div id="whyesv" style={{ position: 'relative', width: '100%' }}>
      
      <div 
        ref={containerRef} 
        className="solitaire-container"
      >
        <style>{`
          :root {
            --bg-primary: #24204A;
            --font-main: 'Nunito', sans-serif;
            --accent-gold: #FFD700;
          }

          * { box-sizing: border-box; }

          .solitaire-container {
            background-color: var(--bg-primary);
            font-family: var(--font-main);
            width: 100%;
            height: 100vh; 
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            /* REVERTED: Keeps first card at the top "good position" */
            align-items: flex-start; 
            padding-top: 4vh; 
            color: white;
          }

          .card-stack {
            position: absolute;
            width: 95%; 
            max-width: 1400px;
            /* REVERTED: Kept at 70vh as you liked the size */
            height: 70vh; 
            border-radius: 20px;
            overflow: hidden;
            background-color: #2a2a2a; 
            border: 1px solid rgba(255,255,255,0.15);
            box-shadow: 
              0 -5px 10px rgba(0,0,0,0.3),
              0 20px 50px rgba(0,0,0,0.5);
            will-change: transform; 
          }

          @media (max-width: 768px) {
            .card-stack { 
              height: 65vh; 
              width: 92%;
            }
          }

          .card-img-bg {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
            top: 0; left: 0;
            z-index: 1;
          }
          
          .tint-standard { filter: brightness(0.5); }
          .tint-cover { filter: brightness(0.4) grayscale(0.2); }

          /* --- STANDARD CARD STYLES --- */
          .card-header-vis {
            position: absolute;
            top: 0; left: 0; width: 100%;
            height: 60px; 
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 1.5rem;
            z-index: 10;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }

          @media (max-width: 768px) {
            .card-header-vis { height: 40px; padding: 0 1rem; }
          }

          .header-title {
            font-weight: 800;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: rgba(255,255,255,0.9);
          }

          .header-num {
            font-weight: 800;
            font-size: 1.2rem;
            opacity: 0.4;
          }

          .card-body {
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: clamp(1.5rem, 5vw, 5rem);
            padding-top: 60px; 
            overflow-y: auto; 
            scrollbar-width: none; 
          }
          .card-body::-webkit-scrollbar { display: none; } 

          .big-title {
            font-size: clamp(2.5rem, 6vw, 4.5rem);
            font-weight: 800;
            margin-bottom: 0.5rem;
            line-height: 1.1;
          }

          .ethos-txt {
            font-size: clamp(1.1rem, 2vw, 1.4rem);
            color: #D0BCFC;
            margin-bottom: 1rem;
            font-style: italic;
          }

          .desc-txt {
            font-size: clamp(1rem, 1.5vw, 1.15rem);
            line-height: 1.6;
            max-width: 650px;
            color: rgba(255,255,255,0.85);
          }

          /* --- COVER (TITLE) SLIDE STYLES --- */
          .cover-body {
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 2rem;
          }

          .cover-title {
            font-size: clamp(3.5rem, 10vw, 7rem);
            font-weight: 900;
            text-transform: uppercase;
            line-height: 0.9;
            margin-bottom: 1rem;
            letter-spacing: -0.02em;
            background: linear-gradient(to right, #fff, #a5a5a5);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .cover-tagline {
            font-size: clamp(1rem, 2vw, 1.5rem);
            font-weight: 300;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #FFD700;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid rgba(255,215,0,0.5);
            padding-bottom: 10px;
          }

          .cover-desc {
              font-size: clamp(1rem, 1.5vw, 1.3rem);
              max-width: 600px;
              color: rgba(255,255,255,0.9);
          }

          .scroll-hint {
            position: absolute;
            bottom: 2rem;
            font-size: 0.8rem;
            opacity: 0.6;
            letter-spacing: 0.1em;
            animation: bounce 2s infinite;
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
            40% {transform: translateY(-10px);}
            60% {transform: translateY(-5px);}
          }
        `}</style>

        {SLIDES.map((slide, index) => {
          const isCover = index === 0;

          return (
            <div
              key={slide.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="card-stack"
              style={{
                zIndex: index,
                transform: `rotate(${index % 2 === 0 ? "1deg" : "-1deg"})`,
              }}
            >
              <img
                src={slide.src}
                alt="bg"
                className={`card-img-bg ${
                  isCover ? "tint-cover" : "tint-standard"
                }`}
              />

              {isCover ? (
                <div className="cover-body">
                  <p className="cover-tagline"></p>
                  <h1 className="cover-title">{slide.title}</h1>
                  <p className="cover-desc">{slide.ethos}</p>
                  <div className="scroll-hint">SCROLL TO DISCOVER</div>
                </div>
              ) : (
                <>
                  <div className="card-header-vis">
                    <span className="header-title">{slide.title}</span>
                    <span className="header-num">0{index}</span>
                  </div>

                  <div className="card-body">
                    <h2 className="big-title">{slide.title}</h2>
                    <p className="ethos-txt">"{slide.ethos}"</p>
                    <p className="desc-txt">{slide.description}</p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}