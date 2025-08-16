# RFC - Interface Frontend COPPETEC BB Extrato

## 📋 **Informações do Documento**

- **Versão**: 1.0.0
- **Data de Criação**: 2025-01-27
- **Status**: Aprovado
- **Autor**: Sistema COPPETEC
- **Revisores**: Equipe de Desenvolvimento Frontend

## 🎯 **Objetivo**

Este documento especifica a interface completa do frontend para o sistema COPPETEC BB Extrato, incluindo telas, fluxos de navegação, casos de uso e integrações com a API. Todas as funcionalidades são baseadas exclusivamente nos endpoints disponíveis na API.

## 🏗️ **Arquitetura do Frontend**

### **Tecnologias Recomendadas**
- **Framework**: React 18+ com TypeScript
- **Roteamento**: React Router v6
- **Gerenciamento de Estado**: Zustand ou Redux Toolkit
- **UI Components**: Material-UI (MUI) ou Ant Design
- **HTTP Client**: Axios ou React Query
- **Formulários**: React Hook Form + Zod
- **Testes**: Jest + React Testing Library

### **Estrutura de Pastas**
```
src/
├── components/          # Componentes reutilizáveis
├── pages/              # Páginas da aplicação
├── hooks/              # Custom hooks
├── services/           # Serviços de API
├── types/              # Tipos TypeScript
├── utils/              # Utilitários
├── constants/          # Constantes
└── assets/             # Recursos estáticos
```

## 🗺️ **Mapa de Rotas e Páginas**

### **1. Página Inicial (Dashboard)**
- **Rota**: `/`
- **Componente**: `DashboardPage`
- **Funcionalidade**: Visão geral do sistema com métricas principais

### **2. Monitoramento de Schedule**
- **Rota**: `/schedule`
- **Componente**: `SchedulePage`
- **Funcionalidade**: Monitoramento de jobs e processos

### **3. Consulta de Contas**
- **Rota**: `/accounts`
- **Componente**: `AccountsPage`
- **Funcionalidade**: Consulta de contas bancárias

### **4. Detalhes da Conta**
- **Rota**: `/accounts/:agencia/:contaCorrente`
- **Componente**: `AccountDetailsPage`
- **Funcionalidade**: Detalhes específicos de uma conta

### **5. Logs de Consulta**
- **Rota**: `/accounts/:agencia/:contaCorrente/logs`
- **Componente**: `QueryLogsPage`
- **Funcionalidade**: Histórico de consultas

### **6. Importações**
- **Rota**: `/accounts/:agencia/:contaCorrente/imports`
- **Componente**: `ImportsPage`
- **Funcionalidade**: Histórico de importações

### **7. Movimentações**
- **Rota**: `/accounts/:agencia/:contaCorrente/movements`
- **Componente**: `MovementsPage`
- **Funcionalidade**: Histórico de movimentações

## 📱 **Especificação das Telas**

### **1. Dashboard (Página Inicial)**

#### **Layout da Tela**
```
┌─────────────────────────────────────────────────────────────┐
│                    COPPETEC BB Extrato                      │
├─────────────────────────────────────────────────────────────┤
│ [Dashboard] [Schedule] [Contas]                            │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│ │ Jobs Ativos │ │ Taxa Sucesso│ │ Total Contas│            │
│ │     2       │ │    93.75%   │ │     8       │            │
│ └─────────────┘ └─────────────┘ └─────────────┘            │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                    Jobs em Execução                     │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ consulta-extrato-1234567890                         │ │ │
│ │ │ Status: Em execução | Progresso: 75%               │ │ │
│ │ │ Registros: 150/200 | Contas: 2/3                   │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                 Estatísticas do Sistema                 │ │
│ │ Total Jobs: 18 | Tempo Médio: 42s | Uptime: 24h       │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### **Integrações API**
- **GET** `/api/schedule/progress` - Métricas principais
- **GET** `/api/schedule/stats` - Estatísticas do sistema
- **GET** `/api/schedule/health` - Status do sistema

#### **Funcionalidades**
- Exibição de métricas em tempo real
- Atualização automática a cada 30 segundos
- Links para páginas detalhadas
- Indicadores visuais de status

### **2. Monitoramento de Schedule**

#### **Layout da Tela**
```
┌─────────────────────────────────────────────────────────────┐
│                    Monitoramento de Schedule                │
├─────────────────────────────────────────────────────────────┤
│ [Dashboard] [Schedule] [Contas]                            │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                    Filtros                             │ │
│ │ Status: [Todos ▼] | Período: [Últimas 24h ▼]          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                    Jobs Ativos                          │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ consulta-extrato-1234567890                         │ │ │
│ │ │ Status: RUNNING | Início: 10:00:00                 │ │ │
│ │ │ Progresso: 75% | Tempo Restante: 15s               │ │ │
│ │ │ [Ver Detalhes] [Cancelar]                          │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                 Histórico de Jobs                       │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ consulta-extrato-0987654321 | COMPLETED | 10:30:00 │ │ │
│ │ │ consulta-extrato-1122334455 | FAILED   | 09:45:00 │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### **Integrações API**
- **GET** `/api/schedule/active` - Jobs ativos
- **GET** `/api/schedule/progress` - Progresso geral
- **GET** `/api/schedule/job/{jobName}` - Detalhes do job
- **POST** `/api/schedule/job/{jobName}/cancel` - Cancelar job

