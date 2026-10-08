from fastapi import APIRouter, Depends
from sqlmodel import Session, text
from app.database import get_session
from app.config import settings

router = APIRouter(tags=["Health & Status"])


@router.get("/health")
def health_check(session: Session = Depends(get_session)):
    """Verifica a saúde da API e a conexão com o banco de dados."""
    db_status = "ok"
    try:
        session.exec(text("SELECT 1")).first()
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy" if db_status == "ok" else "degraded",
        "service": "Torre dos Espíritos API",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "database": db_status,
    }
