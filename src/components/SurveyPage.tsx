import React, { useState, useEffect, useRef } from "react";
import { 
  Check, ArrowRight, ArrowLeft, Send, Sparkles, Clipboard, Trash2, 
  Calendar, ShieldCheck, Database, FileText, Bot, MessageSquare, 
  Layers, Palette, Workflow, Zap, HardDrive, HelpCircle, RefreshCw, User, Briefcase, Mail, Phone
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { saveSurveyResponse, saveAIInteraction, SurveyResponse } from "../lib/dataStore";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  systemLayout?: any;
}

export default function SurveyPage() {
  const [currentMode, setCurrentMode] = useState<"select" | "survey" | "ai">("select");
  
  const [step, setStep] = useState(1);
  
  const [q1_businessAbout, setQ1_businessAbout] = useState("");
  const [q2_achievements, setQ2_achievements] = useState<string[]>([]);
  const [q2_achievementsOther, setQ2_achievementsOther] = useState("");

  const [q3_webInterest, setQ3_webInterest] = useState("");
  const [q4_webPackages, setQ4_webPackages] = useState<string[]>([]);
  const [q5_webPagesFeatures, setQ5_webPagesFeatures] = useState("");

  const [q6_aiInterest, setQ6_aiInterest] = useState("");
  const [q7_aiSolutions, setQ7_aiSolutions] = useState<string[]>([]);
  const [q8_aiTasks, setQ8_aiTasks] = useState("");

  const [q9_lookAndFeel, setQ9_lookAndFeel] = useState("");
  const [q10_inspirations, setQ10_inspirations] = useState("");

  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [copied, setCopied] = useState(false);

  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Connection established with FUSION_II_ARCHITECT API. I am your specialized AI model routing assistant. Describe any digital application, software concept, or SaaS interface you desire to build—I will instantly map out a complete architectural blueprint, recommended tech stacks, and deployment pipelines.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  // Use a ref on the chat container div instead of scrollIntoView on a dummy element
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll only the chat box — not the whole page
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleNextStep = () => {
    if (step === 1 && !q1_businessAbout.trim()) return;
    if (step === 5) {
      if (!timeline || !budget || !contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const toggleSelect = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setList(prev => 
      prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]
    );
  };

  const handleSurveySubmit = () => {
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) return;

    const randomHex = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, "0");
    const generatedTicket = `F2-DISC-${randomHex}`;

    const newResponse: SurveyResponse = {
      id: generatedTicket,
      timestamp: new Date().toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      name: contactName,
      company: contactCompany || "N/A",
      email: contactEmail,
      phone: contactPhone,
      q1_businessAbout,
      q2_achievements: q2_achievements,
      q2_achievementsOther,
      q3_webInterest,
      q4_webPackages: q4_webPackages,
      q5_webPagesFeatures,
      q6_aiInterest,
      q7_aiSolutions: q7_aiSolutions,
      q8_aiTasks,
      q9_lookAndFeel,
      q10_inspirations,
      timeline,
      budget
    };

    saveSurveyResponse(newResponse);
    setTicketId(generatedTicket);
    setSubmitted(true);
  };

  const resetSurvey = () => {
    setStep(1);
    setQ1_businessAbout("");
    setQ2_achievements([]);
    setQ2_achievementsOther("");
    setQ3_webInterest("");
    setQ4_webPackages([]);
    setQ5_webPagesFeatures("");
    setQ6_aiInterest("");
    setQ7_aiSolutions([]);
    setQ8_aiTasks("");
    setQ9_lookAndFeel("");
    setQ10_inspirations("");
    setTimeline("");
    setBudget("");
    setContactName("");
    setContactCompany("");
    setContactEmail("");
    setContactPhone("");
    setSubmitted(false);
    setTicketId("");
  };

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = customText || userInput;
    if (!query.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setUserInput("");
    setIsTyping(true);

    fetch("/api/generate_ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: query })
    })
      .then(r => {
        if (!r.ok) throw new Error("Grok service connection failure");
        return r.json();
      })
      .then(data => {
        const botMsgText = data.text || "System diagnostics finalized.";
        const systemLayout = data.systemLayout || null;

        setMessages(prev => [...prev, {
          sender: "bot",
          text: botMsgText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          systemLayout
        }]);

        saveAIInteraction({
          id: "AIC-" + Math.floor(Math.random() * 1000000),
          timestamp: new Date().toLocaleDateString("en-ZA", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }),
          prompt: query,
          response: botMsgText,
          blueprintTitle: systemLayout ? systemLayout.title : undefined
        });
      })
      .catch(err => {
        console.error("AI Generation error:", err);
        setMessages(prev => [...prev, {
          sender: "bot",
          text: "Failed to connect to the AI service. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }]);
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  const suggestedPrompts = [
    "Build a custom SaaS user metrics dashboard",
    "Design an autonomous customer chat AI agent",
    "Create a fast headless store with secure checkout",
    "Construct a secure operations workflow platform"
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6 animate-fade-in" id="portal-root">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/[0.05] pb-6 gap-4">
        <div className="border-l-2 border-[#00cbd6]/40 pl-6 space-y-1">
          <span className="font-mono text-[9px] text-[#00cbd6] tracking-widest uppercase block">
            [ SYSTEM INITIATE WORKSPACE ]
          </span>
          <h2 className="font-monstercat font-semibold text-2xl md:text-3xl text-white tracking-tight">
            Fusion II Integration Hub
          </h2>
          <p className="text-xs text-[#8e8e89] max-w-xl font-sans">
            Secure your project alignment. Choose our high-precision Project Discovery Form to outline company metrics, website goals, design aesthetics, and AI pipelines.
          </p>
        </div>

        {currentMode !== "select" && (
          <button
            onClick={() => setCurrentMode("select")}
            className="self-start md:self-center flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/10 hover:border-white/20 text-white font-mono text-xs rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-reverse" />
            <span>SWITCH MODE</span>
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {currentMode === "select" && (
          <motion.div
            key="selection-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"
          >
            <div 
              onClick={() => {
                resetSurvey();
                setCurrentMode("survey");
              }}
              className="group p-8 rounded-2xl border border-white/[0.04] bg-[#090909]/60 backdrop-blur-md hover:bg-white/[0.01] hover:border-[#00cbd6]/20 transition-all duration-300 relative overflow-hidden cursor-pointer flex flex-col justify-between h-[280px]"
              id="mode-survey-card"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00cbd6]/[0.01] rounded-full blur-3xl pointer-events-none group-hover:bg-[#00cbd6]/[0.03] transition-all duration-500" />
              
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#00cbd6]/10 border border-[#00cbd6]/20 flex items-center justify-center text-[#00cbd6] group-hover:scale-105 transition-transform duration-300">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-monstercat font-semibold text-lg md:text-xl text-white group-hover:text-[#00cbd6] transition-colors">
                    1. Project Discovery Form
                  </h3>
                  <p className="text-xs text-[#8e8e89] leading-relaxed font-sans">
                    Complete our comprehensive business discovery layout. Tell us about your company, website development targets, custom AI orchestration pipelines, styles, and expected timelines.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#00cbd6]/80 group-hover:text-[#00cbd6] transition-colors pt-2">
                <span>OPEN DISCOVERY FORM</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div 
              onClick={() => setCurrentMode("ai")}
              className="group p-8 rounded-2xl border border-white/[0.04] bg-[#090909]/60 backdrop-blur-md hover:bg-white/[0.01] hover:border-purple-500/20 transition-all duration-300 relative overflow-hidden cursor-pointer flex flex-col justify-between h-[280px]"
              id="mode-ai-card"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/[0.01] rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/[0.03] transition-all duration-500" />
              
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform duration-300">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-monstercat font-semibold text-lg md:text-xl text-white group-hover:text-purple-400 transition-colors">
                    2. Deconstruct with AI
                  </h3>
                  <p className="text-xs text-[#8e8e89] leading-relaxed font-sans">
                    Chat in real-time with our technical system generator. Describe any custom workspace requirements, e-commerce scopes, or software concepts to receive live structural diagram codes.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-purple-400/80 group-hover:text-purple-400 transition-colors pt-2">
                <span>ENGAGE CHAT DESK</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        )}

        {currentMode === "survey" && (
          <motion.div
            key="survey-mode-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto w-full items-start"
          >
            <div className="w-full bg-[#090909]/60 backdrop-blur-md rounded-2xl border border-white/[0.04] p-6 sm:p-8 relative overflow-hidden" id="survey-questionnaire-box">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00cbd6]/[0.01] rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-1 mb-4">
                <h3 className="font-monstercat text-lg font-bold text-white tracking-tight uppercase flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#00cbd6]" />
                  Fusion II Project Discovery Form
                </h3>
                <p className="text-[11px] text-[#8e8e89] leading-relaxed">
                  Tell us about your business, your goals, and what you want to build. Your answers help us understand your vision and recommend the right solution.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div
                    key={`discovery-step-${step}`}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col gap-2 pb-4 border-b border-white/[0.05]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] text-[#00cbd6] tracking-widest uppercase">
                          PHASE {step} OF 5 // {
                            step === 1 ? "Business Profile" :
                            step === 2 ? "Web Architecture" :
                            step === 3 ? "AI Engine Integration" :
                            step === 4 ? "Aesthetics & UX Blueprint" : "Contact & Deliverables Setup"
                          }
                        </span>
                        <span className="font-mono text-[10px] text-white/40">{Math.round((step / 5) * 100)}% COMPLETE</span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5 w-full pt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <div 
                            key={s} 
                            className={`h-1 rounded-full transition-all duration-300 ${
                              s === step ? "bg-[#00cbd6]" : s < step ? "bg-[#00cbd6]/45" : "bg-white/[0.05]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {step === 1 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b border-white/[0.03] pb-2">
                          <Briefcase className="w-4 h-4 text-[#00cbd6]" />
                          <span className="font-mono text-xs uppercase text-white tracking-widest font-semibold">Business Information</span>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-white/95">
                            1. Tell us about your business <span className="text-[#00cbd6]">*</span>
                          </label>
                          <p className="text-[10px] text-[#8e8e89]">
                            What does your company do, what industry are you in, and who are your customers?
                          </p>
                          <textarea 
                            value={q1_businessAbout}
                            onChange={(e) => setQ1_businessAbout(e.target.value)}
                            placeholder="Provide a comprehensive summary of your business profile..."
                            rows={4}
                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#00cbd6]/50 placeholder-white/20 transition-all font-sans resize-none"
                          />
                        </div>

                        <div className="space-y-3 pt-2">
                          <label className="block text-xs font-semibold text-white/95">
                            2. What are you looking to achieve with this project?
                          </label>
                          <p className="text-[10px] text-[#8e8e89] -mt-1">
                            Choose all target indicators that describe your primary objectives.
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-sans">
                            {[
                              "Improve online presence",
                              "Generate more customers/leads",
                              "Improve customer communication",
                              "Automate business processes",
                              "Save time on repetitive tasks",
                              "Create a better customer experience"
                            ].map((o) => {
                              const selected = q2_achievements.includes(o);
                              return (
                                <div 
                                  key={o}
                                  onClick={() => toggleSelect(q2_achievements, setQ2_achievements, o)}
                                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-left ${
                                    selected 
                                      ? "bg-[#00cbd6]/[0.05] border-[#00cbd6]/30 text-white" 
                                      : "bg-white/[0.01] border-white/[0.05] text-white/60 hover:bg-white/[0.02] hover:border-white/10"
                                  }`}
                                >
                                  <span className="text-[11px] font-medium">{o}</span>
                                  <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-all ${
                                    selected ? "border-[#00cbd6] bg-[#00cbd6]" : "border-white/20"
                                  }`}>
                                    {selected && <Check className="w-2 text-black stroke-[3]" />}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="space-y-1.5 pt-1">
                            <label className="block text-[10px] font-mono text-[#8e8e89] uppercase tracking-wider">Other objectives</label>
                            <input 
                              type="text"
                              value={q2_achievementsOther}
                              onChange={(e) => setQ2_achievementsOther(e.target.value)}
                              placeholder="Describe custom features or target metrics..."
                              className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00cbd6]/50 placeholder-white/20 transition-all font-sans"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b border-white/[0.03] pb-2">
                          <Layers className="w-4 h-4 text-[#00cbd6]" />
                          <span className="font-mono text-xs uppercase text-white tracking-widest font-semibold">Website Development</span>
                        </div>

                        <div className="space-y-3">
                          <label className="block text-xs font-semibold text-white/95">
                            3. Are you interested in a website development package?
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {[
                              { val: "Yes", desc: "Require a web architecture build" },
                              { val: "No", desc: "Do not require a website" },
                              { val: "Unsure", desc: "Would like tailored suggestions" }
                            ].map((item) => (
                              <div
                                key={item.val}
                                onClick={() => setQ3_webInterest(item.val)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                                  q3_webInterest === item.val
                                    ? "bg-[#00cbd6]/[0.05] border-[#00cbd6]/30 text-white"
                                    : "bg-white/[0.01] border-white/[0.05] text-white/60 hover:bg-white/[0.02] hover:border-white/10"
                                }`}
                              >
                                <span className="text-xs font-bold block">{item.val}</span>
                                <span className="text-[10px] text-[#8e8e89]">{item.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {q3_webInterest !== "No" && (
                          <div className="space-y-3 pt-2">
                            <label className="block text-xs font-semibold text-white/95">
                              4. Which package best matches your needs?
                            </label>
                            <p className="text-[10px] text-[#8e8e89] -mt-1">
                              Select any website tier you wish to explore (No pricing included).
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {["Starter Website", "Business Website", "Premium Website"].map((pkg) => {
                                const desc: Record<string, string[]> = {
                                  "Starter Website": ["Professional online presence", "Basic business info", "Contact functionality"],
                                  "Business Website": ["More advanced pages", "Custom responsive design", "Better interaction & leads"],
                                  "Premium Website": ["Advanced functionality", "Custom integrations", "High-end user experience"],
                                };
                                return (
                                  <div
                                    key={pkg}
                                    onClick={() => toggleSelect(q4_webPackages, setQ4_webPackages, pkg)}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between h-full ${
                                      q4_webPackages.includes(pkg)
                                        ? "bg-[#00cbd6]/[0.05] border-[#00cbd6]/30 text-white"
                                        : "bg-white/[0.01] border-white/[0.05] text-white/60 hover:bg-white/[0.02]"
                                    }`}
                                  >
                                    <div className="space-y-1.5">
                                      <span className="text-xs font-bold text-white block">{pkg}</span>
                                      <ul className="text-[9px] text-[#8e8e89] space-y-1 list-disc pl-3">
                                        {desc[pkg].map((d) => <li key={d}>{d}</li>)}
                                      </ul>
                                    </div>
                                    <div className="mt-4 pt-2 border-t border-white/[0.03] flex items-center justify-between text-[10px] font-mono">
                                      <span>INTERESTED</span>
                                      <div className={`w-3.5 h-3.5 rounded border ${
                                        q4_webPackages.includes(pkg) ? "border-[#00cbd6] bg-[#00cbd6]" : "border-white/20"
                                      }`} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="space-y-2 pt-2">
                          <label className="block text-xs font-semibold text-white/95">
                            5. What pages or features would you like included on your website?
                          </label>
                          <p className="text-[10px] text-[#8e8e89] -mt-1">
                            Examples: Home page, About, Services, Portfolio, Booking system, Online store, Client portal, Forms, Chatbot, etc.
                          </p>
                          <textarea 
                            value={q5_webPagesFeatures}
                            onChange={(e) => setQ5_webPagesFeatures(e.target.value)}
                            placeholder="e.g. Home page, custom booking engine, dynamic catalog..."
                            rows={3}
                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#00cbd6]/50 placeholder-white/20 transition-all font-sans resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b border-white/[0.03] pb-2">
                          <Bot className="w-4 h-4 text-purple-400" />
                          <span className="font-mono text-xs uppercase text-white tracking-widest font-semibold">AI Development</span>
                        </div>

                        <div className="space-y-3">
                          <label className="block text-xs font-semibold text-white/95">
                            6. Are you interested in implementing AI into your business?
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {[
                              { val: "Yes", desc: "Ready to integrate agent logic" },
                              { val: "No", desc: "No AI required at this time" },
                              { val: "Interested but unsure", desc: "Would like professional guidance on benefits" }
                            ].map((item) => (
                              <div
                                key={item.val}
                                onClick={() => setQ6_aiInterest(item.val)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                                  q6_aiInterest === item.val
                                    ? "bg-purple-500/[0.05] border-purple-500/30 text-white"
                                    : "bg-white/[0.01] border-white/[0.05] text-white/60 hover:bg-white/[0.02] hover:border-white/10"
                                }`}
                              >
                                <span className="text-xs font-bold block text-purple-450">{item.val}</span>
                                <span className="text-[10px] text-[#8e8e89]">{item.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {q6_aiInterest !== "No" && (
                          <div className="space-y-3 pt-2">
                            <label className="block text-xs font-semibold text-white/95">
                              7. Which solution best matches your needs?
                            </label>
                            <p className="text-[10px] text-[#8e8e89] -mt-1">
                              Select any AI model system you would like us to diagram.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {[
                                { name: "AI Assistant", items: ["Customer enquiries", "Intelligent FAQs", "Basic layout support"] },
                                { name: "AI Business Agent", items: ["Lead qualification", "Automatic follow-ups", "Automated workflows"] },
                                { name: "Custom AI System", items: ["Advanced integrations", "Business-specific automation", "Custom system pipelines"] },
                              ].map(({ name, items }) => (
                                <div
                                  key={name}
                                  onClick={() => toggleSelect(q7_aiSolutions, setQ7_aiSolutions, name)}
                                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between h-full ${
                                    q7_aiSolutions.includes(name)
                                      ? "bg-[#00cbd6]/[0.05] border-[#00cbd6]/30 text-white"
                                      : "bg-white/[0.01] border-white/[0.05] text-white/60 hover:bg-white/[0.02]"
                                  }`}
                                >
                                  <div className="space-y-1.5">
                                    <span className="text-xs font-bold text-white block">{name}</span>
                                    <ul className="text-[9px] text-[#8e8e89] space-y-1 list-disc pl-3 font-sans">
                                      {items.map((i) => <li key={i}>{i}</li>)}
                                    </ul>
                                  </div>
                                  <div className="mt-4 pt-2 border-t border-white/[0.03] flex items-center justify-between text-[10px] font-mono">
                                    <span>INTERESTED</span>
                                    <div className={`w-3.5 h-3.5 rounded border ${
                                      q7_aiSolutions.includes(name) ? "border-[#00cbd6] bg-[#00cbd6]" : "border-white/20"
                                    }`} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-2 pt-2">
                          <label className="block text-xs font-semibold text-white/95">
                            8. What would you want the AI system to help you with?
                          </label>
                          <p className="text-[10px] text-[#8e8e89] -mt-1">
                            Examples: Answering customers, booking appointments, generating leads, handling WhatsApp messages, sales follow-ups, admin tasks, etc.
                          </p>
                          <textarea 
                            value={q8_aiTasks}
                            onChange={(e) => setQ8_aiTasks(e.target.value)}
                            placeholder="Describe custom agent models, API relays, or target repetitive manual tasks..."
                            rows={3}
                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#00cbd6]/50 placeholder-white/20 transition-all font-sans resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b border-white/[0.03] pb-2">
                          <Palette className="w-4 h-4 text-purple-400" />
                          <span className="font-mono text-xs uppercase text-white tracking-widest font-semibold">Design & User Experience</span>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-white/95">
                            9. How would you like your website/system to look and feel?
                          </label>
                          <p className="text-[10px] text-[#8e8e89]">
                            Please describe your preferred color palettes, general style (modern, luxury, minimal, futuristic, corporate, etc.), layout structures, or overall vibe.
                          </p>
                          <textarea 
                            value={q9_lookAndFeel}
                            onChange={(e) => setQ9_lookAndFeel(e.target.value)}
                            placeholder="e.g. Modern minimal design with dark slate backings and electric purple outlines. Fast and editorial typography..."
                            rows={4}
                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#00cbd6]/50 placeholder-white/20 transition-all font-sans resize-none"
                          />
                        </div>

                        <div className="space-y-2 pt-2">
                          <label className="block text-xs font-semibold text-white/95">
                            10. Do you have any examples, competitors, or websites that inspire your vision?
                          </label>
                          <p className="text-[10px] text-[#8e8e89]">
                            Paste website links or general descriptions of platforms where you appreciate the performance or UI structure.
                          </p>
                          <textarea 
                            value={q10_inspirations}
                            onChange={(e) => setQ10_inspirations(e.target.value)}
                            placeholder="List URLs or competitor platforms..."
                            rows={3}
                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#00cbd6]/50 placeholder-white/20 transition-all font-sans resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {step === 5 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b border-white/[0.03] pb-2">
                          <ShieldCheck className="w-4 h-4 text-[#00cbd6]" />
                          <span className="font-mono text-xs uppercase text-white tracking-widest font-semibold">Final Project Details & Contact</span>
                        </div>

                        <div className="space-y-3">
                          <label className="block text-xs font-semibold text-white/95">
                            What is your expected timeline for this project? <span className="text-[#00cbd6]">*</span>
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 font-sans">
                            {["ASAP", "Within 1 month", "1–3 months", "No specific deadline"].map((o) => (
                              <div
                                key={o}
                                onClick={() => setTimeline(o)}
                                className={`p-3 rounded-lg border transition-all cursor-pointer text-center text-xs font-medium ${
                                  timeline === o
                                    ? "bg-[#00cbd6]/[0.05] border-[#00cbd6]/30 text-white font-bold"
                                    : "bg-white/[0.01] border-white/[0.05] text-white/60 hover:bg-white/[0.02]"
                                }`}
                              >
                                {o}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3 pt-2">
                          <label className="block text-xs font-semibold text-white/95">
                            What budget range are you considering for this project? <span className="text-[#00cbd6]">*</span>
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2 font-sans">
                            {["Under R5,000", "R5,000 – R15,000", "R15,000 – R50,000", "R50,000+", "Unsure, need guidance"].map((b) => (
                              <div
                                key={b}
                                onClick={() => setBudget(b)}
                                className={`p-3 rounded-lg border transition-all cursor-pointer text-center text-[10px] sm:text-xs font-medium flex items-center justify-center ${
                                  budget === b
                                    ? "bg-[#00cbd6]/[0.05] border-[#00cbd6]/30 text-white font-bold"
                                    : "bg-white/[0.01] border-white/[0.05] text-white/60 hover:bg-white/[0.02]"
                                }`}
                              >
                                {b}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/[0.05]">
                          <label className="block text-xs font-bold text-white tracking-wide uppercase font-mono">
                            Contact Information <span className="text-[#00cbd6]">*</span>
                          </label>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="flex items-center gap-1.5 text-[9px] font-mono text-[#8e8e89] uppercase tracking-wider">
                                <User className="w-3 h-3" /> Full Name
                              </label>
                              <input 
                                type="text" 
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                placeholder="Your full name"
                                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00cbd6]/50 placeholder-white/20 transition-all font-sans"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="flex items-center gap-1.5 text-[9px] font-mono text-[#8e8e89] uppercase tracking-wider">
                                <Briefcase className="w-3 h-3" /> Company
                              </label>
                              <input 
                                type="text" 
                                value={contactCompany}
                                onChange={(e) => setContactCompany(e.target.value)}
                                placeholder="Company name (optional)"
                                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00cbd6]/50 placeholder-white/20 transition-all font-sans"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="flex items-center gap-1.5 text-[9px] font-mono text-[#8e8e89] uppercase tracking-wider">
                                <Mail className="w-3 h-3" /> Email Address
                              </label>
                              <input 
                                type="email" 
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                placeholder="e.g. contact@venture.com"
                                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00cbd6]/50 placeholder-white/20 transition-all font-sans"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="flex items-center gap-1.5 text-[9px] font-mono text-[#8e8e89] uppercase tracking-wider">
                                <Phone className="w-3 h-3" /> Phone/WhatsApp
                              </label>
                              <input 
                                type="tel" 
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                placeholder="WhatsApp or cell number"
                                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00cbd6]/50 placeholder-white/20 transition-all font-sans"
                              />
                            </div>
                          </div>

                          <div className="p-3 bg-[#00cbd6]/[0.02] border border-[#00cbd6]/10 rounded-xl flex items-start gap-3">
                            <ShieldCheck className="w-4 h-4 text-[#00cbd6] mt-0.5 flex-shrink-0" />
                            <p className="text-[10px] text-[#8e8e89] leading-relaxed">
                              Registration inputs are saved locally inside secure sandbox storage and forwarded directly onto Fusion pipeline vectors upon connection.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.05] mt-6">
                      {step > 1 ? (
                        <button 
                          onClick={handlePrevStep}
                          className="flex items-center gap-1.5 text-xs font-mono text-white/40 hover:text-white transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>BACK PHASE</span>
                        </button>
                      ) : (
                        <div />
                      )}

                      {step < 5 ? (
                        <button 
                          onClick={handleNextStep}
                          disabled={step === 1 && !q1_businessAbout.trim()}
                          className={`flex items-center gap-1.5 font-mono text-xs px-4 py-2 rounded-lg transition-all cursor-pointer ${
                            (step === 1 && !q1_businessAbout.trim())
                              ? "bg-white/[0.02] text-white/20 border border-white/[0.04] cursor-not-allowed"
                              : "bg-white text-black font-semibold hover:bg-[#ededea]"
                          }`}
                        >
                          <span>CONTINUE STEPS</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button 
                          type="button"
                          onClick={handleSurveySubmit}
                          disabled={!contactName.trim() || !contactEmail.trim() || !contactPhone.trim() || !timeline || !budget}
                          className={`flex items-center gap-1.5 font-mono text-xs px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                            (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim() || !timeline || !budget)
                              ? "bg-white/[0.02] text-white/20 border border-white/[0.04] cursor-not-allowed"
                              : "bg-[#00cbd6] text-black hover:bg-[#00b2bd]"
                          }`}
                        >
                          <span>TRANSMIT VECTORS</span>
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="survey-success-panel"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 space-y-6"
                  >
                    <div className="w-16 h-16 bg-[#00cbd6]/10 border border-[#00cbd6]/20 rounded-full flex items-center justify-center mx-auto text-[#00cbd6] animate-pulse">
                      <Sparkles className="w-7 h-7" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-monstercat font-medium text-xl sm:text-2xl text-white">
                        Discovery Assessment Registered
                      </h3>
                      <p className="text-xs text-[#8e8e89] max-w-md mx-auto leading-relaxed font-sans">
                        Project Discovery profile compiled successfully. Your ticket has been preserved in local trace records. Our team will review your parameters within 12 business hours.
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] rounded-xl px-5 py-3 font-mono text-xs max-w-sm mx-auto">
                      <div className="text-left">
                        <span className="text-[9px] text-white/30 block tracking-widest uppercase">DISCOVERY TICKET ID:</span>
                        <span className="text-white font-bold">{ticketId}</span>
                      </div>
                      <button 
                        onClick={handleCopyTicket}
                        className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] transition-colors text-[#8e8e89] hover:text-white cursor-pointer"
                      >
                        {copied ? <span className="text-[10px] text-[#00cbd6] font-semibold">COPIED</span> : <Clipboard className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button 
                        onClick={resetSurvey}
                        className="text-xs font-mono text-white/65 hover:text-white px-5 py-2 rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                      >
                        COMPILE NEW DISCOVERY
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {currentMode === "ai" && (
          <motion.div
            key="ai-builder-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            <div className="lg:col-span-8 bg-[#090909]/60 backdrop-blur-md rounded-2xl border border-white/[0.04] flex flex-col h-[520px] overflow-hidden relative">
              <div className="p-4 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span className="font-mono text-[9px] text-white/80 tracking-widest uppercase">
                    FUSION_II_ARCHITECT CORE // API ACTIVE
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00cbd6] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00cbd6]"></span>
                  </span>
                  <span className="font-mono text-[8px] text-[#00cbd6] tracking-wider uppercase">ONLINE</span>
                </div>
              </div>

              {/* Chat messages — ref on this div, scroll happens here not on the page */}
              <div ref={chatContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                  >
                    <div className="max-w-[85%] space-y-1.5">
                      <div className={`flex items-center gap-2 text-[9px] font-mono text-[#8e8e89] ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <span>{msg.sender === "user" ? "CLIENT_VECTOR" : "ARCHITECT"}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div className={`p-4 rounded-xl text-xs leading-relaxed font-sans ${
                        msg.sender === "user" 
                          ? "bg-white/[0.03] text-white border border-white/[0.05] rounded-tr-none" 
                          : "bg-[#090909] text-white/90 border border-white/[0.02] rounded-tl-none shadow-md"
                      }`}>
                        {msg.text}
                      </div>

                      {msg.systemLayout && (
                        <motion.div 
                          className="p-4 rounded-xl bg-purple-500/[0.02] border border-purple-500/10 space-y-3 font-mono text-[10px]"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <div className="flex items-center gap-1.5 text-purple-400 font-semibold border-b border-purple-500/10 pb-1.5">
                            <Layers className="w-3.5 h-3.5" />
                            <span>{msg.systemLayout.title.toUpperCase()}</span>
                          </div>

                          <div className="grid grid-cols-1 gap-2 pt-0.5">
                            <div>
                              <span className="text-white/40 block">[ DATABASE GATEWAY ]</span>
                              <span className="text-white/85">{msg.systemLayout.database}</span>
                            </div>
                            <div>
                              <span className="text-white/40 block">[ MIDDLEWARE API ROUTER ]</span>
                              <span className="text-white/85">{msg.systemLayout.api}</span>
                            </div>
                            <div>
                              <span className="text-white/40 block">[ PRESENTATION STYLE ]</span>
                              <span className="text-white/85">{msg.systemLayout.rendering}</span>
                            </div>
                          </div>

                          <div className="border-t border-purple-500/10 pt-2">
                            <span className="text-white/40 block mb-1">[ INTEGRATED WORKSPACE MODULES ]</span>
                            <div className="flex flex-wrap gap-1">
                              {msg.systemLayout.modules.map((m: string, i: number) => (
                                <span key={i} className="text-[9px] bg-purple-500/10 text-purple-300 border border-purple-500/10 px-1.5 py-0.5 rounded">
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start items-center gap-2">
                    <div className="flex space-x-1 p-2.5 bg-white/[0.01] border border-white/[0.05] rounded-xl">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="font-mono text-[8px] text-white/30">COMPILING DIAGNOSTICS...</span>
                  </div>
                )}
              </div>

              <form onSubmit={(e) => handleSendMessage(e)} className="p-4 border-t border-white/[0.05] bg-[#090909]/60 flex gap-2">
                <input 
                  type="text" 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e as any);
                    }
                  }}
                  placeholder="e.g. Design a customer CRM portal with automatic Firestore metrics..."
                  disabled={isTyping}
                  className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500/50 placeholder-white/20 transition-all font-sans"
                />
                <button 
                  type="submit"
                  disabled={!userInput.trim() || isTyping}
                  className={`px-4 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    !userInput.trim() || isTyping
                      ? "bg-white/[0.02] text-white/20 border border-white/[0.05] cursor-not-allowed"
                      : "bg-[#00cbd6] text-black hover:bg-[#00b2bd]"
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-2xl border border-white/[0.04] bg-[#090909]/40 backdrop-blur-md space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-white/[0.05]">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="font-mono text-[9px] text-white/60 tracking-widest uppercase">
                    PROMPT GENERATOR CHIPS
                  </span>
                </div>
                <p className="text-[11px] text-[#8e8e89] font-sans leading-relaxed">
                  Click any vector preset chip below to instantly execute and deconstruct standard application requirements.
                </p>

                <div className="space-y-2 pt-1">
                  {suggestedPrompts.map((promptText, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        if (!isTyping) handleSendMessage(undefined, promptText);
                      }}
                      className="w-full text-left p-3 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] hover:border-purple-500/20 text-white/70 hover:text-white transition-all text-[11px] font-sans leading-snug cursor-pointer group flex items-start gap-2"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-purple-400/60 group-hover:text-purple-400 mt-0.5 flex-shrink-0 transition-colors" />
                      <span>{promptText}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}