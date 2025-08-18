/**
 * Hook customizado para schedule com React Query - Implementa APENAS funcionalidades documentadas nos RFCs
 * Baseado em RFC-API-Integration.md e RFC-Frontend-Interface.md
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ScheduleService } from '@/services/scheduleService'

/**
 * Hook para monitoramento de schedule com React Query conforme RFCs
 * Funcionalidades implementadas:
 * - Busca progresso geral dos jobs com atualizações automáticas
 * - Busca estatísticas do sistema com cache inteligente
 * - Busca status de saúde com refresh automático
 * - Lista jobs ativos com atualizações em tempo real
 * - Cancelamento de jobs com invalidação de cache
 */
export function useSchedule() {
  const queryClient = useQueryClient()

  // Query para progresso geral - atualiza a cada 15 segundos (otimizado de 30s)
  const progressQuery = useQuery({
    queryKey: ['schedule', 'progress'],
    queryFn: ScheduleService.getProgress,
    refetchInterval: 15000, // 15 segundos (otimizado)
    staleTime: 8000, // 8 segundos (otimizado)
  })

  // Query para estatísticas do sistema - atualiza a cada 30 segundos (otimizado de 60s)
  const statsQuery = useQuery({
    queryKey: ['schedule', 'stats'],
    queryFn: ScheduleService.getStats,
    refetchInterval: 30000, // 30 segundos (otimizado)
    staleTime: 15000, // 15 segundos (otimizado)
  })

  // Query para saúde do sistema - atualiza a cada 25 segundos (otimizado de 45s)
  const healthQuery = useQuery({
    queryKey: ['schedule', 'health'],
    queryFn: ScheduleService.getHealth,
    refetchInterval: 25000, // 25 segundos (otimizado)
    staleTime: 12000, // 12 segundos (otimizado)
  })

  // Query para jobs ativos - atualiza a cada 5 segundos (otimizado de 10s)
  const activeJobsQuery = useQuery({
    queryKey: ['schedule', 'activeJobs'],
    queryFn: ScheduleService.getActiveJobs,
    refetchInterval: 5000, // 5 segundos (otimizado)
    staleTime: 3000, // 3 segundos (otimizado)
  })

  // Mutation para cancelar job
  const cancelJobMutation = useMutation({
    mutationFn: ScheduleService.cancelJob,
    onSuccess: () => {
      // Invalida e refetch das queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['schedule', 'progress'] })
      queryClient.invalidateQueries({ queryKey: ['schedule', 'activeJobs'] })
      queryClient.invalidateQueries({ queryKey: ['schedule', 'stats'] })
    },
  })

  // Função para cancelar job
  const cancelJob = async (jobName: string) => {
    try {
      await cancelJobMutation.mutateAsync(jobName)
    } catch (error) {
      // Erro será tratado pelo componente que usa o hook
      throw error
    }
  }

  // Função para refresh manual de todos os dados
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['schedule'] })
  }

  // Estados consolidados
  const isLoading = progressQuery.isLoading || statsQuery.isLoading || healthQuery.isLoading || activeJobsQuery.isLoading
  const isRefetching = progressQuery.isRefetching || statsQuery.isRefetching || healthQuery.isRefetching || activeJobsQuery.isRefetching

  // Função para obter mensagem de erro mais relevante
  const getErrorMessage = (): string | null => {
    if (progressQuery.error) return progressQuery.error.message
    if (statsQuery.error) return statsQuery.error.message
    if (healthQuery.error) return healthQuery.error.message
    if (activeJobsQuery.error) return activeJobsQuery.error.message
    return null
  }

  return {
    // Dados das queries
    progress: progressQuery.data || null,
    stats: statsQuery.data || null,
    health: healthQuery.data || null,
    activeJobs: activeJobsQuery.data || [],
    
    // Estados consolidados
    loading: isLoading,
    refetching: isRefetching,
    error: getErrorMessage(),
    
    // Estados individuais para controle granular
    progressLoading: progressQuery.isLoading,
    statsLoading: statsQuery.isLoading,
    healthLoading: healthQuery.isLoading,
    activeJobsLoading: activeJobsQuery.isLoading,
    
    // Estados de refetch para indicadores visuais
    progressRefetching: progressQuery.isRefetching,
    statsRefetching: statsQuery.isRefetching,
    healthRefetching: healthQuery.isRefetching,
    activeJobsRefetching: activeJobsQuery.isRefetching,
    
    // Ações
    cancelJob,
    refresh,
    
    // Mutations para controle de estado
    cancelJobMutation,
    
    // Queries individuais para controle avançado
    progressQuery,
    statsQuery,
    healthQuery,
    activeJobsQuery,
  }
}
