import { render, screen } from '@testing-library/react'
import { SummaryCard } from '../SummaryCard'
import { TrendingUp, AlertTriangle } from 'lucide-react'

describe('SummaryCard', () => {
  const defaultProps = {
    title: 'Test Card',
    value: '100',
    icon: TrendingUp
  }

  it('renderiza com props básicas', () => {
    render(<SummaryCard {...defaultProps} />)
    
    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('renderiza com mudança positiva', () => {
    render(
      <SummaryCard 
        {...defaultProps} 
        change="+10% este mês"
        variant="positive"
      />
    )
    
    // Usar regex para encontrar texto que pode estar quebrado
    expect(screen.getByText(/\+10% este mês/)).toBeInTheDocument()
    expect(screen.getByText(/↗/)).toBeInTheDocument()
  })

  it('renderiza com mudança negativa', () => {
    render(
      <SummaryCard 
        {...defaultProps} 
        change="-5% este mês"
        variant="negative"
      />
    )
    
    expect(screen.getByText(/-5% este mês/)).toBeInTheDocument()
    expect(screen.getByText(/↘/)).toBeInTheDocument()
  })

  it('renderiza com mudança neutra', () => {
    render(
      <SummaryCard 
        {...defaultProps} 
        change="Sem mudança"
        variant="neutral"
      />
    )
    
    expect(screen.getByText(/Sem mudança/)).toBeInTheDocument()
    expect(screen.getByText(/→/)).toBeInTheDocument()
  })

  it('não renderiza mudança quando não fornecida', () => {
    render(<SummaryCard {...defaultProps} />)
    
    expect(screen.queryByText(/↗|↘|→/)).not.toBeInTheDocument()
  })

  it('aplica cores corretas para diferentes variantes', () => {
    const { rerender } = render(
      <SummaryCard {...defaultProps} change="+10% este mês" variant="positive" />
    )
    
    // Teste para variante positiva
    const positiveElement = screen.getByText(/\+10% este mês/)
    expect(positiveElement).toHaveClass('text-green-600')
    
    // Teste para variante negativa
    rerender(
      <SummaryCard {...defaultProps} change="-5%" variant="negative" />
    )
    const negativeElement = screen.getByText(/-5%/)
    expect(negativeElement).toHaveClass('text-red-600')
    
    // Teste para variante neutra
    rerender(
      <SummaryCard {...defaultProps} change="Sem mudança" variant="neutral" />
    )
    const neutralElement = screen.getByText(/Sem mudança/)
    expect(neutralElement).toHaveClass('text-blue-600')
  })

  it('renderiza ícone corretamente', () => {
    render(<SummaryCard {...defaultProps} icon={AlertTriangle} />)
    
    // O ícone é renderizado como SVG, então vamos verificar se está presente
    const icon = document.querySelector('svg')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass('lucide-triangle-alert')
  })
})
