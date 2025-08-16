import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AppLoading } from '@/components/ui/AppLoading'
import { 
  AlertCircle, 
  FileText, 
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle
} from 'lucide-react'
import type { 
  AccountQueryLogResponse
} from '@/types/rfc'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { AccountService } from '@/services/accountService'

/**
 * QueryLogsPage - Implementa EXATAMENTE o que está documentado nos RFCs
 * Endpoint: GET /api/accounts/{agencia}/{contaCorrente}/query-logs
 * Funcionalidade: Lista paginada de logs de consulta para uma conta específica
 */
export function QueryLogsPage() {
  const { agencia, contaCorrente } = useParams<{ agencia: string; contaCorrente: string }>()

  const [logs, setLogs] = useState<AccountQueryLogResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 20,
    totalPages: 0,
    totalElements: 0
  })

  // Carregar logs de consulta
  const fetchLogs = async () => {
    if (!agencia || !contaCorrente) return

    setLoading(true)
    setError(null)

    try {
      console.log('Buscando logs para:', { agencia, contaCorrente, pagination })
      
      const data = await AccountService.getQueryLogs(agencia, contaCorrente, {
        agencia,
        contaCorrente,
        page: pagination.currentPage,
        size: pagination.pageSize
      })
      
      console.log('Resposta da API:', data)
      
      if (!data || !data.content) {
        throw new Error('Resposta da API inválida')
      }
      
      setLogs(data.content)
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0
      }))
    } catch (err) {
      console.error('Erro ao buscar logs:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar logs de consulta')
    } finally {
      setLoading(false)
    }
  }

  // Carregar dados iniciais
  useEffect(() => {
    fetchLogs()
  }, [agencia, contaCorrente, pagination.currentPage, pagination.pageSize])

  // Mudar página
  const changePage = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }))
  }

  // Mudar tamanho da página
  const changePageSize = (newSize: number) => {
    setPagination(prev => ({ ...prev, pageSize: newSize, currentPage: 0 }))
  }

  // Formatar data/hora
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

  // Formatar período de consulta
  const formatPeriodo = (de: string | undefined | null, ate: string | undefined | null): string => {
    if (!de || !ate) return 'Período não definido'
    
    try {
      const dataDe = new Date(de)
      const dataAte = new Date(ate)
      
      if (isNaN(dataDe.getTime()) || isNaN(dataAte.getTime())) return 'Datas inválidas'
      
      return `${dataDe.toLocaleDateString('pt-BR')} a ${dataAte.toLocaleDateString('pt-BR')}`
    } catch {
      return 'Período inválido'
    }
  }

  // Obter status do log
  const getLogStatus = (erroCodigo: number) => {
    if (erroCodigo === 0) {
      return { label: 'Sucesso', variant: 'default', icon: CheckCircle }
    }
    return { label: 'Erro', variant: 'destructive', icon: XCircle }
  }

  // Gerar breadcrumbs
  const breadcrumbs = [
    { label: 'Contas', href: '/accounts' },
    { label: `${agencia}/${contaCorrente}`, href: `/accounts/${agencia}/${contaCorrente}` },
    { label: 'Logs de Consulta', href: `/accounts/${agencia}/${contaCorrente}/logs` }
  ]

  if (!agencia || !contaCorrente) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive">Parâmetros de conta inválidos</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Logs de Consulta</h1>
        <p className="text-muted-foreground">
          Histórico de tentativas de consulta para a conta {agencia}/{contaCorrente}
        </p>
      </div>

      {/* Lista de Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Logs de Consulta</CardTitle>
          <p className="text-sm text-muted-foreground">
            {pagination.totalElements} registro(s) encontrado(s)
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <AppLoading />
          ) : error ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={fetchLogs}>Tentar Novamente</Button>
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum log de consulta encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => {
                const status = getLogStatus(log.erroCodigo)
                const StatusIcon = status.icon
                
                return (
                  <div key={log.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <StatusIcon className={`h-5 w-5 ${status.variant === 'destructive' ? 'text-red-500' : 'text-green-500'}`} />
                        <span className="font-medium">ID: {log.id}</span>
                        <Badge variant={status.variant as any}>
                          {status.label}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDateTime(log.dataHoraTentativa)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Período:</span>
                        <div className="font-medium">
                          {formatPeriodo(log.consultaPeriodoDe, log.consultaPeriodoAte)}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Banco:</span>
                        <div className="font-medium">{log.banco}</div>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Conta:</span>
                        <div className="font-medium">{log.agencia}/{log.contaCorrente}</div>
                      </div>
                    </div>
                    
                    {log.erroCodigo !== 0 && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-center space-x-2 text-red-800">
                          <XCircle className="h-4 w-4" />
                          <span className="font-medium">Erro {log.erroCodigo}:</span>
                        </div>
                        <p className="text-red-700 mt-1">{log.erroDescricao || 'Erro não especificado'}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paginação */}
      {pagination.totalPages > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Paginação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changePage(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                
                <span className="text-sm">
                  {pagination.currentPage + 1} de {pagination.totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => changePage(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages - 1}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Itens por página:</span>
                <Select
                  value={pagination.pageSize.toString()}
                  onValueChange={(value: string) => changePageSize(parseInt(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-2 text-center text-sm text-muted-foreground">
              Total: {pagination.totalElements} registros | Página atual: {pagination.currentPage + 1} de {pagination.totalPages}
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  )
}
