import { Bird } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>© 2024 Coppetec. Todos os direitos reservados.</span>
          <span>•</span>
          <div className="flex items-center space-x-2">
            <Bird className="h-4 w-4" />
            <span>Sistema BB Extrato v1.0.0</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span>Suporte: suporte@coppetec.com</span>
          <span>•</span>
          <span>Documentação</span>
        </div>
      </div>
    </footer>
  )
}
