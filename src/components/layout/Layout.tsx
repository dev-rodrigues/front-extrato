/**
 * Layout - Componente de layout principal responsivo conforme RFCs
 * Baseado em RFC-Frontend-Interface.md
 * 
 * Implementa layout responsivo com:
 * - Header com menu hambúrguer para mobile
 * - Navegação desktop para telas maiores
 * - Footer informativo e responsivo
 * - Conteúdo principal adaptativo
 */

import { Outlet } from 'react-router-dom'
import { Header } from './Header/Header'
import { Footer } from './Footer/Footer'

interface LayoutProps {
  children?: React.ReactNode
}

/**
 * Layout principal responsivo da aplicação
 * Funcionalidades:
 * - Header responsivo com navegação adaptativa
 * - Conteúdo principal com padding responsivo
 * - Footer informativo e responsivo
 * - Layout mobile-first otimizado
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header responsivo com navegação */}
      <Header />
      
      {/* Conteúdo principal */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children || <Outlet />}
      </main>
      
      {/* Footer responsivo */}
      <Footer />
    </div>
  )
}
