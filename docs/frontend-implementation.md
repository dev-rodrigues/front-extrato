# Implementação Frontend com React + shadcn/ui

## Resumo/Objetivo
Guia completo para implementação do frontend da aplicação de consulta de extratos bancários utilizando React 18+, TypeScript, shadcn/ui e padrões modernos de desenvolvimento. Este documento fornece a arquitetura, estrutura de componentes e exemplos práticos para construção da interface.

## Contexto
O frontend deve consumir a API de consulta de extratos bancários, fornecendo uma interface intuitiva para consulta de logs, importações e movimentações. A implementação utiliza tecnologias modernas e componentes reutilizáveis para garantir manutenibilidade e escalabilidade.

## Detalhamento

### Stack Tecnológica
- **Framework**: React 18+ com TypeScript
- **UI Components**: shadcn/ui (baseado em Radix UI + Tailwind CSS)
- **State Management**: Zustand ou React Context
- **HTTP Client**: Axios ou TanStack Query
- **Formulários**: React Hook Form + Zod para validação
- **Roteamento**: React Router DOM
- **Ícones**: Lucide React (padrão shadcn/ui)
- **Build Tool**: Vite

### Estrutura de Pastas
```
src/
├── components/
│   ├── ui/           # Componentes shadcn/ui
│   ├── forms/        # Formulários reutilizáveis
│   ├── layout/       # Componentes de layout
│   └── features/     # Componentes específicos por feature
├── hooks/            # Custom hooks
├── services/         # Serviços de API
├── stores/           # Estado global (Zustand)
├── types/            # Tipos TypeScript
├── utils/            # Utilitários
├── schemas/          # Schemas de validação Zod
└── assets/           # Recursos estáticos
```

### Componentes shadcn/ui Recomendados

#### Layout e Navegação
- `Card`, `CardHeader`, `CardContent`, `CardTitle`
- `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`
- `Button`, `NavigationMenu`, `Separator`

#### Formulários e Entrada
- `Input`, `Select`, `DatePicker`, `Form`
- `Label`, `Textarea`, `Checkbox`, `RadioGroup`

#### Exibição de Dados
- `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow`
- `Badge`, `Alert`, `AlertDialog`, `Dialog`

#### Feedback e Navegação
- `Toast`, `Pagination`, `Skeleton`, `Progress`

## Implementação por Tela

### 1. Dashboard Principal

#### Estrutura do Componente
```tsx
// components/features/Dashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, AlertTriangle } from "lucide-react"

export const Dashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header com busca */}
      <div className="flex gap-4 items-center">
        <Input 
          placeholder="Agência (4 dígitos)" 
          className="w-32"
          maxLength={4}
        />
        <Input 
          placeholder="Conta (XX.XXX-X)" 
          className="w-32"
        />
        <Button>
          <Search className="w-4 h-4 mr-2" />
          Buscar
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150</div>
          </CardContent>
        </Card>
        
        {/* Outros cards... */}
      </div>

      {/* Lista de alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Alertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Lista de alertas */}
        </CardContent>
      </Card>
    </div>
  )
}
```

### 2. Tela de Consulta de Conta

