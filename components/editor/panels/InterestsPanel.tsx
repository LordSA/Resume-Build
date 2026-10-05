"use client";

import { useResumeStore } from "@/store/resumeStore";

export default function InterestsPanel() {
  const { resumeData, updateInterests } = useResumeStore();

  if (!resumeData) return null;

  const { interests } = resumeData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.value
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    updateInterests(list);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="pb-1">
        <span className="text-[11px] font-semibold text-zinc-400">Personal interests, hobbies & pursuits</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Interests (Comma-separated)</label>
        <input
          type="text"
          value={interests.join(", ")}
          onChange={handleChange}
          placeholder="e.g. Open Source, Cloud Architecture, Cycling, Chess, Photography"
          className="rounded-xl border border-[#262a3e] bg-[#10121c] px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner"
        />
      </div>
    </div>
  );
}
