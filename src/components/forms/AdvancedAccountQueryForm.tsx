import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, Search, Filter, Download, RefreshCw } from 'lucide-react'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { 
  accountQuerySchema, 
  type AccountQueryFormData,
  type AdvancedFilters,
  type ExportRequest
} from '@/schemas/accountQuerySchema'

interface AdvancedAccountQueryFormProps {
  onSubmit: (data: AccountQueryFormData) => void
  onExport?: (data: ExportRequest) => void
  onAdvancedFiltersChange?: (filters: AdvancedFilters) => void
  loading?: boolean
  initialData?: Partial<AccountQueryFormData>
}

/**
 * Formulário avançado para consulta de contas bancárias
 * Inclui validações, filtros avançados e opções de exportação
 */
export const AdvancedAccountQueryForm = ({
  onSubmit,
  onExport,
  onAdvancedFiltersChange,
  loading = false,
  initialData
}: AdvancedAccountQueryFormProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [exportFormat, setExportFormat] = useState<'PDF' | 'EXCEL' | 'CSV'>('PDF')
  const [includeHeaders, setIncludeHeaders] = useState(true)

  const form = useForm<any>({
    resolver: zodResolver(accountQuerySchema),
    defaultValues: {
      agencia: initialData?.agencia || '',
      contaCorrente: initialData?.contaCorrente || '',
      dataInicio: initialData?.dataInicio || subDays(new Date(), 30),
      dataFim: initialData?.dataFim || new Date(),
      page: initialData?.page || 0,
      size: initialData?.size || 20,
      tipoConsulta: initialData?.tipoConsulta || 'all'
    }
  })

  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    tiposMovimento: [],
    valorMin: undefined,
    valorMax: undefined,
    status: [],
    erroCodigo: []
  })

  // Funções para definir períodos predefinidos
  const setPeriod = (period: 'today' | 'week' | 'month' | 'quarter' | 'year') => {
    const now = new Date()
    let startDate: Date
    let endDate: Date

    switch (period) {
      case 'today':
        startDate = startOfDay(now)
        endDate = endOfDay(now)
        break
      case 'week':
        startDate = subDays(now, 7)
        endDate = now
        break
      case 'month':
        startDate = subDays(now, 30)
        endDate = now
        break
      case 'quarter':
        startDate = subDays(now, 90)
        endDate = now
        break
      case 'year':
        startDate = subDays(now, 365)
        endDate = now
        break
      default:
        startDate = subDays(now, 30)
        endDate = now
    }

    form.setValue('dataInicio', startDate)
    form.setValue('dataFim', endDate)
  }

  // Atualiza filtros avançados
  const updateAdvancedFilters = (newFilters: Partial<AdvancedFilters>) => {
    const updatedFilters = { ...advancedFilters, ...newFilters }
    setAdvancedFilters(updatedFilters)
    onAdvancedFiltersChange?.(updatedFilters)
  }

  // Validação em tempo real
  const validateField = (field: string) => {
    form.trigger(field)
  }

  // Formatação automática da conta corrente
  const formatAccountNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}-${numbers.slice(5, 6)}`
  }

  // Manipula mudança na conta corrente
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formatted = formatAccountNumber(value)
    form.setValue('contaCorrente', formatted)
    validateField('contaCorrente')
  }

  // Manipula envio do formulário
  const handleSubmit = (data: any) => {
    onSubmit(data as AccountQueryFormData)
  }

  // Manipula exportação
  const handleExport = () => {
    if (!onExport) return

    const exportData: ExportRequest = {
      tipo: 'CONSULTAS',
      formato: exportFormat,
      filtros: advancedFilters,
      incluirHeaders: includeHeaders
    }

    onExport(exportData)
  }

  // Verifica se o formulário é válido
  const isFormValid = form.formState.isValid
  const hasErrors = Object.keys(form.formState.errors).length > 0

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Consulta Avançada de Contas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Campos principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Agência */}
            <div className="space-y-2">
              <Label htmlFor="agencia">Agência *</Label>
              <Input
                id="agencia"
                {...form.register('agencia')}
                placeholder="1234"
                maxLength={4}
                onBlur={() => validateField('agencia')}
                className={form.formState.errors.agencia ? 'border-red-500' : ''}
              />
              {form.formState.errors.agencia && (
                <p className="text-sm text-red-500">
                  {String(form.formState.errors.agencia.message)}
                </p>
              )}
            </div>

            {/* Conta Corrente */}
            <div className="space-y-2">
              <Label htmlFor="contaCorrente">Conta Corrente *</Label>
              <Input
                id="contaCorrente"
                value={form.watch('contaCorrente')}
                onChange={handleAccountChange}
                placeholder="12.345-6"
                maxLength={8}
                className={form.formState.errors.contaCorrente ? 'border-red-500' : ''}
              />
              {form.formState.errors.contaCorrente && (
                <p className="text-sm text-red-500">
                  {String(form.formState.errors.contaCorrente.message)}
                </p>
              )}
            </div>
          </div>

          {/* Período de consulta */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Período de Consulta *</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPeriod('today')}
                >
                  Hoje
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPeriod('week')}
                >
                  Semana
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPeriod('month')}
                >
                  Mês
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPeriod('quarter')}
                >
                  Trimestre
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPeriod('year')}
                >
                  Ano
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data Início */}
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data Início *</Label>
                <div className="relative">
                  <Input
                    id="dataInicio"
                    type="date"
                    {...form.register('dataInicio', { valueAsDate: true })}
                    onBlur={() => validateField('dataInicio')}
                    className={form.formState.errors.dataInicio ? 'border-red-500' : ''}
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
                {form.formState.errors.dataInicio && (
                  <p className="text-sm text-red-500">
                    {String(form.formState.errors.dataInicio.message)}
                  </p>
                )}
              </div>

              {/* Data Fim */}
              <div className="space-y-2">
                <Label htmlFor="dataFim">Data Fim *</Label>
                <div className="relative">
                  <Input
                    id="dataFim"
                    type="date"
                    {...form.register('dataFim', { valueAsDate: true })}
                    onBlur={() => validateField('dataFim')}
                    className={form.formState.errors.dataFim ? 'border-red-500' : ''}
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
                {form.formState.errors.dataFim && (
                  <p className="text-sm text-red-500">
                    {String(form.formState.errors.dataFim.message)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Configurações adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tipo de Consulta */}
            <div className="space-y-2">
              <Label htmlFor="tipoConsulta">Tipo de Consulta</Label>
              <Select
                value={form.watch('tipoConsulta')}
                onValueChange={(value) => form.setValue('tipoConsulta', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Dados</SelectItem>
                  <SelectItem value="logs">Apenas Logs</SelectItem>
                  <SelectItem value="imports">Apenas Importações</SelectItem>
                  <SelectItem value="movements">Apenas Movimentações</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tamanho da Página */}
            <div className="space-y-2">
              <Label htmlFor="size">Resultados por Página</Label>
              <Select
                value={form.watch('size').toString()}
                onValueChange={(value) => form.setValue('size', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Período Selecionado */}
            <div className="space-y-2">
              <Label>Período Selecionado</Label>
              <div className="text-sm text-muted-foreground">
                {form.watch('dataInicio') && form.watch('dataFim') && (
                  <>
                    {format(form.watch('dataInicio')!, 'dd/MM/yyyy', { locale: ptBR })} - {' '}
                    {format(form.watch('dataFim')!, 'dd/MM/yyyy', { locale: ptBR })}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Filtros Avançados */}
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showAdvancedFilters ? 'Ocultar' : 'Mostrar'} Filtros Avançados
            </Button>

            {showAdvancedFilters && (
              <Card className="border-dashed">
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Valor Mínimo */}
                    <div className="space-y-2">
                      <Label htmlFor="valorMin">Valor Mínimo</Label>
                      <Input
                        id="valorMin"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={advancedFilters.valorMin || ''}
                        onChange={(e) => updateAdvancedFilters({
                          valorMin: e.target.value ? parseFloat(e.target.value) : undefined
                        })}
                      />
                    </div>

                    {/* Valor Máximo */}
                    <div className="space-y-2">
                      <Label htmlFor="valorMax">Valor Máximo</Label>
                      <Input
                        id="valorMax"
                        type="number"
                        step="0.01"
                        placeholder="999999.99"
                        value={advancedFilters.valorMax || ''}
                        onChange={(e) => updateAdvancedFilters({
                          valorMax: e.target.value ? parseFloat(e.target.value) : undefined
                        })}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex flex-wrap gap-2">
                      {['SUCCESS', 'ERROR', 'PENDING', 'PROCESSING'].map((status) => (
                        <Badge
                          key={status}
                          variant={advancedFilters.status?.includes(status) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => {
                            const current = advancedFilters.status || []
                            const updated = current.includes(status)
                              ? current.filter(s => s !== status)
                              : [...current, status]
                            updateAdvancedFilters({ status: updated })
                          }}
                        >
                          {status}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              disabled={loading || !isFormValid}
              className="flex-1 flex items-center gap-2"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {loading ? 'Consultando...' : 'Consultar'}
            </Button>

            {onExport && (
              <Button
                type="button"
                variant="outline"
                onClick={handleExport}
                disabled={!isFormValid}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            )}
          </div>

          {/* Configurações de exportação */}
          {onExport && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Label htmlFor="exportFormat">Formato:</Label>
                <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as any)}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="EXCEL">Excel</SelectItem>
                    <SelectItem value="CSV">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="includeHeaders"
                  type="checkbox"
                  checked={includeHeaders}
                  onChange={(e) => setIncludeHeaders(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="includeHeaders">Incluir cabeçalhos</Label>
              </div>
            </div>
          )}

          {/* Resumo de validação */}
          {hasErrors && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Erros de Validação:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {Object.entries(form.formState.errors).map(([field, error]: [string, any]) => (
                  <li key={field}>
                    <strong>{field}:</strong> {error?.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
