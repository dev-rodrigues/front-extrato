/**
 * Breadcrumbs - Componente de navegação conforme RFCs
 * Baseado em RFC-Frontend-Interface.md - Navegação e Breadcrumbs
 */

import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

/**
 * Componente de breadcrumbs para navegação
 * Implementa navegação hierárquica conforme RFCs:
 * - Dashboard > Schedule > Detalhes
 * - Dashboard > Contas > Agência > Conta > Seção
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const location = useLocation()

  if (!items || items.length === 0) {
    return null
  }

  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
      {/* Home */}
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span>Dashboard</span>
      </Link>

      {/* Separador */}
      <ChevronRight className="h-4 w-4" />

      {/* Itens de navegação */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {item.href ? (
            <Link
              to={item.href}
              className={cn(
                'flex items-center gap-1 hover:text-foreground transition-colors',
                location.pathname === item.href && 'text-foreground font-medium'
              )}
            >
              {item.icon && item.icon}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className="flex items-center gap-1 text-foreground font-medium">
              {item.icon && item.icon}
              <span>{item.label}</span>
            </span>
          )}

          {/* Separador (exceto para o último item) */}
          {index < items.length - 1 && (
            <ChevronRight className="h-4 w-4 ml-1" />
          )}
        </div>
      ))}
    </nav>
  )
}

/**
 * Hook para gerar breadcrumbs baseados na rota atual
 * Implementa mapeamento conforme RFCs
 */
export function useBreadcrumbs() {
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean)

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = []

    // Mapear rotas para breadcrumbs conforme RFCs
    if (pathSegments.length === 0) {
      return [] // Dashboard (página inicial)
    }

    if (pathSegments[0] === 'schedule') {
      breadcrumbs.push({
        label: 'Schedule',
        href: '/schedule'
      })
    }

    if (pathSegments[0] === 'accounts') {
      breadcrumbs.push({
        label: 'Contas',
        href: '/accounts'
      })

      // Se há agência e conta
      if (pathSegments.length >= 3) {
        const agencia = pathSegments[1]
        const contaCorrente = pathSegments[2]
        
        breadcrumbs.push({
          label: `${agencia}/${contaCorrente}`,
          href: `/accounts/${agencia}/${contaCorrente}`
        })

        // Se há sub-seção (logs, imports, movements)
        if (pathSegments.length >= 4) {
          const subSection = pathSegments[3]
          const subSectionLabels: Record<string, string> = {
            'logs': 'Logs de Consulta',
            'imports': 'Importações',
            'movements': 'Movimentações'
          }

          breadcrumbs.push({
            label: subSectionLabels[subSection] || subSection,
            href: `/accounts/${agencia}/${contaCorrente}/${subSection}`
          })
        }
      }
    }

    return breadcrumbs
  }

  return {
    breadcrumbs: generateBreadcrumbs(),
    currentPath: location.pathname
  }
}
