import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Download, 
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  DollarSign,
  RefreshCw
} from 'lucide-react'
import { 
  getQueryLogs, 
  getImports, 
  getMovements,
  getAccountStats,
  type QueryLogResponse,
  type ImportResponse,
  type MovementResponse
} from '@/services/accountService'

/**
 * Componente para relatórios básicos do sistema
 * Inclui relatórios de consultas, importações e movimentações
 */

interface ReportFilters {
  dataInicio: string
  dataFim: string
  agencia?: string
  contaCorrente?: string
  tipoRelatorio: 'consultas' | 'importacoes' | 'movimentacoes' | 'consolidado'
}

interface ReportData {
  consultas: {
    total: number
    sucessos: number
    erros: number
    taxaSucesso: number
    periodo: string
  }
  importacoes: {
    total: number
    concluidas: number
    pendentes: number
    taxaConclusao: number
    periodo: string
  }
  movimentacoes: {
    total: number
    creditos: number
    debitos: number
    saldoLiquido: number
    periodo: string
  }
}

export const BasicReports: React.FC = () => {
  const [filters, setFilters] = useState<ReportFilters>({
    dataInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias atrás
    dataFim: new Date().toISOString().split('T')[0],
    tipoRelatorio: 'consolidado'
  })
  
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detailedData, setDetailedData] = useState<{
    consultas: any[]
    importacoes: any[]
    movimentacoes: any[]
  }>({
    consultas: [],
    importacoes: [],
    movimentacoes: []
  })

  // Carregar dados do relatório
  const loadReportData = async () => {
    setLoading(true)
    setError(null)

    try {
      const { dataInicio, dataFim, agencia, contaCorrente, tipoRelatorio } = filters
      const params = {
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim),
        agencia,
        contaCorrente,
        page: 0,
        size: 1000 // Buscar todos os dados para o relatório
      }

      let consultasData: any[] = []
      let importacoesData: any[] = []
      let movimentacoesData: any[] = []

      // Carregar dados baseado no tipo de relatório
      if (tipoRelatorio === 'consolidado' || tipoRelatorio === 'consultas') {
        try {
          const consultas = await getQueryLogs(params)
          consultasData = consultas.content || []
        } catch (err) {
          console.warn('Erro ao carregar consultas:', err)
        }
      }

      if (tipoRelatorio === 'consolidado' || tipoRelatorio === 'importacoes') {
        try {
          const importacoes = await getImports(params)
          importacoesData = importacoes.content || []
        } catch (err) {
          console.warn('Erro ao carregar importações:', err)
        }
      }

      if (tipoRelatorio === 'consolidado' || tipoRelatorio === 'movimentacoes') {
        try {
          const movimentacoes = await getMovements(params)
          movimentacoesData = movimentacoes.content || []
        } catch (err) {
          console.warn('Erro ao carregar movimentações:', err)
        }
      }

      // Processar dados para o relatório
      const processedData: ReportData = {
        consultas: {
          total: consultasData.length,
          sucessos: consultasData.filter(c => c.erroCodigo === 0).length,
          erros: consultasData.filter(c => c.erroCodigo !== 0).length,
          taxaSucesso: consultasData.length > 0 ? 
            (consultasData.filter(c => c.erroCodigo === 0).length / consultasData.length) * 100 : 0,
          periodo: `${filters.dataInicio} a ${filters.dataFim}`
        },
        importacoes: {
          total: importacoesData.length,
          concluidas: importacoesData.filter(i => i.status === 'concluida').length,
          pendentes: importacoesData.filter(i => i.status === 'pendente').length,
          taxaConclusao: importacoesData.length > 0 ? 
            (importacoesData.filter(i => i.status === 'concluida').length / importacoesData.length) * 100 : 0,
          periodo: `${filters.dataInicio} a ${filters.dataFim}`
        },
        movimentacoes: {
          total: movimentacoesData.length,
          creditos: movimentacoesData.filter(m => m.movimentoTipo === 'C').length,
          debitos: movimentacoesData.filter(m => m.movimentoTipo === 'D').length,
          saldoLiquido: movimentacoesData.reduce((acc, m) => {
            if (m.movimentoTipo === 'C') return acc + (m.movimentoValor || 0)
            return acc - (m.movimentoValor || 0)
          }, 0),
          periodo: `${filters.dataInicio} a ${filters.dataFim}`
        }
      }

      setReportData(processedData)
      setDetailedData({
        consultas: consultasData,
        importacoes: importacoesData,
        movimentacoes: movimentacoesData
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados do relatório')
      console.error('❌ Erro ao carregar relatório:', err)
    } finally {
      setLoading(false)
    }
  }

  // Carregar dados quando filtros mudarem
  useEffect(() => {
    loadReportData()
  }, [filters])

  // Exportar relatório
  const exportReport = (format: 'csv' | 'json') => {
    if (!reportData) return

    const filename = `relatorio_${filters.tipoRelatorio}_${filters.dataInicio}_${filters.dataFim}`

    if (format === 'csv') {
      exportToCSV(filename)
    } else {
      exportToJSON(filename)
    }
  }

  const exportToCSV = (filename: string) => {
    let csvContent = ''

    // Cabeçalho do relatório
    csvContent += `Relatório: ${filters.tipoRelatorio.toUpperCase()}\n`
    csvContent += `Período: ${filters.dataInicio} a ${filters.dataFim}\n`
    csvContent += `Gerado em: ${new Date().toLocaleString('pt-BR')}\n\n`

    if (filters.tipoRelatorio === 'consolidado' || filters.tipoRelatorio === 'consultas') {
      csvContent += 'CONSULTAS\n'
      csvContent += 'Total,Sucessos,Erros,Taxa de Sucesso\n'
      csvContent += `${reportData!.consultas.total},${reportData!.consultas.sucessos},${reportData!.consultas.erros},${reportData!.consultas.taxaSucesso.toFixed(2)}%\n\n`
    }

    if (filters.tipoRelatorio === 'consolidado' || filters.tipoRelatorio === 'importacoes') {
      csvContent += 'IMPORTAÇÕES\n'
      csvContent += 'Total,Concluídas,Pendentes,Taxa de Conclusão\n'
      csvContent += `${reportData!.importacoes.total},${reportData!.importacoes.concluidas},${reportData!.importacoes.pendentes},${reportData!.importacoes.taxaConclusao.toFixed(2)}%\n\n`
    }

    if (filters.tipoRelatorio === 'consolidado' || filters.tipoRelatorio === 'movimentacoes') {
      csvContent += 'MOVIMENTAÇÕES\n'
      csvContent += 'Total,Créditos,Débitos,Saldo Líquido\n'
      csvContent += `${reportData!.movimentacoes.total},${reportData!.movimentacoes.creditos},${reportData!.movimentacoes.debitos},${reportData!.movimentacoes.saldoLiquido.toFixed(2)}\n\n`
    }

    // Dados detalhados
    if (detailedData.consultas.length > 0) {
      csvContent += 'DETALHES DAS CONSULTAS\n'
      csvContent += 'Data/Hora,Agência,Conta,Status,Erro\n'
      detailedData.consultas.forEach(c => {
        csvContent += `${new Date(c.dataHora).toLocaleString('pt-BR')},${c.agencia},${c.contaCorrente},${c.erroCodigo === 0 ? 'Sucesso' : 'Erro'},${c.erroDescricao || 'N/A'}\n`
      })
      csvContent += '\n'
    }

    if (detailedData.importacoes.length > 0) {
      csvContent += 'DETALHES DAS IMPORTAÇÕES\n'
      csvContent += 'Data/Hora,Arquivo,Registros,Contas,Status\n'
      detailedData.importacoes.forEach(i => {
        csvContent += `${i.dataHora ? new Date(i.dataHora).toLocaleString('pt-BR') : 'N/A'},${i.arquivoNome || 'N/A'},${i.qtdRegistros || 'N/A'},${i.qtdContas || 'N/A'},${i.status || 'N/A'}\n`
      })
      csvContent += '\n'
    }

    if (detailedData.movimentacoes.length > 0) {
      csvContent += 'DETALHES DAS MOVIMENTAÇÕES\n'
      csvContent += 'Data,Descrição,Tipo,Valor,Saldo\n'
      detailedData.movimentacoes.forEach(m => {
        csvContent += `${m.movimentoData ? new Date(m.movimentoData).toLocaleDateString('pt-BR') : 'N/A'},${m.descricaoHistorico || 'N/A'},${m.movimentoTipo},${m.movimentoValor || 'N/A'},${m.movimentoSaldo || 'N/A'}\n`
      })
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToJSON = (filename: string) => {
    const reportExport = {
      metadata: {
        tipo: filters.tipoRelatorio,
        periodo: `${filters.dataInicio} a ${filters.dataFim}`,
        geradoEm: new Date().toISOString(),
        filtros: filters
      },
      resumo: reportData,
      detalhes: detailedData
    }

    const jsonContent = JSON.stringify(reportExport, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Gerando relatório...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadReportData} variant="outline">
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios Básicos</h1>
          <p className="text-muted-foreground">
            Relatórios de consultas, importações e movimentações do sistema
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => exportReport('csv')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar CSV</span>
          </Button>
          
          <Button
            onClick={() => exportReport('json')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar JSON</span>
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros do Relatório</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Data de Início</Label>
              <Input
                type="date"
                value={filters.dataInicio}
                onChange={(e) => setFilters(prev => ({ ...prev, dataInicio: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Data de Fim</Label>
              <Input
                type="date"
                value={filters.dataFim}
                onChange={(e) => setFilters(prev => ({ ...prev, dataFim: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Agência (opcional)</Label>
              <Input
                placeholder="1234"
                value={filters.agencia || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, agencia: e.target.value || undefined }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Tipo de Relatório</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={filters.tipoRelatorio}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  tipoRelatorio: e.target.value as ReportFilters['tipoRelatorio'] 
                }))}
              >
                <option value="consolidado">Consolidado</option>
                <option value="consultas">Apenas Consultas</option>
                <option value="importacoes">Apenas Importações</option>
                <option value="movimentacoes">Apenas Movimentações</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo do Relatório */}
      {reportData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Consultas */}
          {(filters.tipoRelatorio === 'consolidado' || filters.tipoRelatorio === 'consultas') && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Consultas</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.consultas.total}</div>
                <p className="text-xs text-muted-foreground mb-2">
                  {reportData.consultas.periodo}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sucessos:</span>
                    <Badge variant="default" className="bg-green-500">
                      {reportData.consultas.sucessos}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Erros:</span>
                    <Badge variant="destructive">
                      {reportData.consultas.erros}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa de Sucesso:</span>
                    <span className="font-medium">
                      {reportData.consultas.taxaSucesso.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Importações */}
          {(filters.tipoRelatorio === 'consolidado' || filters.tipoRelatorio === 'importacoes') && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Importações</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.importacoes.total}</div>
                <p className="text-xs text-muted-foreground mb-2">
                  {reportData.importacoes.periodo}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Concluídas:</span>
                    <Badge variant="default" className="bg-green-500">
                      {reportData.importacoes.concluidas}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pendentes:</span>
                    <Badge variant="warning">
                      {reportData.importacoes.pendentes}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa de Conclusão:</span>
                    <span className="font-medium">
                      {reportData.importacoes.taxaConclusao.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Movimentações */}
          {(filters.tipoRelatorio === 'consolidado' || filters.tipoRelatorio === 'movimentacoes') && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Movimentações</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.movimentacoes.total}</div>
                <p className="text-xs text-muted-foreground mb-2">
                  {reportData.movimentacoes.periodo}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Créditos:</span>
                    <Badge variant="default" className="bg-green-500">
                      {reportData.movimentacoes.creditos}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Débitos:</span>
                    <Badge variant="destructive">
                      {reportData.movimentacoes.debitos}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Saldo Líquido:</span>
                    <span className={`font-medium ${
                      reportData.movimentacoes.saldoLiquido >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      R$ {reportData.movimentacoes.saldoLiquido.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Dados Detalhados */}
      {reportData && (
        <div className="space-y-6">
          {/* Consultas Detalhadas */}
          {(filters.tipoRelatorio === 'consolidado' || filters.tipoRelatorio === 'consultas') && detailedData.consultas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Detalhes das Consultas</span>
                  <Badge variant="outline">
                    {detailedData.consultas.length} registros
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Agência</TableHead>
                      <TableHead>Conta</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Erro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailedData.consultas.slice(0, 50).map((consulta) => (
                      <TableRow key={consulta.id}>
                        <TableCell>
                          {new Date(consulta.dataHora).toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell>{consulta.agencia}</TableCell>
                        <TableCell>{consulta.contaCorrente}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={consulta.erroCodigo === 0 ? 'default' : 'destructive'}
                          >
                            {consulta.erroCodigo === 0 ? 'Sucesso' : 'Erro'}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {consulta.erroDescricao || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {detailedData.consultas.length > 50 && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Mostrando os primeiros 50 registros de {detailedData.consultas.length} total
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Importações Detalhadas */}
          {(filters.tipoRelatorio === 'consolidado' || filters.tipoRelatorio === 'importacoes') && detailedData.importacoes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Detalhes das Importações</span>
                  <Badge variant="outline">
                    {detailedData.importacoes.length} registros
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
                      <TableHead>Contas</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailedData.importacoes.slice(0, 50).map((importacao) => (
                      <TableRow key={importacao.id}>
                        <TableCell>
                          {importacao.dataHora ? 
                            new Date(importacao.dataHora).toLocaleString('pt-BR') : 
                            'N/A'
                          }
                        </TableCell>
                        <TableCell>{importacao.arquivoNome || 'N/A'}</TableCell>
                        <TableCell>{importacao.qtdRegistros || 'N/A'}</TableCell>
                        <TableCell>{importacao.qtdContas || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-500">
                            ✅ Concluída
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {detailedData.importacoes.length > 50 && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Mostrando os primeiros 50 registros de {detailedData.importacoes.length} total
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Movimentações Detalhadas */}
          {(filters.tipoRelatorio === 'consolidado' || filters.tipoRelatorio === 'movimentacoes') && detailedData.movimentacoes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Detalhes das Movimentações</span>
                  <Badge variant="outline">
                    {detailedData.movimentacoes.length} registros
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                    {detailedData.movimentacoes.slice(0, 50).map((movimentacao) => (
                      <TableRow key={movimentacao.id}>
                        <TableCell>
                          {movimentacao.movimentoData ? 
                            new Date(movimentacao.movimentoData).toLocaleDateString('pt-BR') : 
                            'N/A'
                          }
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {movimentacao.descricaoHistorico || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={movimentacao.movimentoTipo === 'C' ? 'default' : 'secondary'}
                            className={movimentacao.movimentoTipo === 'C' ? 'bg-green-500' : 'bg-red-500'}
                          >
                            {movimentacao.movimentoTipo === 'C' ? 'Crédito' : 'Débito'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {movimentacao.movimentoValor ? 
                            movimentacao.movimentoValor.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }) : 
                            'N/A'
                          }
                        </TableCell>
                        <TableCell>
                          {movimentacao.movimentoSaldo ? 
                            movimentacao.movimentoSaldo.toLocaleString('pt-BR', {
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
                {detailedData.movimentacoes.length > 50 && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Mostrando os primeiros 50 registros de {detailedData.movimentacoes.length} total
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default BasicReports
