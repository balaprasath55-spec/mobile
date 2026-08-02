# MR Mobile Zone Service (Demo)

Premium marketing site + admin CRM demo for a Chennai mobile repair business.

**No database required.** All CRM data is in-memory mock data.

## Run

```bash
npm install
npm run build
npm start
```

Or for development: `npm run dev`

Open [http://localhost:3000](http://localhost:3000).

## Demo admin login

- **URL:** `/login`
- **Email:** `admin@mrmobilezone.com`
- **Password:** `Admin@12345`

## Try the CRM

1. Login → Dashboard (sample jobs & stats)
2. **Customers** — search, edit, add new
3. Open a customer → **New job** → advance status
4. **Enquiries** → Convert to job
5. Public site: `/pricing` estimator, `/enquiry` form

Note: demo data resets when the server process restarts.
