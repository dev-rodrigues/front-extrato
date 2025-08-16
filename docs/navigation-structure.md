# Estrutura de Navegação e Dashboard Planejado

## Resumo/Objetivo
Documentação detalhada da estrutura de navegação, menus e dashboard planejado para a aplicação de consulta de extratos bancários. Este documento define a hierarquia de navegação, componentes de interface e funcionalidades do dashboard integrado com o backend.

## Contexto
Com base na implementação frontend existente (TASK-001) e na documentação da API backend, este documento planeja a estrutura completa de navegação e dashboard que será implementada na TASK-002 para integração com o backend.

## Estrutura de Navegação Principal

### 🏠 Dashboard Principal
**Rota**: `/`
**Componente**: `MainDashboard.tsx`

#### Funcionalidades Principais
- **Visão Geral do Sistema**: Métricas em tempo real
- **Cards de Resumo**: Estatísticas principais
- **Gráficos Interativos**: Visualizações de dados
- **Alertas e Notificações**: Sistema de alertas em tempo real
- **Widgets Personalizáveis**: Configuração por usuário

#### Layout do Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ Header (Logo, User Menu, Notifications)                    │
├─────────────────────────────────────────────────────────────┤
│ Sidebar Navigation                                          │
│ ├─ 🏠 Dashboard                                            │
│ ├─ 🔍 Consultas                                            │
│ ├─ 📥 Importações                                          │
│ ├─ 💰 Movimentações                                        │
│ └─ ⚙️ Administração                                        │
├─────────────────────────────────────────────────────────────┤
│ Main Content Area                                           │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │ Total Contas    │ │ Consultas Hoje  │ │ Importações     │ │
│ │ 150            │ │ 45              │ │ Pendentes: 3    │ │
│ │ +12% este mês  │ │ +8% vs ontem    │ │ +2 esta hora    │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Gráfico: Consultas por Período (Chart.js)                  │ │
│ │ [Gráfico de linha mostrando tendência]                     │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Alertas e Notificações                                      │ │
│ │ • Importação concluída: extrato_20240115.txt               │ │
│ │ • Nova consulta realizada: Ag. 1234 / Conta 12.345-6      │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 🔍 Módulo de Consultas
**Rota Base**: `/consultas`
**Componente Principal**: `ConsultasLayout.tsx`

#### Submenus e Funcionalidades

##### 1. Consulta por Agência/Conta
**Rota**: `/consultas/nova-consulta`
**Componente**: `NovaConsulta.tsx`

**Funcionalidades**:
- Formulário de consulta com validação em tempo real
- Autocompletar para agências e contas
- Seleção de período com DatePicker
- Histórico de consultas recentes
- Favoritos de consulta

**Interface**:
```
┌─────────────────────────────────────────────────────────────┐
│ Nova Consulta                                               │
├─────────────────────────────────────────────────────────────┤
│ Agência: [1234] Conta: [12.345-6]                          │
│ Período: [01/01/2024] até [31/01/2024]                    │
│                                                             │
│ [🔍 Realizar Consulta] [⭐ Adicionar aos Favoritos]        │
├─────────────────────────────────────────────────────────────┤
│ Consultas Recentes                                          │
│ • Ag. 1234 / Conta 12.345-6 - 15/01/2024                  │
│ • Ag. 5678 / Conta 98.765-4 - 14/01/2024                  │
│ • Ag. 9012 / Conta 45.678-9 - 13/01/2024                  │
└─────────────────────────────────────────────────────────────┘
```

##### 2. Histórico de Consultas
**Rota**: `/consultas/historico`
**Componente**: `HistoricoConsultas.tsx`

**Funcionalidades**:
- Lista paginada de todas as consultas realizadas
- Filtros por período, agência, conta, status
- Detalhes de cada consulta
- Reexecução de consultas anteriores
- Exportação de histórico

##### 3. Consultas Favoritas
**Rota**: `/consultas/favoritos`
**Componente**: `ConsultasFavoritas.tsx`

**Funcionalidades**:
- Lista de consultas marcadas como favoritas
- Execução rápida de consultas favoritas
- Organização por categorias
- Compartilhamento de consultas