#### **Funcionalidades**
- Lista de jobs ativos com progresso em tempo real
- Histórico de jobs executados
- Ação de cancelamento de jobs
- Filtros por status e período
- Atualização automática a cada 10 segundos

### **3. Consulta de Contas**

#### **Layout da Tela**
```
┌─────────────────────────────────────────────────────────────┐
│                      Consulta de Contas                     │
├─────────────────────────────────────────────────────────────┤
│ [Dashboard] [Schedule] [Contas]                            │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                    Filtros                             │ │
│ │ Agência: [____] | Conta: [_______-_]                   │ │
│ │ Período: [Mês/Ano ▼] ou [Data Início] [Data Fim]      │ │
│ │ [Consultar]                                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                 Resultados da Consulta                  │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Agência: 2234 | Conta: 12.345-6                    │ │ │
│ │ │ Período: Janeiro/2025                               │ │ │
│ │ │ [Ver Logs] [Ver Importações] [Ver Movimentações]    │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                 Histórico de Consultas                  │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ 2234/12.345-6 | Última consulta: 27/01/2025       │ │ │
│ │ │ 2234/57446-5  | Última consulta: 26/01/2025       │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### **Integrações API**
- **GET** `/api/accounts/{agencia}/{contaCorrente}/query-logs` - Logs de consulta
- **GET** `/api/accounts/{agencia}/{contaCorrente}/imports` - Importações
- **GET** `/api/accounts/{agencia}/{contaCorrente}/movements` - Movimentações

#### **Funcionalidades**
- Formulário de consulta com validação
- Suporte aos dois formatos de conta (com e sem ponto)
- Seleção de período por mês/ano ou datas específicas
- Histórico de contas consultadas
- Navegação para detalhes específicos

### **4. Detalhes da Conta**

#### **Layout da Tela**
```
┌─────────────────────────────────────────────────────────────┐
│                    Detalhes da Conta                        │
├─────────────────────────────────────────────────────────────┤
│ [Dashboard] [Schedule] [Contas]                            │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                 Informações da Conta                    │ │
│ │ Agência: 2234 | Conta: 12.345-6 | Banco: 001          │ │
│ │ Descrição: CONTA CORRENTE                               │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                    Navegação                            │ │
│ │ [Logs de Consulta] [Importações] [Movimentações]       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                 Resumo de Atividades                    │ │
│ │ Total de Consultas: 45 | Total de Importações: 15      │ │
│ │ Total de Movimentações: 250 | Última Atualização: Hoje │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### **Funcionalidades**
- Exibição de informações básicas da conta
- Navegação para as diferentes seções
- Resumo de atividades
- Breadcrumb de navegação

### **5. Logs de Consulta**

