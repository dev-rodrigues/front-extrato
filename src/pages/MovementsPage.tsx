import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AppLoading } from '@/components/ui/AppLoading'
import { 
  TrendingUp, 
  AlertCircle, 
  DollarSign, 
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react'
import type { 
  AccountMovementResponse
} from '@/types/rfc'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { AccountService } from '@/services/accountService'

/**
 * MovementsPage - Implementa EXATAMENTE o que está documentado nos RFCs
 * Endpoint: GET /api/accounts/{agencia}/{contaCorrente}/movements
 * Funcionalidade: Lista paginada de movimentações da conta específica
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

  // Carregar movimentações
  const fetchMovements = async () => {
    if (!agencia || !contaCorrente) return

    setLoading(true)
    setError(null)

    try {
      console.log('🔄 Buscando movimentações para:', { agencia, contaCorrente, pagination })
      
      const params = {
        agencia,
        contaCorrente,
        page: pagination.currentPage,
        size: pagination.pageSize
      }

      const data = await AccountService.getMovements(agencia, contaCorrente, params)
      
      console.log('✅ Resposta da API de movimentações:', data)
      
      setMovements(data.content)
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages,
        totalElements: data.totalElements
      }))
    } catch (err) {
      console.error('❌ Erro ao buscar movimentações:', err)
      
      // Melhorar mensagem de erro
      let errorMessage = 'Erro ao carregar movimentações'
      
      if (err instanceof Error) {
        if (err.message.includes('Network Error')) {
          errorMessage = 'Erro de conexão com a API. Verifique se o servidor está rodando.'
        } else if (err.message.includes('timeout')) {
          errorMessage = 'Timeout na conexão com a API. Tente novamente.'
        } else if (err.message.includes('404')) {
          errorMessage = 'Endpoint de movimentações não encontrado na API.'
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
    fetchMovements()
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

  // Formatar valor monetário
  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

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
            <AppLoading />
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
                      <span className="text-muted-foreground">Tipo:</span>
                      <div className="font-medium">{getMovementTypeLabel(movement.movimentoTipo)}</div>
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
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Descrição:</span>
                      <div className="font-medium">{movement.descricaoHistorico || 'N/A'}</div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Categoria:</span>
                      <div className="font-medium">{movement.movimentoCategoria || 'N/A'}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Data Movimentação:</span>
                      <div className="font-medium">
                        {formatDateTime(movement.movimentoData)}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Saldo:</span>
                      <div className="font-medium">
                        {formatCurrency(movement.movimentoSaldo)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                    <Button variant="outline" size="sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Histórico
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
