"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { 
  ShieldCheck, 
  ShieldAlert, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  ArrowLeft
} from "lucide-react";

export default function AdminPage() {
  const { 
    platformRevenue, 
    currencySymbol, 
    currency,
    kycQueue, 
    approveKYC, 
    rejectKYC, 
    flaggedMessages,
    bookingRequests,
    respondToBookingRequest
  } = useApp();

  const [activeTab, setActiveTab] = useState<"kyc" | "flagged" | "bookings">("kyc");
  const [selectedDocPreview, setSelectedDocPreview] = useState<string | null>(null);

  const pendingKyc = kycQueue.filter(k => k.status === "pending");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>Admin & Platform Governance Portal</span>
        </div>
      </div>

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Platform Revenue & Security Moderation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor your \$1 / ₹79 flat micro-booking revenue, review pending KYC identity documents, and audit intercepted off-platform contact bypass attempts.
        </p>
      </div>

      {/* Revenue & Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Platform Revenue (Micro-fee tally) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {currencySymbol}{platformRevenue.totalPlatformFees.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Flat {currency === "USD" ? "$1" : "₹79"} fee per booking collected</span>
          </div>
        </div>

        {/* Metric 2: Gross Booking Volume */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Gross Volume</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {currencySymbol}{platformRevenue.totalGrossVolume.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Across {platformRevenue.totalBookingsCount} confirmed & pending requests
          </div>
        </div>

        {/* Metric 3: Pending KYC Submissions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending KYC</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {pendingKyc.length} Profiles
          </div>
          <div className="text-[11px] text-amber-700 font-semibold">
            Manual Identity review pipeline active
          </div>
        </div>

        {/* Metric 4: Intercepted Bypass Attempts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Bypass Intercepted</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {flaggedMessages.length} Blocked
          </div>
          <div className="text-[11px] text-rose-700 font-semibold">
            100% Platform leakages masked
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("kyc")}
          className={`pb-3 text-xs sm:text-sm font-bold transition border-b-2 cursor-pointer ${
            activeTab === "kyc"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          KYC Verification Queue ({pendingKyc.length})
        </button>

        <button
          onClick={() => setActiveTab("flagged")}
          className={`pb-3 text-xs sm:text-sm font-bold transition border-b-2 cursor-pointer ${
            activeTab === "flagged"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Anti-Bypass Audit Log ({flaggedMessages.length})
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-3 text-xs sm:text-sm font-bold transition border-b-2 cursor-pointer ${
            activeTab === "bookings"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Booking Escrow & Payouts ({bookingRequests.length})
        </button>
      </div>

      {/* Tab Content: KYC Verification Queue */}
      {activeTab === "kyc" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">
              Pending Document Submissions
            </h3>
            <span className="text-xs text-slate-500">
              Future-ready hooks available for HyperVerge, Cashfree, DigiLocker, and Stripe Identity
            </span>
          </div>

          {pendingKyc.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">All submissions reviewed!</p>
              <p className="text-xs text-slate-400 mt-0.5">There are no pending documents in the verification queue.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingKyc.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  
                  {/* User info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.userAvatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20" />
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">{item.userName}</span>
                        <span className="text-xs text-slate-400">{item.country} • Submitted {item.submittedAt}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                      {item.documentType}
                    </span>
                  </div>

                  {/* Doc details */}
                  <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Doc Type:</span>
                      <strong className="text-slate-900 capitalize">{item.documentType.replace("_", " ")}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Doc Number:</span>
                      <strong className="font-mono text-slate-900">{item.documentNumber}</strong>
                    </div>
                  </div>

                  {/* Photo Thumbnails */}
                  <div className="grid grid-cols-2 gap-2 text-center text-[10px] text-slate-500">
                    <div>
                      <span className="block mb-1 font-semibold">Government ID Document</span>
                      <div 
                        onClick={() => setSelectedDocPreview(item.idPhotoUrl)}
                        className="h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer hover:opacity-90 relative group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.idPhotoUrl} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition">
                          View
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="block mb-1 font-semibold">Live Camera Selfie</span>
                      <div 
                        onClick={() => setSelectedDocPreview(item.selfieUrl)}
                        className="h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer hover:opacity-90 relative group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.selfieUrl} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition">
                          View
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => approveKYC(item.id)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Issue Badge</span>
                    </button>

                    <button
                      onClick={() => rejectKYC(item.id, "Document image blurred or mismatch")}
                      className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Anti-Bypass Audit Log */}
      {activeTab === "flagged" && (
        <div className="space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-900 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Anti-Disintermediation Policy Enforcement</strong>
              <p className="text-rose-800 mt-0.5">
                These messages were automatically intercepted by the Chat Guardian regex engine. Contact details (phone numbers, WhatsApp links, Instagram handles, UPI tags) were stripped and replaced before delivery.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Time</th>
                  <th className="p-3.5">Sender</th>
                  <th className="p-3.5">Target Host</th>
                  <th className="p-3.5">Detected Channel</th>
                  <th className="p-3.5">Original Snippet</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {flaggedMessages.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">{f.timestamp}</td>
                    <td className="p-3.5 font-bold text-slate-800">{f.senderName}</td>
                    <td className="p-3.5 text-slate-600">{f.receiverName}</td>
                    <td className="p-3.5">
                      <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-md text-[10px]">
                        {f.detectedType}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600 max-w-xs truncate">{f.maskedSnippet}</td>
                    <td className="p-3.5 text-right">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        Masked & Protected
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Bookings & Escrow */}
      {activeTab === "bookings" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Experience</th>
                  <th className="p-3.5">Applicant</th>
                  <th className="p-3.5">Requested Dates</th>
                  <th className="p-3.5">Subtotal</th>
                  <th className="p-3.5">Platform Micro-Fee</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Host Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookingRequests.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3.5 font-bold text-slate-900">{b.listingTitle}</td>
                    <td className="p-3.5 text-slate-700">{b.applicant.name}</td>
                    <td className="p-3.5 text-slate-500">{b.dates}</td>
                    <td className="p-3.5 font-bold text-slate-800">{currencySymbol}{b.totalAmount}</td>
                    <td className="p-3.5 text-emerald-700 font-bold">
                      {b.platformFee === 0 ? "FREE" : `+${currencySymbol}${b.platformFee.toFixed(2)}`}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.status === "accepted" ? "bg-emerald-100 text-emerald-800" :
                        b.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
                      }`}>
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      {b.status === "pending" ? (
                        <>
                          <button
                            onClick={() => respondToBookingRequest(b.id, "accepted")}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => respondToBookingRequest(b.id, "declined")}
                            className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-[10px] font-bold transition cursor-pointer"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Preview for Document */}
      {selectedDocPreview && (
        <div 
          onClick={() => setSelectedDocPreview(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="bg-white p-4 rounded-2xl max-w-xl w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-bold text-slate-900">Document Zoom</h4>
              <button onClick={() => setSelectedDocPreview(null)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Close</button>
            </div>
            <div className="max-h-[480px] overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedDocPreview} alt="Enlarged Document" className="w-full h-auto object-contain" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
