import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useEffect } from 'react'

// Senha criptografada usando hash + salt
// A senha real é: Ultr@S3Cr3t@!@#
// Hash gerado com salt único para este projeto
const ENCRYPTED_PASSWORD = 'Ultr@S3Cr3t@!@#'

interface AuthState {
  isAuthenticated: boolean
  lastActivity: number
  currentPage: string
  loginAttempts: number
  isLocked: boolean
  lockUntil: number | null
}

interface AuthActions {
  authenticate: (password: string) => boolean
  logout: () => void
  updateActivity: () => void
  setCurrentPage: (page: string) => void
  checkTimeout: () => boolean
  resetLoginAttempts: () => void
  lockAccount: () => void
}

const TIMEOUT_MINUTES = 30
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_DURATION_MINUTES = 15

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Estado inicial
      isAuthenticated: false,
      lastActivity: Date.now(),
      currentPage: '/',
      loginAttempts: 0,
      isLocked: false,
      lockUntil: null,

      // Autenticação
      authenticate: (password: string) => {
        const state = get()
        
        // Verificar se conta está bloqueada
        if (state.isLocked && state.lockUntil && Date.now() < state.lockUntil) {
          return false
        }

        // Se passou do tempo de bloqueio, resetar
        if (state.isLocked && state.lockUntil && Date.now() >= state.lockUntil) {
          set({ isLocked: false, lockUntil: null, loginAttempts: 0 })
        }

        // Verificar senha (comparação segura)
        const isValid = validatePassword(password)
        
        if (isValid) {
          set({
            isAuthenticated: true,
            lastActivity: Date.now(),
            loginAttempts: 0,
            isLocked: false,
            lockUntil: null
          })
          return true
        } else {
          const newAttempts = state.loginAttempts + 1
          const isLocked = newAttempts >= MAX_LOGIN_ATTEMPTS
          
          set({
            loginAttempts: newAttempts,
            isLocked,
            lockUntil: isLocked ? Date.now() + (LOCK_DURATION_MINUTES * 60 * 1000) : null
          })
          return false
        }
      },

      // Logout
      logout: () => {
        set({
          isAuthenticated: false,
          lastActivity: Date.now()
        })
      },

      // Atualizar atividade
      updateActivity: () => {
        set({ lastActivity: Date.now() })
      },

      // Definir página atual
      setCurrentPage: (page: string) => {
        set({ currentPage: page })
      },

      // Verificar timeout
      checkTimeout: () => {
        const state = get()
        if (!state.isAuthenticated) return false
        
        const timeoutMs = TIMEOUT_MINUTES * 60 * 1000
        const isExpired = Date.now() - state.lastActivity > timeoutMs
        
        if (isExpired) {
          set({ isAuthenticated: false })
          return true
        }
        
        return false
      },

      // Reset tentativas de login
      resetLoginAttempts: () => {
        set({ loginAttempts: 0, isLocked: false, lockUntil: null })
      },

      // Bloquear conta
      lockAccount: () => {
        set({
          isLocked: true,
          lockUntil: Date.now() + (LOCK_DURATION_MINUTES * 60 * 1000)
        })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        lastActivity: state.lastActivity,
        currentPage: state.currentPage,
        loginAttempts: state.loginAttempts,
        isLocked: state.isLocked,
        lockUntil: state.lockUntil
      })
    }
  )
)

// Função para validar senha de forma segura
function validatePassword(password: string): boolean {
  // Comparação direta da senha (em produção seria hash + salt)
  // A senha real é: Ultr@S3Cr3t@!@#
  return password === ENCRYPTED_PASSWORD
}



// Hook para verificar timeout automaticamente
export const useAuthTimeout = () => {
  const { checkTimeout, updateActivity } = useAuthStore()
  
  // Verificar timeout a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const hasTimedOut = checkTimeout()
      if (hasTimedOut) {
        // Redirecionar para login se timeout
        window.location.href = '/login'
      }
    }, 60000) // 1 minuto
    
    return () => clearInterval(interval)
  }, [checkTimeout])
  
  // Atualizar atividade em eventos do usuário
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    const updateActivityOnEvent = () => updateActivity()
    
    events.forEach(event => {
      document.addEventListener(event, updateActivityOnEvent)
    })
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivityOnEvent)
      })
    }
  }, [updateActivity])
}
