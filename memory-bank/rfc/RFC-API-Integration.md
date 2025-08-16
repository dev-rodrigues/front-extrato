# RFC - API de Integração COPPETEC BB Extrato

## 📋 **Informações do Documento**

- **Versão**: 1.0.0
- **Data de Criação**: 2025-01-27
- **Status**: Aprovado
- **Autor**: Sistema COPPETEC
- **Revisores**: Equipe de Desenvolvimento

## 🎯 **Objetivo**

Este documento especifica a interface completa da API REST para integração com sistemas frontend, fornecendo detalhes técnicos sobre endpoints, formatos de request/response, autenticação e exemplos de uso.

## 🌐 **Configuração da API**

### **URLs Base**
- **Desenvolvimento**: `http://localhost:8080`
- **Produção**: `https://api.coppetec.ufrj.br`

### **Autenticação**
Atualmente a API não requer autenticação. Todos os endpoints são públicos.

### **Formato de Resposta**
- **Content-Type**: `application/json`
- **Encoding**: UTF-8
- **Timezone**: UTC (ISO 8601)

### **Paginação Padrão**
Todos os endpoints de listagem suportam paginação com os seguintes parâmetros:
- `page`: Número da página (baseado em 0, padrão: 0)
- `size`: Tamanho da página (1-100, padrão: 20)

## 📡 **Endpoints da API**

### **1. Monitoramento de Schedule**

#### **1.1 GET /api/schedule/progress**

**Objetivo**: Consulta o progresso atual de todos os jobs agendados, fornecendo métricas agregadas e visão geral do sistema.

**Funcionalidade**: Retorna estatísticas em tempo real sobre jobs em execução, incluindo contadores de status, taxas de sucesso e métricas de performance.

**Parâmetros**: Nenhum

**Resposta de Sucesso (200)**:
```json
{
  "activeJobs": 2,
  "completedJobs": 15,
  "failedJobs": 1,
  "cancelledJobs": 0,
  "averageExecutionTime": 45000,
  "successRate": 0.9375,
  "totalRecordsProcessed": 1250,
  "totalAccountsProcessed": 8,
  "activeJobsList": [
    {
      "jobName": "consulta-extrato-1234567890",
      "status": "RUNNING",
      "statusDescription": "Em execução",
      "startTime": "2025-01-27T10:00:00",
      "endTime": null,
      "durationMs": null,
      "recordsProcessed": 150,
      "accountsProcessed": 2,
      "progressPercentage": 75,
      "errorMessage": null,
      "estimatedTimeRemaining": 15000,
      "lastUpdated": "2025-01-27T10:15:00"
    }
  ]
}
```

**Campos da Resposta**:
- `activeJobs`: Número de jobs atualmente em execução
- `completedJobs`: Total de jobs concluídos com sucesso
- `failedJobs`: Total de jobs que falharam
- `cancelledJobs`: Total de jobs cancelados
- `averageExecutionTime`: Tempo médio de execução em milissegundos
- `successRate`: Taxa de sucesso (0.0 a 1.0)
- `totalRecordsProcessed`: Total de registros processados
- `totalAccountsProcessed`: Total de contas processadas
- `activeJobsList`: Lista detalhada de jobs ativos

#### **1.2 GET /api/schedule/active**

**Objetivo**: Lista todos os jobs atualmente em execução para monitoramento em tempo real.

**Funcionalidade**: Fornece visibilidade sobre processos ativos, permitindo acompanhamento de progresso e identificação de gargalos.

**Parâmetros**: Nenhum

**Resposta de Sucesso (200)**:
```json
[
  {
    "jobName": "consulta-extrato-1234567890",
    "status": "RUNNING",
    "statusDescription": "Em execução",
    "startTime": "2025-01-27T10:00:00",
    "endTime": null,
    "durationMs": null,
    "recordsProcessed": 150,
    "accountsProcessed": 2,
    "progressPercentage": 75,
    "errorMessage": null,
    "estimatedTimeRemaining": 15000,
    "lastUpdated": "2025-01-27T10:15:00"
  }
]
```

