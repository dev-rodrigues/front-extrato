/**
 * Hook customizado para schedule - Implementa APENAS funcionalidades documentadas nos RFCs
 * Baseado em RFC-API-Integration.md e RFC-Frontend-Interface.md
 */

import { useState, useEffect, useCallback } from 'react'
import { ScheduleService } from '@/services/scheduleService'
import type { 
  JobProgressSummaryResponse, 
  SystemStatsResponse, 
  HealthResponse,
  JobProgressResponse 
} from '@/types/rfc'

/**
 * Hook para monitoramento de schedule conforme RFCs
 * Funcionalidades implementadas:
 * - Busca progresso geral dos jobs
 * - Busca estatísticas do sistema
 * - Busca status de saúde
 * - Lista jobs ativos
 * - Cancelamento de jobs
 */
export function useSchedule() {
  const [progress, setProgress] = useState<JobProgressSummaryResponse | null>(null)
  const [stats, setStats] = useState<SystemStatsResponse | null>(null)
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [activeJobs, setActiveJobs] = useState<JobProgressResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Buscar progresso geral
  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ScheduleService.getProgress()
      setProgress(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar progresso')
    } finally {
      setLoading(false)
    }
  }, [])

  // Buscar estatísticas
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ScheduleService.getStats()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar estatísticas')
    } finally {
      setLoading(false)
    }
  }, [])

  // Buscar saúde do sistema
  const fetchHealth = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ScheduleService.getHealth()
      setHealth(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao verificar saúde')
    } finally {
      setLoading(false)
    }
  }, [])

  // Buscar jobs ativos
  const fetchActiveJobs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ScheduleService.getActiveJobs()
      setActiveJobs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar jobs ativos')
    } finally {
      setLoading(false)
    }
  }, [])

  // Cancelar job
  const cancelJob = useCallback(async (jobName: string) => {
    try {
      setLoading(true)
      setError(null)
      await ScheduleService.cancelJob(jobName)
      // Recarregar dados após cancelamento
      await Promise.all([fetchProgress(), fetchActiveJobs()])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar job')
    } finally {
      setLoading(false)
    }
  }, [fetchProgress, fetchActiveJobs])

  // Buscar todos os dados
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      await Promise.all([
        fetchProgress(),
        fetchStats(),
        fetchHealth(),
        fetchActiveJobs()
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }, [fetchProgress, fetchStats, fetchHealth, fetchActiveJobs])

  // Carregar dados iniciais
  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  return {
    // Dados
    progress,
    stats,
    health,
    activeJobs,
    
    // Estados
    loading,
    error,
    
    // Ações
    fetchProgress,
    fetchStats,
    fetchHealth,
    fetchActiveJobs,
    cancelJob,
    fetchAllData,
    
    // Utilitários
    refresh: fetchAllData
  }
}
