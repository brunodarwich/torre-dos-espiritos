import Phaser from 'phaser';
export class Projectile extends Phaser.GameObjects.Container {
    target;
    damage;
    speed;
    projectileType;
    areaOfEffect;
    slowPercent;
    slowDuration;
    dotDamage;
    dotDuration;
    chainTargets;
    chainFalloff;
    onHitCallback;
    gfx;
    constructor(scene, config) {
        super(scene, config.x, config.y);
        this.target = config.target;
        this.damage = config.damage;
        this.speed = config.speed;
        this.projectileType = config.type;
        this.areaOfEffect = config.areaOfEffect;
        this.slowPercent = config.slowPercent;
        this.slowDuration = config.slowDuration;
        this.dotDamage = config.dotDamage;
        this.dotDuration = config.dotDuration;
        this.chainTargets = config.chainTargets;
        this.chainFalloff = config.chainFalloff;
        this.onHitCallback = config.onHit;
        this.gfx = scene.add.graphics();
        this.add(this.gfx);
        this.drawProjectile(config.color);
        scene.add.existing(this);
        this.setDepth(10);
    }
    drawProjectile(color) {
        this.gfx.clear();
        if (this.projectileType === 'beam') {
            // Esfera de luz concentrada com brilho estelar
            this.gfx.fillStyle(color, 1);
            this.gfx.fillCircle(0, 0, 6);
            this.gfx.fillStyle(0xFFFFFF, 0.9);
            this.gfx.fillCircle(0, 0, 3);
        }
        else if (this.projectileType === 'herbs') {
            // Ramo de arruda com folhas verdes
            this.gfx.fillStyle(color, 0.9);
            this.gfx.fillEllipse(0, 0, 10, 6);
            this.gfx.fillStyle(0x9AE6B4, 1);
            this.gfx.fillCircle(-2, -1, 3);
        }
        else {
            // Brasa de fogo sagrado ancestral
            this.gfx.fillStyle(color, 0.95);
            this.gfx.fillCircle(0, 0, 8);
            this.gfx.fillStyle(0xFBD38D, 0.9);
            this.gfx.fillCircle(0, 0, 4);
        }
    }
    update(time, delta) {
        if (!this.target || !this.target.active || this.target.isPurified()) {
            this.destroy();
            return;
        }
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        const distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
        const step = (this.speed * delta) / 1000;
        if (distance <= step + 10) {
            this.hitTarget();
        }
        else {
            this.x += Math.cos(angle) * step;
            this.y += Math.sin(angle) * step;
            this.rotation = angle;
        }
    }
    hitTarget() {
        if (this.onHitCallback) {
            this.onHitCallback(this.target, this.damage);
        }
        if (this.target && this.target.active && !this.target.isPurified()) {
            this.target.takeDamage(this.damage, this.areaOfEffect ? 'area' : 'direct');
            if (this.slowPercent && this.slowDuration) {
                this.target.applySlow(this.slowPercent, this.slowDuration);
            }
            if (this.dotDamage && this.dotDuration) {
                this.target.applyDot(this.dotDamage, this.dotDuration);
            }
        }
        // Se houver área de efeito (Pajé ou Benzedeira Nv2+)
        if (this.areaOfEffect) {
            const scene = this.scene;
            if (scene && scene.getSpiritsInRange) {
                const others = scene.getSpiritsInRange(this.x, this.y, this.areaOfEffect);
                others.forEach((spirit) => {
                    if (spirit !== this.target && spirit.active && !spirit.isPurified()) {
                        spirit.takeDamage(this.damage, 'area');
                        if (this.slowPercent && this.slowDuration) {
                            spirit.applySlow(this.slowPercent, this.slowDuration);
                        }
                    }
                });
            }
        }
        this.destroy();
    }
}
//# sourceMappingURL=Projectile.js.map