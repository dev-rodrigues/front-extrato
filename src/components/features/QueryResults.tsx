import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Search, 
  Download, 
  Share2, 
  Filter, 
  RefreshCw,
  FileText,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { 
  getQueryLogs, 
  getImports, 
  getMovements,
  type QueryLogResponse,
  type ImportResponse,
  type MovementResponse,
  type PaginationResponse
} from '@/services/accountService'

/**
 * Componente para exibir resultados de consulta com dados reais da API
 * Suporta filtros, paginação e exportação
 */

interface QueryResultsProps {
  queryData: {
    agencia: string
    contaCorrente: string
    dataInicio: string
    dataFim: string
    tipoConsulta: 'logs' | 'imports' | 'movements' | 'all'
  }
  onNewQuery?: () => void
}

interface FilterState {
  search: string
  status: string
  dateRange: string
  minValue?: number
  maxValue?: number
}

export const QueryResults: React.FC<QueryResultsProps> = ({
  queryData,
  onNewQuery
}) => {
  const [results, setResults] = useState<{
    logs: PaginationResponse<QueryLogResponse> | null
    imports: PaginationResponse<ImportResponse> | null
    movements: PaginationResponse<MovementResponse> | null
  }>({
    logs: null,
    imports: null,
    movements: null
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    dateRange: 'all'
  })
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)

  // Carregar dados da consulta
  const loadQueryData = async () => {
    setLoading(true)
    setError(null)

    try {
      const { agencia, contaCorrente, dataInicio, dataFim, tipoConsulta } = queryData
      const params = {
        agencia,
        contaCorrente,
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim),
        page: currentPage,
        size: pageSize
      }

      const promises: Promise<any>[] = []

      if (tipoConsulta === 'all' || tipoConsulta === 'logs') {
        promises.push(getQueryLogs(params))
      }
      if (tipoConsulta === 'all' || tipoConsulta === 'imports') {
        promises.push(getImports(params))
      }
      if (tipoConsulta === 'all' || tipoConsulta === 'movements') {
        promises.push(getMovements(params))
      }

      const results = await Promise.all(promises)
      
      let index = 0
      if (tipoConsulta === 'all' || tipoConsulta === 'logs') {
        setResults(prev => ({ ...prev, logs: results[index++] }))
      }
      if (tipoConsulta === 'all' || tipoConsulta === 'imports') {
        setResults(prev => ({ ...prev, imports: results[index++] }))
      }
      if (tipoConsulta === 'all' || tipoConsulta === 'movements') {
        setResults(prev => ({ ...prev, movements: results[index++] }))
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados da consulta')
      console.error('❌ Erro ao carregar resultados:', err)
    } finally {
      setLoading(false)
    }
  }

  // Carregar dados quando queryData ou paginação mudar
  useEffect(() => {
    if (queryData.agencia && queryData.contaCorrente) {
      loadQueryData()
    }
  }, [queryData, currentPage, pageSize])

  // Aplicar filtros
  const applyFilters = (data: any[], filterState: FilterState) => {
    return data.filter(item => {
      // Filtro de busca
      if (filterState.search) {
        const searchLower = filterState.search.toLowerCase()
        const searchableFields = Object.values(item).join(' ').toLowerCase()
        if (!searchableFields.includes(searchLower)) {
          return false
        }
      }

      // Filtro de status
      if (filterState.status !== 'all') {
        if (item.erroCodigo !== undefined && filterState.status === 'error' && item.erroCodigo === 0) {
          return false
        }
        if (item.erroCodigo !== undefined && filterState.status === 'success' && item.erroCodigo !== 0) {
          return false
        }
      }

      // Filtro de valor (para movimentações)
      if (filterState.minValue !== undefined && item.movimentoValor !== undefined) {
        if (item.movimentoValor < filterState.minValue) return false
      }
      if (filterState.maxValue !== undefined && item.movimentoValor !== undefined) {
        if (item.movimentoValor > filterState.maxValue) return false
      }

      return true
    })
  }

  // Exportar dados
  const exportData = (format: 'csv' | 'json') => {
    const { agencia, contaCorrente } = queryData
    let dataToExport: any[] = []

    // Coletar dados baseado no tipo de consulta
    if (queryData.tipoConsulta === 'all' || queryData.tipoConsulta === 'logs') {
      if (results.logs) {
        dataToExport.push(...results.logs.content)
      }
    }
    if (queryData.tipoConsulta === 'all' || queryData.tipoConsulta === 'imports') {
      if (results.imports) {
        dataToExport.push(...results.imports.content)
      }
    }
    if (queryData.tipoConsulta === 'all' || queryData.tipoConsulta === 'movements') {
      if (results.movements) {
        dataToExport.push(...results.movements.content)
      }
    }

    // Aplicar filtros
    dataToExport = applyFilters(dataToExport, filters)

    if (format === 'csv') {
      exportToCSV(dataToExport, `${agencia}_${contaCorrente}_${queryData.tipoConsulta}`)
    } else {
      exportToJSON(dataToExport, `${agencia}_${contaCorrente}_${queryData.tipoConsulta}`)
    }
  }

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          return typeof value === 'string' ? `"${value}"` : value
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToJSON = (data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Compartilhar consulta
  const shareQuery = () => {
    const shareData = {
      title: 'Consulta de Extrato Bancário',
      text: `Consulta para Ag. ${queryData.agencia} / Conta ${queryData.contaCorrente}`,
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      // Fallback para copiar URL
      navigator.clipboard.writeText(window.location.href)
      alert('URL copiada para a área de transferência!')
    }
  }

  // Renderizar tabela de logs
  const renderLogsTable = () => {
    if (!results.logs) return null

    const filteredData = applyFilters(results.logs.content, filters)

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Logs de Consulta</h3>
          <Badge variant="outline">
            {filteredData.length} de {results.logs.totalElements} resultados
          </Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Descrição</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {new Date(log.dataHora).toLocaleString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={log.erroCodigo === 0 ? 'default' : 'destructive'}
                    className="flex items-center space-x-1"
                  >
                    {log.erroCodigo === 0 ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    <span>{log.erroCodigo === 0 ? 'Sucesso' : 'Erro'}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(log.consultaPeriodoDe).toLocaleDateString('pt-BR')} - 
                  {new Date(log.consultaPeriodoAte).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  {log.erroDescricao || 'Consulta realizada com sucesso'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Renderizar tabela de importações
  const renderImportsTable = () => {
    if (!results.imports) return null

    const filteredData = applyFilters(results.imports.content, filters)

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Histórico de Importações</h3>
          <Badge variant="outline">
            {filteredData.length} de {results.imports.totalElements} resultados
          </Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Arquivo</TableHead>
              <TableHead>Registros</TableHead>
              <TableHead>Contas</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((importItem) => (
              <TableRow key={importItem.id}>
                <TableCell>
                  {importItem.dataHora ? 
                    new Date(importItem.dataHora).toLocaleString('pt-BR') : 
                    'N/A'
                  }
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{importItem.arquivoNome || 'N/A'}</span>
                  </div>
                </TableCell>
                <TableCell>{importItem.qtdRegistros || 'N/A'}</TableCell>
                <TableCell>{importItem.qtdContas || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-500">
                    ✅ Concluída
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Renderizar tabela de movimentações
  const renderMovementsTable = () => {
    if (!results.movements) return null

    const filteredData = applyFilters(results.movements.content, filters)

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Movimentações Bancárias</h3>
          <Badge variant="outline">
            {filteredData.length} de {results.movements.totalElements} resultados
          </Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Saldo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>
                  {movement.movimentoData ? 
                    new Date(movement.movimentoData).toLocaleDateString('pt-BR') : 
                    'N/A'
                  }
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate">
                    {movement.descricaoHistorico || 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={movement.movimentoTipo === 'C' ? 'default' : 'secondary'}
                    className={movement.movimentoTipo === 'C' ? 'bg-green-500' : 'bg-red-500'}
                  >
                    {movement.movimentoTipo === 'C' ? 'Crédito' : 'Débito'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <span>
                      {movement.movimentoValor ? 
                        movement.movimentoValor.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }) : 
                        'N/A'
                      }
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {movement.movimentoSaldo ? 
                    movement.movimentoSaldo.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }) : 
                    'N/A'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Carregando resultados da consulta...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadQueryData} variant="outline">
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header dos Resultados */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Resultados da Consulta</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Ag. {queryData.agencia} / Conta {queryData.contaCorrente} • 
                {new Date(queryData.dataInicio).toLocaleDateString('pt-BR')} - 
                {new Date(queryData.dataFim).toLocaleDateString('pt-BR')}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => exportData('csv')}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>CSV</span>
              </Button>
              
              <Button
                onClick={() => exportData('json')}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>JSON</span>
              </Button>
              
              <Button
                onClick={shareQuery}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Compartilhar</span>
              </Button>
              
              {onNewQuery && (
                <Button
                  onClick={onNewQuery}
                  variant="default"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Nova Consulta</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <Input
                placeholder="Buscar em todos os campos..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">Todos</option>
                <option value="success">Sucesso</option>
                <option value="error">Erro</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Valor Mínimo</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={filters.minValue || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  minValue: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Valor Máximo</Label>
              <Input
                type="number"
                placeholder="999999.99"
                value={filters.maxValue || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  maxValue: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <div className="space-y-6">
        {queryData.tipoConsulta === 'all' || queryData.tipoConsulta === 'logs' ? (
          <Card>
            <CardContent className="pt-6">
              {renderLogsTable()}
            </CardContent>
          </Card>
        ) : null}

        {queryData.tipoConsulta === 'all' || queryData.tipoConsulta === 'imports' ? (
          <Card>
            <CardContent className="pt-6">
              {renderImportsTable()}
            </CardContent>
          </Card>
        ) : null}

        {queryData.tipoConsulta === 'all' || queryData.tipoConsulta === 'movements' ? (
          <Card>
            <CardContent className="pt-6">
              {renderMovementsTable()}
            </CardContent>
          </Card>
        ) : null}
      </div>

      {/* Paginação */}
      {(results.logs?.totalPages || results.imports?.totalPages || results.movements?.totalPages) && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Página {currentPage + 1} de {Math.max(
                  results.logs?.totalPages || 0,
                  results.imports?.totalPages || 0,
                  results.movements?.totalPages || 0
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  Anterior
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= Math.max(
                    (results.logs?.totalPages || 0) - 1,
                    (results.imports?.totalPages || 0) - 1,
                    (results.movements?.totalPages || 0) - 1
                  )}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Próxima
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default QueryResults
