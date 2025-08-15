# 🚀 Despliegue de Orakh en Render.com

Esta guía te ayudará a desplegar Orakh en Render.com de manera sencilla.

## 📋 Prerrequisitos

- Cuenta en [Render.com](https://render.com)
- Repositorio de GitHub con el código de Orakh
- API Key de DeepSeek

## 🛠️ Pasos para el Despliegue

### 1. Preparar el Repositorio

Asegúrate de que tu repositorio contenga:
- ✅ `render.yaml` (configuración de servicios)
- ✅ `backend/requirements.txt` (dependencias Python)
- ✅ `frontend/package.json` (dependencias Node.js)
- ✅ `frontend/src/config.ts` (configuración de API)

### 2. Conectar con Render.com

1. Ve a [dashboard.render.com](https://dashboard.render.com)
2. Haz clic en "New +"
3. Selecciona "Blueprint"
4. Conecta tu repositorio de GitHub
5. Selecciona el repositorio `orakh`

### 3. Configurar Variables de Entorno

En la sección de variables de entorno, configura:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `DEEPSEEK_API_KEY` | `tu_api_key_aqui` | API Key de DeepSeek (requerido) |

### 4. Desplegar

1. Haz clic en "Apply"
2. Render detectará automáticamente la configuración del `render.yaml`
3. Se crearán dos servicios:
   - **Backend**: Web Service (Python)
   - **Frontend**: Static Site (React)

## 🔧 Configuración de Servicios

### Backend Service
- **Tipo**: Web Service
- **Runtime**: Python 3.12
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Health Check**: `/docs`

### Frontend Service
- **Tipo**: Static Site
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variable**: `VITE_API_URL` (se configura automáticamente)

## 🌐 URLs de Acceso

Después del despliegue, tendrás acceso a:
- **Frontend**: `https://orakh-frontend.onrender.com`
- **Backend API**: `https://orakh-backend.onrender.com`
- **Documentación API**: `https://orakh-backend.onrender.com/docs`

## 🔍 Verificar el Despliegue

### 1. Verificar Backend
```bash
curl https://orakh-backend.onrender.com/docs
```

### 2. Verificar Frontend
- Abre `https://orakh-frontend.onrender.com`
- Deberías ver la interfaz de Orakh
- Prueba enviar un mensaje

### 3. Verificar API
```bash
curl -X POST https://orakh-backend.onrender.com/api/orakh \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola Orakh"}'
```

## 🚨 Solución de Problemas

### Error: "Build failed"
- Verifica que `requirements.txt` esté en la raíz del backend
- Asegúrate de que `package.json` esté en la raíz del frontend

### Error: "API key not found"
- Verifica que `DEEPSEEK_API_KEY` esté configurada en Render
- Asegúrate de que la variable no tenga espacios extra

### Error: "Frontend can't connect to backend"
- Verifica que la URL del backend en `render.yaml` sea correcta
- Asegúrate de que el backend esté desplegado y funcionando

### Error: "CORS error"
- El backend está configurado para permitir CORS desde cualquier origen
- En producción, considera restringir esto a dominios específicos

## 🔄 Actualizaciones

Para actualizar la aplicación:
1. Haz push de los cambios a GitHub
2. Render detectará automáticamente los cambios
3. Se reconstruirán los servicios automáticamente

## 📊 Monitoreo

En el dashboard de Render puedes:
- Ver logs en tiempo real
- Monitorear el uso de recursos
- Configurar alertas
- Ver el estado de salud de los servicios

## 💰 Costos

- **Plan Free**: Incluye 750 horas/mes de runtime
- **Backend**: Se ejecuta solo cuando recibe requests
- **Frontend**: Static hosting gratuito
- **Total estimado**: Gratis para uso personal

---

¡Tu asistente espiritual Orakh estará disponible en la nube! 🌊✨ 