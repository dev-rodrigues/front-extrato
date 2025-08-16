import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Star, 
  History, 
  Download, 
  Share2, 
  Calendar,
  Building2,
  CreditCard,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  getQueryLogs, 
  getImports, 
  getMovements,
  validateAccount,
  type AccountQueryParams 
} from '@/services/accountService'

/**
 * Schema de validação para consulta avançada
 */
const advancedQuerySchema = z.object({
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
      const selectedDate = new Date(date)
      const today = new Date()
      return selectedDate <= today
    }, 'Data de início não pode ser futura'),
  dataFim: z.string()
    .min(1, 'Data de fim é obrigatória')
    .refine((date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      return selectedDate <= today
    }, 'Data de fim não pode ser futura'),
  tipoConsulta: z.enum(['logs', 'imports', 'movements', 'all']).default('all'),
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(20)
}).refine((data) => {
  const dataInicio = new Date(data.dataInicio)
  const dataFim = new Date(data.dataFim)
  return dataInicio <= dataFim
}, {
  message: 'Data de início deve ser anterior ou igual à data de fim',
  path: ['dataFim']
})

type AdvancedQueryFormData = z.infer<typeof advancedQuerySchema>

interface AdvancedAccountQueryFormProps {
  onSubmit: (data: AdvancedQueryFormData) => void
  onCancel?: () => void
  initialData?: Partial<AdvancedQueryFormData>
  loading?: boolean
}

