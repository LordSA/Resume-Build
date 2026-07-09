# Project Memory: Resume Solutions

This document serves as the single source of truth for the project's architecture, state management, database schema, and design patterns.

---

## 1. Project Overview
The Resume Solutions builder is a high-performance, premium web application designed to help users create, edit, and optimize resumes with a clean, structured JSON document as the single source of truth. Every edit updates this JSON, and all previews, templates, and exports are dynamically rendered from it.

---

## 2. Core Architecture & Tech Stack
The application is built using a modern, scalable web stack:
- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + Shadcn UI + Framer Motion.
- **State Management**: Zustand (stores global resume state, theme, editor UI state, and user auth state).
- **Forms**: React Hook Form + Zod (for type-safe schema validation).
- **Backend & Auth**: Supabase (PostgreSQL, passwordless Email OTP verification for login, magic link signup flow, Google OAuth, and Supabase Storage for file assets).
- **File Storage**: Supabase Storage (`resume-assets` bucket) for profile photos and custom font files.
- **AI Integrations**: Gemini 3.1 Flash Lite (Primary) with automated fallback to Groq (Secondary) and OpenRouter (Tertiary) for maximum reliability and uptime.
- **Drag & Drop**: Native HTML5 Drag and Drop API for reordering resume sections (Experience, Projects, Education, etc.), avoiding React 19 library conflicts.
- **PDF Generation**: Client-side jsPDF rendering engine (`doc.html()`) configured in points (`pt` unit, `595.28 x 841.89` A4 size) and powered by `html2canvas-pro` (supporting CSS Color Module Level 4 spaces like OKLCH/lab without parsing crashes). Utilizes dynamic DOM isolation in the `onclone` sandbox (clearing the cloned body, placing the target element in an unscaled absolute wrapper with height overrides to `auto` and outer border/shadow resets, disabling root/body scroll limitations, and disabling broken/cross-origin stylesheets) to bypass parser crashes and strip active transforms/clippings, with page-break splitting (`autoPaging: "text"`) and print dialog fallback.

---

## 3. Directory Structure

```text
resume-build/
├── public/                 # Static assets (fonts, icons, logo.png, og-image.png)
├── app/                    # Next.js App Router folders
│   ├── (auth)/             # Authentication group
│   │   ├── login/          # Login page (split-screen with Google OAuth + Email OTP)
│   │   ├── signup/         # Signup page (split-screen with Google OAuth + Magic Link)
│   │   └── verify-email/   # Check mail confirmation page with 3s login redirect
│   ├── dashboard/          # User Dashboard for listing/managing resumes
│   ├── create/             # Initial prompt paste page for AI resume generation
│   ├── editor/             # Main workspace editor interface
│   │   └── [id]/           # Dynamic route for a specific resume
│   ├── api/                # API routes
│   │   ├── ai/             # AI endpoints (generate, rewrite, ats)
│   │   └── resume/         # Backend actions (save, export)
│   ├── globals.css         # Global tailwind styles + custom scrollbar
│   ├── layout.tsx          # Root layout with metadata & OG tags
│   └── page.tsx            # Main landing page
├── components/             # Global React components
│   ├── ui/                 # Shadcn raw primitive components
│   ├── Footer.tsx          # Shared footer component (copyright, links, support)
│   ├── editor/             # Sidebar edit panels (experience, skills, theme, fonts)
│   ├── resume/             # Live preview and structural components
│   └── templates/          # Renderers for Modern, Minimal, Classic, and ATS themes
├── lib/                    # Library initialization & configuration
│   ├── ai/                 # AI client config (gemini, groq, openrouter, provider)
│   ├── client.ts           # Supabase browser client
│   ├── server.ts           # Supabase server client
│   ├── middleware.ts       # Supabase session refresher & route protection
│   └── utils.ts            # Tailwind class merger helper (cn)
├── store/                  # Zustand global state stores
│   ├── resumeStore.ts      # Active resume content state & history
│   ├── themeStore.ts       # Layout, colors, font state, custom font fields
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
├── supabase/               # Supabase configuration
│   └── schema.sql          # Database tables, triggers, storage bucket, RLS policies
└── SEO Files               # robots.txt, sitemap.xml, manifest.json
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
| `template`    | `text`                   | Active template identifier (e.g., "modern", "minimal", "ats") |
| `resume_json` | `jsonb`                  | Structured resume data |
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
  education: Array<{ id: string; institution: string; degree: string; startDate: string; endDate: string; score?: string; }>;
  experience: Array<{ id: string; company: string; role: string; startDate: string; endDate: string; description: string[]; }>;
  projects: Array<{ id: string; title: string; description: string; technologies: string[]; link?: string; }>;
  skills: Array<{ category: string; items: string[]; }>;
  achievements: Array<{ id: string; title: string; description?: string; date?: string; }>;
  certificates: Array<{ id: string; name: string; issuer: string; date: string; link?: string; }>;
  languages: Array<{ name: string; proficiency: string; }>;
  interests: string[];
}
```

---

### Theme Config Schema (`theme_json`)
Located in `store/themeStore.ts`:

