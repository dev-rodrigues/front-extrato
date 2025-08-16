import { z } from 'zod'

export const paginationRequestSchema = z.object({
  page: z.number()
    .int('Página deve ser um número inteiro')
    .min(0, 'Página deve ser >= 0')
    .default(0),
  
  size: z.number()
    .int('Tamanho deve ser um número inteiro')
    .min(1, 'Tamanho deve ser >= 1')
    .max(100, 'Tamanho deve ser <= 100')
    .default(20)
})

export const paginationResponseSchema = z.object({
  content: z.array(z.any()),
  pageNumber: z.number(),
  pageSize: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
  isFirst: z.boolean(),
  isLast: z.boolean()
})

export type PaginationRequest = z.infer<typeof paginationRequestSchema>
export type PaginationResponse<T> = Omit<z.infer<typeof paginationResponseSchema>, 'content'> & {
  content: T[]
}

// Schema para validação de filtros de data
export const dateRangeSchema = z.object({
  dataInicio: z.string()
    .min(1, 'Data de início é obrigatória')
    .refine((date) => {
      const inputDate = new Date(date)
      return !isNaN(inputDate.getTime())
    }, 'Data de início deve ser uma data válida'),
  
  dataFim: z.string()
    .min(1, 'Data de fim é obrigatória')
    .refine((date) => {
      const inputDate = new Date(date)
      return !isNaN(inputDate.getTime())
    }, 'Data de fim deve ser uma data válida')
}).refine((data) => {
  const dataInicio = new Date(data.dataInicio)
  const dataFim = new Date(data.dataFim)
  return dataInicio <= dataFim
}, {
  message: 'Data de início deve ser anterior ou igual à data de fim',
  path: ['dataFim']
})

export type DateRange = z.infer<typeof dateRangeSchema>
