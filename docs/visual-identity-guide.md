# Guia de Identidade Visual - Frontend BB Extrato

## 🎨 Visão Geral da Identidade Visual

Este documento registra a identidade visual desenvolvida para o frontend da aplicação BB Extrato, incluindo paleta de cores, componentes, layout e padrões de design que devem ser mantidos durante o desenvolvimento.

## 🎨 Paleta de Cores

### Cores Primárias
- **Primary**: `#0066cc` (Azul BB - cor principal da marca)
- **Primary Foreground**: `#ffffff` (Branco para texto sobre fundo azul)

### Cores Secundárias
- **Secondary**: `#f8f9fa` (Cinza claro para fundos secundários)
- **Secondary Foreground**: `#6c757d` (Cinza médio para texto secundário)

### Cores de Estado
- **Success**: `#28a745` (Verde para operações bem-sucedidas)
- **Warning**: `#ffc107` (Amarelo para alertas)
- **Error**: `#dc3545` (Vermelho para erros)
- **Info**: `#17a2b8` (Azul claro para informações)

### Cores de Fundo
- **Background**: `#ffffff` (Branco para fundo principal)
- **Muted**: `#f8f9fa` (Cinza muito claro para fundos sutis)
- **Muted Foreground**: `#6c757d` (Cinza para texto em fundos claros)

### Cores de Borda
- **Border**: `#dee2e6` (Cinza claro para bordas)
- **Input**: `#ced4da` (Cinza para inputs)
- **Ring**: `#0066cc` (Azul para foco de elementos)

## 🧩 Sistema de Componentes

### Componentes Base (shadcn/ui)
- **Button**: Botões com variantes `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- **Card**: Cards com `CardHeader`, `CardContent`, `CardTitle` para organização de conteúdo
- **Input**: Campos de entrada com validação visual
- **Select**: Dropdowns com opções pré-definidas
- **Table**: Tabelas responsivas com `TableHeader`, `TableBody`, `TableRow`, `TableCell`
- **Badge**: Tags para status e categorização
- **Alert**: Alertas para notificações e mensagens importantes
- **Tabs**: Navegação por abas com `TabsList`, `TabsTrigger`, `TabsContent`

### Componentes Customizados
- **Layout**: Estrutura principal com sidebar, header e área de conteúdo
- **Sidebar**: Navegação lateral com menu hierárquico
- **Header**: Cabeçalho com breadcrumbs e ações do usuário
- **Dashboard**: Cards de métricas e widgets informativos

## 📱 Layout e Estrutura

### Grid System
- **Container**: `container mx-auto` para centralização
- **Padding**: `p-6` para espaçamento interno consistente
- **Gap**: `gap-6` para espaçamento entre elementos
- **Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` para responsividade

### Espaçamento
- **xs**: `space-y-2` (8px)
- **sm**: `space-y-4` (16px)
- **md**: `space-y-6` (24px)
- **lg**: `space-y-8` (32px)
- **xl**: `space-y-12` (48px)

### Breakpoints
- **Mobile**: `< 768px` (grid-cols-1)
- **Tablet**: `768px - 1024px` (grid-cols-2)
- **Desktop**: `> 1024px` (grid-cols-3)

## 🎯 Padrões de Design

### Tipografia
- **Títulos**: `text-3xl font-bold tracking-tight` para títulos principais
- **Subtítulos**: `text-lg font-semibold` para subtítulos
- **Texto**: `text-base` para texto padrão
- **Texto Secundário**: `text-muted-foreground` para informações complementares

### Estados Visuais
- **Hover**: `hover:underline`, `hover:bg-accent` para interações
- **Focus**: `focus:ring-2 focus:ring-ring` para acessibilidade
- **Disabled**: `disabled:opacity-50` para elementos desabilitados
- **Loading**: Skeleton loaders e spinners para estados de carregamento

### Feedback Visual
- **Sucesso**: Badges verdes com ícone ✅
- **Erro**: Badges vermelhos com ícone ❌
- **Aviso**: Badges amarelos com ícone ⚠️
- **Info**: Badges azuis com ícone ℹ️

## 🏗️ Estrutura de Arquivos

