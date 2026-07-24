# LeadDesk Mini

A small lead-capture product: a public landing page with a lead form, and an
admin dashboard to review, search, and triage those leads. Built with the
MERN stack (MongoDB, Express, React/Vite, Node).

**Live landing page:** _add your deployed URL here_
**Admin URL:** _add your deployed URL here_ (`/admin`)
**Test credentials:** _add the admin email you seeded, never the password itself, if this README is public — share the password separately_

---

## Data model

Two Mongoose collections:

**`Lead`**
| field | type | notes |
|---|---|---|
| name | String | required, 2–100 chars |
| email | String | required, validated format, lowercased |
| budgetRange | String | required, one of a fixed enum (`under-1k`, `1k-5k`, `5k-15k`, `15k-50k`, `50k-plus`) |
| message | String | required, 10–2000 chars |
| status | String | enum `New` / `Contacted` / `Closed`, defaults to `New` |
| createdAt / updatedAt | Date | automatic timestamps |

A text index on `name`, `email`, and `message` backs the admin search box.

**`Admin`**
| field | type | notes |
|---|---|---|
| email | String | unique, lowercased |
| passwordHash | String | bcrypt hash — the plaintext password is never stored |
    
I kept `Lead` and `Admin` as separate collections rather than one
`users`-style table, since leads are unauthenticated, public-facing records
and admins are internal accounts with credentials — mixing them would mean
adding auth fields to every lead for no reason.

## Auth approach

Admin login is real, database-backed authentication, not a hardcoded
string check:


1. `seedAdmin.js` is run once, locally, to create the first admin account.
   It reads `ADMIN_EMAIL` / `ADMIN_PASSWORD` from environment variables,
   hashes the password with **bcrypt**, and stores only the hash.
2. `POST /api/auth/login` looks up the admin by email, compares the
   submitted password against the stored hash with `bcrypt.compare`, and — if
   it matches — signs a **JWT** (`jsonwebtoken`) containing the admin's id and
   email, valid for 8 hours.
3. The React admin dashboard stores that token in `localStorage` and sends it
   as `Authorization: Bearer <token>` on every request to a protected route.
4. `middleware/auth.js` verifies the token on the server for every protected
   route (`GET /api/leads`, `PATCH /api/leads/:id/status`). No token, an
   expired token, or a tampered token is rejected with a 401, and the
   dashboard redirects back to `/admin/login`.

The public lead-submission endpoint (`POST /api/leads`) has no auth, since
anyone visiting the landing page should be able to submit — but it does run
full server-side validation independent of the client-side checks in the
React form, since the client checks can always be bypassed.

## Assumptions made

- "Budget range" is a fixed set of bands rather than free text, so the admin
  view can filter/sort meaningfully instead of parsing arbitrary strings.
- One admin account is enough for this task's scope; `Admin` is a real
  collection so adding more accounts later is just another seed/insert, not
  a redesign.
- Search is a case-insensitive substring match across name, email, and
  message — simple and fast to reason about for a lead volume this small.

## Where AI was used

_Fill this in honestly before you submit — the brief asks for one short
paragraph on where you used AI tools and what you changed. Be specific:
what you asked for, what you kept, what you rewrote or rejected._

## Local development

**Backend**
```bash
cd backend
cp .env.example .env      # fill in MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run seed:admin        # creates the first admin login, run once
npm run dev                # starts the API on http://localhost:5000
```

**Frontend**
```bash
cd frontend
cp .env.example .env       # set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # starts the app on http://localhost:5173
```

See `DEPLOYMENT.md` for free-tier deployment steps (MongoDB Atlas + Render +
Vercel).
