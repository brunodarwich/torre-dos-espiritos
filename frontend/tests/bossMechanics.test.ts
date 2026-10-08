import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/systems/AudioSynth', () => ({
  audioSynth: {
    playPurify: vi.fn(),
    playBell: vi.fn(),
    playClick: vi.fn(),
    playWhoosh: vi.fn(),
    isEnabled: () => true,
    setEnabled: vi.fn(),
  },
}));

vi.mock('phaser', () => {
  class MockGraphics {
    clear = vi.fn().mockReturnThis();
    fillStyle = vi.fn().mockReturnThis();
    fillCircle = vi.fn().mockReturnThis();
    fillRect = vi.fn().mockReturnThis();
    lineStyle = vi.fn().mockReturnThis();
    strokeCircle = vi.fn().mockReturnThis();
    strokeRect = vi.fn().mockReturnThis();
    setPosition = vi.fn().mockReturnThis();
    setDepth = vi.fn().mockReturnThis();
    destroy = vi.fn();
  }

  class MockSprite {
    width = 128;
    height = 128;
    texture = { key: 'spirit_boss' };
    setScale = vi.fn().mockReturnThis();
    setPosition = vi.fn().mockReturnThis();
    setTexture = vi.fn((key: string) => { this.texture.key = key; return this; });
    setTint = vi.fn().mockReturnThis();
    destroy = vi.fn();
  }

  class MockContainer {
    scene: any;
    x: number;
    y: number;
    active: boolean = true;
    children: any[] = [];
    constructor(_scene: any, x: number = 0, y: number = 0) {
      this.scene = _scene;
      this.x = x;
      this.y = y;
    }
    add(child: any) {
      if (Array.isArray(child)) this.children.push(...child);
      else this.children.push(child);
      return this;
    }
    bringToTop(_child: any) { return this; }
    setDepth(_d: number) { return this; }
    destroy() { this.active = false; }
  }

  return {
    default: {
      AUTO: 0,
      Scale: {
        FIT: 0,
        CENTER_BOTH: 1,
      },
      GameObjects: {
        Container: MockContainer,
        Graphics: MockGraphics,
        Sprite: MockSprite,
      },
      Math: {
        Clamp: (v: number, min: number, max: number) => Math.min(Math.max(v, min), max),
        Angle: { Between: (_x1: number, _y1: number, _x2: number, _y2: number) => 0 },
        Distance: { Between: (_x1: number, _y1: number, _x2: number, _y2: number) => 10 },
      },
    },
  };
});

import { Boss } from '../src/entities/Boss';

