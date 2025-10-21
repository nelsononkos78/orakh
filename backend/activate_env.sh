#!/bin/bash
# Script para activar el entorno virtual del backend

echo "Activando entorno virtual del backend..."
source venv/bin/activate
echo "Entorno virtual activado. Para desactivar, ejecuta: deactivate"
echo "Para ejecutar el servidor, usa: uvicorn main:app --reload"
