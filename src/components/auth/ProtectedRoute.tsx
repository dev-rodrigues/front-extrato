/**
 * ProtectedRoute - Componente de proteção de rotas
 * Verifica autenticação e salva página atual para redirecionamento após login
 */

import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, setCurrentPage } = useAuthStore()

  // Salvar página atual sempre que mudar
  useEffect(() => {
    setCurrentPage(location.pathname)
  }, [location.pathname, setCurrentPage])

  // Verificar autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      // Salvar página atual antes de redirecionar
      setCurrentPage(location.pathname)
      
      // Redirecionar para login com informação da página atual
      navigate('/login', { 
        state: { from: location },
        replace: true 
      })
    }
  }, [isAuthenticated, navigate, location, setCurrentPage])

  // Se não estiver autenticado, não renderizar nada
  if (!isAuthenticated) {
    return null
  }

  // Se estiver autenticado, renderizar children
  return <>{children}</>
}
