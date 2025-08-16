/**
 * MobileMenu - Menu mobile usando componentes shadcn
 * Implementa navegação mobile com acessibilidade e UX otimizada
 */

import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Clock, 
  Building2,
  Menu
} from 'lucide-react'
import { GiKiwiBird } from 'react-icons/gi'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NavItem {
  path: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

/**
 * Menu mobile responsivo usando dropdown-menu do shadcn
 * Funcionalidades:
 * - Dropdown menu funcional
 * - Navegação por teclado
 * - Acessibilidade completa
 * - Animações suaves
 * - Logo integrado no cabeçalho
 */
export function MobileMenu() {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 text-primary-foreground hover:bg-primary-foreground/10 md:hidden"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-64 mt-2 mr-2"
        sideOffset={8}
      >
        {/* Cabeçalho do Menu com Logo */}
        <div className="px-3 py-3 border-b border-border/50">
          <div className="flex items-center space-x-3">
            <GiKiwiBird 
              className="h-6 w-6 text-primary" 
              aria-label="Logo Kiwi Bird"
            />
            <div>
              <h2 className="text-sm font-semibold text-foreground">Kiwi BB Extrato</h2>
            </div>
          </div>
        </div>
        
        {/* Itens de Navegação */}
        <div className="py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <DropdownMenuItem key={item.path} asChild>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2.5 rounded-sm transition-colors mx-2',
                    'hover:bg-accent hover:text-accent-foreground',
                    isActive(item.path) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground'
                  )}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </DropdownMenuItem>
            )
          })}
        </div>
        
        {/* Footer do Menu */}
        <div className="px-3 py-2 border-t border-border/50 bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            © 2024 COPPETEC
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Função utilitária para classes condicionais
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
