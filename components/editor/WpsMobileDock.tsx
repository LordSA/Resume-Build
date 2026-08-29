"use client";

import { useEditorStore } from "@/store/editorStore";
import { 
  FileEdit, 
  Palette, 
  LayoutGrid, 
  Sparkles, 
  Download
} from "lucide-react";

interface WpsMobileDockProps {
  onOpenDrawer: (section?: string) => void;
  onDownload: () => void;
  activeDrawerSection: string | null;
}

export default function WpsMobileDock({
  onOpenDrawer,
  onDownload,
  activeDrawerSection,
}: WpsMobileDockProps) {
  const { activeSection } = useEditorStore();

  const isContentActive = activeDrawerSection && !["theme", "templates", "ai"].includes(activeDrawerSection);
  const isThemeActive = activeDrawerSection === "theme";
  const isTemplatesActive = activeDrawerSection === "templates";
  const isAiActive = activeDrawerSection === "ai";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#12141f]/95 backdrop-blur-xl border-t border-[#1f2333] px-3 py-2 flex items-center justify-around md:hidden shadow-2xl safe-area-pb">
      <button
        onClick={() => onOpenDrawer(isContentActive ? undefined : (["theme", "templates", "ai"].includes(activeSection) ? "personal" : activeSection))}
        className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          isContentActive 
            ? "text-blue-400 font-bold" 
            : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        <div className={`p-1 rounded-lg ${isContentActive ? "bg-blue-500/15" : "bg-transparent"}`}>
          <FileEdit className="h-5 w-5" />
        </div>
        <span className="text-[10px] tracking-tight">Edit</span>
      </button>

      <button
        onClick={() => onOpenDrawer("theme")}
        className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          isThemeActive 
            ? "text-blue-400 font-bold" 
            : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        <div className={`p-1 rounded-lg ${isThemeActive ? "bg-blue-500/15" : "bg-transparent"}`}>
          <Palette className="h-5 w-5" />
        </div>
        <span className="text-[10px] tracking-tight">Theme</span>
      </button>

      <button
        onClick={() => onOpenDrawer("templates")}
        className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          isTemplatesActive 
            ? "text-blue-400 font-bold" 
            : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        <div className={`p-1 rounded-lg ${isTemplatesActive ? "bg-blue-500/15" : "bg-transparent"}`}>
          <LayoutGrid className="h-5 w-5" />
        </div>
        <span className="text-[10px] tracking-tight">Templates</span>
      </button>

      <button
        onClick={() => onOpenDrawer("ai")}
        className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          isAiActive 
            ? "text-blue-400 font-bold" 
            : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        <div className={`p-1 rounded-lg ${isAiActive ? "bg-blue-500/15" : "bg-transparent"}`}>
          <Sparkles className="h-5 w-5" />
        </div>
        <span className="text-[10px] tracking-tight">ATS Match</span>
      </button>

      <button
        onClick={onDownload}
        className="flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl text-zinc-400 hover:text-blue-400 transition-all cursor-pointer"
      >
        <div className="p-1 rounded-lg">
          <Download className="h-5 w-5" />
        </div>
        <span className="text-[10px] tracking-tight">Export</span>
      </button>
    </div>
  );
}
