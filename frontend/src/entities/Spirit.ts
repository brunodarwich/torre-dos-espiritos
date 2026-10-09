import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { PixelPoint } from '../systems/GridSystem';
import { audioSynth } from '../systems/AudioSynth';

export interface SpiritConfig {
  id: string;
  name: string;
  health: number;
  speed: number;
  essenceReward: number;
  lightDamage: number;
  spriteKey?: string;
  color: string;
  waypoints: PixelPoint[];
  jumpInterval?: number;
  jumpDistance?: number;
  slowImmune?: boolean;
  maxSlow?: number;
  areaDamageReduction?: number;
  /** Tamanho visual em px (maior HP = maior criatura). Definido em spirits.json. */
  size?: number;
}

export class Spirit extends Phaser.GameObjects.Container {
  public spiritId: string;
  public spiritName: string;
  public maxHealth: number;
  public currentHealth: number;
  public baseSpeed: number;
  public currentSpeed: number;
  public essenceReward: number;
  public lightDamage: number;
  public slowImmune: boolean;
  public maxSlow?: number;
  public areaDamageReduction: number;

  private waypoints: PixelPoint[];
  private currentWaypointIndex: number = 0;
  private purified: boolean = false;
  private reachedBed: boolean = false;

  // Debuffs
  private slowTimer: number = 0;
  private slowMultiplier: number = 1;
  private dotTimer: number = 0;
  private dotDamagePerSec: number = 0;
  private dotAccumulator: number = 0;

  // Zombeteiro jump
  private jumpInterval?: number;
  private jumpDistance?: number;
  private jumpCooldown: number = 0;

  // Gráficos e elementos visuais
  protected gfx: Phaser.GameObjects.Graphics;
  protected sprite?: Phaser.GameObjects.Sprite;
  protected healthBar: Phaser.GameObjects.Graphics;
  protected visualSize = 64;
  protected visualOffsetX = 0;
  protected visualOffsetY = 0;
  protected shadow: Phaser.GameObjects.Ellipse;

  constructor(scene: Phaser.Scene, config: SpiritConfig) {
    const startPt = config.waypoints[0] || { x: 0, y: 0 };
    super(scene, startPt.x, startPt.y);

    this.spiritId = config.id;
    this.spiritName = config.name;
    this.maxHealth = config.health;
    this.currentHealth = config.health;
    this.baseSpeed = config.speed;
    this.currentSpeed = config.speed;
    this.essenceReward = config.essenceReward;
    this.lightDamage = config.lightDamage;
    this.slowImmune = !!config.slowImmune;
    this.maxSlow = config.maxSlow;
    this.areaDamageReduction = config.areaDamageReduction || 0;
    this.waypoints = config.waypoints;
    this.jumpInterval = config.jumpInterval;
    this.jumpDistance = config.jumpDistance;
    this.jumpCooldown = this.jumpInterval || 0;

    const size = config.size ?? (config.id === 'boss' ? 200 : (config.id === 'arauto' ? 104 : 64));
    this.visualSize = size;
    this.shadow = scene.add.ellipse(0, size * 0.3, size * 0.55, size * 0.16, 0x050811, 0.4);
    this.add(this.shadow);
    this.gfx = scene.add.graphics();
    this.healthBar = scene.add.graphics();
    this.add([this.gfx, this.healthBar]);

    this.initVisuals(config);
    this.bringToTop(this.healthBar);
    scene.add.existing(this);
    this.setDepth(6);
  }

  protected initVisuals(config: SpiritConfig) {
    const hexColor = parseInt(config.color.replace('#', '0x'));

    // Se houver sprite carregado no cache da cena
    if (config.spriteKey && this.scene.textures.exists(config.spriteKey)) {
      this.sprite = this.scene.add.sprite(0, 0, config.spriteKey);
      this.sprite.setScale(this.visualSize / Math.max(this.sprite.width, this.sprite.height));
      if (this.spiritId === 'arauto') {
        this.sprite.setTint(0xF6AD55);
      }
      this.add(this.sprite);
    } else {
      // Representação procedural etérea
      const k = this.visualSize / 64;
      this.gfx.fillStyle(hexColor, 0.85);
      this.gfx.fillCircle(0, 0, 22 * k);
      this.gfx.fillStyle(0xFFFFFF, 0.9);
      this.gfx.fillCircle(-4 * k, -4 * k, 5 * k);
      this.gfx.fillCircle(4 * k, -4 * k, 5 * k);
    }

    this.updateVisualPosition();
    this.updateHealthBar();
  }

