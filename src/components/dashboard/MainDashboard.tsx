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
import { ScheduleMonitoring } from './ScheduleMonitoring'

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
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule'>('overview')

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
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-500" />
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
      {/* Header da página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Sistema de consulta de extratos bancários do Banco do Brasil
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Última atualização: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Tabs de navegação */}
      <div className="flex space-x-1 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'schedule'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Monitoramento de Schedule
        </button>
      </div>

      {/* Conteúdo baseado na aba ativa */}
      {activeTab === 'overview' ? (
        <>
          {/* Cards de métricas principais */}
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Contas"
                value={metrics.totalContas?.toString() || '150'}
                change="+20.1% em relação ao mês anterior"
                icon={Search}
                variant="positive"
              />
              
              <MetricCard
                title="Consultas Hoje"
                value={metrics.consultasHoje?.toString() || '24'}
                change="+12 consultas realizadas"
                icon={Activity}
                variant="positive"
              />
              
              <MetricCard
                title="Importações Pendentes"
                value={metrics.importacoesPendentes?.toString() || '3'}
                change="2 em processamento"
                icon={TrendingUp}
                variant="warning"
              />
              
              <MetricCard
                title="Movimentações Hoje"
                value={metrics.movimentacoesHoje?.toString() || '450'}
                change="+15% vs ontem"
                icon={AlertTriangle}
                variant="positive"
              />
            </div>
          )}

          {/* Gráficos e widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {charts && (
              <ChartWidget
                title="Consultas por Período"
                data={charts.consultasPorPeriodo}
                type="line"
              />
            )}
            
            {charts && (
              <ChartWidget
                title="Distribuição de Importações"
                data={charts.importacoesPorStatus}
                type="pie"
              />
            )}
          </div>

          {/* Status do sistema e alertas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {systemStatus && (
              <SystemStatusWidget status={systemStatus} />
            )}
            
            <AlertWidget alerts={alerts} maxAlerts={5} />
          </div>
        </>
      ) : (
        /* Aba de Monitoramento de Schedule */
        <ScheduleMonitoring />
      )}
    </div>
  )
}

export default MainDashboard