export const AdvancedAccountQueryForm: React.FC<AdvancedAccountQueryFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  loading = false
}) => {
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    message: string
    type: 'success' | 'error' | 'warning'
  } | null>(null)
  const [recentQueries, setRecentQueries] = useState<Array<{
    agencia: string
    contaCorrente: string
    dataInicio: string
    dataFim: string
    timestamp: Date
  }>>([])
  const [favoriteQueries, setFavoriteQueries] = useState<Array<{
    id: string
    agencia: string
    contaCorrente: string
    dataInicio: string
    dataFim: string
    name: string
  }>>([])

  const form = useForm<AdvancedQueryFormData>({
    resolver: zodResolver(advancedQuerySchema),
    defaultValues: {
      agencia: initialData?.agencia || '',
      contaCorrente: initialData?.contaCorrente || '',
      dataInicio: initialData?.dataInicio || '',
      dataFim: initialData?.dataFim || '',
      tipoConsulta: initialData?.tipoConsulta || 'all',
      page: initialData?.page || 0,
      size: initialData?.size || 20
    }
  })

  // Carregar consultas recentes e favoritos do localStorage
  useEffect(() => {
    const savedRecent = localStorage.getItem('recentQueries')
    const savedFavorites = localStorage.getItem('favoriteQueries')
    
    if (savedRecent) {
      setRecentQueries(JSON.parse(savedRecent))
    }
    
    if (savedFavorites) {
      setFavoriteQueries(JSON.parse(savedFavorites))
    }
  }, [])

  // Validar conta em tempo real
  const validateAccountRealTime = async (agencia: string, contaCorrente: string) => {
    if (agencia.length === 4 && contaCorrente.match(/^\d{2}\.\d{3}-\d$/)) {
      setIsValidating(true)
      try {
        const isValid = await validateAccount(agencia, contaCorrente)
        setValidationResult({
          isValid,
          message: isValid ? 'Conta válida' : 'Conta não encontrada',
          type: isValid ? 'success' : 'warning'
        })
      } catch (error) {
        setValidationResult({
          isValid: false,
          message: 'Erro ao validar conta',
          type: 'error'
        })
      } finally {
        setIsValidating(false)
      }
    } else {
      setValidationResult(null)
    }
  }

  // Adicionar aos favoritos
  const addToFavorites = () => {
    const formData = form.getValues()
    const newFavorite = {
      id: Date.now().toString(),
      agencia: formData.agencia,
      contaCorrente: formData.contaCorrente,
      dataInicio: formData.dataInicio,
      dataFim: formData.dataFim,
      name: `Ag. ${formData.agencia} / Conta ${formData.contaCorrente}`
    }
    
    const updatedFavorites = [...favoriteQueries, newFavorite]
    setFavoriteQueries(updatedFavorites)
    localStorage.setItem('favoriteQueries', JSON.stringify(updatedFavorites))
  }

  // Executar consulta favorita
  const executeFavorite = (favorite: typeof favoriteQueries[0]) => {
    form.setValue('agencia', favorite.agencia)
    form.setValue('contaCorrente', favorite.contaCorrente)
    form.setValue('dataInicio', favorite.dataInicio)
    form.setValue('dataFim', favorite.dataFim)
  }

  // Executar consulta recente
  const executeRecent = (recent: typeof recentQueries[0]) => {
    form.setValue('agencia', recent.agencia)
    form.setValue('contaCorrente', recent.contaCorrente)
    form.setValue('dataInicio', recent.dataInicio)
    form.setValue('dataFim', recent.dataFim)
  }

  // Salvar consulta recente
  const saveRecentQuery = (data: AdvancedQueryFormData) => {
    const newRecent = {
      agencia: data.agencia,
      contaCorrente: data.contaCorrente,
      dataInicio: data.dataInicio,
      dataFim: data.dataFim,
      timestamp: new Date()
    }
    
    const updatedRecent = [newRecent, ...recentQueries.filter(q => 
      !(q.agencia === data.agencia && q.contaCorrente === data.contaCorrente)
    )].slice(0, 10)
    
    setRecentQueries(updatedRecent)
    localStorage.setItem('recentQueries', JSON.stringify(updatedRecent))
  }

  const handleSubmit = async (data: AdvancedQueryFormData) => {
    saveRecentQuery(data)
    onSubmit(data)
  }

  return (
    <div className="space-y-6">
      {/* Formulário Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Consulta Avançada de Conta</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Agência e Conta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agencia">Agência</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="agencia"
                    placeholder="1234"
                    maxLength={4}
                    className="pl-10"
                    {...form.register('agencia', {
                      onChange: (e) => {
                        const agencia = e.target.value
                        const contaCorrente = form.getValues('contaCorrente')
                        if (agencia.length === 4 && contaCorrente) {
                          validateAccountRealTime(agencia, contaCorrente)
                        }
                      }
                    })}
                  />
                </div>
                {form.formState.errors.agencia && (
                  <p className="text-sm text-red-500 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{form.formState.errors.agencia.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contaCorrente">Conta Corrente</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contaCorrente"
                    placeholder="12.345-6"
                    className="pl-10"
                    {...form.register('contaCorrente', {
                      onChange: (e) => {
                        const contaCorrente = e.target.value
                        const agencia = form.getValues('agencia')
                        if (contaCorrente.match(/^\d{2}\.\d{3}-\d$/) && agencia.length === 4) {
                          validateAccountRealTime(agencia, contaCorrente)
                        }
                      }
                    })}
                  />
                </div>
                {form.formState.errors.contaCorrente && (
                  <p className="text-sm text-red-500 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{form.formState.errors.contaCorrente.message}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Validação em Tempo Real */}
            {validationResult && (
              <div className={cn(
                'p-3 rounded-lg border flex items-center space-x-2',
                validationResult.type === 'success' && 'bg-green-50 border-green-200 text-green-700',
                validationResult.type === 'warning' && 'bg-yellow-50 border-yellow-200 text-yellow-700',
                validationResult.type === 'error' && 'bg-red-50 border-red-200 text-red-700'
              )}>
                {isValidating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                ) : (
                  validationResult.type === 'success' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )
                )}
                <span className="text-sm font-medium">{validationResult.message}</span>
              </div>
            )}

            {/* Período de Consulta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data de Início</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dataInicio"
                    type="date"
                    className="pl-10"
                    {...form.register('dataInicio')}
                  />
                </div>
                {form.formState.errors.dataInicio && (
                  <p className="text-sm text-red-500">{form.formState.errors.dataInicio.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataFim">Data de Fim</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dataFim"
                    type="date"
                    className="pl-10"
                    {...form.register('dataFim')}
                  />
                </div>
                {form.formState.errors.dataFim && (
                  <p className="text-sm text-red-500">{form.formState.errors.dataFim.message}</p>
                )}
              </div>
            </div>

            {/* Tipo de Consulta */}
            <div className="space-y-2">
              <Label htmlFor="tipoConsulta">Tipo de Consulta</Label>
              <Controller
                name="tipoConsulta"
                control={form.control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { value: 'all', label: 'Todas', icon: Search },
                      { value: 'logs', label: 'Logs', icon: History },
                      { value: 'imports', label: 'Importações', icon: Download },
                      { value: 'movements', label: 'Movimentações', icon: CreditCard }
                    ].map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={field.value === option.value ? 'default' : 'outline'}
                        className="flex items-center space-x-2"
                        onClick={() => field.onChange(option.value)}
                      >
                        <option.icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </Button>
                    ))}
                  </div>
                )}
              />
            </div>

            {/* Ações */}
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                type="submit" 
                disabled={loading || isValidating}
                className="flex items-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>{loading ? 'Consultando...' : 'Realizar Consulta'}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={addToFavorites}
                className="flex items-center space-x-2"
              >
                <Star className="h-4 w-4" />
                <span>Adicionar aos Favoritos</span>
              </Button>

              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Consultas Favoritas */}
      {favoriteQueries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Consultas Favoritas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {favoriteQueries.map((favorite) => (
                <div
                  key={favorite.id}
                  className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => executeFavorite(favorite)}
                >
                  <div className="font-medium text-sm">{favorite.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {favorite.dataInicio} - {favorite.dataFim}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consultas Recentes */}
      {recentQueries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Consultas Recentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentQueries.slice(0, 5).map((recent, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => executeRecent(recent)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Ag. {recent.agencia}</span>
                      <span className="mx-2">/</span>
                      <span className="font-medium">Conta {recent.contaCorrente}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {recent.timestamp.toLocaleDateString('pt-BR')}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {recent.dataInicio} - {recent.dataFim}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AdvancedAccountQueryForm
