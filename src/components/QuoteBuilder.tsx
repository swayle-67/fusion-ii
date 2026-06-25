import React, { useState } from "react";
import { Check, Clipboard, Sparkles, Send, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { saveQuoteSubmission } from "../lib/dataStore";

interface ServiceGoal {
  id: string;
  label: string;
  complexity: number;
}

export default function QuoteBuilder() {
  const goalOptions: ServiceGoal[] = [
    { id: "custom-site", label: "Full Interactive SPA Canvas", complexity: 12 },
    { id: "generative-branding", label: "Procedural Branding Engine", complexity: 8 },
    { id: "ai-proxy", label: "Secure AI Integration / Proxy API", complexity: 15 },
    { id: "dynamic-visualization", label: "Custom Mathematical Visualizer", complexity: 10 },
  ];

  const budgetOptions = [
    { value: "strategic", label: "Strategic Pilot / Beta Setup" },
    { value: "enterprise", label: "Full Agency Collaboration" },
    { value: "bespoke", label: "Custom Multi-system Integration" },
  ];

  const [selectedGoals, setSelectedGoals] = useState<string[]>(["custom-site"]);
  const [budget, setBudget] = useState("strategic");
  const [email, setEmail] = useState("");
  const [projectName, setProjectName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [copied, setCopied] = useState(false);

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const calculateEstimate = () => {
    const baseComplexity = selectedGoals.reduce((acc, goalId) => {
      const option = goalOptions.find((g) => g.id === goalId);
      return acc + (option ? option.complexity : 0);
    }, 0);

    const budgetMultiplier = budget === "strategic" ? 1.0 : budget === "enterprise" ? 1.8 : 2.5;
    const hours = Math.round(baseComplexity * 6 * budgetMultiplier * 1.2);
    return hours;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Generate a unique high-tech ticket ID
    const randomHex = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, "0");
    const code = `F2-${selectedGoals.length}-${budget.substring(0, 3).toUpperCase()}-${randomHex}`;
    setTicketId(code);

    // Save to global dataStore persistence
    saveQuoteSubmission({
      id: code,
      timestamp: new Date().toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      projectName: projectName || "Untitled Campaign",
      email: email,
      selectedGoals: selectedGoals,
      budget: budget,
      estimateHours: calculateEstimate()
    });

    setSubmitted(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSelectedGoals(["custom-site"]);
    setBudget("strategic");
    setEmail("");
    setProjectName("");
    setSubmitted(false);
    setTicketId("");
  };

  return (
    <div className="w-full bg-[#090909]/80 backdrop-blur-md rounded-2xl border border-white/[0.08] p-6 lg:p-8" id="design-project-planner">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="planner-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="border-b border-white/[0.06] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white/70" />
                <h3 className="font-display font-medium text-sm tracking-widest text-white uppercase">
                  Project Vector Planner
                </h3>
              </div>
              <p className="text-[11px] font-mono text-[#8e8e89] mt-1 uppercase">
                Step 1: Map your requirements to calculate core studio cycles
              </p>
            </div>

            {/* Target Deliverables */}
            <div className="space-y-3">
              <label className="block font-mono text-xs text-[#8e8e89] uppercase tracking-wider mb-2">
                [ Selected Service Goals ]
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {goalOptions.map((goal) => {
                  const isChecked = selectedGoals.includes(goal.id);
                  return (
                    <div
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`flex items-start justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? "bg-white/[0.04] border-white/30"
                          : "bg-transparent border-white/[0.04] hover:bg-white/[0.02] hover:border-white/10"
                      }`}
                    >
                      <div className="space-y-1 pr-6">
                        <div className="text-xs text-white font-medium leading-tight">
                          {goal.label}
                        </div>
                        <div className="text-[9px] font-mono text-[#8e8e89]">
                          CORE COMPLEXITY // {goal.complexity} PTS
                        </div>
                      </div>
                      <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${isChecked ? "bg-white border-white text-black" : "border-white/20"}`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3px]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Support Tier / Budget Level */}
            <div className="space-y-3">
              <label className="block font-mono text-xs text-[#8e8e89] uppercase tracking-wider mb-2">
                [ Collaboration Model ]
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {budgetOptions.map((b) => {
                  const isChecked = budget === b.value;
                  return (
                    <div
                      key={b.value}
                      onClick={() => setBudget(b.value)}
                      className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                        isChecked
                          ? "bg-white/[0.04] border-white/30"
                          : "bg-transparent border-white/[0.04] hover:bg-white/[0.02]"
                      }`}
                    >
                      <span className="text-xs text-white block mb-1">{b.label}</span>
                      <span className="text-[9px] font-mono text-white/40 block">
                        {b.value === "strategic" ? "FAST PILOT" : b.value === "enterprise" ? "PRO DUO" : "MAX CAPACITY"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Project Details Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] text-[#8e8e89] uppercase tracking-wider mb-1.5">
                  Project Workspace Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aether Volume"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-[#8e8e89] uppercase tracking-wider mb-1.5">
                  Secure Communication Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            {/* Calculations Dashboard */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-[#0a0a0a] rounded-xl border border-white/[0.04] gap-4">
              <div className="text-left w-full">
                <span className="font-mono text-[9px] text-white/40 tracking-wider uppercase block">
                  Project Assessment Estimate:
                </span>
                <span className="font-display font-medium text-lg text-white">
                  {calculateEstimate()} Studio Engineering Hours
                </span>
                <span className="font-mono text-[9px] text-[#8e8e89] block mt-0.5 leading-normal">
                  Fitted utilizing weighted algorithms mapping points directly to agency hertz constraints.
                </span>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto h-11 flex items-center justify-center gap-2 bg-white text-black font-semibold font-mono text-xs px-6 rounded-lg hover:bg-[#ededea] transition-all cursor-pointer whitespace-nowrap"
              >
                <span>SEND DISPATCH</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="success-receipt"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 text-center py-6"
          >
            <div className="w-12 h-12 bg-white/10 text-white border border-white/25 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>

            <h4 className="font-display font-medium text-lg text-white tracking-tight">
              Design Dispatch Engaged
            </h4>
            <p className="text-xs text-[#8e8e89] max-w-md mx-auto leading-relaxed">
              We have compiled your design recipe parameters into an agency workflow package. 
              Our lead algorithmic designer will review these specifications and reply to{" "}
              <span className="text-white font-medium">{email}</span> within 12 standard business hours.
            </p>

            {/* Ticket Card Component */}
            <div className="max-w-sm mx-auto bg-[#0d0d0d] border border-white/10 rounded-xl p-5 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <span className="font-mono text-[9px] text-[#8e8e89]">FUSION II BRIEF LOG</span>
                <span className="font-mono text-[10px] text-white/50">{ticketId}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-mono text-[8px] text-white/40 block">WORKSPACE</span>
                  <span className="text-white font-medium">{projectName || "Untitled Campaign"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-mono text-[8px] text-white/40 block">COLLABORATION</span>
                    <span className="text-white font-medium uppercase font-mono text-[10px]">{budget}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[8px] text-white/40 block">EST. BUDGET EFFORT</span>
                    <span className="text-white font-medium">{calculateEstimate()} Hours</span>
                  </div>
                </div>
                <div>
                  <span className="font-mono text-[8px] text-white/40 block">GOALS LOADED</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedGoals.map((g) => (
                      <span key={g} className="px-1.5 py-0.5 rounded bg-white/5 text-[8px] font-mono text-white/80">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-white/[0.04]">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-mono text-white transition-colors cursor-pointer"
                >
                  <Clipboard className="w-3 h-3" />
                  {copied ? "COPIED" : "COPY BRIEF ID"}
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-2 rounded-lg bg-transparent border border-white/10 hover:bg-white/5 text-[10px] font-mono text-white/80 transition-colors cursor-pointer"
                >
                  NEW BRIEF
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
