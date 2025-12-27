import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SLIDES = [
  // --- COVER SLIDE (Highlight) ---
  {
    id: 0,
    // High-end architectural white/grey abstract
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
    title: "Why ESV?",
    ethos: "Vision meets Reality",
    description: "Bridging the gap between abstract complexity and tangible impact.",
  },
  // --- CONTENT SLIDES ---
  {
    id: 1,
    // Clean minimal tech
    src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80",
    title: "Harmonizing",
    ethos: "Fragmentation creates noise; unity creates clarity.",
    description: "Navigating the digital world feels like a balancing act. We exist to calm the chaos and provide structural integrity to your ideas.",
  },
  {
    id: 2,
    // Emotional/Artistic
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=80",
    title: "Brand Soul",
    ethos: "Design is not just what it looks like; it is how it feels.",
    description: "Your brand is a story waiting to be told. Our creative team listens to the heart of your message and translates it into a visual language.",
  },
  {
    id: 3,
    // Structure/Building
    src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600&q=80",
    title: "Foundation",
    ethos: "Technology should be the wind at your back.",
    description: "Great ideas need a strong foundation. We build technology that supports your growth quietly, reliably, and efficiently.",
  },
  {
    id: 4,
    // Human connection
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80",
    title: "Partnership",
    ethos: "True success is best when it is shared.",
    description: "We are not just service providers; we are mentors. We replace the uncertainty of the freelance market with guaranteed excellence.",
  },
];

