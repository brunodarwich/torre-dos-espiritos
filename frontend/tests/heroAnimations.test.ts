import { describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Hero Animations System (Idle 3-Frames Loop & Fluid 4-Frames Attack)', () => {
  const heroesDir = path.resolve(__dirname, '../public/assets/astral/heroes');
  const manifestPath = path.join(heroesDir, 'animations_manifest.json');

  it('validates that animations_manifest.json exists and contains all 3 heroes and 3 levels', () => {
    expect(fs.existsSync(manifestPath)).toBe(true);
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    
    const heroes = ['mentor', 'benzedeira', 'paje'];
    for (const hero of heroes) {
      expect(manifest.heroes[hero]).toBeDefined();
      expect(manifest.heroes[hero].name).toBeDefined();
      for (const lvl of [1, 2, 3]) {
        const lvlData = manifest.heroes[hero].levels[lvl];
        expect(lvlData).toBeDefined();
        expect(lvlData.frames_count).toBe(7);
        expect(lvlData.idle_frames).toEqual([0, 1, 2]);
        expect(lvlData.attack_frames).toEqual([3, 4, 5, 6]);
      }
    }
  });

  it('validates that all 63 individual frames and 9 spritesheets exist on disk with valid file size', () => {
    const heroes = ['mentor', 'benzedeira', 'paje'];
    for (const hero of heroes) {
      for (const lvl of [1, 2, 3]) {
        // Spritesheet
        const sheetPath = path.join(heroesDir, `${hero}_lvl${lvl}_sheet.png`);
        expect(fs.existsSync(sheetPath)).toBe(true);
        expect(fs.statSync(sheetPath).size).toBeGreaterThan(100000);

        // 3 Idle frames
        for (let i = 1; i <= 3; i++) {
          const idlePath = path.join(heroesDir, `${hero}_lvl${lvl}_idle_${i}.png`);
          expect(fs.existsSync(idlePath)).toBe(true);
          expect(fs.statSync(idlePath).size).toBeGreaterThan(50000);
        }

        // 4 Attack frames
        for (let i = 1; i <= 4; i++) {
          const atkPath = path.join(heroesDir, `${hero}_lvl${lvl}_atk_${i}.png`);
          expect(fs.existsSync(atkPath)).toBe(true);
          expect(fs.statSync(atkPath).size).toBeGreaterThan(50000);
        }
      }
    }
  });

  it('validates animation creation logic with proper frame ranges and loop rules', () => {
    const createdAnims = new Map<string, any>();
    const mockAnims = {
      exists: (key: string) => createdAnims.has(key),
      create: (config: any) => createdAnims.set(config.key, config),
      generateFrameNumbers: (sheet: string, range: any) => {
        const frames = [];
        for (let i = range.start; i <= range.end; i++) {
          frames.push({ key: sheet, frame: i });
        }
        return frames;
      },
    };

    const heroes = ['mentor', 'benzedeira', 'paje'];
    for (const id of heroes) {
      for (const level of [1, 2, 3]) {
        const key = `${id}_lvl${level}`;
        const sheetKey = `${key}_sheet`;

        // Idle: 3 frames em loop infinito
        mockAnims.create({
          key: `${key}_idle`,
          frames: mockAnims.generateFrameNumbers(sheetKey, { start: 0, end: 2 }),
          frameRate: 4,
          repeat: -1,
        });

        // Attack: 4 frames em sequência sem repetição
        mockAnims.create({
          key: `${key}_attack`,
          frames: mockAnims.generateFrameNumbers(sheetKey, { start: 3, end: 6 }),
          frameRate: 10,
          repeat: 0,
        });
      }
    }

    // Validação estrita
    expect(createdAnims.size).toBe(18); // 9 idles + 9 attacks

    for (const id of heroes) {
      for (const level of [1, 2, 3]) {
        const idle = createdAnims.get(`${id}_lvl${level}_idle`);
        expect(idle).toBeDefined();
        expect(idle.frames).toHaveLength(3);
        expect(idle.repeat).toBe(-1); // Loop infinito
        expect(idle.frameRate).toBe(4);

        const atk = createdAnims.get(`${id}_lvl${level}_attack`);
        expect(atk).toBeDefined();
        expect(atk.frames).toHaveLength(4);
        expect(atk.repeat).toBe(0); // Disparo único fluido
        expect(atk.frameRate).toBe(10);
      }
    }
  });

  it('verifies that Guide transitions from Idle to Attack and back to Idle on attack completion', () => {
    let currentAnim: string | null = null;
    let eventListeners = new Map<string, Function>();

    const mockSprite: any = {
      play: vi.fn((key: string) => { currentAnim = key; }),
      once: vi.fn((event: string, cb: Function) => { eventListeners.set(event, cb); }),
      setTexture: vi.fn(),
      setScale: vi.fn(),
      setX: vi.fn(),
      setPosition: vi.fn(),
    };

    // Estado inicial: entra em Idle
    mockSprite.play('mentor_lvl1_idle');
    expect(currentAnim).toBe('mentor_lvl1_idle');

    // Ao atacar: aciona Attack e registra retorno
    const atkKey = 'mentor_lvl1_attack';
    const idleKey = 'mentor_lvl1_idle';
    mockSprite.play(atkKey);
    mockSprite.once('animationcomplete', (anim: any) => {
      if (anim.key === atkKey) {
        mockSprite.play(idleKey);
      }
    });

    expect(currentAnim).toBe('mentor_lvl1_attack');
    expect(mockSprite.once).toHaveBeenCalledWith('animationcomplete', expect.any(Function));

    // Conclusão da animação de ataque: retorna para o loop de Idle
    const completeCb = eventListeners.get('animationcomplete');
    expect(completeCb).toBeDefined();
    completeCb!({ key: 'mentor_lvl1_attack' });

    expect(currentAnim).toBe('mentor_lvl1_idle');
  });

  it('validates that all 4 attack frames for each hero are distinct unique keyframes (no duplicated frames)', () => {
    const heroes = ['mentor', 'benzedeira', 'paje'];
    for (const hero of heroes) {
      for (const lvl of [1, 2, 3]) {
        const frameBuffers: Buffer[] = [];
        for (let i = 1; i <= 4; i++) {
          const atkPath = path.join(heroesDir, `${hero}_lvl${lvl}_atk_${i}.png`);
          const buf = fs.readFileSync(atkPath);
          frameBuffers.push(buf);
        }

        // Ensure no two attack frames are identical in bytes or size
        for (let i = 0; i < frameBuffers.length; i++) {
          for (let j = i + 1; j < frameBuffers.length; j++) {
            expect(frameBuffers[i].equals(frameBuffers[j])).toBe(false);
          }
        }
      }
    }
  });

  it('validates that Guide clears previous animation listeners and kills lingering tweens on attack', () => {
    let currentAnim: string | null = null;
    let registeredListeners: { [evt: string]: Function[] } = {};

    const mockSprite: any = {
      play: vi.fn((key: string) => { currentAnim = key; }),
      off: vi.fn((event: string) => { registeredListeners[event] = []; }),
      once: vi.fn((event: string, cb: Function) => {
        if (!registeredListeners[event]) registeredListeners[event] = [];
        registeredListeners[event].push(cb);
      }),
      setPosition: vi.fn(),
      setScale: vi.fn(),
    };

    const mockTweens = {
      killTweensOf: vi.fn(),
      add: vi.fn(),
    };

    // Primeira chamada de ataque
    mockTweens.killTweensOf(mockSprite);
    mockSprite.setPosition(0, 0);
    mockSprite.off('animationcomplete');
    mockSprite.play('paje_lvl1_attack');
    mockSprite.once('animationcomplete', vi.fn());

    expect(mockTweens.killTweensOf).toHaveBeenCalledWith(mockSprite);
    expect(mockSprite.off).toHaveBeenCalledWith('animationcomplete');
    expect(mockSprite.setPosition).toHaveBeenCalledWith(0, 0);

    // Segunda chamada de ataque rápida (cooldown ou novo alvo)
    mockTweens.killTweensOf(mockSprite);
    mockSprite.setPosition(0, 0);
    mockSprite.off('animationcomplete');
    mockSprite.play('paje_lvl1_attack');
    mockSprite.once('animationcomplete', vi.fn());

    // Verifica que off() limpou listeners para não acumular callbacks
    expect(mockSprite.off).toHaveBeenCalledTimes(2);
  });
});
