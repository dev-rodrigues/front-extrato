import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export const Breadcrumb = () => {
  const location = useLocation()
  
  // Função para gerar breadcrumbs baseado na rota atual
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(Boolean)
    const breadcrumbs = [
      { name: 'Dashboard', path: '/', icon: Home }
    ]
    
    let currentPath = ''
    pathnames.forEach((name, index) => {
      currentPath += `/${name}`
      
      // Mapear nomes amigáveis para as rotas
      const friendlyName = getFriendlyName(name, index, pathnames)
      
      breadcrumbs.push({
        name: friendlyName,
        path: currentPath,
        icon: null
      })
    })
    
    return breadcrumbs
  }
  
  // Função para obter nomes amigáveis das rotas
  const getFriendlyName = (name: string, index: number, pathnames: string[]) => {
    const nameMap: Record<string, string> = {
      'consulta': 'Consulta',
      'logs': 'Logs',
      'resultados': 'Resultados',
      'importacoes': 'Importações',
      'movimentacoes': 'Movimentações',
      'relatorios': 'Relatórios',
      'configuracoes': 'Configurações'
    }
    
    return nameMap[name] || name.charAt(0).toUpperCase() + name.slice(1)
  }
  
  const breadcrumbs = generateBreadcrumbs()
  
  if (breadcrumbs.length <= 1) {
    return null // Não mostrar breadcrumb na página inicial
  }
  
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.path} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 mx-2" />
          )}
          
          {index === breadcrumbs.length - 1 ? (
            // Último item (página atual)
            <span className="font-medium text-foreground">
              {breadcrumb.icon && <breadcrumb.icon className="h-4 w-4 inline mr-1" />}
              {breadcrumb.name}
            </span>
          ) : (
            // Links navegáveis
            <Link
              to={breadcrumb.path}
              className="hover:text-foreground transition-colors flex items-center"
            >
              {breadcrumb.icon && <breadcrumb.icon className="h-4 w-4 mr-1" />}
              {breadcrumb.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
