import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { MainDashboard } from '@/components/dashboard/MainDashboard'
import { IntegratedAccountQuery } from '@/components/features/IntegratedAccountQuery'
import { QueryLogs } from '@/components/features/QueryLogs'
import { Imports } from '@/components/features/Imports'
import { Movements } from '@/components/features/Movements'
import { QueryResults } from '@/components/features/QueryResults'

// Dados mockados para demonstração (mantidos para fallback)
const mockAlerts = [
  {
    id: '1',
    type: 'critical' as const,
    message: 'Falha na conexão com API do Banco do Brasil',
    timestamp: '2 min atrás',
    priority: 'high' as const
  },
  {
    id: '2',
    type: 'warning' as const,
    message: '5 consultas com timeout nos últimos 30 min',
    timestamp: '15 min atrás',
    priority: 'medium' as const
  },
  {
    id: '3',
    type: 'info' as const,
    message: 'Nova versão da API disponível',
    timestamp: '1 hora atrás',
    priority: 'low' as const
  }
]

function App() {
  return (
    <Layout>
      <Routes>
        {/* Dashboard Principal */}
        <Route path="/" element={<MainDashboard />} />
        
        {/* Módulo de Consultas */}
        <Route path="/consulta" element={<IntegratedAccountQuery />} />
        <Route path="/consulta/logs" element={<QueryLogs />} />
        <Route path="/consulta/resultados" element={<QueryResults queryData={{
          agencia: '',
          contaCorrente: '',
          dataInicio: '',
          dataFim: '',
          tipoConsulta: 'logs'
        }} />} />
        
        {/* Módulo de Importações */}
        <Route path="/importacoes" element={<Imports />} />
        
        {/* Módulo de Movimentações */}
        <Route path="/movimentacoes" element={<Movements /> } />
        
        {/* Módulo de Relatórios */}
        <Route path="/relatorios" element={
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
              <p className="text-muted-foreground">
                Sistema de relatórios e analytics avançados
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Relatório de Consultas</h3>
                <p className="text-muted-foreground">Análise de consultas por período</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Relatório de Importações</h3>
                <p className="text-muted-foreground">Status e métricas de importações</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Relatório de Movimentações</h3>
                <p className="text-muted-foreground">Análise de fluxo de caixa</p>
              </div>
            </div>
          </div>
        } />
        
        {/* Módulo de Configurações */}
        <Route path="/configuracoes" element={
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
              <p className="text-muted-foreground">
                Configurações do sistema e preferências
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Configurações da API</h3>
                <p className="text-muted-foreground">URLs, timeouts e configurações de conexão</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Preferências de Usuário</h3>
                <p className="text-muted-foreground">Tema, idioma e configurações pessoais</p>
              </div>
            </div>
          </div>
        } />
        
        {/* Rota 404 - Página não encontrada */}
        <Route path="*" element={
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-muted-foreground mb-4">404</h1>
              <p className="text-muted-foreground mb-4">Página não encontrada</p>
              <a href="/" className="text-primary hover:underline">
                Voltar ao Dashboard
              </a>
            </div>
          </div>
        } />
      </Routes>
    </Layout>
  )
}

export default App
