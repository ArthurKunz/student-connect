'use client'

import { useState } from 'react'
import Combobox from '@/components/shared/Combobox'
import { SchoolDataProps } from '../types/onboarding.types'
import { SCHOOLS } from '../constants/onboarding.constants'
import Selectbox, { type SelectOption } from '@/components/shared/Selectbox'
import { GRADELEVEL_OPTIONS, AVERAGEMARK_OPTIONS } from '../constants/onboarding.constants'

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
        <div className='w-full flex flex-col items-center gap-15'>
            <div className='w-full h-full flex flex-col items-center gap-2.5'>
                <h1 className='text-4xl font-bold text-light-heading'>Profil erstellen</h1>
                <span className='text-center text-sm text-light-subheading'>Gib deine Informationen in den dafür vorgesehen Feldern ein</span>
            </div>
            <div className='w-full flex flex-col gap-7.5'>
                <div className='w-full flex gap-2.5'>
                    <div className='w-full flex flex-col gap-2'>
                        <label className='text-xs text-light-label'>Notendurchschnitt</label>
                        <Selectbox
                            aria-label='Notendurchschnitt'
                            options={AVERAGEMARK_OPTIONS}
                            value={averagemark}
                            onValueChange={setAveragemark}
                            placeholder='Notendurchschnitt'
                            center
                        />
                    </div>
                    <div className='w-full flex flex-col gap-2'>
                        <label className='text-xs text-light-label'>Klassenstufe</label>
                        <Selectbox
                            aria-label='Klassenstufe'
                            options={GRADELEVEL_OPTIONS}
                            value={gradelevel}
                            onValueChange={setGradelevel}
                            placeholder='Klassenstufe'
                            center
                        />
                    </div>
                </div>

                <div className='w-full flex flex-col gap-2'>
                    <label className='text-xs text-light-label'>Geburtsdatum</label>
                    <Combobox
                        value={school}
                        onChange={setSchool}
                        topic={SCHOOLS}
                    />
                </div>
            </div>
            <button 
            onClick={() => onSuccess(data)}
            className='flex w-full items-center justify-center gap-2 rounded-full bg-button-bg py-3 text-sm font-semibold'
            >
            Weiter
            </button>
        </div>
    )
}

        {/* 
        <div className='flex flex-col gap-4 overflow-visible'>
            <input type="number" placeholder="Klassenstufe" value={gradelevel} className="p-2 border" onChange={(e) => setGradelevel(e.target.value)} required />
            <input type="number" placeholder="Notendurchschnitt" value={averagemark} className="p-2 border" step="0.1" min={0.8} max={6} onChange={(e) => setAveragemark(e.target.value)} required />
            <Combobox value={school} onChange={setSchool} topic={SCHOOLS}/>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded" onClick={() => onSuccess(data)}>Save & Continue</button>
            <button className="bg-blue-500 text-white p-2 rounded" onClick={onGoBack}>back</button>
        </div>
        */}