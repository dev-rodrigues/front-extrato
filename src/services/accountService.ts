import api from './api'
import type {
  AccountQueryRequest,
  AccountQueryLogResponse,
  PaginationResponse,
  ApiResponse,
  ApiError
} from '@/types/api'

/**
 * Serviço para consulta de contas bancárias e logs
 * Integra com a API backend para operações de consulta
 */
class AccountService {
  private readonly baseUrl = '/api/accounts'

  /**
   * Consulta logs de consulta para uma conta específica
   */
  async getQueryLogs(
    agencia: string,
    contaCorrente: string,
    request: Omit<AccountQueryRequest, 'agencia' | 'contaCorrente'>
  ): Promise<PaginationResponse<AccountQueryLogResponse>> {
    try {
      const params = new URLSearchParams({
        dataInicio: request.dataInicio.toISOString(),
        dataFim: request.dataFim.toISOString(),
        page: request.page.toString(),
        size: request.size.toString()
      })

      const response = await api.get(
        `${this.baseUrl}/${agencia}/${contaCorrente}/logs?${params}`
      )

      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao consultar logs da conta')
    }
  }

  /**
   * Consulta importações realizadas para uma conta
   */
  async getImports(
    agencia: string,
    contaCorrente: string,
    request: Omit<AccountQueryRequest, 'agencia' | 'contaCorrente'>
  ): Promise<PaginationResponse<any>> {
    try {
      const params = new URLSearchParams({
        dataInicio: request.dataInicio.toISOString(),
        dataFim: request.dataFim.toISOString(),
        page: request.page.toString(),
        size: request.size.toString()
      })

      const response = await api.get(
        `${this.baseUrl}/${agencia}/${contaCorrente}/imports?${params}`
      )

      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao consultar importações da conta')
    }
  }

  /**
   * Consulta movimentações de uma conta
   */
  async getMovements(
    agencia: string,
    contaCorrente: string,
    request: Omit<AccountQueryRequest, 'agencia' | 'contaCorrente'>
  ): Promise<PaginationResponse<any>> {
    try {
      const params = new URLSearchParams({
        dataInicio: request.dataInicio.toISOString(),
        dataFim: request.dataFim.toISOString(),
        page: request.page.toString(),
        size: request.size.toString()
      })

      const response = await api.get(
        `${this.baseUrl}/${agencia}/${contaCorrente}/movements?${params}`
      )

      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao consultar movimentações da conta')
    }
  }

  /**
   * Consulta resumo de uma conta
   */
  async getAccountSummary(agencia: string, contaCorrente: string): Promise<any> {
    try {
      const response = await api.get(
        `${this.baseUrl}/${agencia}/${contaCorrente}/summary`
      )

      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao consultar resumo da conta')
    }
  }

  /**
   * Consulta status de uma conta
   */
  async getAccountStatus(agencia: string, contaCorrente: string): Promise<any> {
    try {
      const response = await api.get(
        `${this.baseUrl}/${agencia}/${contaCorrente}/status`
      )

      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao consultar status da conta')
    }
  }

  /**
   * Valida formato de agência e conta
   */
  validateAccountFormat(agencia: string, contaCorrente: string): boolean {
    const agenciaRegex = /^\d{4}$/
    const contaRegex = /^\d{2}\.\d{3}-\d$/

    return agenciaRegex.test(agencia) && contaRegex.test(contaCorrente)
  }

  /**
   * Formata dados para envio à API
   */
  formatRequestData(request: AccountQueryRequest): any {
    return {
      ...request,
      dataInicio: request.dataInicio.toISOString().split('T')[0],
      dataFim: request.dataFim.toISOString().split('T')[0]
    }
  }

  /**
   * Tratamento padronizado de erros
   */
  private handleError(error: any, defaultMessage: string): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message)
    }
    
    if (error.message) {
      return new Error(error.message)
    }
    
    return new Error(defaultMessage)
  }
}

export const accountService = new AccountService()
export default accountService
