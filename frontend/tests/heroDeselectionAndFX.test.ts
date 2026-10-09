import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('phaser', () => {
  const phaserMock = {
    AUTO: 0,
    Scene: class {},
    Math: {
      Distance: {
        Between: (x1: number, y1: number, x2: number, y2: number) => Math.hypot(x2 - x1, y2 - y1),
      },
    },
    Scale: {
      FIT: 1,
      CENTER_BOTH: 1,
    },
  };
  return {
    default: phaserMock,
    ...phaserMock,
  };
});

import { UIManager } from '../src/ui/UIManager';
import { CombatFXSystem } from '../src/systems/CombatFXSystem';
import { audioSynth } from '../src/systems/AudioSynth';

class MockElement extends EventTarget {
  hidden = false;
  textContent = '';
  style: Record<string, string> = {};
  classList = {
    add: vi.fn(),
    remove: vi.fn(),
    toggle: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
  };
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
}

describe('Hero Deselection & Intense Wave FX Tests', () => {
  let mockScene: any;
  let combatFX: CombatFXSystem;
  let createdGraphics: any[];

  beforeEach(() => {
    createdGraphics = [];
    const elements = new Map<string, MockElement>();
    const doc = new EventTarget() as any;
    doc.getElementById = (id: string) => {
      if (!elements.has(id)) elements.set(id, new MockElement());
      return elements.get(id);
    };
    doc.querySelectorAll = () => [];
    vi.stubGlobal('document', doc);
    vi.stubGlobal('window', { addEventListener: vi.fn(), removeEventListener: vi.fn() });

    mockScene = {
      add: {
        graphics: vi.fn(() => {
          const g = {
            setDepth: vi.fn().mockReturnThis(),
            clear: vi.fn().mockReturnThis(),
            fillStyle: vi.fn().mockReturnThis(),
            fillRect: vi.fn().mockReturnThis(),
            fillCircle: vi.fn().mockReturnThis(),
            lineStyle: vi.fn().mockReturnThis(),
            strokeCircle: vi.fn().mockReturnThis(),
            strokeRect: vi.fn().mockReturnThis(),
            beginPath: vi.fn().mockReturnThis(),
            arc: vi.fn().mockReturnThis(),
            strokePath: vi.fn().mockReturnThis(),
            setPosition: vi.fn().mockReturnThis(),
            destroy: vi.fn(),
          };
          createdGraphics.push(g);
          return g;
        }),
        text: vi.fn(() => ({
          setOrigin: vi.fn().mockReturnThis(),
          setDepth: vi.fn().mockReturnThis(),
          setScale: vi.fn().mockReturnThis(),
          destroy: vi.fn(),
        })),
      },
      cameras: {
        main: {
          shake: vi.fn(),
        },
      },
      tweens: {
        add: vi.fn(),
      },
    };

    combatFX = new CombatFXSystem(mockScene);
  });

  describe('Hero Deselection Logic', () => {
    it('should correctly track whether a guide is inspected', () => {
      const uiManager = new UIManager();
      expect(uiManager.hasInspectedGuide()).toBe(false);

      const mockGuide: any = {
        setSelected: vi.fn(),
        getLevel: vi.fn().mockReturnValue(1),
        guideName: 'Prisma Solar',
        getLevelData: vi.fn().mockReturnValue({ cost: 100, damage: 10, rate: 1, range: 160, effect: 'Laser' }),
        getNextLevelData: vi.fn().mockReturnValue(null),
        guideId: 'mentor',
        customTargetMode: 'first',
      };

      uiManager.inspectGuide(mockGuide);
      expect(uiManager.hasInspectedGuide()).toBe(true);
      expect(uiManager.getInspectedGuide()).toBe(mockGuide);
      expect(mockGuide.setSelected).toHaveBeenCalledWith(true);

      // Clicar fora aciona closeInspector()
      uiManager.closeInspector();
      expect(uiManager.hasInspectedGuide()).toBe(false);
      expect(uiManager.getInspectedGuide()).toBe(null);
      expect(mockGuide.setSelected).toHaveBeenCalledWith(false);
    });
  });

  describe('Intense Wave FX Progression', () => {
    it('scales screen shake intensity and duration with wave number', () => {
      // Onda 1: tremor leve
      combatFX.triggerWaveTransitionFX(1, 120, 310);
      expect(mockScene.cameras.main.shake).toHaveBeenCalledTimes(1);
      const [dur1, intensity1] = mockScene.cameras.main.shake.mock.calls[0];

      // Onda 10: tremor intenso do Colosso do Eclipse
      combatFX.triggerWaveTransitionFX(10, 120, 310);
      expect(mockScene.cameras.main.shake).toHaveBeenCalledTimes(2);
      const [dur10, intensity10] = mockScene.cameras.main.shake.mock.calls[1];

      expect(intensity10).toBeGreaterThan(intensity1);
      expect(dur10).toBeGreaterThan(dur1);
    });

    it('spawns ambient particles scaling per Act', () => {
      combatFX.initPortalRift(120, 310);

      // Ato 1 (Horda 1): poucas partículas serenas
      combatFX.updateAtmosphere(0.016, 1);
      const particlesWave1 = (combatFX as any).ambientParticles.length;
      expect(particlesWave1).toBeGreaterThanOrEqual(16);

      // Ato 3 (Horda 9): enxame intenso de fagulhas cósmicas
      combatFX.updateAtmosphere(0.016, 9);
      const particlesWave9 = (combatFX as any).ambientParticles.length;
      expect(particlesWave9).toBeGreaterThan(particlesWave1);
      expect(particlesWave9).toBe(55);
    });

    it('respects reduceParticles setting by suppressing particles and shakes', () => {
      combatFX.setReduceParticles(true);
      combatFX.initPortalRift(120, 310);

      combatFX.updateAtmosphere(0.016, 10);
      expect((combatFX as any).ambientParticles.length).toBe(0);

      combatFX.triggerScreenShake(0.005, 200);
      expect(mockScene.cameras.main.shake).not.toHaveBeenCalled();
    });

    it('triggers bed alarm warning shockwaves and shake when enemies are near', () => {
      const triggered = combatFX.triggerBedAlarm(800, 400, 10.0);
      expect(triggered).toBe(true);
      expect(mockScene.cameras.main.shake).toHaveBeenCalled();

      // Throttle: não deve disparar novamente em intervalo menor que 1.3s
      const throttled = combatFX.triggerBedAlarm(800, 400, 10.5);
      expect(throttled).toBe(false);
    });

    it('audio synth supports wave surges and alarm pulses without crashing', () => {
      expect(() => {
        audioSynth.playWaveSurge(1);
        audioSynth.playWaveSurge(10);
        audioSynth.playAlarmPulse();
      }).not.toThrow();
    });
  });
});
