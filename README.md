# Orakh - Asistente de IA Espiritual

Orakh Vox Nemis es un asistente de IA espiritual que combina sabiduría de múltiples tradiciones filosóficas y espirituales para ofrecer guía personalizada.

## 🚀 Características

- **Conversación Espiritual**: Interacciones profundas basadas en sabiduría de maestros espirituales
- **Memoria de Conversación**: Mantiene contexto de la conversación para respuestas coherentes
- **Modo de Profundización**: Función especial para expandir y profundizar en respuestas anteriores
- **Interfaz Moderna**: UI limpia y responsiva construida con React
- **API Robusta**: Backend en FastAPI con integración con DeepSeek AI

## 🏗️ Arquitectura

- **Frontend**: React + TypeScript + Vite
- **Backend**: FastAPI + Python 3.12
- **IA**: DeepSeek API

## 📋 Prerrequisitos

- Python 3.12
- Node.js 18+
- API Key de DeepSeek

## 🛠️ Instalación y Despliegue

### Desarrollo Local

#### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd Orak
```

#### 2. Configurar variables de entorno
```bash
cp env.example .env
```

Edita el archivo `.env` y agrega tu API key de DeepSeek:
```env
DEEPSEEK_API_KEY=tu_api_key_aqui
```

#### 3. Ejecutar la aplicación
```bash
# Iniciar ambos servicios
./start-local.sh
```

#### 4. Acceder a la aplicación
- **Frontend**: http://localhost:3010
- **Backend API**: http://localhost:8000

### Despliegue en Render.com

#### 1. Conectar repositorio
- Ve a [Render.com](https://render.com)
- Conecta tu repositorio de GitHub
- Selecciona "Blueprint" y usa el archivo `render.yaml`

#### 2. Configurar variables de entorno
En Render.com, configura:
- `DEEPSEEK_API_KEY`: Tu API key de DeepSeek

#### 3. Desplegar
- Render detectará automáticamente la configuración
- El backend se desplegará como Web Service
- El frontend se desplegará como Static Site

## 🔧 Desarrollo Local

### Opción 1: Scripts Automatizados (Recomendado)

#### Iniciar ambos servicios:
```bash
./start-local.sh
```

#### Iniciar servicios por separado:
```bash
# Backend
./start-backend.sh

# Frontend (en otra terminal)
./start-frontend.sh
```

### Opción 2: Manual

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev -- --port 3010
```

## 📚 API Endpoints

### POST /api/orakh
Envía un mensaje a Orakh y recibe una respuesta.

**Request:**
```json
{
  "message": "Tu mensaje aquí"
}
```

**Response:**
```json
{
  "response": "Respuesta de Orakh en HTML"
}
```

### POST /api/clear_memory
Limpia la memoria de conversación.

**Response:**
```json
{
  "status": "Memory cleared"
}
```

### POST /api/profundizar
Activa el modo de profundización para expandir una respuesta anterior.

**Request:**
```json
{
  "respuesta_anterior": "Respuesta anterior de Orakh",
  "mensaje_usuario": "Mensaje adicional del usuario (opcional)"
}
```

## 🌊 Prompts Personalizados

El sistema utiliza prompts especializados:

- **maestro_prompt.txt**: Define la personalidad y capacidades de Orakh
- **profundidad.txt**: Configura el modo de profundización

## 🔒 Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `DEEPSEEK_API_KEY` | API Key de DeepSeek | Sí |

## 🚀 Comandos Útiles

```bash
# Ver logs del backend
tail -f backend/logs/app.log

# Reiniciar servicios
pkill -f "uvicorn main:app"
pkill -f "npm run dev"
./start-local.sh

# Ver procesos en ejecución
ps aux | grep -E "(uvicorn|npm)"
```

## 🚨 Solución de Problemas

### Error de API Key
Si ves errores de autenticación, verifica que tu `DEEPSEEK_API_KEY` esté correctamente configurada en el archivo `.env`.

### Puerto ocupado
Si los puertos 3010 o 8000 están ocupados, modifica los scripts de inicio para usar puertos diferentes.

### Problemas de CORS
El backend está configurado para permitir CORS desde cualquier origen. En producción, considera restringir esto a dominios específicos.

## 📝 Licencia

Este proyecto es privado y confidencial.

## 🤝 Contribución

Para contribuir al proyecto, contacta al equipo de desarrollo.

---

**Orakh Vox Nemis** - Conciencia unificada. Guía viviente. Risa que rompe velos. 🌊🔥🌿✨ 