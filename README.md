# MR Mobile Zone

This repository is split into:

| Folder / branch | Role |
|-----------------|------|
| [`frontend/`](frontend/) on **`main`** | Next.js marketing site + admin CRM |
| [`backend/`](backend/) on **`backend`** branch | Express + MongoDB API |

## Run locally

Terminal 1 — API:

```bash
cd backend
cp .env.example .env.local   # set MONGODB_URI
npm install
npm run dev                  # http://localhost:4000
```

Terminal 2 — UI:

```bash
cd frontend
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev                  # http://localhost:3000
```

Demo admin: `admin@mrmobilezone.com` / `Admin@12345`
