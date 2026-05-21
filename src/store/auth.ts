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
        // Mock authentication - accepts any credentials
        const user: User = {
          id: role === 'promotor' ? 'promotor-1' : 'gestao-1',
          email,
          name: role === 'promotor' ? 'João Promotor' : 'Admin Gestão',
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
