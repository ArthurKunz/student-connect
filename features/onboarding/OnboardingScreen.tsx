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
    const progressWidth =
        step === 'personal' ? '20%' :
        step === 'photo' ? '40%' :
        step === 'hobby' ? '60%' :
        step === 'social' ? '80%' :
        '100%'

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
                <div className='absolute px-20 top-0 left-[50%] translate-x-[-50%] w-full h-20 flex items-center'>
                    <div className='w-full h-1 bg-secondary rounded-full '>
                        <div
                            className='h-full bg-brand rounded-full transition-[width] duration-300 ease-out'
                            style={{ width: progressWidth }}
                        />
                    </div>
                </div>
                <div className='flex min-h-0 w-full flex-1 flex-col'>
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
            </div>
        </div>
    )
}