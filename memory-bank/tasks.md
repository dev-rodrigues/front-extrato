# Tipo da Tarefa
feature

# Descrição
Implementar sistema de autenticação com senha única para proteger todas as páginas do projeto. O usuário deve informar uma senha específica que será criptografada e armazenada de forma segura. Sistema deve incluir logout automático a cada 30 minutos, salvamento da página atual e redirecionamento após reautenticação.

# Contexto (arquivos/trechos)
- src/pages/SchedulePage.tsx (página atual)
- src/App.tsx (componente principal)
- src/routes/index.tsx (roteamento)
- src/components/layout/Header/Header.tsx (header com logo)
- src/components/ui/ (componentes de UI existentes)
- src/stores/ (estados globais)
- src/types/ (tipos TypeScript)

# Critérios de Aceite
- [x] Criar página de login minimalista seguindo identidade visual do projeto
- [x] Implementar sistema de autenticação com senha única: Ultr@S3Cr3t@!@#
- [x] Criptografar e ocultar senha no projeto de forma segura
- [x] Proteger todas as rotas e páginas existentes
- [x] Implementar logout automático a cada 30 minutos
- [x] Salvar página atual do usuário antes do logout
- [x] Redirecionar para página salva após reautenticação
- [x] Não fazer requests para backend para validação de token
- [x] Página de login deve conter nome do projeto e logo
- [x] Sistema deve funcionar sem dependências externas

# Plano (curto)
1) Criar componente de autenticação com criptografia da senha
2) Implementar store para gerenciar estado de autenticação
3) Criar página de login minimalista com identidade visual
4) Implementar proteção de rotas com guard de autenticação
5) Adicionar sistema de timeout automático (30 min)
6) Implementar salvamento e restauração da página atual
7) Integrar sistema em todas as páginas existentes

# Testes
- Unit: Testes de criptografia, timeout automático, proteção de rotas
- Integration: Fluxo completo de login → navegação → logout automático → reautenticação → retorno à página
