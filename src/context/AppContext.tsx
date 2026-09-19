"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  User, 
  Listing, 
  BookingRequest, 
  Conversation, 
  ChatMessage, 
  KYCSubmission, 
  FlaggedMessageRecord,
  Review,
  PayoutMethod,
  AppNotification
} from "@/types";
import { 
  CURRENT_USER, 
  INITIAL_LISTINGS, 
  INITIAL_KYC_QUEUE, 
  INITIAL_FLAGGED_MESSAGES 
} from "@/lib/mock-data";
import { inspectAndSanitizeMessage } from "@/lib/anti-bypass";
import { SITE_CONFIG } from "@/config/site";
import { 
  supabase, 
  signOutUser, 
  fetchProfileFromCloud,
  fetchCloudListings,
  saveListingToCloud,
  saveBookingToCloud,
  fetchCloudBookings,
  updateCloudBookingStatus,
  updateCloudListingStatus,
  updateProfileInCloud,
  saveReviewToCloud,
  fetchCloudReviews,
  saveMessageToCloud,
  subscribeToRealtimeMessages,
  saveNotificationToCloud,
  fetchCloudNotifications,
  markNotificationAsReadInCloud,
  markAllNotificationsAsReadInCloud,
  savePayoutMethodToCloud,
  fetchPayoutMethodsFromCloud,
  deletePayoutMethodFromCloud
} from "@/lib/supabase";
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
  updateUserProfile: (updates: Partial<User>) => void;
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "authorId" | "authorName" | "authorAvatar" | "authorTier" | "createdAt">) => Review;
  getListingReviews: (listingId: string) => Review[];
  getHostReviews: (hostId: string) => Review[];
  activeRole: "traveler" | "host";
  toggleRole: () => void;
  currency: "USD" | "INR";
  currencySymbol: string;
  setCurrency: (curr: "USD" | "INR") => void;
  listings: Listing[];
  addListing: (listing: Omit<Listing, "id" | "hostId" | "host" | "currentParticipants" | "status">) => Listing;
  toggleListingStatus: (listingId: string) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  messages: Record<string, ChatMessage[]>;
  sendMessage: (conversationId: string, text: string) => { wasMasked: boolean; warning?: string };
  startConversationWithHost: (host: User, listingId?: string) => string;
  bookingRequests: BookingRequest[];
  createBookingRequest: (listingId: string, message: string, dates: string) => BookingRequest;
  respondToBookingRequest: (requestId: string, status: "accepted" | "declined") => void;
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  addNotification: (notification: Omit<AppNotification, "id" | "createdAt">) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  payoutMethods: PayoutMethod[];
  addPayoutMethod: (method: Omit<PayoutMethod, "id" | "userId" | "createdAt">) => void;
  removePayoutMethod: (id: string) => void;
  setDefaultPayoutMethod: (id: string) => void;
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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [kycQueue, setKycQueue] = useState<KYCSubmission[]>(INITIAL_KYC_QUEUE);
  const [flaggedMessages, setFlaggedMessages] = useState<FlaggedMessageRecord[]>(INITIAL_FLAGGED_MESSAGES);

  // Sync notifications and payout methods when user logs in/changes
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setPayoutMethods([]);
      return;
    }
    fetchCloudNotifications(currentUser.id).then((cloudNotifs) => {
      if (cloudNotifs) setNotifications(cloudNotifs);
    });
    fetchPayoutMethodsFromCloud(currentUser.id).then((cloudMethods) => {
      if (cloudMethods) setPayoutMethods(cloudMethods);
    });
  }, [currentUser]);

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

  // 1. Fetch live listings, bookings, and reviews from Supabase cloud
  useEffect(() => {
    fetchCloudListings().then((cloudListings) => {
      setListings(cloudListings || []);
    });

    fetchCloudBookings().then((cloudBookings) => {
      if (cloudBookings && cloudBookings.length > 0) {
        setBookingRequests(cloudBookings);
      }
    });

    fetchCloudReviews().then((cloudReviews) => {
      if (cloudReviews && cloudReviews.length > 0) {
        setReviews(cloudReviews);
      }
    });
  }, []);

  // 2. Real-time chat WebSocket subscription across devices
  useEffect(() => {
    if (!activeConversationId) return;

    const unsubscribe = subscribeToRealtimeMessages(activeConversationId, (incomingMsg) => {
      setMessages(prev => {
        const currentList = prev[activeConversationId] || [];
        if (currentList.some(m => m.id === incomingMsg.id)) return prev;
        return {
          ...prev,
          [activeConversationId]: [...currentList, incomingMsg]
        };
      });
    });

    return () => {
      unsubscribe();
    };
  }, [activeConversationId]);

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

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    updateProfileInCloud(currentUser.id, updates);
  };

  const toggleRole = () => {
    setActiveRole(prev => (prev === "traveler" ? "host" : "traveler"));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const addNotification = (notifData: Omit<AppNotification, "id" | "createdAt">) => {
    const newNotif: AppNotification = {
      ...notifData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: "Just now"
    };
    setNotifications(prev => [newNotif, ...prev]);
    saveNotificationToCloud(newNotif);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    markNotificationAsReadInCloud(id);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (currentUser) {
      markAllNotificationsAsReadInCloud(currentUser.id);
    }
  };

  const addPayoutMethod = (data: Omit<PayoutMethod, "id" | "userId" | "createdAt">) => {
    if (!currentUser) return;
    const newMethod: PayoutMethod = {
      ...data,
      id: `payout-${Date.now()}`,
      userId: currentUser.id,
      isDefault: payoutMethods.length === 0 ? true : data.isDefault,
      createdAt: new Date().toISOString()
    };
    setPayoutMethods(prev => {
      if (newMethod.isDefault) {
        return [newMethod, ...prev.map(m => ({ ...m, isDefault: false }))];
      }
      return [...prev, newMethod];
    });
    savePayoutMethodToCloud(newMethod);
  };

  const removePayoutMethod = (id: string) => {
    setPayoutMethods(prev => prev.filter(m => m.id !== id));
    deletePayoutMethodFromCloud(id);
  };

  const setDefaultPayoutMethod = (id: string) => {
    setPayoutMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
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
    saveListingToCloud(newListing);
    setActiveRole("host");
    setCurrentUser(prev => prev ? { ...prev, isHost: true } : prev);
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

    // Broadcast and save to Supabase Cloud
    saveMessageToCloud(newMessage);

    if (receiverId && receiverId !== "unknown" && receiverId !== sender.id) {
      addNotification({
        userId: receiverId,
        type: "new_message",
        title: `Message from ${sender.name}`,
        message: check.sanitizedText.slice(0, 60) + (check.sanitizedText.length > 60 ? "..." : ""),
        link: "/messages",
        read: false
      });
    }

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
    saveBookingToCloud(newRequest);

    addNotification({
      userId: listing.hostId,
      type: "booking_request",
      title: "New Booking Request",
      message: `${user.name} requested to book "${listing.title}"`,
      link: "/host/dashboard",
      read: false
    });

    return newRequest;
  };

  const respondToBookingRequest = (requestId: string, status: "accepted" | "declined") => {
    const contactUnlocked = status === "accepted";
    const targetReq = bookingRequests.find(r => r.id === requestId);
    setBookingRequests(prev =>
      prev.map(r =>
        r.id === requestId
          ? { ...r, status, contactUnlocked }
          : r
      )
    );
    updateCloudBookingStatus(requestId, status, contactUnlocked);

    if (targetReq) {
      addNotification({
        userId: targetReq.applicantId,
        type: status === "accepted" ? "booking_accepted" : "booking_declined",
        title: status === "accepted" ? "Booking Confirmed! 🎉" : "Booking Declined",
        message: status === "accepted"
          ? `Your stay at "${targetReq.listingTitle}" is confirmed! Exact location is unlocked.`
          : `Host was unable to accept your request for "${targetReq.listingTitle}".`,
        link: "/trips",
        read: false
      });
    }
  };

  const toggleListingStatus = (listingId: string) => {
    setListings(prev =>
      prev.map(l => {
        if (l.id === listingId) {
          const newStatus = l.status === "active" ? "cancelled" : "active";
          updateCloudListingStatus(listingId, newStatus);
          return { ...l, status: newStatus };
        }
        return l;
      })
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

  const addReview = (data: Omit<Review, "id" | "authorId" | "authorName" | "authorAvatar" | "authorTier" | "createdAt">) => {
    const user = currentUser || CURRENT_USER;
    const newReview: Review = {
      ...data,
      id: `rev-${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorTier: user.verificationTier,
      createdAt: "Just now"
    };
    setReviews(prev => [newReview, ...prev]);
    saveReviewToCloud(newReview);

    addNotification({
      userId: data.hostId,
      type: "new_review",
      title: "New Review Received ⭐",
      message: `${user.name} left a ${data.rating}-star review for "${data.listingTitle || "your experience"}"!`,
      link: `/profile/${data.hostId}`,
      read: false
    });

    return newReview;
  };

  const getListingReviews = (listingId: string) => {
    return reviews.filter(r => r.listingId === listingId);
  };

  const getHostReviews = (hostId: string) => {
    return reviews.filter(r => r.hostId === hostId);
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
        updateUserProfile,
        reviews,
        addReview,
        getListingReviews,
        getHostReviews,
        activeRole,
        toggleRole,
        currency,
        currencySymbol,
        setCurrency,
        listings,
        addListing,
        toggleListingStatus,
        conversations,
        activeConversationId,
        setActiveConversationId,
        messages,
        sendMessage,
        startConversationWithHost,
        bookingRequests,
        createBookingRequest,
        respondToBookingRequest,
        notifications,
        unreadNotificationsCount,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        payoutMethods,
        addPayoutMethod,
        removePayoutMethod,
        setDefaultPayoutMethod,
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
