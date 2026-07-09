// types/resume.ts

export interface ResumeData {
  personal: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    github?: string;
    linkedin?: string;
  };
  summary: string;
  education: Array<{
    id: string; // Crucial for drag-and-drop sorting in your editor
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    score?: string; // GPA or CGPA
  }>;
  experience: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string[]; // Array of strings makes bullet points much easier to render
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  skills: Array<{
    category: string; // e.g., "Languages", "Frameworks", "Tools"
    items: string[];
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description?: string;
    date?: string;
  }>;
  certificates: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    link?: string;
  }>;
  languages: Array<{
    name: string;
    proficiency: string;
  }>;
  interests: string[];
}