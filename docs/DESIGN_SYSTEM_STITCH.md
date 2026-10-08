# Design System — Santuário do Sonho

**Direção atual: guardiões astrais épicos, 08/10/2026.** O pedido do Bruno substitui os protetores abstratos da primeira prova por humanoides fantásticos e autoriza integração direta após geração.

## Identidade

Artes adicionais de vitória, derrota e carregamento produzidas em 08/10/2026 na mesma identidade da abertura, em `frontend/public/assets/brand/` e `frontend/public/assets/screens/`. Vitória usa amanhecer e purificação; derrota usa eclipse e santuário fraturado; carregamento usa ponte e portal astral. Textos e barra ficam como elementos independentes da interface. Prompts, dimensões e revisão em `docs/SCREEN_STATE_ART.md`. Integradas ao fluxo por solicitação de Bruno em 08/10/2026; refinamento estético disponível.

Logo e arte de abertura criados em 08/10/2026: torre cristalina com lettering dourado; cena da pessoa dormindo com os três guardiões no sonho. Arquivos em `frontend/public/assets/brand/` e `frontend/public/assets/screens/`; prompts e dimensões em `docs/BRANDING_OPENING_ART.md`. Aplicação às telas autorizada por Bruno em 08/10/2026. Logo e fundo são camadas independentes para permitir composição responsiva do menu.

Ilustração 2D de fantasia, contornos limpos, volumes simplificados, textura pintada discreta. Luz superior esquerda. Corpo sólido com torso, braços, pernas e armadura inventada. Máscaras facetadas ou rostos de energia, sem feições humanas realistas, roupas culturais, cocares, instrumentos ritualísticos ou símbolos religiosos.

Paleta: cosmos `#0B0F19`, pedra/painéis `#171D2E`, bordas `#2D3748`, violeta `#9F7AEA`, Prisma Solar `#F6E05E`, Véu de Aurora `#48BB78`, Núcleo de Brasa `#ED8936`, caminho/Essência `#4FD1C5`.

## Composição

Grade 16×9 de 80 pixels, canvas lógico 1280×720. Cosmos, piso, caminho e entidades independentes. Piso ortográfico; entidades em 3/4 frontal levemente vistas de cima. Protetores 80×80, inimigos 64×64, chefe 128×128; proporções preservadas e sombras separadas. PNGs com alfa real; mesma linha de base dos três níveis de cada protetor. Origem das peças do caminho registrada no manifesto.

Fonte de interface sem serifa Outfit/Inter/Segoe UI, números tabulares, texto fora das imagens. Cards mostram retratos dos novos modelos.

## Unidades

Prisma Solar: armadura dourada cristalina esguia, palmada de luz. Véu de Aurora: corpo ágil de placas de jade e faixas ligadas aos braços. Núcleo de Brasa: golem robusto de basalto com forno no peito. Evoluções ampliam estrutura e silhueta; não apenas brilho.

Sentinela do Vazio e Espectro da Névoa substituem os nomes anteriores dos inimigos pesados. Colosso do Eclipse tem armadura fechada na fase 1 e núcleo exposto na fase 2.

## Prompt Stitch atualizado

```text
Landscape 16:9 tower defense HUD for Torre dos Espíritos — Santuário do Sonho. Readable sans-serif text, navy/indigo panels, cyan resources. DIRECT OVERHEAD astral stone floor, modular path using actual supplied route, entry rift and floating dream crystal. Characters are SOLID FANTASY HUMANOID GUARDIANS, not disembodied energy: slender golden crystal knight Prisma Solar, agile jade-armored Veu de Aurora, stocky basalt golem Nucleo de Brasa. Three distinct armor evolutions each. Four distinct supernatural enemy creatures and monumental violet Colosso do Eclipse. Match generated reference artwork. No realistic human faces, cultural attire, ritual objects or religious symbols. Keep art independent from UI text.
```

Inventário e contratos em `docs/SANCTUARY_ART_PRODUCTION.md`; prompts finais em `public/guardian-art/manifest.json`. Primeira prova abstrata arquivada visualmente em `public/art-preview/`. Pendência conhecida: cenários nativos 1672×941, abaixo do alvo 2560×1440.
