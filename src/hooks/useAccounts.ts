/**
 * Hook customizado para contas - Implementa APENAS funcionalidades documentadas nos RFCs
 * Baseado em RFC-API-Integration.md e RFC-Frontend-Interface.md
 */

import { useState, useCallback } from 'react'
import { AccountService } from '@/services/accountService'
import type { 
  PaginationResponse,
  AccountQueryLogResponse,
  AccountImportResponse,
  AccountMovementResponse,
  AccountQueryParams
} from '@/types/rfc'

/**
 * Hook para consulta de contas bancárias conforme RFCs
 * Funcionalidades implementadas:
 * - Busca logs de consulta
 * - Busca histórico de importações
 * - Busca movimentações bancárias
 * - Paginação e filtros de período
 */
export function useAccounts() {
  const [queryLogs, setQueryLogs] = useState<PaginationResponse<AccountQueryLogResponse> | null>(null)
  const [imports, setImports] = useState<PaginationResponse<AccountImportResponse> | null>(null)
  const [movements, setMovements] = useState<PaginationResponse<AccountMovementResponse> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Buscar logs de consulta
  const fetchQueryLogs = useCallback(async (
    agencia: string, 
    contaCorrente: string, 
    params: AccountQueryParams
  ) => {
    try {
      setLoading(true)
      setError(null)
      const data = await AccountService.getQueryLogs(agencia, contaCorrente, params)
      setQueryLogs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar logs de consulta')
    } finally {
      setLoading(false)
    }
  }, [])

  // Buscar importações
  const fetchImports = useCallback(async (
    agencia: string, 
    contaCorrente: string, 
    params: AccountQueryParams
  ) => {
    try {
      setLoading(true)
      setError(null)
      const data = await AccountService.getImports(agencia, contaCorrente, params)
      setImports(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar importações')
    } finally {
      setLoading(false)
    }
  }, [])

  // Buscar movimentações
  const fetchMovements = useCallback(async (
    agencia: string, 
    contaCorrente: string, 
    params: AccountQueryParams
  ) => {
    try {
      setLoading(true)
      setError(null)
      const data = await AccountService.getMovements(agencia, contaCorrente, params)
      setMovements(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar movimentações')
    } finally {
      setLoading(false)
    }
  }, [])

  // Limpar dados
  const clearData = useCallback(() => {
    setQueryLogs(null)
    setImports(null)
    setMovements(null)
    setError(null)
  }, [])

  return {
    // Dados
    queryLogs,
    imports,
    movements,
    
    // Estados
    loading,
    error,
    
    // Ações
    fetchQueryLogs,
    fetchImports,
    fetchMovements,
    clearData,
    
    // Utilitários
    hasData: !!(queryLogs || imports || movements)
  }
}
