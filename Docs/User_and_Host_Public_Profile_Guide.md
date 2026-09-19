# RoamMeet: User & Host Public Profile System Guide

A comprehensive guide explaining the public profile architecture, how trust and verification badges work, how hosted listings and reviews are showcased, and how users edit their profiles.

---

## 1. Overview of the Profile System

Trust is the cornerstone of RoamMeet. The profile system ensures every traveler and host has a credible, verified presence on the platform:

```
┌─────────────────────────────────────────────────────────────────┐
│                    PUBLIC PROFILE (/profile/[id])               │
├────────────────────────────────┬────────────────────────────────┤
│       IDENTITY & TRUST         │      ABOUT & EXPERIENCES       │
│                                │                                │
│ • Avatar & Verified Badge      │ • Traveler / Host Bio          │
│ • Full Name & City/Country     │ • Languages & Response Time    │
│ • KYC Verification Tier (1-4)  │ • Hosted Stays & Meetups Grid  │
│ • Rating (★ 4.96) & Reviews    │ • Verified Guest Reviews       │
│ • Socials (Instagram/LinkedIn) │                                │
│ • Action: "Message Host"       │                                │
└────────────────────────────────┴────────────────────────────────┘
```

---

## 2. Key Features of Public Profiles (`/profile/[id]`)

### 1. Identity & Trust Verification
* **Avatar & Name:** High-resolution user photo with a green verified checkmark.
* **KYC Verification Tier Badges:**
  - **Tier 1:** Phone / Email Verified
  - **Tier 2:** Selfie Liveness Verified
  - **Tier 3:** Gold Verified (Government ID: Aadhaar / Passport / DL)
  - **Tier 4:** SuperHost & Certified Guide
* **Trust Checklist:** Clearly shows verified status for phone, selfie, and government ID, reassuring travelers before booking.
* **Rating & Experience:** Displays average star rating, total review count, and member since date.
* **Social Links:** Direct links to Instagram and LinkedIn to demonstrate authentic social presence.

### 2. Hosted Experiences & Stays Showcase
* Displays all active listings published by this host.
* Each card includes cover photo, category badge, location, price per night or per person, and a direct link to view or book.

### 3. Community Testimonials & Reviews
* Verified reviews from guests who completed stays with this host.
* Displays guest photo, name, star rating, stay date, and written feedback.

### 4. Direct In-App Messaging
* Tapping **"Message [Name]"** starts an instant conversation in `/messages`.
* The Anti-Bypass Contact Guardian ensures personal contact details remain protected until a reservation is confirmed.

---

## 3. Personal Profile & Editing (`/profile`)

* When the logged-in user visits `/profile`, they are taken to their own profile with full editing capabilities.
* **"Edit My Profile" Modal:**
  - Full Name
  - Avatar Image URL
  - City & Country
  - About Me (Bio & Travel Style)
  - Phone Number
  - Instagram Handle & LinkedIn Profile
* **Instant Cloud Sync:** Saving changes updates both the active session and the Supabase `profiles` database table in real time.
* **Direct KYC Link:** Quick button to `/profile/verification` to submit IDs or selfies for badge upgrades.

---

## 4. Cross-Platform Linking

Profiles are interconnected throughout the RoamMeet web application:
1. **Explore Listings (`/listings/[id]`):** Tapping the host card opens `/profile/[hostId]`.
2. **In-App Chat (`/messages`):** Tapping the contact's name or avatar in the header opens their profile.
3. **Traveler Hub (`/trips`):** Tapping the host on any trip card opens their profile.
4. **Host Hub (`/host/dashboard`):** Tapping an applicant traveler on any booking request opens their profile.
5. **Navbar:** Tapping your user badge opens your own profile at `/profile`.