#### **1.3 GET /api/schedule/job/{jobName}**

**Objetivo**: Consulta o status detalhado de um job específico pelo nome.

**Funcionalidade**: Permite monitoramento individual de jobs, útil para dashboards e sistemas de alerta.

**Parâmetros de Path**:
- `jobName`: Nome identificador do job (string)

**Resposta de Sucesso (200)**:
```json
{
  "jobName": "consulta-extrato-1234567890",
  "status": "RUNNING",
  "statusDescription": "Em execução",
  "startTime": "2025-01-27T10:00:00",
  "endTime": null,
  "durationMs": null,
  "recordsProcessed": 150,
  "accountsProcessed": 2,
  "progressPercentage": 75,
  "errorMessage": null,
  "estimatedTimeRemaining": 15000,
  "lastUpdated": "2025-01-27T10:15:00"
}
```

**Resposta de Erro (404)**: Job não encontrado

#### **1.4 GET /api/schedule/stats**

**Objetivo**: Obtém estatísticas resumidas do sistema para dashboards e relatórios.

**Funcionalidade**: Fornece métricas agregadas de performance e saúde do sistema.

**Parâmetros**: Nenhum

**Resposta de Sucesso (200)**:
```json
{
  "totalJobsExecuted": 18,
  "successRate": 0.94,
  "averageExecutionTime": 42000,
  "totalRecordsProcessed": 1500,
  "systemUptime": 86400000,
  "lastJobExecution": "2025-01-27T10:00:00"
}
```

#### **1.5 POST /api/schedule/job/{jobName}/cancel**

**Objetivo**: Cancela a execução de um job em andamento.

**Funcionalidade**: Permite interrupção controlada de processos longos ou problemáticos.

**Parâmetros de Path**:
- `jobName`: Nome identificador do job (string)

**Resposta de Sucesso (200)**: Job cancelado com sucesso

**Resposta de Erro (404)**: Job não encontrado

#### **1.6 GET /api/schedule/health**

**Objetivo**: Verifica a saúde do sistema de monitoramento.

**Funcionalidade**: Health check para sistemas de monitoramento externos.

**Parâmetros**: Nenhum

**Resposta de Sucesso (200)**:
```json
{
  "status": "UP",
  "timestamp": "2025-01-27T10:15:00",
  "version": "1.0.0"
}
```

### **2. Consulta de Contas Bancárias**

#### **2.1 GET /api/accounts/{agencia}/{contaCorrente}/query-logs**

**Objetivo**: Consulta logs de tentativas de consulta de extrato para uma conta específica.

**Funcionalidade**: Fornece histórico de tentativas de acesso aos dados bancários, incluindo sucessos, falhas e erros encontrados durante o processo de consulta.

**Parâmetros de Path**:
- `agencia`: Número da agência bancária (4 dígitos)
- `contaCorrente`: Número da conta corrente (formatos: XX.XXX-X ou XXXXX-X)

**Parâmetros de Query**:
- `dataInicio`: Data de início do período (formato: yyyy-MM-ddTHH:mm:ss) - opcional se mes/ano for fornecido
- `dataFim`: Data de fim do período (formato: yyyy-MM-ddTHH:mm:ss) - opcional se mes/ano for fornecido
- `mes`: Mês para consulta (1-12) - opcional se dataInicio/dataFim for fornecido
- `ano`: Ano para consulta (4 dígitos) - opcional se dataInicio/dataFim for fornecido
- `page`: Número da página (baseado em 0, padrão: 0)
- `size`: Tamanho da página (padrão: 20, máximo: 100)

