"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { SITE_CONFIG } from "@/config/site";
import { VerificationBadge, CategoryBadge } from "@/components/ui/Badge";
import { 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Lock, 
  MessageSquare, 
  CheckCircle2, 
  ArrowLeft, 
  Info, 
  Share2,
  Home
} from "lucide-react";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const { 
    listings, 
    currentUser,
    openAuthModal,
    currency, 
    currencySymbol, 
    startConversationWithHost, 
    createBookingRequest,
    bookingRequests 
  } = useApp();

  const listing = listings.find((l) => l.id === listingId);

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [bookingMessage, setBookingMessage] = useState("");
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [bookingNights, setBookingNights] = useState(2);

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Experience Not Found</h2>
        <p className="text-slate-500 mt-2">The listing you are searching for might have been filled or expired.</p>
        <Link href="/" className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold">
          Back to Discover
        </Link>
      </div>
    );
  }

  const isTravelBuddy = listing.category === "travel_buddy";
  const isStay = listing.category === "stay";
  const isFree = listing.priceAmount === 0;

  // Platform Fee calculation ($1 or ₹79 flat, or 0 for travel buddy)
  const platformFee = isTravelBuddy 
    ? 0 
    : (currency === "USD" ? SITE_CONFIG.fees.usd.bookingFlatFee : SITE_CONFIG.fees.inr.bookingFlatFee);

  const subtotal = isStay ? listing.priceAmount * bookingNights : listing.priceAmount;
  const grandTotal = subtotal + platformFee;

  // Check if current user already requested
  const existingRequest = bookingRequests.find(b => b.listingId === listing.id);

  // Check if current user is the owner / host of this listing
  const isOwner = Boolean(
    currentUser && (
      currentUser.id === listing.hostId ||
      currentUser.id === listing.host.id ||
      (currentUser.email && listing.host.email && currentUser.email.toLowerCase() === listing.host.email.toLowerCase())
    )
  );

  const handleStartChat = () => {
    if (!currentUser) {
      openAuthModal(`Sign in to message ${listing.host.name} and inquire about this experience.`);
      return;
    }
    startConversationWithHost(listing.host, listing.id);
    router.push("/messages");
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openAuthModal(`Sign in to book or join "${listing.title}".`);
      return;
    }
    const datesDesc = isStay 
      ? `${bookingNights} nights starting ${listing.startDate}` 
      : `${listing.startDate} ${listing.time || ""}`;

    createBookingRequest(listing.id, bookingMessage || "Hi! I would love to join.", datesDesc);
    setShowBookingSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Back Nav & Quick Actions */}
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </Link>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Host Owner Celebratory Banner */}
      {isOwner && (
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-xs">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Host View: Your Listing is Live!
                </h3>
                <span className="bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                  Published
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Travelers can now discover your property, send booking requests, and message you on RoamMeet.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Link
              href="/host/create"
              className="flex-1 sm:flex-none text-center px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition shadow-2xs"
            >
              + Add Another
            </Link>
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Listing link copied to clipboard! Share it with your guests.");
                }
              }}
              className="flex-1 sm:flex-none text-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Link</span>
            </button>
          </div>
        </div>
      )}

      {/* Listing Title Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <CategoryBadge category={listing.category} />
          {listing.isPromoted && (
            <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              Featured Experience
            </span>
          )}
          {isFree && (
            <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              100% Free Meetup
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          {listing.title}
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-800">{listing.locationName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{listing.startDate} {listing.time ? `at ${listing.time}` : ""}</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Hosted by Verified Member</span>
          </div>
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden max-h-[460px]">
        <div className="md:col-span-2 relative aspect-16/10 md:aspect-auto h-full bg-slate-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={listing.photos[selectedPhotoIndex] || listing.photos[0]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden md:flex flex-col gap-3">
          {listing.photos.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPhotoIndex(idx)}
              className={`relative flex-1 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                selectedPhotoIndex === idx ? "border-indigo-600 ring-2 ring-indigo-500/20" : "border-transparent opacity-85 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left 2 Cols: Details & Host Profile */}
        <div className="lg:col-span-2 space-y-8">

          {/* Host Profile Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={listing.host.avatar}
                alt={listing.host.name}
                className="w-14 h-14 rounded-full object-cover ring-4 ring-indigo-500/10"
              />
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Hosted by {listing.host.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <VerificationBadge tier={listing.host.verificationTier} />
                  <span className="text-xs text-slate-500">
                    Member since {listing.host.joinedDate}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                  {listing.host.bio}
                </p>
              </div>
            </div>

            <button
              onClick={handleStartChat}
              className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition flex items-center gap-1.5 shrink-0 border border-indigo-200"
            >
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Chat with Host</span>
            </button>
          </div>

          {/* About This Experience */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              About This Experience
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Address & Safety Lock Notice */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-5 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-xs text-slate-700 space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">
                Protected Location & Exact Address
              </h4>
              <p>
                <strong>Public Hint:</strong> {listing.addressHint}
              </p>
              <p className="text-slate-500">
                To guarantee safety, prevent stalking, and protect platform reservations, the exact street address and host phone number are revealed immediately after a confirmed booking pass is issued.
              </p>
            </div>
          </div>

          {/* Amenities & Perks */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              What&apos;s Included & Amenities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {listing.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules & Guidelines */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-lg font-black text-slate-900">
              Host Guidelines & Rules
            </h3>
            <ul className="space-y-2.5">
              {listing.rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                  <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Right Sticky Booking Box */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 p-6 shadow-lg space-y-5">
            
            {/* Price Header */}
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-baseline justify-between">
                <div>
                  {isFree ? (
                    <div className="text-2xl font-black text-emerald-600">
                      100% Free
                    </div>
                  ) : (
                    <div className="text-2xl font-black text-slate-900">
                      {currencySymbol}{listing.priceAmount}
                      {isStay && <span className="text-xs text-slate-500 font-normal"> / night</span>}
                    </div>
                  )}
                  <span className="text-[11px] text-slate-400">
                    {isFree ? "Zero booking or connection fee" : "Transparent micro-pricing"}
                  </span>
                </div>

                <VerificationBadge tier={listing.host.verificationTier} size="sm" showText={false} />
              </div>
            </div>

            {/* If Current User is the Host/Owner */}
            {isOwner ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-slate-50 border border-indigo-100 rounded-2xl p-4.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded-full">
                      👑 Host Management
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Active & Live
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    You are viewing your own listing! Travelers visiting this page can request to book at your listed price.
                  </p>

                  <div className="bg-white rounded-xl p-3 border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Listing Type:</span>
                      <span className="font-bold text-slate-900 capitalize">{listing.category.replace("_", " ")}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Max Guests:</span>
                      <span className="font-bold text-slate-900">{listing.maxParticipants} People</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Platform Fee:</span>
                      <span className="font-bold text-emerald-600">
                        {isFree ? "Free Tier" : `${currencySymbol}${platformFee.toFixed(2)} (Paid by guest)`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Host Control Actions */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Listing link copied! Share this with your friends or guests to let them book.");
                      }
                    }}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share Listing Link</span>
                  </button>

                  <Link
                    href="/host/dashboard"
                    className="w-full py-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <Home className="w-4 h-4 text-purple-600" />
                    <span>Manage in Host Hub</span>
                  </Link>

                  <Link
                    href="/messages"
                    className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    <span>View Inquiries & Messages</span>
                  </Link>

                  <Link
                    href="/host/create"
                    className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <span>+ Publish Another Experience</span>
                  </Link>
                </div>

                {/* Host Info Notice */}
                <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Host Notice:</strong> You cannot book your own listing. To test booking, have a friend open this link on their phone or test in an incognito window!
                  </span>
                </div>
              </div>
            ) : (
              <>
                {/* Date / Nights input if Stay */}
                {isStay && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Number of Nights:</label>
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setBookingNights(Math.max(1, bookingNights - 1))}
                        className="px-3 py-2 bg-slate-50 text-slate-700 font-bold hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center text-xs font-bold text-slate-900">{bookingNights} nights</span>
                      <button
                        type="button"
                        onClick={() => setBookingNights(bookingNights + 1)}
                        className="px-3 py-2 bg-slate-50 text-slate-700 font-bold hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Booking Form or Success Message */}
                {existingRequest || showBookingSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2">
                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-emerald-900">
                      Request Submitted!
                    </h4>
                    <p className="text-xs text-emerald-700">
                      Host {listing.host.name} has been notified. You can track this in your trips or chat directly.
                    </p>
                    <div className="flex flex-col gap-2 mt-2">
                      <Link
                        href="/trips"
                        className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>View in My Trips</span>
                      </Link>
                      <button
                        onClick={handleStartChat}
                        className="w-full py-2 bg-white border border-emerald-300 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-50 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Open Chat with Host</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Introduction Message to Host:
                      </label>
                      <textarea
                        rows={3}
                        value={bookingMessage}
                        onChange={(e) => setBookingMessage(e.target.value)}
                        placeholder="Introduce yourself, your arrival timing, or any questions..."
                        className="w-full border border-slate-300 rounded-xl p-3 text-xs text-slate-900 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                        required
                      />
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                      {!isFree && (
                        <div className="flex justify-between text-slate-600">
                          <span>{currencySymbol}{listing.priceAmount} {isStay ? `× ${bookingNights} nights` : ""}</span>
                          <span>{currencySymbol}{subtotal}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-slate-600">
                        <span className="flex items-center gap-1">
                          <span>Platform Security Fee</span>
                          <span className="text-[10px] text-emerald-600 font-bold">
                            {isFree ? "(Free Tier)" : `(${currency === "USD" ? "$1 Flat" : "₹79 Flat"})`}
                          </span>
                        </span>
                        <span>
                          {isFree ? "FREE" : `${currencySymbol}${platformFee.toFixed(2)}`}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                        <span>Total</span>
                        <span>{isFree ? "100% Free" : `${currencySymbol}${grandTotal.toFixed(2)}`}</span>
                      </div>
                    </div>

                    {/* Submit Action */}
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition"
                    >
                      {isFree ? "Request to Join Free Meetup" : isStay ? "Request to Book Stay" : "Request Spot"}
                    </button>
                  </form>
                )}

                {/* Inquire via Protected Chat */}
                <div className="pt-3 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={handleStartChat}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center justify-center gap-1 mx-auto"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask Host a Question First</span>
                  </button>
                </div>
              </>
            )}

            {/* Anti-Bypass Security Guarantee Footer */}
            <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-500 flex items-start gap-2 border border-slate-200/60">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Leakage Guarantee:</strong> RoamMeet holds funds in escrow until after you meet or check in. Free cancelation refund if host cancels.
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
