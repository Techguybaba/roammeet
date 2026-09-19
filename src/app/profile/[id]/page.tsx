"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { MOCK_USERS } from "@/lib/mock-data";
import { fetchProfileFromCloud } from "@/lib/supabase";
import { User } from "@/types";
import { VerificationBadge, CategoryBadge } from "@/components/ui/Badge";
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Edit3, 
  ExternalLink, 
  Lock,
  ArrowLeft,
  X,
  Sparkles
} from "lucide-react";

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const { 
    currentUser, 
    listings, 
    startConversationWithHost, 
    updateUserProfile,
    currencySymbol,
    getHostReviews
  } = useApp();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editInstagram, setEditInstagram] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");

  useEffect(() => {
    // 1. Check if it is the current user
    if (currentUser && (currentUser.id === userId || userId === "me")) {
      setProfileUser(currentUser);
      setEditName(currentUser.name);
      setEditBio(currentUser.bio || "");
      setEditCity(currentUser.city || "");
      setEditCountry(currentUser.country || "");
      setEditPhone(currentUser.phone || "");
      setEditAvatar(currentUser.avatar || "");
      setEditInstagram(currentUser.socials?.instagram || "");
      setEditLinkedin(currentUser.socials?.linkedin || "");
      setLoading(false);
      return;
    }

    // 2. Check in mock users
    if (MOCK_USERS[userId]) {
      setProfileUser(MOCK_USERS[userId]);
      setLoading(false);
      return;
    }

    // 3. Check in listing hosts
    const listingWithHost = listings.find(l => l.hostId === userId || l.host.id === userId);
    if (listingWithHost) {
      setProfileUser(listingWithHost.host);
      setLoading(false);
      return;
    }

    // 4. Try fetching from Supabase cloud
    fetchProfileFromCloud(userId).then(cloudUser => {
      if (cloudUser) {
        setProfileUser(cloudUser);
      }
      setLoading(false);
    });
  }, [userId, currentUser, listings]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500 font-semibold">Loading profile...</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Member Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          The traveler or host profile you are searching for does not exist or may have been deactivated.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>
      </div>
    );
  }

  const isCurrentUser = Boolean(
    currentUser && (currentUser.id === profileUser.id || userId === "me")
  );

  // Hosted listings
  const hostedListings = listings.filter(l => 
    l.hostId === profileUser.id || 
    l.host.id === profileUser.id ||
    (profileUser.email && l.host.email && profileUser.email.toLowerCase() === l.host.email.toLowerCase())
  );

  // Dynamic host reviews & rating calculation
  const hostReviews = getHostReviews(profileUser.id);
  const liveRating = hostReviews.length > 0 
    ? (hostReviews.reduce((acc, r) => acc + r.rating, 0) / hostReviews.length).toFixed(1)
    : profileUser.rating;
  const liveReviewCount = hostReviews.length > 0 ? hostReviews.length : profileUser.reviewCount;

  const handleMessage = () => {
    startConversationWithHost(profileUser);
    router.push("/messages");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      bio: editBio,
      city: editCity,
      country: editCountry,
      phone: editPhone,
      avatar: editAvatar || profileUser.avatar,
      socials: {
        instagram: editInstagram,
        linkedin: editLinkedin
      }
    });
    setProfileUser(prev => prev ? ({
      ...prev,
      name: editName,
      bio: editBio,
      city: editCity,
      country: editCountry,
      phone: editPhone,
      avatar: editAvatar || prev.avatar,
      socials: {
        instagram: editInstagram,
        linkedin: editLinkedin
      }
    }) : null);
    setIsEditModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Breadcrumb Nav */}
      <div className="flex items-center justify-between">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discover</span>
        </Link>

        {isCurrentUser && (
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Edit My Profile</span>
          </button>
        )}
      </div>

      {/* Hero Profile Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Identity Card & Trust Badges (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main User Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs text-center space-y-4">
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profileUser.avatar}
                alt={profileUser.name}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-indigo-50 shadow-md mx-auto"
              />
              <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-white">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
                <span>{profileUser.name}</span>
              </h1>
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span>{profileUser.city}, {profileUser.country}</span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <VerificationBadge tier={profileUser.verificationTier} />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 text-left">
              <div className="bg-slate-50 p-3 rounded-xl">
                <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Rating</span>
                </div>
                <div className="font-extrabold text-sm text-slate-900 mt-0.5">
                  {liveRating} <span className="text-[10px] text-slate-400 font-normal">({liveReviewCount})</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl">
                <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Joined</span>
                </div>
                <div className="font-extrabold text-sm text-slate-900 mt-0.5 truncate">
                  {profileUser.joinedDate || "Member"}
                </div>
              </div>
            </div>

            {/* Social handles */}
            {profileUser.socials && (profileUser.socials.instagram || profileUser.socials.linkedin) && (
              <div className="flex items-center justify-center gap-3 pt-2 text-xs text-slate-600">
                {profileUser.socials.instagram && (
                  <span className="flex items-center gap-1 hover:text-pink-600 transition">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>{profileUser.socials.instagram}</span>
                  </span>
                )}
                {profileUser.socials.linkedin && (
                  <span className="flex items-center gap-1 hover:text-blue-600 transition">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </span>
                )}
              </div>
            )}

            {/* Action Button */}
            {!isCurrentUser ? (
              <button
                onClick={handleMessage}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message {profileUser.name.split(" ")[0]}</span>
              </button>
            ) : (
              <Link
                href="/profile/verification"
                className="block w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 transition text-center"
              >
                Manage KYC & Badges →
              </Link>
            )}
          </div>

          {/* Trust & Safety Checklist Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Identity Checklist</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Phone Verification</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Selfie Liveness Check</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Government ID (Aadhaar / Passport)</span>
                {profileUser.verificationTier >= 3 ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Gold Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Optional</span>
                  </span>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-500">
              RoamMeet verifies identity to prevent spam and ensure secure, scam-free stays across our community.
            </div>
          </div>

        </div>

        {/* Right Col: Bio, Hosted Stays, Reviews (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* About Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900">
              About {profileUser.name}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {profileUser.bio || "No bio added yet."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Languages</span>
                <span className="font-semibold text-slate-800">English, Hindi</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Response Time</span>
                <span className="font-semibold text-slate-800">Within an hour (100% response rate)</span>
              </div>
            </div>
          </div>

          {/* Hosted Listings Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Experiences & Stays by {profileUser.name.split(" ")[0]}
                </h3>
                <p className="text-xs text-slate-500">
                  Explore stays, companion meetups, and activities organized by this host.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {hostedListings.length} {hostedListings.length === 1 ? "Listing" : "Listings"}
              </span>
            </div>

            {hostedListings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                No active listings currently published by this user.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hostedListings.map(listing => (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    <div className="relative aspect-video bg-slate-100 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={listing.photos[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <CategoryBadge category={listing.category} />
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="text-[11px] text-slate-500 font-medium">
                        {listing.destinationCity}, {listing.country}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition">
                        {listing.title}
                      </h4>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="font-extrabold text-indigo-600">
                          {currencySymbol}{listing.priceAmount}
                          <span className="text-[10px] text-slate-400 font-normal">
                            {listing.category === "stay" ? " / night" : " / person"}
                          </span>
                        </span>
                        <span className="text-indigo-600 font-bold flex items-center gap-1 group-hover:underline">
                          <span>View Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Reviews & Community Testimonials */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="text-base font-extrabold text-slate-900">
                  {liveRating} • {liveReviewCount} Community Reviews
                </h3>
              </div>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Verified Guests</span>
              </span>
            </div>

            {hostReviews.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <Star className="w-8 h-8 text-slate-300 mx-auto" />
                <div className="text-xs font-bold text-slate-700">No reviews yet</div>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Reviews from verified guests and companions will appear here once stays or experiences are completed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {hostReviews.map(rev => (
                  <div key={rev.id} className="bg-slate-50/70 p-4 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={rev.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(rev.authorName)}`} 
                          alt={rev.authorName} 
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200" 
                        />
                        <div>
                          <div className="font-bold text-slate-900">{rev.authorName}</div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Edit Your Profile</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your public traveler identity, location, and social links.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Country</label>
                  <input
                    type="text"
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">About Me (Bio)</label>
                <textarea
                  rows={4}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell fellow travelers and hosts about yourself, travel style, and interests..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Instagram Handle</label>
                  <input
                    type="text"
                    value={editInstagram}
                    onChange={(e) => setEditInstagram(e.target.value)}
                    placeholder="@yourhandle"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={editLinkedin}
                    onChange={(e) => setEditLinkedin(e.target.value)}
                    placeholder="your-profile"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
