'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { usePantry } from '@/hooks/usePantry'
import api from '@/lib/api'

export default function SuggestMealsPage() {
  const { data: pantry } = usePantry()
  const [servings, setServings] = useState(2)
  const [recipes, setRecipes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    const selectedIngredients = pantry?.map((item: any) => ({ name: item.free_text_name, quantity: item.quantity, unit: item.unit })) || []
    const { data } = await api.post('/api/meals/suggest/', { ingredients: selectedIngredients, servings })
    setRecipes(data)
    setLoading(false)
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Suggest meals</h1>
      <div className="flex items-center gap-3">
        <label className="text-sm">Servings</label>
        <input className="border p-2 w-24" type="number" value={servings} onChange={(e) => setServings(Number(e.target.value))} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={generate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate meals'}
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {recipes.map((recipe, idx) => (
          <div key={idx} className="border bg-white rounded p-4 space-y-2">
            <h3 className="font-semibold">{recipe.title}</h3>
            <p className="text-sm text-gray-600">{recipe.description}</p>
            <p className="text-xs text-gray-500">Prep time: {recipe.prep_time_minutes} min</p>
            <ul className="text-xs list-disc ml-4">
              {recipe.ingredients?.map((ing: any, i: number) => (
                <li key={i}>{ing.name} – {ing.quantity} {ing.unit}</li>
              ))}
            </ul>
          </div>
        ))}
        {!recipes.length && <p className="text-sm text-gray-600">No recipes yet. Generate something!</p>}
      </div>
    </section>
  )
}
