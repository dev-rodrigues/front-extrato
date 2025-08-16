import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Search, 
  Download, 
  DollarSign, 
  Settings,
  ChevronRight,
  Home,
  History,
  Star,
  FileText,
  BarChart3,
  Users,
  Shield,
  Activity
} from 'lucide-react'

/**
 * Componente de navegação principal
 * Implementa estrutura de menus hierárquica conforme planejado
 */

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  children?: NavigationItem[]
  badge?: string | number
  disabled?: boolean
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    id: 'consultas',
    label: 'Consultas',
    icon: Search,
    href: '/consultas',
    children: [
      {
        id: 'nova-consulta',
        label: 'Nova Consulta',
        icon: Search,
        href: '/consultas/nova-consulta',
      },
      {
        id: 'historico',
        label: 'Histórico de Consultas',
        icon: History,
        href: '/consultas/historico',
      },
      {
        id: 'favoritos',
        label: 'Consultas Favoritas',
        icon: Star,
        href: '/consultas/favoritos',
      },
    ],
  },
  {
    id: 'importacoes',
    label: 'Importações',
    icon: Download,
    href: '/importacoes',
    children: [
      {
        id: 'status',
        label: 'Status de Importações',
        icon: Activity,
        href: '/importacoes/status',
        badge: '3',
      },
      {
        id: 'historico-arquivos',
        label: 'Histórico de Arquivos',
        icon: FileText,
        href: '/importacoes/historico',
      },
      {
        id: 'configuracoes',
        label: 'Configurações de Importação',
        icon: Settings,
        href: '/importacoes/configuracoes',
      },
    ],
  },
  {
    id: 'movimentacoes',
    label: 'Movimentações',
    icon: DollarSign,
    href: '/movimentacoes',
    children: [
      {
        id: 'extratos',
        label: 'Extratos por Período',
        icon: FileText,
        href: '/movimentacoes/extratos',
      },
      {
        id: 'analise',
        label: 'Análise de Movimentações',
        icon: BarChart3,
        href: '/movimentacoes/analise',
      },
      {
        id: 'relatorios',
        label: 'Relatórios',
        icon: BarChart3,
        href: '/movimentacoes/relatorios',
      },
    ],
  },
  {
    id: 'admin',
    label: 'Administração',
    icon: Settings,
    href: '/admin',
    children: [
      {
        id: 'configuracoes-sistema',
        label: 'Configurações do Sistema',
        icon: Settings,
        href: '/admin/configuracoes',
      },
      {
        id: 'logs',
        label: 'Logs de Auditoria',
        icon: Activity,
        href: '/admin/logs',
      },
      {
        id: 'usuarios',
        label: 'Usuários e Permissões',
        icon: Users,
        href: '/admin/usuarios',
      },
    ],
  },
]

interface NavigationItemProps {
  item: NavigationItem
  isActive: boolean
  isExpanded: boolean
  onToggle: (id: string) => void
  level?: number
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  item,
  isActive,
  isExpanded,
  onToggle,
  level = 0
}) => {
  const hasChildren = item.children && item.children.length > 0
  const isExpandable = hasChildren && !item.disabled

  return (
    <div className="space-y-1">
      <Link
        to={item.href}
        className={cn(
          'group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          isActive
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground',
          item.disabled && 'opacity-50 cursor-not-allowed',
          level > 0 && 'ml-4'
        )}
        onClick={() => {
          if (isExpandable) {
            onToggle(item.id)
          }
        }}
      >
        <div className="flex items-center space-x-3">
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {item.badge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
              {item.badge}
            </span>
          )}
          
          {isExpandable && (
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
          )}
        </div>
      </Link>

      {hasChildren && isExpanded && (
        <div className="space-y-1">
          {item.children!.map((child) => (
            <NavigationItem
              key={child.id}
              item={child}
              isActive={useLocation().pathname === child.href}
              isExpanded={false}
              onToggle={onToggle}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface MainNavigationProps {
  className?: string
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ className }) => {
  const location = useLocation()
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())

  // Expandir automaticamente o item ativo
  React.useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    if (pathSegments.length > 0) {
      const parentId = pathSegments[0]
      setExpandedItems(prev => new Set([...prev, parentId]))
    }
  }, [location.pathname])

  const handleToggle = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <nav className={cn('space-y-2', className)}>
      {/* Header da navegação */}
      <div className="px-3 py-2">
        <h2 className="text-lg font-semibold tracking-tight">Navegação</h2>
        <p className="text-xs text-muted-foreground">
          Sistema de Consulta de Extratos
        </p>
      </div>

      {/* Lista de navegação */}
      <div className="space-y-1">
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            isActive={location.pathname === item.href}
            isExpanded={expandedItems.has(item.id)}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {/* Footer da navegação */}
      <div className="px-3 py-2 border-t">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>v1.0.0</span>
        </div>
      </div>
    </nav>
  )
}

export default MainNavigation
