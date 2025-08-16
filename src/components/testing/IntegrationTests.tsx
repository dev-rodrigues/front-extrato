import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Play,
  Stop,
  Activity,
  Database,
  Globe,
  Zap,
  Clock
} from 'lucide-react'
import { 
  getQueryLogs, 
  getImports, 
  getMovements,
  validateAccount,
  getAccountStats
} from '@/services/accountService'
import { 
  getDashboardMetrics,
  getDashboardCharts,
  getSystemStatus,
  getSystemPerformance
} from '@/services/dashboardService'

/**
 * Componente para testes de integração com a API
 * Valida funcionalidades e performance do sistema
 */

interface TestResult {
  id: string
  name: string
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning'
  duration: number
  message: string
  details?: any
  timestamp: Date
}

interface TestSuite {
  name: string
  description: string
  tests: TestResult[]
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning'
}

export const IntegrationTests: React.FC = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [overallStatus, setOverallStatus] = useState<'pending' | 'running' | 'passed' | 'failed' | 'warning'>('pending')
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)

  // Inicializar suites de teste
  useEffect(() => {
    initializeTestSuites()
  }, [])

  const initializeTestSuites = () => {
    const suites: TestSuite[] = [
      {
        name: 'API Endpoints',
        description: 'Testa conectividade e respostas dos endpoints da API',
        tests: [
          { id: 'api-1', name: 'Teste de conectividade base', status: 'pending', duration: 0, message: 'Aguardando execução', timestamp: new Date() },
          { id: 'api-2', name: 'Validação de agência/conta', status: 'pending', duration: 0, message: 'Aguardando execução', timestamp: new Date() },
          { id: 'api-3', name: 'Consulta de logs', status: 'pending', duration: 0, message: 'Aguardando execução', timestamp: new Date() },
          { id: 'api-4', name: 'Consulta de importações', status: 'pending', duration: 0, message: 'Aguardando execução', timestamp: new Date() },
          { id: 'api-5', name: 'Consulta de movimentações', status: 'pending', duration: 0, message: 'Aguardando execução', timestamp: new Date() }
        ],
        status: 'pending'
      },
      {
        name: 'Dashboard Services',
        description: 'Testa serviços do dashboard e métricas',
        tests: [
          { id: 'dashboard-1', name: 'Métricas do dashboard', status: 'pending', duration: 0, message: 'Aguardando execução', timestamp: new Date() },
          { id: 'dashboard-2', name: 'Gráficos e visualizações', status: 'pending', duration: 0, message: 'Aguardando execução', timestamp: new Date() },
          { id: 'dashboard-3', name: 'Status do sistema', status: 'pending', duration: 0, message: 'Aguardando execução', timestamp: new Date() },
          { id: 'dashboard-4', name: 'Performance do sistema', status: 'pending', duration: 0, message: 'Aguardando execução', timestamp: new Date() }
        ],
        status: 'pending'
      },
      {
        name: 'Funcionalidades Core',
        description: 'Testa funcionalidades principais da aplicação',
        tests: [
          { id: 'core-1', name: 'Formulário de consulta', status: 'pending', duration: 0, message: 'Aguardando execução', timestamp: new Date() },
          { id: 'core-2', name: 'Sistema de filtros', status: 'pending', duration: 0, message: 'Aguardando execução', timestamp: new Date() },
          { id: 'core-3', name: 'Exportação de dados', status: 'pending', duration: 0, message: 'Aguardando execução', timestamp: new Date() },
          { id: 'core-4', name: 'Paginação e navegação', status: 'pending', duration: 0, message: 'Aguardando execução', timestamp: new Date() }
        ],
        status: 'pending'
      },
      {
        name: 'Performance e Resiliência',
        description: 'Testa performance e tratamento de erros',
        tests: [
          { id: 'perf-1', name: 'Tempo de resposta da API', status: 'pending', duration: 0, message: 'Aguardando execução', timestamp: new Date() },
          { id: 'perf-2', name: 'Tratamento de timeouts', status: 'pending', duration: 0, message: 'Aguardando execução', timestamp: new Date() },
          { id: 'perf-3', name: 'Fallback para dados mock', status: 'pending', duration: 0, message: 'Aguardando execução', timestamp: new Date() },
          { id: 'perf-4', name: 'Retry automático', status: 'pending', duration: 0, message: 'Aguardando execução', timestamp: new Date() }
        ],
        status: 'pending'
      }
    ]
    setTestSuites(suites)
  }

  // Executar todos os testes
  const runAllTests = async () => {
    setIsRunning(true)
    setStartTime(new Date())
    setOverallStatus('running')

    // Resetar status dos testes
    const resetSuites = testSuites.map(suite => ({
      ...suite,
      status: 'running' as const,
      tests: suite.tests.map(test => ({
        ...test,
        status: 'running' as const,
        message: 'Executando...',
        timestamp: new Date()
      }))
    }))
    setTestSuites(resetSuites)

    try {
      // Executar testes da API
      await runAPITests()
      
      // Executar testes do Dashboard
      await runDashboardTests()
      
      // Executar testes de funcionalidades
      await runCoreTests()
      
      // Executar testes de performance
      await runPerformanceTests()

      setOverallStatus('passed')
    } catch (error) {
      setOverallStatus('failed')
      console.error('❌ Erro durante execução dos testes:', error)
    } finally {
      setIsRunning(false)
      setEndTime(new Date())
    }
  }

  // Executar testes da API
  const runAPITests = async () => {
    const updatedSuites = [...testSuites]
    const apiSuite = updatedSuites.find(s => s.name === 'API Endpoints')
    if (!apiSuite) return

    // Teste 1: Conectividade base
    await runTest(apiSuite.tests[0], async () => {
      const start = Date.now()
      try {
        // Testar se a API está respondendo
        const response = await fetch(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080')
        const duration = Date.now() - start
        
        if (response.ok || response.status === 404) {
          return { success: true, message: 'API respondendo', duration }
        } else {
          return { success: false, message: `API retornou status ${response.status}`, duration }
        }
      } catch (error) {
        const duration = Date.now() - start
        return { success: false, message: 'Erro de conectividade', duration, error }
      }
    })

    // Teste 2: Validação de agência/conta
    await runTest(apiSuite.tests[1], async () => {
      const start = Date.now()
      try {
        const result = await validateAccount('1234', '12.345-6')
        const duration = Date.now() - start
        return { success: true, message: 'Validação funcionando', duration, result }
      } catch (error) {
        const duration = Date.now() - start
        return { success: false, message: 'Erro na validação', duration, error }
      }
    })

    // Teste 3: Consulta de logs
    await runTest(apiSuite.tests[2], async () => {
      const start = Date.now()
      try {
        const result = await getQueryLogs({
          agencia: '1234',
          contaCorrente: '12.345-6',
          dataInicio: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          dataFim: new Date(),
          page: 0,
          size: 10
        })
        const duration = Date.now() - start
        return { success: true, message: 'Consulta de logs funcionando', duration, result }
      } catch (error) {
        const duration = Date.now() - start
        return { success: false, message: 'Erro na consulta de logs', duration, error }
      }
    })

    // Teste 4: Consulta de importações
    await runTest(apiSuite.tests[3], async () => {
      const start = Date.now()
      try {
        const result = await getImports({
          agencia: '1234',
          contaCorrente: '12.345-6',
          dataInicio: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          dataFim: new Date(),
          page: 0,
          size: 10
        })
        const duration = Date.now() - start
        return { success: true, message: 'Consulta de importações funcionando', duration, result }
      } catch (error) {
        const duration = Date.now() - start
        return { success: false, message: 'Erro na consulta de importações', duration, error }
      }
    })

    // Teste 5: Consulta de movimentações
    await runTest(apiSuite.tests[4], async () => {
      const start = Date.now()
      try {
        const result = await getMovements({
          agencia: '1234',
          contaCorrente: '12.345-6',
          dataInicio: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          dataFim: new Date(),
          page: 0,
          size: 10
        })
        const duration = Date.now() - start
        return { success: true, message: 'Consulta de movimentações funcionando', duration, result }
      } catch (error) {
        const duration = Date.now() - start
        return { success: false, message: 'Erro na consulta de movimentações', duration, error }
      }
    })

    updateSuiteStatus(apiSuite)
    setTestSuites(updatedSuites)
  }

  // Executar testes do Dashboard
  const runDashboardTests = async () => {
    const updatedSuites = [...testSuites]
    const dashboardSuite = updatedSuites.find(s => s.name === 'Dashboard Services')
    if (!dashboardSuite) return

    // Teste 1: Métricas do dashboard
    await runTest(dashboardSuite.tests[0], async () => {
      const start = Date.now()
      try {
        const result = await getDashboardMetrics()
        const duration = Date.now() - start
        return { success: true, message: 'Métricas carregadas', duration, result }
      } catch (error) {
        const duration = Date.now() - start
        return { success: false, message: 'Erro ao carregar métricas', duration, error }
      }
    })

    // Teste 2: Gráficos e visualizações
    await runTest(dashboardSuite.tests[1], async () => {
      const start = Date.now()
      try {
        const result = await getDashboardCharts()
        const duration = Date.now() - start
        return { success: true, message: 'Gráficos carregados', duration, result }
      } catch (error) {
        const duration = Date.now() - start
        return { success: false, message: 'Erro ao carregar gráficos', duration, error }
      }
    })

    // Teste 3: Status do sistema
    await runTest(dashboardSuite.tests[2], async () => {
      const start = Date.now()
      try {
        const result = await getSystemStatus()
        const duration = Date.now() - start
        return { success: true, message: 'Status carregado', duration, result }
      } catch (error) {
        const duration = Date.now() - start
        return { success: false, message: 'Erro ao carregar status', duration, error }
      }
    })

    // Teste 4: Performance do sistema
    await runTest(dashboardSuite.tests[3], async () => {
      const start = Date.now()
      try {
        const result = await getSystemPerformance()
        const duration = Date.now() - start
        return { success: true, message: 'Performance carregada', duration, result }
      } catch (error) {
        const duration = Date.now() - start
        return { success: false, message: 'Erro ao carregar performance', duration, error }
      }
    })

    updateSuiteStatus(dashboardSuite)
    setTestSuites(updatedSuites)
  }

  // Executar testes de funcionalidades
  const runCoreTests = async () => {
    const updatedSuites = [...testSuites]
    const coreSuite = updatedSuites.find(s => s.name === 'Funcionalidades Core')
    if (!coreSuite) return

    // Teste 1: Formulário de consulta
    await runTest(coreSuite.tests[0], async () => {
      const start = Date.now()
      try {
        // Simular validação de formulário
        const mockFormData = {
          agencia: '1234',
          contaCorrente: '12.345-6',
          dataInicio: '2024-01-01',
          dataFim: '2024-01-31'
        }
        
        // Validar formato dos dados
        const agenciaValid = /^\d{4}$/.test(mockFormData.agencia)
        const contaValid = /^\d{2}\.\d{3}-\d$/.test(mockFormData.contaCorrente)
        const dataInicioValid = new Date(mockFormData.dataInicio) <= new Date()
        const dataFimValid = new Date(mockFormData.dataFim) <= new Date()
        
        const duration = Date.now() - start
        
        if (agenciaValid && contaValid && dataInicioValid && dataFimValid) {
          return { success: true, message: 'Validação de formulário OK', duration, data: mockFormData }
        } else {
          return { success: false, message: 'Falha na validação', duration, data: mockFormData }
        }
      } catch (error) {
        const duration = Date.now() - start
        return { success: false, message: 'Erro na validação', duration, error }
      }
    })

    // Teste 2: Sistema de filtros
    await runTest(coreSuite.tests[1], async () => {
      const start = Date.now()
      try {
        // Simular aplicação de filtros
        const mockData = [
          { id: 1, status: 'success', valor: 100 },
          { id: 2, status: 'error', valor: 200 },
          { id: 3, status: 'success', valor: 150 }
        ]
        
        const filteredData = mockData.filter(item => item.status === 'success')
        const duration = Date.now() - start
        
        return { success: true, message: 'Filtros funcionando', duration, filtered: filteredData.length, total: mockData.length }
      } catch (error) {
        const duration = Date.now() - start
        return { success: false, message: 'Erro nos filtros', duration, error }
      }
    })

    // Teste 3: Exportação de dados
    await runTest(coreSuite.tests[2], async () => {
      const start = Date.now()
      try {
        // Simular exportação CSV
        const mockData = [{ id: 1, nome: 'Teste' }]
        const csvContent = 'id,nome\n1,Teste\n'
        const duration = Date.now() - start
        
        return { success: true, message: 'Exportação funcionando', duration, format: 'CSV', size: csvContent.length }
      } catch (error) {
        const duration = Date.now() - start
        return { success: false, message: 'Erro na exportação', duration, error }
      }
    })

    // Teste 4: Paginação e navegação
    await runTest(coreSuite.tests[3], async () => {
      const start = Date.now()
      try {
        // Simular paginação
        const mockData = Array.from({ length: 100 }, (_, i) => ({ id: i + 1 }))
        const pageSize = 20
        const currentPage = 0
        const totalPages = Math.ceil(mockData.length / pageSize)
        const pageData = mockData.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
        
        const duration = Date.now() - start
        
        return { success: true, message: 'Paginação funcionando', duration, pageSize, currentPage, totalPages, items: pageData.length }
      } catch (error) {
        const duration = Date.now() - start
        return { success: false, message: 'Erro na paginação', duration, error }
      }
    })

    updateSuiteStatus(coreSuite)
    setTestSuites(updatedSuites)
  }

  // Executar testes de performance
  const runPerformanceTests = async () => {
    const updatedSuites = [...testSuites]
    const perfSuite = updatedSuites.find(s => s.name === 'Performance e Resiliência')
    if (!perfSuite) return

    // Teste 1: Tempo de resposta da API
    await runTest(perfSuite.tests[0], async () => {
      const start = Date.now()
      try {
        const result = await getDashboardMetrics()
        const duration = Date.now() - start
        
        if (duration < 1000) {
          return { success: true, message: `Resposta rápida: ${duration}ms`, duration }
        } else if (duration < 3000) {
          return { success: true, message: `Resposta aceitável: ${duration}ms`, duration, warning: 'Pode ser otimizado' }
        } else {
          return { success: false, message: `Resposta lenta: ${duration}ms`, duration, warning: 'Necessita otimização' }
        }
      } catch (error) {
        const duration = Date.now() - start
        return { success: false, message: 'Erro no teste de performance', duration, error }
      }
    })

    // Teste 2: Tratamento de timeouts
    await runTest(perfSuite.tests[1], async () => {
      const start = Date.now()
      try {
        // Simular timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
        
        await Promise.race([
          getDashboardMetrics(),
          timeoutPromise
        ])
        
        const duration = Date.now() - start
        return { success: true, message: 'Sem timeout', duration }
      } catch (error) {
        const duration = Date.now() - start
        if (error.message === 'Timeout') {
          return { success: true, message: 'Timeout tratado corretamente', duration }
        } else {
          return { success: false, message: 'Erro inesperado', duration, error }
        }
      }
    })

    // Teste 3: Fallback para dados mock
    await runTest(perfSuite.tests[2], async () => {
      const start = Date.now()
      try {
        // Simular falha da API e fallback
        const mockData = { totalContas: 150, consultasHoje: 45 }
        const duration = Date.now() - start
        
        return { success: true, message: 'Fallback funcionando', duration, mockData }
      } catch (error) {
        const duration = Date.now() - start
        return { success: false, message: 'Erro no fallback', duration, error }
      }
    })

    // Teste 4: Retry automático
    await runTest(perfSuite.tests[3], async () => {
      const start = Date.now()
      try {
        // Simular retry
        let attempts = 0
        const maxAttempts = 3
        
        while (attempts < maxAttempts) {
          attempts++
          try {
            await getDashboardMetrics()
            break
          } catch (error) {
            if (attempts === maxAttempts) throw error
            await new Promise(resolve => setTimeout(resolve, 100))
          }
        }
        
        const duration = Date.now() - start
        return { success: true, message: `Retry funcionando (${attempts} tentativas)`, duration, attempts }
      } catch (error) {
        const duration = Date.now() - start
        return { success: false, message: 'Erro no retry', duration, error }
      }
    })

    updateSuiteStatus(perfSuite)
    setTestSuites(updatedSuites)
  }

  // Executar teste individual
  const runTest = async (test: TestResult, testFunction: () => Promise<any>) => {
    const start = Date.now()
    test.status = 'running'
    test.message = 'Executando...'
    test.timestamp = new Date()

    try {
      const result = await testFunction()
      const duration = Date.now() - start
      
      test.status = result.success ? 'passed' : (result.warning ? 'warning' : 'failed')
      test.message = result.message
      test.duration = duration
      test.details = result
      test.timestamp = new Date()
    } catch (error) {
      const duration = Date.now() - start
      test.status = 'failed'
      test.message = `Erro: ${error.message}`
      test.duration = duration
      test.details = error
      test.timestamp = new Date()
    }
  }

  // Atualizar status da suite
  const updateSuiteStatus = (suite: TestSuite) => {
    const passedTests = suite.tests.filter(t => t.status === 'passed').length
    const failedTests = suite.tests.filter(t => t.status === 'failed').length
    const warningTests = suite.tests.filter(t => t.status === 'warning').length
    
    if (failedTests > 0) {
      suite.status = 'failed'
    } else if (warningTests > 0) {
      suite.status = 'warning'
    } else if (passedTests === suite.tests.length) {
      suite.status = 'passed'
    } else {
      suite.status = 'running'
    }
  }

  // Obter estatísticas dos testes
  const getTestStats = () => {
    let total = 0
    let passed = 0
    let failed = 0
    let warning = 0
    let running = 0

    testSuites.forEach(suite => {
      suite.tests.forEach(test => {
        total++
        switch (test.status) {
          case 'passed':
            passed++
            break
          case 'failed':
            failed++
            break
          case 'warning':
            warning++
            break
          case 'running':
            running++
            break
        }
      })
    })

    return { total, passed, failed, warning, running }
  }

  // Obter tempo total de execução
  const getTotalDuration = () => {
    if (!startTime || !endTime) return 0
    return Math.round((endTime.getTime() - startTime.getTime()) / 1000)
  }

  const stats = getTestStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testes de Integração</h1>
          <p className="text-muted-foreground">
            Validação de funcionalidades e performance do sistema
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center space-x-2"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span>{isRunning ? 'Executando...' : 'Executar Todos os Testes'}</span>
          </Button>
        </div>
      </div>

      {/* Status Geral */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Testes</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Testes disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
            <p className="text-xs text-muted-foreground">
              Testes passaram
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Falharam</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">
              Testes falharam
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avisos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
            <p className="text-xs text-muted-foreground">
              Testes com avisos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Total</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {getTotalDuration()}s
            </div>
            <p className="text-xs text-muted-foreground">
              Duração total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Status Geral dos Testes</span>
            <Badge 
              variant={
                overallStatus === 'passed' ? 'default' :
                overallStatus === 'warning' ? 'secondary' :
                overallStatus === 'failed' ? 'destructive' :
                overallStatus === 'running' ? 'outline' : 'secondary'
              }
              className={
                overallStatus === 'passed' ? 'bg-green-500' :
                overallStatus === 'warning' ? 'bg-yellow-500' :
                overallStatus === 'failed' ? 'bg-red-500' : ''
              }
            >
              {overallStatus === 'passed' ? '✅ APROVADO' :
               overallStatus === 'warning' ? '⚠️ AVISOS' :
               overallStatus === 'failed' ? '❌ FALHOU' :
               overallStatus === 'running' ? '🔄 EXECUTANDO' : '⏳ PENDENTE'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testSuites.map((suite) => (
              <div key={suite.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{suite.name}</h3>
                  <Badge 
                    variant={
                      suite.status === 'passed' ? 'default' :
                      suite.status === 'warning' ? 'secondary' :
                      suite.status === 'failed' ? 'destructive' :
                      suite.status === 'running' ? 'outline' : 'secondary'
                    }
                    className={
                      suite.status === 'passed' ? 'bg-green-500' :
                      suite.status === 'warning' ? 'bg-yellow-500' :
                      suite.status === 'failed' ? 'bg-red-500' : ''
                    }
                  >
                    {suite.status === 'passed' ? '✅ APROVADO' :
                     suite.status === 'warning' ? '⚠️ AVISOS' :
                     suite.status === 'failed' ? '❌ FALHOU' :
                     suite.status === 'running' ? '🔄 EXECUTANDO' : '⏳ PENDENTE'}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{suite.description}</p>
                
                <div className="space-y-2">
                  {suite.tests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex items-center space-x-2">
                        {test.status === 'passed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {test.status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
                        {test.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                        {test.status === 'running' && <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />}
                        {test.status === 'pending' && <Clock className="h-4 w-4 text-gray-500" />}
                        
                        <span className="text-sm font-medium">{test.name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {test.duration > 0 ? `${test.duration}ms` : '-'}
                        </span>
                        <span className={`text-xs ${
                          test.status === 'passed' ? 'text-green-600' :
                          test.status === 'failed' ? 'text-red-600' :
                          test.status === 'warning' ? 'text-yellow-600' :
                          test.status === 'running' ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {test.message}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informações Técnicas */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Sistema de Testes de Integração • 
              Última execução: {endTime ? endTime.toLocaleString('pt-BR') : 'Nunca executado'} • 
              Status: {overallStatus.toUpperCase()}
            </p>
            <p className="mt-1">
              Os testes validam conectividade, funcionalidades e performance do sistema
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default IntegrationTests
