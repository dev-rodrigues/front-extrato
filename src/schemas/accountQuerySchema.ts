import { z } from "zod"

/**
 * Schema de validação para consulta de contas bancárias
 * Inclui validações de formato, período e paginação
 */
export const accountQuerySchema = z.object({
  agencia: z.string()
    .min(1, "Agência é obrigatória")
    .length(4, "Agência deve ter exatamente 4 dígitos")
    .regex(/^\d{4}$/, "Agência deve conter apenas números"),
  
  contaCorrente: z.string()
    .min(1, "Conta corrente é obrigatória")
    .regex(/^\d{2}\.\d{3}-\d$/, "Formato: XX.XXX-X (ex: 12.345-6)"),
  
  dataInicio: z.date(),
  
  dataFim: z.date(),
  
  page: z.number()
    .min(0, "Página deve ser >= 0")
    .default(0),
  
  size: z.number()
    .min(1, "Tamanho deve ser >= 1")
    .max(100, "Tamanho máximo é 100")
    .default(20),
  
  tipoConsulta: z.enum(['logs', 'imports', 'movements', 'all'])
    .default('all')
}).refine((data) => {
  // Validação: Data de início deve ser anterior ou igual à data de fim
  return data.dataInicio <= data.dataFim
}, {
  message: "Data de início deve ser anterior ou igual à data de fim",
  path: ["dataFim"]
}).refine((data) => {
  // Validação: Período máximo de 1 ano
  const diffInDays = Math.ceil((data.dataFim.getTime() - data.dataInicio.getTime()) / (1000 * 60 * 60 * 24))
  return diffInDays <= 365
}, {
  message: "Período máximo permitido é de 1 ano",
  path: ["dataFim"]
})

/**
 * Schema para filtros avançados de consulta
 */
export const advancedFiltersSchema = z.object({
  agencias: z.array(z.string()).optional(),
  contas: z.array(z.string()).optional(),
  tiposMovimento: z.array(z.string()).optional(),
  valorMin: z.number().min(0).optional(),
  valorMax: z.number().min(0).optional(),
  status: z.array(z.string()).optional(),
  erroCodigo: z.array(z.number()).optional()
})

/**
 * Schema para exportação de dados
 */
export const exportRequestSchema = z.object({
  tipo: z.enum(['CONSULTAS', 'IMPORTACOES', 'MOVIMENTACOES']),
  formato: z.enum(['PDF', 'EXCEL', 'CSV']),
  filtros: advancedFiltersSchema.optional(),
  incluirHeaders: z.boolean().default(true),
  separador: z.string().optional()
})

/**
 * Schema para configurações de consulta
 */
export const queryConfigSchema = z.object({
  autoRefresh: z.boolean().default(false),
  refreshInterval: z.number().min(5000).max(300000).default(30000),
  maxResults: z.number().min(10).max(1000).default(100),
  showAdvancedFilters: z.boolean().default(false),
  defaultPeriod: z.enum(['today', 'week', 'month', 'quarter', 'year']).default('month')
})

// Tipos derivados dos schemas
export type AccountQueryFormData = z.infer<typeof accountQuerySchema>
export type AdvancedFilters = z.infer<typeof advancedFiltersSchema>
export type ExportRequest = z.infer<typeof exportRequestSchema>
export type QueryConfig = z.infer<typeof queryConfigSchema>

// Validações auxiliares
export const validateAgencyFormat = (agencia: string): boolean => {
  return /^\d{4}$/.test(agencia)
}

export const validateAccountFormat = (contaCorrente: string): boolean => {
  return /^\d{2}\.\d{3}-\d$/.test(contaCorrente)
}

export const validateDateRange = (dataInicio: Date, dataFim: Date): boolean => {
  return dataInicio <= dataFim
}

export const validatePeriodLength = (dataInicio: Date, dataFim: Date): boolean => {
  const diffInDays = Math.ceil((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24))
  return diffInDays <= 365
}

// Mensagens de erro padronizadas
export const ERROR_MESSAGES = {
  AGENCY_REQUIRED: "Agência é obrigatória",
  AGENCY_FORMAT: "Agência deve ter 4 dígitos numéricos",
  ACCOUNT_REQUIRED: "Conta corrente é obrigatória",
  ACCOUNT_FORMAT: "Formato: XX.XXX-X (ex: 12.345-6)",
  DATE_INICIO_REQUIRED: "Data de início é obrigatória",
  DATE_FIM_REQUIRED: "Data de fim é obrigatória",
  DATE_RANGE_INVALID: "Data de início deve ser anterior ou igual à data de fim",
  PERIOD_TOO_LONG: "Período máximo permitido é de 1 ano",
  PAGE_INVALID: "Página deve ser >= 0",
  SIZE_INVALID: "Tamanho deve estar entre 1 e 100"
} as const
