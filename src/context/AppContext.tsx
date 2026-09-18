"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  User, 
  Listing, 
  BookingRequest, 
  Conversation, 
  ChatMessage, 
  KYCSubmission, 
  FlaggedMessageRecord 
} from "@/types";
import { 
  CURRENT_USER, 
  INITIAL_LISTINGS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_KYC_QUEUE, 
  INITIAL_FLAGGED_MESSAGES 
} from "@/lib/mock-data";
import { inspectAndSanitizeMessage } from "@/lib/anti-bypass";
import { SITE_CONFIG } from "@/config/site";
import { supabase, signOutUser, fetchProfileFromCloud } from "@/lib/supabase";
import { AuthModal } from "@/components/auth/AuthModal";

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalReason?: string;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  setRealUser: (user: User | null) => void;
  loginAsDemoUser: () => void;
  logout: () => Promise<void>;
  activeRole: "traveler" | "host";
  toggleRole: () => void;
  currency: "USD" | "INR";
  currencySymbol: string;
  setCurrency: (curr: "USD" | "INR") => void;
  listings: Listing[];
  addListing: (listing: Omit<Listing, "id" | "hostId" | "host" | "currentParticipants" | "status">) => Listing;
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  messages: Record<string, ChatMessage[]>;
  sendMessage: (conversationId: string, text: string) => { wasMasked: boolean; warning?: string };
  startConversationWithHost: (host: User, listingId?: string) => string;
  bookingRequests: BookingRequest[];
  createBookingRequest: (listingId: string, message: string, dates: string) => BookingRequest;
  respondToBookingRequest: (requestId: string, status: "accepted" | "declined") => void;
  kycQueue: KYCSubmission[];
  submitKYC: (data: { documentType: "passport" | "aadhaar" | "driving_license" | "national_id"; documentNumber: string; country: string; idPhotoUrl: string; selfieUrl: string }) => void;
  approveKYC: (id: string) => void;
  rejectKYC: (id: string, reason: string) => void;
  flaggedMessages: FlaggedMessageRecord[];
  platformRevenue: {
    totalBookingsCount: number;
    totalPlatformFees: number;
    totalGrossVolume: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<string | undefined>(undefined);

  const [activeRole, setActiveRole] = useState<"traveler" | "host">("traveler");
  const [currency, setCurrencyState] = useState<"USD" | "INR">("USD");
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>("conv-sarah-london-eye");
  
  // Seed initial messages
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    "conv-sarah-london-eye": [
      {
        id: "m-1",
        conversationId: "conv-sarah-london-eye",
        senderId: "user-rohit-01",
        senderName: "Rohit Sharma",
        senderAvatar: CURRENT_USER.avatar,
        receiverId: "user-sarah-london",
        text: "Hi Sarah! I'm in London today and would love to join your London Eye walk at 4 PM.",
        isMasked: false,
        detectedTypes: [],
        timestamp: "25 mins ago"
      },
      {
        id: "m-2",
        conversationId: "conv-sarah-london-eye",
        senderId: "user-sarah-london",
        senderName: "Sarah Jenkins",
        senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
        receiverId: "user-rohit-01",
        text: "Awesome! I'll be waiting by the Riverside Green garden near the London Eye at 4:00 PM. Looking forward to meeting you!",
        isMasked: false,
        detectedTypes: [],
        timestamp: "10 mins ago"
      }
    ],
    "conv-david-california-stay": [
      {
        id: "m-3",
        conversationId: "conv-david-california-stay",
        senderId: "user-rohit-01",
        senderName: "Rohit Sharma",
        senderAvatar: CURRENT_USER.avatar,
        receiverId: "user-david-cali",
        text: "Hey David, your Venice Beach studio looks stunning! Does it have a good desk for remote work?",
        isMasked: false,
        detectedTypes: [],
        timestamp: "2 hours ago"
      },
      {
        id: "m-4",
        conversationId: "conv-david-california-stay",
        senderId: "user-david-cali",
        senderName: "David Miller",
        senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
        receiverId: "user-rohit-01",
        text: "Hello Rohit! Yes, the Venice studio has an ergonomic desk and 500 Mbps Wi-Fi. Feel free to send the booking request via the platform so I can lock it in for you.",
        isMasked: false,
        detectedTypes: [],
        timestamp: "1 hour ago"
      }
    ]
  });

  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([
    {
      id: "book-01",
      listingId: "listing-california-stay",
      listingTitle: "Chic Guest Studio near Venice Beach Pier",
      category: "stay",
      applicantId: CURRENT_USER.id,
      applicant: CURRENT_USER,
      hostId: "user-david-cali",
      status: "pending",
      dates: "Sep 22 - Sep 25, 2026 (3 nights)",
      totalAmount: 135,
      platformFee: 1.00,
      message: "Looking forward to working remotely from Venice Beach!",
      createdAt: "1 hour ago",
      contactUnlocked: false
    }
  ]);

  const [kycQueue, setKycQueue] = useState<KYCSubmission[]>(INITIAL_KYC_QUEUE);
  const [flaggedMessages, setFlaggedMessages] = useState<FlaggedMessageRecord[]>(INITIAL_FLAGGED_MESSAGES);

  // Supabase Auth Session Sync
  useEffect(() => {
    if (!supabase) return;

    // Check existing cloud session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const cloudProfile = await fetchProfileFromCloud(session.user.id);
        if (cloudProfile) {
          setCurrentUser(cloudProfile);
        } else {
          setCurrentUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Traveler",
            email: session.user.email || "",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(session.user.email || "user")}`,
            bio: "New member on RoamMeet.",
            city: "Global Citizen",
            country: "Worldwide",
            isHost: false,
            verificationTier: 1,
            verificationBadge: "Email Verified",
            phoneVerified: false,
            selfieVerified: false,
            idVerified: false,
            rating: 5.0,
            reviewCount: 0,
            joinedDate: "Today"
          });
        }
      }
    });

    // Listen for real-time auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const cloudProfile = await fetchProfileFromCloud(session.user.id);
        if (cloudProfile) {
          setCurrentUser(cloudProfile);
        } else {
          setCurrentUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Traveler",
            email: session.user.email || "",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(session.user.email || "user")}`,
            bio: "New member on RoamMeet.",
            city: "Global Citizen",
            country: "Worldwide",
            isHost: false,
            verificationTier: 1,
            verificationBadge: "Email Verified",
            phoneVerified: false,
            selfieVerified: false,
            idVerified: false,
            rating: 5.0,
            reviewCount: 0,
            joinedDate: "Today"
          });
        }
      } else if (event === "SIGNED_OUT") {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const openAuthModal = (reason?: string) => {
    setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const setRealUser = (user: User | null) => {
    setCurrentUser(user);
  };

  const loginAsDemoUser = () => {
    setCurrentUser(CURRENT_USER);
  };

  const logout = async () => {
    if (supabase) {
      await signOutUser();
    }
    setCurrentUser(null);
  };

  const toggleRole = () => {
    setActiveRole(prev => (prev === "traveler" ? "host" : "traveler"));
  };

  const setCurrency = (curr: "USD" | "INR") => {
    setCurrencyState(curr);
  };

  const currencySymbol = currency === "USD" ? "$" : "₹";

  const addListing = (data: Omit<Listing, "id" | "hostId" | "host" | "currentParticipants" | "status">) => {
    const hostUser = currentUser || CURRENT_USER;
    const newListing: Listing = {
      ...data,
      id: `listing-${Date.now()}`,
      hostId: hostUser.id,
      host: hostUser,
      currentParticipants: 0,
      status: "active",
      platformFee: data.category === "travel_buddy" ? 0 : (currency === "USD" ? 1.00 : 79.00)
    };
    setListings(prev => [newListing, ...prev]);
    return newListing;
  };

  const sendMessage = (conversationId: string, text: string) => {
    const sender = currentUser || CURRENT_USER;
    const check = inspectAndSanitizeMessage(text);
    const activeConv = conversations.find(c => c.id === conversationId);
    const receiverId = activeConv?.otherUser.id || "unknown";

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: sender.id,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      receiverId,
      text: check.sanitizedText,
      isMasked: check.hasViolation,
      detectedTypes: check.detectedTypes,
      timestamp: "Just now"
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));

    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId ? { ...c, lastMessage: newMessage } : c
      )
    );

    if (check.hasViolation) {
      const newFlag: FlaggedMessageRecord = {
        id: `flag-${Date.now()}`,
        senderName: sender.name,
        receiverName: activeConv?.otherUser.name || "Host",
        detectedType: check.detectedTypes.join(", "),
        maskedSnippet: text.slice(0, 100) + "...",
        timestamp: "Just now",
        status: "blocked"
      };
      setFlaggedMessages(prev => [newFlag, ...prev]);
    }

    return {
      wasMasked: check.hasViolation,
      warning: check.warningMessage
    };
  };

  const startConversationWithHost = (host: User, listingId?: string) => {
    const existing = conversations.find(c => c.otherUser.id === host.id);
    if (existing) {
      setActiveConversationId(existing.id);
      return existing.id;
    }

    const listing = listings.find(l => l.id === listingId);

    const newConv: Conversation = {
      id: `conv-${host.id}-${Date.now()}`,
      otherUser: host,
      unreadCount: 0,
      listing: listing ? {
        id: listing.id,
        title: listing.title,
        category: listing.category,
        photo: listing.photos[0],
        destinationCity: listing.destinationCity
      } : undefined
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    return newConv.id;
  };

  const createBookingRequest = (listingId: string, message: string, dates: string) => {
    const user = currentUser || CURRENT_USER;
    const listing = listings.find(l => l.id === listingId);
    if (!listing) throw new Error("Listing not found");

    const flatFee = listing.category === "travel_buddy" 
      ? 0 
      : (currency === "USD" ? SITE_CONFIG.fees.usd.bookingFlatFee : SITE_CONFIG.fees.inr.bookingFlatFee);

    const newRequest: BookingRequest = {
      id: `book-${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      category: listing.category,
      applicantId: user.id,
      applicant: user,
      hostId: listing.hostId,
      status: "pending",
      dates,
      totalAmount: listing.priceAmount,
      platformFee: flatFee,
      message,
      createdAt: "Just now",
      contactUnlocked: false
    };

    setBookingRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  const respondToBookingRequest = (requestId: string, status: "accepted" | "declined") => {
    setBookingRequests(prev =>
      prev.map(r =>
        r.id === requestId
          ? { ...r, status, contactUnlocked: status === "accepted" }
          : r
      )
    );
  };

  const submitKYC = (data: { documentType: "passport" | "aadhaar" | "driving_license" | "national_id"; documentNumber: string; country: string; idPhotoUrl: string; selfieUrl: string }) => {
    const user = currentUser || CURRENT_USER;
    const newKyc: KYCSubmission = {
      id: `kyc-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      country: data.country,
      idPhotoUrl: data.idPhotoUrl,
      selfieUrl: data.selfieUrl,
      status: "pending",
      submittedAt: "Just now"
    };

    setKycQueue(prev => [newKyc, ...prev]);
  };

  const approveKYC = (id: string) => {
    setKycQueue(prev =>
      prev.map(k => (k.id === id ? { ...k, status: "approved" as const } : k))
    );

    const targetKyc = kycQueue.find(k => k.id === id);
    if (targetKyc && currentUser && targetKyc.userId === currentUser.id) {
      setCurrentUser(prev => prev ? ({
        ...prev,
        verificationTier: 3,
        idVerified: true,
        verificationBadge: "Gold Verified Shield (Gov ID)"
      }) : null);
    }
  };

  const rejectKYC = (id: string, reason: string) => {
    setKycQueue(prev =>
      prev.map(k =>
        k.id === id
          ? { ...k, status: "rejected" as const, rejectionReason: reason }
          : k
      )
    );
  };

  // Platform Revenue Stats Calculation
  const totalBookingsCount = bookingRequests.filter(b => b.status === "accepted" || b.status === "pending").length;
  const totalPlatformFees = bookingRequests.reduce((acc, b) => acc + (b.platformFee || 0), 0) + 14.00;
  const totalGrossVolume = bookingRequests.reduce((acc, b) => acc + (b.totalAmount || 0), 0) + 480.00;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isAuthModalOpen,
        authModalReason,
        openAuthModal,
        closeAuthModal,
        setRealUser,
        loginAsDemoUser,
        logout,
        activeRole,
        toggleRole,
        currency,
        currencySymbol,
        setCurrency,
        listings,
        addListing,
        conversations,
        activeConversationId,
        setActiveConversationId,
        messages,
        sendMessage,
        startConversationWithHost,
        bookingRequests,
        createBookingRequest,
        respondToBookingRequest,
        kycQueue,
        submitKYC,
        approveKYC,
        rejectKYC,
        flaggedMessages,
        platformRevenue: {
          totalBookingsCount,
          totalPlatformFees,
          totalGrossVolume
        }
      }}
    >
      {children}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        contextMessage={authModalReason}
      />
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
