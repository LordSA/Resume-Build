"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  Layers, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { extractTextFromFile } from "@/lib/documentParser";

interface UploadResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TEMPLATE_OPTIONS = [
  { id: "modern", name: "Modern", color: "border-blue-500/40 bg-blue-500/10 text-blue-300" },
  { id: "minimal", name: "Minimalist", color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" },
  { id: "classic", name: "Classic", color: "border-amber-500/40 bg-amber-500/10 text-amber-300" },
  { id: "ats", name: "Standard ATS", color: "border-purple-500/40 bg-purple-500/10 text-purple-300" },
];

export default function UploadResumeModal({ isOpen, onClose }: UploadResumeModalProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState("modern");
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      if (!title) {
        const cleanName = selected.name.replace(/\.[^/.]+$/, "");
        setTitle(cleanName);
      }
      toast.success(`Selected ${selected.name}`);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a resume file (PDF, DOCX, TXT)");
      return;
    }

    setIsUploading(true);
    setStatusMsg("Extracting text from document...");

    try {
      const extractedText = await extractTextFromFile(file);

      if (!extractedText || extractedText.length < 20) {
        throw new Error("Could not extract readable text from this file. Please make sure the PDF has selectable text.");
      }

      setStatusMsg("AI structuring resume entities & formatting...");

      const res = await fetch("/api/resume/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: extractedText,
          title: title.trim() || file.name.replace(/\.[^/.]+$/, ""),
          template
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to import resume");
      }

      const data = await res.json();
      toast.success("Resume imported successfully!");
      router.push(`/editor/${data.id}`);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to import resume");
      setIsUploading(false);
      setStatusMsg("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#262a3d] bg-[#12141f] shadow-2xl p-6 sm:p-7 flex flex-col gap-5 text-zinc-100 my-8">
        
        <div className="flex items-center justify-between border-b border-[#1f2333] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">Upload & Edit Resume</h3>
              <p className="text-xs text-zinc-400">Import your old CV/resume and edit freely in Studio</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#181b28] transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleImport} className="flex flex-col gap-4">
          <label className="flex flex-col items-center justify-center p-7 border-2 border-dashed border-[#262a3d] hover:border-cyan-500/50 rounded-2xl bg-[#10121c] cursor-pointer transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-3">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold text-white text-center">
              {file ? file.name : "Click to browse or drag & drop resume"}
            </span>
            <span className="text-[10px] text-zinc-400 mt-1">
              Supports PDF, DOC, DOCX, TXT (up to 10MB)
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Resume Name</label>
            <input
              type="text"
              placeholder="e.g. My Updated Software Engineer Resume"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Target Editor Layout</label>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATE_OPTIONS.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setTemplate(tmpl.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                    template === tmpl.id
                      ? `${tmpl.color} shadow-sm`
                      : "bg-[#181b28] border-[#262a3d] text-zinc-400 hover:text-white"
                  }`}
                >
                  {tmpl.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isUploading || !file}
            className="mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/30 cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{statusMsg || "Processing & Opening Editor..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Parse & Edit in Studio</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
