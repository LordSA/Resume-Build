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
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between pb-1">
        <span className="text-[11px] font-semibold text-zinc-400">Skill groups, tools & proficiencies</span>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-[11px] font-bold bg-blue-600/15 border border-blue-500/30 text-blue-400 hover:bg-blue-600/25 px-2.5 py-1 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Plus className="h-3 w-3" />
          Add Group
        </button>
      </div>

      <div className="flex flex-col gap-2.5 mt-1">
        {skills.map((skillGroup, index) => (
          <div
            key={index}
            className="rounded-2xl border border-[#212435] bg-[#161824] p-3.5 flex flex-col gap-3 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-[#212435] pb-2">
              <span className="text-xs font-semibold text-zinc-300">Group {index + 1}</span>
              <button
                type="button"
                onClick={() => deleteSkillCategory(index)}
                className="p-1 text-zinc-500 hover:text-red-400 transition-all cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Category Name</label>
              <input
                type="text"
                value={skillGroup.category}
                onChange={(e) => handleCategoryNameChange(index, e.target.value)}
                placeholder="e.g. Frontend Frameworks"
                className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Skills (Comma-separated)</label>
              <input
                type="text"
                value={skillGroup.items.join(", ")}
                onChange={(e) => handleItemsChange(index, e.target.value)}
                placeholder="e.g. React, Next.js, TypeScript, Tailwind CSS"
                className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
