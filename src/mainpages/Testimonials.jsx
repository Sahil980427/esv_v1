import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- STRICT COLORS ---
const THEME = {
  bg: '#1A1230',       // Dark Background
  cardBg: 'rgba(255, 255, 255, 0.02)', // Even more transparent
  divider: 'rgba(208, 188, 252, 0.2)', // Line color
  text: '#D0BCFC',     // Primary Text
  textDim: '#9F86C0',  // Secondary Text
  highlight: '#491AB1' // Accent Color
};

const TESTIMONIALS = [
  { id: 1, name: "Sumit Kumar", role: "Product Designer", quote: "Solid features wrapped in a very classy layout. Highly recommended for Wordpress websites.", img: "/testimonials/1.jpg"
    // "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" 
  },
  { id: 2, name: "Elena Richardson", role: "CTO", quote: "Clean, performant, and absolutely stunning. The dark mode implementation is flawless.", img: "/testimonials/2.jpg"
    // "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" 
  },
  { id: 3, name: "Sarah Jenkins", role: "Art Client", quote: "Never seen raw photos turn into magic so nicely. A true masterpiece of editing.", img: "/testimonials/3.jpg"
    //  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" 
    },
  { id: 4, name: "Prashant Nair", role: "Founder, StartUp", quote: "Exceeded every expectation. The attention to detail in the animations is simply unmatched.", img: "/testimonials/4.jpg"
    // "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" 
  },
  { id: 5, name: "Priya Patel", role: "Lead Dev", quote: "The teaching style is simple and straight to point. It completely transformed my skills.", img: "/testimonials/5.jpg"
    // "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
   }
];

