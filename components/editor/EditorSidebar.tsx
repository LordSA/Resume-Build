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
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus, 
  LayoutGrid
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
import TemplatesPanel from "./panels/TemplatesPanel";

const ACCORDION_SECTIONS = [
  { id: "personal", icon: User, title: "Personal Information", component: PersonalPanel },
  { id: "summary", icon: FileText, title: "Professional Summary", component: SummaryPanel },
  { id: "experience", icon: Briefcase, title: "Employment History", component: ExperiencePanel },
  { id: "education", icon: GraduationCap, title: "Education", component: EducationPanel },
  { id: "projects", icon: FolderGit, title: "Projects & Portfolio", component: ProjectsPanel },
  { id: "skills", icon: Layers, title: "Skills & Expertise", component: SkillsPanel },
  { id: "certificates", icon: Award, title: "Certifications", component: CertificatesPanel },
  { id: "achievements", icon: Trophy, title: "Awards & Honours", component: AchievementsPanel },
  { id: "languages", icon: Globe, title: "Languages", component: LanguagesPanel },
  { id: "interests", icon: Heart, title: "Hobbies & Interests", component: InterestsPanel },
];

export default function EditorSidebar() {
  const { 
    activeSection, 
    setActiveSection, 
    sidebarOpen, 
    toggleSidebar,
    activeLeftTab,
    setActiveLeftTab
  } = useEditorStore();

  const handleToggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? "" : sectionId);
  };

  return (
    <div className="relative hidden md:flex h-full shrink-0 select-none z-20 print:hidden">
      <div className={`flex flex-col h-full bg-[#12141f] border-r border-[#1f2333] transition-all duration-300 ${sidebarOpen ? "w-[330px] xl:w-[380px]" : "w-0 overflow-hidden"}`}>
        
        <div className="p-3 border-b border-[#1f2333] shrink-0 bg-[#12141f]">
          <div className="grid grid-cols-2 p-1 bg-[#181b28] border border-[#262a3d] rounded-xl shadow-inner">
            <button
              onClick={() => setActiveLeftTab("content")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLeftTab === "content"
                  ? "bg-[#25293d] text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <FileText className="h-3.5 w-3.5 text-blue-400" />
              <span>Content</span>
            </button>
            <button
              onClick={() => setActiveLeftTab("templates")}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLeftTab === "templates"
                  ? "bg-[#25293d] text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5 text-indigo-400" />
              <span>Templates</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin flex flex-col gap-2.5 bg-[#12141f]">
          {activeLeftTab === "templates" ? (
            <TemplatesPanel />
          ) : (
            ACCORDION_SECTIONS.map((section) => {
              const isOpen = activeSection === section.id;
              const Icon = section.icon;
              const PanelComponent = section.component;

              return (
                <div 
                  key={section.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm shrink-0 ${
                    isOpen 
                      ? "border-blue-500/30 bg-[#181b28] shadow-lg shadow-black/30" 
                      : "border-[#212435] bg-[#161824] hover:border-[#2d3247] hover:bg-[#1a1c2b]"
                  }`}
                >
                  <button
                    onClick={() => handleToggleSection(section.id)}
                    className="flex items-center justify-between w-full px-3.5 py-3 min-h-[46px] text-left transition-colors cursor-pointer shrink-0"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 transition-all ${
                        isOpen 
                          ? "bg-blue-600/20 border border-blue-500/30 text-blue-400" 
                          : "bg-[#1f2334] border border-[#2a2f45] text-zinc-400"
                      }`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className={`text-xs font-bold tracking-tight truncate ${
                        isOpen ? "text-white" : "text-zinc-300"
                      }`}>
                        {section.title}
                      </span>
                    </div>

                    <div className="flex items-center justify-center h-5 w-5 rounded text-zinc-500 hover:text-white shrink-0">
                      {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="p-3.5 pt-1 border-t border-[#23273a] bg-[#141622]/90">
                          <PanelComponent />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -translate-y-1/2 -right-3.5 flex h-7 w-7 items-center justify-center rounded-full border border-[#262a3d] bg-[#181b28] text-zinc-400 hover:text-white hover:border-[#353b54] transition-all shadow-md z-30 cursor-pointer"
        title={sidebarOpen ? "Collapse Panel" : "Expand Panel"}
      >
        {sidebarOpen ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
