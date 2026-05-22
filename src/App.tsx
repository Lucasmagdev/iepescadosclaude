import { useEffect, useState, useCallback } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/auth'
import { useVisitStore } from './store/visits'
import LoginPage from './pages/LoginPage'
import PromotorLayout from './layouts/PromotorLayout'
import GestaoLayout from './layouts/GestaoLayout'
import RoteiroPage from './pages/promotor/RoteiroPage'
import VisitPage from './pages/promotor/VisitPage'
import TarefasPage from './pages/promotor/TarefasPage'
import OcorrenciasPage from './pages/promotor/OcorrenciasPage'
import NotificacoesPage from './pages/promotor/NotificacoesPage'
import MaisPage from './pages/promotor/MaisPage'
import DashboardPage from './pages/gestao/DashboardPage'
import PromotoresPage from './pages/gestao/PromotoresPage'
import PromotorDetailPage from './pages/gestao/PromotorDetailPage'
import LojasPage from './pages/gestao/LojasPage'
import MapaPage from './pages/gestao/MapaPage'
import RelatorioPage from './pages/gestao/RelatorioPage'
import FotosPage from './pages/gestao/FotosPage'
import ConfigPage from './pages/gestao/ConfigPage'
import { Toaster } from 'sonner'
import { OfflineIndicator } from './components/OfflineIndicator'
import { InstallPrompt } from './components/InstallPrompt'
import { UpdateNotification } from './components/UpdateNotification'
import { SplashScreen } from './components/SplashScreen'

function ProtectedRoute({ children, role }: { children: React.ReactNode; role: 'promotor' | 'gestao' }) {
  const { isAuthenticated, user } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (user?.role !== role) {
    return <Navigate to={user?.role === 'promotor' ? '/promotor' : '/gestao'} replace />
  }
  
  return <>{children}</>
}

export default function App() {
  const { isAuthenticated, user } = useAuthStore()
  const loadFromDB = useVisitStore((s) => s.loadFromDB)
  const [showSplash, setShowSplash] = useState(true)
  const handleSplashDone = useCallback(() => setShowSplash(false), [])

  useEffect(() => { void loadFromDB() }, [])

  return (
    <>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
      <Routes>
        <Route path="/login" element={
          isAuthenticated 
            ? <Navigate to={user?.role === 'promotor' ? '/promotor' : '/gestao'} replace />
            : <LoginPage />
        } />
        
        <Route path="/promotor" element={
          <ProtectedRoute role="promotor">
            <PromotorLayout />
          </ProtectedRoute>
        }>
          <Route index element={<RoteiroPage />} />
          <Route path="visita/:visitId" element={<VisitPage />} />
          <Route path="tarefas" element={<TarefasPage />} />
          <Route path="ocorrencias" element={<OcorrenciasPage />} />
          <Route path="notificacoes" element={<NotificacoesPage />} />
          <Route path="mais" element={<MaisPage />} />
        </Route>
        
        <Route path="/gestao" element={
          <ProtectedRoute role="gestao">
            <GestaoLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="promotores" element={<PromotoresPage />} />
          <Route path="promotores/:promotorId" element={<PromotorDetailPage />} />
          <Route path="lojas" element={<LojasPage />} />
          <Route path="mapa" element={<MapaPage />} />
          <Route path="relatorio" element={<RelatorioPage />} />
          <Route path="fotos" element={<FotosPage />} />
          <Route path="config" element={<ConfigPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-center" richColors />
      <OfflineIndicator />
      <InstallPrompt />
      <UpdateNotification />
    </>
  )
}
