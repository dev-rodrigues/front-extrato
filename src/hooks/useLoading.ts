import { useState, useCallback } from 'react'

interface UseLoadingOptions {
  initialLoading?: boolean
  autoReset?: boolean
  resetDelay?: number
}

interface LoadingState {
  isLoading: boolean
  error: string | null
  success: boolean
  startTime: number | null
  duration: number | null
}

export const useLoading = (options: UseLoadingOptions = {}) => {
  const {
    initialLoading = false,
    autoReset = false,
    resetDelay = 3000
  } = options

  const [state, setState] = useState<LoadingState>({
    isLoading: initialLoading,
    error: null,
    success: false,
    startTime: null,
    duration: null
  })

  const startLoading = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      success: false,
      startTime: Date.now(),
      duration: null
    }))
  }, [])

  const stopLoading = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      duration: prev.startTime ? Date.now() - prev.startTime : null
    }))
  }, [])

  const setSuccess = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      success: true,
      error: null,
      duration: prev.startTime ? Date.now() - prev.startTime : null
    }))

    if (autoReset) {
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          success: false
        }))
      }, resetDelay)
    }
  }, [autoReset, resetDelay])

  const setError = useCallback((message: string) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: message,
      success: false,
      duration: prev.startTime ? Date.now() - prev.startTime : null
    }))

    if (autoReset) {
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          error: null
        }))
      }, resetDelay)
    }
  }, [autoReset, resetDelay])

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      success: false,
      startTime: null,
      duration: null
    })
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }))
  }, [])

  const clearSuccess = useCallback(() => {
    setState(prev => ({
      ...prev,
      success: false
    }))
  }, [])

  // Executar função com loading automático
  const withLoading = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: string) => void
  ): Promise<T | null> => {
    startLoading()
    
    try {
      const result = await asyncFn()
      setSuccess()
      onSuccess?.(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      onError?.(errorMessage)
      return null
    }
  }, [startLoading, setSuccess, setError])

  return {
    // Estado
    ...state,
    
    // Ações básicas
    startLoading,
    stopLoading,
    setSuccess,
    setError,
    reset,
    clearError,
    clearSuccess,
    
    // Utilitário para executar funções com loading
    withLoading,
    
    // Computed values
    hasCompleted: !state.isLoading && (state.success || state.error !== null),
    isIdle: !state.isLoading && !state.success && state.error === null
  }
}
