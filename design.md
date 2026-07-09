# Design System & Theme Engine

This document outlines the UI/UX architecture, visual aesthetics, theme properties, and dynamic styling engine of Resume Solutions.

---

## 1. Visual Identity & Aesthetics
The application workspace features a premium, modern design following these core principles:
- **Clean Contrast**: A dark-mode workspace editor dashboard contrasts with a clean, high-fidelity light-mode resume preview. This ensures ease of editing and accurate print visualization.
- **Glassmorphism**: Subtle backdrops, thin borders, and soft shadows for sidebar panels.
- **Micro-Animations**: Framer Motion handles section dragging, active button states, and live update indicators.
- **Typography Hierarchy**: Clear font scale adjustments between heading and body fonts.
- **Custom Scrollbar**: Themed scrollbar matching the zinc palette (`#27272a` thumb, `#09090b` track, blue hover accent).

---

## 2. Dynamic Theme Schema (`theme_json`)
Every resume document contains a styling object stored in the database as `theme_json`. The preview pane and templates read this configuration and dynamically apply standard Tailwind CSS utility styles.

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

### Custom Font Support
- Users can upload custom font files (`.ttf`, `.otf`, `.woff`, `.woff2`) via the Theme panel.
- Fonts are stored in the Supabase `resume-assets` bucket under `fonts/{userId}/{uuid}.{ext}`.
- When `customFontUrl` and `customFontName` are set, templates inject a dynamic `@font-face` CSS rule and apply the custom font family to all text.

---

## 3. Typography Stack
We support dynamic loading of curated font families from Google Fonts, plus user-uploaded custom fonts.

| Preset Combination | Heading Font | Body Font | Feel / Category |
|--------------------|--------------|-----------|-----------------|
| **Inter + Inter**  | Inter        | Inter     | Modern / Tech   |
| **Poppins + Lato** | Poppins      | Lato      | Creative / Soft |
| **Playfair + Noto**| Playfair     | Noto Sans | Elegant / Academic |
| **Merriweather**   | Merriweather | Roboto    | Classic / Corporate |
| **Roboto Mono**    | Roboto Mono  | Roboto    | Developer / Technical |
| **Custom Upload**  | User-defined | User-defined | User-defined |

---

## 4. Curated Color Palettes (Theme Accents)

| Color Name     | Primary hex | Secondary hex | Background hex | Accent Text |
|----------------|-------------|---------------|----------------|-------------|
| **Slate Gray** | `#1e293b`   | `#64748b`     | `#ffffff`      | `#0f172a`   |
| **Royal Blue** | `#2563eb`   | `#1e3a8a`     | `#ffffff`      | `#3b82f6`   |
| **Emerald Green**| `#059669` | `#064e3b`     | `#ffffff`      | `#10b981`   |
| **Warm Burgundy**| `#991b1b` | `#450a0a`     | `#ffffff`      | `#ef4444`   |
| **Modern Amber**| `#d97706`  | `#78350f`     | `#ffffff`      | `#f59e0b`   |

---

## 5. Resume Templates
The templates are implemented in `components/templates/`. Each component receives the `resume_json` data and the `theme_json` properties and renders accordingly:

1. **Modern (`ModernTemplate.tsx`)**:
   - Clean top header layout.
   - Left-column for personal details, languages, skills.
   - Right-column (wider) for experience, projects, education.
2. **Minimalist (`MinimalTemplate.tsx`)**:
   - Center-aligned header.
   - Single-column flow with thin, elegant divider lines.
3. **Classic (`ClassicTemplate.tsx`)**:
   - Left-aligned header, side-by-side dates and company names.
4. **Standard ATS (`AtsTemplate.tsx`)**:
   - Centered top header with role tagline and pipe-separated contact info (Location | Phone | Email | LinkedIn).
   - Core Competencies rendered in a neat 3-column bullet grid with custom circular icons.
   - Experience in inline role/date layout, followed by company name and descriptions.
   - Education rendered in a split-column grid: Date ranges on the left, Degree and Institution on the right.
   - Personal Details & Availability section combining Languages and Interests dynamically.

---

## 6. PDF Rendering Engine
- **Method**: Client-side jsPDF rendering engine (`doc.html()`).
- **Features**: Generates printable PDF layouts preserving styles, margins, and custom fonts.
- **Page Breaking**: Uses `autoPaging: "text"` configuration to split pages cleanly.
- **Fallback**: Triggers browser print-to-pdf flow (`window.print()`) if dynamic import or canvas rendering fails.

---

## 7. Global Scrollbar Design
Defined in `app/globals.css` under `@layer base`:
- **Track**: `#09090b` (zinc-950)
- **Thumb**: `#27272a` (zinc-800) with `border-radius: 9999px`
- **Hover**: `#3b82f6` (blue-500)
- **Width**: 8px (thin scrollbar via `scrollbar-width: thin`)
- Single scrollbar on `html` (`overflow-y: auto`), `body` uses `overflow-y: visible` to prevent double scrollbars.

---

## 8. Authentication UI Design
Split-screen layout inspired by MongoDB Atlas console:
- **Left panel**: Auth form with Google OAuth button, Email input (Magic Link for signup / OTP for login), back navigation.
- **Right panel**: Branded gradient with floating value proposition text.
- **Color scheme**: Deep forest slate (`#001e2b`) background with emerald green (`#00ed64`) accent borders.
- **Email Verification Page**: Beautiful console check-envelope instructions with automated 3-second animated redirect countdown upon confirmation.
