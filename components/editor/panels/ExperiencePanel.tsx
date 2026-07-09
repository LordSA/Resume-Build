// components/editor/panels/ExperiencePanel.tsx
"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { useEditorStore } from "@/store/editorStore";
import { toast } from "react-hot-toast";
import { Plus, Trash2, ChevronDown, ChevronUp, TrendingUp, Loader2, PlusCircle, MinusCircle } from "lucide-react";

export default function ExperiencePanel() {
  const { resumeData, addExperience, updateExperience, deleteExperience } = useResumeStore();
  const { isAILoading, setIsAILoading } = useEditorStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [localAILoading, setLocalAILoading] = useState<string | null>(null);

  if (!resumeData) return null;

  const { experience } = resumeData;

  const handleAdd = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    addExperience({
      id: newId,
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      description: ["Developed scalable web applications utilizing React and TypeScript."],
    });
    setExpandedId(newId);
  };

  const handleUpdate = (id: string, field: string, value: any) => {
    updateExperience(id, { [field]: value });
  };

  const handleBulletChange = (id: string, index: number, value: string) => {
    const expItem = experience.find((item) => item.id === id);
    if (!expItem) return;

    const newDescription = [...expItem.description];
    newDescription[index] = value;
    handleUpdate(id, "description", newDescription);
  };

  const handleAddBullet = (id: string) => {
    const expItem = experience.find((item) => item.id === id);
    if (!expItem) return;

    handleUpdate(id, "description", [...expItem.description, ""]);
  };

  const handleDeleteBullet = (id: string, index: number) => {
    const expItem = experience.find((item) => item.id === id);
    if (!expItem) return;

    handleUpdate(
      id,
      "description",
      expItem.description.filter((_, idx) => idx !== index)
    );
  };

  const handleOptimizeBullet = async (id: string, index: number, text: string) => {
    if (!text.trim()) {
      toast.error("Please type a bullet point description first");
      return;
    }

    const loaderKey = `${id}-${index}`;
    setLocalAILoading(loaderKey);
    setIsAILoading(true);

    try {
      const response = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          instruction: "improve",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to rewrite");
      }

      const { rewritten } = await response.json();
      handleBulletChange(id, index, rewritten);
      toast.success("Bullet point optimized!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to optimize bullet point");
    } finally {
      setLocalAILoading(null);
      setIsAILoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Work Experience</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Detail your past employment roles and impact</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs font-semibold bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600/25 px-3 py-1.5 rounded-xl transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Work
        </button>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {experience.map((item) => {
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
                <div>
                  <span className="text-white">{item.role || "Job Title"}</span>
                  {item.company && (
                    <span className="text-zinc-400 font-normal"> at {item.company}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteExperience(item.id);
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
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Company</label>
                      <input
                        type="text"
                        value={item.company}
                        onChange={(e) => handleUpdate(item.id, "company", e.target.value)}
                        placeholder="Google"
                        className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Role / Position</label>
                      <input
                        type="text"
                        value={item.role}
                        onChange={(e) => handleUpdate(item.id, "role", e.target.value)}
                        placeholder="Frontend Engineer"
                        className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Start Date</label>
                      <input
                        type="text"
                        value={item.startDate}
                        onChange={(e) => handleUpdate(item.id, "startDate", e.target.value)}
                        placeholder="Jan 2021"
                        className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">End Date</label>
                      <input
                        type="text"
                        value={item.endDate}
                        onChange={(e) => handleUpdate(item.id, "endDate", e.target.value)}
                        placeholder="Present"
                        className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Bullet Points</label>
                      <button
                        type="button"
                        onClick={() => handleAddBullet(item.id)}
                        className="flex items-center gap-1 text-[10px] uppercase font-bold text-blue-400 hover:text-blue-300 transition-all"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        Add Bullet
                      </button>
                    </div>

                    <div className="flex flex-col gap-3">
                      {item.description.map((bullet, idx) => {
                        const loaderKey = `${item.id}-${idx}`;
                        const isBulletLoading = localAILoading === loaderKey;
                        return (
                          <div key={idx} className="flex gap-2 items-start">
                            <textarea
                              value={bullet}
                              onChange={(e) => handleBulletChange(item.id, idx, e.target.value)}
                              placeholder="Write a descriptive resume bullet starting with an action verb..."
                              rows={2}
                              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-sans leading-relaxed resize-none"
                            />
                            <div className="flex flex-col gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleOptimizeBullet(item.id, idx, bullet)}
                                disabled={isAILoading}
                                className="p-2 bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                                title="Optimize Bullet"
                              >
                                {isBulletLoading ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <TrendingUp className="h-3.5 w-3.5" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteBullet(item.id, idx)}
                                className="p-2 border border-zinc-800 hover:bg-red-500/10 hover:border-red-500/30 text-zinc-500 hover:text-red-400 rounded-xl transition-all"
                              >
                                <MinusCircle className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
