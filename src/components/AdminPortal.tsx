import React, { useState, useEffect } from "react";
import { 
  Lock, Unlock, ShieldAlert, Key, Search, Trash2, Edit, PlusCircle, 
  ArrowLeft, RefreshCw, Layers, FileText, Check, Bot, Quote, Calendar, 
  Briefcase, Save, X, Plus, Terminal, Eye, HelpCircle, Archive
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  getBlogPosts, saveBlogPost, deleteBlogPost,
  getCaseStudies, saveCaseStudy, deleteCaseStudy,
  getSurveyResponses, deleteSurveyResponse, SurveyResponse,
  getQuoteSubmissions, deleteQuoteSubmission, QuoteSubmission,
  getAIInteractions, deleteAIInteraction, AIInteraction
} from "../lib/dataStore";
import { BlogPost, CaseStudy } from "../types";

interface AdminPortalProps {
  onBackToApp: () => void;
}

export default function AdminPortal({ onBackToApp }: AdminPortalProps) {
  // Authentication State
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Portal Management State
  const [activeTab, setActiveTab] = useState<"surveys" | "quotes" | "ai_chats" | "blog" | "portfolio">("surveys");
  const [searchQuery, setSearchQuery] = useState("");

  // Lists from dataStore of different logs
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
  const [quotes, setQuotes] = useState<QuoteSubmission[]>([]);
  const [aiChats, setAIChats] = useState<AIInteraction[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [portfolio, setPortfolio] = useState<CaseStudy[]>([]);

  // Selected Detail views
  const [expandedSurvey, setExpandedSurvey] = useState<string | null>(null);

  // Forms / Editing states
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [editingCase, setEditingCase] = useState<Partial<CaseStudy> | null>(null);

  // Non-blocking iframe safe deletion confirmation state
  const [deleteConfirmations, setDeleteConfirmations] = useState<{ [id: string]: boolean }>({});

  const promptDelete = (id: string, performDelete: () => void) => {
    if (deleteConfirmations[id]) {
      performDelete();
      setDeleteConfirmations(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } else {
      setDeleteConfirmations(prev => ({ ...prev, [id]: true }));
      // Auto-reset after 4 seconds
      setTimeout(() => {
        setDeleteConfirmations(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }, 4000);
    }
  };

  // Load all logs
  const loadPortalData = () => {
    setSurveys(getSurveyResponses());
    setQuotes(getQuoteSubmissions());
    setAIChats(getAIInteractions());
    setBlogs(getBlogPosts());
    setPortfolio(getCaseStudies());
  };

  useEffect(() => {
    // Check if authenticated in active session
    const auth = sessionStorage.getItem("fusion_admin_session_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    loadPortalData();

    // Listen for global data updates
    const handleUpdate = () => {
      loadPortalData();
    };
    window.addEventListener("fusion_data_update", handleUpdate);
    return () => {
      window.removeEventListener("fusion_data_update", handleUpdate);
      // Always automatically lock the admin console when it is exited (unmounted)
      sessionStorage.removeItem("fusion_admin_session_auth");
      sessionStorage.removeItem("fusion_admin_token");
      window.dispatchEvent(new Event("fusion_auth_change"));
    };
  }, []);

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Support clear default passwords: "sweet papaya"
    const validPasswords = ["sweet papaya"];
    const sanitizedInput = password.trim().toLowerCase();
    if (validPasswords.includes(sanitizedInput)) {
      setIsAuthenticated(true);
      setLoginError("");
      sessionStorage.setItem("fusion_admin_session_auth", "true");
      sessionStorage.setItem("fusion_admin_token", sanitizedInput);
      
      // Dispatch authorization state change for dynamic secure backend pull
      window.dispatchEvent(new Event("fusion_auth_change"));
      
      setTimeout(() => {
        loadPortalData();
      }, 150);
    } else {
      setLoginError("Variable authentication checksum mismatch. Unauthorized access.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("fusion_admin_session_auth");
    sessionStorage.removeItem("fusion_admin_token");
    window.dispatchEvent(new Event("fusion_auth_change"));
  };

  // Blog submission save
  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog?.title || !editingBlog?.category) return;

    const fullPost: BlogPost = {
      id: editingBlog.id || `BLOG-${Math.floor(Math.random() * 100000)}`,
      title: editingBlog.title,
      category: editingBlog.category,
      date: editingBlog.date || new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" }),
      readTime: editingBlog.readTime || "5 min read",
      author: editingBlog.author || "Fusion Team",
      excerpt: editingBlog.excerpt || "",
      content: editingBlog.content || ["No content entered."]
    };

    saveBlogPost(fullPost);
    setEditingBlog(null);
  };

  // Case study submission save
  const handleSaveCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCase?.title || !editingCase?.category || !editingCase?.client) return;

    const fullCase: CaseStudy = {
      id: editingCase.id || `CS-${Math.floor(Math.random() * 100000)}`,
      title: editingCase.title,
      category: editingCase.category,
      client: editingCase.client,
      year: editingCase.year || new Date().getFullYear().toString(),
      summary: editingCase.summary || "",
      description: editingCase.description || "",
      tech: editingCase.tech || ["React", "Tailwind CSS"],
      role: editingCase.role || "Lead Architect & UI Engineering",
      projectUrl: editingCase.projectUrl || ""
    };

    saveCaseStudy(fullCase);
    setEditingCase(null);
  };

  // Render Login state
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 h-full" id="admin-login-view">
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-2xl border border-white/[0.08] bg-[#090909]/80 backdrop-blur-md space-y-6 shadow-2xl relative overflow-hidden"
        >
          {/* Top aesthetic ambient trace */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#00cbd6] to-transparent" />

          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-white/[0.02] border border-white/10 rounded-full flex items-center justify-center mx-auto text-white">
              <Lock className="w-5 h-5 text-[#00cbd6]" />
            </div>
            <h3 className="font-display text-xl text-white font-medium tracking-tight">Admin Authentication</h3>
            <p className="text-[10px] font-mono text-white/40 tracking-wider uppercase">FUSION SYSTEMS OPERATIONS HUB</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5 relative">
              <label className="font-mono text-[9px] text-white/50 uppercase tracking-widest block">ADMIN ACCESS KEY</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter system access bypass key"
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-xs text-white focus:outline-none focus:border-[#00cbd6] placeholder-white/20 transition-all font-mono"
                  autoFocus
                />
                <Key className="w-3.5 h-3.5 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors text-[10px] uppercase font-mono cursor-pointer"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 flex items-start gap-2.5 text-[10px] text-red-400 font-mono">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="pt-2 flex gap-3 text-xs">
              <button 
                type="button"
                onClick={onBackToApp}
                className="flex-1 font-mono text-white/60 hover:text-white border border-white/10 hover:border-white/20 py-2.5 px-4 rounded-xl transition-all cursor-pointer text-center"
              >
                RETURN HOME
              </button>
              <button 
                type="submit"
                className="flex-1 font-mono bg-[#00cbd6] hover:bg-[#00b2bd] text-black font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <span>BYPASS LOG</span>
                <Unlock className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-white/[0.04] text-center">
            <span className="font-mono text-[8px] text-white/25">PASSCODES FOR EVALUATION: sweet papaya</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // Filter logs based on search query
  const filteredSurveys = surveys.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQuotes = quotes.filter(q => 
    q.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    q.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAIChats = aiChats.filter(c => 
    c.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.response.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPortfolio = portfolio.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in" id="admin-portal-dashboard">
      
      {/* 1. Header Area with admin indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/[0.06] pb-6 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#00cbd6]" />
            <span className="font-mono text-[10px] text-[#00cbd6] tracking-widest uppercase font-bold">
              ADMIN CONTROL CENTER
            </span>
          </div>
          <h2 className="font-display font-medium text-2xl md:text-3xl text-white tracking-tight">
            System Operations Panel
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadPortalData}
            className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.08] border border-white/10 text-white transition-colors cursor-pointer"
            title="Refresh logs from local pipeline store"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleLogout}
            className="font-mono text-xs text-white/50 hover:text-red-400 px-4 py-2 rounded-xl border border-white/5 hover:border-red-500/10 transition-all cursor-pointer"
          >
            LOCK CONSOLE
          </button>

          <button
            onClick={onBackToApp}
            className="font-mono text-xs bg-white text-black font-semibold hover:bg-[#ededea] px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>EXIT HUB</span>
          </button>
        </div>
      </div>

      {/* 2. Control stats counters */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Surveys Ingested", value: surveys.length, color: "text-[#00cbd6]" },
          { label: "Quotes Generated", value: quotes.length, color: "text-amber-500" },
          { label: "AI Chats Tracked", value: aiChats.length, color: "text-purple-400" },
          { label: "Blogs Registered", value: blogs.length, color: "text-emerald-400" },
          { label: "Portfolio Items", value: portfolio.length, color: "text-pink-400" }
        ].map((stat, i) => (
          <div key={i} className="p-4 bg-[#090909]/60 backdrop-blur-md border border-white/[0.04] rounded-2xl flex flex-col justify-center shadow-xl">
            <span className="font-mono text-[9px] text-[#8e8e89] uppercase tracking-wider uppercase">{stat.label}</span>
            <span className={`text-2xl font-bold font-mono mt-1 ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* 3. Main Search & Nav Rail */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-white/[0.03] pb-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 font-mono text-xs">
          {[
            { id: "surveys", label: "SURVEYS INTAKE", icon: FileText },
            { id: "quotes", label: "PROJECT QUOTES", icon: Quote },
            { id: "ai_chats", label: "AI CHAT LOGS", icon: Bot },
            { id: "blog", label: "MANAGE BLOG", icon: Calendar },
            { id: "portfolio", label: "MANAGE PORTFOLIO", icon: Briefcase }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSearchQuery("");
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap text-xs ${
                  isSelected ? "bg-white/[0.08] text-[#00cbd6] border border-white/10" : "text-[#8e8e89] hover:text-white border border-transparent"
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder={`Search active index of ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.01] focus:bg-white/[0.03] border border-white/5 focus:border-[#00cbd6] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/20 focus:outline-none transition-all font-sans"
          />
          <Search className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* 4. Tab content dynamic rendering */}
      <div className="space-y-6">

        {/* ========================================================= */}
        {/* TAB: SURVEYS */}
        {/* ========================================================= */}
        {activeTab === "surveys" && (
          <div className="space-y-4">
            {filteredSurveys.length === 0 ? (
              <div className="text-center py-16 border border-white/[0.03] bg-[#090909]/60 backdrop-blur-md rounded-2xl shadow-xl">
                <FileText className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-xs text-[#8e8e89] italic font-mono uppercase tracking-wider">No matching Discovery Surveys found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSurveys.map((survey) => {
                  const isExpanded = expandedSurvey === survey.id;
                  return (
                    <div 
                      key={survey.id}
                      className="border border-white/[0.04] bg-[#090909]/55 backdrop-blur-md hover:bg-[#090909]/80 rounded-2xl p-5 transition-all space-y-4 shadow-xl"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-white">{survey.company}</span>
                            <span className="font-mono text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/10 px-2 rounded">
                              DISCOVERY: {survey.id}
                            </span>
                            <span className="font-mono text-[9px] text-[#8e8e89]">Ingested: {survey.timestamp}</span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8e8e89]">
                            <span>Contact: <strong className="text-white/80 font-sans">{survey.name}</strong></span>
                            <span>•</span>
                            <span>Email: <a href={`mailto:${survey.email}`} className="text-sky-400 hover:underline">{survey.email}</a></span>
                            <span>•</span>
                            <span>Phone: <span className="font-mono text-[11px] text-white/70">{survey.phone}</span></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => setExpandedSurvey(isExpanded ? null : survey.id)}
                            className="text-xs font-mono px-3.5 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-white/80 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span>{isExpanded ? "COLLAPSE SPEC" : "VIEW DETAILED SPEC"}</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              promptDelete(survey.id, () => deleteSurveyResponse(survey.id));
                            }}
                            className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                              deleteConfirmations[survey.id]
                                ? "border-red-500 bg-red-500/20 text-white animate-pulse"
                                : "border-red-500/15 bg-transparent hover:bg-red-500/10 text-red-400"
                            }`}
                            title={deleteConfirmations[survey.id] ? "Click again to confirm permanent removal" : "Delete Survey Record"}
                          >
                            {deleteConfirmations[survey.id] ? (
                              <span className="text-[9px] font-mono font-bold uppercase transition-all">CONFIRM?</span>
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded variables view */}
                      {isExpanded && (
                        <div className="bg-[#090909]/80 backdrop-blur-md border border-white/[0.04] p-5 rounded-xl space-y-6 font-sans text-xs animate-fade-in text-[#8e8e89] leading-relaxed shadow-lg">
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3.5 bg-white/[0.01] rounded-lg space-y-1">
                              <span className="font-mono text-[8.5px] text-white/40 block tracking-widest uppercase">Target Timeline</span>
                              <p className="text-white font-medium text-xs">{survey.timeline}</p>
                            </div>
                            <div className="p-3.5 bg-white/[0.01] rounded-lg space-y-1">
                              <span className="font-mono text-[8.5px] text-white/40 block tracking-widest uppercase">Target Budget Range</span>
                              <p className="text-[#00cbd6] font-bold text-xs uppercase">{survey.budget}</p>
                            </div>
                          </div>

                          <div className="space-y-1.5 border-t border-white/[0.03] pt-4">
                            <span className="font-mono text-[9px] text-[#00cbd6] font-semibold uppercase tracking-wider block">1. Company Background Detail</span>
                            <blockquote className="border-l-2 border-[#00cbd6] pl-3.5 italic text-white/90">
                              "{survey.q1_businessAbout || 'Not specified'}"
                            </blockquote>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-white/[0.03] pt-4">
                            <div className="space-y-2">
                              <span className="font-mono text-[9px] text-violet-400 font-semibold uppercase tracking-wider block">2. Goals & Performance Targets</span>
                              <div className="flex flex-wrap gap-1.5">
                                {survey.q2_achievements?.map((goal, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-violet-500/5 text-violet-300 border border-violet-500/10 rounded text-[10px] font-mono">
                                    {goal}
                                  </span>
                                ))}
                              </div>
                              {survey.q2_achievementsOther && (
                                <p className="text-white/70 italic mt-1 font-sans">Other: "{survey.q2_achievementsOther}"</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <span className="font-mono text-[9px] text-amber-400 font-semibold uppercase tracking-wider block">3. Web Development Requirements</span>
                              <p className="text-white/80 mb-1">Interest Tier: <strong className="uppercase font-mono text-[10px] bg-amber-500/5 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/10 ml-1">{survey.q3_webInterest || 'Not Inquired'}</strong></p>
                              {survey.q4_webPackages && survey.q4_webPackages.length > 0 && (
                                <div className="space-y-1">
                                  <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest leading-none">Modules Requested:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {survey.q4_webPackages.map((pkg, idx) => (
                                      <span key={idx} className="px-1.5 py-0.2 rounded bg-amber-500/5 text-amber-400 font-mono text-[9px] border border-amber-500/10">
                                        {pkg}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {survey.q5_webPagesFeatures && (
                                <p className="text-white/70 italic mt-1 bg-white/[0.01] p-2.5 rounded-lg">Feats: "{survey.q5_webPagesFeatures}"</p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-white/[0.03] pt-4">
                            <div className="space-y-2">
                              <span className="font-mono text-[9px] text-sky-400 font-semibold uppercase tracking-wider block">4. Custom AI Integration Parameters</span>
                              <p className="text-white/80 mb-1">Interest Tier: <strong className="uppercase font-mono text-[10px] bg-sky-500/5 text-sky-300 px-1.5 py-0.2 rounded border border-sky-500/10 ml-1">{survey.q6_aiInterest || 'Not Inquired'}</strong></p>
                              {survey.q7_aiSolutions && survey.q7_aiSolutions.length > 0 && (
                                <div className="space-y-1">
                                  <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest leading-none">Architectures:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {survey.q7_aiSolutions.map((sol, index) => (
                                      <span key={index} className="px-1.5 py-0.2 rounded bg-sky-500/5 text-sky-400 font-mono text-[9px] border border-sky-500/10">
                                        {sol}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {survey.q8_aiTasks && (
                                <p className="text-white/70 italic mt-1 bg-white/[0.01] p-2.5 rounded-lg">Tasks: "{survey.q8_aiTasks}"</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <span className="font-mono text-[9px] text-pink-400 font-semibold uppercase tracking-wider block">5. UX Design Aesthetic & Inspiration</span>
                              <p className="text-white/80">Style: <strong className="text-white">{survey.q9_lookAndFeel || 'Minimal Dark'}</strong></p>
                              <p className="text-white/70 italic bg-white/[0.01] p-2.5 rounded-lg mt-1">Inspirations: "{survey.q10_inspirations || 'None provided'}"</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: QUOTES */}
        {/* ========================================================= */}
        {activeTab === "quotes" && (
          <div className="space-y-4">
            {filteredQuotes.length === 0 ? (
              <div className="text-center py-16 border border-white/[0.03] bg-[#090909]/60 backdrop-blur-md rounded-2xl shadow-xl">
                <Quote className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-xs text-[#8e8e89] italic font-mono uppercase tracking-wider">No matching Project Quotes found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredQuotes.map((quote) => (
                  <div 
                    key={quote.id}
                    className="p-5 rounded-2xl border border-white/[0.04] bg-[#090909]/60 backdrop-blur-md hover:bg-[#090909]/80 transition-all flex flex-col justify-between space-y-4 shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <h4 className="text-white font-semibold text-sm truncate max-w-[200px]">{quote.projectName}</h4>
                          <span className="font-mono text-[8px] text-[#8e8e89]">{quote.timestamp}</span>
                        </div>
                        <span className="font-mono text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/10 px-1.5 py-0.2 rounded">
                          ID: {quote.id}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 bg-white/[0.01] border border-white/[0.04] rounded-lg p-3 font-mono text-[10px]">
                        <div>
                          <span className="text-white/40 block text-[8px]">ESTIMATED HOURS:</span>
                          <span className="text-white font-bold">{quote.estimateHours} hours</span>
                        </div>
                        <div>
                          <span className="text-white/40 block text-[8px]">BUDGET MULTIPLIER:</span>
                          <span className="text-amber-400 font-bold uppercase">{quote.budget}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="font-mono text-[8px] text-[#8e8e89] block tracking-wide">REQUESTED UTILITY TARGETS:</span>
                        <div className="flex flex-wrap gap-1">
                          {quote.selectedGoals.map((g, i) => (
                            <span key={i} className="px-1.5 py-0.2 rounded bg-white/5 border border-white/5 text-[9px] font-mono text-white/70">
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-[#8e8e89]">
                        Client Contact Email: <a href={`mailto:${quote.email}`} className="text-[#00cbd6] hover:underline font-serif">{quote.email}</a>
                      </p>
                    </div>

                    <div className="border-t border-white/[0.03] pt-3 flex justify-end">
                      <button
                        onClick={() => {
                          promptDelete(quote.id, () => deleteQuoteSubmission(quote.id));
                        }}
                        className={`text-[10px] font-mono py-1 px-2 border rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                          deleteConfirmations[quote.id]
                            ? "bg-red-500/20 text-white border-red-500 animate-pulse"
                            : "text-red-400 hover:text-red-300 hover:bg-red-500/5 border-transparent hover:border-red-500/10"
                        }`}
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{deleteConfirmations[quote.id] ? "CLICK TO CONFIRM" : "REMOVE DISPATCH"}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: AI CHATS */}
        {/* ========================================================= */}
        {activeTab === "ai_chats" && (
          <div className="space-y-4">
            {filteredAIChats.length === 0 ? (
              <div className="text-center py-16 border border-white/[0.03] bg-[#090909]/60 backdrop-blur-md rounded-2xl shadow-xl">
                <Bot className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-xs text-[#8e8e89] italic font-mono uppercase tracking-wider">No matching AI chat sessions traced</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAIChats.map((chat, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl border border-white/[0.04] bg-[#090909]/60 backdrop-blur-md hover:bg-[#090909]/85 transition-all space-y-3 relative overflow-hidden shadow-xl"
                  >
                    <div className="flex items-center justify-between font-mono text-[9px] text-[#8e8e89] border-b border-white/[0.03] pb-2.5">
                      <div className="flex items-center gap-2">
                        <Bot className="w-3.5 h-3.5 text-purple-400" />
                        <span>INTERACTIVE VECTOR FEEDBACK TRACE</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>{chat.timestamp}</span>
                        <button
                          onClick={() => {
                            promptDelete(chat.timestamp, () => deleteAIInteraction(chat.timestamp));
                          }}
                          className={`transition-colors cursor-pointer text-xs px-1.5 py-0.5 rounded border ${
                            deleteConfirmations[chat.timestamp]
                              ? "bg-red-500/20 text-white border-red-500 animate-pulse"
                              : "text-[#8e8e89] hover:text-red-400 border-transparent"
                          }`}
                          title={deleteConfirmations[chat.timestamp] ? "Click again to confirm" : "Delete Session trace"}
                        >
                          <div className="flex items-center gap-1 font-mono text-[8px]">
                            <Trash2 className="w-3 h-3" />
                            {deleteConfirmations[chat.timestamp] && <span>CONFIRM?</span>}
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                      <div className="space-y-1 bg-[#090909]/80 backdrop-blur-sm border border-white/5 p-3 rounded-xl">
                        <span className="font-mono text-[8px] text-[#8e8e89] block tracking-widest uppercase">USER INPUT QUERY:</span>
                        <p className="text-white font-medium italic">"{chat.prompt}"</p>
                      </div>
                      <div className="space-y-1 bg-[#090909]/80 backdrop-blur-sm border border-white/[0.03] p-3 rounded-xl">
                        <span className="font-mono text-[8px] text-purple-400 block tracking-widest uppercase flex items-center gap-1">
                          <span>SYSTEM GENERATED BLUEPRINT:</span>
                          {chat.blueprintTitle && <strong className="text-white uppercase">[{chat.blueprintTitle}]</strong>}
                        </span>
                        <p className="text-[#8e8e89] font-sans">"{chat.response}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: BLOG */}
        {/* ========================================================= */}
        {activeTab === "blog" && (
          <div className="space-y-6">
            
            {/* Form Toggle button or Panel */}
            <AnimatePresence mode="wait">
              {editingBlog ? (
                <motion.div 
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="bg-[#090909]/80 backdrop-blur-md border border-white/[0.08] p-6 rounded-2xl space-y-4 shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                    <h4 className="font-display font-medium text-white text-base">
                      {editingBlog.id ? `Editing: ${editingBlog.title}` : "Create Dynamic Studio Thought Blog Entry"}
                    </h4>
                    <button 
                      onClick={() => setEditingBlog(null)}
                      className="p-1 rounded-full hover:bg-white/5 text-[#8e8e89] hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveBlog} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[8.5px] text-[#8e8e89] uppercase tracking-wider">THOUGHT CATEGORY / HUB</label>
                      <input 
                        type="text"
                        value={editingBlog.category || ""}
                        onChange={(e) => setEditingBlog({...editingBlog, category: e.target.value})}
                        placeholder="e.g. CORE SYSTEMS, CYBERNETICS"
                        className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-white uppercase font-mono placeholder-white/20 focus:outline-none focus:border-[#00cbd6]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[8.5px] text-[#8e8e89] uppercase tracking-wider">READING PERIOD TIME LIMIT</label>
                      <input 
                        type="text"
                        value={editingBlog.readTime || ""}
                        onChange={(e) => setEditingBlog({...editingBlog, readTime: e.target.value})}
                        placeholder="e.g. 4 min read, 12 min audit"
                        className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00cbd6]"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="font-mono text-[8.5px] text-[#8e8e89] uppercase tracking-wider block">AUTHOR PROFILE</label>
                      <select 
                        value={editingBlog.author || "Fusion Team"}
                        onChange={(e) => setEditingBlog({...editingBlog, author: e.target.value as any})}
                        className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#00cbd6] font-mono cursor-pointer"
                      >
                        <option value="Fusion Team" className="bg-[#050505] text-white">Fusion Team</option>
                        <option value="Founder" className="bg-[#050505] text-white">Founder</option>
                        <option value="Sales Team" className="bg-[#050505] text-white">Sales Team</option>
                      </select>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="font-mono text-[8.5px] text-[#8e8e89] uppercase tracking-wider">ESSENTIAL REGISTERED TITLE</label>
                      <input 
                        type="text"
                        value={editingBlog.title || ""}
                        onChange={(e) => setEditingBlog({...editingBlog, title: e.target.value})}
                        placeholder="Input the core title of study"
                        className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00cbd6]"
                        required
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="font-mono text-[8.5px] text-[#8e8e89] uppercase tracking-wider">TEASER / CARD EXCERPT</label>
                      <textarea 
                        value={editingBlog.excerpt || ""}
                        onChange={(e) => setEditingBlog({...editingBlog, excerpt: e.target.value})}
                        placeholder="Provide a fast, intriguing description shown in card grid displays"
                        rows={2}
                        className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00cbd6] font-sans"
                        required
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="font-mono text-[8.5px] text-[#8e8e89] uppercase tracking-wider block">MAIN NARRATIVE CONTENT (SEPARATE PARAGRAPHS BY DOUBLE ENTER. USE #, ##, OR ### FOR HEADINGS)</label>
                      <textarea 
                        value={editingBlog.content?.join("\n\n") || ""}
                        onChange={(e) => {
                          const paragraphs = e.target.value.split("\n\n").filter(Boolean);
                          setEditingBlog({...editingBlog, content: paragraphs});
                        }}
                        placeholder="Enter essay content paragraphs here. Press enter twice to start a new paragraph. You can format subheadings by starting a paragraph with '## Your Subheading' or '### Small Subtitle'."
                        rows={8}
                        className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00cbd6] font-sans leading-relaxed"
                        required
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setEditingBlog(null)}
                        className="font-mono text-xs px-4 py-2 border border-white/10 hover:border-white/20 rounded-xl transition-all cursor-pointer text-white/70 hover:text-white"
                      >
                        CLOSE FORM
                      </button>
                      <button 
                        type="submit"
                        className="font-mono text-xs px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        <span>PUBLISH LIVE thought</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <div className="flex justify-between items-center">
                  <h4 className="font-mono text-xs text-white/50 uppercase tracking-widest">Active Blog Entries</h4>
                  <button
                    onClick={() => setEditingBlog({})}
                    className="font-mono text-xs bg-emerald-500 hover:bg-emerald-600 text-black py-2 px-4 rounded-xl font-bold transition-all hover:scale-[1.01] cursor-pointer flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>ADD STUDIO BLOG POST</span>
                  </button>
                </div>
              )}
            </AnimatePresence>

            {/* List existing blogs */}
            <div className="space-y-3 pt-2">
              {filteredBlogs.map((post) => (
                <div 
                  key={post.id}
                  className="p-4 rounded-xl border border-white/[0.04] bg-[#090909]/60 backdrop-blur-md hover:bg-[#090909]/85 transition-all flex items-center justify-between gap-4 shadow-xl"
                >
                  <div className="space-y-1 truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-1.5 rounded uppercase block">{post.category}</span>
                      <span className="text-[10px] text-white/30 font-mono">{post.date}</span>
                    </div>
                    <h5 className="text-white font-medium text-xs sm:text-sm truncate">{post.title}</h5>
                    <p className="text-[#8e8e89] text-[11px] truncate max-w-xl">{post.excerpt}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setEditingBlog(post)}
                      className="p-2 rounded bg-white/[0.02] hover:bg-white/10 border border-white/5 text-white/80 hover:text-white transition-colors cursor-pointer"
                      title="Edit Post Content"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        promptDelete(post.id, () => deleteBlogPost(post.id));
                      }}
                      className={`p-2 rounded border transition-colors cursor-pointer ${
                        deleteConfirmations[post.id]
                          ? "bg-red-500/20 border-red-500 text-white animate-pulse"
                          : "bg-red-500/5 hover:bg-red-500/15 border-red-500/10 text-red-400"
                      }`}
                      title={deleteConfirmations[post.id] ? "Click again to confirm delete" : "Delete Post"}
                    >
                      {deleteConfirmations[post.id] ? (
                        <span className="text-[9px] font-mono font-bold px-1 uppercase">CONFIRM?</span>
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: PORTFOLIO */}
        {/* ========================================================= */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            
            {/* Form Panel or Toggle */}
            <AnimatePresence mode="wait">
              {editingCase ? (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-[#090909]/80 backdrop-blur-md border border-white/[0.08] p-6 rounded-2xl space-y-4 shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                    <h4 className="font-display font-medium text-white text-base">
                      {editingCase.id ? `Editing Case Study: ${editingCase.title}` : "Incorporate Premium Portfolio Project"}
                    </h4>
                    <button 
                      onClick={() => setEditingCase(null)}
                      className="p-1 rounded-full hover:bg-white/5 text-[#8e8e89] hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveCase} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <div className="space-y-1">
                      <label className="font-mono text-[8.5px] text-[#8e8e89] uppercase tracking-wider">PROJECT CATEGORY / TIERID</label>
                      <input 
                        type="text"
                        value={editingCase.category || ""}
                        onChange={(e) => setEditingCase({...editingCase, category: e.target.value})}
                        placeholder="e.g. COGNITIVE PIPELINE, SECURE SHEAF"
                        className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-white uppercase font-mono placeholder-white/20 focus:outline-none focus:border-[#00cbd6]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[8.5px] text-[#8e8e89] uppercase tracking-wider">CLIENT OR PARTNER TITLE</label>
                      <input 
                        type="text"
                        value={editingCase.client || ""}
                        onChange={(e) => setEditingCase({...editingCase, client: e.target.value})}
                        placeholder="e.g. LUMINEX HOLDINGS, COGNITION"
                        className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00cbd6]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[8.5px] text-[#8e8e89] uppercase tracking-wider">LAUNCH CALENDAR YEAR</label>
                      <input 
                        type="text"
                        value={editingCase.year || ""}
                        onChange={(e) => setEditingCase({...editingCase, year: e.target.value})}
                        placeholder="e.g. 2026, IN PHASE"
                        className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00cbd6]"
                        required
                      />
                    </div>

                    <div className="space-y-1 md:col-span-3">
                      <label className="font-mono text-[8.5px] text-[#8e8e89] uppercase tracking-wider">UNIQUE PROJECT HEADLINE / TITLE</label>
                      <input 
                        type="text"
                        value={editingCase.title || ""}
                        onChange={(e) => setEditingCase({...editingCase, title: e.target.value})}
                        placeholder="Title of Case Study"
                        className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00cbd6]"
                        required
                      />
                    </div>

                    <div className="space-y-1 md:col-span-3">
                      <label className="font-mono text-[8.5px] text-[#8e8e89] uppercase tracking-wider">OBJECTIVE ESSENTIAL SUMMARY (1 SENTENCE)</label>
                      <textarea 
                        value={editingCase.summary || ""}
                        onChange={(e) => setEditingCase({...editingCase, summary: e.target.value})}
                        placeholder="Brief summary sentence outlining objective outcomes"
                        rows={2}
                        className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00cbd6]"
                        required
                      />
                    </div>

                    <div className="space-y-1 md:col-span-3">
                      <label className="font-mono text-[8.5px] text-[#8e8e89] uppercase tracking-wider block">EXECUTION NARRATIVE & DELIVERY</label>
                      <textarea 
                        value={editingCase.description || ""}
                        onChange={(e) => setEditingCase({...editingCase, description: e.target.value})}
                        placeholder="Step-by-step description of technical hurdles resolved and final results delivered"
                        rows={4}
                        className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00cbd6]"
                        required
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="font-mono text-[8.5px] text-[#8e8e89] uppercase tracking-wider">APPOINTED TEAM ROLE DESCRIPTION</label>
                      <input 
                        type="text"
                        value={editingCase.role || ""}
                        onChange={(e) => setEditingCase({...editingCase, role: e.target.value})}
                        placeholder="e.g. Lead System Architecture & AI Pipeline Design"
                        className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00cbd6]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[8.5px] text-[#8e8e89] uppercase tracking-wider block">TECH-STACK COMPONENTS (COMMA SEPARATED)</label>
                      <input 
                        type="text"
                        value={editingCase.tech?.join(", ") || ""}
                        onChange={(e) => {
                          const splitArr = e.target.value.split(",").map(item => item.trim()).filter(Boolean);
                          setEditingCase({...editingCase, tech: splitArr});
                        }}
                        placeholder="React, Firebase, D3"
                        className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00cbd6]"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-3">
                      <label className="font-mono text-[8.5px] text-[#00cbd6] uppercase tracking-wider block">PROJECT EXTERNAL URL / DESTINATION LINK</label>
                      <input 
                        type="url"
                        value={editingCase.projectUrl || ""}
                        onChange={(e) => setEditingCase({...editingCase, projectUrl: e.target.value})}
                        placeholder="e.g. https://github.com or https://company-site.com"
                        className="w-full bg-[#050505] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#00cbd6] font-mono"
                      />
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setEditingCase(null)}
                        className="font-mono text-xs px-4 py-2 border border-white/10 hover:border-white/20 rounded-xl transition-all cursor-pointer text-white/70 hover:text-white"
                      >
                        CLOSE FORM
                      </button>
                      <button 
                        type="submit"
                        className="font-mono text-xs px-5 py-2 bg-pink-500 hover:bg-pink-600 text-black font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        <span>REGISTER PORTFOLIO CASE</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <div className="flex justify-between items-center">
                  <h4 className="font-mono text-xs text-white/50 uppercase tracking-widest">Active System Ventures</h4>
                  <button
                    onClick={() => setEditingCase({})}
                    className="font-mono text-xs bg-pink-500 hover:bg-pink-600 text-black py-2 px-4 rounded-xl font-bold transition-all hover:scale-[1.01] cursor-pointer flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>ADD PORTFOLIO ITEM</span>
                  </button>
                </div>
              )}
            </AnimatePresence>

            {/* List existing portfolio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {filteredPortfolio.map((project) => (
                <div 
                  key={project.id}
                  className="p-5 rounded-2xl border border-white/[0.04] bg-[#090909]/60 backdrop-blur-md hover:bg-[#090909]/85 transition-all flex flex-col justify-between space-y-4 shadow-xl"
                >
                  <div className="space-y-2 truncate">
                    <div className="flex items-center justify-between font-mono text-[9px] text-[#8e8e89]">
                      <span className="bg-pink-500/10 text-pink-400 border border-pink-500/10 px-1.5 rounded uppercase block">{project.category}</span>
                      <span>Launch: {project.year}</span>
                    </div>
                    <h5 className="text-white font-semibold text-sm truncate">{project.title}</h5>
                    <p className="text-[#8e8e89] text-[11px] line-clamp-2 leading-relaxed">{project.summary}</p>
                    <p className="text-white/40 text-[10px] font-mono leading-none truncate">Client: {project.client}</p>
                  </div>

                  <div className="border-t border-white/[0.03] pt-3.5 flex items-center justify-between gap-3 flex-shrink-0">
                    <div className="flex flex-wrap gap-1">
                      {project.tech.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="font-mono text-[8px] bg-white/5 text-white/50 px-1.5 py-0.2 rounded">
                          {t}
                        </span>
                      ))}
                      {project.tech.length > 3 && <span className="font-mono text-[8px] text-white/30">+{project.tech.length - 3} more</span>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingCase(project)}
                        className="p-1 rounded text-white/50 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer"
                        title="Edit Project Spec"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          promptDelete(project.id, () => deleteCaseStudy(project.id));
                        }}
                        className={`p-1.5 rounded transition-colors cursor-pointer border ${
                          deleteConfirmations[project.id]
                            ? "bg-red-500/20 border-red-500 text-white animate-pulse"
                            : "text-red-500/50 hover:text-red-400 hover:bg-red-500/5 border-transparent hover:border-red-500/10"
                        }`}
                        title={deleteConfirmations[project.id] ? "Click again to confirm delete" : "Remove project study"}
                      >
                        {deleteConfirmations[project.id] ? (
                          <span className="text-[8px] font-mono font-bold uppercase px-0.5">CONFIRM?</span>
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
