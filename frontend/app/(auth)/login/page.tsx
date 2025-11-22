'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useLogin } from '@/lib/auth'

export default function LoginPage() {
  const { register, handleSubmit } = useForm<{ email: string; password: string }>()
  const login = useLogin()

  const onSubmit = handleSubmit((values) => login.mutate(values))

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="card max-w-3xl w-full grid md:grid-cols-2 gap-10">
        <div className="space-y-5">
          <p className="text-primary font-semibold">Welcome back</p>
          <h1 className="text-3xl font-bold leading-tight">Log in to continue planning healthy meals</h1>
          <p className="text-slate-600">Access your saved pantry items, meal plans, and personalized suggestions.</p>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-sm text-indigo-900">
            <p className="font-semibold mb-1">Coach tip</p>
            <p>Use the same email you’ll want shopping lists and reminders sent to.</p>
          </div>
          <div className="text-sm text-slate-500">Don’t have an account? <Link href="/register" className="text-primary font-semibold">Create one</Link></div>
        </div>
        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="form-label">Email</label>
            <input type="email" placeholder="you@example.com" {...register('email', { required: true })} />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input type="password" placeholder="••••••••" {...register('password', { required: true })} />
          </div>
          {login.isError && <p className="text-red-600 text-sm">Unable to sign in. Double-check your credentials.</p>}
          <button type="submit" className="primary" disabled={login.isPending}>
            {login.isPending ? 'Signing in...' : 'Sign in'}
          </button>
          <button type="button" className="secondary" onClick={() => (window.location.href = '/register')}>
            Need an account? Register
          </button>
        </form>
      </div>
    </main>
  )
}
