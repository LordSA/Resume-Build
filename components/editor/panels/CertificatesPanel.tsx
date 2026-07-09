// components/editor/panels/CertificatesPanel.tsx
"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function CertificatesPanel() {
  const { resumeData, addCertificate, updateCertificate, deleteCertificate } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!resumeData) return null;

  const { certificates } = resumeData;

  const handleAdd = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    addCertificate({
      id: newId,
      name: "",
      issuer: "",
      date: "",
      link: "",
    });
    setExpandedId(newId);
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    updateCertificate(id, { [field]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Certificates</h3>
          <p className="text-xs text-zinc-400 mt-0.5">List professional certifications and credentials</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs font-semibold bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600/25 px-3 py-1.5 rounded-xl transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Credential
        </button>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {certificates.map((item) => {
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
                  <span className="text-white">{item.name || "Certificate"}</span>
                  {item.issuer && (
                    <span className="text-zinc-400 font-normal"> by {item.issuer}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCertificate(item.id);
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
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Certificate Name</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdate(item.id, "name", e.target.value)}
                      placeholder="AWS Certified Solutions Architect"
                      className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Issuer / Organization</label>
                    <input
                      type="text"
                      value={item.issuer}
                      onChange={(e) => handleUpdate(item.id, "issuer", e.target.value)}
                      placeholder="Amazon Web Services"
                      className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Earned Date</label>
                    <input
                      type="text"
                      value={item.date}
                      onChange={(e) => handleUpdate(item.id, "date", e.target.value)}
                      placeholder="Nov 2023"
                      className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Credential URL (Optional)</label>
                    <input
                      type="text"
                      value={item.link || ""}
                      onChange={(e) => handleUpdate(item.id, "link", e.target.value)}
                      placeholder="https://credly.com/certs/..."
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
