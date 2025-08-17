import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AppLoading } from '@/components/ui/AppLoading'
import { 
  AlertCircle, 
  FileText, 
  ArrowLeft,
  Building,
  FileArchive,
  TrendingUp,
  DollarSign
} from 'lucide-react'
import type { AccountImportResponse, AccountMovementResponse, ImportWithMovementsResponse } from '@/types/rfc'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { AccountService } from '@/services/accountService'

/**
 * ImportDetailsPage - Página de detalhes de uma importação específica
 * Exibe informações detalhadas da importação selecionada e lista de movimentos
 */
export function ImportDetailsPage() {
  const { agencia, contaCorrente, importId } = useParams<{ 
    agencia: string; 
    contaCorrente: string; 
    importId: string 
  }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const [importData, setImportData] = useState<AccountImportResponse | null>(null)
  const [movements, setMovements] = useState<AccountMovementResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMovements, setLoadingMovements] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Extrair parâmetros da URL
  const mes = searchParams.get('mes')
  const ano = searchParams.get('ano')
  const dataInicio = searchParams.get('dataInicio')
  const dataFim = searchParams.get('dataFim')

  // Carregar dados da importação com movimentações
  const fetchImportData = async () => {
    if (!agencia || !contaCorrente || !importId) return

    setLoading(true)
    setError(null)

    try {
      console.log('🔄 Buscando dados da importação:', { 
        agencia, 
        contaCorrente, 
        importId,
        url: `/api/accounts/imports/${importId}`
      })
      
      // Usar o novo endpoint que retorna importação com movimentações
      const data: ImportWithMovementsResponse = await AccountService.getMovementsByImport(agencia, contaCorrente, importId, 0, 100)
      
      console.log('✅ Resposta da API da importação:', {
        importacao: data.importacao,
        totalMovimentacoes: data.totalMovimentacoes,
        movimentacoes: {
          totalElements: data.movimentacoes.totalElements,
          totalPages: data.movimentacoes.totalPages,
          contentLength: data.movimentacoes.content?.length || 0
        }
      })
      
      // Definir dados da importação
      if (data.importacao) {
        setImportData(data.importacao)
      } else {
        setError('Dados da importação não encontrados na API')
        return
      }
      
      // Definir movimentações
      if (data.movimentacoes.content && Array.isArray(data.movimentacoes.content)) {
        setMovements(data.movimentacoes.content)
        console.log(`📊 Movimentos carregados: ${data.movimentacoes.content.length} registros`)
      } else {
        console.warn('⚠️ Resposta da API não contém array de movimentos:', data.movimentacoes)
        setMovements([])
      }
    } catch (err) {
      console.error('❌ Erro ao buscar dados da importação:', err)
      
      // Log detalhado do erro
      if (err instanceof Error) {
        console.error('❌ Detalhes do erro:', {
          message: err.message,
          name: err.name,
          stack: err.stack
        })
      }
      
      setError('Erro ao carregar dados da importação')
      setMovements([])
    } finally {
      setLoading(false)
      setLoadingMovements(false)
    }
  }

  // Carregar dados iniciais
  useEffect(() => {
    fetchImportData()
  }, [agencia, contaCorrente, importId])

  // Funções de formatação
  const formatDateTime = (dateString: string | null): string => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const formatPeriodo = (de: string | null, ate: string | null): string => {
    if (!de || !ate) return 'N/A'
    const dataDe = new Date(de).toLocaleDateString('pt-BR')
    const dataAte = new Date(ate).toLocaleDateString('pt-BR')
    return `${dataDe} a ${dataAte}`
  }

  // Funções de formatação para movimentos
  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getMovementTypeColor = (tipo: string | null): string => {
    if (!tipo) return 'bg-gray-100 text-gray-800'
    return tipo === 'C' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const getMovementTypeLabel = (tipo: string | null): string => {
    if (!tipo) return 'N/A'
    return tipo === 'C' ? 'CRÉDITO' : 'DÉBITO'
  }

  // Gerar breadcrumbs
  const breadcrumbs = [
    { label: 'Contas', href: '/accounts' },
    { 
      label: `${agencia}/${contaCorrente}`, 
      href: (() => {
        const baseUrl = `/accounts/${agencia}/${contaCorrente}`
        const params = new URLSearchParams()
        
        if (mes) params.set('mes', mes)
        if (ano) params.set('ano', ano)
        if (dataInicio) params.set('dataInicio', dataInicio)
        if (dataFim) params.set('dataFim', dataFim)
        
        const queryString = params.toString()
        return queryString ? `${baseUrl}?${queryString}` : baseUrl
      })()
    },
    { 
      label: 'Importações', 
      href: (() => {
        const baseUrl = `/accounts/${agencia}/${contaCorrente}/imports`
        const params = new URLSearchParams()
        
        if (mes) params.set('mes', mes)
        if (ano) params.set('ano', ano)
        if (dataInicio) params.set('dataInicio', dataInicio)
        if (dataFim) params.set('dataFim', dataFim)
        
        const queryString = params.toString()
        return queryString ? `${baseUrl}?${queryString}` : baseUrl
      })()
    },
    { label: `Importação #${importId}`, href: `/accounts/${agencia}/${contaCorrente}/imports/${importId}` }
  ]

  if (!agencia || !contaCorrente || !importId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive">Parâmetros inválidos</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detalhes da Importação</h1>
          <p className="text-muted-foreground">
            Informações detalhadas da importação #{importId} para a conta {agencia}/{contaCorrente}
          </p>
        </div>
      </div>

      {loading ? (
        <AppLoading />
      ) : error ? (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={fetchImportData}>Tentar Novamente</Button>
          </CardContent>
        </Card>
      ) : importData ? (
        <div className="space-y-6">
          {/* Card Principal da Importação */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileArchive className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Importação #{importData.id}</CardTitle>
                    <p className="text-muted-foreground">
                      Processada em {formatDateTime(importData.dataHora)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Grid de Informações */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          </div>

          {/* Lista de Movimentos da Importação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Movimentos da Importação
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Transações financeiras processadas nesta importação
              </p>
            </CardHeader>
            <CardContent>
              {loadingMovements ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Carregando movimentos...</p>
                </div>
              ) : movements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="mb-2">Nenhum movimento encontrado para esta importação</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Importação ID: {importId}</p>
                    <p>Registros esperados: {importData?.qtdRegistros || 'N/A'}</p>
                    <p>Período da importação: {formatPeriodo(importData?.consultaPeriodoDe, importData?.consultaPeriodoAte)}</p>
                    <p>Filtro aplicado: {mes && ano ? `Mês ${mes}/${ano}` : 'Período específico'}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Total: {movements.length} movimento(s)
                  </div>
                  {movements.map((movement) => (
                    <div key={movement.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <DollarSign className="h-5 w-5 text-blue-500" />
                          <span className="font-medium">ID: {movement.id}</span>
                          <Badge 
                            variant="secondary" 
                            className={getMovementTypeColor(movement.movimentoTipo)}
                          >
                            {getMovementTypeLabel(movement.movimentoTipo)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDateTime(movement.movimentoData)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Valor:</span>
                          <div className="font-medium text-lg">
                            {formatCurrency(movement.movimentoValor)}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground">Documento:</span>
                          <div className="font-medium flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>{movement.documentoNumero || 'N/A'}</span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground">Sequencial:</span>
                          <div className="font-medium">{movement.numeroSequencialExtrato || 'N/A'}</div>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground">Saldo:</span>
                          <div className="font-medium">
                            {formatCurrency(movement.movimentoSaldo)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Descrição:</span>
                          <div className="font-medium">{movement.descricaoHistorico || 'N/A'}</div>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground">Categoria:</span>
                          <div className="font-medium">{movement.movimentoCategoria || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ações */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => {
                    // Preservar parâmetros de período ao voltar à lista
                    let returnUrl = `/accounts/${agencia}/${contaCorrente}/imports`
                    const params = new URLSearchParams()
                    
                    if (mes) params.set('mes', mes)
                    if (ano) params.set('ano', ano)
                    if (dataInicio) params.set('dataInicio', dataInicio)
                    if (dataFim) params.set('dataFim', dataFim)
                    
                    const queryString = params.toString()
                    if (queryString) {
                      returnUrl += `?${queryString}`
                    }
                    
                    navigate(returnUrl)
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar à Lista
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    // Preservar parâmetros de período ao ver conta
                    let returnUrl = `/accounts/${agencia}/${contaCorrente}`
                    const params = new URLSearchParams()
                    
                    if (mes) params.set('mes', mes)
                    if (ano) params.set('ano', ano)
                    if (dataInicio) params.set('dataInicio', dataInicio)
                    if (dataFim) params.set('dataFim', dataFim)
                    
                    const queryString = params.toString()
                    if (queryString) {
                      returnUrl += `?${queryString}`
                    }
                    
                    navigate(returnUrl)
                  }}
                >
                  <Building className="h-4 w-4 mr-2" />
                  Ver Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Importação não encontrada</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
