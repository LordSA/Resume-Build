// components/editor/panels/AchievementsPanel.tsx
"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function AchievementsPanel() {
  const { resumeData, addAchievement, updateAchievement, deleteAchievement } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!resumeData) return null;

  const { achievements } = resumeData;

  const handleAdd = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    addAchievement({
      id: newId,
      title: "",
      description: "",
      date: "",
    });
    setExpandedId(newId);
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    updateAchievement(id, { [field]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Achievements</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Detail your honors, awards, and recognitions</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs font-semibold bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600/25 px-3 py-1.5 rounded-xl transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Award
        </button>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {achievements.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="border border-zinc-850 rounded-2xl bg-zinc-900/10 overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="flex items-center justify-between w-full px-5 py-4 bg-zinc-900/20 hover:bg-zinc-900/40 text-left font-bold text-sm"
              >
                <div className="text-white">{item.title || "Achievement / Award"}</div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAchievement(item.id);
                    }}
                    className="p-1 text-zinc-500 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-5 border-t border-zinc-850/50 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Award Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdate(item.id, "title", e.target.value)}
                        placeholder="Won 1st Place at TechCrunch Hackathon"
                        className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Date (Optional)</label>
                      <input
                        type="text"
                        value={item.date || ""}
                        onChange={(e) => handleUpdate(item.id, "date", e.target.value)}
                        placeholder="Oct 2023"
                        className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Description (Optional)</label>
                    <textarea
                      value={item.description || ""}
                      onChange={(e) => handleUpdate(item.id, "description", e.target.value)}
                      placeholder="Selected out of 250+ competing teams for engineering a decentralized database visualization application."
                      rows={3}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-sans leading-relaxed resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
