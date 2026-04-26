'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'

interface VerifyProps {
    email: string
    onSuccess: () => void
}

export default function Verify({ email, onSuccess }: VerifyProps) {
    const [digits, setCode] = useState<string[]>(['', '', '', '', '', ''])
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (value: string, index: number) => {
        if (!/^\d$/.test(value)) return
        const newDigits = [...digits]
        newDigits[index] = value
        setCode(newDigits)
        if (index < 5) inputRefs.current[index + 1]?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            const newDigits = [...digits]
            if (digits[index] !== '') {
                newDigits[index] = ''
                setCode(newDigits)
            } else if (index > 0) {
                newDigits[index - 1] = ''
                setCode(newDigits)
                inputRefs.current[index - 1]?.focus()
            }
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (!pasted) return
        const newDigits = [...digits]
        pasted.split('').forEach((char, i) => {
            newDigits[i] = char
        })
        setCode(newDigits)
        inputRefs.current[Math.min(pasted.length, 5)]?.focus()
    }

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        const code = digits.join('')
        const { error } = await supabase.auth.verifyOtp({
            email,
            token: code,
            type: 'signup',
        })
        if (error) {
            console.error('Verify error:', error)
            alert('Wrong code! ' + error.message)
        } else {
            onSuccess()
        }
    }

    return (
        <form onSubmit={handleVerify} className='flex w-full flex-col gap-4'>
            <h2 className='text-lg font-bold'>Check your email</h2>
            <p className='text-sm text-gray-500'>We sent a code to <strong>{email}</strong></p>
            <div className='flex gap-2 justify-between'>
                {digits.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        className='w-12 h-12 text-center text-lg font-semibold border rounded p-0'
                    />
                ))}
            </div>
            <button type="submit" className="bg-green-500 text-white p-2 rounded">Verify</button>
        </form>
    )
}