import { renderHook, act } from '@testing-library/react'
import { usePagination } from '../usePagination'

describe('usePagination', () => {
  const defaultProps = {
    totalElements: 100,
    pageSize: 10
  }

  it('inicializa com valores corretos', () => {
    const { result } = renderHook(() => usePagination(defaultProps))
    
    expect(result.current.currentPage).toBe(0)
    expect(result.current.totalPages).toBe(10)
    expect(result.current.totalElements).toBe(100)
    expect(result.current.pageSize).toBe(10)
    expect(result.current.hasNext).toBe(true)
    expect(result.current.hasPrevious).toBe(false)
    expect(result.current.isFirst).toBe(true)
    expect(result.current.isLast).toBe(false)
  })

  it('calcula páginas visíveis corretamente', () => {
    const { result } = renderHook(() => usePagination({
      ...defaultProps,
      maxVisiblePages: 5
    }))
    
    expect(result.current.visiblePages).toEqual([0, 1, 2, 3, 4])
  })

  it('navega para próxima página', () => {
    const { result } = renderHook(() => usePagination(defaultProps))
    
    act(() => {
      result.current.nextPage()
    })
    
    expect(result.current.currentPage).toBe(1)
    expect(result.current.hasPrevious).toBe(true)
    expect(result.current.isFirst).toBe(false)
  })

  it('navega para página anterior', () => {
    const { result } = renderHook(() => usePagination(defaultProps))
    
    // Primeiro vai para página 1
    act(() => {
      result.current.nextPage()
    })
    
    // Depois volta para página 0
    act(() => {
      result.current.previousPage()
    })
    
    expect(result.current.currentPage).toBe(0)
    expect(result.current.hasPrevious).toBe(false)
    expect(result.current.isFirst).toBe(true)
  })

  it('vai para página específica', () => {
    const { result } = renderHook(() => usePagination(defaultProps))
    
    act(() => {
      result.current.goToPage(5)
    })
    
    expect(result.current.currentPage).toBe(5)
    expect(result.current.hasPrevious).toBe(true)
    expect(result.current.hasNext).toBe(true)
  })

  it('vai para primeira página', () => {
    const { result } = renderHook(() => usePagination(defaultProps))
    
    // Primeiro vai para página 5
    act(() => {
      result.current.goToPage(5)
    })
    
    // Depois vai para primeira página
    act(() => {
      result.current.goToFirst()
    })
    
    expect(result.current.currentPage).toBe(0)
    expect(result.current.isFirst).toBe(true)
  })

  it('vai para última página', () => {
    const { result } = renderHook(() => usePagination(defaultProps))
    
    act(() => {
      result.current.goToLast()
    })
    
    expect(result.current.currentPage).toBe(9)
    expect(result.current.isLast).toBe(true)
    expect(result.current.hasNext).toBe(false)
  })

  it('reseta para primeira página', () => {
    const { result } = renderHook(() => usePagination(defaultProps))
    
    // Primeiro vai para página 5
    act(() => {
      result.current.goToPage(5)
    })
    
    // Depois reseta
    act(() => {
      result.current.resetToFirst()
    })
    
    expect(result.current.currentPage).toBe(0)
  })

  it('não permite navegar além dos limites', () => {
    const { result } = renderHook(() => usePagination(defaultProps))
    
    // Tenta ir para página negativa
    act(() => {
      result.current.goToPage(-1)
    })
    
    expect(result.current.currentPage).toBe(0)
    
    // Tenta ir para página além do limite
    act(() => {
      result.current.goToPage(15)
    })
    
    expect(result.current.currentPage).toBe(0)
  })

  it('calcula elementos de início e fim corretamente', () => {
    const { result } = renderHook(() => usePagination(defaultProps))
    
    expect(result.current.startElement).toBe(1)
    expect(result.current.endElement).toBe(10)
    
    // Vai para página 1
    act(() => {
      result.current.goToPage(1)
    })
    
    expect(result.current.startElement).toBe(11)
    expect(result.current.endElement).toBe(20)
  })

  it('funciona com página inicial personalizada', () => {
    const { result } = renderHook(() => usePagination({
      ...defaultProps,
      initialPage: 3
    }))
    
    expect(result.current.currentPage).toBe(3)
    expect(result.current.hasPrevious).toBe(true)
    expect(result.current.hasNext).toBe(true)
  })
})
