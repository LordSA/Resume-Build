"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  ArrowRight, 
  Layers, 
  ScanSearch, 
  FileCheck, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2,
  Code2,
  Globe,
  Award
} from "lucide-react";

export default function AboutPage() {
  const steps = [
    {
      num: "01",
      title: "Choose a Layout or Import CV",
      desc: "Start with one of our 4 designer templates (Modern Studio, Minimalist Executive, Classic Corporate, Standard ATS) or upload an existing PDF/Doc to extract and standardize your career history."
    },
    {
      num: "02",
      title: "Customize in Studio Editor",
      desc: "Edit work experience, education, skills, projects, and certificates with real-time typography styling, custom color palettes, and margin controls without touching messy code."
    },
    {
      num: "03",
      title: "ATS Keyword Scoring & PDF Export",
      desc: "Run your resume against target job listings to uncover missing keywords, verify parser compliance score, and download print-ready vector PDFs with guaranteed 0px layout drift."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 font-sans flex flex-col selection:bg-white/20 relative overflow-x-hidden">
      <div 
        className="absolute top-0 inset-x-0 h-[600px] opacity-25 pointer-events-none mix-blend-screen bg-cover bg-top"
        style={{ backgroundImage: "url('/bg.gif')" }}
      />
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-[#07090e]/50 via-[#07090e]/85 to-[#07090e] pointer-events-none" />

      <Navbar />

      <main className="flex-1 mx-auto max-w-5xl w-full px-6 sm:px-10 pt-32 sm:pt-40 pb-24 flex flex-col gap-24 z-10">
        
        <section className="text-center flex flex-col items-center max-w-2xl mx-auto gap-5">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            About Resume Solutions
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-medium">
            A free, professional resume studio built to give job seekers complete creative control without breaking ATS compliance or print formatting.
          </p>
        </section>

        <section className="flex flex-col gap-10">
          <div className="text-left flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              How the Website Works
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm">
              We streamlined the resume building process into 3 simple, reliable steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="p-7 rounded-3xl border border-white/10 bg-[#0d0f17]/90 backdrop-blur-xl flex flex-col gap-4 shadow-xl hover:border-white/20 transition-all relative overflow-hidden group"
              >
                <span className="text-2xl font-black text-white/25 group-hover:text-white/40 transition-colors">
                  {step.num}
                </span>
                <h3 className="text-lg font-black text-white">{step.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-[#0d0f17]/90 backdrop-blur-2xl shadow-2xl flex flex-col gap-8 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white font-black text-2xl">
                SA
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">Shibili Aman TK</h3>
                <p className="text-xs text-zinc-400 font-semibold mt-0.5">Creator & Full-Stack Developer</p>
              </div>
            </div>

            <a
              href="https://www.shibili.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <span>Visit Portfolio</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="flex flex-col gap-4 text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
            <p>
              I am a <strong>Full-Stack Developer</strong> and B.Tech Computer Science Engineering student passionate about crafting developer tools, clean user interfaces, and scalable web solutions.
            </p>
            <p>
              I built <strong>Resume Solutions</strong> because most existing resume builders lock basic export features behind paywalls, introduce ugly watermark overlays, or produce broken PDF layouts that fail corporate ATS parsers (like Workday, Greenhouse, and Lever). Resume Solutions is engineered to give candidates full design freedom, millimetric print accuracy, and instant ATS feedback.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
            <a
              href="https://www.shibili.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold flex items-center gap-2 transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-zinc-400" />
              <span>www.shibili.xyz</span>
            </a>
            <a
              href="https://github.com/LordSA"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold flex items-center gap-2 transition-colors"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>GitHub (@LordSA)</span>
            </a>
            <a
              href="https://www.linkedin.com/in/shibili-aman-tk"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold flex items-center gap-2 transition-colors"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>LinkedIn</span>
            </a>
            <a
              href="https://x.com/shibiliii_aman"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold flex items-center gap-2 transition-colors"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Twitter/X</span>
            </a>
          </div>
        </section>

        <section className="p-8 sm:p-14 rounded-3xl border border-white/10 bg-gradient-to-br from-[#121522] via-[#0d0f17] to-[#07090e] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="flex flex-col gap-3 max-w-xl text-left">
            <h3 className="text-2xl sm:text-4xl font-black text-white">
              Ready to craft your resume?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
              Pick a layout, customize in the studio editor, and export in print-ready vector PDF with zero layout drift.
            </p>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs sm:text-sm transition-all shadow-xl shadow-white/10 shrink-0"
          >
            <span>Start Building Now</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
