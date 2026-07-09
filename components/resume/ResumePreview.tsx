"use client";

import { useResumeStore } from "@/store/resumeStore";
import { useThemeStore } from "@/store/themeStore";
import { useEditorStore } from "@/store/editorStore";
import TemplateRenderer from "./TemplateRenderer";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export default function ResumePreview() {
  const { resumeData, template } = useResumeStore();
  const { themeConfig } = useThemeStore();
  const { previewZoom, setPreviewZoom } = useEditorStore();

  if (!resumeData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-900/10 text-zinc-500 text-xs">
        No active resume data loaded
      </div>
    );
  }

  const handleZoomIn = () => setPreviewZoom(Math.min(previewZoom + 0.05, 1.3));
  const handleZoomOut = () => setPreviewZoom(Math.max(previewZoom - 0.05, 0.6));
  const handleZoomReset = () => setPreviewZoom(1.0);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-zinc-900 overflow-hidden relative print:p-0 print:bg-white print:overflow-visible">
      <div className="flex items-center justify-between px-6 py-2.5 bg-zinc-950 border-b border-zinc-850 shrink-0 print:hidden z-10">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Live Preview</span>
        <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-0.5 rounded-xl">
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="text-[10px] font-bold text-zinc-400 px-1 w-11 text-center select-none uppercase">
            {Math.round(previewZoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-all"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <div className="h-4 w-[1px] bg-zinc-800 mx-0.5"></div>
          <button
            onClick={handleZoomReset}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-all"
            title="Reset Zoom"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 flex justify-center bg-zinc-900/40 scrollbar-thin print:p-0 print:bg-white print:overflow-visible">
        <div
          className="resume-print-container shadow-2xl origin-top transition-transform duration-75 print:shadow-none print:transform-none shrink-0"
          style={{
            transform: `scale(${previewZoom})`,
            width: "794px",
            minHeight: "1123px",
          }}
        >
          <div id="resume-print-area" className="w-full h-full bg-white text-zinc-900">
            <TemplateRenderer
              data={resumeData}
              template={template}
              theme={themeConfig}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @page {
          size: A4 potrait;
          margin: 0;
        }
        @media print {
          html,
          body,
          div:has(.resume-print-container) {
            overflow: visible !important;
            height: auto !important;
            min-height: auto !important;
            background-color: white !important;
          }
          body * {
            visibility: hidden;
          }
          aside,
          .editor-sidebar,
          .print\:hidden,
          .print\:hidden * {
            display: none !important;
          }
          body {
            padding: 0 !important;
            margin: 0 !important;
          }

          .resume-print-container {
            visibility: visible !important;
            position: relative !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: auto !important;
            transform: none !important;
            box-shadow: none !important;
            border: none !important;
            outline: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #resume-print-area {
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            background: white !important;
          }
          .resume-print-container * {
            visibility: visible !important;
          }
          .page-break-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .page-break-before {
            page-break-before: always !important;
            break-before: page !important;
          }
        }
      `}</style>
    </div>
  );
}
