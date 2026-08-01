#!/bin/bash

# ==========================================
# Agência - Deploy Automático
# GitHub + Vercel
# ==========================================

clear

PROJECT_NAME="Duarte's Limpezas"

echo ""
echo "=========================================="
echo "🚀 Deploy Automático - $PROJECT_NAME"
echo "=========================================="
echo ""

# Verifica se está em um repositório Git
if [ ! -d ".git" ]; then
    echo "❌ Este diretório não é um repositório Git."
    exit 1
fi

# Verifica alterações
if git diff --quiet && git diff --cached --quiet; then
    echo "✅ Nenhuma alteração encontrada."
    exit 0
fi

echo "🏗️  Executando Build..."
echo ""

npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build falhou."
    echo "Deploy cancelado."
    exit 1
fi

echo ""
echo "✅ Build OK"
echo ""

echo "📦 Git Add..."
git add .

echo ""
echo "📝 Commit automático..."

COMMIT_MSG="Atualização automática - $(date '+%d/%m/%Y %H:%M:%S')"

git commit -m "$COMMIT_MSG"

if [ $? -ne 0 ]; then
    echo ""
    echo "ℹ️ Nada para commitar."
fi

echo ""
echo "⬆️ Git Push..."

git push origin main

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Erro ao enviar para o GitHub."
    exit 1
fi

echo ""
echo "✅ GitHub atualizado!"
echo ""

echo "🌐 Deploy Vercel..."
echo ""

vercel --prod

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Erro durante o deploy na Vercel."
    exit 1
fi

echo ""
echo "=========================================="
echo "🎉 Deploy concluído com sucesso!"
echo "=========================================="
echo ""
echo "📦 Build............. OK"
echo "📤 GitHub............ OK"
echo "🌐 Vercel............ OK"
echo ""
echo "Acesse seu projeto pelo domínio configurado"
echo "ou pelo endereço fornecido pela Vercel."
echo ""