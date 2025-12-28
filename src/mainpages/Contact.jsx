import React, { useState, useEffect, useRef, useMemo, memo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import DOMPurify from "dompurify";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ChevronDown,
  ArrowRight,
  MessageSquare,
  User,
  Phone,
  AtSign,
  Briefcase,
  DollarSign,
  Globe,
  ShieldCheck,
  X,
  CheckCircle2,
  Square,
  CheckSquare,
} from "lucide-react";

// --- CSS FOR PERFORMANCE (Add to your global CSS or inside a <style> tag) ---
// We use CSS Keyframes instead of GSAP for the background to unblock the JS thread.
const globalStyles = `
@keyframes floatBlob {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}
.blob-anim {
  animation: floatBlob 20s infinite ease-in-out;
  will-change: transform; /* GPU Hardware Acceleration */
}
.blob-anim-reverse {
  animation: floatBlob 25s infinite ease-in-out reverse;
  will-change: transform;
}
`;

// --- 1. CONFIGURATION ---

const BASE_SERVICES_CONFIG = {
  "Web Development": { label: "Web Design & Dev", min: 5000, step: 1000 },
  "Graphic Design": { label: "Graphic Design & Photo Editing", min: 250, step: 50 },
  "Video Editing": { label: "Video Editing", min: 500, step: 100 },
  WordPress: { label: "WordPress Website Design", min: 3000, step: 500 },
  Trading: { label: "Trading Expertise", min: 3000, step: 500 },
  "Digital Marketing": { label: "Digital Marketing", min: 2000, step: 400 },
  "AI Dev": { label: "AI & Bot Development", min: 4000, step: 1000 },
  "Course Platform": { label: "Course Providing & Teaching Platform", min: 10000, step: 2000 },
};

const CURRENCIES = {
  INR: { label: "INR (₹)", symbol: "₹", rate: 1 },
  USD: { label: "USD ($)", symbol: "$", rate: 0.012 },
  EUR: { label: "EUR (€)", symbol: "€", rate: 0.011 },
  GBP: { label: "GBP (£)", symbol: "£", rate: 0.0095 },
  AED: { label: "AED (د.إ)", symbol: "د.إ", rate: 0.044 },
};

const prefixes = ["Mr.", "Mrs.", "Ms.", "Dr.", "Mx."];
const servicesList = Object.entries(BASE_SERVICES_CONFIG).map(([key, val]) => ({
  value: key,
  label: val.label,
}));
const currencyList = Object.keys(CURRENCIES).map((key) => ({
  value: key,
  label: CURRENCIES[key].label,
}));

// Validation Logic
const PROHIBITED_WORDS = ["spam", "casino", "crypto", "bitcoin", "hack", "cheat", "xyz", "cheap", "abuse", "stupid"];
const NAME_REGEX = /^[a-zA-Z\s'-]+$/;

const convertValue = (inrValue, currencyCode) => {
  if (currencyCode === "INR") return inrValue;
  const rate = CURRENCIES[currencyCode].rate;
  const raw = inrValue * rate;
  if (raw < 10) return Math.ceil(raw);
  if (raw < 100) return Math.ceil(raw / 5) * 5;
  if (raw < 1000) return Math.ceil(raw / 10) * 10;
  return Math.ceil(raw / 50) * 50;
};

const formSchema = z
  .object({
    prefix: z.string(),
    name: z.string().trim().min(3, "Name too short").max(50).regex(NAME_REGEX, "Letters only").refine((val) => val.trim().indexOf(" ") !== -1, { message: "Enter Full Name" }),
    email: z.string().trim().toLowerCase().email("Invalid email").refine((val) => !val.endsWith(".xyz") && !val.endsWith(".top"), { message: "Suspicious domain" }),
    phone: z.string().optional().or(z.literal("")).refine((val) => { if (!val) return true; const d = val.replace(/\D/g, "").length; return d >= 7 && d <= 15; }, { message: "Invalid Phone" }),
    service: z.string().min(1, "Select a service"),
    currency: z.string(),
    budget: z.number({ invalid_type_error: "Enter amount" }),
    message: z.string().trim().min(20, "Min 20 chars").max(2000).refine((val) => { const lower = val.toLowerCase(); return !PROHIBITED_WORDS.find((word) => lower.includes(word)); }, { message: "Policy violation." }),
  })
  .superRefine((data, ctx) => {
    const config = BASE_SERVICES_CONFIG[data.service];
    if (config) {
      const minAmount = convertValue(config.min, data.currency);
      const symbol = CURRENCIES[data.currency].symbol;
      if (data.budget < minAmount) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["budget"], message: `Min ${symbol}${minAmount}` });
      }
    }
  });

