# 🚀 Despliegue Local de Orakh (Sin Docker)

Este documento contiene las instrucciones para ejecutar Orakh localmente sin usar Docker.

## 📋 Prerrequisitos

- **Python 3.12** o superior
- **Node.js 18** o superior
- **npm** (incluido con Node.js)
- **API Key de DeepSeek**

## 🔧 Instalación y Configuración

### 1. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp env.example .env

# Editar el archivo .env y agregar tu API key
nano .env
```

Agregar tu API key de DeepSeek:
```env
DEEPSEEK_API_KEY=tu_api_key_aqui
```

### 2. Verificar Dependencias

#### Python
```bash
python3 --version  # Debe ser 3.12 o superior
```

#### Node.js
```bash
node --version    # Debe ser 18 o superior
npm --version     # Debe estar instalado
```

## 🚀 Iniciar Servicios

### Opción 1: Scripts Automatizados (Recomendado)

#### Iniciar ambos servicios con un comando:
```bash
./start-local.sh
```

#### Iniciar servicios por separado:

**Terminal 1 - Backend:**
```bash
./start-backend.sh
```

**Terminal 2 - Frontend:**
```bash
./start-frontend.sh
```

### Opción 2: Manual

#### Backend (Terminal 1)
```bash
cd backend

# Crear entorno virtual
python3 -m venv venv

# Activar entorno virtual
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Cargar variables de entorno
export $(cat ../.env | xargs)

# Iniciar servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend (Terminal 2)
```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev -- --port 3010
```

## 🌐 Acceso a la Aplicación

Una vez que ambos servicios estén ejecutándose:

- **Frontend**: http://localhost:3010
- **Backend API**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs

## 🔍 Verificar Funcionamiento

### Backend
```bash
curl http://localhost:8000/docs
```

### Frontend
```bash
curl http://localhost:3010
```

## 🛑 Detener Servicios

### Si usaste los scripts automatizados:
Presiona `Ctrl+C` en cada terminal donde estén ejecutándose los servicios.

### Si usaste el script start-local.sh:
Presiona `Ctrl+C` una vez para detener ambos servicios.

## 🚨 Solución de Problemas

### Error: Puerto ocupado
Si los puertos 8000 o 3010 están ocupados:

```bash
# Ver qué está usando el puerto
sudo lsof -i :8000
sudo lsof -i :3010

# O cambiar los puertos en los scripts
```

### Error: DEEPSEEK_API_KEY no configurada
```bash
# Verificar que el archivo .env existe y tiene la API key
cat .env

# Si no existe, crearlo
cp env.example .env
# Editar .env y agregar tu API key
```

### Error: Módulos Python no encontrados
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### Error: Módulos Node.js no encontrados
```bash
cd frontend
npm install
```

## 📊 Logs y Monitoreo

### Backend
Los logs aparecen directamente en la terminal donde ejecutaste el backend.

### Frontend
Los logs aparecen directamente en la terminal donde ejecutaste el frontend.

### Verificar estado de servicios
```bash
# Verificar si los puertos están en uso
netstat -tulpn | grep :8000
netstat -tulpn | grep :3010
```

## 🔄 Reiniciar Servicios

### Backend
1. Presiona `Ctrl+C` en la terminal del backend
2. Ejecuta `./start-backend.sh` nuevamente

### Frontend
1. Presiona `Ctrl+C` en la terminal del frontend
2. Ejecuta `./start-frontend.sh` nuevamente

## 📝 Notas Importantes

- El backend usa **puerto 8000**
- El frontend usa **puerto 3010**
- El frontend hace proxy de `/api/*` al backend en `localhost:8000`
- Los cambios en el código se recargan automáticamente (modo desarrollo)
- La memoria de conversación se mantiene en memoria (se pierde al reiniciar)

---

**¡Listo!** Tu aplicación Orakh debería estar funcionando en http://localhost:3010 🌊🔥🌿✨ 