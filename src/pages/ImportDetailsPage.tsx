import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AppLoading } from '@/components/ui/AppLoading'
import { 
  AlertCircle, 
  FileText, 
  ArrowLeft,
  Calendar,
  Database,
  Clock,
  Building,
  FileArchive
} from 'lucide-react'
import type { AccountImportResponse } from '@/types/rfc'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'

/**
 * ImportDetailsPage - Página de detalhes de uma importação específica
 * Exibe informações detalhadas da importação selecionada
 */
export function ImportDetailsPage() {
  const { agencia, contaCorrente, importId } = useParams<{ 
    agencia: string; 
    contaCorrente: string; 
    importId: string 
  }>()
  const navigate = useNavigate()
  
  const [importData, setImportData] = useState<AccountImportResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar detalhes da importação
  const fetchImportDetails = async () => {
    if (!agencia || !contaCorrente || !importId) return

    setLoading(true)
    setError(null)

    try {
      console.log('🔄 Buscando detalhes da importação:', { agencia, contaCorrente, importId })
      
      // Por enquanto, vamos simular os dados da importação
      // Em uma implementação real, isso viria de um endpoint específico
      const mockImportData: AccountImportResponse = {
        id: parseInt(importId),
        layoutId: 2,
        documentId: null,
        bancoOrigem: 'BB',
        arquivoNome: 'IMPORTED WITH API',
        arquivoGeracaoDataHora: '2025-08-16T18:20:55.000Z',
        arquivoNumeroSequencial: 1,
        arquivoNumeroVersaoLayOut: '2.0',
        qtdLotes: 1,
        qtdRegistros: 29,
        qtdContas: 1,
        dataHora: '2025-08-16T18:20:55.000Z',
        userId: 1,
        consultaAgencia: agencia,
        consultaContaCorrente: contaCorrente,
        consultaPeriodoDe: '2025-05-25T00:00:00.000Z',
        consultaPeriodoAte: '2025-06-23T23:59:59.000Z'
      }
      
      setImportData(mockImportData)
      console.log('✅ Dados da importação carregados:', mockImportData)
    } catch (err) {
      console.error('❌ Erro ao buscar detalhes da importação:', err)
      setError('Erro ao carregar detalhes da importação')
    } finally {
      setLoading(false)
    }
  }

  // Carregar dados iniciais
  useEffect(() => {
    fetchImportDetails()
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

  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined || isNaN(num)) return 'N/A'
    return num.toLocaleString('pt-BR')
  }

  // Gerar breadcrumbs
  const breadcrumbs = [
    { label: 'Contas', href: '/accounts' },
    { label: `${agencia}/${contaCorrente}`, href: `/accounts/${agencia}/${contaCorrente}` },
    { label: 'Importações', href: `/accounts/${agencia}/${contaCorrente}/imports` },
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
        
        <Button 
          variant="outline" 
          onClick={() => navigate(`/accounts/${agencia}/${contaCorrente}/imports`)}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar à Lista</span>
        </Button>
      </div>

      {loading ? (
        <AppLoading />
      ) : error ? (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={fetchImportDetails}>Tentar Novamente</Button>
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
                  <Badge variant="secondary" className="text-sm">
                    Layout {importData.layoutId || 'N/A'}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {importData.bancoOrigem || 'N/A'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Grid de Informações */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações do Arquivo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Informações do Arquivo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Nome do Arquivo:</span>
                    <div className="font-medium">{importData.arquivoNome || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Versão do Layout:</span>
                    <div className="font-medium">{importData.arquivoNumeroVersaoLayOut || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Número Sequencial:</span>
                    <div className="font-medium">{importData.arquivoNumeroSequencial || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">ID do Documento:</span>
                    <div className="font-medium">{importData.documentId || 'N/A'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas de Processamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Estatísticas de Processamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatNumber(importData.qtdRegistros)}
                    </div>
                    <div className="text-sm text-green-700">Registros</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(importData.qtdContas)}
                    </div>
                    <div className="text-sm text-blue-700">Contas</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatNumber(importData.qtdLotes)}
                    </div>
                    <div className="text-sm text-purple-700">Lotes</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Período de Consulta */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Período de Consulta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-medium text-blue-800">
                      {formatPeriodo(importData.consultaPeriodoDe, importData.consultaPeriodoAte)}
                    </div>
                    <div className="text-sm text-blue-600 mt-1">
                      Período processado
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações de Sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Informações de Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Data de Geração:</span>
                    <span className="font-medium">{formatDateTime(importData.arquivoGeracaoDataHora)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Data de Processamento:</span>
                    <span className="font-medium">{formatDateTime(importData.dataHora)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Usuário ID:</span>
                    <span className="font-medium">{importData.userId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Banco de Origem:</span>
                    <span className="font-medium">{importData.bancoOrigem || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ações */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/accounts/${agencia}/${contaCorrente}/imports`)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar à Lista
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/accounts/${agencia}/${contaCorrente}`)}
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
