import Phaser from 'phaser';

const MOVE_TIMER = 3;

/**
 * MovableCharacter — Grid-based character movement system.
 * Ported from pokevue's MovableCharacter.js with exact same logic:
 * - 16px tile grid, speed=2, tile-by-tile stepping
 * - 4-direction animations: down(0-2), up(3-5), side(6-8)
 * - Collision via tilemap properties
 * - Click-to-move via tweens timeline
 */
export default class MovableCharacter extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture, 1);

    this.name = texture;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setSize(18, 22);
    this.setDisplayOrigin(9, 13);
    this.setCollideWorldBounds(true);

    this.isMoving = false;
    this.isMovingAutomatically = false;
    this.speed = 2;
    this.lastKey = null;
    this.steps = 0;
    this.faces = 'down';
    this.moveTimer = MOVE_TIMER;
    this.inputBlocked = false;

    this.cursors = this.scene.input.keyboard.createCursorKeys();

    // ── Animations (same frame layout as pokevue: 9 frames, 3 per direction) ──
    // Guard: only create if not already registered (prevents duplicate warnings)
    const anims = this.scene.anims;
    if (!anims.exists(this.name + '_left')) {
      anims.create({
        key: this.name + '_left',
        frames: anims.generateFrameNumbers(texture, { frames: [6, 7, 8, 7] }),
        frameRate: 10,
        repeat: -1,
      });
    }
    if (!anims.exists(this.name + '_right')) {
      anims.create({
        key: this.name + '_right',
        frames: anims.generateFrameNumbers(texture, { frames: [6, 7, 8, 7] }),
        frameRate: 10,
        repeat: -1,
      });
    }
    if (!anims.exists(this.name + '_up')) {
      anims.create({
        key: this.name + '_up',
        frames: anims.generateFrameNumbers(texture, { frames: [3, 4, 5, 4] }),
        frameRate: 10,
        repeat: -1,
      });
    }
    if (!anims.exists(this.name + '_down')) {
      anims.create({
        key: this.name + '_down',
        frames: anims.generateFrameNumbers(texture, { frames: [0, 1, 2, 1] }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }

  update() {
    if (this.inputBlocked) return;

    if (!this.isMovingAutomatically) {
      if (!this.isMoving) {
        if (this.cursors.left.isDown) {
          this.moveTo('left');
        } else if (this.cursors.right.isDown) {
          this.moveTo('right');
        } else if (this.cursors.up.isDown) {
          this.moveTo('up');
        } else if (this.cursors.down.isDown) {
          this.moveTo('down');
        } else {
          this.stopMoving();
        }
      } else {
        this.continueMoving();
      }
    }
  }

  moveTo(direction) {
    this.flipX = direction === 'right';
    this.anims.play(this.name + '_' + direction, true);
    if (this.canMoveTo(this.getNextPosition(direction).x, this.getNextPosition(direction).y)) {
      this.isMoving = true;
      this.lastKey = direction;
      this.move(this.lastKey);
    }
    this.faces = direction;
  }

  stopMoving() {
    this.anims.stop();
    this.setFrame(this.getIdleFrame());
    this.isMoving = false;
    this.lastKey = null;
    this.moveTimer = MOVE_TIMER;
  }

  continueMoving() {
    this.steps++;
    this.move(this.lastKey);
    if (this.steps === (16 / this.speed) - 1) {
      this.isMoving = false;
      this.steps = 0;
      this.moveTimer = MOVE_TIMER;
    }
  }

  getNextPosition(direction) {
    switch (direction) {
      case 'left':  return { x: this.x - 16, y: this.y };
      case 'right': return { x: this.x + 16, y: this.y };
      case 'up':    return { x: this.x, y: this.y - 16 };
      case 'down':  return { x: this.x, y: this.y + 16 };
      default:      return { x: this.x, y: this.y };
    }
  }

  move(direction) {
    switch (direction) {
      case 'left':  this.x -= this.speed; break;
      case 'right': this.x += this.speed; break;
      case 'up':    this.y -= this.speed; break;
      case 'down':  this.y += this.speed; break;
      default: break;
    }
  }

  canMoveTo(x, y) {
    if (this.moveTimer === 0 || this.lastKey != null) {
      this.moveTimer = MOVE_TIMER;
      const nextTile = this.scene.map.getTileAtWorldXY(x, y);
      return nextTile && !nextTile.collides && !nextTile.isOccupied;
    } else {
      this.moveTimer--;
    }
  }

  getIdleFrame() {
    switch (this.faces) {
      case 'left':
        this.flipX = false;
        return 7;
      case 'right':
        this.flipX = true;
        return 7;
      case 'up':
        return 4;
      default:
        return 1;
    }
  }

  isFullyOnTile() {
    return ((this.x - 8) % 16 === 0) && ((this.y - 8) % 16 === 0);
  }

  getNextTile() {
    switch (this.faces) {
      case 'left':  return this.scene.map.getTileAtWorldXY(this.x - 16, this.y);
      case 'right': return this.scene.map.getTileAtWorldXY(this.x + 16, this.y);
      case 'up':    return this.scene.map.getTileAtWorldXY(this.x, this.y - 16);
      case 'down':  return this.scene.map.getTileAtWorldXY(this.x, this.y + 16);
      default:      return null;
    }
  }

  moveAlongPath(path) {
    let tweens = [];
    this.timeline = null;
    let isPathBlocked = false;

    for (let i = 0; i < path.length - 1; i++) {
      const currentX = path[i].x;
      const currentY = path[i].y;
      const nextX = path[i + 1].x;
      const nextY = path[i + 1].y;

      if (this.scene.map.getTileAt(nextX, nextY).isOccupied) {
        isPathBlocked = true;
      }

      if (!isPathBlocked) {
        tweens.push({
          targets: this,
          x: { value: nextX * this.scene.map.tileWidth + 8, duration: 300 / this.speed },
          y: { value: nextY * this.scene.map.tileHeight + 8, duration: 300 / this.speed },
          onStart: () => {
            this.isMovingAutomatically = true;
            if (nextX < currentX && nextY === currentY) {
              this.flipX = false;
              this.anims.play(this.name + '_left', true);
              this.faces = 'left';
            } else if (nextX > currentX && nextY === currentY) {
              this.flipX = true;
              this.anims.play(this.name + '_right', true);
              this.faces = 'right';
            } else if (nextY < currentY && nextX === currentX) {
              this.anims.play(this.name + '_up', true);
              this.faces = 'up';
            } else if (nextY > currentY && nextX === currentX) {
              this.anims.play(this.name + '_down', true);
              this.faces = 'down';
            }
          },
          onComplete: () => {
            // End-of-path handling is done in playTween wrapper
          },
        });
      }
    }

    if (tweens.length === 0) return;

    // Use sequential tweens instead of chain() which is buggy in Phaser 3.80
    const playTween = (index) => {
      if (index >= tweens.length) return;
      const config = tweens[index];
      config.onComplete = (() => {
        const originalOnComplete = config.onComplete;
        return () => {
          if (originalOnComplete) originalOnComplete();
          if (index === tweens.length - 1) {
            this.isMovingAutomatically = false;
            this.anims.stop();
            this.setFrame(this.getIdleFrame());
          }
          playTween(index + 1);
        };
      })();
      this.timeline = this.scene.tweens.add(config);
    };

    playTween(0);
  }

  updateCaseOccupation() {
    const currentTile = this.scene.map.getTileAtWorldXY(this.x, this.y);
    if (currentTile) {
      currentTile.isOccupied = true;
      currentTile.isOccupiedBy = this;
    }

    // Clear adjacent tiles
    const adjacent = [
      { x: this.x - 16, y: this.y },
      { x: this.x + 16, y: this.y },
      { x: this.x, y: this.y - 16 },
      { x: this.x, y: this.y + 16 },
    ];

    adjacent.forEach(pos => {
      const tile = this.scene.map.getTileAtWorldXY(pos.x, pos.y);
      if (tile && tile.isOccupiedBy === this) {
        // Don't clear if we're still on it
      } else if (tile) {
        // Only clear if it was occupied by this character
        if (tile.isOccupiedBy === this) {
          tile.isOccupied = false;
          delete tile.isOccupiedBy;
        }
      }
    });
  }
}
