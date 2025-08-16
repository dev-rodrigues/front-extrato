export interface ApiError {
  status: number
  message: string
  code?: string
  details?: any
}

export class CustomError extends Error {
  public status: number
  public code?: string
  public details?: any

  constructor(message: string, status: number = 500, code?: string, details?: any) {
    super(message)
    this.name = 'CustomError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export const handleApiError = (error: any): ApiError => {
  // Se já é um ApiError, retornar como está
  if (error && typeof error === 'object' && 'status' in error && 'message' in error) {
    return error as ApiError
  }

  // Se é um CustomError
  if (error instanceof CustomError) {
    return {
      status: error.status,
      message: error.message,
      code: error.code,
      details: error.details
    }
  }

  // Se é um erro de rede
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('fetch')) {
    return {
      status: 0,
      message: 'Erro de conexão. Verifique sua internet e tente novamente.',
      code: 'NETWORK_ERROR'
    }
  }

  // Se é um erro de timeout
  if (error.code === 'TIMEOUT' || error.message?.includes('timeout')) {
    return {
      status: 408,
      message: 'A requisição demorou muito para responder. Tente novamente.',
      code: 'TIMEOUT'
    }
  }

  // Se é um erro HTTP
  if (error.response) {
    const status = error.response.status
    let message = 'Erro desconhecido'
    let code = `HTTP_${status}`

    switch (status) {
      case 400:
        message = 'Dados inválidos. Verifique o formato da agência e conta.'
        break
      case 401:
        message = 'Não autorizado. Faça login novamente.'
        break
      case 403:
        message = 'Acesso negado. Você não tem permissão para esta operação.'
        break
      case 404:
        message = 'Conta não encontrada. Verifique os dados informados.'
        break
      case 408:
        message = 'Timeout da requisição. Tente novamente.'
        break
      case 429:
        message = 'Muitas requisições. Aguarde um momento antes de tentar novamente.'
        break
      case 500:
        message = 'Erro interno do servidor. Tente novamente mais tarde.'
        break
      case 502:
        message = 'Serviço temporariamente indisponível. Tente novamente.'
        break
      case 503:
        message = 'Serviço em manutenção. Tente novamente mais tarde.'
        break
      default:
        message = error.response.data?.message || `Erro ${status}: ${error.response.statusText}`
    }

    return {
      status,
      message,
      code,
      details: error.response.data
    }
  }

  // Erro genérico
  return {
    status: 500,
    message: error.message || 'Erro desconhecido. Tente novamente.',
    code: 'UNKNOWN_ERROR',
    details: error
  }
}

export const getErrorMessage = (error: ApiError): string => {
  return error.message
}

export const getErrorTitle = (error: ApiError): string => {
  if (error.status >= 500) {
    return 'Erro do Servidor'
  } else if (error.status >= 400) {
    return 'Erro de Validação'
  } else if (error.status === 0) {
    return 'Erro de Conexão'
  } else {
    return 'Erro'
  }
}

export const isRetryableError = (error: ApiError): boolean => {
  // Erros que podem ser tentados novamente
  return error.status >= 500 || error.status === 0 || error.status === 408
}

export const getRetryDelay = (attempt: number): number => {
  // Backoff exponencial: 1s, 2s, 4s, 8s, 16s
  return Math.min(1000 * Math.pow(2, attempt), 30000)
}

// Função para log de erros (em produção, enviar para serviço de monitoramento)
export const logError = (error: ApiError, context?: any) => {
  console.error('API Error:', {
    timestamp: new Date().toISOString(),
    error,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href
  })
  
  // Aqui você pode integrar com serviços como Sentry, LogRocket, etc.
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error)
  // }
}
