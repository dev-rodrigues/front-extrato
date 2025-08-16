import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Download,
  DollarSign,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react'
import { 
  getDashboardMetrics, 
  getDashboardCharts, 
  getDashboardAlerts,
  getSystemStatus,
  type DashboardMetrics,
  type DashboardCharts,
  type DashboardAlert,
  type SystemStatus
} from '@/services/dashboardService'
import { MetricCard } from './MetricCard'
import { ChartWidget } from './ChartWidget'
import { AlertWidget } from './AlertWidget'
import { SystemStatusWidget } from './SystemStatusWidget'

/**
 * Dashboard principal da aplicação
 * Integra com serviços da API para dados em tempo real
 */

export const MainDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [charts, setCharts] = useState<DashboardCharts | null>(null)
  const [alerts, setAlerts] = useState<DashboardAlert[]>([])
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Carregar dados do dashboard
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Carregar dados em paralelo
      const [metricsData, chartsData, alertsData, statusData] = await Promise.all([
        getDashboardMetrics(),
        getDashboardCharts(),
        getDashboardAlerts(),
        getSystemStatus()
      ])

      setMetrics(metricsData)
      setCharts(chartsData)
      setAlerts(alertsData)
      setSystemStatus(statusData)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard')
      console.error('❌ Erro ao carregar dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  // Carregar dados iniciais
  useEffect(() => {
    loadDashboardData()
  }, [])

  // Atualizar dados a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Atualizar manualmente
  const handleRefresh = () => {
    loadDashboardData()
  }

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error && !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadDashboardData} variant="outline">
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header do Dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema de consulta de extratos bancários
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
          </Badge>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Status do Sistema */}
      {systemStatus && (
        <SystemStatusWidget status={systemStatus} />
      )}

      {/* Cards de Métricas Principais */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total de Contas"
            value={metrics.totalContas}
            change="+12% este mês"
            icon={Search}
            variant="default"
          />
          
          <MetricCard
            title="Consultas Hoje"
            value={metrics.consultasHoje}
            change={`+${Math.round((metrics.consultasHoje / metrics.consultasSemana) * 100)}% vs semana`}
            icon={Activity}
            variant="positive"
          />
          
          <MetricCard
            title="Importações Pendentes"
            value={metrics.importacoesPendentes}
            change={`${metrics.importacoesProcessando} em processamento`}
            icon={Download}
            variant="warning"
          />
          
          <MetricCard
            title="Movimentações Hoje"
            value={metrics.movimentacoesHoje}
            change={`+${Math.round((metrics.movimentacoesHoje / metrics.movimentacoesSemana) * 100)}% vs semana`}
            icon={DollarSign}
            variant="neutral"
          />
        </div>
      )}

      {/* Gráficos e Visualizações */}
      {charts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartWidget
            title="Consultas por Período"
            data={charts.consultasPorPeriodo}
            type="bar"
          />
          
          <ChartWidget
            title="Importações por Status"
            data={charts.importacoesPorStatus}
            type="doughnut"
          />
          
          <ChartWidget
            title="Movimentações por Tipo"
            data={charts.movimentacoesPorTipo}
            type="pie"
          />
          
          <ChartWidget
            title="Consultas por Dia (Última Semana)"
            data={charts.consultasPorDia}
            type="line"
          />
        </div>
      )}

      {/* Alertas e Notificações */}
      {alerts.length > 0 && (
        <AlertWidget alerts={alerts} />
      )}

      {/* Métricas Detalhadas */}
      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Consultas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultas</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Hoje:</span>
                <span className="font-medium">{metrics.consultasHoje}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Esta Semana:</span>
                <span className="font-medium">{metrics.consultasSemana}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Este Mês:</span>
                <span className="font-medium">{metrics.consultasMes}</span>
              </div>
            </CardContent>
          </Card>

          {/* Importações */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Importações</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pendentes:</span>
                <Badge variant="warning">{metrics.importacoesPendentes}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Processando:</span>
                <Badge variant="default">{metrics.importacoesProcessando}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Concluídas:</span>
                <Badge variant="positive">{metrics.importacoesConcluidas}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Movimentações */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Movimentações</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Hoje:</span>
                <span className="font-medium">{metrics.movimentacoesHoje}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Esta Semana:</span>
                <span className="font-medium">{metrics.movimentacoesSemana}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Este Mês:</span>
                <span className="font-medium">{metrics.movimentacoesMes}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer do Dashboard */}
      <div className="text-center text-sm text-muted-foreground py-4 border-t">
        <p>
          Sistema de Consulta de Extratos Bancários • 
          Dados atualizados automaticamente a cada 5 minutos
        </p>
      </div>
    </div>
  )
}

export default MainDashboard
