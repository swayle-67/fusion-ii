import { motion, AnimatePresence } from "motion/react";
import { X, Shield, Cpu, Activity, Clock, Eye, Server, Info, Lock, CheckCircle2, AlertTriangle, Mail } from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigureCookies: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose, onConfigureCookies }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#020205]/90 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-3xl max-h-[85vh] bg-[#09090b]/95 border border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.9)] rounded-xl flex flex-col overflow-hidden text-left"
        >
          {/* Cyan/Neon gradient top line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 animate-pulse" />

          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/[0.04]">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-cyan-500/10 rounded-md border border-cyan-500/20 text-cyan-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-sans font-bold text-white tracking-wider uppercase">FUSION II — Privacy Policy</h2>
                <p className="text-[10px] text-[#8e8e89] font-mono leading-none mt-1">GOVERNED BY POPIA ACT 4 OF 2013 • EFFECTIVE: 09 MAY 2026</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#8e8e89] hover:text-white transition-colors p-1.5 hover:bg-white/[0.03] rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-8 font-sans text-xs text-[#ced4da] leading-relaxed custom-scrollbar text-justify sm:text-left">
            
            {/* Meta Block */}
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-[10px] text-[#8e8e89]">
              <div>
                <span className="text-white/40 uppercase block mb-0.5">Jurisdiction</span>
                <span className="text-cyan-400 font-bold uppercase">Republic of South Africa</span>
              </div>
              <div>
                <span className="text-white/40 uppercase block mb-0.5">Primary Legislation</span>
                <span className="text-white font-bold uppercase">POPIA Act 4 of 2013</span>
              </div>
              <div>
                <span className="text-white/40 uppercase block mb-0.5">Effective Date</span>
                <span className="text-white uppercase">09 May 2026</span>
              </div>
              <div>
                <span className="text-white/40 uppercase block mb-0.5">Compliance Status</span>
                <span className="text-emerald-400 uppercase font-semibold">Active & Audited</span>
              </div>
            </div>

            {/* SECTION 01 */}
            <section className="space-y-3">
              <h3 className="font-mono text-cyan-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20 text-[9px]">01</span>
                <span>Who We Are</span>
              </h3>
              <p className="text-[#8e8e89]">
                FUSION II is a web design and AI integration service provider operating in South Africa. We build websites and AI-powered tools for small and medium businesses.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-[10px] bg-white/[0.01] border border-white/[0.02] p-3 rounded-md">
                <div>
                  <span className="text-white/30 block">INFORMATION OFFICER:</span>
                  <span className="text-white">SUHAIL OMAR MAHOMED</span>
                  <a href="mailto:omarsuhail786@gmail.com" className="text-cyan-400/90 block hover:underline">omarsuhail786@gmail.com</a>
                </div>
                <div>
                  <span className="text-white/30 block">SECONDARY OFFICER:</span>
                  <span className="text-white">AJWAD MOHAMMED</span>
                  <a href="mailto:ajwadmohammed48@gmail.com" className="text-cyan-400/90 block hover:underline">ajwadmohammed48@gmail.com</a>
                </div>
                <div className="sm:col-span-2 border-t border-white/[0.03] pt-2">
                  <span className="text-white/30 block">LOCATION & DOMAIN:</span>
                  <span className="text-white">Westville, KwaZulu-Natal, South Africa — <a href="https://fusionii.nexus" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">fusionii.nexus</a></span>
                </div>
              </div>
              <p className="text-[11px] text-amber-400/80 bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-md flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>We are in the process of formal registration with the Information Regulator of South Africa as required under POPIA.</span>
              </p>
            </section>

            {/* SECTION 02 */}
            <section className="space-y-3">
              <h3 className="font-mono text-cyan-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20 text-[9px]">02</span>
                <span>Information We Collect</span>
              </h3>
              <p className="text-[#8e8e89]">
                We collect personal information only when you voluntarily provide it through our AI chat assistant or contact forms. This may include:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#8e8e89] pl-1">
                <li className="flex items-center gap-2 bg-white/[0.01] p-2 rounded border border-white/[0.02]">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                  Your full name
                </li>
                <li className="flex items-center gap-2 bg-white/[0.01] p-2 rounded border border-white/[0.02]">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                  Phone number
                </li>
                <li className="flex items-center gap-2 bg-white/[0.01] p-2 rounded border border-white/[0.02]">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                  Business name and type
                </li>
                <li className="flex items-center gap-2 bg-white/[0.01] p-2 rounded border border-white/[0.02]">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                  Website preferences and goals
                </li>
                <li className="flex items-center gap-2 bg-white/[0.01] p-2 rounded border border-white/[0.02]">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                  Preferred appointment times
                </li>
                <li className="flex items-center gap-2 bg-white/[0.01] p-2 rounded border border-white/[0.02]">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                  Conversational project inputs
                </li>
              </ul>
              <p className="text-[11px] text-[#8e8e89] italic">
                We do not collect payment information, government ID numbers, or sensitive personal information as defined under POPIA.
              </p>
            </section>

            {/* SECTION 03 */}
            <section className="space-y-3">
              <h3 className="font-mono text-cyan-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20 text-[9px]">03</span>
                <span>AI Chat Assistant Disclosure</span>
              </h3>
              <p className="text-[#8e8e89]">
                Our website uses an AI-powered chat assistant called <strong className="text-white font-mono">EchoForge</strong>. This is an automated system — not a human agent.
              </p>
              <div className="p-3.5 bg-indigo-500/5 border border-indigo-500/10 rounded-lg space-y-2">
                <p className="text-white font-semibold text-[11px]">By engaging with EchoForge you acknowledge and agree that:</p>
                <ul className="space-y-1.5 text-[11px] text-[#8e8e89]">
                  <li className="flex items-start gap-2">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>You are communicating with an artificial intelligence system.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Your messages are processed in real time by third-party AI infrastructure.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Conversations are used solely to qualify your project requirements and schedule a consultation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>No conversation data is used to train AI models without your explicit consent.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* SECTION 04 */}
            <section className="space-y-3">
              <h3 className="font-mono text-cyan-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20 text-[9px]">04</span>
                <span>Third-Party Services</span>
              </h3>
              <p className="text-[#8e8e89]">
                To deliver our AI chat service and high-velocity web experiences, we use the following third-party providers. Each has their own privacy policy and data processing terms:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white/[0.01] border border-white/[0.03] rounded-lg">
                  <span className="font-mono text-[10px] text-white block font-bold mb-1">Groq Inc.</span>
                  <p className="text-[#8e8e89] text-[11px] leading-relaxed">
                    AI inference provider that processes your chat messages to generate responses. Messages are transmitted securely and not stored permanently.
                  </p>
                </div>
                <div className="p-3 bg-white/[0.01] border border-white/[0.03] rounded-lg">
                  <span className="font-mono text-[10px] text-white block font-bold mb-1">Cloudflare Inc.</span>
                  <p className="text-[#8e8e89] text-[11px] leading-relaxed">
                    Our worker infrastructure that routes requests securely between your browser and the AI provider.
                  </p>
                </div>
                <div className="p-3 bg-white/[0.01] border border-white/[0.03] rounded-lg">
                  <span className="font-mono text-[10px] text-white block font-bold mb-1">Vercel Inc.</span>
                  <p className="text-[#8e8e89] text-[11px] leading-relaxed">
                    Our ultra-fast frontend hosting and custom domain platform with integrated SSL protections.
                  </p>
                </div>
                <div className="p-3 bg-white/[0.01] border border-white/[0.03] rounded-lg">
                  <span className="font-mono text-[10px] text-white block font-bold mb-1">Hetzner Online GmbH</span>
                  <p className="text-[#8e8e89] text-[11px] leading-relaxed">
                    Our high-performance dedicated cloud hosting provider used for backend nodes and application deployments.
                  </p>
                </div>
              </div>
              <p className="text-[#8e8e89] text-[11px] leading-relaxed">
                We have selected premium global providers that maintain exceptional standards of data security and comply fully with international data protection regulations.
              </p>
            </section>

            {/* SECTION 05 */}
            <section className="space-y-3">
              <h3 className="font-mono text-cyan-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20 text-[9px]">05</span>
                <span>How We Use Your Information</span>
              </h3>
              <p className="text-[#8e8e89]">
                Information collected through our website and chat assistant is used exclusively for:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#8e8e89] text-[11px] pl-1">
                <li>Scheduling and confirming consultations with our team.</li>
                <li>Understanding your project requirements before a call.</li>
                <li>Following up on your system enquiry.</li>
                <li>Sending you relevant service information you have explicitly requested.</li>
              </ul>
              <p className="text-[#8e8e89] text-[11px]">
                We will <strong className="text-white">never</strong> sell, rent, or share your personal information with third parties for marketing purposes. We do not use your data for profiling or automated decision-making that produces legal effects.
              </p>
            </section>

            {/* SECTION 06 */}
            <section className="space-y-3">
              <h3 className="font-mono text-cyan-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20 text-[9px]">06</span>
                <span>How We Store & Protect Your Information</span>
              </h3>
              <p className="text-[#8e8e89]">
                Booking details and contact information submitted through our platform are stored securely on our servers. We implement the following safeguards:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#8e8e89] pl-1">
                <li className="flex items-center gap-2 bg-white/[0.01] p-2 rounded border border-white/[0.02]">
                  <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  SSL/TLS encryption on all data in transit
                </li>
                <li className="flex items-center gap-2 bg-white/[0.01] p-2 rounded border border-white/[0.02]">
                  <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  Access controls limiting view permissions
                </li>
                <li className="flex items-center gap-2 bg-white/[0.01] p-2 rounded border border-white/[0.02]">
                  <Server className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  Regular infrastructure security reviews
                </li>
                <li className="flex items-center gap-2 bg-white/[0.01] p-2 rounded border border-white/[0.02]">
                  <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  Strict data minimization safeguards
                </li>
              </ul>
              <p className="text-[#8e8e89] text-[11px]">
                We retain your personal information for no longer than <strong className="text-white">12 months</strong> from the date of your last interaction with us, unless a longer period is required by law or you have engaged our services.
              </p>
            </section>

            {/* SECTION 07 */}
            <section className="space-y-3">
              <h3 className="font-mono text-cyan-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20 text-[9px]">07</span>
                <span>Your Rights Under POPIA</span>
              </h3>
              <p className="text-[#8e8e89]">
                As a data subject under the Protection of Personal Information Act, you have the right to:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#8e8e89] pl-1">
                <div className="p-2 bg-white/[0.01] rounded border border-white/[0.02]">
                  <strong className="text-white block font-mono text-[9px] uppercase tracking-wider">Access</strong> Request a copy of the personal information we hold about you.
                </div>
                <div className="p-2 bg-white/[0.01] rounded border border-white/[0.02]">
                  <strong className="text-white block font-mono text-[9px] uppercase tracking-wider">Correction</strong> Request that we correct inaccurate or outdated information.
                </div>
                <div className="p-2 bg-white/[0.01] rounded border border-white/[0.02]">
                  <strong className="text-white block font-mono text-[9px] uppercase tracking-wider">Deletion</strong> Request that we delete your personal information.
                </div>
                <div className="p-2 bg-white/[0.01] rounded border border-white/[0.02]">
                  <strong className="text-white block font-mono text-[9px] uppercase tracking-wider">Objection & Complaints</strong> Object to processing or escalate to regulatory authorities.
                </div>
              </div>
              <p className="text-[#8e8e89] text-[11px]">
                To exercise any of these rights, contact us at <a href="mailto:fusionii.nexus@gmail.com" className="text-cyan-400 hover:underline">fusionii.nexus@gmail.com</a>. We will respond in full within 7 business days.
              </p>
            </section>

            {/* SECTION 08 */}
            <section className="space-y-3">
              <h3 className="font-mono text-cyan-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20 text-[9px]">08</span>
                <span>Cookies & Tracking</span>
              </h3>
              <p className="text-[#8e8e89]">
                Our website does not currently use tracking cookies or third-party analytics tools. We do not use Google Analytics, Meta Pixel, or any behavioural tracking software.
              </p>
              <p className="text-[#8e8e89] text-[11px]">
                If this changes in future, we will update this policy and notify users accordingly.
              </p>
            </section>

            {/* SECTION 09 */}
            <section className="space-y-3">
              <h3 className="font-mono text-cyan-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20 text-[9px]">09</span>
                <span>Children's Privacy</span>
              </h3>
              <p className="text-[#8e8e89]">
                Our services are intended for business owners and adults aged 18 and older. We do not knowingly collect personal information from individuals under the age of 18.
              </p>
              <p className="text-[#8e8e89] text-[11px]">
                If you believe a minor has submitted information through our platform, please contact us immediately at <a href="mailto:fusionii.nexus@gmail.com" className="text-cyan-400 hover:underline">fusionii.nexus@gmail.com</a> and we will delete it promptly.
              </p>
            </section>

            {/* SECTION 10 */}
            <section className="space-y-3">
              <h3 className="font-mono text-cyan-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20 text-[9px]">10</span>
                <span>Changes to This Policy</span>
              </h3>
              <p className="text-[#8e8e89]">
                We may update this Privacy Policy from time to time to reflect changes in our services, legal requirements, or best practices. The effective date at the top of this page will be updated accordingly.
              </p>
              <p className="text-[#8e8e89] text-[11px]">
                Continued use of our website after any changes constitutes your acceptance of the updated policy. We recommend reviewing this page periodically.
              </p>
            </section>

            {/* SECTION 11 */}
            <section className="space-y-3">
              <h3 className="font-mono text-cyan-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20 text-[9px]">11</span>
                <span>Contact & Complaints</span>
              </h3>
              <div className="p-3.5 bg-white/[0.01] border border-white/[0.03] rounded-lg space-y-2 text-[11px] text-[#8e8e89]">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>EMAIL: <a href="mailto:fusionii.nexus@gmail.com" className="text-cyan-400 hover:underline">fusionii.nexus@gmail.com</a></span>
                </div>
                <div>RESPONSE TIME: Within 7 business days</div>
                <div>LOCATION: Westville, KwaZulu-Natal, South Africa</div>
              </div>

              <div className="pt-2">
                <strong className="text-white block mb-1 text-[11px]">Information Regulator of South Africa</strong>
                <p className="text-[#8e8e89] text-[11px] mb-2">
                  If you are unsatisfied with our response, you have the right to escalate your complaint to the Information Regulator:
                </p>
                <div className="p-3 bg-white/[0.01] border border-white/[0.03] rounded-lg text-[10px] font-mono text-[#8e8e89] space-y-1">
                  <div>WEBSITE: <a href="https://www.inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">www.inforegulator.org.za</a></div>
                  <div>EMAIL: <a href="mailto:inforeg@justice.gov.za" className="text-cyan-400 hover:underline">inforeg@justice.gov.za</a></div>
                  <div>PHONE: 072 414 3591</div>
                </div>
              </div>
            </section>

            {/* Good faith clause */}
            <div className="pt-4 border-t border-white/[0.04] text-[10px] font-mono text-amber-400/70 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
              <span>
                <strong>Important:</strong> This Privacy Policy was drafted in good faith to comply with the Protection of Personal Information Act 4 of 2013 (POPIA). FUSION II is committed to handling your personal information responsibly and transparently.
              </span>
            </div>

          </div>

          {/* Footer controls inside modal */}
          <div className="p-5 bg-white/[0.01] border-t border-white/[0.04] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <button
              onClick={() => {
                onClose();
                onConfigureCookies();
              }}
              className="py-2 px-4 bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-[10px] rounded-md transition-all uppercase tracking-wider text-center cursor-pointer border border-white/5 h-9"
            >
              Reconfigure Cookies
            </button>
            <button
              onClick={onClose}
              className="py-2 px-5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-mono font-bold text-[10px] rounded-md transition-all uppercase tracking-wider text-center cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.15)] h-9"
            >
              Understand & Acknowledge
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
