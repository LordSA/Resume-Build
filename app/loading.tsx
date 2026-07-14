"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950">
      <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900 overflow-hidden">
        <div className="h-full bg-blue-500 animate-loading-bar" />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full border border-blue-500/20 animate-ping" />
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900/50 text-blue-400 border border-zinc-800">
            <img
              src="/nv.svg"
              alt="Logo"
              className="h-8 w-auto opacity-95 animate-pulse"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold tracking-wider uppercase bg-zinc-900/40 border border-zinc-800/60 px-3 py-1.5 rounded-full mt-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
          Loading Page...
        </div>
      </div>
    </div>
  );
}
