# LeadDesk Mini

A full-stack lead capture application built with the **MERN Stack (MongoDB, Express.js, React, Node.js)**. It includes a public landing page where visitors can submit leads and a secure admin dashboard where authenticated admins can review, search, and manage those leads.

---

## Live Demo

🌐 **Landing Page:** [https://lead-desk-rose.vercel.app/](https://lead-desk-rose.vercel.app/)

🔐 **Admin Login:** [https://lead-desk-rose.vercel.app/admin](https://lead-desk-rose.vercel.app/admin)

📂 **GitHub Repository:** [https://github.com/CoderDiva-pro/LeadDesk](https://github.com/CoderDiva-pro/LeadDesk)

**Test Credentials**

Email: admin123@gmail.com

Password: Shared separately with the reviewer.

---

# Features

### Public Side

- Responsive landing page
- Lead submission form
- Client-side validation
- Server-side validation
- Success message after submission
- Stores leads in MongoDB

### Admin Side

- Secure admin login
- JWT-based authentication
- Protected admin routes
- View all submitted leads
- Search leads by name, email, or message
- Update lead status:
  - New
  - Contacted
  - Closed
- Logout functionality

---

# Tech Stack

## Frontend

- React
- Vite
- React Router
- Axios
- CSS

## Backend

- Node.js
- Express.js

## Database

- MongoDB Atlas
- Mongoose

## Authentication

- JSON Web Token (JWT)
- bcrypt

## Deployment

- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

# Project Structure

```
LeadDesk-Mini
│
├── frontend
│   ├── src
│   ├── public
│   └── ...
│
├── backend
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── controllers
│   └── ...
│
└── README.md
```

---

# Screenshots

## Landing Page

<img width="675" height="861" alt="image" src="https://github.com/user-attachments/assets/04f6a56e-81df-4f06-a932-a81e8a692814" />

<img width="756" height="697" alt="image" src="https://github.com/user-attachments/assets/74086d9e-5e94-4e72-8ca5-af3a6beefdc4" />


---

## Admin Login

<img width="491" height="533" alt="image" src="https://github.com/user-attachments/assets/b40e396e-b0ef-40e5-ba1b-c26334f1502f" />

---

## Admin Dashboard

<img width="986" height="522" alt="image" src="https://github.com/user-attachments/assets/491ee73a-09e8-475c-9a32-950b992b0a1d" />

---

# Data Model

Two MongoDB collections are used.

## Lead Collection

| Field | Type | Description |
|---------|------|-------------|
| name | String | Required (2–100 chars) |
| email | String | Required, validated, lowercased |
| budgetRange | String | Required enum |
| message | String | Required (10–2000 chars) |
| status | String | New / Contacted / Closed |
| createdAt | Date | Auto timestamp |
| updatedAt | Date | Auto timestamp |

A text index on **name**, **email**, and **message** supports fast searching from the admin dashboard.

---

## Admin Collection

| Field | Type | Description |
|---------|------|-------------|
| email | String | Unique |
| passwordHash | String | bcrypt hash |

I kept `Lead` and `Admin` as separate collections because they represent different responsibilities. Leads are public records submitted by visitors, whereas Admins are authenticated users with credentials. Keeping them separate makes the data model cleaner and easier to maintain.

---

# Authentication Flow

The application uses **database-backed authentication**, not a hardcoded username/password.

### Step 1

A one-time script (`seedAdmin.js`) creates the first admin account using:

- ADMIN_EMAIL
- ADMIN_PASSWORD

The password is hashed using **bcrypt** before storage.

---

### Step 2

When an admin logs in:

- Email is searched in MongoDB.
- Password is verified using `bcrypt.compare()`.
- If valid, the server generates a JWT valid for **8 hours**.

---

### Step 3

The React dashboard stores the JWT in `localStorage`.

Every protected request sends:

```
Authorization: Bearer <token>
```

---

### Step 4

The backend middleware verifies the token before allowing access to:

- GET /api/leads
- PATCH /api/leads/:id/status

Invalid, expired, or missing tokens return **401 Unauthorized**, and the frontend redirects users back to the login page.

---

# Validation

## Client-side Validation

- Required fields
- Valid email format
- Message length validation
- Budget selection required

## Server-side Validation

The backend performs independent validation because client-side validation can be bypassed.

Checks include:

- Required fields
- Email format
- Budget enum validation
- Name length
- Message length

---

# Security

This project includes several basic security practices:

- Passwords hashed using bcrypt
- JWT authentication
- Protected admin routes
- Environment variables for secrets
- Server-side validation
- Plain-text passwords are never stored

---

# Assumptions Made

- Budget is stored as predefined ranges rather than free text so filtering and reporting remain consistent.
- Only one admin account is needed for the assignment, although the design supports adding more later.
- Search performs a case-insensitive text search across the name, email, and message fields.
- Authentication uses JWT stored in localStorage, which is sufficient for this internship assignment.

---

# Deployment

Frontend:
- Vercel

Backend:
- Render

Database:
- MongoDB Atlas

The application was tested after deployment using a fresh browser session to verify authentication and protected routes.

---

# Local Development

## Backend

```bash
cd backend
cp .env.example .env

# Configure:
# MONGODB_URI
# JWT_SECRET
# ADMIN_EMAIL
# ADMIN_PASSWORD

npm install
npm run seed:admin
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

## Frontend

```bash
cd frontend

cp .env.example .env

# Configure:
# VITE_API_URL=http://localhost:5000/api

npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# AI Usage

I used ChatGPT and Claude as development assistants throughout this project. They helped with code generation, debugging, improving the README, reviewing authentication and project architecture, and suggesting implementation approaches. Every AI-generated suggestion was reviewed, modified where necessary, and tested before being incorporated. I was responsible for integrating the components, resolving issues, making implementation decisions, and ensuring the final application worked as intended.

---

# Assignment Requirements Checklist

- Public Landing Page
- Lead Form
- Client-side Validation
- Server-side Validation
- MongoDB Database
- Secure Admin Login
- JWT Authentication
- Protected Routes
- Admin Dashboard
- Search Functionality
- Status Management
- Deployment
- README Documentation
- Loom Walkthrough

---

# Notes

- Passwords are never stored in plaintext.
- Environment variables are excluded from version control.
- `.env` files are not included in this repository.
- This repository is intended solely for the Digital Heroes Full Stack Development Internship assessment.

---

## Footer Requirement

The deployed website includes the required footer:

> **Built for Digital Heroes Training Task**

linked to **https://digitalheroesco.com** as requested in the assignment brief.
