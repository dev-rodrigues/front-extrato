/**
 * Header - Componente principal do cabeçalho responsivo
 * Integra logo, navegação desktop e menu mobile com menu hambúrguer
 */

import { Logo } from './Logo'
import { DesktopNav } from './DesktopNav'
import { MobileMenu } from './MobileMenu'
import { LogoutButton } from '@/components/auth/LogoutButton'

/**
 * Header responsivo da aplicação
 * Funcionalidades:
 * - Logo adaptativo por breakpoint
 * - Navegação desktop (768px+)
 * - Menu hambúrguer para mobile
 * - Menu mobile com dropdown
 */
export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo variant="mobile" />
          </div>

          {/* Navegação Desktop */}
          <DesktopNav />

          {/* Botão de Logout */}
          <LogoutButton />

          {/* Menu Mobile */}
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
