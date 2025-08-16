import React from 'react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Shield,
  Activity
} from 'lucide-react'

/**
 * Componente de menu do usuário
 * Preparação para sistema de autenticação futuro
 */

interface UserMenuProps {
  className?: string
}

export const UserMenu: React.FC<UserMenuProps> = ({ className }) => {
  // TODO: Integrar com sistema de autenticação real
  const [isOpen, setIsOpen] = React.useState(false)
  
  // Dados mock do usuário (será substituído por dados reais)
  const user = {
    name: 'Usuário Sistema',
    email: 'usuario@coppetec.ufrj.br',
    avatar: undefined,
    role: 'Administrador',
    permissions: ['read', 'write', 'admin']
  }
  
  const handleLogout = () => {
    // TODO: Implementar logout real
    console.log('Logout solicitado')
    setIsOpen(false)
  }
  
  const handleProfile = () => {
    // TODO: Navegar para perfil do usuário
    console.log('Navegar para perfil')
    setIsOpen(false)
  }
  
  const handleSettings = () => {
    // TODO: Navegar para configurações
    console.log('Navegar para configurações')
    setIsOpen(false)
  }
  
  const handleNotifications = () => {
    // TODO: Abrir centro de notificações
    console.log('Abrir notificações')
    setIsOpen(false)
  }
  
  return (
    <div className={className}>
      {/* Botão de notificações */}
      <Button
        variant="ghost"
        size="sm"
        className="relative mr-2"
        onClick={handleNotifications}
      >
        <Bell className="h-4 w-4" />
        {/* Badge de notificações não lidas */}
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
          3
        </span>
      </Button>
      
      {/* Menu do usuário */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <Shield className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{user.role}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleProfile}>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleSettings}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <Activity className="mr-2 h-4 w-4" />
            <span>Atividade</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default UserMenu
