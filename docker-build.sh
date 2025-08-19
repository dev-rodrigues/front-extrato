#!/bin/bash

# Script para build e push automático da imagem Docker
# Uso: ./docker-build.sh [--multi-platform] [--no-push]

set -e

IMAGE_NAME="frontend-bb-extrato"
TAG="prod"
DOCKERHUB_USERNAME="httpsantos"
DOCKERHUB_REPO="front-extrato"
MULTI_PLATFORM=false
NO_PUSH=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --multi-platform)
            MULTI_PLATFORM=true
            shift
            ;;
        --no-push)
            NO_PUSH=true
            shift
            ;;
        --help)
            echo "Uso: $0 [--multi-platform] [--no-push]"
            echo "  --multi-platform: Build para múltiplas plataformas (AMD64 + ARM64)"
            echo "  --no-push: Apenas build local, sem push para Docker Hub"
            exit 0
            ;;
        *)
            echo "Opção desconhecida: $1"
            echo "Use --help para ver as opções disponíveis"
            exit 1
            ;;
    esac
done

echo "🐳 Docker Build & Push Script para Frontend BB Extrato"
echo "======================================================"

# Obter versão atual do package.json
echo "🔍 Obtendo versão atual do projeto..."
CURRENT_VERSION=$(node -p "require('./package.json').version")

echo "📋 Versão atual do projeto: v${CURRENT_VERSION}"

# Incrementar versão (patch version)
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR="${VERSION_PARTS[0]}"
MINOR="${VERSION_PARTS[1]}"
PATCH="${VERSION_PARTS[2]}"
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="${MAJOR}.${MINOR}.${NEW_PATCH}"

echo "🚀 Nova versão: v${NEW_VERSION}"

# Atualizar package.json com nova versão
echo "📝 Atualizando package.json com nova versão..."
node -e "
const fs = require('fs');
const package = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
package.version = '${NEW_VERSION}';
fs.writeFileSync('./package.json', JSON.stringify(package, null, 2) + '\n');
"
echo "✅ package.json atualizado para versão ${NEW_VERSION}"

# Atualizar arquivo version.ts com nova versão
echo "📝 Atualizando version.ts com nova versão..."
node -e "
const fs = require('fs');
const versionContent = fs.readFileSync('./src/version.ts', 'utf8');
const updatedContent = versionContent.replace(/export const APP_VERSION = '[^']*'/, \"export const APP_VERSION = '${NEW_VERSION}'\");
fs.writeFileSync('./src/version.ts', updatedContent);
"
echo "✅ version.ts atualizado para versão ${NEW_VERSION}"

# Build da imagem
echo "🔨 Construindo imagem Docker..."
if [ "$MULTI_PLATFORM" = true ]; then
    echo "🌐 Build multi-platform: Linux (AMD64 + ARM64)"
    echo "🔧 Habilitando BuildKit para melhor performance..."
    
    export DOCKER_BUILDKIT=1
    docker buildx create --use --name multi-platform-builder 2>/dev/null || true
    
    docker buildx build --platform linux/amd64,linux/arm64 \
        --build-arg BUILDKIT_INLINE_CACHE=1 \
        --build-arg VERSION=${NEW_VERSION} \
        -t ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:${TAG} \
        -t ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:latest \
        -t ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:v${NEW_VERSION} \
        --push .
else
    echo "📱 Build para AMD64 (Linux) - compatível com Mac M1/M2 (ARM64)"
    echo "🔧 Habilitando BuildKit para melhor performance..."
    
    export DOCKER_BUILDKIT=1
    docker build \
        --build-arg BUILDKIT_INLINE_CACHE=1 \
        --build-arg VERSION=${NEW_VERSION} \
        -t ${IMAGE_NAME}:${TAG} \
        -t ${IMAGE_NAME}:v${NEW_VERSION} .
    
    echo "✅ Imagem construída com sucesso!"
    
    # Tag para Docker Hub
    echo "🏷️  Tagging imagem para Docker Hub..."
    docker tag ${IMAGE_NAME}:${TAG} ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:${TAG}
    docker tag ${IMAGE_NAME}:${TAG} ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:latest
    docker tag ${IMAGE_NAME}:${TAG} ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:v${NEW_VERSION}
fi

# Push para Docker Hub (se não for --no-push e não for multi-platform)
if [ "$NO_PUSH" = false ] && [ "$MULTI_PLATFORM" = false ]; then
    echo "📤 Fazendo push para Docker Hub..."
    echo "📤 Enviando tag ${TAG}..."
    docker push ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:${TAG}
    echo "📤 Enviando tag latest..."
    docker push ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:latest
    echo "📤 Enviando tag v${NEW_VERSION}..."
    docker push ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:v${NEW_VERSION}
    
    echo "✅ Build + Push concluído com sucesso!"
    echo "🌐 Imagem disponível em: https://hub.docker.com/r/${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}"
    echo "🏷️  Tags enviadas: ${TAG}, latest, v${NEW_VERSION}"
elif [ "$MULTI_PLATFORM" = true ]; then
    echo "✅ Build multi-platform concluído com sucesso!"
    echo "🌐 Imagem disponível em: https://hub.docker.com/r/${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}"
    echo "🏷️  Tags enviadas: ${TAG}, latest, v${NEW_VERSION}"
    echo "🌐 Imagem multi-platform disponível para AMD64 e ARM64"
else
    echo "✅ Build concluído com sucesso! (sem push)"
fi

echo "📊 Tamanho da imagem: $(docker images ${IMAGE_NAME}:${TAG} --format 'table {{.Size}}' | tail -1 2>/dev/null || echo 'N/A para multi-platform')"
echo "📦 Versão do projeto atualizada para: v${NEW_VERSION}"
