// components/editor/panels/AIPanel.tsx
"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { useEditorStore } from "@/store/editorStore";
import { toast } from "react-hot-toast";
import { Gauge, Loader2, Award, CheckCircle, AlertTriangle } from "lucide-react";

interface ATSAnalysis {
  score: number;
  missingKeywords: string[];
  suggestedSkills: string[];
  summaryImprovements: string;
  overallFeedback: string;
}

export default function AIPanel() {
  const { resumeData } = useResumeStore();
  const { isAILoading, setIsAILoading } = useEditorStore();
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);

  if (!resumeData) return null;

  const handleCheckATS = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description first");
      return;
    }

    setIsAILoading(true);
    try {
      const response = await fetch("/api/ai/ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeJson: resumeData,
          jobDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze ATS");
      }

      const result = await response.json();
      setAnalysis(result);
      toast.success("ATS Analysis completed!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to analyze resume");
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-lg font-bold">ATS Compatibility Analyzer</h3>
        <p className="text-xs text-zinc-400 mt-0.5">Test your resume compatibility against a target job listing</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-sans">Paste Job Description</label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the requirements, qualifications, and role description of the target job here..."
          rows={6}
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-sans leading-relaxed resize-none"
        />
        <button
          type="button"
          onClick={handleCheckATS}
          disabled={isAILoading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition-all disabled:opacity-50 mt-1 cursor-pointer"
        >
          {isAILoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing Match Rate...
            </>
          ) : (
            <>
              <Gauge className="h-4 w-4" />
              Calculate ATS Match
            </>
          )}
        </button>
      </div>

      {analysis && (
        <div className="flex flex-col gap-4 border-t border-zinc-850 pt-5 mt-2">
          <div className="flex items-center justify-between bg-zinc-900/30 border border-zinc-850 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">ATS Score</h4>
                <p className="text-2xl font-black text-white">{analysis.score}%</p>
              </div>
            </div>
            
            <div className="text-xs font-bold px-3 py-1.5 rounded-xl border bg-zinc-900/50">
              {analysis.score >= 80 ? (
                <span className="text-emerald-400">Excellent Match</span>
              ) : analysis.score >= 50 ? (
                <span className="text-amber-400">Medium Match</span>
              ) : (
                <span className="text-red-400">Needs Work</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              Missing Key Terms
            </h4>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {analysis.missingKeywords.length === 0 ? (
                <span className="text-xs text-zinc-500">None detected! Excellent coverage.</span>
              ) : (
                analysis.missingKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-red-500/10 bg-red-500/5 text-red-400"
                  >
                    {kw}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-blue-500" />
              Suggested Skill Listings
            </h4>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {analysis.suggestedSkills.length === 0 ? (
                <span className="text-xs text-zinc-500">None suggested.</span>
              ) : (
                analysis.suggestedSkills.map((sk, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-blue-500/15 bg-blue-500/5 text-blue-400"
                  >
                    {sk}
                  </span>
                ))
              )}
            </div>
          </div>

          {analysis.summaryImprovements && (
            <div className="flex flex-col gap-1">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Summary Optimization Suggestions</h4>
              <p className="text-xs text-zinc-300 leading-relaxed mt-1 bg-zinc-900/10 border border-zinc-850 p-3.5 rounded-xl font-sans">
                {analysis.summaryImprovements}
              </p>
            </div>
          )}

          {analysis.overallFeedback && (
            <div className="flex flex-col gap-1">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Overall Feedback</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1 bg-zinc-900/10 border border-zinc-850 p-3.5 rounded-xl font-sans">
                {analysis.overallFeedback}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
