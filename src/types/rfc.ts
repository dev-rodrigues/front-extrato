/**
 * Types TypeScript baseados EXCLUSIVAMENTE nos RFCs da API
 * Nenhum tipo adicional ou funcionalidade não documentada
 */

// ============================================================================
// ESTRUTURAS BASE
// ============================================================================

/**
 * Estrutura genérica para todas as respostas paginadas
 */
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

/**
 * Parâmetros de consulta para contas bancárias
 */
export interface AccountQueryParams {
  agencia: string
  contaCorrente: string
  mes?: number
  ano?: number
  dataInicio?: string
  dataFim?: string
  page?: number
  size?: number
}

/**
 * Parâmetros de consulta para schedule
 */
export interface ScheduleQueryParams {
  jobName?: string
}

// ============================================================================
// MONITORAMENTO DE SCHEDULE
// ============================================================================

/**
 * Status de execução dos jobs
 */
export const JobExecutionStatus = {
  STARTING: "STARTING",      // Iniciando
  RUNNING: "RUNNING",        // Em execução
  COMPLETED: "COMPLETED",    // Concluído
  FAILED: "FAILED",          // Falhou
  CANCELLED: "CANCELLED"     // Cancelado
} as const

export type JobExecutionStatus = typeof JobExecutionStatus[keyof typeof JobExecutionStatus]

/**
 * Resposta detalhada de progresso de um job
 */
export interface JobProgressResponse {
  jobName: string
  status: JobExecutionStatus
  statusDescription: string
  startTime: string
  endTime: string | null
  durationMs: number | null
  recordsProcessed: number | null
  accountsProcessed: number | null
  progressPercentage: number | null
  errorMessage: string | null
  estimatedTimeRemaining: number | null
  lastUpdated: string
}

/**
 * Resposta resumida de progresso geral dos jobs
 */
export interface JobProgressSummaryResponse {
  activeJobs: number
  completedJobs: number
  failedJobs: number
  cancelledJobs: number
  averageExecutionTime: number
  successRate: number
  totalRecordsProcessed: number
  totalAccountsProcessed: number
  activeJobsList: JobProgressResponse[]
}

/**
 * Estatísticas do sistema
 */
export interface SystemStatsResponse {
  totalJobsExecuted: number
  successRate: number
  averageExecutionTime: number
  totalRecordsProcessed: number
  systemUptime: number
  lastJobExecution: string
}

/**
 * Resposta de health check
 */
export interface HealthResponse {
  status: string
  timestamp: string
  version: string
}

// ============================================================================
// CONSULTA DE CONTAS BANCÁRIAS
// ============================================================================

/**
 * Resposta de logs de consulta
 */
export interface AccountQueryLogResponse {
  id: number
  banco: string
  agencia: string
  contaCorrente: string
  consultaPeriodoDe: string
  consultaPeriodoAte: string
  erroCodigo: number
  erroDescricao: string | null
  dataHoraTentativa: string
  dataHora: string
}

/**
 * Resposta de importações
 */
export interface AccountImportResponse {
  id: number
  layoutId: number | null
  documentId: number | null
  bancoOrigem: string | null
  arquivoNome: string | null
  arquivoGeracaoDataHora: string | null
  arquivoNumeroSequencial: number | null
  arquivoNumeroVersaoLayOut: string | null
  qtdLotes: number | null
  qtdRegistros: number | null
  qtdContas: number | null
  dataHora: string | null
  userId: number | null
  consultaAgencia: string | null
  consultaContaCorrente: string | null
  consultaPeriodoDe: string | null
  consultaPeriodoAte: string | null
}

/**
 * Resposta de movimentações
 */
