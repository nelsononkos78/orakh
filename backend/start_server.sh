#!/bin/bash
# Script para iniciar el servidor backend con manejo de puertos

echo "🚀 Iniciando servidor backend..."

# Activar entorno virtual
source venv/bin/activate

# Función para encontrar puerto disponible
find_free_port() {
    local port=8000
    while lsof -i :$port > /dev/null 2>&1; do
        port=$((port + 1))
    done
    echo $port
}

# Encontrar puerto disponible
PORT=$(find_free_port)
echo "📡 Usando puerto: $PORT"

# Terminar procesos existentes en puerto 8000 si existen
if lsof -i :8000 > /dev/null 2>&1; then
    echo "⚠️  Terminando procesos existentes en puerto 8000..."
    pkill -f "uvicorn.*main:app" 2>/dev/null || true
    sleep 2
fi

# Iniciar servidor
echo "✅ Iniciando servidor en puerto $PORT..."
echo "🌐 Accede a: http://localhost:$PORT"
echo "📚 Documentación: http://localhost:$PORT/docs"
echo ""
echo "Para detener el servidor: Ctrl+C"

uvicorn main:app --reload --port $PORT --host 0.0.0.0
