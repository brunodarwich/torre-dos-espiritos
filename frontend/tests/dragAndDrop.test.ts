import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('phaser', () => ({
  default: {
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
  },
}));

import { GAME_WIDTH, GAME_HEIGHT, CELL_SIZE, GRID_COLS, GRID_ROWS } from '../src/config';
import { GridSystem } from '../src/systems/GridSystem';
import { EconomySystem } from '../src/systems/EconomySystem';
import { transformClientToWorld } from '../src/utils/coordinates';

describe('Drag and Drop Hero Placement Logic', () => {
  let gridSystem: GridSystem;
  let economySystem: EconomySystem;

  beforeEach(() => {
    // Mock minimal Phaser Scene
    const mockScene = {
      add: {
        graphics: () => ({
          setDepth: vi.fn().mockReturnThis(),
          clear: vi.fn(),
          fillStyle: vi.fn(),
          fillRect: vi.fn(),
          fillCircle: vi.fn(),
          lineStyle: vi.fn(),
          strokeRect: vi.fn(),
          strokeCircle: vi.fn(),
        }),
        image: vi.fn().mockReturnValue({
          setOrigin: vi.fn().mockReturnThis(),
          setDisplaySize: vi.fn().mockReturnThis(),
          setAngle: vi.fn().mockReturnThis(),
          setDepth: vi.fn().mockReturnThis(),
        }),
      },
      cache: {
        json: {
          get: vi.fn().mockReturnValue(null),
        },
      },
      textures: {
        exists: vi.fn().mockReturnValue(false),
      },
    } as any;

    gridSystem = new GridSystem(mockScene);
    economySystem = new EconomySystem();
  });

  it('correctly maps world pixel coordinates to grid cells', () => {
    // Cell (0, 0)
    expect(gridSystem.worldToGrid(10, 10)).toEqual({ col: 0, row: 0 });
    // Cell (3, 2)
    expect(gridSystem.worldToGrid(3 * CELL_SIZE + 40, 2 * CELL_SIZE + 40)).toEqual({ col: 3, row: 2 });
    // Cell (15, 8)
    expect(gridSystem.worldToGrid(15 * CELL_SIZE + 10, 8 * CELL_SIZE + 10)).toEqual({ col: 15, row: 8 });
  });

  it('validates cell placement preventing path and occupied slots', () => {
    // Waypoints / path cells are defined in GridSystem (e.g., (0, 2), (1, 2), (2, 2), (3, 2) are on path)
    expect(gridSystem.isCellOnPath(0, 2)).toBe(true);
    expect(gridSystem.isValidPlacement(0, 2)).toBe(false);

    // Free cell off the path (e.g. col 0, row 0)
    expect(gridSystem.isCellOnPath(0, 0)).toBe(false);
    expect(gridSystem.isValidPlacement(0, 0)).toBe(true);

    // Occupying cell (0, 0)
    gridSystem.occupyCell(0, 0, { id: 'test_guide' });
    expect(gridSystem.isCellOccupied(0, 0)).toBe(true);
    expect(gridSystem.isValidPlacement(0, 0)).toBe(false);

    // Releasing cell (0, 0)
    gridSystem.releaseCell(0, 0);
    expect(gridSystem.isCellOccupied(0, 0)).toBe(false);
    expect(gridSystem.isValidPlacement(0, 0)).toBe(true);

    // Out of bounds
    expect(gridSystem.isValidPlacement(-1, 0)).toBe(false);
    expect(gridSystem.isValidPlacement(GRID_COLS, 0)).toBe(false);
    expect(gridSystem.isValidPlacement(0, GRID_ROWS)).toBe(false);
  });

  it('simulates clientToWorld transformation with canvas scale factors and boundary tolerance', () => {
    // Simulating a canvas of 960x540 centered on a display
    const canvasRect = {
      left: 100,
      top: 50,
      right: 100 + 960,
      bottom: 50 + 540,
      width: 960,
      height: 540,
    };

    // Centro do canvas
    const center = transformClientToWorld(100 + 480, 50 + 270, canvasRect, GAME_WIDTH, GAME_HEIGHT);
    expect(center).not.toBeNull();
    expect(center!.x).toBeCloseTo(GAME_WIDTH / 2, 1);
    expect(center!.y).toBeCloseTo(GAME_HEIGHT / 2, 1);

    // Toque com offset vertical de dedo próximo ao topo (row 0)
    // O jogador toca em Y=60 (dentro da row 0), mas com offset -36px targetY cai para 24 (< top: 50)
    // Deve tolerar e fixar no topo do canvas, mapeando corretamente para row 0
    const topEdgeTouch = transformClientToWorld(100 + 10, 50 - 20, canvasRect, GAME_WIDTH, GAME_HEIGHT, 32);
    expect(topEdgeTouch).not.toBeNull();
    const topGrid = gridSystem.worldToGrid(topEdgeTouch!.x, topEdgeTouch!.y);
    expect(topGrid.row).toBe(0);
    expect(topGrid.col).toBe(0);

    // Borda extrema inferior direita (col 15, row 8)
    // Coordenada exatamente no limite direito e inferior não deve estourar para col 16 / row 9
    const bottomEdgeTouch = transformClientToWorld(100 + 960 + 10, 50 + 540 + 10, canvasRect, GAME_WIDTH, GAME_HEIGHT, 32);
    expect(bottomEdgeTouch).not.toBeNull();
    const bottomGrid = gridSystem.worldToGrid(bottomEdgeTouch!.x, bottomEdgeTouch!.y);
    expect(bottomGrid.col).toBe(GRID_COLS - 1); // 15
    expect(bottomGrid.row).toBe(GRID_ROWS - 1); // 8

    // Fora do canvas além da tolerância (deve retornar null)
    expect(transformClientToWorld(50, 10, canvasRect, GAME_WIDTH, GAME_HEIGHT, 32)).toBeNull();
    expect(transformClientToWorld(1200, 800, canvasRect, GAME_WIDTH, GAME_HEIGHT, 32)).toBeNull();
  });

  it('validates drag drop placement transaction with economy check', () => {
    const cost = 100; // Mentor cost
    expect(economySystem.getEssence()).toBe(250);

    // Free cell
    const validCol = 1;
    const validRow = 0;
    expect(gridSystem.isValidPlacement(validCol, validRow)).toBe(true);

    // Execute drop placement: spend essence and occupy cell
    const success = economySystem.spendEssence(cost);
    expect(success).toBe(true);
    expect(economySystem.getEssence()).toBe(150);
    gridSystem.occupyCell(validCol, validRow, { id: 'mentor' });
    expect(gridSystem.isValidPlacement(validCol, validRow)).toBe(false);

    // Attempting to buy when essence is depleted
    economySystem.spendEssence(150);
    expect(economySystem.getEssence()).toBe(0);
    const failPurchase = economySystem.spendEssence(cost);
    expect(failPurchase).toBe(false);
  });
});
