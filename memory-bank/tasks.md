# Tipo da Tarefa
refactor

# Descrição
Alterar a URL base do serviço usado pelo axios de `https://146.164.65.231/EXTRATO` para `https://apidev.coppetec.ufrj.br/EXTRATO` nos ambientes de produção e teste. A aplicação atualmente está configurada para usar um IP específico, mas precisa ser migrada para o domínio oficial da API de desenvolvimento da Coppetec.

# Contexto (arquivos/trechos)
- src/services/api.ts (linhas 15-16, 20-21) - Configuração da baseURL nos ambientes
- env.production (linhas 6-7) - URL da API em produção
- env.production (linhas 25-26) - URL do WebSocket em produção
- env.development (linhas 1-6) - Configurações de desenvolvimento

# Critérios de Aceite
- [ ] URL da API alterada para `https://apidev.coppetec.ufrj.br/EXTRATO` em produção
- [ ] URL do WebSocket alterada para `https://apidev.coppetec.ufrj.br/EXTRATO` em produção
- [ ] URL da API alterada para `https://apidev.coppetec.ufrj.br/EXTRATO` em desenvolvimento (fallback)
- [ ] Configurações de timeout e retry mantidas conforme ambiente
- [ ] Logs de configuração atualizados para refletir nova URL
- [ ] Testes de conectividade com nova API funcionando

# Plano (curto)
1) Atualizar `env.production` com nova URL da API e WebSocket
2) Atualizar `env.development` com nova URL como fallback
3) Verificar se `src/services/api.ts` precisa de ajustes na configuração
4) Testar conectividade com nova API
5) Validar funcionamento em ambiente de produção

# Testes
- Unit: Verificar se configurações de ambiente são carregadas corretamente
- Integration: Testar conectividade com nova API em diferentes ambientes
- E2E: Validar fluxos principais da aplicação com nova URL

# Observações
- A URL atual `https://146.164.65.231/EXTRATO` será substituída por `https://apidev.coppetec.ufrj.br/EXTRATO`
- Manter configurações específicas de cada ambiente (timeout, retry, etc.)
- Verificar se há outros serviços que dependem da URL da API
- Considerar impacto em logs e monitoramento
