#!/bin/bash

# Script para build e execução da imagem Docker
# Uso: ./docker-build.sh [build|run|stop|clean]

set -e

IMAGE_NAME="frontend-bb-extrato"
TAG="prod"
CONTAINER_NAME="bb-extrato-frontend"
PORT="3000"

echo "🐳 Docker Build Script para Frontend BB Extrato"
echo "================================================"

case "${1:-build}" in
    "build")
        echo "🔨 Construindo imagem Docker..."
        docker build -t ${IMAGE_NAME}:${TAG} .
        echo "✅ Imagem construída com sucesso!"
        echo "📊 Informações da imagem:"
        docker images ${IMAGE_NAME}:${TAG}
        ;;
    
    "run")
        echo "🚀 Executando container..."
        docker run -d \
            --name ${CONTAINER_NAME} \
            -p ${PORT}:80 \
            -e NODE_ENV=production \
            -e VITE_NODE_ENV=production \
            -e VITE_APP_ENV=production \
            ${IMAGE_NAME}:${TAG}
        echo "✅ Container executando na porta ${PORT}"
        echo "🌐 Acesse: http://localhost:${PORT}"
        ;;
    
    "compose")
        echo "🐙 Executando com Docker Compose..."
        docker-compose up -d --build
        echo "✅ Serviços executando com Docker Compose"
        echo "🌐 Acesse: http://localhost:${PORT}"
        ;;
    
    "stop")
        echo "⏹️  Parando container..."
        docker stop ${CONTAINER_NAME} 2>/dev/null || echo "Container não estava rodando"
        docker rm ${CONTAINER_NAME} 2>/dev/null || echo "Container não existia"
        echo "✅ Container parado e removido"
        ;;
    
    "clean")
        echo "🧹 Limpando recursos Docker..."
        docker stop ${CONTAINER_NAME} 2>/dev/null || true
        docker rm ${CONTAINER_NAME} 2>/dev/null || true
        docker rmi ${IMAGE_NAME}:${TAG} 2>/dev/null || true
        echo "✅ Recursos limpos"
        ;;
    
    "logs")
        echo "📋 Exibindo logs do container..."
        docker logs -f ${CONTAINER_NAME}
        ;;
    
    "status")
        echo "📊 Status dos containers:"
        docker ps -a | grep ${CONTAINER_NAME} || echo "Container não encontrado"
        echo ""
        echo "📊 Status das imagens:"
        docker images | grep ${IMAGE_NAME} || echo "Imagem não encontrada"
        ;;
    
    *)
        echo "❌ Uso: $0 [build|run|compose|stop|clean|logs|status]"
        echo ""
        echo "Comandos disponíveis:"
        echo "  build   - Construir imagem Docker"
        echo "  run     - Executar container"
        echo "  compose - Executar com Docker Compose"
        echo "  stop    - Parar e remover container"
        echo "  clean   - Limpar todos os recursos"
        echo "  logs    - Exibir logs do container"
        echo "  status  - Verificar status"
        exit 1
        ;;
esac
