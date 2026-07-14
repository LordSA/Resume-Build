"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, CheckCircle, ArrowRight, Loader2, ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";

function VerifyPageContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const id = searchParams.get("id") || "";

  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!id || verified) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/auth/status?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.verified) {
            setVerified(true);
            toast.success("Email verified successfully!");
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error("Error polling verification status:", err);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [id, verified]);

  useEffect(() => {
    if (!verified) return;

    if (countdown <= 0) {
      window.location.href = "/login";
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [verified, countdown]);

  return (
    <div className="mx-auto w-full max-w-[360px] flex flex-col gap-7 my-auto">
      {!verified ? (
        <div className="flex flex-col gap-6">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">
              <Mail className="h-8 w-8" />
            </div>
          </div>

          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Verify Your Email
            </h1>
            <p className="text-xs text-zinc-455 font-medium mt-1">
              We have sent a verification email to
            </p>
            <strong className="text-sm font-bold text-blue-400 break-all bg-blue-500/5 border border-blue-500/10 px-3 py-1.5 rounded-lg w-fit mx-auto mt-1">
              {email}
            </strong>
            <p className="text-xs text-zinc-400 font-medium leading-relaxed mt-2">
              Please click the confirmation link in the email to activate your account.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-blue-400 font-bold bg-blue-500/5 border border-blue-500/10 py-3 px-4 rounded-xl">
            <Loader2 className="w-4 h-4 animate-spin" />
            Waiting for verification detection...
          </div>

          <p className="text-[10px] text-zinc-550 text-center font-medium">
            Once you click the confirmation link, this page will automatically update.
          </p>

          <Link
            href="/login"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:border-zinc-700 text-white text-sm font-bold transition-all shadow-sm cursor-pointer"
          >
            Back to Sign In
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5 text-center">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle className="h-8 w-8" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Account Verified!
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Great! Your account is now fully active. You will be redirected to the login page automatically.
            </p>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-900 py-3.5 px-4 rounded-xl flex flex-col items-center">
            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider mb-1">Redirecting In</span>
            <span className="text-4xl font-extrabold text-blue-400">{countdown}s</span>
          </div>

          <button
            onClick={() => { window.location.href = "/login"; }}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-sm cursor-pointer"
          >
            Go to Login
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
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
            <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
            <span className="text-zinc-500 text-sm font-medium">Loading session data...</span>
          </div>
        }>
          <VerifyPageContent />
        </Suspense>

        <div className="flex items-center gap-1.5 text-[10px] text-zinc-550 font-semibold justify-center mt-12 border-t border-zinc-900/60 pt-4">
          <span>Secure authentication via Supabase SSR</span>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[55%] bg-zinc-900 border-l border-zinc-900 relative items-center justify-center p-16 select-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-[480px] flex flex-col gap-6 relative z-10 text-left">
          <h3 className="text-3xl font-extrabold tracking-tight leading-tight text-white mt-8">
            Confirm your account.
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Use the confirmation link we sent to your email to verify and log in securely.
          </p>
        </div>
      </div>
    </div>
  );
}
