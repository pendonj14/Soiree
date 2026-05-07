# GitHub Actions CI/CD Pipeline — Design Spec

**Date:** 2026-05-07
**Project:** SORIER (React/Vite frontend + Express/MongoDB backend)
**Deployment targets:** Vercel (frontend), Render (backend)

---

## Overview

Two GitHub Actions workflow files will live in `.github/workflows/`:

| File | Trigger | Purpose |
|---|---|---|
| `ci.yml` | Pull request to `main` | Lint + build check on every PR |
| `deploy.yml` | Push to `main` | CI check → deploy frontend to Vercel → deploy backend to Render |

**Core principle:** The deploy workflow re-runs CI before deploying. A broken push to `main` fails the CI job and skips all deploys — nothing broken reaches production.

The deploy jobs are inert until GitHub secrets are configured. CI checks on PRs work immediately after setup.

---

## Workflow 1: `ci.yml`

**Trigger:** `pull_request` targeting `main`

### Jobs (run in parallel)

**`lint-and-build-frontend`**
1. Checkout code
2. Setup Node.js 20
3. `npm ci` inside `frontend/`
4. `npm run lint`
5. `npm run build` (with `VITE_API_URL` set to a placeholder to prevent build failure without real URL)

**`check-backend`**
1. Checkout code
2. Setup Node.js 20
3. `npm ci` at root
4. `node --check backend/src/index.js` (syntax/module dry-run, no server startup)

Both jobs must pass for the PR to be mergeable (enforced via GitHub branch protection rules).

---

## Workflow 2: `deploy.yml`

**Trigger:** `push` to `main`

### Jobs (sequential where noted)

**Job 1: `ci`**
- Same steps as `ci.yml` — lint, build, backend check
- All downstream jobs depend on this passing

**Job 2: `deploy-frontend`** (depends on `ci`)
- Checkout code
- Deploy to Vercel using `amondnet/vercel-action`
- Passes `VITE_API_URL` as a build environment variable pointing to the production Render URL

**Job 3: `deploy-backend`** (depends on `ci`, runs parallel with `deploy-frontend`)
- `curl -X POST "$RENDER_DEPLOY_HOOK_URL"` — triggers Render to redeploy the backend service

---

## Secrets Required

Add these in GitHub → Settings → Secrets and variables → Actions:

| Secret name | Where to get it |
|---|---|
| `VERCEL_TOKEN` | Vercel dashboard → Account Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel project → Settings → General |
| `VERCEL_PROJECT_ID` | Vercel project → Settings → General |
| `RENDER_DEPLOY_HOOK_URL` | Render dashboard → your service → Settings → Deploy Hook |
| `VITE_API_URL` | Your Render backend URL, e.g. `https://sorier-api.onrender.com/api` |

---

## Branch Protection (recommended, set up when ready to deploy)

In GitHub → Settings → Branches → Add rule for `main`:
- Require status checks to pass before merging
- Required checks: `lint-and-build-frontend`, `check-backend`
- Require branches to be up to date before merging

---

## What Works Immediately vs. Later

| Feature | Works now? | Requires |
|---|---|---|
| PR lint + build checks | Yes, after committing workflow files | Nothing extra |
| Frontend deploy on push to `main` | No | Vercel secrets + Vercel project setup |
| Backend deploy on push to `main` | No | Render service + deploy hook secret |
| Branch protection enforcement | No | Manual setup in GitHub settings |

---

## Files to Create

```
.github/
└── workflows/
    ├── ci.yml
    └── deploy.yml
```

No other project files need to change.