**Resposta de Sucesso (200)**:
```json
{
  "content": [
    {
      "id": 12345,
      "banco": "001",
      "agencia": "2234",
      "contaCorrente": "12.345-6",
      "consultaPeriodoDe": "2025-01-01T00:00:00",
      "consultaPeriodoAte": "2025-01-31T23:59:59",
      "erroCodigo": 0,
      "erroDescricao": null,
      "dataHoraTentativa": "2025-01-27T10:00:00",
      "dataHora": "2025-01-27T10:00:00"
    }
  ],
  "pageNumber": 0,
  "pageSize": 20,
  "totalElements": 45,
  "totalPages": 3,
  "hasNext": true,
  "hasPrevious": false,
  "isFirst": true,
  "isLast": false
}
```

**Campos da Resposta**:
- `id`: Identificador único do log
- `banco`: Código do banco (001 = Banco do Brasil)
- `agencia`: Número da agência bancária
- `contaCorrente`: Número da conta corrente
- `consultaPeriodoDe`: Data de início do período consultado
- `consultaPeriodoAte`: Data de fim do período consultado
- `erroCodigo`: Código de erro (0 = Sucesso, outros = Erros)
- `erroDescricao`: Descrição detalhada do erro (se houver)
- `dataHoraTentativa`: Data e hora da tentativa de consulta
- `dataHora`: Data e hora do registro do log

#### **2.2 GET /api/accounts/{agencia}/{contaCorrente}/imports**

**Objetivo**: Consulta histórico de importações realizadas para uma conta específica.

**Funcionalidade**: Fornece visibilidade sobre arquivos processados, volumes de dados importados e metadados de processamento.

**Parâmetros de Path**:
- `agencia`: Número da agência bancária (4 dígitos)
- `contaCorrente`: Número da conta corrente (formatos: XX.XXX-X ou XXXXX-X)

**Parâmetros de Query**:
- `dataInicio`: Data de início do período (formato: yyyy-MM-ddTHH:mm:ss) - opcional se mes/ano for fornecido
- `dataFim`: Data de fim do período (formato: yyyy-MM-ddTHH:mm:ss) - opcional se mes/ano for fornecido
- `mes`: Mês para consulta (1-12) - opcional se dataInicio/dataFim for fornecido
- `ano`: Ano para consulta (4 dígitos) - opcional se dataInicio/dataFim for fornecido
- `page`: Número da página (baseado em 0, padrão: 0)
- `size`: Tamanho da página (padrão: 20, máximo: 100)

**Resposta de Sucesso (200)**:
```json
{
  "content": [
    {
      "id": 67890,
      "layoutId": 1,
      "documentId": 123,
      "bancoOrigem": "001",
      "arquivoNome": "extrato_20250127.txt",
      "arquivoGeracaoDataHora": "2025-01-27T09:00:00",
      "arquivoNumeroSequencial": 1001,
      "arquivoNumeroVersaoLayOut": "1.0",
      "qtdLotes": 5,
      "qtdRegistros": 250,
      "qtdContas": 2,
      "dataHora": "2025-01-27T10:00:00",
      "userId": 1,
      "consultaAgencia": "2234",
      "consultaContaCorrente": "12.345-6",
      "consultaPeriodoDe": "2025-01-01T00:00:00",
      "consultaPeriodoAte": "2025-01-31T23:59:59"
    }
  ],
  "pageNumber": 0,
  "pageSize": 20,
  "totalElements": 15,
  "totalPages": 1,
  "hasNext": false,
  "hasPrevious": false,
  "isFirst": true,
  "isLast": true
}
```

