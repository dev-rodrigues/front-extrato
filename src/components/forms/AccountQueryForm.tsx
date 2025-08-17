/**
 * AccountQueryForm - Formulário de consulta de contas conforme RFCs
 * Baseado em RFC-Frontend-Interface.md - Consulta de Contas
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, Search, Building2, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Schema de validação conforme RFCs
const accountQuerySchema = z.object({
  agencia: z.string()
    .length(4, 'Agência deve ter exatamente 4 dígitos')
    .regex(/^\d{4}$/, 'Agência deve conter apenas números'),
  contaCorrente: z.string()
    .regex(/^(\d{2}\.\d{3}-\d|\d{5}-\d)$/, 'Formato inválido: XX.XXX-X ou XXXXX-X'),
  periodo: z.enum(['mesAno', 'datasEspecificas']).optional(),
  mes: z.number().min(1).max(12).optional(),
  ano: z.number().min(2000).max(2100).optional(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional()
}).refine((data) => {
  // Validação: mês/ano OU datas específicas, não ambos
  if (data.periodo === 'mesAno') {
    return data.mes && data.ano
  } else if (data.periodo === 'datasEspecificas') {
    return data.dataInicio && data.dataFim
  }
  return false
}, {
  message: 'Selecione mês/ano OU datas específicas',
  path: ['periodo']
}).refine((data) => {
  // Validação: data início <= data fim
  if (data.dataInicio && data.dataFim) {
    return new Date(data.dataInicio) <= new Date(data.dataFim)
  }
  return true
}, {
  message: 'Data de início deve ser menor ou igual à data de fim',
  path: ['dataFim']
})

type AccountQueryFormData = z.infer<typeof accountQuerySchema>

interface AccountQueryFormProps {
  onSubmit?: (data: AccountQueryFormData) => void
  loading?: boolean
  initialValues?: {
    agencia?: string
    contaCorrente?: string
    mes?: number
    ano?: number
    dataInicio?: string
    dataFim?: string
  }
}

/**
 * Formulário de consulta de contas bancárias
 * Implementa validações conforme RFCs:
 * - Agência: 4 dígitos
 * - Conta: XX.XXX-X ou XXXXX-X
 * - Período: mês/ano OU datas específicas (não ambos)
 * - Validação de datas
 */
