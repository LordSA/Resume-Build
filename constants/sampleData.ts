import { ResumeData } from "@/types/resume";

export const SAMPLE_RESUME_DATA: ResumeData = {
  personal: {
    fullName: "Alex Rivera",
    jobTitle: "Senior Full Stack Engineer",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 382-9102",
    location: "San Francisco, CA",
    website: "https://alexrivera.dev",
    github: "https://github.com/alexrivera",
    linkedin: "https://linkedin.com/in/alexrivera",
    photoUrl: ""
  },
  summary: "Results-driven Full Stack Engineer with 6+ years of experience architecting high-throughput microservices, real-time web applications, and cloud-native systems. Proven record of reducing API latency by 45% and leading cross-functional teams to deliver enterprise-grade SaaS platforms.",
  experience: [
    {
      id: "exp-1",
      company: "Vanguard Tech Cloud",
      role: "Lead Software Engineer",
      startDate: "2022-03",
      endDate: "Present",
      description: [
        "Spearheaded migration to distributed GraphQL federation serving 12M monthly active users.",
        "Architected real-time WebSocket event ingestion pipeline processing 25K events/sec.",
        "Mentored 8 junior and mid-level engineers, instituting automated CI/CD code quality gates."
      ]
    },
    {
      id: "exp-2",
      company: "Starlight SaaS Solutions",
      role: "Senior Frontend Developer",
      startDate: "2019-06",
      endDate: "2022-02",
      description: [
        "Re-engineered core client dashboard in Next.js and TypeScript, improving Core Web Vitals score by 35%.",
        "Built accessible component library utilized across 4 enterprise product verticals.",
        "Collaborated with product designers to implement interactive data visualization widgets."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "B.S. in Computer Science",
      startDate: "2015-09",
      endDate: "2019-05",
      score: "3.85 / 4.0"
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "PulseStream Analytics",
      description: "Open-source real-time telemetry analyzer for cloud clusters with automated alerting and anomaly detection.",
      technologies: ["TypeScript", "Next.js", "Go", "Docker", "PostgreSQL"],
      link: "https://github.com/alexrivera/pulsestream"
    },
    {
      id: "proj-2",
      title: "FastCache Engine",
      description: "High-performance in-memory key-value caching layer with persistent write-ahead logging.",
      technologies: ["Rust", "Redis", "gRPC", "Prometheus"],
      link: "https://github.com/alexrivera/fastcache"
    }
  ],
  skills: [
    {
      category: "Frontend & UI",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "Zustand", "Framer Motion"]
    },
    {
      category: "Backend & Systems",
      items: ["Node.js", "Go", "Python", "GraphQL", "REST APIs", "PostgreSQL", "Redis", "Kafka"]
    },
    {
      category: "DevOps & Cloud",
      items: ["AWS (ECS, S3, Lambda)", "Docker", "Kubernetes", "CI/CD", "Terraform", "Git"]
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "1st Place Winner - Global SaaS Hackathon",
      date: "2023-11",
      description: "Built autonomous AI incident response agent selected top project out of 450+ submissions."
    },
    {
      id: "ach-2",
      title: "Outstanding Engineering Contributor",
      date: "2021-12",
      description: "Recognized across company for delivering zero-downtime database migration."
    }
  ],
  certificates: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect - Associate",
      issuer: "Amazon Web Services",
      date: "2022-05",
      link: "https://aws.amazon.com"
    }
  ],
  languages: [
    { name: "English", proficiency: "Native" },
    { name: "Spanish", proficiency: "Conversational" }
  ],
  interests: ["Distributed Systems", "Cloud Computing", "UI/UX Design", "Tech Mentorship", "Triathlon Training"]
};

export const TEMPLATE_SHOWCASE_LIST = [
  {
    id: "modern",
    name: "Modern Studio",
    tagline: "Two-Column Layout with High-Contrast Header",
    description: "Designed for tech, engineering, and product roles. Clean side-by-side structure showcasing skills and contact details alongside deep experience timelines.",
    badge: "Popular",
    colorTheme: "from-blue-600/20 via-[#131b2e] to-[#10121c] border-blue-500/30",
    accentColor: "#3b82f6",
    features: ["Two-column responsive layout", "Skill tag badges", "Clean project timeline"]
  },
  {
    id: "minimal",
    name: "Minimalist Executive",
    tagline: "Ultra-Clean Single-Column Typography",
    description: "Distilled, distraction-free layout emphasizing accomplishments, clean horizontal dividing rules, and crisp font hierarchies for maximum readability.",
    badge: "Clean",
    colorTheme: "from-emerald-600/20 via-[#12231b] to-[#10121c] border-emerald-500/30",
    accentColor: "#10b981",
    features: ["Single-column reading flow", "Elegant spacing", "High density layout"]
  },
  {
    id: "classic",
    name: "Classic Academic & Corporate",
    tagline: "Traditional Formal Grid Structure",
    description: "Ideal for finance, legal, consulting, and academic applications. Centered headers with standard formal margins and serif typography.",
    badge: "Traditional",
    colorTheme: "from-amber-600/20 via-[#221a11] to-[#10121c] border-amber-500/30",
    accentColor: "#f59e0b",
    features: ["Centered formal header", "Time-tested corporate style", "Classic typography"]
  },
  {
    id: "ats",
    name: "Standard ATS Bot-Ready",
    tagline: "Applicant Tracking System Optimized",
    description: "Engineered specifically to pass automated applicant tracking systems (Workday, Greenhouse, Lever, Taleo) with 100% parseable structures and high keyword density.",
    badge: "100% ATS Safe",
    colorTheme: "from-purple-600/20 via-[#1e1428] to-[#10121c] border-purple-500/30",
    accentColor: "#a855f7",
    features: ["Zero parsing errors", "Standard category headers", "Maximized keyword score"]
  }
];
