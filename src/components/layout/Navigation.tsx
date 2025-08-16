/**
 * Navigation - Componente de navegação responsiva conforme RFCs
 * Baseado em RFC-Frontend-Interface.md
 * 
 * NOTA: Este componente foi refatorado para usar o novo Header responsivo
 * A navegação agora é gerenciada pelos componentes Header/DesktopNav/MobileMenu
 */

import { Link, useLocation } from 'react-router-dom'
import { 
  Activity, 
  Building2, 
  Clock, 
  Home 
} from 'lucide-react'

/**
 * Navegação responsiva da aplicação
 * Implementa rotas conforme RFCs:
 * - Dashboard (/)
 * - Schedule (/schedule)
 * - Contas (/accounts)
 * 
 * @deprecated Use os componentes Header, DesktopNav e MobileMenu para navegação responsiva
 */
export function Navigation() {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const navItems = [
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

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8" />
            <span className="text-xl font-bold">COPPETEC BB Extrato</span>
          </div>

          {/* Navegação */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                    ${isActive(item.path) 
                      ? 'bg-primary-foreground/20 text-primary-foreground' 
                      : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
