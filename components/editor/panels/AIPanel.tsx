"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { useEditorStore } from "@/store/editorStore";
import { toast } from "react-hot-toast";
import { Target, Loader2, CheckCircle2, AlertCircle, BarChart3 } from "lucide-react";

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
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-bold text-white">ATS Keyword Match</h3>
        <p className="text-xs text-zinc-400 mt-0.5">Compare your resume against a target job posting</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-sans">Target Job Description</label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste requirements, qualifications, and role responsibilities..."
          rows={6}
          className="w-full rounded-2xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-sans leading-relaxed resize-none shadow-inner"
        />
        <button
          type="button"
          onClick={handleCheckATS}
          disabled={isAILoading}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all disabled:opacity-50 mt-1 cursor-pointer shadow-md shadow-blue-600/20"
        >
          {isAILoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing Match Rate...</span>
            </>
          ) : (
            <>
              <BarChart3 className="h-4 w-4" />
              <span>Analyze Match Score</span>
            </>
          )}
        </button>
      </div>

      {analysis && (
        <div className="flex flex-col gap-3.5 border-t border-[#212435] pt-4 mt-1">
          <div className="flex items-center justify-between bg-[#161824] border border-[#212435] rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/15 text-blue-400 border border-blue-500/25">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Match Score</h4>
                <p className="text-xl font-black text-white">{analysis.score}%</p>
              </div>
            </div>
            
            <div className="text-xs font-bold px-3 py-1 rounded-xl border bg-[#10121c] border-[#262a3e]">
              {analysis.score >= 80 ? (
                <span className="text-emerald-400">High Match</span>
              ) : analysis.score >= 50 ? (
                <span className="text-amber-400">Moderate Match</span>
              ) : (
                <span className="text-rose-400">Needs Calibration</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
              Missing Keywords
            </h4>
            <div className="flex flex-wrap gap-1.5 mt-0.5">
              {analysis.missingKeywords.length === 0 ? (
                <span className="text-xs text-zinc-500">None detected! All major role keywords are covered.</span>
              ) : (
                analysis.missingKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-2.5 py-0.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-300"
                  >
                    {kw}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
              Recommended Skills
            </h4>
            <div className="flex flex-wrap gap-1.5 mt-0.5">
              {analysis.suggestedSkills.length === 0 ? (
                <span className="text-xs text-zinc-500">No additional skills needed.</span>
              ) : (
                analysis.suggestedSkills.map((sk, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-2.5 py-0.5 rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-300"
                  >
                    {sk}
                  </span>
                ))
              )}
            </div>
          </div>

          {analysis.summaryImprovements && (
            <div className="flex flex-col gap-1">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Suggested Summary Refinements</h4>
              <p className="text-xs text-zinc-300 leading-relaxed mt-0.5 bg-[#161824] border border-[#212435] p-3 rounded-xl font-sans">
                {analysis.summaryImprovements}
              </p>
            </div>
          )}

          {analysis.overallFeedback && (
            <div className="flex flex-col gap-1">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Recruiter Feedback</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mt-0.5 bg-[#161824] border border-[#212435] p-3 rounded-xl font-sans">
                {analysis.overallFeedback}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
