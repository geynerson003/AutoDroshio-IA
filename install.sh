#!/bin/bash

echo "🚀 AutoDropship AI - Instalación"
echo "=================================="
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "Por favor instala Node.js desde: https://nodejs.org/"
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Instalación completada exitosamente!"
    echo ""
    echo "Próximos pasos:"
    echo "  npm run dev      - Iniciar servidor de desarrollo"
    echo "  npm run build    - Build para producción"
    echo "  npm run preview  - Preview del build"
    echo ""
else
    echo "❌ Error durante la instalación"
    exit 1
fi
