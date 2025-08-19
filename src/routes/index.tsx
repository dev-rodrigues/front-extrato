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
import constants from "../../vite.constants";

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
