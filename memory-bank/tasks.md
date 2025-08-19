# TASKS - Banco de Memória

## Tarefa Atual
*Nenhuma tarefa ativa no momento*

---

## Próxima Tarefa
*Aguardando definição da próxima tarefa*

---

## Histórico de Tarefas
- ✅ **TASK-021**: Limpeza e Otimização de Arquivos de Rotas e Configuração (Arquivada)
- ✅ **TASK-020**: Componente de Card Padronizado com Loading de Refetch (Arquivada)
- ✅ **TASK-019**: Ajuste do Header para Design System (Arquivada)
- ✅ **TASK-018**: Implementação de Sistema de Feedback Visual (Arquivada)
- ✅ **TASK-017**: Sistema de Loading e Feedback Visual (Arquivada)
- ✅ **TASK-016**: Implementação de React Query (Arquivada)
- ✅ **TASK-015**: Dockerização da Aplicação (Arquivada)
- ✅ **TASK-006**: Estrutura Base da Aplicação (Arquivada)
- ✅ **TASK-004**: Configuração do Projeto (Arquivada)
- ✅ **TASK-003**: Análise e Estruturação (Arquivada)
- ✅ **TASK-001**: Setup Inicial do Projeto (Arquivada)

---

## Notas
- Todas as tarefas anteriores foram concluídas com sucesso
- Sistema está funcionando e estável
- Nova tarefa focada em limpeza e otimização de código

---

# Tipo da Tarefa
feature

# Descrição
Corrigir o sistema de versionamento automático do projeto e exibir a versão da aplicação na interface do usuário como uma etiqueta elegante abaixo da logo, mantendo a identidade visual minimalista e integrada ao design do projeto.

# Contexto (arquivos/trechos)
- docker-build.sh (script de build Docker)
- package.json (versão do projeto)
- src/components/layout/Header/Logo.tsx (componente da logo)
- src/components/layout/Header/Header.tsx (header principal)

# Critérios de Aceite
- [x] Corrigir docker-build.sh para gerar versão correta do projeto
- [x] Atualizar versão em package.json automaticamente
- [x] Exibir versão da aplicação ao lado da logo
- [x] Manter identidade visual minimalista e clara
- [x] Versão não deve quebrar o design existente

# Plano (curto)
1) Corrigir script docker-build.sh para versionamento correto
2) Atualizar package.json com nova versão
3) Modificar componente Logo para exibir versão
4) Ajustar Header para acomodar versão
5) Testar visualização da versão

# Testes
- Unit: Verificar exibição da versão no componente Logo
- Integration: Testar build Docker com nova versão
- Visual: Confirmar que versão não quebra identidade visual
