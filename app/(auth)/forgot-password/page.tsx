"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/client";
import { toast } from "react-hot-toast";
import { Loader2, ArrowRight, ChevronLeft, Mail, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset link sent to your email!");
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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
            src="/logo.svg"
            alt="Logo"
            className="h-7 w-auto opacity-90"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="mx-auto w-full max-w-[360px] flex flex-col gap-7 my-auto">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Reset Password</h2>
            <p className="text-xs text-zinc-450 font-medium mt-1">
              Enter your email and we will send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleResetRequest} className="flex flex-col gap-4.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-sans">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/20 pl-11 pr-4 py-3 text-sm text-white transition-all focus:border-blue-500 focus:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500/10 animate-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  Sending Link...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="h-4 w-4 text-white" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-zinc-555 font-semibold justify-center mt-12 border-t border-zinc-900/60 pt-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Secure authentication via Supabase SSR</span>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[55%] bg-zinc-900 border-l border-zinc-900 relative items-center justify-center p-16 select-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-[480px] flex flex-col gap-6 relative z-10">
          <h3 className="text-3xl font-extrabold tracking-tight leading-tight text-white mt-8">
            Recover your workspace in seconds.
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Once you submit, we will verify your account and email a secure link. Keep your credentials private and activate multi-factor settings.
          </p>

          <div className="flex flex-col gap-4.5 mt-4 border-t border-zinc-800 pt-6">
            {[
              "Instant document rendering with Zero Layout Drift",
              "Interchangeable templates (Modern, Minimal, Classic)",
              "Strict local autosave back-ups",
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs text-zinc-450 font-semibold">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <ArrowRight className="h-3 w-3" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
