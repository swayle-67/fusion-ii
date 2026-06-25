import { useState, useEffect } from "react";
import { getCaseStudies } from "../lib/dataStore";
import { CaseStudy } from "../types";
import { ArrowUpRight, ExternalLink, Sparkles, LayoutGrid } from "lucide-react";
import { motion } from "motion/react";

export default function CaseStudiesGrid() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(getCaseStudies());

  useEffect(() => {
    const handleUpdate = () => {
      setCaseStudies(getCaseStudies());
    };
    window.addEventListener("fusion_data_update", handleUpdate);
    return () => {
      window.removeEventListener("fusion_data_update", handleUpdate);
    };
  }, []);

  return (
    <div className="space-y-12 py-6 text-center" id="portfolio-grid-section">
      {/* Centralized Header "Projects & Builds" */}
      <div className="space-y-3 max-w-2xl mx-auto" id="projects-header-container">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.06] text-white/60 mb-2">
          <LayoutGrid className="w-3.5 h-3.5 text-[#00cbd6]" />
          <span className="font-mono text-[9px] tracking-widest uppercase">PRODUCTION SYSTEM REGISTRY</span>
        </div>
        <h2 className="font-display font-medium text-4xl md:text-5xl text-white tracking-tight">
          Projects & Builds
        </h2>
        <p className="text-xs sm:text-sm text-[#8e8e89] font-sans leading-relaxed">
          Explore our fully deployed, live multi-dimensional pipelines, algorithmic architectures, and computational systems engineered with absolute precision.
        </p>
      </div>

      {/* Grid of Blocks/Builds */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto text-left pt-6">
        {caseStudies.map((project, idx) => {
          const destinationUrl = project.projectUrl || "https://github.com";
          return (
            <motion.a
              key={project.id}
              href={destinationUrl}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#090909]/60 backdrop-blur-md border border-white/[0.04] hover:bg-[#0c0c0c]/80 hover:border-[#00cbd6]/30 hover:shadow-[0_0_25px_rgba(0,203,214,0.05)] transition-all duration-300 h-[220px]"
              id={`case-study-card-${project.id}`}
            >
              {/* Card Accent Top Line */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#00cbd6]/0 group-hover:via-[#00cbd6]/40 to-transparent transition-all duration-500" />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-[#00cbd6] bg-[#00cbd6]/5 border border-[#00cbd6]/10 px-2 py-0.5 rounded tracking-wider uppercase">
                    {project.category}
                  </span>
                  <span className="font-mono text-[10px] text-white/30">
                    {project.year}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-display font-medium text-lg text-white group-hover:text-[#00cbd6] transition-colors tracking-tight flex items-center gap-1.5">
                    <span>{project.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-[#00cbd6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h4>
                  <p className="text-xs text-[#8e8e89] line-clamp-3 leading-relaxed">
                    {project.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.04] pt-4 mt-auto">
                <span className="font-mono text-[8px] text-white/40 tracking-wider">
                  CLIENT: {project.client.toUpperCase()}
                </span>
                
                <span className="font-mono text-[8.5px] text-[#00cbd6]/80 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>LAUNCH SITE</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
