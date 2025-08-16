import { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Calendar, Filter, Download, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Movement {
  id: string
  date: Date
  description: string
  type: 'credit' | 'debit'
  amount: number
  balance: number
  category: string
  status: 'confirmed' | 'pending' | 'cancelled'
}

export const MovementAnalyzer = () => {
  const [movements] = useState<Movement[]>([
    {
      id: '1',
      date: new Date('2024-01-15'),
      description: 'Depósito em dinheiro',
      type: 'credit',
      amount: 1500.00,
      balance: 2500.00,
      category: 'Depósito',
      status: 'confirmed'
    },
    {
      id: '2',
      date: new Date('2024-01-16'),
      description: 'Pagamento de conta',
      type: 'debit',
      amount: 89.90,
      balance: 2410.10,
      category: 'Contas',
      status: 'confirmed'
    },
    {
      id: '3',
      date: new Date('2024-01-17'),
      description: 'Transferência recebida',
      type: 'credit',
      amount: 500.00,
      balance: 2910.10,
      category: 'Transferência',
      status: 'confirmed'
    },
    {
      id: '4',
      date: new Date('2024-01-18'),
      description: 'Compra no cartão',
      type: 'debit',
      amount: 125.50,
      balance: 2784.60,
      category: 'Compras',
      status: 'pending'
    }
  ])

  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  })

  const filteredMovements = movements.filter(movement => {
    if (filters.type !== 'all' && movement.type !== filters.type) return false
    if (filters.category !== 'all' && movement.category !== filters.category) return false
    if (filters.status !== 'all' && movement.status !== filters.status) return false
    return true
  })

  const totalCredits = movements.filter(m => m.type === 'credit').reduce((sum, m) => sum + m.amount, 0)
  const totalDebits = movements.filter(m => m.type === 'debit').reduce((sum, m) => sum + m.amount, 0)
  const netBalance = totalCredits - totalDebits

  const getStatusBadge = (status: Movement['status']) => {
    const variants = {
      confirmed: { variant: 'default' as const, text: 'Confirmado' },
      pending: { variant: 'secondary' as const, text: 'Pendente' },
      cancelled: { variant: 'destructive' as const, text: 'Cancelado' }
    }
    
    const config = variants[status]
    return <Badge variant={config.variant}>{config.text}</Badge>
  }

  const getTypeIcon = (type: Movement['type']) => {
    return type === 'credit' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Análise de Movimentações</h1>
        <p className="text-muted-foreground">
          Visualização e análise de movimentações bancárias
        </p>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalCredits)}
                </div>
                <div className="text-sm text-muted-foreground">Total de Créditos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalDebits)}
                </div>
                <div className="text-sm text-muted-foreground">Total de Débitos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div>
                <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(Math.abs(netBalance))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {netBalance >= 0 ? 'Saldo Positivo' : 'Saldo Negativo'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{movements.length}</div>
                <div className="text-sm text-muted-foreground">Total de Movimentações</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="credit">Créditos</SelectItem>
                  <SelectItem value="debit">Débitos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Depósito">Depósito</SelectItem>
                  <SelectItem value="Contas">Contas</SelectItem>
                  <SelectItem value="Transferência">Transferência</SelectItem>
                  <SelectItem value="Compras">Compras</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Data De</Label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Data Até</Label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Movimentações */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Movimentações ({filteredMovements.length})
            </CardTitle>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {movement.date.toLocaleDateString('pt-BR')}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{movement.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(movement.type)}
                      <span className={movement.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                        {movement.type === 'credit' ? 'Crédito' : 'Débito'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className={movement.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(movement.amount)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(movement.balance)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{movement.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(movement.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
