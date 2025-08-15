from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import os
from deepseek_api import get_orakh_response
from memory import add_to_memory, get_memory, clear_memory

app = FastAPI()

def cargar_prompt(nombre_archivo: str) -> str:
    path = Path(__file__).parent / "prompts" / nombre_archivo
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

# CORS configuration
ALLOWED_ORIGINS = [os.getenv("FRONTEND_URL", "*")]  
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/health")
async def health(): # health check endpoint to check if the server is running 
    return {"status": "ok"}

class UserMessage(BaseModel):
    message: str

class ProfundizarRequest(BaseModel):
    respuesta_anterior: str
    mensaje_usuario: str

@app.post("/api/orakh")
async def get_orakh_response_endpoint(user_message: UserMessage):
    # Guarda el mensaje del usuario
    add_to_memory("user", user_message.message)

    # Obtiene todo el historial de conversación
    full_messages = get_memory()
    
    # Llama al modelo con todo el historial
    response = await get_orakh_response(full_messages)

    # Guarda la respuesta también
    add_to_memory("assistant", response)

    return {"response": response}

@app.post("/api/clear_memory")
async def clear_memory_endpoint():
    """Endpoint para limpiar la memoria de conversación"""
    clear_memory()
    return {"status": "Memory cleared"}

@app.post("/api/profundizar")
async def profundizar(data: ProfundizarRequest):
    # Cargar prompt de profundidad
    prompt = cargar_prompt("profundidad.txt")
    prompt = prompt.replace("{respuesta_anterior}", data.respuesta_anterior)
    prompt = prompt.replace("{mensaje_usuario}", data.mensaje_usuario or "")
    
    # Obtener respuesta usando el prompt modificado
    response = await get_orakh_response([{"role": "user", "content": prompt}])
    
    # Guardar en memoria
    add_to_memory("assistant", response)
    
    return {"response": response}