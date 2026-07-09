# Resume Solutions - Professional ATS Resume Builder

Resume Solutions is a high-fidelity, state-driven web application built with **Next.js 16**, **React 19**, and **Supabase (PostgreSQL)**. It is designed to let users create, edit, reorder, and export print-ready resumes with zero visual drift.

**Live URL**: [resumesolutions.shibili.tech](https://resumesolutions.shibili.tech)  
**Created by**: [Shibili Aman TK](https://github.com/LordSA)

---

## 1. Project Overview & Features

### Core Design Principles
- **Structured JSON as Source of Truth**: Unlike HTML-based editor templates, Resume Solutions maintains a single type-safe JSON document representation of the resume. Changes automatically feed into active templates (Modern, Minimal, Classic) and export payloads.
- **Premium Dark-Mode Workspace**: A sleek, dark-themed workspace editor panel set against a clean, light A4 paper canvas preview with full zoom controls.
- **Native HTML5 Drag-and-Drop**: Native sorting hooks for list elements (Experience, Projects, Education) and sections, bypassing React 19 library conflicts.
- **Premium Fluid Motion**: Handcrafted Framer Motion entrances, staggered dashboard animations, and sliding panel drawer actions.

### Main Capabilities
1. **Passwordless OTP Authentication**: Enter your email, receive a 6-digit OTP confirmation token, and log in directly. Supported by Google OAuth sign-in.
2. **Instant Resume Creator**: Paste messy bio summaries or LinkedIn history, and the system automatically extracts and formats it into clean JSON section nodes.
3. **ATS Compatibility Analyzer**: Paste your target job listing requirements to calculate keyword match scores, flag missing terms, and generate list optimizations.
4. **Local-First Autosave**: Edits automatically sync back to Supabase using a 2-second debounced buffer to prevent typing delays.
5. **Print-Perfect PDF Outputs**: Uses `html2pdf.js` for high-fidelity PDF generation with `window.print()` fallback.
6. **Custom Font Uploads**: Upload your own `.ttf`, `.otf`, `.woff`, `.woff2` fonts and apply them to your resume in real-time.
7. **Supabase File Storage**: Profile photos and custom fonts stored in the `resume-assets` Supabase Storage bucket.

---

## 2. Directory Layout

```text
├── app/
│   ├── (auth)/             # Split-screen Login & Signup (Google OAuth + Email OTP)
│   ├── editor/[id]/        # Side-by-side editing canvas workspace
│   ├── api/
│   │   ├── ai/             # Parser, rewrite, and ATS scoring API endpoints
│   │   └── resume/         # Save and Export JSON routes
│   ├── auth/callback/      # Redirect code exchange route
│   ├── dashboard/          # Resume grid board & delete actions
│   ├── create/             # AI resume generation prompt page
│   ├── globals.css         # Global styles + custom scrollbar
│   ├── layout.tsx          # Meta setup with OpenGraph & Google Verification
│   ├── robots.ts           # Crawler index rules
│   └── sitemap.ts          # Sitemap generators
├── components/
│   ├── Footer.tsx          # Shared footer (copyright, links, support button)
│   ├── editor/             # Sidebar modules, custom inputs, and DnD lists
│   ├── resume/             # Scale previews and template routers
│   └── templates/          # Modern (2-column), Minimal, and Classic designs
├── hooks/
│   └── useAutosave.ts      # Debounced Supabase database backup saves
├── lib/
│   ├── ai/                 # Multi-provider client gateway (Gemini, Groq, OpenRouter)
│   ├── client.ts           # Browser Supabase client context
│   ├── middleware.ts        # Secure routing and login segues
│   └── server.ts           # Server component Supabase instance
├── schemas/
│   └── resume.schema.ts    # Zod structured validation schema
├── store/
│   ├── resumeStore.ts      # Main resume data store, actions, and history stacks
│   ├── themeStore.ts       # Spacing, fonts, colors, border settings, custom font fields
│   ├── editorStore.ts      # Editor UI scale state and sidebar tab indicators
│   └── userStore.ts        # Authenticated user session
├── supabase/
│   └── schema.sql          # PostgreSQL table schemas, indexes, and triggers
├── public/
│   ├── logo.png            # Website branding logo
│   ├── og-image.png        # OpenGraph social preview card
│   ├── robots.txt          # Static robots file
│   └── manifest.json       # PWA manifest
└── LICENSE                 # Proprietary, All-Rights-Reserved License
```

---

## 3. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript, Tailwind CSS v4, Shadcn UI |
| Animations | Framer Motion |
| State | Zustand |
| Validation | React Hook Form + Zod |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| AI | Gemini 3.1 Flash Lite → Groq → OpenRouter (failover chain) |
| PDF | html2pdf.js + window.print() fallback |
| File Storage | Supabase Storage (`resume-assets` bucket) |

---

## 4. Database & Authentication Setup

### Supabase Table Triggers
We use PostgreSQL database triggers to manage updating timestamps. The full script in `supabase/schema.sql` sets up:
- `resumes` and `resume_versions` tables with unique UUID links.
- `update_modified_column()` triggers matching `updated_at`.
- Strict Row-Level Security (RLS) policies guaranteeing users only view and save their own resumes (`auth.uid() = user_id`).

### Supabase Storage Setup
1. Create a **public** bucket named `resume-assets` in the Supabase Dashboard under **Storage**.
2. Enable public read access and authenticated upload policies.
3. The app uses two folder prefixes:
   - `photos/{userId}/` — Profile photos uploaded from the Personal panel.
   - `fonts/{userId}/` — Custom font files uploaded from the Theme panel.

### Normal Email Setup (SMTP)
Supabase provides a rate-limited email server by default. To support passwordless OTP and verify account creations reliably:
1. Navigate to **Authentication -> Email Templates** in the Supabase Dashboard.
2. Custom SMTP must be configured under **Settings -> Auth -> SMTP** with your SMTP server details (Resend, Sendgrid, or Mailgun).
3. Ensure "Double Confirm Email" is enabled to verify signups.

### Google OAuth Integration
1. Configure credentials in the **Google Cloud Console** under APIs & Services.
2. Set Supabase redirect callback URL `https://<your-project>.supabase.co/auth/v1/callback` as an Authorized redirect URI in Google.
3. Enable Google in the Supabase dashboard and insert Client ID and Secret.

---

## 5. OpenGraph & Metadata Requirements

### Required Assets
Place the following files in the `/public` folder:
1. **`/public/logo.png`**: Website branding logo (512x512 pixels, PNG).
2. **`/public/og-image.png`**: OpenGraph social preview card (1200x630 pixels, PNG, 1.91:1 ratio).

### Google Verification
When verifying in Google Search Console, copy the HTML tag token and set it in `app/layout.tsx` under the verification parameters:
```typescript
verification: {
  google: "YOUR_GOOGLE_VERIFICATION_TOKEN"
}
```

---

## 6. Local Development Setup

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file at the root:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key

   # AI Gateways (Gemini is primary, others optional)
   GEMINI_API_KEY=your-gemini-key
   GROQ_API_KEY=your-groq-key
   OPENROUTER_API_KEY=your-openrouter-key
   ```
3. Boot the local development server:
   ```bash
   npm run dev
   ```
4. Access `http://localhost:3000` in your web browser.

---

## 7. Project Licensing
Copyright (c) 2026 Shibili Aman. All Rights Reserved.  
This code is proprietary. Copying, distribution, or code extraction without the prior permission of the owner is prohibited.
