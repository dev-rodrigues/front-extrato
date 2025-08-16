import { useState, useEffect, useCallback, useRef } from 'react'
import type { RealTimeUpdate, DashboardMetrics, ScheduleJobStatus } from '@/types/api'

/**
 * Hook customizado para gerenciar dados em tempo real
 * Fornece funcionalidades para atualizações automáticas e websockets
 */
export const useRealTimeData = <T>(
  fetchFunction: () => Promise<T>,
  interval: number = 30000, // 30 segundos padrão
  enabled: boolean = true
) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  /**
   * Função para buscar dados
   */
  const fetchData = useCallback(async (signal?: AbortSignal) => {
    if (!enabled) return
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await fetchFunction()
      
      // Verifica se a requisição foi cancelada
      if (signal?.aborted) return
      
      setData(result)
      setLastUpdate(new Date())
    } catch (err) {
      // Ignora erros de requisição cancelada
      if (err instanceof Error && err.name === 'AbortError') return
      
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }, [fetchFunction, enabled])

  /**
   * Inicia atualizações automáticas
   */
  const startAutoUpdate = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    if (enabled && interval > 0) {
      intervalRef.current = setInterval(() => {
        fetchData()
      }, interval)
    }
  }, [fetchData, enabled, interval])

  /**
   * Para atualizações automáticas
   */
  const stopAutoUpdate = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  /**
   * Atualiza dados manualmente
   */
  const refresh = useCallback(async () => {
    // Cancela requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Cria novo controller para esta requisição
    abortControllerRef.current = new AbortController()
    
    await fetchData(abortControllerRef.current.signal)
  }, [fetchData])

  /**
   * Atualiza dados com nova função
   */
  const updateData = useCallback((newData: T) => {
    setData(newData)
    setLastUpdate(new Date())
  }, [])

  /**
   * Simula atualização em tempo real (para desenvolvimento)
   */
  const simulateRealTimeUpdate = useCallback((update: RealTimeUpdate) => {
    if (update.type === 'METRICS' && data) {
      // Atualiza métricas com novos dados
      setData(prev => ({
        ...prev,
        ...update.data
      } as T))
      setLastUpdate(new Date())
    }
  }, [data])

  /**
   * Configura intervalo de atualização
   */
  const setUpdateInterval = useCallback((newInterval: number) => {
    if (newInterval !== interval) {
      stopAutoUpdate()
      startAutoUpdate()
    }
  }, [interval, stopAutoUpdate, startAutoUpdate])

  /**
   * Inicializa hook
   */
  useEffect(() => {
    if (enabled) {
      fetchData()
      startAutoUpdate()
    }
    
    return () => {
      stopAutoUpdate()
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [enabled, fetchData, startAutoUpdate, stopAutoUpdate])

  /**
   * Limpa recursos ao desmontar
   */
  useEffect(() => {
    return () => {
      stopAutoUpdate()
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [stopAutoUpdate])

  return {
    // Estado
    data,
    loading,
    error,
    lastUpdate,
    
    // Ações
    refresh,
    updateData,
    simulateRealTimeUpdate,
    setUpdateInterval,
    
    // Controles
    startAutoUpdate,
    stopAutoUpdate,
    
    // Utilitários
    isStale: lastUpdate ? Date.now() - lastUpdate.getTime() > interval : true,
    timeSinceLastUpdate: lastUpdate ? Date.now() - lastUpdate.getTime() : null,
    
    // Limpar erro
    clearError: () => setError(null)
  }
}

/**
 * Hook específico para métricas do dashboard
 */
export const useDashboardMetrics = (interval: number = 30000) => {
  const fetchMetrics = useCallback(async () => {
    // Simula chamada à API - substituir por chamada real
    const response = await fetch('/api/dashboard/metrics')
    if (!response.ok) {
      throw new Error('Erro ao carregar métricas')
    }
    return response.json()
  }, [])

  return useRealTimeData(fetchMetrics, interval)
}

/**
 * Hook específico para status de jobs agendados
 */
export const useScheduleJobs = (interval: number = 10000) => {
  const fetchJobs = useCallback(async () => {
    // Simula chamada à API - substituir por chamada real
    const response = await fetch('/api/schedule/jobs')
    if (!response.ok) {
      throw new Error('Erro ao carregar status dos jobs')
    }
    return response.json()
  }, [])

  return useRealTimeData(fetchJobs, interval)
}

/**
 * Hook para websocket em tempo real (preparado para implementação futura)
 */
export const useWebSocket = <T>(
  url: string,
  enabled: boolean = true
) => {
  const [data, setData] = useState<T | null>(null)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const connect = useCallback(() => {
    if (!enabled || wsRef.current?.readyState === WebSocket.OPEN) return

    try {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        setConnected(true)
        setError(null)
      }

      ws.onmessage = (event) => {
        try {
          const update: RealTimeUpdate = JSON.parse(event.data)
          setData(update.data as T)
        } catch (err) {
          console.error('Erro ao processar mensagem WebSocket:', err)
        }
      }

      ws.onclose = () => {
        setConnected(false)
        setData(null)
      }

      ws.onerror = (event) => {
        setError('Erro na conexão WebSocket')
        setConnected(false)
      }
    } catch (err) {
      setError('Erro ao conectar WebSocket')
    }
  }, [url, enabled])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setConnected(false)
    setData(null)
  }, [])

  const send = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }, [])

  useEffect(() => {
    if (enabled) {
      connect()
    } else {
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [enabled, connect, disconnect])

  return {
    data,
    connected,
    error,
    connect,
    disconnect,
    send
  }
}
