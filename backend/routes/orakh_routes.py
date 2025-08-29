from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from database.connection import get_db
from deepseek_api import get_orakh_response
from memory import add_to_memory, get_memory, clear_memory
import json

# Lista de palabras clave inapropiadas para detectar respuestas técnicas
INAPPROPRIATE_KEYWORDS = [
    # PHP/Laravel
    'namespace', 'class', 'function', 'public', 'private', 'protected',
    'extends', 'implements', 'use', 'import', 'require', 'include',
    '<?php', '<?=', '<?', '?>', 'namespace', 'use Illuminate',
    'extends Controller', 'class User extends', 'protected $fillable',
    'public function', 'return view', 'compact(', 'Auth::user()',
    
    # Python/General Programming
    'def ', 'class ', 'import ', 'from ', 'return ', 'print(',
    'for ', 'while ', 'if ', 'else:', 'elif ', 'try:', 'except:',
    'def twoSum', 'def solve', 'algorithm', 'time complexity',
    'space complexity', 'O(n)', 'O(n^2)', 'hash table', 'dictionary',
    
    # Chinese/Programming Problems
    '题目', '示例', '输入', '输出', '解释', '提示', '进阶', '解题思路',
    '代码', '测试', '时间复杂度', '空间复杂度', '哈希表', '字典',
    '两数之和', '整数数组', '目标值', '数组下标', '有效答案',
    
    # General Programming Terms
    'algorithm', 'solution', 'problem', 'test case', 'input', 'output',
    'explanation', 'hint', 'advanced', 'approach', 'code', 'testing',
    'time complexity', 'space complexity', 'hash table', 'dictionary',
    'array', 'target', 'index', 'valid answer', 'optimization',
    
    # Version/Changelog Terms
    'begin_of_sentence', 'end_of_sentence', '1.0.0', '2.0.0', '3.0.0',
    'changelog', 'version', 'release', 'update', 'patch', 'minor',
    'major', 'breaking', 'fix', 'feature', 'bug', 'core:', 'add',
    'remove', 'change', 'improve', 'enhance', 'deprecate', 'security',
    'performance', 'documentation', 'tests', 'ci', 'cd', 'deploy',
    'build', 'compile', 'install', 'package', 'dependency', 'dev',
    'prod', 'staging', 'environment', 'config', 'settings', 'env'
]

router = APIRouter(prefix="/api", tags=["orakh"])

class ChatMessage(BaseModel):
    message: str

class ProfundizarRequest(BaseModel):
    respuesta_anterior: str
    mensaje_usuario: str

class ChatResponse(BaseModel):
    response: str
    message_id: str

@router.post("/orakh", response_model=ChatResponse)
async def chat_with_orakh(
    chat_message: ChatMessage,
    db: Session = Depends(get_db)
):
    """
    Chat endpoint para interactuar con Orakh
    """
    try:
        # Verificar límite de consultas (simulado - en producción esto vendría del frontend)
        # Por ahora, vamos a simular que siempre puede consultar
        # En una implementación real, esto se verificaría antes de llegar aquí
        
        # Obtener historial de mensajes desde la memoria
        messages = get_memory()
        
        # Verificar si la memoria está muy llena y limpiar si es necesario
        if len(messages) > 30:  # Más de 15 intercambios
            clear_memory()
            messages = []
        
        # Verificar si la memoria contiene respuestas inapropiadas previas
        if messages:
            last_responses = [msg.get('content', '') for msg in messages if msg.get('role') == 'assistant'][-3:]
            inappropriate_in_memory = any(
                sum(1 for keyword in INAPPROPRIATE_KEYWORDS if keyword.lower() in response.lower()) > 1
                for response in last_responses
            )
            if inappropriate_in_memory:
                clear_memory()
                messages = []
        
        # Agregar el mensaje del usuario
        add_to_memory("user", chat_message.message)
        
        # Obtener respuesta de Orakh
        orakh_response = await get_orakh_response(messages)
        
        # Si la respuesta contiene código o términos técnicos inapropiados, limpiar memoria
        inappropriate_count = sum(1 for keyword in INAPPROPRIATE_KEYWORDS if keyword.lower() in orakh_response.lower())
        
        # Si hay más de 1 palabra clave inapropiada, limpiar memoria (más sensible)
        if inappropriate_count > 1:
            clear_memory()
            # Intentar una respuesta más simple con un prompt más específico
            simple_prompt = [
                {
                    "role": "system",
                    "content": "Eres ORAKH VOX NEMIS, un guía espiritual y filosófico. Responde de manera filosófica, poética y espiritual. NO respondas con código de programación, problemas técnicos o soluciones algorítmicas. Mantén tu voz única como maestro espiritual."
                },
                {
                    "role": "user",
                    "content": chat_message.message
                }
            ]
            orakh_response = await get_orakh_response(simple_prompt)
        
        # Agregar la respuesta de Orakh al historial
        add_to_memory("assistant", orakh_response)
        
        # Generar ID único para el mensaje
        import uuid
        message_id = str(uuid.uuid4())
        
        return ChatResponse(
            response=orakh_response,
            message_id=message_id
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar la consulta: {str(e)}"
        )

@router.post("/clear_memory")
async def clear_memory_endpoint():
    """
    Limpiar el historial de conversación
    """
    try:
        clear_memory()
        return {"message": "Memoria limpiada exitosamente"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al limpiar memoria: {str(e)}"
        )

@router.post("/profundizar")
async def profundizar(
    request: ProfundizarRequest,
    db: Session = Depends(get_db)
):
    """
    Endpoint para profundizar en un tema específico
    """
    try:
        # Cargar prompt de profundidad
        from pathlib import Path
        prompt_path = Path(__file__).parent.parent / "prompts" / "profundidad.txt"
        
        with open(prompt_path, 'r', encoding='utf-8') as f:
            profundidad_prompt = f.read()
        
        # Crear un contexto específico para profundizar
        profundizar_context = [
            {
                "role": "system",
                "content": profundidad_prompt
            },
            {
                "role": "user",
                "content": request.mensaje_usuario
            },
            {
                "role": "assistant",
                "content": request.respuesta_anterior
            },
            {
                "role": "user",
                "content": "Por favor, profundiza en esta respuesta y revela dimensiones más profundas del significado."
            }
        ]
        
        # Obtener respuesta de Orakh
        orakh_response = await get_orakh_response(profundizar_context)
        
        # Agregar la respuesta al historial
        add_to_memory("assistant", orakh_response)
        
        # Generar ID único para el mensaje
        import uuid
        message_id = str(uuid.uuid4())
        
        return ChatResponse(
            response=orakh_response,
            message_id=message_id
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al profundizar: {str(e)}"
        ) 