"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Target, ScanSearch, Layers, Sparkles, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Resumes Crafted", value: "250K+" },
    { label: "ATS Parser Score", value: "99.4%" },
    { label: "Designer Layouts", value: "4 Core" },
    { label: "Export Print Fidelity", value: "100%" },
  ];

  const pillars = [
    {
      icon: Target,
      title: "Zero Layout Drift",
      description: "Our canvas engine guarantees exact 1:1 pixel matching between the on-screen preview and downloaded vector PDF. No rogue line breaks, font clipping, or column distortion.",
      badge: "Print Engine"
    },
    {
      icon: ScanSearch,
      title: "Recruiter & ATS Calibrated",
      description: "Carefully structured semantic hierarchies built for Workday, Greenhouse, Lever, and human hiring managers. Clean linear text layers that pass compliance gates without layout compromises.",
      badge: "Compliance"
    },
    {
      icon: Layers,
      title: "Modular Layout Switching",
      description: "Switch seamlessly between Modern two-column, Minimalist centered, Classic corporate, and High-Density ATS templates without retyping or losing a single piece of career data.",
      badge: "Versatility"
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

      <main className="flex-1 mx-auto max-w-6xl w-full px-6 sm:px-10 pt-32 sm:pt-40 pb-24 flex flex-col gap-24 z-10">
        <section className="text-center flex flex-col items-center max-w-3xl mx-auto gap-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 text-zinc-300 text-xs font-semibold backdrop-blur-md">
            <span>Studio Manifesto</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Document precision for modern professionals.
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-medium">
            We built Resume Solutions to solve the common issues with online resume builders: broken PDF exports, chaotic layout shifts, and templates that fail automated applicant tracking systems.
          </p>

          <div className="flex items-center gap-3.5 mt-2">
            <Link
              href="/create"
              className="flex items-center gap-2 rounded-full bg-white hover:bg-zinc-200 text-black px-7 py-3.5 text-xs font-bold transition-all shadow-xl shadow-white/10"
            >
              <span>Explore Templates</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-full bg-white/10 border border-white/15 hover:bg-white/20 text-white px-7 py-3.5 text-xs font-bold transition-all"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl border border-white/10 bg-[#0d0f17]/80 backdrop-blur-xl flex flex-col items-center justify-center text-center gap-1.5 shadow-xl"
            >
              <span className="text-3xl sm:text-5xl font-black text-white">
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
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Engineered with Craftsmanship
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Every spacing unit, baseline grid, and font pairing has been optimized for visual appeal and automated readability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl border border-white/10 bg-[#0d0f17]/90 backdrop-blur-xl flex flex-col gap-4 text-left shadow-xl hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white border border-white/15">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">{item.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="p-8 sm:p-14 rounded-3xl border border-white/10 bg-gradient-to-br from-[#121522] via-[#0d0f17] to-[#07090e] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="flex flex-col gap-3 max-w-xl text-left">
            <h3 className="text-2xl sm:text-4xl font-black text-white">
              Ready to craft your resume?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
              Choose from our 4 designer templates or upload your current PDF to start editing with complete creative control.
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
