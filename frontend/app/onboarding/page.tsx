'use client'

import { useState } from 'react'
import api from '@/lib/api'

const options = ['OMNIVORE', 'VEGETARIAN', 'VEGAN', 'HALAL', 'KOSHER', 'OTHER']

export default function OnboardingPage() {
  const [diet, setDiet] = useState('')
  const [country, setCountry] = useState('')
  const [message, setMessage] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.patch('/api/auth/me/', { diet_type: diet, country })
      setMessage('Profile updated!')
    } catch (err) {
      setMessage('Update failed')
    }
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Onboarding</h1>
      <form onSubmit={submit} className="space-y-3 max-w-md">
        <input className="w-full border p-2" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
        <select className="w-full border p-2" value={diet} onChange={(e) => setDiet(e.target.value)}>
          <option value="">Diet type</option>
          {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Save</button>
      </form>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </section>
  )
}