export default function Home4() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const imagesRef = useRef([]); // To animate images inside cards
  const textRef = useRef([]); // To animate text on cover

  useLayoutEffect(() => {
    // Inject Fonts: Playfair Display (Serif) & Manrope (Sans)
    const linkFont = document.createElement("link");
    linkFont.href =
      "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap";
    linkFont.rel = "stylesheet";
    document.head.appendChild(linkFont);

    let ctx = gsap.context(() => {
      const totalScroll = 350 * SLIDES.length;

      // 1. Initial Intro Animation for Cover Card
      // We animate the text up and the image zoom
      const tlIntro = gsap.timeline();
      
      tlIntro
        .fromTo(
            ".cover-img-anim", 
            { scale: 1.2, filter: "blur(10px)" }, 
            { scale: 1, filter: "blur(0px)", duration: 1.5, ease: "power2.out" }
        )
        .fromTo(
            ".cover-anim-text",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" },
            "-=1"
        );

      // 2. The Scroll Stack Animation
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

      // Set initial positions
      gsap.set(cardsRef.current, { y: window.innerHeight, zIndex: (i) => i });
      gsap.set(cardsRef.current[0], { y: 0 }); // Cover stays

      cardsRef.current.forEach((card, i) => {
        if (i === 0) return; // Skip cover

        const headerOffset = 80; // Larger offset for cleaner look
        const targetY = i * headerOffset;

        // Animate Card Up
        tl.to(card, {
          y: targetY,
          ease: "power2.out", // Smooth easing
          duration: 1,
        });
        
        // Parallax Effect for the image inside the card as it rises
        // We select the image ref corresponding to this card
        if(imagesRef.current[i]) {
            tl.fromTo(imagesRef.current[i], 
                { yPercent: -20, scale: 1.1 }, // Start slightly shifted up
                { yPercent: 0, scale: 1, duration: 1, ease: "power2.out" },
                "<" // Sync with card movement
            );
        }
      });
    }, containerRef);

    return () => {
      ctx.revert();
      try {
        document.head.removeChild(linkFont);
      } catch (e) {}
    };
  }, []);

  return (
    <div ref={containerRef} className="solitaire-container">
      <style>{`
        :root {
          /* PROFESSIONAL LIGHT THEME */
          --bg-body: #F5F5F7;
          --card-bg: #FFFFFF;
          --text-primary: #1D1D1F;
          --text-secondary: #6E6E73;
          --accent-gold: #C6A87C;
          
          --font-head: 'Playfair Display', serif;
          --font-body: 'Manrope', sans-serif;
        }

        .solitaire-container {
          background-color: var(--bg-body);
          width: 100%;
          height: 100vh; 
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: flex-start; 
          padding-top: 5vh; 
          color: var(--text-primary);
        }

        .card-stack {
          position: absolute;
          width: 90%; 
          max-width: 1100px; /* Wider for professional look */
          height: 85vh; 
          border-radius: 24px;
          overflow: hidden;
          background-color: var(--card-bg);
          box-shadow: 
            0 10px 40px -10px rgba(0,0,0,0.1),
            0 2px 10px -1px rgba(0,0,0,0.05);
          will-change: transform; 
          border: 1px solid rgba(255,255,255,0.8);
        }

        /* --- IMAGES --- */
        .card-img-container {
            position: absolute;
            top: 0; left: 0; 
            width: 100%; height: 100%;
            overflow: hidden;
        }

        .card-img-bg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 1;
          transition: transform 0.5s ease;
        }

        /* Gradient Overlays to make text readable on images */
        .overlay-cover {
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%);
        }
        
        /* Standard card layout: Split 50% image / 50% white content? 
           OR Image background with glass box. 
           Let's do Image Right, Content Left for a very "Agency" feel. */
        
        .card-layout {
            display: flex;
            height: 100%;
            width: 100%;
            background: white; /* Force white background for standard cards */
        }
        
        .card-content-side {
            flex: 1;
            padding: 4rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            z-index: 2;
        }
        
        .card-image-side {
            flex: 1.2; /* Image takes slightly more space */
            position: relative;
            overflow: hidden;
            height: 100%;
        }
        
        /* --- TYPOGRAPHY --- */
        .header-num {
            font-family: var(--font-body);
            font-size: 5rem;
            font-weight: 200;
            color: #E5E5EA;
            position: absolute;
            top: 2rem;
            left: 2rem;
        }

        .big-title {
          font-family: var(--font-head);
          font-size: 3.5rem;
          font-weight: 500;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }

        .ethos-txt {
          font-family: var(--font-head);
          font-size: 1.4rem;
          color: var(--accent-gold);
          margin-bottom: 2rem;
          font-style: italic;
          font-weight: 400;
        }

        .desc-txt {
          font-family: var(--font-body);
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-secondary);
          max-width: 450px;
        }

        /* --- COVER (HERO) SPECIFIC STYLES --- */
        .cover-layout {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            color: white; /* Cover text is white over image */
        }

        .cover-content {
            position: relative;
            z-index: 10;
            max-width: 800px;
            padding: 0 2rem;
        }

        .cover-tagline {
          font-family: var(--font-body);
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          margin-bottom: 2rem;
          opacity: 0.9;
          display: inline-block;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 8px 16px;
          border-radius: 50px;
          backdrop-filter: blur(5px);
        }

        .cover-title {
          font-family: var(--font-head);
          font-size: 6rem; /* Huge */
          font-weight: 400; /* Elegant thin */
          margin-bottom: 1rem;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        
        .cover-title span {
            display: block;
            font-style: italic;
            font-weight: 400;
            font-size: 0.9em;
            color: var(--accent-gold);
        }

        .cover-desc {
            font-family: var(--font-body);
            font-size: 1.2rem;
            opacity: 0.9;
            font-weight: 300;
            margin-top: 1.5rem;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }

        /* Scroll Pill */
        .scroll-pill {
            position: absolute;
            bottom: 3rem;
            width: 30px;
            height: 50px;
            border: 2px solid rgba(255,255,255,0.4);
            border-radius: 20px;
            display: flex;
            justify-content: center;
            padding-top: 8px;
        }
        .scroll-pill::before {
            content:'';
            width: 4px; height: 8px;
            background: white;
            border-radius: 2px;
            animation: scrolldrop 2s infinite;
        }

        @keyframes scrolldrop {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(15px); opacity: 0; }
        }

        @media (max-width: 900px) {
           .card-layout { flex-direction: column-reverse; }
           .card-image-side { flex: 0.5; height: 40%; }
           .card-content-side { flex: 1; padding: 2rem; padding-top: 1rem;}
           .cover-title { font-size: 3.5rem; }
           .big-title { font-size: 2.2rem; }
           .header-num { font-size: 3rem; top: 1rem; left: 1rem; }
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
              // Subtle rotation for stack effect on desktop only
              transform: `rotate(${index % 2 === 0 ? "0.5deg" : "-0.5deg"})`,
            }}
          >
            {isCover ? (
              /* --- 0th Card (Hero) UI --- */
              <div className="cover-layout">
                {/* Full Background Image */}
                <div className="card-img-container">
                    <div className="overlay-cover"></div>
                    <img 
                      ref={(el) => (imagesRef.current[index] = el)}
                      src={slide.src} 
                      alt="hero" 
                      className="card-img-bg cover-img-anim" 
                    />
                </div>
                
                {/* Animated Text Content */}
                <div className="cover-content">
                  <div className="cover-anim-text">
                    <span className="cover-tagline">Manifesto</span>
                  </div>
                  <h1 className="cover-title cover-anim-text">
                    Why <span>ESV?</span>
                  </h1>
                  <p className="cover-desc cover-anim-text">{slide.description}</p>
                </div>

                <div className="scroll-pill cover-anim-text"></div>
              </div>
            ) : (
              /* --- Standard Professional Card UI (Split Layout) --- */
              <div className="card-layout">
                <div className="card-content-side">
                   <span className="header-num">0{index}</span>
                   <h2 className="big-title">{slide.title}</h2>
                   <p className="ethos-txt">{slide.ethos}</p>
                   <p className="desc-txt">{slide.description}</p>
                </div>
                <div className="card-image-side">
                    {/* Parallax Image Container */}
                    <div className="card-img-container">
                        <img 
                          ref={(el) => (imagesRef.current[index] = el)}
                          src={slide.src} 
                          alt="visual" 
                          className="card-img-bg" 
                        />
                    </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}