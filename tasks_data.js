window.__TASKS_DATA__ = {
  "project": {
    "name": "Torre dos Espíritos — Tower Defense",
    "summary": "Tower defense 2D no mundo astral com identidade cultural brasileira. 3 guias espirituais protegem uma pessoa adormecida contra hordas de espíritos perturbados que são purificados pela luz.",
    "version": "1.0.0",
    "last_updated": "2026-10-08",
    "metrics": {
      "total_tasks": 20,
      "completed_tasks": 11,
      "progress_percentage": 55
    }
  },
  "milestones": [
    { "id": "m1_fundacao", "title": "Marco 1: Fundação, Narrativa & Planejamento Sistêmico", "order": 1 },
    { "id": "m2_design_arte", "title": "Marco 2: Design UI/UX & Direção de Arte", "order": 2 },
    { "id": "m3_backend_core", "title": "Marco 3: Backend Core, APIs & Testes", "order": 3 },
    { "id": "m4_frontend_ui", "title": "Marco 4: Frontend Phaser, Jogo & Integração", "order": 4 },
    { "id": "m5_auditoria_growth", "title": "Marco 5: Auditoria Tier 3 & Publicação Play Store", "order": 5 }
  ],
  "columns": [
    { "id": "todo", "title": "Backlog / A Fazer" },
    { "id": "in_progress", "title": "Em Desenvolvimento" },
    { "id": "review", "title": "Em Revisão & Auditoria" },
    { "id": "done", "title": "Concluído / Entregue" }
  ],
  "tasks": [
    {
      "id": "TASK-001",
      "title": "Entrevista /grill-me & Consolidação da Narrativa",
      "description": "Entrevista em 13 perguntas elucidando visão, tom de purificação, guias, plataformas e elaboração do NARRATIVE_STORYTELLING.md.",
      "status": "done",
      "milestone": "m1_fundacao",
      "tier": "tier1_frontier",
      "indicators": [
        "13 perguntas respondidas e alinhadas",
        "docs/NARRATIVE_STORYTELLING.md criado com premissa clara"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-002",
      "title": "Versionamento no GitHub via CLI (Repositório Privado)",
      "description": "Criação do repositório remoto privado torre-dos-espiritos no GitHub via gh CLI e preservação do framework.",
      "status": "done",
      "milestone": "m1_fundacao",
      "tier": "tier1_frontier",
      "indicators": [
        "Repositório criado como privado",
        "Branches e remotos configurados"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-003",
      "title": "Canvas da Proposta de Valor (Fit 1:1)",
      "description": "Elaboração do docs/VALUE_PROPOSITION_CANVAS.md amarrando 6 dores e 6 ganhos diretamente a funcionalidades do jogo.",
      "status": "done",
      "milestone": "m1_fundacao",
      "tier": "tier1_frontier",
      "indicators": [
        "Amarração biunívoca 1:1 sem dores órfãs",
        "Definição da mecânica de purificação sem violência"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-004",
      "title": "Business Model Canvas Sistêmico & PRD/GDD",
      "description": "Entrevista BMC de 8 perguntas, desdobramento das 11 atividades operacionais, criação de PRD.md, TECH_STACK.md, FINANCIAL_MODEL.md e SUMMARY.md.",
      "status": "done",
      "milestone": "m1_fundacao",
      "tier": "tier1_frontier",
      "indicators": [
        "11 Atividades Principais desdobradas no BMC",
        "GDD completo estruturado dentro do PRD",
        "Modelo financeiro com unit economics e break-even"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-005",
      "title": "Design System Stitch & Prompts de UI",
      "description": "Criação do docs/DESIGN_SYSTEM_STITCH.md com tokens visuais, paleta de cores e prompts de interface.",
      "status": "done",
      "milestone": "m2_design_arte",
      "tier": "tier1_frontier",
      "indicators": [
        "Design tokens definidos para o HUD",
        "Prompts prontos para o Stitch"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-006",
      "title": "Direção de Arte & Geração de Ativos dos 3 Guias",
      "description": "Geração das ilustrações conceituais dos guias (Mentor, Benzedeira, Pajé) nos 3 níveis visuais em estilo HQ aquarela.",
      "status": "done",
      "milestone": "m2_design_arte",
      "tier": "tier2_fast",
      "indicators": [
        "Imagens dos guias com identidade coesa",
        "Arquivos salvos em diretório de assets"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-007",
      "title": "Geração de Ativos dos Espíritos & Chefão",
      "description": "Ilustrações de Larva Astral, Zombeteiro, Obsessor, Sombra de Mágoa e do Obsessor-Mor (Fases 1 e 2).",
      "status": "done",
      "milestone": "m2_design_arte",
      "tier": "tier2_fast",
      "indicators": [
        "Todos os 5 tipos de inimigos ilustrados",
        "Cena final do espírito arrependido ilustrada"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-008",
      "title": "Setup do Backend FastAPI com uv",
      "description": "Estruturação de backend/ com FastAPI, Pydantic, Uvicorn e CORS configurado.",
      "status": "done",
      "milestone": "m3_backend_core",
      "tier": "tier2_fast",
      "indicators": [
        "Servidor rodando e documentação /docs acessível",
        "Ambiente gerenciado com uv"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-009",
      "title": "Modelos de Dados & Banco Postgres/SQLite",
      "description": "Criação de modelos SQLModel para Jogadores, Pontuações, Transações de Cristais e Telemetria.",
      "status": "done",
      "milestone": "m3_backend_core",
      "tier": "tier2_fast",
      "indicators": [
        "Tabelas criadas e migradas",
        "Validações Pydantic ativas"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-010",
      "title": "Rotas de Ranking Semanal & Validação de Compras",
      "description": "Implementação das rotas /scores, /scores/weekly, /wallet e /purchases com validações de segurança.",
      "status": "done",
      "milestone": "m3_backend_core",
      "tier": "tier2_fast",
      "indicators": [
        "Top 100 com ordenação correta",
        "Anti-fraude básico em submissão de pontuação"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-011",
      "title": "Testes Automatizados de Backend (pytest)",
      "description": "Bateria de testes de integração e rotas no backend com 100% de aprovação.",
      "status": "done",
      "milestone": "m3_backend_core",
      "tier": "tier2_fast",
      "indicators": [
        "pytest passando com zero falhas",
        "Rotas críticas de pontuação e compras testadas"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-012",
      "title": "Setup do Projeto Phaser 3 + TypeScript + Vite",
      "description": "Inicialização do frontend/ com template Phaser 3, TypeScript e Vite configurados.",
      "status": "todo",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Canvas renderizando a 60 FPS",
        "Estrutura modular de cenas"
      ],
      "audit_confirmed": false,
      "created_at": "2026-10-08"
    },
    {
      "id": "TASK-013",
      "title": "Sistema de Grade Livre & Posicionamento de Guias",
      "description": "Mecânica de grade 16x9, detecção de caminho, prévia de alcance e confirmação por toque mobile.",
      "status": "todo",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Posicionamento fluido e touch-friendly",
        "Bloqueio de posicionamento sobre o caminho"
      ],
      "audit_confirmed": false,
      "created_at": "2026-10-08"
    },
    {
      "id": "TASK-014",
      "title": "Implementação dos 3 Guias & Mecânica de Ataque",
      "description": "Comportamentos do Mentor de Luz, Benzedeira e Pajé com projéteis, área e lentidão.",
      "status": "todo",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "3 guias atacando com seus efeitos próprios",
        "Sistema de upgrade e venda a 70%"
      ],
      "audit_confirmed": false,
      "created_at": "2026-10-08"
    },
    {
      "id": "TASK-015",
      "title": "Sistema de Inimigos, Purificação & 3 Hordas",
      "description": "Ciclo das 4 criaturas, animação de purificação em luz e spawn das 3 hordas sequenciais.",
      "status": "todo",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Inimigos se dissolvem em luz",
        "Progresso de hordas com botão Chamar Horda"
      ],
      "audit_confirmed": false,
      "created_at": "2026-10-08"
    },
    {
      "id": "TASK-016",
      "title": "Chefão Obsessor-Mor & Cena Final",
      "description": "Batalha do chefão em 2 fases, invocação de larvas e cinemática HQ de redenção.",
      "status": "todo",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Fase 1 e Fase 2 funcionais",
        "Cena de desfecho emocional renderizada"
      ],
      "audit_confirmed": false,
      "created_at": "2026-10-08"
    },
    {
      "id": "TASK-017",
      "title": "HUD, Power-ups & Loja de Cristais",
      "description": "Interface responsiva completa com barras de status, botões de 4 power-ups e modais.",
      "status": "todo",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Power-ups consumíveis acionáveis",
        "HUD adaptável a mobile e desktop"
      ],
      "audit_confirmed": false,
      "created_at": "2026-10-08"
    },
    {
      "id": "TASK-018",
      "title": "Simulador de Balanceamento 'Vencível Grátis'",
      "description": "Teste automatizado que roda a fase com estratégia base sem power-ups e valida vitória.",
      "status": "todo",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Simulação confirma 100% de vitória no modo normal sem compras",
        "Garantia anti-pay-to-win"
      ],
      "audit_confirmed": false,
      "created_at": "2026-10-08"
    },
    {
      "id": "TASK-019",
      "title": "Empacotamento Android com Capacitor & Teste APK",
      "description": "Configuração do Capacitor, geração do projeto Android e compilação do APK de teste.",
      "status": "todo",
      "milestone": "m5_auditoria_growth",
      "tier": "tier3_reviewer",
      "indicators": [
        "Projeto Android gerado e sincronizado",
        "APK instalável e funcional a 60 FPS"
      ],
      "audit_confirmed": false,
      "created_at": "2026-10-08"
    },
    {
      "id": "TASK-020",
      "title": "Auditoria Geral de Critérios & Dashboard Final",
      "description": "Revisão Tier 3 de código, telemetria real conectada no analytics.json e fechamento do ciclo.",
      "status": "todo",
      "milestone": "m5_auditoria_growth",
      "tier": "tier3_reviewer",
      "indicators": [
        "20 tarefas auditadas e confirmadas",
        "Dashboard refletindo dados reais"
      ],
      "audit_confirmed": false,
      "created_at": "2026-10-08"
    }
  ]
};
