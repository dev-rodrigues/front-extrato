import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AppLoading, AppLoadingSkeleton, UpdateIndicator, ProgressUpdateIndicator } from '@/components/ui/AppLoading'
import { 
  Play, 
  Square, 
  AlertCircle, 
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  Eye,
  RefreshCw
} from 'lucide-react'
import { useSchedule } from '@/hooks/useSchedule'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'

/**
 * Schedule Page - Implementa EXATAMENTE o que está documentado nos RFCs
 * Agora com React Query para atualizações automáticas e feedback visual aprimorado
 * Endpoints utilizados:
 * - GET /api/schedule/active - Jobs ativos
 * - GET /api/schedule/progress - Progresso geral
 * - GET /api/schedule/job/{jobName} - Cancelar job
 */
export function SchedulePage() {
  const { 
    activeJobs, 
    progress: progressSummary, 
    loading, 
    refetching,
    error, 
    cancelJob, 
    refresh,
    // Estados individuais para controle granular
    activeJobsLoading,
    // Estados de refetch para indicadores visuais
    activeJobsRefetching,
    // Mutation para cancelar job
    cancelJobMutation
  } = useSchedule()
  
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [periodFilter, setPeriodFilter] = useState<string>('24h')

  // Função para formatar tempo em milissegundos
  const formatDuration = (ms: number | undefined | null): string => {
    if (!ms || isNaN(ms) || ms <= 0) return '0s'
    
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  // Função para formatar data/hora
  const formatDateTime = (dateString: string | undefined | null): string => {
    if (!dateString || dateString === 'Invalid Date') return 'Data inválida'
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Data inválida'
      return date.toLocaleString('pt-BR')
    } catch {
      return 'Data inválida'
    }
  }

  // Função para obter cor do status
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'RUNNING': return 'bg-blue-100 text-blue-800'
      case 'STARTING': return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Função para obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RUNNING': return <Activity className="h-4 w-4 animate-pulse" />
      case 'STARTING': return <Play className="h-4 w-4 animate-spin" />
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />
      case 'FAILED': return <XCircle className="h-4 w-4" />
      case 'CANCELLED': return <Square className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  // Filtrar jobs baseado nos filtros selecionados
  const filteredJobs = activeJobs.filter(job => {
    if (statusFilter !== 'all' && job.status !== statusFilter) return false
    // Aqui poderia implementar filtro de período se necessário
    return true
  })

  // Loading inicial
  if (loading) {
    return <AppLoading />
  }

  // Erro
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={refresh}>Tentar Novamente</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumbs items={[{ label: 'Schedule', href: '/schedule' }]} />
      
      {/* Cabeçalho com indicador de atualização */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monitoramento de Schedule</h1>
          <p className="text-muted-foreground">
            Acompanhe o status e progresso dos jobs em execução
          </p>
        </div>
        
        {/* Indicador de atualização automática com GiKiwiBird */}
        <div className="flex items-center space-x-3">
          {/* UpdateIndicator personalizado */}
          <UpdateIndicator 
            size="md" 
            isRefetching={refetching} 
            showText={true}
          />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refresh}
            disabled={refetching}
            className="transition-all duration-300"
          >
            <RefreshCw className={`h-4 w-4 mr-2 transition-all duration-300 ${
              refetching ? 'animate-spin' : ''
            }`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="transition-all duration-300 animate-fade-in">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Status:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="RUNNING">Em Execução</SelectItem>
                  <SelectItem value="STARTING">Iniciando</SelectItem>
                  <SelectItem value="COMPLETED">Concluído</SelectItem>
                  <SelectItem value="FAILED">Falhou</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Período:</span>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Últimas 24h</SelectItem>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Ativos */}
      <Card className="transition-all duration-300 animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Jobs Ativos</CardTitle>
              <p className="text-sm text-muted-foreground">
                {activeJobsLoading ? 'Carregando...' : `${filteredJobs.length} job(s) ativo(s) no momento`}
              </p>
            </div>
            
            {/* Indicador de refetching para jobs ativos */}
            <UpdateIndicator 
              size="sm" 
              isRefetching={activeJobsRefetching} 
              showText={true}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeJobsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <AppLoadingSkeleton key={i} isRefetching={activeJobsRefetching} />
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum job ativo encontrado
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.jobName} className="border rounded-lg p-4 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(job.status)}
                    <span className="font-medium text-lg">{job.jobName}</span>
                    <Badge className={getStatusColor(job.status)}>
                      {job.statusDescription}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/schedule/job/${job.jobName}`, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                    {job.status === 'RUNNING' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => cancelJob(job.jobName)}
                        disabled={cancelJobMutation.isPending}
                        className="transition-all duration-300"
                      >
                        {cancelJobMutation.isPending ? (
                          <div className="flex items-center space-x-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Cancelando...</span>
                          </div>
                        ) : (
                          <>
                            <Square className="h-4 w-4 mr-1" />
                            Cancelar
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Barra de progresso com loading state */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Progresso</span>
                    <span className="text-sm font-medium">
                      {job.progressPercentage || 0}%
                    </span>
                  </div>
                  
                  {/* Barra de progresso com loading iterativo */}
                  <Progress 
                    value={job.progressPercentage || 0} 
                    className="mb-2"
                    isLoading={activeJobsRefetching}
                    isRefetching={activeJobsRefetching}
                    showLoadingIndicator={true}
                    showIterativeLoading={true}
                  />
                  
                  {/* Indicador de atualização para a barra de progresso */}
                  {activeJobsRefetching && (
                    <ProgressUpdateIndicator isRefetching={activeJobsRefetching} />
                  )}
                </div>
                
                {/* Detalhes do job */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Início:</span>
                    <div className="font-medium">
                      {formatDateTime(job.startTime)}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Registros:</span>
                    <div className="font-medium">
                      {job.recordsProcessed || 0}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Contas:</span>
                    <div className="font-medium">
                      {job.accountsProcessed || 0}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tempo Restante:</span>
                    <div className="font-medium">
                      {job.estimatedTimeRemaining 
                        ? formatDuration(job.estimatedTimeRemaining)
                        : 'Calculando...'
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Histórico de Jobs */}
      {progressSummary && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {progressSummary.completedJobs}
                </div>
                <div className="text-sm text-muted-foreground">Concluídos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {progressSummary.failedJobs}
                </div>
                <div className="text-sm text-muted-foreground">Falharam</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {progressSummary.cancelledJobs}
                </div>
                <div className="text-sm text-muted-foreground">Cancelados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {progressSummary.totalRecordsProcessed}
                </div>
                <div className="text-sm text-muted-foreground">Total Registros</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  )
}
