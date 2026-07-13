"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/client";
import { toast } from "react-hot-toast";
import { Loader2, ArrowRight, Lock, Eye, EyeOff, AlertCircle, ChevronLeft } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (token && email) {
      supabase.auth.verifyOtp({
        email,
        token,
        type: "recovery",
      }).then(({ data, error }) => {
        if (error) {
          console.error("Recovery token verification failed:", error.message);
          toast.error("The recovery link is invalid or has expired.");
          setHasSession(false);
        } else {
          setHasSession(true);
        }
        setIsChecking(false);
      });
      return;
    }

    const hasHashToken = typeof window !== "undefined" && window.location.hash.includes("access_token=");
    if (hasHashToken) {
      setHasSession(true);
      setIsChecking(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setHasSession(true);
      } else {
        setHasSession(false);
      }
      setIsChecking(false);
    });
  }, [token, email, supabase]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw new Error(error.message);
      }

      await supabase.auth.signOut();

      toast.success("Password has been reset successfully! Please log in with your new password.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password. The reset link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="mx-auto w-full max-w-[360px] flex flex-col items-center justify-center my-auto py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Verifying recovery credentials...</p>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="mx-auto w-full max-w-[360px] flex flex-col gap-7 my-auto text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertCircle className="w-8 h-8" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Invalid Recovery Session
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Your reset password link has expired or is invalid. Please request a new recovery link from the Forgot Password page.
          </p>
        </div>

        <Link
          href="/forgot-password"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-sm cursor-pointer"
        >
          Request New Link
          <ArrowRight className="w-4 h-4 text-white" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[360px] flex flex-col gap-7 my-auto">
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Create New Password</h1>
        <p className="text-xs text-zinc-450 font-medium">
          Choose a secure, strong password containing at least 6 characters.
        </p>
      </div>

      <form onSubmit={handleResetPassword} className="flex flex-col gap-4.5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-sans">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/20 pl-11 pr-11 py-3 text-sm text-white transition-all focus:border-blue-500 focus:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-550 hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-sans">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/20 pl-11 pr-11 py-3 text-sm text-white transition-all focus:border-blue-500 focus:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-550 hover:text-white transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer mt-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : (
            <>
              Update Password
              <ArrowRight className="h-4 w-4 text-white" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
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

        <Suspense fallback={
          <div className="mx-auto w-full max-w-[360px] flex items-center justify-center my-auto">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
            <span className="text-zinc-500 text-sm font-medium">Loading reset handler...</span>
          </div>
        }>
          <ResetPasswordContent />
        </Suspense>

        <div className="flex items-center gap-1.5 text-[10px] text-zinc-550 font-semibold justify-center mt-12 border-t border-zinc-900/60 pt-4">
          <span>Secure authentication via Supabase SSR</span>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[55%] bg-zinc-900 border-l border-zinc-900 relative items-center justify-center p-16 select-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-[480px] flex flex-col gap-6 relative z-10 text-left">
          <h3 className="text-3xl font-extrabold tracking-tight leading-tight text-white mt-8">
            Define your new credentials.
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Set a new password for your personal workspace. Once saved, you can log in securely and resume editing your resumes.
          </p>
        </div>
      </div>
    </div>
  );
}
