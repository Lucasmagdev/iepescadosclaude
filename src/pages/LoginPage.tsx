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
        .login-ocean {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(28,91,122,0.7) 0%, transparent 55%),
            radial-gradient(ellipse at 20% 80%, rgba(14,50,80,0.5) 0%, transparent 45%),
            linear-gradient(180deg, #071525 0%, #07111d 55%, #050e18 100%);
        }
        .login-sea {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.55;
          background:
            repeating-linear-gradient(108deg, rgba(255,255,255,0.055) 0 1px, transparent 1px 30px),
            repeating-linear-gradient(22deg, rgba(232,100,42,0.045) 0 1px, transparent 1px 44px);
          filter: blur(0.5px);
          transform: scale(1.15) rotate(-3deg);
        }
        .login-rays {
          position: absolute;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 120%;
          height: 80%;
          pointer-events: none;
          background:
            conic-gradient(from -15deg at 50% 0%,
              transparent 0deg,
              rgba(255,255,255,0.028) 4deg,
              transparent 8deg,
              transparent 16deg,
              rgba(255,255,255,0.022) 20deg,
              transparent 24deg,
              transparent 35deg,
              rgba(255,255,255,0.018) 38deg,
              transparent 42deg,
              transparent 52deg,
              rgba(255,255,255,0.025) 56deg,
              transparent 60deg
            );
          filter: blur(8px);
          opacity: 0.8;
        }
        .login-glow {
          position: absolute;
          width: 50%;
          height: 40%;
          top: -5%;
          left: 25%;
          pointer-events: none;
          background: radial-gradient(ellipse, rgba(232,100,42,0.15) 0%, rgba(100,180,220,0.08) 50%, transparent 70%);
          filter: blur(30px);
        }
        .login-vignette {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(3,7,12,0.5) 100%);
        }
        .login-card {
          position: relative;
          width: 100%;
          max-width: 380px;
          background: rgba(7, 18, 30, 0.72);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 36px 28px;
          box-shadow: 0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .login-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          color: #fff;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .login-input::placeholder { color: rgba(255,255,255,0.35); }
        .login-input:focus {
          border-color: rgba(232,100,42,0.6);
          box-shadow: 0 0 0 3px rgba(232,100,42,0.15);
        }
        .login-input.error { border-color: rgba(239,68,68,0.6); }
        .login-label { color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 500; display: block; margin-bottom: 6px; }
        .login-error { color: #f87171; font-size: 12px; margin-top: 4px; }
        .login-role-btn {
          flex: 1;
          padding: 14px 8px;
          border-radius: 12px;
          border: 2px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .login-role-btn.active {
          border-color: #E8642A;
          background: rgba(232,100,42,0.12);
          color: #fff;
        }
        .login-role-btn:not(.active):hover {
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.07);
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
        }
        .login-submit:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .login-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .login-creds {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px;
          background: rgba(255,255,255,0.03);
        }
        .login-creds-item {
          border-radius: 8px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.06);
        }
      `}</style>

      <div className="login-ocean">
        <div className="login-sea" />
        <div className="login-rays" />
        <div className="login-glow" />
        <div className="login-vignette" />

        <div className="login-card">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/logo.png" alt="IE Pescados" style={{ height: 52, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
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
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 }}>
              Credenciais de Teste
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div className="login-creds-item">
                <p style={{ color: '#fff', fontWeight: 600, fontSize: 12, marginBottom: 4 }}>Promotor</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>promotor@ie.com</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>123456</p>
              </div>
              <div className="login-creds-item">
                <p style={{ color: '#fff', fontWeight: 600, fontSize: 12, marginBottom: 4 }}>Gestor</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>gestor@ie.com</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>123456</p>
              </div>
            </div>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, textAlign: 'center', marginTop: 20 }}>
            Gestão de Promotores v1.0
          </p>
        </div>
      </div>
    </>
  )
}
