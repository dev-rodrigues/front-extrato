import { GiKiwiBird } from 'react-icons/gi'

interface AppLoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
  isRefetching?: boolean
  showRefetchIndicator?: boolean
}

/**
 * AppLoading - Componente de loading global que usa o logo da aplicação
 * Substitui o ícone genérico por uma animação personalizada com o GiKiwiBird
 * Agora com suporte a indicadores de refetching para React Query
 */
export function AppLoading({ 
  size = 'md', 
  text = ' ',
  className = '',
  isRefetching = false,
  showRefetchIndicator = true
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
    <div className={`flex flex-col items-center justify-center space-y-4 transition-all duration-300 ease-in-out ${className}`}>
      {/* Logo animado */}
      <div className="relative">
        <GiKiwiBird 
          className={`${sizeClasses[size]} text-blue-600 transition-all duration-300 ${
            isRefetching ? 'animate-pulse' : 'animate-bounce'
          }`}
        />
        
        {/* Efeito de brilho */}
        <div className={`absolute inset-0 bg-blue-400 rounded-full opacity-20 transition-opacity duration-300 ${
          isRefetching ? 'animate-ping' : 'animate-ping'
        }`} />
        
        {/* Efeito de rotação sutil */}
        <div className={`absolute inset-0 transition-all duration-300 ${
          isRefetching ? 'animate-spin' : 'animate-spin'
        }`}>
          <div className="w-full h-full border-2 border-blue-300 border-t-blue-600 rounded-full opacity-30" />
        </div>
        
        {/* Indicador de refetching sutil */}
        {showRefetchIndicator && isRefetching && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white" />
        )}
      </div>
      
      {/* Texto de loading */}
      {text && (
        <div className={`text-center transition-all duration-300 ${textSizes[size]}`}>
          <p className={`text-blue-700 font-medium transition-colors duration-300 ${
            isRefetching ? 'text-green-600' : 'text-blue-700'
          }`}>
            {isRefetching ? 'Atualizando...' : text}
          </p>
          
          {/* Pontos animados */}
          <div className="flex justify-center space-x-1 mt-2">
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isRefetching ? 'bg-green-500' : 'bg-blue-600'
            } animate-bounce`} style={{ animationDelay: '0ms' }} />
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isRefetching ? 'bg-green-500' : 'bg-blue-600'
            } animate-bounce`} style={{ animationDelay: '150ms' }} />
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isRefetching ? 'bg-green-500' : 'bg-blue-600'
            } animate-bounce`} style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * UpdateIndicator - Componente específico para indicar atualizações automáticas
 * Usa o ícone GiKiwiBird com animações personalizadas para feedback visual
 */
export function UpdateIndicator({ 
  size = 'sm',
  isRefetching = false,
  showText = true,
  className = ''
}: {
  size?: 'sm' | 'md' | 'lg'
  isRefetching: boolean
  showText?: boolean
  className?: string
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  if (!isRefetching) return null

  return (
    <div className={`flex items-center space-x-2 transition-all duration-300 ${className}`}>
      {/* Ícone GiKiwiBird animado */}
      <div className="relative">
        <GiKiwiBird 
          className={`${sizeClasses[size]} text-green-600 animate-smooth-rotate`}
        />
        
        {/* Efeito de onda para indicar atividade */}
        <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 animate-wave" />
        
        {/* Indicador de atividade */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-refetch-pulse" />
      </div>
      
      {/* Texto de atualização */}
      {showText && (
        <span className={`text-green-600 font-medium ${textSizes[size]} animate-fade-in`}>
          Atualizando...
        </span>
      )}
    </div>
  )
}

/**
 * ProgressUpdateIndicator - Indicador específico para barras de progresso
 * Mostra quando os dados estão sendo atualizados
 */
export function ProgressUpdateIndicator({ 
  isRefetching = false,
  className = ''
}: {
  isRefetching: boolean
  className?: string
}) {
  if (!isRefetching) return null

  return (
    <div className={`flex items-center space-x-2 text-xs text-green-600 ${className}`}>
      {/* Ícone pequeno GiKiwiBird */}
      <GiKiwiBird className="h-3 w-3 animate-smooth-rotate" />
      
      {/* Texto de atualização */}
      <span className="animate-fade-in">Atualizando...</span>
      
      {/* Indicador de atividade */}
      <div className="flex space-x-1">
        <div className="w-1 h-1 bg-green-500 rounded-full animate-loading-dots" />
        <div className="w-1 h-1 bg-green-500 rounded-full animate-loading-dots" />
        <div className="w-1 h-1 bg-green-500 rounded-full animate-loading-dots" />
      </div>
    </div>
  )
}

/**
 * AppLoadingFullScreen - Loading em tela cheia para carregamento da aplicação
 */
export function AppLoadingFullScreen() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50 transition-all duration-500 ease-in-out">
      <div className="text-center animate-fade-in">
        {/* Logo principal */}
        <div className="mb-8 transition-all duration-300">
          <GiKiwiBird className="h-20 w-20 text-blue-600 mx-auto animate-bounce" />
        </div>
        
        {/* Nome da aplicação */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4 transition-all duration-300">
          Kiwi BB Extrato
        </h1>
        
        {/* Subtítulo */}
        <p className="text-gray-600 mb-8 transition-all duration-300">
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
  className = '',
  isRefetching = false
}: AppLoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={`inline-flex items-center space-x-2 transition-all duration-300 ease-in-out ${className}`}>
      <div className="relative">
        <GiKiwiBird 
          className={`${sizeClasses[size]} text-blue-600 transition-all duration-300 ${
            isRefetching ? 'animate-pulse' : 'animate-spin'
          }`}
        />
        
        {/* Indicador de refetching para inline */}
        {isRefetching && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse border border-white" />
        )}
      </div>
      
      {text && (
        <span className={`font-medium transition-colors duration-300 ${
          isRefetching ? 'text-green-600' : 'text-blue-700'
        }`}>
          {isRefetching ? 'Atualizando...' : text}
        </span>
      )}
    </div>
  )
}

/**
 * AppLoadingSkeleton - Loading skeleton para dados que estão sendo carregados
 */
export function AppLoadingSkeleton({ 
  className = '',
  isRefetching = false 
}: { className?: string; isRefetching?: boolean }) {
  return (
    <div className={`animate-pulse transition-all duration-300 ${className}`}>
      <div className={`h-4 bg-gray-200 rounded transition-all duration-300 ${
        isRefetching ? 'bg-green-200' : 'bg-gray-200'
      }`} />
      <div className={`h-4 bg-gray-200 rounded mt-2 transition-all duration-300 ${
        isRefetching ? 'bg-green-200' : 'bg-gray-200'
      }`} />
      <div className={`h-4 bg-gray-200 rounded mt-2 w-3/4 transition-all duration-300 ${
        isRefetching ? 'bg-green-200' : 'bg-gray-200'
      }`} />
    </div>
  )
}
