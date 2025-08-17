# TASK-017: Criação de Imagem Docker para Produção

## Tipo da Tarefa
feature

## Descrição
Criar uma imagem Docker otimizada para produção que utilize as variáveis de ambiente do arquivo `env.production`. A aplicação deve ser capaz de rodar em container Docker sem necessidade de scripts ou arquivos desnecessários, focando apenas no essencial para execução.

## Contexto (arquivos/trechos)
- `env.production` - Variáveis de ambiente para produção
- `package.json` - Dependências e scripts de build
- `vite.config.ts` - Configuração do Vite
- `src/` - Código fonte da aplicação React

## Critérios de Aceite
- [x] Dockerfile criado e otimizado para produção
- [x] Imagem utiliza multi-stage build para otimização
- [x] Variáveis de ambiente de produção são aplicadas corretamente
- [x] Aplicação roda em container sem erros
- [x] Tamanho da imagem final é otimizado
- [x] Documentação de uso da imagem Docker criada
- [x] Teste de execução da imagem em container local

## Plano (curto)
1) ✅ Criar Dockerfile otimizado com multi-stage build
2) ✅ Configurar build stage com Node.js e dependências
3) ✅ Configurar production stage com nginx para servir arquivos estáticos
4) ✅ Aplicar variáveis de ambiente de produção
5) ✅ Testar build e execução da imagem
6) ✅ Documentar processo de uso

## Testes
- Unit: Verificar se Dockerfile está sintaticamente correto

## Arquivos a Criar/Modificar
- ✅ `Dockerfile` - Arquivo principal do Docker
- ✅ `.dockerignore` - Arquivos a ignorar no build
- ✅ `nginx.conf` - Configuração do nginx
- ✅ `docker-compose.yml` - Orquestração de serviços
- ✅ `docker-build.sh` - Script de automação
- ✅ `docs/docker-deployment.md` - Documentação de uso
- ✅ `README-Docker.md` - Guia rápido de uso

## Comandos de Teste
```bash
# Build da imagem
docker build -t frontend-bb-extrato:prod .

# Execução do container
docker run -p 3000:80 frontend-bb-extrato:prod

# Verificar logs
docker logs <container_id>
```
