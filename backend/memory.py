from typing import List, Dict

# Memoria simbólica por sesión (en memoria)
symbolic_memory: List[Dict[str, str]] = []

def add_to_memory(role: str, content: str):
    """Agrega un mensaje a la memoria simbólica"""
    symbolic_memory.append({"role": role, "content": content})
    # Limitar a los últimos 20 intercambios (10 mensajes de usuario + 10 respuestas)
    if len(symbolic_memory) > 40:
        symbolic_memory.pop(0)

def get_memory() -> List[Dict[str, str]]:
    """Obtiene una copia del historial de conversación"""
    return symbolic_memory.copy()

def clear_memory():
    """Limpia la memoria simbólica (para nueva sesión)"""
    symbolic_memory.clear()