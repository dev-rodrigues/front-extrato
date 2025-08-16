import { GiKiwiBird } from 'react-icons/gi'

interface AppLoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

/**
 * AppLoading - Componente de loading global que usa o logo da aplicação
 * Substitui o ícone genérico por uma animação personalizada com o GiKiwiBird
 */
export function AppLoading({ 
  size = 'md', 
  text = 'Carregando...',
  className = '' 
}: AppLoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Logo animado */}
      <div className="relative">
        <GiKiwiBird 
          className={`${sizeClasses[size]} text-blue-600 animate-bounce`}
        />
        
        {/* Efeito de brilho */}
        <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 animate-ping" />
        
        {/* Efeito de rotação sutil */}
        <div className="absolute inset-0 animate-spin">
          <div className="w-full h-full border-2 border-blue-300 border-t-blue-600 rounded-full opacity-30" />
        </div>
      </div>
      
      {/* Texto de loading */}
      {text && (
        <div className={`text-center ${textSizes[size]}`}>
          <p className="text-blue-700 font-medium">{text}</p>
          {/* Pontos animados */}
          <div className="flex justify-center space-x-1 mt-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * AppLoadingFullScreen - Loading em tela cheia para carregamento da aplicação
 */
export function AppLoadingFullScreen() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo principal */}
        <div className="mb-8">
          <GiKiwiBird className="h-20 w-20 text-blue-600 mx-auto animate-bounce" />
        </div>
        
        {/* Nome da aplicação */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Kiwi BB Extrato
        </h1>
        
        {/* Subtítulo */}
        <p className="text-gray-600 mb-8">
          Sistema de Consulta Bancária
        </p>
        
        {/* Loading animado */}
        <AppLoading size="lg" text="Inicializando aplicação..." />
      </div>
    </div>
  )
}

/**
 * AppLoadingInline - Loading inline para componentes específicos
 */
export function AppLoadingInline({ 
  size = 'sm', 
  text,
  className = '' 
}: AppLoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <GiKiwiBird 
        className={`${sizeClasses[size]} text-blue-600 animate-spin`}
      />
      {text && (
        <span className="text-blue-700 font-medium">{text}</span>
      )}
    </div>
  )
}
