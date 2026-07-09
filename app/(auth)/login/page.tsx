// app/(auth)/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/client";
import { toast } from "react-hot-toast";
import { Loader2, ArrowRight, ArrowLeft, Mail, ChevronLeft } from "lucide-react";
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

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#001e2b] px-6 text-white selection:bg-[#00ed64]/30 font-sans relative">
      
      {/* Top Left Navigation Back Button */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-800 bg-[#002e3b] text-xs font-semibold text-zinc-300 hover:text-white hover:border-[#00ed64]/40 hover:bg-[#003848] transition-all cursor-pointer shadow-sm"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-[440px] rounded-2xl border border-zinc-800/80 bg-[#002e3e]/40 p-8 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col gap-6">
        
        {/* Logo and Brand Header */}
        <div className="flex flex-col gap-2 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg className="h-8 w-8 text-[#00ed64]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V7h10v2zm0 8H7v-2h10v2z"/>
            </svg>
            <span className="font-extrabold tracking-tight text-xl text-white">Resume Solutions</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Log In</h2>
          <p className="text-xs text-zinc-400">
            {isOtpSent ? "Enter the verification code sent to your email" : "Access your workspace via passwordless email OTP"}
          </p>
        </div>

        {/* Primary OAuth Method (Google at Top) */}
        {!isOtpSent && (
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-white text-zinc-900 text-sm font-bold transition-all hover:bg-zinc-100 shadow-sm cursor-pointer disabled:opacity-50"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        )}

        {!isOtpSent && (
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <span className="relative bg-[#001e2b] px-4 text-[10px] font-bold text-zinc-550 uppercase tracking-widest">
              Or Login with Email
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isOtpSent ? (
            <motion.form
              key="email-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSendOTP}
              className="flex flex-col gap-4"
            >
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
                    className="w-full rounded-xl border border-zinc-800 bg-[#001c27] pl-11 pr-4 py-3 text-sm text-white transition-all focus:border-[#00ed64] focus:bg-[#001e2b] focus:outline-none focus:ring-2 focus:ring-[#00ed64]/10"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00ed64] hover:bg-[#00d75a] text-zinc-950 text-sm font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    Send Login Code
                    <ArrowRight className="h-4 w-4 text-zinc-950" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="otp-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleVerifyOTP}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-sans">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-xl border border-zinc-800 bg-[#001c27] px-4 py-3 text-center text-lg font-bold letter-spacing-lg text-white transition-all focus:border-[#00ed64] focus:bg-[#001e2b] focus:outline-none focus:ring-2 focus:ring-[#00ed64]/10 tracking-[0.25em]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00ed64] hover:bg-[#00d75a] text-zinc-950 text-sm font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                    Verifying Code...
                  </>
                ) : (
                  <>
                    Verify & Login
                    <ArrowRight className="h-4 w-4 text-zinc-950" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs mt-2">
                <button
                  type="button"
                  onClick={() => setIsOtpSent(false)}
                  className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Change Email
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0 || isLoading}
                  className="text-[#00ed64] hover:underline disabled:text-zinc-500 disabled:no-underline transition-all cursor-pointer font-semibold"
                >
                  {countdown > 0 ? `Resend Code (${countdown}s)` : "Resend Code"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-zinc-450 mt-2">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-[#00ed64] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