### 📥 Módulo de Importações
**Rota Base**: `/importacoes`
**Componente Principal**: `ImportacoesLayout.tsx`

#### Submenus e Funcionalidades

##### 1. Status de Importações
**Rota**: `/importacoes/status`
**Componente**: `StatusImportacoes.tsx`

**Funcionalidades**:
- Dashboard de status das importações
- Filtros por status (pendente, em processamento, concluída, erro)
- Ações em lote (cancelar, reprocessar)
- Notificações de mudança de status

**Interface**:
```
┌─────────────────────────────────────────────────────────────┐
│ Status das Importações                                      │
├─────────────────────────────────────────────────────────────┤
│ Filtros: [Status: Todos] [Período: Últimos 7 dias]        │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │ Pendentes       │ │ Em Processamento│ │ Concluídas      │ │
│ │ 3              │ │ 2              │ │ 45              │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
│                                                                 │
│ Tabela de Importações                                          │
│ Data/Hora    │ Arquivo           │ Status    │ Ações          │
│ 15/01 14:30 │ extrato_20240115  │ ✅ Concl. │ [👁️] [📥]     │
│ 15/01 13:15 │ extrato_20240115  │ ⏳ Proc.  │ [⏹️] [🔄]     │
│ 15/01 12:00 │ extrato_20240115  │ ⏳ Pend.  │ [▶️] [❌]     │
└─────────────────────────────────────────────────────────────┘
```

##### 2. Histórico de Arquivos
**Rota**: `/importacoes/historico`
**Componente**: `HistoricoArquivos.tsx`

**Funcionalidades**:
- Histórico completo de arquivos importados
- Detalhes de cada importação
- Métricas de sucesso/erro
- Download de arquivos processados

##### 3. Configurações de Importação
**Rota**: `/importacoes/configuracoes`
**Componente**: `ConfiguracoesImportacao.tsx`

**Funcionalidades**:
- Configuração de horários de importação
- Configuração de notificações
- Configuração de retry automático
- Configuração de validações

### 💰 Módulo de Movimentações
**Rota Base**: `/movimentacoes`
**Componente Principal**: `MovimentacoesLayout.tsx`

#### Submenus e Funcionalidades

##### 1. Extratos por Período
**Rota**: `/movimentacoes/extratos`
**Componente**: `ExtratosPeriodo.tsx`

**Funcionalidades**:
- Consulta de extratos por período
- Visualização de movimentações
- Filtros por tipo de movimento
- Cálculo de saldos

**Interface**:
```
┌─────────────────────────────────────────────────────────────┐
│ Extratos por Período                                        │
├─────────────────────────────────────────────────────────────┤
│ Filtros: [Período] [Tipo] [Valor Mín/Máx]                 │
├─────────────────────────────────────────────────────────────┤
│ Resumo do Período                                           │
│ Saldo Inicial: R$ 15.000,00 | Saldo Final: R$ 15.450,00   │
│ Total Créditos: R$ 2.500,00 | Total Débitos: R$ 2.050,00  │
├─────────────────────────────────────────────────────────────┤
│ Tabela de Movimentações                                     │
│ Data    │ Descrição           │ Tipo │ Valor    │ Saldo    │
│ 15/01   │ Pagamento conta    │ D    │ R$ 150,00│ R$ 15.450│
│ 15/01   │ Depósito           │ C    │ R$ 500,00│ R$ 15.600│
│ 14/01   │ Transferência      │ D    │ R$ 200,00│ R$ 15.100│
└─────────────────────────────────────────────────────────────┘
```

##### 2. Análise de Movimentações
**Rota**: `/movimentacoes/analise`
**Componente**: `AnaliseMovimentacoes.tsx`

**Funcionalidades**:
- Gráficos de movimentações por categoria
- Análise de padrões de gastos
- Relatórios de fluxo de caixa
- Comparativo entre períodos

##### 3. Relatórios
**Rota**: `/movimentacoes/relatorios`
**Componente**: `RelatoriosMovimentacoes.tsx`

