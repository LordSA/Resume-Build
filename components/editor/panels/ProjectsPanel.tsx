// components/editor/panels/ProjectsPanel.tsx
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Projects</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Showcase your side projects and core creations</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs font-semibold bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600/25 px-3 py-1.5 rounded-xl transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Project
        </button>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {projects.map((item) => {
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
                <div className="text-white">{item.title || "Project Title"}</div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(item.id);
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
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Project Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdate(item.id, "title", e.target.value)}
                      placeholder="E-Commerce Analytics Platform"
                      className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Project Link (Optional)</label>
                    <input
                      type="text"
                      value={item.link || ""}
                      onChange={(e) => handleUpdate(item.id, "link", e.target.value)}
                      placeholder="https://github.com/myusername/myproject"
                      className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
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
                      className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Project Description</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => handleUpdate(item.id, "description", e.target.value)}
                      placeholder="Architected a responsive dashboard managing live sales metrics. Integrated web sockets for real-time charting..."
                      rows={4}
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
