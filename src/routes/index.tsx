import {createBrowserRouter} from 'react-router-dom'
import {Layout} from '@/components/layout/Layout'
import {DashboardPage} from '@/pages/DashboardPage'
import {SchedulePage} from '@/pages/SchedulePage'
import {AccountsPage} from '@/pages/AccountsPage'
import {MovementsPage} from '@/pages/MovementsPage'
import {ImportsPage} from '@/pages/ImportsPage'
import {ImportDetailsPage} from '@/pages/ImportDetailsPage'
import {AccountDetailsPage} from '@/pages/AccountDetailsPage'
import {JobDetailsPage} from '@/pages/JobDetailsPage'
import {QueryLogsPage} from '@/pages/QueryLogsPage'
import constants from "../vite.constants";

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
        element: <Layout/>,
        children: [
            {
                index: true,
                element: <DashboardPage/>, // Dashboard principal com métricas de schedule
                // Endpoints: /api/schedule/progress, /api/schedule/stats, /api/schedule/health
            },
            {
                path: 'schedule',
                element: <SchedulePage/>, // Monitoramento de schedule e jobs
                // Endpoints: /api/schedule/active, /api/schedule/progress, /api/schedule/job/{jobName}
                // Ações: POST /api/schedule/job/{jobName}/cancel
            },
            {
                path: 'accounts',
                element: <AccountsPage/>, // Lista de contas
                // Endpoints: /api/accounts
            },
            {
                path: 'movements',
                element: <MovementsPage/>, // Movimentações financeiras
                // Endpoints: /api/movements
            },
            {
                path: 'imports',
                element: <ImportsPage/>, // Histórico de importações
                // Endpoints: /api/imports
            },
            {
                path: 'imports/:importId',
                element: <ImportDetailsPage/>, // Detalhes da importação
                // Endpoints: /api/imports/{importId}
            },
            {
                path: 'accounts/:accountId',
                element: <AccountDetailsPage/>, // Detalhes da conta
                // Endpoints: /api/accounts/{accountId}
            },
            {
                path: 'schedule/job/:jobName',
                element: <JobDetailsPage/>, // Detalhes do job
                // Endpoints: /api/schedule/job/{jobName}
            },
            {
                path: 'query-logs',
                element: <QueryLogsPage/>, // Logs de consultas
                // Endpoints: /api/query-logs
            }
        ]
    }
], {
    basename: constants.basepath
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
        {label: 'Dashboard', path: '/', active: false}
    ]

    if (pathname.startsWith('/schedule')) {
        breadcrumbs.push({label: 'Schedule', path: '/schedule', active: false})

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
        breadcrumbs.push({label: 'Contas', path: '/accounts', active: false})

        if (params?.agencia && params?.contaCorrente) {
            const accountPath = `/accounts/${params.agencia}/${params.contaCorrente}`
            breadcrumbs.push({
                label: `${params.agencia}/${params.contaCorrente}`,
                path: accountPath,
                active: pathname === accountPath
            })

            if (pathname.includes('/logs')) {
                breadcrumbs.push({label: 'Logs', path: `${accountPath}/logs`, active: true})
            } else if (pathname.includes('/imports')) {
                // Verificar se é uma rota de detalhes da importação
                const importMatch = pathname.match(/^\/accounts\/\d{4}\/\d{1,5}-\d\/imports\/(.+)$/)
                if (importMatch) {
                    breadcrumbs.push({label: 'Importações', path: `${accountPath}/imports`, active: false})
                    breadcrumbs.push({label: `Importação #${importMatch[1]}`, path: pathname, active: true})
                } else {
                    breadcrumbs.push({label: 'Importações', path: `${accountPath}/imports`, active: true})
                }
            } else if (pathname.includes('/movements')) {
                breadcrumbs.push({label: 'Movimentações', path: `${accountPath}/movements`, active: true})
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
