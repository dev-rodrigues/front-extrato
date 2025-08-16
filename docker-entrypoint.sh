#!/bin/sh
# Script de inicialização para o container Docker
# Frontend BB Extrato - Produção

set -e

echo "🚀 Iniciando Frontend BB Extrato..."

# Verificar se as variáveis de ambiente estão configuradas
if [ -z "$VITE_API_BASE_URL" ]; then
    echo "⚠️  VITE_API_BASE_URL não definida, usando valor padrão"
    export VITE_API_BASE_URL="https://api.coppetec.org.br"
fi

if [ -z "$VITE_API_TIMEOUT" ]; then
    echo "⚠️  VITE_API_TIMEOUT não definida, usando valor padrão"
    export VITE_API_TIMEOUT="15000"
fi

# Verificar se o diretório de build existe
if [ ! -d "/usr/share/nginx/html" ]; then
    echo "❌ Diretório de build não encontrado!"
    exit 1
fi

# Verificar se o index.html existe
if [ ! -f "/usr/share/nginx/html/index.html" ]; then
    echo "❌ index.html não encontrado!"
    exit 1
fi

# Verificar se o nginx está funcionando
echo "🔍 Verificando configuração do Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuração do Nginx válida"
else
    echo "❌ Configuração do Nginx inválida"
    exit 1
fi

# Criar arquivo de configuração dinâmica se necessário
if [ ! -z "$NGINX_SERVER_NAME" ]; then
    echo "🔧 Configurando server_name: $NGINX_SERVER_NAME"
    sed -i "s/server_name localhost;/server_name $NGINX_SERVER_NAME;/" /etc/nginx/nginx.conf
fi

# Configurar porta se especificada
if [ ! -z "$NGINX_PORT" ]; then
    echo "🔧 Configurando porta: $NGINX_PORT"
    sed -i "s/listen 80;/listen $NGINX_PORT;/" /etc/nginx/nginx.conf
fi

# Verificar permissões
echo "🔐 Verificando permissões..."
chown -R nginx:nginx /usr/share/nginx/html
chmod -R 755 /usr/share/nginx/html

# Log das configurações
echo "📋 Configurações ativas:"
echo "   - API Base URL: $VITE_API_BASE_URL"
echo "   - API Timeout: $VITE_API_TIMEOUT"
echo "   - Nginx Port: ${NGINX_PORT:-80}"
echo "   - Server Name: ${NGINX_SERVER_NAME:-localhost}"

# Iniciar nginx
echo "🌟 Iniciando Nginx..."
exec "$@"
