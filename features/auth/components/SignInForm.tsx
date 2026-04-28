'use client'

import { useState } from 'react'
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
    <form onSubmit={handleSignIn} className='flex flex-col gap-4'>
      <h2 className='text-lg font-bold'>Sign In</h2>
      <input
        type='email'
        placeholder='Email'
        value={email}
        className='p-2 border'
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        className='p-2 border'
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type='button'
        onClick={() => setStep('forgot')}
        className='text-sm text-blue-500 hover:underline text-right'
      >
        Forgot password?
      </button>
      <button type='submit' className='bg-blue-500 text-white p-2 rounded'>
        Sign In
      </button>
      <button type='button' onClick={handleGoogleSignIn} className='bg-white border p-2 rounded w-full'>
        Sign In with Google
      </button>
      <button type='button' onClick={onGoToSignUp} className='text-blue-500 hover:underline text-left'>
        Don't have an account? Sign Up
      </button>
    </form>
  )
}
