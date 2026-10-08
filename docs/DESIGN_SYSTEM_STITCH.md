# Design System & Direção de Arte UI/UX (Google Stitch): Torre dos Espíritos

> **Objetivo**: Especificar a identidade visual, direção de arte unificada e design tokens da UI e HUD para o jogo **Torre dos Espíritos**, preparando a prototipagem de telas no Google Stitch e geração de assets no Marco 2.

---

## 1. Identidade Visual & Conceito Artístico

- **Conceito**: *Noite Astral Acolhedora*. O universo visual equilibra o mistério do mundo espiritual noturno com a luz reconfortante e sagrada dos guias protetores.
- **Estilo Artístico**: 2D ilustrado com traço limpo de quadrinho (HQ autoral) combinado com texturas de aquarela digital etérea, partículas brilhantes e auras luminosas.
- **Atmosphere**: Contrastes marcantes entre tons profundos de azul/índigo (ambiente astral) e brilhos quentes de dourado, âmbar e ciano (energias dos guias e da purificação).

---

## 2. Paleta de Cores e Design Tokens

| Token | Cor Hex | Uso |
|---|---|---|
| `color-astral-dark` | `#0B0F19` | Fundo do mundo astral / espaço escuro |
| `color-astral-deep` | `#171D2E` | Painéis de interface, modais, fundo do HUD |
| `color-border-ethereal` | `#2D3748` | Bordas sutis de janelas e cards |
| `color-light-mentor` | `#F6E05E` / `#ECC94B` | Raio de luz, ouro solar, indicador do Mentor de Luz |
| `color-nature-herbs` | `#48BB78` / `#38A169` | Verde folha/ervas, arruda, indicador da Benzedeira |
| `color-fire-sacred` | `#ED8936` / `#DD6B20` | Fogo ancestral, fumaça ritualística, Pajé |
| `color-essence-cyan` | `#4FD1C5` / `#319795` | Contador de Essência, gotas de luz dos espíritos |
| `color-crystals-violet`| `#B794F4` / `#9F7AEA` | Moeda premium Cristais e power-ups |
| `color-purified-glow` | `#EBF8FF` | Brilho puro e etéreo de espíritos resgatados |
| `color-shadow-spirit` | `#4A5568` / `#2D3748` | Névoa e silhueta dos espíritos perturbados |

---

## 3. Tipografia & Legibilidade

- **Títulos e Destaques**: Fonte estilizada com personalidade mística e forte sem perder clareza (ex: *Cinzel Decorative*, *Outfit* ou *Cinzel*).
- **HUD, Números e Estatísticas**: Fonte sem serifa de alta legibilidade, toques grandes, sem fadiga cognitiva (ex: *Inter*, *Plus Jakarta Sans*), peso 600+.
- **Balões de Diálogo / Narrativa HQ**: Estilo quadrinho limpo (ex: *Comic Neue* ou fonte customizada de rotulagem de HQ).

---

## 4. Telas Principais Mapeadas para o Stitch

| ID Tela | Nome da Tela | Componentes Críticos |
|---|---|---|
| `SCREEN-01` | **Menu Principal** | Título com aura luminosa, botões grandes ("Jogar", "Como Jogar", "Ranking", "Loja"), pessoa dormindo ao fundo sob vigília |
| `SCREEN-02` | **HUD da Partida (Game Screen)** | Barra superior (Luz da pessoa adormecida, Essência, Horda X/3, Velocidade 1x/2x, Pausa), Barra inferior de Power-ups (4 slots) e seletor de Guias |
| `SCREEN-03` | **Painel de Inspeção do Guia** | Ao tocar num guia: visual do guia, nível (1/2/3), botão Evoluir (custo em Essência), botão Vender (+70%), prioridade de alvo |
| `SCREEN-04` | **Tela de Vitória & Resgate** | Ilustração em página de HQ do amanhecer e do espírito arrependido purificado, resumo de pontuação, botão "Compartilhar", botão "Cadastrar no Ranking", botão "Modo Desafio" |
| `SCREEN-05` | **Loja de Cristais & Apoio** | Grid de 3 pacotes de Cristais (Punhado, Bolsa, Baú), opção de anúncio recompensado diário, botão "Apoiar o Criador" |
| `SCREEN-06` | **Ranking Semanal** | Lista Top 100 com avatares/nomes, pontuações, tempo restante para o reset semanal |

---

## 5. Prompts Estruturados para Geração e Stitch

### 5.1 Prompt Mestre para Stitch (HUD / Interface do Jogo)
```text
Modern mobile and web 2D game UI interface for a Brazilian spiritual tower defense game named 'Torre dos Espíritos'. 
Atmosphere: Ethereal astral plane at night, mystical dark indigo background (#0B0F19), soft glowing cyan, gold and lavender lights. 
Top HUD bar: 20 points of glowing golden Life/Light with heart/flame icon, Essence currency counter in luminous cyan drops, wave indicator 'Horda 1/3', speed control (1x/2x), pause icon.
Bottom control bar: 4 circular power-up buttons with glowing borders (Angel Shield, Light Rain, Deep Sleep, Sacred Fervor), and 3 spiritual guide summoning cards (Mentor of Light with solar rays, Benzedeira with rue herb leaves, Pajé with sacred ancestral smoke).
Clean touch-friendly layout, comic book lineart combined with watercolor fantasy aesthetics, modern flat glassmorphism panels, high contrast text for accessibility.
```

### 5.2 Direção de Arte para Personagens (Fórmula Padrão de Imagens)
```text
[Character] + [Action/Pose] in ethereal astral Brazilian realm + clean comic book lineart illustration with digital watercolor texture + soft mystical inner glow + palette: dark slate, glowing warm amber, emerald green and astral cyan + clean background, isometric or top-down view, high definition
```
