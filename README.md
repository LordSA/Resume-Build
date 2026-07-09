# Resume Solutions - Professional ATS Resume Builder

Resume Solutions is a high-fidelity, state-driven web application built with **Next.js 16**, **React 19**, and **Supabase (PostgreSQL)**. It is designed to let users create, edit, reorder, and export print-ready resumes with zero visual drift.

---

## 1. Project Overview & Features

### Core Design Principles
- **Structured JSON as Source of Truth**: Unlike HTML-based editor templates, Resume Solutions maintains a single type-safe JSON document representation of the resume. Changes automatically feed into active templates (Modern, Minimal, Classic) and export payloads.
- **Figma + Notion + ChatGPT Aesthetic**: A sleek, dark-themed workspace editor panel set against a clean, light A4 paper canvas preview with full zoom controls.
- **Native HTML5 Drag-and-Drop**: Native sorting hooks for list elements (Experience, Projects, Education) and sections, bypassing React 19 library conflicts.
- **Premium Fluid Motion**: Handcrafted Framer Motion entrances, staggered dashboard animations, and sliding panel drawer actions.

### Main Capabilities
1. **Passwordless OTP Authentication**: Enter your email, receive a 6-digit OTP confirmation token, and log in directly from a single screen. Supported by Google & GitHub OAuth sign-ins.
2. **Instant Resume Creator**: Paste messy bio summaries or LinkedIn history, and the system automatically extracts and formats it into clean JSON section nodes.
3. **ATS Compatibility Analyzer**: Paste your target job listing requirements to calculate keyword match scores, flag missing terms, and generate list optimizations.
4. **Local-First Autosave**: List edits automatically sync back to Supabase using a 2-second debounced buffer to prevent typing delays.
5. **Print-Perfect Outputs**: Uses a media print layout CSS engine to render Google fonts and line breaks precisely during PDF exports.

---

## 2. Directory Layout

```text
├── app/
│   ├── (auth)/             # Single-screen passwordless OTP Login & Signup
│   ├── (editor)/           # Side-by-side editing canvas workspace
│   ├── api/
│   │   ├── ai/             # Parser, rewrite, and ATS scoring API endpoints
│   │   └── resume/         # Save and Export JSON routes
│   ├── auth/callback/      # Redirect code exchange route
│   ├── dashboard/          # Resume grid board & delete actions
│   ├── layout.tsx          # Meta setup with OpenGraph & Google Verification
│   ├── robots.ts           # Crawler index rules
│   └── sitemap.ts          # Sitemap generators
├── components/
│   ├── editor/             # sidebar modules, custom inputs, and DnD lists
│   ├── resume/             # scale previews and template routers
│   └── templates/          # Modern (2-column), Minimal, and Classic designs
├── hooks/
│   └── useAutosave.ts      # Debounced supabase database backup saves
├── lib/
│   ├── ai/                 # Multi-provider client gateway (Gemini, Groq, OpenRouter)
│   ├── client.ts           # Browser supabase client context
│   ├── middleware.ts       # Secure routing and login segues
│   └── server.ts           # Server component supabase instance
├── schemas/
│   └── resume.schema.ts    # Zod structured validation schema
├── store/
│   ├── resumeStore.ts      # Main resume data store, actions, and history stacks
│   ├── themeStore.ts       # Spacing configurations, fonts, colors, and border settings
│   ├── editorStore.ts      # Editor UI scale state and sidebar tab indicators
│   └── userStore.ts        # Authenticated user session
├── supabase/
│   └── schema.sql          # PostgreSQL table schemas, indexes, and triggers
└── LICENSE                 # Proprietary, All-Rights-Reserved License
```

---

## 3. Database & Authentication Setup

### Supabase Table Triggers
We use PostgreSQL database triggers to manage updating timestamps. The full script in `supabase/schema.sql` sets up:
- `resumes` and `resume_versions` tables with unique UUID links.
- `update_modified_column()` triggers matching `updated_at`.
- Strict Row-Level Security (RLS) policies guaranteeing users only view and save their own resumes (`auth.uid() = user_id`).

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

## 4. OpenGraph & Metadata Requirements

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

## 5. Local Development Setup

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

## 6. Project Licensing
Copyright (c) 2026 Shibili Aman. All Rights Reserved.  
This code is proprietary. Copying, distribution, or code extraction without the prior permission of the owner is prohibited.
