import React, { useState, useRef, useEffect } from 'react';
import { 
  Target, 
  Lightbulb, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2,
  ChevronRight,
  X,
  Scroll,
  ChevronDown
} from 'lucide-react';
import gsap from 'gsap';

// --- DATA MODEL ---
const SECTIONS = [
  {
    id: 'vision',
    number: '01',
    label: 'Vision',
    icon: Lightbulb,
    header: "Amplifying Human Potential",
    sub: "The Destination",
    content: "To redefine the digital landscape by fusing artistry, engineering, and intelligence. We set a new benchmark where technology doesn't just automate—it elevates human capability to limitless heights.",
    highlight: "Artistry + Engineering"
  },
  {
    id: 'mission',
    number: '02',
    label: 'Mission',
    icon: Target,
    header: "Enterprise-Grade Infrastructure",
    sub: "The Execution",
    content: "We bridge the gap between complex technology and strategic growth. Our mission is to empower your business with resilient, scalable digital infrastructure that allows you to lead, not just compete.",
    highlight: "Strategic Growth"
  },
  {
    id: 'principles',
    number: '03',
    label: 'Principles',
    icon: ShieldCheck,
    header: "Core Architecture",
    sub: "The Code",
    isList: true,
    items: [
      { title: "", desc: "Trust is engineered through absolute clarity." },
      { title: "", desc: "Accuracy is our baseline. Details define success." },
      { title: "", desc: "We don't follow trends. We design for what's next." }
    ]
  }
];

