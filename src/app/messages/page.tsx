"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { VerificationBadge } from "@/components/ui/Badge";
import { inspectAndSanitizeMessage } from "@/lib/anti-bypass";
import { 
  Send, 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  CheckCheck, 
  ArrowRight,
  Search,
  MessageSquare
} from "lucide-react";

export default function MessagesPage() {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversationId, 
    messages, 
    sendMessage, 
    currentUser,
    openAuthModal 
  } = useApp();

  const [inputMsg, setInputMsg] = useState("");
  const [liveWarning, setLiveWarning] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const activeThread = activeConv ? (messages[activeConv.id] || []) : [];

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread.length, activeConversationId]);

  // Real-time typing check for off-platform contact leakage
  useEffect(() => {
    if (!inputMsg.trim()) {
      setLiveWarning(null);
      return;
    }
    const check = inspectAndSanitizeMessage(inputMsg);
    if (check.hasViolation) {
      setLiveWarning(`⚠️ Detected ${check.detectedTypes.join(", ")}. Direct off-platform contacts are automatically masked to safeguard your deposit and identity.`);
    } else {
      setLiveWarning(null);
    }
  }, [inputMsg]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openAuthModal("Sign in to send secure, protected messages.");
      return;
    }
    if (!inputMsg.trim() || !activeConv) return;

    const result = sendMessage(activeConv.id, inputMsg);
    setInputMsg("");

    if (result.wasMasked) {
      setActionNotice("🔒 Contact details were masked. Your conversation is protected under RoamMeet insurance.");
      setTimeout(() => setActionNotice(null), 5000);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-5 animate-in fade-in">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <MessageSquare className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Sign In to View Messages
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your conversations with hosts, booking inquiries, and meetup details will appear here once you log in.
          </p>
        </div>
        <button
          onClick={() => openAuthModal("Sign in to view your conversations and inquiries.")}
          className="w-full py-3 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
        >
          Sign In / Create Account
        </button>
        <div>
          <Link
            href="/"
            className="inline-block text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
          >
            ← Return to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Page Title & Contact Protection Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-2xl p-4 sm:p-5 text-white mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-indigo-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold flex items-center gap-2">
              <span>Anti-Bypass Contact Guardian Active</span>
              <span className="bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                Protected Escrow
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              For your personal safety and host damage guarantee, contact info is unlocked only after a confirmed booking.
            </p>
          </div>
        </div>

        <Link
          href="/profile/verification"
          className="text-xs font-bold text-indigo-200 hover:text-white underline shrink-0"
        >
          View Verification Badges →
        </Link>
      </div>

      {/* Split-Screen Chat Layout */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
        
        {/* Left Col: Conversations List (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
          
          <div className="p-4 border-b border-slate-200 bg-white">
            <h3 className="text-sm font-extrabold text-slate-900 mb-1">
              Conversations ({conversations.length})
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search messages or hosts..."
                className="w-full bg-slate-100 border border-transparent focus:border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map((c) => {
              const isSelected = c.id === activeConversationId;
              const last = c.lastMessage;

              return (
                <button
                  key={c.id}
                  onClick={() => setActiveConversationId(c.id)}
                  className={`w-full p-4 text-left transition flex items-start gap-3 cursor-pointer ${
                    isSelected ? "bg-indigo-50/80 border-l-4 border-indigo-600" : "hover:bg-white"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.otherUser.avatar}
                    alt={c.otherUser.name}
                    className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-indigo-500/20"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {c.otherUser.name}
                      </span>
                      {last && (
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {last.timestamp}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mb-1">
                      <VerificationBadge tier={c.otherUser.verificationTier} size="sm" showText={false} />
                      {c.listing && (
                        <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded-md truncate max-w-[130px]">
                          {c.listing.title}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 truncate">
                      {last ? (last.isMasked ? "🔒 [Contact Info Masked]" : last.text) : "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Right Col: Active Thread (8 cols) */}
        {activeConv ? (
          <div className="md:col-span-8 flex flex-col h-full bg-white">
            
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeConv.otherUser.avatar}
                  alt={activeConv.otherUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900">
                      {activeConv.otherUser.name}
                    </h3>
                    <VerificationBadge tier={activeConv.otherUser.verificationTier} size="sm" />
                  </div>
                  <span className="text-[11px] text-slate-500">
                    ⭐ {activeConv.otherUser.rating} ({activeConv.otherUser.reviewCount} reviews) • {activeConv.otherUser.city}
                  </span>
                </div>
              </div>

              {activeConv.listing && (
                <Link
                  href={`/listings/${activeConv.listing.id}`}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition"
                >
                  <span>View Listing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {/* Pinned Listing Card Snippet */}
            {activeConv.listing && (
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 truncate">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeConv.listing.photo}
                    alt=""
                    className="w-8 h-8 rounded-lg object-cover shrink-0"
                  />
                  <div className="truncate">
                    <span className="font-bold text-slate-800 block truncate leading-tight">
                      {activeConv.listing.title}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {activeConv.listing.destinationCity} • {activeConv.listing.category === "stay" ? "Homestay" : "Companion Meetup"}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/listings/${activeConv.listing.id}`}
                  className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 shrink-0 shadow-2xs"
                >
                  {activeConv.listing.category === "stay" ? "Book Stay" : "Join Meetup"}
                </Link>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/40">
              
              {/* Trust & Safe Messaging Prompt */}
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 max-w-lg mx-auto text-center space-y-1 shadow-2xs">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>RoamMeet Secure Communication Channel</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Phone numbers, emails, and external links are automatically masked until a booking pass is confirmed. This guarantees free cancellation refunds and host deposit protection.
                </p>
              </div>

              {/* Messages list */}
              {activeThread.map((msg) => {
                const isMe = currentUser ? msg.senderId === currentUser.id : false;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!isMe && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={msg.senderAvatar}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                      />
                    )}

                    <div className="max-w-[78%] sm:max-w-[65%] space-y-1">
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? "bg-indigo-600 text-white rounded-br-xs shadow-xs"
                            : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs"
                        } ${msg.isMasked ? "border-amber-300 bg-amber-50 text-amber-900" : ""}`}
                      >
                        {msg.isMasked ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 font-bold text-[11px] text-amber-800">
                              <Lock className="w-3 h-3 text-amber-700" />
                              <span>Protected Contact Filtered</span>
                            </span>
                            <p className="text-xs font-mono">{msg.text}</p>
                          </div>
                        ) : (
                          <p>{msg.text}</p>
                        )}
                      </div>

                      <div className={`flex items-center gap-1 text-[10px] text-slate-400 ${isMe ? "justify-end" : "justify-start"}`}>
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-indigo-500" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* Warning / Action Notification Banner */}
            {actionNotice && (
              <div className="bg-emerald-50 text-emerald-800 border-t border-emerald-200 px-4 py-2 text-xs font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{actionNotice}</span>
              </div>
            )}

            {liveWarning && (
              <div className="bg-amber-50 text-amber-900 border-t border-amber-200 px-4 py-2 text-xs font-semibold flex items-center gap-2 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{liveWarning}</span>
              </div>
            )}

            {/* Quick Test Chips for Verification */}
            <div className="bg-slate-100/70 px-4 py-1.5 border-t border-slate-200 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="font-bold text-slate-500">Quick Test Anti-Bypass:</span>
              <button
                type="button"
                onClick={() => setInputMsg("Call or WhatsApp me at +91 98765 43210 to book directly")}
                className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 cursor-pointer"
              >
                Test: Phone / WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setInputMsg("Follow my instagram @party_traveler and DM me there")}
                className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 cursor-pointer"
              >
                Test: Instagram Handle
              </button>
              <button
                type="button"
                onClick={() => setInputMsg("Send me UPI payment to rohit@okaxis to confirm")}
                className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 cursor-pointer"
              >
                Test: UPI / Payment link
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type your message... (phone numbers & social links are protected)"
                className="flex-1 border border-slate-300 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="p-2.5 sm:px-5 sm:py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>

          </div>
        ) : (
          <div className="md:col-span-8 flex items-center justify-center p-12 text-slate-400">
            Select a conversation to begin chatting.
          </div>
        )}

      </div>

    </div>
  );
}
