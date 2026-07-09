// components/editor/panels/ThemePanel.tsx
"use client";

import { useThemeStore } from "@/store/themeStore";
import DndSectionList from "../DndSectionList";

const FONT_PRESETS = [
  { id: "Inter", label: "Modern (Inter)" },
  { id: "Poppins", label: "Clean (Poppins)" },
  { id: "Roboto", label: "Technical (Roboto)" },
  { id: "Playfair Display", label: "Elegant (Playfair)" },
  { id: "Merriweather", label: "Classic (Merriweather)" },
];

const PALETTES = [
  { id: "slate", label: "Slate", primary: "#1e293b", secondary: "#64748b" },
  { id: "blue", label: "Royal Blue", primary: "#2563eb", secondary: "#1e3a8a" },
  { id: "emerald", label: "Emerald", primary: "#059669", secondary: "#064e3b" },
  { id: "burgundy", label: "Burgundy", primary: "#991b1b", secondary: "#450a0a" },
  { id: "amber", label: "Amber", primary: "#d97706", secondary: "#78350f" },
];

export default function ThemePanel() {
  const { themeConfig, updateThemeField, setTheme } = useThemeStore();

  const handleFieldChange = (key: any, value: any) => {
    updateThemeField(key, value);
  };

  const applyPalette = (primary: string, secondary: string) => {
    setTheme({ primaryColor: primary, secondaryColor: secondary });
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-lg font-bold">Theme & Styling</h3>
        <p className="text-xs text-zinc-400 mt-0.5">Customize the visual layout and styles of your resume</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Typography Font</label>
        <div className="grid grid-cols-2 gap-2">
          {FONT_PRESETS.map((font) => (
            <button
              key={font.id}
              onClick={() => handleFieldChange("fontFamily", font.id)}
              className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                themeConfig.fontFamily === font.id
                  ? "bg-blue-600/15 border-blue-500/40 text-blue-400"
                  : "bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800 text-zinc-400"
              }`}
            >
              {font.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Curated Color Palettes</label>
        <div className="grid grid-cols-2 gap-2">
          {PALETTES.map((palette) => {
            const isActive =
              themeConfig.primaryColor === palette.primary &&
              themeConfig.secondaryColor === palette.secondary;
            return (
              <button
                key={palette.id}
                onClick={() => applyPalette(palette.primary, palette.secondary)}
                className={`flex items-center gap-2.5 py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  isActive
                    ? "bg-blue-600/15 border-blue-500/40 text-blue-400"
                    : "bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800 text-zinc-400"
                }`}
              >
                <div className="flex shrink-0">
                  <div
                    className="h-3 w-3 rounded-full -mr-1 z-10 border border-zinc-950"
                    style={{ backgroundColor: palette.primary }}
                  ></div>
                  <div
                    className="h-3 w-3 rounded-full border border-zinc-950"
                    style={{ backgroundColor: palette.secondary }}
                  ></div>
                </div>
                <span>{palette.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-zinc-850 pt-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Primary Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={themeConfig.primaryColor}
              onChange={(e) => handleFieldChange("primaryColor", e.target.value)}
              className="h-9 w-9 rounded-xl border border-zinc-800 bg-transparent cursor-pointer overflow-hidden p-0"
            />
            <input
              type="text"
              value={themeConfig.primaryColor}
              onChange={(e) => handleFieldChange("primaryColor", e.target.value)}
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-1 text-xs text-white uppercase focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Secondary Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={themeConfig.secondaryColor}
              onChange={(e) => handleFieldChange("secondaryColor", e.target.value)}
              className="h-9 w-9 rounded-xl border border-zinc-800 bg-transparent cursor-pointer overflow-hidden p-0"
            />
            <input
              type="text"
              value={themeConfig.secondaryColor}
              onChange={(e) => handleFieldChange("secondaryColor", e.target.value)}
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-1 text-xs text-white uppercase focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-zinc-850 pt-4">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Spacing / Density</label>
        <div className="grid grid-cols-3 gap-2">
          {["compact", "comfortable", "loose"].map((size) => (
            <button
              key={size}
              onClick={() => handleFieldChange("spacing", size)}
              className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center capitalize transition-all ${
                themeConfig.spacing === size
                  ? "bg-blue-600/15 border-blue-500/40 text-blue-400"
                  : "bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800 text-zinc-400"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Font Size</label>
        <div className="grid grid-cols-3 gap-2">
          {["sm", "base", "lg"].map((size) => (
            <button
              key={size}
              onClick={() => handleFieldChange("fontSize", size)}
              className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center uppercase transition-all ${
                themeConfig.fontSize === size
                  ? "bg-blue-600/15 border-blue-500/40 text-blue-400"
                  : "bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800 text-zinc-400"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Border Radius</label>
        <div className="grid grid-cols-4 gap-2">
          {["none", "small", "medium", "large"].map((radius) => (
            <button
              key={radius}
              onClick={() => handleFieldChange("borderRadius", radius)}
              className={`py-2 px-1 text-xs font-semibold rounded-xl border text-center capitalize transition-all ${
                themeConfig.borderRadius === radius
                  ? "bg-blue-600/15 border-blue-500/40 text-blue-400"
                  : "bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800 text-zinc-400"
              }`}
            >
              {radius}
            </button>
          ))}
        </div>
      </div>

      <DndSectionList />
    </div>
  );
}
