# Auditoria da implementação das telas — 08/10/2026

## Parecer

Revisão independente Tier 3 aprovada, sem achados acionáveis restantes. Auditor leu o código, conferiu os eventos do Phaser instalado e examinou capturas e evidências fornecidas pelo agente principal. Foco, descarte de callbacks, reinicialização de HUD, caminhos das cinco imagens e recuperação de falhas foram aprovados. Aplicação ao jogo autorizada explicitamente por Bruno nesta rodada.

## Evidências

| Verificação | Resultado |
|---|---|
| Build TypeScript/Vite | Aprovado; aviso de tamanho do bundle Phaser permanece |
| Vitest | 8/8 aprovados em 3 arquivos |
| Abertura normal | Logo, arte, som e instruções; nenhum combate antes de entrar |
| Carregamento | Progresso real dos arquivos; dicas mudam; entrada só após estar pronto |
| Ajuda via teclado | Tab permanece no diálogo; Escape devolve foco a Como jogar |
| Vitória e derrota | Artes/temas próprios; score, Luz e purificações reais; sem Cristais fictícios |
| Retorno ao menu | Modal e QA encerrados; menu visível; próximo Jogar inicia nova travessia |
| Replay | Novo estado com 250 Essência, 20 Luz, 100 Cristais e gameOver false no QA |
| Listeners após replay | Um clique em velocidade resultou em 2× e gameSpeed 2, sem dupla alternância |
| Falha real de processamento | PNG inexistente recebeu fallback HTML do Vite; loader bloqueou entrada e mostrou Falha/retry |
| Retry após erro | Método de preload restaurado na sessão de teste; arquivos válidos em cache; 100% e entrada habilitada |
| Retrato 390 × 844 | Página sem overflow horizontal; logo, conteúdo, cards e ações visíveis |
| Paisagem 844 × 390 | Card permite rolagem; ação Voltar ao início acessível dentro do viewport |

A falha de processamento foi provocada na sessão de navegador por inclusão temporária de uma imagem inválida no preload, sem salvar alteração no código. O método foi restaurado antes de tentar novamente. Um teste inicial removendo arquivo foi inconclusivo devido ao cache; arquivo restaurado e nenhum `.qa-hold` foi deixado no projeto.

Testes automatizados novos: ScreenFlow impede entrada precoce/dupla, limpa dicas e permite retry sem continuação antiga; BootScene bloqueia imagem inválida e JSON não processado mesmo sem HTTP error, e aguarda confirmação do jogador no sucesso.

## Capturas

`docs/qa/screens/`: início e carregamento desktop/mobile, vitória e derrota desktop/mobile, derrota em paisagem, erro de carregamento. Capturas de resultado usam controles QA exclusivos de DEV; não são prova de vitória natural ou de balanceamento. Viewports menores foram verificados em iframes com dimensões reais de viewport; não representam execução em um aparelho Android ou APK.

## Escopo preservado

Sem alteração de custos, danos, ondas, economia ou backend. Imagens reorganizadas em brand e screens; fontes e arte histórica preservadas em seus diretórios. Arquivos originais permanecem na resolução nativa. Tarefas de Android, publicação, telemetria final e resolução dos cenários continuam fora desta entrega.
