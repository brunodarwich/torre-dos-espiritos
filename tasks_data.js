window.TASKS_DATA = {
  "project": {
    "name": "Torre dos Espíritos — Tower Defense",
    "summary": "Animações de looping de espera (3 frames) e ataque fluido (4 frames) dos 3 heróis e 3 níveis entregues com sucesso. 31 testes Vitest aprovados e build compilado.",
    "version": "1.0.1",
    "last_updated": "2026-10-09",
    "metrics": {
      "total_tasks": 33,
      "completed_tasks": 31,
      "progress_percentage": 93.9
    }
  },
  "milestones": [
    {
      "id": "m1_fundacao",
      "title": "Marco 1: Fundação, Narrativa & Planejamento Sistêmico",
      "order": 1
    },
    {
      "id": "m2_design_arte",
      "title": "Marco 2: Design UI/UX & Direção de Arte",
      "order": 2
    },
    {
      "id": "m3_backend_core",
      "title": "Marco 3: Backend Core, APIs & Testes",
      "order": 3
    },
    {
      "id": "m4_frontend_ui",
      "title": "Marco 4: Frontend Phaser, Jogo & Integração",
      "order": 4
    },
    {
      "id": "m5_auditoria_growth",
      "title": "Marco 5: Auditoria Tier 3 & Publicação Play Store",
      "order": 5
    }
  ],
  "columns": [
    {
      "id": "todo",
      "title": "Backlog / A Fazer"
    },
    {
      "id": "in_progress",
      "title": "Em Desenvolvimento"
    },
    {
      "id": "review",
      "title": "Em Revisão & Auditoria"
    },
    {
      "id": "done",
      "title": "Concluído / Entregue"
    }
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
      "title": "Histórico: primeira arte dos três protetores",
      "description": "Primeiro conjunto visual preservado como histórico. Substituído pelos nove guardiões épicos da TASK-025.",
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
      "title": "Histórico: primeira arte das criaturas e chefe",
      "description": "Primeiro conjunto de inimigos preservado como histórico. A rodada épica da TASK-025 entrega quatro criaturas e duas fases do Colosso do Eclipse.",
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
      "status": "done",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Canvas renderizando a 60 FPS",
        "Estrutura modular de cenas"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-013",
      "title": "Sistema de Grade Livre & Posicionamento de Guias",
      "description": "Mecânica de grade 16x9, detecção de caminho, prévia de alcance e confirmação por toque mobile.",
      "status": "done",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Posicionamento fluido e touch-friendly",
        "Bloqueio de posicionamento sobre o caminho"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-014",
      "title": "Implementação dos 3 Guias & Mecânica de Ataque",
      "description": "Comportamentos do Prisma Solar, Véu de Aurora e Núcleo de Brasa com projéteis, dano em área e lentidão.",
      "status": "done",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "3 guias atacando com seus efeitos próprios",
        "Sistema de upgrade e venda a 70%"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-015",
      "title": "Sistema de Inimigos, Purificação & 3 Hordas",
      "description": "Ciclo das 4 criaturas, animação de purificação em luz e spawn das 3 hordas sequenciais.",
      "status": "done",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Inimigos se dissolvem em luz",
        "Progresso de hordas com botão Chamar Horda"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-016",
      "title": "Colosso do Eclipse e cena final",
      "description": "Batalha do chefe em duas fases, invocação de larvas e purificação. Arte atual integrada na TASK-024.",
      "status": "done",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Fase 1 e Fase 2 funcionais",
        "Cena de desfecho emocional renderizada"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-017",
      "title": "HUD, Power-ups & Loja de Cristais",
      "description": "Interface responsiva completa com barras de status, botões de 4 power-ups e modais.",
      "status": "done",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Power-ups consumíveis acionáveis",
        "HUD adaptável a mobile e desktop"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-018",
      "title": "Simulador de Balanceamento 'Vencível Grátis'",
      "description": "Teste automatizado que roda a fase com estratégia base sem power-ups e valida vitória.",
      "status": "done",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Simulação confirma 100% de vitória no modo normal sem compras",
        "Garantia anti-pay-to-win"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-019",
      "title": "Empacotamento Android com Capacitor & Teste APK",
      "description": "Configuração do Capacitor 8, geração do projeto Android nativo, setup do JDK 21 e compilação do APK de teste.",
      "status": "done",
      "milestone": "m5_auditoria_growth",
      "tier": "tier3_reviewer",
      "indicators": [
        "Projeto Android gerado e sincronizado com Capacitor 8",
        "APK debug compilado com sucesso (35.18 MB) em app/build/outputs/apk/debug/app-debug.apk",
        "Orientação landscape travada no AndroidManifest.xml"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-020",
      "title": "Auditoria Geral de Critérios & Dashboard Final",
      "description": "Revisão Tier 3 de código, telemetria real em analytics.json, verificação de todos os marcos e fechamento do ciclo.",
      "status": "done",
      "milestone": "m5_auditoria_growth",
      "tier": "tier3_reviewer",
      "indicators": [
        "29 tarefas de escopo auditadas e confirmadas",
        "Dashboard refletindo dados reais com bypass CORS para file://",
        "24 testes pytest de backend e 16 testes Vitest de frontend 100% verdes",
        "APK Android pronto para distribuição e testes locais"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-021",
      "title": "Direção de arte: Santuário e guardiões épicos",
      "description": "Direção atual de humanoides fantásticos sólidos, sem referências religiosas; geração seguida de integração autorizada por Bruno.",
      "status": "done",
      "milestone": "m2_design_arte",
      "tier": "tier1_frontier",
      "indicators": [
        "Armaduras inventadas e três famílias com silhuetas próprias",
        "Narrativa, PRD e direção sincronizados",
        "Escopo desta rodada: 18 imagens novas, 3 retratos e 5 camadas reutilizadas"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08"
    },
    {
      "id": "TASK-022",
      "title": "Primeira prova visual — histórico encerrado",
      "description": "Oito ativos iniciais preservados. Bruno pediu corpos sólidos; os protetores abstratos foram substituídos nesta rodada. Ambiente reaproveitado com pendência de resolução registrada separadamente.",
      "status": "done",
      "milestone": "m2_design_arte",
      "tier": "tier3_reviewer",
      "indicators": [
        "Fontes e prompts históricos preservados",
        "Caminho de 34 células e alfa verificados",
        "Revisão solicitada por Bruno incorporada; não equivale a aprovação estética final"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-023",
      "title": "Expansão opcional: ícones e efeitos ilustrados",
      "description": "Itens restantes do catálogo anterior ficam fora da rodada atual. Não bloqueiam o teste local dos guardiões épicos.",
      "status": "todo",
      "milestone": "m2_design_arte",
      "tier": "tier2_fast",
      "indicators": [
        "Escopo e autorização de nova rodada definidos",
        "Ícones, efeitos e materiais adicionais produzidos sob a direção atual"
      ],
      "audit_confirmed": false,
      "created_at": "2026-10-08"
    },
    {
      "id": "TASK-024",
      "title": "Integrar guardiões épicos na partida",
      "description": "18 sprites, retratos, ambiente e caminho integrados por autorização direta. IDs e valores de balanceamento preservados.",
      "status": "done",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Nove níveis e quatro inimigos usam texturas próprias",
        "Chefe muda de imagem na fase 2; vitória usa espírito purificado",
        "Rota, proporções, sombras e textos públicos atualizados",
        "Build aprovado e regras numéricas iguais ao HEAD"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-025",
      "title": "Gerar 18 sprites épicos e 3 retratos",
      "description": "Guardiões N1/N2/N3, quatro criaturas, duas fases do chefe, purificado, fenda e núcleo. Fontes, prompts, dimensões, alfa e ancoragens registrados.",
      "status": "done",
      "milestone": "m2_design_arte",
      "tier": "tier2_fast",
      "indicators": [
        "18 PNGs com alfa real e cantos transparentes",
        "Protetores e evoluções mantêm identidade e escala",
        "512×512; chefe 1024×1024; retratos derivados",
        "Manifesto e folhas de comparação preservados"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-026",
      "title": "QA do jogo local e auditoria da nova arte",
      "description": "Build, balanceamento e revisão Tier 3 aprovados. Fluxos interativos, capturas e limitações na auditoria: Autoplay normal perdeu na horda 3; quatro hordas percorridas com recursos extras apenas no QA.",
      "status": "done",
      "milestone": "m4_frontend_ui",
      "tier": "tier3_reviewer",
      "indicators": [
        "Build e 2 testes de balanceamento aprovados",
        "Seleção, três níveis, venda e reinícios testados",
        "Fases do chefe, invocações, purificação, vitória e derrota testadas",
        "Hordas e layout em 1280×720 e 1920×1080 conferidos",
        "Captura e endereço local entregues"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-027",
      "title": "Resolução nativa final de cosmos e piso",
      "description": "Cenários atuais têm 1672×941 nativos. Regenerar futuramente no alvo 2560×1440; não ampliar para simular detalhe.",
      "status": "todo",
      "milestone": "m2_design_arte",
      "tier": "tier2_fast",
      "indicators": [
        "Cosmos e piso gerados nativamente no alvo",
        "Encaixe e contraste preservados na substituição"
      ],
      "audit_confirmed": false,
      "created_at": "2026-10-08"
    },
    {
      "id": "TASK-028",
      "title": "Logo e arte profissional da tela inicial",
      "description": "Logo e abertura criados; aplicação ao jogo solicitada por Bruno em 08/10/2026. Arquivos reorganizados em assets/brand e assets/screens/home. Transparência e dimensões conferidas.",
      "status": "done",
      "milestone": "m2_design_arte",
      "tier": "tier1_frontier",
      "indicators": [
        "Nome e transparência conferidos",
        "Fontes e prompts preservados",
        "Aplicação autorizada por Bruno"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-029",
      "title": "Artes de vitória, derrota e carregamento",
      "description": "Três artes geradas e revisadas visualmente, com aplicação ao jogo solicitada por Bruno em 08/10/2026. PNGs organizados em assets/screens/loading e assets/screens/results.",
      "status": "done",
      "milestone": "m2_design_arte",
      "tier": "tier1_frontier",
      "indicators": [
        "Três PNGs nativos legíveis, identidade coerente",
        "Prompts registrados",
        "Aplicação autorizada por Bruno"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-030",
      "title": "Menu, carregamento com dicas e cards de resultado",
      "description": "Logo, home, carregamento com dicas e cards de resultado integrados. Cinco artes organizadas por finalidade. Build e 8 testes aprovados; QA desktop/retrato/paisagem, replay/home e falha/retry concluídos; auditoria Tier 3 aprovada.",
      "status": "done",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Home com logo, som e instruções; cinco artes organizadas",
        "Loader real com dicas, entrada após processamento e recuperação de erro",
        "Vitória/derrota com arte e números reais da partida",
        "Replay e retorno ao menu sem callbacks antigos; velocidade alterna uma vez",
        "Build e 8 testes aprovados; QA nos viewports 1904×985,390×844,844×390",
        "Auditoria independente Tier 3 aprovada; docs/SCREEN_FLOW_AUDIT.md"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-031",
      "title": "Expansão para 10 Hordas, Mini-Chefe Arauto e Colosso em 3 Fases",
      "description": "Progressão em 3 Atos com 10 hordas dinâmicas, ritmo híbrido (8s nas hordas 1-4, 15s nas 5-10), Mini-Chefe Arauto (1200 HP) nas hordas 5 e 9, e Colosso do Eclipse (3500 HP) em 3 fases dinâmicas (Carapaça 20%, Fúria de Silêncio +30% vel, e Corrida Crítica +60% vel). Balanceamento 100% vencível grátis comprovado.",
      "status": "done",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "10 hordas configuradas no waves.json com diálogos narrativos e pacing por atos",
        "Arauto implementado no spirits.json e GameScene.ts com 1200 HP e maxSlow 0.25",
        "Colosso calibrado com 3500 HP e mecânicas das 3 fases no Boss.ts e GameScene.ts",
        "WaveManager com ritmo híbrido (8s nas hordas 1-4 e 15s a partir da horda 5)",
        "Simulação de balanceamento 100/100 vitórias no modo normal sem compras (16 testes verdes em 4 arquivos)",
        "Build TypeScript/Vite compilando com 100% de sucesso"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-08",
      "completed_at": "2026-10-08"
    },
    {
      "id": "TASK-032",
      "title": "Deseleção de herói ao clicar fora no mapa e FX intensos por horda",
      "description": "Deseleção tátil ao tocar em células vazias ou fundo do mapa, fechando o painel de inspeção. Sistema de FX progressivo por hordas com partículas ambientais em 3 atos, pulsação/vórtice na fenda, abalos sísmicos crescentes, áudio surge e alarme de aproximação ao leito. 27 testes Vitest 100% aprovados.",
      "status": "done",
      "milestone": "m4_frontend_ui",
      "tier": "tier2_fast",
      "indicators": [
        "Deseleção tátil de protetores ao clicar em qualquer ponto vazio do mapa ou caminho",
        "Fechamento automático do painel e remoção imediata dos anéis de alcance",
        "Ambiência escalável com partículas dinâmicas em 3 atos (Crepúsculo, Tempestade e Eclipse)",
        "Vórtice giratório da fenda e pulso expansivo no spawn de espíritos",
        "Tremores de tela e surge de áudio procedural que intensificam da horda 1 à 10",
        "Alarme visual e sonoro quando espíritos se aproximam perigosamente do leito",
        "Suporte total à configuração de acessibilidade 'Reduzir Partículas'",
        "27 testes Vitest aprovados e compilação de produção (build) 100% bem-sucedida"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-09",
      "completed_at": "2026-10-09"
    },
    {
      "id": "TASK-033",
      "title": "Animações em Looping de Espera (3 frames) e Ataque Fluido (4 frames)",
      "description": "Geração das imagens reais para o fluxo de animação com modelos de arte (generate_image), extração de 63 quadros individuais e 9 spritesheets padronizados (3584x512) para os 3 heróis nos 3 níveis. Looping contínuo de espera (Idle de 3 quadros com respiração e pulso solar/aurora/magma) e animação fluida de ataque (4 quadros com vórtices de wind-up, disparo de raio estelar, corte de lâmina crescente e punho vulcânico, follow-through e retorno suave à base). Pés rigorosamente ancorados na linha de base com zero jitter. Integração reativa no BootScene e Guide.ts, 31 testes Vitest aprovados e preview interativo em hero_animations_preview.html.",
      "status": "done",
      "milestone": "m2_design_arte",
      "tier": "tier2_fast",
      "indicators": [
        "63 frames PNG com canal alfa real e 9 spritesheets gerados com sucesso",
        "Imagens reais do fluxo de animação geradas e preservadas em source_flows/",
        "Looping contínuo de espera (Idle de 3 quadros a 4 FPS) para as 9 variantes",
        "Sequência fluida de ataque (Attack de 4 quadros a 10 FPS) com retorno ao Idle",
        "Pés rigorosamente alinhados na linha de base com zero deslocamento indesejado",
        "Integração nativa no Phaser 3 via BootScene.ts e Guide.ts (com trava de bobbing durante ataque)",
        "Página de teste e visualização interativa em public/guardian-art/hero_animations_preview.html",
        "31 testes Vitest aprovados e compilação de produção (build) 100% concluída"
      ],
      "audit_confirmed": true,
      "created_at": "2026-10-09",
      "completed_at": "2026-10-09"
    }
  ]
};