**Campos da Resposta**:
- `id`: Identificador único da importação
- `layoutId`: Identificador do layout utilizado
- `documentId`: Identificador do documento associado
- `bancoOrigem`: Código do banco de origem
- `arquivoNome`: Nome do arquivo processado
- `arquivoGeracaoDataHora`: Data de geração do arquivo
- `arquivoNumeroSequencial`: Número sequencial do arquivo
- `arquivoNumeroVersaoLayOut`: Versão do layout
- `qtdLotes`: Quantidade de lotes processados
- `qtdRegistros`: Total de registros importados
- `qtdContas`: Quantidade de contas processadas
- `dataHora`: Data e hora da importação
- `userId`: Identificador do usuário
- `consultaAgencia`: Agência consultada
- `consultaContaCorrente`: Conta consultada
- `consultaPeriodoDe`: Início do período consultado
- `consultaPeriodoAte`: Fim do período consultado

#### **2.3 GET /api/accounts/{agencia}/{contaCorrente}/movements**

**Objetivo**: Consulta movimentações bancárias registradas para uma conta específica.

**Funcionalidade**: Fornece histórico completo de transações financeiras, incluindo valores, saldos, históricos e informações complementares para análise contábil.

**Parâmetros de Path**:
- `agencia`: Número da agência bancária (4 dígitos)
- `contaCorrente`: Número da conta corrente (formatos: XX.XXX-X ou XXXXX-X)

**Parâmetros de Query**:
- `dataInicio`: Data de início do período (formato: yyyy-MM-ddTHH:mm:ss) - opcional se mes/ano for fornecido
- `dataFim`: Data de fim do período (formato: yyyy-MM-ddTHH:mm:ss) - opcional se mes/ano for fornecido
- `mes`: Mês para consulta (1-12) - opcional se dataInicio/dataFim for fornecido
- `ano`: Ano para consulta (4 dígitos) - opcional se dataInicio/dataFim for fornecido
- `page`: Número da página (baseado em 0, padrão: 0)
- `size`: Tamanho da página (padrão: 20, máximo: 100)

**Resposta de Sucesso (200)**:
```json
{
  "content": [
    {
      "id": 11111,
      "importId": 67890,
      "numeroSequencialExtrato": 1,
      "numeroSequencialNoArquivo": 1,
      "numeroSequencialNoLote": 1,
      "banco": "001",
      "agencia": "2234",
      "agenciaDV": "9",
      "contaCorrente": "12345",
      "contaCorrenteDV": "6",
      "contaCorrenteSIC": "123456789",
      "contaCorrenteDescricao": "CONTA CORRENTE",
      "movimentoData": "2025-01-27T10:00:00",
      "movimentoDataContabil": "2025-01-27T00:00:00",
      "movimentoTipo": "C",
      "movimentoValor": 1500.00,
      "movimentoSaldo": 5000.00,
      "posicaoSaldo": "C",
      "natureza": "CREDITO",
      "complementoTipo": "TED",
      "complementoBancoOrigem": "001",
      "complementoAgenciaOrigem": "1234",
      "complementoContaCorrenteOrigem": "56789",
      "complementoContaCorrenteDVOrigem": "0",
      "complementoAlfa": "TRANSFERENCIA",
      "isencaoCPMF": "N",
      "movimentoCategoria": "TRANSFERENCIA",
      "codigoHistorico": "001",
      "descricaoHistorico": "TRANSFERENCIA RECEBIDA",
      "documentoNumero": "123456",
      "somatorioValoresADebito": 0.00,
      "somatorioValoresACredito": 1500.00,
      "numeroLancamentos": 1,
      "numeroCpfCnpjContrapartida": "12345678901",
      "indicadorTipoPessoaContrapartida": "F"
    }
  ],
  "pageNumber": 0,
  "pageSize": 20,
  "totalElements": 250,
  "totalPages": 13,
  "hasNext": true,
  "hasPrevious": false,
  "isFirst": true,
  "isLast": false
}
```

