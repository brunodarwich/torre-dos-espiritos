import Phaser from 'phaser';
import { Spirit, SpiritConfig } from './Spirit';

export class Boss extends Spirit {
  private phase: number = 1;
  private initialBaseSpeed: number;
  private spawned85Percent: boolean = false;
  private spawned75Percent: boolean = false;
  private enteredPhase2: boolean = false;
  private enteredPhase3: boolean = false;
  private auraTimer: number = 7.0;
  private pulseTimer: number = 0;

  constructor(scene: Phaser.Scene, config: SpiritConfig) {
    super(scene, config);
    this.initialBaseSpeed = config.speed;
    this.setDepth(8);
  }

  public getPhase(): number {
    return this.phase;
  }

  protected override initVisuals(config: SpiritConfig) {
    if (config.spriteKey && this.scene.textures.exists(config.spriteKey)) {
      this.sprite = this.scene.add.sprite(0, 0, config.spriteKey);
      this.sprite.setScale(this.visualSize / Math.max(this.sprite.width, this.sprite.height));
      this.add(this.sprite);
    } else {
      this.gfx.fillStyle(0x553C9A, 0.95);
      this.gfx.fillCircle(0, 0, 38);
      this.gfx.fillStyle(0xFFFFFF, 1);
      this.gfx.fillCircle(-8, -6, 6);
      this.gfx.fillCircle(8, -6, 6);
      this.gfx.fillStyle(0xE53E3E, 1);
      this.gfx.fillCircle(-8, -6, 3);
      this.gfx.fillCircle(8, -6, 3);
    }
    this.updateVisualPosition();
    this.updateHealthBar();
  }

  public override takeDamage(amount: number, type: 'direct' | 'area' | 'dot' = 'direct') {
    if (this.isPurified() || this.hasReachedBed()) return;

    let effectiveDamage = amount;
    // Fase 1 (100% a 66% HP): Carapaça absorve 20% do dano direto
    if (this.phase === 1 && type === 'direct') {
      effectiveDamage = amount * 0.8;
    }

    super.takeDamage(effectiveDamage, type);

    if (this.isPurified() || this.hasReachedBed()) return;
    const healthRatio = this.currentHealth / this.maxHealth;

    // Fase 1: Invocações aos 85% e 75%
    if (healthRatio <= 0.85 && !this.spawned85Percent) {
      this.spawned85Percent = true;
      this.triggerMinionSummon('larva', 6);
    }

    if (healthRatio <= 0.75 && !this.spawned75Percent) {
      this.spawned75Percent = true;
      this.triggerMinionSummon('larva', 6);
    }

    // Transição para Fase 2 (aos 66% de HP)
    if (healthRatio <= 0.66 && !this.enteredPhase2) {
      this.enteredPhase2 = true;
      this.enterPhase2();
    }

    // Transição para Fase 3 (aos 33% de HP)
    if (healthRatio <= 0.33 && !this.enteredPhase3) {
      this.enteredPhase3 = true;
      this.enterPhase3();
    }
  }

  private triggerMinionSummon(spiritType: 'larva' | 'sombra', count: number) {
    const scene = this.scene as any;
    if (scene && scene.summonMinions) {
      scene.summonMinions(this.x, this.y, count, spiritType, this.getCurrentWaypointIndex());
    }

    // Efeito visual de pulso sombrio
    const pulse = this.scene.add.graphics();
    const pulseColor = spiritType === 'sombra' ? 0x805AD5 : (this.phase === 3 ? 0xE53E3E : 0x9F7AEA);
    pulse.lineStyle(4, pulseColor, 0.9);
    pulse.strokeCircle(this.x, this.y, 40);
    pulse.setDepth(7);

    this.scene.tweens.add({
      targets: pulse,
      scaleX: 2.5,
      scaleY: 2.5,
      alpha: 0,
      duration: 500,
      onComplete: () => pulse.destroy(),
    });
  }

  private enterPhase2() {
    this.phase = 2;
    if (this.sprite && this.scene.textures.exists('spirit_boss_phase2')) {
      this.sprite.setTexture('spirit_boss_phase2');
      this.sprite.setScale(this.visualSize / Math.max(this.sprite.width, this.sprite.height));
    } else if (!this.sprite) {
      this.gfx.clear();
      this.gfx.fillStyle(0x44337A, 0.95);
      this.gfx.fillCircle(0, 0, 42);
      this.gfx.fillStyle(0x9F7AEA, 1);
      this.gfx.fillCircle(-8, -6, 5);
      this.gfx.fillCircle(8, -6, 5);
    }
    this.updateHealthBar();

    // Aumento de velocidade em +30% da base preservando desaceleração ativa
    this.baseSpeed = this.initialBaseSpeed * 1.30;
    this.currentSpeed = this.baseSpeed * this.getSlowMultiplier();
    this.auraTimer = 7.0;

    // Invoca 3 Espectros da Névoa e emite pulso de silêncio inicial
    this.triggerMinionSummon('sombra', 3);
    this.silenceNearestGuide();

    const scene = this.scene as any;
    if (scene && scene.notifyBossPhase2) {
      scene.notifyBossPhase2();
    }
  }

