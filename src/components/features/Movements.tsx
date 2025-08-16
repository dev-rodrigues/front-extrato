import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Movement {
  id: string
  numeroSequencial: string
  data: string
  tipo: 'credit' | 'debit'
  valor: number
  saldo: number
  posicaoSaldo: 'positive' | 'negative'
  descricao: string
  documento: string
  cpfCnpjContrapartida?: string
}

interface MovementsProps {
  agencia: string
  contaCorrente: string
  dataInicio: string
  dataFim: string
}

export const Movements = ({ agencia, contaCorrente, dataInicio, dataFim }: MovementsProps) => {
  const [movements, setMovements] = useState<Movement[]>([])
  const [loading, setLoading] = useState(false)
  const [totalCredit, setTotalCredit] = useState(0)
  const [totalDebit, setTotalDebit] = useState(0)

  // Dados mockados para demonstração
  const mockMovements: Movement[] = [
    {
      id: '1',
      numeroSequencial: '001',
      data: '2024-01-15',
      tipo: 'credit',
      valor: 1500.00,
      saldo: 2500.00,
      posicaoSaldo: 'positive',
      descricao: 'Depósito em dinheiro',
      documento: 'DOC001',
      cpfCnpjContrapartida: '123.456.789-00'
    },
    {
      id: '2',
      numeroSequencial: '002',
      data: '2024-01-15',
      tipo: 'debit',
      valor: 250.00,
      saldo: 2250.00,
      posicaoSaldo: 'positive',
      descricao: 'Pagamento de conta',
      documento: 'DOC002'
    },
    {
      id: '3',
      numeroSequencial: '003',
      data: '2024-01-14',
      tipo: 'credit',
      valor: 3000.00,
      saldo: 1000.00,
      posicaoSaldo: 'positive',
      descricao: 'Transferência recebida',
      documento: 'DOC003',
      cpfCnpjContrapartida: '987.654.321-00'
    }
  ]

  useEffect(() => {
    fetchMovements()
  }, [agencia, contaCorrente, dataInicio, dataFim])

  const fetchMovements = async () => {
    setLoading(true)
    // Simular chamada de API
    await new Promise(resolve => setTimeout(resolve, 700))
    setMovements(mockMovements)
    
    // Calcular totais
    const credit = mockMovements
      .filter(m => m.tipo === 'credit')
      .reduce((sum, m) => sum + m.valor, 0)
    const debit = mockMovements
      .filter(m => m.tipo === 'debit')
      .reduce((sum, m) => sum + m.valor, 0)
    
    setTotalCredit(credit)
    setTotalDebit(debit)
    setLoading(false)
  }

  const getTipoBadge = (tipo: Movement['tipo']) => {
    if (tipo === 'credit') {
      return (
        <Badge variant="default" className="bg-green-500">
          <TrendingUp className="h-3 w-3 mr-1" />
          Crédito
        </Badge>
      )
    } else {
      return (
        <Badge variant="destructive">
          <TrendingDown className="h-3 w-3 mr-1" />
          Débito
        </Badge>
      )
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Carregando movimentações...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Movimentações Bancárias
        </CardTitle>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total Créditos:</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(totalCredit)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total Débitos:</span>
            <span className="font-semibold text-red-600">
              {formatCurrency(totalDebit)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Saldo:</span>
            <span className={`font-semibold ${
              totalCredit - totalDebit >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(totalCredit - totalDebit)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {movements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma movimentação encontrada para o período selecionado</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seq.</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Contrapartida</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="font-mono text-sm">
                    {movement.numeroSequencial}
                  </TableCell>
                  <TableCell>
                    {formatDate(movement.data)}
                  </TableCell>
                  <TableCell>
                    {getTipoBadge(movement.tipo)}
                  </TableCell>
                  <TableCell className={`font-mono ${
                    movement.tipo === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(movement.valor)}
                  </TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency(movement.saldo)}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={movement.descricao}>
                    {movement.descricao}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {movement.documento}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {movement.cpfCnpjContrapartida || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
