"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { VerificationBadge, CategoryBadge } from "@/components/ui/Badge";
import { 
  Calendar, 
  MapPin, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileText, 
  ExternalLink, 
  Compass, 
  ShieldCheck,
  Lock,
  Download,
  X,
  Star
} from "lucide-react";
import { BookingRequest } from "@/types";
import { ReviewModal } from "@/components/reviews/ReviewModal";

export default function MyTripsPage() {
  const router = useRouter();
  const { 
    currentUser, 
    openAuthModal, 
    loginAsDemoUser,
    bookingRequests, 
    listings, 
    startConversationWithHost, 
    currencySymbol 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<"all" | "confirmed" | "pending" | "declined">("all");
  const [selectedReceipt, setSelectedReceipt] = useState<BookingRequest | null>(null);
  const [selectedReviewTrip, setSelectedReviewTrip] = useState<BookingRequest | null>(null);

  // Authentication Guard
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">My Trips & Bookings</h1>
        <p className="text-slate-600 max-w-md mx-auto mb-6 text-sm">
          Sign in to view your reservation requests, track host approvals, and view exact addresses for confirmed stays.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => openAuthModal("Sign in to view your trips and bookings")}
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer"
          >
            Sign In to View Trips
          </button>
          <button
            onClick={loginAsDemoUser}
            className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-all cursor-pointer"
          >
            Demo Traveler View
          </button>
        </div>
      </div>
    );
  }

  // Filter traveler-specific requests
  const isTravelerMatching = (applicantId: string) => {
    return (
      applicantId === currentUser.id ||
      applicantId === "user-rohit-01"
    );
  };

  const myTrips = bookingRequests.filter(b => isTravelerMatching(b.applicantId));

  const filteredTrips = myTrips.filter(t => {
    if (activeFilter === "all") return true;
    if (activeFilter === "confirmed") return t.status === "accepted";
    if (activeFilter === "pending") return t.status === "pending";
    if (activeFilter === "declined") return t.status === "declined";
    return true;
  });

  const handleChat = (hostId: string, listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (listing) {
      startConversationWithHost(listing.host, listing.id);
      router.push("/messages");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              Traveler Hub
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {currentUser.name}&rsquo;s Reservations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Trips & Experiences
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Track host approvals, unlock verified stay locations, and communicate directly with hosts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 transition-all hover:scale-[1.02]"
          >
            <Compass className="w-4 h-4" />
            <span>Discover More Stays</span>
          </Link>
          <Link
            href="/host/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all"
          >
            <span>Switch to Host Hub</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
        {[
          { id: "all", label: "All Reservations", count: myTrips.length },
          { id: "confirmed", label: "Confirmed", count: myTrips.filter(t => t.status === "accepted").length },
          { id: "pending", label: "Pending Approval", count: myTrips.filter(t => t.status === "pending").length },
          { id: "declined", label: "Declined", count: myTrips.filter(t => t.status === "declined").length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeFilter === tab.id
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeFilter === tab.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Trips Cards List */}
      {filteredTrips.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">No {activeFilter !== "all" ? activeFilter : ""} trips found</h3>
          <p className="text-xs text-slate-500 mb-4">
            You don&rsquo;t have any reservations under this tab yet. Explore unique homestays and travel companions across the globe!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Feed</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTrips.map((trip) => {
            const listing = listings.find(l => l.id === trip.listingId);
            const isPending = trip.status === "pending";
            const isConfirmed = trip.status === "accepted";
            const isDeclined = trip.status === "declined";

            return (
              <div
                key={trip.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row"
              >
                {/* Thumbnail Image */}
                <div className="md:w-72 relative bg-slate-100 aspect-video md:aspect-auto shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={listing?.photos[0] || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80"}
                    alt={trip.listingTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <CategoryBadge category={trip.category} />
                  </div>
                </div>

                {/* Main Trip Information */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Top Row: Title & Status Pill */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{listing?.destinationCity || "City"}, {listing?.country || "Country"}</span>
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                          {trip.listingTitle}
                        </h3>
                      </div>

                      {/* Status Badges */}
                      <div className="shrink-0">
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pending Host Approval</span>
                          </span>
                        )}
                        {isConfirmed && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Confirmed Reservation</span>
                          </span>
                        )}
                        {isDeclined && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Booking Declined</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stay Dates & Host Info Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 bg-slate-50 p-3.5 rounded-xl text-xs">
                      <div>
                        <span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Stay Dates</span>
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{trip.dates}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Host Details</span>
                        <Link 
                          href={`/profile/${trip.hostId}`}
                          className="inline-flex items-center gap-1.5 font-bold text-slate-800 hover:text-indigo-600 transition"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={listing?.host.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=host"}
                            alt="Host"
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-300"
                          />
                          <span>{listing?.host.name || "Verified Host"}</span>
                          {listing?.host && <VerificationBadge tier={listing.host.verificationTier} />}
                        </Link>
                      </div>
                    </div>

                    {/* Unlocked Address Notice (When Confirmed) */}
                    {isConfirmed && (
                      <div className="mt-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-900">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-950 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Exact Address Unlocked:</span>
                        </div>
                        <p className="font-semibold text-emerald-900 pl-5">
                          {listing?.exactAddress || "Exact address details provided upon host check-in confirmation."}
                        </p>
                        {listing?.addressHint && (
                          <p className="text-[11px] text-emerald-700 pl-5 mt-0.5">
                            Directions note: {listing.addressHint}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Locked Notice (When Pending) */}
                    {isPending && (
                      <div className="mt-3 bg-amber-50/60 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                        <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Exact Address Protected:</span> The host will review your request shortly. Your card is not charged until the host accepts.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions & Price Footer */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs">
                      <span className="text-slate-500 font-medium">Total Price: </span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {currencySymbol}{trip.totalAmount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1 font-normal">
                        (incl. {currencySymbol}{trip.platformFee} platform guarantee)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isConfirmed && (
                        <button
                          onClick={() => setSelectedReviewTrip(trip)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>Review Stay</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedReceipt(trip)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>Receipt</span>
                      </button>

                      <button
                        onClick={() => handleChat(trip.hostId, trip.listingId)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Message Host</span>
                      </button>

                      {listing && (
                        <Link
                          href={`/listings/${listing.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition"
                        >
                          <span>Listing</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">RoamMeet Booking Receipt</h3>
              <p className="text-xs text-slate-500 mt-0.5">Booking Ref: #{selectedReceipt.id.slice(-8).toUpperCase()}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Experience / Stay:</span>
                <span className="font-bold text-slate-800 text-right max-w-[220px] truncate">
                  {selectedReceipt.listingTitle}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Dates:</span>
                <span className="font-semibold text-slate-800">{selectedReceipt.dates}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Status:</span>
                <span className={`font-bold capitalize ${
                  selectedReceipt.status === "accepted" ? "text-emerald-600" : "text-amber-600"
                }`}>
                  {selectedReceipt.status === "accepted" ? "Confirmed" : selectedReceipt.status}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Stay Amount:</span>
                <span className="font-semibold text-slate-800">
                  {currencySymbol}{(selectedReceipt.totalAmount - (selectedReceipt.platformFee || 0)).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Platform Guarantee & KYC Fee:</span>
                <span className="font-semibold text-slate-800">
                  {currencySymbol}{selectedReceipt.platformFee.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-2 bg-slate-50 px-3 rounded-xl text-sm font-extrabold">
                <span className="text-slate-800">Grand Total:</span>
                <span className="text-indigo-600">
                  {currencySymbol}{selectedReceipt.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1 font-semibold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected by RoamMeet Booking Guarantee</span>
              </div>
              <p>
                Host contact details and exact location are securely unlocked once approved.
              </p>
            </div>

            <button
              onClick={() => {
                if (window.print) window.print();
              }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Print / Save Receipt</span>
            </button>
          </div>
        </div>
      )}

      {/* Review Stay Modal */}
      {selectedReviewTrip && (
        <ReviewModal
          isOpen={!!selectedReviewTrip}
          onClose={() => setSelectedReviewTrip(null)}
          listingId={selectedReviewTrip.listingId}
          listingTitle={selectedReviewTrip.listingTitle}
          hostId={selectedReviewTrip.hostId}
          hostName={listings.find(l => l.id === selectedReviewTrip.listingId)?.host.name || "Host"}
        />
      )}

    </div>
  );
}
