import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Componente de breadcrumb para navegação hierárquica
 * Mostra o caminho atual na aplicação
 */

interface BreadcrumbItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

// Mapeamento de rotas para labels amigáveis
const routeLabels: Record<string, string> = {
  'consultas': 'Consultas',
  'nova-consulta': 'Nova Consulta',
  'historico': 'Histórico',
  'favoritos': 'Favoritos',
  'importacoes': 'Importações',
  'status': 'Status',
  'historico-arquivos': 'Histórico de Arquivos',
  'configuracoes': 'Configurações',
  'movimentacoes': 'Movimentações',
  'extratos': 'Extratos',
  'analise': 'Análise',
  'relatorios': 'Relatórios',
  'admin': 'Administração',
  'usuarios': 'Usuários',
  'logs': 'Logs',
}

// Mapeamento de rotas para ícones
const routeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'consultas': require('lucide-react').Search,
  'importacoes': require('lucide-react').Download,
  'movimentacoes': require('lucide-react').DollarSign,
  'admin': require('lucide-react').Settings,
}

export const Breadcrumb: React.FC = () => {
  const location = useLocation()
  
  // Gerar breadcrumbs baseado na rota atual
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    
    // Sempre incluir o home
    breadcrumbs.push({
      label: 'Dashboard',
      href: '/',
      icon: Home
    })
    
    // Construir breadcrumbs para cada segmento da rota
    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      const label = routeLabels[segment] || segment
      const icon = routeIcons[segment]
      
      breadcrumbs.push({
        label,
        href: currentPath,
        icon
      })
    })
    
    return breadcrumbs
  }
  
  const breadcrumbs = generateBreadcrumbs()
  
  // Não mostrar breadcrumb se estiver apenas no dashboard
  if (breadcrumbs.length <= 1) {
    return null
  }
  
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1
        const isFirst = index === 0
        
        return (
          <React.Fragment key={item.href}>
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-1" />
            )}
            
            {isLast ? (
              // Último item (página atual) - não é link
              <span className="flex items-center space-x-1 font-medium text-foreground">
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </span>
            ) : (
              // Itens anteriores - são links
              <Link
                to={item.href}
                className={cn(
                  'flex items-center space-x-1 hover:text-foreground transition-colors',
                  isFirst && 'text-foreground'
                )}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
