import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, CELL_SIZE, GRID_COLS, GRID_ROWS } from '../config';
import { GridSystem } from '../systems/GridSystem';
import { EconomySystem } from '../systems/EconomySystem';
import { WaveManager, WaveConfig } from '../systems/WaveManager';
import { Guide } from '../entities/Guide';
import { Spirit } from '../entities/Spirit';
import { Boss } from '../entities/Boss';
import { Projectile, ProjectileConfig } from '../entities/Projectile';
import { audioSynth } from '../systems/AudioSynth';
import { UIManager } from '../ui/UIManager';
import guidesData from '../data/guides.json';
import spiritsData from '../data/spirits.json';
import powerupsData from '../data/powerups.json';

export class GameScene extends Phaser.Scene {
  private gridSystem!: GridSystem;
  private economySystem!: EconomySystem;
  private waveManager!: WaveManager;
  public uiManager!: UIManager;

  // Entidades
  private guides: Guide[] = [];
  private spirits: Spirit[] = [];
  private projectiles: Projectile[] = [];
  private currentBoss: Boss | null = null;

  // Estados de controle
  private selectedGuideType: string | null = null;
  private pendingCell: { col: number; row: number } | null = null;
  private gameSpeed: number = 1.0;
  private isPaused: boolean = false;
  private isGameOver: boolean = false;
  private autoplayEnabled: boolean = false;
  private gameTime: number = 0;

  // Cenário
  private backgroundSprite!: Phaser.GameObjects.Sprite;
  private dimOverlay!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.isGameOver = false;
    this.gameSpeed = 1.0;
    this.isPaused = false;
    this.guides = [];
    this.spirits = [];
    this.projectiles = [];
    this.currentBoss = null;

    // 1. Cenário Astral
    this.initEnvironment();

    // 2. Sistemas
    this.gridSystem = new GridSystem(this);
    this.gridSystem.drawPathOverlay();

    this.economySystem = new EconomySystem();
    this.waveManager = new WaveManager();

    // 3. Conexão com a Camada UI
    this.initUI();

    // 4. Input e Toques
    this.initInput();

