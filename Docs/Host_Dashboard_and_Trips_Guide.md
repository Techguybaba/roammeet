# RoamMeet: Host Dashboard & Traveler "My Trips" User Guide

A complete overview of the Host Management Hub and Traveler Trips Center, explaining how booking requests work, how addresses are protected, and how hosts and travelers interact.

---

## 1. Overview of the Two-Sided Marketplace Loop

```
[ Traveler ]                                           [ Host ]
     │                                                    │
     │ 1. Clicks "Request to Book" on listing             │
     ├───────────────────────────────────────────────────►│
     │    Status: PENDING                                 │ 2. Receives request in /host/dashboard
     │    (Exact address is LOCKED)                       │    Reviews traveler KYC & intro message
     │                                                    │
     │                                                    │ 3. Host clicks "Accept & Confirm"
     │◄───────────────────────────────────────────────────┤
     │ 4. Receives confirmation in /trips                 │
     │    Status: CONFIRMED                               │
     │    (Exact address is UNLOCKED)                     │
     │                                                    │
     │ 5. Both can chat via in-app /messages              │
     │◄──────────────────────────────────────────────────►│
```

---

## 2. Host Dashboard (`/host/dashboard`)

The Host Hub is designed to give property owners and experience organizers full control over their stays:

### Key Features
1. **Host Performance Metrics:**
   * **Total Earnings:** Automatically calculated from all confirmed stays.
   * **Pending Requests:** Real-time counter of traveler applications awaiting review.
   * **Active Listings:** Count of experiences currently published and visible on the explore feed.
   * **Host KYC Tier:** Shows verification badge (Tier 1–4) with a direct upgrade link.

2. **Booking Requests Management:**
   * **Filter Views:** Easily switch between `All`, `Pending`, `Accepted`, and `Declined` requests.
   * **Traveler Profiles:** View applicant name, avatar, government ID verification badge, location, and member duration.
   * **Stay Details:** Dates, duration, guest count, and personalized introduction note.
   * **Payout Breakdown:** Shows stay subtotal and confirms that the ₹79 / \$1 platform fee is covered by the guest.
   * **Actions:**
     * **Accept & Confirm:** Locks in the reservation and instantly reveals the exact address to the traveler.
     * **Decline:** Gracefully turns down the booking without penalizing the host.
     * **Chat with Traveler:** Opens an instant in-app conversation via `/messages`.

3. **My Listings Control:**
   * View all hosted stays and events.
   * **Pause / Resume Toggle:** Temporarily hide a listing from the public feed when fully booked or unavailable, and resume it with one click.
   * Direct links to view the public listing page or create a new experience.

---

## 3. Traveler "My Trips" Portal (`/trips`)

The Traveler Hub keeps guests organized and confident about their reservations:

### Key Features
1. **Reservation Status Tracking:**
   * **Pending Host Approval (🟡):** Informs the traveler that their request has been submitted and that their payment card is not charged until the host confirms. The exact address remains safely hidden.
   * **Confirmed Reservation (🟢):** Clearly displays that the host accepted. **Unlocks the Exact Address** along with neighborhood hints and directions.
   * **Declined (🔴):** Lets travelers know the host was unavailable and invites them to discover alternative stays.

2. **Trip Management Tools:**
   * **Direct Host Messaging:** One-click navigation to chat with the host in `/messages`.
   * **Digital Receipt / Invoice:** In-app modal displaying the booking reference number, dates, stay amount, platform guarantee fee, and a print/download button.
   * **Quick Listing Link:** Direct return to the experience details page.

---

## 4. Navigation & Role Switching

* **Desktop Navigation:**
  * **"My Trips"** appears with an active trip count badge for logged-in travelers.
  * **"Host Hub"** appears with a pending request alert badge for hosts.
* **Mobile Drawer:**
  * Both portals are accessible directly from the slide-out menu on smartphones and tablets.
* **Smart Redirects:**
  * Submitting a booking prompt includes a **"View in My Trips"** button.
  * Listing owners viewing their own stay have a **"Manage in Host Hub"** shortcut.

---

## 5. Security & Privacy Architecture

* **Contact Guardian Protection:** Private phone numbers, WhatsApp links, and UPI IDs remain protected until the reservation is confirmed.
* **Escrow Guarantee:** Payments are held safely until after check-in, preventing off-platform leakage and ensuring peace of mind for both parties.
* **Cloud Synchronization:** All booking requests and status updates are saved to Supabase (`bookings` table) and broadcast in real-time across devices.
