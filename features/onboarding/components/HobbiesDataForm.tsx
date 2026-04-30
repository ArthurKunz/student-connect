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
        <div className="w-full flex flex-col items-center gap-3 pt-2 border-t mt-2">
            <div className="w-100 flex flex-col gap-3 pt-2 border-t mt-2">
                <div>
                    <h3 className="text-md font-semibold">Wofür interessierst du dich am meisten?</h3>
                    <p className="text-sm text-gray-500">Wähle bis zu {MAX_HOBBIES} Kategorien</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {POPULAR_HOBBIES.map(({ label }) => {
                        const selected = hobbies.includes(label)
                        return (
                            <button
                                key={label}
                                type="button"
                                onClick={() => (selected ? removeHobby(label) : togglePopularHobby(label))}
                                className={
                                    selected
                                        ? 'inline-flex items-center gap-1.5 rounded-full border border-blue-700 bg-blue-700 px-3 py-1.5 text-sm text-white'
                                        : 'inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 shadow-sm'
                                }
                            >
                                <span>{label}</span>
                                {selected && (
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs" aria-hidden>
                                        ×
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                    <input
                        type="text"
                        placeholder="Eigene Interessen hinzufügen …"
                        value={customHobbyInput}
                        className="p-2 border flex-1"
                        maxLength={80}
                        onChange={(e) => setCustomHobbyInput(e.target.value)}
                        onKeyDown={handleCustomHobbyKeyDown}
                        disabled={hobbies.length >= MAX_HOBBIES}
                    />
                    <button
                        type="button"
                        onClick={addCustomHobby}
                        disabled={hobbies.length >= MAX_HOBBIES || !customHobbyInput.trim()}
                        className="rounded bg-gray-100 px-3 py-2 text-sm font-medium text-gray-800 disabled:opacity-50"
                    >
                        Hinzufügen
                    </button>
                </div>
                {hobbies.some((h) => !POPULAR_HOBBIES.some((p) => p.label === h)) && (
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-gray-500 w-full">Deine eigenen:</span>
                        {hobbies
                            .filter((h) => !POPULAR_HOBBIES.some((p) => p.label === h))
                            .map((label) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => removeHobby(label)}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-blue-700 bg-blue-700 px-3 py-1.5 text-sm text-white"
                                >
                                    <span>{label}</span>
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs" aria-hidden>
                                        ×
                                    </span>
                                </button>
                            ))}
                    </div>
                )}
                <p className="text-xs text-gray-500">{hobbies.length} / {MAX_HOBBIES} ausgewählt</p>
                <button className="bg-blue-500 text-white p-2 rounded" onClick={() => onSuccess(hobbies)}>Save & Continue</button>
                <button className="bg-blue-500 text-white p-2 rounded" onClick={onGoBack}>back</button>
            </div>
        </div>
    )
}