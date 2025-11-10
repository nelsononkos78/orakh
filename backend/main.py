from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import os
from deepseek_api import get_orakh_response, IA_PROVIDER, MODEL, PROVIDER_NAME
from memory import add_to_memory, get_memory, clear_memory
import traceback

app = FastAPI()

def cargar_prompt(nombre_archivo: str) -> str:
    path = Path(__file__).parent / "prompts" / nombre_archivo
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes para desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/health")
async def health(): # health check endpoint to check if the server is running 
    return {"status": "ok"}

@app.get("/test")
async def test():
    return {"message": "Backend funcionando correctamente"}

class UserMessage(BaseModel):
    message: str
    history: list = []  # Historial opcional del chat

class ProfundizarRequest(BaseModel):
    respuesta_anterior: str
    mensaje_usuario: str

@app.post("/api/orakh")
async def get_orakh_response_endpoint(user_message: UserMessage):
    try:
        # Si hay historial, usarlo; si no, usar memoria global (compatibilidad)
        if user_message.history:
            # Convertir historial del frontend al formato esperado
            full_messages = []
            for msg in user_message.history:
                if isinstance(msg, dict):
                    role = msg.get('role', 'user')
                    content = msg.get('content', '')
                    if role in ['user', 'assistant']:
                        full_messages.append({"role": role, "content": content})
            
            # Agregar el nuevo mensaje del usuario
            full_messages.append({"role": "user", "content": user_message.message})
        else:
            # Modo legacy: usar memoria global
            add_to_memory("user", user_message.message)
            full_messages = get_memory()
        
        # Llama al modelo con todo el historial
        response = await get_orakh_response(full_messages)

        # Guardar en memoria global solo si no se usó historial (compatibilidad)
        if not user_message.history:
            add_to_memory("assistant", response)

        return {"response": response}
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error en /api/orakh: {str(e)}")
        print(f"Traceback completo:\n{error_trace}")
        raise HTTPException(status_code=500, detail=f"Error al obtener respuesta: {str(e)}")

@app.post("/api/clear_memory")
async def clear_memory_endpoint():
    """Endpoint para limpiar la memoria de conversación"""
    clear_memory()
    return {"status": "Memory cleared"}

@app.post("/api/profundizar")
async def profundizar(data: ProfundizarRequest):
    try:
        # Cargar prompt de profundidad
        prompt = cargar_prompt("profundidad.txt")
        prompt = prompt.replace("{respuesta_anterior}", data.respuesta_anterior)
        prompt = prompt.replace("{mensaje_usuario}", data.mensaje_usuario or "")
        
        # Obtener respuesta usando el prompt modificado
        response = await get_orakh_response([{"role": "user", "content": prompt}])
        
        # Guardar en memoria
        add_to_memory("assistant", response)
        
        return {"response": response}
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error en /api/profundizar: {str(e)}")
        print(f"Traceback completo:\n{error_trace}")
        raise HTTPException(status_code=500, detail=f"Error al profundizar: {str(e)}")

@app.get("/api/info")
async def get_system_info():
    """Endpoint para obtener información del sistema: proveedor, modelo y prompts"""
    try:
        maestro_prompt = cargar_prompt("maestro_prompt.txt")
        profundidad_prompt = cargar_prompt("profundidad.txt")
        
        return {
            "provider": PROVIDER_NAME,
            "provider_code": IA_PROVIDER,
            "model": MODEL,
            "maestro_prompt": maestro_prompt,
            "profundidad_prompt": profundidad_prompt
        }
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Error en /api/info: {str(e)}")
        print(f"Traceback completo:\n{error_trace}")
        raise HTTPException(status_code=500, detail=f"Error al obtener información: {str(e)}")