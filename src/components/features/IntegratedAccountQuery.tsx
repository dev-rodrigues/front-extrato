import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  History, 
  Download, 
  CreditCard,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { AdvancedAccountQueryForm } from '@/components/forms/AdvancedAccountQueryForm'
import { QueryResults } from './QueryResults'

/**
 * Componente integrado para consulta de conta
 * Combina formulário avançado e resultados em uma única interface
 */

interface QueryData {
  agencia: string
  contaCorrente: string
  dataInicio: string
  dataFim: string
  tipoConsulta: 'logs' | 'imports' | 'movements' | 'all'
}

export const IntegratedAccountQuery: React.FC = () => {
  const [currentQuery, setCurrentQuery] = useState<QueryData | null>(null)
  const [activeTab, setActiveTab] = useState<string>('form')
  const [queryHistory, setQueryHistory] = useState<QueryData[]>([])

  // Executar nova consulta
  const handleSubmitQuery = (data: any) => {
    const queryData: QueryData = {
      agencia: data.agencia,
      contaCorrente: data.contaCorrente,
      dataInicio: data.dataInicio,
      dataFim: data.dataFim,
      tipoConsulta: data.tipoConsulta
    }

    setCurrentQuery(queryData)
    
    // Adicionar ao histórico
    setQueryHistory(prev => [
      queryData,
      ...prev.filter(q => 
        !(q.agencia === data.agencia && q.contaCorrente === data.contaCorrente)
      )
    ].slice(0, 10))

    // Mudar para aba de resultados
    setActiveTab('results')
  }

  // Executar consulta do histórico
  const executeHistoryQuery = (query: QueryData) => {
    setCurrentQuery(query)
    setActiveTab('results')
  }

  // Nova consulta
  const handleNewQuery = () => {
    setCurrentQuery(null)
    setActiveTab('form')
  }

  // Formatar período para exibição
  const formatPeriod = (dataInicio: string, dataFim: string) => {
    const inicio = new Date(dataInicio).toLocaleDateString('pt-BR')
    const fim = new Date(dataFim).toLocaleDateString('pt-BR')
    return `${inicio} - ${fim}`
  }

  // Obter ícone baseado no tipo de consulta
  const getQueryIcon = (tipo: string) => {
    switch (tipo) {
      case 'logs':
        return History
      case 'imports':
        return Download
      case 'movements':
        return CreditCard
      default:
        return Search
    }
  }

  // Obter label do tipo de consulta
  const getQueryLabel = (tipo: string) => {
    switch (tipo) {
      case 'logs':
        return 'Logs'
      case 'imports':
        return 'Importações'
      case 'movements':
        return 'Movimentações'
      default:
        return 'Todas'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consulta de Conta</h1>
          <p className="text-muted-foreground">
            Consulte logs, importações e movimentações de contas bancárias
          </p>
        </div>
        
        {currentQuery && (
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              Ag. {currentQuery.agencia} / Conta {currentQuery.contaCorrente}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {formatPeriod(currentQuery.dataInicio, currentQuery.dataFim)}
            </Badge>
          </div>
        )}
      </div>

      {/* Tabs principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="form" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Nova Consulta</span>
          </TabsTrigger>
          
          <TabsTrigger value="results" className="flex items-center space-x-2" disabled={!currentQuery}>
            <History className="h-4 w-4" />
            <span>Resultados</span>
            {currentQuery && (
              <Badge variant="secondary" className="ml-1">
                {queryHistory.length > 0 ? '1' : '0'}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="h-4 w-4" />
            <span>Histórico</span>
            {queryHistory.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {queryHistory.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab: Nova Consulta */}
        <TabsContent value="form" className="space-y-6">
          <AdvancedAccountQueryForm
            onSubmit={handleSubmitQuery}
            loading={false}
          />
        </TabsContent>

        {/* Tab: Resultados */}
        <TabsContent value="results" className="space-y-6">
          {currentQuery ? (
            <QueryResults
              queryData={currentQuery}
              onNewQuery={handleNewQuery}
            />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma consulta realizada</h3>
                  <p className="text-muted-foreground mb-4">
                    Execute uma consulta para ver os resultados
                  </p>
                  <button
                    onClick={() => setActiveTab('form')}
                    className="text-primary hover:underline"
                  >
                    Ir para Nova Consulta
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab: Histórico */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Histórico de Consultas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {queryHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma consulta no histórico</h3>
                  <p className="text-muted-foreground">
                    As consultas realizadas aparecerão aqui
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {queryHistory.map((query, index) => {
                    const QueryIcon = getQueryIcon(query.tipoConsulta)
                    
                    return (
                      <div
                        key={index}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => executeHistoryQuery(query)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                              <Building2 className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">
                                Ag. {query.agencia} / Conta {query.contaCorrente}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatPeriod(query.dataInicio, query.dataFim)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <QueryIcon className="h-3 w-3" />
                              <span>{getQueryLabel(query.tipoConsulta)}</span>
                            </Badge>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                executeHistoryQuery(query)
                                setActiveTab('results')
                              }}
                              className="text-primary hover:underline text-sm"
                            >
                              Executar
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resumo da consulta atual */}
      {currentQuery && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">Agência:</span> {currentQuery.agencia}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">Conta:</span> {currentQuery.contaCorrente}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">Período:</span> {formatPeriod(currentQuery.dataInicio, currentQuery.dataFim)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span>
                  <span className="font-medium">Tipo:</span> {getQueryLabel(currentQuery.tipoConsulta)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default IntegratedAccountQuery
