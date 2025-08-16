import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileText, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Import {
  id: string
  dataHora: string
  arquivoNome: string
  qtdRegistros: number
  qtdContas: number
  status: 'completed' | 'processing' | 'failed'
  consultaAgencia: string
  consultaContaCorrente: string
  consultaPeriodo: string
}

interface ImportsProps {
  agencia: string
  contaCorrente: string
  dataInicio: string
  dataFim: string
}

export const Imports = ({ agencia, contaCorrente, dataInicio, dataFim }: ImportsProps) => {
  const [imports, setImports] = useState<Import[]>([])
  const [loading, setLoading] = useState(false)

  // Dados mockados para demonstração
  const mockImports: Import[] = [
    {
      id: '1',
      dataHora: '2024-01-15 14:30:00',
      arquivoNome: 'extrato_bb_20240115.csv',
      qtdRegistros: 150,
      qtdContas: 1,
      status: 'completed',
      consultaAgencia: agencia,
      consultaContaCorrente: contaCorrente,
      consultaPeriodo: `${dataInicio} - ${dataFim}`
    },
    {
      id: '2',
      dataHora: '2024-01-15 13:15:00',
      arquivoNome: 'extrato_bb_20240114.csv',
      qtdRegistros: 120,
      qtdContas: 1,
      status: 'completed',
      consultaAgencia: agencia,
      consultaContaCorrente: contaCorrente,
      consultaPeriodo: `${dataInicio} - ${dataFim}`
    },
    {
      id: '3',
      dataHora: '2024-01-15 12:00:00',
      arquivoNome: 'extrato_bb_20240113.csv',
      qtdRegistros: 95,
      qtdContas: 1,
      status: 'processing',
      consultaAgencia: agencia,
      consultaContaCorrente: contaCorrente,
      consultaPeriodo: `${dataInicio} - ${dataFim}`
    }
  ]

  useEffect(() => {
    fetchImports()
  }, [agencia, contaCorrente, dataInicio, dataFim])

  const fetchImports = async () => {
    setLoading(true)
    // Simular chamada de API
    await new Promise(resolve => setTimeout(resolve, 600))
    setImports(mockImports)
    setLoading(false)
  }

  const getStatusBadge = (status: Import['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">✅ Concluída</Badge>
      case 'processing':
        return <Badge variant="secondary">⏳ Processando</Badge>
      case 'failed':
        return <Badge variant="destructive">❌ Falhou</Badge>
      default:
        return <Badge variant="outline">❓ Desconhecido</Badge>
    }
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('pt-BR')
  }

  const formatFileName = (fileName: string) => {
    if (fileName.length > 30) {
      return fileName.substring(0, 30) + '...'
    }
    return fileName
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Carregando importações...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Histórico de Importações
        </CardTitle>
      </CardHeader>
      <CardContent>
        {imports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma importação encontrada para o período selecionado</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Arquivo</TableHead>
                <TableHead>Registros</TableHead>
                <TableHead>Contas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Período</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {imports.map((importItem) => (
                <TableRow key={importItem.id}>
                  <TableCell className="font-mono text-sm">
                    {formatDateTime(importItem.dataHora)}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span title={importItem.arquivoNome}>
                        {formatFileName(importItem.arquivoNome)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {importItem.qtdRegistros.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-center">
                    {importItem.qtdContas}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(importItem.status)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {importItem.consultaPeriodo}
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
