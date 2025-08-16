import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Database,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import type { 
  AccountQueryLogResponse, 
  AccountQueryLogsResponse,
  PeriodFilters 
} from '@/types/rfc'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'

/**
 * QueryLogsPage - Implementa EXATAMENTE o que está documentado nos RFCs
 * Endpoint: GET /api/accounts/{agencia}/{contaCorrente}/query-logs
 * Funcionalidade: Lista paginada de logs de consulta com filtros por período
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
  
  const [filters, setFilters] = useState<PeriodFilters>({
    periodoType: 'mesAno',
    mes: undefined,
    ano: undefined,
    dataInicio: undefined,
    dataFim: undefined
  })

  // Meses para seleção
  const meses = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ]

  // Anos para seleção (2000 até ano atual + 1)
  const anos = Array.from({ length: 26 }, (_, i) => new Date().getFullYear() - 25 + i + 1)

  // Carregar logs de consulta
  const fetchLogs = async () => {
    if (!agencia || !contaCorrente) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      
      // Adicionar filtros de período
      if (filters.periodoType === 'mesAno') {
        if (filters.mes) params.set('mes', filters.mes.toString())
        if (filters.ano) params.set('ano', filters.ano.toString())
      } else {
        if (filters.dataInicio) params.set('dataInicio', filters.dataInicio)
        if (filters.dataFim) params.set('dataFim', filters.dataFim)
      }
      
      // Adicionar parâmetros de paginação
      params.set('page', pagination.currentPage.toString())
      params.set('size', pagination.pageSize.toString())

      const response = await fetch(`/api/accounts/${agencia}/${contaCorrente}/query-logs?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar logs de consulta')
      }

      const data: AccountQueryLogsResponse = await response.json()
      
      setLogs(data.content)
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages,
        totalElements: data.totalElements
      }))
    } catch (err) {
      console.error('Erro ao buscar logs:', err)
      setError('Erro ao carregar logs de consulta')
    } finally {
      setLoading(false)
    }
  }

  // Carregar dados iniciais
  useEffect(() => {
    fetchLogs()
  }, [agencia, contaCorrente, filters, pagination.currentPage, pagination.pageSize])

  // Aplicar filtros
  const applyFilters = () => {
    setPagination(prev => ({ ...prev, currentPage: 0 }))
    fetchLogs()
  }

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      periodoType: 'mesAno',
      mes: undefined,
      ano: undefined,
      dataInicio: undefined,
      dataFim: undefined
    })
    setPagination(prev => ({ ...prev, currentPage: 0 }))
  }

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

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tipo de Filtro */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Tipo de Filtro</Label>
            <RadioGroup
              value={filters.periodoType}
              onValueChange={(value: 'mesAno' | 'dataEspecifica') => setFilters(prev => ({ ...prev, periodoType: value }))}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mesAno" id="mesAno" />
                <Label htmlFor="mesAno">Mês/Ano</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dataEspecifica" id="dataEspecifica" />
                <Label htmlFor="dataEspecifica">Período Específico</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Campos de Filtro */}
          {filters.periodoType === 'mesAno' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mes">Mês</Label>
                <Select
                  value={filters.mes?.toString()}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, mes: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {meses.map((mes) => (
                      <SelectItem key={mes.value} value={mes.value.toString()}>
                        {mes.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ano">Ano</Label>
                <Select
                  value={filters.ano?.toString()}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, ano: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {anos.map((ano) => (
                      <SelectItem key={ano} value={ano.toString()}>
                        {ano}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data Início</Label>
                <Input
                  id="dataInicio"
                  type="datetime-local"
                  value={filters.dataInicio}
                  onChange={(e) => setFilters(prev => ({ ...prev, dataInicio: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataFim">Data Fim</Label>
                <Input
                  id="dataFim"
                  type="datetime-local"
                  value={filters.dataFim}
                  onChange={(e) => setFilters(prev => ({ ...prev, dataFim: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* Botões de Filtro */}
          <div className="flex flex-wrap gap-4">
            <Button onClick={applyFilters} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Aplicando...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Aplicar Filtros
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={clearFilters} disabled={loading}>
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

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
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando logs...</p>
              </div>
            </div>
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
                  onValueChange={(value) => changePageSize(parseInt(value))}
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