export default function Testimonials() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  // --- 1. UNIVERSAL ANIMATION LOGIC (Mobile & Desktop) ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const cards = gsap.utils.toArray(".arch-card");
      const bgText = document.querySelector(".bg-text");

      // Calculate scroll amount dynamically
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

      // Horizontal Scroll Tween (Works on Mobile & Desktop)
      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true, // Recalculate on resize
        }
      });

      // Background Text Parallax
      gsap.to(bgText, {
        x: -200, // Moves slightly left
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${track.scrollWidth}`,
          scrub: 1.5, 
        }
      });

      // Card Entry Animation (Staggered fade up while scrolling horizontally)
      cards.forEach((card) => {
        gsap.fromTo(card, 
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween, 
              start: "left 105%", // Start slightly earlier on mobile
              end: "center 70%",
              scrub: true,
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // --- 2. MOUSE TILT (Disabled on touch devices via CSS pointer check) ---
  const handleMouseMove = (e) => {
    if (window.innerWidth <= 768) return; // Disable tilt on mobile for performance
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top; 
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4; 
    const rotateY = ((x - centerX) / centerX) * 4;

    gsap.to(card, {
      duration: 0.4,
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.02,
      boxShadow: `0px 20px 50px rgba(73, 26, 177, 0.2)`,
      ease: "power1.out",
      transformPerspective: 1000,
      transformOrigin: "center"
    });
  };

  const handleMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      duration: 0.4,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      boxShadow: "none",
      ease: "power1.out"
    });
  };

  return (
    // FIX: MOVED 'id="testimonials"' to this outer wrapper.
    // The ref stays on the inner div for GSAP pinning.
    <div id="testimonials" style={{ position: 'relative', width: '100%' }}>
      
      <div 
        ref={containerRef} 
        className="testimonials-container" 
        style={{ backgroundColor: THEME.bg }}
      >
        
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;800&display=swap');

          .bg-text, h1, h2, h3, h4, p, div, span {
            font-family: 'Nunito', sans-serif !important;
          }

          .testimonials-container {
            width: 100%;
            height: 100vh; /* Force height for pinning */
            overflow: hidden;
            position: relative;
          }

          .bg-text {
            position: absolute;
            top: 50%;
            left: 5vw;
            transform: translateY(-50%);
            font-weight: 800;
            font-size: 25vw;
            line-height: 0.8;
            color: ${THEME.text};
            opacity: 0.03;
            white-space: nowrap;
            pointer-events: none;
            z-index: 0;
          }

          /* --- LAYOUT --- */
          .h-track {
            display: flex;
            gap: 5vw;
            padding: 0 10vw; /* Padding left/right to center start */
            height: 100vh;
            align-items: center;
            width: fit-content;
            position: relative;
            z-index: 10;
          }

          .card-wrapper {
            flex-shrink: 0;
            perspective: 1500px; 
          }

          .title-block {
            width: 30vw;
            display: flex;
            align-items: center;
          }

          /* --- CARD --- */
          .arch-card {
            width: 45vh; 
            height: 60vh;
            background: ${THEME.cardBg};
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
            cursor: pointer; /* Change to pointer to indicate interactivity */
            transform-style: preserve-3d;
            transition: border-color 0.3s ease, background 0.3s ease;
          }

          .arch-card::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, transparent, ${THEME.highlight}, transparent);
            transform: scaleX(0);
            transition: transform 0.4s ease;
            transform-origin: center;
          }

          .arch-card:hover {
            border-color: rgba(208, 188, 252, 0.2);
            background: rgba(255, 255, 255, 0.04);
          }

          .arch-card:hover::after {
            transform: scaleX(1);
          }

          /* Header */
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 2rem;
            padding-bottom: 0;
          }

          .avatar {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(255,255,255,0.1);
            transition: transform 0.3s ease, border-color 0.3s ease;
          }

          .arch-card:hover .avatar {
            border-color: #fff;
            transform: scale(1.05);
          }

          .quote-icon {
            font-size: 4rem;
            color: ${THEME.highlight};
            opacity: 0.2;
            font-family: serif;
            line-height: 1;
            margin-top: -10px;
            transition: all 0.5s ease;
          }

          .arch-card:hover .quote-icon {
            opacity: 0.6;
            transform: rotate(15deg) scale(1.1);
            text-shadow: 0 0 20px ${THEME.highlight};
          }

          /* Body */
          .card-body {
            flex: 1;
            padding: 0 2rem;
            display: flex;
            align-items: center; 
          }

          .quote-text {
            font-size: 1.3rem;
            line-height: 1.5;
            font-weight: 300;
            color: ${THEME.text};
            background: linear-gradient(to right, ${THEME.text} 0%, #fff 50%, ${THEME.text} 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            transition: color 0.3s ease;
          }

          .arch-card:hover .quote-text {
            -webkit-text-fill-color: transparent;
            animation: shine 3s linear infinite;
          }
          
          @keyframes shine {
            to { background-position: -200% center; }
          }

          /* Footer */
          .card-footer {
            padding: 2rem;
            padding-top: 0;
            display: flex;
            flex-direction: column;
          }

          .author-name {
            font-size: 1.25rem;
            font-weight: 800;
            color: ${THEME.text};
            margin-bottom: 1rem; 
            letter-spacing: 0.5px;
            transition: transform 0.3s ease;
          }

          .divider-line {
            width: 100%;
            height: 1px;
            background: ${THEME.divider};
            margin-bottom: 1rem; 
            position: relative;
            overflow: hidden;
          }

          .divider-line::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${THEME.highlight};
            transform: translateX(-100%);
            transition: transform 0.5s ease;
          }

          .arch-card:hover .divider-line::before {
            transform: translateX(0);
          }

          .arch-card:hover .author-name {
            transform: translateX(5px);
            color: #fff;
          }

          .author-role {
            font-size: 0.9rem;
            color: ${THEME.textDim};
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .title-block:hover h1 {
             text-shadow: 0 0 30px rgba(208, 188, 252, 0.4);
             transform: scale(1.02);
             transition: all 0.4s ease;
          }

          /* --- RESPONSIVE ADJUSTMENTS --- */
          @media (max-width: 1024px) {
             /* On Mobile, Horizontal Scroll persists, but sizes change */
             
             .h-track {
               gap: 5vw;
               padding: 0 5vw; /* Less padding on sides */
             }

             .title-block {
               width: 80vw; /* Take up most of screen width */
               margin-right: 2rem;
             }

             .title-block h1 {
               font-size: 3rem !important; /* Smaller Title */
             }

             /* IMPORTANT: On mobile, base width on Viewport Width (vw) not Height (vh)
               This ensures cards aren't too skinny in portrait mode */
             .arch-card {
               width: 85vw; 
               height: 55vh; 
             }

             .card-header, .card-footer {
               padding: 1.5rem;
             }

             .card-body {
               padding: 0 1.5rem;
             }

             .quote-text {
               font-size: 1.15rem;
             }

             .bg-text {
               font-size: 40vw; /* Bigger relative background text */
               top: 50%;
             }
          }
        `}</style>

        <div className="bg-text">STORIES</div>

        <div ref={trackRef} className="h-track">
          
          {/* Title Block */}
          <div className="card-wrapper title-block">
             <div>
               <h1 style={{ fontSize: '5rem', color: THEME.text, lineHeight: 1, fontWeight: 800 }}>
                 CLIENT<br/>STORIES
               </h1>
               <p style={{ color: THEME.textDim, marginTop: '1.5rem', fontWeight: 400, fontSize: '1.2rem' }}>
                 Real feedback.<br/>Real interactions.
               </p>
             </div>
          </div>

          {/* New Architectural Cards */}
          {TESTIMONIALS.map((item) => (
            <div key={item.id} className="card-wrapper">
              <div 
                className="arch-card"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                
                {/* Header: Avatar Left, Quote Right */}
                <div className="card-header">
                  <img src={item.img} alt={item.name} className="avatar" />
                  <span className="quote-icon">“</span>
                </div>

                {/* Body: Quote Text */}
                <div className="card-body">
                  <p className="quote-text">{item.quote}</p>
                </div>

                {/* Footer: Name | Line | Role */}
                <div className="card-footer">
                  <div className="author-name">{item.name}</div>
                  <div className="divider-line"></div>
                  <div className="author-role">{item.role}</div>
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}