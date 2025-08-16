// Tipos base para paginação e respostas da API
export interface PaginationRequest {
  page: number
  size: number
}

export interface PaginationResponse<T> {
  content: T[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  isFirst: boolean
  isLast: boolean
}

// Tipos para consulta de contas
export interface AccountQueryRequest {
  agencia: string
  contaCorrente: string
  dataInicio: Date
  dataFim: Date
  page: number
  size: number
}

export interface AccountQueryLogResponse {
  id: string
  banco: string
  agencia: string
  contaCorrente: string
  consultaPeriodoDe: Date
  consultaPeriodoAte: Date
  erroCodigo: number
  erroDescricao?: string
  dataHoraTentativa: Date
  dataHora: Date
  status: 'SUCCESS' | 'ERROR' | 'PENDING'
}

// Tipos para importações
export interface AccountImportResponse {
  id: string
  layoutId?: string
  arquivoNome?: string
  arquivoGeracaoDataHora?: Date
  qtdRegistros?: number
  qtdContas?: number
  dataHora?: Date
  consultaAgencia?: string
  consultaContaCorrente?: string
  consultaPeriodoDe?: Date
  consultaPeriodoAte?: Date
  status: 'SUCCESS' | 'ERROR' | 'PROCESSING'
}

// Tipos para movimentações
export interface AccountMovementResponse {
  id: string
  numeroSequencialExtrato?: string
  movimentoData?: Date
  movimentoTipo?: string
  movimentoValor?: number
  movimentoSaldo?: number
  posicaoSaldo?: string
  descricaoHistorico?: string
  documentoNumero?: string
  numeroCpfCnpjContrapartida?: string
  agencia: string
  contaCorrente: string
}

// Tipos para dashboard e métricas
export interface DashboardMetrics {
  totalContas: number
  totalConsultas: number
  totalImportacoes: number
  totalMovimentacoes: number
  consultasHoje: number
  importacoesHoje: number
  erroRate: number
  ultimaAtualizacao: Date
}

export interface ScheduleJobStatus {
  id: string
  name: string
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  startTime: Date
  endTime?: Date
  progress: number
  message?: string
}

export interface JobProgressSummary {
  activeJobs: number
  completedJobs: number
  failedJobs: number
  cancelledJobs: number
  averageExecutionTime: number
  successRate: number
  totalRecordsProcessed: number
  totalAccountsProcessed: number
}

// Tipos para notificações
export interface Notification {
  id: string
  type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

export interface Alert {
  id: string
  type: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  message: string
  timestamp: Date
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'ACTIVE' | 'RESOLVED' | 'ACKNOWLEDGED'
}

// Tipos para relatórios
export interface ReportRequest {
  tipo: 'CONSULTAS' | 'IMPORTACOES' | 'MOVIMENTACOES' | 'PERFORMANCE'
  dataInicio: Date
  dataFim: Date
  formato: 'PDF' | 'EXCEL' | 'CSV'
  filtros?: Record<string, any>
}

export interface ReportResponse {
  id: string
  nome: string
  tipo: string
  dataGeracao: Date
  tamanho: number
  urlDownload: string
  status: 'GENERATING' | 'READY' | 'ERROR'
}

// Tipos para configurações
export interface SystemConfig {
  api: {
    baseUrl: string
    timeout: number
    retryAttempts: number
    retryDelay: number
  }
  email: {
    enabled: boolean
    recipients: string[]
    templates: string[]
  }
  schedule: {
    cron: string
    maxConcurrentJobs: number
    retryAttempts: number
  }
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'pt-BR' | 'en'
  notifications: {
    email: boolean
    push: boolean
    toast: boolean
  }
  dashboard: {
    defaultView: 'overview' | 'monitoring' | 'analytics'
    refreshInterval: number
    showCharts: boolean
  }
}

// Tipos para erros da API
export interface ApiError {
  code: string
  message: string
  details?: string
  timestamp: Date
  path: string
  status: number
}

// Tipos para respostas de sucesso
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp: Date
}

// Tipos para filtros avançados
export interface AdvancedFilters {
  agencias?: string[]
  contas?: string[]
  tiposMovimento?: string[]
  valorMin?: number
  valorMax?: number
  dataInicio?: Date
  dataFim?: Date
  status?: string[]
  erroCodigo?: number[]
}

// Tipos para exportação
export interface ExportRequest {
  tipo: 'CONSULTAS' | 'IMPORTACOES' | 'MOVIMENTACOES'
  formato: 'PDF' | 'EXCEL' | 'CSV'
  filtros: AdvancedFilters
  incluirHeaders: boolean
  separador?: string
}

// Tipos para cache e performance
export interface CacheConfig {
  enabled: boolean
  ttl: number
  maxSize: number
  strategy: 'LRU' | 'FIFO' | 'TTL'
}

export interface PerformanceMetrics {
  responseTime: number
  throughput: number
  errorRate: number
  cacheHitRate: number
  memoryUsage: number
  cpuUsage: number
}

// Tipos para auditoria
export interface AuditLog {
  id: string
  userId?: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, any>
  timestamp: Date
  ipAddress?: string
  userAgent?: string
}

// Tipos para integrações externas
export interface BBIntegrationStatus {
  connected: boolean
  lastSync: Date
  tokenExpiry: Date
  rateLimitRemaining: number
  errors: ApiError[]
}

export interface EmailIntegrationStatus {
  connected: boolean
  lastSent: Date
  queueSize: number
  errors: ApiError[]
}

// Tipos para websockets e tempo real
export interface RealTimeUpdate {
  type: 'METRICS' | 'ALERT' | 'JOB_STATUS' | 'NOTIFICATION'
  data: any
  timestamp: Date
  userId?: string
}

// Tipos para validação
export interface ValidationError {
  field: string
  message: string
  code: string
  value?: any
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

// Tipos para busca e pesquisa
export interface SearchRequest {
  query: string
  filters?: AdvancedFilters
  page: number
  size: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

export interface SearchResult<T> {
  items: T[]
  total: number
  page: number
  size: number
  query: string
  suggestions?: string[]
}

// Tipos para backup e restauração
export interface BackupConfig {
  enabled: boolean
  schedule: string
  retention: number
  compression: boolean
  encryption: boolean
}

export interface BackupStatus {
  lastBackup: Date
  nextBackup: Date
  status: 'SUCCESS' | 'FAILED' | 'RUNNING'
  size: number
  files: number
}

// Tipos para monitoramento de saúde
export interface HealthCheck {
  status: 'UP' | 'DOWN' | 'DEGRADED'
  checks: {
    database: HealthStatus
    api: HealthStatus
    external: HealthStatus
    cache: HealthStatus
  }
  timestamp: Date
  version: string
}

export interface HealthStatus {
  status: 'UP' | 'DOWN'
  message?: string
  details?: Record<string, any>
}

// Tipos para logs e debugging
export interface LogEntry {
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'
  message: string
  timestamp: Date
  logger: string
  thread?: string
  context?: Record<string, any>
  stackTrace?: string
}

// Tipos para métricas de negócio
export interface BusinessMetrics {
  totalConsultas: number
  consultasSucesso: number
  consultasErro: number
  taxaSucesso: number
  tempoMedioResposta: number
  contasAtivas: number
  importacoesDiarias: number
  movimentacoesProcessadas: number
  valorTotalMovimentado: number
  periodo: {
    inicio: Date
    fim: Date
  }
}

// Tipos para configurações de segurança
export interface SecurityConfig {
  maxLoginAttempts: number
  sessionTimeout: number
  passwordPolicy: {
    minLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
    requireSpecialChars: boolean
  }
  mfa: {
    enabled: boolean
    method: 'TOTP' | 'SMS' | 'EMAIL'
  }
}

// Tipos para usuários e autenticação
export interface User {
  id: string
  username: string
  email: string
  nome: string
  role: 'ADMIN' | 'USER' | 'VIEWER'
  ativo: boolean
  ultimoLogin?: Date
  preferencias: UserPreferences
  permissoes: string[]
}

export interface LoginRequest {
  username: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}

// Tipos para histórico de ações
export interface ActionHistory {
  id: string
  userId: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, any>
  timestamp: Date
  ipAddress?: string
  success: boolean
  errorMessage?: string
}

// Tipos para configurações de ambiente
export interface EnvironmentConfig {
  name: 'development' | 'staging' | 'production'
  debug: boolean
  logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'
  cors: {
    enabled: boolean
    origins: string[]
    methods: string[]
    headers: string[]
  }
  rateLimit: {
    enabled: boolean
    maxRequests: number
    windowMs: number
  }
}

// Tipos para testes e qualidade
export interface TestResult {
  name: string
  status: 'PASSED' | 'FAILED' | 'SKIPPED'
  duration: number
  error?: string
  details?: Record<string, any>
  timestamp: Date
}

export interface QualityMetrics {
  codeCoverage: number
  testPassRate: number
  performanceScore: number
  accessibilityScore: number
  seoScore: number
  lastUpdated: Date
}
