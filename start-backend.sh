#!/bin/bash

echo "🚀 Iniciando Backend de Orakh..."

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 no está instalado. Por favor instala Python 3.12 o superior."
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

cd backend

# Verificar si existe el entorno virtual
if [ ! -d "venv" ]; then
    echo "🔧 Creando entorno virtual..."
    python3 -m venv venv
fi

# Activar entorno virtual
echo "🔧 Activando entorno virtual..."
source venv/bin/activate

# Instalar dependencias
echo "📦 Instalando dependencias..."
pip install -r requirements.txt

# Cargar variables de entorno
export $(cat ../.env | xargs)

echo "✅ Configuración verificada"
echo "🌐 Iniciando servidor en http://localhost:8000"

# Iniciar el servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000 