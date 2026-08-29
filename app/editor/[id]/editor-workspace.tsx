"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useResumeStore } from "@/store/resumeStore";
import { useThemeStore, ThemeConfig } from "@/store/themeStore";
import { useEditorStore } from "@/store/editorStore";
import { ResumeData } from "@/types/resume";
import EditorSidebar from "@/components/editor/EditorSidebar";
import EditorRightPanel from "@/components/editor/EditorRightPanel";
import ResumePreview from "@/components/resume/ResumePreview";
import WpsMobileDock from "@/components/editor/WpsMobileDock";
import WpsEditDrawer from "@/components/editor/WpsEditDrawer";
import { useAutosave } from "@/hooks/useAutosave";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Download,
  Loader2,
  Cloud
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
    isSaving,
    history,
    historyIndex,
    setResume,
    setTitle,
    undo,
    redo
  } = useResumeStore();

  const { setTheme } = useThemeStore();
  const { 
    activeSection, 
    setActiveSection
  } = useEditorStore();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    setResume(resumeId, initialTitle, initialTemplate, initialResumeData as ResumeData);
    if (initialThemeConfig) {
      setTheme(initialThemeConfig as ThemeConfig);
    }
  }, [resumeId, initialTitle, initialTemplate, initialResumeData, initialThemeConfig, setResume, setTheme]);

  useAutosave();

  const handleDownloadPDF = async () => {
    toast.success("Tip: Uncheck 'Headers and footers' in print settings!", {
      duration: 5000,
      icon: '💡',
    });
    setTimeout(() => {
      window.print();
    }, 800);
  };

  const handleOpenMobileDrawer = (section?: string) => {
    if (section) {
      setActiveSection(section);
      setIsMobileDrawerOpen(true);
    } else {
      setIsMobileDrawerOpen(!isMobileDrawerOpen);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d0f17] text-zinc-100 overflow-hidden font-sans">
      <header className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-[#1f2333] bg-[#12141f]/90 backdrop-blur-xl shrink-0 print:hidden z-30 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#262a3d] bg-[#181b28] hover:bg-[#202436] hover:border-[#353b54] text-zinc-400 hover:text-white transition-all shadow-sm"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="text-xs font-semibold text-zinc-500 hidden md:inline">Dashboard &gt;</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm sm:text-base font-bold text-white max-w-[130px] xs:max-w-[180px] sm:max-w-[260px] truncate hover:bg-[#181b28]/60 px-1.5 py-0.5 rounded-lg transition-colors"
            />

            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-zinc-400 font-medium bg-[#181b28] border border-[#25293d] px-2.5 py-1 rounded-full shrink-0 shadow-inner">
              {isSaving ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
                  <span className="hidden xs:inline text-zinc-400 font-medium">Saving...</span>
                </>
              ) : (
                <>
                  <Cloud className="h-3 w-3 text-emerald-400" />
                  <span className="hidden xs:inline text-zinc-300 font-medium">Saved</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center border border-[#25293d] rounded-xl bg-[#181b28] p-0.5 shadow-sm">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-1.5 sm:p-2 text-zinc-400 hover:text-white hover:bg-[#222638] rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              title="Undo"
            >
              <Undo2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 sm:p-2 text-zinc-400 hover:text-white hover:bg-[#222638] rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              title="Redo"
            >
              <Redo2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white px-3.5 sm:px-4 py-2 sm:py-2 text-xs font-bold tracking-wide transition-all cursor-pointer shadow-md"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Download PDF</span>
          </button>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-1 min-h-0 overflow-hidden relative"
      >
        <EditorSidebar />
        <ResumePreview />
        <EditorRightPanel />
      </motion.div>

      <WpsMobileDock
        onOpenDrawer={handleOpenMobileDrawer}
        onDownload={handleDownloadPDF}
        activeDrawerSection={isMobileDrawerOpen ? activeSection : null}
      />

      <WpsEditDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />
    </div>
  );
}
