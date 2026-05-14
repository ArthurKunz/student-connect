'use child'

import { useState } from 'react'
import { SocialsDataProps } from '../types/onboarding.types'

export default function SocialsDataForm ({ onSuccess, onGoBack }: SocialsDataProps) {
    const [instagram, setInstagram] = useState('')
    const [tiktok, setTiktok] = useState('')
    const [snapchat, setSnapchat] = useState('')

    const data = {
        instagram: instagram,
        tiktok: tiktok,
        snapchat: snapchat
    }

    return (
        <div className='w-full flex flex-col items-center gap-15'>
            <div className='w-full h-full flex flex-col items-center gap-2.5'>
                <h1 className='text-4xl font-bold text-light-heading'>Profil erstellen</h1>
                <span className='text-center text-sm text-light-subheading'>Gib deine Social Media Accounts an</span>
            </div>
            <div className='w-full flex flex-col gap-7.5'>
                <div className='w-full flex flex-col gap-2'>
                    <label className='text-xs text-light-label'>Vorname</label>
                    <input 
                    type="text" 
                    placeholder="Instagram" 
                    value={instagram} 
                    className="w-full text-light-input text-xs px-3 h-12 bg-input-bg border border-input-border rounded-md text-sm text-light focus:outline-none placeholder:text-xs placeholder:text-light-placeholder" 
                    onChange={(e) => setInstagram(e.target.value)} 
                    required 
                    />
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <label className='text-xs text-light-label'>Snapchat</label>
                    <input 
                    type="text" 
                    placeholder="Snapchat" 
                    value={snapchat} 
                    className="w-full text-light-input text-xs px-3 h-12 bg-input-bg border border-input-border rounded-md text-sm text-light focus:outline-none placeholder:text-xs placeholder:text-light-placeholder" 
                    onChange={(e) => setSnapchat(e.target.value)} 
                    required 
                    />
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <label className='text-xs text-light-label'>TikTok</label>
                    <input 
                    type="text" 
                    placeholder="TikTok" 
                    value={tiktok} 
                    className="w-full text-light-input text-xs px-3 h-12 bg-input-bg border border-input-border rounded-md text-sm text-light focus:outline-none placeholder:text-xs placeholder:text-light-placeholder" 
                    onChange={(e) => setTiktok(e.target.value)} 
                    required 
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