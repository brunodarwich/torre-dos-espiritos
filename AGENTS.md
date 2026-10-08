# AGENTS.md — Protocolo Mestre de Desenvolvimento e Orquestração com IA

Este documento é a diretriz suprema de trabalho para qualquer agente de IA (Google Antigravity, OpenAI Codex, Cursor, Claude Code ou outros agentes autônomos) operando neste repositório ou em projetos derivados deste framework.

---

## 1. Perfil do Criador & Princípios Cognitivos

O criador deste projeto é **Bruno**, profissional criativo com uma trajetória multidisciplinar que dita como o trabalho deve ser conduzido:
- **Origem e Repertório**: Quadrinista profissional (pensamento visual, narrativo e estrutural), formado em Direito (rigor conceitual, conformidade, regras claras) e ex-analista de negócios no Sebrae com atuação direta em ecossistemas de startups (validação de produto, modelagem financeira, unit economics e growth).
- **Não é desenvolvedor tradicional de formação**: Não assuma familiaridade com jargões técnicos herméticos de baixo nível. Sempre que conveniente, facilite a compreensão de conceitos técnicos complexos usando analogias visuais ou de negócios.
- **Perfil Neurodivergente (TDAH)**:
  - **Sobrecarga Zero**: Evite paredes de texto caóticas ou múltiplos comandos misturados.
  - **Apresentação Executiva**: Sempre entregue resumos consolidados, claros e estruturados.
  - **Acompanhamento Visual**: Toda evolução de tarefas e métricas deve ser refletida visualmente no `dashboard.html`.
  - **Orientações "Clique a Clique"**: Caso o Bruno precise realizar alguma etapa manual em qualquer plataforma externa, forneça um roteiro minucioso de onde clicar, prevenindo qualquer chance de desorientação.

---

## 2. Postura Operacional: Autonomia Silenciosa em Lotes por Marcos (Milestone Batching)

A postura da IA perante o desenvolvimento deve equilibrar autonomia técnica com foco executivo, evitando a armadilha da "megalomania em turno único" (*one-shot megalomania*):

> [!CAUTION]
> **PROIBIÇÃO DE EXECUÇÃO MEGALOMANÍACA EM TURNO ÚNICO**:
> A IA é terminantemente proibida de tentar gerar planejamento, documentação, banco de dados, backend e frontend em uma única interação. Essa afobação esgota a janela de atenção do modelo, introduz bugs sutis em cascata, gera códigos com atalhos preguiçosos (`# TODO: implementar`) e impede o loop de testes reais. O desenvolvimento DEVE ocorrer obrigatoriamente em **Marcos Sequenciais**.

### O Ciclo dos 5 Marcos Sequenciais de Desenvolvimento:
1. **Marco 1: Fundação, Narrativa & Planejamento Sistêmico**:
   - **Etapa 1.0 (Linha Lógica & Narrativa do Projeto)**: Condução de `/grill-me` guiado passo a passo (uma pergunta por vez), processando respostas e áudios transcritos do Bruno para consolidar o `docs/NARRATIVE_STORYTELLING.md` (Contexto & Usuário Real, Gargalo/Dor Concreta, Tese da Solução, Impacto Prático e Posicionamento).
   - **Etapa 1.1 (Versionamento Imediato no GitHub via CLI)**: Inicialização do Git (`git init`), criação automática do repositório remoto privado via GitHub CLI (`gh repo create <nome> --private --source=. --remote=origin --push`) e primeiro push antes de avançar para código.
   - **Etapa 1.2 (Canvas da Proposta de Valor — Fit 1:1)**: Elaboração do `docs/VALUE_PROPOSITION_CANVAS.md`, garantindo correspondência estrita 1:1 entre Dores do Cliente e Aliviadores de Dor, e entre Ganhos Desejados e Criadores de Ganho. Nenhuma funcionalidade é inventada sem dor ou ganho correspondente.
   - **Etapa 1.3 (Business Model Canvas Sistêmico & Integrado)**: Condução de `/grill-me` guiado passo a passo (uma pergunta por vez) baseado na linha lógica de negócios do Bruno (Segmentos/Momento ➔ Oferta/Moat ➔ Relacionamento Antes/Durante/Depois amarrado a Canais ➔ Monetização Dupla ➔ Desdobramento compulsório de 100% dos compromissos em Atividades Principais ➔ Mapeamento de Atividades para Recursos ➔ Deslocamento de Atividades/Recursos para Parcerias Estratégicas ➔ Custos) para consolidar o `docs/BUSINESS_MODEL_CANVAS.md`.
   - **Etapa 1.4 (PRD & Modelagem Técnica/Financeira Derivada)**: Elaboração e consolidação do `PRD.md` (cujos requisitos funcionais derivam compulsoriamente das Atividades Principais e da Proposta de Valor do Canvas), `TECH_STACK.md`, `FINANCIAL_MODEL.md`, `SUMMARY.md` e preenchimento inicial do `tasks.json`.
   - *Ponto de Parada*: Validação dos requisitos de negócio, arquitetura e narrativa com o Bruno.
