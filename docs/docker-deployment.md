# 🐳 Deploy com Docker

## Visão Geral

Este documento descreve como fazer o deploy da aplicação Frontend BB Extrato usando Docker em ambiente de produção.

## 📋 Pré-requisitos

- Docker instalado (versão 20.10+)
- Docker Compose (opcional, para orquestração)
- Acesso ao código fonte do projeto

## 🚀 Build da Imagem

### Build Local

```bash
# Build da imagem de produção
docker build -t frontend-bb-extrato:prod .

# Build com tag específica
docker build -t frontend-bb-extrato:v1.0.0 .
```

### Build com BuildKit (Recomendado)

```bash
# Habilitar BuildKit para melhor performance
export DOCKER_BUILDKIT=1

# Build otimizado
docker build --build-arg BUILDKIT_INLINE_CACHE=1 -t frontend-bb-extrato:prod .
```

## 🏃‍♂️ Execução

### Container Simples

```bash
# Executar container na porta 3000
docker run -d -p 3000:80 --name bb-extrato-frontend frontend-bb-extrato:prod

# Executar com nome específico
docker run -d -p 3000:80 --name bb-extrato-frontend \
  -e NODE_ENV=production \
  frontend-bb-extrato:prod
```

### Com Variáveis de Ambiente

```bash
docker run -d -p 3000:80 --name bb-extrato-frontend \
  -e VITE_API_BASE_URL=http://146.164.65.231/EXTRATO \
  -e VITE_NODE_ENV=production \
  -e VITE_APP_ENV=production \
  frontend-bb-extrato:prod
```

## 🐙 Docker Compose

### docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build: .
    image: frontend-bb-extrato:prod
    container_name: bb-extrato-frontend
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - bb-extrato-network

networks:
  bb-extrato-network:
    driver: bridge
```

### Execução com Compose

```bash
# Build e execução
docker-compose up -d --build

# Apenas execução (se já foi feito build)
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f frontend
```

## 🔧 Configuração de Produção

### Variáveis de Ambiente

A aplicação utiliza as seguintes variáveis de ambiente definidas em `env.production`:

```bash
# API Configuration
VITE_API_BASE_URL=http://146.164.65.231/EXTRATO
VITE_API_TIMEOUT=15000
VITE_API_RETRY_ATTEMPTS=2
VITE_API_RETRY_DELAY=1000

# Environment
VITE_NODE_ENV=production
VITE_APP_ENV=production

# Features
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_DEBUG_LOGS=false
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

### Configuração do Nginx

O container utiliza nginx com as seguintes otimizações:

- **Gzip Compression**: Ativado para arquivos estáticos
- **Cache**: Configurado para arquivos estáticos (1 ano)
- **SPA Routing**: Suporte completo para React Router
- **Security Headers**: Headers de segurança configurados
- **Health Check**: Endpoint `/health` para monitoramento

## 📊 Monitoramento

### Health Check

```bash
# Verificar status da aplicação
curl http://localhost:3000/health

# Resposta esperada: "healthy"
```

### Logs

```bash
# Ver logs do container
docker logs bb-extrato-frontend

# Ver logs em tempo real
docker logs -f bb-extrato-frontend

# Ver logs do nginx
docker exec bb-extrato-frontend tail -f /var/log/nginx/access.log
```

### Métricas

```bash
# Estatísticas do container
docker stats bb-extrato-frontend

# Informações detalhadas
docker inspect bb-extrato-frontend
```

## 🔒 Segurança

### Headers de Segurança

A aplicação inclui os seguintes headers de segurança:

- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Portas

- **80**: HTTP (interno do container)
- **3000**: Porta mapeada para o host (configurável)

## 🚨 Troubleshooting

### Problemas Comuns

#### Container não inicia

```bash
# Verificar logs de erro
docker logs bb-extrato-frontend

# Verificar se a porta está disponível
netstat -tulpn | grep :3000

# Verificar recursos do sistema
docker system df
```

#### Aplicação não responde

```bash
# Verificar se o container está rodando
docker ps

# Testar conectividade interna
docker exec bb-extrato-frontend curl -f http://localhost/health

# Verificar configuração do nginx
docker exec bb-extrato-frontend nginx -t
```

#### Problemas de Build

```bash
# Limpar cache do Docker
docker system prune -a

# Rebuild sem cache
docker build --no-cache -t frontend-bb-extrato:prod .
```

## 📈 Performance

### Otimizações Implementadas

- **Multi-stage Build**: Reduz tamanho da imagem final
- **Alpine Linux**: Base leve para nginx
- **Gzip Compression**: Reduz tamanho de transferência
- **Cache Headers**: Otimiza carregamento de recursos estáticos
- **Worker Connections**: Configurado para alta concorrência

### Métricas Esperadas

- **Tamanho da Imagem**: ~50-80MB
- **Tempo de Build**: 2-5 minutos
- **Tempo de Startup**: <10 segundos
- **Memory Usage**: ~20-40MB em runtime

## 🔄 CI/CD

### GitHub Actions (Exemplo)

```yaml
name: Build and Deploy Docker

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: |
          docker build -t frontend-bb-extrato:${{ github.sha }} .
          docker tag frontend-bb-extrato:${{ github.sha }} frontend-bb-extrato:latest
      
      - name: Push to Registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push frontend-bb-extrato:${{ github.sha }}
          docker push frontend-bb-extrato:latest
```

## 📚 Referências

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Vite Build](https://vitejs.dev/guide/build.html)
- [React Deployment](https://create-react-app.dev/docs/deployment/)
