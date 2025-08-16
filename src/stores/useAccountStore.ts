import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Account {
  agencia: string
  contaCorrente: string
  banco: string
  nomeTitular?: string
  saldoAtual?: number
  ultimaAtualizacao?: string
}

interface AccountState {
  // Estado
  accounts: Account[]
  selectedAccount: Account | null
  recentQueries: string[]
  
  // Ações
  addAccount: (account: Account) => void
  removeAccount: (agencia: string, contaCorrente: string) => void
  selectAccount: (account: Account | null) => void
  updateAccount: (agencia: string, contaCorrente: string, updates: Partial<Account>) => void
  addRecentQuery: (query: string) => void
  clearRecentQueries: () => void
  
  // Computed values
  getAccount: (agencia: string, contaCorrente: string) => Account | undefined
  hasAccount: (agencia: string, contaCorrente: string) => boolean
  getAccountsCount: () => number
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      accounts: [],
      selectedAccount: null,
      recentQueries: [],
      
      // Ações
      addAccount: (account: Account) => {
        set((state) => {
          const exists = state.accounts.some(
            acc => acc.agencia === account.agencia && acc.contaCorrente === account.contaCorrente
          )
          
          if (exists) {
            return state
          }
          
          return {
            accounts: [...state.accounts, account]
          }
        })
      },
      
      removeAccount: (agencia: string, contaCorrente: string) => {
        set((state) => ({
          accounts: state.accounts.filter(
            acc => !(acc.agencia === agencia && acc.contaCorrente === contaCorrente)
          ),
          selectedAccount: state.selectedAccount?.agencia === agencia && 
                          state.selectedAccount?.contaCorrente === contaCorrente 
                          ? null 
                          : state.selectedAccount
        }))
      },
      
      selectAccount: (account: Account | null) => {
        set({ selectedAccount: account })
      },
      
      updateAccount: (agencia: string, contaCorrente: string, updates: Partial<Account>) => {
        set((state) => ({
          accounts: state.accounts.map(acc => 
            acc.agencia === agencia && acc.contaCorrente === contaCorrente
              ? { ...acc, ...updates }
              : acc
          ),
          selectedAccount: state.selectedAccount?.agencia === agencia && 
                          state.selectedAccount?.contaCorrente === contaCorrente
                          ? { ...state.selectedAccount, ...updates }
                          : state.selectedAccount
        }))
      },
      
      addRecentQuery: (query: string) => {
        set((state) => ({
          recentQueries: [
            query,
            ...state.recentQueries.filter(q => q !== query)
          ].slice(0, 10) // Manter apenas os últimos 10
        }))
      },
      
      clearRecentQueries: () => {
        set({ recentQueries: [] })
      },
      
      // Computed values
      getAccount: (agencia: string, contaCorrente: string) => {
        return get().accounts.find(
          acc => acc.agencia === agencia && acc.contaCorrente === contaCorrente
        )
      },
      
      hasAccount: (agencia: string, contaCorrente: string) => {
        return get().getAccount(agencia, contaCorrente) !== undefined
      },
      
      getAccountsCount: () => {
        return get().accounts.length
      }
    }),
    {
      name: 'account-storage',
      partialize: (state) => ({
        accounts: state.accounts,
        recentQueries: state.recentQueries
      })
    }
  )
)