#### **Layout da Tela**
```
┌─────────────────────────────────────────────────────────────┐
│                    Logs de Consulta                         │
├─────────────────────────────────────────────────────────────┤
│ [Dashboard] [Schedule] [Contas] > 2234/12.345-6 > Logs    │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                    Filtros                             │ │
│ │ Período: [Mês/Ano ▼] ou [Data Início] [Data Fim]      │ │
│ │ Status: [Todos ▼] | [Aplicar Filtros]                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                 Logs de Consulta                        │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ ID: 12345 | Data: 27/01/2025 10:00:00              │ │ │
│ │ │ Período: 01/01/2025 a 31/01/2025                   │ │ │
│ │ │ Status: Sucesso | Erro: -                           │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ ID: 12344 | Data: 26/01/2025 10:00:00              │ │ │
│ │ │ Período: 01/01/2025 a 31/01/2025                   │ │ │
│ │ │ Status: Erro | Código: 500                          │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                    Paginação                            │ │
│ │ [Anterior] 1 de 3 [Próxima] | Itens por página: [20▼] │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### **Integrações API**
- **GET** `/api/accounts/{agencia}/{contaCorrente}/query-logs` - Lista de logs

#### **Funcionalidades**
- Lista paginada de logs de consulta
- Filtros por período e status
- Exibição de erros e códigos de status
- Paginação com controle de tamanho da página
- Formatação de datas e horários

### **6. Importações**

#### **Layout da Tela**
```
┌─────────────────────────────────────────────────────────────┐
│                        Importações                          │
├─────────────────────────────────────────────────────────────┤
│ [Dashboard] [Schedule] [Contas] > 2234/12.345-6 > Imports │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                    Filtros                             │ │
│ │ Período: [Mês/Ano ▼] ou [Data Início] [Data Fim]      │ │
│ │ [Aplicar Filtros]                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                    Lista de Importações                │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ ID: 67890 | Arquivo: extrato_20250127.txt          │ │ │
│ │ │ Data: 27/01/2025 10:00:00                          │ │ │
│ │ │ Registros: 250 | Contas: 2 | Lotes: 5              │ │ │
│ │ │ Versão Layout: 1.0                                  │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                    Paginação                            │ │
│ │ [Anterior] 1 de 1 [Próxima] | Itens por página: [20▼] │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### **Integrações API**
- **GET** `/api/accounts/{agencia}/{contaCorrente}/imports` - Lista de importações

#### **Funcionalidades**
- Lista paginada de importações
- Filtros por período
- Exibição de metadados dos arquivos
- Estatísticas de processamento
- Paginação

### **7. Movimentações**

#### **Layout da Tela**
```
┌─────────────────────────────────────────────────────────────┐
│                      Movimentações                          │
├─────────────────────────────────────────────────────────────┤
│ [Dashboard] [Schedule] [Contas] > 2234/12.345-6 > Mov.    │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                    Filtros                             │ │
│ │ Período: [Mês/Ano ▼] ou [Data Início] [Data Fim]      │ │
│ │ Tipo: [Todos ▼] | Categoria: [Todas ▼]                 │ │
│ │ [Aplicar Filtros]                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                   Lista de Movimentações               │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ 27/01/2025 | CRÉDITO | R$ 1.500,00                 │ │
│ │ │ Saldo: R$ 5.000,00 | TED | TRANSFERENCIA RECEBIDA   │ │
│ │ │ Origem: BB 1234/56789-0 | CPF: 123.456.789-01      │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                    Paginação                            │ │
│ │ [Anterior] 1 de 13 [Próxima] | Itens por página: [20▼]│ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### **Integrações API**
- **GET** `/api/accounts/{agencia}/{contaCorrente}/movements` - Lista de movimentações

#### **Funcionalidades**
- Lista paginada de movimentações
- Filtros por período, tipo e categoria
- Exibição detalhada de transações
- Formatação de valores monetários
- Informações de contrapartida
- Paginação

## 🔄 **Fluxograma de Navegação**

```
                    ┌─────────────┐
                    │   Login     │
                    └─────┬───────┘
                          │
                    ┌─────▼───────┐
                    │  Dashboard  │
                    │     (/)     │
                    └─────┬───────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    ┌───▼───┐         ┌───▼───┐         ┌───▼───┐
    │Schedule│         │Contas │         │  ...  │
    │(/schedule)│      │(/accounts)│     │       │
    └───┬───┘         └───┬───┘         │       │
        │                 │             │       │
    ┌───▼───┐         ┌───▼───┐         │       │
    │Job Det.│         │Conta  │         │       │
    │(/schedule/│      │Detalhes│        │       │
    │ /job/:id)│      │(/accounts/│      │       │
    └─────────┘       │ /:ag/:cc)│      │       │
                      └─────┬───┘       │       │
                            │           │       │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
    ┌───▼───┐           ┌───▼───┐           ┌───▼───┐
    │ Logs  │           │Imports│           │Movim. │
    │(/logs)│           │(/imports)│        │(/movements)│
    └───────┘           └───────┘           └───────┘
