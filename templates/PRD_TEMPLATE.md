# PRD — Product Requirements Document: [Nome do Projeto]

> **Status**: Rascunho / Em Revisão / Aprovado  
> **Versão**: 1.1.0  
> **Autor/Responsável**: Bruno / Agente de IA  
> **Última Atualização**: AAAA-MM-DD  

---

## 🎙️ Roteiro de Entrevista `/grill-me` (Obrigatório Antes de Preencher)
*A IA deve acionar o comando de perguntas interativas e consultar o Bruno sobre estes 4 eixos estruturantes antes de escrever o documento:*

1. **Problema Central & Dor Aguda**: Qual problema este produto elimina que mais irrita ou custa dinheiro ao usuário?
   - *(Recomendado)*: Economizar horas de trabalho manual repetitivo gerando resultados estruturados com IA em segundos.
   - Eliminar retrabalho e riscos de conformidade/erros operacionais.
   - Permitir que pessoas leigas alcancem resultados que antes exigiam equipes técnicas especializadas.
2. **Momento de Ativação ("Aha! Moment")**: Qual é o exato momento em que o usuário bate o olho e pensa "uau, isso resolveu meu problema"?
   - *(Recomendado)*: Ao gerar ou visualizar o primeiro resultado tangível/dashboard em menos de 2 minutos após o cadastro.
   - Ao receber a primeira notificação ou webhook automático funcionando sem erros.
   - Ao economizar sua primeira hora de esforço em um fluxo guiado.
3. **Público Prioritário (Nicho Inicial / Beachhead)**: Quem é a primeira pessoa que vai usar, testar e pagar por isso amanhã?
   - *(Recomendado)*: Criadores, autônomos ou fundadores solo com rotinas ágeis e pouco tempo a perder.
   - Pequenas e médias empresas que precisam automatizar operações sem equipe de TI.
   - Times e comunidades com demandas específicas de produtividade.
4. **Métricas de Sucesso dos Primeiros 30 Dias**:
   - *(Recomendado)*: Volume de usuários ativos semanais (WAU) e taxa de conclusão da tarefa principal superior a 60%.
   - Primeiras X assinaturas pagas (nacionais via Pix ou globais via Stripe).

---

## 1. Visão do Produto & Resumo Executivo
*Descreva em 2 a 3 parágrafos a essência do que este produto resolve, para quem se destina e por que ele é indispensável.*

- **Oportunidade de Mercado**: 
- **Proposta Central de Valor**: 

---

## 2. Personas & Jornada do Usuário

### Persona Principal
- **Nome/Perfil**: 
- **Dores Principais**: 
- **Objetivos ao usar o produto**: 
- **Gatilho de Conversão**: 

### Jornada Chave ("Happy Path")
1. **Descoberta**: Como o usuário chega à plataforma.
2. **Ativação (Aha Moment)**: Primeira experiência de valor entregue em menos de X minutos.
3. **Engajamento**: Uso contínuo e resolução da dor.
4. **Retenção & Monetização**: Ponto de pagamento ou expansão de uso.

---

## 3. Requisitos Funcionais (Escopo do Produto)

| ID | Módulo / Funcionalidade | Descrição & Regra de Negócio | Prioridade (MoSCoW) | Tier IA Indicado |
|---|---|---|---|---|
| `RF-01` | Autenticação / Onboarding | Cadastro simples e login social | Must Have | Tier 2 |
| `RF-02` | Dashboard / Área Principal | Visão central das métricas ou ativos | Must Have | Tier 2 |
| `RF-03` | Integração de Pagamento | Checkout nacional (Pix) e global (Stripe) | Must Have | Tier 2 / Tier 3 |

---

## 4. Requisitos Não-Funcionais & Conformidade
- **Desempenho**: Tempo de carregamento inicial inferior a 2 segundos.
- **Segurança & Privacidade**: Conformidade com LGPD/GDPR. Nenhuma chave de API exposta no front-end.
- **Acessibilidade & UX**: Design limpo, intuitivo e com foco em usabilidade sem sobrecarga cognitiva (amigável a TDAH).
- **Direção de Arte & Identidade Visual**: Estabelecimento de estilo estético unificado para todos os ativos visuais e imagens (Marco 2), prevenindo dissonância visual e assegurando harmonia com o Design System.
- **Disponibilidade**: Deploy em infraestrutura serverless / edge com tolerância a falhas.

---

## 5. Catálogo de Telemetria & Eventos de Growth Hacking
*Princípio 4: Todos os dados de uso devem ser catalogados para alimentar o analytics.json e a aba de Métricas do dashboard.*

| Nome do Evento | Gatilho de Disparo | Propriedades Registradas | Objetivo de Negócio |
|---|---|---|---|
| `user_signed_up` | Cadastro concluído com sucesso | `method`, `referral_source` | Medir taxa de aquisição |
| `feature_core_used` | Usuário executa a ação principal do app | `feature_id`, `execution_time_ms` | Medir ativação ("Aha moment") |
| `checkout_started` | Usuário abre a modal/página de pagamento | `plan_id`, `currency`, `gateway` | Analisar intenção de compra |
| `payment_completed` | Confirmação via webhook de pagamento | `transaction_id`, `amount_cents`, `method` | Medir receita e LTV |

---

## 6. Critérios de Aceite para Auditoria (Definition of Done)
- [ ] Todas as telas e fluxos principais foram testados manualmente e validados.
- [ ] A Direção de Arte e a geração unificada de imagens foram concluídas e validadas no Marco 2.
- [ ] O catálogo de telemetria dispara os eventos corretamente no console/analytics.
- [ ] O `dashboard.html` e `tasks.json` foram atualizados com as tarefas concluídas e o marco respectivo.
- [ ] O código passou por revisão de modelo Tier 3 com parecer favorável.
