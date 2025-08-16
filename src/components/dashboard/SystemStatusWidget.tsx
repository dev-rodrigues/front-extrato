import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Activity,
  Clock,
  Server,
  Wifi,
  Database
} from 'lucide-react'
import type { SystemStatus } from '@/services/dashboardService'
import { cn } from '@/lib/utils'

/**
 * Componente para exibir status do sistema
 * Mostra uptime, versão e status de diferentes componentes
 */

interface SystemStatusWidgetProps {
  status: SystemStatus
  className?: string
}

export const SystemStatusWidget: React.FC<SystemStatusWidgetProps> = ({
  status,
  className
}) => {
  // Função para obter ícone baseado no status
  const getStatusIcon = (systemStatus: SystemStatus['status']) => {
    switch (systemStatus) {
      case 'online':
        return CheckCircle
      case 'offline':
        return XCircle
      case 'maintenance':
        return AlertTriangle
      default:
        return Activity
    }
  }

  // Função para obter cor baseada no status
  const getStatusColor = (systemStatus: SystemStatus['status']) => {
    switch (systemStatus) {
      case 'online':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'offline':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default:
        return 'text-muted-foreground bg-muted border-border'
    }
  }

  // Função para obter label do status
  const getStatusLabel = (systemStatus: SystemStatus['status']) => {
    switch (systemStatus) {
      case 'online':
        return 'Online'
      case 'offline':
        return 'Offline'
      case 'maintenance':
        return 'Manutenção'
      default:
        return 'Desconhecido'
    }
  }

  // Função para formatar uptime
  const formatUptime = (uptime: number) => {
    if (uptime >= 99.9) return '99.9%+'
    return `${uptime.toFixed(1)}%`
  }

  // Função para formatar data/hora
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const StatusIcon = getStatusIcon(status.status)
  const statusColor = getStatusColor(status.status)

  return (
    <Card className={cn('transition-all duration-200 hover:shadow-md', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-lg font-semibold">Status do Sistema</CardTitle>
          <Badge 
            variant="outline" 
            className={cn('border-current', statusColor)}
          >
            {getStatusLabel(status.status)}
          </Badge>
        </div>
        
        <div className={cn(
          'p-2 rounded-full',
          statusColor,
          'border'
        )}>
          <StatusIcon className={cn('h-5 w-5', statusColor.split(' ')[0])} />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Status Geral */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Servidor:</span>
                <span className="font-medium">{getStatusLabel(status.status)}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Ambiente:</span>
                <span className="font-medium capitalize">{status.environment}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Versão:</span>
                <span className="font-medium">{status.version}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Última Verificação:</span>
                <span className="font-medium">{formatDateTime(status.lastCheck)}</span>
              </div>
            </div>
          </div>
          
          {/* Barra de Uptime */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Uptime do Sistema</span>
              <span className="font-medium">{formatUptime(status.uptime)}</span>
            </div>
            
            <Progress 
              value={status.uptime} 
              className="h-2"
              max={100}
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          
          {/* Indicadores de Componentes */}
          <div className="grid grid-cols-3 gap-3">
            <div className={cn(
              'p-3 rounded-lg border text-center transition-colors',
              status.status === 'online' 
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-muted border-border text-muted-foreground'
            )}>
              <Wifi className={cn(
                'h-5 w-5 mx-auto mb-1',
                status.status === 'online' ? 'text-green-600' : 'text-muted-foreground'
              )} />
              <div className="text-xs font-medium">API</div>
              <div className="text-xs">
                {status.status === 'online' ? 'Ativo' : 'Inativo'}
              </div>
            </div>
            
            <div className={cn(
              'p-3 rounded-lg border text-center transition-colors',
              status.status === 'online' 
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-muted border-border text-muted-foreground'
            )}>
              <Database className={cn(
                'h-5 w-5 mx-auto mb-1',
                status.status === 'online' ? 'text-green-600' : 'text-muted-foreground'
              )} />
              <div className="text-xs font-medium">Banco</div>
              <div className="text-xs">
                {status.status === 'online' ? 'Conectado' : 'Desconectado'}
              </div>
            </div>
            
            <div className={cn(
              'p-3 rounded-lg border text-center transition-colors',
              status.status === 'online' 
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-muted border-border text-muted-foreground'
            )}>
              <Activity className={cn(
                'h-5 w-5 mx-auto mb-1',
                status.status === 'online' ? 'text-green-600' : 'text-muted-foreground'
              )} />
              <div className="text-xs font-medium">Cache</div>
              <div className="text-xs">
                {status.status === 'online' ? 'Ativo' : 'Inativo'}
              </div>
            </div>
          </div>
          
          {/* Informações Adicionais */}
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground text-center">
              Sistema monitorado automaticamente • 
              Verificação a cada 30 segundos
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SystemStatusWidget
