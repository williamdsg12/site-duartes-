#!/bin/bash

echo ""
echo "======================================="
echo " Deploy GitHub - Duarte's Site"
echo "======================================="
echo ""

git add .

read -p "Mensagem do commit: " message

if [ -z "$message" ]; then
    message="Atualização do projeto"
fi

git commit -m "$message"

git push origin main

echo ""
echo "======================================="
echo "Deploy realizado com sucesso!"
echo "======================================="
# =======================================
#   SCRIPT AUTOMÁTICO - DEPLOY GitHub
# =======================================

echo ""
echo "======================================="
echo "Deploy GitHub - Duarte's Site"
echo "======================================="
echo ""

# 1. Adicionar todos os arquivos
echo "🚀 Adicionando arquivos..."
git add .

# 2. Perguntar mensagem do commit
echo ""
read -p "Digite a mensagem do commit: " mensagem

# 3. Criar commit
echo ""
echo "📝 Criando commit..."
git commit -m "$mensagem"

# 4. Enviar para o GitHub
echo ""
echo "⬆️ Enviando para o GitHub..."
git push origin main

# 5. Mensagem de sucesso
echo ""
echo "======================================="
echo "✅ Deploy realizado com sucesso!"
echo "======================================="