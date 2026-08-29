"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { 
  X, 
  Sparkles, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Percent, 
  Target, 
  Check, 
  Search
} from "lucide-react";
import { extractTextFromFile } from "@/lib/documentParser";

interface AtsMatchCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumes: Array<{ id: string; title: string; template: string }>;
}

export default function AtsMatchCheckerModal({ isOpen, onClose, resumes }: AtsMatchCheckerModalProps) {
  const router = useRouter();
  const [sourceType, setSourceType] = useState<"existing" | "upload" | "paste">("existing");
  const [selectedResumeId, setSelectedResumeId] = useState<string>(resumes[0]?.id || "");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast.success(`Loaded ${file.name}`);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobDescription.trim()) {
      toast.error("Please provide a job description or key requirements");
      return;
    }

    setIsAnalyzing(true);
    setEvaluation(null);

    try {
      let candidateContent = "";

      if (sourceType === "existing") {
        if (!selectedResumeId) {
          toast.error("Please select a resume");
          setIsAnalyzing(false);
          return;
        }
        candidateContent = `Resume ID: ${selectedResumeId}`;
      } else if (sourceType === "upload") {
        if (!uploadedFile) {
          toast.error("Please upload a resume file");
          setIsAnalyzing(false);
          return;
        }
        candidateContent = await extractTextFromFile(uploadedFile);
      } else {
        if (!pastedText.trim()) {
          toast.error("Please paste your resume content");
          setIsAnalyzing(false);
          return;
        }
        candidateContent = pastedText;
      }

      const res = await fetch("/api/ai/ats-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: candidateContent,
          jobTitle,
          jobDescription
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to analyze match");
      }

      const data = await res.json();
      setEvaluation(data.evaluation);
      toast.success("ATS Match analysis completed!");
    } catch (err: any) {
      toast.error(err.message || "Failed to analyze ATS match");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimizeInStudio = () => {
    if (selectedResumeId) {
      router.push(`/editor/${selectedResumeId}`);
    } else {
      router.push("/create?mode=ai&ats=true");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-[#262a3d] bg-[#12141f] shadow-2xl p-6 sm:p-7 flex flex-col gap-5 my-8 text-zinc-100">
        
        <div className="flex items-center justify-between border-b border-[#1f2333] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">ATS Match Checker</h3>
              <p className="text-xs text-zinc-400">Evaluate your resume fit against job descriptions</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#181b28] transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!evaluation ? (
          <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
            <div className="flex items-center p-1 bg-[#181b28] border border-[#262a3d] rounded-xl">
              <button
                type="button"
                onClick={() => setSourceType("existing")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  sourceType === "existing"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Saved Resumes
              </button>
              <button
                type="button"
                onClick={() => setSourceType("upload")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  sourceType === "upload"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Upload CV (PDF/Doc)
              </button>
              <button
                type="button"
                onClick={() => setSourceType("paste")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  sourceType === "paste"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Paste Text
              </button>
            </div>

            {sourceType === "existing" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Select Resume</label>
                {resumes.length > 0 ? (
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.template})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-amber-400/90 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                    No saved resumes found. Switch to Upload CV or Paste Text.
                  </p>
                )}
              </div>
            )}

            {sourceType === "upload" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Upload Resume / CV File</label>
                <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#262a3d] hover:border-purple-500/50 rounded-2xl bg-[#10121c] cursor-pointer transition-all">
                  <Upload className="h-6 w-6 text-purple-400 mb-2" />
                  <span className="text-xs font-bold text-white">
                    {uploadedFile ? uploadedFile.name : "Choose PDF, DOCX, or TXT file"}
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">Drag and drop or browse from device</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {sourceType === "paste" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Paste Resume Text</label>
                <textarea
                  rows={4}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your current resume bullet points, skills, and summary here..."
                  className="w-full rounded-xl border border-[#262a3e] bg-[#10121c] p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Target Role / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#262a3e] bg-[#10121c] px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Job Description / Requirements</label>
                <textarea
                  rows={2}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste target job qualifications, keywords, or duties..."
                  className="w-full rounded-xl border border-[#262a3e] bg-[#10121c] px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30 cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Scanning ATS Score & Keywords...</span>
                </>
              ) : (
                <>
                  <Target className="h-4 w-4" />
                  <span>Run ATS Match Analysis</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="p-4 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-[#181a28] to-[#12141f] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-300 font-black text-xl">
                  {evaluation.overallScore}%
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Overall Match Level</span>
                  <h4 className="text-lg font-black text-white">{evaluation.rating}</h4>
                  <p className="text-[11px] text-zinc-300 max-w-sm mt-0.5">{evaluation.summaryCritique}</p>
                </div>
              </div>

              <div className="hidden sm:flex flex-col gap-1 text-right">
                <span className="text-[10px] text-zinc-400">Action Verbs: {evaluation.actionVerbScore}%</span>
                <span className="text-[10px] text-zinc-400">Quantifiable Metrics: {evaluation.quantifiableMetricScore}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-[#101915] flex flex-col gap-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  <span>Matched Keywords ({evaluation.keywordMatches?.length || 0})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {evaluation.keywordMatches?.map((kw: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-semibold text-emerald-300">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-500/20 bg-[#1c1813] flex flex-col gap-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Missing Keywords ({evaluation.missingKeywords?.length || 0})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {evaluation.missingKeywords?.map((kw: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-[10px] font-semibold text-amber-300">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#23273a] bg-[#161824] flex flex-col gap-2">
              <span className="text-xs font-bold text-white">Recommended Improvements:</span>
              <ul className="text-[11px] text-zinc-300 flex flex-col gap-1 list-disc pl-4">
                {evaluation.improvements?.map((imp: string, i: number) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEvaluation(null)}
                className="px-4 py-2.5 rounded-xl border border-[#262a3d] bg-[#181b28] text-xs font-bold text-zinc-300 hover:text-white"
              >
                Test Another Job
              </button>

              <button
                type="button"
                onClick={handleOptimizeInStudio}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30 cursor-pointer"
              >
                <span>Optimize in Studio Editor</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
