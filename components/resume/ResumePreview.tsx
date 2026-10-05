"use client";

import { useResumeStore } from "@/store/resumeStore";
import { useEffect, useRef, useState, useMemo } from "react";
import { useThemeStore } from "@/store/themeStore";
import { useEditorStore } from "@/store/editorStore";
import TemplateRenderer from "./TemplateRenderer";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export default function ResumePreview() {
  const { resumeData, template } = useResumeStore();
  const { themeConfig } = useThemeStore();
  const { previewZoom, setPreviewZoom } = useEditorStore();
  const [totalPages, setTotalPages] = useState(1);
  const [containerWidth, setContainerWidth] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth;
    }
    return 794;
  });
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        setTotalPages(Math.max(1, Math.ceil(height / 1123)));
      }
    });

    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [resumeData]);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const handleResize = () => {
      if (wrapperRef.current) {
        const w = wrapperRef.current.clientWidth;
        if (w > 0) {
          setContainerWidth(w);
        }
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  const baseScale = useMemo(() => {
    if (containerWidth <= 0) return 0.45;
    if (containerWidth < 768) {
      const padding = containerWidth < 400 ? 20 : 32;
      const availableWidth = Math.max(containerWidth - padding, 260);
      return Math.min(1.0, Math.max(0.3, Number((availableWidth / 794).toFixed(3))));
    }
    const padding = 48;
    const availableWidth = Math.max(containerWidth - padding, 320);
    if (availableWidth < 794) {
      return Math.min(1.0, Math.max(0.4, Number((availableWidth / 794).toFixed(3))));
    }
    return 1.0;
  }, [containerWidth]);

  const effectiveScale = Number((baseScale * previewZoom).toFixed(3));
  const scaledWidth = Math.round(794 * effectiveScale);
  const scaledHeight = Math.round(totalPages * 1123 * effectiveScale);

  if (!resumeData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0d0f17] text-zinc-500 text-xs">
        No active resume data loaded
      </div>
    );
  }

  const handleZoomIn = () => setPreviewZoom(Number(Math.min(previewZoom + 0.1, 2.0).toFixed(2)));
  const handleZoomOut = () => setPreviewZoom(Number(Math.max(previewZoom - 0.1, 0.5).toFixed(2)));
  const handleZoomReset = () => setPreviewZoom(1.0);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#0d0f17] overflow-hidden relative print:p-0 print:bg-white print:overflow-visible">
      <div className="flex items-center justify-between px-3 sm:px-6 py-2 bg-[#12141f]/80 border-b border-[#1f2333] shrink-0 print:hidden z-10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider hidden sm:inline">Live Canvas</span>
          <span className="text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/25 px-2.5 py-0.5 rounded-full shadow-inner">
            {totalPages} {totalPages === 1 ? "Page" : "Pages"}
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 bg-[#181b28] border border-[#25293d] p-0.5 rounded-xl shadow-sm">
          <button
            onClick={handleZoomOut}
            className="p-1 sm:p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-[#222638] transition-all cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
          <button
            onClick={handleZoomReset}
            className="text-[9px] sm:text-[10px] font-bold text-zinc-300 hover:text-white px-1 sm:px-1.5 py-0.5 rounded hover:bg-[#222638] transition-all w-9 sm:w-12 text-center select-none font-mono cursor-pointer"
            title="Reset to 100% (Fit to Screen)"
          >
            {Math.round(previewZoom * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1 sm:p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-[#222638] transition-all cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
          <div className="h-3.5 sm:h-4 w-[1px] bg-[#2a2f45] mx-0.5"></div>
          <button
            onClick={handleZoomReset}
            className="p-1 sm:p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-[#222638] transition-all cursor-pointer"
            title="Fit to Screen"
          >
            <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>
      </div>

      <div 
        ref={wrapperRef}
        data-lenis-prevent
        className="flex-1 overflow-auto p-3 sm:p-8 pb-6 sm:pb-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#131624] via-[#0d0f17] to-[#0a0b12] overscroll-contain scrollbar-thin print:p-0 print:bg-white print:overflow-visible"
      >
        <div className="min-h-full w-fit min-w-full flex items-center justify-center py-2 sm:py-6">
          <div
            className="relative transition-all duration-150 print:w-auto print:h-auto shrink-0"
            style={{
              width: `${scaledWidth}px`,
              height: `${scaledHeight}px`,
            }}
          >
            <div
              className="resume-print-container shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-transform duration-150 print:shadow-none print:transform-none absolute top-0 left-1/2 rounded-sm origin-top"
              style={{
                transform: `translateX(-50%) scale(${effectiveScale})`,
                width: "794px",
              }}
            >
              <div id="resume-print-area" ref={contentRef} className="w-full h-full bg-white text-zinc-900 rounded-sm" style={{ minHeight: `${totalPages * 1123}px` }}>
                <div className="absolute inset-0 pointer-events-none print:hidden z-50">
                  {Array.from({ length: totalPages - 1 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-full border-b-2 border-dashed border-blue-500/60 flex items-center justify-center"
                      style={{ top: `${(i + 1) * 1123}px` }}
                    >
                      <span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-bold -translate-y-1/2 shadow-lg uppercase tracking-widest">
                        Page {i + 2}
                      </span>
                    </div>
                  ))}
                </div>
                <TemplateRenderer
                  data={resumeData}
                  template={template}
                  theme={themeConfig}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @page {
          size: A4 portrait;
          margin: 15mm 0;
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
