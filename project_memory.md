# Project Memory: Resume AI Builder

This document serves as the single source of truth for the project's architecture, state management, database schema, and design patterns.

---

## 1. Project Overview
The Resume AI Builder is a high-performance, premium web application designed to help users generate, edit, and optimize resumes with the help of AI. Unlike traditional builders that store templates in HTML or markdown, this application relies on a **structured JSON document** as the single source of truth. Every edit updates this JSON, and all previews, templates, and exports are dynamically rendered from it.

---

## 2. Core Architecture & Tech Stack
The application is built using a modern, scalable web stack:
- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + Shadcn UI + Framer Motion.
- **State Management**: Zustand (stores global resume state, theme, editor UI state, and user auth state).
- **Forms**: React Hook Form + Zod (for type-safe schema validation).
- **Backend & Auth**: Supabase (PostgreSQL, Auth with Magic Link/Google/GitHub, and Supabase Storage for PDFs/Images).
- **AI Integrations**: Gemini 1.5 Flash (Primary) with automated fallback to Groq (Secondary) and OpenRouter (Tertiary) for maximum reliability and uptime.
- **Drag & Drop**: `@dnd-kit` for reordering resume sections (Experience, Projects, Education, etc.).
- **PDF Generation**: `react-to-print` (for high-fidelity HTML printing using the browser's print engine) and/or `@react-pdf/renderer`.

---

## 3. Directory Structure

```text
resume-build/
├── public/                 # Static assets (fonts, icons, SVG templates)
├── app/                    # Next.js App Router folders
│   ├── (auth)/             # Authentication group
│   │   ├── login/          # Login page
│   │   └── signup/         # Signup page
│   ├── dashboard/          # User Dashboard for listing/managing resumes
│   ├── create/             # Initial prompt paste page for AI resume generation
│   ├── (editer)/           # Main workspace editor interface
│   │   └── [id]/           # Dynamic route for a specific resume
│   ├── api/                # API routes
│   │   ├── ai/             # AI endpoints (generate, rewrite, ats)
│   │   └── resume/         # Backend actions (save, export)
│   ├── globals.css         # Global tailwind styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main landing page
├── components/             # Global React components
│   ├── ui/                 # Shadcn raw primitive components
│   ├── layout/             # Header, Footer, Sidebar, etc.
│   ├── editor/             # Sidebar edit panels (experience, skills, theme)
│   ├── resume/             # Live preview and structural components
│   └── templates/          # Renderers for Modern, Minimal, Classic themes
├── lib/                    # Library initialization & configuration
│   ├── ai/                 # AI client config (gemini, groq, openrouter, provider)
│   ├── client.ts           # Supabase browser client
│   ├── server.ts           # Supabase server client
│   ├── middleware.ts       # Supabase session refresher & route protection
│   └── utils.ts            # Tailwind class merger helper (cn)
├── store/                  # Zustand global state stores
│   ├── resumeStore.ts      # Active resume content state & history
│   ├── themeStore.ts       # Layout, colors, and font state
│   ├── editorStore.ts      # Active panel, sizing, loading states
│   └── userStore.ts        # Current authenticated user details
├── hooks/                  # Reusable react hooks
│   ├── useAutosave.ts      # Tracks changes and sends debounced updates to Supabase
│   ├── useResume.ts        # Operations on local resume instances
│   └── useTheme.ts         # Dynamically applies fonts/colors to preview
├── services/               # Modular business logic services
│   ├── resume.service.ts   # CRUD operations on resumes
│   ├── ai.service.ts       # Invokes AI endpoints and handles fallbacks
│   └── export.service.ts   # Formatting & PDF render orchestration
├── types/                  # Shared TypeScript models
│   └── resume.ts           # Structured Resume Data & Theme Interfaces
├── schemas/                # Zod schemas for input validation
├── constants/              # Default values, font listings, colors, and prompt templates
└── styles/                 # Custom CSS stylesheet overlays if needed
```

---

## 4. Data Models & Schemas

### Database Schema (Supabase PostgreSQL)
We store the resume structure as a unified JSON Document. This avoids complex table joins and makes scaling new resume sections or settings simple.

The SQL setup definitions (tables, constraints, triggers, and Row Level Security policies) can be found in [supabase/schema.sql](file:///c:/Users/shibi/Desktop/Work/resume/resume-build/supabase/schema.sql).

#### `resumes` Table
| Column Name   | Type                     | Description |
|---------------|--------------------------|-------------|
| `id`          | `uuid` (PK)              | Unique identifier of the resume |
| `user_id`     | `uuid` (FK to auth.users)| Owner of the resume |
| `title`       | `text`                   | Name of the resume (e.g., "Software Engineer Resume") |
| `template`    | `text`                   | Active template identifier (e.g., "modern", "minimal") |
| `resume_json` | `jsonb`                  | Structured resume data (details below) |
| `theme_json`  | `jsonb`                  | Font, colors, padding, spacing settings |
| `created_at`  | `timestamp with time zone`| Auto-generated creation timestamp |
| `updated_at`  | `timestamp with time zone`| Timestamp updated on every save |

#### `resume_versions` Table (For Revision History)
| Column Name   | Type                     | Description |
|---------------|--------------------------|-------------|
| `id`          | `uuid` (PK)              | Unique identifier of version entry |
| `resume_id`   | `uuid` (FK to resumes)   | Reference to parent resume |
| `resume_json` | `jsonb`                  | Snapshot of the resume JSON at that save |
| `theme_json`  | `jsonb`                  | Snapshot of the theme JSON |
| `created_at`  | `timestamp with time zone`| When the snapshot was saved |

---

### Resume JSON Schema (`resume_json`)
Located in `types/resume.ts`. This structure is strictly checked by Zod and returned directly from the AI APIs:

```typescript
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
    id: string; // Crucial for drag-and-drop sorting
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
    description: string[]; // List of bullet points (no markdown/HTML)
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
```

---

## 5. AI Integration & Failover Flow
To prevent hitting free-tier limits, our AI gateway is designed with an automatic failover strategy.
All client features request AI processing via single abstractions (`generateResume`, `rewriteSection`). Internally, the gateway does:

1. **Attempt 1: Google Gemini 1.5 Flash** (via Google AI Studio). Extremely fast, accurate, and offers a generous free tier.
2. **Attempt 2 (Fallback): Groq** (using Llama 3/Qwen2.5/Gemma). Highly responsive and has generous throughput limits.
3. **Attempt 3 (Fallback): OpenRouter** (aggregating Llama 3 Free, DeepSeek, Qwen). Guarantees the application remains functional.

### Token Savings Strategy
- **Full Generation**: Paste-prompt extraction happens once on creation.
- **Section Editing**: Instead of regenerating the entire resume, we expose hyper-targeted buttons (e.g., "✨ Rewrite Summary", "✨ Improve Bullet Point") which send only that specific text block to the AI.
- **Structured Output**: AI prompts enforce standard JSON response formats (via JSON Schema Mode or structured prompts) to prevent parsing errors.
