'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function ParentConsent() {
  const [parentEmail, setParentEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [consentStatus, setConsentStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [studentEmail, setStudentEmail] = useState('')
  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!sent) return

    pollingRef.current = setInterval(async () => {
      const { data } = await supabase
        .from('consent_requests')
        .select('status')
        .eq('student_email', studentEmail)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (data?.status === 'approved') {
        clearInterval(pollingRef.current!)
        setConsentStatus('approved')
      } else if (data?.status === 'rejected') {
        clearInterval(pollingRef.current!)
        setConsentStatus('rejected')
      }
    }, 4000)

    return () => clearInterval(pollingRef.current!)
  }, [sent, studentEmail])

  async function handleSubmit() {
    setLoading(true)
    const student = JSON.parse(localStorage.getItem('pendingStudent') ?? '{}')
    setStudentEmail(student.email)

    const { data, error } = await supabase
      .from('consent_requests')
      .insert({
        student_name:  student.name,
        student_email: student.email,
        parent_email:  parentEmail,
        status:        'pending'
      })
      .select()
      .single()

    if (error) { alert('Error: ' + error.message); setLoading(false); return }

    await supabase.functions.invoke('send-consent-email', {
      body: { parentEmail, studentName: student.name, token: data.token }
    })

    setLoading(false)
    setSent(true)
  }

  async function handleRejected() {
    // Delete the already-created account
    const { error } = await supabase.functions.invoke('delete-user')
    if (error) { alert('Error deleting account'); return }
    localStorage.removeItem('pendingStudent')
    router.push('/')
  }

  if (sent) {
    if (consentStatus === 'approved') return (
      <div className="flex flex-col gap-4 max-w-sm">
        <div className="text-green-600 text-4xl">✓</div>
        <h2 className="text-lg font-bold">Deine Eltern haben zugestimmt!</h2>
        <p className="text-sm text-gray-600">Dein Konto ist aktiv. Du kannst jetzt loslegen.</p>
        <button className="bg-blue-500 text-white p-2 rounded" onClick={() => router.push('/home')}>
          Weiter
        </button>
      </div>
    )

    if (consentStatus === 'rejected') return (
      <div className="flex flex-col gap-4 max-w-sm">
        <div className="text-red-500 text-4xl">✕</div>
        <h2 className="text-lg font-bold">Anfrage abgelehnt</h2>
        <p className="text-sm text-gray-600">Deine Eltern haben die Anmeldung leider abgelehnt.</p>
        <button className="bg-red-500 text-white p-2 rounded" onClick={handleRejected}>
          Okay, Konto löschen
        </button>
      </div>
    )

    return (
      <div className="flex flex-col gap-4 max-w-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span className="text-sm text-gray-500">Warte auf Antwort deiner Eltern…</span>
        </div>
        <h2 className="text-lg font-bold">E-Mail wurde gesendet</h2>
        <p className="text-sm text-gray-600">
          Wir haben eine Einwilligungsanfrage an <strong>{parentEmail}</strong> gesendet.
          Diese Seite aktualisiert sich automatisch.
        </p>
        <p className="text-xs text-gray-400">Lass diese Seite offen.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm">
      <h2 className="text-lg font-bold">Einwilligung der Eltern erforderlich</h2>
      <p className="text-sm text-gray-600">
        Da du unter 16 Jahre alt bist, benötigen wir die Zustimmung eines Elternteils.
      </p>
      <input
        type="email"
        placeholder="E-Mail-Adresse der Eltern"
        value={parentEmail}
        className="p-2 border rounded"
        onChange={e => setParentEmail(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        onClick={handleSubmit}
        disabled={loading || !parentEmail}
      >
        {loading ? 'Wird gesendet…' : 'Einwilligung anfordern'}
      </button>
    </div>
  )
}