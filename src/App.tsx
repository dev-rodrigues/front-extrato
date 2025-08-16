import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes'

/**
 * App - Componente principal que usa o sistema de rotas centralizado
 * Todas as rotas são definidas em src/routes/index.tsx conforme RFCs
 */
function App() {
  return <RouterProvider router={router} />
}

export default App
