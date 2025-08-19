# TASK-020: Componente de Card Padronizado com Loading de Refetch

## Tipo da Tarefa
feature

## Descrição
Criar um componente de card genérico que padronize a exibição e comportamento do loading de refetch em todos os cards da aplicação. O componente deve incluir um indicador de loading que aparece em posição padronizada (após o último botão/ação) com transições suaves, delay configurável para refetch rápido, tooltip informativo e usar o ícone da logo do projeto (GiKiwiBird) para manter a identidade visual. Este componente será reutilizável para qualquer card que precise exibir loading de refetch.

## Contexto (arquivos/trechos)
- `src/pages/SchedulePage.tsx` - Página de schedule com cards de jobs ativos (primeira implementação)
- `src/pages/DashboardPage.tsx` - Página de dashboard com cards de métricas (futura implementação)
- `src/components/ui/AppLoading.tsx` - Componente de loading com logo GiKiwiBird
- `src/components/ui/card.tsx` - Componentes base de card do shadcn/ui
- `src/index.css` - Animações CSS para transições suaves

## Critérios de Aceite
- [x] Componente de card genérico criado para padronizar loading de refetch
- [x] Loading de refetch aparece em posição padronizada (após último botão/ação)
- [x] Transições suaves implementadas para aparecer e sumir o loading
- [x] Delay configurável implementado para refetch rápido (usuário conseguir ver)
- [x] Ícone de loading usa a logo do projeto (GiKiwiBird) com texto "Carregando..."
- [x] Tooltip implementado informando que está consultando novos dados no backend
- [x] Identidade visual do projeto mantida
- [x] Nenhuma funcionalidade, feature ou caso de uso novo adicionado
- [x] Componente reutilizável para qualquer tipo de card
- [x] Props flexíveis para diferentes layouts e conteúdos

## Plano (curto)
1) [x] Analisar estrutura atual dos cards na aplicação (SchedulePage e DashboardPage)
2) [x] Criar componente CardWithRefetch padronizado com props para loading de refetch
3) [x] Implementar indicador de loading com GiKiwiBird em posição padronizada
4) [x] Adicionar transições suaves para aparecer/sumir com delay configurável
5) [x] Implementar tooltip informativo sobre consulta ao backend
6) [x] Integrar componente na SchedulePage como primeira implementação
7) [x] Testar transições e delay do loading de refetch
8) [x] Preparar para uso futuro em outros cards da aplicação

## Testes
- [x] Unit: Verificar se componente CardWithRefetch renderiza corretamente
- [x] Integration: Testar loading de refetch com delay e transições
- [x] Visual: Validar tooltip e transições suaves
- [x] Props: Verificar se todas as props são passadas corretamente
- [x] Reutilização: Testar componente em diferentes contextos de card

## Arquivos a Criar/Modificar
- [x] `src/components/ui/CardWithRefetch.tsx` - Novo componente de card genérico com loading de refetch
- [x] `src/pages/SchedulePage.tsx` - Integrar novo componente CardWithRefetch
- [x] `src/index.css` - Adicionar animações para transições do loading (se necessário)

## Comandos de Teste
```bash
# Verificar se não há erros de build
npm run build

# Testar desenvolvimento
npm run dev

# Executar testes
npm run test
```

## Observações
- Manter funcionalidade existente de todos os elementos do card (botões, conteúdo, etc.)
- Loading deve aparecer apenas durante refetch, não durante loading inicial
- Delay deve ser configurável para diferentes velocidades de rede
- Tooltip deve ser claro e informativo sobre o que está acontecendo
- Componente deve ser genérico e reutilizável para qualquer tipo de card
- Manter compatibilidade com sistema de loading existente
- Posição do loading deve ser padronizada para consistência visual

## ⚠️ **REGRAS DE DESENVOLVIMENTO**
- **RESTRIÇÃO DE USO**: Durante o desenvolvimento, o componente CardWithRefetch **SÓ PODE** ser usado exclusivamente na seção "Jobs Ativos" da página `/schedule`
- **NÃO IMPLEMENTAR** em outras páginas ou cards até que esta implementação esteja completamente testada e validada
- **FOCAR APENAS** na funcionalidade específica de loading de refetch para jobs ativos
- **NÃO EXPANDIR** o escopo para outros contextos até que a TASK-020 esteja 100% concluída
- **VALIDAÇÃO OBRIGATÓRIA**: Testar completamente na SchedulePage antes de considerar reutilização

