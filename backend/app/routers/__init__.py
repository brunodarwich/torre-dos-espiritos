from app.routers.health import router as health_router
from app.routers.auth import router as auth_router
from app.routers.scores import router as scores_router
from app.routers.wallet import router as wallet_router
from app.routers.purchases import router as purchases_router
from app.routers.events import router as events_router

__all__ = [
    "health_router",
    "auth_router",
    "scores_router",
    "wallet_router",
    "purchases_router",
    "events_router",
]
