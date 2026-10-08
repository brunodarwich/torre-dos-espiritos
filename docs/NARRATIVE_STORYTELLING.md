# Torre dos Espíritos — Narrativa do Santuário do Sonho

**Revisão de 08/10/2026:** Bruno escolheu guardiões épicos de fantasia astral, com corpos sólidos, armaduras inventadas e personalidade, preservando a ausência de associação religiosa. A revisão está integrada à partida local. Narrativa anterior em `docs/archive/`; aprovação estética final do usuário ainda pendente e QA interativo concluído.

## Premissa

No plano astral, um núcleo guarda a luz de um sonho. Perturbações atravessam uma fenda e percorrem o santuário para alcançá-lo. Prisma Solar, Véu de Aurora e Núcleo de Brasa transformam essas sombras em centelhas serenas, preservando o sonho.

## Contexto e usuário

Tower defense casual-midcore para navegador desktop, celular e Android, com sessões curtas e pausa disponível. A direção atual prioriza jogadores que apreciam fantasia sobrenatural, personagens originais e uma experiência acolhedora.

## Dor e tese da solução

A revisão responde ao problema concreto observado no protótipo: sprites opacos, cenário incompatível com a rota, unidades repetidas e falta de coesão. Um conjunto de camadas e entidades produzido sob a mesma direção de arte permite ler o combate e reconhecer o universo.

Purificar significa converter perturbações em energia luminosa, sem violência gráfica. O clímax mostra o Colosso do Eclipse dissolvendo-se em uma pequena criatura perolada enquanto o núcleo recupera a luz. Sem revelação de pessoa humana realista ou representação de prática religiosa.

## Impacto e posicionamento

Fantasia astral autoral, acolhedora, misteriosa e esperançosa. Protetores com identidade por forma, cor e função. Mantêm-se três protetores, três níveis, hordas e chefão, monetização opcional e compromisso de vitória sem compras.

## Vocabulário público

- Mentor de Luz → Prisma Solar; Benzedeira → Véu de Aurora; Pajé → Núcleo de Brasa.
- Obsessor → Sentinela do Vazio; Sombra de Mágoa → Espectro da Névoa; Obsessor-Mor → Colosso do Eclipse.
- Cama e pessoa adormecida como objetivo → núcleo do sonho.
- Escudo do Anjo → Barreira Astral; Chuva de Luz → Cascata de Luz; Sono Profundo → Estase Onírica; Fervor Sagrado → Pulso Astral.
- Arruda, oração e fumaça ritualística → onda de aurora, pulso de estase e plasma.

IDs internos podem ser preservados para compatibilidade. Textos públicos já foram alterados na integração autorizada pelo Bruno. Custos, dano, cadência e regras de combate permanecem os mesmos.

## Protetores e entrega visual

Prisma Solar é esguio, com armadura dourada e máscara facetada; Véu de Aurora tem placas de jade e faixas de energia ligadas ao corpo; Núcleo de Brasa é robusto, de basalto com plasma âmbar no peito. Evoluções acrescentam armadura e modificam a silhueta. As criaturas das hordas e o chefe possuem corpos próprios, sem feições realistas, roupas culturais ou símbolos religiosos.

Foram integrados 18 sprites novos, 3 retratos derivados e 5 camadas de ambiente. Sprites comuns: PNG RGBA de 512 × 512; chefe nas duas fases: 1024 × 1024. Cosmos e piso permanecem em resolução nativa de 1672 × 941; a meta de 2560 × 1440 continua pendente.

Teste local em http://localhost:5173/. Modos exclusivos do servidor de desenvolvimento: `?artPreview=1` apresenta a arte estática e `?qa=1` permite ensaios observáveis por botões. Esses modos não enviam pontuações ao ranking.
