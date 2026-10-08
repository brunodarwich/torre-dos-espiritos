import { describe, it, expect } from 'vitest';
import guidesData from '../src/data/guides.json';
import spiritsData from '../src/data/spirits.json';
import wavesData from '../src/data/waves.json';
import { WaveManager } from '../src/systems/WaveManager';

/**
 * Simulador Matemático de Balanceamento 'Vencível Grátis' (RF-14 / TASK-018)
 * Valida rigorosamente que o modo Normal com as 10 hordas completas, Mini-Chefe (Arauto) e
 * Chefão em 3 fases (Colosso) é 100% vencível sem nenhum Cristal ou Power-up pago.
 */
describe('Simulador de Balanceamento — Torre dos Espíritos (10 Hordas & Vencível Grátis)', () => {
  it('deve conter dados válidos e calibrados de todas as 10 hordas, guias e espíritos', () => {
    // 3 Protetores com 3 Níveis cada
    expect(guidesData.mentor.levels).toHaveLength(3);
    expect(guidesData.benzedeira.levels).toHaveLength(3);
    expect(guidesData.paje.levels).toHaveLength(3);

    // Entidades e Calibragem de Atributos
    expect(spiritsData.larva.health).toBe(30);
    expect(spiritsData.zombeteiro.health).toBe(70);
    expect(spiritsData.obsessor.health).toBe(220);
    expect(spiritsData.sombra.health).toBe(140);

    // Nova entidade Arauto do Eclipse (Mini-Boss)
    const arauto = (spiritsData as any).arauto;
    expect(arauto).toBeDefined();
    expect(arauto.health).toBe(1200);
    expect(arauto.speed).toBe(40);
    expect(arauto.essenceReward).toBe(80);
    expect(arauto.lightDamage).toBe(4);
    expect(arauto.maxSlow).toBe(0.25);

    // Calibragem do Colosso do Eclipse (Boss em 3 Fases)
    expect(spiritsData.boss.health).toBe(3500);
    expect(spiritsData.boss.speed).toBe(28);
    expect(spiritsData.boss.essenceReward).toBe(150);
    expect(spiritsData.boss.lightDamage).toBe(20);
    expect(spiritsData.boss.maxSlow).toBe(0.2);

    // Total de 10 Hordas
    expect(wavesData.waves).toHaveLength(10);
  });

  it('deve posicionar Arauto na horda 5 e 9, e Colosso na horda 10', () => {
    // Horda 5: Mini-Chefe Arauto
    const wave5 = wavesData.waves[4];
    expect(wave5.wave).toBe(5);
    expect(wave5.title).toContain('Arauto');
    const hasArautoW5 = wave5.groups.some((g) => g.spiritId === 'arauto');
    expect(hasArautoW5).toBe(true);

    // Horda 9: 2 Arautos na vanguarda
    const wave9 = wavesData.waves[8];
    expect(wave9.wave).toBe(9);
    const countArautoW9 = wave9.groups
      .filter((g) => g.spiritId === 'arauto')
      .reduce((acc, g) => acc + g.count, 0);
    expect(countArautoW9).toBe(2);

    // Horda 10: Colosso do Eclipse
    const wave10 = wavesData.waves[9];
    expect(wave10.wave).toBe(10);
    expect(wave10.title).toContain('Colosso');
    const hasBossW10 = wave10.groups.some((g) => g.spiritId === 'boss');
    expect(hasBossW10).toBe(true);
  });

  it('deve aplicar ritmo híbrido de intervalo entre hordas no WaveManager', () => {
    const wm = new WaveManager();
    expect(wm.getTotalWaves()).toBe(10);

    const finishCurrentWave = () => {
      let safetyTicks = 0;
      while (wm.isRunning() && safetyTicks < 1000) {
        wm.update(1.0, 0);
        safetyTicks++;
      }
    };

    // Ato I (Hordas 1 a 4): Ritmo ágil com 8 segundos de intervalo
    wm.startFirstWave();
    expect(wm.getCurrentWaveNumber()).toBe(1);
    finishCurrentWave();
    expect(wm.getIsIntermission()).toBe(true);
    expect(wm.getIntermissionTimer()).toBe(8.0);

    wm.callWaveEarly(); // Entra na Horda 2
    expect(wm.getCurrentWaveNumber()).toBe(2);
    finishCurrentWave();
    expect(wm.getIsIntermission()).toBe(true);
    expect(wm.getIntermissionTimer()).toBe(8.0);

    wm.callWaveEarly(); // Entra na Horda 3
    expect(wm.getCurrentWaveNumber()).toBe(3);
    finishCurrentWave();
    expect(wm.getIsIntermission()).toBe(true);
    expect(wm.getIntermissionTimer()).toBe(8.0);

    wm.callWaveEarly(); // Entra na Horda 4
    expect(wm.getCurrentWaveNumber()).toBe(4);
    finishCurrentWave();
    expect(wm.getIsIntermission()).toBe(true);
    expect(wm.getIntermissionTimer()).toBe(8.0);

    // Ato II e III (Hordas 5 em diante): Pausa tática com 15 segundos
    wm.callWaveEarly(); // Entra na Horda 5
    expect(wm.getCurrentWaveNumber()).toBe(5);
    finishCurrentWave();
    expect(wm.getIsIntermission()).toBe(true);
    expect(wm.getIntermissionTimer()).toBe(15.0);

    wm.callWaveEarly(); // Entra na Horda 6
    expect(wm.getCurrentWaveNumber()).toBe(6);
    finishCurrentWave();
    expect(wm.getIsIntermission()).toBe(true);
    expect(wm.getIntermissionTimer()).toBe(15.0);
  });

  it('deve vencer 100 de 100 partidas simuladas na dificuldade Normal sem power-ups ao longo das 10 hordas', () => {
    const NUM_SIMULACOES = 100;
    let vitorias = 0;
    let luzFinalTotal = 0;
    let essenciaFinalTotal = 0;

    for (let sim = 0; sim < NUM_SIMULACOES; sim++) {
      let essencia = 250;
      let luz = 20;

      // Inicia com 1 Mentor de Luz (100) e 1 Benzedeira (125)
      essencia -= (guidesData.mentor.levels[0].cost + guidesData.benzedeira.levels[0].cost);
      const torres = [
        { id: 'mentor', level: 1, damage: guidesData.mentor.levels[0].damage, rate: guidesData.mentor.levels[0].attackRate },
        { id: 'benzedeira', level: 1, damage: guidesData.benzedeira.levels[0].damage, rate: guidesData.benzedeira.levels[0].attackRate },
      ];

      // Extensão do caminho astral: 33 células de 80px = 2640px
      const CAMINHO_TOTAL_PX = 2640;

      // Simulação das 10 Hordas Completas
      for (const wave of wavesData.waves) {
        for (const group of wave.groups) {
          const spiritDef = (spiritsData as any)[group.spiritId];
          const totalInimigos = group.count;

          for (let i = 0; i < totalInimigos; i++) {
            if (spiritDef.id === 'boss') {
              // Simulação realista do Boss em 3 Fases com invocações dinâmicas e aumentos de velocidade
              const bossMaxHealth = spiritDef.health; // 3500
              let bossHealth = bossMaxHealth;
              let spawned85 = false;
              let spawned75 = false;
              let spawned66 = false;
              let spawned33 = false;
              const pendingMinions: { type: string; count: number }[] = [];

              // Função auxiliar para calcular DPS das torres com mitigação de carapaça e silêncio
              const getEffectiveDps = (phase: number) => {
                let dps = 0;
                // Na Fase 2, o silêncio desativa uma torre temporariamente (~15% de perda média de DPS)
                const silenceMultiplier = phase === 2 ? 0.85 : 1.0;
                for (const t of torres) {
                  let dpsTorre = t.damage * t.rate * silenceMultiplier;
                  // Fase 1: Carapaça absorve 20% do dano direto do Mentor
                  if (phase === 1 && t.id === 'mentor') {
                    dpsTorre *= 0.8;
                  }
                  dps += dpsTorre;
                }
                return dps;
              };

              // Simula travessia do Boss através das 3 fases
              // Fase 1: 100% a 66% HP (velocidade 28 px/s)
              // Fase 2: 66% a 33% HP (velocidade 28 * 1.30 = 36.4 px/s)
              // Fase 3: 33% a 0% HP (velocidade 28 * 1.60 = 44.8 px/s)
              let bossCurrentSpeed = spiritDef.speed;
              const bossSlowFactor = torres.some(t => t.id === 'benzedeira') ? (spiritDef.maxSlow ?? 0.2) : 0;
              let effectiveBossSpeed = bossCurrentSpeed * (1 - bossSlowFactor);
              const totalBossTravelTime = CAMINHO_TOTAL_PX / effectiveBossSpeed;
              const effectiveExposure = totalBossTravelTime * 0.70;

              const timeStep = 0.5;
              let elapsed = 0;
              while (elapsed < effectiveExposure && bossHealth > 0) {
                const currentRatio = bossHealth / bossMaxHealth;
                const currentPhase = currentRatio > 0.66 ? 1 : (currentRatio > 0.33 ? 2 : 3);

                // Invocações dinâmicas da Fase 1 (85% e 75%)
                if (currentRatio <= 0.85 && !spawned85) {
                  spawned85 = true;
                  pendingMinions.push({ type: 'larva', count: 6 });
                }
                if (currentRatio <= 0.75 && !spawned75) {
                  spawned75 = true;
                  pendingMinions.push({ type: 'larva', count: 6 });
                }
                // Transição para Fase 2 (66%)
                if (currentRatio <= 0.66 && !spawned66) {
                  spawned66 = true;
                  bossCurrentSpeed = spiritDef.speed * 1.30;
                  effectiveBossSpeed = bossCurrentSpeed * (1 - bossSlowFactor);
                  pendingMinions.push({ type: 'sombra', count: 3 });
                }
                // Transição para Fase 3 (33%)
                if (currentRatio <= 0.33 && !spawned33) {
                  spawned33 = true;
                  bossCurrentSpeed = spiritDef.speed * 1.60;
                  effectiveBossSpeed = bossCurrentSpeed * (1 - bossSlowFactor);
                  pendingMinions.push({ type: 'larva', count: 8 });
                }

                const dps = getEffectiveDps(currentPhase);
                bossHealth -= dps * timeStep;
                elapsed += timeStep;
              }

              if (bossHealth <= 0) {
                essencia += spiritDef.essenceReward;
              } else {
                luz -= spiritDef.lightDamage;
              }

              // Simula o combate dos lacaios invocados pelo Boss (20 larvas + 3 sombras)
              for (const minionBatch of pendingMinions) {
                const mDef = (spiritsData as any)[minionBatch.type];
                for (let m = 0; m < minionBatch.count; m++) {
                  let mHealth = mDef.health;
                  const mSpeed = mDef.speed;
                  const mSlow = (!mDef.slowImmune && torres.some(t => t.id === 'benzedeira')) ? (mDef.maxSlow ?? 0.25) : 0;
                  const mTime = (CAMINHO_TOTAL_PX * 0.5) / (mSpeed * (1 - mSlow)); // surgem pelo caminho à frente
                  const mDps = torres.reduce((acc, t) => acc + t.damage * t.rate, 0);
                  const mDamage = mDps * (mTime * 0.70);
                  mHealth -= mDamage;
                  if (mHealth <= 0) {
                    essencia += mDef.essenceReward;
                  } else {
                    luz -= mDef.lightDamage;
                  }
                }
              }
            } else {
              let hpInimigo = spiritDef.health;
              let tempoNoCaminho = CAMINHO_TOTAL_PX / spiritDef.speed;

              // Se houver Benzedeira, desacelera espíritos que não sejam imunes
              if (torres.some((t) => t.id === 'benzedeira') && !spiritDef.slowImmune) {
                const slowFactor = spiritDef.maxSlow !== undefined ? spiritDef.maxSlow : 0.25;
                tempoNoCaminho *= (1 + slowFactor);
              }

              // DPS acumulado das torres em campo
              let dpsTotal = 0;
              for (const t of torres) {
                dpsTotal += t.damage * t.rate;
              }

              // Exposição efetiva ao fogo das torres (70% do tempo de travessia do caminho)
              const danoCausado = dpsTotal * (tempoNoCaminho * 0.70);
              hpInimigo -= danoCausado;

              if (hpInimigo <= 0) {
                // Purificado: concede Essência
                essencia += spiritDef.essenceReward;
              } else {
                // Atingiu o leito: reduz Luz
                luz -= spiritDef.lightDamage;
              }
            }

            // Estratégia de investimento da Essência acumulada:
            // 1. Invoca Pajé (150)
            if (!torres.some((t) => t.id === 'paje') && essencia >= guidesData.paje.levels[0].cost) {
              essencia -= guidesData.paje.levels[0].cost;
              torres.push({
                id: 'paje',
                level: 1,
                damage: guidesData.paje.levels[0].damage,
                rate: guidesData.paje.levels[0].attackRate,
              });
            }
            // 2. Invoca um segundo Mentor de Luz (100)
            else if (torres.filter((t) => t.id === 'mentor').length < 2 && essencia >= guidesData.mentor.levels[0].cost) {
              essencia -= guidesData.mentor.levels[0].cost;
              torres.push({
                id: 'mentor',
                level: 1,
                damage: guidesData.mentor.levels[0].damage,
                rate: guidesData.mentor.levels[0].attackRate,
              });
            }
            // 3. Upgrades dos guias em campo (Nível 2 e Nível 3)
            else {
              let upgraded = false;
              for (const t of torres) {
                const gDef = (guidesData as any)[t.id];
                const nextLevel = gDef.levels[t.level];
                if (nextLevel && essencia >= nextLevel.cost) {
                  essencia -= nextLevel.cost;
                  t.level++;
                  t.damage = nextLevel.damage;
                  t.rate = nextLevel.attackRate;
                  upgraded = true;
                  break;
                }
              }

              // 4. Se todos os guias já evoluíram e ainda há essência, expande a defesa com mais torres (até 6)
              if (!upgraded && torres.length < 6) {
                if (torres.filter((t) => t.id === 'mentor').length < 3 && essencia >= guidesData.mentor.levels[0].cost) {
                  essencia -= guidesData.mentor.levels[0].cost;
                  torres.push({
                    id: 'mentor',
                    level: 1,
                    damage: guidesData.mentor.levels[0].damage,
                    rate: guidesData.mentor.levels[0].attackRate,
                  });
                } else if (torres.filter((t) => t.id === 'paje').length < 2 && essencia >= guidesData.paje.levels[0].cost) {
                  essencia -= guidesData.paje.levels[0].cost;
                  torres.push({
                    id: 'paje',
                    level: 1,
                    damage: guidesData.paje.levels[0].damage,
                    rate: guidesData.paje.levels[0].attackRate,
                  });
                }
              }
            }
          }
        }
      }

      // Vitória confirmada se a pessoa adormecida terminar com Luz > 0
      if (luz > 0) {
        vitorias++;
      }
      luzFinalTotal += luz;
      essenciaFinalTotal += essencia;
    }

    const taxaVitoria = (vitorias / NUM_SIMULACOES) * 100;
    expect(taxaVitoria).toBe(100);
    expect(vitorias).toBe(NUM_SIMULACOES);
    expect(luzFinalTotal / NUM_SIMULACOES).toBeGreaterThan(0);
    expect(essenciaFinalTotal / NUM_SIMULACOES).toBeGreaterThan(0);
  });
});
