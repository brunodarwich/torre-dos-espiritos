import Phaser from 'phaser';
import { gameConfig } from './config';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { MenuScene } from './scenes/MenuScene';
import { screenFlow } from './ui/ScreenFlow';

// Registra as cenas no motor
const config: Phaser.Types.Core.GameConfig = {
  ...gameConfig,
  scene: [BootScene, GameScene, MenuScene],
};

window.addEventListener('DOMContentLoaded', () => {
  let game: Phaser.Game | undefined;
  screenFlow.bind(() => {
    if (!game) game = new Phaser.Game(config);
    else {
      const active = game.scene.getScenes(true)[0];
      if (active?.scene.key === 'BootScene') active.scene.restart();
      else if (active) active.scene.start('BootScene');
      else game.scene.start('BootScene');
    }
  });
  const query = new URLSearchParams(location.search);
  if (import.meta.env.DEV && (query.get('qa') === '1' || query.get('artPreview') === '1')) {
    screenFlow.beginLoading();
    game = new Phaser.Game(config);
  } else screenFlow.showHome();

  const handleResize = () => {
    if (game?.scale) {
      game.scale.refresh();
    }
  };
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', () => {
    setTimeout(handleResize, 150);
  });
});
