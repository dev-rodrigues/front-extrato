# Dockerfile para Frontend BB Extrato - Produção
# Multi-stage build para otimização

# ========================================
# STAGE 1: Build da Aplicação
# ========================================
FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache git

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY components.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Copiar configurações de ambiente de produção
COPY env.production .env.production

# Build da aplicação para produção
RUN npm run build

# ========================================
# STAGE 2: Servidor Web de Produção
# ========================================
FROM nginx:alpine AS production

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar arquivos buildados da aplicação
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar script de inicialização
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Tornar script executável
RUN chmod +x /docker-entrypoint.sh

# Expor porta 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Usar script de inicialização
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