**Funcionalidades**:
- Geração de relatórios personalizados
- Exportação em múltiplos formatos
- Agendamento de relatórios
- Templates de relatório

### ⚙️ Módulo de Administração
**Rota Base**: `/admin`
**Componente Principal**: `AdminLayout.tsx`

#### Submenus e Funcionalidades

##### 1. Configurações do Sistema
**Rota**: `/admin/configuracoes`
**Componente**: `ConfiguracoesSistema.tsx`

**Funcionalidades**:
- Configurações gerais do sistema
- Configurações de API
- Configurações de notificações
- Configurações de segurança

##### 2. Logs de Auditoria
**Rota**: `/admin/logs`
**Componente**: `LogsAuditoria.tsx`

**Funcionalidades**:
- Visualização de logs de auditoria
- Filtros por usuário, ação, período
- Exportação de logs
- Alertas de atividades suspeitas

##### 3. Usuários e Permissões
**Rota**: `/admin/usuarios`
**Componente**: `GerenciamentoUsuarios.tsx`

**Funcionalidades**:
- Lista de usuários do sistema
- Gerenciamento de perfis e permissões
- Histórico de atividades por usuário
- Configuração de políticas de acesso

## Dashboard Dinâmico e Real-time

### 🎯 Cards de Métricas Principais

#### 1. Total de Contas Ativas
**Componente**: `MetricCard.tsx`
**Dados**: API endpoint para contagem de contas
**Atualização**: Real-time (WebSocket) ou polling a cada 5 minutos

#### 2. Consultas Realizadas
**Componente**: `QueryMetricsCard.tsx`
**Dados**: API endpoint para estatísticas de consultas
**Períodos**: Hoje, Semana, Mês
**Visualização**: Comparativo com período anterior

#### 3. Importações Pendentes
**Componente**: `ImportMetricsCard.tsx`
**Dados**: API endpoint para status de importações
**Atualização**: Real-time via WebSocket
**Ações**: Notificações automáticas

#### 4. Movimentações Processadas
**Componente**: `MovementMetricsCard.tsx`
**Dados**: API endpoint para estatísticas de movimentações
**Períodos**: Hoje, Semana, Mês
**Visualização**: Gráfico de tendência

### 📊 Gráficos e Visualizações

#### 1. Gráfico de Consultas por Período
**Biblioteca**: Chart.js ou Recharts
**Tipo**: Gráfico de linha
**Dados**: API endpoint para histórico de consultas
**Interatividade**: Zoom, pan, tooltips
**Exportação**: PNG, PDF

#### 2. Distribuição de Importações por Status
**Biblioteca**: Chart.js
**Tipo**: Gráfico de pizza/donut
**Dados**: API endpoint para status de importações
**Interatividade**: Clique para filtrar
**Atualização**: Real-time

#### 3. Movimentações por Tipo (Crédito/Débito)
**Biblioteca**: Chart.js
**Tipo**: Gráfico de barras empilhadas
**Dados**: API endpoint para movimentações
**Períodos**: Diário, semanal, mensal
**Comparativo**: Período anterior

### 🔔 Sistema de Alertas e Notificações

#### 1. Alertas em Tempo Real
**Tecnologia**: WebSocket ou Server-Sent Events
**Tipos de Alerta**:
- Importação concluída
- Erro de consulta
- Sistema offline
- Limite de consultas atingido

#### 2. Notificações Push
**Tecnologia**: Service Workers + Push API
**Configuração**: Por usuário
**Tipos**: Importantes, Informativas, Avisos

#### 3. Centro de Notificações
**Componente**: `NotificationCenter.tsx`
**Funcionalidades**:
- Lista de notificações não lidas
- Marcação como lida
- Filtros por tipo
- Histórico completo

### 🧩 Widgets Personalizáveis

#### 1. Sistema de Drag & Drop
**Biblioteca**: React DnD ou react-beautiful-dnd
**Funcionalidades**:
- Arrastar e soltar widgets
- Redimensionamento
- Configuração de posição
- Salvamento de layout