  private enterPhase3() {
    this.phase = 3;
    if (this.sprite) {
      this.sprite.setTint(0xFF6B6B);
    } else {
      this.gfx.clear();
      this.gfx.fillStyle(0x9B2C2C, 0.95);
      this.gfx.fillCircle(0, 0, 44);
      this.gfx.fillStyle(0xE53E3E, 1);
      this.gfx.fillCircle(-8, -6, 6);
      this.gfx.fillCircle(8, -6, 6);
    }
    this.updateHealthBar();

    // Perde carapaça e velocidade sobe para +60% da base (corrida crítica)
    this.baseSpeed = this.initialBaseSpeed * 1.60;
    this.currentSpeed = this.baseSpeed * this.getSlowMultiplier();

    // Invoca último enxame de 8 Larvas
    this.triggerMinionSummon('larva', 8);

    const scene = this.scene as any;
    if (scene && scene.notifyBossPhase3) {
      scene.notifyBossPhase3();
    }
  }

  public override update(time: number, delta: number) {
    super.update(time, delta);
    if (this.isPurified() || this.hasReachedBed()) return;

    const deltaSec = delta / 1000;

    // Fase 2: Pulso de silêncio a cada 7s na torre mais próxima
    if (this.phase === 2) {
      this.auraTimer -= deltaSec;
      if (this.auraTimer <= 0) {
        this.silenceNearestGuide();
        this.auraTimer = 7.0;
      }
    }

    // Fase 3: Pulso visual instável de corrida crítica
    if (this.phase === 3) {
      this.pulseTimer -= deltaSec;
      if (this.pulseTimer <= 0) {
        this.createInstabilityPulse();
        this.pulseTimer = 0.35;
      }
    }
  }

  private silenceNearestGuide() {
    const scene = this.scene as any;
    if (scene && scene.silenceGuideNear) {
      scene.silenceGuideNear(this.x, this.y, 2.5);
    }

    // Efeito visual de pulso místico de silêncio emanando do chefe
    if (this.scene && this.active && !this.isPurified() && !this.hasReachedBed()) {
      const pulse = this.scene.add.graphics();
      pulse.lineStyle(3, 0x9F7AEA, 0.85);
      pulse.strokeCircle(this.x, this.y, 50);
      pulse.setDepth(7);

      this.scene.tweens.add({
        targets: pulse,
        scaleX: 2.4,
        scaleY: 2.4,
        alpha: 0,
        duration: 500,
        onComplete: () => pulse.destroy(),
      });
    }
  }

  private createInstabilityPulse() {
    if (!this.active || this.isPurified() || this.hasReachedBed()) return;
    const pulse = this.scene.add.graphics();
    pulse.lineStyle(3, 0xE53E3E, 0.85);
    pulse.strokeCircle(this.x, this.y, 45);
    pulse.setDepth(7);

    this.scene.tweens.add({
      targets: pulse,
      scaleX: 1.8,
      scaleY: 1.8,
      alpha: 0,
      duration: 350,
      onComplete: () => pulse.destroy(),
    });
  }

  protected override updateHealthBar() {
    this.healthBar.clear();
    if (this.isPurified() || this.hasReachedBed()) return;

    const width = Math.round(this.visualSize * 0.6);
    const height = 7;
    const x = -width / 2;
    const y = -this.visualSize / 2;

    const pct = Math.max(0, this.currentHealth / this.maxHealth);

    this.healthBar.fillStyle(0x171D2E, 0.9);
    this.healthBar.fillRect(x, y, width, height);

    // Cor por fase: Fase 1 (Amarelo Dourado), Fase 2 (Roxo Astral), Fase 3 (Vermelho Crítico)
    const color = this.phase === 1 ? 0xF6E05E : (this.phase === 2 ? 0x9F7AEA : 0xE53E3E);
    this.healthBar.fillStyle(color, 1);
    this.healthBar.fillRect(x, y, width * pct, height);

    this.healthBar.lineStyle(1, 0xFFFFFF, 0.4);
    this.healthBar.strokeRect(x, y, width, height);
  }

  public override purify() {
    super.purify();
    const scene = this.scene as any;
    if (scene && scene.onBossDefeated) {
      scene.onBossDefeated();
    }
  }
}
