import React, { useState, useEffect, useRef } from "react";
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

// --- 1. CONFIGURATION & LOGIC ---

const BASE_SERVICES_CONFIG = {
  "Web Development": { label: "Web Design & Dev", min: 5000, step: 1000 },
  "Graphic Design": {
    label: "Graphic Design & Photo Editing",
    min: 250,
    step: 50,
  },
  "Video Editing": { label: "Video Editing", min: 500, step: 100 },
  WordPress: { label: "WordPress Website Design", min: 3000, step: 500 },
  Trading: { label: "Trading Expertise", min: 3000, step: 500 },
  "Digital Marketing": { label: "Digital Marketing", min: 2000, step: 400 },
  "AI Dev": { label: "AI & Bot Development", min: 4000, step: 1000 },
  "Course Platform": {
    label: "Course Providing & Teaching Platform",
    min: 10000,
    step: 2000,
  },
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

// Security & Validation
const PROHIBITED_WORDS = [
  "spam",
  "casino",
  "crypto",
  "bitcoin",
  "hack",
  "cheat",
  "xyz",
  "cheap",
  "abuse",
  "stupid",
];
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
    name: z
      .string()
      .trim()
      .min(3, "Name too short")
      .max(50)
      .regex(NAME_REGEX, "Letters only")
      .refine((val) => val.trim().indexOf(" ") !== -1, {
        message: "Enter Full Name",
      }),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email")
      .refine((val) => !val.endsWith(".xyz") && !val.endsWith(".top"), {
        message: "Suspicious domain",
      }),
    phone: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => {
          if (!val) return true;
          const digitCount = val.replace(/\D/g, "").length;
          return digitCount >= 7 && digitCount <= 15;
        },
        { message: "Invalid Phone (7-15 digits)" }
      ),
    service: z.string().min(1, "Select a service"),
    currency: z.string(),
    budget: z.number({ invalid_type_error: "Enter amount" }),
    message: z
      .string()
      .trim()
      .min(20, "Min 20 chars required")
      .max(2000)
      .refine(
        (val) => {
          const lower = val.toLowerCase();
          const found = PROHIBITED_WORDS.find((word) => lower.includes(word));
          return !found;
        },
        { message: "Policy violation detected." }
      ),
  })
  .superRefine((data, ctx) => {
    const config = BASE_SERVICES_CONFIG[data.service];
    if (config) {
      const minAmount = convertValue(config.min, data.currency);
      const symbol = CURRENCIES[data.currency].symbol;
      if (data.budget < minAmount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["budget"],
          message: `Min ${symbol}${minAmount} required`,
        });
      }
    }
  });

// --- 2. SUB-COMPONENTS ---

const GsapInput = ({
  label,
  error,
  register,
  name,
  icon: Icon,
  type = "text",
  helperText,
  ...props
}) => {
  const containerRef = useRef(null);
  const [focused, setFocused] = useState(false);

  useGSAP(
    () => {
      if (focused || props.value) {
        gsap.to(containerRef.current, {
          scale: 1.02,
          duration: 0.4,
          ease: "back.out(1.7)",
          borderColor: "currentColor",
        });
        gsap.to(".icon-ref", { opacity: 1, scale: 1.1, duration: 0.3 });
      } else {
        gsap.to(containerRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          borderColor: "transparent",
        });
        gsap.to(".icon-ref", { opacity: 0.5, scale: 1, duration: 0.3 });
      }
    },
    { scope: containerRef, dependencies: [focused, props.value] }
  );

  useGSAP(
    () => {
      if (error) {
        gsap.fromTo(
          ".error-msg",
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.3 }
        );
      }
    },
    { scope: containerRef, dependencies: [!!error] }
  );

  return (
    <div className="relative mb-3 lg:mb-4 form-item z-0" ref={containerRef}>
      <div
        className={`flex items-center rounded-xl lg:rounded-2xl px-3 py-3 lg:px-4 lg:py-4 transition-colors duration-300 bg-white/50 dark:bg-[#1A1230]/50 border-2 ${
          error ? "border-red-500" : "border-transparent"
        }`}
      >
        <div className="icon-ref mr-3 opacity-50">
          <Icon size={18} />
        </div>
        <div className="flex-1 relative h-full">
          <label className="block text-[9px] lg:text-[10px] xl:text-xs font-bold uppercase tracking-wider mb-0.5 opacity-60 pointer-events-none select-none">
            {label}
          </label>
          <input
            {...register(name, { valueAsNumber: type === "number" })}
            type={type}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur && props.onBlur(e);
            }}
            className="w-full bg-transparent outline-none font-bold text-sm lg:text-base xl:text-lg placeholder-transparent text-current h-5 lg:h-6"
            placeholder={label}
            {...props}
          />
        </div>
        {!error && focused && props.value && (
          <ShieldCheck
            size={16}
            className="text-green-500 opacity-60 animate-pulse"
          />
        )}
      </div>
      {helperText && !error && (
        <div className="text-[9px] lg:text-[10px] font-bold opacity-60 text-right px-2 mt-1">
          {helperText}
        </div>
      )}
      {error && (
        <div className="error-msg overflow-hidden">
          <p className="text-right text-[10px] text-red-500 font-bold mt-1 pr-2">
            {error.message}
          </p>
        </div>
      )}
    </div>
  );
};

