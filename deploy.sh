#!/bin/bash

echo ""
echo "=========================================="
echo "🚀 Deploy Automático - Duarte's Limpezas"
echo "=========================================="
echo ""

# Garantir que estamos na pasta raiz do projeto
if [ -d "frontend" ]; then
    cd frontend || exit 1
fi

echo "🏗️  Build..."
npm run build || exit 1

if [ -d "../frontend" ]; then
    cd ..
fi

echo ""
echo "📦 Git Add..."
git add .

echo ""
echo "📝 Commit..."
git commit -m "Atualização automática $(date '+%d/%m/%Y %H:%M')" || echo "Sem alterações."

echo ""
echo "⬆️ Git Push..."
git push origin main

echo ""
echo "=========================================="
echo "✅ Site publicado com sucesso!"
echo "=========================================="