```

## 📝 **Formulários e Validações**

### **1. Formulário de Consulta de Conta**

#### **Campos e Validações**
```
┌─────────────────────────────────────────────────────────────┐
│                    Consulta de Conta                        │
├─────────────────────────────────────────────────────────────┤
│ Agência: [____] *                                          │
│   - 4 dígitos numéricos                                    │
│   - Obrigatório                                            │
│                                                             │
│ Conta Corrente: [_______-_] *                              │
│   - Formato: XX.XXX-X ou XXXXX-X                           │
│   - Obrigatório                                            │
│   - Validação de formato                                   │
│                                                             │
│ Período de Consulta:                                       │
│   [ ] Mês/Ano                                              │
│   [ ] Período Específico                                   │
│                                                             │
│ Se Mês/Ano:                                                │
│   Mês: [Janeiro ▼] (1-12)                                 │
│   Ano: [2025] (4 dígitos)                                 │
│                                                             │
│ Se Período Específico:                                     │
│   Data Início: [__/__/____ __:__:__]                      │
│   Data Fim: [__/__/____ __:__:__]                         │
│                                                             │
│ [Consultar] [Limpar]                                       │
└─────────────────────────────────────────────────────────────┘
```

#### **Validações**
- Agência: 4 dígitos numéricos
- Conta: Formato válido (XX.XXX-X ou XXXXX-X)
- Período: Mês/Ano OU Data Início/Data Fim (não ambos)
- Data Início ≤ Data Fim
- Ano: 4 dígitos, mínimo 2000, máximo ano atual + 1

### **2. Formulário de Filtros de Período**

#### **Campos e Validações**
```
┌─────────────────────────────────────────────────────────────┐
│                    Filtros de Período                       │
├─────────────────────────────────────────────────────────────┤
│ Tipo de Filtro:                                            │
│   (•) Mês/Ano                                              │
│   ( ) Período Específico                                   │
│                                                             │
│ Mês/Ano:                                                   │
│   Mês: [Janeiro ▼] | Ano: [2025]                          │
│                                                             │
│ Período Específico:                                        │
│   Data Início: [__/__/____ __:__:__]                      │
│   Data Fim: [__/__/____ __:__:__]                         │
│                                                             │
│ [Aplicar Filtros] [Limpar]                                │
└─────────────────────────────────────────────────────────────┘
```

## 🔌 **Integrações com a API**

### **1. Serviços de API**

#### **ScheduleService**
```typescript
class ScheduleService {
  async getProgress(): Promise<JobProgressSummaryResponse>
  async getActiveJobs(): Promise<JobProgressResponse[]>
  async getJobDetails(jobName: string): Promise<JobProgressResponse>
  async getSystemStats(): Promise<SystemStatsResponse>
  async cancelJob(jobName: string): Promise<void>
  async getHealth(): Promise<HealthResponse>
}
```

#### **AccountService**
```typescript
class AccountService {
  async getQueryLogs(
    agencia: string, 
    contaCorrente: string, 
    params: AccountQueryParams
  ): Promise<PaginationResponse<AccountQueryLogResponse>>
  
  async getImports(
    agencia: string, 
    contaCorrente: string, 
    params: AccountQueryParams
  ): Promise<PaginationResponse<AccountImportResponse>>
  
