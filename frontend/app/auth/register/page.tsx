'use client'

import { useState } from 'react'
import api from '@/lib/api'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/api/auth/register/', { email, username: email, password })
      setMessage('Account created. Please log in.')
    } catch (err) {
      setMessage('Registration failed')
    }
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Create Account</h1>
      <form onSubmit={submit} className="space-y-3 max-w-md">
        <input className="w-full border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Register</button>
      </form>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </section>
  )
}