**Campos da Resposta**:
- `id`: Identificador único da movimentação
- `importId`: ID da importação associada
- `numeroSequencialExtrato`: Sequencial no extrato
- `numeroSequencialNoArquivo`: Sequencial no arquivo
- `numeroSequencialNoLote`: Sequencial no lote
- `banco`: Código do banco
- `agencia`: Número da agência
- `agenciaDV`: Dígito verificador da agência
- `contaCorrente`: Número da conta corrente
- `contaCorrenteDV`: Dígito verificador da conta
- `contaCorrenteSIC`: Conta SIC
- `contaCorrenteDescricao`: Descrição da conta
- `movimentoData`: Data da movimentação
- `movimentoDataContabil`: Data contábil
- `movimentoTipo`: Tipo de movimentação (C=Crédito, D=Débito)
- `movimentoValor`: Valor da movimentação
- `movimentoSaldo`: Saldo após a movimentação
- `posicaoSaldo`: Posição do saldo (C=Crédito, D=Débito)
- `natureza`: Natureza da operação
- `complementoTipo`: Tipo de complemento
- `complementoBancoOrigem`: Banco de origem (transferências)
- `complementoAgenciaOrigem`: Agência de origem
- `complementoContaCorrenteOrigem`: Conta de origem
- `complementoContaCorrenteDVOrigem`: DV da conta de origem
- `complementoAlfa`: Complemento alfanumérico
- `isencaoCPMF`: Indicador de isenção CPMF
- `movimentoCategoria`: Categoria da movimentação
- `codigoHistorico`: Código do histórico bancário
- `descricaoHistorico`: Descrição do histórico
- `documentoNumero`: Número do documento
- `somatorioValoresADebito`: Somatório de débitos
- `somatorioValoresACredito`: Somatório de créditos
- `numeroLancamentos`: Número de lançamentos
- `numeroCpfCnpjContrapartida`: CPF/CNPJ da contrapartida
- `indicadorTipoPessoaContrapartida`: Tipo de pessoa (F=Física, J=Jurídica)

## 🔧 **Estruturas de Dados**

### **PaginationResponse<T>**
Estrutura genérica para todas as respostas paginadas:

```typescript
interface PaginationResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
}
```

### **JobExecutionStatus**
Enum para status dos jobs:

```typescript
enum JobExecutionStatus {
  STARTING = "STARTING",      // Iniciando
  RUNNING = "RUNNING",        // Em execução
  COMPLETED = "COMPLETED",    // Concluído
  FAILED = "FAILED",          // Falhou
  CANCELLED = "CANCELLED"     // Cancelado
}
```

## 📊 **Códigos de Status HTTP**

- **200**: Sucesso
- **400**: Parâmetros inválidos ou período inválido
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor

## 🚀 **Exemplos de Uso**

### **Monitoramento de Schedule**

#### **Progresso Geral dos Jobs**
```bash
curl -X GET "http://localhost:8080/api/schedule/progress"
```

#### **Jobs Ativos**
```bash
curl -X GET "http://localhost:8080/api/schedule/active"
```

#### **Status de Job Específico**
```bash
curl -X GET "http://localhost:8080/api/schedule/job/consulta-extrato-1234567890"
```

#### **Estatísticas do Sistema**
```bash
curl -X GET "http://localhost:8080/api/schedule/stats"
```

#### **Health Check**
```bash
curl -X GET "http://localhost:8080/api/schedule/health"
```

#### **Cancelar Job**
```bash
curl -X POST "http://localhost:8080/api/schedule/job/consulta-extrato-1234567890/cancel"
```

### **Consulta de Contas Bancárias**

#### **Logs de Consulta para Janeiro de 2025**
```bash
curl -X GET "http://localhost:8080/api/accounts/2234/12.345-6/query-logs?mes=1&ano=2025&page=0&size=20"
```

#### **Logs de Consulta com Período Específico**
```bash
curl -X GET "http://localhost:8080/api/accounts/2234/12.345-6/query-logs?dataInicio=2025-01-01T00:00:00&dataFim=2025-01-31T23:59:59&page=0&size=20"
```

#### **Importações para Abril de 2025**
```bash
curl -X GET "http://localhost:8080/api/accounts/2234/12.345-6/imports?mes=4&ano=2025&page=0&size=50"
```

