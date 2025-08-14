#!/bin/bash

echo "🚀 Iniciando Orakh en modo local..."

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
echo ""
echo "🌐 Iniciando servicios:"
echo "   Backend: http://localhost:8000"
echo "   Frontend: http://localhost:3010"
echo ""
echo "💡 Para detener los servicios, presiona Ctrl+C en cada terminal"
echo ""

# Función para manejar la señal de interrupción
cleanup() {
    echo ""
    echo "🛑 Deteniendo servicios..."
    exit 0
}

# Capturar señal de interrupción
trap cleanup SIGINT

# Iniciar backend en segundo plano
echo "🔧 Iniciando Backend..."
./start-backend.sh &
BACKEND_PID=$!

# Esperar un momento para que el backend se inicie
sleep 3

# Iniciar frontend en segundo plano
echo "🎨 Iniciando Frontend..."
./start-frontend.sh &
FRONTEND_PID=$!

echo ""
echo "🎉 ¡Servicios iniciados!"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "📊 Para ver logs del backend: tail -f backend/logs/app.log"
echo "📊 Para ver logs del frontend: tail -f frontend/logs/app.log"
echo ""

# Esperar a que ambos procesos terminen
wait $BACKEND_PID $FRONTEND_PID 