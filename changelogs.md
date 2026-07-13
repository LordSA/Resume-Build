# Changelogs

All notable changes to the Resume Solutions project will be documented in this file.

---

## [2026-07-13] - Auth Overhaul & Verification Routing Overhaul

### Added
- **API Auth Endpoints (`app/api/auth/`)**:
  - `me/route.ts`: Session information lookup.
  - `signout/route.ts`: Session log out request.
  - `status/route.ts`: Programmatic email confirmation state verification polling.
  - `forgot-password/route.ts`: Generates recovery action links, utilizing Supabase's native SMTP uploader configuration.
- **Verification Pages Redesign**:
  - `/verify`: Replaces the legacy `/verify-email`. Performs verification checks in the background against `/api/auth/status?id=...`, displaying **"Account Verified!"** and counts down to redirect. Includes a manual 6-digit OTP confirmation input box validating under `type: "signup"`.
  - `/verified`: Confirm landing page when clicking the verification email link.
- **Proxy absolute origin parser (`lib/proxy.ts`)**: Created a dynamic helper to resolve custom reverse proxies and host domains correctly.

### Changed
- **Sign Up credentials**: Modified [signup/page.tsx](file:///c:/Users/shibi/Desktop/Work/resume/resume-build/app/%28auth%29/signup/page.tsx) to always execute credentials `signUp` (generating fallback security passwords if left blank) to obtain the user's ID for live status polling, routing them to `/verify?email=...&id=${data.user.id}`.
- **Middleware Whitelist**: Whitelisted `/verify`, `/verified`, `/forgot-password`, `/reset-password`, and `/api/auth/*` inside [middleware.ts](file:///c:/Users/shibi/Desktop/Work/resume/resume-build/lib/middleware.ts).
- **Callback Path**: Swapped the redirect parameter endpoints from `/api/auth/callback` back to `/auth/callback` to match the whitelisted redirection links in your Supabase Authentication dashboard.
- **OTP Verification Type Fallbacks**: Implemented a robust fallback verification chain (`email` -> `signup` -> `magiclink`) inside [login/page.tsx](file:///c:/Users/shibi/Desktop/Work/resume/resume-build/app/%28auth%29/login/page.tsx) to resolve token expiration/invalid token errors caused by SDK discrepancies or account confirmation states.

### Removed
- **Nodemailer/SMTP Backend configuration**: Removed custom SMTP credentials parsing from `/api/auth/forgot-password` in favor of Supabase's native custom SMTP email delivery.
- Legacy `/verify-email` routing folder.

---

## [2026-07-13] - Normal Email Authentication Flow Refinements

### Added
- **Name + Email + Optional Password Unified Signup (`signup/page.tsx`)**: Created a single unified signup form supporting Name, Email, and Optional Password. When submitted, passwordless magic links are triggered if no password is set, and standard password signups are fired if a password is set.
- **Background Email Verification Polling (`verify-email/page.tsx`)**: Configured verify-email to continuously poll `supabase.auth.getUser()` in the background (every 3 seconds). If the user clicks the confirmation link in their email on another tab/device, the verify page automatically detects this state update, displays **"Your mail confirmed"**, and redirects the user to `/login` after a 5-second countdown.
- **Unified Password + OTP Login (`login/page.tsx`)**: Added password login support that triggers a mandatory secondary OTP code to the user's email upon correct password submission. This ensures both Email Code and Password login methods undergo OTP verification before letting users access the dashboard.
- **Google Auth Intact**: Restored Google OAuth login and signup buttons and flows to their fully functional state.
- **Blocked Unregistered Login Attempts (`login/page.tsx`)**: Set `shouldCreateUser: false` inside the login page's OTP and password authentication flows. If an unregistered user attempts to log in, the system blocks the request and prompts them with a custom toast: `"You don't have an account. Please sign up first."`

### Fixed
- **Middleware Session Detection (`/lib/middleware.ts`)**: Replaced the invalid call `supabase.auth.getClaims()` with the standard `supabase.auth.getUser()`. This correctly resolves cookie sessions and prevents the middleware from kicking authenticated users back to the `/login` page.

---

## [2026-07-09] - Phase 4: Magic-Link Signup, verify-email check-page & jsPDF Integration

### Added
- **Check Email Verification Page (`verify-email`)**: Added a new static `/verify-email` page:
  - Displays check-inbox envelope instructions with the registered email.
  - Automatically handles email confirmation query triggers. When `confirmed=true` is set, it displays a success message with an animated 3-second redirect countdown.
- **Magic-Link Signup Flow**: Simplified signup in `signup/page.tsx` to directly send a confirmation link without asking for an OTP code immediately. Users are pushed to `/verify-email` upon click.
- **Direct jsPDF HTML Rendering**: Replaced browser printing fallback with direct client-side `jsPDF` HTML rendering (`doc.html()`) inside `editor-workspace.tsx`.
- **Modern Color Support in PDF Engine**: Upgraded `html2canvas` to `html2canvas-pro` in root dependencies. Registered `html2canvas-pro` globally for `jsPDF` to parse CSS Color Module Level 4 spaces (like `oklch` and `lab`) without throwing exceptions.
- **Transforms & Scaling Sandbox Isolation**: Added an `onclone` callback to `html2canvas` inside `handleDownloadPDF`. The callback clears the cloned sandbox document body and appends only the targeted `#resume-print-area` inside an unscaled, unpositioned wrapper. This strips any active viewport transforms (`transform: scale()`) and scroll-container clipping properties, resolving the blank pages generation bug.
- **Natural Height Expansion in Sandbox**: Forced `height: auto` and `min-height: auto` on `#resume-print-area` and its rendering sandbox wrapper inside the `onclone` callback. In addition, reset `clonedDoc.documentElement` and `clonedDoc.body` styles to `height: auto` and `overflow: visible` to clear parent scroll locks and enable multi-page PDF generation.
- **Sandbox Wrapper Style Resets**: Reset `border`, `outline`, and `boxShadow` styles to `none` on the cloned sandbox wrapper and element inside `onclone` to prevent page outlines or borders from rendering on A4 page breaks.
- **Stylesheet Safety Checks**: Implemented a stylesheet verification loop in `onclone` and on the main document before rendering that detects and disables broken or cross-origin stylesheets (which throw errors during hot-reload cycles in Next.js dev mode or due to CORS restrictions). This prevents the `unexpected EOF` SyntaxError from crashing PDF exports.
- **A4 Points Dimensions Config**: Configured the `jsPDF` constructor to render in points (`unit: "pt"`, A4 width `595.28` points, representing standard `595.28 x 841.89` pt boundaries) to ensure proper multi-page splitting.
- **Chrome Hiding during Print**: Added `print:hidden` utility classes to the editor workspace header and sidebar elements.
- **Fallback Print Styling**: Updated the `@media print` rules in `ResumePreview.tsx` to target `@page { size: A4; margin: 0; }` for removing browser margin headers, and configured `.resume-print-container` with absolute positioning at `0, 0` and standard `210mm` width to prevent right-offset squeezing.
- **Print Ancestor Scroll Unlock**: Configured `@media print` rules to force `overflow: visible !important` and `height: auto !important` on `html`, `body`, and all ancestor wrapper divs of the print container (targeted via `div:has(.resume-print-container)`). This clears the editor viewport's scroll lock and restores standard multi-page browser pagination.
- **Print border/Outline Removal**: Configured print stylesheets to force `border: none !important`, `outline: none !important`, and `box-shadow: none !important` on `.resume-print-container` and `#resume-print-area` to prevent grey borders, outlines, or page-break shadows from rendering on fallback print PDFs.
- **Candidate Header visibility in Print**: Removed generic `header` selectors from the print display-none list to prevent candidate name, job title, and contact headers from being hidden.

### Changed
- **Auth Callback Redirect**: Updated `auth/callback/route.ts` to redirect to `/verify-email?confirmed=true` upon successful session verification, triggering the 3-second redirect countdown.
- **Production Dependencies**: Swapped `"html2canvas"` for `"html2canvas-pro"` and registered `"jspdf"` in the project's root `package.json`.
- Updated `project_memory.md` and `design.md` to record the new verify-email path, simplified signup mechanism, html2canvas-pro color engine, DOM sandbox isolation, points page configurations, and print layout behaviors.

---

## [2026-07-09] - Phase 3: Native Vector PDF Export, Storage RLS Resolutions & Standard ATS Template

### Added
- **Standard ATS Template (`ats`)**: Added a new premium, high-fidelity resume layout matching the provided PDF reference:
  - Centered header with name, tagline (job title), and pipe-separated contact info (Location | Phone | Email | LinkedIn).
  - 3-column bulleted list for competencies/skills with custom circular accent dots.
  - Inline role titles and dates for experience.
  - Split-column layout for education (dates on left, degree and school on right).
  - "Personal Details & Availability" section dynamically rendering languages and interests.
- **ATS-Optimized PDF Export**: Replaced `html2pdf.js` with the browser's native print engine (`window.print()`). This creates vector-based searchable PDFs with clickable links, satisfying ATS parser compliance and solving Tailwind v4/OKLCH color parsing failures.
- **Supabase Storage Bucket & RLS Policies**: Appended storage setup SQL scripts to `supabase/schema.sql` (creating the `resume-assets` bucket and configuring SELECT/INSERT/UPDATE/DELETE policies for authenticated users).

### Changed
- **Storage Upload Path**: Standardized the uploaded profile photo path format in `PersonalPanel.tsx` to `photos/${user.id}/${Date.now()}.webp` to match documented folder structures.
- **Print Layout Selector**: Added `.resume-print-container` class inside `ResumePreview.tsx` to replace the fragile attribute selector `div[style*="width: 794px"]`, resolving the blank print preview layout bug.
- **Templates Panel**: Registered the "Standard ATS" template in the selection UI panel (`TemplatesPanel.tsx`).
- **Template Renderer**: Mapped `case "ats"` to `AtsTemplate.tsx` in `TemplateRenderer.tsx`.
- Updated `project_memory.md` and `design.md` to document the new template design, vector printing engine, and standardized storage directories.

### Removed
- Removed the old `html2pdf.js` dynamic import and canvas configuration blocks.
- Cleaned and removed CSS comments from `ResumePreview.tsx`.

---

## [2026-07-09] - Phase 2: Storage Migration, Font System, Footer Extraction & Cleanup

### Added
- **Custom Font Upload System**: Users can upload `.ttf`, `.otf`, `.woff`, `.woff2` font files via the Theme panel. Files stored in Supabase `resume-assets` bucket under `fonts/{userId}/`. Dynamic `@font-face` injection in all templates (Modern, Minimal, Classic).
- **`customFontName` and `customFontUrl` fields** added to `ThemeConfig` in `store/themeStore.ts`.
- **`components/Footer.tsx`**: Extracted shared footer component with logo, copyright (SHIBILI AMAN TK - ALL CAPS), project links, contact info, and support button.
- **Rule #4 in `AGENTS.md`**: Explicit requirement for agents to remove all comments from source files after completing work.
- **Custom scrollbar** styled in `globals.css` matching zinc palette with blue hover accent.

### Changed
- **Supabase Storage Migration**: Replaced Cloudflare R2 (`@aws-sdk/client-s3`) with Supabase Storage for profile photo uploads in `PersonalPanel.tsx`. Bucket: `resume-assets`, path: `photos/{userId}/`.
- **PDF Download Engine**: Switched from `react-to-print` to `html2pdf.js` with `window.print()[*] fallback in `editor-workspace.tsx`.
- **Scrollbar Fix**: Single scrollbar on `html` element (`overflow-y: auto`), `body` set to `overflow-y: visible` to eliminate double scrollbar issue.
- **Footer Decoupling**: Moved inline footer from `app/page.tsx` to reusable `components/Footer.tsx`.
- Updated `project_memory.md`, `design.md`, and `README.md` to reflect all architecture changes.

### Removed
- Uninstalled `@aws-sdk/client-s3` dependency from `package.json`.
- Deleted `app/api/upload/route.ts` (R2 upload endpoint).
- Stripped all file path header comments (`// path/to/file`) from every `.ts` and `.tsx` file in the repository.
- Removed all JSX block comments (`{/* ... */}`) from auth pages and components.
- Removed CSS comments from `globals.css`.

### Fixed
- Double scrollbar issue on main page resolved via `globals.css` overflow rules.
- PDF download button now functional with robust error handling and fallback.
- Inline SVG icons for GitHub/LinkedIn in templates (fixing missing Lucide icon imports).

---

## [2026-07-09] - Initial Setup & Directory Bootstrapping
### Added
- Created foundational Next.js 16 project structure with App Router, Tailwind CSS, TypeScript, and ESLint.
- Initialized Supabase SSR configurations:
  - `lib/client.ts`: Supabase client helper.
  - `lib/server.ts`: Supabase server cookie handling client helper.
  - `lib/middleware.ts`: Refreshes sessions and handles protected routes.
  - `lib/utils.ts`: Tailwind CSS class merge utility.
- Created routing folders and files:
  - `app/(auth)/login/page.tsx`
  - `app/(auth)/signup/page.tsx`
  - `app/api/ai/ats/route.ts`
  - `app/api/ai/generate/route.ts`
  - `app/api/resume/export/route.ts`
  - `app/api/resume/save/route.ts`
- Added project configurations:
  - `package.json` with packages: Zustand, Zod, react-hook-form, framer-motion, html2pdf.js, etc.
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
- Designed dynamic split-pane editor (`app/editor/[id]/`) with collapsible panel sidebar.
- Created A4 Preview Canvas supporting live changes, custom A4 print styles, and zoom scaling.
- Implemented Modern, Minimal, and Classic templates with inline style bindings.
- Created HTML5 native drag-and-drop section list for reordering items.
- Added documentation files:
  - `project_memory.md`: Core system architecture, folder layouts, and data schemas.
  - `design.md`: Theme engine specifications, colors, spacing, and typography preset details.
  - `AGENTS.md` and `CLAUDE.md` updated with strict developer/agent rules.
### Changed
- Rebranded application to `Resume Solutions`.
- Modified site base URL to `https://resumesolutions.shibili.tech` in layout settings, sitemaps, and crawler files.
- Upgraded the login/signup screens to a premium split-screen layout inspired by MongoDB Atlas console.
- Added top-left navigation Back buttons on signup/login pages.
- Configured passwordless Email OTP verification as the primary email auth method.
- Integrated Google OAuth button on auth screens and removed GitHub Auth.
- Redesigned landing page footer to be multi-column with author credits, copyrights, and contact info.
- Added dynamic 3D tilting preview mockup and infinite 2D marquee layout scroller on homepage.
- Updated primary Gemini model identifier to `gemini-3.1-flash-lite` in client configs and documentation.
### Fixed
- Replaced outdated `Github` and `LinkedIn` Lucide imports in template components with lightweight inline SVGs to fix compiler errors.
