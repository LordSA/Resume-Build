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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Education</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Detail your academic background and degrees</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs font-semibold bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600/25 px-3 py-1.5 rounded-xl transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Education
        </button>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {education.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="border border-zinc-850 rounded-2xl bg-zinc-900/10 overflow-hidden transition-all"
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
                className="flex items-center justify-between w-full px-5 py-4 bg-zinc-900/20 hover:bg-zinc-900/30 text-left font-bold text-sm cursor-pointer select-none focus:outline-none focus:bg-zinc-900/30"
              >
                <div>
                  <span className="text-white">{item.degree || "Degree"}</span>
                  {item.institution && (
                    <span className="text-zinc-400 font-normal"> at {item.institution}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteEducation(item.id);
                    }}
                    className="p-1 text-zinc-500 hover:text-red-400 transition-all cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="p-5 border-t border-zinc-850/50 grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Institution / School</label>
                    <input
                      type="text"
                      value={item.institution}
                      onChange={(e) => handleUpdate(item.id, "institution", e.target.value)}
                      placeholder="University of California, Los Angeles"
                      className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Degree & Major</label>
                    <input
                      type="text"
                      value={item.degree}
                      onChange={(e) => handleUpdate(item.id, "degree", e.target.value)}
                      placeholder="B.S. in Computer Science"
                      className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Start Date</label>
                    <input
                      type="text"
                      value={item.startDate}
                      onChange={(e) => handleUpdate(item.id, "startDate", e.target.value)}
                      placeholder="Sep 2020"
                      className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">End Date</label>
                    <input
                      type="text"
                      value={item.endDate}
                      onChange={(e) => handleUpdate(item.id, "endDate", e.target.value)}
                      placeholder="Jun 2024"
                      className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">GPA / Score (Optional)</label>
                    <input
                      type="text"
                      value={item.score}
                      onChange={(e) => handleUpdate(item.id, "score", e.target.value)}
                      placeholder="3.8 / 4.0"
                      className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
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
