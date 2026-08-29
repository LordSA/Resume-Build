"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Sparkles, ArrowRight, Compass, RefreshCw } from "lucide-react";

export default function NotFound() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 8;
      const y = (e.clientY / innerHeight - 0.5) * 8;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3500);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans flex flex-col items-center justify-center p-6 selection:bg-emerald-500/20 relative overflow-hidden">
      <div className="w-full max-w-xl flex flex-col items-center text-center z-10 my-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-4 select-none mb-6">
          <span className="text-7xl sm:text-9xl font-black tracking-tighter text-[#1e293b]">
            4
          </span>

          <motion.div 
            className="relative flex items-center justify-center"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 rounded-full bg-[#1e293b] scale-110 shadow-lg" />
            
            <div className="relative w-24 h-32 sm:w-28 sm:h-36 bg-white rounded-2xl rounded-tr-[28px] border-2 border-[#1e293b] shadow-2xl flex flex-col items-center justify-center p-2 overflow-hidden">
              <div className="absolute top-0 right-0 w-7 h-7 bg-zinc-100 border-l-2 border-b-2 border-[#1e293b] rounded-bl-xl" />
              
              <div className="flex items-center gap-6 mt-4 relative">
                <div className="relative flex items-center justify-center">
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
                    {!isBlinking && (
                      <motion.div 
                        className="w-1.5 h-1.5 rounded-full bg-white self-start ml-0.5 mt-0.5"
                        style={{ x: mousePos.x * 0.4, y: mousePos.y * 0.4 }}
                      />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -left-1 w-3 h-1.5 rounded-full bg-pink-400/40 blur-[0.5px]" />
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
                    {!isBlinking && (
                      <motion.div 
                        className="w-1.5 h-1.5 rounded-full bg-white self-start ml-0.5 mt-0.5"
                        style={{ x: mousePos.x * 0.4, y: mousePos.y * 0.4 }}
                      />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-1 w-3 h-1.5 rounded-full bg-pink-400/40 blur-[0.5px]" />
                </div>
              </div>

              <div className="w-4 h-0.5 bg-[#0f172a] rounded-full mt-3" />

              <div className="w-12 h-1 bg-zinc-200 rounded-full mt-4" />
              <div className="w-8 h-1 bg-zinc-200 rounded-full mt-1.5" />
            </div>
          </motion.div>

          <span className="text-7xl sm:text-9xl font-black tracking-tighter text-[#1e293b]">
            4
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col gap-2 mb-8"
        >
          <p className="text-zinc-500 text-sm sm:text-base font-medium">
            Oops. The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto"
        >
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#00c988] hover:bg-[#00b57a] text-white px-8 py-3 text-sm font-bold transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer w-full sm:w-auto"
          >
            <Home className="h-4 w-4" />
            <span>Back Home</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 text-sm font-bold transition-all shadow-sm cursor-pointer w-full sm:w-auto"
          >
            <Compass className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </motion.div>

        <div className="mt-12 text-zinc-400 text-xs font-semibold flex items-center justify-center gap-2">
          <span>Resume Solutions</span>
          <span>•</span>
          <span>Error 404</span>
        </div>
      </div>
    </div>
  );
}