export function AccountQueryForm({ onSubmit, loading, initialValues }: AccountQueryFormProps) {
  const navigate = useNavigate()
  const [periodType, setPeriodType] = useState<'mesAno' | 'datasEspecificas'>('mesAno')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<AccountQueryFormData>({
    resolver: zodResolver(accountQuerySchema),
    mode: 'onChange',
    defaultValues: {
      agencia: initialValues?.agencia || '',
      contaCorrente: initialValues?.contaCorrente || '',
      periodo: 'mesAno',
      mes: initialValues?.mes || undefined,
      ano: initialValues?.ano || new Date().getFullYear(),
      dataInicio: initialValues?.dataInicio || undefined,
      dataFim: initialValues?.dataFim || undefined
    }
  })

  // Observar mudanças nos campos para validação
  const watchedFields = watch(['agencia', 'contaCorrente', 'mes', 'ano', 'dataInicio', 'dataFim'])

  // Verificar se o formulário é válido
  const isFormValid = () => {
    const [agencia, contaCorrente, mes, ano, dataInicio, dataFim] = watchedFields
    
    // Campos obrigatórios básicos
    if (!agencia || !contaCorrente) return false
    
    // Validação de período
    if (periodType === 'mesAno') {
      return !!(mes && ano)
    } else {
      return !!(dataInicio && dataFim)
    }
  }

  const handleFormSubmit = (data: AccountQueryFormData) => {
    if (onSubmit) {
      onSubmit(data)
    } else {
      // Navegação padrão para detalhes da conta
      const params = new URLSearchParams()
      
      if (data.periodo === 'mesAno' && data.mes && data.ano) {
        params.append('mes', data.mes.toString())
        params.append('ano', data.ano.toString())
      } else if (data.periodo === 'datasEspecificas' && data.dataInicio && data.dataFim) {
        params.append('dataInicio', data.dataInicio)
        params.append('dataFim', data.dataFim)
      }

      const queryString = params.toString()
      const url = `/accounts/${data.agencia}/${data.contaCorrente}${queryString ? `?${queryString}` : ''}`
      
      navigate(url)
    }
  }

  const handlePeriodTypeChange = (value: string) => {
    const newPeriodType = value as 'mesAno' | 'datasEspecificas'
    setPeriodType(newPeriodType)
    
    // Definir o valor do campo periodo no formulário
    setValue('periodo', newPeriodType, { shouldValidate: true })
    
    // Limpar campos do outro tipo
    if (newPeriodType === 'mesAno') {
      setValue('dataInicio', undefined, { shouldValidate: true })
      setValue('dataFim', undefined, { shouldValidate: true })
    } else {
      setValue('mes', undefined, { shouldValidate: true })
      setValue('ano', undefined, { shouldValidate: true })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Consulta de Conta Bancária
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Dados da Conta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Agência */}
            <div className="space-y-2">
              <Label htmlFor="agencia" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Agência
              </Label>
              <Input
                id="agencia"
                placeholder="0000"
                maxLength={4}
                {...register('agencia')}
                className={errors.agencia ? 'border-red-500' : ''}
              />
              {errors.agencia && (
                <p className="text-sm text-red-500">{errors.agencia.message}</p>
              )}
            </div>

            {/* Conta Corrente */}
            <div className="space-y-2">
              <Label htmlFor="contaCorrente" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Conta Corrente
              </Label>
              <Input
                id="contaCorrente"
                placeholder="XX.XXX-X ou XXXXX-X"
                {...register('contaCorrente')}
                className={errors.contaCorrente ? 'border-red-500' : ''}
              />
              {errors.contaCorrente && (
                <p className="text-sm text-red-500">{errors.contaCorrente.message}</p>
              )}
            </div>
          </div>

          {/* Tipo de Período */}
          <div className="space-y-2">
            <Label>Tipo de Período</Label>
            <Select 
              value={watch('periodo')} 
              onValueChange={handlePeriodTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mesAno">Mês e Ano</SelectItem>
                <SelectItem value="datasEspecificas">Datas Específicas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campos de Período */}
          {periodType === 'mesAno' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mês */}
              <div className="space-y-2">
                <Label htmlFor="mes">Mês</Label>
                <Select 
                  value={watch('mes')?.toString() || ''} 
                  onValueChange={(value) => setValue('mes', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((mes) => (
                      <SelectItem key={mes} value={mes.toString()}>
                        {new Date(2000, mes - 1).toLocaleDateString('pt-BR', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.mes && (
                  <p className="text-sm text-red-500">{errors.mes.message}</p>
                )}
              </div>

              {/* Ano */}
              <div className="space-y-2">
                <Label htmlFor="ano">Ano</Label>
                <Select 
                  value={watch('ano')?.toString() || ''} 
                  onValueChange={(value) => setValue('ano', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map((ano) => (
                      <SelectItem key={ano} value={ano.toString()}>
                        {ano}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.ano && (
                  <p className="text-sm text-red-500">{errors.ano.message}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data Início */}
              <div className="space-y-2">
                <Label htmlFor="dataInicio" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Data de Início
                </Label>
                <Input
                  id="dataInicio"
                  type="date"
                  {...register('dataInicio')}
                  className={errors.dataInicio ? 'border-red-500' : ''}
                />
                {errors.dataInicio && (
                  <p className="text-sm text-red-500">{errors.dataInicio.message}</p>
                )}
              </div>

              {/* Data Fim */}
              <div className="space-y-2">
                <Label htmlFor="dataFim" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Data de Fim
                </Label>
                <Input
                  id="dataFim"
                  type="date"
                  {...register('dataFim')}
                  className={errors.dataFim ? 'border-red-500' : ''}
                />
                {errors.dataFim && (
                  <p className="text-sm text-red-500">{errors.dataFim.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Erro geral do formulário */}
          {errors.periodo && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-700">{errors.periodo.message}</p>
            </div>
          )}

          {/* Botão de Envio */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!isFormValid() || loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Consultando...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Consultar Conta
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
