import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the plugin
gsap.registerPlugin(ScrollTrigger);

// --- DATA ---
const COMPETENCIES = [
  // --- ZERO SLIDE: KINETIC SPOTLIGHT ---
  {
    id: 0,
    title: "OUR\nSERVICES",
    category: "",
    index: "00",
    description: "Innovation distinguishes between a leader and a follower.",
    src: "",
    isHero: true,
  },
  // --- EXISTING SLIDES ---
  {
    id: 1,
    title: "Custom Web Architecture",
    category: "React.js / Frameworks",
    index: "01",
    description:
      "We move beyond templates to build high-performance, reactive websites. Specializing in React.js and modern frameworks, we create digital experiences that are fast, interactive, and perfectly responsive.",
      src: "/allservices/1.jpg",
    // src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Cinematic Post-Production",
    category: "Video / Motion",
    index: "02",
    description:
      "Transforming raw footage into compelling narratives. Our post-production suite handles professional video editing, color grading, and motion graphics designed to increase engagement.",
      src: "/allservices/2.jpg",
    // src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0ivtfgh3xGjgH6u8ryqc-DuphK3aGd-2LRw&s",
  },
  {
    id: 3,
    title: "Enterprise WordPress",
    category: "CMS / Scalability",
    index: "03",
    description:
      "Scalable content management systems tailored to your workflow. We provide custom theme development, plugin integration, and site optimization, ensuring your site is secure and easy to manage.",
      src: "/allservices/3.jpg",
    // src: "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Strategic Digital Marketing",
    category: "Growth / SEO",
    index: "04",
    description:
      "Growth driven by data. We implement targeted marketing strategies and Search Engine Optimization (SEO) to increase your digital footprint, drive qualified traffic, and maximize ROI.",
      src: "/allservices/4.jpg",
    // src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Brand Identity & Design",
    category: "Visual Language",
    index: "05",
    description:
      "Defining your visual language. From logo systems to marketing collateral and photo retouching, we ensure every pixel aligns with your corporate identity and communicates authority.",
      src: "/allservices/5.webp",
    // src: "https://indianmediastudies.com/wp-content/uploads/2017/04/Brand-Identity-vs-Brand-Image.jpg.webp",
  },
  {
    id: 6,
    title: "AI Integration & Automation",
    category: "Future Tech",
    index: "06",
    description:
      "Future-proofing your operations. We develop custom chatbots and integrate Artificial Intelligence tools to automate customer interactions and streamline internal workflows.",
      src: "/allservices/6.jpg",
    // src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "Database Infrastructure",
    category: "Backend / Security",
    index: "07",
    description:
      "Secure and efficient data handling. We structure and manage backend databases to ensure your applications run smoothly and your data remains accessible and protected.",
      src: "/allservices/7.webp",
    // src: "https://blog.paessler.com/hubfs/Blogheader_PPEM-goes-Datacenter.jpg",
  },
  {
    id: 8,
    title: "Financial Market Education",
    category: "Trading / Analysis",
    index: "08",
    description:
      "Empowering financial literacy. We provide expert-led trading education and technical analysis training, equipping individuals with the knowledge to navigate complex markets.",
      src: "/allservices/8.jpg",
    // src: "https://assets.peoplematters.in/images/7f208afe-50a0-41a5-bb04-51caeddaad70.jpg",
  },
  {
    id: 9,
    title: "EdTech Platform Management",
    category: "LMS / Development",
    index: "09",
    description:
      "Bridging the gap between knowledge and audience. We build and manage Learning Management Systems (LMS) for educators and coaches, handling the technical side of course delivery.",
      src: "/allservices/9.jpg",
    // src: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1000&auto=format&fit=crop",
  },
];

