import { createClient } from "@supabase/supabase-js";
import { User as AppUser } from "@/types";

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
