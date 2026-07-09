// app/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Layout, Award, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const MockResumeCanvas = ({ preset }: { preset: "modern" | "minimal" | "classic" }) => {
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  const rotateX = useTransform(y, [0, 400], [10, -10]);
  const rotateY = useTransform(x, [0, 400], [-10, 10]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    x.set(mouseX);
    y.set(mouseY);
  }

  function handleMouseLeave() {
    x.set(200);
    y.set(200);
  }

  const getPresetStyles = () => {
    switch (preset) {
      case "minimal":
        return {
          cardBg: "bg-emerald-950/5 border-emerald-950/40",
          glow: "from-emerald-500/10 to-teal-500/10",
          accentColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
          fontFamily: "font-mono",
          headerLayout: "flex flex-col items-center text-center gap-1.5 border-b border-zinc-850 pb-5",
          titleColor: "text-emerald-400 font-extrabold uppercase",
        };
      case "classic":
        return {
          cardBg: "bg-amber-950/5 border-amber-955/40",
          glow: "from-amber-500/10 to-orange-500/10",
          accentColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
          fontFamily: "font-serif",
          headerLayout: "flex justify-between items-start border-b border-zinc-800 pb-5",
          titleColor: "text-zinc-100 font-bold",
        };
      case "modern":
      default:
        return {
          cardBg: "bg-blue-950/5 border-blue-950/40",
          glow: "from-blue-500/10 to-indigo-500/10",
          accentColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          fontFamily: "font-sans",
          headerLayout: "flex justify-between items-end border-b border-zinc-800 pb-5",
          titleColor: "text-blue-400 font-extrabold",
        };
    }
  };

  const style = getPresetStyles();

  return (
    <div
      style={{ perspective: 1000 }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      className={`w-full max-w-2xl mt-12 mb-4 mx-auto select-none cursor-grab active:cursor-grabbing px-2 sm:px-0 ${style.fontFamily}`}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`w-full rounded-2xl border ${style.cardBg} p-5 sm:p-8 backdrop-blur-md shadow-2xl relative flex flex-col gap-6 text-left overflow-hidden group`}
        whileHover={{ boxShadow: "0 0 35px rgba(59,130,246,0.12)" }}
        transition={{ type: "spring", stiffness: 150, damping: 22 }}
      >
        <div className={`absolute -inset-px rounded-2xl bg-gradient-to-r ${style.glow} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-500`} />

        <div className={style.headerLayout}>
          <div className="flex flex-col gap-2">
            <h2 className={`h-6 text-lg tracking-tight ${style.titleColor}`}>Your Name</h2>
            <div className="h-4 w-28 bg-zinc-850/80 rounded" />
          </div>
          <div className="flex flex-col gap-1.5 items-end text-xs text-zinc-500">
            <div className="h-3 w-32 bg-zinc-850/80 rounded" />
            <div className="h-3 w-24 bg-zinc-850/80 rounded" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="h-3.5 w-20 bg-zinc-800/80 rounded" />
          <div className="flex flex-col gap-2">
            <div className="h-3 w-full bg-zinc-850/80 rounded" />
            <div className="h-3 w-5/6 bg-zinc-850/80 rounded" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="h-3.5 w-24 bg-zinc-800/80 rounded" />
          <div className="flex flex-col gap-3.5">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <div className="h-3.5 w-36 bg-zinc-850/80 rounded" />
                  <div className="h-3 w-20 bg-zinc-850/80 rounded" />
                </div>
                <div className="h-3 w-full bg-zinc-900/40 rounded" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const MarqueeNode = ({ text }: { text: string }) => (
  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-zinc-900 bg-zinc-900/10 text-xs font-semibold text-zinc-300 whitespace-nowrap">
    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
    {text}
  </span>
);

export default function Home() {
  const [activePreset, setActivePreset] = useState<"modern" | "minimal" | "classic">("modern");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  } as const;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col selection:bg-blue-600/30 overflow-x-hidden relative max-w-full">
      {/* Background Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-900/5 blur-[120px] pointer-events-none" />

      <header className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2.5"
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="h-8 w-auto opacity-95"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="font-extrabold tracking-tight text-lg text-white">Resume Solutions</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <Link
              href="/login"
              className="text-xs font-bold hover:text-zinc-300 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full z-10 overflow-hidden">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center flex flex-col items-center max-w-3xl gap-6 mb-12"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent py-1"
          >
            Build ATS-Optimized Resumes in Minutes
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed"
          >
            Paste your experience, profile nodes, or education history. Our structural document editor refines, matches, and aligns it into pixel-perfect PDF resumes.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto px-4 sm:px-0"
          >
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 px-6 py-3.5 text-sm font-semibold transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              Build Resume Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-full   border border-zinc-800 hover:bg-zinc-900 px-6 py-3.5 text-sm font-semibold transition-all"
            >
              Log In
            </Link>
          </motion.div>
        </motion.div>

        {/* Interactive Layout Preset Control Grid */}
        <div className="flex flex-wrap justify-center gap-3.5 mt-4 z-20">
          <button
            onClick={() => setActivePreset("modern")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${activePreset === "modern" ? "bg-blue-600/10 border-blue-500/50 text-blue-450" : "bg-zinc-900/30 border-zinc-850 text-zinc-400 hover:text-white"}`}
          >
            Modern (2-Column)
          </button>
          <button
            onClick={() => setActivePreset("minimal")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${activePreset === "minimal" ? "bg-emerald-600/10 border-emerald-500/50 text-emerald-450" : "bg-zinc-900/30 border-zinc-850 text-zinc-400 hover:text-white"}`}
          >
            Minimal (Centered)
          </button>
          <button
            onClick={() => setActivePreset("classic")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${activePreset === "classic" ? "bg-amber-600/10 border-amber-500/50 text-amber-450" : "bg-zinc-900/30 border-zinc-850 text-zinc-400 hover:text-white"}`}
          >
            Classic (Serif)
          </button>
        </div>

        {/* 3D Tilting Product Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full overflow-hidden"
        >
          <MockResumeCanvas preset={activePreset} />
        </motion.div>

        {/* 2D Scrolling Marquee Slider */}
        <div className="w-full overflow-hidden relative py-4 border-y border-zinc-900/60 my-16 bg-zinc-950/20 max-w-full">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-zinc-955 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-zinc-955 to-transparent z-10 pointer-events-none" />
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
            className="flex gap-4 w-max"
          >
            {[
              "Work Experience", "Education Details", "Project Summaries", "Custom Colors", "Compact Spacing", "ATS Compatibility", "Instant Print to PDF", "Font Pairings", "Certificate Vaults", "Awards & Honours",
              "Work Experience", "Education Details", "Project Summaries", "Custom Colors", "Compact Spacing", "ATS Compatibility", "Instant Print to PDF", "Font Pairings", "Certificate Vaults", "Awards & Honours"
            ].map((text, idx) => (
              <MarqueeNode key={idx} text={text} />
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-4"
        >
          {[
            {
              icon: Zap,
              title: "Instant Section Extraction",
              description: "Paste a paragraph of career information, and our system automatically structures it into clean, type-safe layouts.",
            },
            {
              icon: Layout,
              title: "Interchangeable Templates",
              description: "Swap layouts between Modern, Minimal, and Classic designs instantly without losing a single character of content.",
            },
            {
              icon: Award,
              title: "ATS Matching Analyzer",
              description: "Compare your resume directly against any target job listing to detect missing keywords and optimize compatibility scores.",
            },
          ].map((feat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5, borderColor: "rgba(59, 130, 246, 0.3)" }}
              className="rounded-2xl border border-zinc-900 bg-zinc-900/10 p-6 flex flex-col gap-4 text-left hover:bg-zinc-900/25 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <feat.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{feat.title}</h3>
                <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">{feat.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Redesigned Multi-Column Premium Footer with strict padding bounds to avoid mobile horizontal scroll */}
      <footer className="border-t border-zinc-900 bg-zinc-950 pt-12 pb-6 text-zinc-400 z-10 w-full overflow-hidden max-w-full">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-left w-full">

          <div className="flex flex-col gap-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-8 w-auto opacity-95"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="font-extrabold tracking-tight text-lg text-white">Resume Solutions</span>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-sm">
              The high-performance resume styling environment. Build, format, and structure clean, print-perfect, ATS-compatible resumes with zero visual drift.
            </p>
            <div className="mt-2 text-zinc-550 text-[11px] flex flex-col gap-1 font-medium">
              <span>Contact: <a href="mailto:admin@resumesolutions.shibili.tech" className="text-zinc-400 hover:text-white transition-colors">admin@resumesolutions.shibili.tech</a></span>
              <span>Site URL: <a href="https://resumesolutions.shibili.tech" className="text-zinc-400 hover:text-white transition-colors">resumesolutions.shibili.tech</a></span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Project</h4>
            <div className="flex flex-col gap-2.5 text-xs text-zinc-500 font-medium">
              <a href="https://github.com/LordSA" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Created by Shibili Aman TK
              </a>
              <a href="https://github.com/LordSA" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                GitHub Repository
              </a>
              <a href="https://www.shibili.tech" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Personal Website
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Support Owner</h4>
            <p className="text-zinc-500 text-xs leading-relaxed">
              If you found this tool useful, feel free to support our work and check out our other projects.
            </p>
            {/* Custom Support button linking to your website */}
            <a
              href="https://www.shibili.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-850 hover:border-zinc-700 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-sm w-fit cursor-pointer group"
            >
              <svg className="h-4.5 w-4.5 text-blue-500 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 21h18v-2H2v2zM20 8h-2V5h2v3zm2-5H4v14h14v-4h4V3zm-6 12H6V5h10v10z" />
              </svg>
              Support on Shibili
            </a>
          </div>

        </div>

        <div className="mx-auto max-w-7xl px-6 border-t border-zinc-900 mt-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-550 text-xs w-full">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="h-4 w-4" />
            <span>Securely ServedL</span>
          </div>
          <span className="uppercase tracking-wider font-semibold">&copy; {new Date().getFullYear()} SHIBILI AMAN TK. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
