# 🚀 Comandos cURL para Validação da API

## 📋 **Visão Geral**
Este arquivo contém comandos cURL para testar todos os endpoints da API COPPETEC BB Extrato diretamente do terminal, sem necessidade do Postman.

## 🌍 **Configurações de Ambiente**

### **Development**
```bash
export BASE_URL="http://localhost:8080"
export PROFILE="dev"
```

### **Production**
```bash
export BASE_URL="http://146.164.65.214:10000"
export PROFILE="prd"
```

### **Dados de Teste**
```bash
export TEST_AGENCY="2234-9"
export TEST_ACCOUNT="57446-5"
export TEST_MES="4"
export TEST_ANO="2025"
```

## 📊 **Schedule Monitoring Endpoints**

### **1. Health Check**
```bash
curl -X GET "${BASE_URL}/api/schedule/health" \
  -H "Accept: application/json" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"
```

### **2. Progress Monitoring**
```bash
curl -X GET "${BASE_URL}/api/schedule/progress" \
  -H "Accept: application/json" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"
```

### **3. Active Jobs**
```bash
curl -X GET "${BASE_URL}/api/schedule/active" \
  -H "Accept: application/json" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"
```

### **4. Job Status (Específico)**
```bash
curl -X GET "${BASE_URL}/api/schedule/job/test-job" \
  -H "Accept: application/json" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"
```

### **5. System Statistics**
```bash
curl -X GET "${BASE_URL}/api/schedule/stats" \
  -H "Accept: application/json" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"
```

### **6. Cancel Job**
```bash
curl -X POST "${BASE_URL}/api/schedule/job/test-job/cancel" \
  -H "Accept: application/json" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"
```

## 🏦 **Account Query Endpoints**

### **1. Query Logs - Agência 2234-9, Conta 57446-5**
```bash
curl -X GET "${BASE_URL}/api/accounts/${TEST_AGENCY}/${TEST_ACCOUNT}/query-logs" \
  -H "Accept: application/json" \
  -G \
  -d "mes=${TEST_MES}" \
  -d "ano=${TEST_ANO}" \
  -d "page=0" \
  -d "size=20" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"
```

### **2. Import Records - Agência 2234-9, Conta 57446-5**
```bash
curl -X GET "${BASE_URL}/api/accounts/${TEST_AGENCY}/${TEST_ACCOUNT}/imports" \
  -H "Accept: application/json" \
  -G \
  -d "mes=${TEST_MES}" \
  -d "ano=${TEST_ANO}" \
  -d "page=0" \
  -d "size=20" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"
```

### **3. Bank Movements - Agência 2234-9, Conta 57446-5**
```bash
curl -X GET "${BASE_URL}/api/accounts/${TEST_AGENCY}/${TEST_ACCOUNT}/movements" \
  -H "Accept: application/json" \
  -G \
  -d "mes=${TEST_MES}" \
  -d "ano=${TEST_ANO}" \
  -d "page=0" \
  -d "size=20" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"
```

## 🔍 **Testes Específicos para Agência 2234-9**

### **Teste de Logs com Período Específico**
```bash
# Teste com período de 1 mês
curl -X GET "${BASE_URL}/api/accounts/2234-9/57446-5/query-logs" \
  -H "Accept: application/json" \
  -G \
  -d "mes=4" \
  -d "ano=2025" \
  -d "page=0" \
  -d "size=10" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"
```

### **Teste de Paginação**
```bash
# Primeira página
curl -X GET "${BASE_URL}/api/accounts/2234-9/57446-5/imports" \
  -H "Accept: application/json" \
  -G \
  -d "mes=${TEST_MES}" \
  -d "ano=${TEST_ANO}" \
  -d "page=0" \
  -d "size=5" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"

# Segunda página
curl -X GET "${BASE_URL}/api/accounts/2234-9/57446-5/imports" \
  -H "Accept: application/json" \
  -G \
  -d "mes=${TEST_MES}" \
  -d "ano=${TEST_ANO}" \
  -d "page=1" \
  -d "size=5" \
  -w "\nStatus: %{http_code}\nTempo: %{time_total}s\n"
```

## 📈 **Testes de Performance**

### **Teste de Múltiplas Requisições**
```bash
# Teste de throughput
for i in {1..10}; do
  echo "Requisição $i:"
  curl -X GET "${BASE_URL}/api/schedule/health" \
    -H "Accept: application/json" \
    -s \
    -w "Status: %{http_code}, Tempo: %{time_total}s\n" \
    -o /dev/null
  sleep 0.1
done
```

