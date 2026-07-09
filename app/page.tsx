// app/page.tsx
"use client";

import Link from "next/link";
import { Layout, Award, Zap, ArrowRight, ShieldCheck, Mail, Globe } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const LogoSVG = () => (
  <svg className="h-9 w-9 text-blue-500 shrink-0" viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#00ed64" />
      </linearGradient>
    </defs>
    <rect x="20" y="20" width="45" height="60" rx="6" stroke="url(#logo-grad)" strokeWidth="6" fill="none" />
    <rect x="35" y="30" width="45" height="60" rx="6" stroke="url(#logo-grad)" strokeWidth="6" fill="#09090b" opacity="0.9" />
    <line x1="45" y1="45" x2="70" y2="45" stroke="url(#logo-grad)" strokeWidth="4" strokeLinecap="round" />
    <line x1="45" y1="58" x2="65" y2="58" stroke="url(#logo-grad)" strokeWidth="4" strokeLinecap="round" />
    <line x1="45" y1="71" x2="60" y2="71" stroke="url(#logo-grad)" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const MockResumeCanvas = () => {
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

  return (
    <div 
      style={{ perspective: 1000 }} 
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      className="w-full max-w-2xl mt-12 mb-4 mx-auto select-none cursor-grab active:cursor-grabbing"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full rounded-2xl border border-zinc-800 bg-[#001e2b]/15 p-8 backdrop-blur-md shadow-2xl relative flex flex-col gap-6 text-left overflow-hidden group"
        whileHover={{ boxShadow: "0 0 35px rgba(59,130,246,0.12)" }}
        transition={{ type: "spring", stiffness: 150, damping: 22 }}
      >
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/10 to-[#00ed64]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-500" />

        <div className="flex justify-between items-end border-b border-zinc-800 pb-5">
          <div className="flex flex-col gap-2">
            <div className="h-6 w-44 bg-zinc-800/80 rounded" />
            <div className="h-4 w-28 bg-zinc-850/80 rounded" />
          </div>
          <div className="flex flex-col gap-1.5 items-end">
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
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col selection:bg-blue-600/30 overflow-x-hidden relative">
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
            <LogoSVG />
            <span className="font-extrabold tracking-tight text-lg">Resume Solutions</span>
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
              className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center py-20 px-6 max-w-7xl mx-auto w-full z-10">
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
            className="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed"
          >
            Paste your experience, profile nodes, or education history. Our structural document editor refines, matches, and aligns it into pixel-perfect PDF resumes.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto"
          >
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3.5 text-sm font-semibold transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              Build Resume Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 hover:bg-zinc-900 px-6 py-3.5 text-sm font-semibold transition-all"
            >
              Log In
            </Link>
          </motion.div>
        </motion.div>

        {/* 3D Tilting Product Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full"
        >
          <MockResumeCanvas />
        </motion.div>

        {/* 2D Scrolling Marquee Slider */}
        <div className="w-full overflow-hidden relative py-4 border-y border-zinc-900/60 my-16 bg-zinc-950/20">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
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

      {/* Redesigned Multi-Column Premium Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-16 text-zinc-400 z-10 w-full">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          
          <div className="flex flex-col gap-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <LogoSVG />
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
            {/* Custom styled Coffee Cup button linking to user's website */}
            <a 
              href="https://www.shibili.tech" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-[#001e2b] hover:bg-[#002e3b] hover:border-[#00ed64]/40 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-sm w-fit cursor-pointer group"
            >
              <svg className="h-4.5 w-4.5 text-[#00ed64] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 21h18v-2H2v2zM20 8h-2V5h2v3zm2-5H4v14h14v-4h4V3zm-6 12H6V5h10v10z"/>
              </svg>
              Support on shibili.tech
            </a>
          </div>

        </div>

        <div className="mx-auto max-w-7xl px-6 border-t border-zinc-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-550 text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="h-4 w-4" />
            <span>Securely saved in Supabase PostgreSQL</span>
          </div>
          <span>&copy; {new Date().getFullYear()} shibili aman. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
