import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock } from 'lucide-react'

interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info'
  message: string
  timestamp: string
  priority: 'high' | 'medium' | 'low'
}

interface AlertListProps {
  alerts: Alert[]
  maxAlerts?: number
}

export const AlertList = ({ alerts, maxAlerts = 5 }: AlertListProps) => {
  const getBadgeVariant = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'destructive'
      case 'warning':
        return 'secondary'
      case 'info':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50'
      case 'medium':
        return 'border-yellow-200 bg-yellow-50'
      case 'low':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const displayedAlerts = alerts.slice(0, maxAlerts)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Alertas do Sistema
          {alerts.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {alerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayedAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum alerta ativo</p>
            <p className="text-sm">O sistema está funcionando normalmente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center justify-between p-3 border rounded-lg ${getPriorityColor(alert.priority)}`}
              >
                <div className="flex items-center gap-3">
                  <Badge variant={getBadgeVariant(alert.type)}>
                    {alert.type === 'critical' && 'Crítico'}
                    {alert.type === 'warning' && 'Atenção'}
                    {alert.type === 'info' && 'Info'}
                  </Badge>
                  <span className="text-sm">{alert.message}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {alert.timestamp}
                </div>
              </div>
            ))}
            
            {alerts.length > maxAlerts && (
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  +{alerts.length - maxAlerts} alertas adicionais
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
