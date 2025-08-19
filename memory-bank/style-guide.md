# Style Guide - Frontend BB Extrato

## 🎨 **Paleta de Cores**

### **Cores Principais**
- **Primary**: `hsl(220.9 39.3% 11%)` - Azul escuro para elementos principais
- **Primary Foreground**: `hsl(210 20% 98%)` - Branco para texto sobre primary
- **Secondary**: `hsl(220 14.3% 95.9%)` - Cinza claro para elementos secundários
- **Secondary Foreground**: `hsl(220.9 39.3% 11%)` - Azul escuro para texto sobre secondary

### **Cores de Status**
- **Background**: `hsl(0 0% 100%)` - Branco para fundos
- **Foreground**: `hsl(224 71.4% 4.1%)` - Preto para texto principal
- **Muted**: `hsl(220 14.3% 95.9%)` - Cinza para elementos atenuados
- **Muted Foreground**: `hsl(220 8.9% 46.1%)` - Cinza escuro para texto atenuado
- **Border**: `hsl(220 13% 91%)` - Cinza para bordas
- **Destructive**: `hsl(0 84.2% 60.2%)` - Vermelho para ações destrutivas

## 🔤 **Tipografia**

### **Famílias de Fonte**
- **Padrão**: Sistema de fontes do usuário (sans-serif)
- **Monospace**: Para código e versões (font-mono)

### **Tamanhos e Pesos**
- **Títulos**: `text-xl` (1.25rem), `font-bold`
- **Subtítulos**: `text-lg` (1.125rem), `font-bold`
- **Texto Principal**: `text-base` (1rem), `font-normal`
- **Texto Pequeno**: `text-sm` (0.875rem), `font-normal`
- **Texto Muito Pequeno**: `text-xs` (0.75rem), `font-normal`

## 📏 **Sistema de Espaçamento**

### **Escala Base (Tailwind)**
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)

### **Espaçamento Específico**
- **Header Height**: `h-16` (64px)
- **Logo Spacing**: `space-x-2` (8px entre elementos)
- **Container Padding**: `px-4` (16px horizontal)

## 🔘 **Componentes**

### **Bordas e Raios**
- **Border Radius Padrão**: `var(--radius)` (0.5rem)
- **Border Radius Pequeno**: `calc(var(--radius) - 4px)`
- **Border Radius Médio**: `calc(var(--radius) - 2px)`

### **Sombras**
- **Header Shadow**: `shadow-lg` - Sombra forte para header
- **Card Shadow**: `shadow-md` - Sombra média para cards

### **Estados e Interações**
- **Hover**: Transições suaves com `transition-colors`
- **Focus**: Ring com cor primary para acessibilidade
- **Disabled**: Opacidade reduzida para elementos desabilitados

## 📱 **Responsividade**

### **Breakpoints**
- **Mobile**: `< 640px` - Logo compacto, versão oculta em telas muito pequenas
- **Tablet**: `640px - 1024px` - Logo médio
- **Desktop**: `> 1024px` - Logo completo

### **Adaptações**
- **Logo Mobile**: `h-5 w-5` (20px)
- **Logo Tablet**: `h-6 w-6` (24px)
- **Logo Desktop**: `h-8 w-8` (32px)

## 🎯 **Princípios de Design**

### **Minimalismo**
- Elementos limpos e sem excessos
- Espaçamento consistente
- Hierarquia visual clara

### **Consistência**
- Uso consistente da paleta de cores
- Padrões de espaçamento uniformes
- Comportamento previsível dos componentes

### **Acessibilidade**
- Contraste adequado entre cores
- Tamanhos de fonte legíveis
- Estados de foco visíveis
