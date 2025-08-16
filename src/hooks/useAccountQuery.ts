import { useState, useEffect, useCallback } from 'react'
import { accountService } from '@/services/accountService'
import type { 
  AccountQueryRequest, 
  AccountQueryLogResponse, 
  PaginationResponse 
} from '@/types/api'

/**
 * Hook customizado para consulta de contas bancárias
 * Integra com o serviço de contas para operações de consulta
 */
export const useAccountQuery = (
  agencia: string,
  contaCorrente: string
) => {
  const [logs, setLogs] = useState<PaginationResponse<AccountQueryLogResponse> | null>(null)
  const [imports, setImports] = useState<PaginationResponse<any> | null>(null)
  const [movements, setMovements] = useState<PaginationResponse<any> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Consulta logs de consulta para uma conta
   */
  const fetchLogs = useCallback(async (request: Omit<AccountQueryRequest, 'agencia' | 'contaCorrente'>) => {
    if (!agencia || !contaCorrente) {
      setError('Agência e conta são obrigatórios')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await accountService.getQueryLogs(agencia, contaCorrente, request)
      setLogs(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao consultar logs da conta')
    } finally {
      setLoading(false)
    }
  }, [agencia, contaCorrente])

  /**
   * Consulta importações para uma conta
   */
  const fetchImports = useCallback(async (request: Omit<AccountQueryRequest, 'agencia' | 'contaCorrente'>) => {
    if (!agencia || !contaCorrente) {
      setError('Agência e conta são obrigatórios')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await accountService.getImports(agencia, contaCorrente, request)
      setImports(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao consultar importações da conta')
    } finally {
      setLoading(false)
    }
  }, [agencia, contaCorrente])

  /**
   * Consulta movimentações para uma conta
   */
  const fetchMovements = useCallback(async (request: Omit<AccountQueryRequest, 'agencia' | 'contaCorrente'>) => {
    if (!agencia || !contaCorrente) {
      setError('Agência e conta são obrigatórios')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await accountService.getMovements(agencia, contaCorrente, request)
      setMovements(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao consultar movimentações da conta')
    } finally {
      setLoading(false)
    }
  }, [agencia, contaCorrente])

  /**
   * Consulta resumo da conta
   */
  const fetchAccountSummary = useCallback(async () => {
    if (!agencia || !contaCorrente) {
      setError('Agência e conta são obrigatórios')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await accountService.getAccountSummary(agencia, contaCorrente)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao consultar resumo da conta')
      throw err
    } finally {
      setLoading(false)
    }
  }, [agencia, contaCorrente])

  /**
   * Consulta status da conta
   */
  const fetchAccountStatus = useCallback(async () => {
    if (!agencia || !contaCorrente) {
      setError('Agência e conta são obrigatórios')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await accountService.getAccountStatus(agencia, contaCorrente)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao consultar status da conta')
      throw err
    } finally {
      setLoading(false)
    }
  }, [agencia, contaCorrente])

  /**
   * Valida formato de agência e conta
   */
  const validateAccountFormat = useCallback(() => {
    return accountService.validateAccountFormat(agencia, contaCorrente)
  }, [agencia, contaCorrente])

  /**
   * Consulta dados completos da conta (logs, importações e movimentações)
   */
  const fetchAccountData = useCallback(async (request: Omit<AccountQueryRequest, 'agencia' | 'contaCorrente'>) => {
    if (!agencia || !contaCorrente) {
      setError('Agência e conta são obrigatórios')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const [logsResponse, importsResponse, movementsResponse] = await Promise.all([
        accountService.getQueryLogs(agencia, contaCorrente, request),
        accountService.getImports(agencia, contaCorrente, request),
        accountService.getMovements(agencia, contaCorrente, request)
      ])
      
      setLogs(logsResponse)
      setImports(importsResponse)
      setMovements(movementsResponse)
      
      return {
        logs: logsResponse,
        imports: importsResponse,
        movements: movementsResponse
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao consultar dados da conta')
      throw err
    } finally {
      setLoading(false)
    }
  }, [agencia, contaCorrente])

  /**
   * Limpa todos os dados
   */
  const clearData = useCallback(() => {
    setLogs(null)
    setImports(null)
    setMovements(null)
    setError(null)
  }, [])

  /**
   * Verifica se a conta é válida
   */
  const isValidAccount = useCallback(() => {
    return agencia && contaCorrente && validateAccountFormat()
  }, [agencia, contaCorrente, validateAccountFormat])

  return {
    // Estado
    logs,
    imports,
    movements,
    loading,
    error,
    
    // Ações
    fetchLogs,
    fetchImports,
    fetchMovements,
    fetchAccountSummary,
    fetchAccountStatus,
    fetchAccountData,
    clearData,
    
    // Validações
    validateAccountFormat,
    isValidAccount,
    
    // Utilitários
    hasData: Boolean(logs || imports || movements),
    hasLogs: Boolean(logs?.content?.length),
    hasImports: Boolean(imports?.content?.length),
    hasMovements: Boolean(movements?.content?.length),
    
    // Limpar erro
    clearError: () => setError(null)
  }
}
