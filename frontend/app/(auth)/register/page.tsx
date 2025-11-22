'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useRegister } from '@/lib/auth'

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<{ email: string; password: string; first_name?: string; last_name?: string }>()
  const registerUser = useRegister()

  const onSubmit = handleSubmit((values) => registerUser.mutate(values))

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="card max-w-3xl w-full grid md:grid-cols-2 gap-10">
        <div className="space-y-5">
          <p className="text-primary font-semibold">Join Life Fuel</p>
          <h1 className="text-3xl font-bold leading-tight">Create your account</h1>
          <p className="text-slate-600">Build recipes from what&apos;s already in your kitchen and get curated shopping lists.</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-accent"></span>Personalized meal ideas with nutrition highlights.</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-accent"></span>Track pantry items and reduce food waste.</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-accent"></span>Shopping lists optimized for budget and time.</li>
          </ul>
          <div className="text-sm text-slate-500">Already have an account? <Link href="/login" className="text-primary font-semibold">Sign in</Link></div>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">First name</label>
              <input type="text" placeholder="Alex" {...register('first_name')} />
            </div>
            <div>
              <label className="form-label">Last name</label>
              <input type="text" placeholder="Rivera" {...register('last_name')} />
            </div>
          </div>
          <div>
            <label className="form-label">Email</label>
            <input type="email" placeholder="you@example.com" {...register('email', { required: true })} />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input type="password" placeholder="Create a strong password" {...register('password', { required: true })} />
          </div>
          {registerUser.isError && <p className="text-red-600 text-sm">Unable to create account. Try a different email.</p>}
          <button type="submit" className="primary" disabled={registerUser.isPending}>
            {registerUser.isPending ? 'Creating account...' : 'Create account'}
          </button>
          <p className="text-xs text-slate-500 text-center">By signing up you agree to our wellness-first mission.</p>
        </form>
      </div>
    </main>
  )
}
