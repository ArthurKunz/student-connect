import { useMemo } from 'react'

export function validatePassword(pwd: string): string {
  if (pwd.length < 8) return 'Must be at least 8 characters'
  if (!/[A-Z]/.test(pwd)) return 'Must contain at least one uppercase letter'
  if (!/[0-9]/.test(pwd)) return 'Must contain at least one number'
  return ''
}

export function usePasswordValidation(password: string) {
  const passwordError = useMemo(() => validatePassword(password), [password])
  return { passwordError }
}

