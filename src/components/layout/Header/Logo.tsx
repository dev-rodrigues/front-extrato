/**
 * Logo - Componente de logo responsivo para header
 * Se adapta a diferentes breakpoints mantendo branding consistente
 * Inclui ícone GiKiwiBird como logo principal
 */

import { GiKiwiBird } from 'react-icons/gi'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'default' | 'compact' | 'mobile'
  className?: string
}

/**
 * Logo responsivo da aplicação com ícone GiKiwiBird
 * Variantes:
 * - default: Logo completo (desktop)
 * - compact: Logo compacto (tablet)
 * - mobile: Logo minimalista (mobile)
 */
export function Logo({ variant = 'default', className }: LogoProps) {
  const isCompact = variant === 'compact' || variant === 'mobile'
  const isMobile = variant === 'mobile'

  return (
    <div className={cn(
      'flex items-center space-x-2',
      isCompact && 'space-x-1.5',
      isMobile && 'space-x-1',
      className
    )}>
      {/* Logo GiKiwiBird */}
      <div className={cn(
        'flex-shrink-0',
        isCompact ? 'h-6 w-6' : 'h-8 w-8',
        isMobile && 'h-5 w-5'
      )}>
        <GiKiwiBird 
          className="w-full h-full text-primary-foreground" 
          aria-label="Logo Kiwi Bird"
        />
      </div>
      
      {/* Texto do logo */}
      <span className={cn(
        'font-bold text-primary-foreground',
        isCompact ? 'text-lg' : 'text-xl',
        isMobile && 'text-base',
        // Ocultar texto em mobile muito pequeno
        isMobile && 'hidden sm:inline'
      )}>
        {isMobile ? 'Kiwi' : 'Kiwi BB Extrato'}
      </span>
    </div>
  )
}
