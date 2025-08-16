import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ComponentType, SVGProps } from 'react'

interface SummaryCardProps {
  title: string
  value: string | number
  change?: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  variant?: 'default' | 'positive' | 'negative' | 'neutral'
}

export const SummaryCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  variant = 'default' 
}: SummaryCardProps) => {
  const getChangeColor = () => {
    switch (variant) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      case 'neutral':
        return 'text-blue-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const getChangeIcon = () => {
    switch (variant) {
      case 'positive':
        return '↗'
      case 'negative':
        return '↘'
      case 'neutral':
        return '→'
      default:
        return ''
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${getChangeColor()}`}>
            {getChangeIcon()} {change}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
