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
import { screenFlow } from '../ui/ScreenFlow';
import { CombatFXSystem } from '../systems/CombatFXSystem';
import guidesData from '../data/guides.json';
import spiritsData from '../data/spirits.json';
import powerupsData from '../data/powerups.json';
import { transformClientToWorld } from '../utils/coordinates';

interface WaveTheme {
  name: string;
  bgColor: number;
  ambientColor: number;
  ambientAlpha: number;
  gradientCss: string;
  flashColor: number;
}

const WAVE_THEMES: Record<number, WaveTheme> = {
  1: {
    name: 'Crepúsculo Astral',
    bgColor: 0x0B0F19,
    ambientColor: 0x141B2D,
    ambientAlpha: 0.15,
    gradientCss: 'radial-gradient(circle at center, #141B2D 0%, #070A12 100%)',
    flashColor: 0x4FD1C5,
  },
  2: {
    name: 'Tempestade do Véu',
    bgColor: 0x160826,
    ambientColor: 0x2A0845,
    ambientAlpha: 0.32,
    gradientCss: 'radial-gradient(circle at center, #2A0845 0%, #0C0414 100%)',
    flashColor: 0xB794F4,
  },
  3: {
    name: 'Eclipse do Colosso',
    bgColor: 0x220A10,
    ambientColor: 0x3B0D18,
    ambientAlpha: 0.40,
    gradientCss: 'radial-gradient(circle at center, #3B0D18 0%, #120207 100%)',
    flashColor: 0xED8936,
  },
};

export class GameScene extends Phaser.Scene {
  private gridSystem!: GridSystem;
  private economySystem!: EconomySystem;
  private waveManager!: WaveManager;
  public uiManager!: UIManager;
  public combatFX!: CombatFXSystem;

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
  private devController?: AbortController;
  private get artPreviewMode() { return import.meta.env.DEV && new URLSearchParams(location.search).get('artPreview') === '1'; }
  private get qaMode() { return import.meta.env.DEV && new URLSearchParams(location.search).get('qa') === '1'; }

  // Cenário e Ambiência de Hordas
  private bgGraphics!: Phaser.GameObjects.Graphics;
  private waveAmbientOverlay!: Phaser.GameObjects.Graphics;
  private waveFlashOverlay!: Phaser.GameObjects.Graphics;
  private dimOverlay!: Phaser.GameObjects.Graphics;
  private currentWaveNumber: number = 1;

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
    this.gameTime = 0;
    this.autoplayEnabled = false;
    this.selectedGuideType = null;
    this.pendingCell = null;

    // 1. Cenário Astral
    this.initEnvironment();

    // 2. Sistemas
    this.gridSystem = new GridSystem(this);
    this.gridSystem.drawPathOverlay();
    for (const [key, point] of [['portal', this.gridSystem.getSpawnPoint()], ['dream_core', this.gridSystem.getBedPoint()]] as const) {
      if (!this.textures.exists(key)) continue;
      this.add.ellipse(point.x, point.y + 24, 48, 14, 0x050811, 0.4).setDepth(3);
      const marker = this.add.image(point.x, point.y, key).setDepth(3);
      marker.setScale(Math.min(72 / marker.width, 96 / marker.height));
    }

    this.economySystem = new EconomySystem();
    this.waveManager = new WaveManager();
    this.combatFX = new CombatFXSystem(this);

