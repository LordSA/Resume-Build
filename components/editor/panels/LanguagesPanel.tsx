// components/editor/panels/LanguagesPanel.tsx
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Languages</h3>
          <p className="text-xs text-zinc-400 mt-0.5">List spoken and written language proficiencies</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs font-semibold bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600/25 px-3 py-1.5 rounded-xl transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Language
        </button>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {languages.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-3 border border-zinc-850 bg-zinc-900/10 rounded-2xl p-4 items-end relative"
          >
            <div className="flex flex-col gap-1.5 col-span-5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Language</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                placeholder="English"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5 col-span-5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Proficiency</label>
              <input
                type="text"
                value={item.proficiency}
                onChange={(e) => handleFieldChange(index, "proficiency", e.target.value)}
                placeholder="e.g. Native, Bilingual, Fluent"
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="col-span-2 flex justify-center pb-0.5">
              <button
                type="button"
                onClick={() => deleteLanguage(index)}
                className="p-2 border border-zinc-800 hover:bg-red-500/10 hover:border-red-500/30 text-zinc-500 hover:text-red-400 rounded-xl transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
