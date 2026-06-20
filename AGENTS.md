# Agent instructions

Standalone frontend for the Cribbage platform. This repo builds and deploys independently — it talks to backend services only over HTTPS.

## Platform standards (reference)

When aligning with backend conventions, see sibling repo docs:

- ../cribbage-platform/docs/coding-conventions.md
- ../cribbage-platform/docs/philosophy.md

## This app

- **Stack:** Vite, React, TypeScript, Tailwind CSS, Auth0, TanStack Query, React Router
- **API:** `{VITE_API_BASE_URL}/v1/users` (JWT via Auth0 access token)
- **Local dev:** `npm run dev` on port 5173 (Auth0 and CORS already allow this origin)
- **Base path:** optional `VITE_BASE_PATH` (defaults to `/`). Set e.g. `/cribbage` for subdirectory deploys; wired into Vite `base`, React Router `basename`, and Auth0 redirect/logout URLs.

## Local overrides

(none)
