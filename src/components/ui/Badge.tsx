import React from "react";
import { ShieldCheck, ShieldAlert, CheckCircle2 } from "lucide-react";
import { VerificationTier, ListingCategory } from "@/types";

interface VerificationBadgeProps {
  tier: VerificationTier;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function VerificationBadge({ tier, showText = true, size = "md" }: VerificationBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3 py-1.5 gap-2"
  }[size];

  if (tier >= 3) {
    return (
      <span className={`inline-flex items-center rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 ${sizeClasses}`}>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        {showText && <span>Verified KYC Shield</span>}
      </span>
    );
  }

  if (tier === 2) {
    return (
      <span className={`inline-flex items-center rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
        {showText && <span>Selfie Verified</span>}
      </span>
    );
  }

  if (tier === 1) {
    return (
      <span className={`inline-flex items-center rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
        {showText && <span>Phone Verified</span>}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full font-medium bg-gray-100 text-gray-600 border border-gray-200 ${sizeClasses}`}>
      <ShieldAlert className="w-3.5 h-3.5 text-gray-400" />
      {showText && <span>Unverified</span>}
    </span>
  );
}

export function CategoryBadge({ category }: { category: ListingCategory }) {
  const map: Record<ListingCategory, { label: string; bg: string; text: string; border: string }> = {
    stay: { label: "🏨 Homestay", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
    travel_buddy: { label: "✈️ Travel Buddy", bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-300" },
    party: { label: "🎉 Party & Social", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    activity: { label: "🗺️ Local Tour", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" }
  };

  const c = map[category];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  );
}
