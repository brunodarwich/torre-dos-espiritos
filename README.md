# 🕯️ Torre dos Espíritos — Tower Defense

Jogo 2D de defesa de torres de fantasia astral para **Web (desktop e celular)** e **Android**.

No **Santuário do Sonho**, três guardiões épicos de corpos sólidos — **Prisma Solar**, **Véu de Aurora** e **Núcleo de Brasa** — protegem um núcleo luminoso e purificam perturbações astrais até o confronto com o Colosso do Eclipse. A nova arte está integrada à partida local; o QA interativo foi concluído e a aprovação estética final do Bruno permanece pendente.

---

## 🎯 Status do Projeto

- **Vitória, derrota e carregamento**: artes em `frontend/public/assets/screens/results/` e `screens/loading/`, integradas aos cards de resultado e carregamento com dicas. Resultados usam números reais da partida. Prompts em `docs/SCREEN_STATE_ART.md`.

- **Menu e logo**: logo transparente em `frontend/public/assets/brand/` e abertura em `screens/home/`. Tela inicial com Jogar, Como jogar e controle de som. Depois do carregamento real, “Entrar no sonho” inicia a partida. Organização em `frontend/public/assets/README.md`; especificação em `docs/SCREEN_FLOW_IMPLEMENTATION.md`.

- **Entrega visual**: 18 sprites novos + 3 retratos derivados + 5 camadas de ambiente integrados. Inclui os 9 níveis dos protetores, 4 inimigos, chefe em 2 fases, purificado, fenda e núcleo.
- **Partida local**: [Abrir jogo](http://localhost:5173/). Para iniciar: abra um terminal em `frontend/` e execute `npm run dev -- --host 127.0.0.1 --port 5173`.
- **Prova de arte no jogo**: [Ver todas as imagens](http://localhost:5173/?artPreview=1). Exclusiva do servidor de desenvolvimento, estática e sem envio de pontuações.
- **QA interativo**: [Abrir modo QA](http://localhost:5173/?qa=1). Botões para recursos de teste, chefe/fase 2, purificação, vitória, derrota e reinício; estado JSON visível. Sem envio ao ranking e sem mudanças na economia da partida normal.
- **Verificação atual**: build e 2 testes de balanceamento aprovados; QA de navegador concluído.
- **Ativos e registros**: `frontend/public/assets/astral/`, `art_manifest.json` e `environment_manifest.json`; produção documentada em `docs/SANCTUARY_ART_PRODUCTION.md`.
- **Resolução**: PNG RGBA de 512 × 512 para sprites comuns e 1024 × 1024 para chefe. Cosmos e piso permanecem nativos em 1672 × 941, abaixo da meta de 2560 × 1440; não foram ampliados para simular detalhe.
- **Encaixe do caminho**: rota e ancoragens do manifesto são consumidas pelo Phaser, mantendo movimento e balanceamento atuais.
- **Dashboard Visual**: dê duplo-clique em `abrir_dashboard.bat` para acompanhar progresso real. Aprovação estética final ainda pendente.
- **Repositório GitHub**: privado em `https://github.com/brunodarwich/torre-dos-espiritos`.

---

## 🏗️ Arquitetura & Stack

- **Frontend**: Phaser 3 + TypeScript + Vite (empacotado para Android com Capacitor).
- **Backend**: Python 3.13 + FastAPI + Pydantic + Uvicorn (gerenciado com `uv`).
- **Banco de Dados**: PostgreSQL (Neon / Supabase) com SQLModel.
- **Monetização**: Google Play Billing (pacotes de Cristais para power-ups) + AdMob recompensado opcional.

---

## 📚 Documentação do Projeto

- [`docs/NARRATIVE_STORYTELLING.md`](docs/NARRATIVE_STORYTELLING.md): Narrativa e linha lógica do jogo.
- [`docs/VALUE_PROPOSITION_CANVAS.md`](docs/VALUE_PROPOSITION_CANVAS.md): Canvas de Proposta de Valor (fit 1:1).
- [`docs/BUSINESS_MODEL_CANVAS.md`](docs/BUSINESS_MODEL_CANVAS.md): Modelo de negócios sistêmico e atividades operacionais.
- [`PRD.md`](PRD.md): Documento de Requisitos do Produto & Game Design Document (GDD).
- [`TECH_STACK.md`](TECH_STACK.md): Arquitetura técnica, contratos de API e dependências.
- [`FINANCIAL_MODEL.md`](FINANCIAL_MODEL.md): Projeção de receitas, custos (~R$ 45/mês) e ponto de equilíbrio.
- [`docs/DESIGN_SYSTEM_STITCH.md`](docs/DESIGN_SYSTEM_STITCH.md): Design tokens e prompts para o Stitch.
- [`docs/DEPLOYMENT_GIT_PLAYBOOK.md`](docs/DEPLOYMENT_GIT_PLAYBOOK.md): Estratégia de branches e deploy.
- [`SUMMARY.md`](SUMMARY.md): Pitch executivo em 1 parágrafo.

## Verificação local da entrega

QA interativo concluído: compras de protetores, 9 texturas/evoluções, venda, fases e invocações do chefe, purificação, vitória/derrota, reinícios e as 5 hordas. Layout conferido em 1280 × 720 e 1920 × 1080. Auditoria em `docs/GUARDIAN_ART_AUDIT.md`; capturas em `public/guardian-art/guardioes-jogo-1920.jpg` e `public/guardian-art/partida-guardioes.jpg`.

**Balanceamento:** os 2 testes automatizados do simulador comprovam vitória 100/100 na dificuldade Normal sem uso de power-ups pagos através das 5 hordas completas. Build final aprovado; aprovação estética final do Bruno permanece pendente.
