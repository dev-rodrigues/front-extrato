import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'

// Páginas conforme RFCs
import { DashboardPage } from '@/pages/DashboardPage'
import { SchedulePage } from '@/pages/SchedulePage'
import { JobDetailsPage } from '@/pages/JobDetailsPage'
import { AccountsPage } from '@/pages/AccountsPage'
import { AccountDetailsPage } from '@/pages/AccountDetailsPage'
import { QueryLogsPage } from '@/pages/QueryLogsPage'
import { ImportsPage } from '@/pages/ImportsPage'
import { ImportDetailsPage } from '@/pages/ImportDetailsPage'
import { MovementsPage } from '@/pages/MovementsPage'

/**
 * Configuração de rotas baseada EXCLUSIVAMENTE nos RFCs
 * Mapeamento exato conforme documentação:
 * - Dashboard (/) - Métricas de schedule
 * - Schedule (/schedule) - Monitoramento de jobs
 * - Contas (/accounts) - Consulta de contas
 * - Detalhes da Conta (/accounts/:agencia/:contaCorrente)
 * - Logs (/accounts/:agencia/:contaCorrente/logs)
 * - Importações (/accounts/:agencia/:contaCorrente/imports)
 * - Movimentações (/accounts/:agencia/:contaCorrente/movements)
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
        // Dashboard principal com métricas de schedule
        // Endpoints: /api/schedule/progress, /api/schedule/stats, /api/schedule/health
      },
      {
        path: 'schedule',
        element: <SchedulePage />,
        // Monitoramento de schedule e jobs
        // Endpoints: /api/schedule/active, /api/schedule/progress, /api/schedule/job/{jobName}
        // Ações: POST /api/schedule/job/{jobName}/cancel
      },
      {
        path: 'schedule/job/:jobName',
        element: <JobDetailsPage />,
        // Detalhes específicos de um job
        // Endpoint: GET /api/schedule/job/{jobName}
        // Ações: POST /api/schedule/job/{jobName}/cancel
      },
      {
        path: 'accounts',
        element: <AccountsPage />,
        // Consulta de contas bancárias
        // Formulário de consulta com agência e conta
        // Navegação para detalhes específicos
      },
      {
        path: 'accounts/:agencia/:contaCorrente',
        element: <AccountDetailsPage />,
        // Detalhes específicos de uma conta
        // Navegação para logs, importações e movimentações
        // Endpoints: Navegação para sub-rotas
      },
      {
        path: 'accounts/:agencia/:contaCorrente/logs',
        element: <QueryLogsPage />,
        // Logs de consulta para uma conta específica
        // Endpoint: GET /api/accounts/{agencia}/{contaCorrente}/query-logs
        // Filtros: período (mês/ano ou datas específicas)
        // Paginação conforme padrão da API
      },
      {
        path: 'accounts/:agencia/:contaCorrente/imports',
        element: <ImportsPage />,
        // Histórico de importações para uma conta específica
        // Endpoint: GET /api/accounts/{agencia}/{contaCorrente}/imports
        // Filtros: período (mês/ano ou datas específicas)
        // Paginação conforme padrão da API
      },
      {
        path: 'accounts/:agencia/:contaCorrente/imports/:importId',
        element: <ImportDetailsPage />,
        // Detalhes específicos de uma importação
        // Endpoint: GET /api/accounts/{agencia}/{contaCorrente}/imports/{importId}
      },
      {
        path: 'accounts/:agencia/:contaCorrente/movements',
        element: <MovementsPage />,
        // Movimentações bancárias para uma conta específica
        // Endpoint: GET /api/accounts/{agencia}/{contaCorrente}/movements
        // Filtros: período (mês/ano ou datas específicas)
        // Paginação conforme padrão da API
      },
      {
        path: '*',
        element: (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-muted-foreground mb-4">404</h1>
              <p className="text-muted-foreground mb-4">Página não encontrada</p>
              <a href="/" className="text-primary hover:underline">
                Voltar ao Dashboard
              </a>
            </div>
          </div>
        ),
      },
    ],
  },
], {
  basename: "/front-extrato/"
})

/**
 * Estrutura de navegação conforme RFCs
 * Mapeamento exato das rotas para breadcrumbs e navegação
 */
