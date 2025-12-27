import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

const Navbar_Desktop = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef(null);

  // --- STATIC CONFIGURATION ---
  const theme = {
    menuBg: "#1A1230",
    text: "#D0BCFC",
    lines: "#D0BCFC",
    btnFill: "#1A1230",
  };

  // --- REFS ---
  const navBgRef = useRef(null);
  const linkRefs = useRef([]);
  const titleRefs = useRef([]);
  const buttonContainerRef = useRef(null);
  const topLineRef = useRef(null);
  const bottomLineRef = useRef(null);
  const mainTl = useRef(null);
  const iconTl = useRef(null);
  const scrambleTweens = useRef([]);

  // --- DATA ---
  const navItems = [
    {
      id: 1,
      title: "ABOUT",
      subtitle: "The Ecosystem",
      href: "#about",
      align: "left",
    },
    {
      id: 2,
      title: "SERVICES",
      subtitle: "Full Spectrum",
      href: "#services",
      align: "left",
    },
    {
      id: 3,
      title: "WORK",
      subtitle: "Selected Projects",
      href: "#work",
      align: "right",
    },
    {
      id: 4,
      title: "CONTACT",
      subtitle: "Start the Future",
      href: "#contact",
      align: "right",
    },
  ];

  // =========================================
  // 1. SCRAMBLE TEXT LOGIC
  // =========================================
  const triggerScramble = (index, originalText) => {
    if (!isOpen) return;
    const element = titleRefs.current[index];
    if (!element) return;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/[]*!@#%&()";

    if (scrambleTweens.current[index]) scrambleTweens.current[index].kill();

    const proxy = { value: 0 };
    scrambleTweens.current[index] = gsap.to(proxy, {
      value: 1,
      duration: 0.5,
      ease: "power4.out",
      onUpdate: () => {
        const progress = proxy.value;
        const len = originalText.length;
        const revealed = Math.floor(progress * len);
        let result = "";
        for (let i = 0; i < len; i++) {
          result +=
            i < revealed
              ? originalText[i]
              : chars[Math.floor(Math.random() * chars.length)];
        }
        element.innerText = result;
      },
      onComplete: () => (element.innerText = originalText),
    });
  };

  // =========================================
  // 2. MOUSE & CLICK HANDLERS
  // =========================================

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    if (!isOpen) setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleButtonClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const handleScroll = (e, href) => {
    e.preventDefault();
    setIsOpen(false);

    // If logo clicked (href="#"), scroll to top
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // =========================================
  // 3. ANIMATIONS
  // =========================================
  const handleLinkEnter = (index, item) => {
    if (!isOpen) return;
    triggerScramble(index, item.title);
    gsap.to(titleRefs.current[index], {
      scale: 1.1,
      duration: 0.4,
      transformOrigin: item.align === "left" ? "left center" : "right center",
      ease: "back.out(3)",
      opacity: 1,
    });
  };

  const handleLinkLeave = (index) => {
    gsap.to(titleRefs.current[index], {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  useEffect(() => {
    gsap.fromTo(
      buttonContainerRef.current,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
        delay: 0.2,
      }
    );

    mainTl.current = gsap.timeline({ paused: true });
    mainTl.current
      .to(navBgRef.current, { y: "0%", duration: 0.6, ease: "power3.inOut" })
      .fromTo(
        linkRefs.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "back.out(1.7)",
        },
        "-=0.2"
      );

    gsap.set([topLineRef.current, bottomLineRef.current], {
      transformOrigin: "center center",
    });
    iconTl.current = gsap.timeline({
      paused: true,
      defaults: { duration: 0.4, ease: "back.out(2)" },
    });
    iconTl.current
      .to(topLineRef.current, { y: 4, rotation: 45 }, 0)
      .to(bottomLineRef.current, { y: -4, rotation: -45 }, 0);

    return () => scrambleTweens.current.forEach((t) => t && t.kill());
  }, []);

  useEffect(() => {
    if (isOpen) {
      mainTl.current.play();
      iconTl.current.play();
      navItems.forEach((item, i) =>
        setTimeout(() => triggerScramble(i, item.title), 300 + i * 100)
      );
    } else {
      mainTl.current.reverse();
      iconTl.current.reverse();
    }
  }, [isOpen]);

  // =========================================
  // 4. RENDER
  // =========================================
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');
        
        .force-cursor-default { cursor: default !important; }
        .force-cursor-pointer { cursor: pointer !important; }
        .nav-interactive { pointer-events: auto !important; }
      `}</style>

      {/* MAIN WRAPPER */}
      <div
        className="fixed top-0 left-0 w-full z-50 font-sans pointer-events-none"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* --- NAVBAR BACKGROUND --- */}
        <div
          ref={navBgRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute top-0 left-0 w-full shadow-xl z-10 nav-interactive force-cursor-default"
          style={{
            height: "80px",
            backgroundColor: theme.menuBg,
            transform: "translateY(-100%)",
          }}
        />

        {/* --- LOGO (LEFT SIDE) --- */}
        {/* Ensure 'logo.png' exists in your /public folder */}
        <a
          href="#"
          onClick={(e) => handleScroll(e, "#")}
          className="absolute top-0 left-0 z-30 h-[80px] flex items-center pl-6 md:pl-12 nav-interactive cursor-pointer"
        >
          <img
            src="/logos/logo_of_editspacevisuals.png"
            alt="Logo"
            className="h-10 md:h-12 w-auto object-contain hover:opacity-80 transition-opacity"
          />
        </a>

        {/* --- LINKS CONTAINER --- */}
        {/* CHANGED: max-w-4xl to bring links closer to the center */}
        <div
          className="relative w-full max-w-4xl mx-auto px-4 pr-24 grid grid-cols-5 items-center h-[80px] z-20 nav-interactive force-cursor-default"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {navItems.map((item, i) => {
            const responsiveClass =
              i === 1 || i === 2 ? "hidden md:flex" : "flex";
            const colClass =
              i < 2 ? "" : i === 2 ? "col-start-4 text-right" : "text-right";

            return (
              <a
                key={item.id}
                href={item.href}
                ref={(el) => (linkRefs.current[i] = el)}
                onMouseEnter={() => handleLinkEnter(i, item)}
                onMouseLeave={() => handleLinkLeave(i)}
                onClick={(e) => handleScroll(e, item.href)}
                className={`${responsiveClass} ${colClass} flex-col justify-center h-full opacity-0 group no-underline force-cursor-pointer`}
              >
                <span
                  ref={(el) => (titleRefs.current[i] = el)}
                  className="font-black text-sm md:text-base tracking-wider block origin-left"
                  style={{ color: theme.text }}
                >
                  {item.title}
                </span>
                <span
                  className="text-[10px] md:text-xs font-semibold capitalize mt-1 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ color: theme.text }}
                >
                  {item.subtitle}
                </span>
              </a>
            );
          })}
        </div>

        {/* --- TRIGGER BUTTON --- */}
        <div
          ref={buttonContainerRef}
          className="absolute top-0 left-0 w-full flex justify-center z-30 opacity-0 pointer-events-none"
        >
          <button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleButtonClick}
            className="group focus:outline-none nav-interactive force-cursor-pointer"
            style={{ padding: "0 20px 40px 20px" }}
          >
            <div className="transition-transform duration-300 group-hover:translate-y-1 drop-shadow-lg">
              <svg width="120" height="40" viewBox="0 0 140 44" fill="none">
                <path
                  d="M0 0 H140 L122 34 Q118 44 105 44 H35 Q22 44 18 34 L0 0Z"
                  fill={theme.btnFill}
                />
                <g stroke={theme.lines} strokeWidth="3" strokeLinecap="round">
                  <line ref={topLineRef} x1="55" y1="18" x2="85" y2="18" />
                  <line ref={bottomLineRef} x1="55" y1="26" x2="85" y2="26" />
                </g>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar_Desktop;
