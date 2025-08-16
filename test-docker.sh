#!/bin/bash
# Script de teste para Docker - Frontend BB Extrato

set -e

echo "🧪 Testando configuração Docker..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado"
    exit 1
fi

# Verificar se Docker está rodando
if ! docker info &> /dev/null; then
    echo "❌ Docker não está rodando"
    echo "💡 Inicie o Docker Desktop ou docker daemon"
    exit 1
fi

echo "✅ Docker está funcionando"

# Verificar se os arquivos necessários existem
echo "📁 Verificando arquivos necessários..."

required_files=(
    "Dockerfile"
    "nginx.conf"
    "docker-entrypoint.sh"
    "docker-compose.yml"
    ".dockerignore"
    "env.production"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file não encontrado"
        exit 1
    fi
done

echo "✅ Todos os arquivos necessários estão presentes"

# Verificar sintaxe do Dockerfile
echo "🔍 Verificando sintaxe do Dockerfile..."
if docker build --dry-run . &> /dev/null; then
    echo "✅ Dockerfile tem sintaxe válida"
else
    echo "❌ Dockerfile tem problemas de sintaxe"
    exit 1
fi

# Verificar sintaxe do docker-compose
echo "🔍 Verificando sintaxe do docker-compose.yml..."
if docker-compose config &> /dev/null; then
    echo "✅ docker-compose.yml tem sintaxe válida"
else
    echo "❌ docker-compose.yml tem problemas de sintaxe"
    exit 1
fi

# Verificar se o script de entrada é executável
echo "🔍 Verificando permissões do script de entrada..."
if [ -x "docker-entrypoint.sh" ]; then
    echo "✅ docker-entrypoint.sh é executável"
else
    echo "⚠️  Tornando docker-entrypoint.sh executável..."
    chmod +x docker-entrypoint.sh
fi

# Verificar configuração do nginx
echo "🔍 Verificando configuração do nginx..."
if docker run --rm nginx:alpine nginx -t -c /etc/nginx/nginx.conf &> /dev/null; then
    echo "✅ Configuração do nginx é válida"
else
    echo "❌ Configuração do nginx tem problemas"
    exit 1
fi

echo ""
echo "🎉 Todos os testes passaram!"
echo ""
echo "🚀 Para usar o Docker:"
echo "   # Build da imagem"
echo "   docker build -t frontend-bb-extrato ."
echo ""
echo "   # Executar com Docker Compose"
echo "   docker-compose up -d"
echo ""
echo "   # Acessar a aplicação"
echo "   open http://localhost:8080"
echo ""
echo "📚 Consulte DOCKER_README.md para mais detalhes"
