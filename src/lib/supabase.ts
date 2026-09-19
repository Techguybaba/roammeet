import { createClient } from "@supabase/supabase-js";
import { User as AppUser, Listing, BookingRequest, ChatMessage, Review, VerificationTier } from "@/types";
import { MOCK_USERS, CURRENT_USER } from "@/lib/mock-data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== "https://your-project.supabase.co"
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

/**
 * Sign up a new user with Email and Password, and auto-provision their Cloud Profile
 */
export async function signUpWithEmail(email: string, password: string, name: string) {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      }
    }
  });

  if (error) throw error;

  if (data.user) {
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || email)}`;
    
    // Auto-create cloud profile in Supabase profiles table
    await supabase.from("profiles").upsert({
      id: data.user.id,
      name: name || email.split("@")[0],
      email: data.user.email,
      avatar_url: avatar,
      bio: "New member on RoamMeet. Ready to explore stays and meetups!",
      city: "Global Traveler",
      country: "Worldwide",
      is_host: false,
      verification_tier: 1,
      verification_badge: "Email Verified",
      phone_verified: false,
      selfie_verified: false,
      id_verified: false,
      rating: 5.0,
      review_count: 0
    });
  }

  return data;
}

/**
 * Sign in existing user with Email and Password
 */
export async function signInWithEmail(email: string, password: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

/**
 * Sign in with Google 1-Tap OAuth
 */
export async function signInWithGoogle() {
  if (!supabase) throw new Error("Supabase is not configured.");
  const redirectTo = typeof window !== "undefined" ? window.location.origin : undefined;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo
    }
  });
  if (error) throw error;
  return data;
}

/**
 * Log out the current user
 */
export async function signOutUser() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

/**
 * Fetch profile for a given user ID from Supabase
 */
export async function fetchProfileFromCloud(userId: string): Promise<AppUser | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    email: data.email || "",
    phone: data.phone || "",
    avatar: data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
    bio: data.bio || "",
    city: data.city || "Mumbai",
    country: data.country || "India",
    isHost: Boolean(data.is_host),
    verificationTier: data.verification_tier ?? 1,
    verificationBadge: data.verification_badge || "Email Verified",
    phoneVerified: Boolean(data.phone_verified),
    selfieVerified: Boolean(data.selfie_verified),
    idVerified: Boolean(data.id_verified),
    rating: Number(data.rating) || 5.0,
    reviewCount: data.review_count || 0,
    joinedDate: new Date(data.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", year: "numeric" })
  };
}

/**
 * Update user profile in Supabase Cloud
 */
export async function updateProfileInCloud(userId: string, updates: Partial<AppUser>) {
  if (!supabase) return;
  try {
    const payload: Record<string, unknown> = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.bio !== undefined) payload.bio = updates.bio;
    if (updates.city !== undefined) payload.city = updates.city;
    if (updates.country !== undefined) payload.country = updates.country;
    if (updates.phone !== undefined) payload.phone = updates.phone;
    if (updates.avatar !== undefined) payload.avatar_url = updates.avatar;
    if (updates.isHost !== undefined) payload.is_host = updates.isHost;

    await supabase.from("profiles").update(payload).eq("id", userId);
  } catch (err) {
    console.error("Failed to update profile in cloud:", err);
  }
}

interface DbListingItem {
  id: string;
  host_id: string;
  category: "stay" | "travel_buddy" | "party" | "activity";
  title: string;
  description: string;
  destination_city: string;
  country: string;
  location_name: string;
  address_hint: string;
  exact_address: string;
  start_date: string;
  end_date?: string | null;
  time?: string | null;
  pricing_type: "free" | "fixed" | "split";
  price_amount: number;
  currency: string;
  platform_fee: number;
  max_participants: number;
  current_participants: number;
  photos?: string[];
  amenities?: string[];
  rules?: string[];
  status?: "active" | "filled" | "completed" | "cancelled";
  is_promoted?: boolean;
  profiles?: {
    id: string;
    name: string;
    email?: string;
    avatar_url?: string;
    bio?: string;
    city?: string;
    country?: string;
    is_host?: boolean;
    verification_tier?: 0 | 1 | 2 | 3 | 4;
    verification_badge?: string;
    phone_verified?: boolean;
    selfie_verified?: boolean;
    id_verified?: boolean;
    rating?: number;
    review_count?: number;
  };
}

/**
 * Fetch all active listings from Supabase with host profiles
 */
export async function fetchCloudListings(): Promise<Listing[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("listings")
      .select("*, profiles(*)")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return null;

    const DUMMY_LISTING_IDS = new Set([
      "listing-california-stay",
      "listing-london-eye-buddy",
      "listing-mumbai-rooftop-party",
      "listing-tokyo-food-crawl",
      "listing-1789735511818"
    ]);

    const items = (data as unknown as DbListingItem[]).filter(item => 
      !DUMMY_LISTING_IDS.has(item.id) &&
      !item.id.startsWith("listing-california-") &&
      !item.id.startsWith("listing-london-") &&
      !item.id.startsWith("listing-mumbai-") &&
      !item.id.startsWith("listing-tokyo-")
    );

    if (items.length === 0) return [];

    return items.map((item) => {
      const hostData = item.profiles;
      const hostUser: AppUser = hostData ? {
        id: hostData.id,
        name: hostData.name,
        email: hostData.email || "",
        avatar: hostData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(hostData.name)}`,
        bio: hostData.bio || "Host on RoamMeet",
        city: hostData.city || item.destination_city,
        country: hostData.country || item.country,
        isHost: true,
        verificationTier: hostData.verification_tier ?? 2,
        verificationBadge: hostData.verification_badge || "Verified Host",
        phoneVerified: Boolean(hostData.phone_verified),
        selfieVerified: Boolean(hostData.selfie_verified),
        idVerified: Boolean(hostData.id_verified),
        rating: Number(hostData.rating) || 5.0,
        reviewCount: hostData.review_count || 10,
        joinedDate: "Member"
      } : (MOCK_USERS[item.host_id] || CURRENT_USER);

      return {
        id: item.id,
        hostId: item.host_id,
        host: hostUser,
        category: item.category,
        title: item.title,
        description: item.description,
        destinationCity: item.destination_city,
        country: item.country,
        locationName: item.location_name,
        addressHint: item.address_hint,
        exactAddress: item.exact_address,
        startDate: item.start_date,
        endDate: item.end_date || undefined,
        time: item.time || undefined,
        pricingType: item.pricing_type,
        priceAmount: Number(item.price_amount) || 0,
        currency: item.currency || "USD",
        platformFee: Number(item.platform_fee) || 0,
        maxParticipants: item.max_participants || 2,
        currentParticipants: item.current_participants || 0,
        photos: Array.isArray(item.photos) && item.photos.length > 0 ? item.photos : ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80"],
        amenities: Array.isArray(item.amenities) ? item.amenities : [],
        rules: Array.isArray(item.rules) ? item.rules : [],
        status: item.status || "active",
        isPromoted: Boolean(item.is_promoted)
      };
    });
  } catch (err) {
    console.error("Failed to fetch cloud listings:", err);
    return null;
  }
}

