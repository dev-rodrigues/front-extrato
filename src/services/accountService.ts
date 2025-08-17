/**
 * AccountService - Implementa APENAS endpoints documentados nos RFCs
 * Baseado em RFC-API-Integration.md - Consulta de Contas Bancárias
 */

import type {
  PaginationResponse,
  AccountQueryLogResponse,
  AccountImportResponse,
  AccountMovementResponse,
  AccountQueryParams,
  ImportWithMovementsResponse
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

  /**
   * Busca movimentações bancárias de uma importação específica
   * Endpoint: GET /api/accounts/imports/{importId}
   */
  static async getMovementsByImport(
    agencia: string, 
    contaCorrente: string, 
    importId: string | number, 
    page: number = 0, 
    size: number = 20
  ): Promise<ImportWithMovementsResponse> {
    const queryParams = new URLSearchParams()
    
    // Adicionar parâmetros de paginação
    queryParams.append('page', page.toString())
    queryParams.append('size', size.toString())
    
    const url = `/api/accounts/imports/${importId}?${queryParams.toString()}`
    
    console.log('🌐 Chamando endpoint:', {
      method: 'GET',
      url,
      agencia,
      contaCorrente,
      importId,
      page,
      size
    })
    
    try {
      const response = await api.get(url)
      
      console.log('✅ Resposta do endpoint getMovementsByImport:', {
        status: response.status,
        statusText: response.statusText,
        dataKeys: Object.keys(response.data || {}),
        importacao: response.data?.importacao,
        totalMovimentacoes: response.data?.totalMovimentacoes,
        movimentacoesLength: response.data?.movimentacoes?.content?.length || 0
      })
      
      return response.data
    } catch (error) {
      console.error('❌ Erro no endpoint getMovementsByImport:', {
        url,
        error: error instanceof Error ? error.message : error,
        agencia,
        contaCorrente,
        importId
      })
      throw error
    }
  }
}
