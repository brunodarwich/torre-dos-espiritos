# Santuário do Sonho — guardiões astrais épicos

**Rodada autorizada em 08/10/2026:** substituir os protetores incorpóreos por humanoides fantásticos e integrar a arte à partida local. O pedido autoriza geração seguida de integração sem novo checkpoint intermediário. A primeira prova abstrata permanece em `public/art-preview/` como histórico.

## Direção atual

Ilustração 2D de fantasia astral: contornos limpos, volumes simplificados, textura pictórica discreta e luz superior esquerda. Corpos sólidos, membros e armaduras inventadas; rosto de energia ou máscara sem traços humanos realistas. Sem roupas culturais, cocares, instrumentos ritualísticos ou símbolos religiosos. Piso ortográfico; personagens em 3/4 frontal levemente vistos de cima.

## Protetores e evoluções

| ID interno | Nome | N1 | N2 | N3 |
|---|---|---|---|---|
| mentor | Prisma Solar | Centelha: guardião esguio de armadura dourada | Sentinela Solar: ombreiras e órbita cristalina | Avatar Prismático: armadura expandida e lâminas de luz |
| benzedeira | Véu de Aurora | Vigia da Aurora: corpo de jade e duas faixas | Tecelão Astral: placas e espirais adicionais | Guardião da Aurora: coroa de arcos e faixas amplas |
| paje | Núcleo de Brasa | Braseiro Vivo: golem compacto de basalto | Cavaleiro Ígneo: braços e ombreiras maiores | Colosso de Brasa: placas expandidas e três arcos de plasma |

## Escopo desta entrega

18 imagens novas: 9 protetores, 4 inimigos (Larva Astral, Zombeteiro, Sentinela do Vazio, Espectro da Névoa), 2 fases do Colosso do Eclipse, 1 espírito purificado, 1 fenda e 1 núcleo. Reutilizam-se 5 camadas de ambiente; 3 retratos derivam dos modelos N1. Ícones, efeitos ilustrados e marketing do catálogo anterior ficam fora desta rodada.

- PNG RGBA 512×512; chefe 1024×1024. Margens transparentes de 10–15%, sprites completos, sem cenário, texto ou sombra incorporada.
- Canvas lógico: protetores 80×80, comuns 64×64, chefe 128×128. Objetivos cabem em 72×96 sem deformação.
- Mesma escala por família de protetores e mesma linha de base entre níveis. Sombras, flutuação e impacto são produzidos separadamente no motor.
- Fontes e prompts em `public/guardian-art/`; arquivos usados pelo jogo em `frontend/public/assets/astral/`. Manifesto separa dimensões nativas de entrega.
- Cosmos e piso nativos 1672×941 mantêm a pendência do alvo 2560×1440. Não ampliar para simular detalhe nativo.
- Caminho usa a rota real e as origens medidas em `environment_manifest.json`; não presumir origem central para curvas.

## Integração e aceite

Cada nível e inimigo usa textura própria. Fase 2 muda a textura do chefe, preservando seus gatilhos existentes. Vitória usa o espírito purificado e o santuário. Atualizar todos os textos públicos para fantasia astral, mantendo IDs, custos, dano, composição das hordas e regras.

Aceite: canal alfa real; contornos sem quadrados; silhuetas e níveis distinguíveis; rota e ancoragens corretas; build e balanceamento aprovados; seleção/evoluções/venda, fases do chefe, vitória/derrota e reinícios testados localmente. Modos de inspeção e QA existem apenas em desenvolvimento.
