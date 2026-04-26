'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'



export default function ChangeDataPage () {
    const [firstname, setFirstname] = useState('')
    const [surname, setSurname] = useState('')
    const [day, setDay] = useState('')
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')
    const [gradelevel, setGradelevel] = useState('')
    const [averagemark, setAveragemark] = useState('')
    const [gender, setGender] = useState('')
    const [height, setHeight] = useState('')
    const [relationship, setRelationship] = useState('')
    const [instagram, setInstagram] = useState('')
    const [tiktok, setTiktok] = useState('')
    const [snapchat, setSnapchat] = useState('')
    const [school, setSchool] = useState('')
    const birthday = `${year}-${month}-${day}`
    const router = useRouter()

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) { router.push('/login'); return }
    
            const { data } = await supabase.from('profiles')
                .select('firstname, surname, birthday, gradelevel, averagemark, gender, height, relationship, instagram, tiktok, snapchat, school')
                .eq('id', session.user.id)
                .single()

    
            if (data) {
                setFirstname(data.firstname)
                setSurname(data.surname)
                setGradelevel(String(data.gradelevel))
                setAveragemark(String(data.averagemark))
                setGender(data.gender)
                setHeight(String(data.height))
                setRelationship(data.relationship)
                setInstagram(data.instagram)
                setTiktok(data.tiktok)
                setSnapchat(data.snapchat)
                setSchool(data.school)

                const [y, m, d] = data.birthday.split('-')
                setYear(y)
                setMonth(m)
                setDay(d)
            }
        }
        fetchProfile()
    }, [])


    const handleChangeData = async (e: React.FormEvent) => {
        e.preventDefault()
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { alert('Not logged in.'); return }
    
        const { error } = await supabase.from('profiles')
          .update({
            firstname,
            surname,
            birthday, //check if you have to use parseInt
            gradelevel: parseInt(gradelevel),
            averagemark: parseFloat(averagemark),
            gender,
            height: parseInt(height),
            relationship,
            instagram,
            tiktok,
            snapchat,
            school,
          })
          .eq('id', session.user.id)
    
        if (error) alert(error.message)
        else router.push('/home')
    }


    return (
    <form onSubmit={handleChangeData} className='flex flex-col gap-4'>
        <h2 className='text-lg font-bold'>Set up your profile</h2>
        <input type="text" placeholder="Vorname" value={firstname} className="p-2 border" min={1} max={120} onChange={(e) => setFirstname(e.target.value)} required />
        <input type="text" placeholder="Nachname" value={surname} className="p-2 border" onChange={(e) => setSurname(e.target.value)} required />
        
        <select value={day} className="p-2 border bg-white" onChange={(e) => setDay(e.target.value)}>
            <option value='' disabled>Tag</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                <option key={d} value={String(d).padStart(2, '0')}>{d}</option>
            ))}
        </select>

        <select value={month} className="p-2 border bg-white" onChange={(e) => setMonth(e.target.value)}>
            <option value='' disabled>Monat</option>
            {['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'].map((m, i)=> (
                <option key={i} value={String(i + 1).padStart(2, '0')}>{m}</option>
            ))}
        </select>

        <select value={year} className="p-2 border bg-white" onChange={(e) => setYear(e.target.value)}>
            <option value='' disabled>Jahr</option>
            {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(y => (
                <option key={y} value={String(y)}>{y}</option>
            ))}
        </select>

        <input type="number" placeholder="Klassenstufe" value={gradelevel} className="p-2 border" onChange={(e) => setGradelevel(e.target.value)} required />
        <input type="number" placeholder="Notendurchschnitt" value={averagemark} className="p-2 border" step="0.1" min={0.8} max={6} onChange={(e) => setAveragemark(e.target.value)} required />
        <select value={gender} className="p-2 border bg-white" onChange={(e) => setGender(e.target.value)} required>
            <option value="" disabled>Geschlecht wählen</option>
            <option value="female">Weiblich</option>
            <option value="male">Männlich</option>
            <option value="diverse">Divers</option>
            <option value="prefer_not_to_say">Keine Angabe</option>
        </select>
        <input type="number" placeholder="Größe (cm)" value={height} className="p-2 border" min={50} max={250} onChange={(e) => setHeight(e.target.value)} required />
        <select value={relationship} className="p-2 border bg-white" onChange={(e) => setRelationship(e.target.value)} required>
            <option value="" disabled>Beziehungsstatus</option>
            <option value="single">Single</option>
            <option value="relationship">Vergeben</option>
            <option value="prefer_not_to_say">Keine Angabe</option>
        </select>
        <input type="text" placeholder="Instagram" value={instagram} className="p-2 border" step="0.1" onChange={(e) => setInstagram(e.target.value)}/>
        <input type="text" placeholder="Tiktok" value={tiktok} className="p-2 border" step="0.1" onChange={(e) => setTiktok(e.target.value)}/>
        <input type="text" placeholder="Snapchat" value={snapchat} className="p-2 border" step="0.1" onChange={(e) => setSnapchat(e.target.value)}/>
        <select value={school} className="p-2 border bg-white" onChange={(e) => setSchool(e.target.value)}>
            <option value="" disabled>Schule</option>
            <option value="msgl">MSGL</option>
            <option value="rahn_oberschule">Rahn Oberschule</option>
        </select>

        <button className="bg-blue-500 text-white p-2 rounded">Save & Continue</button>
        <span className='text-blue-500 underline cursor-pointer' onClick={() => router.push('/home')}>Cancel</span>
    </form>
    )
}