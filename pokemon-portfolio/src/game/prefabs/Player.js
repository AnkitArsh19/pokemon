import MovableCharacter from './MovableCharacter';
import EventBus from '../EventBus';
import gameState from '../../data/gameState';

/**
 * Player — Extends MovableCharacter with interaction handling.
 * Supports male/female character selection via gameState.gender.
 */
export default class Player extends MovableCharacter {
  constructor(scene, x, y) {
    // Use gender-based sprite: 'player' for male, 'player_girl' for female
    const texture = gameState.gender === 'female' ? 'player_girl' : 'player';
    super(scene, x, y, texture);
  }

  update(args) {
    this.scene.cameras.main.startFollow(this);
    super.update(args);
  }

  handleAction() {
    if (this.inputBlocked) return;
    
    const nextTile = this.getNextTile();
    if (!nextTile) return;

    if (nextTile.isOccupied && nextTile.isOccupiedBy) {
      // NPC turns to face the player
      const npc = nextTile.isOccupiedBy;
      const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' };
      if (npc.moveTo) {
        npc.moveTo(opposite[this.faces]);
        npc.stopMoving();
      }

      // Emit dialogue event via React EventBus
      EventBus.emit('showDialogue', {
        dialogueKey: npc.dialogueKey || 'default',
        npcName: npc.npcDisplayName || npc.name,
      });
    }

    // Check for sign/point of interest on the next tile
    if (nextTile.collides) {
      const poi = this.scene.getPointOfInterest(nextTile, this.faces);
      if (poi) {
        if (Array.isArray(poi)) {
          EventBus.emit('showDialogue', {
            dialogueKey: 'sign',
            customText: poi,
          });
        } else {
          // Strip HTML tags and convert French text to English-friendly format
          const cleanText = poi
            .replace(/<strong>/g, '')
            .replace(/<\/strong>/g, '')
            .replace(/<br>/g, ' ')
            .replace(/\\n/g, '\n')
            .replace(/<[^>]+>/g, '');
          EventBus.emit('showDialogue', {
            dialogueKey: 'sign',
            customText: [cleanText],
          });
        }
      }
    }
  }
}
