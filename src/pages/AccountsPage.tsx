import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AccountQueryForm } from '@/components/forms/AccountQueryForm'
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs'
import { Building2, CreditCard, Search } from 'lucide-react'

/**
 * Accounts Page - Implementa EXATAMENTE o que está documentado nos RFCs
 * Funcionalidade: Consulta de contas bancárias com navegação para detalhes
 * Formulário de consulta com agência e conta corrente
 * Suporte aos dois formatos de conta (com e sem ponto)
 */
export function AccountsPage() {
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
          <AccountQueryForm />
        </CardContent>
      </Card>

      {/* Funcionalidades Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Funcionalidades Disponíveis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-sm mb-1">Logs de Consulta</h4>
              <p className="text-xs text-muted-foreground">Histórico de tentativas de consulta</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-sm mb-1">Importações</h4>
              <p className="text-xs text-muted-foreground">Arquivos processados e importados</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-sm mb-1">Movimentações</h4>
              <p className="text-xs text-muted-foreground">Transações financeiras da conta</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
