# Changelogs

All notable changes to the Resume AI Builder project will be documented in this file.

---

## [2026-07-09] - Initial Setup & Directory Bootstrapping
### Added
- Created foundational Next.js 16 project structure with App Router, Tailwind CSS, TypeScript, and ESLint.
- Initialized Supabase SSR configurations:
  - `lib/client.ts`: Supabase client helper.
  - `lib/server.ts`: Supabase server cookie handling client helper.
  - `lib/middleware.ts`: Refreshes sessions and handles protected routes.
  - `lib/utils.ts`: Tailwind CSS class merge utility.
- Created routing folders and empty files:
  - `app/(auth)/login/page.tsx`
  - `app/(auth)/signup/page.tsx`
  - `app/api/ai/ats/route.ts`
  - `app/api/ai/generate/route.ts`
  - `app/api/resume/export/route.ts`
  - `app/api/resume/save/route.ts`
- Added project configurations:
  - `package.json` with packages: Zustand, Zod, react-hook-form, framer-motion, react-to-print, html2pdf.js, etc.
  - `tsconfig.json` with path aliases.
  - `components.json` for Shadcn.
- Created core TypeScript definition file `types/resume.ts` detailing the full structured resume json format.
- Created `supabase/schema.sql` outlining SQL tables, indexes, triggers, and RLS policies for the database.
- Implemented Zustand stores: `store/resumeStore.ts`, `store/themeStore.ts`, `store/editorStore.ts`, `store/userStore.ts`.
- Created Zod validation schema: `schemas/resume.schema.ts`.
- Integrated multi-provider AI gateway with automatic failover in `lib/ai/provider.ts` (Gemini, Groq, OpenRouter).
- Implemented API Routes for AI Resume Generation, targeted section rewrites, and job-description ATS analysis.
- Created login and signup interfaces integrated with Supabase SSR clients and callback handlers.
- Built dashboard workspace (`app/dashboard/`) and creation wizard (`app/create/`).
- Designed dynamic split-pane editor (`app/(editor)/[id]/`) with collapsible panel sidebar.
- Created A4 Preview Canvas supporting live changes, custom A4 print styles, and zoom scaling.
- Implemented Modern, Minimal, and Classic templates with inline style bindings.
- Created HTML5 native drag-and-drop section list for reordering items.
- Added documentation files:
  - `project_memory.md`: Core system architecture, folder layouts, and data schemas.
  - `design.md`: Theme engine specifications, colors, spacing, and typography preset details.
  - `AGENTS.md` and `CLAUDE.md` updated with strict developer/agent rules.
### Changed
- Updated primary Gemini model identifier to `gemini-3.1-flash-lite` in client configs and documentation.
### Fixed
- Replaced outdated `Github` and `Linkedin` Lucide imports in template components with lightweight inline SVGs to fix compiler errors.
