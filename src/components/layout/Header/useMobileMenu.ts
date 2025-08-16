/**
 * useMobileMenu - Hook para gerenciar estado do menu mobile
 * Inclui funcionalidades de abertura, fechamento e controle automático
 */

import { useState, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Hook para gerenciar estado do menu mobile
 * Funcionalidades:
 * - Abertura/fechamento do menu
 * - Fechamento automático ao navegar
 * - Controle de estado
 */
export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  
  const open = useCallback(() => {
    console.log('🟢 useMobileMenu: Abrindo menu')
    setIsOpen(true)
  }, [])
  
  const close = useCallback(() => {
    console.log('🔴 useMobileMenu: Fechando menu')
    setIsOpen(false)
  }, [])
  
  const toggle = useCallback(() => {
    console.log('🔄 useMobileMenu: Alternando menu, estado atual:', isOpen)
    setIsOpen(prev => !prev)
  }, [isOpen])
  
  // Fechar menu ao navegar para nova rota
  useEffect(() => {
    if (isOpen) {
      console.log('📍 useMobileMenu: Fechando menu devido à mudança de rota')
      close()
    }
  }, [location.pathname, isOpen, close])
  
  // Fechar menu ao pressionar ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        console.log('⌨️ useMobileMenu: Fechando menu devido à tecla ESC')
        close()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevenir scroll do body quando menu está aberto
      document.body.style.overflow = 'hidden'
      console.log('📱 useMobileMenu: Menu aberto, scroll do body bloqueado')
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
      if (isOpen) {
        console.log('📱 useMobileMenu: Menu fechado, scroll do body restaurado')
      }
    }
  }, [isOpen, close])
  
  // Log do estado atual
  useEffect(() => {
    console.log('📊 useMobileMenu: Estado atual:', isOpen)
  }, [isOpen])
  
  return {
    isOpen,
    open,
    close,
    toggle
  }
}
