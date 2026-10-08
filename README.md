# Framework de Desenvolvimento & Orquestração com IA

Um kit operacional e metodológico desenhado sob medida para desenvolvimento ágil de projetos e produtos digitais com agentes de inteligência artificial (compatível com Google Antigravity, OpenAI Codex, Cursor, Claude Code e similares).

Este repositório consolida **21 princípios práticos** de desenvolvimento orientados ao perfil multidisciplinar do criador (criativo/quadrinista, formação jurídica, analista de negócios Sebrae com startups e neurodivergência TDAH).

---

## 🚀 Estrutura do Framework

```
dev-ia-bd/
├── AGENTS.md                                   # Protocolo supremo de comportamento e regras para IAs (canônico)
├── dashboard.html                              # Plataforma visual integrada (Kanban com Stepper & Métricas em tempo real)
├── abrir_dashboard.bat                         # Inicializador de 1 clique no Windows (servidor local sem bloqueio de CORS)
├── tasks.json                                  # Registro estruturado de tarefas, metas e marcos
├── tasks_data.js                               # Espelho JS local para carregamento instantâneo no protocolo file://
├── analytics.json                              # Registro estruturado de KPIs de negócio e telemetria
├── analytics_data.js                           # Espelho JS local de métricas para protocolo file://
├── README.md                                   # Guia do repositório e manual de replicação
├── REGRAS_E_FLUXOS.txt                         # Resumo executivo em tópicos de todas as regras, princípios e fluxos
├── principios-dev-ia - Página1.csv             # Princípios originais consolidados
└── templates/                                  # Suite modular de documentos para novos projetos
    ├── NARRATIVE_STORYTELLING_TEMPLATE.md      # Linha lógica do projeto, contexto, dor real e tese da solução
    ├── VALUE_PROPOSITION_CANVAS_TEMPLATE.md    # Canvas da Proposta de Valor com amarração 1:1 (Dores x Aliviadores)
    ├── BUSINESS_MODEL_CANVAS_TEMPLATE.md       # Canvas sistêmico (Relacionamento x Canais, Atividades x Recursos x Parceiros)
    ├── PRD_TEMPLATE.md                         # Requisitos derivados das Atividades Principais e telemetria
    ├── DESIGN_SYSTEM_STITCH_TEMPLATE.md        # UI/UX, Design Tokens, Direção de Arte e prompts para Google Stitch
    ├── TECH_STACK_TEMPLATE.md                  # Arquitetura desacoplada (Front/Back Python), CLIs e MCPs
    ├── FINANCIAL_MODEL_TEMPLATE.md             # Monetização dupla: Nacional (PIX) e Global (Stripe) + /grill-me
    ├── SUMMARY_TEMPLATE.md                     # Resumo executivo em 1 parágrafo (Elevator Pitch) + /grill-me
    ├── DEPLOYMENT_GIT_PLAYBOOK_TEMPLATE.md     # Padrão de branches, commits e checklist Go/No-Go
    ├── tasks_template.json                     # Molde limpo de tarefas com os 5 Marcos sequenciais
    ├── tasks_data_template.js                  # Molde do espelho JS de tarefas para file://
    ├── analytics_template.json                 # Molde limpo de telemetria e KPIs de usuários
    ├── analytics_data_template.js              # Molde do espelho JS de telemetria para file://
    ├── abrir_dashboard.bat                     # Molde do inicializador de 1 clique
    └── dashboard.html                          # Template do painel visual pronto com Stepper interativo
```

---

## 🧠 Os 5 Pilares Fundamentais do Framework

### 1. Autonomia Silenciosa em Lotes por Marcos (Milestone Batching)
- **Zero One-Shot Megalomania**: A IA é expressamente proibida de tentar gerar planejamento, documentação, banco, backend e frontend em uma única interação afobada.
- **O Ciclo dos 5 Marcos Sequenciais**:
  1. `Marco 1`: Fundação, Narrativa & Planejamento Sistêmico (Linha Lógica, `gh repo create --private`, Canvas Proposta de Valor 1:1, Business Model Canvas Integrado, PRD derivado, tasks.json).
  2. `Marco 2`: Design UI/UX, Direção de Arte & Geração de Imagens (Stitch e ativos visuais).
  3. `Marco 3`: Backend Core, Contratos de API & Testes (FastAPI + Pydantic + testes aprovados).
  4. `Marco 4`: Frontend UI & Integração (UI Tailwind consumindo APIs reais de ponta a ponta).
  5. `Marco 5`: Auditoria Tier 3, Métricas & Go-to-Market (Telemetria real, release e deploy).
- **Checkpoint Estrito**: Ao concluir cada marco, a IA roda testes, atualiza o `tasks.json` e **PARA obrigatoriamente**, emitindo um Resumo Executivo para validação do Bruno antes de avançar.

