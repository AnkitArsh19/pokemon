import Phaser from 'phaser';
import EventBus from '../EventBus';
import { INTERIOR_CONFIG } from '../../data/interiorConfig';

export default class InteriorScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InteriorScene' });
  }

  init(data) {
    this.interiorKey = data.interiorKey; // 'oak_lab' or 'red_house'
    this.houseId = data.houseId;         // 'house_1', 'house_2', etc.
    this.returnX = data.returnX;
    this.returnY = data.returnY;
    
    // Track if we are currently showing a dialogue/overlay
    this.isOverlayActive = false;
    this.isExiting = false; // Reset exit state on re-entry
  }

  create() {
    this.cameras.main.fadeIn(500);
    
    // Add the background image
    this.bg = this.add.image(0, 0, this.interiorKey).setOrigin(0, 0);

    // --- LOAD HARDCODED CONFIGURATION ---
    const customConfig = INTERIOR_CONFIG[this.interiorKey] || {};
    
    // Fallbacks if the user hasn't hardcoded them yet
    const proportion = this.bg.width / 250;
    const defaultScale = 1.5 * proportion;
    const defaultSpeed = 150 * proportion;
    const defaultBounds = { x: 0, y: 0, width: this.bg.width, height: this.bg.height };
    const defaultSpawn = { x: this.bg.width / 2, y: this.bg.height - (60 * proportion) };
    const defaultExitY = this.bg.height - (30 * proportion);
    
    // Apply configurations
    this.playerScale = customConfig.scale || defaultScale;
    this.playerSpeed = customConfig.speed || defaultSpeed;
    const bounds = customConfig.bounds || defaultBounds;
    const spawn = customConfig.spawn || defaultSpawn;
    this.spawnX = spawn.x;
    this.spawnY = spawn.y;
    this.exitY = customConfig.exitY || defaultExitY;
    const obstacles = customConfig.obstacles || [];
    const exitZone = customConfig.exitZone || null;

    // Calculate zoom to fit the entire map onto the screen (ignoring physics bounds)
    const zoomX = this.cameras.main.width / this.bg.width;
    const zoomY = this.cameras.main.height / this.bg.height;
    const zoom = Math.min(zoomX, zoomY) * 0.95; // 95% to leave a tiny margin
    
    this.cameras.main.setZoom(zoom);

    // Center the camera precisely on the middle of the full image
    this.cameras.main.centerOn(this.bg.width / 2, this.bg.height / 2);
    
    // Set physics bounds and ensure default collision state is solid on all sides
    this.physics.world.setBounds(bounds.x, bounds.y, bounds.width, bounds.height);
    this.physics.world.checkCollision.down = true;
    
    // Create player FIRST so colliders can reference it
    const gender = localStorage.getItem('playerGender') || 'boy';
    const spriteKey = gender === 'boy' ? 'player' : 'player_girl';
    
    this.player = this.physics.add.sprite(spawn.x, spawn.y, spriteKey, 0);
    this.player.setScale(this.playerScale);
    this.player.setCollideWorldBounds(true);
    
    // Face up when entering the room
    this.player.anims.play(spriteKey + '_up');

    // ALWAYS open the bottom world bound and create solid walls on either side of the 120px door at spawn.x
    this.physics.world.checkCollision.down = false;
    
    // Create physical walls at the bottom boundary, leaving a 120px gap at spawnX
    const bottomY = bounds.y + bounds.height;
    
    // Left wall (from left edge to spawnX - 60)
    const leftWidth = (this.spawnX - 60) - bounds.x;
    if (leftWidth > 0) {
      const leftZone = this.add.zone(bounds.x + (leftWidth / 2), bottomY, leftWidth, 50);
      this.physics.add.existing(leftZone, true);
      this.physics.add.collider(this.player, leftZone);
    }
    
    // Right wall (from spawnX + 60 to right edge)
    const rightStartX = this.spawnX + 60;
    const rightWidth = (bounds.x + bounds.width) - rightStartX;
    if (rightWidth > 0) {
      const rightZone = this.add.zone(rightStartX + (rightWidth / 2), bottomY, rightWidth, 50);
      this.physics.add.existing(rightZone, true);
      this.physics.add.collider(this.player, rightZone);
    }
    
    // Custom interior obstacles
    obstacles.forEach((obs) => {
      const obstacleZone = this.add.zone(obs.x, obs.y, obs.width, obs.height);
      this.physics.add.existing(obstacleZone, true); // true = static body
      this.physics.add.collider(this.player, obstacleZone);
    });
    
    // Setup controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      z: Phaser.Input.Keyboard.KeyCodes.Z
    });
    
    // Eventbus listeners for overlay close and teleports
    this.closeOverlayUnsub = EventBus.on('closePortfolioOverlay', () => {
      this.isOverlayActive = false;
    });
    
    this.teleportUnsub = EventBus.on('teleportToHouse', (data) => {
      if (this.houseId === data.houseId) return; // Already in this house
      this.scene.start('InteriorScene', { interiorKey: data.interiorKey, houseId: data.houseId, returnX: data.returnX, returnY: data.returnY });
    });

    // Handle click on screen for mobile menu trigger
    
    this.input.on('pointerdown', (pointer) => {

      
      // Also trigger the portfolio overlay (old mobile logic)
      this.triggerPortfolioOverlay();
    });

    // Automatically trigger dialogue after fade in
    this.cameras.main.once('camerafadeincomplete', () => {
      this.time.delayedCall(300, () => {
        this.triggerPortfolioOverlay(true);
      });
    });

    // Register cleanup
    this.events.once('shutdown', this.shutdown, this);
  }

  update(time, delta) {
    if (this.isOverlayActive) {
      this.player.setVelocity(0);
      return;
    }

    const speed = this.playerSpeed; // Dynamic speed based on map resolution
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play(this.player.texture.key + '_left', true);
      this.player.flipX = false;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play(this.player.texture.key + '_right', true);
      this.player.flipX = true;
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
      this.player.anims.play(this.player.texture.key + '_up', true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
      this.player.anims.play(this.player.texture.key + '_down', true);
    }

    if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
      this.player.anims.stop();
    }

    // Manual portfolio trigger (if close)
    if (Phaser.Input.Keyboard.JustDown(this.keys.enter) || Phaser.Input.Keyboard.JustDown(this.keys.space)) {
      this.triggerPortfolioOverlay();
    }

    // Check exit condition using 120px boundary around spawn point
    if (this.cursors.down.isDown && this.player.y > this.spawnY + 5) {
      if (Math.abs(this.player.x - this.spawnX) <= 60) {
        this.exitInterior();
      }
    }
  }

  triggerPortfolioOverlay(force = false) {
    if (this.isOverlayActive) return;
    
    // Only trigger if we moved up a bit from the entrance, unless forced
    if (!force && this.player.y >= this.spawnY - 20) return; 

    this.isOverlayActive = true;
    this.player.setVelocity(0);
    this.player.anims.stop();
    
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = isMobileDevice && ('ontouchstart' in window) && window.innerWidth < 1024;
    const promptText = isTouch ? "Press A button to read it." : "Press ENTER to read it.";

    // Show a dialogue box before opening the UI
    EventBus.emit('showDialogue', {
      dialogueKey: 'portfolio_intro_' + this.houseId,
      customText: ["Looks like there is some information here...", promptText]
    });
  }

  exitInterior() {
    if (this.isExiting) return;
    this.isExiting = true;
    
    this.cameras.main.fadeOut(300);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('WorldScene', { spawnX: this.returnX, spawnY: this.returnY + 1 });
    });
  }

  shutdown() {
    if (this.closeOverlayUnsub) this.closeOverlayUnsub();
    if (this.teleportUnsub) this.teleportUnsub();
  }
}
