"use client";

import { useResumeStore } from "@/store/resumeStore";
import { Plus, Trash2 } from "lucide-react";

export default function LanguagesPanel() {
  const { resumeData, addLanguage, updateLanguage, deleteLanguage } = useResumeStore();

  if (!resumeData) return null;

  const { languages } = resumeData;

  const handleAdd = () => {
    addLanguage({
      name: "",
      proficiency: "Full Professional",
    });
  };

  const handleFieldChange = (index: number, field: string, value: string) => {
    updateLanguage(index, { [field]: value });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between pb-1">
        <span className="text-[11px] font-semibold text-zinc-400">Spoken & written language proficiencies</span>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-[11px] font-bold bg-blue-600/15 border border-blue-500/30 text-blue-400 hover:bg-blue-600/25 px-2.5 py-1 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Plus className="h-3 w-3" />
          Add Language
        </button>
      </div>

      <div className="flex flex-col gap-2.5 mt-1">
        {languages.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:grid sm:grid-cols-12 gap-2.5 border border-[#212435] bg-[#161824] rounded-2xl p-3 sm:items-end shadow-sm"
          >
            <div className="flex flex-col gap-1 sm:col-span-5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Language</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                placeholder="English"
                className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
              />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Proficiency</label>
              <input
                type="text"
                value={item.proficiency}
                onChange={(e) => handleFieldChange(index, "proficiency", e.target.value)}
                placeholder="e.g. Native, Bilingual, Fluent"
                className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end sm:justify-center pt-1 sm:pt-0">
              <button
                type="button"
                onClick={() => deleteLanguage(index)}
                className="p-2 border border-[#262a3e] hover:bg-red-500/10 hover:border-red-500/30 text-zinc-500 hover:text-red-400 rounded-xl transition-all cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
