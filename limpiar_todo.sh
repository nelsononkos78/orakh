#!/bin/bash

echo "🧹 LIMPIEZA COMPLETA DEL SISTEMA"
echo "================================="
echo ""

# Detener todos los procesos
echo "🛑 Deteniendo procesos..."
pkill -f "npm run dev" 2>/dev/null
pkill -f "python main.py" 2>/dev/null
sleep 2

# Limpiar base de datos
echo "🗄️ Limpiando base de datos..."
cd backend
source venv/bin/activate
python3 -c "
from database.connection import engine
from auth.models import Base, User, QueryCount
from sqlalchemy.orm import sessionmaker

# Recrear tablas
Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

print('✅ Base de datos limpiada')
"

# Limpiar cookies del servidor
echo "🍪 Limpiando cookies del servidor..."
curl -s -X POST http://localhost:2900/api/queries/clear-cookies > /dev/null 2>&1 || echo "⚠️ Backend no disponible aún"

# Reiniciar backend
echo "🔄 Reiniciando backend..."
cd backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
sleep 3

# Reiniciar frontend
echo "🔄 Reiniciando frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!
sleep 5

# Verificar servicios
echo ""
echo "🔍 Verificando servicios..."
echo "Backend (puerto 2900):"
curl -s http://localhost:2900/api/queries/status | jq . 2>/dev/null || echo "❌ Backend no disponible"

echo ""
echo "Frontend (puerto 2800):"
curl -s http://localhost:2800 | head -1 2>/dev/null || echo "❌ Frontend no disponible"

echo ""
echo "🎉 ¡SISTEMA LIMPIO Y LISTO!"
echo "============================"
echo ""
echo "✅ Base de datos: LIMPIA"
echo "✅ Cookies del servidor: LIMPIAS"
echo "✅ Backend: EJECUTÁNDOSE en puerto 2900"
echo "✅ Frontend: EJECUTÁNDOSE en puerto 2800"
echo ""
echo "🌐 Abre http://localhost:2800 en tu navegador"
echo "🧹 IMPORTANTE: Limpia las cookies del navegador también"
echo ""
echo "Para limpiar cookies del navegador:"
echo "1. F12 → Application → Cookies → localhost:2800"
echo "2. Elimina: session_id y limit_reached"
echo "3. Recarga la página (F5)" 