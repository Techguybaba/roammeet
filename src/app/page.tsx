"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { SITE_CONFIG } from "@/config/site";
import { VerificationBadge, CategoryBadge } from "@/components/ui/Badge";
import { Listing } from "@/types";
import { 
  Search, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  PlusCircle, 
  Sparkles, 
  ArrowRight,
  Filter,
  MessageSquare,
  Lock
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { 
    listings, 
    activeRole, 
    currency, 
    currencySymbol, 
    startConversationWithHost 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchCity = item.destinationCity.toLowerCase().includes(q);
        const matchCountry = item.country.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        if (!matchTitle && !matchCity && !matchCountry && !matchDesc) return false;
      }
      // Verified only
      if (verifiedOnly && item.host.verificationTier < 2) {
        return false;
      }
      // Price filter
      if (priceFilter === "free" && item.priceAmount > 0) return false;
      if (priceFilter === "paid" && item.priceAmount === 0) return false;

      return true;
    });
  }, [listings, selectedCategory, searchQuery, verifiedOnly, priceFilter]);

  const handleChatClick = (listing: Listing, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    startConversationWithHost(listing.host, listing.id);
    router.push("/messages");
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Discovery Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white pt-14 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-indigo-200 mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Connecting Travelers & Hosts • 100% Verified Identities</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Meet Locals. Share Stays. <br />
            <span className="bg-gradient-to-r from-amber-300 via-pink-400 to-indigo-300 bg-clip-text text-transparent">
              Explore The World Together.
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Find free travel buddies for landmarks like the <strong>London Eye</strong>, book vetted private homestays in <strong>California</strong>, or join lively rooftop parties.
          </p>

          {/* Destination Search Bar */}
          <div className="mt-8 max-w-3xl mx-auto bg-white p-2.5 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 text-slate-800 border border-slate-200">
            <div className="flex items-center gap-3 flex-1 px-3 py-2 w-full">
              <MapPin className="w-5 h-5 text-indigo-600 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where are you heading? (e.g. California, London, Mumbai, Tokyo)"
                className="w-full text-sm font-medium focus:outline-hidden placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            <button 
              onClick={() => {}}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Feed</span>
            </button>
          </div>

          {/* Quick city tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Popular Destinations:</span>
            {["California", "London", "Mumbai", "Tokyo", "Paris", "Goa"].map((city) => (
              <button
                key={city}
                onClick={() => setSearchQuery(city)}
                className={`px-2.5 py-1 rounded-full border transition cursor-pointer ${
                  searchQuery.toLowerCase() === city.toLowerCase()
                    ? "bg-indigo-600 text-white border-indigo-500"
                    : "bg-white/5 hover:bg-white/10 border-white/15 text-slate-300"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Host Mode Indicator / Switcher Banner */}
        {activeRole === "host" ? (
          <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-pink-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  👑 You are in Host Mode
                </h3>
                <p className="text-xs text-slate-600">
                  Ready to host a traveler in your home, organize a party, or share a travel plan? 
                </p>
              </div>
            </div>
            <Link
              href="/host/create"
              className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Create Listing</span>
            </Link>
          </div>
        ) : null}

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SITE_CONFIG.categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-md scale-102"
                    : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                }`}
              >
                <span>{cat.label}</span>
                {cat.badge && (
                  <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-extrabold uppercase">
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filter Controls & Result Count */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Showing <strong>{filteredListings.length}</strong> verified experiences</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Verified Only Toggle */}
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
              />
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Hosts Only</span>
            </label>

            {/* Price Filter Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setPriceFilter("all")}
                className={`px-2.5 py-1 rounded-md transition ${priceFilter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"}`}
              >
                All
              </button>
              <button
                onClick={() => setPriceFilter("free")}
                className={`px-2.5 py-1 rounded-md transition ${priceFilter === "free" ? "bg-emerald-600 text-white shadow-2xs" : "text-slate-500"}`}
              >
                Free Only
              </button>
              <button
                onClick={() => setPriceFilter("paid")}
                className={`px-2.5 py-1 rounded-md transition ${priceFilter === "paid" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"}`}
              >
                Paid
              </button>
            </div>
          </div>
        </div>

        {/* Listings Feed Grid */}
        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600 mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No experiences found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search destination or filters to explore more stays and companion meetups.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setPriceFilter("all");
                setVerifiedOnly(false);
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => {
              const isFree = item.priceAmount === 0;
              const displayFee = isFree 
                ? "100% Free" 
                : `+ ${currencySymbol}${currency === "USD" ? SITE_CONFIG.fees.usd.bookingFlatFee.toFixed(2) : SITE_CONFIG.fees.inr.bookingFlatFee} platform fee`;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Card Image Header */}
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.photos[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <CategoryBadge category={item.category} />
                      {item.isPromoted && (
                        <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Price Tag pill */}
                    <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 shadow-md">
                      {isFree ? (
                        <span className="text-emerald-300 font-extrabold">100% Free</span>
                      ) : (
                        <span>
                          {currencySymbol}{item.priceAmount}
                          {item.category === "stay" && <span className="text-[10px] text-slate-300 font-normal"> / night</span>}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    
                    <div>
                      {/* Host Trust Header */}
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.host.avatar}
                            alt={item.host.name}
                            className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/20"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block leading-tight">
                              {item.host.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              ⭐ {item.host.rating} ({item.host.reviewCount} reviews)
                            </span>
                          </div>
                        </div>

                        <VerificationBadge tier={item.host.verificationTier} size="sm" showText={false} />
                      </div>

                      {/* Title */}
                      <Link href={`/listings/${item.id}`} className="block group-hover:text-indigo-600 transition">
                        <h3 className="text-base font-extrabold text-slate-900 leading-snug line-clamp-2">
                          {item.title}
                        </h3>
                      </Link>

                      {/* Location & Time */}
                      <div className="mt-2.5 space-y-1 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{item.locationName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.startDate} {item.time ? `• ${item.time}` : ""}</span>
                        </div>
                      </div>

                      {/* Description excerpt */}
                      <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Fee Transparency & Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-500">
                        <span className="block font-semibold text-slate-700">
                          {isFree ? "Free Meetup" : `${currencySymbol}${item.priceAmount}`}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-medium">
                          {displayFee}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleChatClick(item, e)}
                          title="Chat with host securely"
                          className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        <Link
                          href={`/listings/${item.id}`}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition flex items-center gap-1"
                        >
                          <span>{item.category === "stay" ? "Book Stay" : "Join Event"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Safety & Anti-Leakage Platform Notice Card */}
        <section className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Lock className="w-3.5 h-3.5" />
              <span>Platform Protection Guarantee</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Zero Fake Profiles. Protected Deposits & Escrow.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every host and traveler on RoamMeet undergoes multi-tier phone and identity verification. Direct contact info is only unlocked after a confirmed booking, keeping your payments safe and protecting hosts with damage deposit guarantees.
            </p>
          </div>

          <Link
            href="/profile/verification"
            className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold shadow-lg transition shrink-0 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verify Your Profile Now</span>
          </Link>
        </section>

      </div>
    </div>
  );
}
