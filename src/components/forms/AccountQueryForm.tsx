import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Calendar } from 'lucide-react'

const accountQuerySchema = z.object({
  agencia: z.string()
    .length(4, 'Agência deve ter 4 dígitos')
    .regex(/^\d{4}$/, 'Agência deve conter apenas números'),
  contaCorrente: z.string()
    .regex(/^\d{2}\.\d{3}-\d$/, 'Formato: XX.XXX-X'),
  dataInicio: z.string().min(1, 'Data de início é obrigatória'),
  dataFim: z.string().min(1, 'Data de fim é obrigatória'),
})

type AccountQueryFormData = z.infer<typeof accountQuerySchema>

interface AccountQueryFormProps {
  onSubmit: (data: AccountQueryFormData) => void
  isLoading?: boolean
}

export const AccountQueryForm = ({ onSubmit, isLoading = false }: AccountQueryFormProps) => {
  const form = useForm<AccountQueryFormData>({
    resolver: zodResolver(accountQuerySchema),
    defaultValues: {
      agencia: '',
      contaCorrente: '',
      dataInicio: '',
      dataFim: '',
    }
  })

  const handleSubmit = (data: AccountQueryFormData) => {
    onSubmit(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Consulta de Conta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agencia">Agência</Label>
              <Input
                id="agencia"
                placeholder="1234"
                maxLength={4}
                {...form.register('agencia')}
              />
              {form.formState.errors.agencia && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.agencia.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contaCorrente">Conta Corrente</Label>
              <Input
                id="contaCorrente"
                placeholder="12.345-6"
                {...form.register('contaCorrente')}
              />
              {form.formState.errors.contaCorrente && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.contaCorrente.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data Início</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="dataInicio"
                  type="date"
                  className="pl-10"
                  {...form.register('dataInicio')}
                />
              </div>
              {form.formState.errors.dataInicio && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.dataInicio.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataFim">Data Fim</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="dataFim"
                  type="date"
                  className="pl-10"
                  {...form.register('dataFim')}
                />
              </div>
              {form.formState.errors.dataFim && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.dataFim.message}
                </p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || !form.formState.isValid}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Consultando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Consultar
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
