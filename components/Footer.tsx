"use client";

import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
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
          <span>Securely Served</span>
        </div>
        <span className="uppercase tracking-wider font-semibold">&copy; {new Date().getFullYear()} SHIBILI AMAN TK. All rights reserved.</span>
      </div>
    </footer>
  );
}
