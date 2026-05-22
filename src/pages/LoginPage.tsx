import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
      if (success) navigate(selectedRole === 'promotor' ? '/promotor' : '/gestao')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
          background: #FFFAF7;
        }
        .login-blob-top {
          position: absolute; top: -20%; right: -10%;
          width: 55vw; height: 55vw; max-width: 400px; max-height: 400px;
          border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, rgba(232,100,42,0.13) 0%, transparent 70%);
        }
        .login-blob-bottom {
          position: absolute; bottom: -15%; left: -10%;
          width: 45vw; height: 45vw; max-width: 340px; max-height: 340px;
          border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, rgba(243,178,60,0.12) 0%, transparent 70%);
        }
        .login-card {
          position: relative;
          width: 100%;
          max-width: 380px;
          background: #ffffff;
          border: 1px solid #E5E5E5;
          border-radius: 20px;
          padding: 36px 28px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04);
        }
        .login-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #E5E5E5;
          background: #FAFAFA;
          color: #1A1A1A;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .login-input::placeholder { color: #A3A3A3; }
        .login-input:focus {
          border-color: #E8642A;
          box-shadow: 0 0 0 3px rgba(232,100,42,0.12);
          background: #ffffff;
        }
        .login-input.error { border-color: #EF4444; }
        .login-label { color: #525252; font-size: 13px; font-weight: 500; display: block; margin-bottom: 6px; }
        .login-error { color: #EF4444; font-size: 12px; margin-top: 4px; }
        .login-role-btn {
          flex: 1;
          padding: 14px 8px;
          border-radius: 12px;
          border: 2px solid #E5E5E5;
          background: #FAFAFA;
          color: #A3A3A3;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .login-role-btn.active {
          border-color: #E8642A;
          background: #FFF5F0;
          color: #E8642A;
        }
        .login-role-btn:not(.active):hover {
          border-color: #D4D4D4;
          background: #F5F5F5;
          color: #525252;
        }
        .login-submit {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          background: linear-gradient(135deg, #E8642A, #d4551f);
          color: #fff;
          font-weight: 600;
          font-size: 15px;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
          box-shadow: 0 2px 12px rgba(232,100,42,0.3);
        }
        .login-submit:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .login-submit:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
        .login-creds {
          border: 1px solid #F0F0F0;
          border-radius: 12px;
          padding: 14px;
          background: #FAFAFA;
        }
        .login-creds-item {
          border-radius: 8px;
          padding: 10px 12px;
          background: #ffffff;
          border: 1px solid #E5E5E5;
        }
      `}</style>

      <div className="login-page">
        <div className="login-blob-top" />
        <div className="login-blob-bottom" />

        <div className="login-card">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/logo.png" alt="IE Pescados" style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
          </div>

          {/* Role Selector */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <button
              type="button"
              onClick={() => setSelectedRole('promotor')}
              className={cn('login-role-btn', selectedRole === 'promotor' && 'active')}
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Promotor
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('gestao')}
              className={cn('login-role-btn', selectedRole === 'gestao' && 'active')}
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Gestor
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="login-label" htmlFor="email">Email</label>
              <input
                {...register('email')}
                id="email"
                type="email"
                placeholder="seu@email.com"
                className={cn('login-input', errors.email && 'error')}
              />
              {errors.email && <p className="login-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="login-label" htmlFor="password">Senha</label>
              <input
                {...register('password')}
                id="password"
                type="password"
                placeholder="Sua senha"
                className={cn('login-input', errors.password && 'error')}
              />
              {errors.password && <p className="login-error">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="login-submit" style={{ marginTop: 4 }}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Credenciais de Teste */}
          <div className="login-creds" style={{ marginTop: 24 }}>
            <p style={{ color: '#A3A3A3', fontSize: 11, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 }}>
              Credenciais de Teste
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div className="login-creds-item">
                <p style={{ color: '#E8642A', fontWeight: 600, fontSize: 12, marginBottom: 4 }}>Promotor</p>
                <p style={{ color: '#737373', fontSize: 11 }}>promotor@ie.com</p>
                <p style={{ color: '#737373', fontSize: 11 }}>123456</p>
              </div>
              <div className="login-creds-item">
                <p style={{ color: '#E8642A', fontWeight: 600, fontSize: 12, marginBottom: 4 }}>Gestor</p>
                <p style={{ color: '#737373', fontSize: 11 }}>gestor@ie.com</p>
                <p style={{ color: '#737373', fontSize: 11 }}>123456</p>
              </div>
            </div>
          </div>

          <p style={{ color: '#D4D4D4', fontSize: 11, textAlign: 'center', marginTop: 20 }}>
            Gestão de Promotores v1.0
          </p>
        </div>
      </div>
    </>
  )
}
