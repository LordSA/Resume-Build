"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { useEditorStore } from "@/store/editorStore";
import { toast } from "react-hot-toast";
import { Sparkles, Loader2 } from "lucide-react";

export default function SummaryPanel() {
  const { resumeData, updateSummary } = useResumeStore();
  const { isAILoading, setIsAILoading } = useEditorStore();
  const [rewriteType, setRewriteType] = useState<"improve" | "shorten" | "expand" | "ats">("improve");

  if (!resumeData) return null;

  const handleAIRewrite = async () => {
    if (!resumeData.summary.trim()) {
      toast.error("Please enter some summary text first");
      return;
    }

    setIsAILoading(true);
    try {
      const response = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: resumeData.summary,
          instruction: rewriteType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to rewrite");
      }

      const { rewritten } = await response.json();
      updateSummary(rewritten);
      toast.success("Summary optimized successfully!");
    } catch (err: any) {
      console.error("Rewrite error:", err);
      toast.error(err.message || "Failed to optimize summary");
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-bold">Professional Summary</h3>
        <p className="text-xs text-zinc-400 mt-0.5">Write a brief overview of your skills and career highlights</p>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <textarea
          value={resumeData.summary}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="Results-driven software engineer with 5+ years of experience..."
          rows={10}
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-sans leading-relaxed resize-none"
        />
      </div>

      <div className="border border-zinc-850 bg-zinc-900/10 rounded-2xl p-4 flex flex-col gap-4 mt-1">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Optimization Mode</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "improve", label: "Professionalize" },
              { id: "ats", label: "Make ATS Friendly" },
              { id: "shorten", label: "Shorten" },
              { id: "expand", label: "Expand" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRewriteType(opt.id as any)}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                  rewriteType === opt.id
                    ? "bg-blue-600/15 border-blue-500/40 text-blue-400"
                    : "bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800 text-zinc-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAIRewrite}
          disabled={isAILoading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer"
        >
          {isAILoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Optimizing Summary...
            </>
          ) : (
            <>
              Optimize Summary
            </>
          )}
        </button>
      </div>
    </div>
  );
}
