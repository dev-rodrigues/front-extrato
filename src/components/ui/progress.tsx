import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  className?: string
  isLoading?: boolean
  isRefetching?: boolean
  showLoadingIndicator?: boolean
  showIterativeLoading?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value = 0, 
    max = 100, 
    isLoading = false,
    isRefetching = false,
    showLoadingIndicator = true,
    showIterativeLoading = true,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    // Determinar se deve mostrar loading
    const shouldShowLoading = isLoading || isRefetching
    
    // Classe para o estado de loading
    const loadingClass = shouldShowLoading ? "animate-pulse" : ""
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-primary/20 transition-all duration-300 ease-in-out",
          loadingClass,
          className
        )}
        {...props}
      >
        {/* Barra de progresso principal */}
        <div
          className={cn(
            "h-full flex-1 bg-primary transition-all duration-500 ease-out relative",
            shouldShowLoading && "opacity-80"
          )}
          style={{ 
            transform: `translateX(-${100 - percentage}%)`,
            width: `${percentage}%`
          }}
        >
          {/* Efeito de loading iterativo na barra de progresso */}
          {showIterativeLoading && shouldShowLoading && (
            <div
              className={cn(
                "absolute inset-0 animate-progress-loading",
                isRefetching ? "opacity-80" : "opacity-60"
              )}
            />
          )}
        </div>
        
        {/* Indicador de loading sutil com shimmer */}
        {showLoadingIndicator && shouldShowLoading && (
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent",
              "animate-shimmer transition-opacity duration-300"
            )}
            style={{
              animation: isRefetching 
                ? "shimmer 1.5s ease-in-out infinite" 
                : "shimmer 2s ease-in-out infinite"
            }}
          />
        )}
        
        {/* Indicador de refetching aprimorado */}
        {showLoadingIndicator && isRefetching && !isLoading && (
          <div className="absolute top-0 right-0 w-2 h-full flex flex-col items-center justify-center space-y-1">
            {/* Indicador principal de refetch */}
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-refetch-pulse" />
            
            {/* Indicador secundário com delay */}
            <div 
              className="w-1 h-1 bg-green-400 rounded-full animate-refetch-pulse" 
              style={{ animationDelay: "0.5s" }}
            />
          </div>
        )}
        
        {/* Indicador de loading com pontos animados */}
        {showLoadingIndicator && isLoading && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-primary/60 rounded-full animate-loading-dots" />
              <div className="w-1 h-1 bg-primary/60 rounded-full animate-loading-dots" />
              <div className="w-1 h-1 bg-primary/60 rounded-full animate-loading-dots" />
            </div>
          </div>
        )}
        
        {/* Efeito de brilho para estado ativo */}
        {shouldShowLoading && (
          <div className="absolute inset-0 rounded-full animate-glow pointer-events-none" />
        )}
      </div>
    )
  }
)

Progress.displayName = "Progress"

export { Progress }
