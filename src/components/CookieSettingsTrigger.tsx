import { useState, useRef, useEffect } from "react";
import { Shield, Settings, FileText, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function CookieSettingsTrigger() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown if user clicks outside of the trigger container
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpenCookies = () => {
    window.dispatchEvent(new Event("fusion_open_cookie_banner"));
    setIsDropdownOpen(false);
  };

  const handleOpenPolicy = () => {
    window.dispatchEvent(new Event("fusion_open_privacy_policy"));
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Target Minimalist Shield Trigger */}
      <motion.button
        id="cookie-settings-trigger-btn"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.04)" }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        title="Privacy & Cookie Controls"
        aria-label="Privacy and Cookie Controls"
        aria-haspopup="menu"
        aria-expanded={isDropdownOpen}
        className={`flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.02] border transition-all cursor-pointer relative ${
          isDropdownOpen 
            ? "border-cyan-500/40 text-cyan-400 bg-cyan-500/5 shadow-[0_0_12px_rgba(6,182,212,0.15)]" 
            : "border-white/5 text-[#8e8e89] hover:border-cyan-500/20 hover:text-cyan-400/90"
        }`}
      >
        <Shield className="w-4 h-4" />
        
        {/* Living notification beacon dot */}
        <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
        </span>
      </motion.button>

      {/* Cybernetic Menu Dropdown */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            role="menu"
            className="absolute right-0 mt-2 w-56 bg-[#09090b]/95 backdrop-blur-xl border border-white/[0.08] shadow-[0_12px_30px_rgba(0,0,0,0.8)] rounded-lg py-1.5 z-[9999] overflow-hidden"
          >
            {/* Top accent glow divider */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-cyan-500/40 to-indigo-500/40" />
            
            <div className="px-3 py-1.5 mb-1 border-b border-white/[0.04]">
              <span className="text-[9px] font-mono tracking-wider text-white/30 uppercase block">Privacy Core Engine</span>
            </div>

            {/* Option 1: Configure Cookies */}
            <button
              onClick={handleOpenCookies}
              role="menuitem"
              className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-white/[0.03] text-white/80 hover:text-white font-sans text-xs transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-cyan-400/80 group-hover:text-cyan-400 transition-colors" />
                <span>Configure Cookies</span>
              </div>
              <ChevronRight className="w-3 h-3 text-[#555] group-hover:text-[#888] transition-colors" />
            </button>

            {/* Option 2: View Privacy Policy */}
            <button
              onClick={handleOpenPolicy}
              role="menuitem"
              className="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-white/[0.03] text-white/80 hover:text-white font-sans text-xs transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-indigo-400/80 group-hover:text-indigo-400 transition-colors" />
                <span>View Privacy Policy</span>
              </div>
              <ChevronRight className="w-3 h-3 text-[#555] group-hover:text-[#888] transition-colors" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
