"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function EducationPanel() {
  const { resumeData, addEducation, updateEducation, deleteEducation } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!resumeData) return null;

  const { education } = resumeData;

  const handleAdd = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    addEducation({
      id: newId,
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
      score: "",
    });
    setExpandedId(newId);
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    updateEducation(id, { [field]: value });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between pb-1">
        <span className="text-[11px] font-semibold text-zinc-400">Schools, degrees & academic history</span>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-[11px] font-bold bg-blue-600/15 border border-blue-500/30 text-blue-400 hover:bg-blue-600/25 px-2.5 py-1 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Plus className="h-3 w-3" />
          Add Education
        </button>
      </div>

      <div className="flex flex-col gap-2.5 mt-1">
        {education.map((item) => {
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
                <div>
                  <span className="text-white">{item.degree || "Degree"}</span>
                  {item.institution && (
                    <span className="text-zinc-400 font-normal"> • {item.institution}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteEducation(item.id);
                    }}
                    className="p-1 text-zinc-500 hover:text-red-400 transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-zinc-400" /> : <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 border-t border-[#23273a] grid grid-cols-2 gap-3 bg-[#12141f]">
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Institution / School</label>
                    <input
                      type="text"
                      value={item.institution}
                      onChange={(e) => handleUpdate(item.id, "institution", e.target.value)}
                      placeholder="University of California, Los Angeles"
                      className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Degree & Major</label>
                    <input
                      type="text"
                      value={item.degree}
                      onChange={(e) => handleUpdate(item.id, "degree", e.target.value)}
                      placeholder="B.S. in Computer Science"
                      className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Start Date</label>
                    <input
                      type="text"
                      value={item.startDate}
                      onChange={(e) => handleUpdate(item.id, "startDate", e.target.value)}
                      placeholder="Sep 2020"
                      className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">End Date</label>
                    <input
                      type="text"
                      value={item.endDate}
                      onChange={(e) => handleUpdate(item.id, "endDate", e.target.value)}
                      placeholder="Jun 2024"
                      className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">GPA / Score (Optional)</label>
                    <input
                      type="text"
                      value={item.score}
                      onChange={(e) => handleUpdate(item.id, "score", e.target.value)}
                      placeholder="3.8 / 4.0"
                      className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
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
