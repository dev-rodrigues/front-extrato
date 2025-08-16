# Memory Bank: System Patterns

## Arquitetura
**Clean Architecture** em 3 camadas bem definidas:

### 1. **DOMAIN** (Regras de Negócio)
- Entidades puras sem dependências externas
- Regras de negócio centralizadas
- Exceptions específicas do domínio

### 2. **APPLICATION** (Casos de Uso) 
- **Ports**: Interfaces que definem contratos
- **Services**: Implementação dos casos de uso
- Orquestração entre domain e infrastructure

### 3. **INFRASTRUCTURE** (Adaptadores)
- **Database Adapters**: Implementações JPA
- **HTTP Clients**: Integrações via Feign
- **Jobs**: Processamento agendado
- **Configurations**: Configurações técnicas

## Padrões de Design Identificados

### 1. **Ports & Adapters (Hexagonal)**
- Isolamento completo das regras de negócio
- Interfaces (ports) definem contratos
- Implementações (adapters) na camada de infraestrutura

### 2. **Repository Pattern**
- Abstração de acesso a dados via ports
- Implementações específicas para cada fonte de dados

### 3. **Retry Pattern** 
- Resilience4j para tentativas automáticas
- Tolerância a falhas temporárias de rede

### 4. **Template Method**
- Templates de email padronizados
- Estrutura consistente de notificações

### 5. **Observer Pattern**
- Logs de auditoria em todas operações
- Notificações automáticas de eventos

## Estrutura de Camadas

```
├── domain/                    # Regras de negócio puras
│   ├── Account.kt            # Entidade principal
│   ├── BBAuthentication.kt   # Token de acesso
│   ├── EmailConstants.kt     # Templates
│   └── exceptions/           # Exceções do domínio
├── application/              # Casos de uso
│   ├── ports/               # Interfaces/contratos
│   └── service/             # Implementação dos casos de uso
└── infra/                   # Adaptadores técnicos
    ├── adapter/
    │   ├── database/        # Persistência
    │   └── http/           # Integrações REST
    ├── config/             # Configurações
    └── job/                # Processamento agendado
```

## Integrações
### APIs REST via OpenFeign
1. **API Banco do Brasil**: OAuth2 + SSL mútuo
2. **API Email Coppetec**: REST simples
3. **SQL Server**: JDBC com pool de conexões

### Comunicação Assíncrona  
- Jobs agendados via Spring Scheduler
- Processamento em lotes de contas bancárias
