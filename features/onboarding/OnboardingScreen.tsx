'use client'

import { useState } from 'react'
import PersonalDataForm from './components/PersonalDataForm'
import ProfilePictureForm from './components/ProfilePictureForm'
import HobbiesDataForm from './components/HobbiesDataForm'
import SocialsDataForm from './components/SocialsDataForm'
import SchoolDataForm from './components/SchoolDataForm'
import { PersonalDataObject } from './types/onboarding.types'
import { SocialDataObject } from './types/onboarding.types'
import { SchoolDataObject } from './types/onboarding.types'
import { getSession } from './services/onboarding.service'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

/** Full years since birthday; `birthday` is `YYYY-MM-DD` (e.g. from PersonalDataForm). */
function calculateAge (birthday: string): number {
    const parts = birthday.trim().split('-')
    if (parts.length !== 3) return NaN
    const year = Number(parts[0])
    const month = Number(parts[1])
    const day = Number(parts[2])
    if (![year, month, day].every(Number.isFinite)) return NaN

    const today = new Date()
    let age = today.getFullYear() - year
    const thisMonth = today.getMonth() + 1
    if (thisMonth < month || (thisMonth === month && today.getDate() < day)) {
        age -= 1
    }
    return age
}

export default function OnboardingScreen () {
    const [step, setStep] = useState<'personal' | 'photo' | 'hobby' | 'social' | 'school'>('personal')
    const [personalData, setPersonalData] = useState<PersonalDataObject | null>(null)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [hobbiesData, setHobbiesData] = useState<string[] | null>(null)
    const [socialData, setSocialData] = useState<SocialDataObject | null>(null)
    const [schoolData, setSchoolData] = useState<SchoolDataObject | null>(null)
    const router = useRouter()

    const setUpProfile = async () => {
        const { data: { session } } = await getSession()
        if(!session) return

        if (!personalData || !socialData || !schoolData || !hobbiesData || !avatarUrl) return

        const { error } = await supabase.from('profiles').insert({
            id: session.user.id,
            avatar_url: avatarUrl,
            firstname: personalData.firstname,
            surname: personalData.surname,
            birthday: personalData.birthday,
            gender: personalData.gender,
            relationship: personalData.relationship,
            gradelevel: schoolData.gradelevel,
            averagemark: schoolData.averagemark,
            school: schoolData.school,
            instagram: socialData.instagram,
            tiktok: socialData.tiktok,
            snapchat: socialData.snapchat,
            hobbies: hobbiesData,
        })

        const age = calculateAge(personalData.birthday)
        if (error) alert(error.message)
        else if (age < 16) {
            router.push('/consent-request')
        } else {
            router.push('/home')
        }
    }

    return (
        <div className='w-full h-full flex justify-center'>

            {step === 'personal' && (
                <PersonalDataForm 
                    onSuccess={(data) => {
                        setPersonalData(data) 
                        setStep('photo')
                    }}
                />
            )}

            {step === 'photo' && (
                <ProfilePictureForm
                    onSuccess={(url) => {
                        setAvatarUrl(url)
                        setStep('hobby')
                    }}
                    onGoBack={() => setStep('personal')}
                />
            )}

            {step === 'hobby' && (
                <HobbiesDataForm 
                    onSuccess={(data) => {
                        setHobbiesData(data)
                        setStep('social')
                    }}
                    onGoBack={() => setStep('photo')}
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