/**
 * Save new listing to Supabase Cloud
 */
export async function saveListingToCloud(listing: Listing) {
  if (!supabase) return;
  try {
    await supabase.from("listings").insert({
      id: listing.id,
      host_id: listing.hostId,
      category: listing.category,
      title: listing.title,
      description: listing.description,
      destination_city: listing.destinationCity,
      country: listing.country,
      location_name: listing.locationName,
      address_hint: listing.addressHint,
      exact_address: listing.exactAddress,
      start_date: listing.startDate,
      end_date: listing.endDate || null,
      time: listing.time || null,
      pricing_type: listing.pricingType,
      price_amount: listing.priceAmount,
      currency: listing.currency,
      platform_fee: listing.platformFee,
      max_participants: listing.maxParticipants,
      current_participants: listing.currentParticipants,
      photos: listing.photos,
      amenities: listing.amenities,
      rules: listing.rules,
      status: listing.status,
      is_promoted: listing.isPromoted
    });
  } catch (err) {
    console.error("Failed to save listing to cloud:", err);
  }
}

/**
 * Save booking to Supabase Cloud
 */
export async function saveBookingToCloud(booking: BookingRequest) {
  if (!supabase) return;
  try {
    await supabase.from("bookings").insert({
      id: booking.id,
      listing_id: booking.listingId,
      listing_title: booking.listingTitle,
      category: booking.category,
      applicant_id: booking.applicantId,
      host_id: booking.hostId,
      status: booking.status,
      dates: booking.dates,
      total_amount: booking.totalAmount,
      platform_fee: booking.platformFee,
      message: booking.message,
      contact_unlocked: booking.contactUnlocked
    });
  } catch (err) {
    console.error("Failed to save booking to cloud:", err);
  }
}

