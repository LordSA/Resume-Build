"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/client";
import { toast } from "react-hot-toast";
import { 
  ArrowLeft, 
  Loader2, 
  CheckCircle, 
  Sparkles, 
  Wand2, 
  LayoutTemplate, 
  Layers, 
  Check, 
  Lightbulb,
  Upload,
  FileText,
  Eye,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SAMPLE_RESUME_DATA, TEMPLATE_SHOWCASE_LIST } from "@/constants/sampleData";
import { extractTextFromFile } from "@/lib/documentParser";

const LOADING_STEPS = [
  "Analyzing raw career details...",
  "Extracting candidate contact and profile data...",
  "Formatting employment history and duties...",
  "Optimizing project details and technology tags...",
  "Structuring skill sets and categorizing proficiencies...",
  "Applying professional ATS formatting and action verbs...",
  "Finalizing structured resume layout...",
];

const SAMPLE_PROMPT = `Hi, I'm Alex Rivera. I worked at Netflix for 2 years as a Cloud Developer. I designed microservice logging systems in Go, TypeScript, and AWS, boosting throughput by 40%. Previously, I finished my BS in Computer Science at UC Berkeley where I was a TA. My core skills are React, Next.js, Node.js, Python, Docker, and PostgreSQL.`;

function CreateResumeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const initialMode = (searchParams.get("mode") as "ai" | "template" | "upload") || "ai";
  const initialTemplate = searchParams.get("template") || (searchParams.get("ats") === "true" ? "ats" : "modern");

  const [mode, setMode] = useState<"ai" | "template" | "upload">(initialMode);
  const [title, setTitle] = useState("");
  const [candidateInfo, setCandidateInfo] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    const qMode = searchParams.get("mode");
    if (qMode === "template" || qMode === "ai" || qMode === "upload") {
      setMode(qMode);
    }
    const qTmpl = searchParams.get("template");
    if (qTmpl) {
      setSelectedTemplate(qTmpl);
    }
  }, [searchParams]);

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

  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!candidateInfo.trim()) {
      toast.error("Please enter your career information or history");
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
          title: title.trim() || "My AI Resume",
          template: selectedTemplate,
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

  const handleCreateFromTemplate = async (templateId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to create resumes");
        router.push("/login");
        return;
      }

      const tmplMeta = TEMPLATE_SHOWCASE_LIST.find((t) => t.id === templateId) || TEMPLATE_SHOWCASE_LIST[0];
      const customTitle = title.trim() || `${tmplMeta.name} Resume`;

      const { data: newResume, error: dbError } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          title: customTitle,
          template: templateId,
          resume_json: SAMPLE_RESUME_DATA,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast.success(`Created ${tmplMeta.name} resume!`);
      router.push(`/editor/${newResume.id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create resume");
    }
  };

  const handleUploadImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Extracting document text...");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to import resumes");
        router.push("/login");
        return;
      }

      const text = await extractTextFromFile(uploadFile);
      if (!text || text.length < 20) {
        throw new Error("Could not extract readable text. Ensure your PDF has selectable text.");
      }

      setUploadStatus("AI structuring resume data into layout...");

      const res = await fetch("/api/resume/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          title: title.trim() || uploadFile.name.replace(/\.[^/.]+$/, ""),
          template: selectedTemplate
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to import resume");
      }

      const data = await res.json();
      toast.success("Resume imported successfully!");
      router.push(`/editor/${data.id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to import resume");
      setIsUploading(false);
      setUploadStatus("");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f17] text-zinc-100 font-sans flex flex-col selection:bg-blue-600/30 overflow-x-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/5 blur-[150px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-6 text-center select-none z-10 my-auto"
          >
            <div className="relative flex flex-col items-center max-w-md w-full">
              <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
                <div className="absolute inset-0 rounded-3xl border border-blue-500/20 bg-blue-500/10 animate-pulse" />
                <div className="absolute inset-2 rounded-2xl border border-blue-500/40 bg-blue-500/15 animate-spin [animation-duration:12s]" />
                <Sparkles className="h-10 w-10 text-blue-400 animate-pulse" />
              </div>

              <h2 className="text-2xl font-black tracking-tight text-white mb-2">
                Structuring Resume with AI
              </h2>
              
              <div className="w-full bg-[#12141f] border border-[#23273a] rounded-3xl p-6 min-h-[160px] flex flex-col justify-center items-center backdrop-blur-xl shadow-2xl">
                <Loader2 className="h-6 w-6 text-blue-400 animate-spin mb-4" />
                <p className="text-zinc-200 font-semibold text-xs sm:text-sm leading-relaxed transition-all duration-500">
                  {LOADING_STEPS[loadingStepIdx]}
                </p>
                
                <div className="w-full bg-[#181b28] h-2 rounded-full mt-6 overflow-hidden border border-[#262a3d]">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${((loadingStepIdx + 1) / LOADING_STEPS.length) * 100}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center w-full mt-2.5 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  <span>Step {loadingStepIdx + 1} of {LOADING_STEPS.length}</span>
                  <span>{Math.round(((loadingStepIdx + 1) / LOADING_STEPS.length) * 100)}%</span>
                </div>
              </div>

              <p className="mt-6 text-xs text-zinc-400 max-w-xs leading-relaxed">
                Extracting entities, standardizing categories, and generating ATS action verbs.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="editor-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 flex flex-col z-10"
          >
            <header className="border-b border-[#1f2333] bg-[#12141f]/80 backdrop-blur-xl shrink-0">
              <div className="mx-auto max-w-6xl px-6 py-3.5 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#262a3d] bg-[#181b28] hover:bg-[#202436] text-zinc-400 hover:text-white transition-all shadow-sm"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                  <div className="flex items-center gap-2">
                    <img
                      src="/nv.svg"
                      alt="Resume Solutions"
                      className="h-6 w-auto"
                    />
                  </div>
                </div>

                <div className="flex items-center p-1 bg-[#181b28] border border-[#262a3d] rounded-xl shadow-inner">
                  <button
                    onClick={() => setMode("ai")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mode === "ai"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    <span>AI Generator</span>
                  </button>
                  <button
                    onClick={() => setMode("upload")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mode === "upload"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload & Edit CV</span>
                  </button>
                  <button
                    onClick={() => setMode("template")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mode === "template"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <LayoutTemplate className="h-3.5 w-3.5" />
                    <span>Template Library</span>
                  </button>
                </div>
              </div>
            </header>

            <main className="flex-1 mx-auto max-w-6xl w-full px-6 py-8 flex flex-col">
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {mode === "ai" && "AI Resume Builder"}
                  {mode === "upload" && "Upload Existing Resume to Edit"}
                  {mode === "template" && "Template Gallery Showcase"}
                </h1>
                <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
                  {mode === "ai" && "Paste your raw experience, LinkedIn bio, or career notes in plain text. The AI will extract and structure an ATS-friendly resume."}
                  {mode === "upload" && "Upload your old or current resume (PDF, Word, TXT). We'll parse it and open it in the Studio Editor with full freedom to customize."}
                  {mode === "template" && "Select from our 4 designer templates with live candidate data. Click any template to scaffold a new resume ready for editing."}
                </p>
              </div>

              {mode === "template" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {TEMPLATE_SHOWCASE_LIST.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      className={`p-6 rounded-3xl border bg-gradient-to-br ${tmpl.colorTheme} flex flex-col justify-between gap-5 shadow-xl transition-all hover:translate-y-[-2px]`}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-white">{tmpl.name}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20">
                              {tmpl.badge}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-300 leading-relaxed">{tmpl.description}</p>

                        <div className="p-4 rounded-2xl bg-white/95 text-zinc-900 shadow-lg flex flex-col gap-2 pointer-events-none">
                          <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                            <div>
                              <div className="text-xs font-black text-zinc-900">Alex Rivera</div>
                              <div className="text-[10px] font-semibold text-blue-600">Senior Full Stack Engineer</div>
                            </div>
                            <div className="text-[9px] text-zinc-500 text-right">
                              San Francisco, CA<br />alex.rivera@example.com
                            </div>
                          </div>

                          <div className="flex flex-col gap-1 text-[9px] text-zinc-700">
                            <div className="font-bold text-zinc-900">Experience</div>
                            <div className="flex justify-between font-semibold">
                              <span>Lead Engineer · Vanguard Tech Cloud</span>
                              <span className="text-zinc-500">2022 - Present</span>
                            </div>
                            <div className="text-zinc-600 line-clamp-2">
                              • Spearheaded migration to GraphQL federation serving 12M users.<br />
                              • Reduced API latency by 45% using distributed caching.
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {tmpl.features.map((feat, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-lg bg-black/20 text-[10px] text-zinc-300 font-medium border border-white/10">
                              ✓ {feat}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleCreateFromTemplate(tmpl.id)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 cursor-pointer"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Use This Template</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : mode === "upload" ? (
                <div className="max-w-2xl mx-auto w-full p-6 sm:p-8 rounded-3xl border border-[#262a3d] bg-[#12141f] shadow-2xl flex flex-col gap-6">
                  <form onSubmit={handleUploadImport} className="flex flex-col gap-5">
                    <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#262a3d] hover:border-cyan-500/50 rounded-2xl bg-[#10121c] cursor-pointer transition-all">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mb-3">
                        <Upload className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-bold text-white text-center">
                        {uploadFile ? uploadFile.name : "Choose PDF, DOCX, or TXT Resume"}
                      </span>
                      <span className="text-xs text-zinc-400 mt-1 text-center">
                        Supports standard resumes up to 10MB
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setUploadFile(f);
                            if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
                            toast.success(`Selected ${f.name}`);
                          }
                        }}
                        className="hidden"
                      />
                    </label>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Resume Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Imported Full Stack Resume"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-xl border border-[#262a3e] bg-[#10121c] px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Target Layout Template</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {TEMPLATE_SHOWCASE_LIST.map((tmpl) => (
                          <button
                            key={tmpl.id}
                            type="button"
                            onClick={() => setSelectedTemplate(tmpl.id)}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              selectedTemplate === tmpl.id
                                ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
                                : "bg-[#181b28] border-[#262a3d] text-zinc-400 hover:text-white"
                            }`}
                          >
                            {tmpl.name.split(" ")[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isUploading || !uploadFile}
                      className="mt-2 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/30 cursor-pointer disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>{uploadStatus || "Parsing Resume..."}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>Parse & Open in Studio Editor</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 flex flex-col gap-6">
                    <form onSubmit={handleGenerateAI} className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          Resume Title
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Senior Frontend Developer - Google Application"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full rounded-xl border border-[#262a3e] bg-[#10121c] px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                            Paste Career Info, Bio, or LinkedIn Profile
                          </label>
                          <button
                            type="button"
                            onClick={() => setCandidateInfo(SAMPLE_PROMPT)}
                            className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Lightbulb className="h-3 w-3" />
                            <span>Insert Sample Text</span>
                          </button>
                        </div>
                        <textarea
                          placeholder="e.g. Hi, I'm Alex. I worked at Netflix for 2 years as a Cloud Developer. I designed microservice logging systems in Go, TypeScript, and AWS, boosting throughput by 40%. Previously, I finished my BS in Computer Science at UCLA..."
                          value={candidateInfo}
                          onChange={(e) => setCandidateInfo(e.target.value)}
                          rows={11}
                          className="w-full rounded-2xl border border-[#262a3e] bg-[#10121c] px-4 py-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-sans leading-relaxed resize-none shadow-inner transition-all"
                          required
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                          <span>Structured JSON & ATS optimization</span>
                        </span>
                        <button
                          type="submit"
                          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 text-xs font-bold tracking-wide transition-all shadow-lg shadow-blue-600/25 cursor-pointer"
                        >
                          <Wand2 className="h-4 w-4" />
                          <span>Generate Resume</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="p-5 rounded-2xl border border-[#212435] bg-[#12141f] flex flex-col gap-3.5 shadow-sm">
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs border-b border-[#1f2333] pb-2.5">
                        <Layers className="h-4 w-4" />
                        <span>Target Template</span>
                      </div>

                      <div className="flex flex-col gap-2">
                        {TEMPLATE_SHOWCASE_LIST.map((tmpl) => (
                          <button
                            key={tmpl.id}
                            type="button"
                            onClick={() => setSelectedTemplate(tmpl.id)}
                            className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              selectedTemplate === tmpl.id
                                ? "bg-blue-600/15 border-blue-500/40 text-white"
                                : "bg-[#181b28] border-[#262a3d] text-zinc-400 hover:text-white"
                            }`}
                          >
                            <div className="flex flex-col">
                              <span className="text-xs font-bold">{tmpl.name}</span>
                              <span className="text-[10px] text-zinc-400">{tmpl.tagline}</span>
                            </div>
                            {selectedTemplate === tmpl.id && (
                              <Check className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-[#212435] bg-[#12141f] flex flex-col gap-2 shadow-sm">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                        <span>Pro Tips</span>
                      </span>
                      <ul className="text-[11px] text-zinc-400 flex flex-col gap-1.5 list-disc pl-4 leading-relaxed">
                        <li>Include metrics and percentages (e.g. <em>boosted performance by 40%</em>).</li>
                        <li>Highlight key tools, programming languages, and frameworks.</li>
                        <li>You can edit every section and reorder in the workspace editor afterwards.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CreateResumePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d0f17] flex items-center justify-center text-white">
        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
      </div>
    }>
      <CreateResumeContent />
    </Suspense>
  );
}
