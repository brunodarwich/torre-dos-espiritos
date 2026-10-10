import Phaser from 'phaser';
import { CELL_SIZE } from '../config';
import { audioSynth } from '../systems/AudioSynth';
import { Projectile } from './Projectile';

export interface GuideLevelData {
  level: number;
  title: string;
  cost: number;
  damage: number;
  attackRate: number;
  range: number;
  effect: string;
  sprite?: string;
  slowPercent?: number;
  slowDuration?: number;
  areaOfEffect?: number;
  dotDamage?: number;
  dotDuration?: number;
  chainTargets?: number;
  chainFalloff?: number;
  paralyzeInterval?: number;
  paralyzeDuration?: number;
}

export interface GuideTypeData {
  id: string;
  name: string;
  description: string;
  role: string;
  color: string;
  levels: GuideLevelData[];
}

export class Guide extends Phaser.GameObjects.Container {
  /** Escala visual por nível: Nv1 100% · Nv2 120% · Nv3 150% (base = 80px, 1 célula). */
  public static readonly LEVEL_SCALE = [1.0, 1.2, 1.5];
  private static readonly BASE_SIZE = 80;
  private static readonly SELECT_COLOR = 0xF6E05E;

  public guideId: string;
  public guideName: string;
  public col: number;
  public row: number;
  public level: number = 1;
  public totalInvested: number = 0;
  public targetMode: 'first' | 'strongest' = 'first';

  private typeData: GuideTypeData;
  private currentLevelData: GuideLevelData;
  private attackCooldown: number = 0;
  private silencedTimer: number = 0;

  // Renderização
  private shadow: Phaser.GameObjects.Ellipse;
  private gfx: Phaser.GameObjects.Graphics;
  private auraGfx: Phaser.GameObjects.Graphics;
  private sprite?: Phaser.GameObjects.Sprite;
  private rangeCircle?: Phaser.GameObjects.Graphics;

