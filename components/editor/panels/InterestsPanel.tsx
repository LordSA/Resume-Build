// components/editor/panels/InterestsPanel.tsx
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
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-bold">Interests</h3>
        <p className="text-xs text-zinc-400 mt-0.5">List personal interests, hobbies, or pursuits</p>
      </div>

      <div className="flex flex-col gap-1.5 mt-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Interests (Comma-separated)</label>
        <input
          type="text"
          value={interests.join(", ")}
          onChange={handleChange}
          placeholder="e.g. Open Source, Hiking, Chess, Photography"
          className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
        />
      </div>
    </div>
  );
}
