# Documentação Técnica - API BB Extrato

## 📋 Visão Geral

Esta documentação técnica apresenta uma análise completa do sistema **API BB Extrato**, desenvolvido para a UFRJ/Coppetec. O sistema automatiza a consulta e reconciliação de extratos bancários do Banco do Brasil via APIs oficiais.

## 🏗️ Arquitetura

O sistema segue rigorosamente os princípios da **Clean Architecture**, implementado em **Kotlin + Spring Boot**.

### Stack Tecnológico
- **Linguagem**: Kotlin 1.9.25 + Java 17
- **Framework**: Spring Boot 3.4.4  
- **Build**: Maven 3.9.9
- **Banco de Dados**: Microsoft SQL Server
- **HTTP Client**: OpenFeign + OkHttp
- **Resiliência**: Resilience4j
- **Agendamento**: Spring Scheduling

## 📚 Documentos Disponíveis

### 🏛️ [Visão Geral da Arquitetura](./architecture-overview.md)
**Objetivo**: Compreensão geral da estrutura e princípios arquiteturais
- Clean Architecture implementada
- Separação de responsabilidades por camadas
- Fluxo principal do sistema
- Padrões de resiliência
- Stack tecnológico detalhado

### 🔧 [Referência Completa de Componentes](./components-reference.md)  
**Objetivo**: Análise detalhada de todos os 39 componentes do sistema
- **Domain Layer**: Entidades, builders, utilitários, exceções
- **Application Layer**: Services e ports (interfaces)
- **Infrastructure Layer**: Adapters, clientes HTTP, configurações, jobs
- Responsabilidades e dependências de cada componente

### 🗄️ [Modelo de Dados e Esquema de Banco](./database-schema.md)
**Objetivo**: Estrutura completa do banco de dados SQL Server
- Catálogos: `COPPETEC` (dados) e `COPPETEC_LOG` (auditoria)
- Entidades JPA mapeadas: Importação, Movimentação, Logs
- Relacionamentos e integridade referencial
- Stored procedures e funções
- Estratégias de performance e índices

### 🌐 [Guia de Integrações Externas](./integrations-guide.md)
**Objetivo**: Especificação completa das APIs externas
- **Banco do Brasil**: Autenticação OAuth2 + Consulta de extratos
- **Sistema Email Coppetec**: Notificações de erro
- Configurações SSL, retry patterns, timeouts
- Tratamento de erros e monitoramento

### 🔄 [Fluxos de Negócio](./business-flows.md)
**Objetivo**: Documentação completa dos processos e regras de negócio
- Fluxo principal de consulta automatizada (job agendado)
- Processo detalhado de reconciliação bancária
- Regras de validação temporal de transações
- Padrões de resiliência e retry implementados
- Sistema completo de notificações por email
- Auditoria e logging de todas as operações

### 👨‍💻 [Guia para Desenvolvedores](./developer-guide.md)
**Objetivo**: Instruções completas para setup, desenvolvimento e manutenção
- Configuração do ambiente de desenvolvimento
- Setup de banco de dados e variáveis de ambiente
- Comandos de build, execução e debug
- Padrões de código e convenções da Clean Architecture
- Troubleshooting e resolução de problemas comuns
- Monitoramento e observabilidade

## 🎯 Como Navegar na Documentação

### Para **Arquitetos de Software**:
1. Comece com [Visão Geral da Arquitetura](./architecture-overview.md)
2. Aprofunde-se em [Referência de Componentes](./components-reference.md)
3. Analise as [Integrações Externas](./integrations-guide.md)

### Para **Desenvolvedores**:
1. Leia [Visão Geral da Arquitetura](./architecture-overview.md) 
2. Consulte [Referência de Componentes](./components-reference.md) conforme necessário
3. Use [Guia para Desenvolvedores](./developer-guide.md) para setup
4. Consulte [Fluxos de Negócio](./business-flows.md) para regras específicas

### Para **DBAs**:
1. Foque no [Modelo de Dados](./database-schema.md)
2. Consulte [Integrações Externas](./integrations-guide.md) para conectividade

### Para **DevOps/SRE**:
1. Revise [Integrações Externas](./integrations-guide.md) para configurações
2. Consulte [Visão Geral da Arquitetura](./architecture-overview.md) para infraestrutura

## 📊 Estatísticas da Documentação

- **Total de Linhas**: ~2,500+ linhas técnicas
- **Documentos Gerados**: 6/6 (100% completo)
- **Componentes Documentados**: 39/39 (100%)
- **Camadas Arquiteturais**: 3/3 (Domain, Application, Infrastructure)
- **Integrações Mapeadas**: 2/2 (Banco do Brasil + Email Coppetec)
- **Entidades de Banco**: 3/3 (Import, Movement, Log)
- **Fluxos de Negócio**: 5+ workflows detalhados
- **Cobertura**: 100% do sistema documentado

## 🔄 Versionamento da Documentação

Esta documentação é mantida junto com o código-fonte e deve ser atualizada sempre que houver mudanças significativas na arquitetura ou funcionalidades do sistema.

**Última Atualização**: Janeiro 2025
**Versão do Sistema**: 0.0.1-SNAPSHOT
**Responsável**: Sistema de Análise Arquitetural

---
*Documentação técnica gerada como parte da análise completa do sistema API BB Extrato - UFRJ/Coppetec*
