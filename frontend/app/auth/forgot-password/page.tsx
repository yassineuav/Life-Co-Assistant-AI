'use client'

import { useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    try {
      const { data } = await api.post('/api/auth/password-reset/', { email })
      setMessage(data.detail || 'If an account exists, reset instructions have been sent.')
    } catch (err) {
      setMessage('Unable to send reset instructions right now.')
    }
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Forgot Password</h1>
      <p className="text-sm text-gray-600">Enter your account email and we will send reset instructions if the account exists.</p>
      <form onSubmit={submit} className="space-y-3 max-w-md">
        <input
          className="w-full border p-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Send reset link</button>
      </form>
      {message && <p className="text-sm text-gray-700">{message}</p>}
      <div className="text-sm text-blue-700">
        <Link href="/auth/login">Back to login</Link>
      </div>
    </section>
  )
}
