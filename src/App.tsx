import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  ChevronRight, 
  Layers, 
  MapPin, 
  CornerRightDown, 
  Terminal, 
  ShieldAlert,
  ArrowUp,
  Cpu,
  Phone,
  Mail,
  MessageSquare,
  Instagram,
  Users
} from "lucide-react";

import { CanvasSettings } from "./types";
import { PHILOSOPHY_SECTIONS } from "./data";

// Import modular subcomponents
import VelvetNoise from "./components/VelvetNoise";
import Header from "./components/Header";
import ServicesList from "./components/ServicesList";
import CaseStudiesGrid from "./components/CaseStudiesGrid";
import QuoteBuilder from "./components/QuoteBuilder";
import { GlitchWordRotator } from "./components/GlitchWordRotator";
import BlogPage from "./components/BlogPage";
import SurveyPage from "./components/SurveyPage";
import AdminPortal from "./components/AdminPortal";
import CookieConsent from "./components/CookieConsent";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";

const DEFAULT_CANVAS_SETTINGS: CanvasSettings = {
  density: 2.5,
  driftSpeed: 1.0,
  breatheSpeed: 0.5,
  grainSize: 0.6,
  maxAlpha: 0.95,
  colorTheme: "silver",
};

export default function App() {
  const [canvasSettings, setCanvasSettings] = useState<CanvasSettings>(DEFAULT_CANVAS_SETTINGS);
  const [canvasActive, setCanvasActive] = useState(true);
  const [currentPage, setCurrentPage] = useState<"home" | "services" | "portfolio" | "blog" | "contact" | "survey" | "admin">("home");
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Keyboard shortcut Ctrl+Alt+A to enter secured admin view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isA = e.key?.toLowerCase() === "a" || e.code === "KeyA" || e.key === "å" || e.key === "Å" || e.keyCode === 65;
      const hasModifiers = (e.ctrlKey || e.metaKey) && e.altKey;
      
      if (hasModifiers && isA) {
        e.preventDefault();
        changePage("admin");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Dynamic SEO Metadata updates per page
  useEffect(() => {
    const seoData: Record<typeof currentPage, { title: string; description: string; keywords: string }> = {
      home: {
        title: "Fusion II | High-Fidelity Web, AI & Systems Design",
        description: "Fusion II (also known as Fusion 2 or Fusion two) is a premium Web AI and systems design studio engineering high-fidelity digital experiences where generative logic meets human aesthetics.",
        keywords: "Fusion II, Fusion 2, Fusion two, Web AI, Web Design, Systems Design, Custom Software, High Fidelity, South Africa Developers"
      },
      services: {
        title: "Systems & Services | Fusion II",
        description: "Explore Fusion II's specialized services, including Interactive Canvas Development, Cognitive AI Agent Integrations, and Enterprise System Architectures built for extreme performance.",
        keywords: "Services, Interactive Canvas, AI Integration, Web Engineering, Software Architecture, Fusion II, Fusion 2, custom AI agents"
      },
      portfolio: {
        title: "Selected Works & Case Studies | Fusion II Portfolio",
        description: "Browse the Fusion II portfolio containing production-grade enterprise platforms, high-speed interactive data visualization layers, and intelligent AI custom modules.",
        keywords: "Portfolio, Case Studies, Completed Projects, Web Systems, AI Projects, Fusion II, Fusion 2, Portfolio Showcase"
      },
      blog: {
        title: "System Logs & Methodologies | Fusion II Blog",
        description: "Read technical guides, design philosophy posts, and cutting-edge industry insights on Web systems and custom generative AI agents from our core engineering specialists.",
        keywords: "Blog, Technical Writing, Development Logs, Web AI News, System Engineering, Fusion II, Fusion 2, Design Philosophy"
      },
      contact: {
        title: "Connect With Our Agents | Fusion II Support",
        description: "Get in touch with the Fusion II systems team, chat with Suhail directly on WhatsApp, or connect with our specialized sales representatives in South Africa.",
        keywords: "Contact, Support, Sales Agents, South Africa Developers, WhatsApp Chat, Fusion II, Fusion 2, Suhail phone"
      },
      survey: {
        title: "Digital Project Questionnaire & Quote Builder | Fusion II",
        description: "Fill out our tailored digital intake survey to estimate scope and plan your custom high-velocity Web, design, and AI automation project today.",
        keywords: "Survey, Project Estimation, Quote Builder, Get Started, Fusion II, Fusion 2, client intake form"
      },
      admin: {
        title: "Secure Terminal & Command Portal | Fusion II",
        description: "Authorized admin command dashboard for checking real-time system metrics, user submissions, and secure configuration templates.",
        keywords: "Admin, Secure Terminal, Command Portal, Authenticated Access, Fusion II"
      }
    };

    const currentSeo = seoData[currentPage];
    if (currentSeo) {
      // 1. Update Title
      document.title = currentSeo.title;

      // 2. Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', currentSeo.description);

      // 3. Update meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', currentSeo.keywords);

      // 4. Update OpenGraph Tags for social previews
      const updateOrCreateOgTag = (property: string, content: string) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };

      updateOrCreateOgTag('og:title', currentSeo.title);
      updateOrCreateOgTag('og:description', currentSeo.description);
      updateOrCreateOgTag('og:type', 'website');
      updateOrCreateOgTag('og:site_name', 'Fusion II');
    }
  }, [currentPage]);

  // Listen for global custom event to trigger centralized Privacy Policy modal
  useEffect(() => {
    const handleOpenPrivacy = () => {
      setIsPrivacyModalOpen(true);
    };
    window.addEventListener("fusion_open_privacy_policy", handleOpenPrivacy);
    return () => {
      window.removeEventListener("fusion_open_privacy_policy", handleOpenPrivacy);
    };
  }, []);

  // Scroll smoothly back to top of document
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changePage = (page: "home" | "services" | "portfolio" | "blog" | "contact" | "survey" | "admin") => {
    if (page === "contact") {
      setCurrentPage("home");
      setTimeout(() => {
        const footer = document.getElementById("app-global-footer");
        if (footer) {
          footer.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
      setCurrentPage(page);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#ededea] font-sans selection:bg-white selection:text-black antialiased overflow-x-hidden">
      
      {/* 1. Master Canvas Background Layer */}
      {canvasActive && (
        <VelvetNoise
          density={canvasSettings.density}
          driftSpeed={canvasSettings.driftSpeed}
          breatheSpeed={canvasSettings.breatheSpeed}
          grainSize={canvasSettings.grainSize}
          maxAlpha={canvasSettings.maxAlpha}
          colorTheme={canvasSettings.colorTheme}
        />
      )}

      {/* 2. Global Header */}
      <Header
        canvasActive={canvasActive}
        activeDensity={canvasSettings.density}
        activeDrift={canvasSettings.driftSpeed}
        activeBreathe={canvasSettings.breatheSpeed}
        currentPage={currentPage}
        setCurrentPage={changePage}
      />

      {/* 3. Main Content Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-16">
        <AnimatePresence mode="wait">
          
          {/* HOME PAGE VIEW */}
          {currentPage === "home" && (
            <motion.div
              key="home-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-16 md:space-y-24"
            >
              {/* HERO SECTION / LANDING INTRO */}
              <section className="max-w-4xl py-8 md:py-16 space-y-6" id="agency">
                <div className="space-y-6">
                  
                  {/* Core Display Heading */}
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[92px] tracking-tight leading-[1.02] font-normal text-white select-none"
                    id="hero-heading"
                  >
                    The Architecture <br className="hidden sm:inline" /> of <span className="italic">Intelligence</span>
                  </motion.h1>

                  {/* Descriptive Summary */}
                  <motion.p 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-base md:text-lg text-[#8e8e89] leading-relaxed max-w-2xl font-sans"
                    id="hero-description"
                  >
                    We engineer high-fidelity digital experiences where generative logic meets human-centered aesthetics. Fusion II crafts bespoke canvas backdrops and secure client-serving AI bridges for forward-leaning posture.
                  </motion.p>

                  {/* Tactical Directions */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-wrap items-center gap-4 pt-2"
                    id="hero-actions"
                  >
                    <button 
                      onClick={() => changePage("survey")}
                      className="group flex items-center gap-2 bg-white text-black font-semibold font-mono text-xs px-5 py-3 rounded-xl hover:bg-[#ededea] transition-all cursor-pointer"
                    >
                      <span>GET STARTED</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </button>
                    <button 
                      onClick={() => changePage("portfolio")}
                      className="flex items-center gap-1.5 border border-white/10 bg-white/[0.01] hover:bg-white/[0.04] text-white font-mono text-xs px-5 py-3 rounded-xl transition-all cursor-pointer"
                    >
                      <span>EXPLORE OUR WORK</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                </div>
              </section>

              {/* DYNAMIC ADAPTATION METRICS / STATISTICS PANEL */}
              <section className="space-y-12" id="adaptation-stats">
                <div className="space-y-2" id="stats-header-container">
                  <h3 className="font-monstercat font-semibold text-3xl md:text-4xl text-white tracking-tight" id="stats-heading">
                    The digital shift is happening
                  </h3>
                  <h4 className="font-monstercat font-medium text-lg md:text-xl text-[#00cbd6]/90 tracking-tight" id="stats-subheading">
                    Businesses are adapting. Are you?
                  </h4>
                  <div className="text-xs md:text-sm text-[#8e8e89] max-w-2xl font-sans pt-1 space-y-3" id="stats-description-container">
                    <p id="stats-description-text">
                      Global businesses are rapidly adopting AI and digital solutions to improve efficiency, customer experience, and growth. These figures represent the growing demand for smarter, more connected technology.
                    </p>
                    <div id="stats-sources-container" className="text-[11px] pt-1 space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-x-2">
                      <span className="text-[#8e8e89]/70 block sm:inline font-mono tracking-wide uppercase text-[10px]">Research sources:</span>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1" id="stats-sources-list">
                        <a 
                          href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-state-of-ai" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[#00cbd6]/90 hover:text-[#00cbd6] hover:underline transition-colors inline-flex items-center"
                          id="source-link-mckinsey"
                        >
                          McKinsey Global Institute
                        </a>
                        <span className="text-white/20 select-none" aria-hidden="true">•</span>
                        <a 
                          href="https://www.deloitte.com/global/en/issues/technology/state-of-ai-in-the-enterprise.html" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[#00cbd6]/90 hover:text-[#00cbd6] hover:underline transition-colors inline-flex items-center"
                          id="source-link-deloitte"
                        >
                          Deloitte AI Reports
                        </a>
                        <span className="text-white/20 select-none" aria-hidden="true">•</span>
                        <a 
                          href="https://www.microsoft.com/en-us/worklab/work-trend-index/copilot-work-trend-index-2024" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[#00cbd6]/90 hover:text-[#00cbd6] hover:underline transition-colors inline-flex items-center"
                          id="source-link-microsoft"
                        >
                          Microsoft Work Trend Index
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row overflow-x-auto gap-6 pt-4 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-track-white/[0.02] scrollbar-thumb-white/10 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
                  {[
                    {
                      percentage: "92%",
                      label: "AI INTEGRATION",
                      description: "Enterprise leaders actively prioritizing high-fidelity agentic AI integration."
                    },
                    {
                      percentage: "85%",
                      label: "INTERACTIVE RECALL",
                      description: "Audience recall lift measured on sensory-immersive, web-native canvases."
                    },
                    {
                      percentage: "74%",
                      label: "COGNITIVE WORKFLOWS",
                      description: "Standard spreadsheet data pipelines automated via semantic AI engines."
                    },
                    {
                      percentage: "68%",
                      label: "DEVELOPMENT REDUCTION",
                      description: "Speed-to-market overhead reduction by utilizing unified architectural systems."
                    },
                    {
                      percentage: "55%",
                      label: "SPATIAL ADOPTION",
                      description: "Design agencies fully transitioning to fluid, procedural layouts."
                    }
                  ].map((stat, idx) => (
                    <div 
                      key={idx} 
                      className="p-6 rounded-2xl border border-white/[0.04] bg-[#090909]/60 backdrop-blur-md hover:bg-white/[0.02] hover:border-white/10 transition-all group flex flex-col justify-between h-auto relative overflow-hidden min-w-[260px] sm:min-w-[280px] lg:min-w-0 w-full snap-start"
                      id={`stat-block-${idx}`}
                    >
                      {/* Interactive visual hover back-glow */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/[0.01] rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/[0.03] transition-all duration-500" />
                      
                      <div className="space-y-4">
                        <div className="font-monstercat text-4xl md:text-5xl font-semibold leading-none tracking-tight text-white group-hover:text-[#00f3ff] transition-colors duration-300">
                          {stat.percentage}
                        </div>

                        <div className="font-monstercat font-medium text-[11px] md:text-xs text-white/95 uppercase tracking-wide">
                          {stat.label}
                        </div>

                        <p className="text-[11px] text-[#8e8e89] leading-relaxed font-sans">
                          {stat.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ABOUT US PANEL */}
              <section className="space-y-10 md:space-y-12" id="about-us">
                <div className="border-l-2 border-white/10 pl-6 space-y-1">
                  <h2 className="font-monstercat font-medium text-2xl md:text-3xl text-white tracking-tight" id="about-section-heading">
                    About Fusion II
                  </h2>
                </div>

                {/* Intro Profile Headers */}
                <div className="space-y-5 max-w-3xl" id="about-profile-header">
                  <p className="text-sm md:text-base text-white/95 font-sans leading-relaxed" id="about-corp-p1">
                    Fusion II is a web and AI development company building modern digital systems that help businesses operate smarter, faster, and more efficiently.
                  </p>
                  <p className="text-xs md:text-sm text-[#8e8e89] font-sans leading-relaxed" id="about-corp-p2">
                    We design and develop websites, AI automation tools, and custom software solutions that streamline operations, improve customer experience, and turn technology into a practical business advantage.
                  </p>
                  <div className="p-4 border-l-2 border-[#00cbd6]/40 bg-white/[0.01] rounded-r-xl" id="about-core-focus">
                    <span className="font-mono text-[9px] text-[#00cbd6]/60 tracking-widest uppercase block">OUR CORE FOCUS</span>
                    <p className="font-monstercat font-medium text-xs md:text-sm text-white mt-1 italic">
                      "Build clean systems that solve real problems."
                    </p>
                  </div>
                </div>

                {/* 2x2 Grid for Core Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8" id="about-bento-grid">
                  {/* Who We Are Card */}
                  <div className="p-8 rounded-2xl border border-white/[0.04] bg-[#090909]/60 backdrop-blur-md hover:bg-white/[0.01] hover:border-white/10 transition-all duration-300 space-y-4 relative overflow-hidden group" id="about-who-we-are">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/[0.01] rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/[0.02] transition-colors" />
                    <h3 className="font-monstercat font-medium text-lg md:text-xl text-[#00cbd6]/90 tracking-tight" id="subheading-who-we-are">
                      Who We Are
                    </h3>
                    <div className="space-y-3 text-xs md:text-sm text-[#8e8e89] font-sans leading-relaxed">
                      <p id="who-we-are-p1">
                        Fusion II is a founder-led development team built by two young developers with a strong focus on web technologies, automation, and artificial intelligence.
                      </p>
                      <p id="who-we-are-p2">
                        Being close to today’s tools, trends, and rapid shifts in AI gives us a unique advantage — we build with speed, adaptability, and a modern understanding of how digital systems should work in 2026 and beyond.
                      </p>
                      <p id="who-we-are-p3">
                        We work closely on every project from idea to deployment, combining design thinking with technical execution to deliver fast, functional, and scalable solutions.
                      </p>
                    </div>
                  </div>

                  {/* Our Mission Card */}
                  <div className="p-8 rounded-2xl border border-white/[0.04] bg-[#090909]/60 backdrop-blur-md hover:bg-white/[0.01] hover:border-white/10 transition-all duration-300 space-y-4 relative overflow-hidden group flex flex-col justify-between" id="about-our-mission">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/[0.01] rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/[0.02] transition-colors" />
                    <div className="space-y-4">
                      <h3 className="font-monstercat font-medium text-lg md:text-xl text-[#00cbd6]/90 tracking-tight" id="subheading-our-mission">
                        Our Mission
                      </h3>
                      <p className="text-xs md:text-sm text-[#8e8e89] font-sans leading-relaxed" id="mission-text">
                        To help businesses transition into a more intelligent digital future by making advanced web and AI technology practical, accessible, and effective.
                      </p>
                    </div>
                    <div className="border-t border-white/[0.04] pt-4 mt-6">
                      <span className="font-mono text-[9px] text-[#00cbd6]/60 tracking-widest uppercase block mb-1">DESIGN PHILOSOPHY</span>
                      <p className="text-xs text-white/50 italic font-sans">
                        Engineering tomorrow's cognitive capabilities with absolute aesthetic rigor.
                      </p>
                    </div>
                  </div>

                  {/* Our Approach Card */}
                  <div className="p-8 rounded-2xl border border-white/[0.04] bg-[#090909]/60 backdrop-blur-md hover:bg-white/[0.01] hover:border-white/10 transition-all duration-300 space-y-4 relative overflow-hidden group" id="about-our-approach">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/[0.01] rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/[0.02] transition-colors" />
                    <h3 className="font-monstercat font-medium text-lg md:text-xl text-[#00cbd6]/90 tracking-tight" id="subheading-our-approach">
                      Our Approach
                    </h3>
                    <p className="text-xs md:text-sm text-[#8e8e89] font-sans leading-relaxed">
                      We don’t believe in overcomplicated systems or unnecessary layers. Instead, we focus on:
                    </p>
                    <ul className="space-y-3 pt-2" id="approach-list">
                      {[
                        "Understanding the real business problem",
                        "Designing simple, effective digital solutions",
                        "Using AI and automation where it actually adds value",
                        "Building systems that are easy to use, maintain, and scale"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-[#8e8e89] font-sans" id={`approach-item-${idx}`}>
                          <span className="text-[#00cbd6] mt-0.5 select-none" aria-hidden="true">▪</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What We Do Card */}
                  <div className="p-8 rounded-2xl border border-white/[0.04] bg-[#090909]/60 backdrop-blur-md hover:bg-white/[0.01] hover:border-white/10 transition-all duration-300 space-y-4 relative overflow-hidden group" id="about-what-we-do">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/[0.01] rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/[0.02] transition-colors" />
                    <h3 className="font-monstercat font-medium text-lg md:text-xl text-[#00cbd6]/90 tracking-tight" id="subheading-what-we-do">
                      What We Do
                    </h3>
                    <p className="text-xs md:text-sm text-[#8e8e89] font-sans leading-relaxed">
                      Tailored digital expertise engineered for sustainable and scalable performance:
                    </p>
                    <ul className="space-y-3 pt-2" id="what-we-do-list">
                      {[
                        "High-performance websites built for conversion and user experience",
                        "AI automation systems that handle communication, leads, and workflows",
                        "Custom digital tools tailored to specific business needs",
                        "Scalable web-based platforms designed for long-term growth"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-[#8e8e89] font-sans" id={`what-we-do-item-${idx}`}>
                          <span className="text-[#00cbd6] mt-0.5 select-none" aria-hidden="true">▪</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>


              </section>
            </motion.div>
          )}

          {/* SERVICES PAGE VIEW */}
          {currentPage === "services" && (
            <motion.div
              key="services-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12 py-12"
            >
              <ServicesList onChangePage={changePage} />
            </motion.div>
          )}

          {/* PORTFOLIO PAGE VIEW */}
          {currentPage === "portfolio" && (
            <motion.div
              key="portfolio-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="py-12"
            >
              <CaseStudiesGrid />
            </motion.div>
          )}

          {/* STUDIO BLOG PAGE VIEW */}
          {currentPage === "blog" && (
            <motion.div
              key="blog-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="py-12"
            >
              <BlogPage />
            </motion.div>
          )}

          {/* CONTACT PAGE VIEW */}
          {currentPage === "contact" && (
            <motion.div
              key="contact-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12 py-12 animate-fade-in"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Description Text */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="border-l-2 border-white/10 pl-6 space-y-2">
                    <span className="font-mono text-xs text-white/40 tracking-widest uppercase block">
                      [ SYSTEMS INITIATED ]
                    </span>
                    <h2 className="font-monstercat font-medium text-2xl md:text-3xl text-white tracking-tight" id="contact-section-heading">
                      Begin collaboration
                    </h2>
                  </div>

                  <p className="text-xs text-[#8e8e89] leading-relaxed font-sans" id="contact-description">
                    Ready to elevate your digital posture? Use our interactive planner card on the right to formulate a tailored studio recipe. Custom algorithms will instantly structure an initial budget projection and deliver your dispatch briefing packet directly to our engineering coordinators.
                  </p>

                  <div className="space-y-4 font-mono text-[11px] text-[#8e8e89]" id="technical-conduits-list">
                    <div className="flex items-center gap-3 bg-white/[0.01] border border-white/[0.05] p-3 rounded-lg">
                      <MapPin className="w-4 h-4 text-white/50" />
                      <div>
                        <span className="text-white/40 uppercase block text-[8px]">PRIMARY DEPLOYMENT DEPOT</span>
                        <span className="text-white font-medium">Bespoke Vector Station, F2-ORBIT</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/[0.01] border border-white/[0.05] p-3 rounded-lg">
                      <Cpu className="w-4 h-4 text-white/50" />
                      <div>
                        <span className="text-white/40 uppercase block text-[8px]">CORE INFRASTRUCTURE SERVICE</span>
                        <span className="text-white font-medium">Node and Express Server v4 // Cloud Run</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 text-emerald-400 bg-emerald-900/10 border border-emerald-500/15 rounded-lg">
                      <Layers className="w-4 h-4" />
                      <div>
                        <span className="text-emerald-500/60 uppercase block text-[8px]">GRID ACCURACY STATUS</span>
                        <span className="font-semibold text-[10px]">ALL DYNAMIC CHANNELS RE-ROUTE SMOOTHLY [100%]</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Core Quote Builder Form */}
                <div className="lg:col-span-7">
                  <QuoteBuilder />
                </div>
              </div>
            </motion.div>
          )}

          {/* SURVEY PAGE VIEW */}
          {currentPage === "survey" && (
            <motion.div
              key="survey-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="py-12"
            >
              <SurveyPage />
            </motion.div>
          )}

          {/* ADMIN PORTAL PANEL */}
          {currentPage === "admin" && (
            <motion.div
              key="admin-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="py-12"
            >
              <AdminPortal onBackToApp={() => changePage("home")} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 4. FOOTER */}
      <footer 
        className="relative z-10 border-t border-white/[0.04] bg-[#050505] py-20 px-6 mt-24 text-center animate-fade-in"
        id="app-global-footer"
      >
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-3">
            <p className="font-display text-xl sm:text-2xl text-white tracking-tight font-light">
              A small team. A modern mindset
            </p>
            <p className="text-xs sm:text-sm text-[#8e8e89] font-sans tracking-wide">
              Building the future of Web and AI systems
            </p>
          </div>

          {/* Minimal Contact Conduits */}
          <div className="pt-8 border-t border-white/[0.04] space-y-8 max-w-3xl mx-auto">
            {/* Primary Contacts Row */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-mono text-[#8e8e89]">
              <a 
                href="https://wa.me/27724143591" 
                target="_blank" 
                rel="noopener noreferrer" 
                referrerPolicy="no-referrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition-all bg-white/[0.01] hover:bg-emerald-500/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.04] hover:border-emerald-500/10"
              >
                <svg className="w-3.5 h-3.5 fill-current text-emerald-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.46h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>WhatsApp: +27 72 414 3591</span>
              </a>
              <a 
                href="mailto:fusionii.nexus@gmail.com" 
                className="flex items-center gap-2 hover:text-[#00f3ff] transition-all bg-white/[0.01] hover:bg-[#00f3ff]/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.04] hover:border-[#00f3ff]/10"
              >
                <svg className="w-3.5 h-3.5 fill-current text-[#00f3ff]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.387l-9 6.43-9-6.43V21H1.5C.65 21 0 20.35 0 19.5v-15c0-.85.65-1.5 1.5-1.5H3l9 6.43L21 3h1.5c.85 0 1.5.65 1.5 1.5z" />
                </svg>
                <span>fusionii.nexus@gmail.com</span>
              </a>
              <a 
                href="tel:+27813779669" 
                className="flex items-center gap-2 hover:text-cyan-400 transition-all bg-white/[0.01] hover:bg-cyan-500/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.04] hover:border-cyan-500/10"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cell: +27 81 377 9669 (Suhail, Co-owner)</span>
              </a>
              <a 
                href="https://instagram.com/fusion_ii_" 
                target="_blank" 
                rel="noopener noreferrer" 
                referrerPolicy="no-referrer"
                className="flex items-center gap-2 hover:text-[#ff007f] transition-all bg-white/[0.01] hover:bg-[#ff007f]/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.04] hover:border-[#ff007f]/10"
              >
                <Instagram className="w-3.5 h-3.5 text-[#ff007f]" />
                <span>@fusion_ii_</span>
              </a>
            </div>

            {/* Sales Contact Nodes */}
            <div className="space-y-3">
              <span className="font-mono text-[9px] text-white/30 tracking-widest uppercase block">
                [ CONTACT SALES AGENTS ]
              </span>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-mono text-xs">
                {[
                  { name: "Saifaan", phone: "+27 64 552 5339", tel: "+27645525339" },
                  { name: "Zothani", phone: "+27 81 680 0790", tel: "+27816800790" },
                  { name: "Brent", phone: "+27 81 414 0155", tel: "+27814140155" }
                ].map((agent, index) => (
                  <a 
                    key={index}
                    href={`tel:${agent.tel}`}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/[0.02] border border-transparent hover:border-white/[0.05] transition-all text-[#8e8e89] hover:text-white"
                  >
                    <span className="font-semibold text-white/80">{agent.name}:</span>
                    <span>{agent.phone}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Copyright & Access */}
            <div className="pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-[#8e8e89]/40 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-center sm:text-left">
                <span>© {new Date().getFullYear()} FUSION II. ALL RIGHTS RESERVED.</span>
                <span className="hidden sm:inline text-white/[0.04]">•</span>
                <span className="text-cyan-500/50 uppercase tracking-widest text-[9px] hover:text-cyan-400 transition-colors">powered by Fusion II</span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => window.dispatchEvent(new Event("fusion_open_privacy_policy"))}
                  className="hover:text-cyan-400/90 transition-all cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/5 bg-white/[0.01] hover:border-cyan-500/20 uppercase tracking-wider h-7 leading-none text-[10px]"
                  title="View Privacy and Cookie Policy"
                >
                  <span>Privacy Policy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <CookieConsent />
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onConfigureCookies={() => {
          window.dispatchEvent(new Event("fusion_open_cookie_banner"));
        }}
      />
    </div>
  );
}
