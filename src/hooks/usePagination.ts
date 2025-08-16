import { useState, useMemo, useCallback } from 'react'

interface UsePaginationProps {
  totalElements: number
  pageSize: number
  initialPage?: number
  maxVisiblePages?: number
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  pageSize: number
  totalElements: number
  hasNext: boolean
  hasPrevious: boolean
  isFirst: boolean
  isLast: boolean
  startElement: number
  endElement: number
}

export const usePagination = ({
  totalElements,
  pageSize,
  initialPage = 0,
  maxVisiblePages = 5
}: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage)
  
  const paginationInfo = useMemo((): PaginationInfo => {
    const totalPages = Math.ceil(totalElements / pageSize)
    const hasNext = currentPage < totalPages - 1
    const hasPrevious = currentPage > 0
    const isFirst = currentPage === 0
    const isLast = currentPage === totalPages - 1
    const startElement = currentPage * pageSize + 1
    const endElement = Math.min((currentPage + 1) * pageSize, totalElements)
    
    return {
      currentPage,
      totalPages,
      pageSize,
      totalElements,
      hasNext,
      hasPrevious,
      isFirst,
      isLast,
      startElement,
      endElement
    }
  }, [currentPage, totalElements, pageSize])
  
  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < paginationInfo.totalPages) {
      setCurrentPage(page)
    }
  }, [paginationInfo.totalPages])
  
  const nextPage = useCallback(() => {
    if (paginationInfo.hasNext) {
      setCurrentPage(currentPage + 1)
    }
  }, [currentPage, paginationInfo.hasNext])
  
  const previousPage = useCallback(() => {
    if (paginationInfo.hasPrevious) {
      setCurrentPage(currentPage - 1)
    }
  }, [currentPage, paginationInfo.hasPrevious])
  
  const goToFirst = useCallback(() => {
    setCurrentPage(0)
  }, [])
  
  const goToLast = useCallback(() => {
    setCurrentPage(paginationInfo.totalPages - 1)
  }, [paginationInfo.totalPages])
  
  const resetToFirst = useCallback(() => {
    setCurrentPage(0)
  }, [])
  
  // Calcular páginas visíveis para navegação
  const visiblePages = useMemo(() => {
    const { currentPage, totalPages } = paginationInfo
    const pages: number[] = []
    
    if (totalPages <= maxVisiblePages) {
      // Se temos poucas páginas, mostrar todas
      for (let i = 0; i < totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Calcular range de páginas visíveis
      let start = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2))
      let end = start + maxVisiblePages - 1
      
      if (end >= totalPages) {
        end = totalPages - 1
        start = Math.max(0, end - maxVisiblePages + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }, [paginationInfo.currentPage, paginationInfo.totalPages, maxVisiblePages])
  
  return {
    // Informações de paginação
    ...paginationInfo,
    
    // Ações de navegação
    goToPage,
    nextPage,
    previousPage,
    goToFirst,
    goToLast,
    resetToFirst,
    
    // Páginas visíveis para UI
    visiblePages,
    
    // Utilitários
    getPageInfo: () => paginationInfo
  }
}
