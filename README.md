# NutriLens - AI Calorie Tracker

Snap a photo of your meal or describe it in words, and an AI vision model estimates
the calories and macros. One FastAPI backend powers both a **web app** and a **native
mobile app**.

## Features

- AI calorie & macro estimation from a **food photo** or a **text description**
- Review and edit the AI's estimate before saving
- Daily dashboard: calories vs. goal, protein / carbs / fat breakdown
- Customizable daily goals
- 7-day history with a trend chart
- Email/password auth (JWT)
- Shared TypeScript API client + types used by both web and mobile
- `MOCK_AI` mode so you can run everything locally without an API key or cost

## Architecture

```
                +-------------------+
   Web (React)  |                   |
   ------------>|   FastAPI backend |---> PostgreSQL / SQLite
   Mobile (Expo)|   (Python)        |---> Vision LLM (GPT-4o / Gemini)
   ------------>|                   |---> Image storage (local / S3)
                +-------------------+
```

| Part        | Stack                                                            | Folder      |
| ----------- | ---------------------------------------------------------------- | ----------- |
| Backend     | Python, FastAPI, SQLAlchemy, JWT, OpenAI SDK                     | `backend/`  |
| Web app     | React, Vite, TypeScript, TanStack Query, Tailwind CSS, Recharts | `web/`      |
| Mobile app  | React Native (Expo), TypeScript, React Navigation               | `mobile/`   |
| Shared code | TypeScript API client + types                                    | `shared/`   |

## Quick start

### 1. Backend (Python 3.11+)

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate    |    macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env        # macOS/Linux: cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

The API is now at http://localhost:8000 (interactive docs at `/docs`).

By default `MOCK_AI=true`, so the AI endpoints return deterministic canned data and
no API key is required. To use the real model, set `MOCK_AI=false` and provide
`OPENAI_API_KEY` in `backend/.env`.

### 2. Web app

```bash
cd web
npm install
copy .env.example .env        # ensure VITE_API_URL points at the backend
npm run dev
```

Open http://localhost:5173, create an account, and start logging meals.

### 3. Mobile app (Expo)

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with **Expo Go** (or press `a` / `i` for an emulator/simulator).

> Set the backend URL in `mobile/src/config.ts`:
> - iOS simulator: `http://localhost:8000`
> - Android emulator: `http://10.0.2.2:8000`
> - Physical device: your computer's LAN IP, e.g. `http://192.168.1.20:8000`

## Run the backend with Docker (Postgres)

```bash
docker compose up --build
```

This starts Postgres and the backend on http://localhost:8000.

## Deploy live (Vercel + Render)

This repo ships ready-to-use config to host the whole app for free:

- **Web (frontend)** -> Vercel (`web/vercel.json`)
- **Backend + Postgres** -> Render (`render.yaml` blueprint)

### 1. Push to GitHub

```bash
git add . && git commit -m "Add deploy config" && git push
```

### 2. Backend on Render

1. Go to [Render](https://render.com) -> **New +** -> **Blueprint** and pick this repo.
2. Render reads `render.yaml` and creates the `nutrilens-api` web service plus the
   `nutrilens-db` Postgres database. `DATABASE_URL` and `SECRET_KEY` are wired
   automatically.
3. Leave `CORS_ORIGINS` empty for now (you'll fill it after step 3), click **Apply**.
4. When the service is live, copy its URL, e.g. `https://nutrilens-api.onrender.com`.

> To use the real AI model instead of mock data: set `MOCK_AI=false` and add
> `OPENAI_API_KEY` in the service's **Environment** tab.

### 3. Web on Vercel

1. Go to [Vercel](https://vercel.com) -> **Add New** -> **Project**, import this repo.
2. Set **Root Directory** to `web`. Vercel auto-detects Vite via `web/vercel.json`.
3. Add an environment variable: `VITE_API_URL = https://nutrilens-api.onrender.com`
   (your Render URL from step 2).
4. **Deploy**, then copy the resulting URL, e.g. `https://nutrilens.vercel.app`.

### 4. Connect the two (CORS)

Back in Render, set `CORS_ORIGINS` to your Vercel URL (e.g.
`https://nutrilens.vercel.app`) and let it redeploy. Done - the live site can now
talk to the API.

> **Free-tier notes:** Render free services sleep after inactivity (first request
> wakes them, ~30s cold start). Uploaded images live on ephemeral disk and are lost
> on redeploy - swap `UPLOAD_DIR` for S3-compatible storage for persistence.

## Switching the AI provider

`backend/app/services/ai.py` isolates all AI calls behind `analyze_text()` and
`analyze_image()`. It uses OpenAI's vision model by default with a strict JSON
schema. To swap to Gemini or a specialized nutrition API, implement those two
functions; nothing else in the app needs to change.

## Project layout

```
backend/    FastAPI app (routers, models, services, migrations)
web/        Vite + React web client
mobile/     Expo React Native client
shared/     Shared TS types + framework-agnostic ApiClient
```

## Notes

- The backend auto-creates tables on startup (great for SQLite dev). For Postgres
  in production, use the included Alembic setup (`backend/migrations/`).
- Uploaded images are stored on local disk under `backend/uploads/` and served at
  `/uploads/...`. Swap for S3-compatible storage for production.
- `.env` files and `*.db` are gitignored; never commit secrets.