  // Seletor (anel aos pés + marcador acima da cabeça + círculo de alcance)
  private selected = false;
  private selectRingHolder: Phaser.GameObjects.Container;
  private selectRing: Phaser.GameObjects.Graphics;
  private selectMarker: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, col: number, row: number, typeData: GuideTypeData) {
    const x = col * CELL_SIZE + CELL_SIZE / 2;
    const y = row * CELL_SIZE + CELL_SIZE / 2;
    super(scene, x, y);

    this.col = col;
    this.row = row;
    this.typeData = typeData;
    this.guideId = typeData.id;
    this.guideName = typeData.name;
    this.currentLevelData = typeData.levels[0];
    this.totalInvested = this.currentLevelData.cost;

    this.shadow = scene.add.ellipse(0, 25, 44, 14, 0x050811, 0.35);
    this.add(this.shadow);

    // Anel do seletor: o holder achata em perspectiva, o anel interno gira
    this.selectRing = scene.add.graphics();
    this.selectRingHolder = scene.add.container(0, 25, [this.selectRing]);
    this.selectRingHolder.setScale(1, 0.42);
    this.selectRingHolder.setVisible(false);
    this.add(this.selectRingHolder);

    this.gfx = scene.add.graphics();
    this.auraGfx = scene.add.graphics();
    this.add([this.auraGfx, this.gfx]);

    this.selectMarker = scene.add.graphics();
    this.selectMarker.setVisible(false);
    this.add(this.selectMarker);

    this.updateVisuals();
    scene.add.existing(this);
    // Profundidade por linha: heróis mais abaixo ficam à frente (ilusão de profundidade).
    // Mantém-se entre 4 e 5, sempre abaixo dos espíritos (6).
    this.setDepth(4 + y / 10000);
  }

  private getLevelScale(): number {
    return Guide.LEVEL_SCALE[this.level - 1] ?? 1;
  }

  /** Liga/desliga o seletor visual do herói no tabuleiro. */
  public setSelected(on: boolean) {
    this.selected = on;
    if (!this.scene) return;
    this.selectRingHolder.setVisible(on);
    this.selectMarker.setVisible(on);
    if (on) {
      if (!this.rangeCircle) {
        this.rangeCircle = this.scene.add.graphics();
        this.rangeCircle.setDepth(3.5);
      }
      this.drawSelector();
    } else {
      this.rangeCircle?.destroy();
      this.rangeCircle = undefined;
    }
  }

  public isSelected(): boolean {
    return this.selected;
  }

  private drawSelector() {
    const s = this.getLevelScale();
    const hexColor = parseInt(this.typeData.color.replace('#', '0x'));

    // Anel tracejado dourado (12 segmentos) aos pés
    const r = 34 * s;
    this.selectRing.clear();
    this.selectRing.lineStyle(4, Guide.SELECT_COLOR, 0.95);
    const segments = 12;
    for (let i = 0; i < segments; i++) {
      const a0 = (i / segments) * Math.PI * 2;
      const a1 = a0 + (Math.PI * 2) / segments * 0.6;
      this.selectRing.beginPath();
      this.selectRing.arc(0, 0, r, a0, a1);
      this.selectRing.strokePath();
    }
    this.selectRing.lineStyle(2, 0xFFFFFF, 0.5);
    this.selectRing.strokeCircle(0, 0, r - 6);
    this.selectRingHolder.setY(25 * s);

    // Marcador triangular acima da cabeça
    this.selectMarker.clear();
    this.selectMarker.fillStyle(Guide.SELECT_COLOR, 1);
    this.selectMarker.fillTriangle(-8, 0, 8, 0, 0, 10);
    this.selectMarker.lineStyle(2, 0x171D2E, 0.9);
    this.selectMarker.strokeTriangle(-8, 0, 8, 0, 0, 10);

    // Círculo de alcance (no mundo, abaixo dos heróis)
    if (this.rangeCircle) {
      const range = this.currentLevelData.range;
      this.rangeCircle.clear();
      this.rangeCircle.fillStyle(hexColor, 0.08);
      this.rangeCircle.fillCircle(this.x, this.y, range);
      this.rangeCircle.lineStyle(2, hexColor, 0.6);
      this.rangeCircle.strokeCircle(this.x, this.y, range);
    }
  }

  public override destroy(fromScene?: boolean) {
    this.rangeCircle?.destroy();
    this.rangeCircle = undefined;
    super.destroy(fromScene);
  }

  public getTextureKey(): string | undefined { return this.sprite?.texture.key; }

  public getLevel(): number {
    return this.level;
  }

  public getLevelData(): GuideLevelData {
    return this.currentLevelData;
  }

  public getNextLevelData(): GuideLevelData | undefined {
    return this.typeData.levels[this.level];
  }

  public canUpgrade(): boolean {
    return this.level < this.typeData.levels.length;
  }

  public upgrade(): boolean {
    if (!this.canUpgrade()) return false;
    const nextData = this.typeData.levels[this.level];
    this.totalInvested += nextData.cost;
    this.level++;
    this.currentLevelData = nextData;
    this.updateVisuals();
    if (this.selected) this.drawSelector();

    // "Pop" de crescimento: passa um pouco do tamanho final e assenta
    this.scene.tweens.killTweensOf(this);
    this.setScale(0.85);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      duration: 380,
      ease: 'Back.easeOut',
    });

    // Pulso visual de iluminação do upgrade
    const flash = this.scene.add.graphics();
    flash.lineStyle(4, 0xF6E05E, 1);
    flash.strokeCircle(this.x, this.y, 35 * this.getLevelScale());
    flash.setDepth(12);

    this.scene.tweens.add({
      targets: flash,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 400,
      onComplete: () => flash.destroy(),
    });

    audioSynth.playBell();
    return true;
  }

  public toggleTargetMode() {
    this.targetMode = this.targetMode === 'first' ? 'strongest' : 'first';
  }

  public silence(duration: number) {
    this.silencedTimer = duration;
    this.auraGfx.clear();
    this.auraGfx.fillStyle(0x4A5568, 0.6);
    this.auraGfx.fillCircle(0, 0, 32);
  }

  public isSilenced(): boolean {
    return this.silencedTimer > 0;
  }

  private spriteBaseScale = 1;

  private updateVisuals() {
    this.gfx.clear();
    this.auraGfx.clear();
    const hexColor = parseInt(this.typeData.color.replace('#', '0x'));
    const s = this.getLevelScale();

    // Sombra, aura e fallback acompanham a escala do nível
    this.shadow.setScale(s);
    this.shadow.setY(25 * s);
    this.auraGfx.setScale(s);
    this.gfx.setScale(s);

    // Aura nos níveis 2 e 3
    if (this.level >= 2) {
      this.auraGfx.fillStyle(hexColor, this.level === 3 ? 0.35 : 0.2);
      this.auraGfx.fillCircle(0, 0, 36);
      this.auraGfx.lineStyle(2, hexColor, 0.8);
      this.auraGfx.strokeCircle(0, 0, 36);
    }

    // Sprite ou representação artística (spritesheet animado ou estático)
    const baseKey = `${this.guideId}_lvl${this.level}`;
    const sheetKey = `${baseKey}_sheet`;
    const idleAnimKey = `${baseKey}_idle`;

    if (this.scene.textures.exists(sheetKey) && this.scene.anims?.exists(idleAnimKey)) {
      if (!this.sprite) {
        this.sprite = this.scene.add.sprite(0, 0, sheetKey, 0);
        this.add(this.sprite);
      } else {
        this.sprite.setTexture(sheetKey, 0);
      }
      this.scene.tweens.killTweensOf(this.sprite);
      this.spriteBaseScale = (Guide.BASE_SIZE * s) / Math.max(this.sprite.width, this.sprite.height);
      this.sprite.setScale(this.spriteBaseScale);
      this.sprite.setX(0);
      this.sprite.play(idleAnimKey);
    } else if (this.scene.textures.exists(baseKey)) {
      if (!this.sprite) {
        this.sprite = this.scene.add.sprite(0, 0, baseKey);
        this.add(this.sprite);
      } else {
        this.sprite.setTexture(baseKey);
      }
      this.scene.tweens.killTweensOf(this.sprite);
      this.spriteBaseScale = (Guide.BASE_SIZE * s) / Math.max(this.sprite.width, this.sprite.height);
      this.sprite.setScale(this.spriteBaseScale);
      this.sprite.setX(0);
    } else {
      // Fallback procedural estético
      this.gfx.fillStyle(hexColor, 0.95);
      this.gfx.fillCircle(0, 0, 26);
      this.gfx.fillStyle(0xFFFFFF, 0.9);
      this.gfx.fillCircle(0, 0, 10);

      // Distintivo de nível
      this.gfx.fillStyle(0x171D2E, 0.9);
      this.gfx.fillRect(-12, 14, 24, 12);
      this.gfx.lineStyle(1, hexColor, 1);
      this.gfx.strokeRect(-12, 14, 24, 12);
    }

    // Marcador do seletor sempre por cima do herói
    this.bringToTop(this.selectMarker);
  }

  public update(time: number, delta: number) {
    const isAttacking = Boolean(this.sprite?.anims?.isPlaying && this.sprite.anims.currentAnim?.key.endsWith('_attack'));
    if (!isAttacking) {
      this.sprite?.setY(Math.sin(time / 650 + this.col) * 2);
    }
    const deltaSec = delta / 1000;

    // Animação do seletor: anel gira e pulsa, marcador flutua acima da cabeça
    if (this.selected) {
      const s = this.getLevelScale();
      this.selectRing.rotation += deltaSec * 1.2;
      const pulse = 1 + Math.sin(time / 220) * 0.05;
      this.selectRing.setScale(pulse);
      this.selectMarker.setScale(s);
      this.selectMarker.setY(-(Guide.BASE_SIZE / 2) * s - 16 + Math.sin(time / 260) * 4);
    }

    if (this.silencedTimer > 0) {
      this.silencedTimer -= deltaSec;
      if (this.silencedTimer <= 0) {
        this.updateVisuals();
      }
      return;
    }

    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaSec;
    }

    if (this.attackCooldown <= 0) {
      const target = this.findTarget();
      if (target) {
        this.attack(target);
        this.attackCooldown = 1.0 / this.currentLevelData.attackRate;
      }
    }
  }

  private findTarget(): any | null {
    const scene = this.scene as any;
    if (!scene || !scene.getSpiritsInRange) return null;

    const inRange = scene.getSpiritsInRange(this.x, this.y, this.currentLevelData.range);
    if (inRange.length === 0) return null;

    if (this.targetMode === 'strongest') {
      inRange.sort((a: any, b: any) => b.currentHealth - a.currentHealth);
      return inRange[0];
    } else {
      // Mais avançado no caminho (menor distância restante até o fim)
      return inRange[0];
    }
  }

  private attack(target: any) {
    const hexColor = parseInt(this.typeData.color.replace('#', '0x'));

    let pType: 'beam' | 'herbs' | 'fire' = 'beam';
    if (this.guideId === 'mentor') {
      pType = 'beam';
      audioSynth.playLaser();
    } else if (this.guideId === 'benzedeira') {
      pType = 'herbs';
      audioSynth.playHerbs();
    } else {
      pType = 'fire';
      audioSynth.playFire();
    }

    const scene = this.scene as any;
    if (scene && scene.spawnProjectile) {
      scene.spawnProjectile({
        x: this.x,
        y: this.y,
        targetX: target.x,
        targetY: target.y,
        target,
        damage: this.currentLevelData.damage,
        speed: this.guideId === 'mentor' ? 700 : 450,
        color: hexColor,
        type: pType,
        areaOfEffect: this.currentLevelData.areaOfEffect,
        slowPercent: this.currentLevelData.slowPercent,
        slowDuration: this.currentLevelData.slowDuration,
        dotDamage: this.currentLevelData.dotDamage,
        dotDuration: this.currentLevelData.dotDuration,
      });
    }

    const recoilTarget = this.sprite ?? this.gfx;
    this.scene.tweens.killTweensOf(recoilTarget);
    recoilTarget.setPosition(0, 0);
    const baseScale = this.sprite ? this.spriteBaseScale : this.getLevelScale();
    recoilTarget.setScale(baseScale);

    // Animação fluida de ataque (4 quadros) e retorno suave ao looping de espera (Idle)
    const atkAnimKey = `${this.guideId}_lvl${this.level}_attack`;
    const idleAnimKey = `${this.guideId}_lvl${this.level}_idle`;
    if (this.sprite && this.scene.anims?.exists(atkAnimKey)) {
      this.sprite.off(Phaser.Animations.Events.ANIMATION_COMPLETE);
      this.sprite.play(atkAnimKey);
      this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, (anim: Phaser.Animations.Animation) => {
        if (anim.key === atkAnimKey && this.sprite && this.scene?.anims?.exists(idleAnimKey)) {
          this.sprite.play(idleAnimKey);
        }
      });
    }

    // Recoil dinâmico na direção oposta ao alvo e pulso estelar
    const angleToTarget = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
    const recoilDist = 3;

    this.scene.tweens.add({
      targets: recoilTarget,
      x: -Math.cos(angleToTarget) * recoilDist,
      y: -Math.sin(angleToTarget) * recoilDist,
      scaleX: baseScale * 1.12,
      scaleY: baseScale * 1.12,
      duration: 70,
      yoyo: true,
      ease: 'Quad.easeOut',
      onComplete: () => {
        recoilTarget.setPosition(0, 0);
        recoilTarget.setScale(baseScale);
      },
    });
  }
}
