'use client'

import { useState } from 'react'
import Combobox from '@/components/shared/Combobox'
import { SchoolDataProps } from '../types/onboarding.types'
import { SCHOOLS } from '../constants/onboarding.constants'

export default function SchoolDataForm ({onSuccess, onGoBack}: SchoolDataProps) {
    const [gradelevel, setGradelevel] = useState('')
    const [averagemark, setAveragemark] = useState('')
    const [school, setSchool] = useState('')

    const data = {
        gradelevel: gradelevel,
        averagemark: averagemark,
        school: school
    }

    return (
        <div className='flex flex-col gap-4 overflow-visible'>
            <input type="number" placeholder="Klassenstufe" value={gradelevel} className="p-2 border" onChange={(e) => setGradelevel(e.target.value)} required />
            <input type="number" placeholder="Notendurchschnitt" value={averagemark} className="p-2 border" step="0.1" min={0.8} max={6} onChange={(e) => setAveragemark(e.target.value)} required />
            <Combobox value={school} onChange={setSchool} topic={SCHOOLS}/>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded" onClick={() => onSuccess(data)}>Save & Continue</button>
            <button className="bg-blue-500 text-white p-2 rounded" onClick={() => onGoBack}>back</button>
        </div>
    )
}