2. **Marco 2: Design UI/UX, Direção de Arte & Imagens**:
   - Criação do `docs/DESIGN_SYSTEM_STITCH.md`, prompts do Google Stitch, definição da Direção de Arte e geração unificada de ativos visuais (imagens/ícones).
   - *Ponto de Parada*: Validação estética no Stitch e aprovação da coerência visual dos ativos gerados.
3. **Marco 3: Backend Core, Contratos de API & Testes**:
   - Provisionamento de ambiente (Python + `uv` + FastAPI), criação de modelos Pydantic, rotas mínimas e **execução de testes automatizados com sucesso no terminal**.
   - *Ponto de Parada*: Backend compilando, documentação OpenAPI (`/docs`) funcional e testes 100% aprovados.
4. **Marco 4: Frontend UI & Integração**:
   - Construção dos componentes e telas consumindo as APIs reais do backend, espelhando fielmente o protótipo do Stitch e os ativos da Direção de Arte.
   - *Ponto de Parada*: Aplicação integrada navegável, sem erros de console ou quebra de layout.
5. **Marco 5: Auditoria Tier 3, Métricas & Go-to-Market**:
   - Auditoria estrita contra os indicadores do `tasks.json`, configuração de telemetria real em `analytics.json`, testes finais e playbook de deploy/Git.
   - *Ponto de Parada*: Entrega final consolidada no `dashboard.html`.

### Regra de Ouro do Checkpoint Estrito:
1. **Autonomia Máxima Dentro do Marco**: Dentro do marco ativo, a IA tem total liberdade para usar terminal, criar/editar arquivos, rodar linters e executar testes sem interromper o usuário.
2. **Parada Obrigatória ao Concluir o Marco**: Ao atingir todos os critérios do marco atual, a IA deve atualizar o `tasks.json`, refletir o avanço no `dashboard.html` e **PARAR OBRIGATORIAMENTE**.
3. **Resumo Executivo de Checkpoint**: A IA encerra a interação emitindo um resumo com:
   - ✅ O que foi construído e testado no marco.
   - 📊 Estado atual das tarefas e métricas.
   - 🎯 O que está planejado para o próximo marco.
   - ❓ Pergunta explícita de autorização para iniciar o próximo marco.
4. A IA **jamais** inicia tarefas de um marco futuro sem o comando explícito do Bruno.

---

## 3. Orquestração Multi-Modelo em 3 Camadas (3-Tier AI System)

O desenvolvimento de qualquer projeto deve respeitar a divisão de responsabilidades entre modelos de IA:

```
┌────────────────────────────────────────────────────────┐
│  TIER 1: Modelos de Ponta / Frontier                   │
│  (Claude 3.5 Sonnet / Opus, Gemini Pro, GPT-4o)        │
│  → Arquitetura, Conceito, Planejamento, PRD, /grill-me  │
└──────────────────────────┬─────────────────────────────┘
                           │ Handoff estruturado (tasks e especificações)
                           ▼
┌────────────────────────────────────────────────────────┐
│  TIER 2: Modelos Leves / Fast                          │
│  (Gemini Flash, Haiku, GPT-4o-mini, Modelos Rápidos)    │
│  → Execução massiva em lote, código, testes, scripts   │
└──────────────────────────┬─────────────────────────────┘
                           │ Código gerado e implementações
                           ▼
┌────────────────────────────────────────────────────────┐
│  TIER 3: Modelos Médios / Reviewers                    │
│  (Modelos Médios com prompts de auditoria estrita)     │
│  → Revisão de código, validação de metas e "OK" final  │
└────────────────────────────────────────────────────────┘
```

