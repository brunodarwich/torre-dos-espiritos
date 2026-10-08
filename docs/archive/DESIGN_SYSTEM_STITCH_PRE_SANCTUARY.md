# Design System & Direção de Arte UI/UX (Google Stitch): Torre dos Espíritos

> **Objetivo**: Especificar a identidade visual, direção de arte unificada, design tokens da UI/HUD e prompts de alta fidelidade para prototipagem no **Google Stitch** e geração de ativos no **Marco 2**.  
> **Status**: Alinhado via `/grill-me` e aprovado para execução.  
> **Rastreabilidade**: PRD.md (RF-01 a RF-11) e AGENTS.md (Direção de Arte Coesa).

---

## 1. Identidade Visual & Conceito Artístico

- **Conceito**: *Noite Astral Acolhedora*. O universo visual equilibra o mistério do plano espiritual noturno com a luz reconfortante, sagrada e acolhedora dos guias protetores.
- **Perspectiva do Gameplay**: **Top-Down 2D com inclinação suave 3/4** (estilo *Kingdom Rush* / *Bloons TD 6*). O piso do quarto astral é visto ligeiramente de cima e os personagens são ilustrados em 3/4 frontal, maximizando o volume, expressividade e clareza do traço de quadrinho.
- **Estilo Artístico**: 2D ilustrado com traço limpo de quadrinho (*clean linework* com contorno de tinta nítido), combinado com texturas de aquarela digital etérea, partículas brilhantes e auras luminosas translúcidas.
- **Atmosfera & Iluminação**: Contrastes marcantes entre tons profundos de azul/índigo escuro (ambiente astral noturno) e brilhos quentes de dourado solar, verde esmeralda de ervas e fogo âmbar ancestral (energias dos guias e da purificação).

---

## 2. Paleta de Cores e Design Tokens

| Token | Cor Hex | Uso & Aplicação |
|---|---|---|
| `color-astral-dark` | `#0B0F19` | Fundo do mundo astral / espaço escuro do cosmos |
| `color-astral-deep` | `#171D2E` | Painéis de interface, modais, fundo do HUD |
| `color-border-ethereal` | `#2D3748` | Bordas sutis de janelas, cards e divisores de vidro |
| `color-light-mentor` | `#F6E05E` / `#ECC94B` | Raio de luz solar, ouro celestial, indicador do Mentor de Luz |
| `color-nature-herbs` | `#48BB78` / `#38A169` | Verde folha/ervas sagradas, arruda, indicador da Benzedeira |
| `color-fire-sacred` | `#ED8936` / `#DD6B20` | Fogo ancestral, fumaça ritualística, indicador do Pajé |
| `color-essence-cyan` | `#4FD1C5` / `#319795` | Contador de Essência, gotas radiantes de luz dos espíritos |
| `color-crystals-violet`| `#B794F4` / `#9F7AEA` | Moeda premium Cristais e botões de power-ups |
| `color-purified-glow` | `#EBF8FF` | Brilho puro e etéreo de espíritos resgatados e purificados |
| `color-shadow-spirit` | `#4A5568` / `#2D3748` | Névoa, fumaça densa e silhueta dos espíritos perturbados |

---

## 3. Tipografia & Hierarquia Visual

- **Títulos, Vitórias e Telas Místicas**: `Cinzel Decorative` ou `Outfit`, peso 700+. Letras imponentes com glow dourado/branco sutil.
- **HUD, Números de Essência, Luz e Estatísticas**: `Inter` ou `Plus Jakarta Sans`, peso 600–800. Legibilidade instantânea, números tabulares para evitar trepidação em contadores dinâmicos.
- **Balões de Diálogo / Narrativa Tutorial**: Estilo quadrinho limpo (`Comic Neue` ou rotulagem vetorial nítida), contraste alto com fundo levemente pergaminho/esbranquiçado e borda fina preta.

---

## 4. Comportamento da Grade e Cenário "O Quarto Astral"

- **Cenário**: Resolução lógica de **1280 × 720 px**, subdividida em **16 × 9 células de 80 px**.
- **Grade Imersiva Invisível**:
  - Durante o fluxo normal de combate, a grade é 100% invisível para manter a beleza orgânica do Quarto Astral flutuando no cosmos.
  - Ao tocar ou arrastar a carta de um guia espiritual da barra inferior, a grade se **acende suavemente**:
    - **Células Válidas**: Acendem com uma moldura translúcida e uma runa central dourada/azul pulsante.
    - **Células Inválidas (Caminho ou Ocupadas)**: Acendem com tom avermelhado translúcido sutil indicando bloqueio.
