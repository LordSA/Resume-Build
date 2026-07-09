// app/(auth)/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/client";
import { toast } from "react-hot-toast";
import { Loader2, Sparkles, ArrowRight, ArrowLeft, ShieldCheck, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // Login page only allows existing accounts
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes("Signups are not allowed")) {
          toast.error("Account not found. Please sign up first.");
        } else {
          toast.error(error.message);
        }
      } else {
        setIsOtpSent(true);
        setCountdown(60);
        toast.success("Verification code sent to your email!");
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpToken) {
      toast.error("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpToken,
        type: "email",
      });

      if (error) {
        toast.error(error.message);
      } else if (data.session) {
        toast.success("Successfully logged in!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Verification failed. Please check the code.");
      }
    } catch (err: any) {
      toast.error("Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setCountdown(60);
      toast.success("Verification code resent!");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || `Failed to sign in with ${provider}`);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-radial from-[#121214] to-black px-6 text-white selection:bg-blue-600/30">
      <div className="absolute top-8 left-8 flex items-center gap-2 font-semibold text-lg tracking-tight">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-white">Resume Solutions</span>
        </Link>
      </div>

      <div className="w-full max-w-[420px] rounded-3xl border border-zinc-800 bg-zinc-900/10 p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col gap-2 text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Sign In</h2>
          <p className="text-xs text-zinc-400">
            {isOtpSent ? "Enter the verification code sent to your inbox" : "Sign in using a passwordless one-time verification code"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isOtpSent ? (
            <motion.form
              key="email-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSendOTP}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/20 pl-11 pr-4 py-3 text-sm text-white transition-all focus:border-blue-500 focus:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold transition-all hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.35)] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    Send Verification Code
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="otp-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleVerifyOTP}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/20 px-4 py-3 text-center text-lg font-bold letter-spacing-lg text-white transition-all focus:border-blue-500 focus:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500/10 tracking-[0.25em]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold transition-all hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.35)] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying Code...
                  </>
                ) : (
                  <>
                    Verify & Login
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs mt-2">
                <button
                  type="button"
                  onClick={() => setIsOtpSent(false)}
                  className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Change Email
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0 || isLoading}
                  className="text-blue-400 hover:underline disabled:text-zinc-500 disabled:no-underline transition-all"
                >
                  {countdown > 0 ? `Resend Code (${countdown}s)` : "Resend Code"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="relative my-8 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <span className="relative bg-zinc-950 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Or Sign In with
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleOAuth("google")}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/30 text-xs font-semibold tracking-wide transition-all hover:bg-zinc-850"
          >
            Google
          </button>
          <button
            onClick={() => handleOAuth("github")}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/30 text-xs font-semibold tracking-wide transition-all hover:bg-zinc-850"
          >
            GitHub
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
