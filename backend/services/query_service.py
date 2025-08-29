from sqlalchemy.orm import Session
from auth.models import User, QueryCount
from datetime import datetime, date
import uuid

class QueryService:
    # Límites de consultas
    ANONYMOUS_LIMIT = 5  # Consultas gratis para usuarios anónimos
    DAILY_LIMIT = 10     # Límite diario para usuarios registrados
    
    @staticmethod
    def get_anonymous_query_count(db: Session, session_id: str) -> int:
        """Obtiene el número de consultas anónimas para una sesión"""
        today = date.today()
        count = db.query(QueryCount).filter(
            QueryCount.session_id == session_id,
            QueryCount.user_id.is_(None),
            QueryCount.query_date >= today
        ).count()
        return count
    
    @staticmethod
    def get_user_daily_query_count(db: Session, user_id: str) -> int:
        """Obtiene el número de consultas diarias de un usuario registrado"""
        today = date.today()
        count = db.query(QueryCount).filter(
            QueryCount.user_id == user_id,
            QueryCount.query_date >= today
        ).count()
        return count
    
    @staticmethod
    def can_make_query(db: Session, user_id: str = None, session_id: str = None) -> dict:
        """Verifica si el usuario puede hacer una consulta"""
        if user_id:
            # Usuario registrado
            daily_count = QueryService.get_user_daily_query_count(db, user_id)
            can_query = daily_count < QueryService.DAILY_LIMIT
            remaining = max(0, QueryService.DAILY_LIMIT - daily_count)
            
            return {
                "can_query": can_query,
                "remaining": remaining,
                "limit": QueryService.DAILY_LIMIT,
                "used": daily_count,
                "requires_registration": False
            }
        else:
            # Usuario anónimo - verificación más estricta
            # Contar TODAS las consultas de esta sesión (no solo del día)
            total_queries = db.query(QueryCount).filter(
                QueryCount.session_id == session_id,
                QueryCount.user_id.is_(None)
            ).count()
            
            # Verificar si alguna vez alcanzó el límite (más seguro)
            has_ever_reached_limit = total_queries >= QueryService.ANONYMOUS_LIMIT
            
            can_query = total_queries < QueryService.ANONYMOUS_LIMIT
            remaining = max(0, QueryService.ANONYMOUS_LIMIT - total_queries)
            
            return {
                "can_query": can_query and not has_ever_reached_limit,
                "remaining": remaining,
                "limit": QueryService.ANONYMOUS_LIMIT,
                "used": total_queries,
                "requires_registration": has_ever_reached_limit
            }
    
    @staticmethod
    def record_query(db: Session, user_id: str = None, session_id: str = None, query_type: str = "chat"):
        """Registra una nueva consulta"""
        query = QueryCount(
            user_id=user_id,
            session_id=session_id,
            query_type=query_type
        )
        db.add(query)
        db.commit()
        
        # Actualizar contador diario del usuario si está registrado
        if user_id:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                today = date.today()
                if user.last_query_date is None or user.last_query_date.date() != today:
                    # Nuevo día, resetear contador
                    user.daily_queries = 1
                else:
                    # Mismo día, incrementar contador
                    user.daily_queries += 1
                user.last_query_date = datetime.utcnow()
                db.commit()
    
    @staticmethod
    def generate_session_id() -> str:
        """Genera un ID de sesión único para usuarios anónimos"""
        return str(uuid.uuid4())
    
    @staticmethod
    def has_session_reached_limit(db: Session, session_id: str) -> bool:
        """Verifica si una sesión ha alcanzado el límite permanentemente"""
        total_queries = db.query(QueryCount).filter(
            QueryCount.session_id == session_id,
            QueryCount.user_id.is_(None)
        ).count()
        return total_queries >= QueryService.ANONYMOUS_LIMIT
    
    @staticmethod
    def get_session_fingerprint(session_id: str, user_agent: str = None, ip: str = None) -> str:
        """Genera una huella digital de la sesión para mayor seguridad"""
        import hashlib
        fingerprint_data = f"{session_id}:{user_agent or 'unknown'}:{ip or 'unknown'}"
        return hashlib.sha256(fingerprint_data.encode()).hexdigest()[:16] 