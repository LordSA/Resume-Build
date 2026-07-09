"use client";

import { useRef, useState } from "react";
import { useThemeStore } from "@/store/themeStore";
import DndSectionList from "../DndSectionList";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { createClient } from "@/lib/client";

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
  const [customFontNameInput, setCustomFontNameInput] = useState("");
  const [isUploadingFont, setIsUploadingFont] = useState(false);
  const fontFileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (key: any, value: any) => {
    updateThemeField(key, value);
  };

  const applyPalette = (primary: string, secondary: string) => {
    setTheme({ primaryColor: primary, secondaryColor: secondary });
  };

  const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!customFontNameInput.trim()) {
      toast.error("Please enter a Font Family Name first");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Font file exceeds 5MB size limit");
      return;
    }

    setIsUploadingFont(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to upload fonts");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const cleanFontName = customFontNameInput.trim().replace(/\s+/g, "-");
      const filePath = `fonts/${user.id}/${Date.now()}-${cleanFontName}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("resume-assets")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type || "font/*"
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("resume-assets")
        .getPublicUrl(filePath);

      setTheme({
        customFontName: customFontNameInput.trim(),
        customFontUrl: publicUrl,
      });

      toast.success(`Font "${customFontNameInput}" uploaded successfully!`);
      setCustomFontNameInput("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload custom font");
    } finally {
      setIsUploadingFont(false);
      if (fontFileInputRef.current) fontFileInputRef.current.value = "";
    }
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
              onClick={() => {
                setTheme({ customFontName: "", customFontUrl: "" });
                handleFieldChange("fontFamily", font.id);
              }}
              className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                themeConfig.fontFamily === font.id && !themeConfig.customFontName
                  ? "bg-blue-600/15 border-blue-500/40 text-blue-400"
                  : "bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800 text-zinc-400"
              }`}
            >
              {font.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-zinc-850 pt-4">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Custom Font Uploader</label>
        
        {themeConfig.customFontName && themeConfig.customFontUrl ? (
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-blue-500/20 bg-blue-600/5 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-blue-400">Active: {themeConfig.customFontName}</span>
              <span className="text-[10px] text-zinc-500 truncate max-w-[180px]">Url: {themeConfig.customFontUrl}</span>
            </div>
            <button
              onClick={() => {
                setTheme({ customFontName: "", customFontUrl: "" });
                toast.success("Reverted to standard font preset");
              }}
              className="px-2.5 py-1 rounded-lg border border-red-950 hover:bg-red-950/20 text-[10px] font-bold text-red-400 transition-all cursor-pointer"
            >
              Clear
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Font Family Name (e.g. MyFont)"
                value={customFontNameInput}
                onChange={(e) => setCustomFontNameInput(e.target.value.replace(/[^a-zA-Z0-9\s]/g, ""))}
                className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => fontFileInputRef.current?.click()}
                disabled={isUploadingFont || !customFontNameInput.trim()}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white hover:border-zinc-700 transition-all cursor-pointer disabled:opacity-40"
              >
                {isUploadingFont ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Upload File"}
              </button>
            </div>
            <p className="text-[10px] text-zinc-500">
              Requirements: .ttf, .otf, .woff, or .woff2 files (Max 5MB). Enter family name first, then click Upload.
            </p>
            <input
              type="file"
              ref={fontFileInputRef}
              onChange={handleFontUpload}
              accept=".ttf,.otf,.woff,.woff2"
              className="hidden"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-zinc-850 pt-4">
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
