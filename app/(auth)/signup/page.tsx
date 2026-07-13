"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/client";
import { toast } from "react-hot-toast";
import { Loader2, ArrowRight, Mail, ChevronLeft, ShieldCheck, Lock, User } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please enter your name and email address");
      return;
    }

    setIsLoading(true);
    try {
      const passwordToUse = password || Math.random().toString(36).slice(-10) + "A1!";
      if (password && password.length < 6) {
        toast.error("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password: passwordToUse,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/verified`,
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else if (data.user) {
        toast.success("Confirmation link sent to your email!");
        router.push(`/verify?email=${encodeURIComponent(email)}&id=${data.user.id}`);
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || "Failed to sign up with Google");
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

        <div className="mx-auto w-full max-w-[360px] flex flex-col gap-7 my-auto">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Create an account</h2>
            <p className="text-xs text-zinc-450 font-medium mt-1">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 hover:underline font-bold">
                Log In
              </Link>
            </p>
          </div>

          <button
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-white text-zinc-900 text-sm font-bold transition-all hover:bg-zinc-100 shadow-sm cursor-pointer disabled:opacity-50"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            Google
          </button>

          <div className="relative flex items-center justify-center py-1.5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-900"></div>
            </div>
            <span className="relative bg-zinc-950 px-4 text-[10px] font-bold text-zinc-550 uppercase tracking-widest">
              Or with email
            </span>
          </div>

          <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-sans">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/20 pl-11 pr-4 py-3 text-sm text-white transition-all focus:border-blue-500 focus:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                  required
                />
              </div>
            </div>

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

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-sans">
                Create Password (Optional)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/20 pl-11 pr-4 py-3 text-sm text-white transition-all focus:border-blue-500 focus:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
              <span className="text-[9px] text-zinc-550 font-medium">Leave blank to use passwordless magic link signup instead.</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  Creating account...
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="h-4 w-4 text-white" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-zinc-550 font-semibold justify-center mt-12 border-t border-zinc-900/60 pt-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Secure authentication via Supabase SSR</span>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-[55%] bg-zinc-900 border-l border-zinc-900 relative items-center justify-center p-16 select-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-[480px] flex flex-col gap-6 relative z-10">
          <h3 className="text-3xl font-extrabold tracking-tight leading-tight text-white mt-8">
            Start structuring your resume.
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Join other professionals building clean, print-perfect documents instantly. Stored securely and optimized for major corporate ATS scanners.
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