#### 2. Widgets Disponíveis
- **Métricas**: Cards de números
- **Gráficos**: Gráficos interativos
- **Tabelas**: Dados tabulares
- **Alertas**: Lista de alertas
- **Filtros**: Filtros globais

#### 3. Configuração por Usuário
- Layout personalizado
- Widgets favoritos
- Configurações de atualização
- Temas visuais

## Estrutura de Componentes

### 📁 Organização de Arquivos
```
src/
├── components/
│   ├── layout/
│   │   ├── MainNavigation.tsx          # Navegação principal
│   │   ├── Sidebar.tsx                 # Sidebar com menus
│   │   ├── Breadcrumb.tsx              # Navegação hierárquica
│   │   ├── UserMenu.tsx                # Menu do usuário
│   │   └── PageHeader.tsx              # Cabeçalho de página
│   ├── dashboard/
│   │   ├── MainDashboard.tsx           # Dashboard principal
│   │   ├── MetricCard.tsx              # Card de métrica
│   │   ├── ChartWidget.tsx             # Widget de gráfico
│   │   ├── AlertWidget.tsx             # Widget de alertas
│   │   └── NotificationCenter.tsx      # Centro de notificações
│   ├── navigation/
│   │   ├── NavigationMenu.tsx          # Menu de navegação
│   │   ├── NavigationItem.tsx          # Item de menu
│   │   └── NavigationGroup.tsx         # Grupo de menus
│   └── features/
│       ├── consultas/
│       │   ├── ConsultasLayout.tsx     # Layout do módulo
│       │   ├── NovaConsulta.tsx        # Nova consulta
│       │   ├── HistoricoConsultas.tsx  # Histórico
│       │   └── ConsultasFavoritas.tsx  # Favoritos
│       ├── importacoes/
│       │   ├── ImportacoesLayout.tsx   # Layout do módulo
│       │   ├── StatusImportacoes.tsx   # Status
│       │   ├── HistoricoArquivos.tsx   # Histórico
│       │   └── ConfiguracoesImportacao.tsx # Configurações
│       ├── movimentacoes/
│       │   ├── MovimentacoesLayout.tsx # Layout do módulo
│       │   ├── ExtratosPeriodo.tsx     # Extratos
│       │   ├── AnaliseMovimentacoes.tsx # Análise
│       │   └── RelatoriosMovimentacoes.tsx # Relatórios
│       └── admin/
│           ├── AdminLayout.tsx          # Layout do módulo
│           ├── ConfiguracoesSistema.tsx # Configurações
│           ├── LogsAuditoria.tsx        # Logs
│           └── GerenciamentoUsuarios.tsx # Usuários
```

### 🔄 Roteamento e Navegação

#### 1. Configuração de Rotas
```tsx
// src/routes/AppRoutes.tsx
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <MainDashboard /> },
      {
        path: 'consultas',
        element: <ConsultasLayout />,
        children: [
          { path: 'nova-consulta', element: <NovaConsulta /> },
          { path: 'historico', element: <HistoricoConsultas /> },
          { path: 'favoritos', element: <ConsultasFavoritas /> }
        ]
      },
      {
        path: 'importacoes',
        element: <ImportacoesLayout />,
        children: [
          { path: 'status', element: <StatusImportacoes /> },
          { path: 'historico', element: <HistoricoArquivos /> },
          { path: 'configuracoes', element: <ConfiguracoesImportacao /> }
        ]
      },
      {
        path: 'movimentacoes',
        element: <MovimentacoesLayout />,
        children: [
          { path: 'extratos', element: <ExtratosPeriodo /> },
          { path: 'analise', element: <AnaliseMovimentacoes /> },
          { path: 'relatorios', element: <RelatoriosMovimentacoes /> }
        ]
      },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          { path: 'configuracoes', element: <ConfiguracoesSistema /> },
          { path: 'logs', element: <LogsAuditoria /> },
          { path: 'usuarios', element: <GerenciamentoUsuarios /> }
        ]
      }
    ]
  }
])
```

