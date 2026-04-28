'use client'

import { useState } from 'react'
import Image from 'next/image'
import Google from '../../../public/icons/Google.png'
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
    <div className='flex flex-col items-center gap-10'>
      <div className='w-full flex flex-col items-center gap-2.5'>
        <span className='text-white text-3xl font-md'>Sign Up</span>
        <span className='text-[#adadad] text-sm'>Enter your personal data to create an account</span>
      </div>
      <form onSubmit={handleSignUp} className='w-full flex flex-col items-center gap-7.5'>
        <div className='w-full flex flex-col gap-2.5'>
          <label className='text-[#adadad] text-sm'>Email</label>
          <input
            type='email'
            placeholder='max.mustermann@gmail.com'
            value={email}
            className='w-full px-5 border bg-[#1f1f1f] border-[#444444] placeholder:text-[#6b6b6b] placeholder:text-sm h-12.5 rounded-xl'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='w-full flex flex-col gap-2.5'>
          <label className='text-[#adadad] text-sm'>Password</label>
          <input
            type='password'
            placeholder='Enter your password'
            value={password}
            className='w-full px-5 border bg-[#1f1f1f] border-[#444444] placeholder:text-[#6b6b6b] placeholder:text-sm h-12.5 rounded-xl'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {passwordError && <span className='text-sm text-red-500'>{passwordError}</span>}
        </div>
        <button
          type='submit'
          disabled={!!passwordError}
          className='w-full bg-white text-black p-2 rounded-xl h-12.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Sign Up
        </button>
      </form>
      <div className='w-full flex justify-between items-center'>
        <div className='w-4/10 h-0.25 bg-[#282828]'></div>
        <span className='text-[#6b6b6b] text-sm'>Or</span>
        <div className='w-4/10 h-0.25 bg-[#282828]'></div>
      </div>
      <button
        type='button'
        onClick={handleGoogleSignUp}
        className='border border-1.5 text-md border-[#1f1f1f] p-2 rounded-xl h-12.5 w-full'
      >
        <div className='flex justify-center items-center gap-2.5'>
          <Image className='w-5 h-5' src={Google} alt='Google' />
          <span className='font-semibold text-white text-md'>Google</span>
        </div>
      </button>
      <button type='button' onClick={onGoToSignIn} className='text-blue-500 hover:underline text-left'>
        <span>Already have an account? </span>Sign In
      </button>
    </div>
  )
}
