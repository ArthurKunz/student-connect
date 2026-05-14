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
  const [studentName, setStudentName] = useState('')
  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()


  if (consentStatus === 'approved') router.push('/home')
  if (consentStatus === 'rejected') handleRejected()


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

    const {data: { session } } = await supabase.auth.getSession()
    if (!session) { alert('Not logged in.'); return }
    setStudentEmail(session.user.email ?? '')

    const { data: { user } } = await supabase.auth.getUser()

    const {data: profile, error: profileError } = await supabase.from('profiles')
    .select('firstname, surname')
    .eq('id', session.user.id)
    .single()
    if (profileError || !profile) { alert(profileError?.message ?? 'Profile not found.'); return }

    const { data, error } = await supabase
      .from('consent_requests')
      .insert({
        user_id: user?.id ?? '',
        student_name:  `${profile.firstname} ${profile.surname}`,
        student_email: session.user.email ?? '',
        parent_email:  parentEmail,
        status:        'pending'
      })
      .select()
      .single()

    if (error) { alert('Error: ' + error.message); setLoading(false); return }

    await supabase.functions.invoke('send-consent-email', {
      body: { parentEmail, studentName: studentName, token: data.token }
    })

    setLoading(false)
    setSent(true)
  }



  async function handleRejected() {
    const { error } = await supabase.rpc('delete_self')
    if (error) alert(error.message)
    else { await supabase.auth.signOut(); router.push('/login') }
  }




  return (
    <div className='w-screen h-screen p-2.5 flex bg-primary'>
      
      <div className='w-3/5 flex justify-center items-end h-full rounded-3xl bg-[linear-gradient(180deg,#0056FF_0%,#0c0c0c_75%,#0c0c0c_100%)]'>
        <div className='flex flex-col items-center w-65 h-75 mb-15 gap-10'>
          <div className='flex flex-col items-center'>
            <span className='text-center text-sm text-brand font-semibold mb-2.5'>Student Connect</span>
            <span className='text-center text-3xl text-light-heading font-semibold mb-2'>Starte jetzt mit uns</span>
            <span className='text-center text-xs w-60 text-light-subheading'>Folge diesen einfachen Schritten, um deinen account zu erstellen</span>
          </div>
          <div className='w-full flex flex-col gap-2'>
            <div className='w-full h-12.5 bg-white rounded-xl flex gap-3 items-center px-3'>
              <div className='text-xs text-light-heading  w-6 h-6 bg-brand rounded-full flex justify-center items-center'>1</div>
              <span className='text-xs text-brand'>Erstelle deinen Account</span>
            </div>
            <div className='w-full h-12.5 bg-white rounded-xl flex gap-3 items-center px-3'>
              <div className='text-xs text-light-heading  w-6 h-6 bg-brand rounded-full flex justify-center items-center'>2</div>
              <span className='text-xs text-brand'>Verifiziere dein Account</span>
            </div>
            <div className='w-full h-12.5 bg-white rounded-xl flex gap-3 items-center px-3'>
              <div className='text-xs text-light-heading  w-6 h-6 bg-brand rounded-full flex justify-center items-center'>3</div>
              <span className='text-xs text-brand'>Erstelle dein Profil</span>
            </div>
          </div>
        </div>
      </div>

      <div className='relative flex w-2/5 h-full flex-col px-20 pt-20 pb-0'>
        <div className='flex min-h-0 w-full flex-1 flex-col'>



          {!sent && (
            <div className='w-full flex flex-col items-center gap-15'>
              <div className='w-full h-full flex flex-col items-center gap-2.5'>
                <h1 className='text-4xl font-bold text-light-heading'>Einwilligung</h1>
                <span className='text-center text-sm text-light-subheading'>Da du <span className='text-brand text-sm font-semiboldtext-brand text-sm font-semibold'>unter 16</span> bist müssen deine Eltern der Erstellung eines Accounts einwiligen.</span>
              </div>
              <div className='w-full flex flex-col gap-5'>
                <div className='w-full flex flex-col gap-2'>
                  <label className='text-xs text-light-label'>Vorname</label>
                  <input
                    type="email"
                    placeholder="Email der Eltern"
                    value={parentEmail}
                    className="w-full text-light-input text-xs px-3 h-12 bg-input-bg border border-input-border rounded-md text-sm text-light focus:outline-none placeholder:text-xs placeholder:text-light-placeholder"
                    onChange={e => setParentEmail(e.target.value)}
                  />
                </div>
              </div>
              <button 
              onClick={handleSubmit}
              className='flex w-full items-center justify-center gap-2 rounded-full bg-button-bg py-3 text-sm font-semibold'
              disabled={loading || !parentEmail}
              >
              {loading ? 'Wird gesendet…' : 'Einwilligung anfordern'}
              </button>
            </div>
          )}

          {(sent && consentStatus === 'pending') && (
            <div className='w-full flex flex-col items-center gap-15'>
              <div className='w-full h-full flex flex-col items-center gap-2.5'>
                <h1 className='text-4xl font-bold text-light-heading'>Einwilligung</h1>
                <span className='text-center text-sm text-light-subheading'>Email hat eine Einwilligungsemail erhalten. Sobald sie diese akzeptieren, wird dein Account automatisch erstellt.</span>
              </div>
              <div className='w-full flex justify-center gap-5'>
                <div className='w-25 h-25 bg-brand rounded-full'/>
              </div>
              <div className='w-full h-full flex flex-col items-center gap-2.5'>
                <h1 className='text-lg font-bold text-light-heading'>Wir warten auf die Einwilligung</h1>
                <span className='text-center text-xs text-light-subheading text-center'>Der Empfänger der Email muss die Erstellung des Accounts bestätigen bevor du fortfahren kannst</span>
              </div>
            </div>
          )}



        </div>
      </div>
    </div>
  )
}

{/* 
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
*/}