// --- 2. OPTIMIZED BACKGROUND (CSS ONLY) ---
const BackgroundBlobs = memo(() => {
  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none transform-gpu">
      <div className="blob-anim absolute rounded-full blur-[50px] opacity-40 mix-blend-multiply dark:mix-blend-screen bg-[#491AB1] w-[300px] h-[300px] top-[-10%] left-[-10%]" />
      <div className="blob-anim-reverse absolute rounded-full blur-[50px] opacity-30 mix-blend-screen bg-[#FFFFFF] w-[250px] h-[250px] top-[40%] left-[60%]" />
      <div className="blob-anim absolute rounded-full blur-[50px] opacity-40 mix-blend-multiply dark:mix-blend-screen bg-[#491AB1] w-[200px] h-[200px] top-[80%] left-[10%]" />
    </div>
  );
});

// --- 3. LIGHTWEIGHT INPUTS (Reduced GSAP) ---
const GsapInput = memo(({ label, error, register, name, icon: Icon, type = "text", helperText, ...props }) => {
  const [focused, setFocused] = useState(false);
  
  // Removed GSAP hook here. Using CSS transitions for speed.
  const borderColor = error ? "border-red-500" : focused || props.value ? "border-current" : "border-transparent";
  const scaleClass = focused || props.value ? "scale-[1.02]" : "scale-100";
  const iconOpacity = focused || props.value ? "opacity-100 scale-110" : "opacity-50 scale-100";

  return (
    <div className="relative mb-3 lg:mb-4 form-item z-0">
      <div className={`flex items-center rounded-xl lg:rounded-2xl px-3 py-3 lg:px-4 lg:py-4 transition-all duration-300 ease-out bg-white/50 dark:bg-[#1A1230]/50 border-2 ${borderColor} ${scaleClass}`}>
        <div className={`mr-3 transition-all duration-300 ${iconOpacity}`}>
          <Icon size={18} />
        </div>
        <div className="flex-1 relative h-full">
          <label className="block text-[9px] lg:text-[10px] xl:text-xs font-bold uppercase tracking-wider mb-0.5 opacity-60 pointer-events-none select-none">{label}</label>
          <input
            {...register(name, { valueAsNumber: type === "number" })}
            type={type}
            onFocus={() => setFocused(true)}
            onBlur={(e) => { setFocused(false); props.onBlur && props.onBlur(e); }}
            className="w-full bg-transparent outline-none font-bold text-sm lg:text-base xl:text-lg placeholder-transparent text-current h-5 lg:h-6"
            placeholder={label}
            {...props}
          />
        </div>
        {!error && focused && props.value && <ShieldCheck size={16} className="text-green-500 opacity-60 animate-pulse" />}
      </div>
      {helperText && !error && <div className="text-[9px] lg:text-[10px] font-bold opacity-60 text-right px-2 mt-1">{helperText}</div>}
      {error && <p className="text-right text-[10px] text-red-500 font-bold mt-1 pr-2 animate-pulse">{error.message}</p>}
    </div>
  );
});

