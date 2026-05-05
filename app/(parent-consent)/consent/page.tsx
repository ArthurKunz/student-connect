'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function Consent() {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token  = params.get('token')
    const action = params.get('action')
    handleConsent(token, action)
  }, [])

  async function handleConsent(token: string | null, action: string | null) {
    const { data: request, error } = await supabase
      .from('consent_requests')
      .select('*')
      .eq('token', token)
      .eq('status', 'pending')
      .single()

    if (error || !request) { setStatus('invalid'); return }

    await supabase
      .from('consent_requests')
      .update({ status: action === 'approve' ? 'approved' : 'rejected' })
      .eq('token', token)

    setStatus(action === 'approve' ? 'approved' : 'rejected')
  }

  if (status === 'loading')  return <p>Wird verarbeitet…</p>
  if (status === 'approved') return <p>Du hast der Anmeldung zugestimmt. Dein Kind kann sich jetzt anmelden.</p>
  if (status === 'rejected') return <p>Du hast die Anmeldung abgelehnt. Es wurde kein Konto erstellt.</p>
  if (status === 'invalid')  return <p>Dieser Link ist ungültig oder wurde bereits verwendet.</p>
  return <p>Etwas ist schiefgelaufen.</p>
}