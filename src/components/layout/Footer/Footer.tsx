/**
 * Footer - Componente de rodapé simplificado e sutil
 * Inclui logo e informações essenciais da aplicação
 */

import { GiKiwiBird } from 'react-icons/gi'
import { cn } from '@/lib/utils'
import { getFormattedVersion } from '@/version'

interface FooterProps {
  className?: string
}

/**
 * Footer sutil da aplicação com logo
 * Conteúdo:
 * - Logo GiKiwiBird
 * - Copyright simplificado
 * - Design minimalista
 */
export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn(
      'bg-muted/30 border-t mt-auto',
      className
    )}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center space-x-3">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <GiKiwiBird 
              className="h-5 w-5 text-muted-foreground" 
              aria-label="Logo Kiwi Bird"
            />
            <span className="text-sm font-medium text-muted-foreground">
              Kiwi {getFormattedVersion()}
            </span>
          </div>

          {/* Separador */}
          <span className="text-muted-foreground/50">•</span>

          {/* Copyright */}
          <span className="text-xs text-muted-foreground">
            © {currentYear} COPPETEC
          </span>
        </div>
      </div>
    </footer>
  )
}
