"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/client";
import { Mail, ChevronLeft, CheckCircle } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const confirmedParam = searchParams.get("confirmed") === "true";

  const [isConfirmed, setIsConfirmed] = useState(confirmedParam);
  const [countdown, setCountdown] = useState(5);
  const supabase = createClient();

  useEffect(() => {
    const checkVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email_confirmed_at) {
        setIsConfirmed(true);
      }
    };
    checkVerification();
  }, [supabase]);

  useEffect(() => {
    if (isConfirmed) {
      if (countdown === 0) {
        window.location.href = "/login";
        return;
      }
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isConfirmed, countdown]);

  return (
    <div className="mx-auto w-full max-w-[360px] flex flex-col gap-7 my-auto">
      {isConfirmed ? (
        <div className="flex flex-col gap-5 text-center">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle className="h-8 w-8" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Your mail confirmed</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Your email has been confirmed successfully.
            </p>
          </div>
          <div className="text-xs text-zinc-550 font-semibold bg-zinc-900/40 border border-zinc-900 px-4 py-3.5 rounded-xl">
            Redirecting to login page in <span className="text-emerald-400 font-bold text-sm">{countdown}</span> seconds...
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">
              <Mail className="h-8 w-8" />
            </div>
          </div>
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Verify your email</h2>
            <p className="text-xs text-zinc-455 font-medium mt-1">
              We sent a verification link to
            </p>
            {email && (
              <p className="text-sm font-bold text-blue-400 break-all bg-blue-500/5 border border-blue-500/10 px-3 py-1.5 rounded-lg w-fit mx-auto">
                {email}
              </p>
            )}
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed text-center font-medium">
            Please click the link in that email to confirm your account and log in. If you don't see it, check your spam folder.
          </p>
          <Link
            href="/login"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700 text-white text-sm font-bold transition-all shadow-sm cursor-pointer"
          >
            Back to Sign In
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen w-full bg-zinc-950 text-white selection:bg-blue-600/30 font-sans relative overflow-hidden">
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-8 sm:p-12 relative z-10 bg-zinc-950">
        <div className="flex items-center justify-between w-full mb-12">
          <Link 
            href="/signup" 
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
            <span className="text-zinc-500 text-sm">Loading verification...</span>
          </div>
        }>
          <VerifyEmailContent />
        </Suspense>

        <div className="flex items-center gap-1.5 text-[10px] text-zinc-550 font-semibold justify-center mt-12 border-t border-zinc-900/60 pt-4">
          <span>Secure authentication via Supabase SSR</span>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[55%] bg-zinc-900 border-l border-zinc-900 relative items-center justify-center p-16 select-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-[480px] flex flex-col gap-6 relative z-10">
          <h3 className="text-3xl font-extrabold tracking-tight leading-tight text-white mt-8">
            Confirm your account.
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Click the link we emailed to confirm your email verification securely and log in to the resume styling environment.
          </p>
        </div>
      </div>
    </div>
  );
}
