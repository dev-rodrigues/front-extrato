import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Componente para exibir métricas do dashboard
 * Suporta diferentes variantes e indicadores de mudança
 */

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'positive' | 'negative' | 'neutral' | 'warning'
  description?: string
  loading?: boolean
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  variant = 'default',
  description,
  loading = false
}) => {
  // Determinar cor e ícone baseado na variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'positive':
        return {
          iconColor: 'text-green-600',
          changeColor: 'text-green-600',
          changeIcon: TrendingUp,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        }
      case 'negative':
        return {
          iconColor: 'text-red-600',
          changeColor: 'text-red-600',
          changeIcon: TrendingDown,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        }
      case 'warning':
        return {
          iconColor: 'text-yellow-600',
          changeColor: 'text-yellow-600',
          changeIcon: TrendingUp,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        }
      case 'neutral':
        return {
          iconColor: 'text-blue-600',
          changeColor: 'text-blue-600',
          changeIcon: Minus,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        }
      default:
        return {
          iconColor: 'text-muted-foreground',
          changeColor: 'text-muted-foreground',
          changeIcon: Minus,
          bgColor: 'bg-muted/50',
          borderColor: 'border-border'
        }
    }
  }

  const styles = getVariantStyles()
  const ChangeIcon = styles.changeIcon

  // Determinar se a mudança é positiva, negativa ou neutra
  const getChangeType = (changeStr?: string) => {
    if (!changeStr) return 'neutral'
    if (changeStr.includes('+')) return 'positive'
    if (changeStr.includes('-')) return 'negative'
    return 'neutral'
  }

  const changeType = getChangeType(change)

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-md',
      loading && 'animate-pulse'
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          'p-2 rounded-full',
          styles.bgColor,
          styles.borderColor,
          'border'
        )}>
          <Icon className={cn('h-4 w-4', styles.iconColor)} />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          {/* Valor principal */}
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="h-8 bg-muted rounded animate-pulse" />
            ) : (
              value
            )}
          </div>
          
          {/* Mudança/Indicador */}
          {change && (
            <div className="flex items-center space-x-1 text-sm">
              <ChangeIcon className={cn(
                'h-4 w-4',
                changeType === 'positive' && 'text-green-600',
                changeType === 'negative' && 'text-red-600',
                changeType === 'neutral' && 'text-muted-foreground'
              )} />
              <span className={cn(
                'font-medium',
                changeType === 'positive' && 'text-green-600',
                changeType === 'negative' && 'text-red-600',
                changeType === 'neutral' && 'text-muted-foreground'
              )}>
                {change}
              </span>
            </div>
          )}
          
          {/* Descrição opcional */}
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default MetricCard