### Mecânica Operacional no Antigravity:
1. **Tier 1 (Arquiteto Principal)**:
   - Conduz o `/grill-me` com o Bruno, desenha a arquitetura, cria os planos de implementação (`/plan`) e atualiza o `tasks.json`.
2. **Handoff Autônomo para Tier 2 (Execução Ágil)**:
   - O agente principal invoca sub-agentes com modelos rápidos via ferramenta `invoke_subagent` com parâmetro `Model: 'flash'` e prompt atômico contendo as tarefas a implementar.
   - O sub-agente Flash gera o código, arquivos e testes de forma rápida e com menor custo computacional, reportando a conclusão ao agente pai.
3. **Tier 3 (Auditoria Estrita de Entrega)**:
   - O agente revisor (ou sub-agente com prompt focado em auditoria) verifica os critérios de aceite (`indicators`) da tarefa.
   - Confere ausência de vulnerabilidades, conformidade com os 21 princípios e valida se não houve regressão.
   - Dá o parecer formal e marca `audit_confirmed: true` e `status: "done"` no `tasks.json`.
4. **Alternância Manual Opcional pelo Usuário**:
   - Caso o Bruno prefira controlar a troca de modelos na barra da interface:
     - Use modelos Frontier (ex: Gemini Pro / Sonnet) para `/plan` e `/grill-me`.
     - Alterne para modelos Fast (ex: Gemini Flash) para gerar grandes volumes de código.
     - Alterne para modelos intermediários para pedir uma revisão detalhada do código antes de comitar.

---

## 4. Etapa de Prototipagem, Design UI/UX com Google Stitch e Direção de Arte para Imagens

Em atendimento ao perfil visual e narrativo do criador (quadrinista e designer), **nenhum código front-end deve ser iniciado às cegas e nenhum ativo visual deve ser gerado de forma desconexa**.
Logo após a aprovação do planejamento (`/plan`) e do `PRD.md`, a IA deve obrigatoriamente executar a **Etapa de Design UI/UX com Google Stitch e Direção de Arte** (Marco 2):

1. **Geração do Documento de Design e Direção de Arte (`docs/DESIGN_SYSTEM_STITCH.md`)**:
   - A IA preenche as especificações a partir do template `templates/DESIGN_SYSTEM_STITCH_TEMPLATE.md`.
   - Define a identidade visual (paleta de cores, tipografia sem serifa para foco com TDAH, design tokens e componentes).
   - Mapeia as telas do MVP (Dashboard, Workspace da IA, Checkout e Configurações).
