# 🐳 Docker - Frontend BB Extrato

## 📋 **Visão Geral**

Este projeto inclui configuração Docker completa para containerizar a aplicação Frontend BB Extrato em ambiente de produção.

## 🏗️ **Arquitetura**

### **Multi-stage Build:**
- **Stage 1 (Builder)**: Node.js 18 Alpine para build da aplicação
- **Stage 2 (Production)**: Nginx Alpine para servir os arquivos estáticos

### **Componentes:**
- `Dockerfile` - Configuração principal do container
- `nginx.conf` - Configuração otimizada do Nginx
- `docker-entrypoint.sh` - Script de inicialização
- `docker-compose.yml` - Orquestração dos serviços
- `.dockerignore` - Otimização do contexto de build

## 🚀 **Como Usar**

### **1. Build e Execução Simples**

```bash
# Build da imagem
docker build -t frontend-bb-extrato .

# Executar container
docker run -d \
  --name frontend-bb-extrato \
  -p 8080:80 \
  -e VITE_API_BASE_URL=https://api.coppetec.org.br \
  frontend-bb-extrato
```

### **2. Usando Docker Compose (Recomendado)**

```bash
# Produção
docker-compose up -d

# Desenvolvimento (com hot reload)
docker-compose --profile dev up -d

# Parar serviços
docker-compose down
```

### **3. Acessar a Aplicação**

- **Produção**: http://localhost:8080
- **Desenvolvimento**: http://localhost:3000

## ⚙️ **Configurações**

### **Variáveis de Ambiente Disponíveis:**

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `VITE_API_BASE_URL` | `https://api.coppetec.org.br` | URL base da API |
| `VITE_API_TIMEOUT` | `15000` | Timeout da API em ms |
| `VITE_API_RETRY_ATTEMPTS` | `2` | Tentativas de retry |
| `VITE_API_RETRY_DELAY` | `1000` | Delay entre retries em ms |
| `NGINX_PORT` | `80` | Porta do Nginx |
| `NGINX_SERVER_NAME` | `localhost` | Nome do servidor |

### **Configurações do Nginx:**

- **Gzip compression** habilitado
- **Cache otimizado** para arquivos estáticos
- **Rate limiting** para API e arquivos estáticos
- **Headers de segurança** configurados
- **SPA routing** configurado (fallback para index.html)

## 🔧 **Comandos Úteis**

### **Build e Deploy:**

```bash
# Build da imagem
docker build -t frontend-bb-extrato .

# Build sem cache
docker build --no-cache -t frontend-bb-extrato .

# Executar em modo interativo
docker run -it --rm -p 8080:80 frontend-bb-extrato /bin/sh

# Ver logs
docker logs frontend-bb-extrato

# Executar comandos no container
docker exec -it frontend-bb-extrato /bin/sh
```

### **Docker Compose:**

```bash
# Build e start
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Parar e remover
docker-compose down -v

# Rebuild específico
docker-compose build frontend-bb-extrato
```

## 📊 **Monitoramento**

### **Healthcheck:**
- Verifica se a aplicação está respondendo
- Intervalo: 30s
- Timeout: 3s
- Retries: 3

### **Logs:**
- Nginx access logs: `/var/log/nginx/access.log`
- Nginx error logs: `/var/log/nginx/error.log`
- Logs do container: `docker logs frontend-bb-extrato`

## 🚨 **Troubleshooting**

### **Problemas Comuns:**

#### **1. Container não inicia:**
```bash
# Ver logs
docker logs frontend-bb-extrato

# Verificar configuração do Nginx
docker exec -it frontend-bb-extrato nginx -t
```

#### **2. Aplicação não carrega:**
```bash
# Verificar se os arquivos estão no container
docker exec -it frontend-bb-extrato ls -la /usr/share/nginx/html

# Verificar permissões
docker exec -it frontend-bb-extrato ls -la /usr/share/nginx/html
```

#### **3. Problemas de API:**
```bash
# Verificar variáveis de ambiente
docker exec -it frontend-bb-extrato env | grep VITE

# Testar conectividade
docker exec -it frontend-bb-extrato curl -I https://api.coppetec.org.br
```

## 🔒 **Segurança**

### **Headers Configurados:**
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### **Rate Limiting:**
- **API**: 10 requests/segundo
- **Arquivos estáticos**: 100 requests/segundo

## 📈 **Performance**

### **Otimizações:**
- **Multi-stage build** para reduzir tamanho da imagem
- **Gzip compression** para todos os tipos de arquivo
- **Cache headers** otimizados para arquivos estáticos
- **Nginx worker processes** configurados

### **Tamanho da Imagem:**
- **Builder stage**: ~500MB
- **Production stage**: ~50MB (apenas Nginx + arquivos buildados)

## 🌐 **Deploy em Produção**

### **1. Build da Imagem:**
```bash
docker build -t frontend-bb-extrato:latest .
```

### **2. Tag para Registry:**
```bash
docker tag frontend-bb-extrato:latest your-registry/frontend-bb-extrato:latest
```

### **3. Push para Registry:**
```bash
docker push your-registry/frontend-bb-extrato:latest
```

### **4. Deploy no Servidor:**
```bash
# Pull da imagem
docker pull your-registry/frontend-bb-extrato:latest

# Executar com variáveis de produção
docker run -d \
  --name frontend-bb-extrato \
  -p 80:80 \
  -e VITE_API_BASE_URL=https://api.coppetec.org.br \
  -e NGINX_SERVER_NAME=your-domain.com \
  your-registry/frontend-bb-extrato:latest
```

## 📚 **Recursos Adicionais**

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Multi-stage Builds](https://docs.docker.com/develop/dev-best-practices/multistage-build/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## ✅ **Status**

- ✅ **Dockerfile** criado e testado
- ✅ **Nginx** configurado para SPA
- ✅ **Multi-stage build** implementado
- ✅ **Healthcheck** configurado
- ✅ **Docker Compose** configurado
- ✅ **Documentação** completa

**A aplicação está pronta para ser containerizada!** 🐳✨
