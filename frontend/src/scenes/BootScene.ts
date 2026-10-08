import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Cenário Astral
    this.load.image('map_bedroom', 'assets/environment/bedroom_astral_map.jpg');

    // Guias
    this.load.image('mentor_lvl1', 'assets/guides/mentor_lvl1.jpg');
    this.load.image('mentor_lvl3', 'assets/guides/mentor_lvl3.jpg');
    this.load.image('benzedeira_lvl1', 'assets/guides/benzedeira_lvl1.jpg');
    this.load.image('benzedeira_lvl3', 'assets/guides/benzedeira_lvl3.jpg');
    this.load.image('paje_lvl1', 'assets/guides/paje_lvl1.jpg');
    this.load.image('paje_lvl3', 'assets/guides/paje_lvl3.jpg');

    // Espíritos
    this.load.image('spirit_larva', 'assets/spirits/larva_astral.jpg');
    this.load.image('spirit_obsessor', 'assets/spirits/obsessor_spirit.jpg');
    this.load.image('spirit_boss', 'assets/spirits/boss_obsessor_mor.jpg');
    this.load.image('spirit_redeemed', 'assets/spirits/redeemed_spirit.jpg');

    // UI
    this.load.image('victory_banner', 'assets/ui/victory_banner.jpg');
  }

  create() {
    this.scene.start('GameScene');
  }
}
