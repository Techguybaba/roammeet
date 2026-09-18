export const SITE_CONFIG = {
  name: "RoamMeet",
  tagline: "Meet Locals. Share Stays. Explore Together.",
  description: "A community travel platform connecting verified hosts of homestays, social parties, travel companion meetups, and local activities.",
  
  // Monetization & Fees (Agreed: Flat micro-fee initially)
  fees: {
    usd: {
      currency: "USD",
      symbol: "$",
      bookingFlatFee: 1.00, // $1 flat fee per booking initially
      travelBuddyFee: 0.00, // 100% Free for travel buddies initially
    },
    inr: {
      currency: "INR",
      symbol: "₹",
      bookingFlatFee: 79.00, // ₹79 flat fee per booking initially
      travelBuddyFee: 0.00, // 100% Free for travel buddies initially
    },
  },

  // Category Metadata
  categories: [
    {
      id: "all",
      label: "All Experiences",
      icon: "Sparkles",
      color: "from-blue-600 to-indigo-600",
      description: "Explore all verified stays, parties, travel buddies, and tours."
    },
    {
      id: "stay",
      label: "Homestays & Rooms",
      icon: "Home",
      color: "from-rose-500 to-pink-600",
      description: "Private rooms, couches, and entire homes hosted by vetted locals."
    },
    {
      id: "travel_buddy",
      label: "Travel Companions",
      icon: "Compass",
      color: "from-amber-500 to-orange-600",
      description: "Find a partner to visit attractions, split cabs, or explore landmarks together.",
      badge: "100% Free"
    },
    {
      id: "party",
      label: "Parties & Socials",
      icon: "PartyPopper",
      color: "from-purple-600 to-indigo-600",
      description: "Rooftop mixers, beach bonfires, club nights, and cultural dinner gatherings."
    },
    {
      id: "activity",
      label: "Local Tours & Guides",
      icon: "MapPin",
      color: "from-emerald-500 to-teal-600",
      description: "Guided hikes, street food crawls, photography walks, and hidden gems."
    }
  ],

  // Popular Destinations for quick search
  popularCities: [
    "California, USA",
    "London, UK",
    "Mumbai, India",
    "Tokyo, Japan",
    "Paris, France",
    "Bali, Indonesia",
    "Goa, India",
    "New York, USA"
  ]
};
