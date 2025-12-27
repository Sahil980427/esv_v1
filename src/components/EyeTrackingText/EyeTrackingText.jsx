import React, { useState, useEffect, useRef } from 'react';

export default function EyeTrackingText() {
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isHovered || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2) * 15;
      const y = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2) * 15;
      
      setPupilPos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  const Eye = () => (
    <div 
      className={`eye-container ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="eye-wrapper">
        <div className="eye-ball">
          <div 
            className="pupil" 
            style={{ 
              transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)` 
            }}
          >
            <div className="pupil-glint"></div>
          </div>
        </div>
        <div className="eyelid eyelid-top">
          <div className="lash-line"></div>
        </div>
        <div className="eyelid eyelid-bottom">
          <div className="lash-line"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="project-container" ref={containerRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;700&display=swap');

        /* Color Palette & Theme Definitions */
        :root {
          /* Light Mode Default */
          --bg-color: #D0BCFC;
          --text-color: #491AB1;
          
          /* Eye Specifics - Light Mode */
          --eye-socket: #491AB1;
          --eye-ball: #D0BCFC;
          --pupil: #491AB1;
          --glint: #D0BCFC;
          --lash: #491AB1;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            /* Dark Mode Overrides */
            --bg-color: #24204A; /* Primary */
            --text-color: #D0BCFC; /* Soft Text */
            
            /* Eye Specifics - Dark Mode */
            --eye-socket: #1A1230; /* Secondary */
            --eye-ball: #D0BCFC;
            --pupil: #24204A;
            --glint: #D0BCFC;
            --lash: #1A1230;
          }
        }

        .project-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100%;
          background-color: var(--bg-color);
          color: var(--text-color);
          font-family: 'Nunito', sans-serif;
          overflow: hidden;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .title-wrapper {
          display: flex;
          align-items: center;
          font-size: 15vw;
          line-height: 1;
          letter-spacing: -0.04em;
          font-weight: 700; /* Nunito looks better bolder in display */
        }

        .eye-container {
          width: 8.5vw;
          height: 11.5vw;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 0.6vw;
          cursor: pointer;
          perspective: 1000px;
        }

        .eye-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
          border-radius: 50%;
          background: var(--eye-socket);
          overflow: hidden;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.1); /* Subtle depth */
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease;
        }
        
        .eye-container.hovered .eye-wrapper {
          transform: scaleX(0.95) scaleY(0.9);
        }

        .eye-ball {
          position: absolute;
          top: 4%; left: 4%; right: 4%; bottom: 4%;
          border-radius: 50%;
          background: var(--eye-ball);
          overflow: hidden;
          transition: background-color 0.3s ease;
        }

        .pupil {
          width: 45%;
          height: 45%;
          background-color: var(--pupil);
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -22.5%;
          margin-left: -22.5%;
          transition: transform 0.1s ease-out, background-color 0.3s ease;
        }

        .pupil-glint {
          position: absolute;
          top: 20%;
          left: 20%;
          width: 25%;
          height: 25%;
          background: var(--glint);
          border-radius: 50%;
          opacity: 0.6;
        }

        /* Eyelids must match background to create 'blink' effect */
        .eyelid {
          position: absolute;
          left: 0;
          width: 100%;
          height: 55%;
          background-color: var(--bg-color); 
          z-index: 10;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease;
        }

        .eyelid-top {
          top: 0;
          transform: translateY(-102%);
        }
        
        .eyelid-bottom {
          bottom: 0;
          transform: translateY(102%);
        }

        .eye-container.hovered .eyelid-top {
          transform: translateY(0%);
        }
        .eye-container.hovered .eyelid-bottom {
          transform: translateY(0%);
        }

        .lash-line {
          position: absolute;
          left: 15%;
          width: 70%;
          height: 3px;
          background: var(--lash);
          opacity: 0.5;
          border-radius: 2px;
        }
        .eyelid-top .lash-line { bottom: 5px; }
        .eyelid-bottom .lash-line { top: 5px; }

        span {
          display: inline-block;
        }
      `}</style>

      <div className="title-wrapper">
        <span>PR</span>
        <Eye />
        <Eye />
        <span>JECTS</span>
      </div>
    </div>
  );
}