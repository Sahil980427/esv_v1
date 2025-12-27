import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- 1. Data Structure ---
const SLIDES = [
  {
    type: "cover", // Explicit type to switch layouts
    id: 0,
    color: "#0f0f0f",
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
    title: "Why ESV",
    subtitle: "The Foundation of Future",
    mission: "We don't just build software; we engineer digital clarity.",
    pillars: [
      { label: "Vision", text: "Seeing beyond the horizon." },
      { label: "Strategy", text: "Precision in every step." },
      { label: "Impact", text: "Results that matter." },
    ]
  },
  {
    type: "standard",
    id: 1,
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
    title: "Harmonizing",
    ethos: "Fragmentation creates noise; unity creates clarity.",
    description: "We understand that navigating the digital world often feels like a balancing act. We exist to calm that chaos.",
  },
  {
    type: "standard",
    id: 2,
    src: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=1600&q=80",
    title: "Soul of Brand",
    ethos: "Design is not just what it looks like; it is how it makes you feel.",
    description: "Your brand is a story waiting to be told. Our creative team listens to the heart of your message and translates it into a visual language.",
  },
  {
    type: "standard",
    id: 3,
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
    title: "Tech Support",
    ethos: "Technology should be the wind at your back, not a hurdle.",
    description: "Great ideas need a strong foundation. We build technology that supports your growth quietly and reliably.",
  },
  {
    type: "standard",
    id: 4,
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80",
    title: "Empowerment",
    ethos: "True success is best when it is shared.",
    description: "We believe that a partnership should leave you stronger than we found you. We are not just service providers; we are mentors.",
  },
  {
    type: "standard",
    id: 5,
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80",
    title: "Partnership",
    ethos: "Excellence is the peace of mind we deliver.",
    description: "At the end of the day, you need a partner you can rely on. We replace the uncertainty of the freelance market.",
  },
];

// --- 2. Sub-Components for Clean Architecture ---

