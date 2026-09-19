"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { VerificationBadge, CategoryBadge } from "@/components/ui/Badge";
import { 
  Users, 
  DollarSign, 
  Home, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Calendar, 
  PlusCircle, 
  ShieldCheck, 
  ExternalLink,
  PauseCircle,
  PlayCircle,
  Sparkles,
  AlertCircle
} from "lucide-react";

export default function HostDashboardPage() {
  const router = useRouter();
  const { 
    currentUser, 
    openAuthModal, 
    loginAsDemoUser,
    bookingRequests, 
    respondToBookingRequest, 
    listings, 
    toggleListingStatus,
    startConversationWithHost, 
    currencySymbol 
  } = useApp();

  const [activeTab, setActiveTab] = useState<"requests" | "listings">("requests");
  const [requestFilter, setRequestFilter] = useState<"all" | "pending" | "accepted" | "declined">("all");
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Authentication Guard
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Home className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Host Management Hub</h1>
        <p className="text-slate-600 max-w-md mx-auto mb-6 text-sm">
          Sign in to your host account to manage incoming booking requests, approve travelers, and track your stay earnings.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => openAuthModal("Sign in to access your Host Dashboard")}
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer"
          >
            Sign In to Host Account
          </button>
          <button
            onClick={loginAsDemoUser}
            className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-all cursor-pointer"
          >
            Demo Host View
          </button>
        </div>
      </div>
    );
  }

  // Filter host-specific requests and listings
  const isHostMatching = (hostId: string) => {
    return (
      hostId === currentUser.id ||
      hostId === "user-rohit-01" ||
      hostId === "user-david-cali" ||
      hostId === "user-sarah-london" ||
      hostId === "user-priya-goa"
    );
  };

  const hostRequests = bookingRequests.filter(b => isHostMatching(b.hostId));
  const filteredRequests = hostRequests.filter(r => {
    if (requestFilter === "all") return true;
    return r.status === requestFilter;
  });

  const hostListings = listings.filter(l => 
    l.hostId === currentUser.id || 
    (currentUser.email && l.host.email && currentUser.email.toLowerCase() === l.host.email.toLowerCase()) ||
    l.host.id === currentUser.id
  );

  // Statistics
  const totalEarnings = hostRequests
    .filter(r => r.status === "accepted")
    .reduce((acc, r) => acc + (r.totalAmount || 0), 0);

  const pendingRequestsCount = hostRequests.filter(r => r.status === "pending").length;
  const activeListingsCount = hostListings.filter(l => l.status === "active").length;

  const handleAccept = (requestId: string, travelerName: string) => {
    respondToBookingRequest(requestId, "accepted");
    setActionSuccessMessage(`Booking confirmed for ${travelerName}! The exact address has been unlocked for them.`);
    setTimeout(() => setActionSuccessMessage(null), 5000);
  };

  const handleDecline = (requestId: string, travelerName: string) => {
    respondToBookingRequest(requestId, "declined");
    setActionSuccessMessage(`Declined booking request from ${travelerName}.`);
    setTimeout(() => setActionSuccessMessage(null), 5000);
  };

  const handleChat = (applicant: typeof currentUser, listingId: string) => {
    startConversationWithHost(applicant, listingId);
    router.push("/messages");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast feedback banner */}
      {actionSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
              Host Portal
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Welcome back, {currentUser.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Host Management Hub
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Review incoming traveler requests, manage your active stays, and track total payouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/host/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-purple-200 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Listing</span>
          </Link>
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all"
          >
            <span>Switch to My Trips</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Earnings</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {currencySymbol}{totalEarnings.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            From {hostRequests.filter(r => r.status === "accepted").length} confirmed stays
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Requests</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {pendingRequestsCount}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            {pendingRequestsCount > 0 ? "Requires your review" : "All caught up"}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Listings</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {activeListingsCount}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold mt-1">
            Published on RoamMeet feed
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Verification Tier</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 flex items-center gap-1.5">
            <span>Tier {currentUser.verificationTier}</span>
            <span className="text-xs font-medium text-slate-500">
              ({currentUser.idVerified ? "Gov ID" : "Basic"})
            </span>
          </div>
          <Link 
            href="/profile/verification"
            className="text-[11px] text-indigo-600 hover:underline font-semibold mt-1 inline-block"
          >
            {currentUser.verificationTier >= 3 ? "Fully Verified Host" : "Upgrade to Tier 3 →"}
          </Link>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("requests")}
            className={`pb-3 text-sm font-extrabold transition-all relative cursor-pointer ${
              activeTab === "requests" 
                ? "text-indigo-600 border-b-2 border-indigo-600" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span className="flex items-center gap-2">
              <span>Booking Requests</span>
              {pendingRequestsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                  {pendingRequestsCount}
                </span>
              )}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("listings")}
            className={`pb-3 text-sm font-extrabold transition-all relative cursor-pointer ${
              activeTab === "listings" 
                ? "text-indigo-600 border-b-2 border-indigo-600" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span className="flex items-center gap-2">
              <span>My Listings</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                {hostListings.length}
              </span>
            </span>
          </button>
        </div>

        {/* Sub-filter chips for requests */}
        {activeTab === "requests" && (
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold mb-2">
            {(["all", "pending", "accepted", "declined"] as const).map(f => (
              <button
                key={f}
                onClick={() => setRequestFilter(f)}
                className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                  requestFilter === f
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab 1: Booking Requests Content */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">No {requestFilter !== "all" ? requestFilter : ""} booking requests</h3>
              <p className="text-xs text-slate-500 mb-4">
                When travelers find your listings and click &ldquo;Request to Book&rdquo;, their requests will appear here for you to accept or decline.
              </p>
              <Link
                href="/host/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create a Listing</span>
              </Link>
            </div>
          ) : (
            filteredRequests.map((request) => {
              const listing = listings.find(l => l.id === request.listingId);
              const isPending = request.status === "pending";
              const isAccepted = request.status === "accepted";
              const isDeclined = request.status === "declined";

              return (
                <div 
                  key={request.id}
                  className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 space-y-4 shadow-2xs ${
                    isPending ? "border-amber-200 ring-2 ring-amber-100/50" : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    {/* Traveler Info */}
                    <Link 
                      href={`/profile/${request.applicant.id}`}
                      className="flex items-start gap-3 hover:opacity-90 transition group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={request.applicant.avatar} 
                        alt={request.applicant.name} 
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100 group-hover:ring-indigo-300 transition shrink-0" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition">
                            {request.applicant.name}
                          </h4>
                          <VerificationBadge tier={request.applicant.verificationTier} />
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {request.applicant.city}, {request.applicant.country} • Member since {request.applicant.joinedDate}
                        </p>
                      </div>
                    </Link>

                    {/* Status Badge */}
                    <div>
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Pending Host Approval</span>
                        </span>
                      )}
                      {isAccepted && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Confirmed & Unlocked</span>
                        </span>
                      )}
                      {isDeclined && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Declined</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stay & Listing Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
                    <div>
                      <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Requested Listing</span>
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <CategoryBadge category={request.category} />
                        <span className="truncate">{request.listingTitle}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Requested Dates</span>
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{request.dates}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Host Payout Amount</span>
                      <div className="font-bold text-slate-900 text-sm">
                        {currencySymbol}{request.totalAmount.toLocaleString()}
                        <span className="text-[10px] text-slate-500 font-normal ml-1">
                          (Platform fee: {currencySymbol}{request.platformFee} paid by guest)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Traveler Intro Message */}
                  {request.message && (
                    <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 text-xs text-slate-700">
                      <span className="font-bold text-indigo-900 block mb-0.5">Traveler Note:</span>
                      &ldquo;{request.message}&rdquo;
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => handleChat(request.applicant, request.listingId)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Chat with {request.applicant.name}</span>
                    </button>

                    {isPending && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDecline(request.id, request.applicant.name)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                        <button
                          onClick={() => handleAccept(request.id, request.applicant.name)}
                          className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept & Confirm</span>
                        </button>
                      </div>
                    )}

                    {isAccepted && listing && (
                      <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Address unlocked for traveler: {listing.exactAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: My Listings Content */}
      {activeTab === "listings" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostListings.map((listing) => {
              const isActive = listing.status === "active";

              return (
                <div 
                  key={listing.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={listing.photos[0]} 
                      alt={listing.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-3 left-3">
                      <CategoryBadge category={listing.category} />
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs ${
                        isActive 
                          ? "bg-emerald-500 text-white" 
                          : "bg-slate-800/80 text-white backdrop-blur-xs"
                      }`}>
                        {isActive ? "Active on Feed" : "Paused"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-xs text-slate-500 font-medium">
                        {listing.destinationCity}, {listing.country}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1">
                        {listing.title}
                      </h3>
                      <div className="text-sm font-extrabold text-indigo-600 mt-1">
                        {currencySymbol}{listing.priceAmount.toLocaleString()} 
                        <span className="text-xs text-slate-500 font-normal">
                          {listing.category === "stay" ? " / night" : " / person"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => toggleListingStatus(listing.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          isActive 
                            ? "text-slate-600 hover:text-amber-700 hover:bg-amber-50" 
                            : "text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {isActive ? (
                          <>
                            <PauseCircle className="w-3.5 h-3.5 text-amber-500" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Resume</span>
                          </>
                        )}
                      </button>

                      <Link
                        href={`/listings/${listing.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      >
                        <span>View Page</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Create New Listing Card */}
            <Link
              href="/host/create"
              className="border-2 border-dashed border-slate-300 hover:border-purple-500 bg-purple-50/30 hover:bg-purple-50/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all group min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-purple-700 transition">
                Create Another Listing
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Publish a homestay, companion meetup, party, or guided local experience.
              </p>
            </Link>
          </div>
        </div>
      )}

      {/* Host Guarantee Micro-banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">RoamMeet Host Protection Program</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Every accepted guest is KYC-verified. Our Contact Guardian prevents off-platform spam and protects your revenue.
            </p>
          </div>
        </div>
        <Link
          href="/profile/verification"
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition shrink-0"
        >
          Check KYC Status
        </Link>
      </div>

    </div>
  );
}