const GsapSelect = ({
  value,
  onChange,
  options,
  error,
  icon: Icon,
  placeholder,
}) => {
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useGSAP(
    () => {
      if (isOpen) {
        gsap.to(containerRef.current, {
          borderColor: "currentColor",
          duration: 0.3,
        });
        gsap.to(".arrow-icon", { rotation: 180, duration: 0.3 });
        gsap.set(dropdownRef.current, { display: "block" });
        gsap.fromTo(
          dropdownRef.current,
          { y: 10, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.2)" }
        );
      } else {
        gsap.to(containerRef.current, {
          borderColor: "transparent",
          duration: 0.3,
        });
        gsap.to(".arrow-icon", { rotation: 0, duration: 0.3 });
        gsap.to(dropdownRef.current, {
          y: 10,
          opacity: 0,
          scale: 0.95,
          duration: 0.2,
          onComplete: () => gsap.set(dropdownRef.current, { display: "none" }),
        });
      }
    },
    { scope: containerRef, dependencies: [isOpen] }
  );

  return (
    <div
      className={`relative mb-3 lg:mb-4 form-item ${isOpen ? "z-50" : "z-0"}`}
      ref={containerRef}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between rounded-xl lg:rounded-2xl px-3 py-3.5 lg:px-4 lg:py-5 cursor-pointer bg-white/50 dark:bg-[#1A1230]/50 border-2 border-transparent select-none ${
          error ? "border-red-500" : ""
        }`}
      >
        <div className="flex items-center gap-2 lg:gap-3 overflow-hidden">
          <Icon size={18} className="opacity-50 min-w-[18px]" />
          <span
            className={`font-bold text-sm lg:text-base xl:text-lg truncate ${
              !value && "opacity-50"
            }`}
          >
            {options.find((o) => o.value === value)?.label || placeholder}
          </span>
        </div>
        <ChevronDown size={18} className="arrow-icon min-w-[18px]" />
      </div>
      <div
        ref={dropdownRef}
        className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl shadow-2xl bg-[#F0E6FF] dark:bg-[#2D2654] border-2 border-current hidden max-h-48 overflow-y-auto z-[100]"
      >
        {options.map((opt) => (
          <div
            key={opt.value}
            onClick={() => {
              onChange(opt.value);
              setIsOpen(false);
            }}
            className="px-4 py-3 cursor-pointer rounded-xl font-bold text-xs lg:text-sm hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {opt.label}
          </div>
        ))}
      </div>
      {error && (
        <div className="error-msg overflow-hidden">
          <p className="text-right text-[10px] text-red-500 font-bold mt-1 pr-2">
            {error.message}
          </p>
        </div>
      )}
    </div>
  );
};

// --- 3. MAIN FORM ---
export default function Contact() {
  const containerRef = useRef(null);
  const formCardRef = useRef(null);
  const modalRef = useRef(null);

  // Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [isFinalSubmitting, setIsFinalSubmitting] = useState(false);
  const [isCurrencyConfirmed, setIsCurrencyConfirmed] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
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

  const selectedService = useWatch({ control, name: "service" });
  const selectedCurrency = useWatch({ control, name: "currency" });
  const watchedName = useWatch({ control, name: "name" });
  const currentServiceConfig = selectedService
    ? BASE_SERVICES_CONFIG[selectedService]
    : null;
  const currentSymbol = CURRENCIES[selectedCurrency]?.symbol || "₹";
  const dynamicMin = currentServiceConfig
    ? convertValue(currentServiceConfig.min, selectedCurrency)
    : 0;
  const dynamicStep = currentServiceConfig
    ? convertValue(currentServiceConfig.step, selectedCurrency)
    : 100;

  useEffect(() => {
    if (selectedService) {
      setValue("budget", dynamicMin);
      trigger("budget");
    }
  }, [selectedService, selectedCurrency, setValue, trigger, dynamicMin]);

  useGSAP(
    () => {
      const blobs = gsap.utils.toArray(".bg-blob");
      blobs.forEach((blob) => {
        gsap.to(blob, {
          x: "random(-100, 100)",
          y: "random(-50, 50)",
          scale: "random(0.8, 1.2)",
          rotation: "random(-20, 20)",
          duration: "random(10, 20)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".header-reveal", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
      })
        .from(
          formCardRef.current,
          { x: 30, opacity: 0, scale: 0.98, duration: 0.8, clearProps: "all" },
          "-=0.6"
        )
        .from(
          ".form-item",
          { y: 20, opacity: 0, duration: 0.5, stagger: 0.05 },
          "-=0.4"
        )
        .from(
          ".submit-btn",
          { scale: 0, opacity: 0, duration: 0.5, ease: "back.out(1.5)" },
          "-=0.2"
        );
    },
    { scope: containerRef }
  );

  useGSAP(() => {
    if (showConfirmModal) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.2)" }
      );
    }
  }, [showConfirmModal]);

  const onInitialSubmit = (data) => {
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

    alert(
      "TRANSMISSION RECEIVED.\n\nThe EditSpaceVisuals Team has successfully logged your request.\nOur specialists will review your details and contact you shortly."
    );

    setShowConfirmModal(false);
    setIsFinalSubmitting(false);

    reset({
      prefix: "Mr.",
      name: "",
      email: "",
      phone: "",
      service: "",
      currency: "INR",
      budget: 0,
      message: "",
    });
    setPendingData(null);
  };

  return (
    <div
      id="contact"
      ref={containerRef}
      // CHANGED: min-h-[100dvh] handles mobile browsers better than h-screen
      // CHANGED: overflow-y-auto ensures the page scrolls naturally
      className="min-h-[100dvh] w-full relative font-['Nunito'] bg-[#D0BCFC] dark:bg-[#24204A] text-[#491AB1] dark:text-[#D0BCFC] overflow-x-hidden"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="bg-blob absolute rounded-full blur-[60px] lg:blur-[80px] opacity-40 mix-blend-multiply dark:mix-blend-screen bg-[#491AB1] w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] top-[-10%] left-[-10%]" />
        <div className="bg-blob absolute rounded-full blur-[60px] lg:blur-[80px] opacity-30 mix-blend-screen bg-[#FFFFFF] w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] top-[40%] left-[60%]" />
        <div className="bg-blob absolute rounded-full blur-[60px] lg:blur-[80px] opacity-40 mix-blend-multiply dark:mix-blend-screen bg-[#491AB1] w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] top-[80%] left-[10%]" />
      </div>

      {/* --- CONFIRMATION MODAL OVERLAY --- */}
      {showConfirmModal && pendingData && (
        // CHANGED: Fixed positioning + overflow-y-auto for safe scrolling on small screens
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md overflow-y-auto">
           {/* Wrapper to center content if screen is tall, or scroll if screen is short */}
           <div className="min-h-full flex items-center justify-center w-full py-8">
            <div
              ref={modalRef}
              className="w-full max-w-lg bg-[#F0E6FF] dark:bg-[#2D2654] border-2 border-white/20 rounded-3xl lg:rounded-[2rem] shadow-2xl overflow-hidden text-[#491AB1] dark:text-[#D0BCFC] relative"
            >
              {/* Header */}
              <div className="p-5 lg:p-6 pb-0">
                <div className="flex items-center gap-2 text-xs lg:text-sm font-black uppercase tracking-widest opacity-60 mb-2">
                  <ShieldCheck size={14} className="lg:w-4 lg:h-4" /> Final Review
                </div>
                <h2 className="text-2xl lg:text-3xl font-black leading-tight">
                  CONFIRM DETAILS
                </h2>
              </div>

              {/* Data Summary */}
              <div className="p-5 lg:p-6 space-y-3 lg:space-y-4">
                {/* CHANGED: grid-cols-1 for mobile, grid-cols-2 for desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5">
                    <p className="text-[10px] uppercase font-bold opacity-60">
                      Client
                    </p>
                    <p className="font-bold text-base lg:text-lg leading-tight truncate">
                      {pendingData.prefix} {pendingData.name}
                    </p>
                    <p className="text-xs opacity-70 truncate">
                      {pendingData.email}
                    </p>
                  </div>

                  {/* HIGHLIGHTED BUDGET BOX */}
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-green-500/30 relative flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold opacity-60">
                        Project Budget
                      </p>
                      <p className="font-bold text-xl lg:text-2xl leading-tight text-green-600 dark:text-green-400">
                        {CURRENCIES[pendingData.currency].symbol}
                        {pendingData.budget}
                      </p>
                    </div>

                    <div
                      onClick={() => setIsCurrencyConfirmed(!isCurrencyConfirmed)}
                      className={`mt-3 flex items-center gap-2 cursor-pointer transition-colors duration-200 select-none ${
                        isCurrencyConfirmed
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-500/70 hover:text-red-500"
                      }`}
                    >
                      {isCurrencyConfirmed ? (
                        <CheckSquare size={16} />
                      ) : (
                        <Square size={16} />
                      )}
                      <span className="text-[10px] font-black uppercase">
                        I Confirm {pendingData.currency}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5">
                  <p className="text-[10px] uppercase font-bold opacity-60">
                    Selected Service
                  </p>
                  <p className="font-bold text-base lg:text-lg">
                    {BASE_SERVICES_CONFIG[pendingData.service]?.label}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 max-h-32 overflow-y-auto custom-scroll">
                  <p className="text-[10px] uppercase font-bold opacity-60">
                    Brief Message
                  </p>
                  <p className="text-sm font-semibold opacity-90 leading-relaxed italic">
                    "{pendingData.message}"
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 lg:p-6 pt-2 flex flex-col sm:flex-row gap-3 lg:gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full sm:flex-1 py-3 lg:py-4 rounded-xl font-bold uppercase tracking-wider border-2 border-current opacity-60 hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-sm lg:text-base"
                >
                  <X size={18} /> Edit
                </button>

                <button
                  onClick={handleFinalSubmit}
                  disabled={!isCurrencyConfirmed || isFinalSubmitting}
                  className="final-btn w-full sm:flex-[2] py-3 lg:py-4 rounded-xl font-black uppercase tracking-wider bg-[#491AB1] text-[#D0BCFC] dark:bg-[#D0BCFC] dark:text-[#24204A] hover:shadow-lg transition-all flex items-center justify-center gap-2 relative overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed text-sm lg:text-base"
                >
                  <span className="final-text flex items-center gap-2">
                    {isFinalSubmitting ? (
                      ""
                    ) : (
                      <>
                        Confirm & Submit <CheckCircle2 size={18} />
                      </>
                    )}
                  </span>
                  {isFinalSubmitting && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN FORM --- */}
      <div
        className={`w-full h-full min-h-[100dvh] flex items-center justify-center p-4 lg:p-6 transition-all duration-500 ${
          showConfirmModal ? "blur-sm" : ""
        }`}
      >
        <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-10 lg:py-0">
          
          {/* LEFT SIDE: Heading (Centers on Mobile, Left on Desktop) */}
          <div className="lg:col-span-4 flex flex-col justify-center text-center lg:text-left">
            <div>
              <div className="header-reveal inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-current mb-4 font-black uppercase text-[9px] lg:text-[10px] tracking-widest text-green-700 dark:text-green-400">
                <ShieldCheck size={12} /> SECURE CONNECTION
              </div>
              <h1 className="header-reveal text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.9] mb-4 tracking-tight">
                LET'S
                <br />
                BUILD
                <br />
                FUTURE.
              </h1>
              <p className="header-reveal text-sm sm:text-base lg:text-lg font-bold opacity-80 mb-6 max-w-sm mx-auto lg:mx-0 leading-relaxed">
                EditSpaceVisuals. Precision engineering for the digital age.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: Form Card */}
          <div
            ref={formCardRef}
            className="lg:col-span-8 bg-white/30 dark:bg-[#1A1230]/30 backdrop-blur-md border border-white/20 rounded-3xl lg:rounded-[2rem] p-5 lg:p-8 shadow-2xl"
          >
            <form onSubmit={handleSubmit(onInitialSubmit)}>
              
              {/* Row 1: Prefix + Name (Optimized for Mobile Row) */}
              <div className="grid grid-cols-12 gap-3 lg:gap-4">
                <div className="col-span-4 md:col-span-3 lg:col-span-3">
                  <GsapSelect
                    placeholder="Title"
                    icon={User}
                    options={prefixes.map((p) => ({ label: p, value: p }))}
                    value={useWatch({ control, name: "prefix" })}
                    onChange={(val) => setValue("prefix", val)}
                  />
                </div>
                <div className="col-span-8 md:col-span-9 lg:col-span-9">
                  <GsapInput
                    icon={User}
                    label="Full Name"
                    name="name"
                    register={register}
                    error={errors.name}
                    value={watchedName}
                  />
                </div>
              </div>

              {/* Row 2: Email + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                <GsapInput
                  icon={AtSign}
                  label="Email Address"
                  name="email"
                  register={register}
                  error={errors.email}
                  value={useWatch({ control, name: "email" })}
                />
                <GsapInput
                  icon={Phone}
                  label="Phone (Optional)"
                  name="phone"
                  type="tel"
                  register={register}
                  error={errors.phone}
                  value={useWatch({ control, name: "phone" })}
                />
              </div>

              {/* Row 3: Service */}
              <div className="mb-0">
                <GsapSelect
                  placeholder="Select Service"
                  icon={Briefcase}
                  options={servicesList}
                  value={selectedService}
                  onChange={(val) => {
                    setValue("service", val);
                    trigger("service");
                  }}
                  error={errors.service}
                />
              </div>

              {/* Row 4: Currency + Budget */}
              <div className="grid grid-cols-12 gap-3 lg:gap-4">
                <div className="col-span-5 md:col-span-4">
                  <GsapSelect
                    placeholder="Currency"
                    icon={Globe}
                    options={currencyList}
                    value={selectedCurrency}
                    onChange={(val) => {
                      setValue("currency", val);
                      trigger("budget");
                    }}
                    error={errors.currency}
                  />
                </div>
                <div className="col-span-7 md:col-span-8">
                  <GsapInput
                    icon={DollarSign}
                    label={
                      currentServiceConfig
                        ? `Budget (${currentSymbol})`
                        : "Budget"
                    }
                    name="budget"
                    type="number"
                    min={dynamicMin}
                    step={dynamicStep}
                    disabled={!selectedService}
                    register={register}
                    error={errors.budget}
                    helperText={
                      currentServiceConfig
                        ? `Min: ${currentSymbol}${dynamicMin}`
                        : null
                    }
                    value={useWatch({ control, name: "budget" })}
                  />
                </div>
              </div>

              {/* Row 5: Message */}
              <div className="mb-4 lg:mb-6 form-item z-0">
                <div
                  className={`relative rounded-3xl p-4 lg:p-5 transition-all duration-300 bg-white/50 dark:bg-[#1A1230]/50 border-2 ${
                    errors.message
                      ? "border-red-500"
                      : "border-transparent focus-within:border-current"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 opacity-60">
                    <MessageSquare size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Project Details
                    </span>
                  </div>
                  <textarea
                    {...register("message")}
                    rows="3"
                    className="w-full bg-transparent outline-none font-bold text-sm lg:text-lg resize-none placeholder-current/30 text-current"
                    placeholder="Tell us everything about your vision..."
                  ></textarea>
                </div>
                {errors.message && (
                  <p className="text-right text-[10px] text-red-500 font-bold mt-1 pr-4">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-btn w-full py-3 lg:py-5 rounded-2xl font-black uppercase text-base lg:text-xl tracking-widest flex items-center justify-center gap-3 relative overflow-hidden bg-[#491AB1] text-[#D0BCFC] dark:bg-[#D0BCFC] dark:text-[#24204A] hover:shadow-lg transition-shadow"
              >
                <span className="btn-text relative z-10 flex items-center gap-3">
                  Review & Submit <ArrowRight strokeWidth={4} />
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}