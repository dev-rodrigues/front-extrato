import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configurações padrão para queries
      staleTime: 5 * 1000, // 5 segundos - dados considerados frescos
      gcTime: 10 * 60 * 1000, // 10 minutos - tempo de cache
      refetchOnWindowFocus: false, // Não refetch ao focar na janela
      retry: 2, // Tentar 2 vezes em caso de erro
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
