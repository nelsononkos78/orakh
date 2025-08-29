from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session
from database.connection import get_db
from services.query_service import QueryService
from auth.routes import get_current_user_optional
from typing import Optional
from auth.models import User
from pydantic import BaseModel

router = APIRouter(prefix="/api/queries", tags=["queries"])

class QueryRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class QueryResponse(BaseModel):
    can_query: bool
    remaining: int
    limit: int
    used: int
    requires_registration: bool
    message: Optional[str] = None

@router.get("/status", response_model=QueryResponse)
async def get_query_status(
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    """Obtiene el estado de las consultas del usuario"""
    session_id = request.cookies.get("session_id")
    limit_reached = request.cookies.get("limit_reached")
    
    # Si ya alcanzó el límite permanentemente, forzar registro
    if limit_reached == "true":
        return QueryResponse(
            can_query=False,
            remaining=0,
            limit=QueryService.ANONYMOUS_LIMIT,
            used=QueryService.ANONYMOUS_LIMIT,
            requires_registration=True,
            message="Límite permanente alcanzado. Regístrate para continuar."
        )
    
    # Verificación adicional en base de datos (más seguro)
    if session_id and QueryService.has_session_reached_limit(db, session_id):
        # Establecer cookie permanente si no está ya establecida
        if not limit_reached:
            response.set_cookie(
                key="limit_reached",
                value="true",
                max_age=31536000,  # 1 año (permanente)
                httponly=True,
                samesite="lax"
            )
        return QueryResponse(
            can_query=False,
            remaining=0,
            limit=QueryService.ANONYMOUS_LIMIT,
            used=QueryService.ANONYMOUS_LIMIT,
            requires_registration=True,
            message="Límite alcanzado en base de datos. Regístrate para continuar."
        )
    
    # Usuario anónimo por defecto
    if not session_id:
        session_id = QueryService.generate_session_id()
        # Establecer la cookie
        response.set_cookie(
            key="session_id",
            value=session_id,
            max_age=86400,  # 24 horas
            httponly=True,
            samesite="lax"
        )
    
    status = QueryService.can_make_query(db, session_id=session_id)
    
    # Si alcanzó el límite, establecer cookie permanente
    if status["requires_registration"]:
        response.set_cookie(
            key="limit_reached",
            value="true",
            max_age=31536000,  # 1 año (permanente)
            httponly=True,
            samesite="lax"
        )
    
    return QueryResponse(
        can_query=status["can_query"],
        remaining=status["remaining"],
        limit=status["limit"],
        used=status["used"],
        requires_registration=status["requires_registration"],
        message=f"Session ID: {session_id[:8]}..."
    )

@router.post("/record")
async def record_query(
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    """Registra una nueva consulta"""
    session_id = request.cookies.get("session_id")
    limit_reached = request.cookies.get("limit_reached")
    
    # Si ya alcanzó el límite permanentemente, forzar registro
    if limit_reached == "true":
        raise HTTPException(
            status_code=429, 
            detail="Has alcanzado el límite permanente de consultas gratuitas. Regístrate para continuar."
        )
    
    # Verificación adicional en base de datos (más seguro)
    if session_id and QueryService.has_session_reached_limit(db, session_id):
        # Establecer cookie permanente si no está ya establecida
        if not limit_reached:
            response.set_cookie(
                key="limit_reached",
                value="true",
                max_age=31536000,  # 1 año (permanente)
                httponly=True,
                samesite="lax"
            )
        raise HTTPException(
            status_code=429, 
            detail="Límite alcanzado en base de datos. Regístrate para continuar."
        )
    
    # Usuario anónimo por defecto
    if not session_id:
        session_id = QueryService.generate_session_id()
        # Establecer la cookie
        response.set_cookie(
            key="session_id",
            value=session_id,
            max_age=86400,  # 24 horas
            httponly=True,
            samesite="lax"
        )
    
    status = QueryService.can_make_query(db, session_id=session_id)
    if not status["can_query"]:
        # Establecer cookie permanente cuando alcanza el límite
        response.set_cookie(
            key="limit_reached",
            value="true",
            max_age=31536000,  # 1 año (permanente)
            httponly=True,
            samesite="lax"
        )
        raise HTTPException(
            status_code=429, 
            detail=f"Has alcanzado el límite de {QueryService.ANONYMOUS_LIMIT} consultas gratuitas. Regístrate para continuar."
        )
    
    QueryService.record_query(db, session_id=session_id)
    
    # Obtener el estado actualizado después de registrar la consulta
    updated_status = QueryService.can_make_query(db, session_id=session_id)
    
    # Si después de registrar alcanza el límite, establecer cookie permanente
    if updated_status["requires_registration"]:
        response.set_cookie(
            key="limit_reached",
            value="true",
            max_age=31536000,  # 1 año (permanente)
            httponly=True,
            samesite="lax"
        )
    
    return {
        "message": "Consulta registrada exitosamente",
        "remaining": updated_status["remaining"],
        "used": updated_status["used"],
        "requires_registration": updated_status["requires_registration"]
    }

@router.get("/session-id")
async def get_session_id():
    """Genera un nuevo session_id para usuarios anónimos"""
    session_id = QueryService.generate_session_id()
    return {"session_id": session_id}

@router.post("/reset-limit")
async def reset_limit(response: Response):
    """Resetea el límite permanente (solo para testing)"""
    response.delete_cookie("limit_reached")
    return {"message": "Límite permanente reseteado"}

@router.post("/clear-cookies")
async def clear_cookies(response: Response):
    """Limpia todas las cookies relacionadas con consultas"""
    response.delete_cookie("session_id")
    response.delete_cookie("limit_reached")
    return {"message": "Cookies limpiadas exitosamente"} 