  protected updateVisualPosition() {
    const half = this.visualSize / 2 + 2;
    this.visualOffsetX = Phaser.Math.Clamp(this.x, half, GAME_WIDTH - half) - this.x;
    this.visualOffsetY = Phaser.Math.Clamp(this.y, half + 8, GAME_HEIGHT - half) - this.y;
    this.sprite?.setPosition(this.visualOffsetX, this.visualOffsetY - 2 + Math.sin(this.scene.time.now / 600) * 2);
    this.healthBar.setPosition(this.visualOffsetX, this.visualOffsetY);
    this.gfx.setPosition(this.visualOffsetX, this.visualOffsetY);
    this.shadow.setPosition(this.visualOffsetX, this.visualOffsetY + this.visualSize * 0.3);
  }

  public getTextureKey(): string | undefined { return this.sprite?.texture.key; }

  public getCurrentWaypointIndex(): number {
    return this.currentWaypointIndex;
  }

  public getSlowMultiplier(): number {
    return this.slowMultiplier;
  }

  public isPurified(): boolean {
    return this.purified;
  }

  public hasReachedBed(): boolean {
    return this.reachedBed;
  }

  public takeDamage(amount: number, type: 'direct' | 'area' | 'dot' = 'direct') {
    if (this.purified || this.reachedBed) return;

    let finalDamage = amount;
    if (type === 'area' && this.areaDamageReduction > 0) {
      finalDamage = amount * (1 - this.areaDamageReduction);
    }

    this.currentHealth = Math.max(0, this.currentHealth - finalDamage);
    this.updateHealthBar();

    // Floating Combat Text e faíscas via CombatFXSystem
    const scene = this.scene as any;
    if (scene && scene.combatFX) {
      scene.combatFX.createDamageNumber(this.x, this.y, finalDamage, type);
      scene.combatFX.createImpactSparks(
        this.x,
        this.y,
        type === 'area' ? 0xED8936 : (type === 'dot' ? 0xFC8181 : 0xF6E05E),
        type === 'area' ? 7 : 5
      );
    }

    // Flash sutil de impacto
    this.scene.tweens.add({
      targets: this.sprite ?? this.gfx,
      alpha: 0.6,
      duration: 60,
      yoyo: true,
      ease: 'Quad.easeInOut',
    });

    if (this.currentHealth <= 0) {
      this.purify();
    }
  }

  public applySlow(percent: number, duration: number) {
    if (this.slowImmune || this.purified) return;
    const effectiveSlow = this.maxSlow !== undefined ? Math.min(percent, this.maxSlow) : percent;
    this.slowMultiplier = Math.max(0.2, 1 - effectiveSlow);
    this.slowTimer = Math.max(this.slowTimer, duration);
    this.currentSpeed = this.baseSpeed * this.slowMultiplier;

    const scene = this.scene as any;
    if (scene && scene.combatFX) {
      scene.combatFX.createStatusText(this.x, this.y, 'LENTIDÃO', '#4FD1C5');
    }
  }

  public applyDot(damagePerSec: number, duration: number) {
    if (this.purified) return;
    this.dotDamagePerSec = damagePerSec;
    this.dotTimer = Math.max(this.dotTimer, duration);
  }

  public update(time: number, delta: number) {
    if (this.purified || this.reachedBed) return;

    const deltaSec = delta / 1000;

    // Processa Slow
    if (this.slowTimer > 0) {
      this.slowTimer -= deltaSec;
      if (this.slowTimer <= 0) {
        this.slowMultiplier = 1;
        this.currentSpeed = this.baseSpeed;
      }
    }

    // Processa DoT (dano contínuo de fogo)
    if (this.dotTimer > 0) {
      this.dotTimer -= deltaSec;
      this.dotAccumulator += deltaSec;
      if (this.dotAccumulator >= 0.5) {
        this.takeDamage(this.dotDamagePerSec * 0.5, 'dot');
        this.dotAccumulator = 0;
      }
    }

    // Habilidade especial do Zombeteiro (Pulo)
    if (this.jumpInterval && this.jumpDistance) {
      this.jumpCooldown -= deltaSec;
      if (this.jumpCooldown <= 0) {
        this.jumpForward(this.jumpDistance);
        this.jumpCooldown = this.jumpInterval;
      }
    }

    this.currentSpeed = this.baseSpeed * this.slowMultiplier;

    // Movimentação pelos waypoints
    this.moveAlongPath(deltaSec);
    if (this.active) this.updateVisualPosition();
  }

