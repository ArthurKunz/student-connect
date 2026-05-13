'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { SignUpProps } from '../types/auth.types'
import { usePasswordValidation } from '../hooks/usePasswordValidation'
import { signUpWithEmail, signUpWithGoogle } from '../services/auth.service'

export default function SignUpForm({ onSuccess, onGoToSignIn }: SignUpProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { passwordError } = usePasswordValidation(password)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordError) return
    const { error: signUpError } = await signUpWithEmail(email, password)
    if (signUpError) {
      console.error('SignUp error:', signUpError)
      alert(signUpError.message)
      return
    }
    onSuccess(email)
  }

  const handleGoogleSignUp = async () => {
    const { error } = await signUpWithGoogle()
    if (error) {
      console.error('Google signup error:', error)
      alert(error.message)
    }
  }

  return (
    <div className='w-full h-full flex flex-col items-center gap-20'>

      <div className='w-full h-full flex flex-col items-center gap-2.5'>
        <h1 className='text-4xl font-bold text-lighttext-heading'>Sign Up</h1>
        <span className='text-center text-sm text-lighttext-subheading'>Erstelle jetzt ein Account und lerne <span className='text-brand text-sm font-semibold '>Leipzig</span> kennen</span>
      </div>

      <form className='w-full flex flex-col gap-12.5' onSubmit={handleSignUp} noValidate>
        <div className='w-full'>
          <div className='w-full flex flex-col gap-5'>
            <div className='w-full flex flex-col gap-2'>
              <label className='text-sm text-lighttext-label'>Email</label>
              <input
              type='email'
              placeholder='max.mustermann@example.com'
              className='w-full px-3 py-4 bg-graybg rounded-md text-sm text-lighttext focus:outline-none placeholder:text-xs placeholder:text-lighttext-placeholder'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='w-full flex flex-col gap-2'>
              <label className='text-sm text-lighttext-label'>Passwort</label>
              <input
              type='password'
              placeholder='Erstelle ein Passwort'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-3 py-4 bg-graybg rounded-md text-sm text-lighttext focus:outline-none placeholder:text-xs placeholder:text-lighttext-placeholder'
              />
            </div>
          </div>
        </div>

        <div className='w-full flex flex-col gap-5'>
          <button 
            type='submit'
            className='flex w-full items-center justify-center gap-2 rounded-full bg-whitebg py-3 text-sm font-semibold'
          >
            Sign Up
          </button>
          <div className='w-full flex justify-between items-center'>
            <div className='w-full h-0.25 bg-lightgraybg'></div>
            <span className='text-xs text-lighttext-muted px-2.5'>Oder</span>
            <div className='w-full h-0.25 bg-lightgraybg'></div>
          </div>
          <button
            type='button'
            onClick={handleGoogleSignUp}
            className='flex w-full items-center justify-center gap-2 rounded-full bg-whitebg py-3 text-sm font-semibold'
          >
            <Image src='/icons/Google.png' alt='' width={18} height={18} className='shrink-0' />
            Google
          </button>
        </div>
      </form>

      <span className='text-xs text-lighttext-muted'>Du hast schon ein Account? <span className='text-brand text-sm font-semibold cursor-pointer' onClick={onGoToSignIn}>Login</span></span>
    </div>
  )
}
