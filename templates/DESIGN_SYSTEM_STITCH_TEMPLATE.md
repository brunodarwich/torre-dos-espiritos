# Design System & Especificação UI/UX (Google Stitch): [Nome do Projeto]

> **Objetivo**: Especificar a identidade visual, o design system e gerar os prompts estruturados para prototipagem de alta fidelidade no **Google Stitch** ([stitch.withgoogle.com](https://stitch.withgoogle.com)) e via ferramentas locais do **MCP Stitch**.  
> **Status**: Rascunho / Em Revisão / Aprovado  
> **Versão**: 1.0.0  
> **Última Atualização**: AAAA-MM-DD  

---

## 🎙️ Roteiro de Entrevista `/grill-me` (Obrigatório Antes do Design)
*A IA deve fazer as seguintes perguntas sobre a experiência visual e sensorial da aplicação:*

1. **Estilo Visual e Personalidade da Interface**:
   - *(Recomendado)*: Dark Mode moderno, minimalista, tipografia nítida com acentos contrastantes (estilo Linear/Vercel) para foco máximo e baixa fadiga cognitiva.
   - Interface limpa e acolhedora em tons neutros claros (Light Mode clean).
   - Estilo editorial/narrativo com forte apelo visual, ilustrações marcantes e narrativa gráfica.
2. **Dispositivo Primário (Mobile-First vs. Desktop-First)**:
   - *(Recomendado)*: Responsivo híbrido: Mobile com bottom navigation bar e Desktop com sidebar colapsável.
   - Desktop-First: Painel denso com múltiplas colunas e ferramentas de produtividade.
   - Mobile-First: Fluxos verticais com cards de ação rápida e interações por gestos.
3. **Qual a Tela Central Mais Importante do MVP?**:
   - *(Recomendado)*: O Workspace interativo onde a IA executa o trabalho e o usuário visualiza o resultado instantâneo.
   - O Dashboard de visão geral com métricas, tarefas e gráficos de progresso.
   - O fluxo de Onboarding / Configuração guiada em 3 passos simples.
4. **Necessidade de Imagens, Ilustrações e Direção de Arte**:
   - *(Recomendado)*: Ilustrações conceituais modernas com estilo 3D Clay / Isométrico minimalista ou Vetor Editorial limpo, com paleta coordenada ao Dark Mode para dar identidade autoral e profissional ao produto.
   - Interface puramente funcional / utilitária: sem ilustrações complexas, apenas ícones SVG padronizados (Lucide Icons) e dados textuais densos.
   - Estilo visual narrativo/gamificado: ilustrações ricas em estilo mangá/quadrinhos ou pixel art com fortes contrastes e personagens expressivos.

---

## 1. Identidade Visual & Design Tokens

### Paleta de Cores
- **Fundo / Superfície (Dark Theme)**: `bg-slate-950` (#020617) e `bg-slate-900` (#0f172a).
- **Cor Primária (Ação / Foco)**: Indigo / Violeta (`#6366f1` / `#8b5cf6`).
- **Sucesso / Aprovação**: Emerald (`#10b981`).
- **Avisos / Atenção**: Amber (`#f59e0b`).
- **Bordas & Divisores**: Slate suave (`#1e293b`).

### Tipografia & Hierarquia
- **Títulos**: Sem serifa moderna (Inter, Geist ou Plus Jakarta Sans), peso 700 (Bold), espaçamento estreito.
- **Corpo de Texto**: Sem serifa legível, peso 400/500, leading relaxado para leitura confortável com TDAH.
- **Dados & Código**: Monospace (JetBrains Mono, Fira Code), peso 500.

---

## 2. Telas Principais do MVP (Mapeamento Funcional)

| ID Tela | Nome da Tela | Finalidade do Usuário | Componentes Críticos |
|---|---|---|---|
| `SCREEN-01` | Dashboard / Visão Geral | Visão rápida do status, métricas e atalhos | Header, KPI Cards, Kanban / Feed de Atividades |
| `SCREEN-02` | Workspace da Funcionalidade Core | Onde o usuário insere dados e a IA processa | Input area com feedback visual, painel de resultados |
| `SCREEN-03` | Modal / Tela de Checkout | Escolha de plano (Pix ou Cartão Internacional) | Tabela de planos comparativos, QR Code Pix, formulário Stripe |
| `SCREEN-04` | Configurações & Segredos | Gerenciamento de preferências e conexões | Inputs seguros mascarados, status de conexões de APIs |

---

## 3. Direção de Arte & Geração de Ativos Visuais (Imagens)

> [!TIP]
> **Princípio da Coerência Visual Única**: Todas as ilustrações e imagens do projeto devem parecer ter sido produzidas pelo mesmo artista/estúdio. Discrepâncias estilísticas (ex: misturar foto realista com vetor flat e pixel art) degradam a percepção de valor do produto.

### Assinatura Visual Artística
- **Estilo Artístico Padrão**: [Definir estilo: ex: *Minimalist 3D Clay render*, *Clean editorial vector*, *Neon cyberpunk*, etc.]
- **Tratamento de Linha / Materiais**: [Definir: ex: *Superfícies foscas, cantos arredondados, ausência de contorno preto duro*]
- **Iluminação & Atmosfera**: [Definir: ex: *Luz de estúdio suave, glow sutil índigo/violeta nas bordas, sombras difusas e profundas*]
- **Paleta de Cores dos Ativos**: [Definir: ex: *Primária #6366f1, secundária #8b5cf6, superfícies em tons de slate escuro*]

### Fórmula Canônica de Prompt para Geração de Imagens
Ao gerar imagens (seja via ferramenta nativa `generate_image` ou geradores externos), utilize sempre esta estrutura padronizada:
```
[Sujeito Central em Ação] + [Ambiente/Composição Minimalista] + [Estilo Artístico Unificado] + [Iluminação de Estúdio / Glow] + [Paleta de Cores com Tokens] + [Parâmetros Técnicos / Proporção]
```

### Catálogo de Ativos Visuais do MVP
| ID Ativo | Nome do Ativo | Finalidade no Produto | Proporção (Aspect Ratio) | Destino do Arquivo |
|---|---|---|---|---|
| `IMG-01` | Hero Visual Banner | Destaque principal da Landing Page / Home | 16:9 | `public/assets/images/hero-banner.png` |
| `IMG-02` | Feature Spot Illustrations | 3 ilustrações para os pilares da aplicação | 1:1 | `public/assets/images/features/` |
| `IMG-03` | Empty State Ilustrado | Feedback visual quando não há tarefas/dados | 4:3 | `public/assets/images/empty-state.png` |
| `IMG-04` | Social Card (OpenGraph) | Imagem de prévia para WhatsApp / Twitter / LinkedIn | 16:9 (1200x630) | `public/assets/images/og-image.png` |

### Protocolo Híbrido de Geração de Ativos
1. **Geração Nativa Autônoma (Antigravity)**:
   - A IA invoca a ferramenta `generate_image` passando o `Prompt` canônico estruturado, o `ImageName` padronizado e o `AspectRatio`.
   - Os arquivos gerados são movidos ou salvos no diretório estático do front-end (`frontend/public/assets/images/`).
2. **Prompts Refinados para Ferramentas Externas**:
   - A IA documenta os prompts formatados para Midjourney (`--v 6.1 --ar 16:9 --style raw`), Flux.1, Ideogram ou DALL-E 3 para refino manual opcional pelo Bruno.

---

## 4. Prompt Pronto para o Google Stitch (Web)
*Copie o prompt abaixo e cole diretamente na caixa de geração do [stitch.withgoogle.com](https://stitch.withgoogle.com):*

```markdown
Design a modern, ultra-clean web application interface for "[Nome do Projeto]".
Theme: Modern dark mode with slate-950 background, slate-900 surface cards, and subtle slate-800 borders. Accent colors in electric indigo (#6366f1) and violet.
Typography: Clean, highly legible sans-serif for neurodivergent focus (zero clutter, high contrast, generous whitespace).

Key Screens to Generate:
1. Main Dashboard:
   - Header with logo, breadcrumbs, search bar, and active user profile.
   - Top metrics bar with 4 KPI cards (Progress %, Active Items, MRR, Success Rate).
   - Clean 4-column kanban board (Backlog, In Progress, Review, Completed) with draggable-style cards showing task tags, tier badges, and avatar chips.

2. Core AI Workspace:
   - Left split panel: Structured input prompt configuration with smart presets.
   - Right split panel: Real-time generated output viewer with copy, export, and preview actions.

3. Checkout & Pricing Modal:
   - Dual currency options (BRL via Pix with dynamic QR code preview, and USD via Stripe).
   - High-contrast "Subscribe" call-to-action button with guarantee badge.
```

---

## 5. Geração Automatizada via Servidor MCP Stitch (IDE)
*Quando a IA ou o Bruno utilizar o servidor MCP `stitch` configurado na IDE, a IA executa o seguinte comando:*

```json
{
  "tool": "mcp_stitch_generate_screen_from_text",
  "arguments": {
    "project_id": "[ID_DO_PROJETO_NO_STITCH]",
    "prompt": "Create a responsive dark-mode dashboard for [Nome do Projeto] featuring a top metric bar with 4 cards and a 4-column task kanban board with indigo accents.",
    "device": "DESKTOP"
  }
}
```

---

## 6. Critérios de Aceite de Design & Direção de Arte (UI Definition of Done)
- [ ] O protótipo visual foi gerado no Google Stitch (web ou MCP) e validado pelo Bruno.
- [ ] A Direção de Arte foi estabelecida e todos os ativos visuais/imagens mantêm coerência estética unificada.
- [ ] A paleta de cores e tipografia mantêm conformidade com o design system sem poluição visual.
- [ ] O layout possui zero elementos quebrados ou texto cortado em telas menores (mobile).
- [ ] O código front-end correspondente em Tailwind CSS reflete com fidelidade as telas do Stitch e os ativos gerados.
