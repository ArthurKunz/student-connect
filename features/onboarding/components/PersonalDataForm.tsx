'use client'

import { useMemo, useState } from 'react'
import Selectbox, { type SelectOption } from '@/components/shared/Selectbox'
import type { PersonalDataProps } from '../types/onboarding.types'
import { DAY_OPTIONS, MONTH_LABELS, MONTH_OPTIONS, GENDER_OPTIONS, RELATIONSHIP_OPTIONS } from '../constants/onboarding.constants'


export default function PersonalDataForm ({ onSuccess }: PersonalDataProps) {
    const [firstname, setFirstname] = useState('')
    const [surname, setSurname] = useState('')
    const [day, setDay] = useState('')
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')
    const [gender, setGender] = useState('')
    const [relationship, setRelationship] = useState('')

    const yearOptions = useMemo((): SelectOption[] => {
      const currentYear = new Date().getFullYear()
      return Array.from({ length: 100 }, (_, i) => {
        const y = currentYear - i
        return { value: String(y), label: String(y) }
      })
    }, [])

    const birthday = `${year}-${month}-${day}`
    const data = {
        firstname: firstname,
        surname: surname,
        birthday: birthday,
        gender: gender,
        relationship: relationship
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
                        <label className='text-xs text-light-label'>Vorname</label>
                        <input 
                        type="text" 
                        placeholder="Vorname" 
                        value={firstname} 
                        className="w-full px-3 h-12 bg-input-bg rounded-md text-sm text-light focus:outline-none placeholder:text-xs placeholder:text-light-placeholder" 
                        onChange={(e) => setFirstname(e.target.value)} 
                        required 
                        />
                    </div>
                    <div className='w-full flex flex-col gap-2'>
                        <label className='text-xs text-light-label'>Nachname</label>
                        <input 
                        type="text" 
                        placeholder="Nachname" 
                        value={surname} 
                        className="w-full px-3 h-12 bg-input-bg rounded-md text-sm text-light focus:outline-none placeholder:text-xs placeholder:text-light-placeholder" 
                        onChange={(e) => setSurname(e.target.value)} 
                        required 
                        />
                    </div>
                </div>

                <div className='w-full flex flex-col gap-2'>
                    <label className='text-xs text-light-label'>Geburtsdatum</label>
                    <div className='w-full flex gap-2.5'>
                        <Selectbox
                            aria-label='Tag'
                            options={DAY_OPTIONS}
                            value={day}
                            onValueChange={setDay}
                            placeholder='Tag'
                            center
                        />
                        <Selectbox
                            aria-label='Monat'
                            options={MONTH_OPTIONS}
                            value={month}
                            onValueChange={setMonth}
                            placeholder='Monat'
                            center
                        />
                        <Selectbox
                            aria-label='Jahr'
                            options={yearOptions}
                            value={year}
                            onValueChange={setYear}
                            placeholder='Jahr'
                            center
                        />
                    </div>
                </div>

                <div className='w-full flex flex-col gap-2'>
                    <label className='text-xs text-light-label'>Gender</label>
                    <Selectbox
                        aria-label='Gender'
                        options={GENDER_OPTIONS}
                        value={gender}
                        onValueChange={setGender}
                        placeholder='Gender'
                    />
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <label className='text-xs text-light-label'>Beziehungsstatus</label>
                    <Selectbox
                        aria-label='Beziehungsstatus'
                        options={RELATIONSHIP_OPTIONS}
                        value={relationship}
                        onValueChange={setRelationship}
                        placeholder='Beziehungsstatus'
                    />
                </div>
            </div>
            <button 
            type='submit'
            className='flex w-full items-center justify-center gap-2 rounded-full bg-button-bg py-3 text-sm font-semibold'
            >
            Weiter
            </button>
        </div>
    )
}