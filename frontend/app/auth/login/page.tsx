'use client'

import { useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/api/auth/login/', { username: email, password })
      localStorage.setItem('access_token', data.access)
      setMessage('Logged in!')
    } catch (err) {
      setMessage('Login failed')
    }
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={submit} className="space-y-3 max-w-md">
        <input className="w-full border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Login</button>
      </form>
      {message && <p className="text-sm text-gray-700">{message}</p>}
      <div className="text-sm space-x-4 text-blue-700">
        <Link href="/auth/register">Create account</Link>
        <Link href="/auth/forgot-password">Forgot password?</Link>
      </div>
    </section>
  )
}
