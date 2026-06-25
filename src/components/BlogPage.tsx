import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { getBlogPosts } from "../lib/dataStore";
import { BlogPost } from "../types";

function getAuthorColor(author?: string) {
  const normAuthor = author || "Fusion Team";
  if (normAuthor === "Founder") {
    return {
      text: "text-[#c084fc]",
      textHov: "group-hover:text-[#c084fc]",
      textAction: "text-[#c084fc]/85 group-hover:text-[#c084fc]",
      bg5: "bg-[#c084fc]/5",
      border15: "border-[#c084fc]/15",
      glowBg: "bg-[#c084fc]/[0.01] group-hover:bg-[#c084fc]/[0.03]",
      hoverText: "hover:text-[#c084fc]"
    };
  } else if (normAuthor === "Sales Team") {
    return {
      text: "text-[#ff50d2]",
      textHov: "group-hover:text-[#ff50d2]",
      textAction: "text-[#ff50d2]/85 group-hover:text-[#ff50d2]",
      bg5: "bg-[#ff50d2]/5",
      border15: "border-[#ff50d2]/15",
      glowBg: "bg-[#ff50d2]/[0.01] group-hover:bg-[#ff50d2]/[0.03]",
      hoverText: "hover:text-[#ff50d2]"
    };
  } else {
    return {
      text: "text-[#00cbd6]",
      textHov: "group-hover:text-[#00cbd6]",
      textAction: "text-[#00cbd6]/85 group-hover:text-[#00cbd6]",
      bg5: "bg-[#00cbd6]/5",
      border15: "border-[#00cbd6]/15",
      glowBg: "bg-[#00cbd6]/[0.01] group-hover:bg-[#00cbd6]/[0.03]",
      hoverText: "hover:text-[#00cbd6]"
    };
  }
}

