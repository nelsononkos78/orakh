import os
import aiohttp
from dotenv import load_dotenv
import markdown2
from pathlib import Path

load_dotenv()

# Configuración del proveedor de IA
IA_PROVIDER = os.getenv("IA_PROVIDER", "DEEPSEEK").upper()

# URLs de las APIs
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"
ATLAS_API_URL = "https://api.atlascloud.ai/v1/chat/completions"

# API Keys
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
ATLASCLOUD_API_KEY = os.getenv("ATLASCLOUD_API_KEY")
ATLASCLOUD_MODEL = os.getenv("ATLASCLOUD_MODEL", "deepseek-ai/DeepSeek-V3-0324")

# Determinar qué proveedor usar
if IA_PROVIDER == "ATLAS":
    API_URL = ATLAS_API_URL
    API_KEY = ATLASCLOUD_API_KEY
    MODEL = ATLASCLOUD_MODEL
    PROVIDER_NAME = "Atlas"
else:
    API_URL = DEEPSEEK_API_URL
    API_KEY = DEEPSEEK_API_KEY
    MODEL = DEEPSEEK_MODEL
    PROVIDER_NAME = "DeepSeek"

async def get_orakh_response(messages: list) -> str:
    """
    Get Orakh's response using the configured AI provider (DeepSeek or Atlas)
    """
    # Validar que la API key esté configurada
    invalid_keys = ["your_deepseek_api_key_here", "your_atlas_api_key_here"]
    if not API_KEY or API_KEY in invalid_keys:
        raise Exception(f"{PROVIDER_NAME} API key no está configurada. Por favor configura {'ATLASCLOUD_API_KEY' if IA_PROVIDER == 'ATLAS' else 'DEEPSEEK_API_KEY'} en el archivo .env")
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
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
        "model": MODEL,
        "messages": messages_list,
        "temperature": 0.7,
        "max_tokens": 1500
    }

    try:
        print(f"[DEBUG] Usando proveedor: {PROVIDER_NAME}")
        print(f"[DEBUG] URL: {API_URL}")
        print(f"[DEBUG] Modelo: {MODEL}")
        print(f"[DEBUG] Número de mensajes: {len(messages_list)}")
        
        async with aiohttp.ClientSession() as session:
            async with session.post(API_URL, json=payload, headers=headers) as resp:
                if resp.status != 200:
                    error_text = await resp.text()
                    print(f"[ERROR] {PROVIDER_NAME} API error ({resp.status}): {error_text}")
                    raise Exception(f"{PROVIDER_NAME} API error ({resp.status}): {error_text}")
                
                response = await resp.json()
                print(f"[DEBUG] Respuesta recibida, keys: {list(response.keys())}")
                
                # Validar estructura de respuesta
                if "choices" not in response:
                    print(f"[ERROR] Respuesta completa: {response}")
                    raise Exception(f"{PROVIDER_NAME} API response format error: 'choices' not found. Response: {response}")
                
                if not response["choices"] or len(response["choices"]) == 0:
                    print(f"[ERROR] Respuesta completa: {response}")
                    raise Exception(f"{PROVIDER_NAME} API response format error: 'choices' array is empty. Response: {response}")
                
                if "message" not in response["choices"][0]:
                    print(f"[ERROR] Choice[0] keys: {list(response['choices'][0].keys())}")
                    raise Exception(f"{PROVIDER_NAME} API response format error: 'message' not found in choice. Response: {response}")
                
                if "content" not in response["choices"][0]["message"]:
                    print(f"[ERROR] Message keys: {list(response['choices'][0]['message'].keys())}")
                    raise Exception(f"{PROVIDER_NAME} API response format error: 'content' not found in message. Response: {response}")
                
                markdown_content = response["choices"][0]["message"]["content"]
                print(f"[DEBUG] Contenido extraído exitosamente, longitud: {len(markdown_content)}")
                
                # Clean ORAKH name if repeated unnecessarily
                cleaned_content = clean_orakh_name(markdown_content)
                
                # Convert markdown to HTML with extra features enabled
                html_content = markdown2.markdown(
                    cleaned_content,
                    extras=["fenced-code-blocks", "tables", "break-on-newline"]
                )
                return html_content
    except aiohttp.ClientError as e:
        raise Exception(f"{PROVIDER_NAME} API connection error: {str(e)}")
    except Exception as e:
        raise Exception(f"{PROVIDER_NAME} API error: {str(e)}")

def clean_orakh_name(response: str) -> str:
    """Remove unnecessary ORAKH VOX NEMIS name repetitions"""
    lines = response.strip().split("\n")
    # Elimina la línea si empieza con "ORAKH VOX NEMIS"
    if lines and lines[0].strip().startswith("ORAKH VOX NEMIS"):
        return "\n".join(lines[1:]).strip()
    return response.strip()