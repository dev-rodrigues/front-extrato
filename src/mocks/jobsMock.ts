import { useState } from 'react'

/**
 * Mock para simular jobs ativos da aplicação
 * Usado para testar o comportamento dos cards e loading de refetch
 */

export interface MockJob {
  jobName: string
  status: 'RUNNING' | 'STARTING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  statusDescription: string
  progressPercentage: number
  startTime: string
  recordsProcessed: number
  accountsProcessed: number
  estimatedTimeRemaining?: number
}

/**
 * Jobs mockados para simulação
 */
export const mockJobs: MockJob[] = [
  {
    jobName: 'Extrato_Contas_2024_01',
    status: 'RUNNING',
    statusDescription: 'Em Execução',
    progressPercentage: 65,
    startTime: '2024-01-15T10:30:00Z',
    recordsProcessed: 12500,
    accountsProcessed: 850,
    estimatedTimeRemaining: 1800000 // 30 minutos em ms
  },
  {
    jobName: 'Processamento_Lotes_2024_01',
    status: 'STARTING',
    statusDescription: 'Iniciando',
    progressPercentage: 15,
    startTime: '2024-01-15T11:00:00Z',
    recordsProcessed: 2500,
    accountsProcessed: 150,
    estimatedTimeRemaining: 3600000 // 1 hora em ms
  },
  {
    jobName: 'Sincronizacao_Dados_2024_01',
    status: 'RUNNING',
    statusDescription: 'Em Execução',
    progressPercentage: 42,
    startTime: '2024-01-15T09:15:00Z',
    recordsProcessed: 8900,
    accountsProcessed: 620,
    estimatedTimeRemaining: 2700000 // 45 minutos em ms
  },
  {
    jobName: 'Sincronizacao_Dados_2024_01',
    status: 'COMPLETED',
    statusDescription: 'Em Execução',
    progressPercentage: 42,
    startTime: '2024-01-15T09:15:00Z',
    recordsProcessed: 8900,
    accountsProcessed: 620,
    estimatedTimeRemaining: 2700000 // 45 minutos em ms
  }
]

/**
 * Simula o estado de loading/refetching
 */
export const mockRefetchState = {
  isLoading: false,
  isRefetching: false,
  error: null
}

/**
 * Função para simular delay de refetch
 */
export const simulateRefetch = (delay: number = 2000): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}

/**
 * Função para simular atualização de progresso
 */
export const simulateProgressUpdate = (job: MockJob): MockJob => {
  if (job.status === 'RUNNING' && job.progressPercentage < 100) {
    const increment = Math.random() * 5 + 1 // Incremento aleatório entre 1-6%
    return {
      ...job,
      progressPercentage: Math.min(100, job.progressPercentage + increment),
      recordsProcessed: job.recordsProcessed + Math.floor(Math.random() * 100) + 10,
      accountsProcessed: job.accountsProcessed + Math.floor(Math.random() * 10) + 1
    }
  }
  return job
}

/**
 * Hook mock para simular useSchedule
 */
export const useMockSchedule = () => {
  const [jobs, setJobs] = useState<MockJob[]>(mockJobs)
  const [isRefetching, setIsRefetching] = useState(false)

  const refetchJobs = async () => {
    setIsRefetching(true)
    await simulateRefetch(1500) // Simula delay de 1.5s
    
    // Simula atualização dos dados
    setJobs(prevJobs => prevJobs.map(job => simulateProgressUpdate(job)))
    
    setIsRefetching(false)
  }

  const startAutoRefetch = () => {
    const interval = setInterval(() => {
      refetchJobs()
    }, 10000) // Refetch a cada 10 segundos

    return () => clearInterval(interval)
  }

  return {
    jobs,
    isRefetching,
    isLoading: false, // Valor fixo para simplicidade
    refetchJobs,
    startAutoRefetch
  }
}
