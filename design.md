# Design System & Theme Engine

This document outlines the UI/UX architecture, visual aesthetics, theme properties, and dynamic styling engine of Resume Solutions.

---

## 1. Visual Identity & Aesthetics
The application workspace features a premium, modern design following these core principles:
- **Clean Contrast**: A dark-mode workspace editor dashboard contrasts with a clean, high-fidelity light-mode resume preview. This ensures ease of editing and accurate print visualization.
- **Glassmorphism**: Subtle backdrops, thin borders, and soft shadows for sidebar panels.
- **Micro-Animations**: Framer Motion handles section dragging, active button states, and live update indicators.
- **Typography Hierarchy**: Clear font scale adjustments between heading and body fonts.

---

## 2. Dynamic Theme Schema (`theme_json`)
Every resume document contains a styling object stored in the database as `theme_json`. The preview pane and templates read this configuration and dynamically apply standard Tailwind CSS utility styles.

```typescript
export interface ThemeConfig {
  fontFamily: string;     // Heading & Body font combination
  primaryColor: string;   // Accent/brand color for headings, icons, borders
  secondaryColor: string; // Subheadings & metadata text color
  textColor: string;      // Body font color
  backgroundColor: string;// Paper background color
  spacing: "compact" | "comfortable" | "loose";
  borderRadius: "none" | "small" | "medium" | "large";
  fontSize: "sm" | "base" | "lg";
  sectionOrder: string[]; // Section IDs for drag-and-drop reordering
}
```

### Design Token Mappings

#### Spacing Configs (Margin & Padding)
- **`compact`**: Heading margins: `1.5rem`, section paddings: `0.5rem`, line height: `1.25`.
- **`comfortable`**: Heading margins: `2.25rem`, section paddings: `0.85rem`, line height: `1.5`.
- **`loose`**: Heading margins: `3.0rem`, section paddings: `1.2rem`, line height: `1.75`.

#### Border Radius Mappings
- **`none`**: `0px`
- **`small`**: `4px` (`rounded-sm`)
- **`medium`**: `8px` (`rounded-md`)
- **`large`**: `12px` (`rounded-lg`)

---

## 3. Typography Stack
We support dynamic loading of curated font families from Google Fonts. Users can choose from combinations of serif (for elegant/classic looks) and sans-serif (for modern/clean resumes).

| Preset Combination | Heading Font | Body Font | Feel / Category |
|--------------------|--------------|-----------|-----------------|
| **Inter + Inter**  | Inter        | Inter     | Modern / Tech   |
| **Poppins + Lato** | Poppins      | Lato      | Creative / Soft |
| **Playfair + Noto**| Playfair     | Noto Sans | Elegant / Academic |
| **Merriweather**   | Merriweather | Roboto    | Classic / Corporate |
| **Roboto Mono**    | Roboto Mono  | Roboto    | Developer / Technical |

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

1. **Modern (`modern.tsx`)**:
   - Clean top header layout.
   - Left-column for personal details, languages, skills.
   - Right-column (wider) for experience, projects, education.
2. **Minimalist (`minimal.tsx`)**:
   - Center-aligned header.
   - Single-column flow with thin, elegant divider lines.
   - Ideal for single-page resumes.
3. **Classic (`classic.tsx`)**:
   - Left-aligned header, side-by-side dates and company names.
   - Solid font sizing, excellent readability for ATS tracking.
4. **Creative (`creative.tsx`)**:
   - Dynamic top banner color block.
   - Asymmetric two-column grid layout with colorful icon elements.

---

## 6. PDF Rendering Engine
To achieve pixel-perfect outputs, we support two methods:
- **`react-to-print`**: Leverages the browser's native CSS print media engine (`@media print`). This translates Tailwind CSS styles directly onto standard A4 paper dimensions with native font quality.
- **`@react-pdf/renderer`**: Pre-compiles the JSON tree into a PDF stream, generating downloadable PDF files programmatically.
