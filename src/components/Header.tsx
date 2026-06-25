import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Cpu, 
  BookOpen,
  Compass,
  Briefcase,
  Layers,
  Send
} from "lucide-react";
import blackHoleLogo from "../public/og-image.jpg"
import CookieSettingsTrigger from "./CookieSettingsTrigger";


interface HeaderProps {
  canvasActive: boolean;
  activeDensity: number;
  activeDrift: number;
  activeBreathe: number;
  currentPage: "home" | "services" | "portfolio" | "blog" | "contact" | "survey";
  setCurrentPage: (page: "home" | "services" | "portfolio" | "blog" | "contact" | "survey") => void;
}


interface LetterState {
  char: string;
  isShifting: boolean;
  color: "cyan" | "magenta" | "white" | "none";
}

const GlitchText: React.FC = () => {
  const targetText = "FUSION II";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const TOTAL_TICKS = 6000; // 5 minutes (300 seconds) at 50ms intervals = 6000 ticks
  
  const createEmptyState = (): LetterState[] =>
    targetText.split("").map((c) => ({
      char: c === " " ? " " : "",
      isShifting: false,
      color: c === " " ? "white" : "none",
    }));

  const getLettersForTick = (tick: number): LetterState[] => {
    const result: LetterState[] = [];
    const totalLetters = targetText.length;
    const dissolveOffset = TOTAL_TICKS - 44;
    
    for (let i = 0; i < totalLetters; i++) {
      const targetChar = targetText[i];
      
      const spellingStart = i * 4;
      const spellingLock = i * 4 + 3;
      
      const reverseStart = dissolveOffset + (totalLetters - 1 - i) * 4;
      const reverseDissolve = dissolveOffset + (totalLetters - 1 - i) * 4 + 3;
      
      if (tick < spellingStart) {
        result.push({
          char: targetChar === " " ? " " : "",
          isShifting: false,
          color: "none",
        });
      } else if (tick < spellingLock) {
        if (targetChar === " ") {
          result.push({
            char: " ",
            isShifting: false,
            color: "white",
          });
        } else {
          const randChar = chars[Math.floor(Math.random() * chars.length)];
          const randColor = Math.random() > 0.5 ? "cyan" : "magenta";
          result.push({
            char: randChar,
            isShifting: true,
            color: randColor,
          });
        }
      } else if (tick < reverseStart) {
        // Introduce subtle organic high-tech micro-glitches during solid state
        const shouldGlitch = tick % 15 === 0 && Math.sin(tick * 0.4) > 0.82;
        if (shouldGlitch && i === Math.floor((Math.sin(tick) + 1) * 4.5)) {
          const randChar = chars[Math.floor(Math.random() * chars.length)];
          result.push({
            char: randChar,
            isShifting: true,
            color: Math.random() > 0.5 ? "cyan" : "magenta",
          });
        } else {
          result.push({
            char: targetChar,
            isShifting: false,
            color: "white",
          });
        }
      } else if (tick < reverseDissolve) {
        if (targetChar === " ") {
          result.push({
            char: "",
            isShifting: false,
            color: "none",
          });
        } else {
          const randChar = chars[Math.floor(Math.random() * chars.length)];
          const randColor = Math.random() > 0.5 ? "cyan" : "magenta";
          result.push({
            char: randChar,
            isShifting: true,
            color: randColor,
          });
        }
      } else {
        result.push({
          char: targetChar === " " ? " " : "",
          isShifting: false,
          color: "none",
        });
      }
    }
    return result;
  };

  const [letters, setLetters] = useState<LetterState[]>(createEmptyState());
  const [isGlitching, setIsGlitching] = useState(false);
  const tickRef = useRef(0);

  useEffect(() => {
    // Start with tick 0
    setLetters(getLettersForTick(0));
    const dissolveOffset = TOTAL_TICKS - 44;
    
    const interval = setInterval(() => {
      const nextTick = (tickRef.current + 1) % TOTAL_TICKS;
      tickRef.current = nextTick;
      
      // Container shake on transition boundaries
      if (nextTick === 0 || nextTick === 1 || nextTick === dissolveOffset || nextTick === (dissolveOffset + 1)) {
        setIsGlitching(true);
      } else {
        setIsGlitching(false);
      }
      
      setLetters(getLettersForTick(nextTick));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const forceReanimate = () => {
    tickRef.current = 0;
    setLetters(getLettersForTick(0));
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 150);
  };

  return (
    <span 
      className="inline-flex items-center gap-[0.02em] font-monstercat select-none tracking-widest text-[#00f3ff] cursor-pointer"
      style={{
        transform: isGlitching ? `translate(${(Math.random() - 0.5) * 1.5}px, ${(Math.random() - 0.5) * 1.5}px)` : "none"
      }}
      onMouseEnter={forceReanimate}
      onClick={forceReanimate}
      title="Hover or Click to re-animate"
    >
      {letters.map((node, i) => {
        let textClass = "text-white/20";
        if (node.color === "cyan") {
          textClass = "text-[#00cbd6] drop-shadow-[0_0_4px_rgba(0,203,214,0.65)] font-bold scale-110";
        } else if (node.color === "magenta") {
          textClass = "text-[#d946ef] drop-shadow-[0_0_4px_rgba(217,70,239,0.65)] font-bold scale-110";
        } else if (node.color === "white") {
          textClass = "text-white drop-shadow-[0_0_1px_rgba(255,255,255,0.2)] transition-colors duration-300 hover:text-[#00cbd6] hover:drop-shadow-[0_0_4px_rgba(0,203,214,0.6)]";
        }

        return (
          <span 
            key={i} 
            className={`inline-block min-w-[0.55em] text-center transition-all duration-75 ${textClass}`}
          >
            {node.char || "\u00A0"}
          </span>
        );
      })}
    </span>
  );
};


export default function Header({
  canvasActive,
  activeDensity,
  activeDrift,
  activeBreathe,
  currentPage,
  setCurrentPage,
}: HeaderProps) {
  const [isLeftNavOpen, setIsLeftNavOpen] = useState(false);

  const linkTextStyles = (isActive: boolean) =>
    `inline-block transition-all duration-300 font-display ${
      isActive
        ? "bg-gradient-to-r from-cyan-400 via-indigo-405 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-text-gradient font-bold"
        : "text-white/50 group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:via-indigo-405 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-[length:200%_auto] group-hover:animate-text-gradient group-hover:font-semibold"
    }`;

  return (
    <>
      <header 
        className="fixed top-0 left-0 z-40 w-full border-b border-white/[0.02] bg-[#030303]/15 backdrop-blur-md px-4 md:px-6 py-1.5 md:py-2 transition-all duration-300 shadow-[0_1px_12px_rgba(0,0,0,0.4)]"
        id="main-app-header"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo & Mini Tag - Interactive button that opens LEFT side bar navigation */}
          <button 
            onClick={() => setIsLeftNavOpen(true)}
            className="flex items-center gap-5 text-left focus:outline-none hover:opacity-90 transition-all cursor-pointer group relative -ml-1 p-1 rounded-xl hover:bg-white/[0.02]"
            title="Open Control Panel"
            id="brand-menu-trigger"
          >
            <div className="w-9 h-9 flex items-center justify-center relative overflow-visible bg-transparent transition-all duration-300">
              {/* Soft cosmic glow matching the accretion colors */}
              <div className="absolute inset-[-4px] bg-gradient-to-r from-[#00f3ff]/15 to-[#d946ef]/15 rounded-full blur-lg filter opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 animate-pulse pointer-events-none" style={{ animationDuration: "5s" }} />
              
              {/* High precision widescreen black hole logo */}
              <img 
                src={blackHoleLogo} 
                alt="Logo" 
                style={{ height: '36px', width: 'auto' }} 
                className="relative z-10 select-none pointer-events-none transition-all duration-300 group-hover:scale-105"
              />
            </div>

            
            <div className="flex flex-col select-none">
              <span className="font-monstercat font-black tracking-[0.16em] text-sm md:text-base leading-none mb-1">
                <GlitchText />
              </span>
              <span className="font-mono text-[8.5px] tracking-[0.18em] text-[#8e8e89] uppercase flex items-center gap-1.5 leading-none">
                <span>WEB</span>
                <span className="text-[#8e8e89]/40 font-bold">•</span>
                <span>AI</span>
                <span className="text-[#8e8e89]/40 font-bold">•</span>
                <span>DESIGN</span>
              </span>
            </div>
          </button>

          {/* Centralized & Aesthetic Desktop Navigation - Centered, Spaced Out, Glassy */}
          <nav className="hidden md:flex items-center gap-10 p-2 px-6 bg-[#030303]/40 border border-white/[0.05] rounded-full backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] md:absolute md:left-1/2 md:-translate-x-1/2">
            <button 
              onClick={() => setCurrentPage("home")}
              className="group flex items-center gap-2 px-4 py-1.5 rounded-full font-display text-[10px] font-semibold tracking-widest transition-all duration-300 relative cursor-pointer"
            >
              <Compass className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-45 ${currentPage === "home" ? "text-white" : "text-white/40 group-hover:text-white/80"}`} />
              <span className={linkTextStyles(currentPage === "home")}>HOME</span>
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.7)] ${currentPage === "home" ? "opacity-100" : "opacity-0"}`} />
            </button>
            
            <button 
              onClick={() => setCurrentPage("services")}
              className="group flex items-center gap-2 px-4 py-1.5 rounded-full font-display text-[10px] font-semibold tracking-widest transition-all duration-300 relative cursor-pointer"
            >
              <Layers className={`w-3.5 h-3.5 transition-transform duration-300 ${currentPage === "services" ? "text-white" : "text-white/40 group-hover:text-white/80"}`} />
              <span className={linkTextStyles(currentPage === "services")}>SERVICES</span>
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.7)] ${currentPage === "services" ? "opacity-100" : "opacity-0"}`} />
            </button>
            
            <button 
              onClick={() => setCurrentPage("portfolio")}
              className="group flex items-center gap-2 px-4 py-1.5 rounded-full font-display text-[10px] font-semibold tracking-widest transition-all duration-300 relative cursor-pointer"
            >
              <Briefcase className={`w-3.5 h-3.5 transition-transform duration-300 ${currentPage === "portfolio" ? "text-white" : "text-white/40 group-hover:text-white/80"}`} />
              <span className={linkTextStyles(currentPage === "portfolio")}>PORTFOLIO</span>
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.7)] ${currentPage === "portfolio" ? "opacity-100" : "opacity-0"}`} />
            </button>
            
            <button 
              onClick={() => setCurrentPage("blog")}
              className={`group flex items-center gap-2 px-4 py-1.5 rounded-full font-display text-[10px] font-semibold tracking-widest bg-white/[0.02] hover:bg-white/[0.06] border transition-all duration-300 cursor-pointer shadow-[0_0_12px_rgba(255,255,255,0.02)] ${
                currentPage === "blog" ? "border-white/30" : "border-white/10 hover:border-white/20"
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-105 ${currentPage === "blog" ? "text-white" : "text-white/40 group-hover:text-white/80"}`} />
              <span className={linkTextStyles(currentPage === "blog")}>BLOG</span>
            </button>
 
            <button 
              onClick={() => setCurrentPage("contact")}
              className="group flex items-center gap-2 px-4 py-1.5 rounded-full font-display text-[10px] font-semibold tracking-widest transition-all duration-300 relative cursor-pointer"
            >
              <Send className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110 ${currentPage === "contact" ? "text-white" : "text-white/40 group-hover:text-white/80"}`} />
              <span className={linkTextStyles(currentPage === "contact")}>CONTACT</span>
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.7)] ${currentPage === "contact" ? "opacity-100" : "opacity-0"}`} />
            </button>
          </nav>
 
          {/* Right Panel - Simple & Minimalist with Privacy Configuration Trigger */}
          <div className="flex items-center gap-3">
            <CookieSettingsTrigger />

            {/* Quick Menu Button for Mobile Only */}
            <button 
              onClick={() => setIsLeftNavOpen(true)}
              className="md:hidden flex items-center justify-center p-2 rounded-lg border border-white/10 bg-white/[0.01] hover:bg-white/[0.04] transition-all text-white/70"
              aria-label="Open left sidebar"
              id="top-navbar-hamburger"
            >
              <div className="flex flex-col gap-1 w-4 h-3.5 justify-between py-0.5">
                <span className="w-4 h-0.5 bg-white/70 rounded-full" />
                <span className="w-3 h-0.5 bg-white/70 rounded-full ml-auto" />
                <span className="w-4 h-0.5 bg-white/70 rounded-full" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Re-designed Left Sidebar Navigation Drawer */}
      <AnimatePresence>
        {isLeftNavOpen && (
          <div className="fixed inset-0 z-50 flex justify-start">
            {/* Soft Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLeftNavOpen(false)}
              className="absolute inset-0 bg-[#000000]/55 backdrop-blur-sm"
            />

            {/* Translucent Drawer Panel */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="relative w-full max-w-sm h-full bg-[#030303]/60 backdrop-blur-3xl border-r border-white/[0.05] flex flex-col shadow-2xl relative overflow-hidden"
            >
              {/* Backing dynamic color glow */}
              <div className="absolute top-1/3 left-0 w-64 h-64 bg-cyan-500/[0.03] rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-purple-500/[0.03] rounded-full blur-3xl pointer-events-none" />

              {/* Drawer Header */}
              <div className="p-6 border-b border-white/[0.04] flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-md bg-gradient-to-tr from-cyan-400 to-indigo-500 animate-pulse" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#8e8e89] font-semibold">
                    NAVIGATION PORTAL
                  </span>
                </div>
                
                <button 
                  onClick={() => setIsLeftNavOpen(false)}
                  className="p-1 px-3 rounded-full border border-white/10 bg-white/[0.01] hover:bg-white/10 text-white/60 hover:text-white transition-all font-mono text-[10px] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>CLOSE</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Drawer Main Destination Links */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between relative z-10">
                <div className="space-y-8 pt-4">
                  <div className="space-y-1">
                    <h3 className="font-serif italic text-2xl text-white/50 pl-2">Creative Index</h3>
                    <div className="h-[1px] w-12 bg-white/10 ml-2" />
                  </div>

                  <nav className="space-y-2" id="left-sidebar-navigation-items">
                    <button
                      onClick={() => {
                        setCurrentPage("home");
                        setIsLeftNavOpen(false);
                      }}
                      className="w-full text-left flex items-center justify-between p-4 rounded-xl border border-white/[0.02] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all font-display group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-white/30 font-semibold">01 /</span>
                        <span className={linkTextStyles(currentPage === "home")}>HOME</span>
                      </div>
                      <Compass className={`w-4 h-4 transition-all ${currentPage === "home" ? "text-white rotate-45" : "text-white/20 group-hover:text-white group-hover:rotate-45"}`} />
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage("services");
                        setIsLeftNavOpen(false);
                      }}
                      className="w-full text-left flex items-center justify-between p-4 rounded-xl border border-white/[0.02] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all font-display group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-white/30 font-semibold">02 /</span>
                        <span className={linkTextStyles(currentPage === "services")}>SERVICES</span>
                      </div>
                      <Layers className={`w-4 h-4 transition-all ${currentPage === "services" ? "text-white" : "text-white/20 group-hover:text-white"}`} />
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage("portfolio");
                        setIsLeftNavOpen(false);
                      }}
                      className="w-full text-left flex items-center justify-between p-4 rounded-xl border border-white/[0.02] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all font-display group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-white/30 font-semibold">03 /</span>
                        <span className={linkTextStyles(currentPage === "portfolio")}>PORTFOLIO</span>
                      </div>
                      <Briefcase className={`w-4 h-4 transition-all ${currentPage === "portfolio" ? "text-white" : "text-white/20 group-hover:text-white"}`} />
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage("blog");
                        setIsLeftNavOpen(false);
                      }}
                      className="w-full text-left flex items-center justify-between p-4 rounded-xl border border-white/[0.02] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all font-display group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-white/20 font-semibold">04 /</span>
                        <span className={linkTextStyles(currentPage === "blog")}>BLOG</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[8px] bg-white/[0.04] border border-white/10 px-1 rounded text-white/40">HOT</span>
                        <BookOpen className={`w-4 h-4 transition-all ${currentPage === "blog" ? "text-white" : "text-white/20 group-hover:text-white"}`} />
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentPage("contact");
                        setIsLeftNavOpen(false);
                      }}
                      className="w-full text-left flex items-center justify-between p-4 rounded-xl border border-white/[0.02] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all font-display group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-white/30 font-semibold">05 /</span>
                        <span className={linkTextStyles(currentPage === "contact")}>CONTACT</span>
                      </div>
                      <Send className={`w-4 h-4 transition-all ${currentPage === "contact" ? "text-white" : "text-white/20 group-hover:text-white"}`} />
                    </button>
                  </nav>
                </div>

                {/* Left Drawer Minimal Footer Spec info */}
                <div className="border-t border-white/[0.04] pt-6 font-mono text-[9px] text-[#8e8e89] space-y-1">
                  <div className="flex items-center justify-between">
                    <span>SYS HARDWARE STATE</span>
                    <span className="text-emerald-400">OPTIMAL</span>
                  </div>
                  <p className="text-[8px] opacity-40 leading-normal">
                    FUSION-II interactive canvas cluster with velvet dynamic procedural lightning system, custom designed overlay systems.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

