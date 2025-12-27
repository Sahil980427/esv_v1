import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

const Navbar_Phone = ({ isDarkMode = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Refs
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const menuItemsRef = useRef([]);

  // Theme Config
  const theme = {
    light: {
      menuBg: "bg-[#D0BCFC]",
      text: "text-[#491AB1]",
      toggleColor: "bg-[#491AB1]",
      dimText: "text-[#491AB1]/40",
      flash: "bg-[#491AB1]", 
    },
    dark: {
      menuBg: "bg-[#1A1230]",
      text: "text-[#D0BCFC]",
      toggleColor: "bg-[#D0BCFC]",
      dimText: "text-[#D0BCFC]/30",
      flash: "bg-[#D0BCFC]",
    },
  };

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  // --- MENU DATA ---
  const navItems = [
    { title: "ABOUT", href: "#about" },
    { title: "WHY ESV", href: "#whyesv" },
    { title: "SERVICES", href: "#services" },
    { title: "WORK", href: "#work" },
    { title: "CONTACT", href: "#contact" },
  ];

  // --- MAGNETIC HOVER LOGIC ---
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const xTo = gsap.quickTo(button, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(button, "y", { duration: 0.4, ease: "power3.out" });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = button.getBoundingClientRect();
      const x = (clientX - (left + width / 2)) * 0.5;
      const y = (clientY - (top + height / 2)) * 0.5;
      xTo(x);
      yTo(y);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      if (!isMenuOpen) {
        gsap.to(line1Ref.current, { width: "32px", duration: 0.4, ease: "elastic.out(1, 0.5)" });
      }
    };

    const handleMouseEnter = () => {
      if (!isMenuOpen) {
        gsap.to(line1Ref.current, { width: "50px", duration: 0.4, ease: "elastic.out(1, 0.4)" });
      }
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);
    button.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
      button.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isMenuOpen]);

  // --- TOGGLE & SCROLL LOGIC ---
  
  const toggleMenu = () => {
    if (!isMenuOpen) {
      // OPEN
      setIsMenuOpen(true);
      const tl = gsap.timeline();

      tl.to(line1Ref.current, { width: "32px", duration: 0.2 })
        .to(line1Ref.current, { rotation: 45, duration: 0.3, ease: "back.out(2)" })
        .to(line2Ref.current, { scaleX: 1, rotation: -45, duration: 0.3, ease: "back.out(2)" }, "<");

      gsap.fromTo(menuRef.current, 
        { display: "none", x: 60, opacity: 0 }, 
        { display: "block", x: 0, opacity: 1, duration: 0.5, ease: "expo.out" }
      );

      gsap.fromTo(menuItemsRef.current, 
        { x: 30, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, delay: 0.1 }
      );
    } else {
      // CLOSE
      const tl = gsap.timeline();
      tl.to(line2Ref.current, { scaleX: 0, rotation: 0, duration: 0.3 })
        .to(line1Ref.current, { rotation: 0, width: "32px", duration: 0.3 }, "<");

      gsap.to(menuRef.current, {
        x: 60, opacity: 0, duration: 0.3,
        onComplete: () => setIsMenuOpen(false),
      });
    }
  };

  // Smooth Scroll Handler
  const handleScroll = (e, href) => {
    e.preventDefault();
    
    // Close menu first if open
    if (isMenuOpen) toggleMenu();

    // Scroll to Top logic
    if (href === "#") {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  };

  const addToRefs = (el) => {
    if (el && !menuItemsRef.current.includes(el)) menuItemsRef.current.push(el);
  };

  return (
    <div className="font-['Nunito']" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @keyframes pulse-bright {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.6; transform: scale(1.1); box-shadow: 0 0 15px currentColor; }
        }
        .animate-flash {
          animation: pulse-bright 2s infinite ease-in-out;
        }
      `}</style>

      {/* --- LOGO (FIXED TOP LEFT) --- */}
      {/* "fixed top-4 left-4" puts it strictly in the corner */}
      <a 
        href="#"
        onClick={(e) => handleScroll(e, "#")}
        className="fixed top-4 left-4 z-50 pointer-events-auto cursor-pointer"
      >
        <img 
            src="/logos/logo_of_editspacevisuals.png" 
            alt="Logo" 
            className="h-10 w-auto object-contain drop-shadow-lg"
        />
      </a>

      {/* --- TOGGLE BUTTON (FIXED TOP RIGHT) --- */}
      {/* "fixed top-4 right-4" puts it strictly in the corner */}
      <div className="fixed top-4 right-4 z-50 pointer-events-auto">
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="relative w-16 h-16 flex items-center justify-center cursor-pointer rounded-full"
        >
          {/* FLASH BRIGHTEN EFFECT BACKGROUND */}
          {/* This div sits behind the lines and pulses to catch attention */}
          <div 
            className={`absolute inset-0 rounded-full animate-flash blur-md ${currentTheme.flash}`}
            style={{ zIndex: -1 }}
          />
          <div className={`absolute inset-0 rounded-full hover:bg-white/10 transition-colors duration-300`} />

          {/* The Minus / Cross Icon */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Line 1: The Minus */}
            <span
              ref={line1Ref}
              className={`absolute w-8 h-[3px] rounded-full shadow-md ${currentTheme.toggleColor}`}
            ></span>
            {/* Line 2: The Cross */}
            <span
              ref={line2Ref}
              className={`absolute w-8 h-[3px] rounded-full shadow-md ${currentTheme.toggleColor} scale-x-0 origin-center`}
            ></span>
          </div>
        </button>
      </div>

      {/* --- DROPDOWN MENU --- */}
      {/* Positioned relative to the viewport top-right */}
      <div
        ref={menuRef}
        className={`fixed top-24 right-4 w-[280px] py-10 px-8 rounded-3xl shadow-2xl hidden origin-top-right pointer-events-auto z-40 ${currentTheme.menuBg}`}
      >
        <div className="flex flex-col gap-6">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              ref={addToRefs}
              onClick={(e) => handleScroll(e, item.href)}
              className="group flex flex-col cursor-pointer no-underline"
            >
              <div className="flex items-baseline justify-between">
                <span
                  className={`text-2xl font-black tracking-tight ${currentTheme.text} group-hover:-translate-x-1 transition-transform duration-300`}
                >
                  {item.title}
                </span>
                <span className={`text-xs font-bold ${currentTheme.dimText}`}>
                  0{index + 1}
                </span>
              </div>
              <div
                className={`w-full h-[2px] mt-2 bg-current opacity-10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ${currentTheme.text}`}
              ></div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar_Phone;