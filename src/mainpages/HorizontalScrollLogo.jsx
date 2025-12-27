import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TechLogos } from "../data/TechLogos";

gsap.registerPlugin(ScrollTrigger);

const HorizontalScrollLogo = () => {
  const containerRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const row3Ref = useRef(null);

  const tweensRef = useRef([]);

  // Split Data
  const chunkSize = Math.ceil(TechLogos.length / 3);
  const row1Data = TechLogos.slice(0, chunkSize);
  const row2Data = TechLogos.slice(chunkSize, chunkSize * 2);
  const row3Data = TechLogos.slice(chunkSize * 2);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const baseDuration = 40;
      tweensRef.current = [];

      const createMarquee = (element, speedDivider) => {
        if (!element) return;
        const tween = gsap.fromTo(
          element,
          { xPercent: -50 },
          {
            xPercent: 0,
            duration: baseDuration / speedDivider,
            ease: "none",
            repeat: -1,
          }
        );
        tweensRef.current.push(tween);
        return tween;
      };

      createMarquee(row1Ref.current, 3);
      createMarquee(row2Ref.current, 1);
      createMarquee(row3Ref.current, 2);

      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const scrollDirection = self.direction;
          const velocity = Math.abs(self.getVelocity());
          const velocityBoost = Math.min(velocity / 500, 3);
          const targetTimeScale = scrollDirection * (1 + velocityBoost);

          gsap.to(tweensRef.current, {
            timeScale: targetTimeScale,
            duration: 0.8,
            overwrite: true,
          });
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const renderRow = (data, ref) => (
    <div className="hsl-row" ref={ref}>
      {data.map((item, index) => (
        <div key={`orig-${index}`} className="logo-item">
          <div 
            className="logo-icon" 
            style={{ '--logo-url': `url(${item.url})` }} 
          />
          <span className="logo-text">{item.name}</span>
        </div>
      ))}
      {data.map((item, index) => (
        <div key={`dup-${index}`} className="logo-item">
          <div 
            className="logo-icon" 
            style={{ '--logo-url': `url(${item.url})` }} 
          />
          <span className="logo-text">{item.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;800&display=swap');

            :root {
                /* --- LIGHT MODE STRICT --- */
                --hsl-bg-color: #D0BCFC;
                --hsl-text: #491AB1;
                --hsl-border: rgba(73, 26, 177, 0.2);     
                --hsl-shadow-color: rgba(73, 26, 177, 0.1);
                
                --hsl-bg-gradient: linear-gradient(180deg, #D0BCFC 0%, #DED1FC 50%, #D0BCFC 100%);
            }

            @media (prefers-color-scheme: dark) {
                :root {
                    /* --- DARK MODE STRICT --- */
                    --hsl-text: #D0BCFC;   
                    --hsl-border: rgba(208, 188, 252, 0.2); 
                    --hsl-shadow-color: rgba(0, 0, 0, 0.5); 
                    
                    /* Dark Gradient: 10% Soft Black Center */
                    --hsl-bg-gradient: linear-gradient(to bottom, 
                        #24204A 0%, 
                        #1A1230 45%, 
                        #000000 50%, 
                        #1A1230 55%, 
                        #24204A 100%
                    );
                }
            }

            .hsl-container { 
                width: 100%; 
                /* Reduced padding from 100px to 50px */
                padding: 50px 0; 
                background: var(--hsl-bg-gradient); 
                overflow: hidden; 
                display: flex; 
                flex-direction: column; 
                /* Reduced gap from 50px to 30px */
                gap: 30px; 
                position: relative;
                perspective: 2000px;
            }

            .hsl-row { 
                display: flex; 
                width: fit-content; 
                gap: 80px; 
                transform-style: preserve-3d;
                will-change: transform; 
            }

            .logo-item { 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                gap: 14px;
                cursor: pointer; 
                opacity: 1; 
                padding: 14px 20px; 
                border-radius: 12px;
                border: 1px solid transparent;
                transform-style: preserve-3d;
                transform: translateZ(0);
                transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                background-color: transparent;
            }

            .logo-item:hover { 
                transform: translateY(-5px) scale(1.05);
                background-color: color-mix(in srgb, var(--hsl-text) 10%, transparent);
                backdrop-filter: blur(5px); 
                border-color: var(--hsl-border);
                box-shadow: 0 10px 25px -5px var(--hsl-shadow-color);
            }

            .logo-icon { 
                width: 36px; 
                height: 36px; 
                background-color: var(--hsl-text); 
                
                -webkit-mask-image: var(--logo-url);
                mask-image: var(--logo-url);
                
                -webkit-mask-size: contain;
                mask-size: contain;
                -webkit-mask-repeat: no-repeat;
                mask-repeat: no-repeat;
                -webkit-mask-position: center;
                mask-position: center;
                
                transform: translateZ(1px);
                margin: 0; 
                display: block;
                transition: background-color 0.3s ease;
            }

            .logo-text { 
                font-family: 'Manrope', sans-serif; 
                font-size: 1.25rem; 
                font-weight: 800;   
                color: var(--hsl-text); 
                white-space: nowrap; 
                letter-spacing: -0.01em;
                margin: 0; 
                transform: translateZ(1px);
                transition: color 0.3s ease;
            }

            @media (max-width: 768px) { 
                /* Further reduced for mobile */
                .hsl-container { gap: 20px; padding: 30px 0; } 
                .hsl-row { gap: 40px; } 
                .logo-text { font-size: 1.1rem; } 
                .logo-icon { width: 28px; height: 28px; } 
                .logo-item { padding: 10px 16px; }
            }
        `}</style>

      <section className="hsl-container" ref={containerRef}>
        {renderRow(row1Data, row1Ref)}
        {/* {renderRow(row2Data, row2Ref)} */}
        {renderRow(row3Data, row2Ref)}
        {renderRow(row3Data, row3Ref)}
      </section>
    </>
  );
};

export default HorizontalScrollLogo;