    // 3. Conexão com a Camada UI
    this.initUI();
    this.uiManager.updateWaveInfo(0, this.waveManager.getTotalWaves(), 'Prepare sua defesa');
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.uiManager.dispose();
      this.devController?.abort();
      document.getElementById('astral-dev-panel')?.remove();
      if (this.qaMode) delete (window as any).__ASTRAL_QA__;
    });
    if (this.artPreviewMode) {
      this.createArtPreview();
      this.isPaused = true;
      return;
    }
    if (this.qaMode) this.createQaPanel();

    // 4. Input e Toques
    this.initInput();

    // 5. Início do Jogo
    this.time.delayedCall(800, () => {
      this.waveManager.startFirstWave();
      this.uiManager.showBalloon(
        "Prisma Solar",
        "A noite astral começou. Escolha um protetor na barra inferior e posicione-o perto do caminho para proteger o núcleo do sonho!",
        "✨"
      );
    });
  }

  private createArtPreview() {
    const cols = [1, 4, 7];
    const rows = [3, 4, 7];
    const ids = ['mentor', 'benzedeira', 'paje'] as const;
    ids.forEach((id, rowIndex) => {
      for (const level of [1, 2, 3]) {
        const point = this.gridSystem.gridToWorld(cols[level - 1], rows[rowIndex]);
        this.previewImage(`${id}_lvl${level}`, point.x, point.y, 80,
          `${guidesData[id].name} · N${level}`);
      }
    });
    ['larva', 'zombeteiro', 'obsessor', 'sombra'].forEach((id, i) => {
      this.previewImage(`spirit_${id}`, 840 + (i % 2) * 160, 280 + Math.floor(i / 2) * 160,
        64, (spiritsData as any)[id].name);
    });
    this.previewImage('spirit_boss', 880, 120, 128, 'Colosso · Fase 1');
    this.previewImage('spirit_boss_phase2', 1120, 600, 128, 'Colosso · Fase 2');
    this.previewImage('spirit_redeemed', 200, 560, 64, 'Espírito purificado');
    const panel = document.createElement('div');
    panel.id = 'astral-dev-panel'; panel.className = 'astral-dev-panel';
    panel.textContent = 'PROVA DE ARTE · estática · N1 / N2 / N3 nas colunas · partida normal sem alterações';
    document.body.append(panel);
  }

  private previewImage(key: string, x: number, y: number, size: number, label: string) {
    if (!this.textures.exists(key)) return;
    this.add.ellipse(x, y + size * 0.3, size * 0.55, size * 0.16, 0x050811, 0.4).setDepth(4);
    const image = this.add.image(x, y, key).setDepth(6);
    image.setScale(size / Math.max(image.width, image.height));
    this.add.text(x, y + size * 0.42, label, {
      fontFamily: 'Outfit, sans-serif', fontSize: '12px', color: '#F0F5FF',
      backgroundColor: '#101728', padding: { x: 4, y: 2 },
    }).setOrigin(0.5, 0).setDepth(10);
  }

  private createQaPanel() {
    this.devController = new AbortController();
    const panel = document.createElement('div');
    panel.id = 'astral-dev-panel'; panel.className = 'astral-dev-panel';
    panel.classList.add('qa-panel');
    const heading = document.createElement('strong'); heading.textContent = 'QA LOCAL · recursos de teste isolados'; panel.append(heading);
    const actions: [string, string, () => void][] = [
      ['resources', '+10.000 essência', () => this.economySystem.addEssence(10000)],
      ['pause', 'Pausar / retomar', () => { this.isPaused = !this.isPaused; }],
      ['boss', 'Invocar chefe', () => this.spawnSpirit('boss')],
      ['phase2', 'Chefe: fase 2', () => {
        if (!this.currentBoss?.active) this.spawnSpirit('boss');
        const boss = this.currentBoss;
        if (boss && !boss.isPurified()) boss.takeDamage(boss.maxHealth * 0.40, 'dot');
      }],
      ['phase3', 'Chefe: fase 3', () => {
        if (!this.currentBoss?.active) this.spawnSpirit('boss');
        const boss = this.currentBoss;
        if (boss && !boss.isPurified()) boss.takeDamage(boss.maxHealth * 0.70, 'dot');
      }],
      ['purify', 'Purificar criaturas', () => [...this.spirits].forEach(spirit => spirit.purify())],
      ['victory', 'Vitória', () => this.handleVictory()],
      ['defeat', 'Derrota', () => this.handleDefeat()],
      ['restart', 'Reiniciar', () => this.scene.restart()],
    ];
    for (const [id, label, action] of actions) {
      const button = document.createElement('button'); button.id = `qa-${id}`;
      button.textContent = label;
      button.addEventListener('click', action, { signal: this.devController.signal }); panel.append(button);
    }
    const state = document.createElement('output'); state.id = 'qa-state';
    state.setAttribute('aria-label', 'Estado de teste local'); panel.append(state);
    document.body.append(panel);
    Object.defineProperty(window, '__ASTRAL_QA__', {
      configurable: true, get: () => ({
        mode: 'qa', essence: this.economySystem.getEssence(), crystals: this.economySystem.getCrystals(),
        light: this.economySystem.getLight(), gameSpeed: this.gameSpeed, paused: this.isPaused, gameOver: this.isGameOver,
        guides: this.guides.map(g => ({ id: g.guideId, level: g.getLevel(), col: g.col, row: g.row, texture: g.getTextureKey() })),
        spirits: this.spirits.map(spirit => ({ id: spirit.spiritId, health: spirit.currentHealth,
          maxHealth: spirit.maxHealth, x: spirit.x, y: spirit.y, texture: spirit.getTextureKey(),
          phase: spirit instanceof Boss ? spirit.getPhase() : undefined })),
      }),
    });
  }

  private initEnvironment() {
    this.bgGraphics = this.add.graphics().setDepth(0);
    this.bgGraphics.fillStyle(0x0B0F19, 1);
    this.bgGraphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    for (const [key, depth] of [['cosmos', 0], ['floor', 1]] as const) {
      if (!this.textures.exists(key)) continue;
      const image = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, key).setDepth(depth);
      // Uniform scale preserves the native aspect ratio of both environment layers.
      image.setScale(Math.max(GAME_WIDTH / image.width, GAME_HEIGHT / image.height));
    }

    // Camada ambiente para transição cromática de hordas
    this.waveAmbientOverlay = this.add.graphics().setDepth(2);
    this.waveFlashOverlay = this.add.graphics().setDepth(22);

    // Camada de penumbra para a Fase 2 do Chefão
    this.dimOverlay = this.add.graphics().setDepth(15);
  }

  private applyWaveAtmosphere(waveNum: number) {
    this.currentWaveNumber = waveNum;
    // Ato I: Hordas 1-4 | Ato II: Hordas 5-7 | Ato III: Hordas 8-10
    const actKey = waveNum <= 4 ? 1 : (waveNum <= 7 ? 2 : 3);
    const theme = WAVE_THEMES[waveNum] || WAVE_THEMES[actKey] || WAVE_THEMES[1];

    // 1. Atualização suave do gradiente CSS no DOM (#app)
    const appEl = document.getElementById('app');
    if (appEl) {
      appEl.style.transition = 'background 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
      appEl.style.background = theme.gradientCss;
    }

    // 2. Flash estelar cósmico de transição de horda
    this.waveFlashOverlay.clear();
    this.waveFlashOverlay.fillStyle(theme.flashColor, 0.38);
    this.waveFlashOverlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.waveFlashOverlay.setAlpha(1);

    this.tweens.add({
      targets: this.waveFlashOverlay,
      alpha: 0,
      duration: 850,
      ease: 'Cubic.easeOut',
    });

    // 3. Atualização da camada ambiente / ambient tint
    this.waveAmbientOverlay.clear();
    this.waveAmbientOverlay.fillStyle(theme.ambientColor, theme.ambientAlpha);
    this.waveAmbientOverlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.waveAmbientOverlay.setAlpha(0);

    this.tweens.add({
      targets: this.waveAmbientOverlay,
      alpha: 1,
      duration: 1200,
      ease: 'Sine.easeInOut',
    });
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
      onStartGuideDrag: (_type) => {
        this.pendingCell = null;
        this.gridSystem.clearPreview();
      },
      onMoveGuideDrag: (type, clientX, clientY) => {
        const worldPt = this.clientToWorld(clientX, clientY);
        if (!worldPt) {
          this.gridSystem.clearPreview();
          return;
        }
        const gridPt = this.gridSystem.worldToGrid(worldPt.x, worldPt.y);
        const guideDef = (guidesData as any)[type];
        if (!guideDef) return;
        const range = guideDef.levels[0].range;
        const hexColor = parseInt(guideDef.color.replace('#', '0x')) || 0xF6E05E;
        this.gridSystem.drawPlacementPreview(gridPt.col, gridPt.row, range, hexColor);
      },
      onDropGuideDrag: (type, clientX, clientY) => {
        this.gridSystem.clearPreview();
        const worldPt = this.clientToWorld(clientX, clientY);
        if (!worldPt) return false;

        const gridPt = this.gridSystem.worldToGrid(worldPt.x, worldPt.y);
        const guideDef = (guidesData as any)[type];
        if (!guideDef) return false;

        if (!this.gridSystem.isValidPlacement(gridPt.col, gridPt.row)) {
          audioSynth.playWhoosh();
          return false;
        }

        const cost = guideDef.levels[0].cost;
        if (this.economySystem.spendEssence(cost)) {
          this.placeGuide(gridPt.col, gridPt.row, guideDef);
          this.selectedGuideType = null;
          this.pendingCell = null;
          return true;
        } else {
          audioSynth.playWhoosh();
          this.uiManager.showBalloon("Prisma Solar", "Essência insuficiente para invocar este protetor!", "⚠️");
          return false;
        }
      },
      onCancelGuideDrag: () => {
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
        screenFlow.beginLoading();
        this.scene.start('BootScene');
      },
      onReturnHome: () => this.scene.start('MenuScene'),
    });

    // Callbacks do WaveManager
    this.waveManager.setCallbacks({
      onWaveStart: (wave: WaveConfig) => {
        this.applyWaveAtmosphere(wave.wave);
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
        lines.forEach((line, index) => {
          this.time.delayedCall(index * 4200, () => {
            this.uiManager.showBalloon("Prisma Solar", line, "✨");
          });
        });
      },
    });
  }

  public clientToWorld(clientX: number, clientY: number): { x: number; y: number } | null {
    const canvas = this.game.canvas;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return transformClientToWorld(clientX, clientY, rect, GAME_WIDTH, GAME_HEIGHT);
  }

  private initInput() {
    let pointerDownPos: { x: number; y: number } | null = null;
    let isCanvasDragging = false;

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      pointerDownPos = { x: pointer.x, y: pointer.y };
      isCanvasDragging = false;

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
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.selectedGuideType) {
        if (pointerDownPos) {
          const dist = Phaser.Math.Distance.Between(pointerDownPos.x, pointerDownPos.y, pointer.x, pointer.y);
          if (dist > 12) {
            isCanvasDragging = true;
          }
        }
        const gridPt = this.gridSystem.worldToGrid(pointer.x, pointer.y);
        const guideDef = (guidesData as any)[this.selectedGuideType];
        const range = guideDef ? guideDef.levels[0].range : 160;
        const hexColor = guideDef ? parseInt(guideDef.color.replace('#', '0x')) : 0xF6E05E;
        this.gridSystem.drawPlacementPreview(gridPt.col, gridPt.row, range, hexColor);
      }
    });

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const gridPt = this.gridSystem.worldToGrid(pointer.x, pointer.y);
      const wasDragging = isCanvasDragging;
      pointerDownPos = null;
      isCanvasDragging = false;

      // Se estiver em modo de colocação
      if (this.selectedGuideType) {
        const guideDef = (guidesData as any)[this.selectedGuideType];
        if (!guideDef) return;

        const cost = guideDef.levels[0].cost;

        // Se o usuário arrastou pelo tabuleiro e soltou na célula: posiciona imediatamente
        if (wasDragging) {
          if (this.gridSystem.isValidPlacement(gridPt.col, gridPt.row)) {
            if (this.economySystem.spendEssence(cost)) {
              this.placeGuide(gridPt.col, gridPt.row, guideDef);
              this.pendingCell = null;
              this.selectedGuideType = null;
              this.uiManager.deselectGuideCards();
              this.gridSystem.clearPreview();
            } else {
              this.uiManager.showBalloon("Prisma Solar", "Essência insuficiente para invocar este protetor!", "⚠️");
            }
          }
          return;
        }

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
              this.uiManager.showBalloon("Prisma Solar", "Essência insuficiente para invocar este protetor!", "⚠️");
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
        maxSlow: spiritDef.maxSlow,
        spriteKey: 'spirit_boss',
      });
      this.spirits.push(boss);
      this.currentBoss = boss;
    } else {
      const spriteKey = this.textures.exists(`spirit_${spiritId}`)
        ? `spirit_${spiritId}`
        : (spiritId === 'arauto' && this.textures.exists('spirit_obsessor') ? 'spirit_obsessor' : undefined);
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
        maxSlow: spiritDef.maxSlow,
        areaDamageReduction: spiritDef.areaDamageReduction,
        spriteKey,
      });
      this.spirits.push(spirit);

      if (spiritId === 'arauto') {
        this.uiManager.showBalloon(
          "Arauto do Eclipse",
          "Passos pesados ecoam... O Arauto do Eclipse lidera a marcha!",
          "⚠️"
        );
      }
    }
  }

  public summonMinions(x: number, y: number, count: number, spiritType: string = 'larva', fromWaypointIndex?: number) {
    const allWaypoints = this.gridSystem.getWaypoints();
    const spiritDef = (spiritsData as any)[spiritType] || (spiritsData as any)['larva'];
    if (!spiritDef) return;

    // Se fornecido índice de waypoint à frente, os lacaios seguem os waypoints restantes
    const forwardWaypoints = fromWaypointIndex !== undefined && fromWaypointIndex < allWaypoints.length
      ? allWaypoints.slice(fromWaypointIndex)
      : allWaypoints;

    for (let i = 0; i < count; i++) {
      this.time.delayedCall(i * 350, () => {
        const spriteKey = this.textures.exists(`spirit_${spiritDef.id}`) ? `spirit_${spiritDef.id}` : undefined;
        const startX = x + (Math.random() - 0.5) * 36;
        const startY = y + (Math.random() - 0.5) * 36;
        const minionWaypoints = [{ x: startX, y: startY }, ...forwardWaypoints];

        const minion = new Spirit(this, {
          id: spiritDef.id,
          name: spiritDef.name,
          health: spiritDef.health,
          speed: spiritDef.speed,
          essenceReward: spiritDef.essenceReward,
          lightDamage: spiritDef.lightDamage,
          color: spiritDef.color,
          waypoints: minionWaypoints,
          jumpInterval: spiritDef.jumpInterval,
          jumpDistance: spiritDef.jumpDistance,
          slowImmune: spiritDef.slowImmune,
          maxSlow: spiritDef.maxSlow,
          areaDamageReduction: spiritDef.areaDamageReduction,
          spriteKey,
        });
        this.spirits.push(minion);
      });
    }
  }

  public notifyBossPhase2() {
    this.uiManager.showBalloon(
      "Colosso do Eclipse",
      "O eclipse desperta! Meu núcleo romperá este santuário!",
      "🌫️"
    );

    // Penumbra mística no cenário
    this.dimOverlay.clear();
    this.dimOverlay.fillStyle(0x050811, 0.45);
    this.dimOverlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  }

  public notifyBossPhase3() {
    this.uiManager.showBalloon(
      "Colosso do Eclipse",
      "CARAPAÇA DESTRUÍDA! O Colosso entra em fúria desesperada rumo ao leito!",
      "⚡"
    );

    this.combatFX.triggerScreenShake(0.005, 300);
    audioSynth.playPurify();
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
      if (this.combatFX) {
        this.combatFX.createStatusText(nearest.x, nearest.y, 'SILENCIADO', '#CBD5E0');
      }
      audioSynth.playWhoosh();
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
    if (this.textures.exists('spirit_redeemed')) {
      const point = this.gridSystem.getBedPoint();
      const spirit = this.add.image(Math.min(GAME_WIDTH - 50, point.x), point.y - 85, 'spirit_redeemed').setDepth(16);
      spirit.setScale(90 / Math.max(spirit.width, spirit.height));
      this.tweens.add({ targets: spirit, y: spirit.y - 10, yoyo: true, repeat: -1, duration: 1000 });
    }
    // Cutscene de HQ: O espírito arrependido agradece
    this.uiManager.showBalloon(
      "Espírito Purificado",
      "A luz do núcleo restaurou minha forma. O sonho está em equilíbrio.",
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
      // O pulso astral dobra temporariamente os guias
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
    if (this.qaMode) {
      const state = document.getElementById('qa-state');
      if (state) state.textContent = JSON.stringify((window as any).__ASTRAL_QA__);
    }
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
    // 2. Véu de Aurora em [4, 4]
    else if (this.guides.length === 1 && essence >= 125 && this.gridSystem.isValidPlacement(4, 4)) {
      this.placeGuide(4, 4, guidesData.benzedeira);
    }
    // 3. Núcleo de Brasa em [7, 3]
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