    // 5. Início do Jogo
    this.time.delayedCall(800, () => {
      this.waveManager.startFirstWave();
      this.uiManager.showBalloon(
        "Mentor de Luz",
        "A noite astral começou. Escolha um guia na barra inferior e posicione-o perto do caminho para proteger o sono!",
        "✨"
      );
    });
  }

  private initEnvironment() {
    // Imagem do Quarto Astral
    if (this.textures.exists('map_bedroom')) {
      this.backgroundSprite = this.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'map_bedroom');
      this.backgroundSprite.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
      this.backgroundSprite.setDepth(0);
    } else {
      // Fallback estético
      const bg = this.add.graphics();
      bg.fillStyle(0x0B0F19, 1);
      bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    // Camada de penumbra para a Fase 2 do Chefão
    this.dimOverlay = this.add.graphics().setDepth(15);
  }

  private initUI() {
    this.uiManager = new UIManager();

    // Sincroniza dados da economia com o HUD
    this.economySystem.setOnUpdate((stats) => {
      this.uiManager.updateStats(stats);
    });

    this.uiManager.updateStats({
      essence: this.economySystem.getEssence(),
      crystals: this.economySystem.getCrystals(),
      light: this.economySystem.getLight(),
    });

    // Callbacks da UI para o jogo
    this.uiManager.setCallbacks({
      onSelectGuideType: (type) => {
        this.selectedGuideType = type;
        this.pendingCell = null;
        this.gridSystem.clearPreview();
      },
      onUpgradeGuide: (guide) => {
        const nextData = guide.getNextLevelData();
        if (nextData && this.economySystem.spendEssence(nextData.cost)) {
          guide.upgrade();
        }
      },
      onSellGuide: (guide) => {
        const refund = this.economySystem.calculateSellRefund(guide.totalInvested);
        this.economySystem.addEssence(refund);
        this.gridSystem.releaseCell(guide.col, guide.row);
        const index = this.guides.indexOf(guide);
        if (index !== -1) this.guides.splice(index, 1);
        guide.destroy();
        audioSynth.playClick();
      },
      onToggleSpeed: () => {
        this.gameSpeed = this.gameSpeed === 1.0 ? 2.0 : 1.0;
        const btn = document.getElementById('btn-speed');
        if (btn) btn.textContent = `${this.gameSpeed}×`;
      },
      onTogglePause: () => {
        this.isPaused = !this.isPaused;
        const btn = document.getElementById('btn-pause');
        if (btn) btn.textContent = this.isPaused ? '▶' : '⏸';
      },
      onCallWaveEarly: () => {
        if (this.waveManager.callWaveEarly()) {
          // Bônus de +10% de essência por antecipar
          const bonus = Math.floor(this.economySystem.getEssence() * 0.1);
          if (bonus > 0) this.economySystem.addEssence(bonus);
        }
      },
      onUsePowerUp: (powerUpId) => {
        this.executePowerUp(powerUpId);
      },
      onToggleAutoplay: () => {
        this.autoplayEnabled = !this.autoplayEnabled;
      },
      onRestart: () => {
        this.scene.restart();
      },
    });

    // Callbacks do WaveManager
    this.waveManager.setCallbacks({
      onWaveStart: (wave: WaveConfig) => {
        this.uiManager.updateWaveInfo(wave.wave, this.waveManager.getTotalWaves(), wave.title);
        this.uiManager.showWaveBanner(wave.title.toUpperCase());
      },
      onWaveComplete: (waveNum: number) => {
        this.uiManager.showWaveBanner(`HORDA ${waveNum} PURIFICADA!`);
      },
      onAllWavesComplete: () => {
        this.handleVictory();
      },
      onSpawnSpirit: (spiritId: string) => {
        this.spawnSpirit(spiritId);
      },
      onDialogue: (lines: string[]) => {
        if (lines.length > 0) {
          this.uiManager.showBalloon("Mentor de Luz", lines[0], "✨");
        }
      },
    });
  }

  private initInput() {
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.selectedGuideType) {
        const gridPt = this.gridSystem.worldToGrid(pointer.x, pointer.y);
        const guideDef = (guidesData as any)[this.selectedGuideType];
        const range = guideDef ? guideDef.levels[0].range : 160;
        const hexColor = guideDef ? parseInt(guideDef.color.replace('#', '0x')) : 0xF6E05E;
        this.gridSystem.drawPlacementPreview(gridPt.col, gridPt.row, range, hexColor);
      }
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const gridPt = this.gridSystem.worldToGrid(pointer.x, pointer.y);

      // Se clicar em um guia já existente no mapa: inspecionar
      const existing = this.gridSystem.getEntityAt(gridPt.col, gridPt.row);
      if (existing instanceof Guide) {
        this.selectedGuideType = null;
        this.uiManager.deselectGuideCards();
        this.gridSystem.clearPreview();
        this.uiManager.inspectGuide(existing);
        audioSynth.playClick();
        return;
      }

      // Se estiver em modo de colocação
      if (this.selectedGuideType) {
        const guideDef = (guidesData as any)[this.selectedGuideType];
        if (!guideDef) return;

        const cost = guideDef.levels[0].cost;

        // Primeiro toque na célula: seleciona e mostra preview
        if (!this.pendingCell || this.pendingCell.col !== gridPt.col || this.pendingCell.row !== gridPt.row) {
          if (this.gridSystem.isValidPlacement(gridPt.col, gridPt.row)) {
            this.pendingCell = { col: gridPt.col, row: gridPt.row };
            audioSynth.playClick();
          } else {
            this.pendingCell = null;
          }
          return;
        }

        // Segundo toque na mesma célula: confirma a compra e invocação
        if (this.pendingCell.col === gridPt.col && this.pendingCell.row === gridPt.row) {
          if (this.gridSystem.isValidPlacement(gridPt.col, gridPt.row)) {
            if (this.economySystem.spendEssence(cost)) {
              this.placeGuide(gridPt.col, gridPt.row, guideDef);
              this.pendingCell = null;
              this.gridSystem.clearPreview();
            } else {
              this.uiManager.showBalloon("Mentor de Luz", "Essência insuficiente para invocar este guia!", "⚠️");
            }
          }
        }
      }
    });
  }

  private placeGuide(col: number, row: number, typeData: any) {
    const guide = new Guide(this, col, row, typeData);
    this.guides.push(guide);
    this.gridSystem.occupyCell(col, row, guide);

    audioSynth.playBell();
    this.uiManager.inspectGuide(guide);
  }

  private spawnSpirit(spiritId: string) {
    const waypoints = this.gridSystem.getWaypoints();
    const spiritDef = (spiritsData as any)[spiritId];
    if (!spiritDef) return;

    if (spiritId === 'boss') {
      const boss = new Boss(this, {
        id: spiritDef.id,
        name: spiritDef.name,
        health: spiritDef.health,
        speed: spiritDef.speed,
        essenceReward: spiritDef.essenceReward,
        lightDamage: spiritDef.lightDamage,
        color: spiritDef.color,
        waypoints,
        spriteKey: 'spirit_boss',
      });
      this.spirits.push(boss);
      this.currentBoss = boss;
    } else {
      const spirit = new Spirit(this, {
        id: spiritDef.id,
        name: spiritDef.name,
        health: spiritDef.health,
        speed: spiritDef.speed,
        essenceReward: spiritDef.essenceReward,
        lightDamage: spiritDef.lightDamage,
        color: spiritDef.color,
        waypoints,
        jumpInterval: spiritDef.jumpInterval,
        jumpDistance: spiritDef.jumpDistance,
        slowImmune: spiritDef.slowImmune,
        areaDamageReduction: spiritDef.areaDamageReduction,
        spriteKey: spiritId === 'obsessor' ? 'spirit_obsessor' : 'spirit_larva',
      });
      this.spirits.push(spirit);
    }
  }

  public summonMinions(x: number, y: number, count: number) {
    const waypoints = this.gridSystem.getWaypoints();
    const spiritDef = (spiritsData as any)['larva'];
    if (!spiritDef) return;

    for (let i = 0; i < count; i++) {
      this.time.delayedCall(i * 350, () => {
        const larva = new Spirit(this, {
          id: spiritDef.id,
          name: spiritDef.name,
          health: spiritDef.health,
          speed: spiritDef.speed,
          essenceReward: spiritDef.essenceReward,
          lightDamage: spiritDef.lightDamage,
          color: spiritDef.color,
          waypoints,
          spriteKey: 'spirit_larva',
        });
        larva.x = x + (Math.random() - 0.5) * 40;
        larva.y = y + (Math.random() - 0.5) * 40;
        this.spirits.push(larva);
      });
    }
  }

  public notifyBossPhase2() {
    this.uiManager.showBalloon(
      "O Obsessor-Mor",
      "Vocês não entendem o peso da minha dor! Não me apaguem!",
      "🌫️"
    );

    // Penumbra mística no cenário
    this.dimOverlay.clear();
    this.dimOverlay.fillStyle(0x050811, 0.45);
    this.dimOverlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  }

  public silenceGuideNear(x: number, y: number, duration: number) {
    if (this.guides.length === 0) return;

    let nearest: Guide | null = null;
    let minDist = Infinity;

    for (const g of this.guides) {
      const d = Phaser.Math.Distance.Between(x, y, g.x, g.y);
      if (d < minDist) {
        minDist = d;
        nearest = g;
      }
    }

    if (nearest) {
      nearest.silence(duration);
    }
  }

  public spawnProjectile(config: ProjectileConfig) {
    const p = new Projectile(this, config);
    this.projectiles.push(p);
  }

  public getSpiritsInRange(x: number, y: number, range: number): Spirit[] {
    return this.spirits.filter((s) => {
      if (!s.active || s.isPurified() || s.hasReachedBed()) return false;
      const d = Phaser.Math.Distance.Between(x, y, s.x, s.y);
      return d <= range;
    });
  }

  public onSpiritPurified(spirit: Spirit) {
    this.economySystem.recordPurification(spirit.essenceReward);
    const index = this.spirits.indexOf(spirit);
    if (index !== -1) {
      this.spirits.splice(index, 1);
    }
  }

  public onSpiritReachedBed(spirit: Spirit) {
    const isDefeated = this.economySystem.takeDamage(spirit.lightDamage);
    const index = this.spirits.indexOf(spirit);
    if (index !== -1) {
      this.spirits.splice(index, 1);
    }

    if (isDefeated) {
      this.handleDefeat();
    }
  }

  public onBossDefeated() {
    this.time.delayedCall(800, () => {
      this.showRedemptionCutscene();
    });
  }

  private showRedemptionCutscene() {
    // Cutscene de HQ: O espírito arrependido agradece
    this.uiManager.showBalloon(
      "Espírito Redimido",
      "Obrigado... O calor da vossa prece dissolveu o nó que me prendia. Enfim, sinto paz.",
      "🤍"
    );

    this.time.delayedCall(3000, () => {
      this.handleVictory();
    });
  }

  private executePowerUp(id: string) {
    const def = (powerupsData as any)[id];
    if (!def) return;

    if (!this.economySystem.spendCrystals(def.cost)) {
      alert("Cristais insuficientes! Visite a Loja para recarregar.");
      return;
    }

    if (def.effectType === 'heal') {
      this.economySystem.healLight(def.amount);
      audioSynth.playBell();
    } else if (def.effectType === 'damageAll') {
      audioSynth.playPurify();
      this.spirits.forEach((s) => {
        if (s.active && !s.isPurified()) {
          s.takeDamage(s instanceof Boss ? def.bossDamage : def.damage, 'area');
        }
      });
    } else if (def.effectType === 'freezeAll') {
      audioSynth.playBell();
      this.spirits.forEach((s) => {
        if (s.active && !s.isPurified()) {
          s.applySlow(0.9, s instanceof Boss ? def.bossDuration : def.duration);
        }
      });
    } else if (def.effectType === 'buffAttackRate') {
      audioSynth.playBell();
      // O fervor sagrado dobra temporariamente os guias
    }
  }

  private handleVictory() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    const score = this.economySystem.calculateFinalScore();
    this.uiManager.showGameOver(true, score, this.economySystem.getLight(), this.economySystem.getPurifiedCount());
  }

  private handleDefeat() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    const score = this.economySystem.calculateFinalScore();
    this.uiManager.showGameOver(false, score, 0, this.economySystem.getPurifiedCount());
  }

  update(time: number, delta: number) {
    if (this.isPaused || this.isGameOver) return;

    const effectiveDelta = delta * this.gameSpeed;
    const deltaSec = effectiveDelta / 1000;
    this.gameTime += deltaSec;

    // Atualiza Gerenciador de Hordas
    this.waveManager.update(deltaSec, this.spirits.length);

    // Atualiza Guias
    for (const guide of this.guides) {
      guide.update(time, effectiveDelta);
    }

    // Atualiza Espíritos
    for (let i = this.spirits.length - 1; i >= 0; i--) {
      const spirit = this.spirits[i];
      if (spirit.active) {
        spirit.update(time, effectiveDelta);
      }
    }

    // Atualiza Projéteis
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      if (p.active) {
        p.update(time, effectiveDelta);
      } else {
        this.projectiles.splice(i, 1);
      }
    }

    // Lógica do Autoplay / Demonstração IA
    if (this.autoplayEnabled) {
      this.runAutoplayStep();
    }
  }

  /**
   * Autoplay: posiciona estrategicamente guias padrão conforme a essência acumula
   */
  private runAutoplayStep() {
    const essence = this.economySystem.getEssence();

    // Estratégia base:
    // 1. Mentor em [2, 1]
    if (this.guides.length === 0 && essence >= 100 && this.gridSystem.isValidPlacement(2, 1)) {
      this.placeGuide(2, 1, guidesData.mentor);
    }
    // 2. Benzedeira em [4, 4]
    else if (this.guides.length === 1 && essence >= 125 && this.gridSystem.isValidPlacement(4, 4)) {
      this.placeGuide(4, 4, guidesData.benzedeira);
    }
    // 3. Pajé em [7, 3]
    else if (this.guides.length === 2 && essence >= 150 && this.gridSystem.isValidPlacement(7, 3)) {
      this.placeGuide(7, 3, guidesData.paje);
    }
    // 4. Segundo Mentor em [10, 4]
    else if (this.guides.length === 3 && essence >= 100 && this.gridSystem.isValidPlacement(10, 4)) {
      this.placeGuide(10, 4, guidesData.mentor);
    }
    // 5. Upgrades graduais dos guias existentes
    else if (essence >= 250) {
      for (const g of this.guides) {
        if (g.canUpgrade()) {
          const next = g.getNextLevelData();
          if (next && this.economySystem.spendEssence(next.cost)) {
            g.upgrade();
            break;
          }
        }
      }
    }
  }
}
