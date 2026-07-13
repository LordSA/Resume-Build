"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight, ChevronLeft } from "lucide-react";

function ForgotPasswordVerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  return (
    <div className="mx-auto w-full max-w-[360px] flex flex-col gap-7 my-auto text-center">
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">
          <Mail className="w-8 h-8" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Check Your Email
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          We have sent a password reset recovery link to <br />
          <strong className="font-bold text-white break-all">{email}</strong>.<br />
          Please check your inbox and click the link to reset your password.
        </p>
      </div>

      <button
        onClick={() => router.push("/login")}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-sm cursor-pointer"
      >
        Back to Login
        <ArrowRight className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}

export default function ForgotPasswordVerifyPage() {
  return (
    <div className="flex min-h-screen w-full bg-zinc-950 text-white selection:bg-blue-600/30 font-sans relative overflow-hidden">
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-8 sm:p-12 relative z-10 bg-zinc-950">
        <div className="flex items-center justify-between w-full mb-12">
          <Link 
            href="/forgot-password" 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-900 bg-zinc-900/30 text-xs font-semibold text-zinc-400 hover:text-white hover:border-zinc-800 transition-all cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
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

        <Suspense fallback={
          <div className="mx-auto w-full max-w-[360px] flex items-center justify-center my-auto">
            <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin mr-2" />
            <span className="text-zinc-500 text-sm font-medium">Loading session data...</span>
          </div>
        }>
          <ForgotPasswordVerifyContent />
        </Suspense>

        <div className="flex items-center gap-1.5 text-[10px] text-zinc-550 font-semibold justify-center mt-12 border-t border-zinc-900/60 pt-4">
          <span>Secure authentication via Supabase SSR</span>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[55%] bg-zinc-900 border-l border-zinc-900 relative items-center justify-center p-16 select-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-[480px] flex flex-col gap-6 relative z-10 text-left">
          <h3 className="text-3xl font-extrabold tracking-tight leading-tight text-white mt-8">
            Check your inbox.
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            A secure recovery link has been dispatched. Click the link to define a new password for your account.
          </p>
        </div>
      </div>
    </div>
  );
}
