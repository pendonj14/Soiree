# Project Instructions

## Commands

```bash
# Backend (project root — port 4000)
npm run dev          # nodemon, hot reload
npm start            # no hot reload

# Frontend (run from frontend/)
cd frontend && npm run dev      # Vite dev server (port 5173)
cd frontend && npm run build    # production build
cd frontend && npm run lint     # ESLint check
```

## Architecture

Dual-package repo: `backend/src/` (Express MVC — controllers, routes, middleware, models, config) + `frontend/src/` (React — pages, components, context, hooks, services). Root `package.json` manages backend only; `frontend/package.json` manages frontend only.

## Key Decisions

- JWT stored in `localStorage` (`soiree_token`). Not httpOnly cookies — XSS tradeoff accepted for simplicity.
- Cloudinary for all media uploads; no local file storage.
- MongoDB via Mongoose — schema-per-model pattern, no traditional migrations.
