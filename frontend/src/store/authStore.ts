import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../lib/axios'
import type { AuthState, User } from '../types'



export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const res = await api.post('/auth/login', { email, password })
          const { token, user } = res.data.data
          set({ token, user, isAuthenticated: true, isLoading: false })
        } catch (err: any) {
          set({ isLoading: false })
          throw err
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true })
        try {
          const res = await api.post('/auth/register', { name, email, password })
          const { token, user } = res.data.data
          set({ token, user, isAuthenticated: true, isLoading: false })
        } catch (err: any) {
          set({ isLoading: false })
          throw err
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },

      fetchMe: async () => {
        try {
          const res = await api.get('/auth/me')
          set({ user: res.data.data, isAuthenticated: true })
        } catch (err: any) {
          if (err.response?.status === 401) {
            set({ user: null, token: null, isAuthenticated: false })
          }
        }
      },
    }),
    {
      name: 'lms-auth',
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
