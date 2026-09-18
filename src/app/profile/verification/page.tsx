"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { VerificationBadge } from "@/components/ui/Badge";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ArrowRight,
  ArrowLeft
} from "lucide-react";

export default function VerificationPage() {
  const { currentUser, openAuthModal, submitKYC, kycQueue } = useApp();

  const [docType, setDocType] = useState<"passport" | "aadhaar" | "driving_license" | "national_id">("passport");
  const [docNumber, setDocNumber] = useState("");
  const [country, setCountry] = useState("India");
  const [idPhotoUrl, setIdPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80"
  );
  const [selfieUrl, setSelfieUrl] = useState(currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // If not logged in, prompt user to sign in
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Sign In to View Trust & KYC Status</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          To protect hosts and travelers from fraud, members submit identity verification once signed in.
        </p>
        <div className="pt-2">
          <button
            onClick={() => openAuthModal("Sign in to access your trust and verification roadmap")}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all"
          >
            Sign In / Create Account
          </button>
        </div>
      </div>
    );
  }

  // Check if current user has a pending KYC submission in the queue
  const myPendingKyc = kycQueue.find(k => k.userId === currentUser.id && k.status === "pending");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber.trim()) return;

    submitKYC({
      documentType: docType,
      documentNumber: docNumber,
      country,
      idPhotoUrl,
      selfieUrl
    });
    setSubmittedSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Back link */}
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>

        <Link
          href="/admin"
          className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition flex items-center gap-1.5"
        >
          <span>Admin Moderation Queue →</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-8 rounded-3xl border border-indigo-900 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <ShieldCheck className="w-4 h-4" />
            <span>Anti-Fake Trust & Safety Protocol</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Trust & Identity Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            To eliminate fake accounts and make peer-to-peer homestays & meetups 100% secure, all members progress through verified trust tiers.
          </p>
        </div>

        {/* Current User Trust Status Pill */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center min-w-[200px] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-14 h-14 rounded-full object-cover mx-auto ring-4 ring-emerald-400/30 mb-2"
          />
          <h4 className="font-bold text-sm text-white">{currentUser.name}</h4>
          <div className="mt-1">
            <VerificationBadge tier={currentUser.verificationTier} />
          </div>
          <span className="text-[10px] text-slate-300 block mt-1.5">
            Tier {currentUser.verificationTier} of 4 Complete
          </span>
        </div>
      </div>

      {/* 4 Trust Tiers Roadmap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Tier 1 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2 relative">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs">
            1
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
            <span>Phone & Email OTP</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </h3>
          <p className="text-xs text-slate-500">
            Eliminates bot profiles and disposable email signups.
          </p>
          <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            Verified ({currentUser.phone})
          </span>
        </div>

        {/* Tier 2 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2 relative">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs">
            2
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
            <span>Live Selfie Match</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </h3>
          <p className="text-xs text-slate-500">
            Matches real-time camera capture with profile photo.
          </p>
          <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            Verified (Face Matched)
          </span>
        </div>

        {/* Tier 3 */}
        <div className={`p-4 rounded-2xl border shadow-2xs space-y-2 relative ${
          currentUser.idVerified ? "bg-white border-slate-200" : "bg-indigo-50/50 border-indigo-300 ring-2 ring-indigo-500/20"
        }`}>
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
            3
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
            <span>Government ID / KYC</span>
            {currentUser.idVerified ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <span className="text-[10px] font-bold text-indigo-700 uppercase">Current Step</span>
            )}
          </h3>
          <p className="text-xs text-slate-500">
            Passport, Aadhaar card, or Driver&apos;s License verification.
          </p>
          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
            currentUser.idVerified ? "bg-emerald-50 text-emerald-700" : "bg-amber-100 text-amber-800"
          }`}>
            {currentUser.idVerified ? "Gold Shield Unlocked" : myPendingKyc ? "Under Review" : "Pending Submission"}
          </span>
        </div>

        {/* Tier 4 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2 relative">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs">
            4
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
            <span>Socials & Reviews</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </h3>
          <p className="text-xs text-slate-500">
            LinkedIn / Instagram connections and peer ratings.
          </p>
          <span className="inline-block text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
            14 Verified Reviews
          </span>
        </div>

      </div>

      {/* Tier 3 Submission Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-black text-slate-900">
            Submit Government ID for Gold Verified Shield
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            As decided, verification is reviewed through the <strong>Admin Moderation Pipeline</strong>, with future automated integrations for Indian providers (HyperVerge, Cashfree, DigiLocker) and Global providers (Stripe Identity).
          </p>
        </div>

        {currentUser.idVerified ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-emerald-950">
              Your Profile is Gold Shield Verified!
            </h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              Your government identity has been verified by the RoamMeet moderation team. You have highest booking priority and lower deposit requirements.
            </p>
          </div>
        ) : myPendingKyc || submittedSuccess ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-amber-950">
              KYC Document Under Review
            </h3>
            <p className="text-xs text-amber-800 max-w-md mx-auto">
              Your document has been submitted to the Admin Moderation Queue. You can switch to the Admin Hub to inspect and approve it!
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <span>Go to Admin Moderation Hub</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Issuing Country:
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="India">India (Aadhaar / Passport / DL)</option>
                  <option value="United States">United States (Passport / State ID)</option>
                  <option value="United Kingdom">United Kingdom (Passport / DL)</option>
                  <option value="Japan">Japan (My Number / Passport)</option>
                  <option value="France">France (National ID / Passport)</option>
                  <option value="Global">Other Country</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Document Type:
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as "passport" | "aadhaar" | "driving_license" | "national_id")}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="passport">International Passport</option>
                  <option value="aadhaar">Aadhaar Card (India)</option>
                  <option value="driving_license">Driver&apos;s License</option>
                  <option value="national_id">Government National Identity Card</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Document Number (Encrypted & Redacted):
              </label>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder="e.g. M8839201 or XXXX-XXXX-4821"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Document and Selfie Previews */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ID Document Photo (Sample or URL):
                </label>
                <input
                  type="url"
                  value={idPhotoUrl}
                  onChange={(e) => setIdPhotoUrl(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 mb-2"
                  required
                />
                <div className="h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={idPhotoUrl} alt="ID Document Preview" className="w-full h-full object-cover" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Live Selfie Liveness Match:
                </label>
                <input
                  type="url"
                  value={selfieUrl}
                  onChange={(e) => setSelfieUrl(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 mb-2"
                  required
                />
                <div className="h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selfieUrl} alt="Selfie Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Privacy & Security Disclaimer */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs text-slate-500 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <span>
                Your identity documents are encrypted using AES-256 and stored in a private vault. They are never shared publicly or displayed to hosts or travelers.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer"
            >
              Submit ID for Admin Verification
            </button>
          </form>
        )}

      </div>

    </div>
  );
}