#### **Importações com Período Específico**
```bash
curl -X GET "http://localhost:8080/api/accounts/2234/12.345-6/imports?dataInicio=2025-04-01T00:00:00&dataFim=2025-04-30T23:59:59&page=0&size=50"
```

#### **Movimentações para Dezembro de 2024**
```bash
curl -X GET "http://localhost:8080/api/accounts/2234/12.345-6/movements?mes=12&ano=2024&page=0&size=100"
```

#### **Movimentações com Período Específico**
```bash
curl -X GET "http://localhost:8080/api/accounts/2234/12.345-6/movements?dataInicio=2024-12-01T00:00:00&dataFim=2024-12-31T23:59:59&page=0&size=100"
```

#### **Consulta com Conta sem Ponto (Formato Alternativo)**
```bash
curl -X GET "http://localhost:8080/api/accounts/2234/57446-5/movements?mes=4&ano=2025&page=0&size=20"
```

#### **Consulta com Paginação Avançada**
```bash
curl -X GET "http://localhost:8080/api/accounts/2234/12.345-6/movements?mes=1&ano=2025&page=2&size=50"
```

## ⚠️ **Validações e Limitações**

### **Formato de Conta**
- **Formato com ponto**: XX.XXX-X (ex: 12.345-6)
- **Formato sem ponto**: XXXXX-X (ex: 12345-6)

### **Períodos de Consulta**
- **Opção 1**: Usar `dataInicio` e `dataFim` (formato ISO 8601)
- **Opção 2**: Usar `mes` (1-12) e `ano` (4 dígitos)
- **Não misturar**: As duas opções são mutuamente exclusivas

### **Paginação**
- **page**: Baseado em 0 (primeira página = 0)
- **size**: Mínimo 1, máximo 100, padrão 20

### **Limitações de Performance**
- Consultas com período muito amplo podem ser lentas
- Recomendado usar filtros de mês/ano para consultas históricas
- Máximo de 100 registros por página para evitar timeouts

## 🔍 **Tratamento de Erros**

### **Erro 400 - Parâmetros Inválidos**
```json
{
  "timestamp": "2025-01-27T10:15:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Data de início deve ser anterior ou igual à data de fim",
  "path": "/api/accounts/2234/12.345-6/movements"
}
```

### **Erro 404 - Recurso Não Encontrado**
```json
{
  "timestamp": "2025-01-27T10:15:00",
  "status": 404,
  "error": "Not Found",
  "message": "Conta não encontrada",
  "path": "/api/accounts/9999/99.999-9/movements"
}
```

### **Erro 500 - Erro Interno**
```json
{
  "timestamp": "2025-01-27T10:15:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Erro interno do servidor",
  "path": "/api/accounts/2234/12.345-6/movements"
}
```

## 📱 **Integração Frontend**

### **Types TypeScript Necessários**

#### **Parâmetros de Consulta**
```typescript
interface AccountQueryParams {
  agencia: string;
  contaCorrente: string;
  mes?: number;
  ano?: number;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  size?: number;
}

interface ScheduleQueryParams {
  jobName?: string;
}
```