  private jumpForward(distance: number) {
    const targetPt = this.waypoints[this.currentWaypointIndex];
    if (!targetPt) return;

    const angle = Phaser.Math.Angle.Between(this.x, this.y, targetPt.x, targetPt.y);
    const targetX = this.x + Math.cos(angle) * distance;
    const targetY = this.y + Math.sin(angle) * distance;

    this.scene.tweens.add({
      targets: this,
      x: targetX,
      y: targetY,
      duration: 180,
      ease: 'Back.easeOut',
    });
  }

  private moveAlongPath(deltaSec: number) {
    if (this.currentWaypointIndex >= this.waypoints.length) {
      this.reachBed();
      return;
    }

    const targetPt = this.waypoints[this.currentWaypointIndex];
    const angle = Phaser.Math.Angle.Between(this.x, this.y, targetPt.x, targetPt.y);
    const distance = Phaser.Math.Distance.Between(this.x, this.y, targetPt.x, targetPt.y);
    const step = this.currentSpeed * deltaSec;

    if (distance <= step) {
      this.x = targetPt.x;
      this.y = targetPt.y;
      this.currentWaypointIndex++;
      if (this.currentWaypointIndex >= this.waypoints.length) {
        this.reachBed();
      }
    } else {
      this.x += Math.cos(angle) * step;
      this.y += Math.sin(angle) * step;
    }
  }

  private reachBed() {
    this.reachedBed = true;
    const scene = this.scene as any;
    if (scene && scene.onSpiritReachedBed) {
      scene.onSpiritReachedBed(this);
    }
    this.destroy();
  }

  /**
   * Purificação: Transforma a perturbação em luz celestial sem qualquer violência
   */
  public purify() {
    if (this.purified) return;
    this.purified = true;

    audioSynth.playPurify();

    // FX celestial de purificação
    const scene = this.scene as any;
    if (scene && scene.combatFX) {
      scene.combatFX.createPurifyBurst(this.x, this.y);
      scene.combatFX.triggerScreenShake(0.002, 100);
    }

    // Notifica a cena para conceder essência
    if (scene && scene.onSpiritPurified) {
      scene.onSpiritPurified(this);
    }

    this.healthBar.clear();
    if (this.sprite && this.scene.textures.exists('spirit_redeemed')) {
      this.sprite.setTexture('spirit_redeemed');
      this.sprite.setScale(this.visualSize / Math.max(this.sprite.width, this.sprite.height));
    }

    // Efeito visual de iluminação estelar
    this.gfx.clear();
    this.gfx.fillStyle(0xFFFFFF, 0.95);
    this.gfx.fillCircle(0, 0, 26);
    this.gfx.lineStyle(4, 0xF6E05E, 1);
    this.gfx.strokeCircle(0, 0, 28);

    // Orbe de essência flutuando para cima
    const essenceOrb = this.scene.add.graphics();
    essenceOrb.fillStyle(0x4FD1C5, 1);
    essenceOrb.fillCircle(this.x, this.y, 10);
    essenceOrb.setDepth(15);

    this.scene.tweens.add({
      targets: essenceOrb,
      y: this.y - 60,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 600,
      ease: 'Cubic.easeOut',
      onComplete: () => essenceOrb.destroy(),
    });

    // Dissolução do espírito em partículas de luz ascendente
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.8,
      scaleY: 1.8,
      alpha: 0,
      y: this.y - 30,
      duration: 450,
      ease: 'Sine.easeOut',
      onComplete: () => {
        this.destroy();
      },
    });
  }

  protected updateHealthBar() {
    this.healthBar.clear();
    if (this.purified || this.reachedBed) return;

    const width = Math.max(30, Math.round(this.visualSize * 0.6));
    const height = this.visualSize >= 88 ? 5 : 4;
    const x = -width / 2;
    const y = -this.visualSize / 2 + 2;

    const pct = Math.max(0, this.currentHealth / this.maxHealth);

    this.healthBar.fillStyle(0x171D2E, 0.8);
    this.healthBar.fillRect(x, y, width, height);

    this.healthBar.fillStyle(pct > 0.5 ? 0x4FD1C5 : pct > 0.25 ? 0xF6E05E : 0xE53E3E, 1);
    this.healthBar.fillRect(x, y, width * pct, height);
  }
}
