"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { WifiOff, RefreshCw, Home, Compass } from "lucide-react";

export default function OfflinePage() {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans flex flex-col items-center justify-center p-6 selection:bg-blue-500/20 relative overflow-hidden">
      <div className="w-full max-w-lg flex flex-col items-center text-center z-10 my-auto">
        <motion.div 
          className="relative mb-6 flex items-center justify-center"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <div className="w-28 h-36 bg-white rounded-2xl rounded-tr-[28px] border-2 border-[#1e293b] shadow-2xl flex flex-col items-center justify-center p-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-7 h-7 bg-zinc-100 border-l-2 border-b-2 border-[#1e293b] rounded-bl-xl" />
            
            <div className="flex items-center gap-6 mt-4 relative">
              <div className="w-3.5 h-3.5 rounded-full bg-[#0f172a]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#0f172a]" />
            </div>

            <div className="w-4 h-1.5 border-b-2 border-l-2 border-r-2 border-[#0f172a] rounded-b-full mt-3 rotate-180" />

            <div className="flex items-center gap-1 mt-4 px-2 py-0.5 rounded bg-red-100 text-red-600 text-[9px] font-bold">
              <WifiOff className="h-3 w-3" />
              <span>Offline</span>
            </div>
          </div>
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1e293b] mb-2">
          No Internet Connection
        </h1>
        <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-8 font-medium">
          Looks like you&apos;re disconnected. Check your connection or retry to continue editing your resumes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#00c988] hover:bg-[#00b57a] text-white px-7 py-3 text-sm font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50 w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
            <span>{isRetrying ? "Checking..." : "Retry Connection"}</span>
          </button>

          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 text-sm font-bold transition-all shadow-sm cursor-pointer w-full sm:w-auto"
          >
            <Compass className="h-4 w-4" />
            <span>Open Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
