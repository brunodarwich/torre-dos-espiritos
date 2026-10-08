# Canvas da Proposta de Valor: Torre dos Espíritos

> **Metodologia**: Value Proposition Canvas (Osterwalder) com amarração estrita 1:1 (Sebrae Startups).
> **Regra de Ouro**: toda dor tem aliviador; todo ganho tem criador; nenhuma feature sem lastro.

---

## 1. Perfil do Cliente (Jogador)

### 1.1 Tarefas do Cliente
- **Funcionais**: Passar o tempo em sessões curtas (5–15 min) no celular ou PC; resolver um desafio estratégico; poder pausar e retomar.
- **Emocionais**: Relaxar; sentir-se competente ao vencer; sentir paz/esperança, não tensão violenta.
- **Sociais**: Comparar desempenho com outros (ranking); compartilhar algo com identidade brasileira de que se orgulha.

### 1.2 Dores Concretas

| ID | Dor / Fricção Concreta | Intensidade | Custo Prático |
|---|---|---|---|
| **DOR-01** | Jogos do gênero são genéricos/estrangeiros, sem identidade espiritual ou brasileira | Alta | Desinteresse e abandono rápido; sensação de "mais do mesmo" |
| **DOR-02** | Temas violentos (morte, sangue, guerra) que não combinam com quem busca leveza/espiritualidade | Média | Desconforto; pais evitam para crianças |
| **DOR-03** | Anúncios forçados e intrusivos interrompem a partida | Alta | Frustração; desinstalação |
| **DOR-04** | Mecânicas "pay-to-win": quem não paga não consegue vencer | Alta | Sensação de injustiça |
| **DOR-05** | Controles ruins no celular (alvos pequenos, posicionamento impreciso) | Média | Erros de construção, irritação |
| **DOR-06** | Jogos longos/complexos que não cabem em pausas curtas e não salvam progresso | Média | Partidas abandonadas no meio |

### 1.3 Ganhos Desejados

| ID | Ganho Desejado | Relevância | Critério de Sucesso |
|---|---|---|---|
| **GANHO-01** | Sentir-se representado por um universo brasileiro bonito e respeitoso | Essencial | "Nunca vi um jogo assim" — comentários e compartilhamentos |
| **GANHO-02** | Satisfação estratégica de montar a defesa perfeita e evoluir os guias | Essencial | Jogador testa combinações e repete a partida |
| **GANHO-03** | Final emocional e significativo | Desejado | Cena do Obsessor-Mor purificado gera reação/compartilhamento |
| **GANHO-04** | Competir/comparar pontuação com outros jogadores | Desejado | Jogador consulta e tenta subir no ranking |
| **GANHO-05** | Jogar em qualquer tela (PC, celular, navegador) sem instalar nada para experimentar | Desejado | Primeira partida iniciada em < 10 s pela web |
| **GANHO-06** | Ter uma "carta na manga" nos momentos difíceis | Desejado | Usa um power-up para virar uma horda quase perdida e se sente aliviado, não extorquido |

---

## 2. Mapa de Valor do Produto

### 2.1 Produtos & Serviços
- Jogo Tower Defense 2D (Phaser 3) — web desktop/mobile + app Android.
- Backend leve (FastAPI): ranking global, telemetria própria e validação de compras.
- Loja de **power-ups consumíveis** (Escudo do Anjo da Guarda, Chuva de Luz, Sono Profundo, Fervor) pagos com a moeda premium **Cristais** — ganha jogando, via anúncio recompensado opcional ou comprando pacotes.

### 2.2 Aliviadores de Dor e 2.3 Criadores de Ganho
Detalhados nas matrizes abaixo.

---

## 3. Matriz de Fit Problema-Solução (Auditoria 1:1)

### 3.1 Dores vs. Aliviadores

| ID Dor | Dor | Aliviador no Produto | Funcionalidade no PRD |
|---|---|---|---|
| **DOR-01** | Falta de identidade espiritual brasileira | Universo astral com guias brasileiros (Mentor de Luz, Benzedeira, Pajé) e direção de arte autoral HQ/aquarela | RF-GUIAS, RF-ARTE/Narrativa (cenas de abertura e final) |
| **DOR-02** | Violência | Mecânica de **purificação**: inimigos se dissolvem em luz em vez de morrer | RF-PURIFICACAO (efeito visual de derrota) |
| **DOR-03** | Anúncios forçados | **Zero anúncios intersticiais**; apenas anúncio recompensado opcional iniciado pelo jogador | RF-ANUNCIO-RECOMPENSADO |
| **DOR-04** | Pay-to-win | Power-ups são **atalhos, nunca requisitos**: a fase é balanceada para ser vencida sem nenhum power-up; Cristais também são ganhos jogando; limite de uso por horda | RF-POWERUPS, RF-CRISTAIS, regra de balanceamento "vencível grátis" (teste automatizado) |
| **DOR-05** | Controles ruins no celular | Grade livre com células grandes, prévia de alcance e confirmação antes de construir; botões ≥ 48 dp | RF-GRADE-LIVRE, RF-UI-MOBILE |
| **DOR-06** | Partidas longas / sem save | Partida de ~10 min, pausa a qualquer momento, progresso e configurações salvos localmente | RF-PAUSA, RF-SAVE-LOCAL |

### 3.2 Ganhos vs. Criadores

| ID Ganho | Ganho | Criador no Produto | Funcionalidade no PRD |
|---|---|---|---|
| **GANHO-01** | Representação brasileira | Personagens com evolução humano → aura → forma astral; textos em PT-BR acolhedor | RF-GUIAS (3 níveis visuais) |
| **GANHO-02** | Satisfação estratégica | 3 papéis complementares (dano único, controle, área) + inimigos que exigem combinação (ex.: Sombra de Mágoa resiste à lentidão) | RF-GUIAS, RF-INIMIGOS, RF-HORDAS |
| **GANHO-03** | Final emocional | Chefão em 2 fases + cena de purificação revelando o espírito arrependido | RF-CHEFAO, RF-CENA-FINAL |
| **GANHO-04** | Competição | Ranking global com pontuação (Luz restante, tempo, Essência) | RF-RANKING (backend `/scores`) |
| **GANHO-05** | Jogar em qualquer tela | Build web leve (< 10 MB iniciais) + APK Android do mesmo código | RF-MULTIPLATAFORMA |
| **GANHO-06** | Carta na manga | Barra de 4 power-ups sempre visível na partida, com recarga e contador de Cristais | RF-POWERUPS, RF-LOJA-CRISTAIS |