- **Caminho Sinuoso**: Faixa mística de pedras astrais flutuantes que sai do Portal Sombrio (canto superior esquerdo) e serpenteia até a Cama de Madeira com a pessoa adormecida (canto inferior direito).

---

## 5. Evolução Visual dos Guias (3 Níveis)

A evolução respeita a mesma silhueta de 1 célula (80 px), adicionando camadas de poder místico:

1. **✨ Mentor de Luz**:
   - **Nível 1 (Humano/Médium)**: Figura serena com vestes brancas tradicionais de algodão, segurando um pequeno foco de luz nas palmas das mãos.
   - **Nível 2 (Aura Luminosa)**: O manto ganha bordados dourados sutis e uma aura solar irradia ao redor de seu corpo; o foco de luz emite pequenos feixes.
   - **Nível 3 (Forma Astral)**: Figura semi-etérea coroada por um halo solar radiante, pés que não tocam o chão e feixes de luz celestial contínuos que refratam em prisma.
2. **🌿 Benzedeira**:
   - **Nível 1 (Tradicional)**: Senhora sábia acolhedora com vestido floral modesto, xale de crochê e ramo de arruda verde fresca na mão direita.
   - **Nível 2 (Aura Curadora)**: Fitas e terço de contas no pulso, folhas verdes flutuando ao redor em espiral suave e gotas de orvalho luminoso no ramo de arruda.
   - **Nível 3 (Anciã da Cura Astral)**: Olhos brilhantes em verde esmeralda místico, vestido translúcido com energia da terra, mandala de folhas e orações sagradas flutuando ao redor.
3. **🪶 Pajé**:
   - **Nível 1 (Ancestral)**: Liderança indígena com pinturas corporais de urucum e jenipapo, cocar discreto e maracá/cachimbo sagrado com fumaça aromática.
   - **Nível 2 (Guardião do Fogo)**: Cocar cerimonial exuberante com penas de arara luminosas, fumaça âmbar densa ondulando no chão e maracá com faíscas douradas.
   - **Nível 3 (Xamã Astral Cósmico)**: Figura imponente com asas etéreas de gavião-real translúcidas atrás de si, círculo de fogo sagrado ancestral queimando aos seus pés e constelações indígenas refletidas em seu peito.

---

## 6. Telas Mapeadas & Prompts de Alta Resolução para o Google Stitch

### 6.1 `SCREEN-01` — Menu Principal
```text
Mobile and web game main menu interface for 'Torre dos Espíritos', a 2D spiritual Brazilian tower defense game.
Visual style: Clean comic book illustration with digital watercolor texture, ethereal astral night atmosphere.
Background: A cozy dimly lit Brazilian bedroom floating gently in a starry indigo cosmos (#0B0F19), a young person peacefully sleeping in a wooden bed, protected by subtle distant golden and emerald auric lights.
UI Components:
- Centered elegant game logo 'TORRE DOS ESPÍRITOS' with glowing golden sacred rays and cosmic particles.
- Primary CTA button: Large glowing amber/gold button 'JOGAR' with clean rounded corners and inner glow.
- Secondary buttons column: 'Como Jogar', 'Ranking Semanal', 'Loja de Cristais', 'Apoiar o Criador' in dark translucent glassmorphism panels with ethereal borders (#2D3748).
- Bottom version label 'v1.0.0' and audio toggle icon. High contrast, mobile touch-friendly layout.
```

### 6.2 `SCREEN-02` — HUD da Partida (Game Screen)
```text
Mobile and web 2D game HUD and battle screen for 'Torre dos Espíritos' tower defense game, 16:9 landscape aspect ratio.
Top HUD bar: Dark translucent slate glassmorphism bar featuring:
- Life Counter: Glowing heart/sacred flame with '20 Luz' in warm gold.
- Currency Counter: Glowing cyan drop icon with '250 Essência' in crisp modern numbers.
- Wave Status: 'Horda 1 de 3' badge with progress fill bar.
- Action Buttons: Speed toggle button '1x / 2x' and Pause button with clean rounded icons.
Center Battlefield: 16x9 grid of 80px cells, ethereal cosmic room floor, winding astral stone path leading to the sleeping person's bed.
Bottom Action Bar:
- 4 circular Power-up buttons with violet crystal borders: 'Escudo do Anjo' (angel wings), 'Chuva de Luz' (golden light beam), 'Sono Profundo' (hourglass crescent moon), 'Fervor Sagrado' (lightning flame).
- 3 spiritual guide summoning cards: Mentor de Luz (100 Essência), Benzedeira (125 Essência), Pajé (150 Essência) with clear cost badges and portrait thumbnails.
Clean, touch-friendly, high readability, comic book art style.
```

