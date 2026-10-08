from typing import Generator
from sqlmodel import SQLModel, Session, create_engine
from app.config import settings

# Ajuste de connect_args para SQLite
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# Se for PostgreSQL via Supabase, pool_pre_ping garante reconexão limpa
engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
    connect_args=connect_args,
    pool_pre_ping=True if not settings.DATABASE_URL.startswith("sqlite") else False,
)


def init_db() -> None:
    """Inicializa as tabelas no banco de dados."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Dependency injection de sessão para rotas FastAPI."""
    with Session(engine) as session:
        yield session
