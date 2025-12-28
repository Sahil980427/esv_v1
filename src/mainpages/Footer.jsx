import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const logoWrapperRef = useRef(null);

  // FIXED COLOR PALETTE
  const colors = {
    bg: "#D0BCFC",
    text: "#491AB1",
    textDark: "#1A1230", 
    white: "#FFFFFF",
    accent: "#491AB1",
  };

  // USE LAYOUT EFFECT
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // --- INITIAL STATES ---
      gsap.set(footerRef.current, { visibility: "visible" });

      gsap.set([".footer-pill", ".footer-bottom", ".footer-social"], {
        autoAlpha: 0,
        y: 30,
      });

      // Prepare the "Builder" elements
      gsap.set(".logo-mask-top", { width: "0%" });
      gsap.set(".logo-mask-bottom", { width: "0%" });
      gsap.set(".logo-cursor", { opacity: 1 });

      // --- PARALLEL ANIMATION SEQUENCE ---
      tl.addLabel("start");

      // TRACK 1: LOGO ANIMATION
      tl.to(
        ".logo-mask-top",
        { width: "100%", duration: 0.7, ease: "power2.inOut" },
        "start"
      )
        .set(".cursor-top", { opacity: 0 })
        .set(".cursor-bottom", { opacity: 1 })
        .to(".logo-mask-bottom", {
          width: "100%",
          duration: 0.7,
          ease: "power2.inOut",
        })
        .to(".logo-cursor", { opacity: 0, duration: 0.1 })
        .to([".logo-text-top", ".logo-text-bottom"], {
          textShadow: `0px 0px 20px ${colors.text}`,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
        });

      // TRACK 2: BOTTOM CONTENT
      tl.to(
        [".footer-social"],
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "start"
      )
        .to(
          ".footer-pill",
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: "back.out(1.5)",
          },
          "start+=0.2"
        )
        .to(
          ".footer-bottom",
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
          },
          "start+=0.4"
        );

      // --- Continuous Floating Animation ---
      gsap.to(logoWrapperRef.current, {
        y: 15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 3,
      });
    }, footerRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  // --- Interaction Handlers ---
  const handleScrambleEnter = (e) => {
    const target = e.currentTarget;
    const originalText = target.getAttribute("data-text");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()";
    gsap.killTweensOf(target);
    gsap.to(target, {
      x: 5,
      color: colors.white,
      backgroundColor: colors.text,
      paddingLeft: "8px",
      paddingRight: "8px",
      borderRadius: "4px",
      duration: 0.3,
    });

    const scrambleObj = { val: 0 };
    gsap.to(scrambleObj, {
      val: 1,
      duration: 0.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const progress = scrambleObj.val;
        const len = originalText.length;
        const solvedLen = Math.floor(progress * len);
        let output = originalText.substring(0, solvedLen);
        for (let i = solvedLen; i < len; i++) {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
        target.innerText = output;
      },
      onComplete: () => {
        target.innerText = originalText;
      },
    });
  };

  const handleScrambleLeave = (e) => {
    gsap.to(e.currentTarget, {
      x: 0,
      color: colors.text,
      backgroundColor: "transparent",
      paddingLeft: "0px",
      paddingRight: "0px",
      duration: 0.3,
    });
  };

  const handlePillEnter = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: colors.text,
      color: colors.bg,
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
      borderColor: colors.text,
    });
  };
  const handlePillLeave = (e) => {
    gsap.to(e.currentTarget, {
      backgroundColor: "transparent",
      color: colors.text,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
      borderColor: colors.text,
    });
  };

  const handleScroll = (e, href) => {
    // If it's an external link (http), allow default browser action
    if (href === "#" || href.startsWith("http")) return;
    
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const services = {
    development: [
      { name: "Web Design & Dev", link: "#" },
      { name: "WordPress Design", link: "#" },
      { name: "Database Handling", link: "#" },
      { name: "AI & Bot Dev", link: "#" },
    ],
    creative: [
      { name: "Graphic Design", link: "#" },
      { name: "Photo Editing", link: "#" },
      { name: "Video Editing", link: "#" },
      { name: "Visual Identity", link: "#" },
    ],
    growth: [
      { name: "Digital Marketing", link: "#" },
      { name: "Trading Expertise", link: "#" },
      { name: "Course Platforms", link: "#" },
      { name: "Consultancy", link: "#" },
    ],
  };

  const footerPills = [
    { name: "Our Work", link: "#work" },
    { name: "Services", link: "#services" },
    { name: "Why ESV", link: "#whyesv" },
    { name: "Contact", link: "#contact" },
    { name: "Knowledge", link: "#knowledge" },
  ];

  // --- SOCIAL LINKS CONFIGURATION ---
  const socialLinks = [
    {
      name: "Website",
      type: "img",
      src: "/logos/logo_of_editspacevisuals.png",
      href: "#hero", // Internal
      isExternal: false,
    },
    {
      name: "Instagram",
      type: "svg",
      href: "https://www.instagram.com/editspacevisuals?igsh=ZmFoeTNjcGY5NjJv",
      isExternal: true,
      path: (
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M7.5 3h9a4.5 4.5 0 0 1 4.5 4.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3z" />
      ),
    },
    {
      name: "Gmail",
      type: "svg",
      // Link specifically to Gmail Web Compose
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=editspacevisuals@gmail.com", 
      isExternal: true, 
      path: (
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" />
      ),
    },
  ];

  return (
    <div
      id="footer"
      className="w-full flex flex-col justify-end"
      style={{ backgroundColor: "#f3f4f6" }}
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@200..1000&display=swap');`}
      </style>

      <footer
        ref={footerRef}
        className="w-full pt-12 pb-8 md:pt-20 md:pb-10 px-4 md:px-12 flex flex-col items-center overflow-hidden relative"
        style={{
          backgroundColor: colors.bg,
          color: colors.text,
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {/* --- Logo Section (CLICKABLE -> #HERO) --- */}
        <a
          href="#hero"
          onClick={(e) => handleScroll(e, "#hero")}
          ref={logoWrapperRef}
          className="mb-10 md:mb-16 text-center relative z-10 flex flex-col items-center gap-1 md:gap-2 cursor-pointer group no-underline"
        >
          <div className="relative inline-block">
            <div className="logo-mask-top overflow-hidden whitespace-nowrap relative z-10">
              <h1 className="logo-text-top text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none px-2 group-hover:text-[#1A1230] transition-colors duration-300">
                EDIT SPACE
              </h1>
            </div>
            <div
              className="logo-cursor cursor-top absolute top-0 bottom-0 w-1 md:w-2 bg-[#491AB1] z-20"
              style={{ left: "100%", transform: "translateX(-100%)" }}
            ></div>
          </div>
          <div className="relative inline-block">
            <div className="logo-mask-bottom overflow-hidden whitespace-nowrap relative z-10">
              <h1 className="logo-text-bottom text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none opacity-50 px-2 group-hover:opacity-80 transition-opacity duration-300">
                VISUALS
              </h1>
            </div>
            <div
              className="logo-cursor cursor-bottom absolute top-0 bottom-0 w-1 md:w-2 bg-[#491AB1] z-20 opacity-0"
              style={{ left: "100%", transform: "translateX(-100%)" }}
            ></div>
          </div>
        </a>

        {/* --- Services Grid --- */}
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center mb-12 md:mb-20 relative z-20">
          {Object.entries(services).map(([key, items]) => (
            <div key={key} className="flex flex-col items-center relative z-20">
              <h3
                className="text-xl md:text-2xl font-extrabold mb-4 md:mb-6 uppercase border-b-2 pb-2 cursor-default inline-block origin-center"
                style={{
                  borderColor: colors.text,
                  color: colors.textDark, 
                  opacity: 1,
                  visibility: "visible",
                }}
              >
                {key}
              </h3>

              <ul className="space-y-2 md:space-y-3 text-base md:text-lg font-bold leading-relaxed w-full flex flex-col items-center">
                {items.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.link}
                      data-text={item.name}
                      className="block cursor-pointer py-1"
                      style={{ fontFamily: "monospace", color: colors.text }}
                      onMouseEnter={handleScrambleEnter}
                      onMouseLeave={handleScrambleLeave}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* --- Pills (Buttons) --- */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10 md:mb-16 w-full max-w-6xl relative z-10 px-2">
          {footerPills.map((item) => (
            <a
              key={item.name}
              href={item.link}
              onClick={(e) => handleScroll(e, item.link)}
              className="footer-pill opacity-0 px-6 py-2 md:px-8 md:py-3 rounded-full border-2 font-bold uppercase tracking-widest text-[10px] md:text-xs cursor-pointer relative overflow-hidden transition-all inline-block no-underline"
              style={{ borderColor: colors.text, color: colors.text }}
              onMouseEnter={handlePillEnter}
              onMouseLeave={handlePillLeave}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* --- Social Icons (UPDATED) --- */}
        <div className="flex gap-4 md:gap-8 mb-10 md:mb-16 footer-social opacity-0 relative z-10 items-center justify-center">
          {socialLinks.map((social) => {
            // Logic to handle Click
            const handleClick = (e) => {
              // 1. If it's the internal website link
              if (!social.isExternal) {
                handleScroll(e, social.href);
              } 
              // 2. If it's Gmail, copy to clipboard AND let the link open
              else if (social.name === "Gmail") {
                navigator.clipboard.writeText("editspacevisuals@gmail.com")
                  .then(() => {
                     // Optional: You could log to console or show a toast here
                     console.log("Email copied to clipboard");
                  })
                  .catch(err => {
                    console.error("Failed to copy: ", err);
                  });
              }
            };
            
            const targetAttr = social.isExternal ? "_blank" : "_self";
            const relAttr = social.isExternal ? "noopener noreferrer" : "";

            return (
              <a
                key={social.name}
                href={social.href}
                target={targetAttr}
                rel={relAttr}
                onClick={handleClick}
                title={social.name === "Gmail" ? "Copy Email & Open Gmail" : social.name}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center cursor-pointer border-2 transition-all overflow-hidden"
                style={{
                  backgroundColor: colors.text,
                  color: colors.white,
                  borderColor: colors.text,
                }}
                onMouseEnter={(e) =>
                  gsap.to(e.currentTarget, {
                    scale: 1.2,
                    backgroundColor: colors.bg,
                    color: colors.text,
                    borderColor: colors.text,
                    duration: 0.3,
                  })
                }
                onMouseLeave={(e) =>
                  gsap.to(e.currentTarget, {
                    scale: 1,
                    backgroundColor: colors.text,
                    color: colors.white,
                    borderColor: colors.text,
                    duration: 0.3,
                  })
                }
              >
                {social.type === "svg" ? (
                  <svg
                    width="20"
                    height="20"
                    className="md:w-6 md:h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {social.path}
                  </svg>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={social.src}
                      alt={social.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </a>
            );
          })}
        </div>

        {/* --- Footer Bottom (Copyright) --- */}
        <div
          className="footer-bottom opacity-0 w-full pt-6 pb-2 text-center text-[10px] md:text-xs font-bold opacity-100 border-t relative z-10"
          style={{ borderColor: colors.text, color: colors.textDark }}
        >
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <p style={{ color: "#24204A" }}>
              © 2025 EditSpaceVisuals. All rights reserved.
            </p>
            <div className="flex justify-center gap-6">
              <a
                href="#"
                className="hover:underline transition-all hover:opacity-75"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:underline transition-all hover:opacity-75"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:underline transition-all hover:opacity-75"
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;