### **Teste de Concorrência Simples**
```bash
# Executar 5 requisições simultaneamente
for i in {1..5}; do
  curl -X GET "${BASE_URL}/api/schedule/stats" \
    -H "Accept: application/json" \
    -s \
    -w "Req $i: %{http_code} em %{time_total}s\n" \
    -o /dev/null &
done
wait
```

## 🧪 **Scripts de Validação Automatizada**

### **Script de Validação Completa**
```bash
#!/bin/bash

echo "🚀 Iniciando validação da API COPPETEC BB Extrato..."
echo "=================================================="

# Configurações
BASE_URL="http://146.164.65.214:10000"
TEST_AGENCY="2234-9"
TEST_ACCOUNT="57446-5"
TEST_MES="4"
TEST_ANO="2025"

# Função para testar endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local method="${3:-GET}"
    
    echo "🔍 Testando: $name"
    response=$(curl -X "$method" "$url" \
        -H "Accept: application/json" \
        -s \
        -w "%{http_code}|%{time_total}")
    
    http_code=$(echo "$response" | cut -d'|' -f1)
    time_total=$(echo "$response" | cut -d'|' -f2)
    
    if [ "$http_code" = "200" ]; then
        echo "✅ $name: OK (${http_code}) em ${time_total}s"
    else
        echo "❌ $name: ERRO (${http_code}) em ${time_total}s"
    fi
    echo ""
}

# Testes de Schedule
test_endpoint "Health Check" "${BASE_URL}/api/schedule/health"
test_endpoint "Progress" "${BASE_URL}/api/schedule/progress"
test_endpoint "Active Jobs" "${BASE_URL}/api/schedule/active"
test_endpoint "Statistics" "${BASE_URL}/api/schedule/stats"

# Testes de Account Query
test_endpoint "Query Logs" "${BASE_URL}/api/accounts/${TEST_AGENCY}/${TEST_ACCOUNT}/query-logs?mes=${TEST_MES}&ano=${TEST_ANO}&page=0&size=5"
test_endpoint "Import Records" "${BASE_URL}/api/accounts/${TEST_AGENCY}/${TEST_ACCOUNT}/imports?mes=${TEST_MES}&ano=${TEST_ANO}&page=0&size=5"
test_endpoint "Bank Movements" "${BASE_URL}/api/accounts/${TEST_AGENCY}/${TEST_ACCOUNT}/movements?mes=${TEST_MES}&ano=${TEST_ANO}&page=0&size=5"

echo "🎉 Validação concluída!"
```

### **Script de Teste de Performance**
```bash
#!/bin/bash

echo "📊 Teste de Performance da API"
echo "=============================="

BASE_URL="http://146.164.65.214:10000"
ENDPOINTS=(
    "/api/schedule/health"
    "/api/schedule/progress"
    "/api/schedule/stats"
    "/api/schedule/active"
)

# Função para medir performance
measure_performance() {
    local endpoint="$1"
    local iterations="${2:-10}"
    
    echo "🔍 Testando: $endpoint ($iterations requisições)"
    
    total_time=0
    min_time=999999
    max_time=0
    
    for i in $(seq 1 $iterations); do
        start_time=$(date +%s%N)
        response=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${endpoint}")
        end_time=$(date +%s%N)
        
        if [ "$response" = "200" ]; then
            duration=$(( (end_time - start_time) / 1000000 ))  # Convert to milliseconds
            total_time=$((total_time + duration))
            
            if [ $duration -lt $min_time ]; then
                min_time=$duration
            fi
            if [ $duration -gt $max_time ]; then
                max_time=$duration
            fi
            
            echo "  Requisição $i: ${duration}ms"
        else
            echo "  Requisição $i: ERRO ($response)"
        fi
        
        sleep 0.1
    done
    
    avg_time=$((total_time / iterations))
    echo "  📊 Estatísticas:"
    echo "    Mínimo: ${min_time}ms"
    echo "    Máximo: ${max_time}ms"
    echo "    Média: ${avg_time}ms"
    echo ""
}

# Executar testes de performance
for endpoint in "${ENDPOINTS[@]}"; do
    measure_performance "$endpoint" 5
done

echo "🎯 Teste de Performance Concluído!"
```

## 🔧 **Ferramentas Úteis**

### **Instalar jq para formatação JSON**
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# CentOS/RHEL
sudo yum install jq
```

### **Exemplo com jq**
```bash
# Formatar resposta JSON
curl -s "${BASE_URL}/api/schedule/progress" | jq '.'

# Extrair campo específico
curl -s "${BASE_URL}/api/schedule/stats" | jq '.totalJobs'

# Filtrar dados
curl -s "${BASE_URL}/api/accounts/2234-9/57446-5/query-logs?mes=4&ano=2025" | jq '.content[] | {agencia, contaCorrente, dataHoraTentativa}'
```