export const navigationStructure = {
  dashboard: {
    path: '/',
    label: 'Dashboard',
    description: 'Visão geral do sistema com métricas principais'
  },
  schedule: {
    path: '/schedule',
    label: 'Schedule',
    description: 'Monitoramento de jobs e processos'
  },
  jobDetails: {
    path: '/schedule/job/:jobName',
    label: 'Detalhes do Job',
    description: 'Detalhes específicos de um job'
  },
  accounts: {
    path: '/accounts',
    label: 'Contas',
    description: 'Consulta de contas bancárias'
  },
  accountDetails: {
    path: '/accounts/:agencia/:contaCorrente',
    label: 'Detalhes da Conta',
    description: 'Detalhes específicos de uma conta'
  },
  logs: {
    path: '/accounts/:agencia/:contaCorrente/logs',
    label: 'Logs de Consulta',
    description: 'Histórico de consultas'
  },
  imports: {
    path: '/accounts/:agencia/:contaCorrente/imports',
    label: 'Importações',
    description: 'Histórico de importações'
  },
  importDetails: {
    path: '/accounts/:agencia/:contaCorrente/imports/:importId',
    label: 'Detalhes da Importação',
    description: 'Detalhes específicos de uma importação'
  },
  movements: {
    path: '/accounts/:agencia/:contaCorrente/movements',
    label: 'Movimentações',
    description: 'Histórico de movimentações'
  }
}

/**
 * Gera breadcrumbs para uma rota específica
 * @param pathname - Caminho atual da rota
 * @param params - Parâmetros da rota (agência, conta corrente)
 * @returns Array de breadcrumbs
 */
export const generateBreadcrumbs = (
  pathname: string, 
  params?: { agencia?: string; contaCorrente?: string }
): Array<{ label: string; path: string; active: boolean }> => {
  const breadcrumbs = [
    { label: 'Dashboard', path: '/', active: false }
  ]

  if (pathname.startsWith('/schedule')) {
    breadcrumbs.push({ label: 'Schedule', path: '/schedule', active: false })
    
    // Verificar se é uma rota de detalhes do job
    const jobMatch = pathname.match(/^\/schedule\/job\/(.+)$/)
    if (jobMatch) {
      breadcrumbs.push({ 
        label: 'Detalhes do Job', 
        path: pathname, 
        active: true 
      })
    } else {
      breadcrumbs[breadcrumbs.length - 1].active = true
    }
  } else if (pathname.startsWith('/accounts')) {
    breadcrumbs.push({ label: 'Contas', path: '/accounts', active: false })
    
    if (params?.agencia && params?.contaCorrente) {
      const accountPath = `/accounts/${params.agencia}/${params.contaCorrente}`
      breadcrumbs.push({ 
        label: `${params.agencia}/${params.contaCorrente}`, 
        path: accountPath, 
        active: pathname === accountPath 
      })
      
      if (pathname.includes('/logs')) {
        breadcrumbs.push({ label: 'Logs', path: `${accountPath}/logs`, active: true })
      } else if (pathname.includes('/imports')) {
        // Verificar se é uma rota de detalhes da importação
        const importMatch = pathname.match(/^\/accounts\/\d{4}\/\d{1,5}-\d\/imports\/(.+)$/)
        if (importMatch) {
          breadcrumbs.push({ label: 'Importações', path: `${accountPath}/imports`, active: false })
          breadcrumbs.push({ label: `Importação #${importMatch[1]}`, path: pathname, active: true })
        } else {
          breadcrumbs.push({ label: 'Importações', path: `${accountPath}/imports`, active: true })
        }
      } else if (pathname.includes('/movements')) {
        breadcrumbs.push({ label: 'Movimentações', path: `${accountPath}/movements`, active: true })
      }
    }
  }

  return breadcrumbs
}

/**
 * Valida se uma rota é válida conforme RFCs
 * @param pathname - Caminho da rota
 * @returns true se a rota for válida
 */
export const isValidRoute = (pathname: string): boolean => {
  const validRoutes = [
    '/',
    '/schedule',
    /^\/schedule\/job\/[^\/]+$/,
    '/accounts',
    /^\/accounts\/\d{4}\/\d{1,5}-\d$/,
    /^\/accounts\/\d{4}\/\d{1,5}-\d\/logs$/,
    /^\/accounts\/\d{4}\/\d{1,5}-\d\/imports$/,
    /^\/accounts\/\d{4}\/\d{1,5}-\d\/imports\/[^\/]+$/,
    /^\/accounts\/\d{4}\/\d{1,5}-\d\/movements$/
  ]

  return validRoutes.some(route => {
    if (typeof route === 'string') {
      return pathname === route
    }
    return route.test(pathname)
  })
}

/**
 * Extrai parâmetros de uma rota de conta
 * @param pathname - Caminho da rota
 * @returns Parâmetros extraídos ou null
 */
export const extractAccountParams = (pathname: string): { agencia: string; contaCorrente: string } | null => {
  const match = pathname.match(/^\/accounts\/(\d{4})\/(\d{1,5}-\d)/)
  if (match) {
    return {
      agencia: match[1],
      contaCorrente: match[2]
    }
  }
  return null
}
