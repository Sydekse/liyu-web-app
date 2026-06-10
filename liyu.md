# Case Study: Liyu Catering Web Application

## Overview

**Liyu Catering** is a marketing and lead-capture website for an Ethiopian catering business. The product has two sides: a **public site** that builds trust and converts visitors into event inquiries, and a simple **admin area** where staff review incoming booking requests stored in a database.

This document describes the system end-to-end so it can be reused in portfolios, interviews, or stakeholder briefings.

---

## Business context

- **Domain:** Event catering (weddings, corporate events, private parties, social gatherings).
- **Primary goal:** Present the brand (story, packages, past events) and **capture structured event inquiries** with contact details and logistics (date, guest count, event type).
- **Secondary goal:** Give internal users a **single place to list and scan** new and existing inquiries without a separate CRM.

---

## What the product does

### Public experience

| Area | Purpose |
|------|---------|
| **Home** | Hero, value proposition, feature highlights, call-to-action to booking. |
| **About** | Brand story and imagery. |
| **Events** | Showcases occasion types and links toward booking. |
| **Packages** | Tiered catering packages with feature lists and CTAs. |
| **Book** | Multi-field inquiry form, contact and expectations sidebar, confirmation state after submit. |

The booking form collects: name, email, phone, event type (select), event date, guest count, optional details. Submissions are persisted with an initial **pending** status.

### Admin experience

- **Authentication:** Username and password are checked against an `Admin` record in MongoDB; passwords are verified with **bcrypt**. On success, the API issues a **JWT** (JSON Web Token) which the browser stores (e.g. in `localStorage`) and re-validates via a verify endpoint on return visits.
- **Dashboard:** A tabular view of bookings (request date, name, event type, event date, guests, **status**, email/phone). Status is one of: `pending`, `confirmed`, `cancelled` (defined on the data model; UI styling reflects these states).

---

## Technical architecture

### Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router) with React 18 and TypeScript.
- **Styling:** Tailwind CSS, with **Radix UI**-based primitives (shadcn-style components) for forms, tables, dialogs, etc.
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/), using a **cached connection** pattern suitable for serverless-style deployments (reuse connection across invocations).
- **Admin auth:** **jsonwebtoken** + **bcryptjs** in Route Handlers under `app/api/admin/`.

### High-level data flow

```text
Visitor (Book page)
       │
       ▼
Client form ──► Server Action (`createBooking`)
                      │
                      ▼
                 MongoDB (`Booking` collection)

Admin (browser)
       │
       ├── POST /api/admin          (login → JWT)
       ├── POST /api/admin/verify   (token check)
       └── Server Action `getBooking`  (list rows for the table)
```

**Booking creation** uses a Next.js **Server Action** (`"use server"`) so submission logic runs on the server with direct database access, without exposing MongoDB credentials to the client.

**Booking listing** for the admin UI is also invoked from the client via a server action (`getBooking`), which queries MongoDB and returns a plain list of fields for the table.

### Environment configuration

Typical variables implied by the code:

- `MONGODB_URI` — connection string; database name used in code is `Liyu-catering`.
- `JWT_SECRET` — secret used to sign and verify admin tokens.

---

## Data model

### Booking

Persists each inquiry with:

- Identity: `firstName`, `lastName`, `email`, `phone`
- Event: `eventType`, `eventDate`, `guestCount`, optional `details`
- Workflow: `status` (`pending` | `confirmed` | `cancelled`)
- Metadata: `createdAt`

### Admin

Stores internal login accounts with `userName` and **hashed** `password` (bcrypt).

---

## Project structure (conceptual)

- `app/` — routes: marketing pages, `/book`, `/admin`, API routes under `app/api/admin/`.
- `components/` — UI building blocks (layout, home, book, admin, shared `ui/` primitives).
- `lib/` — database connector, Mongoose models, server actions (`lib/actions/booking.actions.ts`).
- `public/assets/` — static images for the brand.

---

## Design and UX notes

- Brand palette centers on deep brown (`#532516`) and accent gold (`#E8982E`), applied consistently across pages and CTAs.
- Typography uses **Inter** from `next/font` in the root layout.
- The booking flow balances a **dense form** with supporting content (contact info, expectations) in a responsive two-column layout on large screens.

---

## Strengths (case-study talking points)

1. **Clear separation:** Marketing content vs. transactional booking vs. operational admin.
2. **Server-first mutations:** Bookings are created through Server Actions, keeping secrets and validation on the server.
3. **Simple operational model:** One MongoDB database, one primary entity (`Booking`), status field ready for light workflow without over-engineering.
4. **Familiar UI stack:** Component library patterns that scale if the product grows (more dashboards, filters, exports).

---

## Limitations and improvement opportunities

Use these for honest technical discussion in interviews or retrospectives:

| Topic | Current state / note |
|--------|----------------------|
| **Admin authorization for reads** | Listing bookings uses a server action callable from the client; tightening this (e.g. verify JWT on the server for `getBooking`, or route handlers that require `Authorization`) would harden the model. |
| **Token storage** | JWT in browser storage is simple but vulnerable to XSS; httpOnly cookies or a session layer are common upgrades. |
| **Duplicate auth paths** | The repo includes `next-auth` and a credentials-style sign-in screen in addition to the custom JWT admin flow; production systems usually consolidate on one approach. |
| **Dead or stub APIs** | Some client code may reference routes that are not implemented (e.g. `/api/bookings` in a legacy table component); the live admin page uses server actions instead. |

---

## How to run it (developers)

```bash
npm install
# Set MONGODB_URI and JWT_SECRET
npm run dev
```

- Public site: default Next.js dev URL.
- Admin: navigate to `/admin`, sign in with a seeded or created `Admin` user in MongoDB.

---

## Summary

**Liyu Catering** is a **Next.js + MongoDB** application that combines a **content-driven marketing site** with a **booking funnel** and a **minimal admin console**. The architecture emphasizes **server-side persistence** for inquiries and **JWT-based admin login**, with room to evolve toward stricter server-side authorization and unified authentication as requirements grow.
