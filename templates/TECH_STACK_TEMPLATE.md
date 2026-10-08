# Tech Stack & Arquitetura Técnica: [Nome do Projeto]

> **Versão**: 1.3.0  
> **Status**: Ativo / Em Definição  
> **Última Atualização**: AAAA-MM-DD  

---

## 🎙️ Roteiro de Entrevista `/grill-me` (Obrigatório Antes de Preencher)
*A IA deve questionar o Bruno sobre as decisões tecnológicas centrais antes de redigir a arquitetura:*

1. **Stack de Front-end**: Qual ambiente garante maior velocidade de entrega e interface amigável?
   - *(Recomendado)*: Next.js (App Router) + Tailwind CSS + Lucide Icons (ecossistema maduro, consumo de API assíncrona e deploy instantâneo na Vercel).
   - Vite + React + Tailwind (SPA simples e direta para prototipagem rápida).
   - Aplicação web leve (HTML/Tailwind/Alpine.js) com backend minimalista.
2. **Backend & Framework Python**:
   - *(Recomendado)*: **Python com FastAPI + Pydantic + Uvicorn** (padrão absoluto para IA, tipagem rigorosa, documentação OpenAPI automática em `/docs` e alta performance assíncrona).
   - Python com Django / Flask (caso exija painel admin pronto ou fluxo síncrono legado).
   - *Nota*: Se Python não for o ideal, a IA deve emitir o Cartão Executivo de Decisão de Stack.
3. **Banco de Dados & Autenticação**:
   - *(Recomendado)*: Supabase (PostgreSQL relacional, Auth nativo, Row Level Security e suporte a pgvector para IA).
   - SQLite / Turso (banco leve em borda com zero complexidade de setup inicial).
   - Firebase / Firestore (banco NoSQL com sincronização em tempo real).
4. **Provedores de Modelos de IA**:
   - *(Recomendado)*: Google Gemini API (modelos 1.5/2.0 Flash para execução rápida e Pro para raciocínio complexo) + fallback Claude 3.5 Sonnet via LiteLLM ou SDK nativo Python (`google-genai`).
5. **Ferramental de Automação para Agentes (CLIs e MCPs)**:
   - *(Recomendado)*: CLI `git` e `gh` (GitHub), `python`, `uv` (gerenciador rápido), `supabase`, `stripe`, MCP `stitch` (Design UI/UX) e MCP `postgres`.

---

## 1. Visão Geral da Arquitetura Desacoplada

O projeto adota uma separação rigorosa e modular entre **Front-end** e **Back-end**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   FRONT-END (Apresentação & UI/UX)                     │
│      Next.js / React / Tailwind CSS (Espelhado do Google Stitch)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Requisições HTTPS (REST / SSE Stream)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               BACK-END PRIORITÁRIO (Inteligência & APIs)               │
│               Python 3.12+ com FastAPI, Pydantic e Uvicorn             │
└──────────────┬──────────────────────────────────────────┬──────────────┘
               │                                          │
               ▼                                          ▼
