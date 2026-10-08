# Auditoria — guardiões astrais épicos

Data: 08/10/2026. Geração seguida de integração autorizada expressamente por Bruno. Aprovação estética final permanece com o usuário ao testar a partida.

## Pacote e integração

18 imagens novas geradas com referências por família; três retratos derivados e cinco camadas reutilizadas. Fontes nativas, prompts, hashes, dimensões, caixas de alfa, escala de exibição e ancoragens estão em `public/guardian-art/manifest.json`. Fontes quadradas nativas de 1254×1254 foram reduzidas para 512×512; as duas imagens do chefe foram entregues em 1024×1024. Verificação automática confirmou alfa real, cantos transparentes e dimensões de todos os 18 sprites.

Nove texturas próprias dos guardiões; quatro texturas distintas dos inimigos; duas fases do Colosso do Eclipse. Cartas usam retratos derivados. Fenda e cristal do sonho nos extremos reais da rota de 34 células. Sombras e animações independentes; proporções preservadas. Vitória usa espírito purificado. Sem associação religiosa reconhecível na inspeção das imagens.

## Testes executados

- Build TypeScript/Vite aprovado. Apenas aviso de bundle Phaser acima de 500 kB.
- `test:balance`: 2/2 testes aprovados. Revisão Tier 3 confirmou todos os valores numéricos e booleanos dos quatro JSONs de regras iguais ao HEAD anterior à revisão visual.
- Compra e inspeção de cada guardião, duas evoluções por família e troca das nove texturas confirmadas pelo estado observável no navegador. Botão de evolução fica desabilitado no nível máximo.
- Venda do Núcleo de Brasa N3: essência de 8525 para 8979, removendo a unidade; reembolso existente preservado.
- Chefe N1: 3000 HP e textura `spirit_boss`; abaixo de 50%: textura `spirit_boss_phase2`, fase 2 e invocações observadas.
- Purificação, recompensa, tela de vitória com criatura perolada, derrota e dois reinícios testados. Compra após reinícios debitou uma vez: 250 para 150.
- Passagem das hordas 1, 2 e 3 observada no navegador, incluindo Sentinela do Vazio e Espectro da Névoa. Horda final criou o chefe pelo fluxo real.
- Exposição dos nove níveis, quatro inimigos e chefe em 1280×720 e 1920×1080: sem quadrados de fundo, deformação ou corte da fenda/núcleo. Rota visual coincide com deslocamento. Capturas em `public/guardian-art/guardioes-jogo-1920.jpg` e `partida-guardioes.jpg`.
- Nenhum erro de aplicação/carregamento de sprites nos testes interativos. Modos QA e exposição são restritos a DEV e não enviam pontuação ao ranking.

## Limitações registradas

Cosmos e piso mantêm resolução nativa 1672×941, abaixo do alvo 2560×1440. Nenhuma ampliação artificial foi feita. Ícones e efeitos ilustrados adicionais permanecem fora desta rodada.

O Autoplay com os recursos iniciais perdeu na horda 3 durante o ensaio real; o teste de balanceamento automatizado é uma simulação simplificada e não prova vitória desse controlador. O ensaio das quatro hordas com todos os guardiões N3 usou essência extra apenas no modo QA. Não houve alteração de custos, dano ou regras para corrigir esse comportamento. O texto do botão passou a descrever uma demonstração automática, sem prometer vitória.
