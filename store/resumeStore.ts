import { create } from "zustand";
import { ResumeData } from "@/types/resume";

interface ResumeState {
  resumeId: string | null;
  title: string;
  template: string;
  resumeData: ResumeData | null;
  history: ResumeData[];
  historyIndex: number;
  isSaving: boolean;

  setResume: (id: string, title: string, template: string, data: ResumeData) => void;
  updatePersonal: (personal: Partial<ResumeData["personal"]>) => void;
  updateSummary: (summary: string) => void;
  updateSection: <K extends keyof ResumeData>(key: K, data: ResumeData[K]) => void;

  addExperience: (exp: Omit<ResumeData["experience"][number], "id"> & { id?: string }) => void;
  updateExperience: (id: string, exp: Partial<ResumeData["experience"][number]>) => void;
  deleteExperience: (id: string) => void;

  addEducation: (edu: Omit<ResumeData["education"][number], "id"> & { id?: string }) => void;
  updateEducation: (id: string, edu: Partial<ResumeData["education"][number]>) => void;
  deleteEducation: (id: string) => void;

  addProject: (project: Omit<ResumeData["projects"][number], "id"> & { id?: string }) => void;
  updateProject: (id: string, project: Partial<ResumeData["projects"][number]>) => void;
  deleteProject: (id: string) => void;

  addSkillCategory: (category: string) => void;
  updateSkillCategory: (index: number, category: string, items: string[]) => void;
  deleteSkillCategory: (index: number) => void;

  addAchievement: (ach: Omit<ResumeData["achievements"][number], "id"> & { id?: string }) => void;
  updateAchievement: (id: string, ach: Partial<ResumeData["achievements"][number]>) => void;
  deleteAchievement: (id: string) => void;

  addCertificate: (cert: Omit<ResumeData["certificates"][number], "id"> & { id?: string }) => void;
  updateCertificate: (id: string, cert: Partial<ResumeData["certificates"][number]>) => void;
  deleteCertificate: (id: string) => void;

  addLanguage: (lang: ResumeData["languages"][number]) => void;
  updateLanguage: (index: number, lang: Partial<ResumeData["languages"][number]>) => void;
  deleteLanguage: (index: number) => void;

  updateInterests: (interests: string[]) => void;

  setIsSaving: (isSaving: boolean) => void;
  setTemplate: (template: string) => void;
  setTitle: (title: string) => void;

  undo: () => void;
  redo: () => void;
}

const pushToHistory = (history: ResumeData[], index: number, newData: ResumeData): { history: ResumeData[]; index: number } => {
  const cleanHistory = history.slice(0, index + 1);
  return {
    history: [...cleanHistory, JSON.parse(JSON.stringify(newData))],
    index: cleanHistory.length,
  };
};

