# PRD + GDD — Torre dos Espíritos

> **Status**: Em revisão (aguardando validação do Bruno no checkpoint do Marco 1)
> **Versão**: 1.0.0 · **Responsável**: Bruno / Agente de IA · **Última atualização**: 2026-10-08
> **Rastreabilidade**: cada requisito aponta para a Atividade Principal (ATIV) do [BMC](docs/BUSINESS_MODEL_CANVAS.md) e para a dor/ganho do [Canvas de Valor](docs/VALUE_PROPOSITION_CANVAS.md).

---

## 1. Visão do Produto

Tower defense 2D gratuito para **web (desktop e celular)** e **Android**, passado no **mundo astral**. Enquanto uma pessoa dorme, três guias espirituais brasileiros (**Mentor de Luz, Benzedeira e Pajé**) protegem seu corpo adormecido de espíritos perturbados, que são **purificados** em vez de destruídos.

- **Oportunidade**: não existe tower defense de qualidade com identidade espiritual brasileira e monetização justa.
- **Proposta Central**: uma partida de ~10 minutos, estratégica, bonita e emocionante, vencível sem pagar.

---

## 2. Persona & Jornada

### Persona: "Camila, 29"
Analista administrativa, espiritualista, joga no Android no ônibus e antes de dormir. Gosta de jogos bonitos e "do bem"; desinstala apps com anúncio forçado.

### Happy Path
1. **Descoberta**: vê um Reel com espíritos virando luz → toca no link.
2. **Prova**: joga no navegador em < 10 s, sem cadastro.
3. **Ativação (Aha)**: primeira purificação em ≤ 30 s, guiada por balões de HQ.
4. **Engajamento**: vence as 3 hordas, enfrenta o Obsessor-Mor e assiste à cena final.
5. **Cadastro opcional**: após a 1ª vitória, "Entre com Google para aparecer no ranking".
6. **Monetização**: no Modo Desafio, usa Cristais em power-ups; compra um pacote ou assiste a um anúncio.
7. **Indicação**: compartilha a imagem "página de HQ" da vitória.

---

## 3. Game Design Document (GDD)

### 3.1 Loop Central
```mermaid
flowchart LR
  A["Ganhar Essência"] --> B["Posicionar / evoluir guias na grade"]
  B --> C["Purificar espíritos da horda"]
  C --> A
  C --> D{"Horda vencida?"}
  D -- "sim" --> E["Próxima horda / Chefão"]
  D -- "Luz = 0" --> F["Pessoa acorda: Derrota"]
```

### 3.2 Regras Gerais
- **Orientação**: paisagem (landscape), resolução lógica 1280×720 com escala responsiva.
- **Mapa**: 1 mapa ("O Quarto Astral"): grade de **16 × 9 células** (80 px lógicos). Caminho sinuoso fixo da borda (portal sombrio) até a cama da pessoa adormecida.
- **Grade livre (RF-02)**: qualquer célula fora do caminho e sem obstáculos pode receber 1 guia. Toque mostra prévia do alcance e custo; segundo toque confirma.
- **Vida**: a pessoa adormecida tem **20 de Luz**. Cada espírito que chega à cama subtrai Luz (Larva 1, Zombeteiro 1, Obsessor 2, Sombra 2, Chefão = derrota imediata).
- **Moeda da partida**: **Essência**. Início: 250. Cada espírito purificado solta Essência; bônus ao iniciar a horda antes do tempo ("Chamar horda": +10% Essência).
- **Velocidade**: botões 1× / 2× e pausa.

### 3.3 Guias Espirituais (torres)

