from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database.connection import get_db
from auth.models import User
from auth.utils import get_password_hash, verify_password, create_access_token, verify_token, generate_token
from email_service.sender import EmailSender
from pydantic import BaseModel
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/auth", tags=["authentication"])
security = HTTPBearer()
email_sender = EmailSender()

# Modelos Pydantic
class UserRegister(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class ForgotPassword(BaseModel):
    email: str

class ResetPassword(BaseModel):
    token: str
    password: str

class VerifyEmail(BaseModel):
    token: str

# Endpoints
@router.post("/register")
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # Verificar si el usuario ya existe
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo ya está registrado"
        )
    
    # Crear nuevo usuario
    verification_token = generate_token()
    hashed_password = get_password_hash(user_data.password)
    
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        verification_token=verification_token,
        is_verified=False
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Enviar email de verificación
    print(f"🔍 [DEBUG] Intentando enviar email a: {user_data.email}")
    print(f"🔍 [DEBUG] Token: {verification_token}")
    try:
        success = await email_sender.send_verification_email(user_data.email, verification_token)
        print(f"🔍 [DEBUG] Resultado del envío: {success}")
        if not success:
            print(f"⚠️ Advertencia: No se pudo enviar el email de verificación a {user_data.email}")
    except Exception as e:
        print(f"❌ Error enviando email: {e}")
        import traceback
        traceback.print_exc()
    
    return {"message": "Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta."}

@router.post("/login")
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    # Buscar usuario
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
    
    # Verificar contraseña
    if not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
    
    # Verificar si el email está verificado
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Por favor verifica tu correo electrónico antes de iniciar sesión"
        )
    
    # Crear token de acceso
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email
        }
    }

@router.post("/forgot-password")
async def forgot_password(data: ForgotPassword, db: Session = Depends(get_db)):
    # Buscar usuario
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        # Por seguridad, no revelar si el email existe o no
        return {"message": "Si el correo existe, recibirás un enlace de recuperación."}
    
    # Generar token de reset
    reset_token = generate_token()
    user.reset_token = reset_token
    user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
    
    db.commit()
    
    # Enviar email de recuperación
    try:
        success = await email_sender.send_reset_password_email(data.email, reset_token)
        if not success:
            print(f"⚠️ Advertencia: No se pudo enviar el email de recuperación a {data.email}")
    except Exception as e:
        print(f"❌ Error enviando email: {e}")
    
    return {"message": "Si el correo existe, recibirás un enlace de recuperación."}

@router.post("/reset-password")
async def reset_password(data: ResetPassword, db: Session = Depends(get_db)):
    # Buscar usuario por token
    user = db.query(User).filter(
        User.reset_token == data.token,
        User.reset_token_expires > datetime.utcnow()
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token inválido o expirado"
        )
    
    # Actualizar contraseña
    user.password_hash = get_password_hash(data.password)
    user.reset_token = None
    user.reset_token_expires = None
    
    db.commit()
    
    return {"message": "Contraseña actualizada exitosamente"}

@router.post("/verify-email")
async def verify_email(data: VerifyEmail, db: Session = Depends(get_db)):
    # Buscar usuario por token de verificación
    user = db.query(User).filter(User.verification_token == data.token).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token de verificación inválido"
        )
    
    # Verificar usuario
    user.is_verified = True
    user.verification_token = None
    
    db.commit()
    
    # Enviar email de bienvenida
    try:
        success = await email_sender.send_welcome_email(user.email, user.email)
        if not success:
            print(f"⚠️ Advertencia: No se pudo enviar el email de bienvenida a {user.email}")
    except Exception as e:
        print(f"❌ Error enviando email de bienvenida: {e}")
    
    return {"message": "Email verificado exitosamente"}

@router.get("/me")
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    payload = verify_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )
    
    email = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado"
        )
    
    return {
        "id": user.id,
        "email": user.email,
        "is_verified": user.is_verified
    }

async def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Obtiene el usuario actual si está autenticado, sino retorna None"""
    try:
        token = credentials.credentials
        payload = verify_token(token)
        
        if payload is None:
            return None
        
        email = payload.get("sub")
        if email is None:
            return None
        
        user = db.query(User).filter(User.email == email).first()
        return user
    except:
        return None 