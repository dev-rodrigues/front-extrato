import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, MoreHorizontal } from 'lucide-react'
import { ChartData } from '@/services/dashboardService'

/**
 * Componente para exibir gráficos do dashboard
 * Por enquanto exibe dados em formato tabular, será integrado com Chart.js
 */

interface ChartWidgetProps {
  title: string
  data: ChartData
  type: 'bar' | 'line' | 'pie' | 'doughnut'
  loading?: boolean
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({
  title,
  data,
  type,
  loading = false
}) => {
  // Função para exportar dados do gráfico
  const handleExport = () => {
    const csvContent = [
      ['Label', 'Value'],
      ...data.datasets[0].data.map((value, index) => [
        data.labels[index],
        value
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Função para obter cor baseada no tipo de gráfico
  const getChartColors = () => {
    switch (type) {
      case 'bar':
        return ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
      case 'line':
        return ['#3b82f6', '#1d4ed8']
      case 'pie':
      case 'doughnut':
        return ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
      default:
        return ['#6b7280']
    }
  }

  const colors = getChartColors()

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            className="h-8 w-8 p-0"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Placeholder para gráfico real */}
            <div className="h-48 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="text-sm font-medium mb-2">
                  Gráfico {type.charAt(0).toUpperCase() + type.slice(1)}
                </div>
                <div className="text-xs">
                  Integração com Chart.js em desenvolvimento
                </div>
              </div>
            </div>
            
            {/* Dados tabulares como fallback */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Dados do Gráfico:
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {data.labels.map((label, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="font-medium">{label}:</span>
                    <span>{data.datasets[0].data[index]}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Estatísticas rápidas */}
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total:</span>
                  <div className="font-semibold">
                    {data.datasets[0].data.reduce((sum, value) => sum + value, 0)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Média:</span>
                  <div className="font-semibold">
                    {Math.round(
                      data.datasets[0].data.reduce((sum, value) => sum + value, 0) / 
                      data.datasets[0].data.length
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ChartWidget