#### **Respostas de Conta Bancária**
```typescript
interface AccountQueryLogResponse {
  id: number;
  banco: string;
  agencia: string;
  contaCorrente: string;
  consultaPeriodoDe: string;
  consultaPeriodoAte: string;
  erroCodigo: number;
  erroDescricao: string | null;
  dataHoraTentativa: string;
  dataHora: string;
}

interface AccountImportResponse {
  id: number;
  layoutId: number | null;
  documentId: number | null;
  bancoOrigem: string | null;
  arquivoNome: string | null;
  arquivoGeracaoDataHora: string | null;
  arquivoNumeroSequencial: number | null;
  arquivoNumeroVersaoLayOut: string | null;
  qtdLotes: number | null;
  qtdRegistros: number | null;
  qtdContas: number | null;
  dataHora: string | null;
  userId: number | null;
  consultaAgencia: string | null;
  consultaContaCorrente: string | null;
  consultaPeriodoDe: string | null;
  consultaPeriodoAte: string | null;
}

interface AccountMovementResponse {
  id: number;
  importId: number | null;
  numeroSequencialExtrato: number | null;
  numeroSequencialNoArquivo: number | null;
  numeroSequencialNoLote: number | null;
  banco: string | null;
  agencia: string | null;
  agenciaDV: string | null;
  contaCorrente: string | null;
  contaCorrenteDV: string | null;
  contaCorrenteSIC: string | null;
  contaCorrenteDescricao: string | null;
  movimentoData: string | null;
  movimentoDataContabil: string | null;
  movimentoTipo: string | null;
  movimentoValor: number | null;
  movimentoSaldo: number | null;
  posicaoSaldo: string | null;
  natureza: string | null;
  complementoTipo: string | null;
  complementoBancoOrigem: string | null;
  complementoAgenciaOrigem: string | null;
  complementoContaCorrenteOrigem: string | null;
  complementoContaCorrenteDVOrigem: string | null;
  complementoAlfa: string | null;
  isencaoCPMF: string | null;
  movimentoCategoria: string | null;
  codigoHistorico: string | null;
  descricaoHistorico: string | null;
  documentoNumero: string | null;
  somatorioValoresADebito: number | null;
  somatorioValoresACredito: number | null;
  numeroLancamentos: number | null;
  numeroCpfCnpjContrapartida: string | null;
  indicadorTipoPessoaContrapartida: string | null;
}
```

#### **Respostas de Monitoramento de Schedule**
```typescript
interface JobProgressResponse {
  jobName: string;
  status: JobExecutionStatus;
  statusDescription: string;
  startTime: string;
  endTime: string | null;
  durationMs: number | null;
  recordsProcessed: number | null;
  accountsProcessed: number | null;
  progressPercentage: number | null;
  errorMessage: string | null;
  estimatedTimeRemaining: number | null;
  lastUpdated: string;
}

interface JobProgressSummaryResponse {
  activeJobs: number;
  completedJobs: number;
  failedJobs: number;
  cancelledJobs: number;
  averageExecutionTime: number;
  successRate: number;
  totalRecordsProcessed: number;
  totalAccountsProcessed: number;
  activeJobsList: JobProgressResponse[];
}

interface SystemStatsResponse {
  totalJobsExecuted: number;
  successRate: number;
  averageExecutionTime: number;
  totalRecordsProcessed: number;
  systemUptime: number;
  lastJobExecution: string;
}

interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}
```

#### **Respostas Paginadas**
```typescript
interface PaginationResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
}
```

#### **Enums**
```typescript
enum JobExecutionStatus {
  STARTING = "STARTING",      // Iniciando
  RUNNING = "RUNNING",        // Em execução
  COMPLETED = "COMPLETED",    // Concluído
  FAILED = "FAILED",          // Falhou
  CANCELLED = "CANCELLED"     // Cancelado
}
```



## 📚 **Referências**

- [Especificação OpenAPI 3.0](https://swagger.io/specification/)
- [Formato ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)
- [Padrões REST](https://restfulapi.net/)
- [Documentação do Projeto](../README.md)

## 📝 **Histórico de Alterações**

| Data | Versão | Descrição |
|------|--------|-----------|
| 2025-01-27 | 1.0.0 | Criação inicial do RFC |
| 2025-01-27 | 1.0.0 | Especificação completa de todos os endpoints |
| 2025-01-27 | 1.0.0 | Exemplos de integração frontend |
| 2025-01-27 | 1.0.0 | Documentação de estruturas de dados |

---

**Documento criado para auxiliar desenvolvedores frontend na integração com a API COPPETEC BB Extrato.**
