# Multi-stage build para otimização de tamanho
# Build para arquitetura AMD64 (Linux x86_64) - compatível com Mac M1
FROM --platform=linux/amd64 node:20.19.4-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Definir build arg para versão
ARG VERSION=1.0.0

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências (incluindo devDependencies para build)
RUN npm ci

# Copiar código fonte
COPY . .

# Definir variáveis de ambiente para produção durante o build
ENV VITE_API_BASE_URL=http://146.164.65.231/EXTRATO
ENV VITE_NODE_ENV=production
ENV VITE_APP_ENV=production
ENV VITE_APP_VERSION=${VERSION}
ENV NODE_ENV=production

# Build da aplicação para produção
RUN npm run build

# Stage de produção com nginx
FROM --platform=linux/amd64 nginx:stable-alpine AS production

# Definir build arg para versão
ARG VERSION=1.0.0

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Definir diretório de trabalho para nginx
WORKDIR /usr/share/nginx/html

# Copiar arquivos buildados do stage anterior
COPY --from=builder /app/dist ./web-dev
COPY --from=builder /app/dist/index.html .

# Expor porta 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
