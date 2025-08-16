# Guia do Desenvolvedor - API BB Extrato

## 📋 Visão Geral

Este guia fornece instruções completas para desenvolvedores trabalhando com a API BB Extrato. O sistema é uma aplicação Spring Boot em Kotlin que automatiza a consulta de extratos bancários do Banco do Brasil.

## 🚀 Setup do Ambiente de Desenvolvimento

### 📋 Pré-requisitos

**Software Necessário**:
- **Java**: OpenJDK 17.0.15 ou superior
- **Kotlin**: 1.9.25 ou superior
- **Maven**: 3.9.9 ou superior
- **IDE**: IntelliJ IDEA, VS Code ou Eclipse
- **Git**: Para controle de versão

**Variáveis de Ambiente**:
```bash
# Java
export JAVA_HOME=/path/to/openjdk-17
export PATH=$JAVA_HOME/bin:$PATH

# Maven
export MAVEN_HOME=/path/to/maven-3.9.9
export PATH=$MAVEN_HOME/bin:$PATH
```

### 🔧 Instalação e Configuração

**1. Clone do Repositório**:
```bash
git clone <repository-url>
cd api--bb-extrato
```

**2. Verificação de Dependências**:
```bash
# Verificar Java
java -version
# Deve retornar: OpenJDK 17.0.15

# Verificar Kotlin
kotlin -version
# Deve retornar: 1.9.25

# Verificar Maven
mvn -version
# Deve retornar: 3.9.9
```

**3. Configuração do Banco de Dados**:
```yaml
# application-dev.yaml
spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=bb_extrato_dev
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    driver-class-name: com.microsoft.sqlserver.jdbc.SQLServerDriver
```

**4. Configuração das APIs Externas**:
```yaml
# application-dev.yaml
bb:
  api:
    base-url: https://api.bb.com.br
    client-id: ${BB_CLIENT_ID}
    client-secret: ${BB_CLIENT_SECRET}
    
email:
  coppetec:
    base-url: https://email.coppetec.ufrj.br
    api-key: ${EMAIL_API_KEY}
```

## 🏗️ Estrutura do Projeto

### 📁 Organização de Diretórios

```
src/main/kotlin/br/com/ufrj/coppetecbbextrato/
├── application/                    # Camada de aplicação
│   ├── ports/                     # Interfaces/contratos
│   └── service/                   # Implementação dos casos de uso
├── domain/                        # Regras de negócio
│   ├── entity/                    # Entidades do domínio
│   ├── dto/                       # Objetos de transferência
│   ├── exceptions/                # Exceções específicas
│   └── util/                      # Utilitários
└── infra/                         # Adaptadores técnicos
    ├── adapter/                   # Implementações concretas
    │   ├── controller/            # Controllers REST
    │   ├── database/              # Repositórios JPA
    │   └── http/                  # Clientes HTTP
    ├── config/                    # Configurações
    └── job/                       # Jobs agendados
```

### 🎯 Padrões Arquiteturais

**Clean Architecture**:
- **Domain**: Regras de negócio puras
- **Application**: Casos de uso e orquestração
- **Infrastructure**: Adaptadores técnicos

**Ports & Adapters**:
```kotlin
// Port (Interface)
interface AccountPort {
    fun getAllActiveAccounts(): List<Account>
}

// Adapter (Implementação)
@Repository
class AccountRepositoryImpl : AccountPort {
    override fun getAllActiveAccounts(): List<Account> {
        // Implementação JPA
    }
}
```

## 🔧 Desenvolvimento

### 📝 Criando Novos Endpoints

**1. Controller**:
```kotlin
@RestController
@RequestMapping("/api/accounts")
class AccountController(
    private val accountService: AccountService
) {
    
    @GetMapping("/{agency}/{account}/balance")
    fun getBalance(
        @PathVariable agency: String,
        @PathVariable account: String
    ): ResponseEntity<AccountBalanceResponse> {
        val balance = accountService.getBalance(agency, account)
        return ResponseEntity.ok(balance)
    }
}
```

