from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database.connection import Base
import uuid
from datetime import datetime, date

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String, unique=True, nullable=True)
    reset_token = Column(String, unique=True, nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)
    daily_queries = Column(Integer, default=0)  # Contador de consultas diarias
    last_query_date = Column(DateTime, nullable=True)  # Última fecha de consulta
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relación con las consultas
    queries = relationship("QueryCount", back_populates="user")

class QueryCount(Base):
    __tablename__ = "query_counts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=True)  # Null para usuarios anónimos
    session_id = Column(String, nullable=True)  # Para usuarios anónimos
    query_date = Column(DateTime, default=datetime.utcnow)
    query_type = Column(String, default="chat")  # Tipo de consulta
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relación con el usuario
    user = relationship("User", back_populates="queries") 