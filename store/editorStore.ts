import { create } from "zustand";

interface EditorState {
  activeSection: string;
  previewZoom: number;
  isAILoading: boolean;
  aiSuggestions: string[];
  sidebarOpen: boolean;

  setActiveSection: (section: string) => void;
  setPreviewZoom: (zoom: number) => void;
  setIsAILoading: (loading: boolean) => void;
  setAISuggestions: (suggestions: string[]) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  activeSection: "personal",
  previewZoom: 1.0,
  isAILoading: false,
  aiSuggestions: [],
  sidebarOpen: true,

  setActiveSection: (activeSection) => set({ activeSection }),
  setPreviewZoom: (previewZoom) => set({ previewZoom }),
  setIsAILoading: (isAILoading) => set({ isAILoading }),
  setAISuggestions: (aiSuggestions) => set({ aiSuggestions }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}));
