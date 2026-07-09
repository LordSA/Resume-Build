"use client";

import { ResumeData } from "@/types/resume";
import { ThemeConfig } from "@/store/themeStore";
import ModernTemplate from "../templates/ModernTemplate";
import MinimalTemplate from "../templates/MinimalTemplate";
import ClassicTemplate from "../templates/ClassicTemplate";
import AtsTemplate from "../templates/AtsTemplate";

interface TemplateRendererProps {
  data: ResumeData | null;
  template: string;
  theme: ThemeConfig;
}

export default function TemplateRenderer({ data, template, theme }: TemplateRendererProps) {
  if (!data) return null;

  switch (template) {
    case "modern":
      return <ModernTemplate data={data} theme={theme} />;
    case "minimal":
      return <MinimalTemplate data={data} theme={theme} />;
    case "classic":
      return <ClassicTemplate data={data} theme={theme} />;
    case "ats":
      return <AtsTemplate data={data} theme={theme} />;
    default:
      return <ModernTemplate data={data} theme={theme} />;
  }
}
