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

export interface Review {
  id: string;
  listingId: string;
  listingTitle?: string;
  hostId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorTier: VerificationTier;
  rating: number;
  cleanliness?: number;
  accuracy?: number;
  communication?: number;
  value?: number;
  comment: string;
  createdAt: string;
}

export interface PayoutMethod {
  id: string;
  userId: string;
  type: "upi" | "bank" | "paypal";
  isDefault: boolean;
  upiId?: string;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  paypalEmail?: string;
  createdAt: string;
}

export interface HostEarningsSummary {
  totalGrossVolume: number;
  platformFeesDeducted: number;
  netEarnings: number;
  availableBalance: number;
  pendingPayouts: number;
  completedPayouts: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: "booking_request" | "booking_accepted" | "booking_declined" | "new_review" | "new_message" | "payout_processed";
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
}