### Organização de Componentes
```
src/components/
├── ui/                    # Componentes base shadcn/ui
├── layout/                # Componentes de layout
│   ├── Layout.tsx        # Layout principal
│   ├── Sidebar.tsx       # Navegação lateral
│   ├── Header.tsx        # Cabeçalho
│   └── Breadcrumb.tsx    # Navegação breadcrumb
├── dashboard/             # Componentes do dashboard
│   ├── MainDashboard.tsx # Dashboard principal
│   ├── MetricCard.tsx    # Cards de métricas
│   └── AlertWidget.tsx   # Widget de alertas
├── features/              # Funcionalidades específicas
│   ├── AccountQuery.tsx  # Consulta de contas
│   ├── QueryLogs.tsx     # Logs de consulta
│   ├── Imports.tsx       # Importações
│   └── Movements.tsx     # Movimentações
└── forms/                 # Formulários
    ├── AccountQueryForm.tsx
    └── AdvancedAccountQueryForm.tsx
```

### Padrões de Nomenclatura
- **Componentes**: PascalCase (ex: `AccountQuery.tsx`)
- **Hooks**: camelCase com prefixo `use` (ex: `useAccountQuery.ts`)
- **Serviços**: camelCase (ex: `accountService.ts`)
- **Tipos**: PascalCase (ex: `AccountQueryRequest`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `API_ENDPOINTS`)

## 🎨 Exemplos de Implementação

### Card de Métrica
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Total Contas</CardTitle>
    <TrendingUp className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">150</div>
    <p className="text-xs text-muted-foreground">
      +20.1% em relação ao mês anterior
    </p>
  </CardContent>
</Card>
```

### Tabela Responsiva
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Data/Hora</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Descrição</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>2024-01-15 14:30</TableCell>
      <TableCell>
        <Badge variant="default" className="bg-green-500">
          ✅ Sucesso
        </Badge>
      </TableCell>
      <TableCell>Consulta realizada com sucesso</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Formulário com Validação
```tsx
<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label htmlFor="agencia">Agência</Label>
      <Input 
        id="agencia"
        {...form.register("agencia")} 
        placeholder="1234" 
      />
      {form.formState.errors.agencia && (
        <p className="text-sm text-red-500">
          {form.formState.errors.agencia.message}
        </p>
      )}
    </div>
  </div>
  <Button type="submit" disabled={form.formState.isSubmitting}>
    {form.formState.isSubmitting ? "Consultando..." : "Consultar"}
  </Button>
</form>
```

## 🔧 Configurações Tailwind

### Extensões Personalizadas
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
}
```

### Variáveis CSS
```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.5rem;
}
```

## 📱 Responsividade

### Mobile First
- **Base**: Design para mobile (320px+)
- **Tablet**: Adaptações para 768px+
- **Desktop**: Otimizações para 1024px+

### Breakpoints Responsivos
```tsx
// Exemplo de grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Conteúdo se adapta automaticamente */}
</div>

// Exemplo de navegação responsiva
<div className="hidden md:flex items-center space-x-4">
  {/* Menu horizontal apenas em desktop */}
</div>
```

## 🎯 Princípios de Design

### 1. Consistência
- Mesma paleta de cores em toda a aplicação
- Padrões de espaçamento uniformes
- Componentes reutilizáveis

### 2. Acessibilidade
- Contraste adequado entre texto e fundo
- Estados de foco visíveis
- Textos alternativos para ícones

### 3. Performance
- Lazy loading de componentes
- Otimização de imagens
- Minimização de re-renders

### 4. Manutenibilidade
- Componentes modulares
- Props tipadas com TypeScript
- Documentação clara

## 🚫 O que NÃO Alterar

### Cores Principais
- **NÃO** alterar a cor primária (#0066cc) - identidade da marca BB
- **NÃO** alterar a paleta de cores de estado (sucesso, erro, aviso)
- **NÃO** remover as variáveis CSS personalizadas

### Componentes Base
- **NÃO** remover ou alterar significativamente os componentes shadcn/ui
- **NÃO** alterar a estrutura de layout principal
- **NÃO** remover o sistema de grid responsivo

### Padrões de Espaçamento
- **NÃO** alterar os espaçamentos padrão (space-y-4, space-y-6, etc.)
- **NÃO** remover os breakpoints responsivos
- **NÃO** alterar a estrutura de containers

## 🔄 Processo de Atualização

### 1. Análise de Impacto
- Avaliar se a mudança afeta a identidade visual
- Verificar compatibilidade com componentes existentes
- Testar em diferentes tamanhos de tela

### 2. Implementação
- Criar branch específico para mudanças visuais
- Implementar mudanças gradualmente
- Manter consistência com padrões existentes

### 3. Validação
- Testar em diferentes dispositivos
- Verificar acessibilidade
- Validar com stakeholders

## 📚 Referências

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Design Patterns](https://react.dev/learn/thinking-in-react)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Documento Atualizado**: ${new Date().toLocaleDateString('pt-BR')}
**Versão**: 1.0 - Identidade Visual Consolidada
**Responsável**: Equipe de Frontend
