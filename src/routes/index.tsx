import {createBrowserRouter} from 'react-router-dom'
import {Layout} from '@/components/layout/Layout'
import {LoginPage} from '@/pages/LoginPage'
import {DashboardPage} from '@/pages/DashboardPage'
import {SchedulePage} from '@/pages/SchedulePage'
import {AccountsPage} from '@/pages/AccountsPage'
import {MovementsPage} from '@/pages/MovementsPage'
import {ImportsPage} from '@/pages/ImportsPage'
import {ImportDetailsPage} from '@/pages/ImportDetailsPage'
import {AccountDetailsPage} from '@/pages/AccountDetailsPage'
import {JobDetailsPage} from '@/pages/JobDetailsPage'
import {QueryLogsPage} from '@/pages/QueryLogsPage'
import {ProtectedRoute} from '@/components/auth/ProtectedRoute'
import {NotFoundPage, GenericErrorPage} from '@/components/ui/ErrorPage'
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
        path: '/login',
        element: <LoginPage/>,
        errorElement: <GenericErrorPage/>
    },
    {
        path: '/404',
        element: <NotFoundPage/>
    },
    {
        path: '/',
        element: <ProtectedRoute><Layout/></ProtectedRoute>,
        errorElement: <GenericErrorPage/>,
        children: [
            {
                index: true,
                element: <ProtectedRoute><DashboardPage/></ProtectedRoute>, // Dashboard principal com métricas de schedule
                // Endpoints: /api/schedule/progress, /api/schedule/stats, /api/schedule/health
            },
            {
                path: 'schedule',
                element: <ProtectedRoute><SchedulePage/></ProtectedRoute>, // Monitoramento de schedule e jobs
                // Endpoints: /api/schedule/active, /api/schedule/progress, /api/schedule/job/{jobName}
                // Ações: POST /api/schedule/job/{jobName}/cancel
            },
            {
                path: 'accounts',
                element: <ProtectedRoute><AccountsPage/></ProtectedRoute>, // Lista de contas
                // Endpoints: /api/accounts
            },
            {
                path: 'movements',
                element: <ProtectedRoute><MovementsPage/></ProtectedRoute>, // Movimentações financeiras
                // Endpoints: /api/movements
            },
            {
                path: 'imports',
                element: <ProtectedRoute><ImportsPage/></ProtectedRoute>, // Histórico de importações
                // Endpoints: /api/imports
            },
            {
                path: 'imports/:importId',
                element: <ProtectedRoute><ImportDetailsPage/></ProtectedRoute>, // Detalhes da importação
                // Endpoints: /api/imports/{importId}
            },
            {
                path: 'accounts/:accountId',
                element: <ProtectedRoute><AccountDetailsPage/></ProtectedRoute>, // Detalhes da conta
                // Endpoints: /api/accounts/{accountId}
            },
            {
                path: 'schedule/job/:jobName',
                element: <ProtectedRoute><JobDetailsPage/></ProtectedRoute>, // Detalhes do job
                // Endpoints: /api/schedule/job/{jobName}
            },
            {
                path: 'query-logs',
                element: <ProtectedRoute><QueryLogsPage/></ProtectedRoute>, // Logs de consultas
                // Endpoints: /api/query-logs
            }
        ]
    },
    // Rota catch-all para 404 (deve ser a última)
    {
        path: '*',
        element: <NotFoundPage/>
    }
], {
    basename: constants.basepath
})
