import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import WorldScene from './scenes/WorldScene';

import InteriorScene from './scenes/InteriorScene';

/**
 * Create the Phaser 3 game configuration.
 * Follows pokevue's config: AUTO renderer, arcade physics, pixelArt.
 */
export function createGameConfig(parent) {
  return {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: parent,
      width: '100%',
      height: '100%',
    },
    title: 'DEVTOWN — Pokémon Portfolio',
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: { y: 0 },
      },
    },
    scene: [BootScene, WorldScene, InteriorScene],
  };
}
