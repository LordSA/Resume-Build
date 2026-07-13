"use client";

import { ResumeData } from "@/types/resume";
import { ThemeConfig } from "@/store/themeStore";

interface TemplateProps {
  data: ResumeData;
  theme: ThemeConfig;
}

export default function AtsTemplate({ data, theme }: TemplateProps) {
  const { personal, summary, experience, education, projects, skills, achievements, certificates, languages, interests } = data;
  const { fontFamily, primaryColor, textColor, backgroundColor, spacing, fontSize, sectionOrder } = theme;

  const getSpacingClass = () => {
    switch (spacing) {
      case "compact":
        return "py-1 gap-1 my-1";
      case "loose":
        return "py-2.5 gap-2 my-2.5";
      default:
        return "py-2 gap-1.5 my-2";
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case "sm":
        return "text-[10px] leading-relaxed";
      case "lg":
        return "text-[13px] leading-relaxed";
      default:
        return "text-[11.5px] leading-relaxed";
    }
  };

  const spacingClass = getSpacingClass();
  const fontSizeClass = getFontSizeClass();

  const activeFont = theme.customFontName || fontFamily || "Inter";
  const fontImport = theme.customFontName && theme.customFontUrl
    ? `@font-face {
        font-family: '${theme.customFontName}';
        src: url('${theme.customFontUrl}');
        font-weight: normal;
        font-style: normal;
      }`
    : `@import url('https://fonts.googleapis.com/css2?family=${activeFont.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800&display=swap');`;

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "summary":
        if (!summary) return null;
        return (
          <div key={sectionId} className={`flex flex-col gap-1.5 break-inside-avoid ${spacingClass}`}>
            <p className={fontSizeClass} style={{ color: textColor }}>
              {summary}
            </p>
          </div>
        );

      case "skills":
        if (skills.length === 0) return null;
        return (
          <div key={sectionId} className={`flex flex-col gap-2 break-inside-avoid ${spacingClass}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: primaryColor }}>
              Core Competencies
            </h3>
            <div className="grid grid-cols-3 gap-x-6 gap-y-1 mt-1 text-[11px] text-zinc-700">
              {skills.flatMap(s => s.items).map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: primaryColor }} />
                  <span className={fontSizeClass} style={{ color: textColor }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "experience":
        if (experience.length === 0) return null;
        return (
          <div key={sectionId} className={`flex flex-col gap-2 ${spacingClass}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 break-inside-avoid" style={{ color: primaryColor, borderColor: primaryColor }}>
              Professional Experience
            </h3>
            <div className="flex flex-col gap-4">
              {experience.map((exp) => (
                <div key={exp.id} className="flex flex-col gap-0.5 break-inside-avoid">
                  <div className="flex justify-between items-center text-xs font-bold text-zinc-900">
                    <span className="uppercase">{exp.role}</span>
                    <span style={{ color: textColor }}>{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-zinc-600 italic">
                    {exp.company}
                  </div>
                  <ul className="list-none ml-2 mt-1.5 flex flex-col gap-1.5">
                    {exp.description.map((desc, dIdx) => (
                      <li key={dIdx} className={`flex items-start gap-2 ${fontSizeClass}`} style={{ color: textColor }}>
                        <span className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: primaryColor }} />
                        <span>{desc}</span>
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
          <div key={sectionId} className={`flex flex-col gap-2 ${spacingClass}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 break-inside-avoid" style={{ color: primaryColor, borderColor: primaryColor }}>
              Projects
            </h3>
            <div className="flex flex-col gap-3">
              {projects.map((proj) => (
                <div key={proj.id} className="flex flex-col gap-0.5 break-inside-avoid">
                  <div className="flex justify-between items-center text-xs font-bold text-zinc-900">
                    <span className="uppercase">{proj.title}</span>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-zinc-500 hover:text-blue-500 underline">
                        Link
                      </a>
                    )}
                  </div>
                  <p className={`${fontSizeClass} text-zinc-700 mt-1`} style={{ color: textColor }}>
                    {proj.description}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-semibold mt-1">
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
          <div key={sectionId} className={`flex flex-col gap-2 ${spacingClass}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5 break-inside-avoid" style={{ color: primaryColor, borderColor: primaryColor }}>
              Professional Education
            </h3>
            <div className="flex flex-col gap-3">
              {education.map((edu) => (
                <div key={edu.id} className="grid grid-cols-12 gap-4 break-inside-avoid">
                  <div className="col-span-3 text-[11px] font-bold text-zinc-500">
                    {edu.startDate} – {edu.endDate}
                  </div>
                  <div className="col-span-9 flex flex-col gap-0.5">
                    <div className="text-[11.5px] font-bold uppercase text-zinc-900">{edu.degree}</div>
                    <div className="text-[11px] text-zinc-600 font-semibold italic">{edu.institution}</div>
                    {edu.score && <div className="text-[10px] text-zinc-500 font-medium">Score: {edu.score}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "certificates":
        if (certificates.length === 0) return null;
        return (
          <div key={sectionId} className={`flex flex-col gap-2 break-inside-avoid ${spacingClass}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: primaryColor }}>
              Professional Certifications
            </h3>
            <ul className="list-none ml-2 mt-1 flex flex-col gap-1.5">
              {certificates.map((cert) => (
                <li key={cert.id} className={`flex items-start gap-2 ${fontSizeClass}`} style={{ color: textColor }}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: primaryColor }} />
                  <span>
                    <span className="font-bold text-zinc-900">{cert.name}</span>
                    <span className="text-zinc-650"> — {cert.issuer}</span>
                    {cert.date && <span className="text-zinc-500 text-[10px]"> ({cert.date})</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );

      case "languages":
      case "interests":
        if (languages.length === 0 && interests.length === 0) return null;
        if (sectionId === "interests" && sectionOrder.includes("languages")) return null;

        return (
          <div key="personal-details" className={`flex flex-col gap-2 break-inside-avoid ${spacingClass}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: primaryColor }}>
              Personal Details & Availability
            </h3>
            <ul className="list-none ml-2 mt-1 flex flex-col gap-1.5">
              {languages.length > 0 && (
                <li className={`flex items-start gap-2 ${fontSizeClass}`} style={{ color: textColor }}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: primaryColor }} />
                  <span>
                    <span className="font-bold text-zinc-900">Languages Known: </span>
                    <span>{languages.map(l => `${l.name} (${l.proficiency})`).join(", ")}</span>
                  </span>
                </li>
              )}
              {interests.length > 0 && (
                <li className={`flex items-start gap-2 ${fontSizeClass}`} style={{ color: textColor }}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: primaryColor }} />
                  <span>
                    <span className="font-bold text-zinc-900">Interests: </span>
                    <span>{interests.join(", ")}</span>
                  </span>
                </li>
              )}
            </ul>
          </div>
        );

      default:
        return null;
    }
  };

  const contactItems = [
    personal.location,
    personal.phone,
    personal.email ? (
      <a key="email" href={`mailto:${personal.email}`} className="text-blue-600 hover:underline">
        {personal.email}
      </a>
    ) : null,
    personal.linkedin ? (
      <a key="linkedin" href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        LinkedIn
      </a>
    ) : null,
    personal.website ? (
      <a key="website" href={personal.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        Portfolio
      </a>
    ) : null,
    personal.github ? (
      <a key="github" href={personal.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        GitHub
      </a>
    ) : null,
  ].filter(Boolean);

  return (
    <div
      className="px-12 pt-10 pb-10 print:pt-2 print:pb-0 w-full min-h-[1123px] text-zinc-900 bg-white flex flex-col gap-4"
      style={{
        fontFamily: `'${activeFont}', sans-serif`,
        color: textColor || "#0f172a",
        backgroundColor: backgroundColor || "#ffffff"
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `${fontImport}` }} />

      <header className="flex flex-col items-center text-center gap-1.5 pb-2">
        <h1 className="text-2xl font-bold tracking-wide text-zinc-900 uppercase">
          {personal.fullName || "Your Full Name"}
        </h1>
        {personal.jobTitle && (
          <p className="text-[11px] font-bold tracking-widest uppercase text-zinc-650">
            {personal.jobTitle}
          </p>
        )}
        {contactItems.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-[10.5px] text-zinc-550 mt-1 font-medium">
            {contactItems.map((item, idx) => (
              <span key={idx} className="flex items-center">
                {idx > 0 && <span className="mx-2 text-zinc-300">|</span>}
                {item}
              </span>
            ))}
          </div>
        )}
      </header>

      <hr className="border-t border-zinc-200 my-1" />

      {sectionOrder.map((secId) => renderSection(secId))}
    </div>
  );
}
