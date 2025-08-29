from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
import base64
import os
from PIL import Image
import io

router = APIRouter(prefix="/api/ai", tags=["ai"])

class ExamAnalysisRequest(BaseModel):
    image: str  # Base64 de la imagen
    prompt: Optional[str] = None

class ExamAnalysisResponse(BaseModel):
    analysis: str
    success: bool
    message: str

@router.post("/analyze-exam", response_model=ExamAnalysisResponse)
async def analyze_exam(request: ExamAnalysisRequest):
    """
    Analiza un examen médico usando IA
    """
    try:
        # Validar que se proporcionó una imagen
        if not request.image:
            raise HTTPException(status_code=400, detail="No se proporcionó una imagen")

        # Por ahora, simulamos el análisis
        # En una implementación real, aquí iría la llamada a Groq o similar
        
        # Simular procesamiento
        analysis_result = """
        **Análisis Simulado del Examen Médico**

        He analizado la imagen de tu examen médico. Aquí tienes una explicación clara y comprensible:

        **Resultados Principales:**
        - Los valores están dentro del rango normal
        - No se detectaron anomalías significativas
        - El examen muestra un estado de salud general bueno

        **Recomendaciones:**
        - Continuar con los hábitos saludables actuales
        - Programar el próximo control médico según lo indicado
        - Mantener una dieta equilibrada y ejercicio regular

        **Nota Importante:**
        Este es un análisis simulado. Siempre consulta con un profesional de la salud para una interpretación médica completa y precisa.
        """

        return ExamAnalysisResponse(
            analysis=analysis_result,
            success=True,
            message="Análisis completado exitosamente"
        )

    except Exception as e:
        print(f"Error en análisis de examen: {str(e)}")
        return ExamAnalysisResponse(
            analysis="",
            success=False,
            message=f"Error al analizar el examen: {str(e)}"
        )

@router.post("/upload-exam")
async def upload_exam_file(file: UploadFile = File(...)):
    """
    Endpoint para subir archivos de examen con soporte para archivos grandes
    """
    try:
        # Validar tipo de archivo
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400, 
                detail="Solo se permiten archivos de imagen"
            )

        # Validar tamaño del archivo (máximo 50MB)
        max_size = 50 * 1024 * 1024  # 50MB
        file_content = await file.read()
        
        if len(file_content) > max_size:
            raise HTTPException(
                status_code=413,
                detail=f"El archivo es demasiado grande. Máximo permitido: 50MB"
            )

        # Convertir a base64
        image_base64 = base64.b64encode(file_content).decode('utf-8')

        # Simular análisis
        analysis_result = f"""
        **Análisis del Archivo: {file.filename}**

        **Información del Archivo:**
        - Nombre: {file.filename}
        - Tipo: {file.content_type}
        - Tamaño: {len(file_content) / 1024 / 1024:.2f} MB

        **Análisis Simulado:**
        He procesado tu imagen de examen médico. Los resultados indican valores normales en general.

        **Recomendaciones:**
        - Consulta con tu médico para una interpretación profesional
        - Mantén tus controles médicos regulares
        - Continúa con un estilo de vida saludable

        **Nota:** Este es un análisis simulado. Para resultados médicos precisos, consulta siempre con un profesional de la salud.
        """

        return ExamAnalysisResponse(
            analysis=analysis_result,
            success=True,
            message="Archivo procesado exitosamente"
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error en subida de archivo: {str(e)}")
        return ExamAnalysisResponse(
            analysis="",
            success=False,
            message=f"Error al procesar el archivo: {str(e)}"
        )

@router.get("/health")
async def ai_health_check():
    """
    Verificar el estado del servicio de IA
    """
    return {
        "status": "healthy",
        "service": "AI Analysis Service",
        "max_file_size": "50MB",
        "supported_formats": ["jpg", "jpeg", "png", "gif", "bmp"]
    } 