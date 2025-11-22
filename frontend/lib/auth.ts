'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './api'

type AuthResponse = {
  access: string
  refresh: string
  user: {
    id: number
    email: string
    first_name: string
    last_name: string
  }
}

export const useRegister = () => {
  const queryClient = useQueryClient()
  return useMutation<{ access: string; refresh: string; user: AuthResponse['user'] }, Error, { email: string; password: string; first_name?: string; last_name?: string }>(
    async (payload) => {
      const res = await api.post('/api/auth/register/', payload)
      return res.data
    },
    {
      onSuccess: (data) => {
        localStorage.setItem('access', data.access)
        localStorage.setItem('refresh', data.refresh)
        queryClient.invalidateQueries({ queryKey: ['me'] })
      },
    }
  )
}

export const useLogin = () => {
  const queryClient = useQueryClient()
  return useMutation<AuthResponse, Error, { email: string; password: string }>(
    async (payload) => {
      const res = await api.post('/api/auth/login/', payload)
      return res.data
    },
    {
      onSuccess: (data) => {
        localStorage.setItem('access', data.access)
        localStorage.setItem('refresh', data.refresh)
        queryClient.invalidateQueries({ queryKey: ['me'] })
      },
    }
  )
}

export const useMe = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get('/api/auth/me/')
      return res.data as AuthResponse['user']
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
