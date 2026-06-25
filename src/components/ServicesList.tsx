import { 
  Globe, Cpu, ArrowRight, Sparkles, Database, Server, Zap 
} from "lucide-react";
import { motion } from "motion/react";

interface ServiceItem {
  index: string;
  title: string;
  sub: string;
  description: string;
  capabilities: string[];
  stack: string[];
  timeframe: string;
  price?: string;
  recurring?: string;
  popular?: boolean;
}

interface ServicesListProps {
  onChangePage?: (page: "home" | "services" | "portfolio" | "blog" | "contact" | "survey") => void;
}

export default function ServicesList({ onChangePage }: ServicesListProps) {
  const coreServices: ServiceItem[] = [
    {
      index: "01",
      title: "Fusion Launch",
      sub: "A clean, high-performance website to establish your online presence.",
      description: "A clean, high-performance website to establish your online presence.",
      capabilities: [
        "Up to 8 pages",
        "Custom design",
        "Mobile responsive",
        "Hosting & maintenance"
      ],
      stack: ["React SPA", "Vite Builder", "Vercel Hosting", "SEO Meta Config"],
      timeframe: "3-5 days"
    },
    {
      index: "02",
      title: "Fusion Core",
      sub: "A full web application with dynamic features and user functionality.",
      description: "A full web application with dynamic features and user functionality.",
      popular: true,
      capabilities: [
        "Full web application",
        "User auth & dashboard",
        "Database integration",
        "Hosting & maintenance",
        "Priority support"
      ],
      stack: ["Supabase Auth", "Supabase Database", "Vercel / Hetzner", "Express Backend API"],
      timeframe: "7-12 days"
    },
    {
      index: "03",
      title: "Fusion Nexus",
      sub: "Web application bundled with Echo Forge assist – the complete package.",
      description: "Web application bundled with Echo Forge assist – the complete package.",
      capabilities: [
        "Everything in FUSION CORE",
        "Advanced integrations",
        "3D design",
        "Echo Forge assist"
      ],
      stack: ["Three.js / WebGL Display", "Cloudflare Workers & Grok", "Supabase Multi-Tenant", "Vercel / Hetzner Platform"],
      timeframe: "14-25 days"
    }
  ];

  const forgeServices: ServiceItem[] = [
    {
      index: "01",
      title: "Echo Forge Assist",
      sub: "Your first AI agent – automating a core business workflow.",
      description: "Your first AI agent – automating a core business workflow.",
      capabilities: [
        "1 custom AI agent",
        "Single workflow automation",
        "Basic integrations",
        "Handover & training"
      ],
      stack: ["Grok API Engine", "Cloudflare Workers", "Supabase Database", "Handover Guides"],
      timeframe: "3-5 days"
    },
    {
      index: "02",
      title: "Echo Forge Sync",
      sub: "Multi-agent system handling complex, multi-step business processes.",
      description: "Multi-agent system handling complex, multi-step business processes.",
      capabilities: [
        "Up to 2 AI agents",
        "Multi-step automation",
        "Advanced integrations",
        "Priority support",
        "Handover & training"
      ],
      stack: ["Grok API Ensemble", "Cloudflare Workers", "Supabase DB Systems", "Vercel Node Middleware"],
      timeframe: "7-12 days"
    },
    {
      index: "03",
      title: "Echo Forge Autonomous",
      sub: "Enterprise-grade AI infrastructure – fully custom, fully integrated.",
      description: "Enterprise-grade AI infrastructure – fully custom, fully integrated.",
      capabilities: [
        "Up to 6 AI agents",
        "Full business automation",
        "Custom model fine-tuning",
        "Dedicated account manager",
        "SLA guarantee"
      ],
      stack: ["Grok Autonomous Swarm", "Cloudflare Edge Networks", "Hetzner Dedicated Core", "Enterprise Supabase Cluster"],
      timeframe: "14-25 days"
    }
  ];

  const handleGetStarted = () => {
    if (onChangePage) {
      onChangePage("survey");
    }
  };

  return (
    <div className="space-y-12 py-4" id="what-we-offer-root">
      
      {/* Centralized Page Header */}
      <div className="space-y-3 text-center max-w-2xl mx-auto animate-fade-in" id="what-we-offer-header">
        <span className="font-mono text-[10px] text-white/30 tracking-widest uppercase block">
          [ DEPLOYMENT MODULES ]
        </span>
        <h2 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight">
          What We <span className="italic text-[#00cbd6]">Offer</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#8e8e89] font-sans leading-relaxed max-w-xl mx-auto">
          High-performance visual systems and enterprise AI solutions engineered to modernize complex operational workflows. Explore our specialized packages.
        </p>
      </div>

      {/* Row-by-Row Layout: Fusion Core first, then Echo Forge */}
      <div className="space-y-16" id="what-we-offer-rows-container">
        
        {/* FUSION CORE PLATFORMS (Left-to-Right Row) */}
        <div className="space-y-6" id="section-group-fusion-core">
          <div className="flex flex-col items-center justify-center text-center gap-3 pb-4 border-b border-white/[0.05] px-1">
            <div className="w-8 h-8 rounded-lg bg-[#00cbd6]/10 border border-[#00cbd6]/20 flex items-center justify-center text-[#00cbd6]">
              <Globe className="w-4 h-4" />
            </div>
            <div className="space-y-1.5">
              <span className="font-mono text-[9px] text-[#00cbd6] tracking-widest uppercase block">[ WEB SYSTEMS BRAND ]</span>
              <h3 className="font-monstercat font-semibold text-sm text-white tracking-tight [word-spacing:0.3em] uppercase leading-snug">FUSION CORE PLATFORMS</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="fusion-core-blocks-grid">
            {coreServices.map((ser) => (
              <div 
                key={ser.index}
                className={`group p-5 rounded-xl border backdrop-blur-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full cursor-pointer hover:-translate-y-1 hover:border-[#00cbd6]/60 ${
                  ser.popular
                    ? "border-[#00cbd6]/40 bg-[#0c0c0c]/50 shadow-[0_0_30px_rgba(0,150,160,0.1)]"
                    : "border-white/[0.05] bg-[#0c0c0c]/40 hover:shadow-[0_0_20px_rgba(0,203,214,0.02)]"
                } hover:bg-[#0f0f10]/60`}
                onClick={() => document.getElementById("what-we-offer-footer-cta")?.scrollIntoView({ behavior: "smooth", block: "center" })}
                id={`block-core-${ser.index}`}
              >
                {ser.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                    <span className="text-[8px] bg-[#00cbd6] text-black px-3 py-1 rounded-b font-mono font-extrabold uppercase tracking-widest leading-none">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00cbd6]/[0.005] rounded-full blur-3xl pointer-events-none group-hover:bg-[#00cbd6]/[0.015] transition-all duration-300" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#00cbd6] tracking-wider uppercase bg-[#00cbd6]/5 px-2.5 py-1 rounded-lg border border-[#00cbd6]/10">
                      {ser.title.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <p className="text-xs text-[#8e8e89] font-sans leading-relaxed">
                      {ser.description}
                    </p>
                  </div>

                  <div className="space-y-1 pt-2.5 border-t border-white/[0.03] text-left">
                    <span className="font-mono text-[8px] text-white/20 uppercase tracking-wider block mb-1">CAPABILITIES OUTLINE</span>
                    <div className="grid grid-cols-1 gap-1">
                      {ser.capabilities.map((it, idx) => {
                        const isFree = it.toLowerCase().includes("assist");
                        return (
                          <div key={idx} className="flex items-center justify-between gap-2 text-[11px] text-white/60">
                            <div className="flex items-start gap-1">
                              <span className="text-[#00cbd6] select-none font-mono font-bold mr-1 text-[11px] mt-[1px]">&gt;</span>
                              <span className="font-sans leading-relaxed">{it}</span>
                            </div>
                            {isFree && (
                              <span className="shrink-0 text-[8px] bg-[#00cbd6]/20 text-[#00cbd6] border border-[#00cbd6]/30 px-1.5 py-0.5 rounded font-mono font-semibold uppercase tracking-wider select-none leading-none">
                                FREE
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-white/[0.03] flex items-center flex-wrap gap-x-2 gap-y-1">
                  <span className="font-mono text-[8px] text-white/20 uppercase tracking-wider select-none">INTEGRATION:</span>
                  <div className="flex flex-wrap items-center gap-x-1.5 text-[9px] font-mono text-white/40">
                    {ser.stack.map((stk, idx) => (
                      <span key={stk} className="flex items-center gap-1.5">
                        {idx > 0 && <span className="text-white/10 select-none">/</span>}
                        <span className="hover:text-white transition-colors duration-150">{stk}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ECHO FORGE AI SYSTEMS (Left-to-Right Row below Fusion Core) */}
        <div className="space-y-6" id="section-group-echoforge">
          <div className="flex flex-col items-center justify-center text-center gap-3 pb-4 border-b border-white/[0.05] px-1">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="space-y-1.5">
              <span className="font-mono text-[9px] text-purple-400 tracking-widest uppercase block">[ RECURSIVE ARCHITECTURE ]</span>
              <h3 className="font-monstercat font-semibold text-sm text-white tracking-tight [word-spacing:0.3em] uppercase leading-snug">ECHO FORGE AI SYSTEMS</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="echoforge-blocks-grid">
            {forgeServices.map((ser) => (
              <div 
                key={ser.index}
                className="group p-5 rounded-xl border border-white/[0.05] bg-[#0c0c0c]/40 backdrop-blur-md hover:bg-[#0f0f10]/60 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.03)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full cursor-pointer hover:-translate-y-1"
                onClick={() => document.getElementById("what-we-offer-footer-cta")?.scrollIntoView({ behavior: "smooth", block: "center" })}
                id={`block-forge-${ser.index}`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/[0.005] rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/[0.015] transition-all duration-300" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-purple-400 tracking-wider uppercase bg-purple-500/5 px-2.5 py-1 rounded-lg border border-purple-500/10">
                      {ser.title.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <p className="text-xs text-[#8e8e89] font-sans leading-relaxed">
                      {ser.description}
                    </p>
                  </div>

                  <div className="space-y-1 pt-2.5 border-t border-white/[0.03] text-left">
                    <span className="font-mono text-[8px] text-white/20 uppercase tracking-wider block mb-1">KEY PARAMETERS</span>
                    <div className="grid grid-cols-1 gap-1">
                      {ser.capabilities.map((it, idx) => (
                        <div key={idx} className="flex items-start gap-1 text-[11px] text-white/60">
                          <span className="text-purple-400 select-none font-mono font-bold mr-1 text-[11px] mt-[1px]">&gt;</span>
                          <span className="font-sans leading-relaxed">{it}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-white/[0.03] flex items-center flex-wrap gap-x-2 gap-y-1">
                  <span className="font-mono text-[8px] text-white/20 uppercase tracking-wider select-none">INTEGRATION:</span>
                  <div className="flex flex-wrap items-center gap-x-1.5 text-[9px] font-mono text-white/40">
                    {ser.stack.map((stk, idx) => (
                      <span key={stk} className="flex items-center gap-1.5">
                        {idx > 0 && <span className="text-white/10 select-none">/</span>}
                        <span className="hover:text-white transition-colors duration-150">{stk}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Elegant minimalist action card bottom-aligned */}
      <div 
        className="group p-6 rounded-xl border border-white/[0.05] bg-[#0c0c0c]/40 backdrop-blur-md hover:bg-[#0f0f10]/60 hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.03)] transition-all duration-300 relative overflow-hidden text-center max-w-xl mx-auto space-y-4" 
        id="what-we-offer-footer-cta"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/[0.005] rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/[0.015] transition-all duration-300" />
        
        <div className="space-y-1.5 relative z-10">
          <h4 className="font-display font-medium text-base text-white group-hover:text-purple-400 transition-colors">
            Construct Your Enterprise Blueprint
          </h4>
          <p className="text-[11px] text-[#8e8e89] max-w-md mx-auto font-sans leading-relaxed">
            Begin with a customized technical evaluation. Engage our 10-step dynamic Intake Survey to construct your profile.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
          <button
            onClick={handleGetStarted}
            className="group/btn w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black hover:bg-[#ededea] font-semibold font-mono text-[10px] px-5 py-2.5 rounded transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>GET STARTED</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

    </div>
  );
}