**2. Service**:
```kotlin
@Service
class AccountService(
    private val accountPort: AccountPort
) {
    
    fun getBalance(agency: String, account: String): AccountBalanceResponse {
        val accountEntity = accountPort.findByAgencyAndAccount(agency, account)
            ?: throw AccountNotFoundException("Conta não encontrada")
            
        return AccountBalanceResponse(
            agency = accountEntity.branch,
            account = accountEntity.currentAccount,
            balance = accountEntity.balance
        )
    }
}
```

**3. DTO**:
```kotlin
data class AccountBalanceResponse(
    val agency: String,
    val account: String,
    val balance: BigDecimal,
    val lastUpdate: LocalDateTime = LocalDateTime.now()
)
```

### 🗄️ Trabalhando com o Banco de Dados

**1. Entidade JPA**:
```kotlin
@Entity
@Table(name = "account_balance")
class AccountBalanceEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @Column(name = "agency", nullable = false)
    val agency: String,
    
    @Column(name = "account", nullable = false)
    val account: String,
    
    @Column(name = "balance", precision = 19, scale = 2)
    val balance: BigDecimal,
    
    @Column(name = "last_update")
    val lastUpdate: LocalDateTime = LocalDateTime.now()
)
```

**2. Repository**:
```kotlin
@Repository
interface AccountBalanceRepository : JpaRepository<AccountBalanceEntity, Long> {
    
    fun findByAgencyAndAccount(agency: String, account: String): AccountBalanceEntity?
    
    @Query("SELECT ab FROM AccountBalanceEntity ab WHERE ab.balance > :minBalance")
    fun findByBalanceGreaterThan(minBalance: BigDecimal): List<AccountBalanceEntity>
}
```

**3. Transações**:
```kotlin
@Transactional(rollbackOn = [Exception::class])
fun updateBalance(agency: String, account: String, newBalance: BigDecimal) {
    val balanceEntity = accountBalanceRepository.findByAgencyAndAccount(agency, account)
        ?: throw AccountNotFoundException("Conta não encontrada")
    
    balanceEntity.balance = newBalance
    balanceEntity.lastUpdate = LocalDateTime.now()
    
    accountBalanceRepository.save(balanceEntity)
}
```

### 🔄 Integração com APIs Externas

**1. Cliente Feign**:
```kotlin
@FeignClient(
    name = "bb-api",
    url = "\${bb.api.base-url}",
    configuration = [FeignConfig::class]
)
interface BBClient {
    
    @PostMapping("/oauth/token")
    fun authenticate(@RequestBody request: AuthRequest): AuthResponse
    
    @GetMapping("/extrato/{agency}/{account}")
    fun getStatement(
        @PathVariable agency: String,
        @PathVariable account: String,
        @RequestHeader("Authorization") token: String
    ): StatementResponse
}
```

**2. Configuração de Retry**:
```kotlin
@Configuration
class RetryConfiguration {
    
    @Bean
    fun retryConfig(): RetryConfig {
        return RetryConfig.custom<Any>()
            .maxAttempts(3)
            .waitDuration(Duration.ofSeconds(2))
            .retryOnException { ex ->
                ex is FeignException.InternalServerError ||
                ex is FeignException.TooManyRequests
            }
            .build()
    }
}
```

### ⏰ Jobs Agendados

**1. Job Simples**:
```kotlin
@Component
class SimpleJob {
    
    @Scheduled(fixedRate = 60000) // A cada 1 minuto
    fun execute() {
        logger.info { "Executando job simples" }
        // Lógica do job
    }
}
```

**2. Job com Cron**:
```kotlin
@Component
class CronJob {
    
    @Scheduled(cron = "\${schedule.cron}")
    fun execute() {
        logger.info { "Executando job agendado" }
        // Lógica do job
    }
}
```

**3. Job com Controle de Concorrência**:
```kotlin
@Component
class ConcurrentJob {
    
    private val isRunning = AtomicBoolean(false)
    
    @Scheduled(cron = "\${schedule.cron}")
    fun execute() {
        if (!isRunning.compareAndSet(false, true)) {
            logger.warn { "Job já está em execução" }
            return
        }
        
        try {
            // Lógica do job
        } finally {
            isRunning.set(false)
        }
    }
}
```

## 🧪 Testes

### 📋 Estrutura de Testes

```
src/test/kotlin/
├── application/                    # Testes de serviços
├── infra/                         # Testes de adaptadores
│   ├── adapter/
│   │   ├── controller/            # Testes de controllers
│   │   └── database/              # Testes de repositórios
│   └── job/                       # Testes de jobs
└── integration/                   # Testes de integração
```

