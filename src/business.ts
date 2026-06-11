// NANDARANI Catalog — business constants & phone helpers
// Live shop data comes from the Supabase `shops` table (see ShopsContext).
// Constants below are FALLBACKS ONLY, used when live data is unavailable.

/** Fallback WhatsApp number (clean digits), used only when no shop number exists. */
export const WHATSAPP_NUMBER = '916296240320'

// Fallback shop names (used if shops table is unavailable)
export const SHOP_MAP: Record<string, string> = {
  '305907f4-275f-4f3f-ac40-2265ef0368fd': 'NANDARANI BASTRALAY',
  'd798444a-ce8a-42f2-ab37-b72800a2b95f': 'NEW NANDARANI BASTRALAY',
}

export const SHOPS = Object.entries(SHOP_MAP).map(([id, name]) => ({ id, name }))

/* ---------------- Phone helpers (single source of truth) ---------------- */

/**
 * Normalize any phone input to clean WhatsApp-ready digits (Indian numbers).
 * - Strips +, spaces, dashes, brackets, and any non-digits
 * - Strips leading zeros
 * - 10 digits        -> prefixed with country code 91
 * - 12 digits w/ 91  -> used as-is
 * - anything else    -> '' (invalid/missing)
 */
export function normalizePhone(raw?: string | null): string {
  let digits = (raw ?? '').replace(/\D/g, '')
  digits = digits.replace(/^0+/, '')
  if (digits.length === 10) return `91${digits}`
  if (digits.length === 12 && digits.startsWith('91')) return digits
  return ''
}

/** Customer-friendly display: 916296240320 -> "+91 62962 40320". '' if invalid. */
export function formatPhoneDisplay(raw?: string | null): string {
  const d = normalizePhone(raw)
  if (!d) return ''
  return `+91 ${d.slice(2, 7)} ${d.slice(7)}`
}

/** Call link: tel:+916296240320. '' if invalid/missing. */
export function telLink(raw?: string | null): string {
  const d = normalizePhone(raw)
  return d ? `tel:+${d}` : ''
}

/**
 * wa.me chat link with clean digits only (no +, spaces, or dashes).
 * Falls back to the default business number ONLY when no valid number is given —
 * shop-specific UI should check normalizePhone() first and disable instead.
 */
export function whatsappChatLink(text?: string, number?: string | null): string {
  const digits = normalizePhone(number) || WHATSAPP_NUMBER
  const base = `https://wa.me/${digits}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

/* ---------------- Business hours ---------------- */

/**
 * business_hours may arrive as plain text, JSON array, or JSON object.
 * Normalize to display lines. Returns [] when nothing usable is present.
 */
export function formatBusinessHours(value: unknown): string[] {
  if (value === null || value === undefined || value === '') return []
  if (typeof value === 'string') {
    return value
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean)
  }
  if (Array.isArray(value)) {
    return value
      .map(v => {
        if (typeof v === 'string') return v
        if (v && typeof v === 'object') {
          const o = v as Record<string, unknown>
          if ('days' in o && 'hours' in o) return `${String(o.days)}: ${String(o.hours)}`
          return Object.entries(o)
            .map(([k, val]) => `${k}: ${String(val)}`)
            .join(', ')
        }
        return String(v)
      })
      .filter(Boolean)
  }
  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).map(
      ([k, v]) => `${k}: ${String(v)}`,
    )
  }
  return [String(value)]
}
