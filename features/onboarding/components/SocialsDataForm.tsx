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
        <div className='flex flex-col gap-4'>
            <input type="text" placeholder="Instagram" value={instagram} className="p-2 border" step="0.1" onChange={(e) => setInstagram(e.target.value)}/>
            <input type="text" placeholder="Tiktok" value={tiktok} className="p-2 border" step="0.1" onChange={(e) => setTiktok(e.target.value)}/>
            <input type="text" placeholder="Snapchat" value={snapchat} className="p-2 border" step="0.1" onChange={(e) => setSnapchat(e.target.value)}/>
            <button className="bg-blue-500 text-white p-2 rounded" onClick={() => onSuccess(data)}>Save & Continue</button>
            <button className="bg-blue-500 text-white p-2 rounded" onClick={onGoBack}>back</button>
        </div>
    )
}