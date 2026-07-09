"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { toast } from "react-hot-toast";
import { ArrowLeft, Loader2, CheckCircle, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_STEPS = [
  "Analyzing raw text details...",
  "Extracting candidate contact and profile data...",
  "Formatting experience history and duties...",
  "Optimizing project details and technology tags...",
  "Structuring skill sets and categorizing categories...",
  "Applying professional ATS formatting and verbs...",
  "Finalizing structured resume layout...",
];

export default function CreateResumePage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [candidateInfo, setCandidateInfo] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 3000);
    } else {
      setLoadingStepIdx(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!candidateInfo.trim()) {
      toast.error("Please enter your career information");
      return;
    }

    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to create resumes");
        router.push("/login");
        return;
      }

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: candidateInfo }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Generation request failed");
      }

      const { resume } = await response.json();

      const { data: newResume, error: dbError } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          title: title.trim() || "My Resume",
          resume_json: resume,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast.success("Resume created successfully!");
      router.push(`/editor/${newResume.id}`);
    } catch (err: any) {
      console.error("Generation error:", err);
      toast.error(err.message || "An error occurred during resume generation");
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col selection:bg-blue-600/30 overflow-x-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-6 text-center select-none z-10"
          >
            <div className="relative flex flex-col items-center max-w-md w-full">
              <div className="relative mb-10 flex h-24 w-24 items-center justify-center">
                <div className="absolute inset-0 rounded-3xl border border-blue-500/20 bg-blue-500/5 animate-pulse"></div>
                <div className="absolute inset-2 rounded-2xl border border-blue-500/40 bg-blue-500/10 animate-spin [animation-duration:12s]"></div>
                <FileText className="h-10 w-10 text-blue-400 animate-pulse" />
              </div>

              <h2 className="text-2xl font-bold tracking-tight mb-3">Building Your Resume Layout</h2>
              
              <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 min-h-[140px] flex flex-col justify-center items-center backdrop-blur-md">
                <Loader2 className="h-6 w-6 text-blue-500 animate-spin mb-4" />
                <p className="text-zinc-300 font-medium text-sm leading-relaxed transition-all duration-500">
                  {LOADING_STEPS[loadingStepIdx]}
                </p>
                
                <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-6 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${((loadingStepIdx + 1) / LOADING_STEPS.length) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center w-full mt-2 text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                  <span>Step {loadingStepIdx + 1} of {LOADING_STEPS.length}</span>
                  <span>{Math.round(((loadingStepIdx + 1) / LOADING_STEPS.length) * 100)}%</span>
                </div>
              </div>

              <p className="mt-8 text-xs text-zinc-500 max-w-xs leading-relaxed">
                This might take up to a minute depending on input complexity. Please do not close or reload this page.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="editor-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col z-10"
          >
            <header className="border-b border-zinc-900 bg-zinc-900/10 backdrop-blur-md">
              <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span className="font-bold text-lg tracking-tight">Resume Solutions</span>
                </div>
              </div>
            </header>

            <main className="flex-1 mx-auto max-w-4xl w-full px-6 py-12 flex flex-col justify-center">
              <div className="max-w-2xl mb-10">
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-white via-zinc-200 to-zinc-450 bg-clip-text text-transparent">
                  Instant Resume Creation
                </h1>
                <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                  Paste your raw experience, copy-paste your LinkedIn history, or tell us about your accomplishments in plain English. The builder will structure, write, and format it perfectly for ATS parsing.
                </p>
              </div>

              <form onSubmit={handleGenerate} className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Resume Name / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer - Google Application"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/20 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Pasted Career Background & Experience
                  </label>
                  <textarea
                    placeholder="e.g. Hi, I'm Sarah. I worked at Netflix for 2 years as a Cloud Developer. I designed their microservice logging systems in Go, Node, and AWS, boosting throughput by 40%. Previously, I finished my BS in Computer Science at UCLA where I taught coding labs. I know Kubernetes, Python, Postgres..."
                    value={candidateInfo}
                    onChange={(e) => setCandidateInfo(e.target.value)}
                    rows={12}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/20 px-5 py-4 text-sm transition-all focus:border-blue-500 focus:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-blue-500/10 font-sans leading-relaxed resize-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-zinc-550 flex items-center gap-1.5 font-medium">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Standard, ATS-compatible structured output
                  </span>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] px-6 py-3.5 text-sm font-semibold transition-all"
                  >
                    <Sparkles className="h-4 w-4" />
                    Create Resume
                  </button>
                </div>
              </form>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
