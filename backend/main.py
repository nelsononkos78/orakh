from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from database.connection import engine
from auth.models import Base
from auth.routes import router as auth_router
from routes.query_routes import router as query_router
from routes.orakh_routes import router as orakh_router
from routes.ai_routes import router as ai_router
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Orakh API", 
    version="1.0.0",
    # Configurar límites para archivos grandes
    max_request_size=50 * 1024 * 1024,  # 50MB
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:2800", "http://127.0.0.1:2800", "http://onkosweb.com:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware para manejar archivos grandes
@app.middleware("http")
async def handle_large_files(request: Request, call_next):
    # Aumentar el límite de tamaño para este request
    if request.url.path.startswith("/api/ai/"):
        # Para rutas de IA, permitir archivos más grandes
        request.scope["max_request_size"] = 50 * 1024 * 1024  # 50MB
    return await call_next(request)

# Incluir rutas
app.include_router(auth_router)
app.include_router(query_router)
app.include_router(orakh_router)
app.include_router(ai_router)

@app.get("/")
async def root():
    return {"message": "Orakh API - Sistema de Autenticación"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Orakh API funcionando correctamente"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 2900))
    uvicorn.run(app, host="0.0.0.0", port=port)