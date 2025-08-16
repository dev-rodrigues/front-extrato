/**
 * ScheduleService - Implementa APENAS endpoints documentados nos RFCs
 * Baseado em RFC-API-Integration.md - Monitoramento de Schedule
 */

import type { 
  JobProgressSummaryResponse, 
  SystemStatsResponse, 
  HealthResponse,
  JobProgressResponse 
} from '@/types/rfc'

import api from './api'

const API_BASE = '/api/schedule'

/**
 * Serviço para monitoramento de schedule conforme RFCs
 * Endpoints implementados:
 * - GET /api/schedule/progress
 * - GET /api/schedule/stats  
 * - GET /api/schedule/health
 * - GET /api/schedule/active
 * - POST /api/schedule/job/{jobName}/cancel
 */
export class ScheduleService {
  
  /**
   * Busca progresso atual de todos os jobs agendados
   * Endpoint: GET /api/schedule/progress
   */
  static async getProgress(): Promise<JobProgressSummaryResponse> {
    const response = await api.get(`${API_BASE}/progress`)
    return response.data
  }

  /**
   * Busca estatísticas do sistema
   * Endpoint: GET /api/schedule/stats
   */
  static async getStats(): Promise<SystemStatsResponse> {
    const response = await api.get(`${API_BASE}/stats`)
    return response.data
  }

  /**
   * Busca status de saúde do sistema
   * Endpoint: GET /api/schedule/health
   */
  static async getHealth(): Promise<HealthResponse> {
    const response = await api.get(`${API_BASE}/health`)
    return response.data
  }

  /**
   * Lista todos os jobs atualmente em execução
   * Endpoint: GET /api/schedule/active
   */
  static async getActiveJobs(): Promise<JobProgressResponse[]> {
    const response = await api.get(`${API_BASE}/active`)
    return response.data
  }

  /**
   * Cancela um job específico
   * Endpoint: POST /api/schedule/job/{jobName}/cancel
   */
  static async cancelJob(jobName: string): Promise<void> {
    await api.post(`${API_BASE}/job/${jobName}/cancel`)
  }

  /**
   * Busca detalhes de um job específico
   * Endpoint: GET /api/schedule/job/{jobName}
   */
  static async getJobDetails(jobName: string): Promise<JobProgressResponse> {
    const response = await api.get(`${API_BASE}/job/${jobName}`)
    return response.data
  }
}
