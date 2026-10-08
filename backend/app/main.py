from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.routers import (
    health_router,
    auth_router,
    scores_router,
    wallet_router,
    purchases_router,
    events_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inicialização das tabelas no startup da aplicação
    init_db()
    yield


app = FastAPI(
    title="Torre dos Espíritos API",
    description="Backend oficial do jogo Torre dos Espíritos: Ranking Semanal, Autenticação Híbrida, Carteira de Cristais e Telemetria Astral.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configuração de CORS para permitir acesso do Phaser / Vite
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro de roteadores
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(scores_router)
app.include_router(wallet_router)
app.include_router(purchases_router)
app.include_router(events_router)


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Torre dos Espíritos API online",
        "docs": "/docs",
        "health": "/health",
    }
