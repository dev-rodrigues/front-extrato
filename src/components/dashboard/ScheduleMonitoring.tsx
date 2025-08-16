import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Database,
  Users
} from 'lucide-react'

/**
 * Componente para monitoramento de jobs agendados
 * Integra com endpoints /api/schedule/* da API
 */

interface JobExecutionInfo {
  jobName: string
  status: 'STARTING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  statusDescription: string
  startTime: string
  endTime?: string
  durationMs?: number
  recordsProcessed: number
  accountsProcessed: number
  progressPercentage: number
  errorMessage?: string
  estimatedTimeRemaining?: number
  lastUpdated: string
}

interface ScheduleProgress {
  activeJobs: number
  completedJobs: number
  failedJobs: number
  cancelledJobs: number
  averageExecutionTime: number
  successRate: number
  totalRecordsProcessed: number
  totalAccountsProcessed: number
  activeJobsList: JobExecutionInfo[]
}

export const ScheduleMonitoring: React.FC = () => {
  const [progress, setProgress] = useState<ScheduleProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Carregar dados de monitoramento
  const loadScheduleData = async () => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Integrar com API real quando disponível
      // const response = await fetch('/api/schedule/progress')
      // const data = await response.json()
      
      // Dados mockados para demonstração
      const mockData: ScheduleProgress = {
        activeJobs: 2,
        completedJobs: 15,
        failedJobs: 1,
        cancelledJobs: 0,
        averageExecutionTime: 45000,
        successRate: 0.9375,
        totalRecordsProcessed: 1250,
        totalAccountsProcessed: 8,
        activeJobsList: [
          {
            jobName: 'consulta-extrato-1234567890',
            status: 'RUNNING',
            statusDescription: 'Executando',
            startTime: '2024-01-15T14:30:00',
            progressPercentage: 75,
            recordsProcessed: 1250,
            accountsProcessed: 8,
            lastUpdated: '2024-01-15T14:35:00',
            estimatedTimeRemaining: 15000
          },
          {
            jobName: 'consulta-extrato-0987654321',
            status: 'STARTING',
            statusDescription: 'Iniciando',
            startTime: '2024-01-15T14:32:00',
            progressPercentage: 5,
            recordsProcessed: 50,
            accountsProcessed: 1,
            lastUpdated: '2024-01-15T14:32:00'
          }
        ]
      }

      setProgress(mockData)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados de schedule')
      console.error('❌ Erro ao carregar schedule:', err)
    } finally {
      setLoading(false)
    }
  }

  // Carregar dados iniciais
  useEffect(() => {
    loadScheduleData()
  }, [])

  // Atualizar dados a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(loadScheduleData, 30 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Cancelar job
  const cancelJob = async (jobName: string) => {
    try {
      // TODO: Integrar com API real
      // await fetch(`/api/schedule/job/${jobName}/cancel`, { method: 'POST' })
      console.log(`Cancelando job: ${jobName}`)
      
      // Recarregar dados
      await loadScheduleData()
    } catch (err) {
      console.error('❌ Erro ao cancelar job:', err)
    }
  }

  // Obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return 'bg-blue-500'
      case 'STARTING':
        return 'bg-yellow-500'
      case 'COMPLETED':
        return 'bg-green-500'
      case 'FAILED':
        return 'bg-red-500'
      case 'CANCELLED':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  // Formatar duração
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  if (loading && !progress) {
    return (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Carregando monitoramento...</span>
      </div>
    )
  }

  if (error && !progress) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!progress) return null

  return (
    <div className="space-y-6">
      {/* Header com métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Play className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Jobs Ativos</p>
                <p className="text-2xl font-bold">{progress.activeJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Concluídos</p>
                <p className="text-2xl font-bold">{progress.completedJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</p>
                <p className="text-2xl font-bold">{(progress.successRate * 100).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registros Processados</p>
                <p className="text-2xl font-bold">{progress.totalRecordsProcessed.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs ativos */}
      {progress.activeJobsList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Jobs em Execução</span>
              <Button
                variant="outline"
                size="sm"
                onClick={loadScheduleData}
                className="ml-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progress.activeJobsList.map((job) => (
                <div key={job.jobName} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(job.status)}>
                        {job.statusDescription}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {job.jobName}
                      </span>
                    </div>
                    
                    {job.status === 'RUNNING' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelJob(job.jobName)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Pause className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{job.progressPercentage}%</span>
                    </div>
                    <Progress value={job.progressPercentage} className="h-2" />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Início:</span>
                        <p>{new Date(job.startTime).toLocaleTimeString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Registros:</span>
                        <p>{job.recordsProcessed.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Contas:</span>
                        <p>{job.accountsProcessed}</p>
                      </div>
                      {job.estimatedTimeRemaining && (
                        <div>
                          <span className="text-muted-foreground">Tempo Restante:</span>
                          <p>{formatDuration(job.estimatedTimeRemaining)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas gerais */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{progress.activeJobs}</p>
              <p className="text-sm text-muted-foreground">Jobs Ativos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{progress.completedJobs}</p>
              <p className="text-sm text-muted-foreground">Jobs Concluídos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{progress.failedJobs}</p>
              <p className="text-sm text-muted-foreground">Jobs Falharam</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span>Última atualização:</span>
              <span>{lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
