import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

export class CombatFXSystem {
  private scene: Phaser.Scene;
  private reduceParticles: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.checkParticlePreference();
  }

  public setReduceParticles(reduce: boolean) {
    this.reduceParticles = reduce;
  }

  private checkParticlePreference() {
    const chk = document.getElementById('chk-reduce-particles') as HTMLInputElement | null;
    if (chk) {
      this.reduceParticles = chk.checked;
      chk.addEventListener('change', () => {
        this.reduceParticles = chk.checked;
      });
    }
  }

  /**
   * Floating Combat Text: Números de dano flutuantes com animação estilizada
   */
  public createDamageNumber(
    x: number,
    y: number,
    amount: number,
    type: 'direct' | 'area' | 'dot' | 'crit' = 'direct'
  ) {
    // Offset aleatório sutil para não empilhar exatamente no mesmo pixel
    const offsetX = (Math.random() - 0.5) * 24;
    const offsetY = (Math.random() - 0.5) * 12;

    let color = '#F7FAFC';
    let fontSize = '14px';
    let strokeColor = '#0B0F19';
    let prefix = '-';

    if (type === 'crit') {
      color = '#F6E05E';
      fontSize = '18px';
      prefix = '⚡ -';
    } else if (type === 'area') {
      color = '#ED8936';
      fontSize = '15px';
    } else if (type === 'dot') {
      color = '#FC8181';
      fontSize = '13px';
    }

    const text = this.scene.add.text(x + offsetX, y + offsetY - 10, `${prefix}${Math.round(amount)}`, {
      fontFamily: 'Outfit, Plus Jakarta Sans, sans-serif',
      fontSize,
      color,
      stroke: strokeColor,
      strokeThickness: 3,
      fontStyle: 'bold',
    });

    text.setOrigin(0.5, 0.5);
    text.setDepth(20);
    text.setScale(0.7);

    // Animação de pop-up e subida suave
    this.scene.tweens.add({
      targets: text,
      scaleX: 1.15,
      scaleY: 1.15,
      y: y + offsetY - 38,
      duration: 160,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.tweens.add({
          targets: text,
          y: y + offsetY - 58,
          alpha: 0,
          scaleX: 0.85,
          scaleY: 0.85,
          duration: 380,
          ease: 'Quad.easeIn',
          onComplete: () => {
            text.destroy();
          },
        });
      },
    });
  }

  /**
   * Floating Status Text (ex: "LENTIDÃO", "CONGELADO")
   */
  public createStatusText(x: number, y: number, label: string, color: string = '#4FD1C5') {
    const text = this.scene.add.text(x, y - 25, label, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '11px',
      color,
      stroke: '#0B0F19',
      strokeThickness: 3,
      fontStyle: 'bold',
    });

    text.setOrigin(0.5, 0.5);
    text.setDepth(20);

    this.scene.tweens.add({
      targets: text,
      y: y - 48,
      alpha: 0,
      duration: 650,
      ease: 'Cubic.easeOut',
      onComplete: () => text.destroy(),
    });
  }

  /**
   * Faíscas estelares de impacto radial
   */
  public createImpactSparks(x: number, y: number, hexColor: number, count: number = 6) {
    if (this.reduceParticles) return;

    const sparkCount = Math.min(count, 10);
    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.4;
      const distance = 16 + Math.random() * 22;
      const size = 2.5 + Math.random() * 2;

      const spark = this.scene.add.graphics();
      spark.fillStyle(hexColor, 1);
      spark.fillCircle(0, 0, size);
      spark.setPosition(x, y);
      spark.setDepth(18);

      const targetX = x + Math.cos(angle) * distance;
      const targetY = y + Math.sin(angle) * distance;

      this.scene.tweens.add({
        targets: spark,
        x: targetX,
        y: targetY,
        alpha: 0,
        scaleX: 0.2,
        scaleY: 0.2,
        duration: 220 + Math.random() * 120,
        ease: 'Quad.easeOut',
        onComplete: () => spark.destroy(),
      });
    }
  }

  /**
   * Onda de choque circular (Shockwave) em expansão
   */
  public createShockwave(x: number, y: number, hexColor: number = 0xF6E05E, maxRadius: number = 48) {
    const shockwave = this.scene.add.graphics();
    shockwave.lineStyle(3, hexColor, 0.95);
    shockwave.strokeCircle(0, 0, 10);
    shockwave.setPosition(x, y);
    shockwave.setDepth(16);

    const targetScale = maxRadius / 10;

    this.scene.tweens.add({
      targets: shockwave,
      scaleX: targetScale,
      scaleY: targetScale,
      alpha: 0,
      duration: 320,
      ease: 'Cubic.easeOut',
      onComplete: () => shockwave.destroy(),
    });
  }

  /**
   * Efeito estelar exuberante ao purificar um espírito
   */
  public createPurifyBurst(x: number, y: number) {
    // 1. Onda de choque divina dourada
    this.createShockwave(x, y, 0xF6E05E, 56);
    this.createShockwave(x, y, 0xEBF8FF, 72);

    // 2. Halo de luz celestial ascendente
    const halo = this.scene.add.graphics();
    halo.fillStyle(0xFFFFFF, 0.8);
    halo.fillCircle(0, 0, 20);
    halo.setPosition(x, y);
    halo.setDepth(17);

    this.scene.tweens.add({
      targets: halo,
      scaleX: 2.2,
      scaleY: 2.2,
      alpha: 0,
      duration: 400,
      ease: 'Sine.easeOut',
      onComplete: () => halo.destroy(),
    });

    // 3. Estrelas celestes dispersas
    if (!this.reduceParticles) {
      for (let i = 0; i < 8; i++) {
        const star = this.scene.add.text(x, y, '✦', {
          fontSize: `${12 + Math.random() * 8}px`,
          color: i % 2 === 0 ? '#F6E05E' : '#4FD1C5',
        });
        star.setOrigin(0.5, 0.5);
        star.setDepth(19);

        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 40;

        this.scene.tweens.add({
          targets: star,
          x: x + Math.cos(angle) * dist,
          y: y + Math.sin(angle) * dist - 20,
          alpha: 0,
          rotation: Math.random() * 4,
          duration: 550,
          ease: 'Cubic.easeOut',
          onComplete: () => star.destroy(),
        });
      }
    }
  }

  /**
   * Screen shake sutil e tátil
   */
  public triggerScreenShake(intensity: number = 0.003, duration: number = 120) {
    if (this.reduceParticles) return;
    this.scene.cameras.main.shake(duration, intensity);
  }
}