### 6.3 `SCREEN-03` — Painel de Inspeção do Guia
```text
In-game inspection modal card for a selected spiritual guide in 'Torre dos Espíritos' tower defense.
Layout: Compact floating glassmorphism card positioned near the selected tower or on bottom-right overlay.
Card Content:
- Guide Portrait: Beautiful comic-style avatar of 'Benzedeira - Nível 1' with glowing green aura.
- Role tag: 'Controle de Área / Lentidão'.
- Stats bars: Alcance (2.0 células), Cadência (0.8/s), Lentidão (−30%).
- Target priority dropdown button: 'Primeiro Alvo' / 'Mais Forte'.
- Primary action: 'Evoluir para Nível 2' button in glowing green/amber with cost badge '175 Essência'.
- Secondary action: 'Vender Guia' red/slate button with refund badge '+87 Essência (70%)'.
- Close 'X' button in top-right corner.
Crisp typography, clean icons, comic book aesthetic.
```

### 6.4 `SCREEN-04` — Modal de Vitória & Redenção (Game Over Positivo)
```text
Victory modal popup screen for mobile game 'Torre dos Espíritos'.
Layout: Centered sleek dark modal overlay with golden ethereal frame and radiant glow.
Top Banner Illustration: Wide illustrated banner showing the redeemed Obsessor-Mor spirit now in peaceful human form, smiling with gratitude as soft morning dawn light floods through the bedroom window.
Header: Majestic golden typography 'VITÓRIA! O SONO FOI PROTEGIDO'.
Stars: 3 sparkling golden stars with light trails.
Score Summary Box:
- Luz Restante: 18 × 100 = 1.800 pts
- Essência Restante: 140 pts
- Bônus de Tempo: 850 pts
- PONTUAÇÃO TOTAL: 2.790 PONTOS (luminous cyan numbers)
Action Buttons:
- Primary button: 'Jogar Modo Desafio' (glowing purple with +40% badge)
- Secondary button: 'Cadastrar no Ranking Semanal' (clean blue glass button)
- Tertiary button: 'Compartilhar Conquista' (share icon) and 'Voltar ao Menu'.
```

### 6.5 `SCREEN-05` — Loja de Cristais & Apoio
```text
In-game Store modal interface for 'Torre dos Espíritos'.
Theme: Astral temple of light with celestial violet crystals.
Top Header: 'Loja Sagrada & Apoio ao Criador' with balance counter '💎 120 Cristais'.
Grid of Offers:
1. 'Punhado de Cristais' (120 Cristais) - R$ 4,90 (Clean glowing crystal icon).
2. 'Bolsa de Cristais' (260 Cristais + 10% bônus) - R$ 9,90 (Destaque 'Mais Popular' em dourado).
3. 'Baú Astral de Cristais' (600 Cristais + 25% bônus) - R$ 19,90.
Free Ad Section:
- 'Bênção Diária': 'Assistir Vídeo Curto (+25 Cristais)' com indicador '3/5 disponíveis hoje'.
Bottom Section:
- 'Apoiar o Criador Independente': Botão com coração 'Contribuição Espontânea via Pix/Apoia.se' para apoiar o quadrinista.
Clean typography, high trust layout, ethical monetization indicators.
```

### 6.6 `SCREEN-06` — Ranking Semanal
```text
Weekly Leaderboard interface screen for 'Torre dos Espíritos'.
Header: 'Ranking Astral da Semana' with countdown timer badge 'Tempo restante: 4d 12h'.
Filter tabs: 'Geral (Normal)' e 'Modo Desafio'.
Top 3 Podium: Illustrated comic podium avatars for 1st (Crown Gold), 2nd (Silver), 3rd (Bronze).
Leaderboard Table:
- Position number (1 to 100)
- Player avatar & nickname
- Score in cyan numbers
- Indicator icons (e.g. badge 'Sem Power-ups' or 'Desafio')
Sticky Bottom Bar:
- 'Sua Posição': '#42 · Bruno · 2.790 pts · Top 5%'.
Close button and refresh button. Smooth contrast and clean alignment.
```

---

## 7. Prompts de Geração de Imagens para Ativos Individuais

### 7.1 Cenário & Ambiente
- **Quarto Astral**:
  ```text
  Top-down 3/4 perspective 2D view of a cozy Brazilian bedroom floating in a mystical astral dimension at night, 16:9 aspect ratio, clean comic book lineart illustration with watercolor textures, winding glowing path of astral stepping stones leading across the floor to a wooden bed on the bottom right, ethereal dark indigo cosmic void background with stars and nebula (#0B0F19), warm amber and cyan soft glow, high definition game map.
  ```
