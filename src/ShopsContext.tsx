// Live shop business settings from the Supabase `shops` table.
// Saved by POS Settings; read-only here (anon key, RLS applies).
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from './lib/supabase'

// Columns verified against the live shops table schema:
// id, name, phone, whatsapp, address, google_maps_url,
// shop_photo_url, catalog_url, business_hours, show_in_catalog
// (whatsapp_number, shop_address and code do NOT exist)
export interface Shop {
  id: string
  name: string
  phone?: string | null
  whatsapp?: string | null
  address?: string | null
  google_maps_url?: string | null
  shop_photo_url?: string | null
  catalog_url?: string | null
  business_hours?: unknown
  show_in_catalog?: boolean | null
}

/** Best WhatsApp-capable number for a shop: whatsapp first, then phone. */
export function shopWaNumber(shop?: Shop | null): string | null {
  return shop?.whatsapp || shop?.phone || null
}

export interface ShopsState {
  shops: Shop[]
  status: 'loading' | 'done' | 'error'
  error: string | null
}

const initialState: ShopsState = { shops: [], status: 'loading', error: null }

const ShopsContext = createContext<ShopsState>(initialState)

export function ShopsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ShopsState>(initialState)

  useEffect(() => {
    supabase
      .from('shops')
      .select(
        'id, name, phone, whatsapp, address, google_maps_url, shop_photo_url, catalog_url, business_hours, show_in_catalog',
      )
      .then(({ data, error }) => {
        if (error) {
          console.log('Fetched shops error:', error.message)
          setState({ shops: [], status: 'error', error: error.message })
        } else {
          // Visible unless explicitly false (true/null/undefined => visible)
          const shops = ((data as Shop[]) || []).filter(s => s.show_in_catalog !== false)
          // Temporary dev log
          console.log('Fetched shops:', shops)
          setState({ shops, status: 'done', error: null })
        }
      })
  }, [])

  return <ShopsContext.Provider value={state}>{children}</ShopsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useShops(): ShopsState {
  return useContext(ShopsContext)
}
