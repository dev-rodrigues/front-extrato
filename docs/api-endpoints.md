# API de Consulta de Extratos Bancários

## Resumo/Objetivo
Documentação completa da API REST para consulta de logs, importações e movimentações de contas bancárias. Este documento descreve todos os endpoints disponíveis, parâmetros, respostas e exemplos de uso para integração com sistemas frontend.

## Contexto
A API foi desenvolvida para fornecer acesso programático aos dados de extratos bancários processados pelo sistema Coppetec. Permite consultas paginadas e filtradas por período para diferentes tipos de informação: logs de consulta, histórico de importações e movimentações bancárias.

## Detalhamento

### Base URL
- **Desenvolvimento**: `http://localhost:8080`
- **Produção**: `https://api.coppetec.ufrj.br`

### Autenticação
Atualmente a API não requer autenticação. Todos os endpoints são públicos.

### Formato de Resposta
Todas as respostas seguem o padrão JSON com codificação UTF-8.

### Paginação
Todos os endpoints de listagem suportam paginação com os seguintes parâmetros:
- `page`: Número da página (baseado em 0, padrão: 0)
- `size`: Tamanho da página (1-100, padrão: 20)

### Estrutura de Resposta Paginada
```json
{
  "content": [...],
  "pageNumber": 0,
  "pageSize": 20,
  "totalElements": 150,
  "totalPages": 8,
  "hasNext": true,
  "hasPrevious": false,
  "isFirst": true,
  "isLast": false
}
```

## Endpoints

### 1. Consulta de Logs de Consulta

#### `GET /api/accounts/{agencia}/{contaCorrente}/query-logs`

Consulta logs de tentativas de consulta de extrato para uma conta específica.

**Parâmetros de Path:**
- `agencia` (string, obrigatório): Número da agência bancária (4 dígitos)
- `contaCorrente` (string, obrigatório): Número da conta corrente (formato XX.XXX-X)

**Parâmetros de Query:**
- `dataInicio` (string, obrigatório): Data de início do período (ISO 8601)
- `dataFim` (string, obrigatório): Data de fim do período (ISO 8601)
- `page` (integer, opcional): Número da página (0+, padrão: 0)
- `size` (integer, opcional): Tamanho da página (1-100, padrão: 20)

**Exemplo de Requisição:**
```bash
curl -X GET "http://localhost:8080/api/accounts/1234/12.345-6/query-logs?dataInicio=2024-01-01T00:00:00&dataFim=2024-01-31T23:59:59&page=0&size=20"
```

