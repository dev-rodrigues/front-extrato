# Multi-stage build para otimização de tamanho
# Build para arquitetura AMD64 (Linux x86_64) - compatível com Mac M1
FROM --platform=linux/amd64 node:20.19.4-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências primeiro para melhor cache
COPY package*.json ./

# Instalar dependências (incluindo devDependencies para build)
RUN npm ci

# Copiar código fonte
COPY . .

# Obter versão dinamicamente do package.json e definir como ARG
ARG APP_VERSION
RUN node -e "console.log(require('./package.json').version)" > .version
ARG VERSION=$(cat .version)

# Definir variáveis de ambiente para produção durante o build
ENV VITE_API_BASE_URL=https://apidev.coppetec.ufrj.br/EXTRATO
ENV VITE_NODE_ENV=production
ENV VITE_APP_ENV=production
ENV VITE_APP_VERSION=${VERSION}
ENV NODE_ENV=production

# Build da aplicação para produção
RUN npm run build

# Stage de produção com nginx
FROM --platform=linux/amd64 nginx:stable-alpine AS production

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Definir diretório de trabalho para nginx
WORKDIR /usr/share/nginx/html

# Copiar arquivos buildados do stage anterior
# Usar nome da pasta dinâmico baseado em vite.constants.ts (schedkiwi)
COPY --from=builder /app/dist ./schedkiwi
COPY --from=builder /app/dist/index.html .

# Expor porta 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
