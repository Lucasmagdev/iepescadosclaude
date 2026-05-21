import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Logo } from '@/components/Logo'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [selectedRole, setSelectedRole] = useState<'promotor' | 'gestao'>('promotor')
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })
  
  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      const success = await login(data.email, data.password, selectedRole)
      if (success) {
        navigate(selectedRole === 'promotor' ? '/promotor' : '/gestao')
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo className="scale-125" />
        </div>
        
        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSelectedRole('promotor')}
            className={cn(
              'p-4 rounded-xl border-2 text-center transition-all',
              selectedRole === 'promotor'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted-foreground/30'
            )}
          >
            <div className="text-2xl mb-1">
              <svg className="w-8 h-8 mx-auto text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-foreground">Sou Promotor</span>
          </button>
          
          <button
            type="button"
            onClick={() => setSelectedRole('gestao')}
            className={cn(
              'p-4 rounded-xl border-2 text-center transition-all',
              selectedRole === 'gestao'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted-foreground/30'
            )}
          >
            <div className="text-2xl mb-1">
              <svg className="w-8 h-8 mx-auto text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-foreground">Sou Gestor</span>
          </button>
        </div>
        
        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              placeholder="seu@email.com"
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all',
                errors.email && 'border-destructive focus:ring-destructive/50'
              )}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
              Senha
            </label>
            <input
              {...register('password')}
              type="password"
              id="password"
              placeholder="Sua senha"
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all',
                errors.password && 'border-destructive focus:ring-destructive/50'
              )}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        {/* Credenciais de Exemplo */}
        <div className="bg-muted/50 rounded-xl p-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground text-center uppercase tracking-wide">
            Credenciais de Teste
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-background rounded-lg p-3 border">
              <p className="font-semibold text-foreground mb-1">Promotor</p>
              <p className="text-muted-foreground">promotor@ie.com</p>
              <p className="text-muted-foreground">123456</p>
            </div>
            <div className="bg-background rounded-lg p-3 border">
              <p className="font-semibold text-foreground mb-1">Gestor</p>
              <p className="text-muted-foreground">gestor@ie.com</p>
              <p className="text-muted-foreground">123456</p>
            </div>
          </div>
        </div>
        
        <p className="text-center text-xs text-muted-foreground">
          Gestão de Promotores v1.0
        </p>
      </div>
    </div>
  )
}
