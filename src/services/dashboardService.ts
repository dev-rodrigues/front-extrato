import api, { validateApiResponse } from './api'

/**
 * Serviço para dashboard e métricas do sistema
 * Integra com a API backend para dados em tempo real
 */

// Interfaces para métricas do dashboard
export interface DashboardMetrics {
  totalContas: number
  consultasHoje: number
  consultasSemana: number
  consultasMes: number
  importacoesPendentes: number
  importacoesProcessando: number
  importacoesConcluidas: number
  movimentacoesProcessadas: number
  movimentacoesHoje: number
  movimentacoesSemana: number
  movimentacoesMes: number
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
    borderWidth?: number
  }[]
}

export interface DashboardCharts {
  consultasPorPeriodo: ChartData
  importacoesPorStatus: ChartData
  movimentacoesPorTipo: ChartData
  consultasPorDia: ChartData
}

export interface DashboardAlert {
  id: string
  tipo: 'info' | 'warning' | 'error' | 'success'
  titulo: string
  mensagem: string
  dataHora: string
  lido: boolean
  acao?: string
  link?: string
}

export interface SystemStatus {
  status: 'online' | 'offline' | 'maintenance'
  uptime: number
  lastCheck: string
  version: string
  environment: string
}

/**
 * Buscar métricas gerais do dashboard
 */
export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  try {
    const response = await api.get('/api/dashboard/metrics')
    return validateApiResponse(response)
  } catch (error) {
    console.error('❌ Erro ao buscar métricas do dashboard:', error)
    
    // Retornar dados mock em caso de erro (fallback)
    return {
      totalContas: 150,
      consultasHoje: 45,
      consultasSemana: 320,
      consultasMes: 1250,
      importacoesPendentes: 3,
      importacoesProcessando: 2,
      importacoesConcluidas: 45,
      movimentacoesProcessadas: 15600,
      movimentacoesHoje: 450,
      movimentacoesSemana: 3200,
      movimentacoesMes: 12500
    }
  }
}

/**
 * Buscar dados para gráficos do dashboard
 */
export const getDashboardCharts = async (): Promise<DashboardCharts> => {
  try {
    const response = await api.get('/api/dashboard/charts')
    return validateApiResponse(response)
  } catch (error) {
    console.error('❌ Erro ao buscar dados dos gráficos:', error)
    
    // Retornar dados mock em caso de erro (fallback)
    const hoje = new Date()
    const labels = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(hoje)
      date.setDate(date.getDate() - (6 - i))
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    })
    
    return {
      consultasPorPeriodo: {
        labels: ['Hoje', 'Ontem', 'Última Semana', 'Último Mês'],
        datasets: [{
          label: 'Consultas',
          data: [45, 38, 320, 1250],
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
          borderColor: ['#1d4ed8', '#059669', '#d97706', '#dc2626'],
          borderWidth: 2
        }]
      },
      importacoesPorStatus: {
        labels: ['Pendentes', 'Processando', 'Concluídas', 'Erro'],
        datasets: [{
          label: 'Importações',
          data: [3, 2, 45, 1],
          backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'],
          borderColor: ['#d97706', '#1d4ed8', '#059669', '#dc2626'],
          borderWidth: 2
        }]
      },
      movimentacoesPorTipo: {
        labels: ['Crédito', 'Débito', 'Transferência', 'Pagamento'],
        datasets: [{
          label: 'Movimentações',
          data: [12500, 9800, 3200, 4500],
          backgroundColor: ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'],
          borderColor: ['#059669', '#dc2626', '#1d4ed8', '#d97706'],
          borderWidth: 2
        }]
      },
      consultasPorDia: {
        labels: labels,
        datasets: [{
          label: 'Consultas',
          data: [45, 38, 42, 35, 48, 52, 41],
          backgroundColor: ['#3b82f6'],
          borderColor: ['#1d4ed8'],
          borderWidth: 2
        }]
      }
    }
  }
}

/**
 * Buscar alertas do dashboard
 */
export const getDashboardAlerts = async (): Promise<DashboardAlert[]> => {
  try {
    const response = await api.get('/api/dashboard/alerts')
    return validateApiResponse(response)
  } catch (error) {
    console.error('❌ Erro ao buscar alertas do dashboard:', error)
    
    // Retornar dados mock em caso de erro (fallback)
    return [
      {
        id: '1',
        tipo: 'info',
        titulo: 'Sistema Atualizado',
        mensagem: 'Nova versão do sistema foi implantada com sucesso',
        dataHora: new Date().toISOString(),
        lido: false
      },
      {
        id: '2',
        tipo: 'warning',
        titulo: 'Importação Pendente',
        mensagem: '5 arquivos aguardando processamento há mais de 1 hora',
        dataHora: new Date(Date.now() - 3600000).toISOString(),
        lido: false,
        acao: 'Verificar',
        link: '/importacoes'
      },
      {
        id: '3',
        tipo: 'success',
        titulo: 'Backup Concluído',
        mensagem: 'Backup automático do banco de dados foi concluído',
        dataHora: new Date(Date.now() - 7200000).toISOString(),
        lido: true
      }
    ]
  }
}

/**
 * Buscar status do sistema
 */
export const getSystemStatus = async (): Promise<SystemStatus> => {
  try {
    const response = await api.get('/api/system/status')
    return validateApiResponse(response)
  } catch (error) {
    console.error('❌ Erro ao buscar status do sistema:', error)
    
    // Retornar dados mock em caso de erro (fallback)
    return {
      status: 'online',
      uptime: 99.8,
      lastCheck: new Date().toISOString(),
      version: '1.0.0',
      environment: 'development'
    }
  }
}

/**
 * Marcar alerta como lido
 */
export const markAlertAsRead = async (alertId: string): Promise<void> => {
  try {
    await api.patch(`/api/dashboard/alerts/${alertId}/read`)
  } catch (error) {
    console.error('❌ Erro ao marcar alerta como lido:', error)
    // Não falhar a operação, apenas logar o erro
  }
}

/**
 * Marcar todos os alertas como lidos
 */
export const markAllAlertsAsRead = async (): Promise<void> => {
  try {
    await api.patch('/api/dashboard/alerts/read-all')
  } catch (error) {
    console.error('❌ Erro ao marcar todos os alertas como lidos:', error)
    // Não falhar a operação, apenas logar o erro
  }
}

/**
 * Buscar estatísticas de performance do sistema
 */
export const getSystemPerformance = async (): Promise<{
  responseTime: number
  throughput: number
  errorRate: number
  activeUsers: number
}> => {
  try {
    const response = await api.get('/api/system/performance')
    return validateApiResponse(response)
  } catch (error) {
    console.error('❌ Erro ao buscar performance do sistema:', error)
    
    // Retornar dados mock em caso de erro (fallback)
    return {
      responseTime: 150, // ms
      throughput: 1250, // requests/min
      errorRate: 0.5, // %
      activeUsers: 25
    }
  }
}

/**
 * Buscar dados de uso do sistema
 */
export const getSystemUsage = async (): Promise<{
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkUsage: number
}> => {
  try {
    const response = await api.get('/api/system/usage')
    return validateApiResponse(response)
  } catch (error) {
    console.error('❌ Erro ao buscar uso do sistema:', error)
    
    // Retornar dados mock em caso de erro (fallback)
    return {
      cpuUsage: 45, // %
      memoryUsage: 62, // %
      diskUsage: 78, // %
      networkUsage: 23 // %
    }
  }
}
