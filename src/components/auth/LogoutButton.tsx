/**
 * LogoutButton - Componente de logout com indicador de tempo restante
 * Mostra tempo restante da sessão e permite logout manual
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { Button } from '@/components/ui/button'
import { LogOut, Clock } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const TIMEOUT_MINUTES = 30

export function LogoutButton() {
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const { logout, lastActivity, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  // Calcular tempo restante da sessão
  useEffect(() => {
    if (!isAuthenticated) return

    const updateTimeRemaining = () => {
      const now = Date.now()
      const elapsed = now - lastActivity
      const timeoutMs = TIMEOUT_MINUTES * 60 * 1000
      const remaining = timeoutMs - elapsed

      if (remaining <= 0) {
        setTimeRemaining('Expirada')
        logout()
        navigate('/login')
        return
      }

      const minutes = Math.floor(remaining / 60000)
      const seconds = Math.floor((remaining % 60000) / 1000)
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`)
    }

    // Atualizar imediatamente
    updateTimeRemaining()

    // Atualizar a cada segundo
    const interval = setInterval(updateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [lastActivity, isAuthenticated, logout, navigate])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!isAuthenticated) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/80">
          <Clock className="w-4 h-4 mr-2" />
          {timeRemaining}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2 text-sm text-gray-600">
          <div className="font-medium">Sessão Ativa</div>
          <div className="text-xs text-gray-500">
            Tempo restante: {timeRemaining}
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          Sair do Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
