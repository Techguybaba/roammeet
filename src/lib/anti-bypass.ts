/**
 * Anti-Bypass & Disintermediation Security Engine
 * Safeguards platform revenue and user security by intercepting off-platform leakage attempts
 * (phone numbers, email addresses, social handles, external URLs, payment tags).
 */

export interface BypassCheckResult {
  hasViolation: boolean;
  detectedTypes: string[];
  sanitizedText: string;
  warningMessage?: string;
}

// Regex patterns for various contact channels
const PATTERNS = {
  // 1. Phone numbers: international prefixes, US/UK/India, spaced, dotted, dashed
  phone: /(?:\+?\d{1,4}[-.\s]?)?(?:\(?\d{2,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}(?:[-.\s]?\d{1,4})?/g,
  
  // Spaced digits trick: e.g. "9 8 7 6 5 4 3 2 1 0" or "call me 9.8.7.6..."
  spacedDigits: /(?:\b\d[\s.,-]){7,}\d\b/g,

  // Spelled-out numbers e.g. "zero one two three four five six"
  spelledOut: /\b(?:zero|one|two|three|four|five|six|seven|eight|nine)(?:\s+(?:zero|one|two|three|four|five|six|seven|eight|nine)){6,}\b/gi,

  // 2. Email addresses: standard + obfuscated
  email: /[a-zA-Z0-9._%+-]+(?:\s*@\s*|\s*\[at\]\s*|\s+at\s+)[a-zA-Z0-9.-]+(?:\s*\.\s*|\s*\[dot\]\s*|\s+dot\s+)[a-zA-Z]{2,}/gi,

  // 3. Social media handles and links
  whatsapp: /(?:wa\.me\/|whatsapp|whats\s*app|ping\s*me\s*on\s*wa)\b/gi,
  instagram: /(?:@\w{3,30}|instagram\.com\/\w+|insta\s*id|insta:?\s*@?\w+)/gi,
  telegram: /(?:t\.me\/\w+|telegram:?\s*@?\w+)/gi,
  snapchat: /(?:snapchat:?\s*@?\w+|snap\s*id:?\s*\w+)/gi,

  // 4. Payment tags (UPI, PayPal, Venmo, CashApp)
  upi: /[a-zA-Z0-9.\-_]{2,256}@(okhdfcbank|okaxis|oksbi|okicici|paytm|ybl|axl|apl|ibl|upi)/gi,
  paypal: /(?:paypal\.me\/\w+|paypal:?\s*\w+)/gi,
  cashapp: /\$[a-zA-Z0-9_]{1,20}/g,

  // 5. External URLs
  url: /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/gi,
};

const MASK_REPLACEMENT = "[🔒 Contact Protected — Stay on RoamMeet for booking guarantee & insurance]";

export function inspectAndSanitizeMessage(text: string): BypassCheckResult {
  const detectedTypes: string[] = [];
  let sanitized = text;

  // Check Phone Spaced Digits first
  if (PATTERNS.spacedDigits.test(text)) {
    detectedTypes.push("Spaced Phone Number");
    sanitized = sanitized.replace(PATTERNS.spacedDigits, MASK_REPLACEMENT);
  }

  // Check Spelled Out Numbers
  if (PATTERNS.spelledOut.test(text)) {
    detectedTypes.push("Spelled-out Number");
    sanitized = sanitized.replace(PATTERNS.spelledOut, MASK_REPLACEMENT);
  }

  // Check Standard Phone Numbers (filter out short strings like years 2026 or 4:00 PM)
  const phoneMatches = text.match(PATTERNS.phone);
  if (phoneMatches) {
    const validPhones = phoneMatches.filter(m => {
      const digitCount = (m.match(/\d/g) || []).length;
      return digitCount >= 8; // At least 8 digits to qualify as a real phone number
    });
    if (validPhones.length > 0) {
      detectedTypes.push("Phone Number");
      validPhones.forEach(phone => {
        sanitized = sanitized.replace(phone, MASK_REPLACEMENT);
      });
    }
  }

  // Check Email
  if (PATTERNS.email.test(text)) {
    detectedTypes.push("Email Address");
    sanitized = sanitized.replace(PATTERNS.email, MASK_REPLACEMENT);
  }

  // Check WhatsApp
  if (PATTERNS.whatsapp.test(text)) {
    detectedTypes.push("WhatsApp Mention");
    sanitized = sanitized.replace(PATTERNS.whatsapp, MASK_REPLACEMENT);
  }

  // Check Instagram
  if (PATTERNS.instagram.test(text)) {
    detectedTypes.push("Instagram Handle");
    sanitized = sanitized.replace(PATTERNS.instagram, MASK_REPLACEMENT);
  }

  // Check Telegram
  if (PATTERNS.telegram.test(text)) {
    detectedTypes.push("Telegram Handle");
    sanitized = sanitized.replace(PATTERNS.telegram, MASK_REPLACEMENT);
  }

  // Check UPI / Payment links
  if (PATTERNS.upi.test(text)) {
    detectedTypes.push("UPI Payment Handle");
    sanitized = sanitized.replace(PATTERNS.upi, MASK_REPLACEMENT);
  }

  if (PATTERNS.paypal.test(text)) {
    detectedTypes.push("PayPal Link");
    sanitized = sanitized.replace(PATTERNS.paypal, MASK_REPLACEMENT);
  }

  if (PATTERNS.cashapp.test(text)) {
    detectedTypes.push("CashApp Tag");
    sanitized = sanitized.replace(PATTERNS.cashapp, MASK_REPLACEMENT);
  }

  // Check generic external URLs
  if (PATTERNS.url.test(text)) {
    detectedTypes.push("External URL");
    sanitized = sanitized.replace(PATTERNS.url, MASK_REPLACEMENT);
  }

  const hasViolation = detectedTypes.length > 0;

  return {
    hasViolation,
    detectedTypes: Array.from(new Set(detectedTypes)),
    sanitizedText: sanitized,
    warningMessage: hasViolation
      ? `Warning: Direct contact details (${detectedTypes.join(", ")}) were masked. Bookings and communications must remain on RoamMeet to protect your payments, safety, and cancellation insurance.`
      : undefined
  };
}
