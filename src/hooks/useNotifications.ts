import { useState, useEffect, useCallback } from 'react'
import { notificationService } from '@/services/notificationService'
import type { Notification, Alert } from '@/types/api'

/**
 * Hook customizado para gerenciar notificações e alertas
 * Fornece funcionalidades para listar, marcar como lida e gerenciar notificações
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Carrega notificações do usuário
   */
  const loadNotifications = useCallback(async (
    page: number = 0,
    size: number = 20,
    unreadOnly: boolean = false
  ) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await notificationService.getNotifications(page, size, unreadOnly)
      setNotifications(response.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar notificações')
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Carrega alertas do sistema
   */
  const loadAlerts = useCallback(async (
    page: number = 0,
    size: number = 20,
    activeOnly: boolean = true
  ) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await notificationService.getAlerts(page, size, activeOnly)
      setAlerts(response.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alertas')
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Carrega contagem de notificações não lidas
   */
  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount()
      setUnreadCount(response.count)
    } catch (err) {
      console.error('Erro ao carregar contagem de notificações não lidas:', err)
    }
  }, [])

  /**
   * Marca uma notificação como lida
   */
  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      
      // Atualiza o estado local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true }
            : notification
        )
      )
      
      // Atualiza a contagem de não lidas
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao marcar notificação como lida')
    }
  }, [])

  /**
   * Marca todas as notificações como lidas
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead()
      
      // Atualiza o estado local
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      )
      
      // Zera a contagem de não lidas
      setUnreadCount(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao marcar todas as notificações como lidas')
    }
  }, [])

  /**
   * Remove uma notificação
   */
  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notificationService.deleteNotification(id)
      
      // Remove do estado local
      setNotifications(prev => prev.filter(notification => notification.id !== id))
      
      // Atualiza contagem se não estava lida
      const notification = notifications.find(n => n.id === id)
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover notificação')
    }
  }, [notifications])

  /**
   * Reconhece um alerta
   */
  const acknowledgeAlert = useCallback(async (id: string) => {
    try {
      await notificationService.acknowledgeAlert(id)
      
      // Atualiza o estado local
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === id 
            ? { ...alert, status: 'ACKNOWLEDGED' as const }
            : alert
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao reconhecer alerta')
    }
  }, [])

  /**
   * Resolve um alerta
   */
  const resolveAlert = useCallback(async (id: string, resolutionNote?: string) => {
    try {
      await notificationService.resolveAlert(id, resolutionNote)
      
      // Remove do estado local se activeOnly for true
      setAlerts(prev => prev.filter(alert => alert.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao resolver alerta')
    }
  }, [])

  /**
   * Envia notificação de teste
   */
  const sendTestNotification = useCallback(async (
    type: Notification['type'],
    title: string,
    message: string
  ) => {
    try {
      const notification = await notificationService.sendTestNotification(type, title, message)
      
      // Adiciona ao estado local
      setNotifications(prev => [notification, ...prev])
      
      // Atualiza contagem se não estiver lida
      if (!notification.read) {
        setUnreadCount(prev => prev + 1)
      }
      
      return notification
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar notificação de teste')
      throw err
    }
  }, [])

  /**
   * Atualiza preferências de notificação
   */
  const updatePreferences = useCallback(async (preferences: {
    email: boolean
    push: boolean
    toast: boolean
    frequency: 'IMMEDIATE' | 'HOURLY' | 'DAILY'
  }) => {
    try {
      await notificationService.updateNotificationPreferences(preferences)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar preferências')
      throw err
    }
  }, [])

  /**
   * Busca notificações por texto
   */
  const searchNotifications = useCallback(async (
    query: string,
    page: number = 0,
    size: number = 20
  ) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await notificationService.searchNotifications(query, page, size)
      setNotifications(response.content)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar notificações')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Carrega dados iniciais
   */
  useEffect(() => {
    loadNotifications()
    loadAlerts()
    loadUnreadCount()
  }, [loadNotifications, loadAlerts, loadUnreadCount])

  /**
   * Atualiza contagem de não lidas quando notificações mudam
   */
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length
    setUnreadCount(count)
  }, [notifications])

  return {
    // Estado
    notifications,
    alerts,
    unreadCount,
    loading,
    error,
    
    // Ações
    loadNotifications,
    loadAlerts,
    loadUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    acknowledgeAlert,
    resolveAlert,
    sendTestNotification,
    updatePreferences,
    searchNotifications,
    
    // Utilitários
    hasUnread: unreadCount > 0,
    hasAlerts: alerts.length > 0,
    hasNotifications: notifications.length > 0,
    
    // Limpar erro
    clearError: () => setError(null)
  }
}
