# FINANCIAL_MODEL — Torre dos Espíritos

> Valores em BRL. Câmbio de referência: US$ 1 ≈ R$ 5,60. **Estimativas de planejamento**, a recalibrar com dados reais de telemetria (Marco 5).

---

## 1. Fontes de Receita

### 1.1 Pacotes de Cristais (compra in-app)

| Pacote | Preço | Cristais | Líquido Android (−15% Google) | Líquido web Pix (~−1%) |
|---|---|---|---|---|
| Punhado de Cristais | R$ 4,90 | 120 | R$ 4,17 | R$ 4,85 |
| Bolsa de Cristais | R$ 9,90 | 260 (+8%) | R$ 8,42 | R$ 9,80 |
| Baú de Cristais | R$ 19,90 | 600 (+25%) | R$ 16,92 | R$ 19,70 |

> No exterior, a Play Store aplica preços locais automaticamente (ex.: US$ 0,99 / 1,99 / 3,99).

### 1.2 Anúncios Recompensados (AdMob)
- eCPM de referência para rewarded no Brasil: **US$ 2–6** (≈ R$ 11–34 por 1.000 visualizações).
- Hipótese conservadora: **R$ 15 / 1.000 views**.

---

## 2. Custos

| Item | Tipo | Valor |
|---|---|---|
| Google Play Console | Único | US$ 25 ≈ R$ 140 |
| Registro de marca INPI | Único | ≈ R$ 400 |
| Backend (Render/Fly) | Mensal | US$ 7 ≈ R$ 40 |
| Banco (Neon/Supabase free) | Mensal | R$ 0 (até o limite gratuito) |
| Domínio | Mensal | ≈ R$ 4 |
| Web (itch.io/Cloudflare) | Mensal | R$ 0 |
| **Total fixo mensal** | | **≈ R$ 45** |
| Taxa Google Play | Variável | 15% das compras |
| Stripe (cartão BR) | Variável | ~3,99% + R$ 0,39 |
| Pix | Variável | ~0,99% |

**Investimento inicial (caixa)**: ≈ R$ 540 + custos mensais.

---

## 3. Cenários Mensais (após lançamento)

Premissas: **MAU** = jogadores ativos no mês; **conversão pagante** de 1,5% a 3%; ticket médio líquido R$ 7; **40%** dos MAU assistem em média 6 anúncios/mês.

| Cenário | MAU | Pagantes | Receita compras | Views de anúncio | Receita anúncios | **Receita total** | Resultado (−R$ 45) |
|---|---|---|---|---|---|---|---|
| Pessimista | 500 | 8 (1,5%) | R$ 56 | 1.200 | R$ 18 | **R$ 74** | +R$ 29 |
| Base | 3.000 | 60 (2%) | R$ 420 | 7.200 | R$ 108 | **R$ 528** | +R$ 483 |
| Otimista | 15.000 | 450 (3%) | R$ 3.150 | 36.000 | R$ 540 | **R$ 3.690** | +R$ 3.645 |

## 4. Unit Economics
- **Break-even mensal**: ≈ **7 pagantes** (R$ 7 líquido) ou ≈ 3.000 views de anúncio.
- **Payback do investimento inicial (R$ 540)**: ~1 mês no cenário Base.
- **ARPDAU / LTV**: a medir com telemetria (`purchase_completed`, `rewarded_ad_completed`).
- **CAC**: orgânico (Reels/TikTok). Tráfego pago só após LTV medido > 3× CAC.

## 5. Riscos Financeiros
- v1 tem só 1 fase → retenção limitada; o **Modo Desafio + ranking semanal** são as alavancas de retenção até a v2.
- A política de "vencível grátis" reduz a conversão de curto prazo, mas protege as avaliações na Play Store (o principal canal orgânico).
