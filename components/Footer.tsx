"use client";

import Link from "next/link";
import { ArrowUp, ArrowRight } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-white/10 bg-[#07090e] text-zinc-400 z-10 w-full overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 pt-16 pb-12 grid grid-cols-1 md:grid-cols-12 gap-12 text-left w-full">
        <div className="flex flex-col gap-5 md:col-span-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/nv.svg"
              alt="Logo"
              className="h-8 w-auto opacity-95 transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="font-black tracking-tight text-lg text-white group-hover:text-zinc-200 transition-colors">
              Resume Solutions
            </span>
          </Link>

          <p className="text-zinc-400 text-xs leading-relaxed max-w-sm font-medium">
            Our precision resume studio brings zero layout drift, type-safe structures, and recruiter-approved formatting together for modern professionals.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X / Twitter"
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-all"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-all"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://github.com/LordSA"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-all"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:col-span-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-white">Solutions</h4>
          <div className="flex flex-col gap-2 text-xs text-zinc-400 font-medium">
            <Link href="/create?mode=template" className="hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="/create?mode=template" className="hover:text-white transition-colors">
              Templates
            </Link>
            <Link href="/dashboard?action=ats" className="hover:text-white transition-colors">
              ATS Match
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:col-span-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-white">Resources</h4>
          <div className="flex flex-col gap-2 text-xs text-zinc-400 font-medium">
            <Link href="/contact" className="hover:text-white transition-colors">
              Help + FAQ&apos;s
            </Link>
            <Link href="/create?mode=upload" className="hover:text-white transition-colors">
              CV Import
            </Link>
            <Link href="/create" className="hover:text-white transition-colors">
              Studio Editor
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              Size Guide
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Accessibility
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:col-span-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-white">Stay Connected</h4>
          <p className="text-zinc-400 text-xs leading-relaxed font-medium">
            We&apos;ll only send you the good stuff (including template drops, latest format updates, plus early access to our features).
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="relative mt-2">
            <input
              type="email"
              placeholder="Email Address..."
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all pr-12"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-white text-black hover:bg-zinc-200 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 border-t border-white/10 pt-6 pb-8 flex items-center justify-between gap-4 text-xs text-zinc-500 w-full">
        <span className="font-medium text-[11px] text-zinc-400">
          Built with precision by{" "}
          <a
            href="https://www.shibili.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-bold hover:underline"
          >
            Shibili Aman TK
          </a>
        </span>

        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="h-9 w-9 rounded-xl bg-white text-black hover:bg-zinc-200 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </footer>
  );
}
