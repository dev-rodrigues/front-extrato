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
  TrendingUp, 
  AlertCircle, 
  DollarSign, 
  Database,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react'
import type { 
  AccountMovementResponse, 
  AccountMovementsResponse,
  PeriodFilters 
} from '@/types/rfc'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'

/**
 * MovementsPage - Implementa EXATAMENTE o que está documentado nos RFCs
 * Endpoint: GET /api/accounts/{agencia}/{contaCorrente}/movements
 * Funcionalidade: Lista paginada de movimentações com filtros por período
 */
export function MovementsPage() {
  const { agencia, contaCorrente } = useParams<{ agencia: string; contaCorrente: string }>()

  
  const [movements, setMovements] = useState<AccountMovementResponse[]>([])
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

  // Carregar movimentações
  const fetchMovements = async () => {
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

      const response = await fetch(`/api/accounts/${agencia}/${contaCorrente}/movements?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar movimentações')
      }

      const data: AccountMovementsResponse = await response.json()
      
      setMovements(data.content)
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages,
        totalElements: data.totalElements
      }))
    } catch (err) {
      console.error('Erro ao buscar movimentações:', err)
      setError('Erro ao carregar movimentações')
    } finally {
      setLoading(false)
    }
  }

  // Carregar dados iniciais
  useEffect(() => {
    fetchMovements()
  }, [agencia, contaCorrente, filters, pagination.currentPage, pagination.pageSize])

  // Aplicar filtros
  const applyFilters = () => {
    setPagination(prev => ({ ...prev, currentPage: 0 }))
    fetchMovements()
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
  const formatDateTime = (dateString: string | null): string => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('pt-BR')
  }

  // Formatar valor monetário
  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  // Formatar número


  // Obter cor do tipo de movimentação
  const getMovementTypeColor = (tipo: string | null): string => {
    if (!tipo) return 'bg-gray-100 text-gray-800'
    return tipo === 'C' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  // Obter label do tipo de movimentação
  const getMovementTypeLabel = (tipo: string | null): string => {
    if (!tipo) return 'N/A'
    return tipo === 'C' ? 'CRÉDITO' : 'DÉBITO'
  }

  // Gerar breadcrumbs
  const breadcrumbs = [
    { label: 'Contas', href: '/accounts' },
    { label: `${agencia}/${contaCorrente}`, href: `/accounts/${agencia}/${contaCorrente}` },
    { label: 'Movimentações', href: `/accounts/${agencia}/${contaCorrente}/movements` }
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
        <h1 className="text-3xl font-bold tracking-tight">Movimentações</h1>
        <p className="text-muted-foreground">
          Histórico de transações financeiras para a conta {agencia}/{contaCorrente}
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

      {/* Lista de Movimentações */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Movimentações</CardTitle>
          <p className="text-sm text-muted-foreground">
            {pagination.totalElements} movimentação(ões) encontrada(s)
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando movimentações...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={fetchMovements}>Tentar Novamente</Button>
              </div>
            </div>
          ) : movements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma movimentação encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {movements.map((movement) => (
                <div key={movement.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">ID: {movement.id}</span>
                      <Badge className={getMovementTypeColor(movement.movimentoTipo)}>
                        {getMovementTypeLabel(movement.movimentoTipo)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDateTime(movement.movimentoData)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Valor:</span>
                      <div className="font-medium text-lg flex items-center space-x-2">
                        <DollarSign className="h-5 w-5" />
                        <span className={movement.movimentoTipo === 'C' ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(movement.movimentoValor)}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Saldo:</span>
                      <div className="font-medium flex items-center space-x-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatCurrency(movement.movimentoSaldo)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Data Contábil:</span>
                      <div className="font-medium">
                        {formatDateTime(movement.movimentoDataContabil)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Histórico:</span>
                      <div className="font-medium">
                        {movement.descricaoHistorico || 'N/A'}
                      </div>
                      {movement.codigoHistorico && (
                        <div className="text-xs text-muted-foreground">
                          Código: {movement.codigoHistorico}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Documento:</span>
                      <div className="font-medium flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>{movement.documentoNumero || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Natureza:</span>
                      <div className="font-medium">{movement.natureza || 'N/A'}</div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Categoria:</span>
                      <div className="font-medium">{movement.movimentoCategoria || 'N/A'}</div>
                    </div>
                  </div>
                  
                  {/* Informações de Contrapartida */}
                  {movement.complementoBancoOrigem && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="text-sm font-medium text-blue-800 mb-2">Informações de Contrapartida</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">Banco:</span>
                          <div className="font-medium">{movement.complementoBancoOrigem}</div>
                        </div>
                        <div>
                          <span className="text-blue-700">Agência:</span>
                          <div className="font-medium">{movement.complementoAgenciaOrigem || 'N/A'}</div>
                        </div>
                        <div>
                          <span className="text-blue-700">Conta:</span>
                          <div className="font-medium">
                            {movement.complementoContaCorrenteOrigem || 'N/A'}
                            {movement.complementoContaCorrenteDVOrigem && `-${movement.complementoContaCorrenteDVOrigem}`}
                          </div>
                        </div>
                      </div>
                      {movement.complementoAlfa && (
                        <div className="mt-2">
                          <span className="text-blue-700">Complemento:</span>
                          <div className="font-medium">{movement.complementoAlfa}</div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* CPF/CNPJ da Contrapartida */}
                  {movement.numeroCpfCnpjContrapartida && (
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
                      <div className="text-sm font-medium text-gray-800 mb-2">Contrapartida</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-700">CPF/CNPJ:</span>
                          <div className="font-medium">{movement.numeroCpfCnpjContrapartida}</div>
                        </div>
                        <div>
                          <span className="text-gray-700">Tipo:</span>
                          <div className="font-medium">
                            {movement.indicadorTipoPessoaContrapartida === 'F' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3 flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                    <Button variant="outline" size="sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Analisar
                    </Button>
                  </div>
                </div>
              ))}
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
              Total: {pagination.totalElements} movimentações | Página atual: {pagination.currentPage + 1} de {pagination.totalPages}
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  )
}
