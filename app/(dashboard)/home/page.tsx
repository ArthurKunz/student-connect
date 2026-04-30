'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

type Profile = {
    firstname: string;
    surname: string;
    birthday: string; //check if it is a string or a number
    gradelevel: number;
    averagemark: number;
    gender: string;
    relationship: string;
    instagram: string | null;
    tiktok: string | null;
    snapchat: string | null;
    school: string;
}

const genderLabel: Record<string, string> = {
  female: 'Weiblich',
  male: 'Männlich',
  diverse: 'Divers',
  prefer_not_to_say: 'Keine Angabe',
}

const relationshipLabel: Record<string, string> = {
  single: 'Single',
  relationship: 'Vergeben',
  prefer_not_to_say: 'Keine Angabe',
}

const schoolLabel: Record<string, string> = {
  msgl: 'MSGL',
  rahn_oberschule: 'Rahn Oberschule',
}

export default function HomePage () {
    const [profile, setProfile] = useState<Profile | null>(null)
    const router = useRouter()



    useEffect(() => {
        const fetchProfile = async () => {
          const { data: { session } } = await supabase.auth.getSession()
          if (!session) { router.push('/login'); return }
    
          const { data } = await supabase.from('profiles')
            .select('firstname, surname, birthday, gradelevel, averagemark, gender, relationship, instagram, tiktok, snapchat, school')
            .eq('id', session.user.id)
            .single()
    
          if (data) setProfile(data)
          else router.push('/login')
        }
        fetchProfile()
    }, [])

    

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }



    const handleDeleteAccount = async () => {
        if (!confirm('Permanently delete account?')) return
        const { error } = await supabase.rpc('delete_self')
        if (error) alert(error.message)
        else { await supabase.auth.signOut(); router.push('/login') }
    }



    return  (
        <div className='w-full h-auto bg-blue-500 flex flex-col py-10 px-10 gap-5 items-center'>
        <h1 className='text-3xl text-blue-800 font-bold'>Homepage</h1>
        {profile && (
          <div className="bg-white text-black w-full p-3 rounded">
            <p><strong>Vorname</strong> {profile.firstname}</p>
            <p><strong>Nachname:</strong> {profile.surname}</p>
            <p><strong>Geburtstag:</strong> {new Date(profile.birthday).toLocaleDateString('de-DE')}</p>
            <p><strong>Klassenstufe:</strong> {profile.gradelevel}</p>
            <p><strong>Notendurchschnitt:</strong> {profile.averagemark}</p>
            <p><strong>Geschlecht:</strong> {genderLabel[profile.gender]}</p>
            <p><strong>Beziehung:</strong> {relationshipLabel[profile.relationship]}</p>
            <p><strong>Instagram:</strong> {profile.instagram}</p>
            <p><strong>Tiktok:</strong> {profile.tiktok}</p>
            <p><strong>Snapchat:</strong> {profile.snapchat}</p>
            <p><strong>Schule:</strong> {schoolLabel[profile.school]}</p>
          </div>
        )}
        <button onClick={() => handleLogout()} className='cursor-pointer bg-blue-200 w-full text-white p-2 rounded'>Logout</button>
        <button onClick={() => handleDeleteAccount()} className='cursor-pointer bg-blue-200 w-full text-white p-2 rounded'>delete account</button>
        <button onClick={() => router.push('/settings/change-data')} className='cursor-pointer bg-blue-200 w-full text-white p-2 rounded'>change password</button>
        <button onClick={() => router.push('/settings/change-data')} className='cursor-pointer bg-blue-200 w-full text-white p-2 rounded'>change data</button>
      </div>
    )
}