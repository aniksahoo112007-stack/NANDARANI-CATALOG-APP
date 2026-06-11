// NANDARANI Catalog — business constants & helpers
// Live shop data comes from the Supabase `shops` table (see ShopsContext).
// Constants below are FALLBACKS ONLY, used when live data is unavailable.

export const WHATSAPP_NUMBER = '916296240320'
export const PHONE_DISPLAY = '+91 62962 40320'
export const PHONE_TEL = '+916296240320'

// Fallback Google Maps direction link
export const MAPS_DIRECTION_URL = 'https://maps.app.goo.gl/E2CthiuKTchSgqUP9'

// Fallback shop names (used if shops table is unavailable)
export const SHOP_MAP: Record<string, string> = {
  '305907f4-275f-4f3f-ac40-2265ef0368fd': 'NANDARANI BASTRALAY',
  'd798444a-ce8a-42f2-ab37-b72800a2b95f': 'NEW NANDARANI BASTRALAY',
}

export const SHOPS = Object.entries(SHOP_MAP).map(([id, name]) => ({ id, name }))

/** Digits-only WhatsApp number; falls back to the default business number. */
export function cleanWhatsappNumber(raw?: string | null): string {
  const digits = (raw ?? '').replace(/\D/g, '')
  return digits.length >= 10 ? digits : WHATSAPP_NUMBER
}

/** wa.me chat link. Uses the given shop number when provided, fallback otherwise. */
export function whatsappChatLink(text?: string, number?: string | null): string {
  const base = `https://wa.me/${cleanWhatsappNumber(number)}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

/** Display form of a phone/WhatsApp number, e.g. tel: link target. */
export function telLink(raw?: string | null): string {
  return `tel:+${cleanWhatsappNumber(raw)}`
}

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
