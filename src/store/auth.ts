import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role: 'promotor' | 'gestao') => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, _password: string, role: 'promotor' | 'gestao') => {
        const user: User = {
          id: role === 'promotor' ? 'current' : 'gestao-1',
          email,
          name: role === 'promotor' ? 'João Silva' : 'Carlos Mendonça',
          role,
        }
        set({ user, isAuthenticated: true })
        return true
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'ie-pescados-auth',
    }
  )
)
