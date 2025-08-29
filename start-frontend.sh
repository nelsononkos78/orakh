#!/bin/bash

echo "🚀 Iniciando Frontend de Orakh..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18 o superior."
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala npm."
    exit 1
fi

cd frontend

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

echo "✅ Dependencias verificadas"
echo "🌐 Iniciando servidor de desarrollo en http://localhost:2800"

# Iniciar el servidor de desarrollo
npm run dev -- --port 2800 