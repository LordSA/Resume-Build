import { ArrowLeft, Loader2, Undo2, Redo2, Download } from "lucide-react";

export default function EditorLoading() {
  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      <header className="flex items-center justify-between px-6 py-3 border-b border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/20 text-zinc-650">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-32 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-900/80 border border-zinc-850 px-2 py-0.5 rounded-md animate-pulse">
              <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
              <span>Loading...</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-zinc-800 rounded-xl bg-zinc-900/30 p-0.5 mr-2 opacity-50">
            <div className="p-2 text-zinc-600 rounded-lg">
              <Undo2 className="h-4 w-4" />
            </div>
            <div className="p-2 text-zinc-600 rounded-lg">
              <Redo2 className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-zinc-850 border border-zinc-800 text-zinc-400 px-4 py-2.5 text-xs font-semibold tracking-wide animate-pulse">
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="relative flex h-full shrink-0 select-none z-20">
          <div className="flex h-full w-[480px]">
            <div className="flex h-full w-[80px] flex-col items-center gap-3 border-r border-zinc-850 bg-zinc-950 py-4 overflow-hidden shrink-0">
              {Array.from({ length: 9 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-10 w-10 rounded-xl bg-zinc-900/60 border border-zinc-850/50 animate-pulse"
                />
              ))}
            </div>

            <div className="flex-1 h-full border-r border-zinc-850 bg-zinc-900/30 px-6 py-6 overflow-hidden">
              <div className="flex flex-col gap-5">
                <div className="h-7 w-40 bg-zinc-800/80 rounded-lg animate-pulse mb-2" />
                
                <div className="flex flex-col gap-4">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <div className="h-3 w-20 bg-zinc-800/60 rounded animate-pulse" />
                      <div className="h-10 w-full bg-zinc-900/40 border border-zinc-850 rounded-xl animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 h-full overflow-y-auto bg-zinc-950/80 p-8 flex items-start justify-center">
          <div className="w-[794px] min-h-[1123px] bg-zinc-900/20 border border-zinc-850/50 rounded-lg p-16 shadow-2xl relative overflow-hidden flex flex-col gap-8 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/10 to-transparent -translate-x-full animate-shimmer" />
            
            <div className="flex flex-col items-center gap-3 border-b border-zinc-850/50 pb-6">
              <div className="h-9 w-64 bg-zinc-800 rounded-lg" />
              <div className="h-4 w-40 bg-zinc-800/60 rounded" />
              <div className="h-3.5 w-80 bg-zinc-850 rounded mt-1" />
            </div>

            <div className="flex flex-col gap-3">
              <div className="h-4 w-24 bg-zinc-800 rounded" />
              <div className="flex flex-col gap-2">
                <div className="h-3.5 w-full bg-zinc-850 rounded" />
                <div className="h-3.5 w-11/12 bg-zinc-850 rounded" />
                <div className="h-3.5 w-4/5 bg-zinc-850 rounded" />
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <div className="h-4 w-32 bg-zinc-800 rounded border-b border-zinc-800 pb-1" />
              <div className="flex flex-col gap-3">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-48 bg-zinc-800/80 rounded" />
                      <div className="h-3 w-24 bg-zinc-850 rounded" />
                    </div>
                    <div className="h-3.5 w-32 bg-zinc-850/60 rounded" />
                    <div className="flex flex-col gap-1.5 mt-1 pl-4">
                      <div className="h-3 w-full bg-zinc-850/50 rounded" />
                      <div className="h-3 w-11/12 bg-zinc-850/50 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
