# MR Mobile Zone Service — Build Specification for AI-Assisted Development (Cursor)

> **How to use this file:** Paste this entire document into Cursor as project context (or save it as `PROJECT_SPEC.md` in the repo root and reference it in your prompts / `.cursorrules`). Build phase by phase, in order. Do not skip ahead to Phase 3+ until Phase 1–2 pages/routes exist and run locally. Each phase ends with a "Definition of Done" checklist — treat it as a gate.

---

## 0. Project Identity

- **Project name:** MR Mobile Zone Service
- **What it is:** Premium marketing website + admin CRM (customer/repair management) + inventory management system for a mobile phone repair business in Chennai, India.
- **Business:** Mobile & tablet repair shop — displays, batteries, back glass, motherboard/water damage, iPhone/iPad specialist work, plus an all-India courier repair service.
- **Brand assets already in market:** 146,000+ Instagram followers, 35,000+ YouTube subscribers, 11,000+ existing customer records (to migrate later).
- **Design bar:** Apple / Samsung / Nothing / Tesla / Cuberto / Awwwards-tier. Not a generic template. Confident typography, restrained motion, generous whitespace, real premium feel — not "animated for the sake of it."

---

## 1. Locked Technology Stack

Do not ask the user to choose — build with this stack. This is final.

| Layer | Choice |
|---|---|
| Framework | **Next.js 14+ (App Router)**, TypeScript strict mode |
| Styling | **Tailwind CSS** + **Framer Motion** for animation |
| UI primitives | **shadcn/ui** (Radix-based) for form controls, dialogs, dropdowns |
| Backend | Next.js Route Handlers (`app/api/**`) — no separate backend service needed at this scale |
| ORM | **Prisma** |
| Database | **PostgreSQL** |
| Auth | **NextAuth.js (Auth.js)** — credentials provider (email+password) for admin; JWT session |
| File/image storage | Local `/public/uploads` in dev → **S3-compatible bucket** (e.g., Cloudflare R2 or AWS S3) in production |
| Image optimization | `next/image` |
| Validation | **Zod** (shared schemas between client forms and API route handlers) |
| Charts (admin reports) | **Recharts** |
| Deployment target | **Vercel** (frontend/API) + managed Postgres (Neon/Supabase/RDS) |

Package manager: **pnpm**. Node version: 20 LTS.

---

## 2. Repository Structure

Build to this structure. Keep the public marketing site and the admin panel in the same Next.js app, separated by route groups.

