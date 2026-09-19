# RoamMeet — Host Earnings & Payout Dashboard & Real-Time Notification Center Guide

**Document Version:** 1.0.0  
**Date:** September 2026  
**Target Platform:** RoamMeet (Next.js 15, Supabase, Vercel)  
**Cost Impact:** $0.00 / month (Fully operates within Supabase Free Tier)

---

## 1. Executive Summary

As RoamMeet expands its marketplace capabilities, hosts and travelers require seamless financial transparency and immediate feedback on critical marketplace interactions. This release introduces two foundational pillars:

1. **Host Earnings & Payout Dashboard**:
   - A dedicated financial command center integrated into `/host/dashboard` under the **"💰 Earnings & Payouts"** tab.
   - Comprehensive accounting metrics: **Net Host Payouts**, **Available for Withdrawal**, **Processed Payouts**, and **Platform Guarantee Fees**.
   - Flexible payout method configuration supporting **UPI (India)**, **Bank Transfer (NEFT/IMPS)**, and **PayPal (Global)**.
   - Completed reservations transaction ledger with individual payout statuses (`Available` vs `Paid Out`) and one-click fund withdrawals.

2. **Real-Time Notification Center**:
   - An interactive bell icon seamlessly integrated into the navigation bar (`Navbar.tsx`) with dynamic badge count for unread notifications.
   - Categorized notifications with visual iconography for **Booking Requests**, **Booking Confirmations**, **Reviews & Ratings**, **Chat Messages**, and **Payout Confirmations**.
   - One-click "Mark all as read" and intuitive click-through navigation to relevant platform pages.
   - Resilient persistence via Supabase cloud storage with instant local state fallbacks.

---

## 2. Host Earnings & Financial Architecture

### 2.1 Financial Model & Calculations
Every booking transaction on RoamMeet follows a transparent revenue-sharing and guarantee model:
- **Gross Booking Volume**: Total amount paid by travelers for accepted stays/meetups (`pricePerNight * nights`).
- **Platform Guarantee & Service Fee**: 10% platform fee retained to maintain verified trust, 24/7 host protection, and infrastructure costs.
- **Net Host Earnings**: 90% of gross volume distributed directly to the host.
- **Available for Withdrawal**: Sum of net earnings from accepted bookings that have not yet been withdrawn to the host's bank or UPI.
- **Processed Payouts**: Cumulative funds that have already been disbursed to the host's selected payout method.

```
Gross Booking Volume = Price Per Night × Nights
Platform Fee (10%)   = Gross Volume × 0.10
Net Host Payout (90%)= Gross Volume × 0.90
```

### 2.2 Payout Method Management
Hosts can configure and switch between multiple payout methods directly in the dashboard:
- **UPI (Unified Payments Interface)**: Primary method for Indian hosts (e.g. `host@okhdfcbank` or `9876543210@paytm`). Supports instant settlements.
- **Bank Transfer (NEFT/IMPS)**: Direct bank account deposits requiring Account Holder Name, Account Number, and IFSC Code.
- **PayPal**: International payout channel for global hosts using their PayPal email address.
- **Primary Method Toggle**: Hosts can designate any method as default, which automatically routes future withdrawal disbursements.

### 2.3 Completed Reservations Ledger
Each accepted reservation appears in the financial ledger with:
- **Reservation Details**: Listing title, guest name, check-in and check-out dates.
- **Gross Amount**: Total booking price in the active currency.
- **Net Payout**: 90% net earnings credited to the host.
- **Status Indicator**:
  - `Available`: Net funds ready to be withdrawn.
  - `Paid Out`: Funds successfully transferred to the host's bank/UPI account.
- **Withdraw Funds Action**: One-click withdrawal triggers an automated settlement, marks the ledger items as paid out, and dispatches a confirmation notification to the host.

---

## 3. Real-Time Notification Center Architecture

### 3.1 Notification Bell & Badge Count
- Located in `src/components/layout/Navbar.tsx` alongside the currency selector and user avatar.
- Displays an active red badge with the unread count (e.g., `3`).
- Drops down an accessible, responsive popover showing notifications ordered chronologically with human-readable relative timestamps ("Just now", "5m ago", "2h ago", etc.).

### 3.2 Notification Categories & Automated Triggers
The notification engine triggers automatically on key platform events:

| Event Type | Trigger Point | Recipient | Action Taken |
| :--- | :--- | :--- | :--- |
| `booking_request` | Traveler submits booking | Host | Notifies host with traveler name, dates, and link to host dashboard |
| `booking_status` | Host accepts or declines booking | Traveler | Notifies traveler of confirmation/rejection with link to trips |
| `review_received` | Traveler submits a 1–5★ review | Host | Notifies host with star rating and link to reviews |
| `new_message` | User sends a chat message | Receiver | Notifies recipient with message preview and link to conversation |
| `payout_processed` | Host clicks "Withdraw Funds" | Host | Confirms payout disbursement to primary bank/UPI method |

---

## 4. Supabase Database Schema (SQL Setup)

To enable persistent cloud storage for notifications and payout methods in your Supabase project, execute the following SQL in the **Supabase Dashboard** -> **SQL Editor**:

```sql
-- 1. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('booking_request', 'booking_status', 'review_received', 'new_message', 'payout_processed', 'system')),
  read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public read notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Public insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update notifications" ON public.notifications FOR UPDATE USING (true);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- 2. Payout Methods Table
CREATE TABLE IF NOT EXISTS public.payout_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('upi', 'bank_transfer', 'paypal')),
  details JSONB NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.payout_methods ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public read payout_methods" ON public.payout_methods FOR SELECT USING (true);
CREATE POLICY "Public insert payout_methods" ON public.payout_methods FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update payout_methods" ON public.payout_methods FOR UPDATE USING (true);
CREATE POLICY "Public delete payout_methods" ON public.payout_methods FOR DELETE USING (true);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_payout_methods_user_id ON public.payout_methods(user_id);
```

---

## 5. Verification & Testing Instructions

1. **Test Notification Triggers**:
   - Log in as Traveler (`traveler@example.com`) and send a booking request on any listing.
   - Log in as Host (`host@example.com` or listing owner). Notice the bell icon badge increments to `1`.
   - Click the bell icon: review the notification dropdown item and click it to go to `/host/dashboard`.
   - Accept the reservation in Host Dashboard -> Reservations tab.
   - Switch back to Traveler: observe booking approval notification in the bell dropdown.

2. **Test Earnings & Payouts**:
   - Open `/host/dashboard` and click the **💰 Earnings & Payouts** tab.
   - Inspect financial cards: Gross volume, Platform fees (10%), Net earnings (90%), Available for withdrawal.
   - Click **+ Add Method**: Add a UPI ID (e.g. `rohit@okhdfcbank`) or Bank Account.
   - Click **Withdraw Funds**: Available balance resets to zero, processed payouts increments, and a payout notification appears in the bell dropdown.

---

## 6. Zero-Cost Free Tier Compliance

- **Next.js 15 & Vercel**: Hosted at zero server cost on Vercel's global edge network.
- **Supabase**: Stored in PostgreSQL with automatic JSONB and RLS, consuming under 0.1% of the 500MB free database tier.
- **Real-Time Responsiveness**: Uses efficient client-side polling and reactive React state, keeping bandwidth usage well within limits.
