import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Search, 
  FileText, 
  Upload, 
  BarChart3, 
  Settings,
  Database
} from 'lucide-react'

const navigationItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Search, label: 'Consulta', href: '/consulta' },
  { icon: FileText, label: 'Logs', href: '/consulta/logs' },
  { icon: Upload, label: 'Importações', href: '/importacoes' },
  { icon: Database, label: 'Movimentações', href: '/movimentacoes' },
  { icon: BarChart3, label: 'Relatórios', href: '/relatorios' },
  { icon: Settings, label: 'Configurações', href: '/configuracoes' },
]

export const Sidebar = () => {
  const location = useLocation()

  return (
    <aside className="w-64 min-w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href || 
                          (item.href !== '/' && location.pathname.startsWith(item.href))
          
          return (
            <Button
              key={item.href}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start ${isActive ? 'bg-primary text-primary-foreground' : ''}`}
              asChild
            >
              <Link to={item.href}>
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          )
        })}
      </nav>
    </aside>
  )
}
