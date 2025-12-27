import React, { useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './RoundCircleWords.css';

// Register plugins strictly to avoid errors
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const RoundCircleWords = () => {
  const navigate = useNavigate();
  
  // Refs for animation targets
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const imageContainerRef = useRef(null);
  const ringsRef = useRef(null);
  const indicatorRef = useRef(null);

  const textBase = "ESPECIALLY ENJOYING DESIGN & ILLUSTRATION • ";
  const fullText = textBase.repeat(4); 

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",      
          end: "+=200%",        // Scroll distance: 200% of viewport height
          pin: wrapperRef.current,
          scrub: 1,             // 1s delay for smoothness
          onLeave: (self) => {
             // --- FIX: STOP ANIMATION BEFORE UNMOUNTING ---
             self.kill(false, true); // Kill the ScrollTrigger instance immediately
             
             console.log("Scroll complete. Navigating to /horizontal3dcarousel");
             navigate('/horizontal3dcarousel'); 
          }
        }
      });

      // --- ANIMATIONS ---
      
      // 1. Expand Image to fill screen
      tl.to(imageContainerRef.current, {
        width: "100vw",
        height: "100vh",
        borderRadius: "0%",
        boxShadow: "none", 
        ease: "power2.inOut"
      }, 0);

      // 2. Portal Effect: Zoom text rings OUT and Fade
      tl.to(ringsRef.current, {
        scale: 5,           
        opacity: 0,
        filter: "blur(15px)",
        rotate: 90,        
        ease: "power2.in"
      }, 0);

      // 3. Fade out scroll indicator immediately
      tl.to(indicatorRef.current, {
        opacity: 0,
        duration: 0.1
      }, 0);

    }, containerRef); 

    return () => ctx.revert(); 
  }, [navigate]);

  return (
    <div className="rcw-container" ref={containerRef}>
      <div className="pin-wrapper" ref={wrapperRef}>
        
        {/* Rotating Rings */}
        <div className="rotating-rings-container" ref={ringsRef}>
          <svg viewBox="0 0 800 800" width="800" height="800">
             <defs>
                <path id="innerCirclePath" d="M 400, 400 m -230, 0 a 230,230 0 1,1 460,0 a 230,230 0 1,1 -460,0" fill="none"/>
                <path id="outerCirclePath" d="M 400, 400 m -310, 0 a 310,310 0 1,1 620,0 a 310,310 0 1,1 -620,0" fill="none"/>
             </defs>

             {/* Inner Ring - Fixed xlinkHref to href */}
             <g className="inner-ring-group">
                 <text className="ring-text inner-ring-text">
                    <textPath href="#innerCirclePath" startOffset="50%" textAnchor="middle">
                       {fullText}
                    </textPath>
                 </text>
             </g>

             {/* Outer Ring - Fixed xlinkHref to href */}
             <g className="outer-ring-group">
                <text className="ring-text outer-ring-text">
                   <textPath href="#outerCirclePath" startOffset="0%" textAnchor="middle">
                      {fullText}
                   </textPath>
                </text>
             </g>
          </svg>
        </div>

        {/* Center Image */}
        <div className="center-image-container" ref={imageContainerRef}>
           <div className="center-image"></div>
        </div>
        
        {/* Scroll Hint */}
        <div className="scroll-indicator" ref={indicatorRef}>
            Scroll to Expand
        </div>

      </div>
    </div>
  );
};

export default RoundCircleWords;