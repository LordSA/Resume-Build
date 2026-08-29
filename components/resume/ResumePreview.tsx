"use client";

import { useResumeStore } from "@/store/resumeStore";
import { useEffect, useRef, useState, useCallback } from "react";
import { useThemeStore } from "@/store/themeStore";
import { useEditorStore } from "@/store/editorStore";
import TemplateRenderer from "./TemplateRenderer";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export default function ResumePreview() {
  const { resumeData, template } = useResumeStore();
  const { themeConfig } = useThemeStore();
  const { previewZoom, setPreviewZoom } = useEditorStore();
  const [totalPages, setTotalPages] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
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

  const getOptimalScale = useCallback((width: number) => {
    if (width <= 0) return 0.45;
    if (width < 768) {
      const padding = width < 420 ? 16 : 32;
      const availableWidth = width - padding;
      const targetScale = availableWidth / 794;
      return Math.max(0.35, Math.min(0.85, Number(targetScale.toFixed(2))));
    }
    return 1.0;
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const initialWidth = window.innerWidth;
      setContainerWidth(initialWidth);
      if (initialWidth < 768) {
        setPreviewZoom(getOptimalScale(initialWidth));
      }
    }
  }, [getOptimalScale, setPreviewZoom]);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const handleResize = () => {
      if (wrapperRef.current) {
        const w = wrapperRef.current.clientWidth;
        setContainerWidth(w);
        if (w < 768 && w > 0) {
          const optimalScale = getOptimalScale(w);
          setPreviewZoom(optimalScale);
        }
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [getOptimalScale, setPreviewZoom]);

  if (!resumeData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0d0f17] text-zinc-500 text-xs">
        No active resume data loaded
      </div>
    );
  }

  const handleZoomIn = () => setPreviewZoom(Number(Math.min(previewZoom + 0.05, 1.4).toFixed(2)));
  const handleZoomOut = () => setPreviewZoom(Number(Math.max(previewZoom - 0.05, 0.3).toFixed(2)));
  const handleZoomReset = () => {
    if (containerWidth > 0 && containerWidth < 768) {
      setPreviewZoom(getOptimalScale(containerWidth));
    } else {
      setPreviewZoom(1.0);
    }
  };

  const scaledWidth = Math.round(794 * previewZoom);
  const scaledHeight = Math.round(totalPages * 1123 * previewZoom);

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
          <span className="text-[9px] sm:text-[10px] font-bold text-zinc-300 px-1 w-9 sm:w-11 text-center select-none font-mono">
            {Math.round(previewZoom * 100)}%
          </span>
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
        className="flex-1 overflow-x-hidden overflow-y-auto p-2 sm:p-8 pb-28 md:pb-8 flex justify-center items-start bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#131624] via-[#0d0f17] to-[#0a0b12] scrollbar-thin print:p-0 print:bg-white print:overflow-visible"
      >
        <div
          className="relative transition-all duration-75 print:w-auto print:h-auto shrink-0 flex justify-center my-auto sm:my-0"
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            maxWidth: "100%",
          }}
        >
          <div
            className="resume-print-container shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-transform duration-75 print:shadow-none print:transform-none absolute top-0 left-0 rounded-sm"
            style={{
              transform: `scale(${previewZoom})`,
              transformOrigin: "top left",
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

      <style jsx global>{`
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
