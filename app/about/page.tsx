"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Layers, 
  ScanSearch, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Users, 
  CheckCircle2,
  FileText,
  Target
} from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Resumes Built", value: "250K+" },
    { label: "ATS Pass Rate", value: "99.4%" },
    { label: "Designer Layouts", value: "4 Distinct" },
    { label: "Recruiter Score", value: "9.8/10" },
  ];

  const coreValues = [
    {
      icon: Target,
      title: "Zero Layout Drift",
      description: "What you see on the screen matches the exported PDF to the exact millimeter. No broken page breaks, missing fonts, or misaligned columns.",
      color: "from-blue-600/20 to-cyan-600/10 border-blue-500/30 text-blue-400"
    },
    {
      icon: ScanSearch,
      title: "100% ATS Compliant",
      description: "Engineered specifically to pass Workday, Greenhouse, Lever, and Taleo bots. Structured semantic tags and clean parsing without table glitches.",
      color: "from-purple-600/20 to-pink-600/10 border-purple-500/30 text-purple-400"
    },
    {
      icon: Zap,
      title: "Instant AI Extraction",
      description: "Paste unstructured notes, bios, or raw career history. Our AI formats duties, extracts action verbs, and generates standardized resume entities.",
      color: "from-emerald-600/20 to-teal-600/10 border-emerald-500/30 text-emerald-400"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0c14] text-zinc-100 font-sans flex flex-col selection:bg-blue-600/30 overflow-x-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[160px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[160px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 mx-auto max-w-6xl w-full px-6 py-16 flex flex-col gap-20 z-10">
        <section className="text-center flex flex-col items-center max-w-3xl mx-auto gap-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            <span>Our Mission & Story</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            We make job applications effortless & ATS-proof.
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Resume Solutions was created to eliminate the frustration of resume builders that break formatting, hide features behind paywalls, or fail automated applicant tracking systems.
          </p>

          <div className="flex items-center gap-4 mt-2">
            <Link
              href="/create"
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 text-xs font-bold transition-all shadow-lg shadow-blue-600/25 hover:scale-[1.02]"
            >
              <span>Build Your Resume</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-xl bg-[#141724] border border-[#262a3d] hover:bg-[#1a1e2e] text-zinc-300 hover:text-white px-6 py-3.5 text-xs font-bold transition-all"
            >
              <span>Get in Touch</span>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-[#23273a] bg-[#11131e]/70 backdrop-blur-md flex flex-col items-center justify-center text-center gap-1 shadow-lg"
            >
              <span className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-10">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Why Candidates Choose Resume Solutions
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Every pixel, spacing rule, and typography pairing is tested against real corporate ATS parsers and human recruiters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border bg-gradient-to-br ${val.color} flex flex-col gap-4 shadow-xl`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 border border-white/15">
                  <val.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-white">{val.title}</h3>
                <p className="text-xs text-zinc-300 leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="p-8 sm:p-12 rounded-3xl border border-[#23273a] bg-gradient-to-br from-[#121522] to-[#0d0f18] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="flex flex-col gap-3 max-w-xl text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Ready to create your winning resume?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Choose from our 4 designer templates or paste your LinkedIn bio. Export in high-resolution PDF with 100% ATS score compliance.
            </p>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-xl shadow-blue-600/30 shrink-0"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Get Started Now</span>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
