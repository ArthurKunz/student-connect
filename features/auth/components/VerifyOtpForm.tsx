'use client'

import type { VerifyProps } from '../types/auth.types'
import { useOtpInput } from '../hooks/useOtpInput'
import { verifySignupOtp } from '../services/auth.service'

export default function VerifyOtpForm({ email, onSuccess }: VerifyProps) {
  const { digits, inputRefs, code, handleChange, handleKeyDown, handlePaste } = useOtpInput()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await verifySignupOtp(email, code)
    if (error) {
      console.error('Verify error:', error)
      alert('Wrong code! ' + error.message)
      return
    }
    onSuccess()
  }

  return (
    <form onSubmit={handleVerify} className='flex w-full flex-col gap-4'>
      <h2 className='text-lg font-bold'>Check your email</h2>
      <p className='text-sm text-gray-500'>
        We sent a code to <strong>{email}</strong>
      </p>
      <div className='flex gap-2 justify-between'>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type='text'
            inputMode='numeric'
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className='w-12 h-12 text-center text-lg font-semibold border rounded p-0'
          />
        ))}
      </div>
      <button type='submit' className='bg-green-500 text-white p-2 rounded'>
        Verify
      </button>
    </form>
  )
}

