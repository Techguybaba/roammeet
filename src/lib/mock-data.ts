import { User, Listing, Conversation, KYCSubmission, FlaggedMessageRecord } from "@/types";

export const CURRENT_USER: User = {
  id: "user-rohit-01",
  name: "Rohit Sharma",
  email: "rohit.traveler@example.com",
  phone: "+91 98765 00000",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  bio: "Solo traveler, photographer & tech enthusiast. Love discovering authentic local spots, sharing stays, and finding travel partners for iconic landmarks.",
  city: "Mumbai",
  country: "India",
  isHost: true,
  verificationTier: 2, // Tier 2: Phone + Selfie verified
  verificationBadge: "Selfie Verified",
  phoneVerified: true,
  selfieVerified: true,
  idVerified: false,
  rating: 4.9,
  reviewCount: 14,
  joinedDate: "January 2025",
  socials: {
    instagram: "@rohit_travels",
    linkedin: "rohit-sharma-profile"
  }
};

export const MOCK_USERS: Record<string, User> = {
  "user-david-cali": {
    id: "user-david-cali",
    name: "David Miller",
    email: "david.m@calihomes.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    bio: "Passionate architect & local host in Venice Beach, California. Happy to host genuine global wanderers in my private guest suite!",
    city: "Venice, California",
    country: "USA",
    isHost: true,
    verificationTier: 3,
    verificationBadge: "Gold Verified Host (Gov ID)",
    phoneVerified: true,
    selfieVerified: true,
    idVerified: true,
    rating: 4.96,
    reviewCount: 42,
    joinedDate: "March 2024"
  },
  "user-sarah-london": {
    id: "user-sarah-london",
    name: "Sarah Jenkins",
    email: "sarah.j@wanderer.uk",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    bio: "London local & history buff. Going to the London Eye and South Bank today. Looking for 1-2 positive travel buddies to explore with!",
    city: "London",
    country: "UK",
    isHost: true,
    verificationTier: 3,
    verificationBadge: "Gold Verified Traveler (Gov ID)",
    phoneVerified: true,
    selfieVerified: true,
    idVerified: true,
    rating: 5.0,
    reviewCount: 19,
    joinedDate: "June 2024"
  },
  "user-arjun-mumbai": {
    id: "user-arjun-mumbai",
    name: "Aarav Kapoor",
    email: "aarav.mumbai@events.in",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    bio: "Community builder & music DJ in Mumbai. Hosting weekly rooftop mixers for travelers & creative locals.",
    city: "Mumbai",
    country: "India",
    isHost: true,
    verificationTier: 3,
    verificationBadge: "Gold Verified Host (Gov ID)",
    phoneVerified: true,
    selfieVerified: true,
    idVerified: true,
    rating: 4.88,
    reviewCount: 56,
    joinedDate: "February 2024"
  },
  "user-kenji-tokyo": {
    id: "user-kenji-tokyo",
    name: "Kenji Sato",
    email: "kenji.guide@tokyo.jp",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80",
    bio: "Food photographer & certified local guide. Guiding travelers through Tokyo's hidden izakayas and ramen spots.",
    city: "Tokyo",
    country: "Japan",
    isHost: true,
    verificationTier: 4,
    verificationBadge: "SuperHost & Verified Guide",
    phoneVerified: true,
    selfieVerified: true,
    idVerified: true,
    rating: 4.98,
    reviewCount: 88,
    joinedDate: "November 2023"
  }
};

export const INITIAL_LISTINGS: Listing[] = [];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-sarah-london-eye",
    otherUser: MOCK_USERS["user-sarah-london"],
    unreadCount: 1,
    lastMessage: {
      id: "msg-01",
      conversationId: "conv-sarah-london-eye",
      senderId: "user-sarah-london",
      senderName: "Sarah Jenkins",
      senderAvatar: MOCK_USERS["user-sarah-london"].avatar,
      receiverId: CURRENT_USER.id,
      text: "Awesome! I'll be waiting by the Riverside Green garden near the London Eye at 4:00 PM. Looking forward to meeting you!",
      isMasked: false,
      detectedTypes: [],
      timestamp: "10 mins ago",
      listingId: "listing-london-eye-buddy"
    },
    listing: {
      id: "listing-london-eye-buddy",
      title: "Visiting London Eye & South Bank River Walk at 4 PM Today!",
      category: "travel_buddy",
      photo: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80",
      destinationCity: "London"
    }
  },
  {
    id: "conv-david-california-stay",
    otherUser: MOCK_USERS["user-david-cali"],
    unreadCount: 0,
    lastMessage: {
      id: "msg-02",
      conversationId: "conv-david-california-stay",
      senderId: "user-david-cali",
      senderName: "David Miller",
      senderAvatar: MOCK_USERS["user-david-cali"].avatar,
      receiverId: CURRENT_USER.id,
      text: "Hello Rohit! Yes, the Venice studio is available for those dates. Feel free to send the booking request via the platform so I can lock it in for you.",
      isMasked: false,
      detectedTypes: [],
      timestamp: "1 hour ago",
      listingId: "listing-california-stay"
    },
    listing: {
      id: "listing-california-stay",
      title: "Chic Guest Studio near Venice Beach Pier",
      category: "stay",
      photo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
      destinationCity: "California"
    }
  }
];

export const INITIAL_KYC_QUEUE: KYCSubmission[] = [
  {
    id: "kyc-sub-01",
    userId: "user-maya-goa",
    userName: "Maya Patel",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    documentType: "aadhaar",
    documentNumber: "XXXX-XXXX-4821",
    country: "India",
    idPhotoUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
    selfieUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
    status: "pending",
    submittedAt: "2 hours ago"
  },
  {
    id: "kyc-sub-02",
    userId: "user-lucas-paris",
    userName: "Lucas Dupont",
    userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    documentType: "passport",
    documentNumber: "FR9938210",
    country: "France",
    idPhotoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
    selfieUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    status: "pending",
    submittedAt: "5 hours ago"
  }
];

export const INITIAL_FLAGGED_MESSAGES: FlaggedMessageRecord[] = [
  {
    id: "flag-01",
    senderName: "Unknown Account #391",
    receiverName: "David Miller",
    detectedType: "Phone Number + WhatsApp Link",
    maskedSnippet: "Hey can you ping me directly on wa.me/91987... so we can avoid the site fees?",
    timestamp: "Yesterday at 9:14 PM",
    status: "blocked"
  },
  {
    id: "flag-02",
    senderName: "Traveler1029",
    receiverName: "Sarah Jenkins",
    detectedType: "Instagram Handle",
    maskedSnippet: "Follow my insta @party_guy_london and DM me there instead",
    timestamp: "Today at 11:20 AM",
    status: "blocked"
  }
];