- **Cama com Pessoa Adormecida**:
  ```text
  Top-down 3/4 view of a cozy rustic wooden bed with a peaceful young person sleeping under a soft blanket, serene expression, surrounded by a warm protective golden aura, clean comic book illustration with digital watercolor texture, game asset on isolated background.
  ```

### 7.2 Os 3 Guias Espirituais
- **Mentor de Luz (Nv1, Nv2, Nv3)**:
  ```text
  2D game character sprite, top-down 3/4 view, male spiritual mentor guide 'Mentor de Luz' in traditional white linen clothes, holding a glowing golden spark in his hands, serene benevolent expression, clean comic book lineart with digital watercolor, isolated on dark background, game asset.
  ```
- **Benzedeira (Nv1, Nv2, Nv3)**:
  ```text
  2D game character sprite, top-down 3/4 view, Brazilian spiritual healer grandmother 'Benzedeira', kind smiling elder woman holding a fragrant green sprig of rue herb in her hand, handmade crochet shawl, warm protective green and golden light aura, clean comic book lineart with digital watercolor, isolated on dark background.
  ```
- **Pajé (Nv1, Nv2, Nv3)**:
  ```text
  2D game character sprite, top-down 3/4 view, Brazilian indigenous shaman 'Pajé', ancestral body paintings, traditional feather headdress, holding a sacred maracá with fragrant herb smoke swirling around, mystical warm amber and orange spiritual fire glow, clean comic book lineart with digital watercolor, isolated on dark background.
  ```

### 7.3 Espíritos Perturbados & Chefão
- **Larva Astral**:
  ```text
  2D game enemy sprite, top-down 3/4 view, small ethereal smoky astral larva creature, restless swirling dark purple and slate smoke with tiny faint glowing violet eyes, comic book linework with watercolor mist, isolated on dark background.
  ```
- **Zombeteiro**:
  ```text
  2D game enemy sprite, top-down 3/4 view, mischievous trickster astral spirit, agile floating smoky imp silhouette with a grinning expressive comic mouth and glowing yellow mischievous eyes, leaping posture, dark vapor trails, isolated on dark background.
  ```
- **Obsessor**:
  ```text
  2D game enemy sprite, top-down 3/4 view, heavy imposing dark shadowy spiritual stalker figure, dense heavy smoke silhouette with stubborn brooding posture, faint dark red and charcoal aura, comic book linework, isolated on dark background.
  ```
- **Sombra de Mágoa**:
  ```text
  2D game enemy sprite, top-down 3/4 view, gliding sorrowful astral spirit, weeping translucent gray mist silhouette, tears of gray mist trailing behind, sorrowful expression, immune to winds, comic book lineart, isolated on dark background.
  ```
- **Obsessor-Mor (Chefão)**:
  ```text
  2D game boss enemy sprite, top-down 3/4 view, colossal shadowy astral warlord spirit 'Obsessor-Mor', massive swirling storm of dark shadows, menacing glowing eyes, crackling with dark purple spiritual miasma, dramatic comic book illustration with ink contours and watercolor textures, isolated on dark background.
  ```
- **Espírito Arrependido (Redimido)**:
  ```text
  2D game character illustration, benevolent glowing spirit of a redeemed human soul, serene repentant smile, hands joined in gratitude, made of soft white, golden and cyan pure light particles dissolving upwards peacefully, comic book lineart with warm celestial watercolors, isolated on dark background.
  ```

### 7.4 Ícones de Power-ups & UI
- **Escudo do Anjo da Guarda**:
  ```text
  Circular game power-up icon, radiant golden angel wings forming a protective shield with a luminous white cross and warm halo, crystal violet border, comic book art style, isolated.
  ```
- **Chuva de Luz**:
  ```text
  Circular game power-up icon, celestial golden beam of sunlight breaking through clouds with falling sacred light droplets, crystal violet border, comic book art style, isolated.
  ```
- **Sono Profundo**:
  ```text
  Circular game power-up icon, glowing lavender crescent moon and mystical hourglass with sparkling slumber stars, crystal violet border, comic book art style, isolated.
  ```
- **Fervor Sagrado**:
  ```text
  Circular game power-up icon, sacred spiritual flame combined with crackling golden lightning spark, energetic glow, crystal violet border, comic book art style, isolated.
  ```
- **Banner de Vitória**:
  ```text
  Wide landscape game banner illustration, a peaceful Brazilian bedroom being flooded with warm morning sunrise rays through the window, the sleeping person smiling serenely, a redeemed luminous spirit ascending into light, warm golden and pastel watercolors, clean comic book lines, celebratory and uplifting feeling.
  ```
