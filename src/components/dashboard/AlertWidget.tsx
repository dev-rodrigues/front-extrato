import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  XCircle,
  Clock,
  ExternalLink,
  Check,
  Eye
} from 'lucide-react'
import { DashboardAlert } from '@/services/dashboardService'
import { cn } from '@/lib/utils'

/**
 * Componente para exibir alertas e notificações do dashboard
 * Suporta diferentes tipos de alerta e ações
 */

interface AlertWidgetProps {
  alerts: DashboardAlert[]
  maxAlerts?: number
  onMarkAsRead?: (alertId: string) => void
  onMarkAllAsRead?: () => void
}

export const AlertWidget: React.FC<AlertWidgetProps> = ({
  alerts,
  maxAlerts = 5,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set())

  // Filtrar alertas não lidos primeiro
  const sortedAlerts = [...alerts].sort((a, b) => {
    if (a.lido === b.lido) {
      return new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
    }
    return a.lido ? 1 : -1
  })

  const displayedAlerts = sortedAlerts.slice(0, maxAlerts)
  const unreadCount = alerts.filter(alert => !alert.lido).length

  // Função para alternar expansão de um alerta
  const toggleAlert = (alertId: string) => {
    setExpandedAlerts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(alertId)) {
        newSet.delete(alertId)
      } else {
        newSet.add(alertId)
      }
      return newSet
    })
  }

  // Função para marcar alerta como lido
  const handleMarkAsRead = (alertId: string) => {
    if (onMarkAsRead) {
      onMarkAsRead(alertId)
    }
  }

  // Função para marcar todos como lidos
  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead()
    }
  }

  // Função para obter ícone baseado no tipo de alerta
  const getAlertIcon = (tipo: DashboardAlert['tipo']) => {
    switch (tipo) {
      case 'success':
        return CheckCircle
      case 'warning':
        return AlertTriangle
      case 'error':
        return XCircle
      case 'info':
        return Info
      default:
        return Info
    }
  }

  // Função para obter cor baseada no tipo de alerta
  const getAlertColor = (tipo: DashboardAlert['tipo']) => {
    switch (tipo) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-muted-foreground bg-muted border-border'
    }
  }

  // Função para formatar data/hora
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Agora mesmo'
    if (diffMins < 60) return `${diffMins} min atrás`
    if (diffHours < 24) return `${diffHours}h atrás`
    if (diffDays < 7) return `${diffDays} dias atrás`
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (alerts.length === 0) {
    return null
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-lg font-semibold">Alertas e Notificações</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              {unreadCount} não lidos
            </Badge>
          )}
        </div>
        
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="text-xs"
          >
            <Check className="h-3 w-3 mr-1" />
            Marcar todos como lidos
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {displayedAlerts.map((alert) => {
            const Icon = getAlertIcon(alert.tipo)
            const isExpanded = expandedAlerts.has(alert.id)
            
            return (
              <div
                key={alert.id}
                className={cn(
                  'p-3 rounded-lg border transition-all duration-200',
                  getAlertColor(alert.tipo),
                  !alert.lido && 'ring-2 ring-offset-2 ring-offset-background',
                  !alert.lido && 'ring-primary/20'
                )}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={cn(
                    'h-5 w-5 mt-0.5 flex-shrink-0',
                    getAlertColor(alert.tipo).split(' ')[0]
                  )} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={cn(
                        'text-sm font-medium',
                        !alert.lido && 'font-semibold'
                      )}>
                        {alert.titulo}
                      </h4>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(alert.dataHora)}
                        </span>
                        
                        {!alert.lido && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(alert.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <p className={cn(
                      'text-sm mt-1',
                      alert.lido ? 'text-muted-foreground' : 'text-foreground'
                    )}>
                      {alert.mensagem}
                    </p>
                    
                    {/* Ações do alerta */}
                    {(alert.acao || alert.link) && (
                      <div className="flex items-center space-x-2 mt-2">
                        {alert.acao && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => toggleAlert(alert.id)}
                          >
                            {alert.acao}
                          </Button>
                        )}
                        
                        {alert.link && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => window.open(alert.link, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Ver Detalhes
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          
          {/* Mostrar mais alertas se houver */}
          {alerts.length > maxAlerts && (
            <div className="text-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
              >
                Ver mais {alerts.length - maxAlerts} alertas
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default AlertWidget
