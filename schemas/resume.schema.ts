// schemas/resume.schema.ts
import { z } from "zod";

export const PersonalSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  github: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const EducationItemSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  score: z.string().optional().or(z.literal("")),
});

export const ExperienceItemSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  description: z.array(z.string()),
});

export const ProjectItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Project description is required"),
  technologies: z.array(z.string()),
  link: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const SkillCategorySchema = z.object({
  category: z.string().min(1, "Skill category is required"),
  items: z.array(z.string()),
});

export const AchievementItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Achievement title is required"),
  description: z.string().optional().or(z.literal("")),
  date: z.string().optional().or(z.literal("")),
});

export const CertificateItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Certificate name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().min(1, "Date is required"),
  link: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const LanguageItemSchema = z.object({
  name: z.string().min(1, "Language name is required"),
  proficiency: z.string().min(1, "Proficiency is required"),
});

export const ResumeDataSchema = z.object({
  personal: PersonalSchema,
  summary: z.string(),
  education: z.array(EducationItemSchema),
  experience: z.array(ExperienceItemSchema),
  projects: z.array(ProjectItemSchema),
  skills: z.array(SkillCategorySchema),
  achievements: z.array(AchievementItemSchema),
  certificates: z.array(CertificateItemSchema),
  languages: z.array(LanguageItemSchema),
  interests: z.array(z.string()),
});

export const ThemeConfigSchema = z.object({
  fontFamily: z.string().default("Inter"),
  primaryColor: z.string().default("#2563eb"),
  secondaryColor: z.string().default("#64748b"),
  textColor: z.string().default("#0f172a"),
  backgroundColor: z.string().default("#ffffff"),
  spacing: z.enum(["compact", "comfortable", "loose"]).default("comfortable"),
  borderRadius: z.enum(["none", "small", "medium", "large"]).default("medium"),
  fontSize: z.enum(["sm", "base", "lg"]).default("base"),
  sectionOrder: z.array(z.string()).default([
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
  ]),
});
