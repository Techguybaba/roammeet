"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { SITE_CONFIG } from "@/config/site";
import { 
  Compass, 
  MessageSquare, 
  PlusCircle, 
  ShieldCheck, 
  Lock, 
  BarChart3,
  Menu,
  X,
  LogIn,
  LogOut
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { 
    currentUser, 
    openAuthModal,
    logout,
    activeRole, 
    toggleRole, 
    currency, 
    setCurrency, 
    conversations,
    kycQueue 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const pendingKycCount = kycQueue.filter(k => k.status === "pending").length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
      {/* Top micro-announcement banner about Anti-Bypass & Direct Safe Booking */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 text-white text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Lock className="w-3.5 h-3.5 text-emerald-400" />
        <span>
          <strong>Platform Guarantee:</strong> All homestays & companion meetups are protected by verified KYC and $1 / ₹79 deposit insurance.
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {SITE_CONFIG.name}
                </span>
                <span className="hidden sm:block text-[10px] uppercase font-bold tracking-wider text-indigo-600 -mt-1">
                  Community & Stays
                </span>
              </div>
            </Link>

            {/* Role Switcher Pill: Traveler vs Host */}
            {currentUser && (
              <div className="hidden lg:flex items-center bg-gray-100 p-1 rounded-full border border-gray-200">
                <button
                  onClick={toggleRole}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeRole === "traveler"
                      ? "bg-white text-indigo-600 shadow-xs"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <span>🎒 Traveler Mode</span>
                </button>
                <button
                  onClick={toggleRole}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeRole === "host"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <span>👑 Host Mode</span>
                </button>
              </div>
            )}
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                pathname === "/" 
                  ? "text-indigo-600 bg-indigo-50/70" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </Link>

            <Link
              href="/messages"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors relative ${
                pathname.startsWith("/messages")
                  ? "text-indigo-600 bg-indigo-50/70" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
              {totalUnread > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center -ml-0.5">
                  {totalUnread}
                </span>
              )}
            </Link>

            <Link
              href="/host/create"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                pathname === "/host/create"
                  ? "text-purple-700 bg-purple-50" 
                  : "text-purple-600 hover:text-purple-800 hover:bg-purple-50/50"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Host a Stay/Plan</span>
            </Link>

            <Link
              href="/profile/verification"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                pathname === "/profile/verification"
                  ? "text-emerald-700 bg-emerald-50" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Trust & KYC</span>
            </Link>

            {/* Admin Center */}
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors relative ${
                pathname === "/admin"
                  ? "text-blue-700 bg-blue-50" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Admin Hub</span>
              {pendingKycCount > 0 && (
                <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  {pendingKycCount} KYC
                </span>
              )}
            </Link>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            {/* Currency Switcher ($1.00 USD / ₹79.00 INR) */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-xs font-bold border border-gray-200">
              <button
                onClick={() => setCurrency("USD")}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  currency === "USD" ? "bg-white text-gray-900 shadow-2xs" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                $ USD
              </button>
              <button
                onClick={() => setCurrency("INR")}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  currency === "INR" ? "bg-white text-gray-900 shadow-2xs" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                ₹ INR
              </button>
            </div>

            {/* Authentication Buttons vs Profile Card */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile/verification"
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-gray-50 border border-gray-200 hover:border-indigo-300 transition-all group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <div className="text-left hidden lg:block">
                    <div className="text-xs font-bold text-gray-800 leading-none flex items-center gap-1">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5 inline" />
                      <span>Tier {currentUser.verificationTier}</span>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openAuthModal("Sign in to access your bookings and conversations")}
                  className="px-3 py-1.5 text-xs font-bold text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-all"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuthModal("Create an account to book stays and join travel meetups")}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-all flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-4 space-y-2 shadow-lg">
          {currentUser ? (
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full" />
                <div>
                  <div className="text-xs font-bold text-gray-800">{currentUser.name}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Tier {currentUser.verificationTier} Verified</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-gray-100">
              <button
                onClick={() => { setMobileMenuOpen(false); openAuthModal(); }}
                className="w-full py-2 rounded-lg text-xs font-bold border border-gray-300 text-gray-700 text-center"
              >
                Log In
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); openAuthModal(); }}
                className="w-full py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white text-center shadow-xs"
              >
                Sign Up
              </button>
            </div>
          )}

          {currentUser && (
            <button
              onClick={toggleRole}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700"
            >
              <span>Current Mode: {activeRole === "host" ? "👑 Host Mode" : "🎒 Traveler Mode"}</span>
              <span className="underline">Switch</span>
            </button>
          )}

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Explore Listings
          </Link>
          <Link
            href="/messages"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span>Messages</span>
            {totalUnread > 0 && <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">{totalUnread}</span>}
          </Link>
          <Link
            href="/host/create"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-purple-700 hover:bg-purple-50"
          >
            + Host a Stay or Event
          </Link>
          <Link
            href="/profile/verification"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            Trust & KYC Verification
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-50"
          >
            Admin Moderation & Revenue
          </Link>
        </div>
      )}
    </header>
  );
}
