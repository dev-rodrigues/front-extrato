/**
 * LoginPage - Página de autenticação minimalista
 * Segue a identidade visual do projeto com logo e design responsivo
 */

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { Logo } from '@/components/layout/Header/Logo'
import { Footer } from '@/components/layout/Footer/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, AlertTriangle } from 'lucide-react'

export function LoginPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const location = useLocation()
  const { authenticate, isAuthenticated, loginAttempts, isLocked, lockUntil } = useAuthStore()

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  // Calcular tempo restante de bloqueio
  const getLockTimeRemaining = () => {
    if (!lockUntil) return 0
    const remaining = Math.ceil((lockUntil - Date.now()) / 1000 / 60)
    return Math.max(0, remaining)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const success = authenticate(password)
      
      if (success) {
        // Sucesso - redirecionar para página anterior ou dashboard
        const from = location.state?.from?.pathname || '/'
        navigate(from, { replace: true })
      } else {
        setError('Senha incorreta. Tente novamente.')
      }
    } catch (err) {
      setError('Erro interno. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const isAccountLocked = Boolean(isLocked && lockUntil && Date.now() < lockUntil)
  const lockTimeRemaining = getLockTimeRemaining()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Card de login */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4">
              <Logo variant="desktop" />
            </div>
            {/*<p className="text-sm text-gray-600">*/}
            {/*  Digite sua senha para continuar*/}
            {/*</p>*/}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Alerta de conta bloqueada */}
            {isAccountLocked && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Conta bloqueada por {lockTimeRemaining} minuto(s) devido a múltiplas tentativas.
                </AlertDescription>
              </Alert>
            )}

            {/* Alerta de tentativas */}
            {loginAttempts > 0 && !isAccountLocked && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  {5 - loginAttempts} tentativa(s) restante(s).
                </AlertDescription>
              </Alert>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    disabled={isAccountLocked}
                    className="pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isAccountLocked}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Botão de login */}
              <Button
                type="submit"
                disabled={isLoading || isAccountLocked || !password.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isLoading ? 'Verificando...' : 'Acessar Sistema'}
              </Button>
            </form>

            {/* Mensagem de erro */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Informações adicionais */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Sessão expira automaticamente após 30 minutos de inatividade
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
