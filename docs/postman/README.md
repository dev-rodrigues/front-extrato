# 📋 COPPETEC BB Extrato API - Coleção Postman

## 🎯 **Objetivo**
Esta coleção do Postman foi criada para validação e teste completo da API de monitoramento de schedule e consultas de extratos bancários da COPPETEC.

## 🚀 **Instalação e Configuração**

### **1. Importar a Coleção**
1. Abra o Postman
2. Clique em "Import"
3. Selecione o arquivo `COPPETEC_BB_Extrato_API.postman_collection.json`

### **2. Importar Variáveis de Ambiente**
1. Clique em "Import" novamente
2. Selecione o arquivo de ambiente desejado:
   - `Development.postman_environment.json` - Para ambiente de desenvolvimento
   - `Production.postman_environment.json` - Para ambiente de produção

### **3. Selecionar Ambiente**
1. No canto superior direito, selecione o ambiente apropriado
2. Verifique se as variáveis estão carregadas corretamente

## 🌍 **Variáveis de Ambiente**

### **Development**
- **baseUrl**: `http://localhost:8080`
- **profile**: `dev`

### **Production**
- **baseUrl**: `http://146.164.65.214:10000`
- **profile**: `prd`

### **Variáveis Comuns**
- **testAgency**: `2234-9` (Agência de teste)
- **testAccount**: `57446-5` (Conta corrente de teste)
- **testMes**: `4` (Mês de teste - abril)
- **testAno**: `2025` (Ano de teste)
- **pageSize**: `20` (Tamanho padrão da página)
- **maxPageSize**: `100` (Tamanho máximo da página)

## 📊 **Estrutura da Coleção**

### **1. Schedule Monitoring**
Endpoints para monitoramento de jobs agendados:

#### **Health Check** - `GET /api/schedule/health`
- **Descrição**: Verifica o status de saúde do sistema
- **Testes**: Status HTTP, tempo de resposta, estrutura da resposta
- **Validações**: Status válido (HEALTHY/IDLE), timestamp ISO

#### **Progress Monitoring** - `GET /api/schedule/progress`
- **Descrição**: Consulta progresso atual de todos os jobs
- **Testes**: Estrutura da resposta, tipos de dados, valores lógicos
- **Validações**: Campos obrigatórios, tipos corretos, valores consistentes

#### **Active Jobs** - `GET /api/schedule/active`
- **Descrição**: Lista de jobs ativos em execução
- **Testes**: Estrutura da resposta, campos obrigatórios, performance
- **Validações**: Array válido, campos necessários, tempo de resposta

#### **Job Status** - `GET /api/schedule/job/{jobName}`
- **Descrição**: Status de um job específico
- **Testes**: Status HTTP válido, estrutura da resposta
- **Validações**: 200 (encontrado) ou 404 (não encontrado)

#### **System Statistics** - `GET /api/schedule/stats`
- **Descrição**: Estatísticas resumidas do sistema
- **Testes**: Estrutura da resposta, tipos de dados, valores lógicos
- **Validações**: Campos obrigatórios, tipos corretos, consistência

#### **Cancel Job** - `POST /api/schedule/job/{jobName}/cancel`
- **Descrição**: Cancela um job em execução
- **Testes**: Status HTTP válido, tempo de resposta
- **Validações**: 200 (cancelado) ou 404 (não encontrado)

### **2. Account Query**
Endpoints para consulta de dados bancários específicos:

#### **Query Logs** - `GET /api/accounts/{agencia}/{contaCorrente}/query-logs`
- **Descrição**: Logs de tentativas de consulta de extrato
- **Parâmetros**: agencia, contaCorrente, mes, ano, page, size
- **Testes Específicos**: 
  - Agência 2234-9
  - Conta 57446-5
  - Período abril 2025
- **Validações**: Estrutura da resposta, dados específicos, período

#### **Import Records** - `GET /api/accounts/{agencia}/{contaCorrente}/imports`
- **Descrição**: Histórico de importações realizadas
- **Parâmetros**: agencia, contaCorrente, mes, ano, page, size
- **Testes Específicos**: 
  - Agência 2234-9
  - Conta 57446-5
  - Período abril 2025
- **Validações**: Estrutura da resposta, dados específicos, período

#### **Bank Movements** - `GET /api/accounts/{agencia}/{contaCorrente}/movements`
- **Descrição**: Movimentações bancárias registradas
- **Parâmetros**: agencia, contaCorrente, mes, ano, page, size
- **Testes Específicos**: 
  - Agência 2234-9
  - Conta 57446-5
  - Período abril 2025
