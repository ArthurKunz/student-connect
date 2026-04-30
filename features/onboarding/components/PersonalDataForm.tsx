'use client'

import { useState } from 'react'
import type { PersonalDataProps } from '../types/onboarding.types'

export default function PersonalDataForm ({ onSuccess }: PersonalDataProps) {
    const [firstname, setFirstname] = useState('')
    const [surname, setSurname] = useState('')
    const [day, setDay] = useState('')
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')
    const [gender, setGender] = useState('')
    const [relationship, setRelationship] = useState('')

    const birthday = `${year}-${month}-${day}`
    const data = {
        firstname: firstname,
        surname: surname,
        birthday: birthday,
        gender: gender,
        relationship: relationship
    }

    return (
        <div className='flex flex-col gap-4'>
            <h2 className='text-lg font-bold'>Set up your profile</h2>
            <input type="text" placeholder="Vorname" value={firstname} className="p-2 border" onChange={(e) => setFirstname(e.target.value)} required />
            <input type="text" placeholder="Nachname" value={surname} className="p-2 border" onChange={(e) => setSurname(e.target.value)} required />

            <select value={day} className='p-2 border bg-white' onChange={(e) => setDay(e.target.value)}>
                <option value='' disabled>Tag</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map (d => (
                    <option key={d} value={String(d).padStart(2, '0')}>{d}</option>
                ))}
            </select>

            <select value={month} className='p-2 border bg-white' onChange={(e) => setMonth(e.target.value)}>
                <option value='' disabled>Monat</option>
                {['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'].map((m, i) => (
                    <option key={i} value={String(i + 1).padStart(2, '0')}>{m}</option>
                ))}
            </select>

            <select value={year} className='p-2 border bg-white' onChange={(e) => setYear(e.target.value)}>
                <option value='' disabled>Jahr</option>
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(y => (
                    <option key={y} value={String(y)}>{y}</option>
                ))}
            </select>

            <select value={gender} className="p-2 border bg-white" onChange={(e) => setGender(e.target.value)} required>
                <option value="" disabled>Geschlecht wählen</option>
                <option value="female">Weiblich</option>
                <option value="male">Männlich</option>
                <option value="diverse">Divers</option>
                <option value="prefer_not_to_say">Keine Angabe</option>
            </select>
            <select value={relationship} className="p-2 border bg-white" onChange={(e) => setRelationship(e.target.value)}>
                <option value="" disabled>Beziehungsstatus</option>
                <option value="single">Single</option>
                <option value="relationship">Vergeben</option>
                <option value="prefer_not_to_say">Keine Angabe</option>
            </select>
            <button className="bg-blue-500 text-white p-2 rounded" onClick={() => onSuccess(data)}> Save & Continue</button>
        </div>
    )
}