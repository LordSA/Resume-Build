"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  ArrowRight, 
  Upload, 
  CheckCircle2, 
  FileText,
  Sliders,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeTemplate, setActiveTemplate] = useState<"modern" | "minimal" | "classic" | "ats">("modern");

  const tags = [
    { text: "Modern", color: "bg-blue-600 text-white" },
    { text: "Minimal", color: "bg-emerald-600 text-white" },
    { text: "Classic", color: "bg-amber-600 text-white" },
    { text: "ATS Safe", color: "bg-purple-600 text-white" },
    { text: "Zero Drift", color: "bg-white text-black font-bold" },
    { text: "PDF Export", color: "bg-zinc-800 text-white" },
    { text: "Typography", color: "bg-cyan-600 text-white" },
    { text: "Workday", color: "bg-zinc-800 text-zinc-300" },
    { text: "Lever", color: "bg-zinc-800 text-zinc-300" },
    { text: "Greenhouse", color: "bg-zinc-800 text-zinc-300" },
    { text: "Metrics", color: "bg-pink-600 text-white" },
    { text: "Layout Studio", color: "bg-white/10 text-white border border-white/20" },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 font-sans flex flex-col selection:bg-white/20 relative overflow-x-hidden">
      <Navbar />

      <div 
        id="hero-section" 
        className="relative w-full overflow-hidden border-b border-white/10"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen pointer-events-none"
          style={{ backgroundImage: "url('/bg.gif')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07090e]/60 via-[#07090e]/40 to-[#07090e] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-10 pt-36 sm:pt-48 pb-20 sm:pb-28 text-center flex flex-col items-center gap-6 z-10">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08] max-w-4xl">
            Build Resumes That <br className="hidden sm:inline" />
            <span className="inline-block px-4 py-1 mx-1.5 rounded-2xl bg-white text-black font-black">
              Land Interviews
            </span>
            Every Single Time.
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-medium">
            An extraordinary document design platform built for professionals. Craft, format, and structure clean, print-perfect, ATS-compatible resumes with zero visual drift.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-2 w-full sm:w-auto">
            <Link
              href="/create"
              className="flex items-center justify-center gap-2 rounded-full bg-white hover:bg-zinc-200 text-black px-8 py-3.5 text-xs sm:text-sm font-bold transition-all shadow-xl shadow-white/10 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto cursor-pointer"
            >
              <span>Create Resume</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/create?mode=upload"
              className="flex items-center justify-center gap-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-white px-7 py-3.5 text-xs sm:text-sm font-bold transition-all w-full sm:w-auto cursor-pointer backdrop-blur-md"
            >
              <Upload className="h-4 w-4 text-emerald-300" />
              <span>Upload Existing CV</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl pt-8">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-xl text-xs font-bold shadow-sm transition-transform hover:scale-105 select-none ${tag.color}`}
              >
                {tag.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 sm:px-10 py-24 flex flex-col gap-28 z-10">
        
        <section className="flex flex-col gap-8 text-center items-center">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Interactive Template Studio
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm">
              Switch layout structures instantly. Your content stays type-safe and formatted for both recruiters and automated ATS scanners.
            </p>
          </div>

          <div className="flex items-center p-1.5 bg-[#12141e] border border-white/10 rounded-full flex-wrap justify-center gap-1">
            {[
              { id: "modern", name: "Modern Studio" },
              { id: "minimal", name: "Minimalist Exec" },
              { id: "classic", name: "Classic Corporate" },
              { id: "ats", name: "Standard ATS" },
            ].map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setActiveTemplate(tmpl.id as any)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTemplate === tmpl.id
                    ? "bg-white text-black shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {tmpl.name}
              </button>
            ))}
          </div>

          <div className="w-full max-w-4xl p-4 sm:p-6 rounded-3xl border border-white/10 bg-[#0d0f17]/90 backdrop-blur-2xl shadow-2xl">
            <div className="p-6 sm:p-8 rounded-2xl bg-white text-zinc-900 text-left min-h-[380px] shadow-lg">
              <AnimatePresence mode="wait">
                {activeTemplate === "modern" && (
                  <motion.div
                    key="modern"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-4 font-sans"
                  >
                    <div className="border-b-2 border-blue-600 pb-3 flex justify-between items-baseline">
                      <div>
                        <h3 className="text-2xl font-black text-blue-600">Alex Rivera</h3>
                        <p className="text-xs font-bold text-zinc-600">Senior Full Stack Architect</p>
                      </div>
                      <div className="text-xs text-zinc-500 text-right">San Francisco, CA • alex.rivera@example.com</div>
                    </div>

                    <div className="grid grid-cols-12 gap-6 pt-2">
                      <div className="col-span-4 border-r border-zinc-200 pr-3 flex flex-col gap-3 text-xs">
                        <div>
                          <div className="font-bold text-blue-600 text-[10px] uppercase tracking-wider">Skills</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {["TypeScript", "React", "Next.js", "Node.js", "Python", "Go", "AWS", "Docker"].map((s, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-blue-600 text-[10px] uppercase tracking-wider">Education</div>
                          <p className="font-bold text-zinc-800 mt-1">B.S. in Computer Science</p>
                          <p className="text-zinc-500 text-[11px]">UC Berkeley • 3.9 GPA</p>
                        </div>
                      </div>

                      <div className="col-span-8 flex flex-col gap-3 text-xs">
                        <div>
                          <div className="font-bold text-blue-600 text-[10px] uppercase tracking-wider">Experience</div>
                          <div className="flex justify-between font-bold text-zinc-900 mt-1">
                            <span>Lead Software Engineer — Vanguard Cloud</span>
                            <span className="text-zinc-500 font-normal">2022 – Present</span>
                          </div>
                          <ul className="list-disc pl-4 mt-1 text-zinc-700 space-y-1">
                            <li>Spearheaded distributed microservices migration serving 12M users.</li>
                            <li>Reduced core API latency by 45% using Redis clusters and gRPC serialization.</li>
                          </ul>
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
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-4 font-sans"
                  >
                    <div className="flex justify-between items-baseline border-b border-zinc-200 pb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-zinc-900">Alex Rivera</h3>
                        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Senior Full Stack Engineer</p>
                      </div>
                      <div className="text-xs text-zinc-500">San Francisco, CA · alex.rivera@example.com</div>
                    </div>

                    <div className="flex flex-col gap-3 text-xs pt-1">
                      <div>
                        <div className="font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-500/20 pb-1 mb-2">
                          Work Experience
                        </div>
                        <div className="flex justify-between font-bold text-zinc-900">
                          <span>Lead Software Engineer — Vanguard Tech Cloud</span>
                          <span className="text-zinc-500 font-normal">2022 – Present</span>
                        </div>
                        <p className="text-zinc-700 mt-1 pl-2 border-l-2 border-emerald-500/40">
                          Architected real-time WebSocket event ingestion pipeline processing 25K messages per second with 99.99% uptime across 4 production regions.
                        </p>
                      </div>

                      <div>
                        <div className="font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-500/20 pb-1 mb-2">
                          Technical Proficiencies
                        </div>
                        <p className="text-zinc-700">
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
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-4 font-serif text-xs"
                  >
                    <div className="text-center border-b border-zinc-300 pb-3">
                      <h3 className="text-2xl font-bold text-zinc-900 tracking-wide uppercase">ALEX RIVERA</h3>
                      <p className="text-zinc-600 font-sans mt-1 text-[11px]">
                        San Francisco, CA • alex.rivera@example.com • (555) 382-9102 • alexrivera.dev
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 font-sans">
                      <div>
                        <div className="font-serif font-bold text-zinc-900 border-b border-zinc-300 pb-1 uppercase tracking-wider text-xs">
                          PROFESSIONAL EXPERIENCE
                        </div>
                        <div className="flex justify-between font-bold text-zinc-900 mt-1.5">
                          <span>Lead Software Engineer, Vanguard Tech Cloud</span>
                          <span className="font-normal text-zinc-600">2022 – Present</span>
                        </div>
                        <ul className="list-disc pl-4 mt-1 text-zinc-700 space-y-1">
                          <li>Spearheaded distributed microservices migration serving 12M global users.</li>
                          <li>Increased core throughput by 40% with zero customer-facing downtime.</li>
                        </ul>
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
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-3 font-sans text-xs"
                  >
                    <div className="border-b-2 border-black pb-2">
                      <h3 className="text-xl font-black text-black">ALEX RIVERA</h3>
                      <p className="text-[11px] text-zinc-700">
                        San Francisco, CA | alex.rivera@example.com | 555-382-9102 | linkedin.com/in/alexrivera
                      </p>
                    </div>

                    <div>
                      <div className="font-bold text-black uppercase tracking-wider text-[11px] border-b border-zinc-400 pb-0.5">
                        [TECHNICAL SKILLS]
                      </div>
                      <p className="text-[11px] text-zinc-800 mt-1">
                        <strong>Languages:</strong> TypeScript, JavaScript, Go, Python, SQL | <strong>Frameworks:</strong> React, Next.js, Node.js | <strong>Cloud:</strong> AWS, Docker, Kubernetes
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
                      <ul className="list-disc pl-4 text-[11px] text-zinc-800 space-y-0.5 mt-0.5">
                        <li>Built high-throughput telemetry pipelines processing 25K events/sec.</li>
                        <li>Optimized ATS parsing compliance score to 100% across all top corporate ATS scanners.</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
          <div className="p-6 rounded-3xl border border-white/10 bg-[#0d0f17] flex flex-col gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 w-fit">
              ATS Standard
            </span>
            <span className="text-4xl sm:text-5xl font-black text-white mt-1">99.4%</span>
            <span className="text-xs text-zinc-400 font-medium">Parser success rate</span>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-[#0d0f17] flex flex-col gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 w-fit">
              Templates
            </span>
            <span className="text-4xl sm:text-5xl font-black text-white mt-1">4 Distinct</span>
            <span className="text-xs text-zinc-400 font-medium">Interchangeable layouts</span>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-[#0d0f17] flex flex-col gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 w-fit">
              Print Precision
            </span>
            <span className="text-4xl sm:text-5xl font-black text-white mt-1">0px</span>
            <span className="text-xs text-zinc-400 font-medium">Layout shift guarantee</span>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-[#0d0f17] flex flex-col gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 w-fit">
              PDF Export
            </span>
            <span className="text-4xl sm:text-5xl font-black text-white mt-1">100%</span>
            <span className="text-xs text-zinc-400 font-medium">Watermark-free vector</span>
          </div>
        </section>

        <section className="p-8 sm:p-14 rounded-3xl border border-white/10 bg-gradient-to-br from-[#121522] via-[#0d0f17] to-[#07090e] flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
          <div className="flex flex-col gap-4 text-left max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30">
                Collect • Inspire • Connect
              </span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Create your winning document today.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
              Join candidates worldwide using Resume Solutions to design, format, and download job-winning resumes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs sm:text-sm transition-all w-full sm:w-auto text-center"
            >
              Sign In
            </Link>
            <Link
              href="/create"
              className="px-8 py-3.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs sm:text-sm transition-all shadow-lg shadow-white/10 w-full sm:w-auto text-center flex items-center justify-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
