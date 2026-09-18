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
  Layers,
  BarChart3,
  Menu,
  X
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { 
    currentUser, 
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
      {/* Top micro-announcement banner about Anti-Bypass & Direct Safe Booking */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 text-white text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Lock className="w-3.5 h-3.5 text-emerald-400" />
        <span>
          <strong>Platform Guarantee:</strong> All homestays & companion meetups are protected by verified KYC and \$1 / ₹79 deposit insurance.
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-indigo-950 to-purple-900 bg-clip-text text-transparent">
                  {SITE_CONFIG.name}
                </span>
                <span className="block text-[10px] text-gray-500 font-semibold tracking-wider uppercase -mt-0.5">
                  Community & Stays
                </span>
              </div>
            </Link>

            {/* Role Toggle Switcher */}
            <button
              onClick={toggleRole}
              title="Switch between Traveler and Host modes"
              className="ml-4 hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border shadow-2xs cursor-pointer hover:opacity-90"
              style={{
                backgroundColor: activeRole === "host" ? "#fdf2f8" : "#eff6ff",
                borderColor: activeRole === "host" ? "#f472b6" : "#93c5fd",
                color: activeRole === "host" ? "#be185d" : "#1d4ed8"
              }}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{activeRole === "host" ? "👑 Host Mode" : "🎒 Traveler Mode"}</span>
              <span className="text-[10px] opacity-75 underline ml-0.5">Switch</span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                pathname === "/" ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              Explore
            </Link>

            <Link
              href="/messages"
              className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname === "/messages" ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
              {totalUnread > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalUnread}
                </span>
              )}
            </Link>

            <Link
              href="/host/create"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname === "/host/create" ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              <PlusCircle className="w-4 h-4 text-purple-600" />
              <span>Host a Stay/Plan</span>
            </Link>

            <Link
              href="/profile/verification"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname === "/profile/verification" ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Trust & KYC</span>
            </Link>

            <Link
              href="/admin"
              className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname === "/admin" ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Admin Hub</span>
              {pendingKycCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {pendingKycCount} KYC
                </span>
              )}
            </Link>
          </nav>

          {/* Right Action: Currency Toggle & User Profile */}
          <div className="flex items-center gap-3">
            {/* Currency switcher ($1 vs ₹79) */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs font-bold">
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

            {/* Profile Avatar & Trust Badge */}
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
          <button
            onClick={toggleRole}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700"
          >
            <span>Current Mode: {activeRole === "host" ? "👑 Host Mode" : "🎒 Traveler Mode"}</span>
            <span className="underline">Switch</span>
          </button>
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
