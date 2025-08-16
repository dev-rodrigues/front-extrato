/**
 * Índice de componentes RFC-compliant
 * Todos os componentes implementam funcionalidades documentadas nos RFCs
 */

// Layout
export { Layout } from './layout/Layout'
export { Navigation } from './layout/Navigation'

// Header Components
export { Header } from './layout/Header/Header'
export { Logo } from './layout/Header/Logo'
export { DesktopNav } from './layout/Header/DesktopNav'
export { MobileMenu } from './layout/Header/MobileMenu'
export { useMobileMenu } from './layout/Header/useMobileMenu'

// Footer Components
export { Footer } from './layout/Footer/Footer'

// Forms
export { AccountQueryForm } from './forms/AccountQueryForm'

// Lists
export { PaginatedList } from './lists/PaginatedList'

// Navigation
export { Breadcrumbs, useBreadcrumbs } from './navigation/Breadcrumbs'

// UI Components
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './ui/dropdown-menu'
