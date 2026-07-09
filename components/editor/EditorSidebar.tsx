"use client";

import { useEditorStore } from "@/store/editorStore";
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
  Gauge,
  ChevronLeft,
  ChevronRight
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

const SIDEBAR_TABS = [
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
  { id: "ai", icon: Gauge, label: "ATS Match" },
];

export default function EditorSidebar() {
  const { activeSection, setActiveSection, sidebarOpen, toggleSidebar } = useEditorStore();

  const renderPanel = () => {
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
    <div className="relative flex h-full shrink-0 select-none z-20 print:hidden">
      <div className={`flex h-full transition-all duration-300 ${sidebarOpen ? "w-[480px]" : "w-0"}`}>
        <div className="flex h-full w-[80px] flex-col items-center gap-1.5 border-r border-zinc-850 bg-zinc-950 py-4 overflow-y-auto overflow-x-hidden shrink-0 scrollbar-none">
          {SIDEBAR_TABS.map((tab) => {
            const isActive = activeSection === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
                }`}
                title={tab.label}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="absolute left-[64px] rounded-lg bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-md whitespace-nowrap z-50">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 h-full border-r border-zinc-850 bg-zinc-900/30 overflow-y-auto px-6 py-6 scrollbar-none">
          {renderPanel()}
        </div>
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -translate-y-1/2 -right-4 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white transition-all shadow-md z-30"
      >
        {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
    </div>
  );
}
