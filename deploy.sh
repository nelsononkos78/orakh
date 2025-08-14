#!/bin/bash

# Script de despliegue para Orakh
echo "🚀 Iniciando despliegue de Orakh..."

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Verificar si existe el archivo .env
if [ ! -f .env ]; then
    echo "⚠️  Archivo .env no encontrado. Creando desde env.example..."
    if [ -f env.example ]; then
        cp env.example .env
        echo "📝 Por favor edita el archivo .env y agrega tu DEEPSEEK_API_KEY"
        echo "🔑 Ejemplo: DEEPSEEK_API_KEY=tu_api_key_aqui"
        exit 1
    else
        echo "❌ No se encontró env.example. Creando archivo .env básico..."
        echo "DEEPSEEK_API_KEY=your_deepseek_api_key_here" > .env
        echo "📝 Por favor edita el archivo .env y agrega tu DEEPSEEK_API_KEY"
        exit 1
    fi
fi

# Verificar si DEEPSEEK_API_KEY está configurada
if grep -q "your_deepseek_api_key_here" .env || grep -q "DEEPSEEK_API_KEY=$" .env; then
    echo "❌ DEEPSEEK_API_KEY no está configurada en .env"
    echo "🔑 Por favor edita el archivo .env y agrega tu API key de DeepSeek"
    exit 1
fi

echo "✅ Configuración verificada"

# Detener contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker-compose down

# Construir y levantar contenedores
echo "🔨 Construyendo y levantando contenedores..."
docker-compose up --build -d

# Esperar un momento para que los servicios se inicien
echo "⏳ Esperando que los servicios se inicien..."
sleep 10

# Verificar estado de los servicios
echo "🔍 Verificando estado de los servicios..."
docker-compose ps

# Verificar logs
echo "📋 Últimos logs:"
docker-compose logs --tail=20

echo ""
echo "🎉 ¡Despliegue completado!"
echo ""
echo "🌐 Accede a la aplicación:"
echo "   Frontend: http://localhost:3010"
echo "   Backend API: http://localhost:8000"
echo ""
echo "📊 Para ver logs en tiempo real:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Para detener los servicios:"
echo "   docker-compose down" 