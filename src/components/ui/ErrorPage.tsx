/**
 * ErrorPage - Página de erro personalizada para 404 e outros erros
 * Segue a identidade visual do projeto com design amigável e responsivo
 */

import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Footer } from '@/components/layout/Footer/Footer'
import { useAuthStore } from '@/stores/useAuthStore'
import { cn } from '@/lib/utils'
import { GiKiwiBird } from 'react-icons/gi'

interface ErrorPageProps {
  code?: string
  title?: string
  message?: string
  redirectDelay?: number
}

export function ErrorPage({ 
  code = '404', 
  title = 'Página não encontrada',
  message = 'A página que você está procurando não existe ou foi movida.',
  redirectDelay = 5
}: ErrorPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Redirecionamento automático
  useEffect(() => {
    const timer = setTimeout(() => {
      // Iniciar transição
      setIsTransitioning(true)
      
      // Aguardar transição antes de redirecionar
      setTimeout(() => {
        // Redirecionar baseado no status de autenticação
        if (isAuthenticated) {
          // Se logado, voltar para página anterior ou dashboard
          const from = location.state?.from?.pathname || '/'
          navigate(from, { replace: true })
        } else {
          // Se não logado, ir para login
          navigate('/login', { 
            state: { from: location },
            replace: true 
          })
        }
      }, 300) // Aguardar 300ms para a transição
    }, redirectDelay * 1000) // Converter para milissegundos

    return () => clearTimeout(timer)
  }, [navigate, location, isAuthenticated, redirectDelay])

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col transition-all duration-300 ease-in-out",
      isTransitioning && "opacity-0 scale-95"
    )}>
      {/* Header com logo */}
      <div className="flex justify-center pt-8 pb-4">
        <div className="flex items-center space-x-2">
          {/* <GiKiwiBird className="h-8 w-8 text-gray-900" /> */}
          {/* <span className="font-bold text-xl text-gray-900">
            Kiwi BB Extrato
          </span> */}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">


          {/* Código de erro */}
          <div className="mb-4">
            <span className="text-6xl font-bold text-gray-300">
              {code}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {title}
          </h1>

          {/* Mensagem */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            {message}
          </p>

          {/* Loading */}
          <div className="mt-6 text-center">
            <div className="relative mx-auto w-12 h-12 mb-3">
              <GiKiwiBird className="w-12 h-12 text-blue-600 animate-pulse" />
              
              {/* Efeito de brilho */}
              <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 animate-ping" />
              
              {/* Efeito de rotação sutil */}
              <div className="absolute inset-0 animate-spin">
                <div className="w-full h-full border-2 border-blue-300 border-t-blue-600 rounded-full opacity-30" />
              </div>
            </div>
            {isAuthenticated && (
              <div className="text-xs text-gray-500">
                Voltando para a página anterior...
              </div>
            )}
          </div>


        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

// Componente específico para erro 404
export function NotFoundPage() {
  return (
    <ErrorPage 
      code=""
      title="Página não encontrada..."
      message=""
      redirectDelay={5}
    />
  )
}

// Componente para erro genérico
export function GenericErrorPage() {
  return (
    <ErrorPage 
      code="500"
      title="Erro interno"
      message="Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte."
      redirectDelay={5}
    />
  )
}
