import wavesData from '../data/waves.json';
import { audioSynth } from './AudioSynth';

export interface WaveGroup {
  spiritId: string;
  count: number;
  interval: number;
  delay: number;
}

export interface WaveConfig {
  wave: number;
  title: string;
  description: string;
  dialogue: string[];
  groups: WaveGroup[];
}

export class WaveManager {
  private waves: WaveConfig[] = wavesData.waves;
  private currentWaveIndex: number = 0;
  private isWaveInProgress: boolean = false;
  private intermissionTimer: number = 0;
  private isIntermission: boolean = false;

  private onWaveStartCallback?: (wave: WaveConfig) => void;
  private onWaveCompleteCallback?: (waveNumber: number) => void;
  private onAllWavesCompleteCallback?: () => void;
  private onSpawnSpiritCallback?: (spiritId: string) => void;
  private onDialogueCallback?: (lines: string[]) => void;

  private activeSpawns: { spiritId: string; remaining: number; interval: number; timer: number; delay: number }[] = [];

  constructor() {}

  public setCallbacks(callbacks: {
    onWaveStart?: (wave: WaveConfig) => void;
    onWaveComplete?: (waveNumber: number) => void;
    onAllWavesComplete?: () => void;
    onSpawnSpirit?: (spiritId: string) => void;
    onDialogue?: (lines: string[]) => void;
  }) {
    this.onWaveStartCallback = callbacks.onWaveStart;
    this.onWaveCompleteCallback = callbacks.onWaveComplete;
    this.onAllWavesCompleteCallback = callbacks.onAllWavesComplete;
    this.onSpawnSpiritCallback = callbacks.onSpawnSpirit;
    this.onDialogueCallback = callbacks.onDialogue;
  }

  public getCurrentWaveNumber(): number {
    return this.currentWaveIndex + 1;
  }

  public getTotalWaves(): number {
    return this.waves.length;
  }

  public isRunning(): boolean {
    return this.isWaveInProgress;
  }

  public startFirstWave() {
    this.startWave(0);
  }

  /**
   * Antecipa a horda se estiver em intervalo (bônus de +10% essência)
   */
  public callWaveEarly(): boolean {
    if (this.isIntermission) {
      this.isIntermission = false;
      this.intermissionTimer = 0;
      this.startWave(this.currentWaveIndex + 1);
      return true;
    }
    return false;
  }

  private startWave(index: number) {
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

  public update(deltaSec: number, activeSpiritsCount: number) {
    if (this.isIntermission) {
      this.intermissionTimer -= deltaSec;
      if (this.intermissionTimer <= 0) {
        this.isIntermission = false;
        this.startWave(this.currentWaveIndex + 1);
      }
      return;
    }

    if (!this.isWaveInProgress) return;

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
      } else {
        // Ritmo híbrido: intervalo de 8s entre hordas nas hordas 1 a 4, e 15s da horda 5 em diante.
        const completedWave = this.currentWaveIndex + 1;
        this.isIntermission = true;
        this.intermissionTimer = completedWave < 5 ? 8.0 : 15.0;
      }
    }
  }

  public getIntermissionTimer(): number {
    return this.intermissionTimer;
  }

  public getIsIntermission(): boolean {
    return this.isIntermission;
  }
}
