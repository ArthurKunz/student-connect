'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { SignInProps } from '../types/auth.types'
import { sendResetPasswordEmail, signInWithGoogle, signInWithPassword } from '../services/auth.service'

type SignInStep = 'signin' | 'forgot' | 'forgot-sent'

export default function SignInForm({ onSuccess, onGoToSignUp }: SignInProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<SignInStep>('signin')
  const [resetEmail, setResetEmail] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await signInWithPassword(email, password)
    if (error) {
      console.error('SignIn error:', error)
      alert(error.message)
      return
    }
    onSuccess()
  }

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle()
    if (error) {
      console.error('Google signin error:', error)
      alert(error.message)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await sendResetPasswordEmail(resetEmail)
    if (error) {
      alert(error.message)
      return
    }
    setStep('forgot-sent')
  }

  if (step === 'forgot') {
    return (
      <form onSubmit={handleForgotPassword} className='flex flex-col gap-4'>
        <h2 className='text-lg font-bold'>Reset Password</h2>
        <p className='text-sm text-gray-400'>Enter your email and we'll send you a reset link.</p>
        <input
          type='email'
          placeholder='Email'
          value={resetEmail}
          className='p-2 border'
          onChange={(e) => setResetEmail(e.target.value)}
          required
        />
        <button type='submit' className='bg-blue-500 text-white p-2 rounded'>
          Send Reset Link
        </button>
        <button
          type='button'
          onClick={() => setStep('signin')}
          className='text-blue-500 hover:underline text-left'
        >
          ← Back to Sign In
        </button>
      </form>
    )
  }

  if (step === 'forgot-sent') {
    return (
      <div className='flex flex-col gap-4'>
        <h2 className='text-lg font-bold'>Check your email</h2>
        <p className='text-sm text-gray-400'>
          We sent a password reset link to <strong>{resetEmail}</strong>. Click the link in the email to set a new
          password.
        </p>
        <button type='button' onClick={() => setStep('signin')} className='text-blue-500 hover:underline text-left'>
          Back to Sign In
        </button>
      </div>
    )
  }

  return (
    <div className='w-full flex flex-col items-center gap-15'>

      <div className='w-full h-full flex flex-col items-center gap-2.5'>
        <h1 className='text-4xl font-bold text-light-heading'>Login</h1>
        <span className='text-center text-sm text-light-subheading'>Log dich ein und lerne <span className='text-brand text-sm font-semibold '>Leipzig</span> kennen</span>
      </div>

      <form className='w-full flex flex-col gap-12.5' onSubmit={handleSignIn} noValidate>
        <div className='w-full'>
          <div className='w-full flex flex-col gap-5'>
            <div className='w-full flex flex-col gap-2'>
              <label className='text-sm text-light-label'>Email</label>
              <input
              type='email'
              placeholder='max.mustermann@example.com'
              className='w-full px-3 py-4 bg-input-bg rounded-md text-sm text-light focus:outline-none placeholder:text-xs placeholder:text-light-placeholder'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='w-full flex flex-col gap-2'>
              <label className='text-sm text-light-label'>Passwort</label>
              <input
              type='password'
              placeholder='Gib dein Passwort ein'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-3 py-4 bg-input-bg rounded-md text-sm text-light focus:outline-none placeholder:text-xs placeholder:text-light-placeholder'
              />
            </div>
          </div>
        </div>

        <div className='w-full flex flex-col gap-5'>
          <button 
            type='submit'
            className='flex w-full items-center justify-center gap-2 rounded-full bg-button-bg py-3 text-sm font-semibold'
          >
            Sign Up
          </button>
          <div className='w-full flex justify-between items-center'>
            <div className='w-full h-0.25 bg-divider-bg'></div>
            <span className='text-xs text-light-muted px-2.5'>Oder</span>
            <div className='w-full h-0.25 bg-divider-bg'></div>
          </div>
          <button
            type='button'
            onClick={handleGoogleSignIn}
            className='flex w-full items-center justify-center gap-2 rounded-full bg-button-bg py-3 text-sm font-semibold'
          >
            <Image src='/icons/Google.png' alt='' width={18} height={18} className='shrink-0' />
            Google
          </button>
        </div>
      </form>
    </div>
  )
}
