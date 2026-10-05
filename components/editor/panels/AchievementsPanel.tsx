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
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between pb-1">
        <span className="text-[11px] font-semibold text-zinc-400">Honors, awards & notable recognitions</span>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-[11px] font-bold bg-blue-600/15 border border-blue-500/30 text-blue-400 hover:bg-blue-600/25 px-2.5 py-1 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Plus className="h-3 w-3" />
          Add Award
        </button>
      </div>

      <div className="flex flex-col gap-2.5 mt-1">
        {achievements.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all overflow-hidden shadow-sm ${
                isExpanded ? "border-[#2d3249] bg-[#161824]" : "border-[#212435] bg-[#12141f]"
              }`}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setExpandedId(isExpanded ? null : item.id);
                  }
                }}
                className="flex items-center justify-between w-full px-4 py-3 bg-[#181b28]/60 hover:bg-[#1f2334] text-left font-bold text-xs cursor-pointer select-none transition-colors"
              >
                <div className="text-white truncate max-w-[200px]">{item.title || "Achievement / Award"}</div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAchievement(item.id);
                    }}
                    className="p-1 text-zinc-500 hover:text-red-400 transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-zinc-400" /> : <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 border-t border-[#23273a] flex flex-col gap-3 bg-[#12141f]">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Award Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdate(item.id, "title", e.target.value)}
                      placeholder="Won 1st Place at TechCrunch Hackathon"
                      className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Date (Optional)</label>
                    <input
                      type="text"
                      value={item.date || ""}
                      onChange={(e) => handleUpdate(item.id, "date", e.target.value)}
                      placeholder="Oct 2023"
                      className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Description (Optional)</label>
                    <textarea
                      value={item.description || ""}
                      onChange={(e) => handleUpdate(item.id, "description", e.target.value)}
                      placeholder="Selected out of 250+ competing teams for engineering a high-concurrency real-time application."
                      rows={3}
                      className="w-full rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-sans leading-relaxed resize-none shadow-inner"
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