interface DbBookingItem {
  id: string;
  listing_id: string;
  listing_title: string;
  category: "stay" | "travel_buddy" | "party" | "activity";
  applicant_id: string;
  host_id: string;
  status: "pending" | "accepted" | "declined" | "completed";
  dates: string;
  total_amount: number;
  platform_fee: number;
  message: string;
  contact_unlocked: boolean;
  created_at?: string;
  profiles?: {
    id: string;
    name: string;
    email?: string;
    avatar_url?: string;
    bio?: string;
    city?: string;
    country?: string;
    is_host?: boolean;
    verification_tier?: 0 | 1 | 2 | 3 | 4;
    verification_badge?: string;
  };
}

/**
 * Fetch all bookings from Supabase Cloud
 */
export async function fetchCloudBookings(): Promise<BookingRequest[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, profiles(*)")
      .order("created_at", { ascending: false });

    if (error || !data) return null;

    const items = data as unknown as DbBookingItem[];
    return items.map((item) => {
      const applicantData = item.profiles;
      const applicantUser: AppUser = applicantData ? {
        id: applicantData.id,
        name: applicantData.name,
        email: applicantData.email || "",
        avatar: applicantData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(applicantData.name)}`,
        bio: applicantData.bio || "Traveler on RoamMeet",
        city: applicantData.city || "Mumbai",
        country: applicantData.country || "India",
        isHost: Boolean(applicantData.is_host),
        verificationTier: applicantData.verification_tier ?? 1,
        verificationBadge: applicantData.verification_badge || "Email Verified",
        phoneVerified: false,
        selfieVerified: false,
        idVerified: false,
        rating: 5.0,
        reviewCount: 0,
        joinedDate: "Member"
      } : (MOCK_USERS[item.applicant_id] || CURRENT_USER);

      return {
        id: item.id,
        listingId: item.listing_id,
        listingTitle: item.listing_title,
        category: item.category,
        applicantId: item.applicant_id,
        applicant: applicantUser,
        hostId: item.host_id,
        status: item.status,
        dates: item.dates,
        totalAmount: Number(item.total_amount) || 0,
        platformFee: Number(item.platform_fee) || 0,
        message: item.message,
        createdAt: item.created_at ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently",
        contactUnlocked: Boolean(item.contact_unlocked)
      };
    });
  } catch (err) {
    console.error("Failed to fetch cloud bookings:", err);
    return null;
  }
}

/**
 * Update booking status in Supabase Cloud
 */
export async function updateCloudBookingStatus(
  bookingId: string, 
  status: "accepted" | "declined" | "completed", 
  contactUnlocked: boolean
) {
  if (!supabase) return;
  try {
    await supabase.from("bookings").update({
      status,
      contact_unlocked: contactUnlocked
    }).eq("id", bookingId);
  } catch (err) {
    console.error("Failed to update booking status in cloud:", err);
  }
}

/**
 * Update listing status in Supabase Cloud
 */
export async function updateCloudListingStatus(
  listingId: string, 
  status: "active" | "filled" | "completed" | "cancelled"
) {
  if (!supabase) return;
  try {
    await supabase.from("listings").update({
      status
    }).eq("id", listingId);
  } catch (err) {
    console.error("Failed to update listing status in cloud:", err);
  }
}

/**
 * Save review to Supabase Cloud
 */
export async function saveReviewToCloud(review: Review) {
  if (!supabase) return;
  try {
    await supabase.from("reviews").insert({
      id: review.id,
      listing_id: review.listingId,
      listing_title: review.listingTitle,
      host_id: review.hostId,
      author_id: review.authorId,
      author_name: review.authorName,
      author_avatar: review.authorAvatar,
      author_tier: review.authorTier,
      rating: review.rating,
      cleanliness: review.cleanliness,
      accuracy: review.accuracy,
      communication: review.communication,
      value: review.value,
      comment: review.comment
    });
  } catch (err) {
    console.error("Failed to save review to cloud:", err);
  }
}

interface DbReviewItem {
  id: string;
  listing_id: string;
  listing_title?: string;
  host_id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  author_tier?: number;
  rating: number;
  cleanliness?: number;
  accuracy?: number;
  communication?: number;
  value?: number;
  comment: string;
  created_at?: string;
}

/**
 * Fetch reviews from Supabase Cloud
 */
export async function fetchCloudReviews(): Promise<Review[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return null;

    const items = data as unknown as DbReviewItem[];
    return items.map((item) => ({
      id: item.id,
      listingId: item.listing_id,
      listingTitle: item.listing_title,
      hostId: item.host_id,
      authorId: item.author_id,
      authorName: item.author_name,
      authorAvatar: item.author_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.author_name)}`,
      authorTier: ((item.author_tier ?? 1) as VerificationTier),
      rating: Number(item.rating) || 5,
      cleanliness: item.cleanliness ? Number(item.cleanliness) : undefined,
      accuracy: item.accuracy ? Number(item.accuracy) : undefined,
      communication: item.communication ? Number(item.communication) : undefined,
      value: item.value ? Number(item.value) : undefined,
      comment: item.comment,
      createdAt: item.created_at ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recently"
    }));
  } catch (err) {
    console.error("Failed to fetch cloud reviews:", err);
    return null;
  }
}

