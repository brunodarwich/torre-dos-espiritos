import wavesData from '../data/waves.json';
import { audioSynth } from './AudioSynth';
export class WaveManager {
    waves = wavesData.waves;
    currentWaveIndex = 0;
    isWaveInProgress = false;
    intermissionTimer = 0;
    isIntermission = false;
    onWaveStartCallback;
    onWaveCompleteCallback;
    onAllWavesCompleteCallback;
    onSpawnSpiritCallback;
    onDialogueCallback;
    activeSpawns = [];
    constructor() { }
    setCallbacks(callbacks) {
        this.onWaveStartCallback = callbacks.onWaveStart;
        this.onWaveCompleteCallback = callbacks.onWaveComplete;
        this.onAllWavesCompleteCallback = callbacks.onAllWavesComplete;
        this.onSpawnSpiritCallback = callbacks.onSpawnSpirit;
        this.onDialogueCallback = callbacks.onDialogue;
    }
    getCurrentWaveNumber() {
        return this.currentWaveIndex + 1;
    }
    getTotalWaves() {
        return this.waves.length;
    }
    isRunning() {
        return this.isWaveInProgress;
    }
    startFirstWave() {
        this.startWave(0);
    }
    /**
     * Antecipa a horda se estiver em intervalo (bônus de +10% essência)
     */
    callWaveEarly() {
        if (this.isIntermission) {
            this.isIntermission = false;
            this.intermissionTimer = 0;
            this.startWave(this.currentWaveIndex + 1);
            return true;
        }
        return false;
    }
    startWave(index) {
        if (index >= this.waves.length) {
            if (this.onAllWavesCompleteCallback) {
                this.onAllWavesCompleteCallback();
            }
            return;
        }
        this.currentWaveIndex = index;
        const wave = this.waves[index];
        this.isWaveInProgress = true;
        this.isIntermission = false;
        audioSynth.playBell();
        if (this.onWaveStartCallback) {
            this.onWaveStartCallback(wave);
        }
        if (this.onDialogueCallback && wave.dialogue.length > 0) {
            this.onDialogueCallback(wave.dialogue);
        }
        // Prepara fila de spawns da horda
        this.activeSpawns = wave.groups.map((g) => ({
            spiritId: g.spiritId,
            remaining: g.count,
            interval: g.interval / 1000,
            timer: 0,
            delay: g.delay / 1000,
        }));
    }
    update(deltaSec, activeSpiritsCount) {
        if (this.isIntermission) {
            this.intermissionTimer -= deltaSec;
            if (this.intermissionTimer <= 0) {
                this.isIntermission = false;
                this.startWave(this.currentWaveIndex + 1);
            }
            return;
        }
        if (!this.isWaveInProgress)
            return;
        let hasRemainingSpawns = false;
        // Processa spawns programados
        for (const group of this.activeSpawns) {
            if (group.remaining > 0) {
                hasRemainingSpawns = true;
                if (group.delay > 0) {
                    group.delay -= deltaSec;
                    continue;
                }
                group.timer -= deltaSec;
                if (group.timer <= 0) {
                    group.remaining--;
                    group.timer = group.interval;
                    if (this.onSpawnSpiritCallback) {
                        this.onSpawnSpiritCallback(group.spiritId);
                    }
                }
            }
        }
        // Se todos foram spawnados e não há espíritos vivos na tela
        if (!hasRemainingSpawns && activeSpiritsCount === 0) {
            this.isWaveInProgress = false;
            if (this.onWaveCompleteCallback) {
                this.onWaveCompleteCallback(this.currentWaveIndex + 1);
            }
            if (this.currentWaveIndex + 1 >= this.waves.length) {
                if (this.onAllWavesCompleteCallback) {
                    this.onAllWavesCompleteCallback();
                }
            }
            else {
                // Inicia contagem regressiva de 15s para a próxima horda
                this.isIntermission = true;
                this.intermissionTimer = 15.0;
            }
        }
    }
}
//# sourceMappingURL=WaveManager.js.map