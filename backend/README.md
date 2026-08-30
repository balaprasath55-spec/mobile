# MR Mobile Zone — Backend API

Express + MongoDB API for the MR Mobile Zone site and admin CRM.

## Setup

```bash
cd backend
cp .env.example .env.local   # set MONGODB_URI
npm install
npm run dev                  # http://localhost:4000
```

## Scripts

- `npm run dev` — watch mode
- `npm run build` / `npm start` — production
- `npm run db:seed:mongo` — import shop data (place `mobile_zone_service.json` in this folder)
- `npm run db:check` — test Mongo connection

## Frontend

Run the Next.js app from the `frontend/` folder on `main` with:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Health check: `GET /health`
