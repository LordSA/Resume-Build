"use client";

import { useResumeStore } from "@/store/resumeStore";
import { Check } from "lucide-react";

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern Layout",
    description: "Two-column design optimized for technology and business professionals.",
  },
  {
    id: "minimal",
    name: "Minimalist Style",
    description: "Clean single-column structure emphasizing content and legibility.",
  },
  {
    id: "classic",
    name: "Classic Elegant",
    description: "Traditional resume formatting, perfect for academic and corporate fields.",
  },
  {
    id: "ats",
    name: "Standard ATS",
    description: "Rigorous ATS-compatible single/multi-page layout optimized for parsing.",
  },
];

export default function TemplatesPanel() {
  const { template, setTemplate } = useResumeStore();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-bold text-white">Resume Templates</h3>
        <p className="text-xs text-zinc-400 mt-0.5">Select a layout style. All data and content are preserved.</p>
      </div>

      <div className="flex flex-col gap-2.5 mt-1">
        {TEMPLATES.map((item) => {
          const isActive = template === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTemplate(item.id)}
              className={`flex items-start justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer shadow-sm ${
                isActive
                  ? "bg-blue-600/20 border-blue-500/40 text-white shadow-md shadow-blue-500/5"
                  : "bg-[#161824] border-[#212435] hover:border-[#2d3249] hover:bg-[#1a1d2e] text-zinc-400"
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <span className={`font-semibold text-xs ${isActive ? "text-blue-400" : "text-white"}`}>
                  {item.name}
                </span>
                <span className="text-[11px] text-zinc-400 font-normal leading-relaxed">
                  {item.description}
                </span>
              </div>
              {isActive && <Check className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
