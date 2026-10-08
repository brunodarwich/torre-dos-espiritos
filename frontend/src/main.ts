import Phaser from 'phaser';
import { gameConfig } from './config';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';

// Registra as cenas no motor
const config: Phaser.Types.Core.GameConfig = {
  ...gameConfig,
  scene: [BootScene, GameScene],
};

window.addEventListener('DOMContentLoaded', () => {
  new Phaser.Game(config);
});
