import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Building2, 
  CreditCard, 
  FileText, 
  Download, 
  TrendingUp,
  AlertCircle,
  Banknote,
  Activity
} from 'lucide-react'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { useAccounts } from '@/hooks/useAccounts'
import type { AccountQueryParams } from '@/types/rfc'
import { AppLoading } from '@/components/ui/AppLoading'

/**
 * AccountDetailsPage - Implementa EXATAMENTE o que está documentado nos RFCs
 * Funcionalidade: Detalhes específicos de uma conta com navegação para sub-seções
 * Navegação para logs, importações e movimentações
 */
export function AccountDetailsPage() {
  const { agencia, contaCorrente } = useParams()
  const [searchParams] = useSearchParams()
  const { queryLogs, imports, movements, loading, error, fetchQueryLogs, fetchImports, fetchMovements } = useAccounts()

  // Extrair parâmetros da URL
  const mes = searchParams.get('mes')
  const ano = searchParams.get('ano')
  const dataInicio = searchParams.get('dataInicio')
  const dataFim = searchParams.get('dataFim')

  // Determinar período de consulta
  const getPeriodoConsulta = () => {
    if (mes && ano) {
      const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ]
      return `${meses[parseInt(mes) - 1]}/${ano}`
    } else if (dataInicio && dataFim) {
      const inicio = new Date(dataInicio).toLocaleDateString('pt-BR')
      const fim = new Date(dataFim).toLocaleDateString('pt-BR')
      return `${inicio} a ${fim}`
    }
    return 'Período não especificado'
  }

  // Carregar dados da conta
  useEffect(() => {
    if (agencia && contaCorrente) {
      const params: AccountQueryParams = {
        agencia,
        contaCorrente,
        page: 0,
        size: 1 // Apenas para contar total
      }
      
      if (mes && ano) {
        params.mes = parseInt(mes)
        params.ano = parseInt(ano)
      } else if (dataInicio && dataFim) {
        params.dataInicio = dataInicio
        params.dataFim = dataFim
      }

      fetchQueryLogs(agencia, contaCorrente, params)
      fetchImports(agencia, contaCorrente, params)
      fetchMovements(agencia, contaCorrente, params)
    }
  }, [agencia, contaCorrente, mes, ano, dataInicio, dataFim, fetchQueryLogs, fetchImports, fetchMovements])

  // Gerar URLs para sub-seções
  const generateSubSectionUrl = (section: string) => {
    const baseUrl = `/accounts/${agencia}/${contaCorrente}/${section}`
    const params = new URLSearchParams()
    
    if (mes) params.set('mes', mes)
    if (ano) params.set('ano', ano)
    if (dataInicio) params.set('dataInicio', dataInicio)
    if (dataFim) params.set('dataFim', dataFim)
    
    const queryString = params.toString()
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }

  // Gerar URL para detalhes da conta com parâmetros preservados
  const generateAccountDetailsUrl = () => {
    const baseUrl = `/accounts/${agencia}/${contaCorrente}`
    const params = new URLSearchParams()
    
    if (mes) params.set('mes', mes)
    if (ano) params.set('ano', ano)
    if (dataInicio) params.set('dataInicio', dataInicio)
    if (dataFim) params.set('dataFim', dataFim)
    
    const queryString = params.toString()
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }

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
      {/* Breadcrumb */}
      <Breadcrumbs items={[
        { 
          label: 'Contas', 
          href: (() => {
            const params = new URLSearchParams()
            if (agencia) params.set('agencia', agencia)
            if (contaCorrente) params.set('contaCorrente', contaCorrente)
            if (mes) params.set('mes', mes)
            if (ano) params.set('ano', ano)
            if (dataInicio) params.set('dataInicio', dataInicio)
            if (dataFim) params.set('dataFim', dataFim)
            const queryString = params.toString()
            return queryString ? `/accounts?${queryString}` : '/accounts'
          })()
        },
        { label: `${agencia}/${contaCorrente}`, href: generateAccountDetailsUrl() }
      ]} />

      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Detalhes da Conta</h1>
        <p className="text-muted-foreground">
          Informações e histórico da conta {agencia}/{contaCorrente}
          {mes || dataInicio ? ` • Período: ${getPeriodoConsulta()}` : ''}
        </p>
      </div>

      {/* Informações da Conta */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Banknote className="h-6 w-6 text-slate-600" />
            <span>Informações da Conta</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <Building2 className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Agência</p>
                <p className="text-xl font-bold text-blue-700">{agencia}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <CreditCard className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Conta Corrente</p>
                <p className="text-xl font-bold text-green-700">{contaCorrente}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <Banknote className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Banco</p>
                <p className="text-xl font-bold text-purple-700">001 - Banco do Brasil</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navegação para Sub-seções */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <span>Explorar Dados da Conta</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Acesse as seções específicas para visualizar dados detalhados
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to={generateSubSectionUrl('logs')}>
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">Logs de Consulta</h3>
                  <p className="text-blue-600 mb-4">
                    Histórico detalhado de tentativas de consulta
                  </p>
                  <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                    {queryLogs?.totalElements || 0} registros
                  </Badge>
                </CardContent>
              </Card>
            </Link>
            
            <Link to={generateSubSectionUrl('imports')}>
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6 text-center">
                  <Download className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Importações</h3>
                  <p className="text-green-600 mb-4">
                    Histórico de arquivos processados e importados
                  </p>
                  <Badge variant="secondary" className="bg-green-200 text-green-800">
                    {imports?.totalElements || 0} arquivos
                  </Badge>
                </CardContent>
              </Card>
            </Link>
            
            <Link to={generateSubSectionUrl('movements')}>
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-purple-800 mb-2">Movimentações</h3>
                  <p className="text-purple-600 mb-4">
                    Histórico de transações financeiras da conta
                  </p>
                  <Badge variant="secondary" className="bg-purple-200 text-purple-800">
                    {movements?.totalElements || 0} transações
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Estado de Carregamento */}
      {loading && (
        <AppLoading />
      )}

      {/* Estado de Erro */}
      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <p className="text-red-700 mb-4">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
