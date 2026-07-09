// components/editor/panels/SkillsPanel.tsx
"use client";

import { useResumeStore } from "@/store/resumeStore";
import { Plus, Trash2 } from "lucide-react";

export default function SkillsPanel() {
  const { resumeData, addSkillCategory, updateSkillCategory, deleteSkillCategory } = useResumeStore();

  if (!resumeData) return null;

  const { skills } = resumeData;

  const handleAdd = () => {
    addSkillCategory("Technical Skills");
  };

  const handleCategoryNameChange = (index: number, newCategoryName: string) => {
    const item = skills[index];
    updateSkillCategory(index, newCategoryName, item.items);
  };

  const handleItemsChange = (index: number, itemsString: string) => {
    const item = skills[index];
    const newItems = itemsString
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    updateSkillCategory(index, item.category, newItems);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Skills</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Categorize your expertise (e.g. Languages, Tools)</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs font-semibold bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600/25 px-3 py-1.5 rounded-xl transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Category
        </button>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {skills.map((skillGroup, index) => (
          <div
            key={index}
            className="border border-zinc-850 rounded-2xl bg-zinc-900/10 p-5 flex flex-col gap-3 relative"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Group {index + 1}</span>
              <button
                type="button"
                onClick={() => deleteSkillCategory(index)}
                className="p-1.5 text-zinc-500 hover:text-red-400 transition-all rounded-lg hover:bg-zinc-900/50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Category Title</label>
              <input
                type="text"
                value={skillGroup.category}
                onChange={(e) => handleCategoryNameChange(index, e.target.value)}
                placeholder="e.g. Frontend Frameworks"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Skills (Comma-separated)</label>
              <input
                type="text"
                value={skillGroup.items.join(", ")}
                onChange={(e) => handleItemsChange(index, e.target.value)}
                placeholder="e.g. React, Next.js, Vue, Angular"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
