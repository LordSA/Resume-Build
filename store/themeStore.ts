import { create } from "zustand";

export interface ThemeConfig {
  fontFamily: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  spacing: "compact" | "comfortable" | "loose";
  borderRadius: "none" | "small" | "medium" | "large";
  fontSize: "sm" | "base" | "lg";
  sectionOrder: string[];
  customFontName?: string;
  customFontUrl?: string;
}

interface ThemeState {
  themeConfig: ThemeConfig;
  setTheme: (theme: Partial<ThemeConfig>) => void;
  updateThemeField: <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => void;
  setSectionOrder: (order: string[]) => void;
  resetTheme: () => void;
}

const defaultTheme: ThemeConfig = {
  fontFamily: "Inter",
  primaryColor: "#2563eb",
  secondaryColor: "#64748b",
  textColor: "#0f172a",
  backgroundColor: "#ffffff",
  spacing: "comfortable",
  borderRadius: "medium",
  fontSize: "base",
  sectionOrder: [
    "personal",
    "summary",
    "experience",
    "education",
    "projects",
    "skills",
    "achievements",
    "certificates",
    "languages",
    "interests",
  ],
  customFontName: "",
  customFontUrl: "",
};

export const useThemeStore = create<ThemeState>((set) => ({
  themeConfig: defaultTheme,

  setTheme: (theme) =>
    set((state) => ({
      themeConfig: { ...state.themeConfig, ...theme },
    })),

  updateThemeField: (key, value) =>
    set((state) => ({
      themeConfig: { ...state.themeConfig, [key]: value },
    })),

  setSectionOrder: (order) =>
    set((state) => ({
      themeConfig: { ...state.themeConfig, sectionOrder: order },
    })),

  resetTheme: () => set({ themeConfig: defaultTheme }),
}));
