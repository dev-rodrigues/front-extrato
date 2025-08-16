import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

/**
 * Configuração base da API para integração com backend
 * Inclui interceptors, retry logic e tratamento de erros
 */

// Configurações de ambiente
const API_CONFIG = {
  development: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
    retryDelay: parseInt(import.meta.env.VITE_API_RETRY_DELAY || '1000')
  },
  production: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.coppetec.ufrj.br',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '15000'),
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '2'),
    retryDelay: parseInt(import.meta.env.VITE_API_RETRY_DELAY || '1000')
  }
}

// Determinar ambiente
const isDevelopment = import.meta.env.DEV
const config = isDevelopment ? API_CONFIG.development : API_CONFIG.production

// Interface para configuração de retry
interface RetryConfig {
  retryAttempts: number
  retryDelay: number
}

// Classe para gerenciar tentativas de retry
class RetryManager {
  private retryCount = 0
  private retryAttempts: number
  private retryDelay: number

  constructor(config: RetryConfig) {
    this.retryAttempts = config.retryAttempts
    this.retryDelay = config.retryDelay
  }

  shouldRetry(error: AxiosError): boolean {
    // Retry apenas para erros de rede ou 5xx
    const isNetworkError = !error.response
    const isServerError = error.response?.status && error.response.status >= 500
    
    return (isNetworkError || isServerError) && this.retryCount < this.retryAttempts
  }

  async retry<T>(requestFn: () => Promise<T>): Promise<T> {
    this.retryCount++
    
    // Aguardar antes de tentar novamente
    await new Promise(resolve => setTimeout(resolve, this.retryDelay * this.retryCount))
    
    return requestFn()
  }

  reset(): void {
    this.retryCount = 0
  }
}

// Criar instância do axios com configurações base
const api: AxiosInstance = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor para requisições
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Adicionar timestamp para cache busting
    if (config.params) {
      config.params._t = Date.now()
    }
    
    // Log de requisição em desenvolvimento
    if (isDevelopment) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }
    
    return config
  },
  (error: AxiosError) => {
    console.error('❌ Request Interceptor Error:', error)
    return Promise.reject(error)
  }
)

// Interceptor para respostas
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log de resposta em desenvolvimento
    if (isDevelopment) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    }
    
    return response
  },
  async (error: AxiosError) => {
    const retryManager = new RetryManager(config)
    
    // Tentar retry se aplicável
    if (retryManager.shouldRetry(error)) {
      console.warn(`⚠️ Tentativa de retry ${retryManager.retryCount + 1}/${config.retryAttempts}`)
      
      try {
        const retryResponse = await retryManager.retry(() => 
          api.request(error.config!)
        )
        retryManager.reset()
        return retryResponse
      } catch (retryError) {
        retryManager.reset()
        console.error('❌ Retry falhou:', retryError)
      }
    }
    
    // Tratamento de erros específicos
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          console.error('❌ Bad Request:', data)
          break
        case 401:
          console.error('❌ Unauthorized:', data)
          // TODO: Implementar redirecionamento para login
          break
        case 403:
          console.error('❌ Forbidden:', data)
          break
        case 404:
          console.error('❌ Not Found:', data)
          break
        case 500:
          console.error('❌ Internal Server Error:', data)
          break
        default:
          console.error(`❌ HTTP Error ${status}:`, data)
      }
    } else if (error.request) {
      console.error('❌ Network Error:', error.message)
    } else {
      console.error('❌ Request Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

// Função utilitária para criar URLs de API
export const createApiUrl = (endpoint: string, params?: Record<string, any>): string => {
  const url = new URL(endpoint, config.baseURL)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }
  
  return url.toString()
}

// Função utilitária para formatação de datas ISO
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString()
}

// Função utilitária para validação de resposta
export const validateApiResponse = <T>(response: AxiosResponse<T>): T => {
  if (response.status >= 200 && response.status < 300) {
    return response.data
  }
  
  throw new Error(`API response error: ${response.status}`)
}

// Exportar instância configurada
export default api

// Exportar configurações para uso em outros serviços
export { config as apiConfig }
