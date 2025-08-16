import { z } from 'zod'

export const accountQuerySchema = z.object({
  agencia: z.string()
    .length(4, 'Agência deve ter exatamente 4 dígitos')
    .regex(/^\d{4}$/, 'Agência deve conter apenas números')
    .transform((val) => val.trim()),
  
  contaCorrente: z.string()
    .regex(/^\d{2}\.\d{3}-\d$/, 'Formato inválido. Use: XX.XXX-X')
    .transform((val) => val.trim()),
  
  dataInicio: z.string()
    .min(1, 'Data de início é obrigatória')
    .refine((date) => {
      const inputDate = new Date(date)
      const today = new Date()
      return inputDate <= today
    }, 'Data de início não pode ser futura'),
  
  dataFim: z.string()
    .min(1, 'Data de fim é obrigatória')
    .refine((date) => {
      const inputDate = new Date(date)
      const today = new Date()
      return inputDate <= today
    }, 'Data de fim não pode ser futura'),
  
  page: z.number()
    .int('Página deve ser um número inteiro')
    .min(0, 'Página deve ser >= 0')
    .default(0),
  
  size: z.number()
    .int('Tamanho deve ser um número inteiro')
    .min(1, 'Tamanho deve ser >= 1')
    .max(100, 'Tamanho deve ser <= 100')
    .default(20)
}).refine((data) => {
  const dataInicio = new Date(data.dataInicio)
  const dataFim = new Date(data.dataFim)
  return dataInicio <= dataFim
}, {
  message: 'Data de início deve ser anterior ou igual à data de fim',
  path: ['dataFim']
})

export type AccountQueryFormData = z.infer<typeof accountQuerySchema>

// Schema para validação de resposta da API
export const accountQueryResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    agencia: z.string(),
    contaCorrente: z.string(),
    periodo: z.string(),
    consultadoEm: z.string()
  }).optional(),
  error: z.string().optional(),
  timestamp: z.string()
})

export type AccountQueryResponse = z.infer<typeof accountQueryResponseSchema>