/**
 * Save chat message to Supabase Cloud
 */
export async function saveMessageToCloud(message: ChatMessage) {
  if (!supabase) return;
  try {
    await supabase.from("messages").insert({
      id: message.id,
      conversation_id: message.conversationId,
      sender_id: message.senderId,
      sender_name: message.senderName,
      sender_avatar: message.senderAvatar,
      receiver_id: message.receiverId,
      text: message.text,
      is_masked: message.isMasked,
      detected_types: message.detectedTypes
    });
  } catch (err) {
    console.error("Failed to save message to cloud:", err);
  }
}

/**
 * Subscribe to real-time incoming messages via Supabase Realtime WebSocket
 */
interface DbMessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  receiver_id: string;
  text: string;
  is_masked?: boolean;
  detected_types?: string[];
}

export function subscribeToRealtimeMessages(
  conversationId: string, 
  onNewMessage: (msg: ChatMessage) => void
) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel(`chat-${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => {
        const row = payload.new as unknown as DbMessageRow;
        if (row) {
          onNewMessage({
            id: row.id,
            conversationId: row.conversation_id,
            senderId: row.sender_id,
            senderName: row.sender_name,
            senderAvatar: row.sender_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(row.sender_name)}`,
            receiverId: row.receiver_id,
            text: row.text,
            isMasked: Boolean(row.is_masked),
            detectedTypes: Array.isArray(row.detected_types) ? row.detected_types : [],
            timestamp: "Just now"
          });
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
