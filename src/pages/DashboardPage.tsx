import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AppLoading, AppLoadingSkeleton, UpdateIndicator, ProgressUpdateIndicator } from '@/components/ui/AppLoading'
import { 
  TrendingUp, 
  Activity, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { useSchedule } from '@/hooks/useSchedule'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'

/**
 * Dashboard Page - Implementa EXATAMENTE o que está documentado nos RFCs
 * Agora com React Query para atualizações automáticas e feedback visual aprimorado
 * Endpoints utilizados:
 * - GET /api/schedule/progress - Métricas principais
 * - GET /api/schedule/stats - Estatísticas do sistema  
 * - GET /api/schedule/health - Status do sistema
 */
export function DashboardPage() {
  const { 
    progress: progressData, 
    stats: statsData, 
    health: healthData, 
    loading, 
    refetching,
    error,
    refresh,
    // Estados individuais para controle granular
    progressLoading,
    statsLoading,
    healthLoading,
    // Estados de refetch para indicadores visuais
    progressRefetching,
    statsRefetching,
    healthRefetching
  } = useSchedule()

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

  // Função para formatar taxa de sucesso
  const formatSuccessRate = (rate: number | undefined | null): string => {
    if (!rate || isNaN(rate) || rate < 0 || rate > 1) return '0%'
    return `${(rate * 100).toFixed(1)}%`
  }

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
      <Breadcrumbs items={[]} />
      
      {/* Cabeçalho com indicador de atualização */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema com métricas principais
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

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Jobs Ativos */}
        <Card className="transition-all duration-300 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Ativos</CardTitle>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              {/* Indicador de atualização com GiKiwiBird */}
              <UpdateIndicator 
                size="sm" 
                isRefetching={progressRefetching} 
                showText={false}
              />
            </div>
          </CardHeader>
          <CardContent>
            {progressLoading ? (
              <AppLoadingSkeleton isRefetching={progressRefetching} />
            ) : (
              <>
                <div className="text-2xl font-bold transition-all duration-300">
                  {progressData?.activeJobs || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Em execução no momento
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Taxa de Sucesso */}
        <Card className="transition-all duration-300 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              {/* Indicador de atualização com GiKiwiBird */}
              <UpdateIndicator 
                size="sm" 
                isRefetching={progressRefetching} 
                showText={false}
              />
            </div>
          </CardHeader>
          <CardContent>
            {progressLoading ? (
              <AppLoadingSkeleton isRefetching={progressRefetching} />
            ) : (
              <>
                <div className="text-2xl font-bold transition-all duration-300">
                  {progressData?.successRate ? formatSuccessRate(progressData.successRate) : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Jobs concluídos com sucesso
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total de Contas */}
        <Card className="transition-all duration-300 animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Contas</CardTitle>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              {/* Indicador de atualização com GiKiwiBird */}
              <UpdateIndicator 
                size="sm" 
                isRefetching={progressRefetching} 
                showText={false}
              />
            </div>
          </CardHeader>
          <CardContent>
            {progressLoading ? (
              <AppLoadingSkeleton isRefetching={progressRefetching} />
            ) : (
              <>
                <div className="text-2xl font-bold transition-all duration-300">
                  {progressData?.totalAccountsProcessed || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Contas processadas
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Jobs em Execução */}
      {progressData?.activeJobsList && progressData.activeJobsList.length > 0 && (
        <Card className="transition-all duration-300 animate-fade-in">
          <CardHeader>
            <CardTitle>Jobs em Execução</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {progressLoading ? (
              <AppLoadingSkeleton isRefetching={progressRefetching} />
            ) : (
              progressData.activeJobsList.map((job) => (
                <div key={job.jobName} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
                      <span className="font-medium">{job.jobName}</span>
                      <Badge variant="secondary">
                        {job.statusDescription}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {job.progressPercentage}%
                    </div>
                  </div>
                  
                  {/* Barra de progresso com loading iterativo */}
                  <div className="mb-2">
                    <Progress 
                      value={job.progressPercentage || 0} 
                      className="mb-2"
                      isLoading={progressRefetching}
                      isRefetching={progressRefetching}
                      showLoadingIndicator={true}
                      showIterativeLoading={true}
                    />
                    
                    {/* Indicador de atualização para a barra de progresso */}
                    {progressRefetching && (
                      <ProgressUpdateIndicator isRefetching={progressRefetching} />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Início:</span>
                      <div>{new Date(job.startTime).toLocaleTimeString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Registros:</span>
                      <div>{job.recordsProcessed || 0}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Contas:</span>
                      <div>{job.accountsProcessed || 0}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tempo Restante:</span>
                      <div>
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
      )}

      {/* Estatísticas do Sistema */}
      {statsData && (
        <Card className="transition-all duration-300 animate-fade-in">
          <CardHeader>
            <CardTitle>Estatísticas do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <AppLoadingSkeleton isRefetching={statsRefetching} />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{statsData.totalJobsExecuted}</div>
                  <div className="text-sm text-muted-foreground">Total de Jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {formatSuccessRate(statsData.successRate)}
                  </div>
                  <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {formatDuration(statsData.averageExecutionTime)}
                  </div>
                  <div className="text-sm text-muted-foreground">Tempo Médio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {formatDuration(statsData.systemUptime)}
                  </div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Status de Saúde do Sistema */}
      {healthData && (
        <Card className="transition-all duration-300 animate-fade-in">
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            {healthLoading ? (
              <AppLoadingSkeleton isRefetching={healthRefetching} />
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {healthData.status === 'UP' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">
                    Status: {healthData.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Versão: {healthData.version}
                </div>
                <div className="text-sm text-muted-foreground">
                  Última verificação: {new Date(healthData.timestamp).toLocaleString()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}


    </div>
  )
}