const GsapSelect = memo(({ value, onChange, options, error, icon: Icon, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={`relative mb-3 lg:mb-4 form-item ${isOpen ? "z-50" : "z-0"}`} ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between rounded-xl lg:rounded-2xl px-3 py-3.5 lg:px-4 lg:py-5 cursor-pointer bg-white/50 dark:bg-[#1A1230]/50 border-2 transition-all duration-200 select-none ${error ? "border-red-500" : isOpen ? "border-current" : "border-transparent"}`}
      >
        <div className="flex items-center gap-2 lg:gap-3 overflow-hidden">
          <Icon size={18} className="opacity-50 min-w-[18px]" />
          <span className={`font-bold text-sm lg:text-base xl:text-lg truncate ${!value && "opacity-50"}`}>
            {options.find((o) => o.value === value)?.label || placeholder}
          </span>
        </div>
        <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl shadow-2xl bg-[#F0E6FF] dark:bg-[#2D2654] border-2 border-current max-h-48 overflow-y-auto z-[100] animate-in fade-in zoom-in-95 duration-200">
          {options.map((opt) => (
            <div key={opt.value} onClick={() => { onChange(opt.value); setIsOpen(false); }} className="px-4 py-3 cursor-pointer rounded-xl font-bold text-xs lg:text-sm hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              {opt.label}
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-right text-[10px] text-red-500 font-bold mt-1 pr-2">{error.message}</p>}
    </div>
  );
});

// --- 4. MAIN FORM ---
export default function Contact() {
  const containerRef = useRef(null);
  const formCardRef = useRef(null);
  const modalRef = useRef(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [isFinalSubmitting, setIsFinalSubmitting] = useState(false);
  const [isCurrencyConfirmed, setIsCurrencyConfirmed] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    useWatch: useWatchForm, // Renamed to avoid confusion
    control,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onBlur", // <--- CRITICAL: Only validates when you leave the field, not while typing
    defaultValues: {
      prefix: "Mr.",
      name: "",
      email: "",
      phone: "",
      service: "",
      currency: "INR",
      budget: 0,
      message: "",
    },
  });

  // MINIMIZED WATCHERS: Only watch what controls other fields
  const selectedService = useWatch({ control, name: "service" });
  const selectedCurrency = useWatch({ control, name: "currency" });
  // Note: We REMOVED watching "name" here to stop re-renders on keystroke.

  const { currentServiceConfig, currentSymbol, dynamicMin, dynamicStep } = useMemo(() => {
    const config = selectedService ? BASE_SERVICES_CONFIG[selectedService] : null;
    return {
      currentServiceConfig: config,
      currentSymbol: CURRENCIES[selectedCurrency]?.symbol || "₹",
      dynamicMin: config ? convertValue(config.min, selectedCurrency) : 0,
      dynamicStep: config ? convertValue(config.step, selectedCurrency) : 100,
    };
  }, [selectedService, selectedCurrency]);

  useEffect(() => {
    if (selectedService) {
      setValue("budget", dynamicMin);
      trigger("budget"); // Only trigger budget validation on service change
    }
  }, [selectedService, selectedCurrency, dynamicMin, setValue, trigger]);

  // One-time Intro Animation
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".header-reveal", { y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: "power4.out" })
      .from(formCardRef.current, { x: 30, opacity: 0, scale: 0.98, duration: 0.8, clearProps: "all" }, "-=0.6")
      .from(".form-item", { y: 20, opacity: 0, duration: 0.5, stagger: 0.05 }, "-=0.4")
      .from(".submit-btn", { scale: 0, opacity: 0, duration: 0.5, ease: "back.out(1.5)" }, "-=0.2");
  }, { scope: containerRef });

  // Modal Animation
  useGSAP(() => {
    if (showConfirmModal) {
      gsap.fromTo(modalRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.2)" });
    }
  }, [showConfirmModal]);

  const onInitialSubmit = (data) => {
    // Sanitization only happens on submit, not while typing
    const safeData = {
      ...data,
      name: DOMPurify.sanitize(data.name).trim(),
      message: DOMPurify.sanitize(data.message).trim(),
      email: data.email.toLowerCase(),
    };
    setPendingData(safeData);
    setIsCurrencyConfirmed(false);
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    if (!isCurrencyConfirmed) return;
    setIsFinalSubmitting(true);
    const btn = document.querySelector(".final-btn");
    gsap.to(btn, { width: 50, borderRadius: "50%", duration: 0.3 });
    gsap.to(".final-text", { opacity: 0, duration: 0.2 });

    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert("Success! Request logged.");

    setShowConfirmModal(false);
    setIsFinalSubmitting(false);
    reset();
    setPendingData(null);
  };

  return (
    <div id="contact" ref={containerRef} className="min-h-[100dvh] w-full relative font-['Nunito'] bg-[#D0BCFC] dark:bg-[#24204A] text-[#491AB1] dark:text-[#D0BCFC] overflow-x-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap'); ${globalStyles}`}</style>

      {/* CSS-Only Background (Zero JS Load) */}
      <BackgroundBlobs />

      {/* --- CONFIRMATION MODAL --- */}
      {showConfirmModal && pendingData && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
           <div className="min-h-full flex items-center justify-center w-full py-8">
            <div ref={modalRef} className="w-full max-w-lg bg-[#F0E6FF] dark:bg-[#2D2654] border-2 border-white/20 rounded-3xl shadow-2xl relative">
              <div className="p-6 pb-0">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-60 mb-2">
                  <ShieldCheck size={14} /> Final Review
                </div>
                <h2 className="text-3xl font-black">CONFIRM DETAILS</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5">
                    <p className="text-[10px] uppercase font-bold opacity-60">Client</p>
                    <p className="font-bold text-lg leading-tight truncate">{pendingData.prefix} {pendingData.name}</p>
                    <p className="text-xs opacity-70 truncate">{pendingData.email}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-green-500/30 relative flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold opacity-60">Project Budget</p>
                      <p className="font-bold text-2xl leading-tight text-green-600 dark:text-green-400">
                        {CURRENCIES[pendingData.currency].symbol}{pendingData.budget}
                      </p>
                    </div>
                    <div onClick={() => setIsCurrencyConfirmed(!isCurrencyConfirmed)} className={`mt-3 flex items-center gap-2 cursor-pointer transition-colors duration-200 select-none ${isCurrencyConfirmed ? "text-green-600" : "text-red-500/70"}`}>
                      {isCurrencyConfirmed ? <CheckSquare size={16} /> : <Square size={16} />}
                      <span className="text-[10px] font-black uppercase">I Confirm {pendingData.currency}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 max-h-32 overflow-y-auto custom-scroll">
                  <p className="text-[10px] uppercase font-bold opacity-60">Brief Message</p>
                  <p className="text-sm font-semibold opacity-90 italic">"{pendingData.message}"</p>
                </div>
              </div>

              <div className="p-6 pt-2 flex gap-4">
                <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-4 rounded-xl font-bold uppercase tracking-wider border-2 border-current opacity-60 hover:opacity-100 flex items-center justify-center gap-2">
                  <X size={18} /> Edit
                </button>
                <button onClick={handleFinalSubmit} disabled={!isCurrencyConfirmed || isFinalSubmitting} className="final-btn flex-[2] py-4 rounded-xl font-black uppercase tracking-wider bg-[#491AB1] text-[#D0BCFC] dark:bg-[#D0BCFC] dark:text-[#24204A] flex items-center justify-center gap-2 disabled:opacity-30">
                  <span className="final-text flex items-center gap-2">Confirm & Submit <CheckCircle2 size={18} /></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN FORM --- */}
      <div className={`w-full h-full min-h-[100dvh] flex items-center justify-center p-4 lg:p-6 transition-all duration-300 ${showConfirmModal ? "blur-sm" : ""}`}>
        <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-10 lg:py-0">
          
          <div className="lg:col-span-4 flex flex-col justify-center text-center lg:text-left">
            <div className="header-reveal inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-current mb-4 font-black uppercase text-[10px] tracking-widest text-green-700 dark:text-green-400">
              <ShieldCheck size={12} /> SECURE CONNECTION
            </div>
            <h1 className="header-reveal text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.9] mb-4 tracking-tight">LET'S<br />BUILD<br />FUTURE.</h1>
            <p className="header-reveal text-sm sm:text-base lg:text-lg font-bold opacity-80 mb-6 max-w-sm mx-auto lg:mx-0 leading-relaxed">EditSpaceVisuals. Precision engineering for the digital age.</p>
          </div>

          <div ref={formCardRef} className="lg:col-span-8 bg-white/30 dark:bg-[#1A1230]/30 backdrop-blur-md border border-white/20 rounded-3xl lg:rounded-[2rem] p-5 lg:p-8 shadow-xl">
            <form onSubmit={handleSubmit(onInitialSubmit)}>
              <div className="grid grid-cols-12 gap-3 lg:gap-4">
                <div className="col-span-4 md:col-span-3 lg:col-span-3">
                  <GsapSelect placeholder="Title" icon={User} options={prefixes.map((p) => ({ label: p, value: p }))} value={useWatch({ control, name: "prefix" })} onChange={(val) => setValue("prefix", val)} />
                </div>
                <div className="col-span-8 md:col-span-9 lg:col-span-9">
                  {/* Note: No 'value' prop passed here to avoid re-rendering parent on keystroke */}
                  <GsapInput icon={User} label="Full Name" name="name" register={register} error={errors.name} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                <GsapInput icon={AtSign} label="Email Address" name="email" register={register} error={errors.email} />
                <GsapInput icon={Phone} label="Phone (Optional)" name="phone" type="tel" register={register} error={errors.phone} />
              </div>

              <div className="mb-0">
                <GsapSelect placeholder="Select Service" icon={Briefcase} options={servicesList} value={selectedService} onChange={(val) => { setValue("service", val); trigger("service"); }} error={errors.service} />
              </div>

              <div className="grid grid-cols-12 gap-3 lg:gap-4">
                <div className="col-span-5 md:col-span-4">
                  <GsapSelect placeholder="Currency" icon={Globe} options={currencyList} value={selectedCurrency} onChange={(val) => { setValue("currency", val); trigger("budget"); }} error={errors.currency} />
                </div>
                <div className="col-span-7 md:col-span-8">
                   {/* Note: 'value' passed here is OK because it changes programmatically, not via typing */}
                  <GsapInput icon={DollarSign} label={currentServiceConfig ? `Budget (${currentSymbol})` : "Budget"} name="budget" type="number" min={dynamicMin} step={dynamicStep} disabled={!selectedService} register={register} error={errors.budget} helperText={currentServiceConfig ? `Min: ${currentSymbol}${dynamicMin}` : null} value={useWatch({ control, name: "budget" })} />
                </div>
              </div>

              <div className="mb-4 lg:mb-6 form-item z-0">
                <div className={`relative rounded-3xl p-4 lg:p-5 transition-all duration-300 bg-white/50 dark:bg-[#1A1230]/50 border-2 ${errors.message ? "border-red-500" : "border-transparent focus-within:border-current"}`}>
                  <div className="flex items-center gap-2 mb-1 opacity-60"><MessageSquare size={16} /><span className="text-[10px] font-bold uppercase tracking-wider">Project Details</span></div>
                  <textarea {...register("message")} rows="3" className="w-full bg-transparent outline-none font-bold text-sm lg:text-lg resize-none placeholder-current/30 text-current" placeholder="Tell us everything about your vision..."></textarea>
                </div>
                {errors.message && <p className="text-right text-[10px] text-red-500 font-bold mt-1 pr-4">{errors.message.message}</p>}
              </div>

              <button type="submit" className="submit-btn w-full py-3 lg:py-5 rounded-2xl font-black uppercase text-base lg:text-xl tracking-widest flex items-center justify-center gap-3 relative overflow-hidden bg-[#491AB1] text-[#D0BCFC] dark:bg-[#D0BCFC] dark:text-[#24204A] hover:shadow-lg transition-shadow">
                <span className="btn-text relative z-10 flex items-center gap-3">Review & Submit <ArrowRight strokeWidth={4} /></span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}