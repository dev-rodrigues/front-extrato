#!/bin/bash

# Script para build e push automático da imagem Docker
# Uso: ./docker-build.sh

set -e

IMAGE_NAME="frontend-bb-extrato"
TAG="prod"
DOCKERHUB_USERNAME="httpsantos"
DOCKERHUB_REPO="front-extrato"

echo "🐳 Docker Build & Push Script para Frontend BB Extrato"
echo "======================================================"

# Obter versão atual da imagem no Docker Hub
echo "🔍 Verificando versão atual no Docker Hub..."
CURRENT_VERSION=$(docker run --rm curlimages/curl:latest curl -s "https://registry.hub.docker.com/v2/repositories/${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}/tags/" | grep -o '"name":"[^"]*"' | grep -v "latest" | grep -v "prod" | head -1 | cut -d'"' -f4 | sed 's/v//' || echo "0.0.0")

echo "📋 Versão atual encontrada: v${CURRENT_VERSION}"

# Incrementar versão (patch version)
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR="${VERSION_PARTS[0]}"
MINOR="${VERSION_PARTS[1]}"
PATCH="${VERSION_PARTS[2]}"
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="${MAJOR}.${MINOR}.${NEW_PATCH}"

echo "🚀 Nova versão: v${NEW_VERSION}"

# Build da imagem
echo "🔨 Construindo imagem Docker para AMD64 (Linux)..."
echo "📱 Build cross-platform: Mac M1/M2 (ARM64) → Linux (AMD64)"
echo "🔧 Habilitando BuildKit para melhor performance..."

export DOCKER_BUILDKIT=1
docker build --platform linux/amd64 \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    -t ${IMAGE_NAME}:${TAG} \
    -t ${IMAGE_NAME}:v${NEW_VERSION} .

echo "✅ Imagem construída com sucesso!"

# Tag para Docker Hub
echo "🏷️  Tagging imagem para Docker Hub..."
docker tag ${IMAGE_NAME}:${TAG} ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:${TAG}
docker tag ${IMAGE_NAME}:${TAG} ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:latest
docker tag ${IMAGE_NAME}:${TAG} ${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}:v${NEW_VERSION}

# Push para Docker Hub
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
echo "📊 Tamanho da imagem: $(docker images ${IMAGE_NAME}:${TAG} --format 'table {{.Size}}' | tail -1)"