export default function AllServices() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const heroRef = useRef(null);

  // --- Animation Logic (Replaced Script Loading with Direct Import) ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current;

      // 1. Initial Setup
      cards.forEach((card, i) => {
        if (!card) return;
        const imgBlock = card.querySelector(".visual-block");
        const textBlock = card.querySelector(".info-block");

        if (i === 0) {
          gsap.set(card, { opacity: 1 });
          // Hero Intro Animation
          const words = card.querySelectorAll(".hero-word");
          const quote = card.querySelector(".hero-quote");
          const hint = card.querySelector(".scroll-hint");

          gsap.from(words, {
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power4.out",
            delay: 0.2,
          });
          gsap.from([quote, hint], {
            opacity: 0,
            y: 20,
            duration: 1,
            delay: 1,
            stagger: 0.2,
            ease: "power2.out",
          });
        } else {
          const isEven = i % 2 === 0;
          gsap.set(imgBlock, { x: isEven ? -100 : 100, opacity: 0 });
          gsap.set(textBlock, { x: isEven ? 100 : -100, opacity: 0 });
        }
      });

      // 2. Master Timeline for Scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${window.innerHeight * (cards.length + 1)}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // 3. Sequence loop
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;

        // Target Logic
        const isHero = i === 0;

        let currentTargets;
        if (isHero) {
          currentTargets = [
            card.querySelectorAll(".hero-layer"),
            card.querySelector(".hero-quote"),
            card.querySelector(".scroll-hint"),
          ];
        } else {
          currentTargets = [
            card.querySelector(".visual-block"),
            card.querySelector(".info-block"),
          ];
        }

        const nextCard = cards[i + 1];

        if (nextCard) {
          const nextImg = nextCard.querySelector(".visual-block");
          const nextText = nextCard.querySelector(".info-block");

          // Exit Current
          tl.to(currentTargets, {
            y: -150,
            opacity: 0,
            filter: "blur(10px)",
            duration: 1,
            ease: "power2.in",
            stagger: 0.05,
          })

            // Enter Next
            .to(
              [nextImg, nextText],
              {
                x: 0,
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 1,
                ease: "power2.out",
              },
              "<0.2"
            );
        }
      });
    }, containerRef);

    // --- MOUSE SPOTLIGHT LOGIC ---
    const handleMouseMove = (e) => {
      const hero = heroRef.current;
      if (!hero) return;

      requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        hero.style.setProperty("--x", `${x}px`);
        hero.style.setProperty("--y", `${y}px`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    // FIX: MOVED 'id="services"' to this outer wrapper.
    // The ref stays on the inner div for GSAP pinning.
    <div id="services" style={{ position: "relative", width: "100%" }}>
      <div ref={containerRef} className="fly-container">
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Italiana&display=swap');

        /* --- STRICT COLOR SYSTEM --- */
        :root {
          /* Default to Dark Mode (as per agency vibe) */
          --c-bg: #1A1230;         /* Secondary Dark */
          --c-card: #24204A;       /* Primary Dark */
          --c-text: #D0BCFC;       /* Soft Lilac Text */
          --c-accent: #D0BCFC;     /* Highlights */
          --c-stroke: rgba(208, 188, 252, 0.2); /* Subtle borders */
          --img-filter: grayscale(100%) sepia(20%) hue-rotate(220deg) contrast(1.1);
        }

        /* Automate Light Mode via System Prefs */
        @media (prefers-color-scheme: light) {
          :root {
            --c-bg: #D0BCFC;       /* Background Light */
            --c-card: rgba(255, 255, 255, 0.4); /* Glassy Card */
            --c-text: #491AB1;     /* Dark Purple Text */
            --c-accent: #491AB1;   /* Highlights */
            --c-stroke: rgba(73, 26, 177, 0.15);
            --img-filter: grayscale(100%) sepia(100%) hue-rotate(240deg) saturate(3); /* Tint images to #491AB1 */
          }
        }

        .fly-container {
          width: 100%;
          height: 100vh;
          background: var(--c-bg);
          color: var(--c-text);
          font-family: 'Manrope', sans-serif;
          overflow: hidden;
          position: relative;
          transition: background 0.5s ease, color 0.5s ease;
        }

        .project-card {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 5vw;
          box-sizing: border-box;
          z-index: 2;
          pointer-events: none; 
        }

        .card-inner {
          display: flex;
          width: 100%;
          max-width: 1300px;
          height: 65vh;
          gap: 5rem;
          align-items: center;
          pointer-events: auto;
        }

        .project-card.even .card-inner { flex-direction: row; }
        .project-card.odd .card-inner { flex-direction: row-reverse; }

        /* --- VISUAL BLOCK --- */
        .visual-block {
          flex: 1.4;
          height: 100%;
          position: relative;
          border-radius: 0px; 
          overflow: hidden;
          background: var(--c-card); 
          border: 1px solid var(--c-stroke);
        }

        /* Image Styling to strictly match palette */
        .proj-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
          opacity: 0.8;
          filter: var(--img-filter);
          mix-blend-mode: luminosity; /* Merges image with card bg color */
        }
        .visual-block:hover .proj-img { transform: scale(1.05); opacity: 0.5; }

        /* --- INFO BLOCK --- */
        .info-block {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          z-index: 10;
        }

        .index-number {
          font-size: 1rem;
          font-weight: 300;
          color: var(--c-text);
          border-bottom: 1px solid var(--c-stroke);
          padding-bottom: 1rem;
          margin-bottom: 2rem;
          display: inline-block;
          width: 100%;
          opacity: 0.6;
        }

        .category-pill {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--c-text);
          margin-bottom: 1rem;
          opacity: 0.8;
        }

        .title {
          font-family: 'Italiana', serif;
          font-size: 3.5rem;
          font-weight: 400;
          color: var(--c-text);
          margin: 0 0 1.5rem 0;
          line-height: 1.1;
        }

        .desc {
          font-size: 1rem;
          font-weight: 300;
          line-height: 1.8;
          color: var(--c-text);
          opacity: 0.8;
        }

        /* =========================================
           HERO SLIDE: KINETIC SPOTLIGHT REVEAL
           ========================================= */
        
        .hero-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            --x: 50%;
            --y: 50%;
            pointer-events: auto; 
        }

        .hero-text-wrapper {
            position: relative;
            font-size: 11vw;
            font-weight: 800;
            line-height: 0.9;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: -0.04em;
            user-select: none;
        }

        /* LAYER 1: The "Ghost" Outline */
        .hero-layer.outline {
            color: transparent;
            -webkit-text-stroke: 1px var(--c-stroke); 
            position: relative;
            z-index: 1;
            opacity: 0.5;
        }

        /* LAYER 2: The "Solid" Reveal */
        .hero-layer.solid {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            
            /* The Magic Mask */
            clip-path: circle(250px at var(--x) var(--y));
            -webkit-clip-path: circle(250px at var(--x) var(--y));
            transition: clip-path 0.1s ease-out;
            
            /* Solid Color Fill */
            color: var(--c-text);
            filter: drop-shadow(0 0 15px var(--c-card));
        }

        .hero-quote {
            margin-top: 4rem;
            font-family: 'Italiana', serif;
            font-size: 1.5rem;
            color: var(--c-text);
            max-width: 600px;
            text-align: center;
            font-style: italic;
            opacity: 0.7;
        }

        .scroll-hint {
            position: absolute;
            bottom: 3rem;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            opacity: 0.5;
            color: var(--c-text);
        }

        /* --- RESPONSIVE --- */
        @media (max-width: 1024px) {
           .project-card { padding: 0 2rem; }
           .card-inner { flex-direction: column !important; justify-content: center; gap: 2rem; }
           .visual-block { width: 100%; height: 40vh; order: 1; }
           .info-block { width: 100%; order: 2; text-align: left; }
           .hero-text-wrapper { font-size: 15vw; }
           .hero-layer.solid { clip-path: circle(150px at var(--x) var(--y)); } 
        }

        @media (max-width: 600px) {
           .card-inner { gap: 1.5rem; }
           .hero-text-wrapper { font-size: 18vw; }
           .hero-quote { font-size: 1rem; padding: 0 1rem; }
        }
      `}</style>

        {COMPETENCIES.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className={`project-card ${
              item.isHero ? "hero-card" : index % 2 === 0 ? "even" : "odd"
            }`}
          >
            {item.isHero ? (
              /* --- HERO LAYOUT (KINETIC SPOTLIGHT) --- */
              <div className="hero-container" ref={heroRef}>
                <div className="hero-text-wrapper">
                  {/* 1. Outline Layer */}
                  <div className="hero-layer outline">
                    {item.title.split("\n").map((line, i) => (
                      <div key={i} className="hero-word">
                        {line}
                      </div>
                    ))}
                  </div>

                  {/* 2. Solid/Spotlight Layer */}
                  <div className="hero-layer solid">
                    {item.title.split("\n").map((line, i) => (
                      <div key={i} className="hero-word">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="hero-quote">{item.description}</p>
                <div className="scroll-hint">
                  Hover to reveal • Scroll to explore
                </div>
              </div>
            ) : (
              /* --- STANDARD LAYOUT --- */
              <div className="card-inner">
                <div className="visual-block">
                  {item.src && (
                    <img
                      src={item.src}
                      alt={item.title}
                      className="proj-img"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="info-block">
                  <div className="index-number">{item.index}</div>
                  <div className="category-pill">{item.category}</div>
                  <h2 className="title">{item.title}</h2>
                  <p className="desc">{item.description}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}