### 🧪 Testes Unitários

**1. Teste de Service**:
```kotlin
@ExtendWith(MockitoExtension::class)
class AccountServiceTest {
    
    @Mock
    private lateinit var accountPort: AccountPort
    
    @InjectMocks
    private lateinit var accountService: AccountService
    
    @Test
    fun `should return account balance when account exists`() {
        // Given
        val agency = "2234-9"
        val account = "57446-5"
        val expectedBalance = BigDecimal("1000.00")
        
        val accountEntity = AccountEntity(
            branch = agency,
            currentAccount = account,
            balance = expectedBalance
        )
        
        whenever(accountPort.findByAgencyAndAccount(agency, account))
            .thenReturn(accountEntity)
        
        // When
        val result = accountService.getBalance(agency, account)
        
        // Then
        assertEquals(expectedBalance, result.balance)
        assertEquals(agency, result.agency)
        assertEquals(account, result.account)
    }
    
    @Test
    fun `should throw exception when account not found`() {
        // Given
        val agency = "9999-9"
        val account = "99999-9"
        
        whenever(accountPort.findByAgencyAndAccount(agency, account))
            .thenReturn(null)
        
        // When & Then
        assertThrows<AccountNotFoundException> {
            accountService.getBalance(agency, account)
        }
    }
}
```

**2. Teste de Controller**:
```kotlin
@WebMvcTest(AccountController::class)
class AccountControllerTest {
    
    @Autowired
    private lateinit var mockMvc: MockMvc
    
    @MockBean
    private lateinit var accountService: AccountService
    
    @Test
    fun `should return 200 when account exists`() {
        // Given
        val agency = "2234-9"
        val account = "57446-5"
        val balanceResponse = AccountBalanceResponse(
            agency = agency,
            account = account,
            balance = BigDecimal("1000.00")
        )
        
        whenever(accountService.getBalance(agency, account))
            .thenReturn(balanceResponse)
        
        // When & Then
        mockMvc.perform(
            get("/api/accounts/$agency/$account/balance")
                .contentType(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isOk)
        .andExpect(jsonPath("$.agency").value(agency))
        .andExpect(jsonPath("$.account").value(account))
        .andExpect(jsonPath("$.balance").value(1000.00))
    }
}
```

### 🔄 Testes de Integração

**1. Teste com @SpringBootTest**:
```kotlin
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations = ["classpath:application-test.yaml"])
class AccountIntegrationTest {
    
    @Autowired
    private lateinit var testRestTemplate: TestRestTemplate
    
    @Test
    fun `should create and retrieve account`() {
        // Given
        val createRequest = CreateAccountRequest(
            agency = "2234-9",
            account = "57446-5",
            balance = BigDecimal("1000.00")
        )
        
        // When - Create
        val createResponse = testRestTemplate.postForEntity(
            "/api/accounts",
            createRequest,
            AccountResponse::class.java
        )
        
        // Then - Create
        assertEquals(HttpStatus.CREATED, createResponse.statusCode)
        assertNotNull(createResponse.body?.id)
        
        // When - Retrieve
        val accountId = createResponse.body?.id
        val retrieveResponse = testRestTemplate.getForEntity(
            "/api/accounts/$accountId",
            AccountResponse::class.java
        )
        
        // Then - Retrieve
        assertEquals(HttpStatus.OK, retrieveResponse.statusCode)
        assertEquals(createRequest.agency, retrieveResponse.body?.agency)
        assertEquals(createRequest.account, retrieveResponse.body?.account)
    }
}
```

### 📊 Testes de Performance

**1. Teste com Postman**:
```json
{
  "name": "Performance Test",
  "request": {
    "method": "GET",
    "url": "{{baseUrl}}/api/accounts/{{testAgency}}/{{testAccount}}/balance"
  },
  "event": [
    {
      "listen": "test",
      "script": {
        "exec": [
          "pm.test(\"Response time is acceptable\", function () {",
          "    pm.expect(pm.response.responseTime).to.be.below(200);",
          "});",
          "",
          "pm.test(\"Throughput is acceptable\", function () {",
          "    const responseTime = pm.response.responseTime;",
          "    const requestsPerSecond = 1000 / responseTime;",
          "    pm.expect(requestsPerSecond).to.be.above(5);",
          "});"
        ]
      }
    }
  ]
}
```

