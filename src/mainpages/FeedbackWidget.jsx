import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import emailjs from "@emailjs/browser";
import {
  MessageSquare,
  X,
  Send,
  Smile,
  Meh,
  Frown,
  Sparkles,
  Zap,
  Layout,
  Loader2,
} from "lucide-react";

// --- CSS FOR STYLING ---
const widgetStyles = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
.font-nunito { font-family: 'Nunito', sans-serif; }
.feedback-scroll::-webkit-scrollbar { width: 4px; }
.feedback-scroll::-webkit-scrollbar-track { background: transparent; }
.feedback-scroll::-webkit-scrollbar-thumb { background: currentColor; opacity: 0.2; border-radius: 4px; }
.writing-vertical { writing-mode: vertical-rl; text-orientation: mixed; }
`;

// --- CATEGORY COMPONENT ---
const RatingCategory = ({ icon: Icon, label, value, onChange, delay }) => {
  return (
    <div
      className={`rating-item flex items-center justify-between mb-3 opacity-0 translate-x-4`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 opacity-70">
        <Icon size={14} className="shrink-0" />
        <span className="text-[10px] md:text-xs font-black uppercase tracking-wider whitespace-nowrap">
          {label}
        </span>
      </div>
      <div className="flex gap-1 md:gap-2">
        {[
          { val: "bad", icon: Frown, color: "text-red-400" },
          { val: "neutral", icon: Meh, color: "text-yellow-400" },
          { val: "good", icon: Smile, color: "text-green-400" },
        ].map((opt) => (
          <button
            key={opt.val}
            type="button"
            onClick={() => onChange(opt.val)}
            className={`p-1.5 md:p-2 rounded-full transition-all duration-300 ${
              value === opt.val
                ? `bg-current/10 scale-125 ${opt.color}`
                : "opacity-30 hover:opacity-100 hover:scale-110"
            }`}
          >
            <opt.icon size={18} className="md:w-5 md:h-5" strokeWidth={3} />
          </button>
        ))}
      </div>
    </div>
  );
};

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [ratings, setRatings] = useState({
    ui: null,
    anim: null,
    overall: null,
  });

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const containerRef = useRef(null);
  const contentRef = useRef(null);

  // --- CONFIGURATION ---
  const SERVICE_ID = "service_cs6roxl";
  const TEMPLATE_ID = "template_iyjhckq";
  const PUBLIC_KEY = "0TQRyZZPF6qVsEZbs";

  // --- OPEN / CLOSE ANIMATION (RESPONSIVE) ---
  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isDesktop: "(min-width: 768px)",
        },
        (context) => {
          let { isMobile } = context.conditions;

          if (isOpen) {
            // OPEN STATE
            gsap.to(containerRef.current, {
              right: isMobile ? "5vw" : 20, // Center loosely on mobile, exact px on desktop
              width: isMobile ? "90vw" : 340, // Fullish width on mobile, fixed on desktop
              height: "auto",
              opacity: 1,
              borderRadius: "24px",
              duration: 0.6,
              ease: "elastic.out(1, 0.75)",
            });

            gsap.to(".rating-item", {
              opacity: 1,
              x: 0,
              duration: 0.4,
              stagger: 0.1,
              delay: 0.2,
              ease: "back.out(1.5)",
            });

            gsap.to(".trigger-btn", { scale: 0, opacity: 0, duration: 0.3 });
          } else {
            // CLOSED STATE
            gsap.to(containerRef.current, {
              right: -50,
              width: 0,
              height: 0,
              opacity: 0,
              duration: 0.4,
              ease: "power3.in",
            });

            gsap.to(".trigger-btn", {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              delay: 0.2,
              ease: "back.out(1.5)",
            });

            setTimeout(() => {
              setStep(1);
              setRatings({ ui: null, anim: null, overall: null });
              setMessage("");
              setIsSending(false);
            }, 400);
          }
        }
      );
    });

    return () => ctx.revert();
  }, [isOpen]);

  // --- STEP TRANSITIONS ---
  useEffect(() => {
    if (!isOpen) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }, contentRef);
    return () => ctx.revert();
  }, [step, isOpen]);

  // --- HANDLERS ---
  const handleNext = () => {
    if (ratings.ui && ratings.anim && ratings.overall) {
      setStep(2);
    } else {
      gsap.fromTo(
        containerRef.current,
        { x: -5 },
        { x: 5, duration: 0.1, repeat: 3, yoyo: true }
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);

    const templateParams = {
      ui_rating: ratings.ui,
      anim_rating: ratings.anim,
      overall_rating: ratings.overall,
      message: message,
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY).then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
        setIsSending(false);
        setStep(3);
        setTimeout(() => setIsOpen(false), 3000);
      },
      (err) => {
        console.log("FAILED...", err);
        setIsSending(false);
        alert("Failed to send feedback. Please try again.");
      }
    );
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[9999] font-nunito text-[#491AB1] dark:text-[#D0BCFC]">
      <style>{widgetStyles}</style>

      {/* --- TRIGGER BUTTON --- */}
      {/* Responsive adjustments: Smaller padding on mobile, hide text on very small screens if needed */}
      <button
        onClick={() => setIsOpen(true)}
        className="trigger-btn absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 hover:translate-x-0 transition-transform duration-300 bg-[#491AB1] text-[#D0BCFC] dark:bg-[#D0BCFC] dark:text-[#24204A] py-6 px-2 md:py-8 md:px-3 rounded-l-xl md:rounded-l-2xl shadow-xl flex flex-col items-center gap-2 group"
      >
        {/* Hide text on mobile to save space, show on medium screens up */}
        <span className="writing-vertical text-[10px] md:text-xs font-black uppercase tracking-widest rotate-180 group-hover:mb-2 transition-all hidden md:block">
          Feedback
        </span>
        <MessageSquare
          size={16}
          className="md:w-[18px] md:h-[18px] animate-pulse"
        />
      </button>

      {/* --- MAIN CARD --- */}
      <div
        ref={containerRef}
        className="relative bg-[#D0BCFC] dark:bg-[#24204A] border-4 border-[#491AB1] dark:border-[#D0BCFC] shadow-2xl overflow-hidden opacity-0 w-0 h-0"
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 md:top-3 md:right-3 opacity-40 hover:opacity-100 hover:rotate-90 transition-all z-20"
        >
          <X size={20} strokeWidth={3} />
        </button>

        <div
          ref={contentRef}
          className="p-4 md:p-6 h-full flex flex-col justify-center min-h-[320px] md:min-h-[360px]"
        >
          {/* --- STEP 1: RATINGS --- */}
          {step === 1 && (
            <>
              <div className="text-center mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-black uppercase leading-none mb-1">
                  Rate Us!
                </h3>
                <p className="text-[9px] md:text-[10px] font-bold opacity-60 uppercase tracking-widest">
                  Help us get cuter
                </p>
              </div>

              <div className="space-y-1 mb-4 md:mb-6">
                <RatingCategory
                  icon={Layout}
                  label="UI Design"
                  value={ratings.ui}
                  onChange={(v) => setRatings({ ...ratings, ui: v })}
                  delay={100}
                />
                <RatingCategory
                  icon={Sparkles}
                  label="Animations"
                  value={ratings.anim}
                  onChange={(v) => setRatings({ ...ratings, anim: v })}
                  delay={200}
                />
                <RatingCategory
                  icon={Zap}
                  label="Overall"
                  value={ratings.overall}
                  onChange={(v) => setRatings({ ...ratings, overall: v })}
                  delay={300}
                />
              </div>

              <button
                onClick={handleNext}
                className="w-full py-2.5 md:py-3 rounded-xl bg-[#491AB1] text-[#D0BCFC] dark:bg-[#D0BCFC] dark:text-[#24204A] font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                Next Step{" "}
                <Send
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </>
          )}

          {/* --- STEP 2: MESSAGE --- */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="mb-3 md:mb-4">
                <h3 className="text-base md:text-lg font-black uppercase mb-1">
                  Tell us more
                </h3>
                <p className="text-[9px] md:text-[10px] font-bold opacity-60">
                  Everything is anonymous.
                </p>
              </div>

              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="feedback-scroll flex-1 w-full bg-white/20 dark:bg-black/20 rounded-xl p-3 md:p-4 text-sm font-bold placeholder:text-current/30 outline-none border-2 border-transparent focus:border-current transition-all resize-none mb-3 md:mb-4 min-h-[100px] md:min-h-[120px]"
                placeholder="What can we improve for the future?"
              ></textarea>

              <button
                type="submit"
                disabled={isSending}
                className={`w-full py-2.5 md:py-3 rounded-xl bg-[#491AB1] text-[#D0BCFC] dark:bg-[#D0BCFC] dark:text-[#24204A] font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 ${
                  isSending ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSending ? (
                  <>
                    Sending... <Loader2 size={14} className="animate-spin" />
                  </>
                ) : (
                  <>
                    Submit Feedback <Send size={14} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* --- STEP 3: SUCCESS --- */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center text-center h-full">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-400 rounded-full flex items-center justify-center mb-3 md:mb-4 animate-bounce text-[#24204A]">
                <Smile size={32} className="md:w-10 md:h-10" strokeWidth={3} />
              </div>
              <h3 className="text-xl md:text-2xl font-black uppercase mb-2">
                You Rock!
              </h3>
              <p className="text-[10px] md:text-xs font-bold opacity-70 px-2 md:px-4">
                "Feedback is must for future progression. No one knows you wrote
                this, but it helps the ESV team build a better world."
              </p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-current/20 w-full">
          <div
            className="h-full bg-current transition-all duration-500 ease-out"
            style={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default FeedbackWidget;
