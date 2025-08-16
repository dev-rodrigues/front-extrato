import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { 
  Building2, 
  CreditCard, 
  FileText, 
  Download, 
  TrendingUp,
  AlertCircle,
  Database,
  Calendar,
  Banknote
} from 'lucide-react'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'

/**
 * AccountDetailsPage - Implementa EXATAMENTE o que está documentado nos RFCs
 * Funcionalidade: Detalhes específicos de uma conta com navegação para sub-seções
 * Navegação para logs, importações e movimentações
 */
export function AccountDetailsPage() {
  const { agencia, contaCorrente } = useParams()
  const [searchParams] = useSearchParams()

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
        { label: 'Contas', href: '/accounts' },
        { label: `${agencia}/${contaCorrente}`, href: `/accounts/${agencia}/${contaCorrente}` }
      ]} />

      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Detalhes da Conta</h1>
        <p className="text-muted-foreground">
          Informações e histórico da conta {agencia}/{contaCorrente}
        </p>
      </div>

      {/* Informações da Conta */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Agência</p>
                <p className="font-medium">{agencia}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Conta Corrente</p>
                <p className="font-medium">{contaCorrente}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Banknote className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Banco</p>
                <p className="font-medium">001 - Banco do Brasil</p>
              </div>
            </div>
          </div>
          
          {mes || dataInicio ? (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center space-x-2 text-blue-800">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Período de Consulta:</span>
                <span>{getPeriodoConsulta()}</span>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Navegação */}
      <Card>
        <CardHeader>
          <CardTitle>Navegação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to={generateSubSectionUrl('logs')}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="font-medium">Logs de Consulta</h3>
                      <p className="text-sm text-muted-foreground">
                        Histórico de tentativas de consulta
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to={generateSubSectionUrl('imports')}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Download className="h-8 w-8 text-green-500" />
                    <div>
                      <h3 className="font-medium">Importações</h3>
                      <p className="text-sm text-muted-foreground">
                        Histórico de arquivos processados
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to={generateSubSectionUrl('movements')}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                    <div>
                      <h3 className="font-medium">Movimentações</h3>
                      <p className="text-sm text-muted-foreground">
                        Histórico de transações financeiras
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Resumo de Atividades */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                <Database className="h-6 w-6 mx-auto mb-2" />
                -
              </div>
              <div className="text-sm text-muted-foreground">Total de Consultas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                <Download className="h-6 w-6 mx-auto mb-2" />
                -
              </div>
              <div className="text-sm text-muted-foreground">Total de Importações</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                -
              </div>
              <div className="text-sm text-muted-foreground">Total de Movimentações</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                <Calendar className="h-6 w-6 mx-auto mb-2" />
                Hoje
              </div>
              <div className="text-sm text-muted-foreground">Última Atualização</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-muted-foreground text-center">
              Os dados detalhados estarão disponíveis nas respectivas seções
            </p>
          </div>
        </CardContent>
      </Card>


    </div>
  )
}
