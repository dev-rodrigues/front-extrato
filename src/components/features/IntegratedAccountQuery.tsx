import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  FileText, 
  Download, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  CreditCard
} from 'lucide-react'

import { AdvancedAccountQueryForm } from '@/components/forms/AdvancedAccountQueryForm'
import { QueryResults } from './QueryResults'
import { useAccountQuery } from '@/hooks/useAccountQuery'

import type { AccountQueryFormData, ExportRequest } from '@/schemas/accountQuerySchema'

/**
 * Componente integrado para consulta de contas bancárias
 * Combina formulário avançado com resultados paginados
 */
export const IntegratedAccountQuery = () => {
  const [queryData, setQueryData] = useState<AccountQueryFormData | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Hook para consulta de contas
  const {
    logs,
    imports,
    movements,
    fetchLogs,
    fetchImports,
    fetchMovements,
    fetchAccountData,
    clearData,
    hasData,
    isValidAccount
  } = useAccountQuery(
    queryData?.agencia || '',
    queryData?.contaCorrente || ''
  )

  // Manipular envio do formulário
  const handleSubmit = async (data: AccountQueryFormData) => {
    setLoading(true)
    setError(null)
    
    try {
      // Validar formato da conta
      if (!isValidAccount()) {
        throw new Error('Formato de agência ou conta inválido')
      }

      // Executar consulta baseada no tipo
      switch (data.tipoConsulta) {
        case 'logs':
          await fetchLogs({
            dataInicio: data.dataInicio,
            dataFim: data.dataFim,
            page: data.page,
            size: data.size
          })
          break
          
        case 'imports':
          await fetchImports({
            dataInicio: data.dataInicio,
            dataFim: data.dataFim,
            page: data.page,
            size: data.size
          })
          break
          
        case 'movements':
          await fetchMovements({
            dataInicio: data.dataInicio,
            dataFim: data.dataFim,
            page: data.page,
            size: data.size
          })
          break
          
        case 'all':
          await fetchAccountData({
            dataInicio: data.dataInicio,
            dataFim: data.dataFim,
            page: data.page,
            size: data.size
          })
          break
      }

      setQueryData(data)
      setShowResults(true)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao executar consulta')
    } finally {
      setLoading(false)
    }
  }

  // Manipular exportação
  const handleExport = async (exportData: ExportRequest) => {
    try {
      // Simular exportação (substituir por implementação real)
      console.log('Exportando dados:', exportData)
      
      // Criar arquivo de exemplo
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `consulta_${queryData?.agencia}_${queryData?.contaCorrente}_${new Date().toISOString().split('T')[0]}.json`
      link.click()
      
      URL.revokeObjectURL(url)
      
    } catch (err) {
      setError('Erro ao exportar dados')
    }
  }

  // Nova consulta
  const handleNewQuery = () => {
    setShowResults(false)
    setQueryData(null)
    clearData()
    setError(null)
  }

  // Atualizar consulta
  const handleRefresh = () => {
    if (queryData) {
      handleSubmit(queryData)
    }
  }

  // Obter estatísticas da consulta
  const getQueryStats = () => {
    if (!hasData) return null

    const stats = {
      logs: logs?.totalElements || 0,
      imports: imports?.totalElements || 0,
      movements: movements?.totalElements || 0,
      total: (logs?.totalElements || 0) + (imports?.totalElements || 0) + (movements?.totalElements || 0)
    }

    return stats
  }

  const stats = getQueryStats()

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consulta de Contas Bancárias</h1>
          <p className="text-muted-foreground">
            Sistema integrado para consulta de logs, importações e movimentações
          </p>
        </div>
        
        {showResults && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleNewQuery}>
              <Search className="h-4 w-4 mr-2" />
              Nova Consulta
            </Button>
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        )}
      </div>

      {/* Formulário de Consulta */}
      {!showResults && (
        <AdvancedAccountQueryForm
          onSubmit={handleSubmit}
          onExport={handleExport}
          loading={loading}
          initialData={queryData || undefined}
        />
      )}

      {/* Resultados da Consulta */}
      {showResults && queryData && (
        <div className="space-y-6">
          {/* Resumo da Consulta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Resumo da Consulta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{queryData.agencia}</div>
                  <div className="text-sm text-blue-600">Agência</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{queryData.contaCorrente}</div>
                  <div className="text-sm text-green-600">Conta</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm text-purple-600">
                    {queryData.dataInicio.toLocaleDateString('pt-BR')} - {queryData.dataFim.toLocaleDateString('pt-BR')}
                  </div>
                  <div className="text-sm text-purple-600">Período</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">{stats?.total || 0}</div>
                  <div className="text-sm text-orange-600">Total de Registros</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas Detalhadas */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Estatísticas da Consulta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{stats.logs}</div>
                      <div className="text-sm text-blue-600">Logs de Consulta</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Download className="h-6 w-6 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold text-green-600">{stats.imports}</div>
                      <div className="text-sm text-green-600">Importações</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <FileText className="h-6 w-6 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{stats.movements}</div>
                      <div className="text-sm text-purple-600">Movimentações</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resultados */}
          <QueryResults
            agencia={queryData.agencia}
            contaCorrente={queryData.contaCorrente}
            dataInicio={queryData.dataInicio}
            dataFim={queryData.dataFim}
            tipoConsulta={queryData.tipoConsulta}
            onRefresh={handleRefresh}
            onExport={handleExport}
          />
        </div>
      )}

      {/* Mensagens de Erro */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h4 className="font-medium">Erro na Consulta</h4>
                <p className="text-sm">{error}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="ml-auto"
              >
                ✕
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado de Carregamento */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mr-3" />
              <span className="text-muted-foreground">Executando consulta...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instruções de Uso */}
      {!showResults && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Como Usar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">1. Preencha os Dados</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Agência: 4 dígitos (ex: 1234)</li>
                  <li>• Conta: formato XX.XXX-X</li>
                  <li>• Período: máximo 1 ano</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">2. Escolha o Tipo</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Logs: histórico de consultas</li>
                  <li>• Importações: extratos importados</li>
                  <li>• Movimentações: transações bancárias</li>
                  <li>• Todos: dados completos</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">3. Execute e Analise</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Clique em "Consultar"</li>
                  <li>• Visualize os resultados</li>
                  <li>• Use filtros e busca</li>
                  <li>• Exporte os dados</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
