#!/bin/bash

echo ""
echo "=========================================="
echo "🚀 Deploy Automático - Duarte's Limpezas"
echo "=========================================="
echo ""

cd frontend || exit

echo "🏗️  Build..."
npm run build || exit 1

cd ..

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
echo "✅ Site publicado!"
echo "=========================================="