#### Estrutura do Componente
```tsx
// components/features/AccountQuery.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePicker } from "@/components/ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QueryLogs } from "./QueryLogs"
import { Imports } from "./Imports"
import { Movements } from "./Movements"

export const AccountQuery = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <DatePicker 
          placeholder="Data Início"
          className="w-40"
        />
        <DatePicker 
          placeholder="Data Fim"
          className="w-40"
        />
        <Select defaultValue="20">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 por página</SelectItem>
            <SelectItem value="20">20 por página</SelectItem>
            <SelectItem value="50">50 por página</SelectItem>
            <SelectItem value="100">100 por página</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs de funcionalidades */}
      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="logs">Logs de Consulta</TabsTrigger>
          <TabsTrigger value="imports">Importações</TabsTrigger>
          <TabsTrigger value="movements">Movimentações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logs">
          <QueryLogs />
        </TabsContent>
        
        <TabsContent value="imports">
          <Imports />
        </TabsContent>
        
        <TabsContent value="movements">
          <Movements />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

### 3. Tela de Logs

#### Estrutura do Componente
```tsx
// components/features/QueryLogs.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export const QueryLogs = () => {
  return (
    <div className="space-y-4">
      {/* Tabela de logs */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data/Hora</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Período Consultado</TableHead>
            <TableHead>Descrição</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>2024-01-15 14:30</TableCell>
            <TableCell>
              <Badge variant="default" className="bg-green-500">
                ✅ Sucesso
              </Badge>
            </TableCell>
            <TableCell>01/01/2024 - 31/01/2024</TableCell>
            <TableCell>Consulta realizada com sucesso</TableCell>
          </TableRow>
          {/* Mais linhas... */}
        </TableBody>
      </Table>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando 1-20 de 45 resultados
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
```

## Hooks Customizados

### useAccountQuery
```tsx
// hooks/useAccountQuery.ts
import { useState, useEffect } from 'react'
import { AccountQueryRequest, PaginationResponse, AccountQueryLogResponse } from '@/types/api'

export const useAccountQuery = (agencia: string, contaCorrente: string) => {
  const [logs, setLogs] = useState<PaginationResponse<AccountQueryLogResponse> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLogs = async (request: AccountQueryRequest) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(
        `/api/accounts/${agencia}/${contaCorrente}/query-logs?` +
        `dataInicio=${request.dataInicio.toISOString()}&` +
        `dataFim=${request.dataFim.toISOString()}&` +
        `page=${request.page}&size=${request.size}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setLogs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return { logs, loading, error, fetchLogs }
}
```

### usePagination
```tsx
// hooks/usePagination.ts
import { useState, useMemo } from 'react'

export const usePagination = (totalElements: number, pageSize: number) => {
  const [currentPage, setCurrentPage] = useState(0)
  
  const totalPages = useMemo(() => 
    Math.ceil(totalElements / pageSize), [totalElements, pageSize]
  )
  
  const hasNext = currentPage < totalPages - 1
  const hasPrevious = currentPage > 0
  
  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page)
    }
  }
  
  const nextPage = () => {
    if (hasNext) setCurrentPage(currentPage + 1)
  }
  
  const previousPage = () => {
    if (hasPrevious) setCurrentPage(currentPage - 1)
  }
  
  return {
    currentPage,
    totalPages,
    hasNext,
    hasPrevious,
    goToPage,
    nextPage,
    previousPage
  }
}
```

## Tipos TypeScript

### Definição dos Tipos
```tsx
// types/api.ts
export interface AccountQueryRequest {
  dataInicio: Date
  dataFim: Date
  page: number
  size: number
}

export interface PaginationResponse<T> {
  content: T[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  isFirst: boolean
  isLast: boolean
}

export interface AccountQueryLogResponse {
  id: string
  banco: string
  agencia: string
  contaCorrente: string
  consultaPeriodoDe: Date
  consultaPeriodoAte: Date
  erroCodigo: number
  erroDescricao?: string
  dataHoraTentativa: Date
  dataHora: Date
}

export interface AccountImportResponse {
  id: string
  layoutId?: string
  arquivoNome?: string
  arquivoGeracaoDataHora?: Date
  qtdRegistros?: number
  qtdContas?: number
  dataHora?: Date
  consultaAgencia?: string
  consultaContaCorrente?: string
  consultaPeriodoDe?: Date
  consultaPeriodoAte?: Date
}

export interface AccountMovementResponse {
  id: string
  numeroSequencialExtrato?: string
  movimentoData?: Date
  movimentoTipo?: string
  movimentoValor?: number
  movimentoSaldo?: number
  posicaoSaldo?: string
  descricaoHistorico?: string
  documentoNumero?: string
  numeroCpfCnpjContrapartida?: string
}
```

## Validação de Formulários

### Schema Zod
```tsx
// schemas/accountQuery.ts
import { z } from "zod"

export const accountQuerySchema = z.object({
  agencia: z.string()
    .length(4, "Agência deve ter 4 dígitos")
    .regex(/^\d{4}$/, "Agência deve conter apenas números"),
  contaCorrente: z.string()
    .regex(/^\d{2}\.\d{3}-\d$/, "Formato: XX.XXX-X"),
  dataInicio: z.date({
    required_error: "Data de início é obrigatória",
    invalid_type_error: "Data de início deve ser uma data válida"
  }),
  dataFim: z.date({
    required_error: "Data de fim é obrigatória",
    invalid_type_error: "Data de fim deve ser uma data válida"
  }),
  page: z.number().min(0, "Página deve ser >= 0"),
  size: z.number().min(1).max(100, "Tamanho deve estar entre 1 e 100")
}).refine((data) => data.dataInicio <= data.dataFim, {
  message: "Data de início deve ser anterior ou igual à data de fim",
  path: ["dataFim"]
})

export type AccountQueryFormData = z.infer<typeof accountQuerySchema>
```

### Uso com React Hook Form
```tsx
// components/forms/AccountQueryForm.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { accountQuerySchema, type AccountQueryFormData } from "@/schemas/accountQuery"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"

export const AccountQueryForm = ({ onSubmit }: { onSubmit: (data: AccountQueryFormData) => void }) => {
  const form = useForm<AccountQueryFormData>({
    resolver: zodResolver(accountQuerySchema),
    defaultValues: {
      page: 0,
      size: 20
    }
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Agência</label>
          <Input {...form.register("agencia")} placeholder="1234" />
          {form.formState.errors.agencia && (
            <p className="text-sm text-red-500">{form.formState.errors.agencia.message}</p>
          )}
        </div>
        
        <div>
          <label className="text-sm font-medium">Conta Corrente</label>
          <Input {...form.register("contaCorrente")} placeholder="12.345-6" />
          {form.formState.errors.contaCorrente && (
            <p className="text-sm text-red-500">{form.formState.errors.contaCorrente.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Data Início</label>
          <DatePicker 
            selected={form.watch("dataInicio")}
            onChange={(date) => form.setValue("dataInicio", date)}
            placeholderText="Selecione a data"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Data Fim</label>
          <DatePicker 
            selected={form.watch("dataFim")}
            onChange={(date) => form.setValue("dataFim", date)}
            placeholderText="Selecione a data"
          />
        </div>
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Consultando..." : "Consultar"}
      </Button>
    </form>
  )
}
```

## Tratamento de Erros

### Error Handler
```tsx
// utils/errorHandler.ts
export const handleApiError = (error: any): string => {
  if (error.response?.status === 400) {
    return "Dados inválidos. Verifique o formato da agência e conta."
  }
  if (error.response?.status === 404) {
    return "Conta não encontrada."
  }
  if (error.response?.status === 500) {
    return "Erro interno do servidor. Tente novamente."
  }
  if (error.code === 'NETWORK_ERROR') {
    return "Erro de conexão. Verifique sua internet."
  }
  return "Erro desconhecido. Tente novamente."
}
```

### Loading States
```tsx
// hooks/useLoading.ts
import { useState } from 'react'

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const startLoading = () => {
    setIsLoading(true)
    setError(null)
  }
  
  const stopLoading = () => {
    setIsLoading(false)
  }
  
  const setErrorMessage = (message: string) => {
    setError(message)
    setIsLoading(false)
  }
  
  return { 
    isLoading, 
    error, 
    startLoading, 
    stopLoading, 
    setErrorMessage 
  }
}
```

## Exemplos de Uso

### Implementação Completa de uma Tela
```tsx
// components/features/Imports.tsx
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAccountQuery } from '@/hooks/useAccountQuery'
import { usePagination } from '@/hooks/usePagination'
import { useLoading } from '@/hooks/useLoading'
import { AccountImportResponse } from '@/types/api'

export const Imports = () => {
  const [imports, setImports] = useState<AccountImportResponse[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const { isLoading, error, startLoading, stopLoading, setErrorMessage } = useLoading()
  const { currentPage, totalPages, hasNext, hasPrevious, goToPage, nextPage, previousPage } = usePagination(totalElements, 20)

  const fetchImports = async (page: number) => {
    startLoading()
    try {
      // Implementar chamada da API
      const response = await fetch(`/api/imports?page=${page}&size=20`)
      const data = await response.json()
      setImports(data.content)
      setTotalElements(data.totalElements)
    } catch (err) {
      setErrorMessage('Erro ao carregar importações')
    } finally {
      stopLoading()
    }
  }

  useEffect(() => {
    fetchImports(currentPage)
  }, [currentPage])

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Importações Realizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Arquivo</TableHead>
                <TableHead>Registros</TableHead>
                <TableHead>Contas</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imports.map((importItem) => (
                <TableRow key={importItem.id}>
                  <TableCell>{importItem.dataHora?.toLocaleDateString()}</TableCell>
                  <TableCell>{importItem.arquivoNome}</TableCell>
                  <TableCell>{importItem.qtdRegistros}</TableCell>
                  <TableCell>{importItem.qtdContas}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-green-500">
                      ✅ Concluída
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {currentPage * 20 + 1}-{Math.min((currentPage + 1) * 20, totalElements)} de {totalElements} resultados
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={previousPage}
            disabled={!hasPrevious}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-3 py-1">{currentPage + 1} de {totalPages}</span>
          <button
            onClick={nextPage}
            disabled={!hasNext}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  )
}
```

## Referências

- [Documentação do React](https://react.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Lucide Icons](https://lucide.dev/)
- [Documentação da API](../api-endpoints.md)

## Histórico de Alterações

| Data | Autor | Descrição |
|------|-------|-----------|
| 2024-01-15 | Sistema | Criação inicial da documentação do frontend |
| 2024-01-15 | Sistema | Adição de exemplos de componentes e hooks |
| 2024-01-15 | Sistema | Implementação de validação e tratamento de erros |