#### 2. Lazy Loading
```tsx
// Implementação de lazy loading para otimização
const MainDashboard = lazy(() => import('@/components/dashboard/MainDashboard'))
const ConsultasLayout = lazy(() => import('@/components/features/consultas/ConsultasLayout'))
const ImportacoesLayout = lazy(() => import('@/components/features/importacoes/ImportacoesLayout'))
const MovimentacoesLayout = lazy(() => import('@/components/features/movimentacoes/MovimentacoesLayout'))
const AdminLayout = lazy(() => import('@/components/features/admin/AdminLayout'))
```

## Integração com Backend

### 🔌 Endpoints da API Utilizados

#### 1. Dashboard e Métricas
- `GET /api/dashboard/metrics` - Métricas gerais do sistema
- `GET /api/dashboard/charts` - Dados para gráficos
- `GET /api/dashboard/alerts` - Alertas e notificações

#### 2. Consultas
- `GET /api/accounts/{agencia}/{contaCorrente}/query-logs` - Logs de consulta
- `GET /api/accounts/{agencia}/{contaCorrente}/imports` - Histórico de importações
- `GET /api/accounts/{agencia}/{contaCorrente}/movements` - Movimentações

#### 3. Sistema
- `GET /api/system/status` - Status do sistema
- `GET /api/system/logs` - Logs de auditoria
- `GET /api/system/users` - Usuários do sistema

### 📡 Comunicação Real-time

#### 1. WebSocket para Atualizações
```tsx
// src/hooks/useWebSocket.ts
export const useWebSocket = (url: string) => {
  const [data, setData] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const ws = new WebSocket(url)
    
    ws.onopen = () => setIsConnected(true)
    ws.onmessage = (event) => setData(JSON.parse(event.data))
    ws.onclose = () => setIsConnected(false)
    
    return () => ws.close()
  }, [url])

  return { data, isConnected }
}
```

#### 2. Polling para Dados Críticos
```tsx
// src/hooks/usePolling.ts
export const usePolling = (callback: () => void, interval: number) => {
  useEffect(() => {
    const timer = setInterval(callback, interval)
    return () => clearInterval(timer)
  }, [callback, interval])
}
```

## Considerações de UX/UI

### 🎨 Design System
- **Cores**: Paleta baseada no tema shadcn/ui
- **Tipografia**: Hierarquia clara de textos
- **Espaçamento**: Sistema de espaçamento consistente
- **Animações**: Transições suaves e feedback visual

### 📱 Responsividade
- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**: Adaptação para tablets e desktops
- **Touch**: Otimizações para interfaces touch
- **Performance**: Carregamento otimizado em dispositivos lentos

### ♿ Acessibilidade
- **ARIA**: Labels e roles apropriados
- **Navegação**: Suporte a teclado
- **Contraste**: Alto contraste para melhor legibilidade
- **Screen Readers**: Compatibilidade com leitores de tela

## Cronograma de Implementação

### 📅 Fase 1 (Dias 1-2): Configuração e Estrutura
- Configuração de serviços de API
- Estrutura de roteamento
- Componentes de layout base

### 📅 Fase 2 (Dias 3-4): Navegação e Menus
- Sistema de navegação principal
- Sidebar e menus
- Breadcrumbs e navegação hierárquica

### 📅 Fase 3 (Dias 5-6): Dashboard e Funcionalidades
- Dashboard principal com métricas
- Gráficos e visualizações
- Sistema de alertas

### 📅 Fase 4 (Dias 7-8): Integração e Testes
- Integração completa com backend
- Testes de funcionalidades
- Otimizações de performance

## Referências

- [Documentação da API](api-endpoints.md)
- [Arquitetura do Sistema](architecture-overview.md)
- [Implementação Frontend](frontend-implementation.md)
- [React Router Documentation](https://reactrouter.com/)
- [Chart.js](https://www.chartjs.org/)
- [React Query](https://tanstack.com/query/latest)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## Histórico de Alterações

| Data | Autor | Descrição |
|------|-------|-----------|
| 2024-01-15 | Sistema | Criação inicial da documentação de navegação |
| 2024-01-15 | Sistema | Definição da estrutura de menus e dashboard |
| 2024-01-15 | Sistema | Planejamento de integração com backend |
