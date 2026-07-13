

import { ResumeData } from "@/types/resume";
import { ThemeConfig } from "@/store/themeStore";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
  theme: ThemeConfig;
}

export default function ModernTemplate({ data, theme }: TemplateProps) {
  const { personal, summary, experience, education, projects, skills, achievements, certificates, languages, interests } = data;
  const { fontFamily, primaryColor, secondaryColor, textColor, backgroundColor, spacing, fontSize, borderRadius } = theme;

  const getSpacingClass = () => {
    switch (spacing) {
      case "compact":
        return "gap-3 py-1 my-1.5";
      case "loose":
        return "gap-6 py-3.5 my-3.5";
      default:
        return "gap-4.5 py-2.5 my-2.5";
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

  const activeFont = theme.customFontName || fontFamily || "Inter";
  const fontImport = theme.customFontName && theme.customFontUrl
    ? `@font-face {
        font-family: '${theme.customFontName}';
        src: url('${theme.customFontUrl}');
        font-weight: normal;
        font-style: normal;
      }`
    : `@import url('https://fonts.googleapis.com/css2?family=${activeFont.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800&display=swap');`;

  return (
    <div
      className="px-8 pt-10 pb-10 print:pt-0 print:pb-0 w-full min-h-[1123px] text-zinc-900 bg-white"
      style={{
        fontFamily: `'${activeFont}', sans-serif`,
        color: textColor || "#0f172a",
        backgroundColor: backgroundColor || "#ffffff"
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `${fontImport}` }} />

      <header className="border-b-2 pb-6 flex justify-between items-center gap-4" style={{ borderColor: primaryColor }}>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: primaryColor }}>
            {personal.fullName || "Your Full Name"}
          </h1>
          <p className="text-lg font-semibold tracking-wide" style={{ color: secondaryColor }}>
            {personal.jobTitle || "Job Title"}
          </p>
        </div>
        {personal.photoUrl && (
          <img
            src={personal.photoUrl}
            alt={personal.fullName}
            className="h-20 w-20 rounded-full object-cover border border-zinc-200"
          />
        )}
      </header>

      <div className="grid grid-cols-12 gap-8 mt-6">
        <div className="col-span-4 flex flex-col gap-6">
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}20` }}>
              Contact
            </h3>
            <div className="flex flex-col gap-2 text-[11.5px] text-zinc-600">
              {personal.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0" style={{ color: primaryColor }} />
                  <span className="truncate">{personal.email}</span>
                </div>
              )}
              {personal.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0" style={{ color: primaryColor }} />
                  <span>{personal.phone}</span>
                </div>
              )}
              {personal.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: primaryColor }} />
                  <span>{personal.location}</span>
                </div>
              )}
              {personal.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 shrink-0" style={{ color: primaryColor }} />
                  <a href={personal.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    Website
                  </a>
                </div>
              )}
              {personal.github && (
                <div className="flex items-center gap-2">
                  <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" style={{ color: primaryColor }}>
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <a href={personal.github} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    GitHub
                  </a>
                </div>
              )}
              {personal.linkedin && (
                <div className="flex items-center gap-2">
                  <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" style={{ color: primaryColor }}>
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                    LinkedIn
                  </a>
                </div>
              )}
            </div>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}20` }}>
                Skills
              </h3>
              <div className="flex flex-col gap-3">
                {skills.map((skillGroup, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{skillGroup.category}</h4>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {skillGroup.items.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}20` }}>
                Languages
              </h3>
              <div className="flex flex-col gap-2 text-[11px]">
                {languages.map((lang, idx) => (
                  <div key={idx} className="flex justify-between items-center text-zinc-600">
                    <span className="font-bold text-zinc-800">{lang.name}</span>
                    <span>{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {interests.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}20` }}>
                Interests
              </h3>
              <div className="flex flex-wrap gap-1 text-[11px] text-zinc-600">
                {interests.join(", ")}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-8 flex flex-col gap-6">
          {summary && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}20` }}>
                Professional Summary
              </h3>
              <p className={fontSizeClass} style={{ color: textColor }}>
                {summary}
              </p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}20` }}>
                Work History
              </h3>
              <div className="flex flex-col gap-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-900">{exp.role}</span>
                      <span className="text-zinc-500 font-semibold">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <div className="text-[11.5px] font-semibold text-zinc-600">
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
          )}

          {projects.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}20` }}>
                Key Projects
              </h3>
              <div className="flex flex-col gap-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                      <div className="flex items-center gap-1">
                        <span>{proj.title}</span>
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {proj.technologies.map((tech, tIdx) => (
                        <span key={tIdx} className="text-[9.5px] font-semibold text-zinc-500">
                          #{tech}
                        </span>
                      ))}
                    </div>
                    <p className={`${fontSizeClass} text-zinc-700 mt-1`}>
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}20` }}>
                Education
              </h3>
              <div className="flex flex-col gap-4">
                {education.map((edu) => (
                  <div key={edu.id} className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                      <span>{edu.degree}</span>
                      <span className="text-zinc-500 font-semibold">{edu.startDate} – {edu.endDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11.5px] text-zinc-600">
                      <span>{edu.institution}</span>
                      {edu.score && <span className="font-semibold text-zinc-500">Score: {edu.score}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {achievements.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}20` }}>
                Achievements & Awards
              </h3>
              <div className="flex flex-col gap-3">
                {achievements.map((ach) => (
                  <div key={ach.id} className="flex flex-col gap-0.5">
                    <div className="flex justify-between items-start text-xs font-bold text-zinc-900">
                      <span>{ach.title}</span>
                      {ach.date && <span className="text-zinc-500 font-semibold">{ach.date}</span>}
                    </div>
                    {ach.description && (
                      <p className={`${fontSizeClass} text-zinc-700`}>{ach.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {certificates.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}20` }}>
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
          )}
        </div>
      </div>
    </div>
  );
}
