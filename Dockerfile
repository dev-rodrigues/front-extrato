# Multi-stage build para otimização de tamanho
# Build para arquitetura AMD64 (Linux x86_64)
FROM --platform=linux/amd64 node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar TODAS as dependências (incluindo devDependencies para build)
RUN npm ci

# Copiar código fonte
COPY . .

# Definir variáveis de ambiente para produção durante o build
ENV VITE_API_BASE_URL=http://146.164.65.231/EXTRATO
ENV VITE_NODE_ENV=production
ENV VITE_APP_ENV=production

# Build da aplicação para produção
RUN npm run build

# Stage de produção com nginx
FROM --platform=linux/amd64 nginx:alpine AS production

# Copiar arquivos buildados do stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expor porta 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
