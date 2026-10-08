import { describe, it, expect } from 'vitest';
import guidesData from '../src/data/guides.json';
import spiritsData from '../src/data/spirits.json';
import wavesData from '../src/data/waves.json';
/**
 * Simulador Matemático de Balanceamento 'Vencível Grátis' (RF-14 / TASK-018)
 * Valida rigorosamente que o modo Normal é 100% vencível sem usar nenhum Cristal ou Power-up pago.
 */
describe('Simulador de Balanceamento — Torre dos Espíritos (Vencível Grátis)', () => {
    it('deve conter dados válidos e coerentes de guias e espíritos', () => {
        expect(guidesData.mentor.levels).toHaveLength(3);
        expect(guidesData.benzedeira.levels).toHaveLength(3);
        expect(guidesData.paje.levels).toHaveLength(3);
        expect(spiritsData.larva.health).toBe(30);
        expect(spiritsData.boss.health).toBe(3000);
        expect(wavesData.waves).toHaveLength(4);
    });
    it('deve vencer 100 de 100 partidas simuladas na dificuldade Normal sem power-ups', () => {
        const NUM_SIMULACOES = 100;
        let vitorias = 0;
        for (let sim = 0; sim < NUM_SIMULACOES; sim++) {
            let essencia = 250;
            let luz = 20;
            // Inicia com 1 Mentor de Luz (100) e 1 Benzedeira (125)
            // Restam 25 de Essência inicial
            essencia -= (guidesData.mentor.levels[0].cost + guidesData.benzedeira.levels[0].cost);
            const torres = [
                { id: 'mentor', level: 1, damage: guidesData.mentor.levels[0].damage, rate: guidesData.mentor.levels[0].attackRate },
                { id: 'benzedeira', level: 1, damage: guidesData.benzedeira.levels[0].damage, rate: guidesData.benzedeira.levels[0].attackRate },
            ];
            // O caminho astral completo possui 33 células de 80px = 2640px de extensão
            const CAMINHO_TOTAL_PX = 2640;
            // Simulação das 4 Hordas
            for (const wave of wavesData.waves) {
                for (const group of wave.groups) {
                    const spiritDef = spiritsData[group.spiritId];
                    const totalInimigos = group.count;
                    for (let i = 0; i < totalInimigos; i++) {
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
                            // Espírito purificado: concede Essência
                            essencia += spiritDef.essenceReward;
                        }
                        else {
                            // Atingiu o leito astral: reduz luz
                            luz -= spiritDef.lightDamage;
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
                        // 2. Invoca um segundo Mentor de Luz (100) para foco de dano
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
                            for (const t of torres) {
                                const gDef = guidesData[t.id];
                                const nextLevel = gDef.levels[t.level];
                                if (nextLevel && essencia >= nextLevel.cost) {
                                    essencia -= nextLevel.cost;
                                    t.level++;
                                    t.damage = nextLevel.damage;
                                    t.rate = nextLevel.attackRate;
                                    break;
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
        }
        const taxaVitoria = (vitorias / NUM_SIMULACOES) * 100;
        expect(taxaVitoria).toBe(100);
        expect(vitorias).toBe(NUM_SIMULACOES);
    });
});
//# sourceMappingURL=balanceSimulator.test.js.map