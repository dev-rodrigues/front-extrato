import { useState, useEffect } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  RefreshCw, 
  Eye,
  Calendar,
  Building2,
  CreditCard,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import type { 
  AccountQueryLogResponse, 
  AccountImportResponse, 
  AccountMovementResponse,
  PaginationResponse 
} from '@/types/api'

interface QueryResultsProps {
  agencia: string
  contaCorrente: string
  dataInicio: Date
  dataFim: Date
  tipoConsulta: 'logs' | 'imports' | 'movements' | 'all'
  onRefresh?: () => void
  onExport?: (data: any) => void
}

/**
 * Componente para exibir resultados de consulta com paginação
 * Suporta logs, importações e movimentações
 */
export const QueryResults = ({
  agencia,
  contaCorrente,
  dataInicio,
  dataFim,
  tipoConsulta,
  onRefresh,
  onExport
}: QueryResultsProps) => {
  const [activeTab, setActiveTab] = useState<'logs' | 'imports' | 'movements'>('logs')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)

  // Dados mockados para demonstração (substituir por dados reais da API)
  const [logs, setLogs] = useState<PaginationResponse<AccountQueryLogResponse> | null>(null)
  const [imports, setImports] = useState<PaginationResponse<AccountImportResponse> | null>(null)
  const [movements, setMovements] = useState<PaginationResponse<AccountMovementResponse> | null>(null)

  // Carregar dados iniciais
  useEffect(() => {
    loadData()
  }, [agencia, contaCorrente, dataInicio, dataFim, currentPage, pageSize])

  // Carregar dados baseado no tipo de consulta
  const loadData = async () => {
    setLoading(true)
    
    try {
      // Simular chamadas à API (substituir por chamadas reais)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (tipoConsulta === 'all' || tipoConsulta === 'logs') {
        setLogs(generateMockLogs())
      }
      
      if (tipoConsulta === 'all' || tipoConsulta === 'imports') {
        setImports(generateMockImports())
      }
      
      if (tipoConsulta === 'all' || tipoConsulta === 'movements') {
        setMovements(generateMockMovements())
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  // Gerar dados mockados para logs
  const generateMockLogs = (): PaginationResponse<AccountQueryLogResponse> => {
    const mockLogs: AccountQueryLogResponse[] = Array.from({ length: pageSize }, (_, i) => ({
      id: `log-${currentPage * pageSize + i + 1}`,
      banco: '001',
      agencia,
      contaCorrente,
      consultaPeriodoDe: dataInicio,
      consultaPeriodoAte: dataFim,
      erroCodigo: Math.random() > 0.8 ? 500 : 0,
      erroDescricao: Math.random() > 0.8 ? 'Erro interno do servidor' : undefined,
      dataHoraTentativa: new Date(Date.now() - Math.random() * 86400000),
      dataHora: new Date(Date.now() - Math.random() * 86400000),
      status: Math.random() > 0.8 ? 'ERROR' : 'SUCCESS'
    }))

    return {
      content: mockLogs,
      pageNumber: currentPage,
      pageSize,
      totalElements: 150,
      totalPages: Math.ceil(150 / pageSize),
      hasNext: currentPage < Math.ceil(150 / pageSize) - 1,
      hasPrevious: currentPage > 0,
      isFirst: currentPage === 0,
      isLast: currentPage === Math.ceil(150 / pageSize) - 1
    }
  }

  // Gerar dados mockados para importações
  const generateMockImports = (): PaginationResponse<AccountImportResponse> => {
    const mockImports: AccountImportResponse[] = Array.from({ length: pageSize }, (_, i) => ({
      id: `import-${currentPage * pageSize + i + 1}`,
      layoutId: '2',
      arquivoNome: `IMPORTED_WITH_API_${currentPage * pageSize + i + 1}`,
      arquivoGeracaoDataHora: new Date(Date.now() - Math.random() * 86400000),
      qtdRegistros: Math.floor(Math.random() * 1000) + 100,
      qtdContas: 1,
      dataHora: new Date(Date.now() - Math.random() * 86400000),
      consultaAgencia: agencia,
      consultaContaCorrente: contaCorrente,
      consultaPeriodoDe: dataInicio,
      consultaPeriodoAte: dataFim,
      status: Math.random() > 0.9 ? 'ERROR' : Math.random() > 0.7 ? 'PROCESSING' : 'SUCCESS'
    }))

    return {
      content: mockImports,
      pageNumber: currentPage,
      pageSize,
      totalElements: 75,
      totalPages: Math.ceil(75 / pageSize),
      hasNext: currentPage < Math.ceil(75 / pageSize) - 1,
      hasPrevious: currentPage > 0,
      isFirst: currentPage === 0,
      isLast: currentPage === Math.ceil(75 / pageSize) - 1
    }
  }

  // Gerar dados mockados para movimentações
  const generateMockMovements = (): PaginationResponse<AccountMovementResponse> => {
    const mockMovements: AccountMovementResponse[] = Array.from({ length: pageSize }, (_, i) => ({
      id: `movement-${currentPage * pageSize + i + 1}`,
      numeroSequencialExtrato: `${currentPage * pageSize + i + 1}`,
      movimentoData: new Date(Date.now() - Math.random() * 86400000),
      movimentoTipo: Math.random() > 0.5 ? 'C' : 'D',
      movimentoValor: Math.floor(Math.random() * 10000) + 100,
      movimentoSaldo: Math.floor(Math.random() * 50000) + 1000,
      posicaoSaldo: Math.random() > 0.5 ? '+' : '-',
      descricaoHistorico: [
        'TRANSFERENCIA DOC',
        'PAGAMENTO BOLETO',
        'DEPOSITO',
        'SAQUE',
        'TED'
      ][Math.floor(Math.random() * 5)],
      documentoNumero: Math.floor(Math.random() * 1000000000).toString(),
      numeroCpfCnpjContrapartida: Math.floor(Math.random() * 100000000000).toString(),
      agencia,
      contaCorrente
    }))

    return {
      content: mockMovements,
      pageNumber: currentPage,
      pageSize,
      totalElements: 300,
      totalPages: Math.ceil(300 / pageSize),
      hasNext: currentPage < Math.ceil(300 / pageSize) - 1,
      hasPrevious: currentPage > 0,
      isFirst: currentPage === 0,
      isLast: currentPage === Math.ceil(300 / pageSize) - 1
    }
  }

  // Filtrar dados por busca
  const filterData = (data: any[], query: string) => {
    if (!query) return data
    return data.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    )
  }

  // Obter dados filtrados para a aba ativa
  const getFilteredData = () => {
    let data: any[] = []
    
    switch (activeTab) {
      case 'logs':
        data = logs?.content || []
        break
      case 'imports':
        data = imports?.content || []
        break
      case 'movements':
        data = movements?.content || []
        break
    }
    
    return filterData(data, searchQuery)
  }

  // Obter paginação para a aba ativa
  const getPagination = () => {
    switch (activeTab) {
      case 'logs':
        return logs
      case 'imports':
        return imports
      case 'movements':
        return movements
      default:
        return null
    }
  }

  // Navegar para página
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  // Alterar tamanho da página
  const changePageSize = (size: number) => {
    setPageSize(size)
    setCurrentPage(0)
  }

  // Exportar dados da aba ativa
  const handleExport = () => {
    if (!onExport) return
    
    const data = getFilteredData()
    const exportData = {
      tipo: activeTab.toUpperCase(),
      dados: data,
      filtros: {
        agencia,
        contaCorrente,
        dataInicio,
        dataFim,
        busca: searchQuery
      }
    }
    
    onExport(exportData)
  }

  // Obter status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <Badge variant="default" className="bg-green-500">✅ Sucesso</Badge>
      case 'ERROR':
        return <Badge variant="destructive">❌ Erro</Badge>
      case 'PENDING':
        return <Badge variant="secondary">⏳ Pendente</Badge>
      case 'PROCESSING':
        return <Badge variant="outline">🔄 Processando</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Obter tipo de movimento badge
  const getMovementTypeBadge = (tipo: string) => {
    switch (tipo) {
      case 'C':
        return <Badge variant="default" className="bg-green-500">Crédito</Badge>
      case 'D':
        return <Badge variant="destructive">Débito</Badge>
      default:
        return <Badge variant="outline">{tipo}</Badge>
    }
  }

  const filteredData = getFilteredData()
  const pagination = getPagination()

  return (
    <div className="space-y-6">
      {/* Cabeçalho com informações da consulta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Resultados da Consulta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span><strong>Agência:</strong> {agencia}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span><strong>Conta:</strong> {contaCorrente}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                <strong>Período:</strong> {format(dataInicio, 'dd/MM/yyyy', { locale: ptBR })} - {format(dataFim, 'dd/MM/yyyy', { locale: ptBR })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles de busca e filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
            Limpar
          </Button>
        </div>

        <div className="flex gap-2">
          <Select value={pageSize.toString()} onValueChange={(value) => changePageSize(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 por página</SelectItem>
              <SelectItem value="20">20 por página</SelectItem>
              <SelectItem value="50">50 por página</SelectItem>
              <SelectItem value="100">100 por página</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          {onExport && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          )}
        </div>
      </div>

      {/* Tabs para diferentes tipos de dados */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="logs" disabled={tipoConsulta !== 'all' && tipoConsulta !== 'logs'}>
            Logs de Consulta
          </TabsTrigger>
          <TabsTrigger value="imports" disabled={tipoConsulta !== 'all' && tipoConsulta !== 'imports'}>
            Importações
          </TabsTrigger>
          <TabsTrigger value="movements" disabled={tipoConsulta !== 'all' && tipoConsulta !== 'movements'}>
            Movimentações
          </TabsTrigger>
        </TabsList>

        {/* Tab de Logs */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Logs de Consulta</span>
                <Badge variant="outline">
                  {filteredData.length} de {pagination?.totalElements || 0} resultados
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Erro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((log: AccountQueryLogResponse) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {format(new Date(log.dataHora), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>
                        {format(new Date(log.consultaPeriodoDe), 'dd/MM/yyyy', { locale: ptBR })} - {' '}
                        {format(new Date(log.consultaPeriodoAte), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {log.erroCodigo > 0 ? (
                          <span className="text-red-600 text-sm">
                            {log.erroCodigo}: {log.erroDescricao}
                          </span>
                        ) : (
                          <span className="text-green-600 text-sm">Sem erros</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Importações */}
        <TabsContent value="imports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Importações Realizadas</span>
                <Badge variant="outline">
                  {filteredData.length} de {pagination?.totalElements || 0} resultados
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Arquivo</TableHead>
                    <TableHead>Registros</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((importItem: AccountImportResponse) => (
                    <TableRow key={importItem.id}>
                      <TableCell>
                        {format(new Date(importItem.dataHora!), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {importItem.arquivoNome}
                      </TableCell>
                      <TableCell>{importItem.qtdRegistros}</TableCell>
                      <TableCell>{getStatusBadge(importItem.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Movimentações */}
        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Movimentações Bancárias</span>
                <Badge variant="outline">
                  {filteredData.length} de {pagination?.totalElements || 0} resultados
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((movement: AccountMovementResponse) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {format(new Date(movement.movimentoData!), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell>{getMovementTypeBadge(movement.movimentoTipo!)}</TableCell>
                      <TableCell className="font-mono">
                        R$ {movement.movimentoValor!.toFixed(2)}
                      </TableCell>
                      <TableCell className="font-mono">
                        R$ {movement.movimentoSaldo!.toFixed(2)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {movement.descricaoHistorico}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Paginação */}
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {pagination.pageNumber * pagination.pageSize + 1} - {' '}
            {Math.min((pagination.pageNumber + 1) * pagination.pageSize, pagination.totalElements)} de {' '}
            {pagination.totalElements} resultados
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(pagination.pageNumber - 1)}
              disabled={!pagination.hasPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = Math.max(0, Math.min(pagination.totalPages - 1, pagination.pageNumber - 2 + i))
                return (
                  <Button
                    key={page}
                    variant={page === pagination.pageNumber ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page + 1}
                  </Button>
                )
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(pagination.pageNumber + 1)}
              disabled={!pagination.hasNext}
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Estado de carregamento */}
      {loading && (
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Carregando dados...</span>
        </div>
      )}

      {/* Sem resultados */}
      {!loading && filteredData.length === 0 && (
        <div className="text-center p-8">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Nenhum resultado encontrado
          </h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros ou a busca para encontrar os dados desejados.
          </p>
        </div>
      )}
    </div>
  )
}
