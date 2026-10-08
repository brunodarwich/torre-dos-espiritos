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
  private gfx: Phaser.GameObjects.Graphics;
  private auraGfx: Phaser.GameObjects.Graphics;
  private sprite?: Phaser.GameObjects.Sprite;
  private rangeCircle?: Phaser.GameObjects.Graphics;

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

    const shadow = scene.add.ellipse(0, 25, 44, 14, 0x050811, 0.35);
    this.add(shadow);
    this.gfx = scene.add.graphics();
    this.auraGfx = scene.add.graphics();
    this.add([this.auraGfx, this.gfx]);

    this.updateVisuals();
    scene.add.existing(this);
    this.setDepth(4);
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

    // Pulso visual de iluminação do upgrade
    const flash = this.scene.add.graphics();
    flash.lineStyle(4, 0xF6E05E, 1);
    flash.strokeCircle(this.x, this.y, 35);
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

  private updateVisuals() {
    this.gfx.clear();
    this.auraGfx.clear();
    const hexColor = parseInt(this.typeData.color.replace('#', '0x'));

    // Aura nos níveis 2 e 3
    if (this.level >= 2) {
      this.auraGfx.fillStyle(hexColor, this.level === 3 ? 0.35 : 0.2);
      this.auraGfx.fillCircle(0, 0, 36);
      this.auraGfx.lineStyle(2, hexColor, 0.8);
      this.auraGfx.strokeCircle(0, 0, 36);
    }

    // Sprite ou representação artística
    const spriteKey = `${this.guideId}_lvl${this.level}`;
    if (this.scene.textures.exists(spriteKey)) {
      if (!this.sprite) {
        this.sprite = this.scene.add.sprite(0, 0, spriteKey);
        this.add(this.sprite);
      } else {
        this.sprite.setTexture(spriteKey);
      }
      this.sprite.setScale(80 / Math.max(this.sprite.width, this.sprite.height));
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
  }

  public update(time: number, delta: number) {
    this.sprite?.setY(Math.sin(time / 650 + this.col) * 2);
    const deltaSec = delta / 1000;

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

    // Recoil dinâmico na direção oposta ao alvo e pulso estelar
    const angleToTarget = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
    const recoilDist = 3;
    const recoilTarget = this.sprite ?? this.gfx;
    const originalLocalX = recoilTarget.x;
    const originalLocalY = recoilTarget.y;

    this.scene.tweens.add({
      targets: recoilTarget,
      x: originalLocalX - Math.cos(angleToTarget) * recoilDist,
      y: originalLocalY - Math.sin(angleToTarget) * recoilDist,
      scaleX: (this.sprite?.scaleX ?? 1) * 1.12,
      scaleY: (this.sprite?.scaleY ?? 1) * 1.12,
      duration: 70,
      yoyo: true,
      ease: 'Quad.easeOut',
      onComplete: () => {
        recoilTarget.setPosition(originalLocalX, originalLocalY);
      },
    });
  }
}
