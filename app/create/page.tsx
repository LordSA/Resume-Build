"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/client";
import { toast } from "react-hot-toast";
import { 
  ArrowLeft, 
  ArrowRight,
  Loader2, 
  Check, 
  Upload,
  LayoutTemplate, 
  Plus, 
  Trash2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SAMPLE_RESUME_DATA, TEMPLATE_SHOWCASE_LIST } from "@/constants/sampleData";
import { extractTextFromFile } from "@/lib/documentParser";

const LOADING_STEPS = [
  "Structuring personal and contact information...",
  "Formatting work history and quantifying achievements...",
  "Organizing education and credentials...",
  "Categorizing skills and proficiencies...",
  "Polishing ATS phrasing with impactful action verbs...",
  "Synthesizing your summary and custom highlights...",
  "Finalizing your resume for the Studio Editor...",
];

function TemplateMockCard({ templateId }: { templateId: string }) {
  if (templateId === "modern") {
    return (
      <div className="p-4 rounded-2xl bg-white text-zinc-900 shadow-xl flex flex-col gap-2.5 pointer-events-none select-none border border-zinc-200">
        <div className="border-b-2 border-blue-600 pb-2 flex justify-between items-center">
          <div>
            <div className="text-xs font-black text-blue-600">Alex Rivera</div>
            <div className="text-[10px] font-bold text-zinc-600">Senior Full Stack Engineer</div>
          </div>
          <div className="text-[8px] text-zinc-500 text-right">San Francisco, CA</div>
        </div>

        <div className="grid grid-cols-12 gap-3 text-[9px]">
          <div className="col-span-4 border-r border-zinc-200 pr-2 flex flex-col gap-2">
            <div>
              <div className="font-bold text-blue-600 text-[8.5px] uppercase">Contact</div>
              <div className="text-zinc-600 text-[8px] truncate">alex.rivera@example.com</div>
              <div className="text-zinc-600 text-[8px]">+1 555-382-9102</div>
            </div>
            <div>
              <div className="font-bold text-blue-600 text-[8.5px] uppercase">Skills</div>
              <div className="flex flex-wrap gap-1 mt-0.5">
                <span className="px-1 py-0.2 rounded bg-blue-50 text-blue-700 text-[7.5px] font-semibold">React</span>
                <span className="px-1 py-0.2 rounded bg-blue-50 text-blue-700 text-[7.5px] font-semibold">Next.js</span>
                <span className="px-1 py-0.2 rounded bg-blue-50 text-blue-700 text-[7.5px] font-semibold">TypeScript</span>
                <span className="px-1 py-0.2 rounded bg-blue-50 text-blue-700 text-[7.5px] font-semibold">Go</span>
              </div>
            </div>
          </div>

          <div className="col-span-8 flex flex-col gap-1.5">
            <div>
              <div className="font-bold text-blue-600 text-[8.5px] uppercase">Work History</div>
              <div className="flex justify-between font-bold text-[8.5px] text-zinc-800">
                <span>Lead Engineer · Vanguard Tech</span>
                <span className="text-zinc-500 font-normal">2022 – Present</span>
              </div>
              <div className="text-zinc-600 text-[8px] leading-tight mt-0.5">
                • Directed GraphQL architecture serving 12M monthly users.<br />
                • Boosted API response speed by 45% using Redis caching.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "minimal") {
    return (
      <div className="p-4 rounded-2xl bg-white text-zinc-900 shadow-xl flex flex-col gap-2 pointer-events-none select-none border border-zinc-200">
        <div className="flex justify-between items-baseline border-b border-zinc-200 pb-1.5">
          <div className="text-xs font-bold text-zinc-900">Alex Rivera</div>
          <div className="text-[8px] text-zinc-500">San Francisco, CA · alex.rivera@example.com</div>
        </div>

        <div className="flex flex-col gap-2 text-[9px] pt-1">
          <div>
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-emerald-600 border-b border-emerald-500/20 pb-0.5 mb-1">
              Experience
            </div>
            <div className="flex justify-between text-[8.5px]">
              <span className="font-semibold text-zinc-900">Lead Software Engineer — <span className="text-zinc-600 font-normal italic">Vanguard Tech Cloud</span></span>
              <span className="text-zinc-400 text-[8px]">2022 – Present</span>
            </div>
            <div className="text-zinc-600 text-[8px] leading-tight pl-2 border-l border-zinc-200 mt-1">
              Architected real-time WebSocket ingestion processing 25K events/sec. Mentored 8 engineers with CI/CD code quality gates.
            </div>
          </div>

          <div>
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-emerald-600 border-b border-emerald-500/20 pb-0.5 mb-1">
              Proficiencies
            </div>
            <div className="text-[8px] text-zinc-600 flex flex-wrap gap-1">
              TypeScript · Next.js · Node.js · Go · Python · GraphQL · AWS · Docker
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "classic") {
    return (
      <div className="p-4 rounded-2xl bg-white text-zinc-900 shadow-xl flex flex-col gap-2 pointer-events-none select-none border border-zinc-200 font-serif">
        <div className="text-center border-b border-zinc-300 pb-2">
          <div className="text-sm font-bold text-zinc-900 tracking-wide uppercase">ALEX RIVERA</div>
          <div className="text-[8px] text-zinc-600 font-sans mt-0.5">
            San Francisco, CA • alex.rivera@example.com • (555) 382-9102 • alexrivera.dev
          </div>
        </div>

        <div className="flex flex-col gap-2 text-[9px] pt-1 font-sans">
          <div>
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1 font-serif">
              EMPLOYMENT HISTORY
            </div>
            <div className="flex justify-between text-[8.5px] font-bold text-zinc-800">
              <span>Lead Software Engineer, Vanguard Tech Cloud</span>
              <span className="font-normal text-zinc-600">2022 – Present</span>
            </div>
            <div className="text-zinc-700 text-[8px] leading-tight mt-0.5">
              • Spearheaded distributed microservices migration serving 12M users.<br />
              • Improved core API throughput by 40% with zero downtime.
            </div>
          </div>

          <div>
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1 font-serif">
              EDUCATION
            </div>
            <div className="flex justify-between text-[8px] text-zinc-700">
              <span className="font-semibold">B.S. in Computer Science — UC Berkeley</span>
              <span>2015 – 2019</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-white text-zinc-900 shadow-xl flex flex-col gap-2 pointer-events-none select-none border border-zinc-200 font-mono">
      <div className="border-b-2 border-black pb-1.5">
        <div className="text-xs font-black text-black tracking-tight">ALEX RIVERA</div>
        <div className="text-[8px] text-zinc-700 font-sans">
          San Francisco, CA | alex.rivera@example.com | 555-382-9102 | linkedin.com/in/alexrivera
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-[8.5px] font-sans">
        <div>
          <div className="font-black text-black uppercase tracking-wider text-[8px] border-b border-zinc-400 pb-0.2">
            [TECHNICAL SKILLS]
          </div>
          <div className="text-[8px] text-zinc-700 mt-0.5">
            <strong>Languages:</strong> TypeScript, JavaScript, Go, Python | <strong>Frameworks:</strong> React, Next.js, Node.js | <strong>Cloud:</strong> AWS, Docker, Kubernetes
          </div>
        </div>

        <div>
          <div className="font-black text-black uppercase tracking-wider text-[8px] border-b border-zinc-400 pb-0.2">
            [PROFESSIONAL EXPERIENCE]
          </div>
          <div className="flex justify-between text-[8px] font-bold text-black mt-0.5">
            <span>Lead Software Engineer | Vanguard Tech Cloud</span>
            <span>2022 - Present</span>
          </div>
          <div className="text-zinc-700 text-[8px] leading-tight">
            - Built high-throughput telemetry pipelines processing 25K events/sec.<br />
            - Optimized ATS parsing compliance score to 100% across all ATS bots.
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateResumeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const initialMode = (searchParams.get("mode") as "ai" | "template" | "upload") || "ai";
  const initialTemplate = searchParams.get("template") || (searchParams.get("ats") === "true" ? "ats" : "modern");

  const [mode, setMode] = useState<"ai" | "template" | "upload">(initialMode);
  const [title, setTitle] = useState("");
  const [fullName, setFullName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");

  const [experiences, setExperiences] = useState<Array<{
    id: string;
    company: string;
    role: string;
    duration: string;
    highlights: string;
  }>>([
    {
      id: "exp-1",
      company: "",
      role: "",
      duration: "",
      highlights: "",
    },
  ]);

  const [education, setEducation] = useState({
    degree: "",
    institution: "",
    year: "",
  });

  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");

  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleAddExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        id: `exp-${Date.now()}`,
        company: "",
        role: "",
        duration: "",
        highlights: "",
      },
    ]);
  };

  const handleRemoveExperience = (id: string) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id));
  };

  const handleExperienceChange = (
    id: string,
    field: "company" | "role" | "duration" | "highlights",
    val: string
  ) => {
    setExperiences((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, [field]: val } : exp))
    );
  };

  const handleFillSample = () => {
    setTitle("Alex Rivera - Senior Full Stack Engineer");
    setFullName("Alex Rivera");
    setTargetRole("Senior Full Stack Engineer");
    setEmail("alex.rivera@example.com");
    setPhone("+1 (555) 382-9102");
    setLocation("San Francisco, CA");
    setLinkedin("linkedin.com/in/alexrivera");
    setPortfolio("alexrivera.dev");
    setExperiences([
      {
        id: "exp-1",
        company: "Vanguard Tech Cloud",
        role: "Lead Software Engineer",
        duration: "2022 – Present",
        highlights: "Directed GraphQL microservices architecture serving 12M monthly users. Boosted core API throughput by 45% using Redis caching and connection pooling.",
      },
      {
        id: "exp-2",
        company: "Netflix",
        role: "Cloud Developer",
        duration: "2020 – 2022",
        highlights: "Designed microservice telemetry and observability pipelines in Go, TypeScript, and AWS, boosting throughput by 40%.",
      },
    ]);
    setEducation({
      degree: "B.S. in Computer Science",
      institution: "UC Berkeley",
      year: "2016 – 2020",
    });
    setSkills("React, Next.js, TypeScript, Go, Node.js, Python, PostgreSQL, AWS, Docker, Kubernetes, GraphQL");
    setDescription("Recipient of 2023 Tech Excellence Award. Passionate about developer tooling, high-scale cloud architectures, and mentoring junior engineers.");
    toast.success("Loaded sample details");
  };

  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() && !targetRole.trim() && !title.trim() && !description.trim()) {
      toast.error("Please enter at least your name, target role, or a brief description");
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

      const candidateData = {
        title: title.trim() || `${fullName.trim() || targetRole.trim() || "My"} Resume`,
        fullName: fullName.trim(),
        targetRole: targetRole.trim(),
        email: email.trim(),
        phone: phone.trim(),
        location: location.trim(),
        linkedin: linkedin.trim(),
        portfolio: portfolio.trim(),
        experiences: experiences.filter((exp) => exp.company.trim() || exp.role.trim() || exp.highlights.trim()),
        education: education.degree.trim() || education.institution.trim() ? [education] : [],
        skills: skills.trim(),
        description: description.trim(),
      };

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateData }),
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
          title: title.trim() || `${fullName.trim() || "My"} Resume`,
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
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#262a3d] bg-[#12141f] text-blue-400 shadow-md">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>

              <h2 className="text-xl font-bold tracking-tight text-white mb-1.5">
                Creating Your Resume
              </h2>
              <p className="text-xs text-zinc-400 mb-6 text-center max-w-sm">
                Formatting your background into a clean, interview-ready layout.
              </p>
              
              <div className="w-full bg-[#12141f] border border-[#23273a] rounded-2xl p-5 flex flex-col justify-center items-center shadow-lg">
                <p className="text-zinc-200 font-medium text-xs leading-relaxed transition-all duration-500">
                  {LOADING_STEPS[loadingStepIdx]}
                </p>
                
                <div className="w-full bg-[#181b28] h-1.5 rounded-full mt-4 overflow-hidden border border-[#262a3d]">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${((loadingStepIdx + 1) / LOADING_STEPS.length) * 100}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center w-full mt-2 text-[10px] font-medium text-zinc-500">
                  <span>Step {loadingStepIdx + 1} of {LOADING_STEPS.length}</span>
                  <span>{Math.round(((loadingStepIdx + 1) / LOADING_STEPS.length) * 100)}%</span>
                </div>
              </div>
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
                    className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      mode === "ai"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <span>Guided Builder</span>
                  </button>
                  <button
                    onClick={() => setMode("upload")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      mode === "upload"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload CV</span>
                  </button>
                  <button
                    onClick={() => setMode("template")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      mode === "template"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <LayoutTemplate className="h-3.5 w-3.5" />
                    <span>Templates</span>
                  </button>
                </div>
              </div>
            </header>

            <main className="flex-1 mx-auto max-w-6xl w-full px-6 py-8 flex flex-col">
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {mode === "ai" && "Guided Resume Builder"}
                  {mode === "upload" && "Upload Existing Resume to Edit"}
                  {mode === "template" && "Template Gallery Showcase"}
                </h1>
                <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
                  {mode === "ai" && "Fill in your background across the sections below. We'll format your career history and skills into a clean, interview-ready resume."}
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

                        <TemplateMockCard templateId={tmpl.id} />

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
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
                      >
                        <span>Use Template</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : mode === "upload" ? (
                <div className="max-w-2xl mx-auto w-full p-6 sm:p-8 rounded-2xl border border-[#262a3d] bg-[#12141f] shadow-xl flex flex-col gap-6">
                  <form onSubmit={handleUploadImport} className="flex flex-col gap-5">
                    <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#262a3d] hover:border-zinc-500 rounded-xl bg-[#10121c] cursor-pointer transition-all">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#181b28] border border-[#262a3d] text-zinc-300 mb-3">
                        <Upload className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-semibold text-white text-center">
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
                      <label className="text-xs font-medium text-zinc-300">Resume Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Imported Full Stack Resume"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-xl border border-[#262a3e] bg-[#10121c] px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-zinc-300">Target Layout Template</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {TEMPLATE_SHOWCASE_LIST.map((tmpl) => (
                          <button
                            key={tmpl.id}
                            type="button"
                            onClick={() => setSelectedTemplate(tmpl.id)}
                            className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                              selectedTemplate === tmpl.id
                                ? "bg-blue-600/15 border-blue-500/40 text-blue-300"
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
                      className="mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>{uploadStatus || "Importing Resume..."}</span>
                        </>
                      ) : (
                        <>
                          <span>Import & Open in Editor</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 flex flex-col gap-6">
                    <form onSubmit={handleGenerateAI} className="p-6 sm:p-8 rounded-2xl border border-[#212435] bg-[#12141f] shadow-sm flex flex-col gap-6">
                      
                      <div className="flex flex-col gap-3.5">
                        <div className="flex items-center justify-between pb-3 border-b border-[#1f2333]">
                          <div>
                            <h2 className="text-sm font-semibold text-white tracking-tight">1. Target Position & Title</h2>
                            <p className="text-xs text-zinc-400">Position and document naming</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleFillSample}
                            className="text-xs text-zinc-300 hover:text-white border border-[#2a2e42] hover:border-zinc-600 bg-[#161826] hover:bg-[#1f2235] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            Auto-fill sample
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-300">Target Job Title</label>
                            <input
                              type="text"
                              placeholder="e.g. Senior Full Stack Engineer"
                              value={targetRole}
                              onChange={(e) => setTargetRole(e.target.value)}
                              className="w-full rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                              required
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-300">Resume Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Alex Rivera - Tech Lead 2026"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="w-full rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3.5 pt-4 border-t border-[#1f2333]">
                        <div className="pb-1">
                          <h2 className="text-sm font-semibold text-white tracking-tight">2. Contact Information</h2>
                          <p className="text-xs text-zinc-400">How recruiters and hiring managers reach you</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="text-xs font-medium text-zinc-300">Full Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Alex Rivera"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                              required
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-300">Email Address</label>
                            <input
                              type="email"
                              placeholder="e.g. alex.rivera@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-300">Phone Number</label>
                            <input
                              type="tel"
                              placeholder="e.g. +1 (555) 382-9102"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-300">Location</label>
                            <input
                              type="text"
                              placeholder="e.g. San Francisco, CA"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              className="w-full rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-300">LinkedIn or Portfolio URL</label>
                            <input
                              type="text"
                              placeholder="e.g. linkedin.com/in/alexrivera"
                              value={linkedin}
                              onChange={(e) => setLinkedin(e.target.value)}
                              className="w-full rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3.5 pt-4 border-t border-[#1f2333]">
                        <div className="flex items-center justify-between pb-1">
                          <div>
                            <h2 className="text-sm font-semibold text-white tracking-tight">3. Work Experience</h2>
                            <p className="text-xs text-zinc-400">List your recent positions and accomplishments</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddExperience}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2a2e42] bg-[#161826] hover:bg-[#1f2235] text-xs font-medium text-zinc-200 transition-colors cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add Position</span>
                          </button>
                        </div>

                        <div className="flex flex-col gap-4">
                          {experiences.map((exp, index) => (
                            <div key={exp.id} className="p-4 rounded-xl border border-[#262a3d] bg-[#10121c] flex flex-col gap-3 relative">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-zinc-300">Role {index + 1}</span>
                                {experiences.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveExperience(exp.id)}
                                    className="p-1 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                    title="Remove position"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="flex flex-col gap-1">
                                  <label className="text-xs font-medium text-zinc-400">Company</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Netflix"
                                    value={exp.company}
                                    onChange={(e) => handleExperienceChange(exp.id, "company", e.target.value)}
                                    className="w-full rounded-lg border border-[#262a3e] bg-[#141622] px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all"
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <label className="text-xs font-medium text-zinc-400">Title</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Lead Software Engineer"
                                    value={exp.role}
                                    onChange={(e) => handleExperienceChange(exp.id, "role", e.target.value)}
                                    className="w-full rounded-lg border border-[#262a3e] bg-[#141622] px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all"
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <label className="text-xs font-medium text-zinc-400">Dates</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. 2022 – Present"
                                    value={exp.duration}
                                    onChange={(e) => handleExperienceChange(exp.id, "duration", e.target.value)}
                                    className="w-full rounded-lg border border-[#262a3e] bg-[#141622] px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-zinc-400">Key Responsibilities & Impact</label>
                                <textarea
                                  rows={2}
                                  placeholder="e.g. Architected distributed GraphQL microservices serving 12M monthly users. Boosted core API throughput by 40% using Redis caching."
                                  value={exp.highlights}
                                  onChange={(e) => handleExperienceChange(exp.id, "highlights", e.target.value)}
                                  className="w-full rounded-lg border border-[#262a3e] bg-[#141622] px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all resize-none leading-relaxed"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[#1f2333]">
                        <div className="flex flex-col gap-3">
                          <div>
                            <h2 className="text-sm font-semibold text-white tracking-tight">4. Education</h2>
                            <p className="text-xs text-zinc-400">Degrees and schools</p>
                          </div>

                          <div className="flex flex-col gap-2.5">
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-medium text-zinc-400">Degree & Major</label>
                              <input
                                type="text"
                                placeholder="e.g. B.S. in Computer Science"
                                value={education.degree}
                                onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                                className="w-full rounded-lg border border-[#262a3e] bg-[#10121c] px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-medium text-zinc-400">School / University</label>
                              <input
                                type="text"
                                placeholder="e.g. UC Berkeley"
                                value={education.institution}
                                onChange={(e) => setEducation({ ...education, institution: e.target.value })}
                                className="w-full rounded-lg border border-[#262a3e] bg-[#10121c] px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-medium text-zinc-400">Graduation Year</label>
                              <input
                                type="text"
                                placeholder="e.g. 2016 – 2020"
                                value={education.year}
                                onChange={(e) => setEducation({ ...education, year: e.target.value })}
                                className="w-full rounded-lg border border-[#262a3e] bg-[#10121c] px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <div>
                            <h2 className="text-sm font-semibold text-white tracking-tight">5. Core Skills</h2>
                            <p className="text-xs text-zinc-400">Tools and technologies</p>
                          </div>

                          <div className="flex flex-col gap-1.5 flex-1">
                            <label className="text-xs font-medium text-zinc-400">Skills (Comma-separated)</label>
                            <textarea
                              rows={5}
                              placeholder="e.g. React, Next.js, TypeScript, Node.js, Python, PostgreSQL, AWS, Docker, Kubernetes, GraphQL"
                              value={skills}
                              onChange={(e) => setSkills(e.target.value)}
                              className="w-full rounded-lg border border-[#262a3e] bg-[#10121c] px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner resize-none leading-relaxed flex-1"
                            />
                            <span className="text-[11px] text-zinc-500">Separate each skill with a comma.</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 pt-4 border-t border-[#1f2333]">
                        <div>
                          <h2 className="text-sm font-semibold text-white tracking-tight">6. Summary & Additional Notes</h2>
                          <p className="text-xs text-zinc-400">Any extra achievements, certifications, projects, or context you want included</p>
                        </div>

                        <textarea
                          rows={3}
                          placeholder="e.g. Passionate about developer productivity and high-concurrency cloud architecture. Winner of 2023 Innovation Hackathon. Looking for senior or staff-level engineering leadership opportunities."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full rounded-lg border border-[#262a3e] bg-[#10121c] px-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner leading-relaxed resize-none"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#1f2333]">
                        <span className="text-xs text-zinc-500">
                          You can fine-tune every line and section in the editor.
                        </span>
                        <button
                          type="submit"
                          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
                        >
                          <span>Create Resume</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="p-5 rounded-2xl border border-[#212435] bg-[#12141f] flex flex-col gap-3.5 shadow-sm">
                      <div className="flex items-center justify-between border-b border-[#1f2333] pb-2.5">
                        <span className="text-xs font-semibold text-zinc-200">Template Style</span>
                        <span className="text-[11px] text-zinc-500">4 designs</span>
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
                              <span className="text-xs font-semibold">{tmpl.name}</span>
                              <span className="text-[10px] text-zinc-500">{tmpl.tagline}</span>
                            </div>
                            {selectedTemplate === tmpl.id && (
                              <Check className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl border border-[#212435] bg-[#12141f] flex flex-col gap-2.5 shadow-sm">
                      <span className="text-xs font-semibold text-zinc-200">
                        Next step: Editor Studio
                      </span>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Once created, your resume opens directly in the Studio Editor. You have full freedom to edit text, add more sections, change layouts, and export a clean PDF.
                      </p>
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
