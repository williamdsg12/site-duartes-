#!/bin/bash

# =========================================================
#  deploy.sh - Envia as atualizações do projeto para o GitHub
#  (a Vercel detecta o push automaticamente e faz o deploy)
# =========================================================
#
#  Como usar:
#    ./deploy.sh "mensagem do commit"
#
#  Se não passar mensagem, ele usa uma automática com data/hora.
# =========================================================

set -e  # para o script se algum comando der erro

# Cores para deixar a saída mais fácil de ler
VERDE='\033[0;32m'
AMARELO='\033[1;33m'
VERMELHO='\033[0;31m'
SEM_COR='\033[0m'

echo -e "${AMARELO}==> Verificando status do repositório...${SEM_COR}"
git status --short

# Se não houver nenhuma mudança, avisa e para
if [ -z "$(git status --porcelain)" ]; then
  echo -e "${VERMELHO}Nenhuma alteração encontrada. Nada para enviar.${SEM_COR}"
  exit 0
fi

# Descobre a branch atual automaticamente
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo -e "${AMARELO}==> Branch atual: ${BRANCH}${SEM_COR}"

# Monta a mensagem do commit (usa a que foi passada, ou gera uma padrão)
if [ -n "$1" ]; then
  MENSAGEM="$1"
else
  MENSAGEM="Atualização automática - $(date '+%d/%m/%Y %H:%M')"
fi

echo -e "${AMARELO}==> Adicionando arquivos alterados...${SEM_COR}"
git add -A

echo -e "${AMARELO}==> Criando commit: \"${MENSAGEM}\"${SEM_COR}"
git commit -m "$MENSAGEM"

echo -e "${AMARELO}==> Sincronizando alterações com o GitHub...${SEM_COR}"
git pull --rebase origin "$BRANCH"

echo -e "${AMARELO}==> Enviando para o GitHub (origin/${BRANCH})...${SEM_COR}"
git push origin "$BRANCH"

echo -e "${VERDE}✔ Atualização enviada com sucesso!${SEM_COR}"
echo -e "${VERDE}✔ A Vercel deve iniciar o deploy automaticamente em instantes.${SEM_COR}"
echo -e "${AMARELO}   Acompanhe em: https://vercel.com/williamdsg12-gmailcoms-projects/site-duartes/deployments${SEM_COR}"
