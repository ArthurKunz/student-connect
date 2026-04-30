'use client'

import { useState } from 'react'
import PersonalDataForm from './components/PersonalDataForm'
import HobbiesDataForm from './components/HobbiesDataForm'
import SocialsDataForm from './components/SocialsDataForm'
import SchoolDataForm from './components/SchoolDataForm'
import { PersonalDataObject } from './types/onboarding.types'
import { SocialDataObject } from './types/onboarding.types'
import { SchoolDataObject } from './types/onboarding.types'
import { getSession } from './services/onboarding.service'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function OnboardingScreen () {
    const [step, setStep] = useState<'personal' | 'hobby' | 'social' | 'school'>('personal')
    const [personalData, setPersonalData] = useState<PersonalDataObject | null>(null)
    const [hobbiesData, setHobbiesData] = useState<string[] | null>(null)
    const [socialData, setSocialData] = useState<SocialDataObject | null>(null)
    const [schoolData, setSchoolData] = useState<SchoolDataObject | null>(null)
    const router = useRouter()

    const setUpProfile = async () => {
        const { data: { session } } = await getSession()
        if(!session) return

        if (!personalData || !socialData || !schoolData || !hobbiesData) return

        const { error } = await supabase.from('profiles').insert({
            id: session.user.id,
            firstname: personalData.firstname,
            surname: personalData.surname,
            birthday: personalData.birthday,
            gender: personalData.gender,
            gradelevel: schoolData.gradelevel,
            averagemark: schoolData.averagemark,
            school: schoolData.school,
            instagram: socialData.instagram,
            tiktok: socialData.tiktok,
            snapchat: socialData.snapchat,
            hobbies: hobbiesData,
        })

        if (error) alert(error.message)
        else router.push('/home')
    }

    return (
        <div className='w-full h-full flex justify-center'>

            {step === 'personal' && (
                <PersonalDataForm 
                    onSuccess={(data) => {
                        setPersonalData(data) 
                        setStep('hobby')
                    }}
                />
            )}

            {step === 'hobby' && (
                <HobbiesDataForm 
                    onSuccess={(data) => {
                        setHobbiesData(data)
                        setStep('social')
                    }}
                    onGoBack={() => setStep('personal')}
                />
            )}

            {step === 'social' && (
                <SocialsDataForm 
                    onSuccess={(data) => {
                        setSocialData(data)
                        setStep('school')
                    }}

                    onGoBack={() => setStep('hobby')}
                />
            )}

            {step === 'school' && (
                <SchoolDataForm 
                    onSuccess={(data) => {
                        setSchoolData(data)
                        setUpProfile()
                    }}

                    onGoBack={() => setStep('social')}
                />
            )}

        </div>
    )
}