2. **Entrega do Prompt Estruturado para o Google Stitch**:
   - A IA redige um prompt de alta fidelidade pronto para ser colado no [stitch.withgoogle.com](https://stitch.withgoogle.com).
   - Se o servidor MCP `stitch` estiver disponível na IDE, a IA pode invocar as ferramentas `generate_screen_from_text` ou `create_design_system` diretamente.
3. **Direção de Arte Unificada e Geração de Imagens (Ativos Visuais)**:
   - Sempre que o projeto necessitar de imagens (ilustrações de tela, hero banners, ícones personalizados, empty states ilustrados, avatares ou imagens de marketing), a IA deve estabelecer uma **Direção de Arte Coesa**:
     - **Estilo Artístico Único**: Determinar uma assinatura visual fixa (ex: *3D Clay minimalista*, *Vetor editorial com contorno suave*, *Cyberpunk neon*, etc.) para que todos os ativos pareçam ter sido criados pelo mesmo ilustrador.
     - **Tokens de Iluminação e Paleta**: Iluminação controlada respeitando a paleta do Stitch (ex: slate-950, acentos em índigo e violeta).
     - **Fórmula Padronizada de Prompt**:
       ```
       [Sujeito Central em Ação] + [Ambiente/Composição] + [Estilo Artístico Unificado] + [Iluminação/Atmosfera] + [Paleta de Cores e Tokens] + [Parâmetros Técnicos / Aspect Ratio]
       ```
     - **Protocolo Híbrido de Criação**:
       - *Geração Nativa Autônoma*: No Antigravity, utilizar a ferramenta `generate_image` para gerar os ativos diretamente no projeto (ex: em `frontend/public/assets/` ou diretório de mídia).
       - *Prompts Externos Refinados*: A IA documenta prompts de alta fidelidade prontos para copiar e colar em ferramentas externas (Midjourney, Flux, Ideogram, DALL-E) caso o Bruno queira gerar ou refinar ilustrações externamente.
4. **Validação Visual (Ponto de Parada do Marco 2)**:
   - O Bruno valida ou ajusta o visual no Stitch e a harmonia estética das imagens geradas.
   - Uma vez aprovado este marco, o código do front-end (`frontend/`) poderá ser construído espelhando com fidelidade absoluta o protótipo e os ativos.

---

## 5. Arquitetura Desacoplada & Backend Prioritário em Python (FastAPI)

A estrutura de código de projetos deste framework deve manter uma separação clara e modular entre apresentação e inteligência de negócios:

```
projeto/
├── frontend/             # Interface do Usuário (Next.js / React / Tailwind CSS)
└── backend/              # Inteligência, Regras de Negócio e APIs (Python + FastAPI)
```

### Diretrizes de Backend:
1. **Python como Escolha Padrão Prioritária**:
   - O backend padrão do projeto deve ser implementado em **Python**, utilizando **FastAPI + Pydantic + Uvicorn**.
   - Justificativa: Ecossistema nativo e superior para Inteligência Artificial (SDKs Google GenAI, LangChain, LiteLLM, PyTorch), tipagem robusta e documentação OpenAPI interativa automática (`/docs`).
   - Gerenciamento de dependências: `uv` (ultra-rápido) ou `requirements.txt`.
2. **Desacoplamento Completo**:
   - O `frontend/` consome o `backend/` via APIs REST assíncronas, Server-Sent Events (SSE para streaming de respostas de IA) ou WebSockets.

---

## 6. Regra de Exceção ao Python: "Cartão Executivo de Decisão de Stack"

Se em algum projeto específico a IA identificar que **Python NÃO é a melhor opção** (por exemplo: um aplicativo puramente estático sem servidor, um MVP de 1 única tela onde Next.js Fullstack Server Actions reduz custos de hospedagem para zero, ou Workers de borda com suporte nativo exclusivo a JavaScript/TypeScript):

> [!WARNING]
> **REGRA DE CONDUTA**: A IA é proibida de substituir o backend Python de forma silenciosa ou arbitrária. Ela deve **pausar imediatamente** e emitir um **Cartão Executivo de Decisão de Stack**:

```markdown
### ⚖️ Cartão Executivo de Decisão de Stack: Avaliação de Backend
- **Projeto**: [Nome do Projeto]
- **Opção Padrão do Framework**: Backend desacoplado em Python (FastAPI)
- **Alternativa Proposta pela IA**: [Nome da Tecnologia, ex: Next.js Fullstack / Node Serverless]
- **Motivo da Avaliação**: [Explicação clara, em linguagem de negócios e sem jargões herméticos, do porquê o Python traria custo ou complexidade excessiva para este caso]

| Critério de Comparação | Backend em Python (FastAPI) | Alternativa Proposta ([Nome]) |
|---|---|---|
| **Custo de Hospedagem** | Requer 2 serviços ativos (Front + Back) | 1 único serviço (Deploy unificado gratuito) |
| **Complexidade de Manutenção** | Duas esteiras e dois ambientes | Uma única esteira integrada |
| **Poder de IA / Processamento** | Máximo (ecossistema Python nativo) | Suficiente para chamadas de API simples |

- **Recomendação da IA**: [Recomendação objetiva fundamentada no momento do projeto]
- **Decisão do Bruno**: Você aprova utilizar a alternativa proposta ou prefere mantermos a arquitetura padrão em Python?
```

A IA só poderá prosseguir com uma stack diferente de Python após a aprovação expressa do Bruno.

---

## 7. Ciclo Ativo de Ferramental: Detecção, Instalação de CLIs, Autenticações e MCPs

Em atendimento estrito aos Princípios 1, 10, 13, 20 e 21:
> *"Tudo o que a IA puder desenvolver, fazer e configurar por mim com CLIs, MCPs e browser, faça. Quando for para configurar dados sensíveis, me chame com orientações detalhadas."*

A IA não deve esperar passivamente que as ferramentas existam no computador do Bruno; ela deve executar um **Ciclo Ativo de Provisionamento** logo após a definição da stack no `TECH_STACK.md` ou ao detectar dependências no repositório.

```
┌────────────────────────────────────────────────────────┐
│  PASSO 1: Mapear Ferramentas Requeridas pela Stack     │
│  (Ex: Python, uv, Supabase, Stripe, GitHub CLI, Node)  │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│  PASSO 2: Verificação Silenciosa de Presença no PATH   │
│  (Executar Get-Command / --version sem travar o chat)  │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│  PASSO 3: Instalação Autônoma Silenciosa (Se ausente)  │
│  (winget / scoop no Windows, npm install -g ou local)  │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│  PASSO 4: Autenticação Segura Assistida                │
│  • Via Browser (OAuth): Disparar login web e orientar  │
│  • Via Tokens/Secrets: Emitir Cartão de Configuração   │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│  PASSO 5: Descoberta e Ativação de Servidores MCP      │
│  (Mapear e sugerir/configurar MCPs pertinentes)        │
└────────────────────────────────────────────────────────┘
```

### Regras do Ciclo de Provisionamento & Versionamento:
1. **Passo 1 (Mapeamento)**: Cruzar a tecnologia escolhida com a Matriz de Ferramental do `TECH_STACK.md` (incluindo `git`, `gh`, `python`, `uv`, `node`, `supabase`, `stripe`, etc.).
2. **Passo 2 (Diagnóstico Silencioso)**: Testar no terminal se a CLI existe (ex: `git --version`, `gh auth status`, `Get-Command python -ErrorAction SilentlyContinue`, `uv --version`, `stripe --version`).
3. **Passo 3 (Instalação Autônoma)**:
   - Se ausente, instalar sem perguntar ao usuário:
     - No Windows: `winget install --id <ID_DO_PACOTE> -e --silent` ou `scoop install <app>`.
     - No ecossistema Python: instalar gerenciador `uv` via PowerShell ou script oficial.
     - No ecossistema Node/JS: `npm install -g <pacote>` ou `npm install -D <pacote>`.
4. **Passo 4 (Versionamento Obrigatório no GitHub via CLI desde o Marco 1)**:
   - **Regra do Minuto Zero**: Logo após estruturar os arquivos iniciais do Marco 1, a IA deve rodar:
     ```powershell
     git init
     git add .
     git commit -m "feat: marco 1 - fundacao, narrativa e planejamento inicial"
     gh repo create <nome-do-repositorio> --private --source=. --remote=origin --push
     ```
   - O projeto já nasce com backup na nuvem e esteira de branches/PRs pronta, sem postergar o GitHub para o final.
5. **Passo 5 (Autenticação Segura Assistida)**:
   - **Login via Browser (OAuth)**: Para ferramentas com suporte a login web (ex: `gh auth login --web`, `supabase login`, `stripe login`), a IA dispara o comando e avisa o Bruno com instruções diretas: *"Abri o login do [Serviço] no navegador. Código de pareamento: `XXXX-XXXX`. Confirme e me avise."*
   - **Login via Chaves/Tokens (Sensíveis)**: Se exigir token ou chave privada, a IA **jamais** pede no chat; ela emite o **Cartão de Configuração Guiada** (Seção 8) para preenchimento no `.env` local.
6. **Passo 6 (Servidores MCP)**:
   - Mapear os servidores MCP disponíveis no ambiente (ex: `stitch`, `filesystem`, `postgres`, `github`).
   - Se a stack se beneficiar de um novo MCP, a IA fornece o snippet JSON exato pronto para colar nas configurações da IDE.

---

## 8. Protocolo de Segurança e Gestão de Segredos ("Cartão de Configuração Guiada")

> [!CAUTION]
> **LEI FUNDAMENTAL**: Jamais comite, imprima em logs abertos ou exponha tokens de API, senhas, segredos ou dados sensíveis do usuário.

Quando qualquer configuração envolver segredos (ex: Supabase, Stripe, Mercado Pago, OpenAI, Firebase, GitHub, AWS, etc.):
1. A IA configura a infraestrutura, cria o `.env.example` e escreve o código consumidor do segredo.
2. A IA **interrompe o fluxo** e apresenta exclusivamente um **Cartão de Configuração Guiada** formatado da seguinte forma:

```markdown
### 🔐 Cartão de Configuração Guiada: [Nome do Serviço]
- **Plataforma**: [Nome da Plataforma]
- **URL Direta**: [Link exato para a página de chaves/credenciais]
- **Passo a Passo de Acesso**:
  1. Acesse o link acima e faça login.
  2. Clique em **[Menu/Botão específico]**.
  3. Crie uma nova chave com a permissão **[Nome da Permissão]** e copie o valor gerado.
- **Onde Salvar**:
  - Abra o arquivo `.env` na raiz do projeto (ou `backend/.env`).
  - Adicione ou atualize a linha: `NOME_DA_VARIAVEL=sua_chave_aqui`
- **Comando de Teste**:
  - Execute `[comando não expositivo]` para validar a conexão.
```

3. Após a confirmação do usuário de que o segredo foi inserido no `.env` local (que deve constar no `.gitignore`), a IA retoma a execução autônoma.

---

## 9. Plataforma Visual Integrada (`dashboard.html` + `tasks.json` + `analytics.json`)

Para atender aos Princípios 2, 4, 5, 6 e 8 (acompanhamento visual com zero dispersão e dados reais):
1. **Aba 1: Sprint & Tarefas de Desenvolvimento (`tasks.json`)**:
   - Kanban interativo dividido nas colunas: Backlog, Em Desenvolvimento, Em Revisão/Auditoria e Concluído.
   - Stepper horizontal de 5 Marcos no topo indicando o avanço de cada fase.
   - Cada tarefa deve conter `id`, `title`, `description`, `status`, `milestone`, `tier`, `indicators` e `audit_confirmed`.
   - Atualizado em tempo real pela IA a cada avanço ou entrega de marco.
2. **Aba 2: Métricas do Produto & Growth (`analytics.json`)**:
   - KPIs de Usuários e Negócio: Usuários Ativos (DAU/MAU), Receita Recorrente (MRR), Taxa de Conversão e Eventos Disparados.
   - **Regra de Dados Reais**: É terminantemente proibido exibir métricas mockadas/inventadas. Quando `analytics.json` não existir ou estiver zerado, exibe-se um **Empty State informativo** orientando como conectar os eventos de telemetria da aplicação.
3. **Garantia de Leitura Imediata no Navegador (Bypass de CORS em `file://`)**:
   - *O Problema*: Navegadores modernos (Chrome, Edge, Brave) bloqueiam por padrão requisições `fetch()` locais quando o arquivo HTML é aberto com duplo-clique no Explorer (protocolo `file:///`).
   - *A Solução Obrigatória da IA*:
     1. **Regra de Sincronização Dupla**: Sempre que a IA atualizar o `tasks.json`, ela deve **obrigatoriamente gerar o arquivo espelho `tasks_data.js`** na raiz (`window.__TASKS_DATA__ = { ... };`). O mesmo se aplica ao `analytics.json` gerando `analytics_data.js`. Scripts locais carregam sem nenhuma restrição no protocolo `file://`.
     2. **Inicializador de 1 Clique (`abrir_dashboard.bat`)**: Manter sempre na raiz o arquivo executável `abrir_dashboard.bat`, que inicia um servidor local Python (`http://localhost:8000/dashboard.html`) com atualização dinâmica automática.
     3. **Fallback Drag & Drop / Carregador Manual**: O `dashboard.html` possui leitor nativo via `FileReader` e persistência em `localStorage`. Caso o usuário queira atualizar manualmente, basta arrastar o `tasks.json` para dentro da tela do dashboard.

---

## 10. Documentação Obrigatória & Roteiros de `/grill-me`

Todo projeto que utilize este framework deve conter os seguintes documentos na raiz ou pasta `docs/` (iniciados a partir de `templates/`):

| Documento | Finalidade | Roteiro `/grill-me` Embutido |
|---|---|---|
| **`NARRATIVE_STORYTELLING.md`** | A linha lógica e narrativa do projeto: contexto real, dor concreta, tese da solução, impacto prático e posicionamento | Perguntas diretas e práticas (uma por vez) acolhendo respostas em texto e áudios transcritos |
| **`VALUE_PROPOSITION_CANVAS.md`** | Fit problema-solução com amarração estrita 1:1 entre dores/aliviadores e ganhos/criadores | Perguntas de tarefas do cliente, dores reais e ganhos tangíveis |
| **`BUSINESS_MODEL_CANVAS.md`** | Modelo de negócios sistêmico com auditoria cruzada (Relacionamento x Canais, Atividades x Recursos x Parceiros) | Entrevista guiada passo a passo (8 perguntas sequenciais) cobrindo Segmentos, Moat, Jornada Antes/Durante/Depois, Canais, Monetização Dupla, Desdobramento em Atividades, Recursos, Parcerias e Custos |
| **`PRD.md`** | Requisitos funcionais (derivados das Atividades Principais), jornadas e catálogo de telemetria | Perguntas sobre fluxos de tela, regras de negócio e eventos de telemetria |
| **`DESIGN_SYSTEM_STITCH.md`** | Especificação visual, prompts Stitch e Direção de Arte unificada | Perguntas sobre estilo visual, direção de arte/imagens e telas principais |
| **`TECH_STACK.md`** | Arquitetura desacoplada (Front/Back Python), CLIs e servidores MCP | Perguntas sobre stack preferida, infraestrutura e automações |
| **`FINANCIAL_MODEL.md`** | Monetização dupla (Pix BR e Stripe Global), custos e CAC/LTV | Perguntas sobre precificação BRL/USD, planos e unit economics |
| **`SUMMARY.md`** | Resumo executivo em exatamente 1 parágrafo (Pitch de elevador) | Perguntas cirúrgicas de posicionamento rápido |
| **`DEPLOYMENT_GIT_PLAYBOOK.md`** | Branches, commits semânticos, PRs e checklist Go/No-Go | Padrões pré-definidos de controle de versão e deploy seguro |

---

## 11. Higiene Estrutural e Arquivo Mestre Canônico

1. **Arquivo Canônico Único**:
   - `AGENTS.md` (em letras maiúsculas na raiz) é o único arquivo mestre de diretrizes. Evite duplicatas como `agentes.md` para impedir dessincronização de versões.
2. **Organização Permanente de Arquivos**:
   - Mantenha a árvore de diretórios rigorosamente limpa e modular.
   - Nada de arquivos soltos na raiz sem categorização óbvia.
   - Separe código-fonte (`frontend/`, `backend/`), documentação (`docs/`), testes (`tests/`), scripts utilitários (`scripts/`) e recursos estáticos (`public/`).
3. **Sincronização de Documentação**:
   - Nenhuma alteração estrutural de código ou de regras de negócio deve ser finalizada sem a atualização correspondente no `PRD.md`, `TECH_STACK.md` ou `README.md`.

---

## 12. Checklist Rápido para a IA Antes de Concluir Qualquer Tarefa

- [ ] A entrevista de Linha Lógica e Narrativa foi conduzida passo a passo e formalizada em `docs/NARRATIVE_STORYTELLING.md`?
- [ ] O repositório Git local e o GitHub remoto privado via CLI (`gh repo create`) foram criados logo no Marco 1?
- [ ] O Canvas da Proposta de Valor foi preenchido com amarração estrita 1:1 entre dores/aliviadores e ganhos/criadores?
- [ ] O Business Model Canvas foi auditado com estratégias de Relacionamento (Antes/Durante/Depois) amarradas a Canais, e 100% das promessas convertidas em Atividades Principais e Recursos?
- [ ] Os requisitos funcionais do `PRD.md` derivam diretamente das Atividades Principais do Canvas sem alucinações?
- [ ] O desenvolvimento respeitou a divisão estrita por Marcos (sem execução megalomaníaca em turno único)?
- [ ] O ponto de parada estrito (*checkpoint*) foi respeitado ao final do marco atual com resumo executivo emitido?
- [ ] A etapa de design no Google Stitch e a Direção de Arte unificada foram realizadas antes de codificar a UI?
- [ ] Se imagens foram geradas, a fórmula padronizada de prompt e a coerência estética foram validadas?
- [ ] A arquitetura do backend respeitou o Python como padrão prioritário (ou emitiu o Cartão de Decisão caso contrário)?
- [ ] As CLIs e dependências necessárias para a stack foram verificadas e provisionadas?
- [ ] A tarefa foi executada de forma autônoma sem vazamento de dados sensíveis?
- [ ] O `tasks.json` e o espelho `tasks_data.js` foram devidamente atualizados com o marco (`milestone`), status e indicadores?
- [ ] O `dashboard.html` reflete o progresso real do projeto e do marco ativo (testável via `abrir_dashboard.bat` ou duplo-clique)?
- [ ] O resumo final apresentado ao Bruno é executivo, direto, visual e sem sobrecarga cognitiva?
