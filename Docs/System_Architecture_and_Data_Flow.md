# RoamMeet: System Architecture & Data Flow Guide

A comprehensive, plain-English breakdown of how the RoamMeet platform is built, how code moves from development to live production, what happens on **Vercel**, and what happens on **Supabase**.

---

## 1. High-Level Architecture Diagram

```
┌─────────────────────────┐
│   LOCAL WORKSPACE       │
│  (Next.js 15 Codebase)  │
└────────────┬────────────┘
             │ 1. git push origin main
             ▼
┌─────────────────────────┐
│     GITHUB REPO         │
│ (Techguybaba/roammeet)  │
└────────────┬────────────┘
             │ 2. Automated Webhook Trigger
             ▼
┌─────────────────────────┐
│     VERCEL CLOUD        │
│ (Edge Hosting & CI/CD)  │
│                         │
│ • Runs `next build`     │
│ • Optimizes HTML/JS/CSS │
│ • Global Edge CDN       │
│ • Issues HTTPS (SSL)    │
└────────────┬────────────┘
             │ 3. Serves Web App to Users
             ▼
┌─────────────────────────────────────────────────────────┐
│                  END USERS & DEVICES                    │
│   (Phones, Laptops, Tablets across the World)           │
│                                                         │
│   Traveler Mode                    Host Mode            │
│   • Browse Feed                    • Publish Listings   │
│   • Request Booking                • Manage Stays       │
│   • Inquire via Chat               • Accept Bookings    │
└────────────▲───────────────────────────────▲────────────┘
             │                               │
             │ 4. Read / Write / WebSocket   │
             ▼                               ▼
┌─────────────────────────────────────────────────────────┐
│               SUPABASE CLOUD (MUMBAI)                   │
│          Region: South Asia (ap-south-1)                │
│                                                         │
│ 1. PostgreSQL Database:                                 │
│    • profiles, listings, bookings, messages             │
│    • kyc_submissions, flagged_audit_logs                │
│                                                         │
│ 2. Supabase Auth:                                       │
│    • Password encryption (bcrypt), JWT sessions         │
│                                                         │
│ 3. Realtime WebSockets:                                 │
│    • Instant live chat sync between phones              │
│                                                         │
│ 4. Anti-Bypass Contact Guardian:                        │
│    • Masks phone, email, WhatsApp, UPI tags             │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Step-by-Step Breakdown: The 4 Core Stages

### Stage 1: Writing Code (Local Development Workspace)
* **What it is:** The code is built using modern full-stack web technologies:
  * **Next.js 15 (App Router & Turbopack):** The industry-standard React framework for fast page rendering and dynamic routing.
  * **TypeScript:** Ensures 100% strict type safety and catches errors before code is ever published.
  * **Tailwind CSS v4:** High-performance responsive styling optimized for mobile phones and desktops.
  * **Lucide Icons:** Clean, lightweight vector iconography.
* **How changes happen:** Code is edited, refined, and tested locally. Running `npm run build` verifies that all routes compile with zero syntax or type errors.

---

### Stage 2: Shipping Code (GitHub Version Control)
* **What it is:** **GitHub** acts as the central cloud vault and source control repository (`https://github.com/Techguybaba/roammeet`).
* **How it works:**
  1. Once code changes are verified, they are packaged into a Git commit (`git commit -m "..."`).
  2. The commit is pushed to the **`main`** branch on GitHub (`git push origin main`).
  3. GitHub stores the exact historical timeline of every change, allowing rollback at any second if ever needed.
  4. Immediately upon receiving the new code, GitHub fires an automated notification (a webhook) to **Vercel**.

---

### Stage 3: What Happens on Vercel (Edge Deployment & Hosting)
**Vercel** is the global cloud platform that hosts and serves your website to the world.

When GitHub notifies Vercel of a new push:
1. **Automated Continuous Integration (CI):**
   * Vercel spins up an isolated build container.
   * It downloads the latest code from GitHub.
   * It injects your secure production environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
2. **Production Build & Optimization:**
   * It runs `next build --turbopack`.
   * It compiles all 9 static and dynamic routes (`/`, `/listings/[id]`, `/host/create`, `/messages`, `/profile/verification`, `/admin`, etc.).
   * It minimizes and compresses JavaScript, HTML, and CSS for lightning-fast mobile loading.
