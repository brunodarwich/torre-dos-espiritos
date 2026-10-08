# Business Model Canvas Sistêmico & Integrado: Torre dos Espíritos

> **Metodologia Sistêmica Sebrae Startups** com auditoria cruzada obrigatória.
> Fonte: entrevista `/grill-me` BMC (8 perguntas) de 08/10/2026.

---

## 1. Segmentos de Clientes
- **Cliente Pioneiro (Beachhead)**: jogador(a) brasileiro(a) com afinidade espiritual (espírita, espiritualista, esotérico), 18–45 anos, usuário Android.
- **Segmentos Secundários / Expansão**: jogadores casuais de tower defense em geral; famílias buscando jogo sem violência (10+); fãs de cultura brasileira e de HQ; mercado lusófono e, depois, global (tradução EN).
- **Momento de Compra**: em hordas difíceis (vontade de usar um power-up e não ter Cristais) e após a primeira vitória emocional sobre o chefão (vontade de tentar o Modo Desafio).

---

## 2. Proposta de Valor (importada de [VALUE_PROPOSITION_CANVAS.md](./VALUE_PROPOSITION_CANVAS.md))
- **Oferta Central**: tower defense curto, polido e gratuito no mundo astral brasileiro, onde espíritos são **purificados**, não destruídos.
- **Aliviadores Ativos**: DOR-01 (identidade brasileira), DOR-02 (sem violência), DOR-03 (sem anúncio forçado), DOR-04 (vencível sem pagar), DOR-05 (controle mobile), DOR-06 (sessões curtas + save).
- **Criadores Ativos**: GANHO-01 a GANHO-06 (representação, estratégia, final emocional, ranking, multiplataforma, power-ups).
- **Diferencial / Moat**:
  1. **IP autoral**: universo, personagens e arte de quadrinista, registráveis (marca no INPI + direitos autorais) e expansíveis para HQ.
  2. **Velocidade de expansão**: fluxo de desenvolvimento com IA permite lançar fases, guias e eventos com frequência maior que a de concorrentes indie.

---

## 3 & 4. Matriz Integrada: Relacionamento × Canais

| Momento | Estratégia de Relacionamento | Canal(is) | Atividade Principal |
|---|---|---|---|
| **Antes: Atração** | Clipes curtos: purificação dos espíritos, evolução dos guias, bastidores do traço | Instagram, TikTok, Reels | ATIV-03 |
| **Antes: Prova** | Jogar grátis no navegador, sem instalar | itch.io / Cloudflare Pages | ATIV-04 |
| **Durante: Conversão** | Botão "Baixar na Play Store" no fim da partida web; página da loja caprichada (ASO) | Build web + Google Play | ATIV-04 |
| **Durante: Ativação** | Sem cadastro para jogar; tutorial em balões de HQ na Horda 1; primeira purificação em ≤ 30 s | Dentro do jogo | ATIV-01 |
| **Durante: Cadastro** | Login Google **opcional**, oferecido só após a 1ª vitória, para entrar no ranking | Google Sign-In (web + Android) | ATIV-05 |
| **Durante: Compra** | Loja de Cristais com 3 pacotes; pagamento em 1 toque | Google Play Billing (Android) / Stripe + Pix (web) | ATIV-06 |
| **Depois: Suporte** | E-mail + formulário "Reportar problema" no jogo | E-mail / backend `/feedback` | ATIV-08 |
| **Depois: Retenção** | Ranking semanal que reseta; Modo Desafio após vencer; anúncio de novas fases | Jogo + redes sociais | ATIV-05, ATIV-01, ATIV-03 |
| **Depois: Indicação** | "Compartilhar vitória": imagem estilo página de HQ com pontuação | Share nativo (Android/Web Share API) | ATIV-09 |

---

## 5. Fontes de Receita
- **Moeda premium "Cristais"**: obtida jogando (vitória, Modo Desafio, primeira vitória do dia), por **anúncio recompensado opcional** ou por **compra de pacotes**.
  - Pacotes sugeridos: **R$ 4,90 · R$ 9,90 · R$ 19,90** (Play Store converte automaticamente para USD/outras moedas).
- **Power-ups consumíveis** (pagos em Cristais): 🛡️ Escudo do Anjo da Guarda · ✨ Chuva de Luz · ⏳ Sono Profundo · ⚡ Fervor.
- **Anúncios recompensados (AdMob)**: receita por visualização opcional (ex.: "assista e ganhe Cristais").
- **Regra ética de receita**: a fase sempre é vencível sem gastar; nenhum anúncio intersticial forçado.
- **Cobrança**: Android → obrigatoriamente Google Play Billing (taxa 15%). Web → Stripe (cartão internacional) + Pix (BR).
- Detalhes em [FINANCIAL_MODEL.md](../FINANCIAL_MODEL.md).

---

## 6. Atividades Principais (Lei do Desdobramento)

