// components/templates/ClassicTemplate.tsx
"use client";

import { ResumeData } from "@/types/resume";
import { ThemeConfig } from "@/store/themeStore";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
  theme: ThemeConfig;
}

export default function ClassicTemplate({ data, theme }: TemplateProps) {
  const { personal, summary, experience, education, projects, skills, achievements, certificates, languages, interests } = data;
  const { fontFamily, primaryColor, secondaryColor, textColor, backgroundColor, spacing, fontSize, sectionOrder } = theme;

  const getSpacingClass = () => {
    switch (spacing) {
      case "compact":
        return "py-1.5 gap-1 my-1.5";
      case "loose":
        return "py-3 gap-2 my-3.5";
      default:
        return "py-2.5 gap-1.5 my-2.5";
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case "sm":
        return "text-[11px] leading-relaxed";
      case "lg":
        return "text-[14px] leading-relaxed";
      default:
        return "text-[12.5px] leading-relaxed";
    }
  };

  const spacingClass = getSpacingClass();
  const fontSizeClass = getFontSizeClass();

  const activeFont = fontFamily || "Merriweather";
  const fontImport = `@import url('https://fonts.googleapis.com/css2?family=${activeFont.replace(/\s+/g, "+")}:wght@300;400;750;900&display=swap');`;

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "summary":
        if (!summary) return null;
        return (
          <div key={sectionId} className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
              Summary
            </h3>
            <p className={fontSizeClass} style={{ color: textColor }}>
              {summary}
            </p>
          </div>
        );

      case "experience":
        if (experience.length === 0) return null;
        return (
          <div key={sectionId} className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
              Experience
            </h3>
            <div className="flex flex-col gap-3">
              {experience.map((exp) => (
                <div key={exp.id} className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-center text-xs font-bold text-zinc-900">
                    <span>{exp.role}</span>
                    <span className="text-zinc-500 font-semibold">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div className="text-[11.5px] font-semibold text-zinc-600 italic">
                    {exp.company}
                  </div>
                  <ul className="list-disc ml-4 mt-1 flex flex-col gap-1 text-zinc-700">
                    {exp.description.map((desc, dIdx) => (
                      <li key={dIdx} className={fontSizeClass}>
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case "projects":
        if (projects.length === 0) return null;
        return (
          <div key={sectionId} className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
              Projects
            </h3>
            <div className="flex flex-col gap-3">
              {projects.map((proj) => (
                <div key={proj.id} className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-center text-xs font-bold text-zinc-900">
                    <div className="flex items-center gap-1.5">
                      <span>{proj.title}</span>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className={`${fontSizeClass} text-zinc-700 mt-0.5`}>
                    {proj.description}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">
                    Technologies: {proj.technologies.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case "education":
        if (education.length === 0) return null;
        return (
          <div key={sectionId} className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
              Education
            </h3>
            <div className="flex flex-col gap-2.5">
              {education.map((edu) => (
                <div key={edu.id} className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-center text-xs font-bold text-zinc-900">
                    <span>{edu.institution}</span>
                    <span className="text-zinc-500 font-semibold">{edu.startDate} – {edu.endDate}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11.5px] text-zinc-600">
                    <span>{edu.degree}</span>
                    {edu.score && <span className="font-semibold text-zinc-500">GPA: {edu.score}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "skills":
        if (skills.length === 0) return null;
        return (
          <div key={sectionId} className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
              Skills & Expertise
            </h3>
            <div className="flex flex-col gap-1.5">
              {skills.map((skillGroup, idx) => (
                <div key={idx} className="flex text-xs leading-relaxed">
                  <span className="font-bold text-zinc-800 w-1/4 min-w-[120px] shrink-0">{skillGroup.category}:</span>
                  <span className="text-zinc-700 w-3/4">{skillGroup.items.join(", ")}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "achievements":
        if (achievements.length === 0) return null;
        return (
          <div key={sectionId} className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
              Awards & Honors
            </h3>
            <div className="flex flex-col gap-2">
              {achievements.map((ach) => (
                <div key={ach.id} className="flex justify-between items-start text-xs text-zinc-700">
                  <div>
                    <span className="font-bold text-zinc-900">{ach.title}</span>
                    {ach.description && <span className="text-zinc-500 font-normal"> ({ach.description})</span>}
                  </div>
                  <span className="text-zinc-500 font-semibold shrink-0 ml-4">{ach.date}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "certificates":
        if (certificates.length === 0) return null;
        return (
          <div key={sectionId} className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
              Certifications
            </h3>
            <div className="flex flex-col gap-2">
              {certificates.map((cert) => (
                <div key={cert.id} className="flex justify-between items-center text-xs text-zinc-700">
                  <div>
                    <span className="font-bold text-zinc-900">{cert.name}</span>
                    <span className="text-zinc-500 font-normal"> — {cert.issuer}</span>
                  </div>
                  <span className="text-zinc-500 font-semibold">{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "languages":
        if (languages.length === 0) return null;
        return (
          <div key={sectionId} className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
              Languages
            </h3>
            <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs">
              {languages.map((lang, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="font-bold text-zinc-800">{lang.name}</span>
                  <span className="text-zinc-500 font-normal">({lang.proficiency})</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "interests":
        if (interests.length === 0) return null;
        return (
          <div key={sectionId} className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
              Interests
            </h3>
            <p className="text-xs text-zinc-700">
              {interests.join(", ")}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="p-12 w-full min-h-[1123px] text-zinc-900 bg-white flex flex-col gap-6"
      style={{ 
        fontFamily: `'${activeFont}', serif`,
        color: textColor || "#0f172a",
        backgroundColor: backgroundColor || "#ffffff"
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `${fontImport}` }} />

      <header className="flex justify-between items-end border-b-2 pb-6" style={{ borderColor: primaryColor }}>
        <div className="flex items-center gap-4">
          {personal.photoUrl && (
            <img 
              src={personal.photoUrl} 
              alt={personal.fullName}
              className="h-16 w-16 rounded-full object-cover border border-zinc-200"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 leading-none">
              {personal.fullName || "Your Full Name"}
            </h1>
            <p className="text-sm font-semibold tracking-wide mt-2" style={{ color: primaryColor }}>
              {personal.jobTitle || "Job Title"}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-[10.5px] text-zinc-600 font-medium">
          {personal.email && (
            <span>{personal.email}</span>
          )}
          {personal.phone && (
            <span>{personal.phone}</span>
          )}
          {personal.location && (
            <span>{personal.location}</span>
          )}
          {(personal.website || personal.github || personal.linkedin) && (
            <div className="flex gap-2.5 mt-0.5 text-zinc-500">
              {personal.website && (
                <a href={personal.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Portfolio
                </a>
              )}
              {personal.github && (
                <a href={personal.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  GitHub
                </a>
              )}
              {personal.linkedin && (
                <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      {sectionOrder.map((secId) => renderSection(secId))}
    </div>
  );
}
