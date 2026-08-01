#!/bin/bash

# =======================================
# Deploy Automático GitHub
# Duarte's Limpezas
# =======================================

clear

echo "======================================="
echo "🚀 Deploy Automático GitHub"
echo "======================================="
echo ""

# Verifica se existe alteração
if git diff --quiet && git diff --cached --quiet; then
    echo "✅ Nenhuma alteração encontrada."
    exit 0
fi

echo "📦 Adicionando arquivos..."
git add .

echo ""
echo "📝 Criando commit..."

git commit -m "Atualização automática - $(date '+%d/%m/%Y %H:%M')"

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Erro ao criar commit."
    exit 1
fi

echo ""
echo "⬆️ Enviando para o GitHub..."

git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "======================================="
    echo "✅ Deploy realizado com sucesso!"
    echo "======================================="
else
    echo ""
    echo "======================================="
    echo "❌ Erro ao enviar para o GitHub."
    echo "======================================="
    exit 1
fi