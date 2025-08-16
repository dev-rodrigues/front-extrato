import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Bell, User, Bird } from 'lucide-react'

export const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo e Nome do Sistema */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Bird className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">BB Extrato</span>
          </div>
          <Badge variant="secondary" className="hidden md:inline-flex">
            v1.0.0
          </Badge>
        </div>

        {/* Barra de Busca */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar agência, conta..."
              className="pl-10 pr-4 py-2 w-80 rounded-md border bg-background text-sm"
            />
          </div>
        </div>

        {/* Ações do Usuário */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
