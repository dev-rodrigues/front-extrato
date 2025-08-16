# Configuração de CORS - API BB Extrato

## Visão Geral

Esta documentação descreve a configuração de CORS (Cross-Origin Resource Sharing) implementada na API BB Extrato para permitir requests de qualquer origem sem restrições.

## Problema Resolvido

Aplicações frontend estavam enfrentando erros de CORS ao tentar acessar a API, impedindo o desenvolvimento e teste de funcionalidades. A configuração implementada resolve este problema permitindo acesso irrestrito de qualquer origem.

## Solução Implementada

### Classe de Configuração

A configuração de CORS está implementada na classe `CorsConfig` localizada em:
```
src/main/kotlin/br/com/ufrj/coppetecbbextrato/infra/config/CorsConfig.kt
```

### Características da Configuração

#### 1. **Origem Permitida**
- **Padrão**: `*` (qualquer origem)
- **Resultado**: API aceita requests de localhost, servidores externos e qualquer outro domínio

#### 2. **Métodos HTTP Permitidos**
- **GET**: Consultas e leituras
- **POST**: Criação de recursos
- **PUT**: Atualizações completas
- **DELETE**: Remoção de recursos
- **PATCH**: Atualizações parciais
- **OPTIONS**: Preflight requests
- **HEAD**: Headers de resposta
- **TRACE**: Debug de requests

#### 3. **Headers Permitidos**
- **Padrão**: `*` (todos os headers)
- **Resultado**: Aceita qualquer header customizado enviado pelo cliente

#### 4. **Credenciais**
- **allowCredentials**: `true`
- **Resultado**: Permite envio de cookies, headers de autorização e credenciais

#### 5. **Cache de Preflight**
- **maxAge**: `3600` segundos (1 hora)
- **Resultado**: Reduz requests OPTIONS repetitivos

#### 6. **Headers Expostos**
- **Padrão**: `*` (todos os headers)
- **Resultado**: Cliente pode acessar qualquer header da resposta

## Implementação Técnica

### 1. **WebMvcConfigurer**
A classe implementa `WebMvcConfigurer` para configurar CORS globalmente:

```kotlin
@Configuration
class CorsConfig : WebMvcConfigurer {
    
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**")
            .allowedOriginPatterns("*")
            .allowedMethods("*")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600)
    }
}
```

### 2. **CorsConfigurationSource Bean**
Fornece um bean para uso em configurações de segurança:

```kotlin
@Bean
fun corsConfigurationSource(): CorsConfigurationSource {
    val configuration = CorsConfiguration()
    configuration.allowedOriginPatterns = listOf("*")
    // ... outras configurações
    return source
}
```

## Aplicação da Configuração

### **Escopo Global**
- **Padrão**: `/**` (todos os endpoints)
- **Resultado**: Configuração aplicada a toda a API

### **Ambientes Suportados**
- ✅ **Desenvolvimento** (`application-dev.yaml`)
- ✅ **Produção** (`application-prd.yaml`)
- ✅ **Configuração padrão** (`application.yaml`)

## Benefícios da Implementação

### 1. **Desenvolvimento Frontend**
- Sem erros de CORS durante desenvolvimento
- Testes locais funcionam perfeitamente
- Integração com qualquer framework frontend

### 2. **Flexibilidade de Origem**
- Suporte a múltiplos domínios
- Aplicações web e mobile
- APIs de terceiros

### 3. **Performance**
- Cache de preflight reduz latência
- Configuração otimizada para produção
- Sem overhead desnecessário

## Segurança

### **Considerações Importantes**
⚠️ **ATENÇÃO**: Esta configuração permite acesso irrestrito de qualquer origem. Em ambientes de produção, considere:

1. **Validação de Entrada**: Sempre validar dados recebidos
2. **Autenticação**: Implementar autenticação robusta
3. **Rate Limiting**: Limitar requests por origem
4. **Logs de Auditoria**: Monitorar acessos suspeitos

### **Recomendações de Segurança**
- Implementar autenticação JWT ou OAuth2
- Usar HTTPS em produção
- Implementar rate limiting por IP/origem
- Monitorar logs de acesso
- Validar todos os parâmetros de entrada

## Testes

### **Testes Unitários**
A configuração inclui testes unitários em:
```
src/test/kotlin/br/com/ufrj/coppetecbbextrato/infra/config/CorsConfigTest.kt
```

### **Validação Manual**
Para testar a configuração:

1. **Frontend Local**:
   ```javascript
   fetch('http://localhost:10000/api/test', {
       method: 'GET',
       headers: {
           'Content-Type': 'application/json'
       }
   })
   ```

2. **CORS Preflight**:
   ```bash
   curl -X OPTIONS http://localhost:10000/api/test \
     -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type"
   ```

## Monitoramento

### **Logs de CORS**
A aplicação registra logs relacionados a:
- Requests de origens diferentes
- Falhas de preflight
- Configuração carregada

### **Métricas Recomendadas**
- Requests por origem
- Falhas de CORS
- Performance de preflight
- Uso de cache

## Manutenção

### **Atualizações**
Para modificar a configuração de CORS:

1. **Editar** `CorsConfig.kt`
2. **Testar** com `mvn test`
3. **Compilar** com `mvn compile`
4. **Deploy** da nova versão

### **Rollback**
Em caso de problemas:
1. **Reverter** mudanças no arquivo
2. **Recompilar** e fazer deploy
3. **Verificar** logs de erro

## Conclusão

A configuração de CORS implementada resolve completamente o problema de acesso cross-origin, permitindo que aplicações frontend acessem a API sem restrições. A implementação é robusta, testada e pronta para uso em desenvolvimento e produção.

---

**Última Atualização**: Dezembro 2024  
**Versão**: 1.0  
**Status**: ✅ Implementado e Testado
