import { useState, useCallback } from 'react'

interface AccountQueryRequest {
  agencia: string
  contaCorrente: string
  dataInicio: string
  dataFim: string
}

interface AccountQueryResponse {
  success: boolean
  data?: any
  error?: string
  timestamp: string
}

export const useAccountQuery = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastQuery, setLastQuery] = useState<AccountQueryRequest | null>(null)
  const [queryHistory, setQueryHistory] = useState<AccountQueryResponse[]>([])

  const executeQuery = useCallback(async (request: AccountQueryRequest): Promise<AccountQueryResponse> => {
    setIsLoading(true)
    setError(null)
    setLastQuery(request)

    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simular resposta de sucesso
      const response: AccountQueryResponse = {
        success: true,
        data: {
          agencia: request.agencia,
          contaCorrente: request.contaCorrente,
          periodo: `${request.dataInicio} - ${request.dataFim}`,
          consultadoEm: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      }

      // Adicionar ao histórico
      setQueryHistory(prev => [response, ...prev.slice(0, 9)]) // Manter apenas os últimos 10
      
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido na consulta'
      setError(errorMessage)
      
      const errorResponse: AccountQueryResponse = {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      }
      
      setQueryHistory(prev => [errorResponse, ...prev.slice(0, 9)])
      return errorResponse
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const clearHistory = useCallback(() => {
    setQueryHistory([])
  }, [])

  const getQueryStats = useCallback(() => {
    const total = queryHistory.length
    const successful = queryHistory.filter(q => q.success).length
    const failed = total - successful
    
    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0
    }
  }, [queryHistory])

  return {
    // Estado
    isLoading,
    error,
    lastQuery,
    queryHistory,
    
    // Ações
    executeQuery,
    clearError,
    clearHistory,
    
    // Estatísticas
    getQueryStats
  }
}
