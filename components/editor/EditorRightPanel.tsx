"use client";

import { useEditorStore } from "@/store/editorStore";
import { 
  Palette, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft
} from "lucide-react";
import ThemePanel from "./panels/ThemePanel";
import AIPanel from "./panels/AIPanel";

export default function EditorRightPanel() {
  const { 
    rightSidebarOpen, 
    toggleRightSidebar, 
    activeRightTab, 
    setActiveRightTab 
  } = useEditorStore();

  return (
    <div className="relative hidden lg:flex h-full shrink-0 select-none z-20 print:hidden">
      <button
        onClick={toggleRightSidebar}
        className="absolute top-1/2 -translate-y-1/2 -left-3.5 flex h-7 w-7 items-center justify-center rounded-full border border-[#262a3d] bg-[#181b28] text-zinc-400 hover:text-white hover:border-[#353b54] transition-all shadow-md z-30 cursor-pointer"
        title={rightSidebarOpen ? "Collapse Inspector" : "Expand Inspector"}
      >
        {rightSidebarOpen ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>

      <div className={`flex flex-col h-full bg-[#12141f] border-l border-[#1f2333] transition-all duration-300 ${rightSidebarOpen ? "w-[320px] xl:w-[360px]" : "w-0 overflow-hidden"}`}>
        
        <div className="p-3 border-b border-[#1f2333] shrink-0 bg-[#12141f]">
          <div className="grid grid-cols-2 p-1 bg-[#181b28] border border-[#262a3d] rounded-xl shadow-inner">
            <button
              onClick={() => setActiveRightTab("theme")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeRightTab === "theme"
                  ? "bg-[#25293d] text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Palette className="h-3.5 w-3.5 text-blue-400" />
              <span>Design & Theme</span>
            </button>
            <button
              onClick={() => setActiveRightTab("ats")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeRightTab === "ats"
                  ? "bg-[#25293d] text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>ATS Match</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin bg-[#12141f]">
          {activeRightTab === "theme" ? <ThemePanel /> : <AIPanel />}
        </div>
      </div>
    </div>
  );
}
