# Frontend BB Extrato

Sistema frontend para consulta de extratos bancários do Banco do Brasil, desenvolvido com React 18+, TypeScript, shadcn/ui e Tailwind CSS.

## 🚀 Tecnologias

- **Framework**: React 18+ com TypeScript
- **UI Components**: shadcn/ui (baseado em Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Formulários**: React Hook Form + Zod
- **Roteamento**: React Router DOM

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/           # Componentes shadcn/ui
│   ├── forms/        # Formulários reutilizáveis
│   ├── layout/       # Componentes de layout
│   └── features/     # Componentes específicos por feature
├── hooks/            # Custom hooks
├── services/         # Serviços de API
├── stores/           # Estado global (Zustand)
├── types/            # Tipos TypeScript
├── utils/            # Utilitários
├── schemas/          # Schemas de validação Zod
└── assets/           # Recursos estáticos
```

## 🛠️ Instalação e Setup

### Pré-requisitos
- Node.js 18+ 
- npm 9+

### Instalação
```bash
# Clonar o repositório
git clone [url-do-repositorio]

# Navegar para o diretório
cd frontend-bb-extrato

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Iniciar servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente
Crie um arquivo `.env` baseado no `.env.example`:

```env
VITE_APP_TITLE=Frontend BB Extrato
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_VERSION=1.0.0
NODE_ENV=development
```

## 🎯 Funcionalidades

- **Dashboard**: Visão geral do sistema
- **Consulta de Contas**: Busca por agência e conta corrente
- **Logs de Consulta**: Histórico de consultas realizadas
- **Importações**: Controle de arquivos importados
- **Movimentações**: Detalhamento de movimentações bancárias

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build de produção
npm run lint         # Executa ESLint
npm run type-check   # Verifica tipos TypeScript
```

## 📚 Documentação

- [Arquitetura](./docs/architecture-overview.md)
- [Implementação Frontend](./docs/frontend-implementation.md)
- [API Endpoints](./docs/api-endpoints.md)
- [Componentes](./docs/components-reference.md)

## 🔧 Desenvolvimento

### Adicionar Componentes shadcn/ui
```bash
npx shadcn@latest add [component-name]
```

### Estrutura de Componentes
- Use TypeScript para todos os componentes
- Implemente validação com Zod
- Siga os padrões de design do shadcn/ui
- Mantenha componentes reutilizáveis

### Estado Global
- Use Zustand para gerenciamento de estado
- Mantenha stores organizados por domínio
- Implemente persistência quando necessário

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Servir Build
```bash
npm run preview
```

## 📝 Licença

Este projeto é parte do sistema de consulta de extratos bancários da Coppetec.

---

**Desenvolvido com ❤️ pela equipe de desenvolvimento**