```typescript
export interface ThemeConfig {
  fontFamily: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  spacing: "compact" | "comfortable" | "loose";
  borderRadius: "none" | "small" | "medium" | "large";
  fontSize: "sm" | "base" | "lg";
  sectionOrder: string[];
  customFontName?: string;
  customFontUrl?: string;
}
```

---

## 5. Storage Architecture

### Supabase Storage (`resume-assets` bucket)
- **Profile Photos**: Uploaded via `PersonalPanel.tsx`. Files stored under `photos/{userId}/{timestamp}.webp`. Public URLs are obtained via `getPublicUrl()`.
- **Custom Fonts**: Uploaded via `ThemePanel.tsx`. Font files stored under `fonts/{userId}/{uuid}.{ext}`. Public URLs are injected as `@font-face` CSS rules in template renderers.
- **RLS Policies**: Storage bucket access has been configured so that SELECT is public, and INSERT/UPDATE/DELETE operations on objects are restricted to authenticated users.

---

## 6. AI Integration & Failover Flow
To prevent hitting free-tier limits, our AI gateway is designed with an automatic failover strategy.
All client features request AI processing via single abstractions (`generateResume`, `rewriteSection`). Internally, the gateway does:

1. **Attempt 1: Google Gemini 3.1 Flash Lite** (via Google AI Studio). Extremely fast, accurate, and offers a generous free tier.
2. **Attempt 2 (Fallback): Groq** (using Llama 3/Qwen2.5/Gemma). Highly responsive and has generous throughput limits.
3. **Attempt 3 (Fallback): OpenRouter** (aggregating Llama 3 Free, DeepSeek, Qwen). Guarantees the application remains functional.

---

## 7. PDF Generation
The download system targets the `.resume-print-container` element inside `ResumePreview.tsx`:
- **Engine**: Dynamic client-side `jsPDF` HTML renderer (`doc.html()`) registered with custom global `html2canvas-pro` resolver.
- **Transforms & Scaling Sandbox**: Integrates an `onclone` sandbox callback to isolate the target element (placing it in an unscaled, absolute wrapper at `0, 0` of width `794px` and height `auto`). This removes parent scale matrices and overflow clips that cause blank output pages.
- **Height Auto Override**: Dynamically resets the height and min-height styles of `#resume-print-area` inside `onclone` to `"auto"`. Also resets the html/body elements inside the cloned document sandbox to `overflow: visible; height: auto`. This allows multi-page resumes to grow naturally beyond one page in the render sandbox, enabling full multi-page PDF generation.
- **Outer border/Shadow Removal**: Overrides the cloned element and outer sandbox wrapper styles to `border: none; outline: none; boxShadow: none;` inside `onclone`. This completely prevents grey borders, page outlines, or blurry page-break shadows from rendering on the PDF.
- **Stylesheet Safety**: The `onclone` handler iterates over all stylesheets inside `clonedDoc` and sets `disabled = true` on any sheet that throws an error when accessing `cssRules` (common in hot-reload dev cycles with Turbopack or cross-origin stylesheets). This completely eliminates `unexpected EOF` parsing crashes.
- **Dimensions & Format**: Configured in points (`pt` unit) with a width of `595.28` and windowWidth `794` to match standard A4 paper dimensions (`595.28 x 841.89` pt) cleanly.
- **Fallback**: Native browser print dialog (`window.print()`). Expanded print styles ensure sidebars and headers are hidden via `display: none !important` and margins are removed via `@page { margin: 0; }` for a clean full-width print canvas. Also forces `html`, `body`, and all ancestor wrapper `div` containers to `overflow: visible` and `height: auto` to allow browser page splitting. Outer margins and boundaries are cleaned via `border: none !important; outline: none !important; box-shadow: none !important;` on `.resume-print-container` and `#resume-print-area`.

---

## 8. Key Component Map

| Component | Path | Responsibility |
|-----------|------|----------------|
| `Footer` | `components/Footer.tsx` | Shared footer with copyright, project links, contact, support button |
| `EditorWorkspace` | `app/editor/[id]/editor-workspace.tsx` | Main editor shell with toolbar, sidebar, preview, and PDF download |
| `EditorSidebar` | `components/editor/EditorSidebar.tsx` | Collapsible sidebar with section panels |
| `PersonalPanel` | `components/editor/panels/PersonalPanel.tsx` | Personal info editor with Supabase photo upload |
| `ThemePanel` | `components/editor/panels/ThemePanel.tsx` | Theme controls, color pickers, font selector, custom font uploader |
| `ResumePreview` | `components/resume/ResumePreview.tsx` | Renders A4 preview with zoom controls |
| `TemplateRenderer` | `components/resume/TemplateRenderer.tsx` | Selects and renders the active template |
| `ModernTemplate` | `components/templates/ModernTemplate.tsx` | Two-column modern resume layout |
| `MinimalTemplate` | `components/templates/MinimalTemplate.tsx` | Single-column minimal resume layout |
| `ClassicTemplate` | `components/templates/ClassicTemplate.tsx` | Traditional corporate resume layout |
| `AtsTemplate` | `components/templates/AtsTemplate.tsx` | Centered, single/multi-page, ATS-optimized layout with grids |