3. **Global Edge Network Deployment:**
   * The optimized files are distributed across hundreds of edge data centers worldwide.
   * If a user opens your site in Mumbai, London, or California, they are automatically served by the nearest edge server.
   * Vercel manages the free **SSL Certificate (HTTPS)** automatically to keep connections encrypted.
   * **Result:** Zero downtime, zero server crashes, and zero cold starts.

---

### Stage 4: What Happens on Supabase (Database, Auth & Realtime)
**Supabase** is your cloud backend located in **South Asia (Mumbai `ap-south-1`)**. It handles all persistent data, security, and live communication.

Supabase operates 3 critical engines for RoamMeet:

#### 1. The PostgreSQL Cloud Database
* Holds all permanent business records in 6 production tables:
  * **`profiles`:** User names, avatars, bios, verification badges, and host ratings.
  * **`listings`:** All active homestays, travel buddy meetups, parties, and tours (photos, prices, locations, rules).
  * **`bookings`:** Reservation requests, dates, total amounts, and platform fee records.
  * **`messages`:** In-app conversation threads between travelers and hosts.
  * **`kyc_submissions`:** Government ID documents (Aadhaar, Passport, DL) and selfie verification photos.
  * **`flagged_audit_logs`:** Audit records of intercepted off-platform contact attempts.

#### 2. Supabase Auth (Identity & Security)
* Handles account registration and logins.
* Automatically encrypts user passwords using `bcrypt` hashing before saving to the database.
* Issues secure JSON Web Tokens (JWT) to the user's browser so they stay logged in across page visits.

#### 3. Realtime WebSockets Engine
* Powers live, instant communication without requiring the user to refresh the page.
* Listens to database inserts on the `messages` table.
* When Traveler A sends a message to Host B, Supabase pushes the new message over a live WebSocket channel directly to Host B's phone screen in under 50 milliseconds.

---

## 3. Real-Life Example: What Happens When a Host Publishes a Stay

To see how all these pieces work together seamlessly:

```
[ Host Karan on Phone ]
         │
         ▼ 1. Fills form & taps "Publish Listing"
[ Vercel Edge Server ]
         │
         ▼ 2. Runs listing validation & applies $1 / ₹79 platform fee rule
[ Supabase Mumbai (PostgreSQL) ]
         │
         ▼ 3. Saves row in `listings` table
[ Realtime Broadcast ]
         │
         ▼ 4. Live update pushed to all visitors
[ Traveler Rohit on Phone ]
         │
         ▼ 5. Opens feed: Karan's listing appears instantly at the top!
```

1. **Host Karan** opens `https://roammeet.vercel.app` on his phone (served instantly by **Vercel**).
2. Karan logs in and fills out the "Host a Stay" form.
3. When Karan taps **"Publish Listing"**, the website sends the data directly to **Supabase in Mumbai**.
4. Supabase writes the new record to the `listings` table.
5. Meanwhile, **Traveler Rohit** opens the website on his laptop in another city.
6. Rohit's browser queries Supabase on mount (`fetchCloudListings()`).
7. Karan's newly published stay appears immediately on Rohit's screen!
8. When Rohit clicks **"Request to Book"**, the booking transaction is committed to Supabase, the **$1.00 / ₹79.00 platform fee** is logged, and the **Anti-Bypass Contact Guardian** ensures private contact info remains safely locked until confirmed.

---

## 4. Cost & Infrastructure Summary

| Layer | Provider | Region | Cost |
| :--- | :--- | :--- | :--- |
| **Frontend & CDN** | Vercel | Global Edge | **$0.00 / month** (Free Tier) |
| **Database & Auth** | Supabase | Mumbai (`ap-south-1`) | **$0.00 / month** (Free Tier) |
| **Source Control** | GitHub | Global Cloud | **$0.00 / month** (Free Tier) |
| **SSL & Security** | Vercel / Let's Encrypt | Global | **$0.00 / month** (Included) |
| **Total Monthly Burn** | — | — | **$0.00 / month** |
