import api from './api'
import type {
  Notification,
  Alert,
  PaginationResponse,
  ApiResponse
} from '@/types/api'

/**
 * Serviço para gerenciamento de notificações e alertas
 * Integra com a API backend para operações de notificação
 */
class NotificationService {
  private readonly baseUrl = '/api/notifications'

  /**
   * Lista todas as notificações do usuário
   */
  async getNotifications(
    page: number = 0,
    size: number = 20,
    unreadOnly: boolean = false
  ): Promise<PaginationResponse<Notification>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        unreadOnly: unreadOnly.toString()
      })

      const response = await api.get(`${this.baseUrl}?${params}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao listar notificações')
    }
  }

  /**
   * Marca uma notificação como lida
   */
  async markAsRead(id: string): Promise<void> {
    try {
      await api.patch(`${this.baseUrl}/${id}/read`)
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao marcar notificação como lida')
    }
  }

  /**
   * Marca todas as notificações como lidas
   */
  async markAllAsRead(): Promise<void> {
    try {
      await api.patch(`${this.baseUrl}/read-all`)
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao marcar todas as notificações como lidas')
    }
  }

  /**
   * Remove uma notificação
   */
  async deleteNotification(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`)
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao remover notificação')
    }
  }

  /**
   * Obtém contagem de notificações não lidas
   */
  async getUnreadCount(): Promise<{ count: number }> {
    try {
      const response = await api.get(`${this.baseUrl}/unread-count`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar contagem de notificações não lidas')
    }
  }

  /**
   * Lista todos os alertas do sistema
   */
  async getAlerts(
    page: number = 0,
    size: number = 20,
    activeOnly: boolean = true
  ): Promise<PaginationResponse<Alert>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        activeOnly: activeOnly.toString()
      })

      const response = await api.get(`${this.baseUrl}/alerts?${params}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao listar alertas')
    }
  }

  /**
   * Obtém alertas por prioridade
   */
  async getAlertsByPriority(
    priority: 'HIGH' | 'MEDIUM' | 'LOW',
    page: number = 0,
    size: number = 20
  ): Promise<PaginationResponse<Alert>> {
    try {
      const params = new URLSearchParams({
        priority,
        page: page.toString(),
        size: size.toString()
      })

      const response = await api.get(`${this.baseUrl}/alerts/priority?${params}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar alertas por prioridade')
    }
  }

  /**
   * Reconhece um alerta (marca como conhecido)
   */
  async acknowledgeAlert(id: string): Promise<void> {
    try {
      await api.patch(`${this.baseUrl}/alerts/${id}/acknowledge`)
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao reconhecer alerta')
    }
  }

  /**
   * Resolve um alerta
   */
  async resolveAlert(id: string, resolutionNote?: string): Promise<void> {
    try {
      const payload = resolutionNote ? { resolutionNote } : {}
      await api.patch(`${this.baseUrl}/alerts/${id}/resolve`, payload)
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao resolver alerta')
    }
  }

  /**
   * Envia notificação de teste
   */
  async sendTestNotification(
    type: Notification['type'],
    title: string,
    message: string
  ): Promise<Notification> {
    try {
      const response = await api.post(`${this.baseUrl}/test`, {
        type,
        title,
        message
      })
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao enviar notificação de teste')
    }
  }

  /**
   * Configura preferências de notificação
   */
  async updateNotificationPreferences(preferences: {
    email: boolean
    push: boolean
    toast: boolean
    frequency: 'IMMEDIATE' | 'HOURLY' | 'DAILY'
  }): Promise<void> {
    try {
      await api.put(`${this.baseUrl}/preferences`, preferences)
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao atualizar preferências de notificação')
    }
  }

  /**
   * Obtém preferências de notificação
   */
  async getNotificationPreferences(): Promise<{
    email: boolean
    push: boolean
    toast: boolean
    frequency: 'IMMEDIATE' | 'HOURLY' | 'DAILY'
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/preferences`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar preferências de notificação')
    }
  }

  /**
   * Obtém estatísticas de notificações
   */
  async getNotificationStats(
    dataInicio?: Date,
    dataFim?: Date
  ): Promise<{
    total: number
    lidas: number
    naoLidas: number
    porTipo: Record<string, number>
    porPrioridade: Record<string, number>
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
      throw this.handleError(error, 'Erro ao buscar estatísticas de notificações')
    }
  }

  /**
   * Busca notificações por texto
   */
  async searchNotifications(
    query: string,
    page: number = 0,
    size: number = 20
  ): Promise<PaginationResponse<Notification>> {
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        size: size.toString()
      })

      const response = await api.get(`${this.baseUrl}/search?${params}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar notificações')
    }
  }

  /**
   * Obtém notificações por tipo
   */
  async getNotificationsByType(
    type: Notification['type'],
    page: number = 0,
    size: number = 20
  ): Promise<PaginationResponse<Notification>> {
    try {
      const params = new URLSearchParams({
        type,
        page: page.toString(),
        size: size.toString()
      })

      const response = await api.get(`${this.baseUrl}/type/${type}?${params}`)
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao buscar notificações por tipo')
    }
  }

  /**
   * Limpa notificações antigas
   */
  async clearOldNotifications(daysOld: number = 30): Promise<{ deletedCount: number }> {
    try {
      const response = await api.delete(`${this.baseUrl}/clear-old`, {
        params: { daysOld }
      })
      return response.data
    } catch (error: any) {
      throw this.handleError(error, 'Erro ao limpar notificações antigas')
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

export const notificationService = new NotificationService()
export default notificationService
