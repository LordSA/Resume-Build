"use client";

import { useState } from "react";
import { useThemeStore } from "@/store/themeStore";
import { Grab, Eye } from "lucide-react";

const SECTION_LABELS: Record<string, string> = {
  personal: "Personal Info",
  summary: "Professional Summary",
  experience: "Work Experience",
  education: "Education",
  projects: "Projects",
  skills: "Technical Skills",
  achievements: "Achievements",
  certificates: "Certifications",
  languages: "Languages",
  interests: "Interests",
};

export default function DndSectionList() {
  const { themeConfig, setSectionOrder } = useThemeStore();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const { sectionOrder } = themeConfig;

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newOrder = [...sectionOrder];
    const draggedItem = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setSectionOrder(newOrder);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="flex flex-col gap-2 mt-4 border border-zinc-850 rounded-2xl bg-zinc-900/10 p-5">
      <div className="mb-2">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Drag to Reorder Sections</h4>
        <p className="text-[10px] text-zinc-500 mt-0.5">Hold the handle to drag and drop sections up or down</p>
      </div>

      <div className="flex flex-col gap-1.5 mt-2">
        {sectionOrder.map((section, index) => {
          const label = SECTION_LABELS[section] || section;
          if (section === "personal") return null; // Personal info stays at the top

          return (
            <div
              key={section}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-900/40 text-xs font-semibold text-zinc-300 transition-all cursor-grab active:cursor-grabbing ${
                draggedIndex === index ? "opacity-30 border-blue-500/35 bg-zinc-850" : "hover:bg-zinc-850/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Grab className="h-4 w-4 text-zinc-500 shrink-0" />
                <span>{label}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