| Guia | Papel | Nível | Custo | Dano | Cadência | Alcance | Efeito especial |
|---|---|---|---|---|---|---|---|
| ✨ **Mentor de Luz** | Dano rápido em 1 alvo | 1 (humano) | 100 | 10 | 1,0/s | 2,5 cél. | Raio de luz |
| | | 2 (aura) | +150 | 18 | 1,2/s | 3,0 cél. | Raio mais intenso |
| | | 3 (astral) | +250 | 26 | 1,4/s | 3,5 cél. | Raio salta para até 3 alvos (−30% por salto) |
| 🌿 **Benzedeira** | Controle | 1 | 125 | 3 | 0,8/s | 2,0 cél. | Ramo de arruda: −30% velocidade por 2 s (1 alvo) |
| | | 2 | +175 | 5 | 0,8/s | 2,5 cél. | Lentidão em área (raio 1 cél.): −40% |
| | | 3 | +275 | 8 | 0,8/s | 3,0 cél. | Oração: a cada 6 s paralisa por 1 s e aplica +25% de dano recebido |
| 🪶 **Pajé** | Dano em área | 1 | 150 | 14 (área 1 cél.) | 0,5/s | 2,0 cél. | Fumaça de ervas |
| | | 2 | +200 | 22 | 0,55/s | 2,5 cél. | Fumaça persiste 2 s no chão (dano contínuo 5/s) |
| | | 3 | +300 | 34 (área 1,5 cél.) | 0,6/s | 3,0 cél. | Círculo de fogo ancestral |

- **Evolução visual**: Nv1 humano → Nv2 com aura → Nv3 forma astral (Marco 2).
- **Venda**: devolve **70%** do total investido.
- **Prioridade de alvo**: "Primeiro" (padrão) / "Mais forte" — alternável no painel do guia.

> Valores **provisórios**, calibrados no Marco 4 com simulação automatizada (RF-14).

### 3.4 Espíritos Perturbados (inimigos)

| Espírito | Vida | Velocidade | Essência | Traço |
|---|---|---|---|---|
| 🐛 Larva Astral | 30 | Rápida (1,6 cél/s) | 5 | Vem em bando |
| 😜 Zombeteiro | 70 | Média (1,1) | 10 | A cada 4 s dá um "pulo" de 1 célula à frente |
| 👤 Obsessor | 220 | Lenta (0,6) | 25 | Resistente (−20% de dano em área) |
| 🌫️ Sombra de Mágoa | 140 | Média (0,9) | 20 | **Imune a lentidão** (exige Mentor/Pajé) |

**Purificação (RF-05)**: ao zerar a vida, o espírito para, fica branco-dourado, se dissolve em partículas e sobe como luz. A Essência voa até o contador.

### 3.5 Hordas

| Horda | Composição | Objetivo de design |
|---|---|---|
| **1: "Os Primeiros Sussurros"** | 20 Larvas em 3 grupos | Tutorial (balões de HQ) |
| **2: "Risos na Escuridão"** | 25 Larvas + 10 Zombeteiros | Introduz pulo, valoriza Benzedeira |
| **3: "O Peso das Mágoas"** | 20 Larvas + 12 Zombeteiros + 6 Obsessores + 6 Sombras | Exige os 3 papéis combinados |
| **Chefão: O Obsessor-Mor** | Ver 3.6 | Clímax emocional |

Intervalo entre hordas: 15 s (ou "Chamar agora").

### 3.6 Chefão: O Obsessor-Mor (RF-07)
- **Vida**: 3.000 · **Velocidade**: 0,4 cél/s · imune a paralisia (aceita lentidão de no máximo −20%).
- **Fase 1 (100–50%)**: a cada 25% de vida perdida, solta **6 Larvas Astrais**.
- **Fase 2 (< 50%)**: tela escurece levemente, velocidade +50%, aura que **apaga** temporariamente (3 s) o guia mais próximo a cada 8 s.
- **Final (RF-08)**: ao ser purificado, a sombra se desfaz e revela um **espírito humano arrependido**, que agradece e sobe como luz. A pessoa adormecida sorri; amanhece. Cena curta (≤ 20 s, pulável) em quadros de HQ.

### 3.7 Power-ups (RF-09), pagos em Cristais

| Power-up | Efeito | Custo | Limite |
|---|---|---|---|
| 🛡️ Escudo do Anjo da Guarda | +5 de Luz (máx. 20) | 30 Cristais | 1× por horda |
| ✨ Chuva de Luz | 80 de dano em todos os espíritos na tela (chefão: 300) | 40 | 1× por horda |
| ⏳ Sono Profundo | Congela todos os inimigos por 5 s (chefão: 2 s) | 35 | 1× por horda |
| ⚡ Fervor | Guias atacam 2× mais rápido por 10 s | 35 | 1× por horda |

