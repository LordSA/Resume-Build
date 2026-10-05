# Guided Resume Data Collection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single unstructured paragraph textarea in the AI resume generator with a clean, intuitive guided form (Personal Info, Experience, Education, Skills, and a Bottom Description textarea) that collects the exact data needed for an ATS-optimized resume, updating all related application entry points, API routes, and documentation.

**Architecture:** 
1. Redesign `app/create/page.tsx` (AI Generator tab) into a sleek, guided sectioned form with clear input groups (Personal Details, Work History items, Education, Skills, and an Additional Description textarea at the bottom).
2. Enhance `app/api/ai/generate/route.ts` to accept structured guided inputs or formatted compiled career text seamlessly.
3. Update prompts in `constants/prompts.ts` to properly handle and synthesize structured and descriptive inputs into ATS-optimized JSON.
4. Align messaging and copy across the dashboard (`app/dashboard/dashboard-client.tsx`), landing pages, and documentation (`project_memory.md`, `changelogs.md`, `README.md`).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Framer Motion, Supabase SSR.

**Spec:** User request to replace paragraph collection with guided data collection (Personal Info, Experience, Education, Skills, bottom Description), simple UI, applied everywhere.

## Global Constraints
- Strictly follow `AGENTS.md`: Zero comments in production source files (`.ts`, `.tsx`, `.js`, `.css`).
- Keep documentation synced in `project_memory.md`, `design.md`, `changelogs.md`, and `README.md`.
- Ensure clean build verification with `next build --webpack` (0 errors).
- Match the established Midnight theme palette (`#0d0f17`, `#12141f`, `#181b28`, `#212435`, `#3b82f6`).

## Review Focus
1. Empty/partial fields: Ensure the user is not required to fill every optional field (e.g. phone, location, extra links); only require minimal fields like Name and Title, allowing AI to infer and format gracefully.
2. Experience dynamic list: Ensure adding and removing work experience entries is smooth, doesn't lose other field data, and handles empty entries cleanly.
3. Bottom description synthesis: Ensure the additional description textarea at the bottom is combined properly with the structured fields so the AI extracts extra context, awards, or custom notes.
4. Quick fill demo: Provide a "Fill Sample Data" button that populates all guided fields so users can immediately test the generation experience.
5. Backwards compatibility: Ensure `/api/ai/generate` continues to accept text strings from any other callers without breaking.

---

### Task 1: API & Prompt Enhancement for Guided Inputs

**Files:**
- Modify: `app/api/ai/generate/route.ts`
- Modify: `constants/prompts.ts`

**Interfaces:**
- Consumes: JSON body with `{ text?: string, candidateData?: GuidedCandidateData }`
- Produces: `{ resume: ResumeData }`

- [ ] **Step 1: Update `constants/prompts.ts`**
Refine `RESUME_GENERATE_PROMPT` to guide the model to accept both compiled structured sections and unstructured notes, prioritizing explicit user fields for personal details, experience, education, skills, and integrating additional description notes from the bottom.

- [ ] **Step 2: Update `app/api/ai/generate/route.ts`**
Update route handler to accept either raw `text` or structured `candidateData` (or serialize `candidateData` into an optimized structured text payload if provided).

- [ ] **Step 3: Verification**
Verify with TypeScript check / build step to ensure route types and prompt formatting are valid.

---

### Task 2: Build the Guided Form in `app/create/page.tsx`

**Files:**
- Modify: `app/create/page.tsx`

**Interfaces:**
- Consumes: User guided inputs (Full Name, Target Job Title, Email, Phone, Location, Links, Work Experiences, Education, Skills, Bottom Description)
- Produces: Clean submission payload to `/api/ai/generate` and insertion into `resumes` table

- [ ] **Step 1: Define Guided Form State & Types**
Add state for:
  - Personal info: `fullName`, `jobTitle`, `email`, `phone`, `location`, `linkedin`
  - Experience list: array of `{ company, role, duration, highlights }` (start with 1 entry, allow `+ Add Experience` and remove)
  - Education: `degree`, `institution`, `year`
  - Skills: `skills` (comma-separated string or tags)
  - Bottom Description: `additionalNotes` (multiline textarea with clear placeholder for career highlights, summary, or extra details)

- [ ] **Step 2: Implement UI Sections in AI Generator Mode**
Replace the single textarea in `app/create/page.tsx` with:
  1. **Resume Title & Target Role**: Title input and target role input.
  2. **Personal & Contact Details Group**: Full Name, Email, Phone, Location, LinkedIn.
  3. **Work Experience Group**: Dynamic cards with Company, Role, Duration, and Key Responsibilities/Achievements, with `+ Add Experience` and delete actions.
  4. **Education & Skills Group**: Degree & University inputs, plus Skills comma-separated input.
  5. **Additional Description & Notes (Bottom)**: Clean multiline description area with helper text explaining what to put (certifications, major achievements, career objectives).
  6. **Quick Sample Action**: "Fill Sample Data" button that populates all guided fields with rich Alex Rivera demo data.

- [ ] **Step 3: Handle Submission & Formatting**
In `handleGenerateAI`, compile the guided fields into a clean structured payload or text block and submit to `/api/ai/generate`. On success, create the resume record in Supabase and navigate to `/editor/[id]`.

- [ ] **Step 4: Clean Up Comments**
Scan `app/create/page.tsx` and ensure zero comments remain.

---

### Task 3: Update Dashboard & Global Copy

**Files:**
- Modify: `app/dashboard/dashboard-client.tsx`

**Interfaces:**
- Consumes: Navigation actions to `/create?mode=ai`
- Produces: Updated UI copy and subheadings

- [ ] **Step 1: Update AI Builder Quick-Action Card**
Update subtitle from "From bio" to "Guided AI" in `app/dashboard/dashboard-client.tsx`.

- [ ] **Step 2: Clean Up Comments**
Scan `app/dashboard/dashboard-client.tsx` to ensure zero comments remain.

---

### Task 4: Documentation Sync & Verification

**Files:**
- Modify: `project_memory.md`
- Modify: `design.md`
- Modify: `changelogs.md`
- Modify: `README.md`

- [ ] **Step 1: Update Documentation**
Document the Guided AI Resume Builder in `project_memory.md`, `changelogs.md`, `design.md`, and `README.md`.

- [ ] **Step 2: Build Verification**
Run `npm run build` (`next build --webpack`) to verify complete clean compilation across all routes with zero errors.
