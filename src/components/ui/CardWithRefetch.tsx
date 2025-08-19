import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CardWithRefetchProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
}

/**
 * CardWithRefetch - Componente de card genérico com suporte a refetch
 * 
 * Este componente é um wrapper que padroniza a estrutura de cards
 * na aplicação. O loading de refetch deve ser implementado pelo
 * usuário dentro do conteúdo passado como children.
 * 
 * @param children - Conteúdo do card (botões, barras de progresso, etc.)
 * @param className - Classes CSS adicionais
 * @param title - Título opcional do card
 * @param subtitle - Subtítulo opcional do card
 */
export function CardWithRefetch({
  children,
  className = '',
  title,
  subtitle
}: CardWithRefetchProps) {
  return (
    <Card className={cn("transition-all duration-300", className)}>
      {/* Header do card (se title ou subtitle for fornecido) */}
      {(title || subtitle) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </CardHeader>
      )}
      
      {/* Conteúdo do card */}
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