  async getMovements(
    agencia: string, 
    contaCorrente: string, 
    params: AccountQueryParams
  ): Promise<PaginationResponse<AccountMovementResponse>>
}
```

### **2. Hooks Customizados**

#### **useScheduleProgress**
```typescript
const useScheduleProgress = () => {
  const [data, setData] = useState<JobProgressSummaryResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const refetch = useCallback(() => { /* ... */ }, [])
  const cancelJob = useCallback((jobName: string) => { /* ... */ }, [])
  
  return { data, loading, error, refetch, cancelJob }
}
```

#### **useAccountData**
```typescript
const useAccountData = (
  agencia: string, 
  contaCorrente: string, 
  params: AccountQueryParams
) => {
  const [data, setData] = useState<PaginationResponse<any> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const refetch = useCallback(() => { /* ... */ }, [agencia, contaCorrente, params])
  
  return { data, loading, error, refetch }
}
```

## 📊 **Casos de Uso**

### **1. Monitoramento de Sistema**
**Ator**: Administrador do Sistema
**Objetivo**: Acompanhar o status e performance dos jobs de processamento

**Fluxo**:
1. Acessa o Dashboard
2. Visualiza métricas em tempo real
3. Navega para Schedule para detalhes
4. Monitora jobs ativos
5. Cancela jobs problemáticos se necessário
6. Acompanha estatísticas de performance

**Endpoints Utilizados**:
- `GET /api/schedule/progress`
- `GET /api/schedule/active`
- `GET /api/schedule/stats`
- `POST /api/schedule/job/{jobName}/cancel`

### **2. Consulta de Extrato Bancário**
**Ator**: Usuário Financeiro
**Objetivo**: Consultar movimentações de uma conta específica

**Fluxo**:
1. Acessa a página de Contas
2. Preenche agência e conta corrente
3. Seleciona período de consulta
4. Executa a consulta
5. Visualiza resultados
6. Navega para detalhes específicos

**Endpoints Utilizados**:
- `GET /api/accounts/{agencia}/{contaCorrente}/query-logs`
- `GET /api/accounts/{agencia}/{contaCorrente}/imports`
- `GET /api/accounts/{agencia}/{contaCorrente}/movements`

### **3. Análise de Logs de Consulta**
**Ator**: Analista de Sistema
**Objetivo**: Investigar problemas em consultas bancárias

**Fluxo**:
1. Acessa logs de uma conta específica
2. Aplica filtros por período
3. Analisa códigos de erro
4. Identifica padrões de falha
5. Gera relatórios de problemas

**Endpoints Utilizados**:
- `GET /api/accounts/{agencia}/{contaCorrente}/query-logs`

### **4. Auditoria de Importações**
**Ator**: Auditor Financeiro
**Objetivo**: Verificar histórico de arquivos processados

**Fluxo**:
1. Acessa importações de uma conta
2. Filtra por período específico
3. Analisa metadados dos arquivos
4. Verifica volumes de dados
5. Confirma integridade dos processos

**Endpoints Utilizados**:
- `GET /api/accounts/{agencia}/{contaCorrente}/imports`

### **5. Análise de Movimentações**
**Ator**: Contador/Analista Financeiro
**Objetivo**: Analisar transações financeiras para relatórios

**Fluxo**:
1. Acessa movimentações de uma conta
2. Aplica filtros por período e categoria
3. Analisa valores e saldos
4. Identifica padrões de transação
5. Exporta dados para análise

**Endpoints Utilizados**:
- `GET /api/accounts/{agencia}/{contaCorrente}/movements`

## 🎨 **Diretrizes de Design**

### **1. Cores e Temas**
- **Primária**: Azul corporativo (#1976d2)
- **Secundária**: Verde (#4caf50)
- **Aviso**: Laranja (#ff9800)
- **Erro**: Vermelho (#f44336)
- **Sucesso**: Verde (#4caf50)
- **Neutro**: Cinza (#757575)

### **2. Tipografia**
- **Títulos**: Roboto Bold, 24px-32px
- **Subtítulos**: Roboto Medium, 18px-20px
- **Corpo**: Roboto Regular, 14px-16px
- **Legendas**: Roboto Light, 12px

### **3. Componentes**
- **Botões**: Material Design com estados hover/focus
- **Inputs**: Labels flutuantes com validação visual
- **Tabelas**: Linhas alternadas com hover
- **Cards**: Sombras sutis com bordas arredondadas
- **Modais**: Overlay com animação de entrada

### **4. Responsividade**
- **Mobile First**: Design para dispositivos móveis
- **Breakpoints**: 320px, 768px, 1024px, 1440px
- **Grid**: Sistema flexível de 12 colunas
- **Navegação**: Menu hambúrguer em mobile

## 🧪 **Testes e Qualidade**

### **1. Testes Unitários**
- Componentes React com React Testing Library
- Hooks customizados com renderHook
- Serviços de API com mocks
- Utilitários e validações

### **2. Testes de Integração**
- Fluxos completos de navegação
- Integração com APIs
- Validação de formulários
- Tratamento de erros

### **3. Testes E2E**
- Cypress ou Playwright
- Cenários críticos de usuário
- Validação de responsividade
- Performance em diferentes dispositivos

## 🚀 **Implementação e Deploy**

### **1. Ambiente de Desenvolvimento**
- **Local**: `http://localhost:3000`
- **Dev**: `https://dev.coppetec.ufrj.br`
- **Staging**: `https://staging.coppetec.ufrj.br`

### **2. Build e Deploy**
- **Build**: Vite ou Create React App
- **Bundle**: Otimização para produção
- **Deploy**: CI/CD com GitHub Actions
- **Hosting**: Vercel, Netlify ou servidor próprio

### **3. Monitoramento**
- **Performance**: Core Web Vitals
- **Erros**: Sentry ou similar
- **Analytics**: Google Analytics
- **Logs**: Estruturados para análise

## 📚 **Documentação Adicional**

### **1. Storybook**
- Documentação de componentes
- Variações e estados
- Exemplos de uso
- Guia de design

### **2. JSDoc**
- Documentação de funções
- Tipos TypeScript
- Exemplos de código
- Guia de desenvolvimento

### **3. README**
- Setup do projeto
- Scripts disponíveis
- Estrutura de pastas
- Contribuição

---

**Documento criado para especificar a interface frontend completa do sistema COPPETEC BB Extrato, baseada exclusivamente nos endpoints disponíveis na API.**
