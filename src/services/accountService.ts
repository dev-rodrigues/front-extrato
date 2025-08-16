/**
 * AccountService - Implementa APENAS endpoints documentados nos RFCs
 * Baseado em RFC-API-Integration.md - Consulta de Contas Bancárias
 */

import type {
  PaginationResponse,
  AccountQueryLogResponse,
  AccountImportResponse,
  AccountMovementResponse,
  AccountQueryParams
} from '@/types/rfc'

import api from './api'

const API_BASE = '/api/accounts'

/**
 * Serviço para consulta de contas bancárias conforme RFCs
 * Endpoints implementados:
 * - GET /api/accounts/{agencia}/{contaCorrente}/query-logs
 * - GET /api/accounts/{agencia}/{contaCorrente}/imports
 * - GET /api/accounts/{agencia}/{contaCorrente}/movements
 */
export class AccountService {
  
  /**
   * Busca logs de consulta para uma conta específica
   * Endpoint: GET /api/accounts/{agencia}/{contaCorrente}/query-logs
   */
  static async getQueryLogs(
    agencia: string, 
    contaCorrente: string, 
    params: AccountQueryParams
  ): Promise<PaginationResponse<AccountQueryLogResponse>> {
    const queryParams = new URLSearchParams()
    
    // Adicionar parâmetros de período
    if (params.mes && params.ano) {
      queryParams.append('mes', params.mes.toString())
      queryParams.append('ano', params.ano.toString())
    } else if (params.dataInicio && params.dataFim) {
      queryParams.append('dataInicio', params.dataInicio)
      queryParams.append('dataFim', params.dataFim)
    }
    
    // Adicionar parâmetros de paginação
    if (params.page !== undefined) queryParams.append('page', params.page.toString())
    if (params.size !== undefined) queryParams.append('size', params.size.toString())
    
    const response = await api.get(
      `${API_BASE}/${agencia}/${contaCorrente}/query-logs?${queryParams.toString()}`
    )
    return response.data
  }

  /**
   * Busca histórico de importações para uma conta específica
   * Endpoint: GET /api/accounts/{agencia}/{contaCorrente}/imports
   */
  static async getImports(
    agencia: string, 
    contaCorrente: string, 
    params: AccountQueryParams
  ): Promise<PaginationResponse<AccountImportResponse>> {
    const queryParams = new URLSearchParams()
    
    // Adicionar parâmetros de período
    if (params.mes && params.ano) {
      queryParams.append('mes', params.mes.toString())
      queryParams.append('ano', params.ano.toString())
    } else if (params.dataInicio && params.dataFim) {
      queryParams.append('dataInicio', params.dataInicio)
      queryParams.append('dataFim', params.dataFim)
    }
    
    // Adicionar parâmetros de paginação
    if (params.page !== undefined) queryParams.append('page', params.page.toString())
    if (params.size !== undefined) queryParams.append('size', params.size.toString())
    
    const response = await api.get(
      `${API_BASE}/${agencia}/${contaCorrente}/imports?${queryParams.toString()}`
    )
    return response.data
  }

  /**
   * Busca movimentações bancárias para uma conta específica
   * Endpoint: GET /api/accounts/{agencia}/{contaCorrente}/movements
   */
  static async getMovements(
    agencia: string, 
    contaCorrente: string, 
    params: AccountQueryParams
  ): Promise<PaginationResponse<AccountMovementResponse>> {
    const queryParams = new URLSearchParams()
    
    // Adicionar parâmetros de período
    if (params.mes && params.ano) {
      queryParams.append('mes', params.mes.toString())
      queryParams.append('ano', params.ano.toString())
    } else if (params.dataInicio && params.dataFim) {
      queryParams.append('dataInicio', params.dataInicio)
      queryParams.append('dataFim', params.dataFim)
    }
    
    // Adicionar parâmetros de paginação
    if (params.page !== undefined) queryParams.append('page', params.page.toString())
    if (params.size !== undefined) queryParams.append('size', params.size.toString())
    
    const response = await api.get(
      `${API_BASE}/${agencia}/${contaCorrente}/movements?${queryParams.toString()}`
    )
    return response.data
  }
}
