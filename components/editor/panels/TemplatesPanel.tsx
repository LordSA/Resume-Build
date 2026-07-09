"use client";

import { useResumeStore } from "@/store/resumeStore";

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
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-lg font-bold">Resume Templates</h3>
        <p className="text-xs text-zinc-400 mt-0.5">Select a template framework. Your data remains fully preserved.</p>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {TEMPLATES.map((item) => {
          const isActive = template === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTemplate(item.id)}
              className={`flex flex-col items-start gap-1 p-5 rounded-2xl border text-left transition-all ${
                isActive
                  ? "bg-blue-600/15 border-blue-500/40 text-white shadow-md shadow-blue-500/5"
                  : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700/80 hover:bg-zinc-900/60 text-zinc-400"
              }`}
            >
              <span className={`font-bold text-sm ${isActive ? "text-blue-400" : "text-white"}`}>
                {item.name}
              </span>
              <span className="text-xs text-zinc-400 font-normal leading-relaxed mt-0.5">
                {item.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
