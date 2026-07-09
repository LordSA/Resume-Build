// components/editor/panels/PersonalPanel.tsx
"use client";

import { useResumeStore } from "@/store/resumeStore";

export default function PersonalPanel() {
  const { resumeData, updatePersonal } = useResumeStore();

  if (!resumeData) return null;

  const { personal } = resumeData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updatePersonal({ [name]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-bold">Personal Information</h3>
        <p className="text-xs text-zinc-400 mt-0.5">Configure your basic contact details and links</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={personal.fullName || ""}
            onChange={handleChange}
            placeholder="John Doe"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Job Title</label>
          <input
            type="text"
            name="jobTitle"
            value={personal.jobTitle || ""}
            onChange={handleChange}
            placeholder="Senior Frontend Developer"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Email</label>
          <input
            type="email"
            name="email"
            value={personal.email || ""}
            onChange={handleChange}
            placeholder="john@example.com"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Phone</label>
          <input
            type="text"
            name="phone"
            value={personal.phone || ""}
            onChange={handleChange}
            placeholder="+1 555-0199"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Location</label>
          <input
            type="text"
            name="location"
            value={personal.location || ""}
            onChange={handleChange}
            placeholder="San Francisco, CA"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Website</label>
          <input
            type="text"
            name="website"
            value={personal.website || ""}
            onChange={handleChange}
            placeholder="https://johndoe.com"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">GitHub</label>
          <input
            type="text"
            name="github"
            value={personal.github || ""}
            onChange={handleChange}
            placeholder="https://github.com/johndoe"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">LinkedIn</label>
          <input
            type="text"
            name="linkedin"
            value={personal.linkedin || ""}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/johndoe"
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