export default function BlogPage() {
  const [activeBlogPost, setActiveBlogPost] = useState<BlogPost | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(getBlogPosts());

  useEffect(() => {
    const handleUpdate = () => {
      setBlogPosts(getBlogPosts());
    };
    window.addEventListener("fusion_data_update", handleUpdate);
    return () => {
      window.removeEventListener("fusion_data_update", handleUpdate);
    };
  }, []);

  const activeColors = activeBlogPost ? getAuthorColor(activeBlogPost.author) : null;

  return (
    <div className="space-y-12 animate-fade-in" id="blog-view-container">
      <div className="border-l-2 border-white/10 pl-6 space-y-2">
        <span className="font-mono text-xs text-white/40 tracking-widest uppercase block">
          [ STUDIO SYSTEM LOGS ]
        </span>
        <h2 className="font-monstercat font-medium text-2xl md:text-3xl text-white tracking-tight" id="blog-page-heading">
          Thought registry
        </h2>
        <p className="text-xs text-[#8e8e89] max-w-xl font-sans" id="blog-page-subtitle">
          Brief notes and analyses regarding computational design practices, ambient code frameworks, and design science.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!activeBlogPost ? (
          <motion.div
            key="blog-grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4"
          >
            {blogPosts.map((post) => {
              const colors = getAuthorColor(post.author);
              return (
                <div
                  key={post.id}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setActiveBlogPost(post);
                  }}
                  className="p-6 rounded-2xl border border-white/[0.04] bg-[#090909]/60 backdrop-blur-md hover:bg-white/[0.02] hover:border-white/10 transition-all cursor-pointer group flex flex-col justify-between h-full relative overflow-hidden"
                >
                  {/* Visual back-glow */}
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-all duration-500 ${colors.glowBg}`} />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between font-mono text-[9px] text-white/40 mb-2">
                      <span className={`uppercase font-semibold tracking-wider text-[10px] ${colors.text}`}>{post.category}</span>
                      <div className="flex items-center gap-2.5">
                        <span className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />{post.date}</span>
                      </div>
                    </div>

                    <h3 className={`font-monstercat font-medium text-lg leading-snug text-white transition-colors ${colors.textHov}`}>
                      {post.title}
                    </h3>

                    <p className="text-xs text-[#8e8e89] leading-relaxed line-clamp-3 font-sans">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/[0.03] flex items-center justify-between font-mono text-[10px] text-white/50 group-hover:text-white transition-colors">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-white/30" />{post.readTime}</span>
                    <div className={`flex items-center gap-1 ${colors.textAction}`}>
                      <span>READ</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="blog-details"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl mx-auto space-y-8 bg-[#090909]/40 backdrop-blur-md p-6 md:p-10 rounded-3xl border border-white/[0.05] relative"
          >
            {/* Back to registry */}
            <button
              onClick={() => setActiveBlogPost(null)}
              className="font-mono text-[10px] text-white/50 hover:text-white border border-white/10 bg-white/[0.01] hover:bg-white/[0.04] p-2 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              ← BACK TO REGISTRY
            </button>

            <div className="space-y-4 pt-2">
              <span className={`inline-block p-1 px-2.5 rounded border font-mono text-[9px] uppercase font-semibold ${activeColors?.bg5} ${activeColors?.border15} ${activeColors?.text}`}>
                {activeBlogPost.category}
              </span>

              <h3 className="font-monstercat font-semibold text-3xl md:text-4xl text-white leading-tight">
                {activeBlogPost.title}
              </h3>

              <div className="flex flex-wrap items-center gap-4 border-y border-white/[0.05] py-4 font-mono text-[10px] text-white/40">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-white/30" />{activeBlogPost.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-white/30" />{activeBlogPost.readTime}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-white/20">AUTHOR:</span>
                  {(() => {
                    const author = activeBlogPost.author || "Fusion Team";
                    let badgeClasses = "";
                    if (author === "Founder") {
                      badgeClasses = "text-[#c084fc] bg-[#c084fc]/5 border-[#c084fc]/15";
                    } else if (author === "Sales Team") {
                      badgeClasses = "text-[#ff50d2] bg-[#ff50d2]/5 border-[#ff50d2]/15";
                    } else {
                      badgeClasses = "text-[#00cbd6] bg-[#00cbd6]/5 border-[#00cbd6]/15";
                    }
                    return (
                      <span className={`font-semibold px-2.5 py-0.5 rounded border tracking-wider uppercase text-[9px] ${badgeClasses}`}>
                        {author}
                      </span>
                    );
                  })()}
                </span>
              </div>
            </div>

            <div className="space-y-6 text-sm md:text-base text-[#8e8e89] leading-relaxed font-sans pt-4">
              {activeBlogPost.content.map((paragraph, idx) => {
                const trimmed = paragraph.trim();
                if (trimmed.startsWith("### ")) {
                  return (
                    <h4 key={idx} className="text-sm font-semibold text-white/90 font-mono tracking-wide uppercase pt-4 pb-1">
                      {trimmed.slice(4)}
                    </h4>
                  );
                }
                if (trimmed.startsWith("## ")) {
                  return (
                    <h3 key={idx} className="text-base font-bold text-white font-monstercat tracking-tight pt-5 pb-1">
                      {trimmed.slice(3)}
                    </h3>
                  );
                }
                if (trimmed.startsWith("# ")) {
                  return (
                    <h2 key={idx} className="text-lg font-bold text-white font-monstercat tracking-tight pt-6 pb-2 border-b border-white/[0.04]">
                      {trimmed.slice(2)}
                    </h2>
                  );
                }
                return (
                  <p key={idx} className="text-[#8e8e89]">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Read post footer notice */}
            <div className="border border-white/[0.05] p-5 rounded-2xl bg-[#030303]/40 flex items-center justify-between mt-12 font-mono text-[10px] text-[#8e8e89]">
              <span>STATUS: [END OF RECORD]</span>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setActiveBlogPost(null);
                }}
                className={`text-white hover:underline uppercase font-semibold transition-colors ${activeColors?.hoverText}`}
              >
                RETURN TO LOGS
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
