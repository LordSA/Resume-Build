"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FileQuestion, 
  Home, 
  Plus, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle,
  Compass,
  FileText
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col items-center justify-center p-6 selection:bg-blue-600/30 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl flex flex-col items-center text-center z-10 my-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="relative mb-6"
        >
          <div className="relative flex items-center justify-center h-28 w-28 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl">
            <FileQuestion className="h-14 w-14 text-blue-500 animate-pulse" />
            <span className="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-red-500/20 border border-red-500/40 text-red-400 shadow-lg">
              404 Error
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex flex-col gap-2 mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            404: Career Gap Detected!
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            We searched the entire career history database, but this page seems to have taken an unapproved sabbatical.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 mb-8 backdrop-blur-xl shadow-2xl text-left flex flex-col gap-4 relative overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                ATS Missing Route Analysis
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase">
              <AlertCircle className="h-3 w-3" />
              <span>0% Match Rate</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-850">
              <span className="text-zinc-500 text-[10px] font-bold uppercase">Candidate Role</span>
              <p className="text-zinc-200 font-semibold mt-0.5 font-mono">Page_Not_Found.tsx</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-850">
              <span className="text-zinc-500 text-[10px] font-bold uppercase">Skill Gap</span>
              <p className="text-red-400 font-semibold mt-0.5">URL is missing or relocated</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/15 flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-400 leading-relaxed">
              <strong className="text-zinc-200 font-medium">Recruiter Tip:</strong> Even the most decorated resumes have a typo now and then. Let&apos;s get you back to the right path!
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
        >
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] px-6 py-3.5 text-sm font-bold text-white transition-all w-full sm:w-auto cursor-pointer"
          >
            <Compass className="h-4 w-4" />
            Go to Dashboard
          </Link>

          <Link
            href="/create"
            className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 px-6 py-3.5 text-sm font-semibold text-zinc-200 transition-all w-full sm:w-auto cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Build a Resume
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-xs font-semibold text-zinc-500 hover:text-white px-4 py-3 transition-colors cursor-pointer"
          >
            <Home className="h-3.5 w-3.5" />
            Homepage
          </Link>
        </motion.div>
      </div>

      <div className="mt-8 text-zinc-600 text-[11px] font-medium z-10 flex items-center gap-2">
        <span>Resume Solutions</span>
        <span>•</span>
        <span>Error 404</span>
      </div>
    </div>
  );
}
