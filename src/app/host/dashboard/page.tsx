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
  AlertCircle,
  CreditCard,
  Landmark,
  Wallet,
  ArrowUpRight,
  Trash2,
  Check,
  X
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
    currencySymbol,
    payoutMethods,
    addPayoutMethod,
    removePayoutMethod,
    setDefaultPayoutMethod,
    addNotification
  } = useApp();

  const [activeTab, setActiveTab] = useState<"requests" | "listings" | "earnings">("requests");
  const [requestFilter, setRequestFilter] = useState<"all" | "pending" | "accepted" | "declined">("all");
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Payout Method Modal State
  const [isAddPayoutOpen, setIsAddPayoutOpen] = useState(false);
  const [payoutFormType, setPayoutFormType] = useState<"upi" | "bank" | "paypal">("upi");
  const [formUpiId, setFormUpiId] = useState("");
  const [formHolderName, setFormHolderName] = useState("");
  const [formAccountNumber, setFormAccountNumber] = useState("");
  const [formIfsc, setFormIfsc] = useState("");
  const [formBankName, setFormBankName] = useState("");
  const [formPaypalEmail, setFormPaypalEmail] = useState("");
  const [withdrawnIds, setWithdrawnIds] = useState<Set<string>>(new Set());

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

  // Statistics & Financials
  const acceptedBookings = hostRequests.filter(r => r.status === "accepted");
  const grossVolume = acceptedBookings.reduce((acc, r) => acc + (r.totalAmount || 0) + (r.platformFee || 0), 0);
  const totalPlatformFees = acceptedBookings.reduce((acc, r) => acc + (r.platformFee || 0), 0);
  const totalHostNet = acceptedBookings.reduce((acc, r) => acc + (r.totalAmount || 0), 0);
  const availableBalance = acceptedBookings
    .filter(b => !withdrawnIds.has(b.id))
    .reduce((acc, r) => acc + (r.totalAmount || 0), 0);
  const alreadyPaidOut = acceptedBookings
    .filter(b => withdrawnIds.has(b.id))
    .reduce((acc, r) => acc + (r.totalAmount || 0), 0);

  const totalEarnings = totalHostNet;
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

  const handleSavePayoutMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutFormType === "upi") {
      if (!formUpiId.trim()) return;
      addPayoutMethod({
        type: "upi",
        upiId: formUpiId.trim(),
        isDefault: payoutMethods.length === 0
      });
    } else if (payoutFormType === "bank") {
      if (!formAccountNumber.trim() || !formIfsc.trim()) return;
      addPayoutMethod({
        type: "bank",
        accountHolderName: formHolderName.trim() || currentUser.name,
        accountNumber: formAccountNumber.trim(),
        ifscCode: formIfsc.trim().toUpperCase(),
        bankName: formBankName.trim() || "Bank",
        isDefault: payoutMethods.length === 0
      });
    } else {
      if (!formPaypalEmail.trim()) return;
      addPayoutMethod({
        type: "paypal",
        paypalEmail: formPaypalEmail.trim(),
        isDefault: payoutMethods.length === 0
      });
    }

    setIsAddPayoutOpen(false);
    setFormUpiId("");
    setFormAccountNumber("");
    setFormIfsc("");
    setFormHolderName("");
    setFormBankName("");
    setFormPaypalEmail("");
    setActionSuccessMessage("Payout method saved successfully!");
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleWithdrawFunds = () => {
    if (availableBalance <= 0) return;
    if (payoutMethods.length === 0) {
      setIsAddPayoutOpen(true);
      return;
    }
    const primaryMethod = payoutMethods.find(m => m.isDefault) || payoutMethods[0];
    const targetMethodLabel = primaryMethod.type === "upi"
      ? `UPI (${primaryMethod.upiId})`
      : primaryMethod.type === "bank"
      ? `Bank Account (${primaryMethod.bankName || "Bank"} •••• ${primaryMethod.accountNumber?.slice(-4)})`
      : `PayPal (${primaryMethod.paypalEmail})`;

    const newSet = new Set(withdrawnIds);
    acceptedBookings.forEach(b => newSet.add(b.id));
    setWithdrawnIds(newSet);

    addNotification({
      userId: currentUser.id,
      type: "payout_processed",
      title: "Payout Initiated 💸",
      message: `Transfer of ${currencySymbol}${availableBalance.toLocaleString()} initiated to ${targetMethodLabel}. Funds usually arrive within 24 hours.`,
      link: "/host/dashboard",
      read: false
    });

    setActionSuccessMessage(`Payout of ${currencySymbol}${availableBalance.toLocaleString()} initiated to ${targetMethodLabel}!`);
    setTimeout(() => setActionSuccessMessage(null), 5000);
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

          <button
            onClick={() => setActiveTab("earnings")}
            className={`pb-3 text-sm font-extrabold transition-all relative cursor-pointer ${
              activeTab === "earnings" 
                ? "text-indigo-600 border-b-2 border-indigo-600" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Earnings & Payouts</span>
              {availableBalance > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {currencySymbol}{availableBalance}
                </span>
              )}
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

      {/* Tab 3: Earnings & Payouts Content */}
      {activeTab === "earnings" && (
        <div className="space-y-8">
          
          {/* Header & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" />
                <span>Host Earnings & Direct Payouts</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                All host earnings are 100% yours. RoamMeet charges zero commission on your stay pricing.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsAddPayoutOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                <span>Add Payout Method</span>
              </button>

              <button
                onClick={handleWithdrawFunds}
                disabled={availableBalance <= 0}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md cursor-pointer ${
                  availableBalance > 0
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Withdraw {currencySymbol}{availableBalance.toLocaleString()}</span>
              </button>
            </div>
          </div>

          {/* Financial Metrics 4-Col Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Net Host Payouts</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {currencySymbol}{totalHostNet.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold">
                From {currencySymbol}{grossVolume.toLocaleString()} gross volume
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Available for Withdrawal</span>
                <Wallet className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-indigo-600">
                {currencySymbol}{availableBalance.toLocaleString()}
              </div>
              <div className="text-[11px] text-indigo-600 font-semibold">
                Ready for instant transfer
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Processed Payouts</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {currencySymbol}{alreadyPaidOut.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Sent to your bank/UPI
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Platform Guarantee Fees</span>
                <ShieldCheck className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {currencySymbol}{totalPlatformFees.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Flat $1/₹79 guest KYC fee
              </div>
            </div>
          </div>

          {/* Saved Payout Methods Card */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  Payout Methods
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose where RoamMeet sends your stay earnings (UPI ID, Direct Bank Account, or PayPal).
                </p>
              </div>

              <button
                onClick={() => setIsAddPayoutOpen(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
              >
                + Add Method
              </button>
            </div>

            {payoutMethods.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <Landmark className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs font-bold text-slate-700">No Payout Method Saved</div>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Add your UPI ID or Bank Account to receive direct payouts for your completed stays.
                </p>
                <button
                  onClick={() => setIsAddPayoutOpen(true)}
                  className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Configure Payout Method
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {payoutMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 rounded-2xl border transition relative space-y-3 ${
                      method.isDefault
                        ? "border-indigo-500 bg-indigo-50/20 shadow-xs"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                          {method.type === "upi" && <span className="font-black text-xs text-indigo-600">UPI</span>}
                          {method.type === "bank" && <Landmark className="w-5 h-5 text-indigo-600" />}
                          {method.type === "paypal" && <CreditCard className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-slate-900">
                            {method.type === "upi" && method.upiId}
                            {method.type === "bank" && `${method.bankName} (•••• ${method.accountNumber?.slice(-4)})`}
                            {method.type === "paypal" && method.paypalEmail}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {method.type === "upi" && "Instant UPI Transfer"}
                            {method.type === "bank" && `IFSC: ${method.ifscCode} • ${method.accountHolderName}`}
                            {method.type === "paypal" && "International PayPal Transfer"}
                          </div>
                        </div>
                      </div>

                      {method.isDefault && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                          Primary
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      {!method.isDefault ? (
                        <button
                          onClick={() => setDefaultPayoutMethod(method.id)}
                          className="text-indigo-600 font-bold hover:underline cursor-pointer"
                        >
                          Make Primary
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Default account</span>
                      )}

                      <button
                        onClick={() => removePayoutMethod(method.id)}
                        className="text-rose-600 font-bold hover:text-rose-800 transition cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Reservations & Payout Ledger */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  Completed Reservations Ledger
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track guest stay payments, platform guarantee fees, and net payouts.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {acceptedBookings.length} {acceptedBookings.length === 1 ? "Record" : "Records"}
              </span>
            </div>

            {acceptedBookings.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                No confirmed reservations yet. Once you accept booking requests, their financial settlement details will appear here.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {acceptedBookings.map((b) => {
                  const isWithdrawn = withdrawnIds.has(b.id);
                  return (
                    <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-slate-50/50 transition">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={b.applicant.avatar}
                          alt={b.applicant.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-50 shrink-0"
                        />
                        <div>
                          <div className="font-extrabold text-xs text-slate-900">
                            {b.listingTitle}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Guest: <span className="font-semibold text-slate-700">{b.applicant.name}</span> • {b.dates}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 text-xs">
                        <div className="text-right">
                          <div className="font-black text-sm text-slate-900">
                            {currencySymbol}{b.totalAmount}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            +{currencySymbol}{b.platformFee.toFixed(2)} guest fee
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isWithdrawn ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Paid Out</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Available</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Add Payout Method Modal */}
      {isAddPayoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsAddPayoutOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Add Payout Method</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your preferred transfer channel for guest stay payouts.
              </p>
            </div>

            {/* Payout Type Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setPayoutFormType("upi")}
                className={`py-2 rounded-lg transition cursor-pointer ${
                  payoutFormType === "upi" ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                UPI (India)
              </button>
              <button
                type="button"
                onClick={() => setPayoutFormType("bank")}
                className={`py-2 rounded-lg transition cursor-pointer ${
                  payoutFormType === "bank" ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Bank Transfer
              </button>
              <button
                type="button"
                onClick={() => setPayoutFormType("paypal")}
                className={`py-2 rounded-lg transition cursor-pointer ${
                  payoutFormType === "paypal" ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                PayPal (Global)
              </button>
            </div>

            <form onSubmit={handleSavePayoutMethod} className="space-y-3.5 text-xs">
              {payoutFormType === "upi" && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">UPI ID (VPA):</label>
                  <input
                    type="text"
                    value={formUpiId}
                    onChange={(e) => setFormUpiId(e.target.value)}
                    placeholder="e.g. rohit@okhdfcbank or 9876543210@paytm"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Instant zero-fee transfer directly to your Indian bank via UPI.
                  </span>
                </div>
              )}

              {payoutFormType === "bank" && (
                <>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Account Holder Name:</label>
                    <input
                      type="text"
                      value={formHolderName}
                      onChange={(e) => setFormHolderName(e.target.value)}
                      placeholder={currentUser.name}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Bank Name:</label>
                    <input
                      type="text"
                      value={formBankName}
                      onChange={(e) => setFormBankName(e.target.value)}
                      placeholder="e.g. HDFC Bank / Chase / Barclays"
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Account Number:</label>
                      <input
                        type="text"
                        value={formAccountNumber}
                        onChange={(e) => setFormAccountNumber(e.target.value)}
                        placeholder="e.g. 50100492104921"
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">IFSC / Routing Code:</label>
                      <input
                        type="text"
                        value={formIfsc}
                        onChange={(e) => setFormIfsc(e.target.value)}
                        placeholder="e.g. HDFC0001234"
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono uppercase"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {payoutFormType === "paypal" && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">PayPal Email Address:</label>
                  <input
                    type="email"
                    value={formPaypalEmail}
                    onChange={(e) => setFormPaypalEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    For global hosts receiving international USD payouts.
                  </span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPayoutOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-md cursor-pointer"
                >
                  Save Method
                </button>
              </div>
            </form>
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