export interface AccountMovementResponse {
  id: number
  importId: number | null
  numeroSequencialExtrato: number | null
  numeroSequencialNoArquivo: number | null
  numeroSequencialNoLote: number | null
  banco: string | null
  agencia: string | null
  agenciaDV: string | null
  contaCorrente: string | null
  contaCorrenteDV: string | null
  contaCorrenteSIC: string | null
  contaCorrenteDescricao: string | null
  movimentoData: string | null
  movimentoDataContabil: string | null
  movimentoTipo: string | null
  movimentoValor: number | null
  movimentoSaldo: number | null
  posicaoSaldo: string | null
  natureza: string | null
  complementoTipo: string | null
  complementoBancoOrigem: string | null
  complementoAgenciaOrigem: string | null
  complementoContaCorrenteOrigem: string | null
  complementoContaCorrenteDVOrigem: string | null
  complementoAlfa: string | null
  isencaoCPMF: string | null
  movimentoCategoria: string | null
  codigoHistorico: string | null
  descricaoHistorico: string | null
  documentoNumero: string | null
  somatorioValoresADebito: number | null
  somatorioValoresACredito: number | null
  numeroLancamentos: number | null
  numeroCpfCnpjContrapartida: string | null
  indicadorTipoPessoaContrapartida: string | null
}

// ============================================================================
// RESPOSTAS PAGINADAS ESPECÍFICAS
// ============================================================================

/**
 * Resposta paginada de logs de consulta
 */
export type AccountQueryLogsResponse = PaginationResponse<AccountQueryLogResponse>

/**
 * Resposta paginada de importações
 */
export type AccountImportsResponse = PaginationResponse<AccountImportResponse>

/**
 * Resposta paginada de movimentações
 */
export type AccountMovementsResponse = PaginationResponse<AccountMovementResponse>

/**
 * Resposta de importação com movimentações
 * Endpoint: GET /api/accounts/imports/{importId}
 */
export interface ImportWithMovementsResponse {
  importacao: {
    id: number
    layoutId: number
    documentId: number
    bancoOrigem: string
    arquivoNome: string
    arquivoGeracaoDataHora: string
    arquivoNumeroSequencial: number
    arquivoNumeroVersaoLayOut: string
    qtdLotes: number
    qtdRegistros: number
    qtdContas: number
    dataHora: string
    userId: number
    consultaAgencia: string
    consultaContaCorrente: string
    consultaPeriodoDe: string
    consultaPeriodoAte: string
  }
  movimentacoes: PaginationResponse<AccountMovementResponse>
  totalMovimentacoes: number
}

// ============================================================================
// TIPOS PARA FORMULÁRIOS
// ============================================================================

/**
 * Formulário de consulta de conta
 */
export interface AccountQueryFormData {
  agencia: string
  contaCorrente: string
  periodoType: 'mesAno' | 'dataEspecifica'
  mes?: number
  ano?: number
  dataInicio?: string
  dataFim?: string
}

/**
 * Filtros de período para listagens
 */
export interface PeriodFilters {
  periodoType: 'mesAno' | 'dataEspecifica'
  mes?: number
  ano?: number
  dataInicio?: string
  dataFim?: string
}

// ============================================================================
// TIPOS PARA NAVEGAÇÃO
// ============================================================================

/**
 * Parâmetros de rota para detalhes da conta
 */
export interface AccountRouteParams {
  agencia: string
  contaCorrente: string
}

/**
 * Estado de navegação para breadcrumbs
 */
export interface NavigationState {
  currentPage: string
  breadcrumbs: Array<{
    label: string
    path: string
    active: boolean
  }>
}

// ============================================================================
// TIPOS PARA COMPONENTES UI
// ============================================================================

/**
 * Estado de loading para componentes
 */
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

/**
 * Estado de paginação para componentes
 */
export interface PaginationState {
  currentPage: number
  pageSize: number
  totalPages: number
  totalElements: number
}

/**
 * Estado de filtros para componentes
 */
export interface FilterState {
  periodFilters: PeriodFilters
  appliedFilters: Record<string, any>
}

// ============================================================================
// TIPOS PARA VALIDAÇÃO
// ============================================================================

/**
 * Erro de validação
 */
export interface ValidationError {
  field: string
  message: string
}

/**
 * Resultado de validação
 */
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// ============================================================================
// TIPOS PARA NOTIFICAÇÕES E ALERTAS
// ============================================================================

/**
 * Tipo de notificação
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

/**
 * Notificação do sistema
 */
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  duration?: number
}

// ============================================================================
// TIPOS PARA CONFIGURAÇÃO
// ============================================================================

/**
 * Configuração da API
 */
export interface ApiConfig {
  baseURL: string
  timeout: number
  retryAttempts: number
  retryDelay: number
}

/**
 * Configuração do ambiente
 */
export interface EnvironmentConfig {
  name: 'development' | 'production'
  api: ApiConfig
  debug: boolean
}