## 🚀 Deploy e Operação

### 📦 Build da Aplicação

**1. Build Local**:
```bash
# Compilar e executar testes
mvn clean verify

# Criar JAR executável
mvn clean package -DskipTests

# Executar localmente
java -jar target/coppetec-bb-extrato-1.0.0.jar
```

**2. Build para Produção**:
```bash
# Build otimizado para produção
mvn clean package -Pprod -DskipTests

# Verificar conteúdo do JAR
jar -tf target/coppetec-bb-extrato-1.0.0.jar
```

### 🐳 Docker

**1. Dockerfile**:
```dockerfile
FROM openjdk:17-jre-slim

WORKDIR /app

COPY target/coppetec-bb-extrato-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

**2. Docker Compose**:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - DB_HOST=db
    depends_on:
      - db
  
  db:
    image: mcr.microsoft.com/mssql/server:2019-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourStrong@Passw0rd
    ports:
      - "1433:1433"
```

### ☁️ Deploy em Produção

**1. Variáveis de Ambiente**:
```bash
# Banco de Dados
export DB_HOST=prod-db.company.com
export DB_NAME=bb_extrato_prod
export DB_USERNAME=app_user
export DB_PASSWORD=secure_password

# APIs Externas
export BB_CLIENT_ID=prod_client_id
export BB_CLIENT_SECRET=prod_client_secret
export EMAIL_API_KEY=prod_email_key

# Configurações da Aplicação
export SPRING_PROFILES_ACTIVE=production
export SERVER_PORT=8080
export LOGGING_LEVEL=INFO
```

**2. Script de Deploy**:
```bash
#!/bin/bash
set -e

echo "🚀 Iniciando deploy da API BB Extrato..."

# Parar aplicação atual
echo "⏹️  Parando aplicação atual..."
sudo systemctl stop bb-extrato-api

# Backup do JAR atual
echo "💾 Fazendo backup..."
sudo cp /opt/bb-extrato/app.jar /opt/bb-extrato/app.jar.backup.$(date +%Y%m%d_%H%M%S)

# Deploy do novo JAR
echo "📦 Deployando nova versão..."
sudo cp target/coppetec-bb-extrato-1.0.0.jar /opt/bb-extrato/app.jar
sudo chown bb-extrato:bb-extrato /opt/bb-extrato/app.jar
sudo chmod 755 /opt/bb-extrato/app.jar

# Iniciar aplicação
echo "▶️  Iniciando aplicação..."
sudo systemctl start bb-extrato-api

# Verificar status
echo "🔍 Verificando status..."
sleep 10
sudo systemctl status bb-extrato-api

echo "✅ Deploy concluído com sucesso!"
```

## 📊 Monitoramento e Logs

### 📝 Configuração de Logs

**1. Logback**:
```xml
<!-- src/main/resources/logback-spring.xml -->
<configuration>
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/bb-extrato.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/bb-extrato.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <root level="INFO">
        <appender-ref ref="CONSOLE" />
        <appender-ref ref="FILE" />
    </root>
</configuration>
```

**2. Logs Estruturados**:
```kotlin
private val logger = KotlinLogging.logger {}

// Log com contexto estruturado
logger.info { "Processando conta AG: ${account.branch} CC: ${account.currentAccount}" }

// Log de erro com stack trace
logger.error(e) { "Erro ao processar conta ${account.currentAccount}" }

// Log de debug para troubleshooting
logger.debug { "Dados da transação: $transactionData" }
```

### 📈 Métricas e Health Checks

**1. Health Check Endpoint**:
```kotlin
@RestController
@RequestMapping("/api/health")
class HealthController {
    
    @GetMapping
    fun health(): ResponseEntity<HealthResponse> {
        return ResponseEntity.ok(
            HealthResponse(
                status = "HEALTHY",
                timestamp = LocalDateTime.now(),
                version = "1.0.0"
            )
        )
    }
    
    @GetMapping("/db")
    fun databaseHealth(): ResponseEntity<HealthResponse> {
        return try {
            // Verificar conexão com banco
            ResponseEntity.ok(HealthResponse(status = "HEALTHY"))
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(HealthResponse(status = "UNHEALTHY", error = e.message))
        }
    }
}
```

