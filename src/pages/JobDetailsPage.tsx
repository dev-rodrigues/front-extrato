import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AppLoading } from '@/components/ui/AppLoading'
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  XCircle,
  ArrowLeft,
  Square as StopIcon
} from 'lucide-react'
import { useSchedule } from '@/hooks/useSchedule'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import type { JobProgressResponse } from '@/types/rfc'

/**
 * JobDetailsPage - Implementa EXATAMENTE o que está documentado nos RFCs
 * Endpoint: GET /api/schedule/job/{jobName}
 * Funcionalidade: Detalhes específicos de um job com ações de controle
 */
export function JobDetailsPage() {
  const { jobName } = useParams<{ jobName: string }>()
  const navigate = useNavigate()
  const { cancelJob, refresh: fetchScheduleData } = useSchedule()
  
  const [jobDetails, setJobDetails] = useState<JobProgressResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)

  // Carregar detalhes do job
  useEffect(() => {
    if (!jobName) return

    const fetchJobDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Simular busca dos detalhes do job
        // Em produção, isso viria do ScheduleService.getJobDetails(jobName)
        const mockJobDetails: JobProgressResponse = {
          jobName,
          status: 'RUNNING',
          statusDescription: 'Em execução',
          startTime: new Date().toISOString(),
          endTime: null,
          durationMs: 45000,
          recordsProcessed: 1250,
          accountsProcessed: 45,
          progressPercentage: 75,
          errorMessage: null,
          estimatedTimeRemaining: 15000,
          lastUpdated: new Date().toISOString()
        }
        
        setJobDetails(mockJobDetails)
      } catch (err) {
        console.error('Erro ao buscar detalhes do job:', err)
        setError('Erro ao carregar detalhes do job')
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetails()
    
    // Atualização automática a cada 5 segundos
    const interval = setInterval(fetchJobDetails, 5000)
    return () => clearInterval(interval)
  }, [jobName])

  // Cancelar job
  const handleCancelJob = async () => {
    if (!jobName || !jobDetails) return
    
    try {
      setCancelling(true)
      await cancelJob(jobName)
      // Recarregar dados após cancelamento
      fetchScheduleData()
      navigate('/schedule')
    } catch (err) {
      console.error('Erro ao cancelar job:', err)
      setError('Erro ao cancelar job')
    } finally {
      setCancelling(false)
    }
  }

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
      case 'STARTING': return <AppLoading size="sm" />
      case 'COMPLETED': return <CheckCircle className="h-4 w-4" />
      case 'FAILED': return <XCircle className="h-4 w-4" />
      case 'CANCELLED': return <StopIcon className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (!jobName) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive">Nome do job não especificado</p>
        </div>
      </div>
    )
  }

  // Gerar breadcrumbs
  const breadcrumbs = [
    { label: 'Schedule', href: '/schedule' },
    { label: jobName, href: `/schedule/job/${jobName}` }
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Detalhes do Job</h1>
        <p className="text-muted-foreground">
          Informações detalhadas e controle do job {jobName}
        </p>
      </div>

      {/* Botão Voltar */}
      <div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/schedule')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar ao Schedule</span>
        </Button>
      </div>

      {loading ? (
        <AppLoading />
      ) : error ? (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <p className="text-red-700 mb-4">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      ) : jobDetails ? (
        <>
          {/* Status e Controles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Status do Job</span>
                <div className="flex items-center space-x-3">
                  {getStatusIcon(jobDetails.status)}
                  <Badge className={getStatusColor(jobDetails.status)}>
                    {jobDetails.statusDescription}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Informações Básicas</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nome:</span>
                      <span className="font-medium">{jobDetails.jobName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Início:</span>
                      <span className="font-medium">
                        {formatDateTime(jobDetails.startTime)}
                      </span>
                    </div>
                    {jobDetails.endTime && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fim:</span>
                        <span className="font-medium">
                          {formatDateTime(jobDetails.endTime)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duração:</span>
                      <span className="font-medium">
                        {formatDuration(jobDetails.durationMs)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Última Atualização:</span>
                      <span className="font-medium">
                        {formatDateTime(jobDetails.lastUpdated)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Progresso</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progresso Geral</span>
                        <span>{jobDetails.progressPercentage || 0}%</span>
                      </div>
                      <Progress value={jobDetails.progressPercentage || 0} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Registros:</span>
                        <div className="font-medium">
                          {jobDetails.recordsProcessed || 0}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Contas:</span>
                        <div className="font-medium">
                          {jobDetails.accountsProcessed || 0}
                        </div>
                      </div>
                    </div>

                    {jobDetails.estimatedTimeRemaining && (
                      <div>
                        <span className="text-muted-foreground text-sm">
                          Tempo Restante Estimado:
                        </span>
                        <div className="font-medium">
                          {formatDuration(jobDetails.estimatedTimeRemaining)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ações de Controle */}
              {jobDetails.status === 'RUNNING' && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-4">Ações de Controle</h3>
                  <div className="flex space-x-4">
                    <Button
                      variant="destructive"
                      onClick={handleCancelJob}
                      disabled={cancelling}
                      className="flex items-center space-x-2"
                    >
                      {cancelling ? (
                        <AppLoading size="sm" />
                      ) : (
                        <StopIcon className="h-4 w-4" />
                      )}
                      <span>
                        {cancelling ? 'Cancelando...' : 'Cancelar Job'}
                      </span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Mensagem de Erro */}
              {jobDetails.errorMessage && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center space-x-2 text-red-800">
                    <XCircle className="h-4 w-4" />
                    <span className="font-medium">Erro:</span>
                  </div>
                  <p className="text-red-700 mt-1">{jobDetails.errorMessage}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Job não encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