**Regra "vencível grátis"**: a dificuldade Normal é balanceada para vitória **sem** power-ups (validada por simulação no RF-14).

### 3.8 Cristais & Progressão (RF-10)
- **Ganhos grátis**: 1ª vitória +100 · vitória +30 · vitória no Modo Desafio +60 · 1ª vitória do dia +20 · anúncio recompensado +25 (máx. 5/dia).
- **Pacotes**: R$ 4,90 = 120 · R$ 9,90 = 260 · R$ 19,90 = 600 Cristais.
- **Modo Desafio (RF-11)**: liberado após a 1ª vitória. Inimigos +40% de vida, Essência inicial 200.

### 3.9 Pontuação (ranking)
`pontos = Luz restante × 100 + Essência não gasta + bônus de tempo (máx. 1.000) + Modo Desafio × 1,5`. Uso de power-ups **não** zera a pontuação, mas é exibido como ícone no ranking (transparência).

---

## 4. Requisitos Funcionais

| ID | Funcionalidade | Regra de Negócio | MoSCoW | Origem | Marco |
|---|---|---|---|---|---|
| RF-01 | Partida e loop de jogo | Mapa 16×9, Essência, Luz 20, vitória/derrota | Must | ATIV-01 | M4 |
| RF-02 | Grade livre com prévia | Toque → prévia de alcance/custo → confirmar; células ≥ 48 dp | Must | ATIV-01 / DOR-05 | M4 |
| RF-03 | 3 guias × 3 níveis | Tabela 3.3; evoluir, vender (70%), prioridade de alvo | Must | ATIV-01 / GANHO-02 | M4 |
| RF-04 | 4 tipos de espírito | Tabela 3.4 | Must | ATIV-01 | M4 |
| RF-05 | Purificação visual | Dissolução em luz; sem sangue/morte | Must | DOR-02 | M4 |
| RF-06 | 3 hordas | Tabela 3.5; "Chamar horda" | Must | ATIV-01 | M4 |
| RF-07 | Chefão Obsessor-Mor | 2 fases, invocação de larvas, aura apagadora | Must | GANHO-03 | M4 |
| RF-08 | Cena final + abertura | Quadros de HQ puláveis | Should | GANHO-03 | M4 |
| RF-09 | Power-ups | 4 power-ups; 1× por horda | Must | GANHO-06 / DOR-04 | M4 |
| RF-10 | Cristais | Ganhos grátis + saldo sincronizado | Must | ATIV-06 | M3/M4 |
| RF-11 | Modo Desafio | Liberado após 1ª vitória | Should | Retenção | M4 |
| RF-12 | Tutorial | 3 balões na Horda 1; aha ≤ 30 s | Must | Ativação | M4 |
| RF-13 | Pausa, velocidade 2×, save local | Retoma partida e preferências | Must | DOR-06 | M4 |
| RF-14 | Simulador de balanceamento | Teste automatizado que roda a fase com estratégia-base sem power-ups e exige vitória | Must | DOR-04 / ATIV-10 | M4 |
| RF-15 | Login Google opcional | Oferecido após 1ª vitória; backend valida ID token | Should | ATIV-05 | M3/M4 |
| RF-16 | Ranking semanal | Top 100, reset toda segunda 00:00 (BRT); anti-fraude básico | Should | ATIV-05 / GANHO-04 | M3/M4 |
| RF-17 | Loja de Cristais | Play Billing (Android) com validação no servidor; Stripe/Pix (web) | Must | ATIV-06 | M3/M4 |
| RF-18 | Anúncio recompensado | AdMob, iniciado pelo jogador, máx. 5/dia, SSV | Should | ATIV-07 / DOR-03 | M4 |
| RF-19 | Compartilhar vitória | Imagem "página de HQ" + Share API | Could | ATIV-09 | M4 |
| RF-20 | Modo captura | Esconde o HUD para gravar clipes | Could | ATIV-03 | M4 |
| RF-21 | Reportar problema | Formulário → `/feedback` | Should | ATIV-08 | M3/M4 |
| RF-22 | Telemetria | Eventos da seção 6 → `/events` | Must | ATIV-10 | M3/M4 |
| RF-23 | Multiplataforma | Mesmo código: web + Android (Capacitor) | Must | GANHO-05 | M4/M5 |

