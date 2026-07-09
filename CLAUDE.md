# CLAUDE.md - Build & Guidelines

## Core Commands
- **Start Dev Server**: `npm run dev`
- **Build Application**: `npm run build`
- **Start Production Server**: `npm run start`
- **Lint Codebase**: `npm run lint`

## Code Guidelines
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4.
- **State**: Zustand stores global UI/resume data.
- **Database/Auth**: Supabase SSR clients in `lib/client.ts`, `lib/server.ts`, and `lib/middleware.ts`.
- **Path Alias**: `@/*` resolves to `./*` (root folder).

## Strict Developer & Agent Rules
See [AGENTS.md](./AGENTS.md) for mandatory rules regarding documentation sync, cleaning up agent comments, and checking documentation first.