const CoverLayout = ({ data }) => (
  <div className="cover-layout">
    {/* Specialized Header for the Title Slide */}
    <div className="cover-header">
      <div className="logo-badge">ESV</div>
      <h1 className="header-main-title">{data.title}</h1>
      <div className="logo-badge" style={{opacity:0}}>ESV</div>
    </div>

    {/* Specialized Body: Editorial / Magazine Style */}
    <div className="cover-content">
      <div className="cover-hero-text">
        <h2 className="cover-subtitle">{data.subtitle}</h2>
        <p className="cover-mission">"{data.mission}"</p>
      </div>
      
      <div className="cover-footer">
        {data.pillars.map((pillar, i) => (
          <div key={i} className="pillar-item">
            <span className="pillar-label">{pillar.label}</span>
            <span className="pillar-text">{pillar.text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const StandardLayout = ({ data, index }) => (
  <>
    {/* Standard "File Tab" Header */}
    <div className="standard-header">
      <span className="tab-title">{data.title}</span>
      <span className="tab-number">0{index}</span>
    </div>

    {/* Standard Body */}
    <div className="standard-content">
      <h2 className="big-title">{data.title}</h2>
      <p className="ethos-txt">"{data.ethos}"</p>
      <p className="desc-txt">{data.description}</p>
    </div>
  </>
);


// --- 3. Main Component ---

export default function Home3() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    // Fonts
    const linkFont = document.createElement("link");
    linkFont.href = "https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Manrope:wght@300;500;800&display=swap";
    linkFont.rel = "stylesheet";
    document.head.appendChild(linkFont);

    let ctx = gsap.context(() => {
      const totalScroll = window.innerHeight * 2; 

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${totalScroll}`,
          pin: true,
          scrub: 1,
        },
      });

      // Init: Place cards offscreen, except the first one (Title slide)
      gsap.set(cardsRef.current, { y: window.innerHeight, rotateX: 0 });
      gsap.set(cardsRef.current[0], { y: 0 });

      // Animation Loop
      cardsRef.current.forEach((card, i) => {
        if (i === 0) return; // Title slide stays put (or parallax slightly if desired)

        // Calculate offset so headers remain visible
        // We give the Title slide a bigger header space (e.g., 100px)
        const firstHeaderHeight = 110; 
        const standardHeaderHeight = 65; 
        
        // Logic: Card 1 stops below Title Header. Card 2 stops below Card 1 Header.
        const targetY = firstHeaderHeight + ((i - 1) * standardHeaderHeight);

        tl.to(card, {
          y: targetY,
          ease: "power3.out", // Smoother, more professional ease
          duration: 1,
          startAt: { scale: 0.9, filter: "brightness(0.5)" },
          scale: 1,
          filter: "brightness(1)"
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
      try { document.head.removeChild(linkFont); } catch (e) {}
    };
  }, []);

  return (
    <div ref={containerRef} className="solitaire-container">
      <style>{`
        :root {
          --bg-primary: #111;
          --accent: #E0E0E0;
          --gold: #D4AF37;
        }
        
        /* Fonts: Syncopate for futuristic headers, Manrope for clean text */
        .solitaire-container {
          background-color: var(--bg-primary);
          font-family: 'Manrope', sans-serif;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 2vh;
        }

        .card-stack {
          position: absolute;
          width: 90%;
          max-width: 1100px;
          height: 90vh;
          border-radius: 24px;
          overflow: hidden;
          background-color: #1a1a1a;
          box-shadow: 0 -10px 40px rgba(0,0,0,0.5);
          will-change: transform;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .card-img-bg {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          z-index: 1;
          opacity: 0.4;
        }

        /* --- COVER SLIDE STYLES (Slide 0) --- */
        .cover-layout {
          position: relative; z-index: 2;
          height: 100%; display: flex; flex-direction: column;
        }
        
        .cover-header {
          height: 110px; /* Taller header for the main slide */
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 3rem;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(10px);
        }

        .header-main-title {
          font-family: 'Syncopate', sans-serif;
          font-weight: 700;
          font-size: 2rem;
          color: white;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin: 0;
        }

        .logo-badge {
          font-size: 0.9rem; font-weight: 800;
          padding: 5px 10px; border: 1px solid white;
          border-radius: 50px;
        }

        .cover-content {
          flex: 1;
          padding: 4rem;
          display: flex; flex-direction: column; justify-content: space-between;
        }

        .cover-subtitle {
          font-size: 1rem; text-transform: uppercase; letter-spacing: 0.3em;
          color: var(--gold); margin-bottom: 1rem;
        }
        
        .cover-mission {
          font-size: 3rem; font-weight: 300; line-height: 1.2;
          color: #fff; max-width: 800px;
        }

        .cover-footer {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 2rem; border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 2rem;
        }
        
        .pillar-item { display: flex; flex-direction: column; }
        .pillar-label { font-size: 0.85rem; text-transform: uppercase; opacity: 0.6; margin-bottom: 0.5rem; }
        .pillar-text { font-size: 1.1rem; font-weight: 500; }

        /* --- STANDARD CARD STYLES (Slides 1-5) --- */
        .standard-header {
          position: relative; z-index: 2;
          height: 65px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2.5rem;
          background: rgba(0,0,0,0.8); /* Darker header for content cards */
          border-bottom: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(5px);
        }

        .tab-title {
          font-family: 'Syncopate', sans-serif;
          font-size: 1rem; font-weight: 700; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.9);
        }

        .tab-number { font-family: 'Syncopate', sans-serif; opacity: 0.3; }

        .standard-content {
          position: relative; z-index: 2;
          padding: 5rem;
          margin-top: 20px;
        }

        .big-title {
          font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem;
          color: white;
        }

        .ethos-txt { font-size: 1.25rem; color: #a0a0a0; margin-bottom: 1.5rem; font-style: italic; }
        .desc-txt { font-size: 1.1rem; line-height: 1.6; max-width: 600px; color: rgba(255,255,255,0.8); }

        @media (max-width: 768px) {
          .cover-mission { font-size: 1.8rem; }
          .header-main-title { font-size: 1.2rem; }
          .cover-footer { grid-template-columns: 1fr; gap: 1rem; }
          .big-title { font-size: 2rem; }
          .cover-content, .standard-content { padding: 2rem; }
        }
      `}</style>

      {SLIDES.map((slide, index) => {
        // --- DIFFERENT CODING APPROACH: Component Switching ---
        const isCover = slide.type === "cover";

        return (
          <div
            key={slide.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="card-stack"
            style={{
              zIndex: index,
            }}
          >
            <img src={slide.src} alt="bg" className="card-img-bg" />
            
            {isCover ? (
                <CoverLayout data={slide} />
            ) : (
                <StandardLayout data={slide} index={index} />
            )}
          </div>
        );
      })}
    </div>
  );
}