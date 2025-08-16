import api from './api'
import type {
  AccountMovementResponse,
  PaginationResponse,
  AdvancedFilters,
  ExportRequest
} from '@/types/api'

/**
 * Serviço para gerenciamento de movimentações bancárias
 * Integra com a API backend para operações de movimentações
 */
class MovementService {
  private readonly baseUrl = '/api/movements'

  /**
   * Lista todas as movimentações com paginação
   */
  async getMovements(
    page: number = 0,
    size: number = 20,
    filters?: AdvancedFilters
  ): Promise<PaginationResponse<AccountMovementResponse>> {
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
        if (filters.tiposMovimento) {
          filters.tiposMovimento.forEach(tipo => 
            params.append('tiposMovimento', tipo)
          )
        }
        if (filters.valorMin !== undefined) {
          params.append('valorMin', filters.valorMin.toString())
        }
        if (filters.valorMax !== undefined) {
          params.append('valorMax', filters.valorMax.toString())
        }
        if (filters.dataInicio) {
          params.append('dataInicio', filters.dataInicio.toISOString())
        }
        if (filters.dataFim) {
          params.append('dataFim', filters.dataFim.toISOString())
        }
      }

      const response = await api.get(`${this.baseUrl}?${params}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao listar movimentações')
    }
  }

  /**
   * Obtém detalhes de uma movimentação específica
   */
  async getMovementById(id: string): Promise<AccountMovementResponse> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar detalhes da movimentação')
    }
  }

  /**
   * Obtém movimentações por agência
   */
  async getMovementsByAgency(
    agencia: string,
    page: number = 0,
    size: number = 20,
    filters?: Omit<AdvancedFilters, 'agencias'>
  ): Promise<PaginationResponse<AccountMovementResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      })

      if (filters) {
        this.applyFiltersToParams(filters, params)
      }

      const response = await api.get(`${this.baseUrl}/agency/${agencia}?${params}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar movimentações da agência')
    }
  }

  /**
   * Obtém movimentações por conta
   */
  async getMovementsByAccount(
    agencia: string,
    contaCorrente: string,
    page: number = 0,
    size: number = 20,
    filters?: Omit<AdvancedFilters, 'agencias' | 'contas'>
  ): Promise<PaginationResponse<AccountMovementResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      })

      if (filters) {
        this.applyFiltersToParams(filters, params)
      }

      const response = await api.get(
        `${this.baseUrl}/account/${agencia}/${contaCorrente}?${params}`
      )
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar movimentações da conta')
    }
  }

  /**
   * Obtém movimentações por período
   */
  async getMovementsByPeriod(
    dataInicio: Date,
    dataFim: Date,
    page: number = 0,
    size: number = 20,
    filters?: Omit<AdvancedFilters, 'dataInicio' | 'dataFim'>
  ): Promise<PaginationResponse<AccountMovementResponse>> {
    try {
      const params = new URLSearchParams({
        dataInicio: dataInicio.toISOString(),
        dataFim: dataFim.toISOString(),
        page: page.toString(),
        size: size.toString()
      })

      if (filters) {
        this.applyFiltersToParams(filters, params)
      }

      const response = await api.get(`${this.baseUrl}/period?${params}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar movimentações por período')
    }
  }

  /**
   * Obtém movimentações por tipo
   */
  async getMovementsByType(
    tipo: string,
    page: number = 0,
    size: number = 20,
    filters?: Omit<AdvancedFilters, 'tiposMovimento'>
  ): Promise<PaginationResponse<AccountMovementResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString()
      })

      if (filters) {
        this.applyFiltersToParams(filters, params)
      }

      const response = await api.get(`${this.baseUrl}/type/${tipo}?${params}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar movimentações por tipo')
    }
  }

  /**
   * Obtém estatísticas de movimentações
   */
  async getMovementStats(
    dataInicio?: Date,
    dataFim?: Date,
    agencia?: string,
    contaCorrente?: string
  ): Promise<{
    total: number
    totalValor: number
    mediaValor: number
    maiorValor: number
    menorValor: number
    tiposMovimento: Record<string, number>
    agencias: Record<string, number>
  }> {
    try {
      const params = new URLSearchParams()
      if (dataInicio) {
        params.append('dataInicio', dataInicio.toISOString())
      }
      if (dataFim) {
        params.append('dataFim', dataFim.toISOString())
      }
      if (agencia) {
        params.append('agencia', agencia)
      }
      if (contaCorrente) {
        params.append('contaCorrente', contaCorrente)
      }

      const response = await api.get(`${this.baseUrl}/stats?${params}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar estatísticas de movimentações')
    }
  }

  /**
   * Obtém fluxo de caixa por período
   */
  async getCashFlow(
    dataInicio: Date,
    dataFim: Date,
    agencia?: string,
    contaCorrente?: string
  ): Promise<{
    data: string
    entradas: number
    saidas: number
    saldo: number
  }[]> {
    try {
      const params = new URLSearchParams({
        dataInicio: dataInicio.toISOString(),
        dataFim: dataFim.toISOString()
      })

      if (agencia) {
        params.append('agencia', agencia)
      }
      if (contaCorrente) {
        params.append('contaCorrente', contaCorrente)
      }

      const response = await api.get(`${this.baseUrl}/cashflow?${params}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar fluxo de caixa')
    }
  }

  /**
   * Exporta movimentações
   */
  async exportMovements(request: ExportRequest): Promise<{ url: string }> {
    try {
      const response = await api.post(`${this.baseUrl}/export`, request)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao exportar movimentações')
    }
  }

  /**
   * Busca movimentações por texto
   */
  async searchMovements(
    query: string,
    page: number = 0,
    size: number = 20
  ): Promise<PaginationResponse<AccountMovementResponse>> {
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        size: size.toString()
      })

      const response = await api.get(`${this.baseUrl}/search?${params}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar movimentações')
    }
  }

  /**
   * Obtém movimentações agrupadas por categoria
   */
  async getMovementsByCategory(
    dataInicio: Date,
    dataFim: Date,
    agencia?: string,
    contaCorrente?: string
  ): Promise<{
    categoria: string
    quantidade: number
    valorTotal: number
    valorMedio: number
  }[]> {
    try {
      const params = new URLSearchParams({
        dataInicio: dataInicio.toISOString(),
        dataFim: dataFim.toISOString()
      })

      if (agencia) {
        params.append('agencia', agencia)
      }
      if (contaCorrente) {
        params.append('contaCorrente', contaCorrente)
      }

      const response = await api.get(`${this.baseUrl}/category?${params}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar movimentações por categoria')
    }
  }

  /**
   * Aplica filtros aos parâmetros da URL
   */
  private applyFiltersToParams(filters: AdvancedFilters, params: URLSearchParams): void {
    if (filters.tiposMovimento) {
      filters.tiposMovimento.forEach(tipo => 
        params.append('tiposMovimento', tipo)
      )
    }
    if (filters.valorMin !== undefined) {
      params.append('valorMin', filters.valorMin.toString())
    }
    if (filters.valorMax !== undefined) {
      params.append('valorMax', filters.valorMax.toString())
    }
    if (filters.status) {
      filters.status.forEach(status => 
        params.append('status', status)
      )
    }
    if (filters.erroCodigo) {
      filters.erroCodigo.forEach(codigo => 
        params.append('erroCodigo', codigo.toString())
      )
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

export const movementService = new MovementService()
export default movementService
