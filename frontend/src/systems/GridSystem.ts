import Phaser from 'phaser';
import { CELL_SIZE, GRID_COLS, GRID_ROWS } from '../config';

export interface GridPoint {
  col: number;
  row: number;
}

export interface PixelPoint {
  x: number;
  y: number;
}

export class GridSystem {
  private scene: Phaser.Scene;
  private pathCells: Set<string> = new Set();
  private occupiedCells: Map<string, unknown> = new Map();
  private waypoints: PixelPoint[] = [];

  // Feedback gráfico da grade e alcance
  private gridGraphics: Phaser.GameObjects.Graphics;
  private previewGraphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.gridGraphics = this.scene.add.graphics().setDepth(2);
    this.previewGraphics = this.scene.add.graphics().setDepth(5);
    this.initPath();
  }

  /**
   * Define o caminho sinuoso do Quarto Astral (Portal no canto superior esquerdo -> Cama no canto inferior direito)
   */
  private initPath() {
    // Caminho em coordenadas de grade [col, row]
    const gridPath: GridPoint[] = [
      { col: 0, row: 2 },
      { col: 3, row: 2 },
      { col: 3, row: 5 },
      { col: 6, row: 5 },
      { col: 6, row: 1 },
      { col: 9, row: 1 },
      { col: 9, row: 6 },
      { col: 12, row: 6 },
      { col: 12, row: 3 },
      { col: 15, row: 3 },
      { col: 15, row: 6 }, // Cama astral
    ];

    // Registra todas as células intermediárias ao longo do trajeto
    for (let i = 0; i < gridPath.length - 1; i++) {
      const p1 = gridPath[i];
      const p2 = gridPath[i + 1];

      if (p1.col === p2.col) {
        const start = Math.min(p1.row, p2.row);
        const end = Math.max(p1.row, p2.row);
        for (let r = start; r <= end; r++) {
          this.pathCells.add(`${p1.col},${r}`);
        }
      } else {
        const start = Math.min(p1.col, p2.col);
        const end = Math.max(p1.col, p2.col);
        for (let c = start; c <= end; c++) {
          this.pathCells.add(`${c},${p1.row}`);
        }
      }
    }

    // Waypoints em pixels (centro de cada segmento)
    this.waypoints = gridPath.map((pt) => ({
      x: pt.col * CELL_SIZE + CELL_SIZE / 2,
      y: pt.row * CELL_SIZE + CELL_SIZE / 2,
    }));
  }

  public getWaypoints(): PixelPoint[] {
    return this.waypoints;
  }

  public getSpawnPoint(): PixelPoint {
    return this.waypoints[0];
  }

  public getBedPoint(): PixelPoint {
    return this.waypoints[this.waypoints.length - 1];
  }

  public isCellOnPath(col: number, row: number): boolean {
    return this.pathCells.has(`${col},${row}`);
  }

  public isCellOccupied(col: number, row: number): boolean {
    return this.occupiedCells.has(`${col},${row}`);
  }

  public isValidPlacement(col: number, row: number): boolean {
    if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) return false;
    if (this.isCellOnPath(col, row)) return false;
    if (this.isCellOccupied(col, row)) return false;
    return true;
  }

  public occupyCell(col: number, row: number, entity: unknown) {
    this.occupiedCells.set(`${col},${row}`, entity);
  }

  public releaseCell(col: number, row: number) {
    this.occupiedCells.delete(`${col},${row}`);
  }

  public getEntityAt(col: number, row: number): unknown | undefined {
    return this.occupiedCells.get(`${col},${row}`);
  }

  public worldToGrid(x: number, y: number): GridPoint {
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);
    return { col, row };
  }

  public gridToWorld(col: number, row: number): PixelPoint {
    return {
      x: col * CELL_SIZE + CELL_SIZE / 2,
      y: row * CELL_SIZE + CELL_SIZE / 2,
    };
  }

  /**
   * Renderiza os caminhos astrais e as linhas suaves do cenário
   */
  public drawPathOverlay() {
    this.gridGraphics.clear();

    // Faixa mística do caminho astral
    this.gridGraphics.lineStyle(48, 0x1A233D, 0.6);
    this.gridGraphics.beginPath();
    this.gridGraphics.moveTo(this.waypoints[0].x, this.waypoints[0].y);
    for (let i = 1; i < this.waypoints.length; i++) {
      this.gridGraphics.lineTo(this.waypoints[i].x, this.waypoints[i].y);
    }
    this.gridGraphics.strokePath();

    // Linha de energia central no caminho
    this.gridGraphics.lineStyle(4, 0x4FD1C5, 0.4);
    this.gridGraphics.beginPath();
    this.gridGraphics.moveTo(this.waypoints[0].x, this.waypoints[0].y);
    for (let i = 1; i < this.waypoints.length; i++) {
      this.gridGraphics.lineTo(this.waypoints[i].x, this.waypoints[i].y);
    }
    this.gridGraphics.strokePath();
  }

  /**
   * Desenha preview de posicionamento ao passar mouse ou selecionar célula
   */
  public drawPlacementPreview(col: number, row: number, range: number, color: number = 0xF6E05E) {
    this.previewGraphics.clear();
    if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) return;

    const isValid = this.isValidPlacement(col, row);
    const center = this.gridToWorld(col, row);

    // Destaque da célula
    this.previewGraphics.fillStyle(isValid ? color : 0xE53E3E, isValid ? 0.25 : 0.4);
    this.previewGraphics.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    this.previewGraphics.lineStyle(2, isValid ? color : 0xE53E3E, 0.9);
    this.previewGraphics.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // Círculo de alcance
    if (isValid) {
      this.previewGraphics.fillStyle(color, 0.08);
      this.previewGraphics.fillCircle(center.x, center.y, range);

      this.previewGraphics.lineStyle(2, color, 0.6);
      this.previewGraphics.strokeCircle(center.x, center.y, range);
    }
  }

  public clearPreview() {
    this.previewGraphics.clear();
  }
}
