# 📁 Índice da Coleção Postman - COPPETEC BB Extrato API

## 🎯 **Visão Geral**
Este diretório contém todos os arquivos necessários para a coleção completa do Postman para validação da API COPPETEC BB Extrato.

## 📋 **Arquivos Disponíveis**

### **1. Coleção Principal**
- **`COPPETEC_BB_Extrato_API.postman_collection.json`**
  - Coleção completa com todos os endpoints de Schedule Monitoring
  - Testes automatizados para cada endpoint
  - Validações de schema e performance

### **2. Variáveis de Ambiente**
- **`Development.postman_environment.json`**
  - Configurações para ambiente de desenvolvimento
  - URL base: `http://localhost:8080`
  - Perfil: `dev`

- **`Production.postman_environment.json`**
  - Configurações para ambiente de produção
  - URL base: `http://146.164.65.214:10000`
  - Perfil: `prd`

### **3. Endpoints Adicionais**
- **`account-query-endpoints.json`**
  - Endpoints de consulta de contas bancárias
  - Testes específicos para agência 2234-9 e conta 57446-5
  - Validações de período abril 2025 (mes=4, ano=2025)

- **`integration-tests.json`**
  - Testes de integração e performance
  - Validação de workflows completos
  - Testes de tratamento de erros

### **4. Documentação**
- **`README.md`**
  - Guia completo de instalação e uso
  - Descrição detalhada de todos os endpoints
  - Instruções de execução dos testes

- **`curl-examples.md`**
  - Comandos cURL para validação rápida
  - Scripts de automação de testes
  - Exemplos de uso sem Postman

- **`INDEX.md`** (este arquivo)
  - Índice organizado de todos os arquivos
  - Guia de navegação da documentação

## 🚀 **Como Usar**

### **Opção 1: Postman (Recomendado)**
1. Importe a coleção principal
2. Importe o ambiente desejado (dev/prd)
3. Execute os testes individualmente ou em lote

### **Opção 2: cURL (Rápido)**
1. Use os comandos do arquivo `curl-examples.md`
2. Execute os scripts de automação
3. Valide endpoints diretamente do terminal

## 📊 **Estrutura da Coleção**

```
📁 COPPETEC BB Extrato API
├── 📁 Schedule Monitoring (6 endpoints)
│   ├── Health Check
│   ├── Progress Monitoring
│   ├── Active Jobs
│   ├── Job Status
│   ├── System Statistics
│   └── Cancel Job
├── 📁 Account Query (3 endpoints)
│   ├── Query Logs
│   ├── Import Records
│   └── Bank Movements
└── 📁 Integration Tests (4 testes)
    ├── Complete Workflow
    ├── Performance Test
    ├── Error Handling
    └── Data Validation
```

## 🎯 **Endpoints Testados**

### **Schedule Monitoring**
- ✅ `GET /api/schedule/health`
- ✅ `GET /api/schedule/progress`
- ✅ `GET /api/schedule/active`
- ✅ `GET /api/schedule/job/{jobName}`
- ✅ `GET /api/schedule/stats`
- ✅ `POST /api/schedule/job/{jobName}/cancel`

### **Account Query**
- ✅ `GET /api/accounts/{agencia}/{contaCorrente}/query-logs`
- ✅ `GET /api/accounts/{agencia}/{contaCorrente}/imports`
- ✅ `GET /api/accounts/{agencia}/{contaCorrente}/movements`

## 🧪 **Tipos de Teste**

### **Testes Funcionais**
- ✅ Validação de status HTTP
- ✅ Verificação de estrutura JSON
- ✅ Validação de campos obrigatórios
- ✅ Verificação de tipos de dados

### **Testes de Performance**
- ✅ Tempo de resposta
- ✅ Consistência de performance
- ✅ Throughput mínimo
- ✅ Latência máxima

### **Testes de Negócio**
- ✅ Validação de agência 2234-9
- ✅ Validação de conta 57446-5
- ✅ Validação de período abril-maio 2024
- ✅ Verificação de paginação

## 🌍 **Ambientes Suportados**

### **Development**
- **URL**: `http://localhost:8080`
- **Perfil**: `dev`
- **Uso**: Desenvolvimento local

### **Production**
- **URL**: `http://146.164.65.214:10000`
- **Perfil**: `prd`
- **Uso**: Ambiente de produção

## 📈 **Métricas de Qualidade**

### **Cobertura de Teste**
- **Endpoints**: 9/9 (100%)
- **Status HTTP**: 200, 400, 404, 500
- **Validações**: Schema, tipos, negócio, performance

### **Performance Esperada**
- **Endpoints Simples**: < 100ms
- **Endpoints Complexos**: < 500ms
- **Throughput Mínimo**: 5 req/s

## 🔧 **Ferramentas Necessárias**

### **Postman**
- Versão: 10.0.0 ou superior
- Funcionalidades: Coleções, ambientes, testes automatizados

### **cURL**
- Versão: 7.0 ou superior
- Funcionalidades: HTTP requests, scripts de automação

### **jq (Opcional)**
- Funcionalidades: Formatação e filtragem de JSON
- Uso: Análise de respostas da API

## 📝 **Notas de Implementação**

### **Dados de Teste Específicos**
- **Agência**: 2234-9
- **Conta Corrente**: 57446-5
- **Período**: Abril-Maio 2024
- **Formato de Data**: ISO 8601

### **Validações Implementadas**
- ✅ Estrutura de resposta JSON
- ✅ Tipos de dados corretos
- ✅ Campos obrigatórios presentes
- ✅ Valores lógicos e consistentes
- ✅ Formato de datas válido
- ✅ Paginação funcionando

## 🚨 **Troubleshooting**

### **Problemas Comuns**
1. **Erro de Conexão**: Verificar URL base e conectividade
2. **Timeout**: Ajustar configurações de timeout
3. **Validação**: Verificar formato dos parâmetros
4. **Performance**: Monitorar tempos de resposta

### **Soluções**
- Use os comandos cURL para debug rápido
- Verifique logs da aplicação
- Confirme configurações de ambiente
- Teste endpoints individualmente

## 📚 **Recursos Adicionais**

### **Documentação da API**
- `docs/schedule-monitoring.md`
- `docs/api-endpoints.md`
- `docs/architecture-overview.md`

### **Scripts de Automação**
- Validação completa da API
- Testes de performance
- Monitoramento contínuo

## 🎉 **Status da Implementação**

### **✅ Concluído**
- Coleção principal do Postman
- Variáveis de ambiente (dev/prd)
- Endpoints de Account Query
- Testes de integração
- Documentação completa
- Exemplos de cURL
- Scripts de automação

### **🚀 Pronto para Uso**
- Todos os arquivos criados
- Testes automatizados implementados
- Validações específicas configuradas
- Documentação detalhada disponível

## 📞 **Suporte**

Para dúvidas ou problemas com a coleção:

1. **Verifique a documentação** em `README.md`
2. **Use os comandos cURL** para debug rápido
3. **Execute testes individuais** para isolamento de problemas
4. **Consulte os logs** da aplicação para erros específicos

---

**🎯 Objetivo Alcançado**: Coleção completa do Postman para validação da API COPPETEC BB Extrato, incluindo testes específicos para agência 2234-9, conta 57446-5 e período abril-maio 2024.
