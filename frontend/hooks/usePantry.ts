import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export function usePantry() {
  return useQuery({
    queryKey: ['pantry'],
    queryFn: async () => {
      const { data } = await api.get('/api/pantry/')
      return data
    }
  })
}
