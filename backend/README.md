# Torre dos Espíritos — Backend Core (FastAPI)

Servidor assíncrono para o jogo Torre dos Espíritos.

## Execução Rápida

Com `uv`:
```bash
# Instalar dependências e rodar o servidor
uv run uvicorn app.main:app --reload --port 8000

# Executar testes
uv run pytest -v
```

Documentação OpenAPI interativa disponível em `http://127.0.0.1:8000/docs`.
