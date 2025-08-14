import os
import aiohttp
from dotenv import load_dotenv
import markdown2

load_dotenv()

DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

import os
from pathlib import Path

async def get_orakh_response(messages: list) -> str:
    """
    Get Orakh's response using DeepSeek API with the specific prompt style
    """
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Cargar prompt maestro desde archivo
    prompt_path = Path(__file__).parent / "prompts" / "maestro_prompt.txt"
    with open(prompt_path, 'r', encoding='utf-8') as f:
        system_prompt = f.read()
    
    # Construir lista de mensajes incluyendo el prompt del sistema
    messages_list = [
        {
            "role": "system",
            "content": system_prompt
        }
    ]
    
    # Agregar los mensajes de contexto y el actual
    messages_list.extend(messages)
    
    payload = {
        "model": "deepseek-chat",
        "messages": messages_list,
        "temperature": 0.7,
        "max_tokens": 1500
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(DEEPSEEK_API_URL, json=payload, headers=headers) as resp:
            if resp.status != 200:
                error = await resp.text()
                raise Exception(f"DeepSeek API error: {error}")
            
            response = await resp.json()
            markdown_content = response["choices"][0]["message"]["content"]
            
            # Clean ORAKH name if repeated unnecessarily
            cleaned_content = clean_orakh_name(markdown_content)
            
            # Convert markdown to HTML with extra features enabled
            html_content = markdown2.markdown(
                cleaned_content,
                extras=["fenced-code-blocks", "tables", "break-on-newline"]
            )
            return html_content

def clean_orakh_name(response: str) -> str:
    """Remove unnecessary ORAKH VOX NEMIS name repetitions"""
    lines = response.strip().split("\n")
    # Elimina la línea si empieza con "ORAKH VOX NEMIS"
    if lines and lines[0].strip().startswith("ORAKH VOX NEMIS"):
        return "\n".join(lines[1:]).strip()
    return response.strip()