export const useResumeStore = create<ResumeState>((set, get) => ({
  resumeId: null,
  title: "Untitled Resume",
  template: "modern",
  resumeData: null,
  history: [],
  historyIndex: -1,
  isSaving: false,

  setResume: (id, title, template, data) => {
    set({
      resumeId: id,
      title,
      template,
      resumeData: data,
      history: [JSON.parse(JSON.stringify(data))],
      historyIndex: 0,
    });
  },

  updatePersonal: (personal) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = {
      ...resumeData,
      personal: { ...resumeData.personal, ...personal },
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  updateSummary: (summary) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = { ...resumeData, summary };
    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  updateSection: (key, data) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = { ...resumeData, [key]: data };
    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  addExperience: (exp) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const newExp = {
      ...exp,
      id: exp.id || Math.random().toString(36).substring(2, 9),
    } as ResumeData["experience"][number];

    const updated = {
      ...resumeData,
      experience: [...resumeData.experience, newExp],
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  updateExperience: (id, exp) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = {
      ...resumeData,
      experience: resumeData.experience.map((item) =>
        item.id === id ? { ...item, ...exp } : item
      ),
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  deleteExperience: (id) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = {
      ...resumeData,
      experience: resumeData.experience.filter((item) => item.id !== id),
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  addEducation: (edu) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const newEdu = {
      ...edu,
      id: edu.id || Math.random().toString(36).substring(2, 9),
    } as ResumeData["education"][number];

    const updated = {
      ...resumeData,
      education: [...resumeData.education, newEdu],
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  updateEducation: (id, edu) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = {
      ...resumeData,
      education: resumeData.education.map((item) =>
        item.id === id ? { ...item, ...edu } : item
      ),
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  deleteEducation: (id) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = {
      ...resumeData,
      education: resumeData.education.filter((item) => item.id !== id),
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  addProject: (project) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const newProject = {
      ...project,
      id: project.id || Math.random().toString(36).substring(2, 9),
    } as ResumeData["projects"][number];

    const updated = {
      ...resumeData,
      projects: [...resumeData.projects, newProject],
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  updateProject: (id, project) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = {
      ...resumeData,
      projects: resumeData.projects.map((item) =>
        item.id === id ? { ...item, ...project } : item
      ),
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  deleteProject: (id) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = {
      ...resumeData,
      projects: resumeData.projects.filter((item) => item.id !== id),
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  addSkillCategory: (category) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = {
      ...resumeData,
      skills: [...resumeData.skills, { category, items: [] }],
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  updateSkillCategory: (index, category, items) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = {
      ...resumeData,
      skills: resumeData.skills.map((item, idx) =>
        idx === index ? { category, items } : item
      ),
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  deleteSkillCategory: (index) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = {
      ...resumeData,
      skills: resumeData.skills.filter((_, idx) => idx !== index),
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  addAchievement: (ach) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const newAch = {
      ...ach,
      id: ach.id || Math.random().toString(36).substring(2, 9),
    } as ResumeData["achievements"][number];

    const updated = {
      ...resumeData,
      achievements: [...resumeData.achievements, newAch],
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  updateAchievement: (id, ach) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = {
      ...resumeData,
      achievements: resumeData.achievements.map((item) =>
        item.id === id ? { ...item, ...ach } : item
      ),
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  deleteAchievement: (id) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = {
      ...resumeData,
      achievements: resumeData.achievements.filter((item) => item.id !== id),
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  addCertificate: (cert) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const newCert = {
      ...cert,
      id: cert.id || Math.random().toString(36).substring(2, 9),
    } as ResumeData["certificates"][number];

    const updated = {
      ...resumeData,
      certificates: [...resumeData.certificates, newCert],
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  updateCertificate: (id, cert) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = {
      ...resumeData,
      certificates: resumeData.certificates.map((item) =>
        item.id === id ? { ...item, ...cert } : item
      ),
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  deleteCertificate: (id) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = {
      ...resumeData,
      certificates: resumeData.certificates.filter((item) => item.id !== id),
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  addLanguage: (lang) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = {
      ...resumeData,
      languages: [...resumeData.languages, lang],
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  updateLanguage: (index, lang) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = {
      ...resumeData,
      languages: resumeData.languages.map((item, idx) =>
        idx === index ? { ...item, ...lang } : item
      ),
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  deleteLanguage: (index) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = {
      ...resumeData,
      languages: resumeData.languages.filter((_, idx) => idx !== index),
    };

    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  updateInterests: (interests) => {
    const { resumeData, history, historyIndex } = get();
    if (!resumeData) return;

    const updated = { ...resumeData, interests };
    const hist = pushToHistory(history, historyIndex, updated);
    set({
      resumeData: updated,
      history: hist.history,
      historyIndex: hist.index,
    });
  },

  setIsSaving: (isSaving) => set({ isSaving }),

  setTemplate: (template) => set({ template }),

  setTitle: (title) => set({ title }),

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      set({
        resumeData: JSON.parse(JSON.stringify(history[prevIndex])),
        historyIndex: prevIndex,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      set({
        resumeData: JSON.parse(JSON.stringify(history[nextIndex])),
        historyIndex: nextIndex,
      });
    }
  },
}));
