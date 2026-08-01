#!/bin/bash

echo ""
echo "=========================================="
echo "🚀 Deploy Automático - Duarte's Limpezas"
echo "=========================================="
echo ""

echo "🏗️  Build local..."
npm run build || exit 1

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
echo "✅ Deploy enviado com sucesso para Vercel!"
echo "=========================================="