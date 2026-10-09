import { GAME_WIDTH, GAME_HEIGHT } from '../config';

export interface CanvasBoundingRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

/**
 * Converte coordenadas de tela/ponteiro (clientX, clientY) para o espaço de mundo do Phaser (1280x720).
 * Aplica tolerância configurável nas bordas e fixa as coordenadas estritamente nos limites visíveis,
 * garantindo que toques com offset de dedo no mobile nunca fiquem fora de alcance (ex: row 0 ou col 15).
 */
export function transformClientToWorld(
  clientX: number,
  clientY: number,
  rect: CanvasBoundingRect,
  gameWidth: number = GAME_WIDTH,
  gameHeight: number = GAME_HEIGHT,
  tolerance: number = 32
): { x: number; y: number } | null {
  if (rect.width <= 0 || rect.height <= 0) return null;

  // Se o ponto estiver absurdamente fora da área de jogo além da tolerância, ignora
  if (
    clientX < rect.left - tolerance ||
    clientX > rect.right + tolerance ||
    clientY < rect.top - tolerance ||
    clientY > rect.bottom + tolerance
  ) {
    return null;
  }

  // Limita as coordenadas estritamente dentro da área visível do canvas.
  // Subtrai uma fração infinitesimal para que a borda extrema (ex: col 15, row 8) nunca transborde para col 16/row 9
  const clampedX = Math.min(Math.max(clientX, rect.left), rect.right - 0.01);
  const clampedY = Math.min(Math.max(clientY, rect.top), rect.bottom - 0.01);
  const scaleX = gameWidth / rect.width;
  const scaleY = gameHeight / rect.height;

  return {
    x: (clampedX - rect.left) * scaleX,
    y: (clampedY - rect.top) * scaleY,
  };
}
