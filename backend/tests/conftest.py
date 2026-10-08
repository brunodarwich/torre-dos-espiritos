import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool

from app.main import app
from app.database import get_session


@pytest.fixture(name="session")
def session_fixture():
    """Cria um banco SQLite em memória isolado para cada teste."""
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    """Cria um TestClient do FastAPI conectado ao banco de teste em memória."""
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="auth_headers")
def auth_headers_fixture(client: TestClient):
    """Cria um jogador convidado de teste e retorna os headers com token Bearer."""
    response = client.post("/auth/guest", json={"display_name": "Testador Astral"})
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {
        "Authorization": f"Bearer {token}",
        "player_id": response.json()["player_id"],
    }
