# Playbook de Git, Branches, PRs & Deploy: Torre dos Espíritos

> **Diretriz de Versionamento e Entrega Contínua**
> Repositório oficial privado: `https://github.com/brunodarwich/torre-dos-espiritos`

---

## 0. Estado do Repositório (Inicializado no Marco 1)

O repositório já foi criado como privado via GitHub CLI e configurado:
- Remoto `origin`: `https://github.com/brunodarwich/torre-dos-espiritos.git`
- Remoto `framework`: `https://github.com/brunodarwich/dev-ia-bd.git` (backup de referência dos templates)

---

## 1. Estratégia de Branches

Adotamos **Trunk-Based simplificado**:
- **`main`**: Código estável pronto para build web e empacotamento Android.
- **`feat/marco-X`**: Branches de entrega de cada marco ou funcionalidade específica.
- **`fix/nome-do-bug`**: Correções de bugs de jogabilidade ou balanceamento.

---

## 2. Convenção de Commits Semânticos

Seguir o padrão de commits semânticos atômicos:
- `feat:` Nova mecânica, cena, tela ou rota backend (ex: `feat: adiciona mecanica de purificacao de espiritos`)
- `fix:` Correção de bug (ex: `fix: corrige deteccao de colisao no caminho do mapa`)
- `docs:` Ajustes em documentação ou GDD (ex: `docs: atualiza PRD com novos valores de essencia`)
- `test:` Inclusão de testes unitários ou simulações (ex: `test: simulador de balanceamento sem powerups`)
- `chore:` Atualizações de build, capacitor ou dependências (ex: `chore: configura capacitor para android`)

---

## 3. Fluxo de Deploy & Publicação Multiplataforma

### 3.1 Web (Cloudflare Pages / itch.io)
1. Build estático no frontend:
   ```powershell
   cd frontend
   npm run build
   ```
2. Publicação automática dos arquivos da pasta `dist/` para a CDN / itch.io via butler ou Git hook.

### 3.2 Android (Google Play Store)
1. Sincronização do build web com o Capacitor:
   ```powershell
   cd frontend
   npx cap sync android
   ```
2. Abertura e build do pacote no Android Studio / Gradle:
   ```powershell
   cd frontend/android
   ./gradlew bundleRelease
   ```
3. O artefato `.aab` assinado é enviado para a trilha interna/fechada do Google Play Console.

### 3.3 Backend (Render / Fly.io)
1. Container Docker ou runtime Python nativo apontado para `backend/app/main.py`.
2. Variáveis de ambiente configuradas no painel seguro do host.

---

## 4. Checklist de "Go / No-Go" para Lançamento

| Critério de Verificação | Responsável | Status (Go / No-Go) |
|---|---|---|
| **1. Segurança de Segredos**: Nenhuma chave de API ou segredo sensível exposto em código ou no front? | IA / Bruno | `[ ] GO` |
| **2. Simulador de Vitória Sem Pagar**: Teste automatizado garante 100% de vitória no modo Normal sem power-ups? | IA / Tier 3 | `[ ] GO` |
| **3. Build Android sem Crash**: APK/AAB instala, abre e joga a 60 FPS estáveis em dispositivo Android de teste? | Bruno / IA | `[ ] GO` |
| **4. Purificação & Sem Violência**: Efeitos visuais respeitam o tom de resgate e classificação Livre/10+? | Bruno | `[ ] GO` |
| **5. Validação de Compras & Anúncios**: Google Play Billing e AdMob testados em sandbox sem erros? | Bruno / IA | `[ ] GO` |
| **6. Telemetria Ativa**: Eventos básicos (`game_opened`, `first_purification`, `wave_completed`) chegam ao backend? | IA / Tier 2 | `[ ] GO` |
