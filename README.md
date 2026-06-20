# cribbage-frontend

Standalone Vite + React SPA for managing Cribbage user accounts. Authenticates via Auth0 and calls the shared API Gateway (`/v1/users`).

## Prerequisites

- Node.js 20+
- Auth0 + AWS `dev` infrastructure applied ([cribbage-infra](../cribbage-infra/))
- `cribbage-users` service deployed to the `dev` stage

## Local development

1. Copy environment template and fill in real values (required — placeholder values in `.env.development` are for build/CI only):

   ```bash
   cp .env.example .env.local
   ```

2. Set Auth0 variables from [cribbage-infra/auth0/client.tf](../cribbage-infra/auth0/client.tf) (League Manager SPA client):

   | Variable               | Example                             |
   | ---------------------- | ----------------------------------- |
   | `VITE_AUTH0_DOMAIN`    | `dev-v6z54gz472vyqqrg.us.auth0.com` |
   | `VITE_AUTH0_CLIENT_ID` | `TGxV41GA4htsvX53Pxb5DX9JtUipOF0e`  |
   | `VITE_AUTH0_AUDIENCE`  | `https://noard.org/cribbage/`       |

   The Auth0 Allowed Callback URL must match the app entry URL (with trailing slash). At web root that is `http://localhost:5173/`; omit `VITE_BASE_PATH` locally. For a subdirectory deploy, set `VITE_BASE_PATH=/cribbage` and register the matching callback in Auth0 (e.g. `https://example.com/cribbage/`).

3. Set the API base URL (no trailing slash). For `dev`:

   ```bash
   aws ssm get-parameter \
     --name /cribbage/dev/api-gateway/invoke-url \
     --query Parameter.Value \
     --output text
   ```

   Example: `https://abc123.execute-api.us-east-1.amazonaws.com/dev`

4. Install and run:

   ```bash
   npm install
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173), sign in with Auth0, and manage users.

`.env.local` overrides `.env.production` and is gitignored — use it for real Auth0 and API values.

**Vite env priority (later wins):** `.env` → `.env.local` → `.env.[mode]` → `.env.[mode].local`. Do not put real secrets in committed `.env.production` (CI placeholders only).

## Scripts

| Command           | Description                             |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Start Vite dev server                   |
| `npm run build`   | Typecheck + production build to `dist/` |
| `npm run preview` | Preview production build locally        |
| `npm run lint`    | Oxlint                                  |
| `npm run format`  | Prettier write                          |
| `npm run check`   | build + lint + format check             |

## API surface used

| Method | Path               | Auth |
| ------ | ------------------ | ---- |
| GET    | `/v1/users/health` | None |
| GET    | `/v1/users`        | JWT  |
| POST   | `/v1/users`        | JWT  |
| GET    | `/v1/users/{id}`   | JWT  |
| PUT    | `/v1/users/{id}`   | JWT  |

## Deployment

This repo produces static assets in `dist/` suitable for S3 + CloudFront, Netlify, Vercel, etc.

### Base path

By default the app assumes web root (`/`). For production under a subdirectory (e.g. `https://example.com/cribbage`), set at **build time**:

```bash
VITE_BASE_PATH=/cribbage npm run build
```

If `VITE_BASE_PATH` is unset, empty, or whitespace, the app uses `/`.

Test locally:

```bash
VITE_BASE_PATH=/cribbage npm run build && npm run preview
```

Open the preview URL shown by Vite (include `/cribbage/` in the path).

### Auth0 and CORS

Before hosting in a new environment, update **separately** in `cribbage-infra`:

- Auth0 SPA callback, logout, and web origin URLs via `spa_callback_urls`, `spa_logout_urls`, and `spa_web_origins` in [`auth0/variables.tf`](../cribbage-infra/auth0/variables.tf) (or a `.tfvars` file). Callback and logout URLs must match `${origin}${VITE_BASE_PATH}/` exactly.
- API Gateway CORS `api_cors_allow_origins` for the hosted origin (scheme + host, no path)

### Static hosting

Configure the host so:

- Built assets are served under the base path prefix when `VITE_BASE_PATH` is not `/`
- Unknown routes under that prefix return `index.html` for client-side routing (`BrowserRouter` + `basename`)

Example: with `VITE_BASE_PATH=/cribbage`, `/cribbage/users` must serve `index.html` and load assets from `/cribbage/assets/...`.

## Repository boundary

All frontend code lives in this directory. No runtime dependency on sibling repos — only HTTP calls to the deployed API and Auth0.
