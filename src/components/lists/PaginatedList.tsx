/**
 * PaginatedList - Componente para listas paginadas conforme RFCs
 * Baseado em RFC-API-Integration.md - Paginação padrão
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Loader2
} from 'lucide-react'
import type { PaginationResponse } from '@/types/rfc'

interface PaginatedListProps<T> {
  title: string
  data: PaginationResponse<T> | null
  loading?: boolean
  error?: string | null
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  renderItem: (item: T, index: number) => React.ReactNode
  emptyMessage?: string
  className?: string
}

/**
 * Componente genérico para listas paginadas
 * Implementa paginação conforme padrão da API (baseado em 0)
 * Funcionalidades:
 * - Navegação entre páginas
 * - Alteração do tamanho da página
 * - Estados de loading e erro
 * - Mensagem para lista vazia
 */
export function PaginatedList<T>({
  title,
  data,
  loading = false,
  error = null,
  onPageChange,
  onPageSizeChange,
  renderItem,
  emptyMessage = 'Nenhum item encontrado',
  className
}: PaginatedListProps<T>) {
  
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-medium">Erro ao carregar dados</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.content.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentPage = data.pageNumber
  const totalPages = data.totalPages
  const totalElements = data.totalElements
  const pageSize = data.pageSize

  // Calcular páginas para exibição
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Total: {totalElements.toLocaleString('pt-BR')}</span>
            <span>•</span>
            <span>Página {currentPage + 1} de {totalPages}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Lista de Itens */}
        <div className="space-y-4 mb-6">
          {data.content.map((item, index) => renderItem(item, index))}
        </div>

        {/* Controles de Paginação */}
        <div className="flex items-center justify-between">
          {/* Seletor de Tamanho da Página */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Itens por página:</span>
            <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(parseInt(value))}>
              <SelectTrigger className="w-20">
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

          {/* Navegação de Páginas */}
          <div className="flex items-center gap-1">
            {/* Primeira Página */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(0)}
              disabled={!data.hasPrevious}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            {/* Página Anterior */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!data.hasPrevious}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Páginas Numeradas */}
            {getVisiblePages().map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <span className="px-2 py-1 text-muted-foreground">...</span>
                ) : (
                  <Button
                    variant={page === currentPage + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange((page as number) - 1)}
                    className="h-8 w-8 p-0"
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}

            {/* Próxima Página */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!data.hasNext}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Última Página */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages - 1)}
              disabled={!data.hasNext}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Informações da Página */}
        <div className="text-center text-sm text-muted-foreground mt-4">
          <span>
            Mostrando {data.content.length} de {totalElements.toLocaleString('pt-BR')} itens
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