## Status da Implementação
✅ **TASK-020 COMPLETAMENTE IMPLEMENTADA E REFATORADA!**

### 🎉 **Funcionalidades Implementadas**

#### 🎨 **Componente CardWithRefetch Genérico (REFATORADO)**
- **Wrapper puro**: Apenas adiciona loading de refetch, não contém lógica específica
- **Props flexíveis**: children, isRefetching, delay, tooltipText, className, showLoadingIndicator, title, subtitle
- **Loading padronizado**: Indicador com AppLoading (mesmo da tela inicial) em posição consistente
- **Transições suaves**: Fade in/out com translateY para entrada/saída
- **Delay configurável**: Padrão 1000ms para refetch rápido
- **Tooltip informativo**: "Consultando novos dados no backend..."

#### 🔄 **Implementação na SchedulePage**
- **Conteúdo como children**: Todo o conteúdo específico do job é passado como children
- **Botões flexíveis**: "Ver Detalhes" e "Cancelar" podem ou não estar presentes
- **Barra de progresso**: Implementada como children, não como parte do componente base
- **Informações do job**: Detalhes específicos passados como children
- **Loading fixo**: Posição do loading sempre após o último elemento (botões)

#### 💡 **Arquitetura Genérica e Reutilizável**
- **Separação de responsabilidades**: CardWithRefetch só cuida do loading, conteúdo é responsabilidade do usuário
- **Flexibilidade total**: Pode ser usado para qualquer tipo de card (jobs, histórico, métricas, etc.)
- **Props mínimas**: Apenas isRefetching é obrigatório, resto é opcional
- **Children pattern**: Conteúdo específico é passado como children para máxima flexibilidade

### 🚀 **Melhorias de UX Implementadas**
- **Feedback claro**: Usuário sabe quando dados estão sendo atualizados
- **Transições suaves**: Loading não é mais abrupto ou confuso
- **Posicionamento consistente**: Loading sempre aparece no mesmo local (após último elemento)
- **Identidade visual**: AppLoading (mesmo da tela inicial) para consistência

### 🔧 **Configurações Técnicas**
- **Componente wrapper**: Estrutura genérica sem lógica específica
- **Props bem definidas**: Interface TypeScript clara e flexível
- **Integração limpa**: Substituição completa da estrutura anterior
- **Build funcionando**: Sem erros de TypeScript

### 📱 **Experiência do Usuário**
- **Loading padronizado**: Comportamento uniforme em todos os cards
- **Tooltip informativo**: Explica claramente o que está acontecendo
- **Transições elegantes**: Animações suaves e profissionais
- **Performance otimizada**: Delay configurável para diferentes cenários

### 🎯 **Status Final**
✅ **TASK-020 completamente implementada e refatorada!**
✅ **Componente CardWithRefetch criado como wrapper genérico**
✅ **Implementação na SchedulePage com conteúdo como children**
✅ **Loading de refetch padronizado e elegante**
✅ **Tooltip informativo implementado**
✅ **Transições suaves com delay configurável**
✅ **Arquitetura genérica e reutilizável**
✅ **Build funcionando sem erros**

### 🔮 **Preparado para Futuras Expansões**
- **Histórico de Jobs**: Pode usar CardWithRefetch com conteúdo específico
- **Cards de Métricas**: Dashboard pode usar o mesmo padrão
- **Outras Páginas**: Qualquer card pode usar o wrapper genérico
- **Máxima Flexibilidade**: Conteúdo específico sempre como children

**🎉 Projeto agora possui: React + Docker + React Query + Sistema de Feedback Visual Profissional + Componente de Card Genérico com Loading de Refetch!**

**🚀 Durante o desenvolvimento, o componente está sendo usado EXCLUSIVAMENTE na seção "Jobs Ativos" da página /schedule, mas agora está preparado para uso em qualquer contexto!**

## Data de Arquivamento
2024-12-19

## Status Final
✅ **CONCLUÍDA E ARQUIVADA**
