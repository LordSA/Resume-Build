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
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <textarea
          value={resumeData.summary}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="Results-driven software engineer with 5+ years of experience in modern full-stack development..."
          rows={6}
          className="w-full rounded-2xl border border-[#262a3e] bg-[#10121c] px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-sans leading-relaxed resize-none shadow-inner"
        />
      </div>

      <div className="border border-[#23273a] bg-[#161824] rounded-2xl p-3.5 flex flex-col gap-3 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">AI Optimization Mode</label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: "improve", label: "Professionalize" },
              { id: "ats", label: "ATS Friendly" },
              { id: "shorten", label: "Concise" },
              { id: "expand", label: "Expand Impact" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRewriteType(opt.id as any)}
                className={`py-1.5 px-2.5 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                  rewriteType === opt.id
                    ? "bg-blue-600/20 border-blue-500/40 text-blue-400 shadow-sm"
                    : "bg-[#12141f] border-[#262a3e] hover:bg-[#1a1c2b] text-zinc-400"
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
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-blue-600/20"
        >
          {isAILoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Optimizing with AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              <span>Optimize Summary</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
