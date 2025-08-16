/**
 * DesktopNav - Navegação desktop para telas maiores (768px+)
 * Implementa navegação horizontal com indicadores de rota ativa
 */

import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Clock, 
  Building2 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  path: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

/**
 * Navegação desktop responsiva
 * Exibida apenas em telas de 768px+
 */
export function DesktopNav() {
  const location = useLocation()

  const navItems: NavItem[] = [
    {
      path: '/',
      label: 'Dashboard',
      icon: Home
    },
    {
      path: '/schedule',
      label: 'Schedule',
      icon: Clock
    },
    {
      path: '/accounts',
      label: 'Contas',
      icon: Building2
    }
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="hidden md:flex items-center space-x-1" aria-label="Navegação principal">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200',
              'hover:bg-primary-foreground/10 hover:scale-105',
              isActive(item.path) 
                ? 'bg-primary-foreground/20 text-primary-foreground shadow-sm' 
                : 'text-primary-foreground/80 hover:text-primary-foreground'
            )}
            aria-current={isActive(item.path) ? 'page' : undefined}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
