"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/client";
import { CheckCircle, ArrowRight, ChevronLeft } from "lucide-react";

export default function VerifiedPage() {
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setHasSession(true);
      }
    });
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-zinc-950 text-white selection:bg-blue-600/30 font-sans relative overflow-hidden">
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-8 sm:p-12 relative z-10 bg-zinc-950">
        <div className="flex items-center justify-between w-full mb-12">
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-900 bg-zinc-900/30 text-xs font-semibold text-zinc-400 hover:text-white hover:border-zinc-800 transition-all cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
          <img
            src="/nv.svg"
            alt="Logo"
            className="h-7 w-auto opacity-90"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="mx-auto w-full max-w-[360px] flex flex-col gap-7 my-auto text-center">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle className="h-8 w-8" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Email Confirmed!</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Your email address has been successfully verified. You are now ready to log in and manage your resumes.
            </p>
          </div>

          <button
            onClick={() => { window.location.href = hasSession ? "/dashboard" : "/login"; }}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-sm cursor-pointer"
          >
            {hasSession ? "Go to Dashboard" : "Proceed to Login"}
            <ArrowRight className="h-4 w-4 text-white" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-zinc-550 font-semibold justify-center mt-12 border-t border-zinc-900/60 pt-4">
          <span>Secure authentication via Supabase SSR</span>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[55%] bg-zinc-900 border-l border-zinc-900 relative items-center justify-center p-16 select-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-[480px] flex flex-col gap-6 relative z-10 text-left">
          <h3 className="text-3xl font-extrabold tracking-tight leading-tight text-white mt-8">
            Access your personal workspace.
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Your verification is complete. You can now build, modify, format, and export print-perfect ATS compliant resumes securely.
          </p>
        </div>
      </div>
    </div>
  );
}
