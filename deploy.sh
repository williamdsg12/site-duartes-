#!/bin/bash

# =========================================================
# DEPLOY AUTOMÁTICO
# Projeto: site-duartes-
# GitHub: williamdsg12/site-duartes-
# Branch: main
# =========================================================

set -e

# Cores
VERDE='\033[0;32m'
AMARELO='\033[1;33m'
VERMELHO='\033[0;31m'
AZUL='\033[0;34m'
SEM_COR='\033[0m'

echo ""
echo -e "${AZUL}============================================${SEM_COR}"
echo -e "${AZUL}       DEPLOY DO SITE DUARTES${SEM_COR}"
echo -e "${AZUL}============================================${SEM_COR}"
echo ""

# ---------------------------------------------------------
# 1. Verificar se estamos dentro de um Git
# ---------------------------------------------------------

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo -e "${VERMELHO}ERRO: esta pasta não é um repositório Git.${SEM_COR}"
    exit 1
fi

# ---------------------------------------------------------
# 2. Garantir branch main
# ---------------------------------------------------------

BRANCH=$(git branch --show-current)

if [ "$BRANCH" != "main" ]; then
    echo -e "${VERMELHO}ERRO: você está na branch '$BRANCH'.${SEM_COR}"
    echo -e "${AMARELO}Este deploy deve ser feito na branch main.${SEM_COR}"
    exit 1
fi

echo -e "${VERDE}✓ Branch: main${SEM_COR}"

# ---------------------------------------------------------
# 3. Verificar remote
# ---------------------------------------------------------

REMOTE=$(git remote get-url origin 2>/dev/null || true)

if [ -z "$REMOTE" ]; then
    echo -e "${VERMELHO}ERRO: remote origin não configurado.${SEM_COR}"
    exit 1
fi

echo -e "${VERDE}✓ GitHub: $REMOTE${SEM_COR}"

# ---------------------------------------------------------
# 4. Verificar alterações
# ---------------------------------------------------------

echo ""
echo -e "${AMARELO}==> Verificando alterações...${SEM_COR}"

if [ -z "$(git status --porcelain)" ]; then
    echo -e "${VERDE}✓ Nenhuma alteração encontrada.${SEM_COR}"
    echo ""
    exit 0
fi

git status --short

# ---------------------------------------------------------
# 5. Buscar alterações do GitHub
# ---------------------------------------------------------

echo ""
echo -e "${AMARELO}==> Buscando alterações do GitHub...${SEM_COR}"

git fetch origin main

# ---------------------------------------------------------
# 6. Sincronizar com GitHub
# ---------------------------------------------------------

echo ""
echo -e "${AMARELO}==> Sincronizando com origin/main...${SEM_COR}"

git pull --rebase origin main

# ---------------------------------------------------------
# 7. Adicionar alterações
# ---------------------------------------------------------

echo ""
echo -e "${AMARELO}==> Adicionando arquivos...${SEM_COR}"

git add -A

# ---------------------------------------------------------
# 8. Criar mensagem
# ---------------------------------------------------------

if [ -n "$1" ]; then
    MENSAGEM="$1"
else
    MENSAGEM="Atualização automática - $(date '+%d/%m/%Y %H:%M:%S')"
fi

# ---------------------------------------------------------
# 9. Commit
# ---------------------------------------------------------

echo ""
echo -e "${AMARELO}==> Criando commit...${SEM_COR}"
echo -e "Mensagem: ${MENSAGEM}"

git commit -m "$MENSAGEM"

# ---------------------------------------------------------
# 10. Push para GitHub
# ---------------------------------------------------------

echo ""
echo -e "${AMARELO}==> Enviando para GitHub...${SEM_COR}"

git push origin main

# ---------------------------------------------------------
# 11. Finalização
# ---------------------------------------------------------

echo ""
echo -e "${VERDE}============================================${SEM_COR}"
echo -e "${VERDE}       ✓ DEPLOY CONCLUÍDO COM SUCESSO${SEM_COR}"
echo -e "${VERDE}============================================${SEM_COR}"
echo ""
echo -e "${VERDE}✓ Código enviado para GitHub${SEM_COR}"
echo -e "${VERDE}✓ Branch: main${SEM_COR}"
echo -e "${VERDE}✓ Vercel será acionada pelo push${SEM_COR}"
echo ""