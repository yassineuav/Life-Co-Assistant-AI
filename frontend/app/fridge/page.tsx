'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { usePantry } from '@/hooks/usePantry'
import api from '@/lib/api'

export default function FridgePage() {
  const { data, isLoading } = usePantry()
  const qc = useQueryClient()
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [unit, setUnit] = useState('pcs')

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.post('/api/pantry/', { free_text_name: name, quantity, unit })
    setName(''); setQuantity(1)
    qc.invalidateQueries({ queryKey: ['pantry'] })
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Your fridge</h1>
      <form onSubmit={addItem} className="flex flex-wrap gap-2 items-center">
        <input className="border p-2" placeholder="Ingredient" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border p-2 w-20" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        <input className="border p-2 w-24" value={unit} onChange={(e) => setUnit(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Add</button>
      </form>
      <div className="bg-white border rounded p-4">
        {isLoading ? 'Loading...' : (
          <ul className="space-y-2">
            {data?.map((item: any) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span>{item.free_text_name || item.ingredient?.name}</span>
                <span>{item.quantity} {item.unit}</span>
              </li>
            )) || <p>No items yet.</p>}
          </ul>
        )}
      </div>
    </section>
  )
}
