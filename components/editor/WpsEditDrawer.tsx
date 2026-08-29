"use client";

import { useEditorStore } from "@/store/editorStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  FolderGit,
  Layers,
  Trophy,
  Award,
  Globe,
  Heart,
  Palette,
  LayoutGrid,
  Sparkles,
  X,
  ChevronDown
} from "lucide-react";

import PersonalPanel from "./panels/PersonalPanel";
import SummaryPanel from "./panels/SummaryPanel";
import ExperiencePanel from "./panels/ExperiencePanel";
import EducationPanel from "./panels/EducationPanel";
import ProjectsPanel from "./panels/ProjectsPanel";
import SkillsPanel from "./panels/SkillsPanel";
import AchievementsPanel from "./panels/AchievementsPanel";
import CertificatesPanel from "./panels/CertificatesPanel";
import LanguagesPanel from "./panels/LanguagesPanel";
import InterestsPanel from "./panels/InterestsPanel";
import ThemePanel from "./panels/ThemePanel";
import TemplatesPanel from "./panels/TemplatesPanel";
import AIPanel from "./panels/AIPanel";

const SECTIONS = [
  { id: "personal", icon: User, label: "Personal" },
  { id: "summary", icon: FileText, label: "Summary" },
  { id: "experience", icon: Briefcase, label: "Experience" },
  { id: "education", icon: GraduationCap, label: "Education" },
  { id: "projects", icon: FolderGit, label: "Projects" },
  { id: "skills", icon: Layers, label: "Skills" },
  { id: "achievements", icon: Trophy, label: "Awards" },
  { id: "certificates", icon: Award, label: "Certificates" },
  { id: "languages", icon: Globe, label: "Languages" },
  { id: "interests", icon: Heart, label: "Interests" },
  { id: "theme", icon: Palette, label: "Theme" },
  { id: "templates", icon: LayoutGrid, label: "Templates" },
  { id: "ai", icon: Sparkles, label: "ATS Match" },
];

interface WpsEditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WpsEditDrawer({ isOpen, onClose }: WpsEditDrawerProps) {
  const { activeSection, setActiveSection } = useEditorStore();

  const currentTab = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];

  const renderActivePanel = () => {
    switch (activeSection) {
      case "personal":
        return <PersonalPanel />;
      case "summary":
        return <SummaryPanel />;
      case "experience":
        return <ExperiencePanel />;
      case "education":
        return <EducationPanel />;
      case "projects":
        return <ProjectsPanel />;
      case "skills":
        return <SkillsPanel />;
      case "achievements":
        return <AchievementsPanel />;
      case "certificates":
        return <CertificatesPanel />;
      case "languages":
        return <LanguagesPanel />;
      case "interests":
        return <InterestsPanel />;
      case "theme":
        return <ThemePanel />;
      case "templates":
        return <TemplatesPanel />;
      case "ai":
        return <AIPanel />;
      default:
        return <PersonalPanel />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col max-h-[82vh] h-[82vh] bg-zinc-950 border-t border-zinc-800 rounded-t-[28px] shadow-2xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col items-center pt-2.5 pb-1 cursor-grab shrink-0">
              <div className="w-12 h-1.5 rounded-full bg-zinc-700/80" />
            </div>

            <div className="flex items-center justify-between px-5 py-2.5 border-b border-zinc-850/80 shrink-0">
              <div className="flex items-center gap-2">
                <currentTab.icon className="h-4 w-4 text-blue-400" />
                <span className="font-bold text-sm text-white">{currentTab.label}</span>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center h-7 w-7 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 px-4 py-2 border-b border-zinc-850/60 overflow-x-auto scrollbar-none shrink-0 bg-zinc-900/30">
              {SECTIONS.map((tab) => {
                const isActive = activeSection === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:text-white"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 pb-20 scrollbar-thin">
              {renderActivePanel()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
