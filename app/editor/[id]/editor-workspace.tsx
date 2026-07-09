"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useResumeStore } from "@/store/resumeStore";
import { useThemeStore, ThemeConfig } from "@/store/themeStore";
import { useEditorStore } from "@/store/editorStore";
import { ResumeData } from "@/types/resume";
import EditorSidebar from "@/components/editor/EditorSidebar";
import ResumePreview from "@/components/resume/ResumePreview";
import { useAutosave } from "@/hooks/useAutosave";
import { toast } from "react-hot-toast";
import { 
  ArrowLeft, 
  Undo2, 
  Redo2, 
  Download, 
  Check, 
  Loader2 
} from "lucide-react";
import { motion } from "framer-motion";

interface EditorWorkspaceProps {
  resumeId: string;
  initialTitle: string;
  initialTemplate: string;
  initialResumeData: unknown;
  initialThemeConfig: unknown;
}

export default function EditorWorkspace({
  resumeId,
  initialTitle,
  initialTemplate,
  initialResumeData,
  initialThemeConfig,
}: EditorWorkspaceProps) {
  const { 
    title, 
    resumeData,
    isSaving, 
    history, 
    historyIndex, 
    setResume, 
    setTitle,
    undo, 
    redo 
  } = useResumeStore();

  const { themeConfig, setTheme } = useThemeStore();

  useEffect(() => {
    setResume(resumeId, initialTitle, initialTemplate, initialResumeData as ResumeData);
    if (initialThemeConfig) {
      setTheme(initialThemeConfig as ThemeConfig);
    }
  }, [resumeId, initialTitle, initialTemplate, initialResumeData, initialThemeConfig, setResume, setTheme]);

  useAutosave();

  const handleDownloadPDF = async () => {
    const element = document.getElementById("resume-print-area");
    if (!element) {
      toast.error("Resume content not found");
      return;
    }

    const loadToast = toast.loading("Generating PDF download...");
    const disabledSheets: (HTMLStyleElement | HTMLLinkElement)[] = [];

    try {
      const styles = Array.from(document.getElementsByTagName("style"));
      styles.forEach((style) => {
        try {
          const text = style.textContent || "";
          if (text.trim() === "" || text.includes("unexpected EOF")) {
            style.disabled = true;
            disabledSheets.push(style);
          }
        } catch (e) {
          style.disabled = true;
          disabledSheets.push(style);
        }
      });

      const links = Array.from(document.getElementsByTagName("link"));
      links.forEach((link) => {
        if (link.rel === "stylesheet") {
          try {
            const sheet = link.sheet;
            if (sheet) {
              const rules = sheet.cssRules;
              if (!rules || rules.length === 0) {
                link.disabled = true;
                disabledSheets.push(link);
              }
            } else {
              link.disabled = true;
              disabledSheets.push(link);
            }
          } catch (e) {
            link.disabled = true;
            disabledSheets.push(link);
          }
        }
      });

      const { jsPDF } = await import("jspdf");
      const html2canvasPro = (await import("html2canvas-pro")).default;
      (window as any).html2canvas = html2canvasPro;

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      await doc.html(element, {
        callback: function (pdf) {
          pdf.save(`${title.trim() || "resume"}.pdf`);
          toast.success("PDF downloaded successfully!", { id: loadToast });
        },
        margin: [0, 0, 0, 0],
        autoPaging: "text",
        x: 0,
        y: 0,
        width: 595.28,
        windowWidth: 794,
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          onclone: (clonedDoc) => {
            clonedDoc.documentElement.style.height = "auto";
            clonedDoc.documentElement.style.minHeight = "auto";
            clonedDoc.documentElement.style.overflow = "visible";
            clonedDoc.body.style.height = "auto";
            clonedDoc.body.style.minHeight = "auto";
            clonedDoc.body.style.overflow = "visible";

            const el = clonedDoc.getElementById("resume-print-area");
            if (el) {
              el.style.height = "auto";
              el.style.minHeight = "auto";

              clonedDoc.body.innerHTML = "";
              const wrapper = clonedDoc.createElement("div");
              wrapper.style.width = "794px";
              wrapper.style.height = "auto";
              wrapper.style.minHeight = "1123px";
              wrapper.style.background = "white";
              wrapper.style.position = "absolute";
              wrapper.style.left = "0px";
              wrapper.style.top = "0px";
              wrapper.style.transform = "none";
              wrapper.style.border = "none";
              wrapper.style.outline = "none";
              wrapper.style.boxShadow = "none";

              el.style.border = "none";
              el.style.outline = "none";
              el.style.boxShadow = "none";

              wrapper.appendChild(el);
              clonedDoc.body.appendChild(wrapper);
            }
          }
        }
      });
    } catch (err) {
      console.error(err);
      toast.error("Direct PDF download failed, opening print dialog...", { id: loadToast });
      window.print();
    } finally {
      disabledSheets.forEach((sheet) => {
        sheet.disabled = false;
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      <header className="flex items-center justify-between px-6 py-3 border-b border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md shrink-0 print:hidden">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-md font-bold text-white max-w-[200px] sm:max-w-[300px]"
            />
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium bg-zinc-900/80 border border-zinc-850 px-2 py-0.5 rounded-md">
              {isSaving ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span>Autosaved</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-zinc-800 rounded-xl bg-zinc-900/50 p-0.5 mr-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 text-zinc-450 hover:text-white hover:bg-zinc-800 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <Redo2 className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] text-white px-4 py-2.5 text-xs font-semibold tracking-wide transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </button>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-1 min-h-0 overflow-hidden"
      >
        <EditorSidebar />
        <ResumePreview />
      </motion.div>
    </div>
  );
}
