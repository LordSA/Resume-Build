"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function ProjectsPanel() {
  const { resumeData, addProject, updateProject, deleteProject } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!resumeData) return null;

  const { projects } = resumeData;

  const handleAdd = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    addProject({
      id: newId,
      title: "",
      description: "",
      technologies: [],
      link: "",
    });
    setExpandedId(newId);
  };

  const handleUpdate = (id: string, field: string, value: any) => {
    updateProject(id, { [field]: value });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between pb-1">
        <span className="text-[11px] font-semibold text-zinc-400">Featured applications & side projects</span>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-[11px] font-bold bg-blue-600/15 border border-blue-500/30 text-blue-400 hover:bg-blue-600/25 px-2.5 py-1 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Plus className="h-3 w-3" />
          Add Project
        </button>
      </div>

      <div className="flex flex-col gap-2.5 mt-1">
        {projects.map((item) => {
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
                <div className="text-white truncate max-w-[200px]">{item.title || "Project Title"}</div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(item.id);
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
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Project Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdate(item.id, "title", e.target.value)}
                      placeholder="E-Commerce Analytics Platform"
                      className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Project URL / Repository (Optional)</label>
                    <input
                      type="text"
                      value={item.link || ""}
                      onChange={(e) => handleUpdate(item.id, "link", e.target.value)}
                      placeholder="https://github.com/myusername/myproject"
                      className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Technologies (Comma-separated)</label>
                    <input
                      type="text"
                      value={item.technologies.join(", ")}
                      onChange={(e) => {
                        const tags = e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter((t) => t.length > 0);
                        handleUpdate(item.id, "technologies", tags);
                      }}
                      placeholder="React, Next.js, Tailwind CSS, PostgreSQL"
                      className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Project Description</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => handleUpdate(item.id, "description", e.target.value)}
                      placeholder="Architected a responsive dashboard managing live sales metrics. Integrated web sockets for real-time charting..."
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
