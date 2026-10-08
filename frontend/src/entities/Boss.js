import { Spirit } from './Spirit';
export class Boss extends Spirit {
    phase = 1;
    spawned75Percent = false;
    spawned50Percent = false;
    auraTimer = 8.0;
    constructor(scene, config) {
        super(scene, config);
        this.setDepth(8);
    }
    initVisuals(config) {
        if (config.spriteKey && this.scene.textures.exists(config.spriteKey)) {
            this.sprite = this.scene.add.sprite(0, 0, config.spriteKey);
            this.sprite.setDisplaySize(84, 84);
            this.add(this.sprite);
        }
        else {
            this.gfx.fillStyle(0x553C9A, 0.95);
            this.gfx.fillCircle(0, 0, 38);
            this.gfx.fillStyle(0xFFFFFF, 1);
            this.gfx.fillCircle(-8, -6, 6);
            this.gfx.fillCircle(8, -6, 6);
            this.gfx.fillStyle(0xE53E3E, 1);
            this.gfx.fillCircle(-8, -6, 3);
            this.gfx.fillCircle(8, -6, 3);
        }
        this.updateHealthBar();
    }
    takeDamage(amount, type = 'direct') {
        super.takeDamage(amount, type);
        const healthRatio = this.currentHealth / this.maxHealth;
        // Fase 1: Invocações aos 75% e 50%
        if (healthRatio <= 0.75 && !this.spawned75Percent) {
            this.spawned75Percent = true;
            this.triggerLarvaSummon();
        }
        if (healthRatio <= 0.5 && !this.spawned50Percent) {
            this.spawned50Percent = true;
            this.phase = 2;
            this.enterPhase2();
            this.triggerLarvaSummon();
        }
    }
    triggerLarvaSummon() {
        const scene = this.scene;
        if (scene && scene.summonMinions) {
            scene.summonMinions(this.x, this.y, 6);
        }
        // Efeito visual de pulso sombrio
        const pulse = this.scene.add.graphics();
        pulse.lineStyle(4, 0x9F7AEA, 0.9);
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
    enterPhase2() {
        // Aumento de velocidade em 50%
        this.baseSpeed = this.baseSpeed * 1.5;
        this.currentSpeed = this.baseSpeed;
        const scene = this.scene;
        if (scene && scene.notifyBossPhase2) {
            scene.notifyBossPhase2();
        }
    }
    update(time, delta) {
        super.update(time, delta);
        if (this.isPurified() || this.hasReachedBed())
            return;
        const deltaSec = delta / 1000;
        // Fase 2: Aura apagadora a cada 8s
        if (this.phase === 2) {
            this.auraTimer -= deltaSec;
            if (this.auraTimer <= 0) {
                this.silenceNearestGuide();
                this.auraTimer = 8.0;
            }
        }
    }
    silenceNearestGuide() {
        const scene = this.scene;
        if (scene && scene.silenceGuideNear) {
            scene.silenceGuideNear(this.x, this.y, 3.0);
        }
    }
    updateHealthBar() {
        this.healthBar.clear();
        if (this.isPurified() || this.hasReachedBed())
            return;
        const width = 64;
        const height = 6;
        const x = -width / 2;
        const y = -48;
        const pct = Math.max(0, this.currentHealth / this.maxHealth);
        this.healthBar.fillStyle(0x171D2E, 0.9);
        this.healthBar.fillRect(x, y, width, height);
        this.healthBar.fillStyle(this.phase === 2 ? 0x9F7AEA : 0xF6E05E, 1);
        this.healthBar.fillRect(x, y, width * pct, height);
    }
    purify() {
        super.purify();
        const scene = this.scene;
        if (scene && scene.onBossDefeated) {
            scene.onBossDefeated();
        }
    }
}
//# sourceMappingURL=Boss.js.map