# Fluxo visual — menu, carregamento e resultado

Pedido de implementação autorizado por Bruno em 08/10/2026, dentro do Marco 4. Mantém Phaser/TypeScript/Vite e o backend Python existente.

## Jornada

1. A página exibe o menu ilustrado, logo, Jogar, Como jogar e som. A partida ainda não existe.
2. Jogar abre a arte de carregamento; o loader Phaser informa o progresso real dos arquivos. Sete dicas rotativas usam regras existentes: posicionamento, papéis dos três guardiões, combinações, evolução, venda a 70%, bônus entre hordas e pausa.
3. Quando todos os arquivos necessários estão prontos, a barra chega a 100% e aparece Entrar no sonho. Não há espera artificial nem avanço simulado. O clique inicia a cena GameScene.
4. Erro de arquivo impede a entrada e oferece Tentar novamente. Arquivos já carregados permanecem em cache.
5. Vitória/derrota abrem um card ilustrado com a arte correspondente, logo, mensagem contextual, pontuação, Luz restante e espíritos purificados. Nenhum prêmio de Cristais é inventado.
6. Jogar novamente atravessa o carregamento; Voltar ao início encerra a cena atual e retorna ao menu. Aborts e shutdown removem callbacks antigos; banners e dicas não atravessam novas partidas.

Modos `?qa=1` e `?artPreview=1` continuam exclusivos do desenvolvimento e entram direto na partida após carregar. Não enviam score de QA.

## Arquivos e responsabilidades

- `frontend/src/ui/ScreenFlow.ts`: catálogo das cinco imagens, estados DOM, dicas, progresso, erro, áudio e foco.
- `frontend/src/scenes/BootScene.ts`: carregamento real e validação de erros.
- `frontend/src/scenes/MenuScene.ts`: retorno ao início com encerramento da partida anterior.
- `frontend/src/ui/UIManager.ts`: card de resultado, dados reais e callbacks de navegação.
- `frontend/index.html` e `frontend/src/style.css`: composições responsivas, logo e acessibilidade visual.
- `frontend/public/assets/README.md`: inventário dos diretórios e fontes históricas preservadas.

## Verificação

`npm run build` aprovado; `npm test` com 8 testes aprovados (2 de balanceamento existentes, 3 de navegação/recuperação e 3 de processamento de arquivos do Boot). Revisão independente Tier 3 aprovada. QA de navegador confirmou menu, ajuda/Tab, carregamento/dicas, partida, vitória, derrota, replay, retorno ao início e falha seguida de retry. Capturas desktop 1904 × 985 e viewports em iframe de 390 × 844 e 844 × 390 em `docs/qa/screens/`. Parecer e limites em `docs/SCREEN_FLOW_AUDIT.md`.

O loader acompanha `addfile` e `filecomplete`, além de `loaderror`. Isso bloqueia arquivos que receberam resposta HTTP mas não puderam ser decodificados como imagem ou JSON. A porcentagem mede arquivos processados, e a confirmação de entrada depende de todos estarem prontos.
