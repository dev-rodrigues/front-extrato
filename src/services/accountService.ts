import api, { createApiUrl, formatDateForAPI, validateApiResponse } from './api'
import { AccountQueryFormData } from '@/schemas/accountQuerySchema'

/**
 * Serviço para consultas de conta bancária
 * Integra com a API backend para logs, importações e movimentações
 */

// Interfaces baseadas na documentação da API
export interface QueryLogResponse {
  id: string
  banco: string
  agencia: string
  contaCorrente: string
  consultaPeriodoDe: string
  consultaPeriodoAte: string
  erroCodigo: number
  erroDescricao?: string
  dataHoraTentativa: string
  dataHora: string
}

export interface ImportResponse {
  id: string
  layoutId?: string
  arquivoNome?: string
  arquivoGeracaoDataHora?: string
  qtdRegistros?: number
  qtdContas?: number
  dataHora?: string
  consultaAgencia?: string
  consultaContaCorrente?: string
  consultaPeriodoDe?: string
  consultaPeriodoAte?: string
}

export interface MovementResponse {
  id: string
  numeroSequencialExtrato?: string
  movimentoData?: string
  movimentoTipo?: string
  movimentoValor?: number
  movimentoSaldo?: number
  posicaoSaldo?: string
  descricaoHistorico?: string
  documentoNumero?: string
  numeroCpfCnpjContrapartida?: string
}

export interface PaginationResponse<T> {
  content: T[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  isFirst: boolean
  isLast: boolean
}

export interface AccountQueryParams {
  agencia: string
  contaCorrente: string
  dataInicio: Date
  dataFim: Date
  page?: number
  size?: number
}

/**
 * Consultar logs de consulta para uma conta específica
 */
export const getQueryLogs = async (
  params: AccountQueryParams
): Promise<PaginationResponse<QueryLogResponse>> => {
  try {
    const { agencia, contaCorrente, dataInicio, dataFim, page = 0, size = 20 } = params
    
    const response = await api.get(
      `/api/accounts/${agencia}/${contaCorrente}/query-logs`,
      {
        params: {
          dataInicio: formatDateForAPI(dataInicio),
          dataFim: formatDateForAPI(dataFim),
          page,
          size
        }
      }
    )
    
    return validateApiResponse(response)
  } catch (error) {
    console.error('❌ Erro ao buscar logs de consulta:', error)
    throw new Error('Falha ao buscar logs de consulta. Tente novamente.')
  }
}

/**
 * Consultar histórico de importações para uma conta específica
 */
export const getImports = async (
  params: AccountQueryParams
): Promise<PaginationResponse<ImportResponse>> => {
  try {
    const { agencia, contaCorrente, dataInicio, dataFim, page = 0, size = 20 } = params
    
    const response = await api.get(
      `/api/accounts/${agencia}/${contaCorrente}/imports`,
      {
        params: {
          dataInicio: formatDateForAPI(dataInicio),
          dataFim: formatDateForAPI(dataFim),
          page,
          size
        }
      }
    )
    
    return validateApiResponse(response)
  } catch (error) {
    console.error('❌ Erro ao buscar histórico de importações:', error)
    throw new Error('Falha ao buscar histórico de importações. Tente novamente.')
  }
}

/**
 * Consultar movimentações bancárias para uma conta específica
 */
export const getMovements = async (
  params: AccountQueryParams
): Promise<PaginationResponse<MovementResponse>> => {
  try {
    const { agencia, contaCorrente, dataInicio, dataFim, page = 0, size = 20 } = params
    
    const response = await api.get(
      `/api/accounts/${agencia}/${contaCorrente}/movements`,
      {
        params: {
          dataInicio: formatDateForAPI(dataInicio),
          dataFim: formatDateForAPI(dataFim),
          page,
          size
        }
      }
    )
    
    return validateApiResponse(response)
  } catch (error) {
    console.error('❌ Erro ao buscar movimentações:', error)
    throw new Error('Falha ao buscar movimentações. Tente novamente.')
  }
}

/**
 * Consultar dados de múltiplas fontes para uma conta
 * Útil para dashboard e visão geral
 */
export const getAccountOverview = async (
  params: Omit<AccountQueryParams, 'page' | 'size'>
): Promise<{
  logs: PaginationResponse<QueryLogResponse>
  imports: PaginationResponse<ImportResponse>
  movements: PaginationResponse<MovementResponse>
}> => {
  try {
    const [logs, imports, movements] = await Promise.all([
      getQueryLogs({ ...params, page: 0, size: 10 }),
      getImports({ ...params, page: 0, size: 10 }),
      getMovements({ ...params, page: 0, size: 10 })
    ])
    
    return { logs, imports, movements }
  } catch (error) {
    console.error('❌ Erro ao buscar visão geral da conta:', error)
    throw new Error('Falha ao buscar visão geral da conta. Tente novamente.')
  }
}

/**
 * Validar se uma agência e conta existem no sistema
 */
export const validateAccount = async (
  agencia: string,
  contaCorrente: string
): Promise<boolean> => {
  try {
    // Tentar buscar logs com período pequeno para validar existência
    const dataInicio = new Date()
    dataInicio.setDate(dataInicio.getDate() - 1)
    const dataFim = new Date()
    
    await getQueryLogs({
      agencia,
      contaCorrente,
      dataInicio,
      dataFim,
      page: 0,
      size: 1
    })
    
    return true
  } catch (error) {
    // Se retornar 404, a conta não existe
    if (error instanceof Error && error.message.includes('404')) {
      return false
    }
    // Para outros erros, assumir que a conta pode existir
    return true
  }
}

/**
 * Buscar estatísticas de uma conta para dashboard
 */
export const getAccountStats = async (
  agencia: string,
  contaCorrente: string
): Promise<{
  totalConsultas: number
  totalImportacoes: number
  totalMovimentacoes: number
  ultimaConsulta?: string
  ultimaImportacao?: string
  ultimaMovimentacao?: string
}> => {
  try {
    const dataInicio = new Date()
    dataInicio.setMonth(dataInicio.getMonth() - 1) // Último mês
    const dataFim = new Date()
    
    const [logs, imports, movements] = await Promise.all([
      getQueryLogs({ agencia, contaCorrente, dataInicio, dataFim, page: 0, size: 1 }),
      getImports({ agencia, contaCorrente, dataInicio, dataFim, page: 0, size: 1 }),
      getMovements({ agencia, contaCorrente, dataInicio, dataFim, page: 0, size: 1 })
    ])
    
    return {
      totalConsultas: logs.totalElements,
      totalImportacoes: imports.totalElements,
      totalMovimentacoes: movements.totalElements,
      ultimaConsulta: logs.content[0]?.dataHora,
      ultimaImportacao: imports.content[0]?.dataHora,
      ultimaMovimentacao: movements.content[0]?.movimentoData
    }
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas da conta:', error)
    throw new Error('Falha ao buscar estatísticas da conta. Tente novamente.')
  }
}

// Exportar tipos para uso em outros componentes
export type {
  QueryLogResponse,
  ImportResponse,
  MovementResponse,
  PaginationResponse,
  AccountQueryParams
}
