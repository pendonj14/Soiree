# GitHub Actions CI/CD Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create two GitHub Actions workflow files that run lint/build checks on PRs and automatically deploy the frontend to Vercel and backend to Render on every push to `main`.

**Architecture:** Two workflows — `ci.yml` handles PR quality gates with two parallel jobs (frontend lint+build, backend syntax check); `deploy.yml` re-runs the same CI jobs as prerequisites before deploying frontend via Vercel CLI and triggering backend via Render deploy hook. Nothing deploys if CI fails.

**Tech Stack:** GitHub Actions, Node.js 20, Vercel CLI (v latest), Render Deploy Hook (curl)

---

## File Map

| Action | Path | Purpose |
|---|---|---|
| Create | `.github/workflows/ci.yml` | PR lint + build gate |
| Create | `.github/workflows/deploy.yml` | Push-to-main deploy pipeline |

---

### Task 1: Create `.github/workflows/ci.yml`

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create the workflows directory**

```bash
mkdir -p .github/workflows
```

- [ ] **Step 2: Write `ci.yml`**

Create `.github/workflows/ci.yml` with this exact content:

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  lint-and-build-frontend:
    name: Lint & Build Frontend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install frontend dependencies
        working-directory: frontend
        run: npm ci

      - name: Lint
        working-directory: frontend
        run: npm run lint

      - name: Build
        working-directory: frontend
        run: npm run build
        env:
          VITE_API_URL: https://placeholder.example.com/api

  check-backend:
    name: Check Backend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: package-lock.json

      - name: Install backend dependencies
        run: npm ci

      - name: Syntax check
        run: node --check backend/src/index.js
```

- [ ] **Step 3: Verify file was written**

```bash
node -e "const fs = require('fs'); const c = fs.readFileSync('.github/workflows/ci.yml', 'utf8'); console.log('ci.yml: ' + c.split('\n').length + ' lines');"
```

Expected output: `ci.yml: 47 lines` (approximate)

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add PR lint and build check workflow"
```

---

### Task 2: Create `.github/workflows/deploy.yml`

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Write `deploy.yml`**

Create `.github/workflows/deploy.yml` with this exact content:

```yaml
name: Deploy

on:
  push:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  lint-and-build-frontend:
    name: Lint & Build Frontend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install frontend dependencies
        working-directory: frontend
        run: npm ci

      - name: Lint
        working-directory: frontend
        run: npm run lint

      - name: Build
        working-directory: frontend
        run: npm run build
        env:
          VITE_API_URL: https://placeholder.example.com/api

  check-backend:
    name: Check Backend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: package-lock.json

      - name: Install backend dependencies
        run: npm ci

      - name: Syntax check
        run: node --check backend/src/index.js

  deploy-frontend:
    name: Deploy Frontend to Vercel
    needs: [lint-and-build-frontend, check-backend]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel environment
        working-directory: frontend
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build for Vercel
        working-directory: frontend
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Vercel
        working-directory: frontend
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    name: Deploy Backend to Render
    needs: [lint-and-build-frontend, check-backend]
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render deploy
        run: curl -fsSX POST "${{ secrets.RENDER_DEPLOY_HOOK_URL }}"
```

- [ ] **Step 2: Verify file was written**

```bash
node -e "const fs = require('fs'); const c = fs.readFileSync('.github/workflows/deploy.yml', 'utf8'); console.log('deploy.yml: ' + c.split('\n').length + ' lines');"
```

Expected output: `deploy.yml: 73 lines` (approximate)

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add push-to-main deploy pipeline"
```

---

### Task 3: Push and verify CI runs on GitHub

- [ ] **Step 1: Push both commits to GitHub**

```bash
git push origin main
```

- [ ] **Step 2: Verify the Deploy workflow triggers**

Open your GitHub repo → Actions tab. You should see a `Deploy` workflow run triggered by the push. The `lint-and-build-frontend` and `check-backend` jobs should pass. The `deploy-frontend` and `deploy-backend` jobs will fail with a missing secrets error — this is expected until secrets are configured.

- [ ] **Step 3: Test CI on a PR**

```bash
git checkout -b test/ci-check
echo "" >> README.md
git add README.md
git commit -m "test: verify CI triggers on PR"
git push origin test/ci-check
```

Open a PR on GitHub from `test/ci-check` → `main`. The `Lint & Build Frontend` and `Check Backend` status checks should appear and pass.

- [ ] **Step 4: Clean up test branch**

```bash
git checkout main
git branch -d test/ci-check
git push origin --delete test/ci-check
```

---

### Task 4: Configure secrets and deploy (when ready to go live)

Complete this task only after the app works correctly on localhost.

- [ ] **Step 1: Link the frontend to a Vercel project**

Run inside `frontend/`:

```bash
cd frontend
npx vercel
```

Follow the prompts. When done, Vercel will print your **Org ID** and **Project ID** — copy both. You can also find them at: Vercel dashboard → your project → Settings → General.

- [ ] **Step 2: Set `VITE_API_URL` in Vercel dashboard**

Go to: Vercel dashboard → your project → Settings → Environment Variables

Add a new variable:
- Name: `VITE_API_URL`
- Value: `https://your-render-service.onrender.com/api` (replace with your actual Render URL)
- Environment: Production only

This is how the frontend will know where the backend is when deployed — the Vercel CLI pulls these vars during the build step in the workflow.

- [ ] **Step 3: Get your Render deploy hook URL**

Go to: Render dashboard → your backend service → Settings → Deploy Hook

Click **Generate Deploy Hook** and copy the URL.

- [ ] **Step 4: Add secrets to GitHub**

Go to: GitHub repo → Settings → Secrets and variables → Actions → New repository secret

Add each of the following:

| Secret name | Where to get it |
|---|---|
| `VERCEL_TOKEN` | Vercel dashboard → Account Settings → Tokens → Create |
| `VERCEL_ORG_ID` | From Step 1 output, or Vercel project → Settings → General |
| `VERCEL_PROJECT_ID` | From Step 1 output, or Vercel project → Settings → General |
| `RENDER_DEPLOY_HOOK_URL` | From Step 3 |

- [ ] **Step 5: Push to main and verify full deploy**

```bash
git push origin main
```

In GitHub Actions, all 4 jobs should now pass: `Lint & Build Frontend`, `Check Backend`, `Deploy Frontend to Vercel`, `Deploy Backend to Render`.

---

### Task 5: Enable branch protection (when ready)

- [ ] **Step 1: Add branch protection rule for `main`**

Go to: GitHub repo → Settings → Branches → Add branch protection rule

Set:
- Branch name pattern: `main`
- Check **Require a pull request before merging**
- Check **Require status checks to pass before merging**
  - Search and add: `Lint & Build Frontend`
  - Search and add: `Check Backend`
- Check **Require branches to be up to date before merging**

Click **Save changes**.

PRs that fail lint or build will now be blocked from merging to `main`.
