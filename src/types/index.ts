export type VerificationTier = 0 | 1 | 2 | 3 | 4;

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  bio: string;
  city: string;
  country: string;
  isHost: boolean;
  verificationTier: VerificationTier; // 0: None, 1: Phone, 2: Selfie, 3: Gov ID, 4: SuperHost
  verificationBadge: string;
  phoneVerified: boolean;
  selfieVerified: boolean;
  idVerified: boolean;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  socials?: {
    instagram?: string;
    linkedin?: string;
  };
}

export type ListingCategory = "stay" | "travel_buddy" | "party" | "activity";

export interface Listing {
  id: string;
  hostId: string;
  host: User;
  category: ListingCategory;
  title: string;
  description: string;
  destinationCity: string;
  country: string;
  locationName: string;
  addressHint: string; // Public view: "Near Venice Beach Pier"
  exactAddress: string; // Locked until confirmed booking
  startDate: string;
  endDate?: string;
  time?: string;
  pricingType: "free" | "fixed" | "split";
  priceAmount: number;
  currency: string;
  platformFee: number;
  maxParticipants: number;
  currentParticipants: number;
  photos: string[];
  rules: string[];
  amenities: string[];
  status: "active" | "filled" | "completed" | "cancelled";
  isPromoted?: boolean;
}

export interface BookingRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  category: ListingCategory;
  applicantId: string;
  applicant: User;
  hostId: string;
  status: "pending" | "accepted" | "declined" | "completed";
  dates: string;
  totalAmount: number;
  platformFee: number;
  message: string;
  createdAt: string;
  contactUnlocked: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  text: string;
  isMasked: boolean;
  detectedTypes: string[];
  timestamp: string;
  listingId?: string;
}

export interface Conversation {
  id: string;
  otherUser: User;
  lastMessage?: ChatMessage;
  unreadCount: number;
  listing?: {
    id: string;
    title: string;
    category: ListingCategory;
    photo: string;
    destinationCity: string;
  };
}

export interface KYCSubmission {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  documentType: "passport" | "aadhaar" | "driving_license" | "national_id";
  documentNumber: string;
  country: string;
  idPhotoUrl: string;
  selfieUrl: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  rejectionReason?: string;
}

export interface FlaggedMessageRecord {
  id: string;
  senderName: string;
  receiverName: string;
  detectedType: string;
  maskedSnippet: string;
  timestamp: string;
  status: "blocked" | "reviewed";
}
