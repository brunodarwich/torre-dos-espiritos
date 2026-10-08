# 🕯️ Torre dos Espíritos — Tower Defense

Jogo 2D de defesa de torres no mundo espiritual brasileiro para **Web (desktop e celular)** e **Android**.

Enquanto uma pessoa dorme, seu corpo físico em projeção astral atrai espíritos perturbados. Três guias espirituais (**Mentor de Luz**, **Benzedeira** e **Pajé**) protegem seu sono e, em vez de destruírem as criaturas, **purificam cada espírito**, devolvendo-os à luz até o confronto emocionante com o Obsessor-Mor.

---

## 🎯 Status do Projeto

- **Marco Atual**: **Marco 1 Concluído** (Fundação, Narrativa, BMC, PRD/GDD, Tech Stack e Playbook).
- **Repositório GitHub**: Privado em `https://github.com/brunodarwich/torre-dos-espiritos`
- **Dashboard Visual**: Dê um duplo-clique no executável `abrir_dashboard.bat` para acompanhar o Kanban e as métricas.

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
