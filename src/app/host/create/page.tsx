"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { SITE_CONFIG } from "@/config/site";
import { ListingCategory } from "@/types";
import { 
  Home, 
  Compass, 
  PartyPopper, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  ArrowLeft,
  Sparkles
} from "lucide-react";

export default function CreateListingPage() {
  const router = useRouter();
  const { addListing, currentUser, openAuthModal, currency, currencySymbol } = useApp();

  // Form State
  const [category, setCategory] = useState<ListingCategory>("stay");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [destinationCity, setDestinationCity] = useState("California");
  const [country] = useState("USA");
  const [locationName, setLocationName] = useState("");
  const [addressHint, setAddressHint] = useState("");
  const [exactAddress, setExactAddress] = useState("");
  const [startDate, setStartDate] = useState("2026-09-25");
  const [time, setTime] = useState("");
  const [priceAmount, setPriceAmount] = useState<number>(40);
  const [maxParticipants, setMaxParticipants] = useState<number>(2);
  const [photoUrl, setPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&auto=format&fit=crop&q=80"
  );
  const [amenitiesInput, setAmenitiesInput] = useState("Fast Wi-Fi, Dedicated Desk, Private Entry");
  const [rulesInput, setRulesInput] = useState("Verified profiles only, Respect neighbors, Keep booking on platform");

  const isTravelBuddy = category === "travel_buddy";
  const effectivePrice = isTravelBuddy ? 0 : priceAmount;

  // Platform fee preview
  const platformFee = isTravelBuddy 
    ? 0 
    : (currency === "USD" ? SITE_CONFIG.fees.usd.bookingFlatFee : SITE_CONFIG.fees.inr.bookingFlatFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      openAuthModal("Sign in or create a Host account to publish your experience.");
      return;
    }

    const amenities = amenitiesInput.split(",").map(s => s.trim()).filter(Boolean);
    const rules = rulesInput.split(",").map(s => s.trim()).filter(Boolean);

    const created = addListing({
      category,
      title: title || (isTravelBuddy ? `Exploring ${locationName || destinationCity} Today!` : `Cozy Stay in ${destinationCity}`),
      description: description || "Join me for an authentic, verified local experience!",
      destinationCity,
      country,
      locationName: locationName || `${destinationCity}, ${country}`,
      addressHint: addressHint || `Near ${destinationCity} center`,
      exactAddress: exactAddress || `123 Main Street, ${destinationCity} (Locked until booking)`,
      startDate,
      time: time || undefined,
      pricingType: isTravelBuddy ? "free" : "fixed",
      priceAmount: effectivePrice,
      currency,
      platformFee,
      maxParticipants,
      photos: [photoUrl],
      amenities: amenities.length ? amenities : ["Verified Host", "Wi-Fi"],
      rules: rules.length ? rules : ["Keep all communications on RoamMeet"],
      isPromoted: true
    });

    router.push(`/listings/${created.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Host Protection Active</span>
        </div>
      </div>

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Publish a New Experience
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Host a traveler in your home, organize a party, or find a buddy to explore landmarks like the London Eye.
        </p>
      </div>

      {/* Wizard Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* Step 1: Category Selection */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
            Step 1: Choose Listing Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <button
              type="button"
              onClick={() => { setCategory("stay"); setPriceAmount(45); }}
              className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3.5 cursor-pointer ${
                category === "stay" ? "border-rose-500 bg-rose-50/40 shadow-xs" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-slate-900 block">🏨 Homestay & Rooms</span>
                <span className="text-xs text-slate-500">Host travelers visiting your city in a spare room or house (e.g. California).</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setCategory("travel_buddy"); setPriceAmount(0); }}
              className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3.5 cursor-pointer relative overflow-hidden ${
                category === "travel_buddy" ? "border-amber-500 bg-amber-50/40 shadow-xs" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                100% Free
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-slate-900 block">✈️ Travel Companion</span>
                <span className="text-xs text-slate-500">Find someone to explore sights (e.g. London Eye at 4 PM) or split cabs.</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setCategory("party"); setPriceAmount(250); }}
              className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3.5 cursor-pointer ${
                category === "party" ? "border-purple-500 bg-purple-50/40 shadow-xs" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <PartyPopper className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-slate-900 block">🎉 Social Party & Mixer</span>
                <span className="text-xs text-slate-500">Host rooftop mixers, dinners, bonfires, or nightlife gatherings.</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setCategory("activity"); setPriceAmount(30); }}
              className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3.5 cursor-pointer ${
                category === "activity" ? "border-emerald-500 bg-emerald-50/40 shadow-xs" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-slate-900 block">🗺️ Local Guided Tour</span>
                <span className="text-xs text-slate-500">Guide a walking tour, hiking adventure, food tasting, or photo crawl.</span>
              </div>
            </button>

          </div>
        </div>

        {/* Step 2: Location & Destination */}
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
            Step 2: Destination & Location
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Destination City / Region:</label>
              <select
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
              >
                <option value="California">California, USA</option>
                <option value="London">London, UK</option>
                <option value="Mumbai">Mumbai, India</option>
                <option value="Tokyo">Tokyo, Japan</option>
                <option value="Paris">Paris, France</option>
                <option value="Bali">Bali, Indonesia</option>
                <option value="Goa">Goa, India</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Landmark or Neighborhood:</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Venice Beach / South Bank London Eye / Bandra West"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Public Location Hint (Visible to all):
              </label>
              <input
                type="text"
                value={addressHint}
                onChange={(e) => setAddressHint(e.target.value)}
                placeholder="e.g. Within 500m of London Eye entrance"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Exact Street Address (Locked until confirmed booking):
              </label>
              <input
                type="text"
                value={exactAddress}
                onChange={(e) => setExactAddress(e.target.value)}
                placeholder="e.g. Apt 4B, 108 Ocean View Drive, CA 90291"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Step 3: Title, Description & Dates */}
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
            Step 3: Experience Details
          </label>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Listing Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isTravelBuddy ? "e.g. Exploring the London Eye at 4 PM Today!" : "e.g. Bright Coastal Studio near Venice Beach"}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Description:</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell travelers what you are offering, how to find you, and what makes this experience special..."
              className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Date / Start Date:</label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="e.g. Today / This Saturday / Sep 25"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Time (Optional):</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 4:00 PM GMT / 7:00 PM"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Max Guests / Buddies:</label>
              <input
                type="number"
                min={1}
                max={50}
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Step 4: Pricing & Transparent Platform Fee Preview */}
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
            Step 4: Pricing & Transparent Fee Structure
          </label>

          {isTravelBuddy ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-800 space-y-1">
                <span className="font-bold block text-sm">Travel Buddy Free Tier Active</span>
                <p>
                  Travel companion invitations (e.g. exploring the London Eye together) are 100% free for both you and participants to build viral community connections!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Your Price ({currencySymbol}):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={priceAmount}
                    onChange={(e) => setPriceAmount(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-xl pl-8 pr-3 py-2.5 text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs space-y-1.5">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Host Payout (100%):</span>
                  <span>{currencySymbol}{priceAmount}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Guest Security Fee:</span>
                  <span className="font-semibold text-emerald-600">
                    +{currencySymbol}{platformFee.toFixed(2)} (Flat Micro-fee)
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                  Protects your home & event with RoamMeet damage insurance and verified identity screening.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Step 5: Photo & Extra Guidelines */}
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
            Step 5: Photos & House Rules
          </label>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Cover Photo URL:</label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500"
              required
            />
            {photoUrl && (
              <div className="mt-2 h-28 w-44 rounded-xl overflow-hidden border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Amenities / Highlights (comma separated):
            </label>
            <input
              type="text"
              value={amenitiesInput}
              onChange={(e) => setAmenitiesInput(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Guidelines / Rules (comma separated):
            </label>
            <input
              type="text"
              value={rulesInput}
              onChange={(e) => setRulesInput(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Publish Action */}
        <div className="pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Anti-bypass contact protection will be active on your listing.</span>
          </div>

          <button
            type="submit"
            className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer"
          >
            Publish Listing Live
          </button>
        </div>

      </form>

    </div>
  );
}
