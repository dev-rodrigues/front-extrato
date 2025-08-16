import { Layout } from '@/components/layout/Layout'
import { SummaryCard } from '@/components/features/SummaryCard'
import { AlertList } from '@/components/features/AlertList'
import { TrendingUp, AlertTriangle, Database, Users } from 'lucide-react'

// Dados mockados para demonstração
const mockAlerts = [
  {
    id: '1',
    type: 'critical' as const,
    message: 'Falha na conexão com API do Banco do Brasil',
    timestamp: '2 min atrás',
    priority: 'high' as const
  },
  {
    id: '2',
    type: 'warning' as const,
    message: '5 consultas com timeout nos últimos 30 min',
    timestamp: '15 min atrás',
    priority: 'medium' as const
  },
  {
    id: '3',
    type: 'info' as const,
    message: 'Nova versão da API disponível',
    timestamp: '1 hora atrás',
    priority: 'low' as const
  }
]

function App() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header da página */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Sistema de consulta de extratos bancários do Banco do Brasil
          </p>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            title="Total Contas"
            value="150"
            change="+20.1% em relação ao mês anterior"
            icon={Users}
            variant="positive"
          />
          
          <SummaryCard
            title="Consultas Hoje"
            value="24"
            change="+12 consultas realizadas"
            icon={Database}
            variant="positive"
          />
          
          <SummaryCard
            title="Taxa de Sucesso"
            value="98.5%"
            change="+2.3% em relação ao mês anterior"
            icon={TrendingUp}
            variant="positive"
          />
          
          <SummaryCard
            title="Alertas Ativos"
            value="3"
            change="2 críticos, 1 atenção"
            icon={AlertTriangle}
            variant="negative"
          />
        </div>

        {/* Lista de alertas */}
        <AlertList alerts={mockAlerts} maxAlerts={5} />
      </div>
    </Layout>
  )
}

export default App