```
mr-mobile-zone/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (marketing)/                 # public site — route group, shares marketing layout
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                 # Home
│   │   │   ├── about/page.tsx
│   │   │   ├── services/
│   │   │   │   ├── page.tsx             # Services overview
│   │   │   │   └── [slug]/page.tsx      # Service detail (dynamic)
│   │   │   ├── pricing/page.tsx         # Price Estimator page
│   │   │   ├── devices/page.tsx         # Device Models
│   │   │   ├── courier/page.tsx
│   │   │   ├── testimonials/page.tsx
│   │   │   ├── gallery/page.tsx
│   │   │   ├── why-us/page.tsx
│   │   │   ├── faq/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── enquiry/page.tsx
│   │   │   ├── course/page.tsx          # Coming Soon
│   │   │   ├── privacy/page.tsx
│   │   │   ├── terms/page.tsx
│   │   │   ├── search/page.tsx
│   │   │   └── not-found.tsx            # 404
│   │   ├── (admin)/
│   │   │   ├── layout.tsx               # admin shell: sidebar + topbar, auth-gated
│   │   │   ├── login/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── customers/
│   │   │   │   ├── page.tsx             # list/search/filter
│   │   │   │   ├── [id]/page.tsx        # detail + history
│   │   │   │   └── new/page.tsx
│   │   │   ├── inventory/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── suppliers/page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   ├── pricing-admin/page.tsx   # brands/models/issues/price CRUD
│   │   │   ├── enquiries/page.tsx
│   │   │   ├── reports/page.tsx
│   │   │   └── settings/
│   │   │       ├── users/page.tsx
│   │   │       └── audit-log/page.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── customers/route.ts
│   │       ├── customers/[id]/route.ts
│   │       ├── repairs/route.ts
│   │       ├── repairs/[id]/route.ts
│   │       ├── repairs/[id]/status/route.ts
│   │       ├── brands/route.ts
│   │       ├── models/route.ts
│   │       ├── issues/route.ts
│   │       ├── estimate/route.ts
│   │       ├── inventory/route.ts
│   │       ├── inventory/[id]/route.ts
│   │       ├── enquiries/route.ts
│   │       ├── enquiries/[id]/route.ts
│   │       ├── reports/[type]/route.ts
│   │       ├── uploads/route.ts
│   │       └── course/notify/route.ts
│   ├── components/
│   │   ├── marketing/                   # Hero, StatsCounter, ServiceCard, ReviewCarousel, etc.
│   │   ├── admin/                       # DataTable, StatCard, JobStatusBadge, etc.
│   │   └── ui/                          # shadcn generated components
│   ├── lib/
│   │   ├── db.ts                        # Prisma client singleton
│   │   ├── auth.ts                      # NextAuth config
│   │   ├── validators/                  # Zod schemas
│   │   └── rbac.ts                      # role/permission helpers
│   ├── styles/globals.css
│   └── types/
├── public/
├── .env.example
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## 3. Design System (apply consistently everywhere)

Define these as Tailwind theme extensions in `tailwind.config.ts` and use them exclusively — no ad hoc hex codes in components.

```ts
colors: {
  navy:   { DEFAULT: '#1B2A4A', 50: '#EEF1F6', ... },
  accent: { DEFAULT: '#2E6FDB' },
  ink:    '#0F1420',
  muted:  '#5B6472',
  surface:'#F7F8FA',
}
```

- **Typography:** one confident display/serif-adjacent font for H1/H2 (e.g., "Clash Display" or "General Sans" via next/font), one clean grotesk for body (e.g., "Inter"). Consistent type scale: `text-5xl/6xl` hero, `text-3xl` section headings, `text-base` body.
- **Radius:** `rounded-2xl` for cards, `rounded-full` for pills/buttons.
- **Shadow:** one soft elevation shadow reused everywhere (`shadow-[0_8px_30px_rgba(0,0,0,0.06)]`), avoid harsh default drop shadows.
- **Dark mode:** implement via `class` strategy (`darkMode: 'class'`) with a persistent toggle (localStorage), not just `prefers-color-scheme`.
- **Motion:** use Framer Motion `whileInView` for scroll-reveal, shared `transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}` easing across the app for consistency. Respect `prefers-reduced-motion`.

---

## 4. Database Schema (Prisma)

Build `prisma/schema.prisma` with this model set. Field names are directives, not suggestions — keep them so downstream reports/APIs line up with the rest of this spec.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  SUPER_ADMIN
  ADMIN
  STAFF
}

enum RepairStatus {
  RECEIVED
  DIAGNOSED
  IN_REPAIR
  QUALITY_CHECK
  READY_FOR_DELIVERY
  DELIVERED
  CLOSED
}

enum EnquiryStatus {
  NEW
  CONTACTED
  CONVERTED
  CLOSED
}

model AdminUser {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  role         Role     @default(ADMIN)
  isActive     Boolean  @default(true)
  lastLogin    DateTime?
  createdAt    DateTime @default(now())
  auditLogs    AuditLog[]
}

model Customer {
  id           String   @id @default(cuid())
  name         String
  phone        String
  altPhone     String?
  address      String?
  location     String?
  createdAt    DateTime @default(now())
  repairs      Repair[]
  @@index([phone])
}

model Brand {
  id       String   @id @default(cuid())
  name     String   @unique
  isActive Boolean  @default(true)
  models   Model[]
}

model Model {
  id       String   @id @default(cuid())
  brandId  String
  brand    Brand    @relation(fields: [brandId], references: [id])
  name     String
  isActive Boolean  @default(true)
  estimates PriceEstimate[]
  repairs   Repair[]
}

model Issue {
  id       String   @id @default(cuid())
  name     String   @unique
  isActive Boolean  @default(true)
  estimates PriceEstimate[]
}

model PriceEstimate {
  id        String   @id @default(cuid())
  modelId   String
  model     Model    @relation(fields: [modelId], references: [id])
  issueId   String
  issue     Issue    @relation(fields: [issueId], references: [id])
  priceMin  Decimal
  priceMax  Decimal
  isActive  Boolean  @default(true)
  updatedBy String?
  updatedAt DateTime @updatedAt
  @@unique([modelId, issueId])
}

model Technician {
  id       String   @id @default(cuid())
  name     String
  phone    String?
  isActive Boolean  @default(true)
  repairs  Repair[]
}

model Repair {
  id             String        @id @default(cuid())
  jobId          String        @unique  // e.g. MRZ-000123, generated on create
  customerId     String
  customer       Customer      @relation(fields: [customerId], references: [id])
  modelId        String?
  model          Model?        @relation(fields: [modelId], references: [id])
  deviceBrandRaw String?       // fallback free-text if brand/model not in catalogue
  deviceModelRaw String?
  imei           String?
  issue          String
  status         RepairStatus  @default(RECEIVED)
  technicianId   String?
  technician     Technician?   @relation(fields: [technicianId], references: [id])
  amount         Decimal?
  advancePaid    Decimal       @default(0)
  warrantyDays   Int?
  deliveryDate   DateTime?
  deliveredAt    DateTime?
  notes          String?
  createdAt      DateTime      @default(now())
  images         RepairImage[]
  parts          RepairPart[]
  @@index([status])
  @@index([imei])
}

model RepairImage {
  id        String   @id @default(cuid())
  repairId  String
  repair    Repair   @relation(fields: [repairId], references: [id])
  url       String
  createdAt DateTime @default(now())
}

model Supplier {
  id      String   @id @default(cuid())
  name    String
  contact String?
  address String?
  items   InventoryItem[]
}

model InventoryItem {
  id                String    @id @default(cuid())
  partModel         String
  supplierId        String?
  supplier          Supplier? @relation(fields: [supplierId], references: [id])
  purchasePrice     Decimal
  sellingPrice      Decimal
  quantity          Int       @default(0)
  lowStockThreshold Int       @default(3)
  invoiceNumber     String?
  purchaseDate      DateTime?
  createdAt         DateTime  @default(now())
  usedIn            RepairPart[]
}

model RepairPart {
  id              String        @id @default(cuid())
  repairId        String
  repair          Repair        @relation(fields: [repairId], references: [id])
  inventoryItemId String
  inventoryItem   InventoryItem @relation(fields: [inventoryItemId], references: [id])
  quantityUsed    Int           @default(1)
}

model Enquiry {
  id        String         @id @default(cuid())
  name      String
  phone     String
  device    String?
  issue     String?
  location  String?
  message   String?
  imageUrl  String?
  status    EnquiryStatus  @default(NEW)
  createdAt DateTime       @default(now())
}

model CourseNotify {
  id        String   @id @default(cuid())
  name      String
  contact   String
  createdAt DateTime @default(now())
}

model AuditLog {
  id          String    @id @default(cuid())
  adminUserId String
  adminUser   AdminUser @relation(fields: [adminUserId], references: [id])
  action      String
  entityType  String
  entityId    String
  changes     Json?
  timestamp   DateTime  @default(now())
}

model Notification {
  id        String   @id @default(cuid())
  type      String
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

Add a `prisma/seed.ts` that inserts: one `SUPER_ADMIN` user, 5–6 brands (Apple, Samsung, Xiaomi, OnePlus, Vivo, Oppo) with a handful of models each, a generic Issues list (Display, Battery, Back Glass, Touch Glass, Face ID, Motherboard/Water Damage), and sample `PriceEstimate` rows so the estimator is demoable immediately.

---

## 5. API Contract

All `/api/**` admin-scoped routes must check the session role server-side (see `lib/rbac.ts`) — never rely on hiding UI only.

| Method & Path | Access | Purpose |
|---|---|---|
| `POST /api/auth/[...nextauth]` | Public | NextAuth handler |
| `GET/POST /api/customers` | Admin | List (search/filter via query params) / create |
| `GET/PUT/DELETE /api/customers/[id]` | Admin | Detail, update, soft-delete |
| `GET/POST /api/repairs` | Admin | List / create job |
| `GET/PUT /api/repairs/[id]` | Admin | Detail, update |
| `PATCH /api/repairs/[id]/status` | Admin | Move through status workflow |
| `GET /api/brands` | Public | For estimator dropdown |
| `GET /api/models?brandId=` | Public | Cascading dropdown |
| `GET /api/issues?modelId=` | Public | Cascading dropdown |
| `GET /api/estimate?modelId=&issueId=` | Public | Returns `{ priceMin, priceMax }` |
| `GET/POST /api/inventory` | Admin | List / create stock item |
| `PUT/DELETE /api/inventory/[id]` | Admin | Update / remove |
| `POST /api/enquiries` | Public (rate-limited) | Customer submits enquiry |
| `GET/PUT /api/enquiries/[id]` | Admin | Manage enquiry lifecycle |
| `GET /api/reports/[type]` | Admin | `daily`, `revenue`, `inventory`, `technician`, `customers` |
| `POST /api/uploads` | Public (rate-limited) + Admin | Image upload with type/size validation |
| `POST /api/course/notify` | Public | Course "Notify Me" capture |

All request/response bodies validated with **Zod** schemas in `lib/validators/`, shared between the API route and the client form (`react-hook-form` + `@hookform/resolvers/zod`).

---

## 6. Public Pages — Build Checklist

Build each page per this spec. Every page: mobile-first, `next/image` for all images, semantic HTML, Lighthouse-friendly.

| Route | Must include |
|---|---|
| `/` (Home) | Hero w/ dual CTA, animated stats counter (IG/YT/Customers/Devices Repaired — Devices Repaired pulled live via API from `Repair` count), services grid, repair process tracker, why-choose-us, reviews carousel, latest YouTube videos row, Instagram feed embed, brand logos, before/after slider teaser, courier banner, final CTA band, map, footer |
| `/about` | Brand story, milestones, team, certifications |
| `/services` | Card grid pulling from a static or CMS-driven service list, links to `/services/[slug]` |
| `/services/[slug]` | Hero, process, price table (pulled from `PriceEstimate` filtered by relevant issue), before/after, warranty terms, FAQ snippet, sticky mobile CTA bar |
| `/pricing` | The interactive estimator: Brand → Model → Issue → animated price range reveal → "Submit Enquiry" prefilled |
| `/devices` | Brand logo grid → model list, links into `/pricing?brandId=&modelId=` |
| `/courier` | Step tracker, supported couriers, turnaround, courier-specific enquiry form |
| `/testimonials` | Google rating badge, filterable review cards |
| `/gallery` | Before/after drag slider, category filter, lightbox |
| `/why-us` | Differentiator cards + comparison table |
| `/faq` | Accordion grouped by category, with FAQPage JSON-LD schema |
| `/contact` | Map embed, click-to-call, click-to-WhatsApp (`https://wa.me/91XXXXXXXXXX`), contact form |
| `/enquiry` | Full enquiry form (Name, Phone, Device, Issue, Location, Message, Image) → `POST /api/enquiries` |
| `/course` | Coming soon + notify-me form → `POST /api/course/notify` |
| `/privacy`, `/terms` | Static legal content |
| `/search` | Client-side/Fuse.js search across static page/service/FAQ index; results `noindex` |
| `not-found.tsx` | Branded 404 with search bar + nav links |

**SEO baseline for every page:** `generateMetadata()` per route with unique title/description, Open Graph tags, canonical URL. Add `LocalBusiness` JSON-LD site-wide (footer or root layout) and `Service` JSON-LD on service pages.

---

## 7. Admin Panel — Build Checklist

- **Auth:** `/login` → NextAuth credentials provider → JWT session with `role` claim. Middleware (`src/middleware.ts`) protects the entire `(admin)` route group, redirecting unauthenticated users to `/login`.
- **`/dashboard`:** widget grid — Today's Repairs, Today's Deliveries, Pending Repairs (aging highlighted), Revenue snapshot (Recharts line/bar, 7-day/30-day toggle), Low Stock Alerts, New Enquiries, Notifications feed.
- **`/customers`:** server-paginated table (search by phone/name/Job ID/IMEI/model/location/date/status — combinable filters), row click → `/customers/[id]` with full repair history and quick "New Job for this Customer" action.
- **`/customers/[id]`:** editable profile, repair history table, "Generate Invoice" (server-rendered PDF via `@react-pdf/renderer` or similar), "Print Receipt" view.
- **`/inventory`:** stock table with low-stock rows visually flagged, add/edit modal, `/inventory/suppliers` sub-view, CSV bulk import (use `papaparse` client-side + a validated bulk-upsert API route).
- **`/pricing-admin`:** three-tab CRUD (Brands / Models / Issues) plus a Price Matrix editor (Model × Issue → min/max), with CSV bulk import for the price matrix.
- **`/enquiries`:** table with status pipeline (New → Contacted → Converted → Closed), one-click "Convert to Job" that pre-fills a new Repair form.
- **`/reports`:** tabs for Daily / Revenue / Inventory / Technician / Most-Repaired-Models, each with a date-range picker and CSV export.
- **`/settings/users`:** Super Admin only — manage Admin/Staff accounts and roles.
- **`/settings/audit-log`:** Super Admin only — read-only table of `AuditLog` entries.

**RBAC rule of thumb:** every mutation (`POST`/`PUT`/`PATCH`/`DELETE`) in `app/api/**` writes an `AuditLog` row (`adminUserId`, `action`, `entityType`, `entityId`, `changes`) inside the same transaction as the mutation.

---

## 8. Build Order (do not reorder)

### Phase 1 — Foundation
- [ ] `create-next-app` with TypeScript, Tailwind, App Router
- [ ] Install and configure Prisma + Postgres connection, run first migration
- [ ] Set up design tokens in `tailwind.config.ts`, fonts via `next/font`
- [ ] Build shared `(marketing)` layout: header/nav (sticky, mobile menu), footer
- [ ] Build Home page fully (this is the quality benchmark for every other page)

### Phase 2 — Public Site Completion
- [ ] Build remaining public pages per Section 6, in this order: Services → Service Detail → Pricing Estimator (with real `/api/brands`, `/api/models`, `/api/issues`, `/api/estimate` reading from seeded DB) → Devices → Courier → Testimonials → Gallery → Why Us → FAQ → Contact → Enquiry → Course → legal pages → 404 → Search

### Phase 3 — Admin Core
- [ ] NextAuth credentials setup + `/login` + middleware route protection
- [ ] Dashboard
- [ ] Customer Management (list, detail, create, edit, search/filter, invoice PDF)
- [ ] Repair job workflow + status transitions
- [ ] Enquiry Management (admin side) wired to the public `/enquiry` submissions

### Phase 4 — Inventory & Pricing Admin
- [ ] Inventory CRUD + Suppliers + low-stock alerting
- [ ] Pricing Admin (Brands/Models/Issues/Price Matrix) + CSV bulk import
- [ ] Wire Repair jobs to consume `InventoryItem` stock via `RepairPart`

### Phase 5 — Reports, RBAC polish, Audit Log
- [ ] Reports module (all report types + CSV export)
- [ ] Full RBAC enforcement audit across every API route
- [ ] Audit log write-through on every mutation + `/settings/audit-log` view
- [ ] `/settings/users` role management

### Phase 6 — Data Migration Tooling
- [ ] CSV/Excel import tool for the 11,000+ legacy customer records: template, dry-run/staging import, duplicate detection (phone+IMEI), validation report, then commit

### Phase 7 — Hardening & Launch
- [ ] Rate limiting on public POST routes (`/api/enquiries`, `/api/uploads`, `/api/course/notify`)
- [ ] Image upload validation (type whitelist, size limit, strip EXIF)
- [ ] Lighthouse pass on Home + one Service page + Pricing page (target 90+ performance, all Core Web Vitals green)
- [ ] `robots.txt`, `sitemap.xml`, JSON-LD schema audit
- [ ] Backup strategy documented/configured for Postgres

**Definition of Done per phase:** the app builds with no TypeScript errors, the relevant pages/routes are reachable and functional against the seeded database, and nothing in a later phase was started before this checklist is fully checked.

---

## 9. Explicitly Out of Scope for This Build

Do not build these now — they are Future Features referenced only so the schema doesn't block them later:
- Full Course platform (payments, video hosting, student login, certificates) — only the `/course` teaser + `CourseNotify` capture is in scope now
- Customer-facing login/portal
- Payment gateway integration
- WhatsApp Business API / SMS gateway integration (build the Enquiry/notification code so a provider can be plugged in later, but do not integrate a real provider yet)
- AI chatbot
- Multi-location/franchise support
- Technician mobile app

---

## 10. Environment Variables (`.env.example`)

```
DATABASE_URL="postgresql://user:password@localhost:5432/mrmobile"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
UPLOAD_STORAGE="local"   # switch to "s3" in production
S3_BUCKET=""
S3_ACCESS_KEY=""
S3_SECRET_KEY=""
S3_REGION=""
```

---

## 11. Notes for the Coding Agent

- Prefer server components by default; mark `"use client"` only where interactivity (forms, animation, estimator state) requires it.
- Every list/table that could grow large (Customers, Repairs, Inventory) must be server-paginated from the start — do not fetch-all-then-filter client-side.
- Reuse one `<DataTable>` component (admin) and one `<Section>` wrapper (marketing) instead of rebuilding table/section markup per page.
- Keep Zod validators in `lib/validators/` and import them on both the form and the API route — do not duplicate validation logic.
- Money fields: store as `Decimal` in Postgres, format for display with `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`.
- Job ID format: `MRZ-` + zero-padded incrementing number (e.g., `MRZ-000123`) — generate server-side inside the same transaction that creates the `Repair` row to avoid collisions.
