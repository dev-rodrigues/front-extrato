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
  { icon: FileText, label: 'Logs', href: '/logs' },
  { icon: Upload, label: 'Importações', href: '/importacoes' },
  { icon: Database, label: 'Movimentações', href: '/movimentacoes' },
  { icon: BarChart3, label: 'Relatórios', href: '/relatorios' },
  { icon: Settings, label: 'Configurações', href: '/configuracoes' },
]

export const Sidebar = () => {
  return (
    <aside className="w-64 min-w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <a href={item.href}>
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </a>
          </Button>
        ))}
      </nav>
    </aside>
  )
}
