import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AccountQueryForm } from '@/components/forms/AccountQueryForm'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

/**
 * Accounts Page - Implementa EXATAMENTE o que está documentado nos RFCs
 * Funcionalidade: Consulta de contas bancárias com navegação para detalhes
 * Formulário de consulta com agência e conta corrente
 * Suporte aos dois formatos de conta (com e sem ponto)
 */
export function AccountsPage() {
  const [searchParams] = useSearchParams()
  
  // Extrair parâmetros da URL para preencher o formulário
  const agencia = searchParams.get('agencia')
  const contaCorrente = searchParams.get('contaCorrente')
  const mes = searchParams.get('mes')
  const ano = searchParams.get('ano')
  const dataInicio = searchParams.get('dataInicio')
  const dataFim = searchParams.get('dataFim')
  
  // Criar objeto com os valores iniciais do formulário
  const initialValues = {
    agencia: agencia || '',
    contaCorrente: contaCorrente || '',
    mes: mes ? parseInt(mes) : undefined,
    ano: ano ? parseInt(ano) : undefined,
    dataInicio: dataInicio || undefined,
    dataFim: dataFim || undefined
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumbs items={[{ label: 'Contas', href: '/accounts' }]} />
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Consulta de Conta Bancária</h1>
        <p className="text-muted-foreground">
          Digite os dados da conta para consultar logs, importações e movimentações
        </p>
      </div>

      {/* Formulário de Consulta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Consulta de Conta</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Preencha os dados da agência e conta para realizar a consulta
          </p>
        </CardHeader>
        <CardContent>
          <AccountQueryForm initialValues={initialValues} />
        </CardContent>
      </Card>
    </div>
  )
}
