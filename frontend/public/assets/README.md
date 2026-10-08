# Inventário de imagens

As cinco imagens de marca e telas têm um único local de uso, organizado por finalidade:

```text
brand/
  torre-dos-espiritos-logo-v1.png
screens/
  home/sonho-guardioes-inicial-v1.png
  loading/carregamento-astral-v1.png
  results/vitoria-sonho-v1.png
  results/derrota-sonho-v1.png
astral/
  sprites, retratos, piso, cosmos, caminho e manifestos ativos da partida
```

Os diretórios `guides/`, `spirits/`, `environment/`, `powerups/` e `ui/` preservam os materiais anteriores. Na raiz do repositório, `public/guardian-art/source/` preserva as fontes dos guardiões; `public/guardian-art/` contém folhas de comparação e capturas. `public/art-preview/` preserva a prova visual anterior. São materiais históricos, separados das imagens usadas pelo jogo.

Prompts das telas em `docs/BRANDING_OPENING_ART.md` e `docs/SCREEN_STATE_ART.md`. O catálogo de caminhos consumido pelo frontend fica em `src/ui/ScreenFlow.ts`. PNGs originais, sem recorte destrutivo, ampliação ou alteração de transparência.
