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

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: "listing-california-stay",
    hostId: "user-david-cali",
    host: MOCK_USERS["user-david-cali"],
    category: "stay",
    title: "Chic Guest Studio near Venice Beach Pier",
    description: "Welcome to California! I am hosting fellow verified travelers in my private, sunlit studio with garden patio. Located 5 minutes walking distance from the Venice Beach Boardwalk and Abbot Kinney Blvd. Fast 500 Mbps Wi-Fi, dedicated desk, private entrance, and complimentary beach cruiser bikes.",
    destinationCity: "California",
    country: "USA",
    locationName: "Venice, California, USA",
    addressHint: "Within 500m of Venice Canals Walkway",
    exactAddress: "2441 Ocean Avenue, Venice, CA 90291 (Unlocked after booking)",
    startDate: "2026-09-20",
    endDate: "2026-10-15",
    pricingType: "fixed",
    priceAmount: 45,
    currency: "USD",
    platformFee: 1.00, // Flat $1 micro fee
    maxParticipants: 2,
    currentParticipants: 0,
    photos: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&auto=format&fit=crop&q=80"
    ],
    rules: [
      "Verified profiles only (Tier 2+ selfie/ID check required)",
      "Quiet hours after 10:30 PM",
      "No smoking indoors",
      "Keep communications and payments on RoamMeet"
    ],
    amenities: ["Fast Wi-Fi (500 Mbps)", "Private Kitchenette", "Bicycle Included", "Air Conditioning", "Dedicated Workspace"],
    status: "active",
    isPromoted: true
  },
  {
    id: "listing-london-eye-buddy",
    hostId: "user-sarah-london",
    host: MOCK_USERS["user-sarah-london"],
    category: "travel_buddy",
    title: "Visiting London Eye & South Bank River Walk at 4 PM Today!",
    description: "Hey everyone! I'm heading over to the London Eye this afternoon around 4:00 PM and plan to walk along the Queen's Walk towards Borough Market for street food. Looking for 1 or 2 friendly travel buddies to share the panoramic views, take great photos for each other, and explore together. Completely free meetup!",
    destinationCity: "London",
    country: "UK",
    locationName: "South Bank, London, UK",
    addressHint: "Meeting spot: Riverside Green by London Eye",
    exactAddress: "Riverside Building, County Hall, London SE1 7PB (Directions unlocked)",
    startDate: "Today",
    time: "4:00 PM GMT",
    pricingType: "free",
    priceAmount: 0,
    currency: "USD",
    platformFee: 0.00, // 100% Free for travel buddies!
    maxParticipants: 3,
    currentParticipants: 1,
    photos: [
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=1200&auto=format&fit=crop&q=80"
    ],
    rules: [
      "Be on time at the designated meeting point",
      "Solo travelers and couples welcome",
      "Tickets for the London Eye can be bought individually or split online"
    ],
    amenities: ["Sightseeing", "Photography Partner", "Local Tips", "Foodie Walk"],
    status: "active",
    isPromoted: true
  },
  {
    id: "listing-mumbai-rooftop-party",
    hostId: "user-arjun-mumbai",
    host: MOCK_USERS["user-arjun-mumbai"],
    category: "party",
    title: "Bandra Sunset Rooftop Mixer & Indie Beats",
    description: "Join our weekly rooftop sunset gathering overlooking the Arabian Sea in Bandra West! We have a curated playlist, ambient lighting, mocktails, signature drinks, and light finger food. A great place for visiting travelers, digital nomads, and locals to exchange stories.",
    destinationCity: "Mumbai",
    country: "India",
    locationName: "Bandra West, Mumbai, India",
    addressHint: "Near Carter Road Promenade",
    exactAddress: "Penthouse Rooftop, Pali Hill, Bandra West, Mumbai 400050",
    startDate: "This Saturday",
    time: "6:30 PM - 11:00 PM IST",
    pricingType: "fixed",
    priceAmount: 350,
    currency: "INR",
    platformFee: 79.00, // Flat ₹79 fee
    maxParticipants: 25,
    currentParticipants: 18,
    photos: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80"
    ],
    rules: [
      "Age 21+ only (Government ID checked upon arrival)",
      "Friendly and respectful vibe mandatory",
      "RSVP required on-platform for security entry list"
    ],
    amenities: ["Rooftop Sea View", "Curated Music", "Welcome Drink Included", "Snacks & Appetizers"],
    status: "active",
    isPromoted: false
  },
  {
    id: "listing-tokyo-food-walk",
    hostId: "user-kenji-tokyo",
    host: MOCK_USERS["user-kenji-tokyo"],
    category: "activity",
    title: "Hidden Alleyway Ramen & Omoide Yokocho Food Crawl",
    description: "Skip the tourist traps and join me as we explore the nostalgic backstreets of Shinjuku. We will sample artisan tonkotsu ramen from a 60-year-old shop, savor yakitori skewers, and learn about Japanese culinary etiquette. Small group of max 4 people for an intimate experience.",
    destinationCity: "Tokyo",
    country: "Japan",
    locationName: "Shinjuku, Tokyo, Japan",
    addressHint: "Meeting by Shinjuku Station East Exit",
    exactAddress: "1 Chome Shinjuku, Tokyo (Confirmed after booking)",
    startDate: "Tomorrow",
    time: "7:00 PM JST",
    pricingType: "fixed",
    priceAmount: 30,
    currency: "USD",
    platformFee: 1.00, // Flat $1 micro fee
    maxParticipants: 4,
    currentParticipants: 2,
    photos: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1554797589-7241bb691973?w=1200&auto=format&fit=crop&q=80"
    ],
    rules: [
      "Comfortable walking shoes recommended",
      "Please mention any dietary restrictions upon booking",
      "Bring cash for personal extra drinks"
    ],
    amenities: ["Bilingual Local Guide", "2 Food Tastings Included", "Custom Map of Secret Spots"],
    status: "active",
    isPromoted: false
  },
  {
    id: "listing-california-roadtrip",
    hostId: "user-david-cali",
    host: MOCK_USERS["user-david-cali"],
    category: "travel_buddy",
    title: "Highway 1 Pacific Coast Roadtrip to Big Sur",
    description: "Planning a drive up the Pacific Coast Highway from Santa Monica to Big Sur this weekend in my convertible. Looking for 1 or 2 travel buddies who love coastal views, indie folk roadtrip music, and photography stops. Gas and snacks will be split equally.",
    destinationCity: "California",
    country: "USA",
    locationName: "Santa Monica to Big Sur, California",
    addressHint: "Pick up near Santa Monica Pier",
    exactAddress: "Ocean Ave & Colorado Ave, Santa Monica, CA (Unlocked)",
    startDate: "This Sunday",
    time: "8:00 AM PST",
    pricingType: "free",
    priceAmount: 0,
    currency: "USD",
    platformFee: 0.00, // 100% Free
    maxParticipants: 2,
    currentParticipants: 1,
    photos: [
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=1200&auto=format&fit=crop&q=80"
    ],
    rules: [
      "Valid ID verified profile required",
      "Split fuel evenly at end of trip",
      "Good vibes only"
    ],
    amenities: ["Scenic Views", "Convertible Ride", "Curated Music", "Beach Stops"],
    status: "active",
    isPromoted: false
  }
];

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
