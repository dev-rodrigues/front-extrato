import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AccountQueryForm } from '@/components/forms/AccountQueryForm'
import { QueryLogs } from './QueryLogs'
import { Imports } from './Imports'
import { Movements } from './Movements'
import { useState } from 'react'

interface AccountQueryData {
  agencia: string
  contaCorrente: string
  dataInicio: string
  dataFim: string
}

export const AccountQuery = () => {
  const [queryData, setQueryData] = useState<AccountQueryData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleQuerySubmit = async (data: AccountQueryData) => {
    setIsLoading(true)
    setQueryData(data)
    
    // Simular delay de consulta
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsLoading(false)
    console.log('Dados da consulta:', data)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Consulta de Conta</h1>
        <p className="text-muted-foreground">
          Consulte extratos, logs e movimentações de contas bancárias
        </p>
      </div>

      {/* Formulário de consulta */}
      <div className="max-w-2xl">
        <AccountQueryForm onSubmit={handleQuerySubmit} isLoading={isLoading} />
      </div>

      {/* Tabs de funcionalidades */}
      {queryData && (
        <Tabs defaultValue="logs" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="logs">Logs de Consulta</TabsTrigger>
            <TabsTrigger value="imports">Importações</TabsTrigger>
            <TabsTrigger value="movements">Movimentações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="logs" className="mt-6">
            <QueryLogs 
              agencia={queryData.agencia}
              contaCorrente={queryData.contaCorrente}
              dataInicio={queryData.dataInicio}
              dataFim={queryData.dataFim}
            />
          </TabsContent>
          
          <TabsContent value="imports" className="mt-6">
            <Imports 
              agencia={queryData.agencia}
              contaCorrente={queryData.contaCorrente}
              dataInicio={queryData.dataInicio}
              dataFim={queryData.dataFim}
            />
          </TabsContent>
          
          <TabsContent value="movements" className="mt-6">
            <Movements 
              agencia={queryData.agencia}
              contaCorrente={queryData.contaCorrente}
              dataInicio={queryData.dataInicio}
              dataFim={queryData.dataFim}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Mensagem quando não há consulta */}
      {!queryData && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Faça uma consulta para visualizar os dados</p>
          <p className="text-sm">Preencha o formulário acima com agência, conta e período</p>
        </div>
      )}
    </div>
  )
}
