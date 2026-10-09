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
    if (typeof document === 'undefined') return;
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

  // --- AMBIÊNCIA E FX ESCALÁVEIS POR HORDA ---
  private ambientParticles: Array<{
    gfx: Phaser.GameObjects.Graphics;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: number;
    baseAlpha: number;
    phase: number;
  }> = [];

  private portalGfx?: Phaser.GameObjects.Graphics;
  private portalAngle: number = 0;
  private portalPos?: { x: number; y: number };
  private lastBedAlarmTime: number = 0;

  /**
   * Inicializa o ponto focal do portal da fenda para efeitos de vórtice
   */
  public initPortalRift(x: number, y: number) {
    this.portalPos = { x, y };
    if (!this.portalGfx) {
      this.portalGfx = this.scene.add.graphics();
      this.portalGfx.setDepth(2.8);
    }
  }

  /**
   * Atualiza a ambiência cósmica e vórtice da fenda com intensidade proporcional à horda
   */
  public updateAtmosphere(deltaSec: number, waveNumber: number) {
    // 1. Atualização do Vórtice do Portal
    if (this.portalGfx && this.portalPos) {
      const rotSpeed = 0.8 + waveNumber * 0.22;
      this.portalAngle += rotSpeed * deltaSec;

      this.portalGfx.clear();
      if (!this.reduceParticles) {
        const px = this.portalPos.x;
        const py = this.portalPos.y;
        const actColor = waveNumber >= 8 ? 0xED8936 : (waveNumber >= 5 ? 0xB794F4 : 0x4FD1C5);
        const radius = 22 + Math.min(waveNumber * 1.5, 14);

        // Anel giratório externo do vórtice
        this.portalGfx.lineStyle(2, actColor, 0.45);
        this.portalGfx.strokeCircle(px, py, radius);

        // Arcos dinâmicos giratórios da fenda
        const segments = waveNumber >= 7 ? 4 : 3;
        for (let i = 0; i < segments; i++) {
          const startAngle = this.portalAngle + (i * Math.PI * 2) / segments;
          const endAngle = startAngle + Math.PI / 3;
          this.portalGfx.lineStyle(2.5, actColor, 0.85);
          this.portalGfx.beginPath();
          this.portalGfx.arc(px, py, radius - 4, startAngle, endAngle);
          this.portalGfx.strokePath();
        }

        // Núcleo pulsante do vácuo
        const pulse = 0.35 + Math.sin(this.portalAngle * 3) * 0.15;
        this.portalGfx.fillStyle(actColor, pulse);
        this.portalGfx.fillCircle(px, py, 7 + (waveNumber >= 8 ? 3 : 0));
      }
    }

    // 2. Partículas Ambientais Flutuantes (Stardust / Void Embers)
    if (this.reduceParticles) {
      if (this.ambientParticles.length > 0) {
        this.clearAmbientParticles();
      }
      return;
    }

    // Target de partículas cresce por Ato
    const targetCount = waveNumber >= 8 ? 55 : (waveNumber >= 5 ? 32 : 16);

    // Paleta de cores por Ato
    const colors = waveNumber >= 8
      ? [0xED8936, 0xFC8181, 0x9B2C2C, 0x805AD5] // Fogo Fátuo / Eclipse
      : waveNumber >= 5
      ? [0xB794F4, 0x9F7AEA, 0x4FD1C5, 0xE9D8FD] // Tempestade Astral / Roxo
      : [0xF6E05E, 0x4FD1C5, 0xE2E8F0];           // Crepúsculo Celestial / Dourado

    // Spawna partículas até atingir o target
    while (this.ambientParticles.length < targetCount) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 1.2 + Math.random() * (waveNumber >= 8 ? 2.5 : 1.8);
      const gfx = this.scene.add.graphics();
      gfx.setDepth(2.5);

      this.ambientParticles.push({
        gfx,
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GAME_HEIGHT,
        vx: (Math.random() - 0.5) * (waveNumber >= 8 ? 24 : 12),
        vy: -(10 + Math.random() * (waveNumber >= 8 ? 32 : 18)),
        size,
        color,
        baseAlpha: 0.25 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Se houver excesso, reduz
    while (this.ambientParticles.length > targetCount) {
      const p = this.ambientParticles.pop();
      p?.gfx.destroy();
    }

    // Atualiza movimento de cada partícula
    for (let i = 0; i < this.ambientParticles.length; i++) {
      const p = this.ambientParticles[i];
      p.phase += deltaSec * 2.2;
      p.x += (p.vx + Math.sin(p.phase) * 8) * deltaSec;
      p.y += p.vy * deltaSec;

      // Wrap em torno da tela
      if (p.y < -10) {
        p.y = GAME_HEIGHT + 10;
        p.x = Math.random() * GAME_WIDTH;
      }
      if (p.x < -10) p.x = GAME_WIDTH + 10;
      if (p.x > GAME_WIDTH + 10) p.x = -10;

      const alpha = Math.max(0.1, p.baseAlpha + Math.sin(p.phase) * 0.2);
      p.gfx.clear();
      p.gfx.fillStyle(p.color, alpha);
      p.gfx.fillCircle(p.x, p.y, p.size);
    }
  }

  /**
   * Pulso expansivo do portal ao invocar inimigos ou iniciar horda
   */
  public pulsePortalRift(waveNumber: number) {
    if (!this.portalPos || this.reduceParticles) return;
    const px = this.portalPos.x;
    const py = this.portalPos.y;
    const actColor = waveNumber >= 8 ? 0xED8936 : (waveNumber >= 5 ? 0xB794F4 : 0x4FD1C5);
    this.createShockwave(px, py, actColor, 36 + Math.min(waveNumber * 3, 30));
  }

  /**
   * Alarme visual emitido pelo Núcleo/Leito quando espíritos se aproximam perigosamente
   */
  public triggerBedAlarm(bedX: number, bedY: number, currentTimeSec: number): boolean {
    if (currentTimeSec - this.lastBedAlarmTime < 1.3) return false;
    this.lastBedAlarmTime = currentTimeSec;

    // Onda de aviso vermelha/âmbar no núcleo
    this.createShockwave(bedX, bedY, 0xFC8181, 52);
    this.createShockwave(bedX, bedY, 0xED8936, 68);
    this.triggerScreenShake(0.003, 150);
    return true;
  }

  /**
   * Impacto estético e tremor cinematográfico ao iniciar uma nova horda
   */
  public triggerWaveTransitionFX(waveNumber: number, portalX: number, portalY: number) {
    const intensity = Math.min(0.0085, 0.002 + waveNumber * 0.00065);
    const duration = Math.min(450, 130 + waveNumber * 28);
    this.triggerScreenShake(intensity, duration);

    const actColor = waveNumber >= 8 ? 0xED8936 : (waveNumber >= 5 ? 0xB794F4 : 0x4FD1C5);
    this.createShockwave(portalX, portalY, actColor, 60 + Math.min(waveNumber * 10, 80));
  }

  /**
   * Limpa recursos gráficos
   */
  public clearAmbientParticles() {
    for (const p of this.ambientParticles) {
      p.gfx.destroy();
    }
    this.ambientParticles = [];
  }

  public destroy() {
    this.clearAmbientParticles();
    this.portalGfx?.destroy();
  }
}