---

## 5. Requisitos Não Funcionais
- **Desempenho**: 60 FPS em Android intermediário (≈ 4 GB RAM); carga inicial web < 10 MB e < 5 s em 4G.
- **Segurança**: nenhuma chave no frontend; compras **sempre** validadas no servidor; saldo de Cristais com fonte de verdade no backend quando logado.
- **Privacidade / LGPD**: login opcional; política de privacidade; consentimento de anúncios (UMP do AdMob); Play Families: avaliar elegibilidade.
- **Acessibilidade / TDAH**: textos curtos, fonte sem serifa, alto contraste no HUD, opção de reduzir partículas.
- **i18n**: todos os textos em arquivo de idioma `pt-BR.json` (pronto para `en.json`).
- **Respeito cultural**: revisão de representação da Benzedeira e do Pajé antes do lançamento.

---

## 6. Catálogo de Telemetria

| Evento | Gatilho | Propriedades | Objetivo |
|---|---|---|---|
| `game_opened` | Jogo carregado | `platform`, `load_ms` | Aquisição / desempenho |
| `tutorial_completed` | Fim dos balões | `seconds` | Ativação |
| `first_purification` | 1º espírito purificado | `seconds_since_start` | Aha moment (≤ 30 s) |
| `wave_started` / `wave_completed` | Início/fim de horda | `wave`, `lives`, `essence` | Funil de dificuldade |
| `tower_placed` / `tower_upgraded` / `tower_sold` | Ações de guia | `type`, `level`, `cell` | Balanceamento |
| `powerup_used` | Uso de power-up | `id`, `wave` | Monetização / balanceamento |
| `game_won` / `game_lost` | Fim da partida | `mode`, `score`, `duration_s`, `wave_reached` | Conclusão |
| `login_completed` | Login Google | `platform` | Conversão de cadastro |
| `store_opened` | Loja aberta | `source` | Intenção de compra |
| `purchase_completed` | Compra validada | `pack_id`, `amount_cents`, `currency`, `gateway` | Receita |
| `rewarded_ad_completed` | Anúncio assistido | `placement` | Receita de anúncios |
| `share_clicked` | Compartilhar vitória | `platform` | Indicação |

---

## 7. Métricas de Sucesso: primeiros 30 dias (proposta)
- ≥ 60% dos jogadores chegam ao `first_purification` em ≤ 30 s.
- ≥ 35% vencem a partida (Normal).
- Retenção D1 ≥ 25% (Android).
- ≥ 2% de jogadores pagantes; ≥ 20% assistem ao menos 1 anúncio recompensado.

---

## 8. Telas
Splash/Carregamento · Menu Principal · Cena de Abertura (HQ) · Partida (HUD: Luz, Essência, horda, power-ups, velocidade, pausa) · Painel do Guia (evoluir/vender/alvo) · Pausa/Configurações · Vitória (pontuação, Cristais ganhos, compartilhar, login) · Derrota · Loja de Cristais · Ranking · Reportar Problema.

---

## 9. Critérios de Aceite (Definition of Done)
- [ ] Partida completa (3 hordas + chefão) jogável em Chrome desktop, Chrome Android e APK.
- [ ] Simulador (RF-14) comprova vitória sem power-ups no modo Normal.
- [ ] Testes do backend 100% aprovados; compras rejeitadas sem validação.
- [ ] Direção de arte do Marco 2 aplicada a todos os ativos.
- [ ] Eventos de telemetria chegando ao `/events`.
- [ ] `tasks.json` e `dashboard.html` atualizados; parecer Tier 3 favorável.
