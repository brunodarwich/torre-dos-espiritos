import Phaser from 'phaser';
import { screenFlow } from '../ui/ScreenFlow';

export class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }
  create() { screenFlow.showHome(); }
}
