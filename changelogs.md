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
- Added documentation files:
  - `project_memory.md`: Core system architecture, folder layouts, and data schemas.
  - `design.md`: Theme engine specifications, colors, spacing, and typography preset details.
  - `AGENTS.md` and `CLAUDE.md` updated with strict developer/agent rules.
