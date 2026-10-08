# Modelo Financeiro & Estratégia de Monetização: [Nome do Projeto]

> **Princípio Fundamental (Item 9)**: O projeto deve ser concebido e preparado desde o primeiro momento com capacidade de monetização tanto no mercado nacional quanto no mercado internacional.  
> **Versão**: 1.1.0  
> **Última Atualização**: AAAA-MM-DD  

---

## 🎙️ Roteiro de Entrevista `/grill-me` (Obrigatório Antes de Preencher)
*A IA deve alinhar os parâmetros financeiros essenciais com o Bruno através das seguintes perguntas:*

1. **Modelo de Cobrança Principal**: Como o usuário pagará pelo valor entregue?
   - *(Recomendado)*: Assinatura mensal recorrente (SaaS) com plano Free de degustação controlada.
   - Pacotes de créditos pré-pagos / uso sob demanda (Pay-as-you-go).
   - Pagamento único vitalício (Lifetime Deal) para os primeiros 50 usuários e depois assinatura.
2. **Faixa de Preço Nacional (Brasil - BRL)**: Qual a precificação inicial em Reais para maximizar conversão via Pix?
   - *(Recomendado)*: R$ 29,00 a R$ 47,00 / mês no plano individual Pro; R$ 147,00 / mês para equipes.
   - R$ 19,00 / mês (ticket de entrada ultra-baixo para adoção em massa).
   - R$ 97,00+ / mês (posicionamento premium focado em empresas).
3. **Faixa de Preço Global (Internacional - USD)**: Qual o preço em Dólares no Stripe para o mercado exterior?
   - *(Recomendado)*: $9 a $14 / mês para usuários individuais; $39 / mês para equipes (sem atrito de IOF/câmbio).
   - $19 a $29 / mês com foco em pequenas agências e creators globais.
4. **Gateways de Pagamento Escolhidos**:
   - *(Recomendado)*: Mercado Pago ou Asaas para Brasil (foco em Pix dinâmico instantâneo) + Stripe Billing para o resto do mundo.
   - Apenas Stripe (com suporte a Pix e cartões locais ativado).

---

## 1. Estratégia de Monetização Dupla: Nacional & Global

```
                        ┌────────────────────────────────────────────────────────┐
                        │          ESTRATÉGIA DE MONETIZAÇÃO INTEGRADA          │
                        └──────────────────────────┬─────────────────────────────┘
                                                   │
                ┌──────────────────────────────────┴──────────────────────────────────┐
                ▼                                                                     ▼
┌──────────────────────────────────────────────┐     ┌──────────────────────────────────────────────┐
│        MERCADO NACIONAL (Brasil - BRL)       │     │     MERCADO INTERNACIONAL (Global - USD/EUR) │
├──────────────────────────────────────────────┤     ├──────────────────────────────────────────────┤
│ - Meio Rei: PIX instantâneo (conversão máx.) │     │ - Meio Rei: Cartão de Crédito Global / Apple │
│ - Boleto bancário e Cartão de crédito local  │     │   Pay / Google Pay                           │
│ - Gateways: Mercado Pago, Asaas ou PagBank   │     │ - Gateways: Stripe Billing, Paddle ou LemonS │
│ - Cobrança: BRL (R$) com suporte a parcelas  │     │ - Cobrança: USD ($) e EUR (€) sem IOF local  │
└──────────────────────────────────────────────┘     └──────────────────────────────────────────────┘
```

---

## 2. Estrutura de Preços & Tiers de Assinatura

| Tier / Plano | Preço Brasil (BRL) | Preço Global (USD) | Recursos Incluídos | Margem Estimada |
|---|---|---|---|---|
| **Free / Freemium** | R$ 0 / mês | $ 0 / mo | Degustação controlada (limite de uso de IA) | Aquisição de usuários |
| **Pro / Creator** | R$ 47,00 / mês | $ 12.00 / mo | Acesso completo às ferramentas principais | ~80% |
| **Business / Team** | R$ 147,00 / mês | $ 39.00 / mo | Múltiplos assentos, suporte prioritário e APIs | ~85% |

---

## 3. Modelagem de Custos Operacionais vs. Receita

### Custos Variáveis por Usuário Ativo
- **Consumo de Modelos de IA**: Estimativa de chamadas de API por usuário/mês.
  - *Exemplo*: 100 requisições/mês a $0.002 = $0.20 por usuário ativo.
- **Taxas de Gateway de Pagamento**:
  - *Nacional (PIX)*: ~0.99% a 1.49%.
  - *Nacional (Cartão)*: ~2.99% + R$ 0.40.
  - *Internacional (Stripe)*: ~2.9% + $0.30 (+ 1.5% para cartões internacionais).
- **Infraestrutura Serverless / Banco de Dados**: Rateio de servidores e banco de dados por usuário.

### Unit Economics Projetados
- **CAC (Custo de Aquisição de Clientes)**: Meta de investimento por novo assinante pago.
- **LTV (Lifetime Value)**: Tempo médio de permanência (meses) x Ticket médio.
- **Razão LTV / CAC**: Objetivo saudável de 3:1 ou superior.
- **Ponto de Equilíbrio (Break-Even)**: Quantidade de assinantes ativos necessários para cobrir todos os custos fixos mensais.

---

## 4. Checklist de Configuração das Plataformas de Pagamento
*Para cada gateway, a IA deve gerar o Cartão de Configuração Guiada correspondente antes do go-live.*

- [ ] **Brasil (Mercado Pago / Asaas)**:
  - Criação de credenciais de produção.
  - Configuração do Webhook de confirmação de pagamento (`/api/webhooks/mercadopago`).
  - Teste de fluxo de ponta a ponta com PIX dinâmico (QR Code e Copia-e-Cola).
- [ ] **Global (Stripe / Paddle)**:
  - Criação dos produtos e tabelas de preços no Dashboard Stripe.
  - Configuração do Portal do Cliente para cancelamento/upgrade self-service.
  - Configuração do Webhook seguro com validação de assinatura (`stripe-signature`).