**Resposta de Sucesso (200):**
```json
{
  "content": [
    {
      "id": "12345",
      "banco": "001",
      "agencia": "1234",
      "contaCorrente": "12.345-6",
      "consultaPeriodoDe": "2024-01-01T00:00:00",
      "consultaPeriodoAte": "2024-01-31T23:59:59",
      "erroCodigo": 0,
      "erroDescricao": null,
      "dataHoraTentativa": "2024-01-15T14:30:00",
      "dataHora": "2024-01-15T14:30:00"
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

**Códigos de Erro:**
- `400`: Parâmetros inválidos
- `404`: Conta não encontrada
- `500`: Erro interno do servidor

### 2. Consulta de Histórico de Importações

#### `GET /api/accounts/{agencia}/{contaCorrente}/imports`

Consulta histórico de importações realizadas para uma conta específica.

**Parâmetros de Path:**
- `agencia` (string, obrigatório): Número da agência bancária (4 dígitos)
- `contaCorrente` (string, obrigatório): Número da conta corrente (formato XX.XXX-X)

**Parâmetros de Query:**
- `dataInicio` (string, obrigatório): Data de início do período (ISO 8601)
- `dataFim` (string, obrigatório): Data de fim do período (ISO 8601)
- `page` (integer, opcional): Número da página (0+, padrão: 0)
- `size` (integer, opcional): Tamanho da página (1-100, padrão: 20)

**Exemplo de Requisição:**
```bash
curl -X GET "http://localhost:8080/api/accounts/1234/12.345-6/imports?dataInicio=2024-01-01T00:00:00&dataFim=2024-01-31T23:59:59&page=0&size=20"
```

**Resposta de Sucesso (200):**
```json
{
  "content": [
    {
      "id": "67890",
      "layoutId": "layout_001",
      "arquivoNome": "extrato_20240115.txt",
      "arquivoGeracaoDataHora": "2024-01-15T10:00:00",
      "qtdRegistros": 3250,
      "qtdContas": 15,
      "dataHora": "2024-01-15T14:30:00",
      "consultaAgencia": "1234",
      "consultaContaCorrente": "12.345-6",
      "consultaPeriodoDe": "2024-01-01T00:00:00",
      "consultaPeriodoAte": "2024-01-31T23:59:59"
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

### 3. Consulta de Movimentações Bancárias

#### `GET /api/accounts/{agencia}/{contaCorrente}/movements`

Consulta movimentações bancárias registradas para uma conta específica.

**Parâmetros de Path:**
- `agencia` (string, obrigatório): Número da agência bancária (4 dígitos)
- `contaCorrente` (string, obrigatório): Número da conta corrente (formato XX.XXX-X)

**Parâmetros de Query:**
- `dataInicio` (string, obrigatório): Data de início do período (ISO 8601)
- `dataFim` (string, obrigatório): Data de fim do período (ISO 8601)
- `page` (integer, opcional): Número da página (0+, padrão: 0)
- `size` (integer, opcional): Tamanho da página (1-100, padrão: 20)

**Exemplo de Requisição:**
```bash
curl -X GET "http://localhost:8080/api/accounts/1234/12.345-6/movements?dataInicio=2024-01-01T00:00:00&dataFim=2024-01-31T23:59:59&page=0&size=20"
```

**Resposta de Sucesso (200):**
```json
{
  "content": [
    {
      "id": "11111",
      "numeroSequencialExtrato": "001",
      "movimentoData": "2024-01-15T00:00:00",
      "movimentoTipo": "D",
      "movimentoValor": 150.00,
      "movimentoSaldo": 15450.00,
      "posicaoSaldo": "D",
      "descricaoHistorico": "Pagamento de conta",
      "documentoNumero": "DOC123456",
      "numeroCpfCnpjContrapartida": "123.456.789-00"
    }
  ],
  "pageNumber": 0,
  "pageSize": 20,
  "totalElements": 156,
  "totalPages": 8,
  "hasNext": true,
  "hasPrevious": false,
  "isFirst": true,
  "isLast": false
}
```

## Validações e Regras de Negócio

### Formato de Agência
- Deve conter exatamente 4 dígitos numéricos
- Exemplo válido: "1234"
- Exemplo inválido: "123" ou "12345"

### Formato de Conta Corrente
- Deve seguir o padrão XX.XXX-X
- Onde X são dígitos numéricos
- Exemplo válido: "12.345-6"
- Exemplo inválido: "12345" ou "12.345-6"

### Período de Consulta
- `dataInicio` deve ser anterior ou igual a `dataFim`
- Ambas as datas devem estar no formato ISO 8601
- Período máximo recomendado: 1 ano

### Paginação
- `page` deve ser >= 0
- `size` deve estar entre 1 e 100
- Valores padrão: `page=0`, `size=20`

## Tratamento de Erros

### Estrutura de Erro
```json
{
  "timestamp": "2024-01-15T14:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Parâmetros inválidos",
  "path": "/api/accounts/1234/12.345-6/query-logs"
}
```

### Códigos de Status HTTP
- `200`: Sucesso
- `400`: Parâmetros inválidos ou período inválido
- `404`: Conta não encontrada
- `500`: Erro interno do servidor

## Exemplos de Uso

### Consulta de Logs com Erro
```bash
curl -X GET "http://localhost:8080/api/accounts/1234/12.345-6/query-logs?dataInicio=2024-01-01T00:00:00&dataFim=2024-01-31T23:59:59&page=0&size=10"
```

### Consulta de Importações com Paginação
```bash
curl -X GET "http://localhost:8080/api/accounts/1234/12.345-6/imports?dataInicio=2024-01-01T00:00:00&dataFim=2024-01-31T23:59:59&page=1&size=50"
```

### Consulta de Movimentações com Filtro de Período
```bash
curl -X GET "http://localhost:8080/api/accounts/1234/12.345-6/movements?dataInicio=2024-01-15T00:00:00&dataFim=2024-01-15T23:59:59&page=0&size=100"
```

## Referências

- [Especificação OpenAPI 3.0](https://swagger.io/specification/)
- [Formato ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)
- [Padrões REST](https://restfulapi.net/)
- [Documentação do Projeto](../README.md)

## Histórico de Alterações

| Data | Autor | Descrição |
|------|-------|-----------|
| 2024-01-15 | Sistema | Criação inicial da documentação da API |
| 2024-01-15 | Sistema | Adição de exemplos de uso e validações |