### 2. Design UI/UX com Google Stitch & Direção de Arte Unificada para Imagens
- **Nenhum front-end é codificado às cegas**: A IA gera as especificações visuais e o prompt pronto para o [Google Stitch](https://stitch.withgoogle.com) ou servidores MCP locais (`stitch` / `StitchMCP`).
- **Direção de Arte Coesa para Ativos Visuais**: Quando o projeto demandar ilustrações ou banners, a IA estabelece uma assinatura visual única (estilo de render, iluminação e paleta), uma fórmula padronizada de prompts e suporte híbrido (ferramenta nativa `generate_image` no Antigravity e prompts para geradores externos como Midjourney/Flux).
- **Backend Padrão Prioritário em Python**: Implementado em **FastAPI + Pydantic + Uvicorn**, gerenciado via `uv`. Se Python não for a melhor opção, a IA emite obrigatoriamente o **Cartão Executivo de Decisão de Stack**.

### 3. Orquestração Multi-Modelo em 3 Tiers
- **Tier 1 (Ponta / Frontier — Claude Sonnet/Opus, Gemini Pro, GPT-4o)**: Conceituação, arquitetura, modelagem de negócios, PRD e sessões investigativas `/grill-me` e `/plan`.
- **Tier 2 (Leve / Fast — Gemini Flash, Haiku, GPT-4o-mini)**: Execução rápida em lote disparada autonomamente via sub-agentes (`invoke_subagent` com `Model: 'flash'`).
- **Tier 3 (Médio / Reviewers)**: Auditoria contra metas e indicadores de aceite, testes de regressão e aprovação formal (`audit_confirmed: true`).

### 4. Segurança Inegociável: "Cartão de Configuração Guiada"
- Nenhuma chave de API, senha ou credencial sensível deve ser exposta ou comitada.
- Quando necessário configurar dados sensíveis, a IA gera um roteiro minucioso de clique a clique com URL direta para a plataforma, indicando apenas qual variável preencher no `.env` local.

### 5. Gestão Visual Dupla, Stepper de Marcos & Dados Reais (`dashboard.html`)
- O arquivo `dashboard.html` pode ser aberto em qualquer navegador com alternância instantânea entre duas visões:
  - **Aba Tarefas (Kanban com Stepper)**: Pipeline horizontal visual dos 5 Marcos com percentual de avanço, filtros interativos por marco/tier e status de auditoria de cada entrega.
  - **Aba Métricas & Growth**: Acompanhamento de DAU/MAU, receita (MRR em BRL/USD), funil de conversão e eventos de telemetria reais (sem dados fictícios / empty state explicativo).

---

## 🛠️ Como Iniciar um Novo Projeto Usando Este Framework

Para inicializar qualquer novo projeto de software ou produto digital:

1. **Copie os arquivos-base para o novo repositório**:
   - Copie `AGENTS.md` para a raiz do seu novo projeto.
   - Copie `dashboard.html` e `abrir_dashboard.bat` para a raiz.
   - Copie `templates/tasks_template.json` renomeando para `tasks.json` na raiz.
   - Copie `templates/tasks_data_template.js` renomeando para `tasks_data.js` na raiz.
   - Copie `templates/analytics_template.json` renomeando para `analytics.json` na raiz.
   - Copie `templates/analytics_data_template.js` renomeando para `analytics_data.js` na raiz.
   - Copie a pasta `templates/` para `docs/` como ponto de partida.
2. **Abra o agente de IA e execute o Marco 1**:
   - Diga à IA: *"Leia o AGENTS.md e execute o Marco 1: Fundação, Narrativa & Planejamento Sistêmico (TASK-001)."*
   - No Antigravity, acione `/plan` ou `/grill-me`: a IA seguirá a Cascata Sistêmica (Linha Lógica da Narrativa ➔ `gh repo create --private` ➔ Canvas de Proposta de Valor 1:1 ➔ Business Model Canvas com entrevista guiada passo a passo e auditoria cruzada de Relacionamento, Canais, Atividades e Recursos ➔ PRD derivado com requisitos rastreados).
   - A IA concluirá o Marco 1, atualizará `tasks.json` e `tasks_data.js`, e **parará obrigatoriamente**, emitindo o Resumo Executivo para sua aprovação.
3. **Prototipagem no Google Stitch & Direção de Arte (Marco 2)**:
   - Use o arquivo gerado `docs/DESIGN_SYSTEM_STITCH.md` para prototipar telas no Stitch e gerar/validar as imagens unificadas antes de codificar a UI.
4. **Construção Segura do Backend (Marco 3) e Frontend (Marco 4)**:
   - O backend em Python é implementado e testado com comandos reais no terminal antes de qualquer componente visual ser conectado.
5. **Acompanhe visualmente no Dashboard (2 Formas Sem Atrito)**:
   - **Opção Recomendada (Ao Vivo)**: Dê 2 cliques no `abrir_dashboard.bat`. Ele inicia um servidor local Python leve e abre o navegador automaticamente sem qualquer bloqueio de CORS.
   - **Opção Direta (Duplo-clique no HTML)**: Abra o `dashboard.html` diretamente no navegador. Os dados carregam instantaneamente via `tasks_data.js`, ou você pode simplesmente arrastar o `tasks.json` para dentro da tela.
