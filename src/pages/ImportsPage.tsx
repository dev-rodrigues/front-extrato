import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AppLoading } from '@/components/ui/AppLoading'
import { 
  Download, 
  AlertCircle, 
  FileText, 
  ChevronLeft,
  ChevronRight,
  Calendar,
  Database,
  Eye
} from 'lucide-react'
import type { 
  AccountImportResponse
} from '@/types/rfc'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { AccountService } from '@/services/accountService'

/**
 * ImportsPage - Implementa EXATAMENTE o que está documentado nos RFCs
 * Endpoint: GET /api/accounts/{agencia}/{contaCorrente}/imports
 * Funcionalidade: Lista paginada de importações da conta específica
 */
export function ImportsPage() {
  const { agencia, contaCorrente } = useParams<{ agencia: string; contaCorrente: string }>()
  const navigate = useNavigate()

  const [imports, setImports] = useState<AccountImportResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 20,
    totalPages: 0,
    totalElements: 0
  })

  // Carregar importações
  const fetchImports = async () => {
    if (!agencia || !contaCorrente) return

    setLoading(true)
    setError(null)

    try {
      console.log('🔄 Buscando importações para:', { agencia, contaCorrente, pagination })
      
      const params = {
        agencia,
        contaCorrente,
        page: pagination.currentPage,
        size: pagination.pageSize
      }

      const data = await AccountService.getImports(agencia, contaCorrente, params)
      
      console.log('✅ Resposta da API de importações:', data)
      
      setImports(data.content)
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages,
        totalElements: data.totalElements
      }))
    } catch (err) {
      console.error('❌ Erro ao buscar importações:', err)
      
      // Melhorar mensagem de erro
      let errorMessage = 'Erro ao carregar importações'
      
      if (err instanceof Error) {
        if (err.message.includes('Network Error')) {
          errorMessage = 'Erro de conexão com a API. Verifique se o servidor está rodando.'
        } else if (err.message.includes('timeout')) {
          errorMessage = 'Timeout na conexão com a API. Tente novamente.'
        } else if (err.message.includes('404')) {
          errorMessage = 'Endpoint de importações não encontrado na API.'
        } else if (err.message.includes('500')) {
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.'
        } else {
          errorMessage = `Erro: ${err.message}`
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Carregar dados iniciais
  useEffect(() => {
    fetchImports()
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
  const formatDateTime = (dateString: string | null): string => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('pt-BR')
  }

  // Formatar período de consulta
  const formatPeriodo = (de: string | null, ate: string | null): string => {
    if (!de || !ate) return 'N/A'
    const dataDe = new Date(de).toLocaleDateString('pt-BR')
    const dataAte = new Date(ate).toLocaleDateString('pt-BR')
    return `${dataDe} a ${dataAte}`
  }

  // Formatar número
  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined || isNaN(num)) return 'N/A'
    return num.toLocaleString('pt-BR')
  }

  // Gerar breadcrumbs
  const breadcrumbs = [
    { label: 'Contas', href: '/accounts' },
    { label: `${agencia}/${contaCorrente}`, href: `/accounts/${agencia}/${contaCorrente}` },
    { label: 'Importações', href: `/accounts/${agencia}/${contaCorrente}/imports` }
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
        <h1 className="text-3xl font-bold tracking-tight">Importações</h1>
        <p className="text-muted-foreground">
          Histórico de arquivos processados para a conta {agencia}/{contaCorrente}
        </p>
      </div>

      {/* Lista de Importações */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Importações</CardTitle>
          <p className="text-sm text-muted-foreground">
            {pagination.totalElements} importação(ões) encontrada(s)
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
                <Button onClick={fetchImports}>Tentar Novamente</Button>
              </div>
            </div>
          ) : imports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma importação encontrada</p>
            </div>
          ) : (
            <div className="space-y-6">
              {imports.map((importItem) => (
                <Card key={importItem.id} className="overflow-hidden">
                  {/* Header do Card */}
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Download className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Importação #{importItem.id}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Processada em {formatDateTime(importItem.dataHora)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          Layout {importItem.layoutId || 'N/A'}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/accounts/${agencia}/${contaCorrente}/imports/${importItem.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* Informações do Arquivo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      <Card className="bg-gray-50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-gray-700 flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            Informações do Arquivo
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Nome:</span>
                            <span className="text-sm font-medium">{importItem.arquivoNome || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Versão:</span>
                            <span className="text-sm font-medium">{importItem.arquivoNumeroVersaoLayOut || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Sequencial:</span>
                            <span className="text-sm font-medium">{importItem.arquivoNumeroSequencial || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Documento:</span>
                            <span className="text-sm font-medium">{importItem.documentId || 'N/A'}</span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Estatísticas de Processamento */}
                      <Card className="bg-green-50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-green-700 flex items-center">
                            <Database className="h-4 w-4 mr-2" />
                            Estatísticas de Processamento
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-green-600">Registros:</span>
                            <span className="text-sm font-medium text-green-800">{formatNumber(importItem.qtdRegistros)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-green-600">Contas:</span>
                            <span className="text-sm font-medium text-green-800">{formatNumber(importItem.qtdContas)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-green-600">Lotes:</span>
                            <span className="text-sm font-medium text-green-800">{formatNumber(importItem.qtdLotes)}</span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Período e Data */}
                      <Card className="bg-purple-50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-purple-700 flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Período e Data
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-purple-600">Período:</span>
                            <span className="text-sm font-medium text-purple-800">
                              {formatPeriodo(importItem.consultaPeriodoDe, importItem.consultaPeriodoAte)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-purple-600">Geração:</span>
                            <span className="text-sm font-medium text-purple-800">
                              {formatDateTime(importItem.arquivoGeracaoDataHora)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Informações Adicionais */}
                    {importItem.bancoOrigem && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Database className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">
                            Banco de Origem: {importItem.bancoOrigem}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
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
              Total: {pagination.totalElements} importações | Página atual: {pagination.currentPage + 1} de {pagination.totalPages}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
