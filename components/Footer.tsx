"use client";

import Link from "next/link";
import { ShieldCheck, Heart, Sparkles, Layers, ScanSearch, Mail, Info } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#1f2333] bg-[#0c0e17] pt-14 pb-8 text-zinc-400 z-10 w-full overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 text-left w-full">
        <div className="flex flex-col gap-4 sm:col-span-2 md:col-span-5">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/nv.svg"
              alt="Logo"
              className="h-8 w-auto opacity-95 group-hover:scale-105 transition-transform"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="font-black tracking-tight text-lg text-white group-hover:text-blue-400 transition-colors">
              Resume Solutions
            </span>
          </Link>
          <p className="text-zinc-400 text-xs leading-relaxed max-w-sm font-medium">
            The modern ATS resume studio. Build, format, and customize professional print-perfect resumes with live ATS keyword matching and zero layout drift.
          </p>
          <div className="text-zinc-500 text-[11px] flex flex-col gap-1 font-medium mt-1">
            <span>Support: <a href="mailto:admin@resumesolutions.shibili.xyz" className="text-zinc-300 hover:text-white transition-colors">admin@resumesolutions.shibili.xyz</a></span>
            <span>Official: <a href="https://resumesolutions.shibili.xyz" className="text-zinc-300 hover:text-white transition-colors">resumesolutions.shibili.xyz</a></span>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:col-span-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-white">Product</h4>
          <div className="flex flex-col gap-2 text-xs text-zinc-400 font-medium">
            <Link href="/create" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>AI Builder</span>
            </Link>
            <Link href="/create?mode=template" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              <span>Template Library</span>
            </Link>
            <Link href="/dashboard?action=ats" className="hover:text-white transition-colors flex items-center gap-1.5">
              <ScanSearch className="h-3.5 w-3.5 text-cyan-400" />
              <span>ATS Match Checker</span>
            </Link>
            <Link href="/create?mode=upload" className="hover:text-white transition-colors">
              Upload & Edit CV
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:col-span-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-white">Company</h4>
          <div className="flex flex-col gap-2 text-xs text-zinc-400 font-medium">
            <Link href="/about" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-emerald-400" />
              <span>About Us</span>
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-amber-400" />
              <span>Contact Us</span>
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:col-span-2 md:col-span-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-white">Developer</h4>
          <p className="text-zinc-400 text-xs leading-relaxed font-medium">
            Crafted for job seekers, designers, and software engineers worldwide.
          </p>
          <a
            href="https://www.shibili.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-[#23273a] bg-[#141724] hover:bg-[#1a1e2e] hover:border-[#2f354d] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-sm w-fit group cursor-pointer"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Built by Shibili</span>
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 border-t border-[#1f2333] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-xs w-full">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Encrypted with Supabase SSR</span>
        </div>
        <span className="uppercase tracking-wider font-semibold text-[11px] text-zinc-500">
          &copy; {new Date().getFullYear()} SHIBILI AMAN TK. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