**2. Métricas Customizadas**:
```kotlin
@Component
class CustomMetrics {
    
    private val accountsProcessed = Counter.builder("accounts.processed")
        .description("Total de contas processadas")
        .register(Metrics.globalRegistry)
    
    private val processingTime = Timer.builder("accounts.processing.time")
        .description("Tempo de processamento das contas")
        .register(Metrics.globalRegistry)
    
    fun incrementAccountsProcessed() {
        accountsProcessed.increment()
    }
    
    fun recordProcessingTime(duration: Duration) {
        processingTime.record(duration)
    }
}
```

## 🔒 Segurança

### 🔐 Configurações de Segurança

**1. CORS**:
```kotlin
@Configuration
class SecurityConfig {
    
    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("https://app.company.com")
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE")
        configuration.allowedHeaders = listOf("*")
        configuration.allowCredentials = true
        
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
}
```

**2. Validação de Entrada**:
```kotlin
data class CreateAccountRequest(
    @field:NotBlank(message = "Agência é obrigatória")
    @field:Pattern(regexp = "\\d{4}-\\d", message = "Formato de agência inválido")
    val agency: String,
    
    @field:NotBlank(message = "Conta é obrigatória")
    @field:Pattern(regexp = "\\d{5}-\\d", message = "Formato de conta inválido")
    val account: String,
    
    @field:NotNull(message = "Saldo é obrigatório")
    @field:DecimalMin(value = "0.0", inclusive = false, message = "Saldo deve ser positivo")
    val balance: BigDecimal
)
```

## 🐛 Troubleshooting

### 🔍 Problemas Comuns

**1. Erro de Conexão com Banco**:
```bash
# Verificar se o SQL Server está rodando
sudo systemctl status mssql-server

# Verificar conectividade
telnet localhost 1433

# Verificar logs do SQL Server
sudo tail -f /var/opt/mssql/log/errorlog
```

**2. Erro de Autenticação BB**:
```bash
# Verificar variáveis de ambiente
echo $BB_CLIENT_ID
echo $BB_CLIENT_SECRET

# Verificar logs da aplicação
tail -f logs/bb-extrato.log | grep "BB"

# Testar endpoint de autenticação
curl -X POST "https://oauth.bb.com.br/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=$BB_CLIENT_ID&client_secret=$BB_CLIENT_SECRET"
```

**3. Job Não Executa**:
```bash
# Verificar status do job
curl "http://localhost:8080/api/schedule/health"

# Verificar logs de agendamento
tail -f logs/bb-extrato.log | grep "Scheduled"

# Verificar configuração cron
grep "schedule.cron" src/main/resources/application.yaml
```

### 📊 Debug e Profiling

**1. Ativar Logs de Debug**:
```yaml
# application-dev.yaml
logging:
  level:
    br.com.ufrj.coppetecbbextrato: DEBUG
    org.springframework.web: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

**2. Profiling com JVM**:
```bash
# Executar com profiling
java -XX:+UnlockCommercialFeatures -XX:+FlightRecorder \
     -XX:StartFlightRecording=duration=60s,filename=profile.jfr \
     -jar app.jar

# Analisar resultados
jfr print profile.jfr
```

## 📚 Recursos Adicionais

### 🔗 Documentação Oficial

- **Spring Boot**: https://spring.io/projects/spring-boot
- **Kotlin**: https://kotlinlang.org/docs/
- **Maven**: https://maven.apache.org/guides/
- **JPA/Hibernate**: https://hibernate.org/orm/documentation/

### 📖 Livros Recomendados

- "Clean Architecture" - Robert C. Martin
- "Domain-Driven Design" - Eric Evans
- "Spring in Action" - Craig Walls
- "Kotlin in Action" - Dmitry Jemerov

### 🛠️ Ferramentas Úteis

- **Postman**: Testes de API
- **DBeaver**: Cliente de banco de dados
- **IntelliJ IDEA**: IDE com suporte nativo a Kotlin
- **Maven Wrapper**: Execução de Maven sem instalação

---

**Documento Atualizado**: ${LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"))}
**Versão**: 1.0 - Guia Completo para Desenvolvedores
