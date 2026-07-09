// app/page.tsx
"use client";

import Link from "next/link";
import { FileText, Layout, Award, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

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
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />

      <header className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <FileText className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg">Resume Solutions</span>
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
          className="text-center flex flex-col items-center max-w-3xl gap-6 mb-20"
        >
          <motion.div variants={itemVariants}>
            <a
              href="https://github.com/LordSA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/40 text-[10px] font-bold text-zinc-400 tracking-wider uppercase hover:border-blue-500/30 hover:bg-zinc-900 transition-all hover:text-white"
            >
              <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Created by Shibili Aman TK
            </a>
          </motion.div>
          
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
            Paste your raw experience details, bio, or structural history. Our editor instantly parses, refines, and aligns it into pixel-perfect PDF resumes.
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

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-8"
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

      <footer className="border-t border-zinc-900 bg-zinc-950/20 py-8 text-center text-xs text-zinc-550 shrink-0 z-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-zinc-550" />
            <span>Securely saved in Supabase PostgreSQL</span>
          </div>
          <span>&copy; {new Date().getFullYear()} shibili aman. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
