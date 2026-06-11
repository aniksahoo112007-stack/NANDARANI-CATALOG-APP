import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function SupabaseTest() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession()
      .then(() => setStatus('connected'))
      .catch((err: unknown) => {
        setStatus('error')
        setErrorMessage(err instanceof Error ? err.message : String(err))
      })
  }, [])

  if (status === 'checking') return <p>Checking connection...</p>
  if (status === 'connected') return <p>Supabase Connected</p>
  return <p>Error: {errorMessage}</p>
}
