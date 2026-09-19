"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { User as UserIcon, LogIn, ArrowLeft } from "lucide-react";

export default function MyProfileRedirectPage() {
  const router = useRouter();
  const { currentUser, openAuthModal, loginAsDemoUser } = useApp();

  useEffect(() => {
    if (currentUser) {
      router.replace(`/profile/${currentUser.id}`);
    }
  }, [currentUser, router]);

  if (currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500 font-semibold">Opening your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <UserIcon className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900">Sign In to View Your Profile</h2>
      <p className="text-sm text-slate-500 max-w-sm mx-auto">
        Create an account or sign in to customize your traveler bio, view KYC badges, and manage your hosted stays.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => openAuthModal("Sign in to access your RoamMeet profile")}
          className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In to Profile</span>
        </button>
        <button
          onClick={loginAsDemoUser}
          className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          Demo User View
        </button>
      </div>
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition mt-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Explore</span>
        </Link>
      </div>
    </div>
  );
}