describe('Boss Mechanics — Fases Dinâmicas, Carapaça e Invocações', () => {
  let mockScene: any;
  let boss: Boss;
  const waypoints = [
    { x: 40, y: 200 },
    { x: 280, y: 200 },
    { x: 280, y: 440 },
    { x: 520, y: 440 },
  ];

  beforeEach(() => {
    mockScene = {
      add: {
        graphics: vi.fn(() => ({
          clear: vi.fn().mockReturnThis(),
          fillStyle: vi.fn().mockReturnThis(),
          fillCircle: vi.fn().mockReturnThis(),
          fillRect: vi.fn().mockReturnThis(),
          lineStyle: vi.fn().mockReturnThis(),
          strokeCircle: vi.fn().mockReturnThis(),
          strokeRect: vi.fn().mockReturnThis(),
          setPosition: vi.fn().mockReturnThis(),
          setDepth: vi.fn().mockReturnThis(),
          destroy: vi.fn(),
        })),
        ellipse: vi.fn(() => ({
          setPosition: vi.fn().mockReturnThis(),
        })),
        sprite: vi.fn(() => ({
          width: 128,
          height: 128,
          texture: { key: 'spirit_boss' },
          setScale: vi.fn().mockReturnThis(),
          setPosition: vi.fn().mockReturnThis(),
          setTexture: vi.fn(),
          setTint: vi.fn(),
          destroy: vi.fn(),
        })),
        existing: vi.fn(),
      },
      tweens: {
        add: vi.fn((config: any) => {
          if (config.onComplete) config.onComplete();
        }),
      },
      textures: {
        exists: vi.fn((key: string) => key === 'spirit_boss' || key === 'spirit_boss_phase2'),
      },
      time: { now: 1000 },
      summonMinions: vi.fn(),
      notifyBossPhase2: vi.fn(),
      notifyBossPhase3: vi.fn(),
      silenceGuideNear: vi.fn(),
      onBossDefeated: vi.fn(),
      onSpiritPurified: vi.fn(),
    };

    boss = new Boss(mockScene, {
      id: 'boss',
      name: 'Colosso do Eclipse',
      health: 3500,
      speed: 28,
      essenceReward: 150,
      lightDamage: 20,
      maxSlow: 0.2,
      color: '#553C9A',
      waypoints,
      spriteKey: 'spirit_boss',
    });
  });

  it('deve absorver 20% do dano direto na Fase 1 e não reduzir outros tipos', () => {
    expect(boss.getPhase()).toBe(1);
    expect(boss.currentHealth).toBe(3500);

    // Dano direto de 100 sofre 20% de redução -> 80 de dano efetivo
    boss.takeDamage(100, 'direct');
    expect(boss.currentHealth).toBe(3500 - 80);

    // Dano dot de 100 não sofre redução da carapaça -> 100 de dano efetivo
    boss.takeDamage(100, 'dot');
    expect(boss.currentHealth).toBe(3500 - 80 - 100);
  });

  it('deve invocar 6 larvas aos 85% e 75% de HP com waypoints para a frente', () => {
    // 3500 * 0.15 = 525 de dano para atingir 85% (HP = 2975)
    // Usando dot para teste exato sem mitigação
    boss.takeDamage(530, 'dot');
    expect(mockScene.summonMinions).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      6,
      'larva',
      expect.any(Number)
    );

    // Próximo patamar: 75% HP (dano acumulado >= 875)
    mockScene.summonMinions.mockClear();
    boss.takeDamage(360, 'dot'); // Total = 890 de dano, HP = 2610 (74.5%)
    expect(mockScene.summonMinions).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      6,
      'larva',
      expect.any(Number)
    );
  });

  it('deve transicionar para Fase 2 aos 66% de HP com +30% velocidade, 3 sombras e silêncio', () => {
    // Reduz HP para 65% (<= 66%)
    boss.takeDamage(1250, 'dot');
    expect(boss.getPhase()).toBe(2);
    expect(boss.baseSpeed).toBeCloseTo(28 * 1.30, 2);
    expect(mockScene.notifyBossPhase2).toHaveBeenCalled();
    expect(mockScene.summonMinions).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      3,
      'sombra',
      expect.any(Number)
    );
    expect(mockScene.silenceGuideNear).toHaveBeenCalled();

    // Na Fase 2, carapaça não absorve mais dano direto
    const hpBefore = boss.currentHealth;
    boss.takeDamage(100, 'direct');
    expect(boss.currentHealth).toBe(hpBefore - 100);
  });

  it('deve transicionar para Fase 3 aos 33% de HP com +60% velocidade e 8 larvas', () => {
    // Reduz HP para 30% (<= 33%)
    boss.takeDamage(2500, 'dot');
    expect(boss.getPhase()).toBe(3);
    expect(boss.baseSpeed).toBeCloseTo(28 * 1.60, 2);
    expect(mockScene.notifyBossPhase3).toHaveBeenCalled();
    expect(mockScene.summonMinions).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      8,
      'larva',
      expect.any(Number)
    );
  });

  it('deve preservar o multiplicador de lentidão ativo durante as transições de fase', () => {
    // Aplica lentidão (maxSlow do boss é 0.20 -> 20%)
    boss.applySlow(0.5, 5.0);
    expect(boss.getSlowMultiplier()).toBeCloseTo(0.80, 2);
    expect(boss.currentSpeed).toBeCloseTo(28 * 0.80, 2);

    // Transição para Fase 2
    boss.takeDamage(1250, 'dot');
    expect(boss.getPhase()).toBe(2);
    // currentSpeed deve manter o multiplicador de lentidão sobre a nova baseSpeed
    expect(boss.currentSpeed).toBeCloseTo((28 * 1.30) * 0.80, 2);

    // Transição para Fase 3
    boss.takeDamage(1250, 'dot');
    expect(boss.getPhase()).toBe(3);
    expect(boss.currentSpeed).toBeCloseTo((28 * 1.60) * 0.80, 2);
  });

  it('deve acionar onBossDefeated ao ser purificado', () => {
    boss.takeDamage(3500, 'dot');
    expect(boss.isPurified()).toBe(true);
    expect(mockScene.onBossDefeated).toHaveBeenCalled();
  });
});
