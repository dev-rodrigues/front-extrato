import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'

interface QueryLog {
  id: string
  dataHora: string
  status: 'success' | 'error' | 'pending'
  periodo: string
  descricao: string
  erroCodigo?: number
  erroDescricao?: string
}

interface QueryLogsProps {
  agencia: string
  contaCorrente: string
  dataInicio: string
  dataFim: string
}

export const QueryLogs = ({ agencia, contaCorrente, dataInicio, dataFim }: QueryLogsProps) => {
  const [logs, setLogs] = useState<QueryLog[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // Dados mockados para demonstração
  const mockLogs: QueryLog[] = [
    {
      id: '1',
      dataHora: '2024-01-15 14:30:25',
      status: 'success',
      periodo: `${dataInicio} - ${dataFim}`,
      descricao: 'Consulta realizada com sucesso'
    },
    {
      id: '2',
      dataHora: '2024-01-15 13:15:10',
      status: 'error',
      periodo: `${dataInicio} - ${dataFim}`,
      descricao: 'Falha na conexão com API',
      erroCodigo: 500,
      erroDescricao: 'Internal Server Error'
    },
    {
      id: '3',
      dataHora: '2024-01-15 12:45:33',
      status: 'success',
      periodo: `${dataInicio} - ${dataFim}`,
      descricao: 'Consulta realizada com sucesso'
    }
  ]

  useEffect(() => {
    fetchLogs()
  }, [agencia, contaCorrente, dataInicio, dataFim])

  const fetchLogs = async () => {
    setLoading(true)
    // Simular chamada de API
    await new Promise(resolve => setTimeout(resolve, 800))
    setLogs(mockLogs)
    setTotalPages(1)
    setLoading(false)
  }

  const getStatusBadge = (status: QueryLog['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">✅ Sucesso</Badge>
      case 'error':
        return <Badge variant="destructive">❌ Erro</Badge>
      case 'pending':
        return <Badge variant="secondary">⏳ Pendente</Badge>
      default:
        return <Badge variant="outline">❓ Desconhecido</Badge>
    }
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('pt-BR')
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Carregando logs...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Logs de Consulta</span>
          <div className="text-sm text-muted-foreground">
            Agência: {agencia} | Conta: {contaCorrente}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum log encontrado para o período selecionado</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Período Consultado</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {formatDateTime(log.dataHora)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(log.status)}
                    </TableCell>
                    <TableCell>{log.periodo}</TableCell>
                    <TableCell>{log.descricao}</TableCell>
                    <TableCell>
                      {log.erroCodigo && (
                        <div className="text-xs text-muted-foreground">
                          <div>Código: {log.erroCodigo}</div>
                          <div>{log.erroDescricao}</div>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Paginação */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {logs.length} resultados
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <span className="px-3 py-1 text-sm">
                  {currentPage + 1} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