┌──────────────────────────────┐          ┌──────────────────────────────┐
│  BANCO DE DADOS & AUTH       │          │   PROVEDORES DE IA (SDKs)    │
│  PostgreSQL / Supabase       │          │   Gemini / Claude / OpenAI   │
└──────────────────────────────┘          └──────────────────────────────┘
```

---

## 2. Camadas da Stack Tecnológica

| Camada | Tecnologia Escolhida | Justificativa Técnica |
|---|---|---|
| **Front-end (`frontend/`)** | Next.js / React + Tailwind CSS | Interface reativa, componentes modernos e fidelidade ao Google Stitch |
| **Back-end (`backend/`)** | **Python (FastAPI + Pydantic)** | **Padrão Prioritário**: Ecossistema de IA incomparável, tipagem e velocidade |
| **Banco de Dados** | Supabase (PostgreSQL + pgvector) | Integridade relacional, busca semântica em vetores e Auth nativo |
| **Design UI/UX** | Google Stitch ([stitch.withgoogle.com](https://stitch.withgoogle.com)) | Prototipagem visual prévia de alta fidelidade antes de codificar |
| **Hospedagem & Deploy** | Vercel (Front) + Railway / Render (Back Python) | Ambientes desacoplados, escaláveis e com CI/CD automático |
| **Pagamentos** | Mercado Pago / Asaas (BR - Pix) + Stripe (Global) | Cobertura total de meios de pagamento nacionais e internacionais |

---

## 3. Matriz de Provisionamento Ativo: CLIs, Autenticações & MCPs
*Princípios 1, 10, 20 e 21: A IA verifica a presença no PATH, instala silenciosamente se ausente e orienta login seguro sem atrito.*

| Tecnologia / Camada | CLI Oficial | Comando de Verificação | Comando de Instalação Autônoma | Método de Login Seguro | Servidor MCP Recomendado |
|---|---|---|---|---|---|
| **Linguagem Backend** | `python` | `python --version` | `winget install Python.Python.3.12 -e` | N/A (Público) | N/A |
| **Gerenciador Python** | `uv` / `pip` | `uv --version` | `powershell -c "irm https://astral.sh/uv/install.ps1 \| iex"` | N/A (Público) | N/A |
| **Controle de Versão** | `git` | `git --version` | `winget install Git.Git -e` | Chave SSH ou GCM nativo | `filesystem` |
| **Repositório & PRs** | `gh` | `gh --version` | `winget install GitHub.cli -e` | `gh auth login --web` (OAuth browser) | `github` |
| **Runtime Front-end** | `node` / `npm` | `node -v; npm -v` | `winget install OpenJS.NodeJS.LTS -e` | N/A (Público) | N/A |
| **Banco & Auth** | `supabase` | `supabase --version` | `winget install Supabase.CLI` ou `npm i -g supabase` | `supabase login` (Browser) ou Cartão de Segredos | `postgres` |
| **Checkout Global** | `stripe` | `stripe --version` | `winget install Stripe.StripeCLI -e` | `stripe login` (Abre navegador com código) | `stripe` |
| **Prototipagem UI** | Stitch Web / MCP | N/A | Integrado via MCP da IDE | Sessão Google (stitch.withgoogle.com) | `stitch` / `StitchMCP` |

---

## 4. Cartão Executivo de Decisão de Stack (Regra de Exceção ao Python)

> [!IMPORTANT]
> Se a IA identificar que o projeto atual se beneficiaria mais de uma tecnologia diferente de Python no backend, ela deve emitir este cartão e aguardar a validação do Bruno antes de implementar:

```markdown
### ⚖️ Cartão Executivo de Decisão de Stack: Avaliação de Backend
- **Projeto**: [Nome do Projeto]
- **Opção Padrão do Framework**: Backend desacoplado em Python (FastAPI)
- **Alternativa Proposta pela IA**: [Ex: Next.js Fullstack Server Actions / Node Serverless]
- **Motivo da Avaliação**: [Ex: Projeto é um MVP de 1 tela; unificar no Next.js economiza R$ 0 em servidores adicionais e elimina complexidade]

| Critério de Comparação | Backend em Python (FastAPI) | Alternativa Proposta ([Nome]) |
|---|---|---|
| **Custo de Hospedagem** | Requer 2 serviços ativos (Front + Back) | 1 único serviço (Deploy unificado gratuito) |
| **Complexidade de Manutenção** | Duas esteiras e dois ambientes | Uma única esteira integrada |
| **Poder de IA / Processamento** | Máximo (ecossistema Python nativo) | Suficiente para chamadas de API simples |

- **Recomendação da IA**: [Recomendação clara e fundamentada]
- **Decisão do Bruno**: Você aprova utilizar a alternativa proposta ou prefere mantermos a arquitetura padrão em Python?
```

---

## 5. Variáveis de Ambiente e Gestão de Segredos
*Todas as variáveis de ambiente devem ser documentadas no `.env.example` sem valores reais expostos.*

```env
# Backend (FastAPI / Python)
PORT=8000
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000

# Banco de Dados
DATABASE_URL=postgresql://usuario:senha@localhost:5432/meubanco

# Provedores de Inteligência Artificial
GEMINI_API_KEY=sua_chave_aqui

# Gateways de Pagamento
MERCADO_PAGO_ACCESS_TOKEN=sua_chave_aqui
STRIPE_SECRET_KEY=sua_chave_aqui
STRIPE_WEBHOOK_SECRET=sua_chave_aqui
```
