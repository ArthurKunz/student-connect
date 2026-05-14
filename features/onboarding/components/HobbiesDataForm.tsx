'use client'

import { useState } from 'react'
import { HobbiesDataProps } from '../types/onboarding.types'
import { POPULAR_HOBBIES, MAX_HOBBIES } from '../constants/onboarding.constants'


export default function HobbiesDataForm ({ onSuccess, onGoBack }: HobbiesDataProps) {
    const [hobbies, setHobbies] = useState<string[]>([])
    const [customHobbyInput, setCustomHobbyInput] = useState('')

    const togglePopularHobby = (label: string) => {
        setHobbies((prev) => {
            if (prev.includes(label)) return prev.filter((h) => h !== label)
            if (prev.length >= MAX_HOBBIES) return prev
            return [...prev, label]
        })
    }

    const removeHobby = (label: string) => {
        setHobbies((prev) => prev.filter((h) => h !== label))
    }

    const addCustomHobby = () => {
        const trimmed = customHobbyInput.trim()
        if (!trimmed) return
        const exists = hobbies.some((h) => h.toLowerCase() === trimmed.toLowerCase())
        if (exists) {
            setCustomHobbyInput('')
            return
        }
        if (hobbies.length >= MAX_HOBBIES) return
        setHobbies((prev) => [...prev, trimmed])
        setCustomHobbyInput('')
    }

    const handleCustomHobbyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addCustomHobby()
        }
    }

    return (
        <div className="flex h-full min-h-0 w-full max-w-sm flex-col">
            <div className="scrollbar-none flex min-h-0 flex-1 flex-col items-center gap-15 overflow-y-auto overscroll-contain">
                <div className="flex w-full flex-col items-center gap-2.5">
                    <h1 className='text-4xl font-bold text-light-heading'>Profil erstellen</h1>
                    <span className='text-center text-sm text-light-subheading'>Wähle deine Hobbies aus. Du kannst auch deine eigenen Hobbies erstellen.</span>
                </div>
                <div className='flex w-full flex-col gap-7.5'>
                    <div className='w-full flex flex-col gap-5'>
                        <label className='text-xs text-light-label'>Wähle deine Hobbies aus</label>
                        <div className="w-full flex flex-wrap gap-x-1.5 gap-y-2.5">
                            {POPULAR_HOBBIES.map(({ label }) => {
                                const selected = hobbies.includes(label)
                                return (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => (selected ? removeHobby(label) : togglePopularHobby(label))}
                                        className={
                                            selected
                                                ? 'cursor-pointer inline-flex items-center rounded-full border border-input-border bg-brand h-7.5 px-3 text-xs text-light-input'
                                                : 'cursor-pointer inline-flex items-center rounded-full border border-input-border bg-input-bg h-7.5 px-3 text-xs text-light-placeholder'
                                        }
                                    >
                                        <span>{label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                    <div className='flex w-full items-center justify-between'>
                        <div className='h-0.25 w-full bg-divider-bg'></div>
                        <span className='px-2.5 text-xs text-light-muted'>Oder</span>
                        <div className='h-0.25 w-full bg-divider-bg'></div>
                    </div>
                    <div className="flex w-full flex-col gap-2">
                        <div className='flex w-full flex-col gap-5'>
                            <label className='text-xs text-light-label'>Eigene Interessen hinzufügen</label>
                            <input
                                type="text"
                                placeholder="Eigene Interessen hinzufügen …"
                                value={customHobbyInput}
                                className="w-full px-3 h-12 text-xs text-light-input bg-input-bg border border-input-border rounded-md text-sm text-light focus:outline-none placeholder:text-xs placeholder:text-light-placeholder"
                                maxLength={80}
                                onChange={(e) => setCustomHobbyInput(e.target.value)}
                                onKeyDown={handleCustomHobbyKeyDown}
                                disabled={hobbies.length >= MAX_HOBBIES}
                            />
                        </div>
                        {hobbies.some((h) => !POPULAR_HOBBIES.some((p) => p.label === h)) && (
                            <div className="flex w-full flex-wrap gap-x-1.5 gap-y-2.5">
                                {hobbies
                                    .filter((h) => !POPULAR_HOBBIES.some((p) => p.label === h))
                                    .map((label) => (
                                        <button
                                            key={label}
                                            type="button"
                                            onClick={() => removeHobby(label)}
                                            className="cursor-pointer inline-flex items-center rounded-full border border-input-border bg-brand h-7.5 px-3 text-xs text-light-input"
                                        >
                                            <span>{label}</span>
                                        </button>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
                <button type="button" className="flex w-full items-center justify-center gap-2 rounded-full bg-button-bg py-3 text-sm font-semibold" onClick={() => onSuccess(hobbies)}>Save & Continue</button>
            </div>
        </div>
    )
}