import Phaser from 'phaser';

/**
 * BootScene — Loads all game assets (tileset, map JSON, spritesheets)
 * and shows a FireRed-style loading bar. Transitions to WorldScene.
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // ── Loading bar ──
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    this.add.rectangle(w / 2, h / 2, w, h, 0x000000);

    const loadText = this.add.text(w / 2, h / 2 - 20, 'Loading...', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '10px',
      color: '#ffffff',
    }).setOrigin(0.5);

    const barBg = this.add.rectangle(w / 2, h / 2 + 8, 160, 12, 0x333333).setOrigin(0.5);
    const barFill = this.add.rectangle(w / 2 - 78, h / 2 + 8, 0, 8, 0x4ade80).setOrigin(0, 0.5);

    this.load.on('progress', (value) => {
      barFill.width = 156 * value;
    });

    this.load.on('complete', () => {
      loadText.setText('READY!');
    });

    // ── Load tileset & map ──
    this.load.image('tiles', './assets/map/tileset.png');
    this.load.tilemapTiledJSON('map', './assets/map/town.json');

    // ── Load character spritesheets (18×22 px frames, same as pokevue) ──
    this.load.spritesheet('player', './assets/sprites/player.png', {
      frameWidth: 18,
      frameHeight: 22,
    });
    this.load.spritesheet('player_girl', './assets/sprites/player_girl.png', {
      frameWidth: 18,
      frameHeight: 22,
    });
    this.load.spritesheet('prof_chen', './assets/sprites/prof_chen.png', {
      frameWidth: 18,
      frameHeight: 22,
    });

    // ── Interior tileset ──
    this.load.image('oak_lab', './assets/map/Oak_lab.png');
    this.load.image('red_house', './assets/map/Red_house_ground_floor.png');
    this.load.image('interior_1', './assets/map/interior_1.png');
    this.load.image('interior_2', './assets/map/interior_2.png');
    this.load.image('interior_3', './assets/map/interior_3.png');
    this.load.image('interior_4', './assets/map/interior_4.png');
    this.load.image('interior_5', './assets/map/interior_5.png');
  }

  create() {
    this.scene.start('WorldScene');
  }
}
