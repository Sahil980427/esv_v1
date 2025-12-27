import React, { useEffect, useRef } from 'react';

export default function SpiderAnimationBanner() {
  const bannerRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const banner = bannerRef.current;
    const canvas = canvasRef.current;
    if (!banner || !canvas) return;
    const ctx = canvas.getContext('2d');
    let dots = [];
    const colors = ['#00f260', '#0575e6', '#e100ff', '#00dbde', '#fc4a1a'];
    let mousePos = { x: null, y: null };
    let DPR = Math.max(1, window.devicePixelRatio || 1);

    const resizeCanvas = () => {
      DPR = Math.max(1, window.devicePixelRatio || 1);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      initDots();
    };

    const initDots = () => {
      dots = [];
      const count = Math.floor((window.innerWidth / 160) * 10); // scale density with width
      for (let i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * canvas.width / DPR,
          y: Math.random() * canvas.height / DPR,
          size: (Math.random() * 1.8 + 3.2),
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6
        });
      }
    };

    const drawDots = () => {
      ctx.save();
      dots.forEach(dot => {
        ctx.beginPath();
        ctx.fillStyle = dot.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = dot.color;
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    };

    const connectToMouse = () => {
      if (mousePos.x === null) return;
      ctx.save();
      dots.forEach(dot => {
        const dx = mousePos.x - dot.x;
        const dy = mousePos.y - dot.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 220) {
          const alpha = 1 - dist / 220;
          ctx.beginPath();
          ctx.strokeStyle = dot.color;
          ctx.globalAlpha = Math.max(0.06, alpha * 0.9);
          ctx.lineWidth = 1.2 * alpha;
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(mousePos.x, mousePos.y);
          ctx.stroke();
        }
      });
      ctx.restore();
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / DPR, canvas.height / DPR);

      dots.forEach(dot => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < -10) dot.x = canvas.width / DPR + 10;
        if (dot.x > canvas.width / DPR + 10) dot.x = -10;
        if (dot.y < -10) dot.y = canvas.height / DPR + 10;
        if (dot.y > canvas.height / DPR + 10) dot.y = -10;
      });

      drawDots();
      connectToMouse();

      rafRef.current = requestAnimationFrame(animate);
    };

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.x = (e.clientX - rect.left);
      mousePos.y = (e.clientY - rect.top);
    };

    const onMouseOut = () => {
      mousePos.x = null;
      mousePos.y = null;
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', onMouseOut);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return (
    <div className="app-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        :root { --bg:#050505; --muted:#b3b3b3; --accent1:#00dbde; }
        *{box-sizing:border-box}
        .app-container{
          margin:0;
          padding:0;
          width:100vw;
          height:100vh;
          max-width:100vw;
          max-height:100vh;
          overflow:hidden;
          font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          background: radial-gradient(circle at 15% 50%, rgba(5,117,230,0.08), transparent 20%),
                      radial-gradient(circle at 85% 30%, rgba(225,0,255,0.06), transparent 20%),
                      var(--bg);
        }
        .banner {
          width:100%;
          height:100%;
          position:relative;
          display:flex;
          align-items:center;
          justify-content:center;
        }
        canvas {
          position:absolute;
          top:0;
          left:0;
          width:100%;
          height:100%;
          z-index:1;
          pointer-events:none;
        }
        .hero {
          position:relative;
          z-index:5;
          text-align:center;
          padding:2rem;
          color:#fff;
          animation: heroIn 900ms cubic-bezier(.22,.9,.35,1);
        }
        @keyframes heroIn {
          from { opacity:0; transform:translateY(28px); }
          to { opacity:1; transform:translateY(0); }
        }
        .tag {
          display:inline-block;
          background:rgba(0,219,222,0.12);
          color:var(--accent1);
          padding:8px 16px;
          border-radius:20px;
          font-weight:600;
          letter-spacing:2px;
          margin-bottom:12px;
        }
        h1{ margin:0; font-size:clamp(34px,8vw,72px); line-height:1; font-weight:800; letter-spacing:-1px}
        .grad{ background:linear-gradient(90deg,#00f260,#0575e6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        p.desc{ color:var(--muted); max-width:640px; margin:14px auto 0; font-size:clamp(14px,1.2vw,18px); line-height:1.6}
        .cta{ margin-top:20px; background:#fff; color:#111; padding:12px 28px; border-radius:10px; font-weight:700; cursor:pointer; border:none }
        @media (max-width:768px){
          h1{ font-size:clamp(32px,12vw,48px) }
          .tag{ padding:6px 12px }
        }
      `}</style>

      <div className="banner" ref={bannerRef}>
        <canvas ref={canvasRef} />
        <div className="hero">
          <div className="tag">Interactive Design</div>
          <h1>Digital <span className="grad">Network</span></h1>
          <p className="desc">Explore the connection between art and code. Move your cursor to interact with the neon web.</p>
          <button className="cta">Start Experience</button>
        </div>
      </div>
    </div>
  );
}