- **Validações**: Estrutura da resposta, dados específicos, período

### **3. Integration Tests**
Testes de integração e performance:

#### **Complete Workflow Test**
- **Descrição**: Testa fluxo completo de execução
- **Validações**: Tempo total, health check funcionando

#### **Performance Test - Multiple Requests**
- **Descrição**: Testa consistência de performance
- **Validações**: Tempo de resposta, throughput, variação

#### **Error Handling Test**
- **Descrição**: Testa tratamento de erros
- **Validações**: Status 404, tempo de resposta para erro

#### **Data Validation Test - Agency 2234-9**
- **Descrição**: Validação específica para agência de teste
- **Validações**: Dados corretos, paginação funcionando

## 🧪 **Executando os Testes**

### **1. Teste Individual**
1. Selecione o endpoint desejado
2. Clique em "Send"
3. Verifique os resultados dos testes na aba "Test Results"

### **2. Teste da Coleção Completa**
1. Clique com botão direito na coleção
2. Selecione "Run collection"
3. Configure as opções de execução
4. Clique em "Run COPPETEC BB Extrato API"

### **3. Teste de Ambiente Específico**
1. Selecione o ambiente desejado (Development/Production)
2. Execute os testes específicos para aquele ambiente

## 📈 **Métricas de Performance**

### **Tempos de Resposta Esperados**
- **Endpoints Simples**: < 100ms
- **Endpoints Complexos**: < 500ms
- **Variação Máxima**: < 100ms entre requisições

### **Throughput Mínimo**
- **Mínimo**: 5 requests/segundo
- **Ideal**: 10+ requests/segundo

### **Critérios de Sucesso**
- ✅ Todos os testes passam
- ✅ Tempos de resposta dentro dos limites
- ✅ Estrutura das respostas válida
- ✅ Dados específicos corretos

## 🔍 **Cenários de Teste Específicos**

### **Cenário 1: Agência 2234-9 e Conta 57446-5**
1. **Query Logs**: Verificar histórico de consultas
2. **Import Records**: Verificar extratos importados
3. **Bank Movements**: Verificar transações bancárias

### **Cenário 2: Período Abril-Maio 2024**
1. **Data Início**: 2024-04-01T00:00:00
2. **Data Fim**: 2024-05-31T23:59:59
3. **Validação**: Todos os registros dentro do período

### **Cenário 3: Monitoramento de Schedule**
1. **Health Check**: Status do sistema
2. **Progress**: Progresso dos jobs
3. **Statistics**: Estatísticas gerais

## 🚨 **Troubleshooting**

### **Problemas Comuns**

#### **1. Erro de Conexão**
- Verifique se a API está rodando
- Confirme a URL base no ambiente
- Teste conectividade de rede

#### **2. Erro de Autenticação**
- Verifique se não há autenticação necessária
- Confirme as credenciais se aplicável

#### **3. Erro de Timeout**
- Aumente o timeout nas configurações
- Verifique performance da API
- Teste com menos dados

#### **4. Erro de Validação**
- Verifique formato dos parâmetros
- Confirme tipos de dados esperados
- Valide estrutura das respostas

### **Logs e Debug**
1. **Console do Postman**: Ver mensagens de debug
2. **Test Results**: Analise resultados detalhados
3. **Response**: Verifique corpo da resposta
4. **Headers**: Confirme headers da requisição

## 📚 **Recursos Adicionais**

### **Documentação da API**
- `docs/schedule-monitoring.md` - Monitoramento de schedule
- `docs/api-endpoints.md` - Endpoints disponíveis
- `docs/architecture-overview.md` - Visão geral da arquitetura

### **Scripts de Teste**
- Todos os endpoints incluem testes automatizados
- Validações de schema JSON
- Testes de performance
- Validações de negócio

### **Variáveis Dinâmicas**
- Timestamps automáticos
- IDs únicos
- Dados de teste configuráveis

## 🎉 **Conclusão**

Esta coleção fornece uma cobertura completa de testes para a API COPPETEC BB Extrato, incluindo:

- ✅ **9 endpoints** testados
- ✅ **Testes automatizados** para cada endpoint
- ✅ **Validações específicas** para agência 2234-9 e conta 57446-5
- ✅ **Testes de performance** e integração
- ✅ **Ambientes configurados** para dev e prd
- ✅ **Documentação completa** de uso

Para suporte adicional ou dúvidas sobre os testes, consulte a documentação da API ou entre em contato com a equipe de desenvolvimento.
