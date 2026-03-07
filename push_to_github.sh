#!/bin/bash

# Script para subir AutoDropship AI a GitHub
# Uso: bash push_to_github.sh <GITHUB_TOKEN>

if [ -z "$1" ]; then
  echo "❌ Error: Debes proporcionar tu GitHub PAT Token"
  echo "Uso: bash push_to_github.sh <GITHUB_TOKEN>"
  exit 1
fi

TOKEN=$1
REPO_NAME="AutoDropship-IA"
USERNAME="geynerson003"

echo "🔧 Configurando push a GitHub..."
echo "├─ Repositorio: $REPO_NAME"
echo "├─ Usuario: $USERNAME"
echo "└─ Token: ${TOKEN:0:10}... (oculto por seguridad)"

# 1. Crear repositorio (si no existe)
echo ""
echo "📦 Verificando/Creando repositorio..."

CREATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST https://api.github.com/user/repos \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d "{
    \"name\": \"$REPO_NAME\",
    \"description\": \"AutoDropship AI - SaaS Full Stack para automatización de dropshipping con IA\",
    \"private\": false,
    \"has_issues\": true,
    \"has_projects\": true
  }")

HTTP_CODE=$(echo "$CREATE_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$CREATE_RESPONSE" | head -n-1)

if [[ $HTTP_CODE == "201" || $HTTP_CODE == "422" ]]; then
  echo "✅ Repositorio listo"
else
  echo "⚠️  HTTP Code: $HTTP_CODE"
fi

# 2. Configurar git
echo ""
echo "🔗 Configurando remoto de git..."

cd "c:\Users\geyne\WORSPACE PERSONAL\IADropshoping" || cd "./IADropshoping"

# Remover remoto anterior si existe
git remote remove origin 2>/dev/null || true

# Agregar nuevo remoto
git remote add origin "https://$TOKEN@github.com/$USERNAME/$REPO_NAME.git"

# Cambiar a rama main
git branch -M main

# 3. Hacer push
echo "📤 Haciendo push del código..."

if git push -u origin main; then
  echo "✅ Push completado exitosamente!"
  echo ""
  echo "🎉 Tu repositorio está disponible en:"
  echo "   https://github.com/geynerson003/AutoDropship-IA"
else
  echo "❌ Error durante el push"
  exit 1
fi

echo ""
echo "📊 Resumen:"
echo "├─ Repositorio: https://github.com/$USERNAME/$REPO_NAME"
echo "├─ Archivos: $(git rev-list --count HEAD) commits"
echo "├─ Rama principal: main"
echo "└─ Privacidad: Public"