| ID | Origem do Compromisso | Atividade Operacional | Reflexo Técnico | Responsável |
|---|---|---|---|---|
| **ATIV-01** | Proposta de Valor | Desenvolver/manter o jogo: guias, hordas, chefão, power-ups, tutorial, Modo Desafio | `frontend/` Phaser (RF-01 a RF-14) | IA |
| **ATIV-02** | Proposta de Valor (DOR-01, GANHO-01) | Produzir arte e animações no estilo HQ/aquarela | Assets em `frontend/public/assets/` (Marco 2) | Bruno + IA |
| **ATIV-03** | Relacionamento Antes/Depois | Publicar clipes semanais no Instagram/TikTok | Modo de gravação/captura limpa (sem HUD) — RF-20 | Bruno |
| **ATIV-04** | Canais | Manter build web (itch.io/Cloudflare) + página da Play Store | Pipeline de build web + AAB assinado | IA (Bruno publica) |
| **ATIV-05** | Relacionamento (Cadastro/Retenção) | Operar login Google opcional + ranking semanal com reset automático | Backend `/auth/google`, `/scores`, tarefa de reset | IA |
| **ATIV-06** | Receita | Processar compras de Cristais e validar no servidor | Play Billing + `/purchases/verify`; Stripe/Pix webhooks | IA |
| **ATIV-07** | Receita | Exibir anúncios recompensados | Plugin AdMob Capacitor + verificação SSV | IA |
| **ATIV-08** | Relacionamento Depois | Responder suporte (e-mail + formulário) | Backend `/feedback` | Bruno (~1h/sem) |
| **ATIV-09** | Relacionamento (Indicação) | Gerar imagem "Compartilhar vitória" estilo HQ | Render de canvas + Share API | IA |
| **ATIV-10** | Proposta de Valor (DOR-04) | Coletar telemetria e balancear a dificuldade | Backend `/events` + `analytics.json` | IA |
| **ATIV-11** | Moat | Registrar marca e proteger IP | Processo INPI (fora do código) | Bruno |

---

## 7. Recursos Principais

| Atividade | Recurso Indispensável | Categoria | Especificação |
|---|---|---|---|
| ATIV-01 | Motor de jogo e código | Intelectual | Phaser 3 + TypeScript + Vite + Capacitor |
| ATIV-02 | Traço autoral + geração de imagens | Humano / Intelectual | Bruno (quadrinista) + `generate_image` / ferramentas externas |
| ATIV-03 | Tempo de produção de conteúdo | Humano | Bruno, ~2–3 h/semana |
| ATIV-04 | Contas de distribuição | Financeiro / Material | Google Play Console (US$ 25 único), itch.io (grátis) |
| ATIV-05, 06, 10 | Servidor + banco | Infraestrutura | FastAPI no Render/Fly.io + Postgres (Neon/Supabase free) |
| ATIV-06 | Contas de pagamento | Financeiro | Merchant Google Play, Stripe, chave Pix |
| ATIV-07 | Conta de anúncios | Financeiro | Google AdMob |
| ATIV-08 | E-mail de suporte | Material | Caixa de e-mail dedicada |
| ATIV-11 | Registro de marca | Financeiro / Intelectual | INPI (~R$ 400) |

---

## 8. Parcerias Estratégicas

| Atividade/Recurso Deslocado | Parceiro | Tipo | Garantia |
|---|---|---|---|
| Distribuição Android + cobrança in-app | Google Play | Fornecedor crítico | Loja, Billing, antifraude (taxa 15%) |
| Anúncios recompensados | Google AdMob | Fornecedor de receita | Inventário de anúncios e pagamento mensal |
| Identidade do jogador | Google Sign-In | Infraestrutura | Login seguro sem gerenciar senhas |
| Pagamentos web | Stripe + provedor Pix | Fornecedor financeiro | Checkout seguro PCI-DSS |
| Hospedagem backend/banco | Render ou Fly.io + Neon/Supabase | Nuvem | Uptime e SSL automáticos |
| Hospedagem web | itch.io / Cloudflare Pages | Distribuição | CDN gratuita |

---

## 9. Estrutura de Custos
- **Fixos mensais**: backend ~US$ 7 (≈ R$ 40) + banco (plano grátis) + domínio (~R$ 4/mês) → **≈ R$ 40–60/mês**.
- **Únicos**: Play Console US$ 25 (≈ R$ 140) + marca INPI ≈ R$ 400.
- **Variáveis**: 15% Google Play sobre compras; Stripe ~3,99% + R$ 0,39 (BR) / taxa internacional; Pix ~0,99%.
- **Break-even**: ≈ 10–15 pacotes de R$ 4,90 por mês (ou equivalente em anúncios) cobrem os custos fixos. Ver [FINANCIAL_MODEL.md](../FINANCIAL_MODEL.md).

---

## 10. Checklist de Auditoria Cruzada
- [x] **1. Fit Problema-Solução**: 6 dores ↔ 6 aliviadores; 6 ganhos ↔ 6 criadores.
- [x] **2. Relacionamento-Canais**: todas as linhas Antes/Durante/Depois possuem canal.
- [x] **3. Desdobramento**: 100% dos compromissos viraram ATIV-01 a ATIV-11.
- [x] **4. Atividade-Recurso**: todas as atividades têm recurso mapeado.
- [x] **5. Parcerias**: Billing, anúncios, login, pagamentos e hospedagem deslocados para parceiros.
- [x] **6. Ponte com PRD**: atividades mapeadas para RFs no [PRD.md](../PRD.md).
