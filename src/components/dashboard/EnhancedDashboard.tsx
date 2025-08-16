import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Users, Activity, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface DashboardMetrics {
  totalAccounts: number
  activeQueries: number
  totalImports: number
  totalMovements: number
  systemUptime: number
  lastUpdate: Date
  alerts: Array<{
    id: string
    type: 'info' | 'warning' | 'error' | 'success'
    message: string
    timestamp: Date
  }>
}

export const EnhancedDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalAccounts: 1250,
    activeQueries: 47,
    totalImports: 892,
    totalMovements: 15420,
    systemUptime: 99.8,
    lastUpdate: new Date(),
    alerts: [
      {
        id: '1',
        type: 'success',
        message: 'Sistema operando normalmente',
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        id: '2',
        type: 'info',
        message: '5 novas importações processadas',
        timestamp: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        id: '3',
        type: 'warning',
        message: '3 consultas com timeout nos últimos 30 min',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      }
    ]
  })

  // Simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeQueries: Math.max(0, prev.activeQueries + Math.floor(Math.random() * 3) - 1),
        lastUpdate: new Date(),
        systemUptime: Math.max(95, prev.systemUptime + (Math.random() - 0.5) * 0.1)
      }))
    }, 30000) // Atualiza a cada 30 segundos

    return () => clearInterval(interval)
  }, [])

  const getAlertIcon = (type: DashboardMetrics['alerts'][0]['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'info': return <Activity className="h-4 w-4 text-blue-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getAlertBadge = (type: DashboardMetrics['alerts'][0]['type']) => {
    const variants = {
      success: 'default',
      warning: 'secondary',
      error: 'destructive',
      info: 'outline'
    } as const
    
    return <Badge variant={variants[type]}>{type}</Badge>
  }

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(1)}%`
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    
    if (diffMins < 1) return 'Agora mesmo'
    if (diffMins < 60) return `${diffMins} min atrás`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h atrás`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d atrás`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Principal</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema BB Extrato
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Última atualização: {formatTimeAgo(metrics.lastUpdate)}
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{metrics.totalAccounts.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Contas Ativas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{metrics.activeQueries}</div>
                <div className="text-sm text-muted-foreground">Consultas Ativas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{metrics.totalImports.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Importações</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{metrics.totalMovements.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Movimentações</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status do Sistema e Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Status do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Uptime do Sistema</span>
              <Badge variant={metrics.systemUptime >= 99 ? 'default' : 'secondary'}>
                {formatUptime(metrics.systemUptime)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Consultas Ativas</span>
              <Badge variant={metrics.activeQueries > 0 ? 'default' : 'outline'}>
                {metrics.activeQueries} ativas
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Última Sincronização</span>
              <span className="text-sm text-muted-foreground">
                {formatTimeAgo(metrics.lastUpdate)}
              </span>
            </div>
            
            <div className="pt-4">
              <Button className="w-full" variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                Verificar Status
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alertas Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Alertas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getAlertBadge(alert.type)}
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(alert.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <Button className="w-full" variant="outline">
                <AlertCircle className="h-4 w-4 mr-2" />
                Ver Todos os Alertas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col gap-2" variant="outline">
              <Activity className="h-6 w-6" />
              <span className="text-sm">Nova Consulta</span>
            </Button>
            
            <Button className="h-20 flex-col gap-2" variant="outline">
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Importar Extrato</span>
            </Button>
            
            <Button className="h-20 flex-col gap-2" variant="outline">
              <DollarSign className="h-6 w-6" />
              <span className="text-sm">Ver Movimentações</span>
            </Button>
            
            <Button className="h-20 flex-col gap-2" variant="outline">
              <Users className="h-6 w-6" />
              <span className="text-sm">Relatórios</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
