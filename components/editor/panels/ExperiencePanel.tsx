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
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between pb-1">
        <span className="text-[11px] font-semibold text-zinc-400">Past roles and positions</span>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-[11px] font-bold bg-blue-600/15 border border-blue-500/30 text-blue-400 hover:bg-blue-600/25 px-2.5 py-1 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Plus className="h-3 w-3" />
          Add Role
        </button>
      </div>

      <div className="flex flex-col gap-2.5 mt-1">
        {experience.map((item) => {
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
                  <span className="text-white">{item.role || "Job Title"}</span>
                  {item.company && (
                    <span className="text-zinc-400 font-normal"> • {item.company}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteExperience(item.id);
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
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Company</label>
                      <input
                        type="text"
                        value={item.company}
                        onChange={(e) => handleUpdate(item.id, "company", e.target.value)}
                        placeholder="Google"
                        className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Role</label>
                      <input
                        type="text"
                        value={item.role}
                        onChange={(e) => handleUpdate(item.id, "role", e.target.value)}
                        placeholder="Frontend Engineer"
                        className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Start Date</label>
                      <input
                        type="text"
                        value={item.startDate}
                        onChange={(e) => handleUpdate(item.id, "startDate", e.target.value)}
                        placeholder="Jan 2021"
                        className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">End Date</label>
                      <input
                        type="text"
                        value={item.endDate}
                        onChange={(e) => handleUpdate(item.id, "endDate", e.target.value)}
                        placeholder="Present"
                        className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Bullet Points</label>
                      <button
                        type="button"
                        onClick={() => handleAddBullet(item.id)}
                        className="flex items-center gap-1 text-[10px] uppercase font-bold text-blue-400 hover:text-blue-300 transition-all cursor-pointer"
                      >
                        <PlusCircle className="h-3 w-3" />
                        Add Bullet
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      {item.description.map((bullet, idx) => {
                        const loaderKey = `${item.id}-${idx}`;
                        const isBulletLoading = localAILoading === loaderKey;
                        return (
                          <div key={idx} className="flex gap-1.5 items-start">
                            <textarea
                              value={bullet}
                              onChange={(e) => handleBulletChange(item.id, idx, e.target.value)}
                              placeholder="Write a descriptive resume bullet point..."
                              rows={2}
                              className="flex-1 rounded-xl border border-[#262a3e] bg-[#10121c] px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-sans leading-relaxed resize-none shadow-inner"
                            />
                            <div className="flex flex-col gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleOptimizeBullet(item.id, idx, bullet)}
                                disabled={isAILoading}
                                className="p-1.5 bg-blue-600/10 border border-blue-500/25 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
                                title="AI Optimize"
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
                                className="p-1.5 border border-[#262a3e] hover:bg-red-500/10 hover:border-red-500/30 text-zinc-500 hover:text-red-400 rounded-lg transition-all cursor-pointer"
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
