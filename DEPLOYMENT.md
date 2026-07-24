
# Deploying LeadDesk Mini on free tiers

This gets you: MongoDB Atlas (database) + Render (backend API) + Vercel
(frontend). All three have a free tier with no credit card commitment
required for the basics. Total time: ~20-30 minutes.

## 1. Push the code to GitHub

```bash
git init
git add .
git commit -m "LeadDesk Mini"
```
Create a new **public** GitHub repo and push:
```bash
git remote add origin https://github.com/<you>/leaddesk-mini.git
git branch -M main
git push -u origin main
```

## 2. Database — MongoDB Atlas

1. Sign up at mongodb.com/cloud/atlas (free tier: M0 cluster).
2. Create a free M0 cluster.
3. Database Access → add a database user with a username/password.
4. Network Access → Add IP Address → "Allow access from anywhere" (0.0.0.0/0)
   — fine for this task; you'd scope it down for a real production app.
5. Connect → Drivers → copy the connection string, it looks like:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/leaddesk?retryWrites=true&w=majority`
   That whole string is your `MONGODB_URI`.

## 3. Backend — Render

1. Sign up at render.com, New → Web Service, connect your GitHub repo.
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables (Render dashboard → Environment):
   - `MONGODB_URI` — from step 2
   - `JWT_SECRET` — any long random string
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your choice
   - `CLIENT_ORIGIN` — you'll fill this in after step 4 (your Vercel URL)
6. Deploy. Once it's live, note the URL, e.g. `https://leaddesk-api.onrender.com`
7. Seed the admin account **once**: in Render, use the Shell tab (or run
   locally against the Atlas URI) and run `npm run seed:admin`.

Free-tier note: Render's free web services spin down after inactivity and
take ~30-60 seconds to wake on the next request — mention this in your Loom
so it doesn't look broken if the first click is slow.

## 4. Frontend — Vercel

1. Sign up at vercel.com, New Project, import the same GitHub repo.
2. Root directory: `frontend`
3. Framework preset: Vite
4. Environment variable: `VITE_API_URL` = `https://leaddesk-api.onrender.com/api`
   (your Render URL + `/api`)
5. Deploy. You'll get a URL like `https://leaddesk-mini.vercel.app`

## 5. Close the loop

Go back to Render → Environment → set `CLIENT_ORIGIN` to your Vercel URL
(e.g. `https://leaddesk-mini.vercel.app`) so CORS allows the deployed
frontend to call the API. Redeploy the backend for it to take effect.

## 6. Verify from a fresh browser

Open the Vercel URL in an incognito/private window (this proves there's no
local state making it "work" only on your machine):
- Submit the lead form on `/` → should show the success message.
- Go to `/admin/login`, sign in with the admin credentials you seeded.
- Confirm the new lead appears, search for it, and toggle its status.

That flow is exactly what to record in the Loom for Task B.
