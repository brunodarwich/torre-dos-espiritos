import Phaser from 'phaser';
import { screenAssets, screenFlow } from '../ui/ScreenFlow';

export class BootScene extends Phaser.Scene {
  private loadFailed = false;
  private pendingFiles = new Set<string>();
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    this.loadFailed = false;
    this.pendingFiles.clear();
    const progress = (value: number) => screenFlow.updateProgress(value);
    const failed = () => { this.loadFailed = true; };
    const added = (key: string, type: string) => this.pendingFiles.add(`${type}:${key}`);
    const completed = (key: string, type: string) => this.pendingFiles.delete(`${type}:${key}`);
    this.load.on('progress', progress);
    this.load.on('loaderror', failed);
    this.load.on('addfile', added);
    this.load.on('filecomplete', completed);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.load.off('progress', progress);
      this.load.off('loaderror', failed);
      this.load.off('addfile', added);
      this.load.off('filecomplete', completed);
    });
    // Load result art before entering play; the browser also caches it for DOM cards.
    for (const [key, path] of Object.entries(screenAssets)) this.load.image(`screen_${key}`, path);
    const root = 'assets/astral/';
    for (const id of ['mentor', 'benzedeira', 'paje']) {
      for (const level of [1, 2, 3]) {
        const key = `${id}_lvl${level}`;
        this.load.image(key, `${root}${key}.png`);
      }
    }
    for (const key of ['spirit_larva', 'spirit_zombeteiro', 'spirit_obsessor', 'spirit_sombra',
      'spirit_boss', 'spirit_boss_phase2', 'spirit_redeemed', 'portal', 'dream_core',
      'floor', 'path_straight', 'path_corner', 'path_terminal']) {
      this.load.image(key, `${root}${key}.png`);
    }
    this.load.image('cosmos', `${root}cosmos.webp`);
    this.load.json('environment_manifest', `${root}environment_manifest.json`);
  }

  create() {
    // Phaser's loaderror covers HTTP failures, but not all image/JSON decode failures.
    // Every newly queued file must have completed processing before entering the game.
    if (this.loadFailed || this.pendingFiles.size > 0) { screenFlow.failLoading(); return; }
    const enter = () => this.scene.start('GameScene');
    const query = new URLSearchParams(location.search);
    if (import.meta.env.DEV && (query.get('qa') === '1' || query.get('artPreview') === '1')) {
      screenFlow.showGame();
      enter();
    } else screenFlow.ready(enter);
  }
}
