import Phaser from 'phaser';
import { CELL_SIZE } from '../config';
import { audioSynth } from '../systems/AudioSynth';
export class Guide extends Phaser.GameObjects.Container {
    guideId;
    guideName;
    col;
    row;
    level = 1;
    totalInvested = 0;
    targetMode = 'first';
    typeData;
    currentLevelData;
    attackCooldown = 0;
    silencedTimer = 0;
    // Renderização
    gfx;
    auraGfx;
    sprite;
    rangeCircle;
    constructor(scene, col, row, typeData) {
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
        this.gfx = scene.add.graphics();
        this.auraGfx = scene.add.graphics();
        this.add([this.auraGfx, this.gfx]);
        this.updateVisuals();
        scene.add.existing(this);
        this.setDepth(4);
    }
    getLevel() {
        return this.level;
    }
    getLevelData() {
        return this.currentLevelData;
    }
    getNextLevelData() {
        return this.typeData.levels[this.level];
    }
    canUpgrade() {
        return this.level < this.typeData.levels.length;
    }
    upgrade() {
        if (!this.canUpgrade())
            return false;
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
    toggleTargetMode() {
        this.targetMode = this.targetMode === 'first' ? 'strongest' : 'first';
    }
    silence(duration) {
        this.silencedTimer = duration;
        this.auraGfx.clear();
        this.auraGfx.fillStyle(0x4A5568, 0.6);
        this.auraGfx.fillCircle(0, 0, 32);
    }
    isSilenced() {
        return this.silencedTimer > 0;
    }
    updateVisuals() {
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
        const spriteKey = `${this.guideId}_lvl${this.level === 3 ? 3 : 1}`;
        if (this.scene.textures.exists(spriteKey)) {
            if (!this.sprite) {
                this.sprite = this.scene.add.sprite(0, 0, spriteKey);
                this.add(this.sprite);
            }
            else {
                this.sprite.setTexture(spriteKey);
            }
            this.sprite.setDisplaySize(60, 60);
        }
        else {
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
    update(time, delta) {
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
    findTarget() {
        const scene = this.scene;
        if (!scene || !scene.getSpiritsInRange)
            return null;
        const inRange = scene.getSpiritsInRange(this.x, this.y, this.currentLevelData.range);
        if (inRange.length === 0)
            return null;
        if (this.targetMode === 'strongest') {
            inRange.sort((a, b) => b.currentHealth - a.currentHealth);
            return inRange[0];
        }
        else {
            // Mais avançado no caminho (menor distância restante até o fim)
            return inRange[0];
        }
    }
    attack(target) {
        const hexColor = parseInt(this.typeData.color.replace('#', '0x'));
        let pType = 'beam';
        if (this.guideId === 'mentor') {
            pType = 'beam';
            audioSynth.playLaser();
        }
        else if (this.guideId === 'benzedeira') {
            pType = 'herbs';
            audioSynth.playHerbs();
        }
        else {
            pType = 'fire';
            audioSynth.playFire();
        }
        const scene = this.scene;
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
        // Leve rotação ou pulso no disparo
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 80,
            yoyo: true,
            ease: 'Quad.easeOut',
        });
    }
}
//# sourceMappingURL=Guide.js.map