// --- MODAL COMPONENT ---
const ManifestoModal = ({ isOpen, onClose }) => {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, pointerEvents: 'auto' });
      gsap.fromTo(modalRef.current, 
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.2)" }
      );
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, pointerEvents: 'none' });
      gsap.to(modalRef.current, { y: 20, opacity: 0, scale: 0.95, duration: 0.3 });
    }
  }, [isOpen]);

  return (
    <div 
      ref={overlayRef} 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md opacity-0 pointer-events-none"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="w-full md:max-w-2xl bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#111827] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Scroll size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">The Digital Manifesto</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 md:p-10 space-y-6 overflow-y-auto custom-scrollbar">
          <p className="text-lg text-slate-300 font-light leading-relaxed">
            We reject the distinction between <strong className="text-white font-semibold">engineering</strong> and <strong className="text-white font-semibold">art</strong>.
          </p>
          <div className="grid gap-4 py-4">
             <div className="p-4 bg-white/5 rounded-lg border border-white/5"><p className="text-slate-400 text-sm">Systems naturally degrade. We build active resistance against technical debt.</p></div>
             <div className="p-4 bg-white/5 rounded-lg border border-white/5"><p className="text-slate-400 text-sm">Latency is a barrier to trust. We optimize for the millisecond.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- CARD COMPONENT ---
const ProfessionalCard = ({ data, isActive, onHover }) => {
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const textElementsRef = useRef([]); 
  textElementsRef.current = [];

  const addToTextRefs = (el) => {
    if (el && !textElementsRef.current.includes(el)) textElementsRef.current.push(el);
  };

  useEffect(() => {
    if (isActive && contentRef.current) {
      gsap.set(textElementsRef.current, { opacity: 0, y: 15 });
      gsap.to(textElementsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.3 
      });
    }
  }, [isActive]);

  return (
    <div 
      ref={cardRef}
      onMouseEnter={() => onHover(data.id)}
      onClick={() => onHover(data.id)}
      className={`
        relative rounded-2xl overflow-hidden cursor-default border border-white/5
        transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        will-change-[flex,width]
        h-full
        w-full md:w-auto
        ${isActive ? 'flex-[4] shadow-2xl shadow-indigo-500/10' : 'flex-[1] hover:bg-white/5'}
        ${!isActive ? 'md:hover:flex-[1.5]' : ''}
      `}
    >
      <div className={`absolute inset-0 transition-colors duration-700 ${isActive ? 'bg-[#111827]' : 'bg-[#0f172a]'}`} />
      <div className={`absolute inset-0 border rounded-2xl transition-colors duration-500 pointer-events-none z-20 ${isActive ? 'border-indigo-500/30' : 'border-white/5'}`} />

      <div className="relative h-full w-full flex flex-col md:flex-row overflow-hidden">
        
        {/* Header Strip */}
        <div className={`
          flex items-center justify-between z-10 transition-all duration-500
          w-full px-6 flex-row border-b border-white/5 md:border-b-0 shrink-0
          h-[60px] md:h-full md:w-auto md:py-8 md:px-0 md:flex-col
          ${isActive ? 'md:w-[80px] md:border-r md:border-white/5 md:bg-[#0B1120]' : 'md:w-full'}
        `}>
          <span className={`text-sm font-medium transition-colors ${isActive ? 'text-indigo-400' : 'text-white/40'}`}>{data.number}</span>
          
          <div className={`p-2 rounded-xl transition-all duration-500 ${isActive ? 'bg-indigo-500/20 text-indigo-300 scale-110' : 'text-white/50 bg-white/5'}`}>
            <data.icon size={20} strokeWidth={1.5} />
          </div>

          {!isActive && (
            <>
              <div className="hidden md:flex flex-1 items-center justify-center mt-12 animate-fadeIn">
                <span className="writing-vertical text-xs font-medium tracking-[0.2em] uppercase text-white/40">{data.label}</span>
              </div>
              <div className="md:hidden flex-1 pl-4">
                 <span className="text-sm font-medium tracking-widest uppercase text-white/50">{data.label}</span>
              </div>
            </>
          )}

          <div className="mt-auto">
             <ChevronRight size={16} className={`hidden md:block text-indigo-400 transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} />
             <ChevronDown size={16} className={`md:hidden text-indigo-400 transition-transform ${isActive ? 'rotate-180 opacity-100' : 'opacity-50'}`} />
          </div>
        </div>

        {/* Content Area */}
        {isActive && (
          <div 
            ref={contentRef} 
            className="flex-1 p-6 md:p-10 flex flex-col justify-center relative z-10 overflow-y-auto custom-scrollbar"
            style={{ opacity: 1 }} 
          >
            <div className="mb-6">
              <span ref={addToTextRefs} className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-semibold tracking-widest uppercase mb-4">
                {data.sub}
              </span>
              <h3 ref={addToTextRefs} className="text-2xl md:text-4xl font-semibold text-white tracking-tight leading-tight">
                {data.header}
              </h3>
            </div>
            
            {data.isList ? (
              <div className="grid gap-3">
                {data.items.map((item, idx) => (
                  <div key={idx} ref={addToTextRefs} className="group/item flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                    <div className="mt-1"><CheckCircle2 size={16} className="text-indigo-400 opacity-60 group-hover/item:opacity-100 transition-opacity" /></div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{item.title}</h4>
                      <p className="text-slate-400 text-xs md:text-sm mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p ref={addToTextRefs} className="text-sm md:text-lg text-slate-300 leading-relaxed font-light mb-8 max-w-2xl">
                  {data.content}
                </p>
                <div ref={addToTextRefs} className="flex items-center gap-2 text-sm font-medium text-white/80">
                  <div className="h-[1px] w-8 bg-indigo-500" />{data.highlight}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN LAYOUT ---
const VMV = () => {
  const [activeId, setActiveId] = useState('vision');
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);

  return (
    // <--- THIS ID 'vmv' IS WHAT YOUR NAVBAR TARGETS --->
    <div 
      id="vmv" 
      className="w-full h-screen max-h-screen bg-[#020617] flex flex-col items-center p-4 md:p-6 font-sans overflow-hidden"
    >
      
      <style>{`
        @media (min-width: 768px) { .writing-vertical { writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); } }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.1) transparent; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
      
      <ManifestoModal isOpen={isManifestoOpen} onClose={() => setIsManifestoOpen(false)} />

      {/* HEADER */}
      <div className="w-full max-w-6xl flex-none mb-4 md:mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Our Ethos</h2>
          <p className="text-slate-400 text-xs md:text-sm hidden md:block">The principles that govern our architecture.</p>
        </div>
        <button 
          onClick={() => setIsManifestoOpen(true)}
          className="flex items-center gap-2 text-xs md:text-sm text-indigo-400 hover:text-indigo-300 transition-colors px-3 py-1.5 rounded-full hover:bg-indigo-500/10"
        >
          Manifesto <ArrowRight size={14} />
        </button>
      </div>

      {/* CARDS CONTAINER */}
      <div className="w-full max-w-6xl flex-1 min-h-0 flex flex-col md:flex-row gap-3 md:gap-4 mb-4">
        {SECTIONS.map((section) => (
          <ProfessionalCard 
            key={section.id} 
            data={section} 
            isActive={activeId === section.id} 
            onHover={setActiveId} 
          />
        ))}
      </div>

      {/* FOOTER */}
      <div className="w-full max-w-6xl flex-none text-center md:text-left">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-medium">Designed by ESV &bull; Team Member</p>
      </div>
    </div>
  );
};

export default VMV;