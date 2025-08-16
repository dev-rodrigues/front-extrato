import api from './api'
import type {
  AccountImportResponse,
  PaginationResponse,
  AdvancedFilters,
  ExportRequest
} from '@/types/api'

/**
 * Serviço para gerenciamento de importações de extratos bancários
 * Integra com a API backend para operações de importação
 */
class ImportService {
  private readonly baseUrl = '/api/imports'

  /**
   * Lista todas as importações com paginação
   */
  async getImports(
    page: number = 0,
    size: number = 20,
    filters?: AdvancedFilters
  ): Promise<PaginationResponse<AccountImportResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      })

      if (filters) {
        if (filters.agencias) {
          filters.agencias.forEach(agencia => 
            params.append('agencias', agencia)
          )
        }
        if (filters.contas) {
          filters.contas.forEach(conta => 
            params.append('contas', conta)
          )
        }
        if (filters.dataInicio) {
          params.append('dataInicio', filters.dataInicio.toISOString())
        }
        if (filters.dataFim) {
          params.append('dataFim', filters.dataFim.toISOString())
        }
        if (filters.status) {
          filters.status.forEach(status => 
            params.append('status', status)
          )
        }
      }

      const response = await api.get(`${this.baseUrl}?${params}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao listar importações')
    }
  }

  /**
   * Obtém detalhes de uma importação específica
   */
  async getImportById(id: string): Promise<AccountImportResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar detalhes da importação')
    }
  }

  /**
   * Inicia uma nova importação manual
   */
  async startManualImport(
    agencia: string,
    contaCorrente: string,
    dataInicio: Date,
    dataFim: Date
  ): Promise<AccountImportResponse> {
    try {
      const response = await api.post(`${this.baseUrl}/manual`, {
        agencia,
        contaCorrente,
        dataInicio: dataInicio.toISOString(),
        dataFim: dataFim.toISOString()
      })
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao iniciar importação manual')
    }
  }

  /**
   * Cancela uma importação em andamento
   */
  async cancelImport(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`)
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao cancelar importação')
    }
  }

  /**
   * Reprocessa uma importação falhada
   */
  async reprocessImport(id: string): Promise<AccountImportResponse> {
    try {
      const response = await api.post(`${this.baseUrl}/${id}/reprocess`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao reprocessar importação')
    }
  }

  /**
   * Obtém estatísticas de importações
   */
  async getImportStats(
    dataInicio?: Date,
    dataFim?: Date
  ): Promise<{
    total: number
    sucesso: number
    erro: number
    processando: number
    mediaRegistros: number
    mediaContas: number
  }> {
    try {
      const params = new URLSearchParams()
      if (dataInicio) {
        params.append('dataInicio', dataInicio.toISOString())
      }
      if (dataFim) {
        params.append('dataFim', dataFim.toISOString())
      }

      const response = await api.get(`${this.baseUrl}/stats?${params}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar estatísticas de importações')
    }
  }

  /**
   * Exporta lista de importações
   */
  async exportImports(request: ExportRequest): Promise<{ url: string }> {
    try {
      const response = await api.post(`${this.baseUrl}/export`, request)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao exportar importações')
    }
  }

  /**
   * Busca importações por texto
   */
  async searchImports(
    query: string,
    page: number = 0,
    size: number = 20
  ): Promise<PaginationResponse<AccountImportResponse>> {
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        size: size.toString()
      })

      const response = await api.get(`${this.baseUrl}/search?${params}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar importações')
    }
  }

  /**
   * Obtém importações por agência
   */
  async getImportsByAgency(
    agencia: string,
    page: number = 0,
    size: number = 20
  ): Promise<PaginationResponse<AccountImportResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      })

      const response = await api.get(`${this.baseUrl}/agency/${agencia}?${params}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar importações da agência')
    }
  }

  /**
   * Obtém importações por conta
   */
  async getImportsByAccount(
    agencia: string,
    contaCorrente: string,
    page: number = 0,
    size: number = 20
  ): Promise<PaginationResponse<AccountImportResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      })

      const response = await api.get(
        `${this.baseUrl}/account/${agencia}/${contaCorrente}?${params}`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar importações da conta')
    }
  }

  /**
   * Obtém histórico de importações por período
   */
  async getImportHistory(
    dataInicio: Date,
    dataFim: Date,
    page: number = 0,
    size: number = 20
  ): Promise<PaginationResponse<AccountImportResponse>> {
    try {
      const params = new URLSearchParams({
        dataInicio: dataInicio.toISOString(),
        dataFim: dataFim.toISOString(),
        page: page.toString(),
        size: size.toString()
      })

      const response = await api.get(`${this.baseUrl}/history?${params}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar histórico de importações')
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

export const importService = new ImportService()
export default importService
