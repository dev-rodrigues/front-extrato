import { Building2, CreditCard, TrendingUp } from 'lucide-react'

interface CrediprodespLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  variant?: 'default' | 'minimal' | 'detailed'
}

export const CrediprodespLogo = ({ 
  size = 'md', 
  showText = true, 
  variant = 'default' 
}: CrediprodespLogoProps) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { icon: 'h-4 w-4', text: 'text-sm' }
      case 'md':
        return { icon: 'h-6 w-6', text: 'text-lg' }
      case 'lg':
        return { icon: 'h-8 w-8', text: 'text-xl' }
      default:
        return { icon: 'h-6 w-6', text: 'text-lg' }
    }
  }

  const { icon, text } = getSizeClasses()

  const renderIcon = () => {
    switch (variant) {
      case 'minimal':
        return <Building2 className={`${icon} text-primary`} />
      case 'detailed':
        return (
          <div className="relative">
            <Building2 className={`${icon} text-primary`} />
            <CreditCard className={`${icon} absolute -bottom-1 -right-1 text-secondary`} />
          </div>
        )
      default:
        return (
          <div className="relative">
            <Building2 className={`${icon} text-primary`} />
            <TrendingUp className={`${icon} absolute -bottom-1 -right-1 text-green-600`} />
          </div>
        )
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center justify-center">
        {renderIcon()}
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${text} font-bold text-primary`}>
            CREDIPRODESP
          </span>
          <span className="text-xs text-muted-foreground">
            Crédito Produtivo
          </span>
        </div>
      )}
    </div>
  )
}

// Versão simplificada para uso em espaços pequenos
export const CrediprodespIcon = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4'
      case 'md':
        return 'h-6 w-6'
      case 'lg':
        return 'h-8 w-8'
      default:
        return 'h-6 w-6'
    }
  }

  return (
    <div className="relative">
      <Building2 className={`${getSizeClass()} text-primary`} />
      <TrendingUp className={`${getSizeClass()} absolute -bottom-1 -right-1 text-green-600`} />
    </div>
  )
}
