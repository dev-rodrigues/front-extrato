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

# Build da imagem
echo "🔨 Construindo imagem Docker para AMD64 (Linux)..."
echo "📱 Build cross-platform: Mac M1/M2 (ARM64) → Linux (AMD64)"
echo "🔧 Habilitando BuildKit para melhor performance..."

export DOCKER_BUILDKIT=1
docker build --platform linux/amd64 \
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
echo "📦 Versão do projeto atualizada para: v${NEW_VERSION}"
