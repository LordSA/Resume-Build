"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  ScanSearch, 
  Palette, 
  Download, 
  ChevronRight,
  TrendingUp,
  Star,
  Users,
  Upload,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeTemplate, setActiveTemplate] = useState<"modern" | "minimal" | "classic" | "ats">("modern");
  const [simulatedScore, setSimulatedScore] = useState(98);

  const templates = [
    { id: "modern", name: "Modern Studio", color: "from-blue-600 to-indigo-600", tag: "Tech & Product" },
    { id: "minimal", name: "Minimalist Exec", color: "from-emerald-600 to-teal-600", tag: "Design & Exec" },
    { id: "classic", name: "Classic Corporate", color: "from-amber-600 to-orange-600", tag: "Finance & Legal" },
    { id: "ats", name: "Standard ATS", color: "from-purple-600 to-pink-600", tag: "100% Bot Safe" },
  ];

  return (
    <div className="min-h-screen bg-[#090b12] text-zinc-100 font-sans flex flex-col selection:bg-blue-600/30 overflow-x-hidden relative">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent blur-[160px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/5 blur-[160px] pointer-events-none" />
      <div className="absolute top-[70%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/5 blur-[160px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center pt-8 sm:pt-14 pb-20 px-4 sm:px-6 max-w-7xl mx-auto w-full z-10 gap-24">
        
        <section className="text-center flex flex-col items-center max-w-4xl mx-auto gap-7">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 text-blue-300 text-xs font-black shadow-lg shadow-blue-500/10"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-spin [animation-duration:8s]" />
            <span>The AI Resume Engine with Zero Layout Drift</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08]"
          >
            Craft ATS-Proof Resumes <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              In Record Time.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-medium"
          >
            Paste your experience, import existing PDFs, or start from proven templates. Live ATS keyword scoring, multi-page flow, and millimetric print accuracy.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/create"
              className="flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 text-sm font-black transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Create Free Resume</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/create?mode=upload"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#141724] border border-[#262a3d] hover:bg-[#1a1e2e] hover:border-[#3b425f] text-zinc-300 hover:text-white px-6 py-4 text-sm font-bold transition-all w-full sm:w-auto cursor-pointer"
            >
              <Upload className="h-4 w-4 text-cyan-400" />
              <span>Upload & Edit CV</span>
            </Link>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-zinc-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              100% Free PDF Export
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Zero Layout Shift
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Workday & Lever Compatible
            </span>
          </div>
        </section>

        <section className="w-full flex flex-col items-center gap-6">
          <div className="flex items-center p-1.5 bg-[#121522] border border-[#23273a] rounded-2xl shadow-xl flex-wrap justify-center gap-1">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTemplate(t.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTemplate === t.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{t.name}</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-black/20 text-zinc-300">
                  {t.tag}
                </span>
              </button>
            ))}
          </div>

          <div className="w-full max-w-4xl p-2 sm:p-4 rounded-3xl border border-[#23273a] bg-gradient-to-b from-[#141724]/90 to-[#0f111a]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[100px] pointer-events-none" />

            <div className="flex items-center justify-between px-4 py-2 border-b border-[#23273a]/60 text-xs text-zinc-400 mb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] text-zinc-500">resume_studio_preview.pdf</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  ATS Score: {simulatedScore}%
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-white text-zinc-900 shadow-2xl min-h-[420px] transition-all">
              <AnimatePresence mode="wait">
                {activeTemplate === "modern" && (
                  <motion.div
                    key="modern"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 font-sans"
                  >
                    <div className="border-b-2 border-blue-600 pb-3 flex justify-between items-baseline">
                      <div>
                        <h2 className="text-2xl font-black text-blue-600">Alex Rivera</h2>
                        <p className="text-sm font-bold text-zinc-600">Senior Full Stack & Cloud Architect</p>
                      </div>
                      <div className="text-xs text-zinc-500 text-right">
                        San Francisco, CA • alex.rivera@example.com • (555) 382-9102
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6 pt-2">
                      <div className="col-span-4 border-r border-zinc-200 pr-4 flex flex-col gap-4">
                        <div>
                          <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Top Skills</h4>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {["TypeScript", "React", "Next.js", "Node.js", "Python", "Go", "AWS", "Docker", "PostgreSQL"].map((s, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Education</h4>
                          <p className="text-xs font-bold text-zinc-800 mt-1">B.S. in Computer Science</p>
                          <p className="text-[11px] text-zinc-500">UC Berkeley • 3.9 GPA</p>
                        </div>
                      </div>

                      <div className="col-span-8 flex flex-col gap-4">
                        <div>
                          <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Experience</h4>
                          <div className="mt-1 flex flex-col gap-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>Lead Software Engineer — Vanguard Cloud</span>
                              <span className="text-zinc-500">2022 – Present</span>
                            </div>
                            <ul className="list-disc pl-4 text-xs text-zinc-700 space-y-1">
                              <li>Spearheaded distributed microservices migration serving 12M active users.</li>
                              <li>Reduced core API latency by 45% using Redis clusters and gRPC serialization.</li>
                              <li>Mentored 9 software engineers and instituted continuous deployment automated checks.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTemplate === "minimal" && (
                  <motion.div
                    key="minimal"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 font-sans"
                  >
                    <div className="flex justify-between items-baseline border-b border-zinc-200 pb-3">
                      <div>
                        <h2 className="text-2xl font-bold text-zinc-900">Alex Rivera</h2>
                        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Senior Full Stack Engineer</p>
                      </div>
                      <div className="text-xs text-zinc-500">San Francisco, CA · alex.rivera@example.com</div>
                    </div>

                    <div className="flex flex-col gap-4 pt-1">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-500/20 pb-1 mb-2">
                          Work Experience
                        </h4>
                        <div className="flex justify-between text-xs font-bold text-zinc-900">
                          <span>Lead Software Engineer — Vanguard Tech Cloud</span>
                          <span className="text-zinc-500 font-normal">2022 – Present</span>
                        </div>
                        <p className="text-xs text-zinc-700 mt-1 pl-2 border-l-2 border-emerald-500/40">
                          Architected real-time WebSocket event ingestion pipeline processing 25K messages per second with 99.99% uptime. Managed CI/CD release cadence across 4 production regions.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-500/20 pb-1 mb-2">
                          Technical Proficiencies
                        </h4>
                        <p className="text-xs text-zinc-700">
                          TypeScript · Next.js · Node.js · Go · Python · GraphQL · AWS · Kubernetes · Redis · PostgreSQL
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTemplate === "classic" && (
                  <motion.div
                    key="classic"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 font-serif"
                  >
                    <div className="text-center border-b border-zinc-300 pb-3">
                      <h2 className="text-3xl font-bold text-zinc-900 tracking-wide uppercase">ALEX RIVERA</h2>
                      <p className="text-xs text-zinc-600 font-sans mt-1">
                        San Francisco, CA • alex.rivera@example.com • (555) 382-9102 • alexrivera.dev
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 font-sans text-xs">
                      <div>
                        <h4 className="font-serif font-bold text-zinc-900 border-b border-zinc-300 pb-1 uppercase tracking-wider text-xs">
                          PROFESSIONAL EXPERIENCE
                        </h4>
                        <div className="flex justify-between font-bold text-zinc-900 mt-1.5">
                          <span>Lead Software Engineer, Vanguard Tech Cloud</span>
                          <span className="font-normal text-zinc-600">2022 – Present</span>
                        </div>
                        <ul className="list-disc pl-4 mt-1 text-zinc-700 space-y-1">
                          <li>Spearheaded distributed microservices migration serving 12M global users.</li>
                          <li>Increased core throughput by 40% with zero customer-facing downtime.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-serif font-bold text-zinc-900 border-b border-zinc-300 pb-1 uppercase tracking-wider text-xs">
                          EDUCATION
                        </h4>
                        <div className="flex justify-between font-bold text-zinc-900 mt-1">
                          <span>University of California, Berkeley</span>
                          <span className="font-normal text-zinc-600">2015 – 2019</span>
                        </div>
                        <p className="text-zinc-700">Bachelor of Science in Computer Science (GPA: 3.9/4.0)</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTemplate === "ats" && (
                  <motion.div
                    key="ats"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-3 font-mono text-xs"
                  >
                    <div className="border-b-2 border-black pb-2 font-sans">
                      <h2 className="text-xl font-black text-black">ALEX RIVERA</h2>
                      <p className="text-[11px] text-zinc-700">
                        San Francisco, CA | alex.rivera@example.com | 555-382-9102 | linkedin.com/in/alexrivera
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 font-sans">
                      <div>
                        <div className="font-bold text-black uppercase tracking-wider text-[11px] border-b border-zinc-400 pb-0.5">
                          [TECHNICAL SKILLS]
                        </div>
                        <p className="text-[11px] text-zinc-800 mt-1">
                          <strong>Languages:</strong> TypeScript, JavaScript, Go, Python, SQL | <strong>Frameworks:</strong> React, Next.js, Node.js, Express | <strong>Cloud:</strong> AWS, Docker, Kubernetes
                        </p>
                      </div>

                      <div>
                        <div className="font-bold text-black uppercase tracking-wider text-[11px] border-b border-zinc-400 pb-0.5">
                          [PROFESSIONAL EXPERIENCE]
                        </div>
                        <div className="flex justify-between font-bold text-black text-[11px] mt-1">
                          <span>Lead Software Engineer | Vanguard Tech Cloud</span>
                          <span>2022 - Present</span>
                        </div>
                        <ul className="list-disc pl-4 text-[11px] text-zinc-800 space-y-0.5">
                          <li>Built high-throughput telemetry pipelines processing 25K events/sec.</li>
                          <li>Optimized ATS parsing compliance score to 100% across all top corporate ATS scanners.</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[
            {
              icon: Zap,
              title: "Instant Section Parsing",
              desc: "Paste raw bios, messy LinkedIn text, or old notes. AI formats structured entries with active verbs.",
              color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
            },
            {
              icon: ScanSearch,
              title: "ATS Match Analyzer",
              desc: "Compare your resume against any job description to uncover missing keywords and boost interview calls.",
              color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
            },
            {
              icon: Palette,
              title: "Theme & Typography Studio",
              desc: "Switch colors, font pairs, margins, and card borders in real time without breaking layout bounds.",
              color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
            },
          ].map((card, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl border border-[#23273a] bg-[#11131e]/70 backdrop-blur-xl flex flex-col gap-4 text-left hover:border-[#383e5c] transition-all"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-white">{card.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">{card.desc}</p>
            </div>
          ))}
        </section>

        <section className="p-8 sm:p-12 rounded-3xl border border-[#23273a] bg-gradient-to-br from-blue-600/15 via-[#141724] to-[#0f111a] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl w-full">
          <div className="flex flex-col gap-3 text-left max-w-xl">
            <span className="text-xs font-black uppercase tracking-wider text-blue-400">Get Started in Seconds</span>
            <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Create your dream resume today.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              No subscriptions, no hidden watermark fees. Export print-perfect PDFs engineered to impress recruiters and beat ATS filters.
            </p>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm transition-all shadow-xl shadow-blue-600/35 shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Launch Resume Studio</span>
          </Link>
        </section>

      </main>

      <Footer />
    </div>
  );
}
