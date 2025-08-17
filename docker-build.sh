#!/bin/bash

# Script para build e execução da imagem Docker
# Uso: ./docker-build.sh [build|run|stop|clean]

set -e

IMAGE_NAME="frontend-bb-extrato"
TAG="prod"
CONTAINER_NAME="bb-extrato-frontend"
PORT="3000"
DOCKERHUB_USERNAME="httpsantos"
DOCKERHUB_REPO="front-extrato"

# Obter versão do git tag ou usar padrão
VERSION=$(git describe --tags --abbrev=0 2>/dev/null | sed 's/^v//' || echo "1.1.0")

echo "🐳 Docker Build Script para Frontend BB Extrato"
echo "================================================"

case "${1:-build}" in
    "build")
        echo "🔨 Construindo imagem Docker para AMD64 (Linux)..."
        echo "📱 Build cross-platform: Mac M4 (ARM64) → Linux (AMD64)"
        docker build --platform linux/amd64 -t ${IMAGE_NAME}:${TAG} .
        echo "✅ Imagem construída com sucesso!"
        echo "📊 Informações da imagem:"
        docker images ${IMAGE_NAME}:${TAG}
        ;;
    
    "build-prod")
        echo "🚀 Construindo imagem Docker para PRODUÇÃO (AMD64)..."
        echo "📱 Build cross-platform otimizado para servidor Linux"
        echo "🔧 Habilitando BuildKit para melhor performance..."
        export DOCKER_BUILDKIT=1
        docker build --platform linux/amd64 \
            --build-arg BUILDKIT_INLINE_CACHE=1 \
            -t ${IMAGE_NAME}:${TAG} .
        echo "✅ Imagem de produção construída com sucesso!"
        echo "📊 Informações da imagem:"
        docker images ${IMAGE_NAME}:${TAG}
        ;;
    
    "push")
        echo "📤 Fazendo push para Docker Hub..."
        echo "🏷️  Tagging imagem para ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}"
        echo "📋 Versão atual: v${VERSION}"
        
        # Tag da imagem para Docker Hub
        docker tag ${IMAGE_NAME}:${TAG} ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:${TAG}
        docker tag ${IMAGE_NAME}:${TAG} ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:latest
        docker tag ${IMAGE_NAME}:${TAG} ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:v${VERSION}
        
        # Push para Docker Hub
        echo "📤 Enviando tag ${TAG}..."
        docker push ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:${TAG}
        echo "📤 Enviando tag latest..."
        docker push ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:latest
        echo "📤 Enviando tag v${VERSION}..."
        docker push ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:v${VERSION}
        
        echo "✅ Push para Docker Hub concluído com sucesso!"
        echo "🌐 Imagem disponível em: https://hub.docker.com/r/${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}"
        echo "🏷️  Tags disponíveis: ${TAG}, latest, v${VERSION}"
        ;;
    
    "build-and-push")
        echo "🚀 Build + Push completo para Docker Hub..."
        echo "📱 Build cross-platform otimizado para servidor Linux"
        echo "📋 Versão atual: v${VERSION}"
        
        # Build da imagem
        export DOCKER_BUILDKIT=1
        docker build --platform linux/amd64 \
            --build-arg BUILDKIT_INLINE_CACHE=1 \
            -t ${IMAGE_NAME}:${TAG} .
        
        echo "✅ Build concluído! Fazendo push..."
        
        # Tag e push
        docker tag ${IMAGE_NAME}:${TAG} ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:${TAG}
        docker tag ${IMAGE_NAME}:${TAG} ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:latest
        docker tag ${IMAGE_NAME}:${TAG} ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:v${VERSION}
        
        docker push ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:${TAG}
        docker push ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:latest
        docker push ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:v${VERSION}
        
        echo "✅ Build + Push concluído com sucesso!"
        echo "🌐 Imagem disponível em: https://hub.docker.com/r/${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}"
        echo "🏷️  Tags disponíveis: ${TAG}, latest, v${VERSION}"
        ;;
    
    "login")
        echo "🔐 Login no Docker Hub..."
        echo "👤 Usuário: ${DOCKERHUB_USERNAME}"
        echo "📝 Repositório: ${DOCKERHUB_REPO}"
        echo ""
        echo "⚠️  Certifique-se de estar logado no Docker Hub antes de fazer push"
        echo "💡 Use: docker login"
        docker login
        ;;
    
    "versions")
        echo "🏷️  Versões disponíveis:"
        echo "📋 Git Tag atual: v${VERSION}"
        echo ""
        echo "🐳 Imagens Docker Hub:"
        docker images ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO} 2>/dev/null || echo "Nenhuma imagem encontrada"
        echo ""
        echo "📊 Tags disponíveis:"
        echo "  - ${TAG} (versão de produção)"
        echo "  - latest (versão mais recente)"
        echo "  - v${VERSION} (versão numerada)"
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
        echo "❌ Uso: $0 [build|build-prod|push|build-and-push|login|versions|run|compose|stop|clean|logs|status]"
        echo ""
        echo "Comandos disponíveis:"
        echo "  build         - Construir imagem Docker (AMD64 para Linux)"
        echo "  build-prod    - Construir imagem otimizada para produção (AMD64)"
        echo "  push          - Fazer push da imagem para Docker Hub"
        echo "  build-and-push - Build + Push completo para Docker Hub"
        echo "  login         - Login no Docker Hub"
        echo "  versions      - Listar versões disponíveis"
        echo "  run           - Executar container"
        echo "  compose       - Executar com Docker Compose"
        echo "  stop          - Parar e remover container"
        echo "  clean         - Limpar todos os recursos"
        echo "  logs          - Exibir logs do container"
        echo "  status        - Verificar status"
        echo ""
        echo "🐳 Docker Hub: ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}"
        echo "📋 Versão atual: v${VERSION}"
        exit 1
        ;;
esac
